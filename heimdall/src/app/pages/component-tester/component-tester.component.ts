import { Component } from "@angular/core";
import { ActivationPathMapComponent } from "src/app/components/activation-path-map/activation-path-map.component";
import { LatLng } from "src/app/models/LatLng";

@Component({
	selector: "pph-component-tester",
	templateUrl: "./component-tester.component.html",
	styleUrls: ["./component-tester.component.scss"],
	imports: [ActivationPathMapComponent],
	standalone: true,
})
export class ComponentTesterComponent {
	public latLngStart = new LatLng(-42.8826, 147.3257);
	public latLngEnd = new LatLng(-27.5598, 151.9507);

	public expand: boolean = false;
}
