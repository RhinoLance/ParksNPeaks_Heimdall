import { Component } from "@angular/core";
import { RaysDirective } from "../../directives/rays.directive";

@Component({
	selector: "pph-no-spots",
	templateUrl: "./no-spots.component.html",
	styleUrls: ["./no-spots.component.scss"],
	standalone: true,
	imports: [RaysDirective],
})
export class NoSpotsComponent {}
