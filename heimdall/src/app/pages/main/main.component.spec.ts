import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MainComponent } from "./main.component";
import { BehaviorSubject, Subject } from "rxjs";
import { HubUser } from "src/app/services/HeimdallSignalRService";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";

const rtsMock = {
	currentClientCount: new BehaviorSubject<number>(1),
	connectionStateChanged: new BehaviorSubject<boolean>(true),
	connectionAdded: new Subject<HubUser>(),
	connectionRemoved: new Subject<HubUser>(),
};

describe("MainComponent", () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, MainComponent],
			providers: [{ provide: RealTimeUserService, useValue: rtsMock }],
		}).compileComponents();
	});

	it("should create the app", () => {
		const fixture = TestBed.createComponent(MainComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
