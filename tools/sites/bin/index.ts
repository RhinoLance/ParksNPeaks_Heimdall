#! /usr/bin/env node 
import { writeFileSync } from 'fs';
import { VKFFSiteGenerator } from '../models/VKFFSiteGenerator';

const outputPath = "data/sites.json";

console.log("Retrieving current site list from WWFF...");

const siteGen = new VKFFSiteGenerator();
const wwffList = await siteGen.downloadSites();

console.log(`${wwffList.length} sites retrieved.`);

writeFileSync( outputPath, JSON.stringify( wwffList, null, "\t"), {
	encoding: "utf8",
	flag: "w",
	mode: 0o666
  });

console.log(`Sites written to ${outputPath}.`);