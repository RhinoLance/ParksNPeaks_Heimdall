import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { NgIf } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	standalone: true,
	imports: [RouterOutlet, NgIf, RaysDirective],
})
export class MainComponent {
	public viewModel: ViewState = {
		version: packageJson.version,
	};
}

type ViewState = {
	version: string;
};
