import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from "@angular/core";
import { LatLng } from "src/app/models/LatLng";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import { greatCircle, distance } from "@turf/turf";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import Layer from "ol/layer/Layer";
import { useGeographic } from "ol/proj";
import { Extent } from "ol/extent";
import { Feature } from "ol";
import Style, { StyleLike } from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import { LineString, Point } from "ol/geom";
import Icon from "ol/style/Icon";

@Component({
	selector: "pph-activation-path-map",
	templateUrl: "./activation-path-map.component.html",
	styleUrls: ["./activation-path-map.component.scss"],
	standalone: true,
})
export class ActivationPathMapComponent implements OnInit, AfterViewInit {
	private _latLngStart: LatLng = new LatLng(0, 0);
	private _latLngEnd: LatLng = new LatLng(0, 0);
	private _pathLayer?: Layer;

	@Input() public set latLngStart(latLng: LatLng) {
		this._latLngStart = latLng;
		this.setPath();
	}

	@Input() public set latLngEnd(latLng: LatLng) {
		this._latLngEnd = latLng;
		this.setPath();
	}

	@Input() public padding: number = 50;
	@Input() public pathColour: string = "#fb8500";
	@Input() public pathWidth: number = 1;

	@ViewChild("map") public mapEl!: ElementRef<HTMLElement>;

	private _map!: Map;

	public constructor() {
		useGeographic();
		this._map = this.buildMap();
	}

	public ngOnInit(): void {
		if (!this._latLngStart) {
			throw new Error(
				"latLngStart input missing for ActivationPathMapComponent"
			);
		}

		if (!this._latLngEnd) {
			throw new Error(
				"latLngStart input missing for ActivationPathMapComponent"
			);
		}
	}

	public ngAfterViewInit(): void {
		this._map.setTarget(this.mapEl.nativeElement);
		this.setPath();
	}

	private setPath(): void {
		if (this._latLngStart.lat === 0 || this._latLngStart.lng === 0) return;

		if (this._pathLayer === undefined) {
			this._pathLayer = new VectorLayer({
				style: ((feature: Feature) =>
					this.lineRenderer(feature)) as unknown as StyleLike,
				declutter: true,
			});
			this._map.addLayer(this._pathLayer);
		}

		const start = this._latLngStart.toArray().reverse();
		const end = this._latLngEnd.toArray().reverse();
		const dist = distance(start, end, { units: "kilometers" });
		const distFormatted = Math.floor(dist).toLocaleString();

		const path = greatCircle(start, end, {
			npoints: 100,
			properties: {
				name: `${distFormatted} km`,
			},
		});

		const lineSource = new VectorSource({
			features: [new GeoJSON().readFeature(path)],
		});

		this._pathLayer.setSource(lineSource);

		const extent = lineSource.getExtent() as Extent;
		if (!extent.includes(Infinity)) {
			this._map.getView().fit(extent, {
				padding: [this.padding, this.padding, this.padding, this.padding],
			});
		}
	}

	private lineRenderer(feature: Feature): Style[] {
		const svgCircle = `<svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="10" style="fill: %23ffffff; stroke: ${this.pathColour.replace(
			"#",
			"%23"
		)}; stroke-width: 2;" />
		</svg>`;

		const label = new Text({
			text: feature.get("name"),
			font: "1em sans-serif",
			fill: new Fill({ color: "#444444" }),
			stroke: new Stroke({ color: "#ffffff", width: 1 }),
			placement: "line",
			overflow: true,
		});

		const style = new Style({
			stroke: new Stroke({
				color: this.pathColour,
				width: this.pathWidth,
			}),
			text: label,
		});

		const styleList = [style];

		const geometry = feature.getGeometry() as LineString;
		const ends = [geometry.getFirstCoordinate(), geometry.getLastCoordinate()];

		ends.map((v) => {
			const style = new Style({
				geometry: new Point(v),
				image: new Icon({
					src: "data:image/svg+xml;utf8," + svgCircle,
					scale: 0.5,
				}),
			});

			styleList.push(style);
		});

		return styleList;
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

		return map;
	}
}
