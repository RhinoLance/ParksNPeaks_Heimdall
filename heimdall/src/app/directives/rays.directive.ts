import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
	selector: "[pphRays]",
	//templateUrl: './rays.component.html',
	//styleUrls: ['./rays.component.scss'],
	standalone: true,
})
export class RaysDirective implements OnInit {
	@Input() public pphRays: string = "#ffffff";

	public constructor(private _el: ElementRef, private _renderer: Renderer2) {}

	public ngOnInit() {
		//this.el.nativeElement.innerHTML += this.GenerateLightElements();
		this._el.nativeElement.innerHTML += this.GenerateStyles();

		this.AddLights(this._el, this._renderer);
	}

	private AddLights(el: ElementRef, renderer: Renderer2) {
		const lightAnimations: LightAnimation[] = [
			{ duration: 4, scale: 1, left: 50 },
			{ duration: 7, scale: 0.6, left: 58 },
			{ duration: 2.5, scale: 0.5, left: 35 },
			{ duration: 4.5, scale: 1.2, left: 16 },
			{ duration: 8, scale: 0.3, left: 43 },
			{ duration: 3, scale: 0.8, left: 12 },
			{ duration: 5.3, scale: 0.2, left: 25 },
			{ duration: 4.7, scale: 1.1, left: 82 },
			{ duration: 4.1, scale: 0.9, left: 92 },
		];

		const styles: CssStyle[] = [
			{ style: "position", value: "absolute" },
			{ style: "width", value: "0px" },
			{ style: "background-color", value: "white" },
			{ style: "box-shadow", value: `${this.pphRays} 0px 0px 20px 2px` },
			{ style: "bottom", value: "0px" },
			{ style: "top", value: "0px" },
			{ style: "left", value: "0px" },
			{ style: "right", value: "0px" },
			{ style: "margin", value: "0px" },
		];

		lightAnimations.map((v) => {
			const div = renderer.createElement("div");

			styles.map((style) => {
				renderer.setStyle(div, style.style, style.value);
			});

			renderer.setStyle(
				div,
				"animation",
				`floatDown ${v.duration}s infinite linear`
			);
			renderer.setStyle(div, "transform", `scale(${v.scale})`);
			renderer.setStyle(div, "left", `${v.left}%`);

			renderer.appendChild(el.nativeElement, div);
		});
	}

	private GenerateStyles() {
		let output = "<style>";

		output += `
		
		@keyframes floatDown{
			0%{bottom: 100vh; opacity: 0;}
			25%{opacity: 1;}
			50%{bottom: 0vh; opacity: .8;}
			75%{opacity: 1;}
			100%{bottom: -100vh; opacity: 0;}
		}`;

		output += "</style>";

		return output;
	}
}

type LightAnimation = {
	duration: number;
	scale: number;
	left: number;
};

type CssStyle = {
	style: string;
	value: string;
};
