#! /usr/bin/env node 
import { writeFileSync } from 'fs';
import { VKFFSiteGenerator } from '../models/VKFFSiteGenerator';
import { environment } from 'environment';
import { VKFFSiteRef } from 'models/Types';

const outputPath = environment.wwffSitesPath;

console.log("Retrieving current site list from WWFF...");

const siteGen = new VKFFSiteGenerator();
const wwffList = await siteGen.downloadSites();

console.log(`${wwffList.length} sites retrieved.`);

writeFileSync( outputPath, stringifySiteList( wwffList), {
	encoding: "utf8",
	flag: "w",
	mode: 0o666
  });

console.log(`Sites written to ${outputPath}.`);

function stringifySiteList( siteList: VKFFSiteRef[] ): string {

	let sorted = [...siteList].sort( (a,b) => a.VKFFId < b.VKFFId ? -1 : 1 );

	const output = [
		"[",
		...sorted.slice(0,-1).map( v => `\t${JSON.stringify(v)},` ),
		...sorted.slice(-1).map( v => `\t${JSON.stringify(v)}` ),
		"]"
	];

	return output.join("\n");

}