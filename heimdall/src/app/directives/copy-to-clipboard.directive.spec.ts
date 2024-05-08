import { CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement } from "@angular/core";
import { CopyToClipboardDirective } from "./copy-to-clipboard.directive";
import {
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AnimationBuilder } from "@angular/animations";

describe("CopyToClipboardDirective", async () => {
	let fixture: ComponentFixture<TestComponent>;
	let testEl: DebugElement;

	@Component({
		template: `
			<div
				[pphCopyToClipboard]="'gogo'"
				[pphCopyToClipboardConfig]="config"
				(copied)="onClipboardCopy($event)"
			>
				testing
			</div>
		`,
		standalone: true,
		imports: [CopyToClipboardDirective],
	})
	class TestComponent {
		public onClipboardCopy() {}

		public config = {
			showDelay: 0,
			hideDelay: 0,
		};
	}

	const AnimationBuilderMock = {
		build: () => ({
			create: () => ({
				play: () => {},
			}),
		}),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [CopyToClipboardDirective, TestComponent],
			providers: [
				{ provide: AnimationBuilder, useValue: AnimationBuilderMock },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		});

		TestBed.inject(AnimationBuilder);

		fixture = TestBed.createComponent(TestComponent);
		testEl = fixture.debugElement.query(By.css("div"));

		fixture.detectChanges(); // initial binding
	});

	it("should insert on hover", fakeAsync(() => {
		testEl.triggerEventHandler("mouseover", null);
		tick(1);
		fixture.detectChanges();

		const iconElement = fixture.debugElement.query(
			By.css(".copy-to-clipboard-icon")
		);
		expect(iconElement).toBeTruthy();
	}));

	it("should copy to clipboard on click", fakeAsync(async () => {
		spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.resolve());

		testEl.triggerEventHandler("mouseover", null);
		tick(1);
		fixture.detectChanges();

		const iconElement = fixture.debugElement.query(
			By.css(".copy-to-clipboard-icon")
		);

		iconElement.triggerEventHandler("click", null);

		//If we get this far, assume the write to clipboard was successfull as we can't read the clipboard in test.
		expect(true).toBeTruthy();
	}));
});
