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

/*
Duplicate ZLOTA refs in same spot should be merged into one spot with multiple awards

[{"id":15949,"comments":"Activating now.  Will be a short one","referenced_time":"2026-05-30T03:22:34.155Z","name":"Maungarei / Mount Wellington [ZLP/AK-0678] {RF73kc}; Maungarei / Mount Wellington [ZLV/AK-005] {RF73kc}","reference":"ZLP/AK-0678","frequency":"7095.0","mode":"SSB","activator":"ZL1JDR","spotter":"ZL1JDR"},{"id":15949,"comments":"Activating now.  Will be a short one","referenced_time":"2026-05-30T03:22:34.155Z","name":"Maungarei / Mount Wellington [ZLP/AK-0678] {RF73kc}; Maungarei / Mount Wellington [ZLV/AK-005] {RF73kc}","reference":"ZLV/AK-005","frequency":"7095.0","mode":"SSB","activator":"ZL1JDR","spotter":"ZL1JDR"},{"id":15950,"comments":"","referenced_time":"2026-05-30T03:36:25.796Z","name":"Maungarei / Mount Wellington [ZLP/AK-0678] {RF73kc}; Maungarei / Mount Wellington [ZLV/AK-005] {RF73kc}","reference":"ZLP/AK-0678","frequency":"7095.0","mode":"SSB","activator":"ZL1JDR","spotter":"ZL2BB"},{"id":15950,"comments":"","referenced_time":"2026-05-30T03:36:25.796Z","name":"Maungarei / Mount Wellington [ZLP/AK-0678] {RF73kc}; Maungarei / Mount Wellington [ZLV/AK-005] {RF73kc}","reference":"ZLV/AK-005","frequency":"7095.0","mode":"SSB","activator":"ZL1JDR","spotter":"ZL2BB"}]

*/
