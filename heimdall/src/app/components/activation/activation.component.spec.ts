import {
	ComponentFixture,
	TestBed,
	discardPeriodicTasks,
	fakeAsync,
	tick,
} from "@angular/core/testing";

import { ActivationComponent, ElapsedTimeState } from "./activation.component";
import { Spot } from "src/app/models/Spot";
import { Activation, HideState } from "src/app/models/Activation";
import { TimeagoModule } from "ngx-timeago";
import { importProvidersFrom } from "@angular/core";
import { SpotMode } from "src/app/models/SpotMode";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RespotComponent } from "../respot/respot.component";
import { ReplaySubject } from "rxjs";
import { PnPClientService } from "src/app/services/PNPHttpClient.service";
import { AppRouter, RoutePath } from "src/app/services/AppRountingService";
import { Router } from "@angular/router";

describe("ActivationComponent", () => {
	let component: ActivationComponent;
	let fixture: ComponentFixture<ActivationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ActivationComponent, RespotComponent],
			providers: [
				importProvidersFrom(TimeagoModule.forRoot()),
				provideAnimations(),
			],
		}).compileComponents();
	});

	describe("Routing", () => {
		const AppRouterMock = {
			navigate(route: RoutePath): void {
				expect(route).toBeTruthy();
			},
		};

		let fixture: ComponentFixture<ActivationComponent>;
		let component: ActivationComponent;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ActivationComponent, RespotComponent],
				providers: [
					importProvidersFrom(TimeagoModule.forRoot()),
					provideAnimations(),
					{ provide: AppRouter, useValue: AppRouterMock },
				],
			}).compileComponents();

			fixture = TestBed.createComponent(ActivationComponent);
			component = fixture.componentInstance;
		});

		it("should route to settings", fakeAsync(() => {
			// Arrange
			const router = TestBed.inject(Router);
			router.initialNavigation();

			let result: RoutePath = RoutePath.Root;
			spyOn(AppRouterMock, "navigate").and.callFake((route: RoutePath) => {
				result = route;
			});

			// Act
			component.openSettings();
			tick();

			// Assert
			expect(result).toBe(RoutePath.Settings);
		}));
	});

	describe("General", () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(ActivationComponent);
			component = fixture.componentInstance;
		});

		it("should create", () => {
			expect(component).toBeTruthy();
		});

		it("should change mode label", () => {
			// Arrange
			const spot1 = new Spot();
			spot1.mode = SpotMode.SSB;
			spot1.frequency = 7.144;
			spot1.time = new Date("2021-01-01T12:00:00Z");

			const spot2 = new Spot();
			spot2.mode = SpotMode.CW;
			spot2.frequency = 7.032;
			spot2.time = new Date("2021-01-01T12:10:00Z");

			component.activation = new Activation(spot1);

			// Act
			component.activation.addSpot(spot2);
			fixture.detectChanges();

			// Assert
			const compiled = fixture.nativeElement;
			expect(compiled.querySelector(".mode").textContent).toContain("CW");
		});

		it("should change freq label", () => {
			// Arrange
			const spot1 = new Spot();
			spot1.mode = SpotMode.SSB;
			spot1.frequency = 7.144;
			spot1.time = new Date("2021-01-01T12:00:00Z");

			const spot2 = new Spot();
			spot2.mode = SpotMode.CW;
			spot2.frequency = 7.032;
			spot2.time = new Date("2021-01-01T12:10:00Z");

			component.activation = new Activation(spot1);

			// Act
			component.activation.addSpot(spot2);
			fixture.detectChanges();

			// Assert
			const compiled = fixture.nativeElement;
			expect(compiled.querySelector(".frequency").textContent).toContain(
				"7.032"
			);
		});

		it("should change comment label", () => {
			// Arrange
			const spot1 = new Spot();
			spot1.mode = SpotMode.SSB;
			spot1.frequency = 7.144;
			spot1.comment = "first";
			spot1.time = new Date("2021-01-01T12:00:00Z");

			const spot2 = new Spot();
			spot2.mode = SpotMode.CW;
			spot2.frequency = 7.032;
			spot2.comment = "second";
			spot2.time = new Date("2021-01-01T12:10:00Z");

			component.activation = new Activation(spot1);

			// Act
			component.activation.addSpot(spot2);
			fixture.detectChanges();

			// Assert
			const compiled = fixture.nativeElement;
			expect(compiled.querySelector(".comment").textContent).toContain(
				"second"
			);
		});

		describe("callsign link", () => {
			it("callsign should link to QRZ page of callsign root.", () => {
				// Arrange
				const spot1 = new Spot();
				spot1.mode = SpotMode.SSB;
				spot1.frequency = 7.144;
				spot1.comment = "first";
				spot1.time = new Date("2021-01-01T12:00:00Z");
				spot1.callsign = "VK7ABC/P";
				spot1.callsignRoot = "VK7ABC";

				component.activation = new Activation(spot1);

				// Act
				fixture.detectChanges();

				// Assert
				const compiled = fixture.nativeElement;
				const element = compiled.querySelector(".activator-callsign");
				expect(element.getAttribute("href")).toBe("https://qrz.com/db/VK7ABC");
			});
		});

		describe("ngOnInit", () => {
			describe("respond to onUpdate events", () => {
				let activation: Activation;
				let spot1: Spot;
				let spot2: Spot;
				let subject: ReplaySubject<Spot>;

				beforeEach(() => {
					spot1 = new Spot();
					spot2 = new Spot();
					activation = new Activation(spot1);

					subject = new ReplaySubject<Spot>();
					activation.onUpdate = subject;

					component.activation = activation;
					fixture.detectChanges();
				});

				it("should update visibleState on mode change", () => {
					// Arrange
					spot1.mode = SpotMode.SSB;
					spot2.mode = SpotMode.CW;
					activation.visibleState = HideState.Spot;

					// Act
					subject.next(spot2);
					fixture.detectChanges();
					const result = activation.visibleState;

					// Assert
					expect<HideState>(result).toBe(HideState.Visible);
				});

				it("should update visibleState on band change", () => {
					// Arrange
					spot1.frequency = 7.144;
					spot2.frequency = 3.5;
					activation.visibleState = HideState.Spot;

					// Act
					subject.next(spot2);
					fixture.detectChanges();
					const result = activation.visibleState;

					// Assert
					expect<HideState>(result).toBe(HideState.Visible);
				});
			});
		});

		describe("should update visibleState on time change", () => {
			const states = [
				{ timeDiff: 14, expected: ElapsedTimeState.Active },
				{ timeDiff: 16, expected: ElapsedTimeState.Shoulder },
				{ timeDiff: 61, expected: ElapsedTimeState.Inactive },
			];

			states.forEach((state) => {
				it("should set elapsedTime state", fakeAsync(() => {
					// Arrange
					const spot1 = new Spot();
					spot1.time = new Date().subtractMinutes(state.timeDiff);
					const activation = new Activation(spot1);

					component.activation = activation;
					fixture.detectChanges();

					// Act
					component.ngOnInit();
					tick(1000);
					discardPeriodicTasks();
					fixture.detectChanges();

					// Assert
					expect<ElapsedTimeState>(component.viewState.elapsedTimeState).toBe(
						state.expected
					);
				}));
			});
		});

		describe("hideActivation", () => {
			let activation: Activation;

			beforeEach(() => {
				activation = new Activation(new Spot());
				component.activation = activation;
			});

			it("should update visibleState", () => {
				// Arrange
				activation.visibleState = HideState.Visible;

				// Act
				component.hideActivation(HideState.Spot);

				// Assert
				expect<HideState>(activation.visibleState).toBe(HideState.Spot);
			});

			it("should not update visibleState", () => {
				// Arrange
				activation.visibleState = HideState.Spot;

				// Act
				component.hideActivation(HideState.Visible);

				// Assert
				expect<HideState>(activation.visibleState).toBe(HideState.Spot);
			});
		});

		describe("showActivation", () => {
			let activation: Activation;

			beforeEach(() => {
				activation = new Activation(new Spot());
				component.activation = activation;
			});

			it("should update visibleState", () => {
				// Arrange
				activation.visibleState = HideState.Visible;

				// Act
				component.showActivation();

				// Assert
				expect<HideState>(activation.visibleState).toBe(HideState.Visible);
			});
		});

		describe("hideRespot", () => {
			let activation: Activation;

			beforeEach(() => {
				activation = new Activation(new Spot());
				component.activation = activation;
			});

			it("should update visibleState", () => {
				// Arrange
				component.viewState.respotIsVisible = true;

				// Act
				component.hideRespot();

				// Assert
				expect(component.viewState.respotIsVisible).toBeFalse();
			});
		});

		describe("onClipboardCopy", () => {
			let activation: Activation;
			let clipboardVal = "";

			beforeEach(() => {
				activation = new Activation(new Spot());
				component.activation = activation;

				spyOn(navigator.clipboard, "writeText").and.callFake((text: string) => {
					clipboardVal = text;
					return Promise.resolve();
				});
			});

			it("should write value", () => {
				// Arrange
				component.viewState.respotIsVisible = true;

				// Act
				component.onClipboardCopy("test");

				// Assert
				expect(clipboardVal).toBe("test");
			});

			it("should concat values within 5 seconds", fakeAsync(() => {
				// Arrange
				component.viewState.respotIsVisible = true;

				// Act
				component.onClipboardCopy("test");
				tick(1000);
				component.onClipboardCopy("two");
				discardPeriodicTasks();

				// Assert
				expect(clipboardVal).toBe("test two");
			}));

			it("should clear values after 5 seconds", fakeAsync(() => {
				// Arrange
				component.viewState.respotIsVisible = true;

				// Act
				component.onClipboardCopy("test");
				tick(6000);
				component.onClipboardCopy("two");
				discardPeriodicTasks();

				// Assert
				expect(clipboardVal).toBe("two");
			}));
		});
	});

	describe("showReSpot", () => {
		const userCreds = [
			{ hasApiKey: false, hasUserId: false, result: false },
			{ hasApiKey: true, hasUserId: false, result: false },
			{ hasApiKey: false, hasUserId: true, result: false },
			{ hasApiKey: true, hasUserId: true, result: true },
		];

		userCreds.forEach((creds) => {
			it("should handle user creds: " + JSON.stringify(creds), () => {
				// Arrange
				class PnPClientServiceMock extends PnPClientService {
					public override get hasApiKey(): boolean {
						return creds.hasApiKey;
					}
					public override get hasUserId(): boolean {
						return creds.hasUserId;
					}
				}

				TestBed.overrideComponent(ActivationComponent, {
					set: {
						providers: [
							{ provide: PnPClientService, useClass: PnPClientServiceMock },
						],
					},
				});

				const fixture = TestBed.createComponent(ActivationComponent);
				const component = fixture.componentInstance;

				const activation = new Activation(new Spot());
				component.activation = activation;
				component.viewState.respotIsVisible = false;

				activation.visibleState = HideState.Visible;

				// Act
				component.showReSpot();

				// Assert
				expect(component.viewState.respotIsVisible).toBe(creds.result);
			});
		});
	});

	describe("onRespotSent", () => {
		const options = [{ input: false }, { input: true }];

		let fixture: ComponentFixture<ActivationComponent>;
		let component: ActivationComponent;
		let activation: Activation;

		beforeEach(() => {
			fixture = TestBed.createComponent(ActivationComponent);
			component = fixture.componentInstance;

			activation = new Activation(new Spot());
			component.activation = activation;
		});

		options.forEach((v) => {
			it("should handle respotCallback: " + JSON.stringify(v), () => {
				// Arrange
				component.viewState.respotSuccess = !v.input;

				// Act
				component.onRespotSent(v.input);

				// Assert
				expect(component.viewState.respotSuccess).toBe(v.input);
			});
		});

		it("should set respotSuccess to undefined after 2 seconds", fakeAsync(() => {
			// Arrange
			component.viewState.respotSuccess = true;

			// Act
			component.onRespotSent(true);
			fixture.detectChanges();

			// Assert
			expect(component.viewState.respotSuccess).toBeTrue();

			// Act
			tick(2500);
			discardPeriodicTasks();
			fixture.detectChanges();

			// Assert
			expect(component.viewState.respotSuccess).toBeUndefined();
		}));
	});
});
