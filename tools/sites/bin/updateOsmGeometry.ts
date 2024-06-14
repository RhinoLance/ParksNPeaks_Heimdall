#! /usr/bin/env node 
import { environment } from 'environment';
import { readFileSync, writeFile } from 'fs';
import { Site } from 'models/Site';

import { VKFFSiteRef } from 'models/Types';
import { OSMDataService } from 'services/OSMDataService';

const wwffSitesPath = environment.wwffSitesPath;
const osmSitesPath = environment.osmSitesPath;

console.log("Retrieving current site list from WWFF...");

let wwffSiteList = readJsonFromFile<VKFFSiteRef>( wwffSitesPath );
let osmSiteList = loadOsmSites();

const addedCount = addMissingSitesToOsm( wwffSiteList, osmSiteList );
//osmSiteList = osmSiteList.slice(0,3);

console.log(`Added ${addedCount} new sites to OSM list.`);

const missingGeomCount = osmSiteList.filter( s => s.boundary.length == 0 ).length;

console.log(`${missingGeomCount} sites require geometry to be added.`);

await addOSMGeometry( osmSiteList );

logSitesMissingGeometry( osmSiteList );

function readJsonFromFile<T>(path: string): T[] {

	let json: T[];

	try{
		const rawData = readFileSync( path, { encoding: "utf8" } );
		json = JSON.parse( rawData );
	}catch(e){
		json = [] as T[];
		console.warn(`Failed to read ${path}.\n${e}`);
	}

	return json;

}

function loadOsmSites(): Site[] {
	const sites = readJsonFromFile<Site>( osmSitesPath );
	return sites;
}

function addMissingSitesToOsm( wwffSiteList: VKFFSiteRef[], osmSiteList: Site[]): number {
	
	let count = 0;

	wwffSiteList.forEach(v => {
	
		if( !osmSiteList.find( ov => v.VKFFId == ov.id ) ){
			osmSiteList.push( {id: v.VKFFId, name: v.name, osmId: -1, boundary: [], latLng: []} );
			count++;
		}
	
	});

	return count;
}

async function sleep(ms: number) {
	return new Promise(resolve => {
	  setTimeout(resolve, ms);
	});
  }

async function addOSMGeometry( osmSiteList: Site[] ): Promise<void> {

	const osmDataSvc = new OSMDataService();

	const saveOsmSites = () => writeFile( osmSitesPath, stringifySiteList( osmSiteList),()=>{});

	for( var cI=0; cI < osmSiteList.length; cI++ ){
		
		const site = osmSiteList[cI];
		
		if( site.boundary.length > 0 ){
			continue;
		}

		const siteDesc = `${site.id} - ${site.name}}`;
		console.log(`${cI+1}\tRetrieving geometry for "${siteDesc}" ...`);

		if( site.boundary.length == 0 ){
			try{
				const osmSite = await osmDataSvc.retrieveFeatureByName( site.name );
				site.boundary = osmSite.geojson.coordinates;
				site.latLng = [parseFloat(osmSite.lon),parseFloat(osmSite.lat)];
				site.osmId = osmSite.osm_id;
			}
			catch(e){
				console.error(`Failed to process site "${siteDesc}".\n${e}`);
			}
		}

		if( cI % 20 == 0 ){
			saveOsmSites();
		}

		//The osm api is rate limited, so we only get one per second.
		await sleep( 1000 );

	};

	saveOsmSites();

}

function logSitesMissingGeometry( osmSiteList: Site[] ): void {
	const missingGeom = osmSiteList.filter( s => s.boundary.length == 0 );

	if( missingGeom.length == 0 ){
		console.log("No sites missing geometry.");
		return;
	}

	console.log("Sites missing geometry:");
	for( const site of missingGeom ){
		console.log(`${site.id} - ${site.name}`);
	}
}

function stringifySiteList( siteList: Site[] ): string {

	let sorted = [...siteList].sort( (a,b) => a.id < b.id ? -1 : 1 );

	sorted.map(v=> {
		v.boundary = simplifyGeometry( v.boundary ) as number[];
		v.latLng = simplifyGeometry( v.latLng ) as number[];
	});
	

	const output = [
		"[",
		...sorted.slice(0,-1).map( v => `\t${JSON.stringify(v)},` ),
		...sorted.slice(-1).map( v => `\t${JSON.stringify(v)}` ),
		"]"
	];

	return output.join("\n");

}

function simplifyGeometry( geometry: number|number[]): unknown {

	if( typeof geometry == "number" ){
		return Math.round( geometry * 100000 ) / 100000;
	}
	else{
		return geometry.map( v => simplifyGeometry(v) );
	}
}

