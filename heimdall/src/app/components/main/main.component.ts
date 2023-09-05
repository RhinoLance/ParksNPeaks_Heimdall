import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	standalone: true,
	imports: [RouterOutlet],
})
export class MainComponent {
	public viewModel: ViewState = {
		version: packageJson.version,
	};
}

type ViewState = {
	version: string;
};
