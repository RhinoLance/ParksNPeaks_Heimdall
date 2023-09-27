import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MainComponent } from "./main.component";

describe("AppComponent", () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, MainComponent],
		}).compileComponents();
	});

	it("should create the app", () => {
		const fixture = TestBed.createComponent(MainComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
