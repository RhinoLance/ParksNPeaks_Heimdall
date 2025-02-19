import { FetchService, FetchServiceDeps } from "./FetchService";
import { Subject, from, of, throwError } from "rxjs";
import { Spot } from "../models/Spot";
import { SettingsKey, SettingsService } from "./SettingsService";
import { SiOtaClientService } from "./SiOtaHttpClient.service";
import { SiOtaSite } from "../models/SiOtaSite";

describe("SiOtaHttpClientService", () => {
	describe("SiOTA", () => {
		let settingsSvc: SettingsService;
		beforeEach(() => {
			settingsSvc = {
				getPnpUser: () => {
					return {
						apiKey: "1234567890",
						userName: "meuser",
						callsign: "VK0AA",
					};
				},
				settingUpdated: new Subject<SettingsKey>(),
			} as SettingsService;
		});

		fit("shouild get a site", async () => {
			// Arrange
			const fetch = new FetchService(new FetchServiceDeps());
			
			const svc = new SiOtaClientService(fetch);

			// Act
			const result = await svc.getSite(2030)
			.catch((e) => {
				console.log(e);	
				expect(e).toBeNull();
				return;
			});

			// Assert
			expect(result).not.toBeNull();
		});
	});

});