import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "pph-root",
	templateUrl: "./main.component.html",
	styleUrls: ["./main.component.scss"],
	standalone: true,
	imports: [RouterOutlet],
})
export class MainComponent {
	public title = "heimdall";
}
