import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import packageJson from "../../../../package.json";
import { timer } from "rxjs";
import { NgIf } from "@angular/common";
import { RaysDirective } from "../../directives/rays.directive";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	standalone: true,
	imports: [RouterOutlet, NgIf, RaysDirective],
})
export class MainComponent implements OnInit {
	public viewModel: ViewState = {
		version: packageJson.version,
		splashVisible: true,
	};

	public ngOnInit(): void {
		timer(1).subscribe((_) => {
			this.viewModel.splashVisible = false;
		});
	}
}

type ViewState = {
	version: string;
	splashVisible: boolean;
};
