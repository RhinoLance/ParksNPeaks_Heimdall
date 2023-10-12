import { Component, Input, OnInit } from "@angular/core";
import { LatLng } from "src/app/models/LatLng";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import { greatCircle } from "@turf/turf";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import Layer from "ol/layer/Layer";
import { useGeographic } from "ol/proj";
import { Extent } from "ol/extent";

@Component({
	selector: "pph-activation-path-map",
	templateUrl: "./activation-path-map.component.html",
	styleUrls: ["./activation-path-map.component.scss"],
	standalone: true,
})
export class ActivationPathMapComponent implements OnInit {
	private _latLngStart: LatLng = new LatLng(0, 0);
	private _latLngEnd: LatLng = new LatLng(0, 0);
	private _pathLayer: Layer = new VectorLayer();

	@Input() public set latLngStart(latLng: LatLng) {
		this._latLngStart = latLng;
		this.updatePath();
	}

	@Input() public set latLngEnd(latLng: LatLng) {
		this._latLngEnd = latLng;
		this.updatePath();
	}

	@Input() public padding: number = 50;

	private _map!: Map;

	public constructor() {
		useGeographic();
		this._map = this.buildMap();
	}

	public ngOnInit(): void {
		if (!this._latLngStart)
			throw new Error(
				"latLngStart input missing for ActivationPathMapComponent"
			);

		if (!this._latLngEnd)
			throw new Error(
				"latLngStart input missing for ActivationPathMapComponent"
			);

		this._map.setTarget("map");
		this.updatePath();
	}

	private updatePath(): void {
		if (this._latLngStart.lat === 0 || this._latLngStart.lng === 0) return;

		const start = this._latLngStart.toArray().reverse();
		const end = this._latLngEnd.toArray().reverse();
		const path = greatCircle(start, end, { npoints: 100 });

		const source = new VectorSource({
			features: [new GeoJSON().readFeature(path)],
		});

		this._pathLayer.setSource(source);

		const extent = source.getExtent() as Extent;
		if (!extent.includes(Infinity)) {
			this._map.getView().fit(extent, {
				padding: [this.padding, this.padding, this.padding, this.padding],
			});
		}
	}

	private buildMap(): Map {
		const map = new Map({
			controls: [],
			layers: [
				new TileLayer({
					source: new XYZ({
						url: "https://cartodb-basemaps-c.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
					}),
				}),
			],
			view: new View({
				center: [146.3399, -41.0889],
				zoom: 2,
			}),
		});

		map.addLayer(this._pathLayer);

		return map;
	}
}
