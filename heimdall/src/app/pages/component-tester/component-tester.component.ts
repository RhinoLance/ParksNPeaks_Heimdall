import { Component } from "@angular/core";
import { CallsignNameComponent } from "src/app/components/callsign-name/callsign-name.component";

@Component({
	selector: "pph-component-tester",
	templateUrl: "./component-tester.component.html",
	styleUrls: ["./component-tester.component.scss"],
	imports: [CallsignNameComponent],
	standalone: true,
})
export class ComponentTesterComponent {
	public callsign = "VK7TEST";
}
