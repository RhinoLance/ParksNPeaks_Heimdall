// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/testing";
import { getTestBed } from "@angular/core/testing";
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: {
	context(
		path: string,
		deep?: boolean,
		filter?: RegExp
	): {
		<T>(id: string): T;
		keys(): string[];
	};
};

//Dummy to stop lint errors as this is used outside of this file;
require;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting()
);
