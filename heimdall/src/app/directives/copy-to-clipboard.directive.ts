import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	Renderer2,
} from "@angular/core";
import { CssStyle } from "../models/CssStyle";
import {
	Subscription,
	finalize,
	fromEvent,
	take,
	takeUntil,
	tap,
	timer,
} from "rxjs";
import {
	AnimationBuilder,
	AnimationPlayer,
	animate,
	style,
} from "@angular/animations";

@Directive({
	selector: "[pphCopyToClipboard]",
	standalone: true,
})
export class CopyToClipboardDirective implements OnInit {
	@Input() public pphCopyToClipboard: string = "";
	@Input() public pphCopyToClipboardConfig: CopyToClipboardConfig = {
		showDelay: 100,
		hideDelay: 200,
		hangDelay: 2000,
	};

	@Output() public copied = new EventEmitter<string>();

	private _hostListenerRemover: () => void;
	private _iconListenerRemovers: (() => void)[] = [];
	private _iconElRemoveSub?: Subscription;
	private _iconElAddSub?: Subscription;
	private _clickAnimationPlayer?: AnimationPlayer;
	private _hangSub?: Subscription;

	private _hostElStyles: CssStyle[] = [];

	private _iconElStyles: CssStyle[] = [
		{ style: "display", value: "inline-block" },
		{ style: "position", value: "relative" },
		{ style: "top", value: "-10px" },
		{ style: "width", value: "1.2em" },
		{ style: "color", value: "#888888" },
		{ style: "_margin", value: "0 0 0 10px" },
		{ style: "cursor", value: "pointer" },
		{ style: "transition", value: "opacity 0.2s" },
	];

	private _iconElStylesVisible: CssStyle[] = [
		{ style: "visibility", value: "visible" },
		{ style: "opacity", value: "1" },
	];

	private _iconElStylesHidden: CssStyle[] = [
		{ style: "visibility", value: "hidden" },
		{ style: "opacity", value: "0" },
	];

	public constructor(
		private _el: ElementRef,
		private _renderer: Renderer2,
		private _animBuilder: AnimationBuilder
	) {}

	public ngOnInit() {
		this.applyStyles(this._el.nativeElement, this._hostElStyles);

		this.startListeningToHost();
	}

	private startListeningToHost() {
		this._hostListenerRemover = this._renderer.listen(
			this._el.nativeElement,
			"mouseenter",
			() => this.addIconEl()
		);
	}

	private copyToClipboard() {
		navigator.clipboard.writeText(this.pphCopyToClipboard);

		if (this.copied) {
			this.copied.emit(this.pphCopyToClipboard);

			if (this._clickAnimationPlayer) {
				this._clickAnimationPlayer.play();
			}
		}
	}

	private initIconEl(iconEl: HTMLElement) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="currentColor" d="M29.29 5H27v2h2v25H7V7h2V5H7a1.75 1.75 0 0 0-2 1.69v25.62A1.7 1.7 0 0 0 6.71 34h22.58A1.7 1.7 0 0 0 31 32.31V6.69A1.7 1.7 0 0 0 29.29 5Z" class="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M26 7.33A2.34 2.34 0 0 0 23.67 5h-1.8a4 4 0 0 0-7.75 0h-1.79A2.34 2.34 0 0 0 10 7.33V11h16ZM24 9H12V7.33a.33.33 0 0 1 .33-.33H16V6a2 2 0 0 1 4 0v1h3.67a.33.33 0 0 1 .33.33Z" class="clr-i-outline clr-i-outline-path-2"/><path fill="currentColor" d="M11 14h14v2H11z" class="clr-i-outline clr-i-outline-path-3"/><path fill="currentColor" d="M11 18h14v2H11z" class="clr-i-outline clr-i-outline-path-4"/><path fill="currentColor" d="M11 22h14v2H11z" class="clr-i-outline clr-i-outline-path-5"/><path fill="currentColor" d="M11 26h14v2H11z" class="clr-i-outline clr-i-outline-path-6"/><path fill="none" d="M0 0h36v36H0z"/></svg>`;

		this._renderer.addClass(iconEl, "copy-to-clipboard-icon");
		this._renderer.setAttribute(iconEl, "title", "Copy to clipboard");
		this._renderer.setProperty(iconEl, "innerHTML", svg);

		this.applyStyles(iconEl, [
			...this._iconElStyles,
			...this._iconElStylesHidden,
		]);

		this._iconListenerRemovers.push(
			this._renderer.listen(iconEl, "click", () => this.copyToClipboard()),
			this._renderer.listen(iconEl, "mouseleave", () =>
				this.mouseOutIcon(iconEl)
			)
		);

		this._clickAnimationPlayer = this.setCopyAnimation(iconEl);
	}

	private addIconEl() {
		if (this.cancelPendingRemoval()) {
			return;
		}

		this._hostListenerRemover();

		let iconEl: HTMLElement;

		this._iconElAddSub = timer(this.pphCopyToClipboardConfig.showDelay)
			.pipe(
				takeUntil(
					this.mouseLeaveObs(this._el.nativeElement).pipe(
						tap((_) => this.startListeningToHost())
					)
				)
			)
			.subscribe(() => {
				iconEl = this._renderer.createElement("div");
				this._renderer.appendChild(this._el.nativeElement, iconEl);
				this.initIconEl(iconEl);
				this.applyStyles(iconEl, this._iconElStylesVisible);
				this.initHangTimer(iconEl);
			});
	}

	private initHangTimer(iconEl: HTMLElement) {
		//If the mouse doesn't enter the icon within the hang delay, reset
		this._hangSub = timer(this.pphCopyToClipboardConfig.hangDelay)
			.pipe(takeUntil(this.mouseEnterObs(iconEl)))
			.subscribe(() => {
				if (iconEl === undefined) {
					return;
				}

				this._hangSub = undefined;
				this.removeIconEl(iconEl);
			});
	}

	private mouseEnterObs(iconEl: HTMLElement) {
		return fromEvent(iconEl, "mouseenter").pipe(take(1));
	}

	private mouseLeaveObs(iconEl: HTMLElement) {
		return fromEvent(iconEl, "mouseleave").pipe(take(1));
	}

	private removeIconEl(iconEl: HTMLElement) {
		this.cancelPendingRemoval();
		this.cancelPendingAdd();

		this._iconElRemoveSub = timer(this.pphCopyToClipboardConfig.hideDelay)
			.pipe(
				finalize(() => {
					this._iconElRemoveSub = undefined;
					this._iconListenerRemovers.forEach((remove) => remove());
				})
			)
			.subscribe(() => {
				this.applyStyles(iconEl, this._iconElStylesHidden);
				this._renderer.removeChild(this._el.nativeElement, iconEl);
				this.startListeningToHost();
			});
	}

	private cancelPendingRemoval(): boolean {
		if (this._iconElRemoveSub !== undefined) {
			this._iconElRemoveSub.unsubscribe();
			this._iconElRemoveSub = undefined;
			return true;
		}

		return false;
	}

	private cancelPendingAdd(): boolean {
		if (this._iconElAddSub !== undefined) {
			this._iconElAddSub.unsubscribe();
			this._iconElAddSub = undefined;
			return true;
		}

		return false;
	}

	private applyStyles(el: HTMLElement, styles: CssStyle[]) {
		styles.map((v) => {
			this._renderer.setStyle(el, v.style, v.value);
		});
	}

	private mouseOverIcon() {
		this.addIconEl();
	}

	private mouseOutIcon(iconEl: HTMLElement) {
		this.removeIconEl(iconEl);
	}

	private setCopyAnimation(iconEl: HTMLElement): AnimationPlayer {
		const factory = this._animBuilder.build([
			style({ color: "#ffffff" }),
			animate(500, style({ color: "#888888" })),
		]);

		const player = factory.create(iconEl);
		return player;
	}
}

export type CopyToClipboardConfig = {
	showDelay: number;
	hideDelay: number;
	hangDelay: number;
};
