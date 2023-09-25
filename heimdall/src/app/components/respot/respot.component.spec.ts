import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RespotComponent } from "./respot.component";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { Spot } from "src/app/models/Spot";
import { Observable, of } from "rxjs";

describe("RespotComponent", () => {
	let component: RespotComponent;
	let fixture: ComponentFixture<RespotComponent>;

	class MockPnpClientService {
		public getSpotList(): Promise<Spot[]> {
			return Promise.resolve([]);
		}

		public subscribeToSpots(): Observable<Spot[]> {
			return of([]);
		}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RespotComponent],
			providers: [
				{ provide: PnPClientService, useClass: MockPnpClientService },
			],
		});

		fixture = TestBed.createComponent(RespotComponent);
		component = fixture.componentInstance;
		component.spot = new Spot();
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
