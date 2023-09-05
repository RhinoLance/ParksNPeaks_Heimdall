import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SpotListComponent } from "./spot-list.component";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { Observable, of } from "rxjs";
import { Spot } from "src/app/models/Spot";

describe("SpotListComponent", () => {
	let component: SpotListComponent;
	let fixture: ComponentFixture<SpotListComponent>;

	class MockPnpClientService {
		public getSpotList(): Promise<Spot[]> {
			return Promise.resolve([]);
		}

		public subscribeToSpots(): Observable<Spot[]> {
			return of([]);
		}
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpotListComponent],
			providers: [
				SpotListComponent,
				{ provide: PnPClientService, useClass: MockPnpClientService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SpotListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
