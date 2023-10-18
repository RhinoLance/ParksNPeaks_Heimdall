import { Component, OnInit } from "@angular/core";
import { timer } from "rxjs";
import { ActivationPathMapComponent } from "src/app/components/activation-path-map/activation-path-map.component";
import { LatLng } from "src/app/models/LatLng";

@Component({
	selector: "pph-component-tester",
	templateUrl: "./component-tester.component.html",
	styleUrls: ["./component-tester.component.scss"],
	imports: [ActivationPathMapComponent],
	standalone: true,
})
export class ComponentTesterComponent implements OnInit {
	public latLngStart = new LatLng(-42.8826, 147.3257);
	public latLngEnd = new LatLng(-27.5598, 151.9507);

	public ngOnInit(): void {
		timer(5000).subscribe(() => {
			this.latLngEnd = new LatLng(50.1109, 8.6821);
		});
	}
}
