import { TestBed } from "@angular/core/testing";

import { SpotCatalogueService } from "./SpotCatalogue.service";

describe("SpotCatalogueServiceService", () => {
	let service: SpotCatalogueService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SpotCatalogueService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
