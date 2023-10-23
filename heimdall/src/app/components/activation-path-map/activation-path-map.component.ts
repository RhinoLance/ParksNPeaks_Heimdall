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
import { greatCircle, distance, getCoord, along } from "@turf/turf";
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
				style: ((feature: Feature, resolution: number) =>
					this.lineRenderer(feature, resolution)) as unknown as StyleLike,
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
				label: `${distFormatted} km`,
				length: dist,
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

	private lineRenderer(feature: Feature, resolution: number): Style[] {
		const svgCircle = `<svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="10" style="fill: %23ffffff; stroke: ${this.pathColour.replace(
			"#",
			"%23"
		)}; stroke-width: 2;" />
		</svg>`;

		const label = new Text({
			text: feature.get("label"),
			font: "1em sans-serif",
			fill: new Fill({ color: "#444444" }),
			stroke: new Stroke({ color: "#ffffff", width: 1 }),
			placement: "line",
			overflow: true,
		});

		const lineStyle = new Style({
			stroke: new Stroke({
				color: this.pathColour,
				width: this.pathWidth,
			}),
		});

		const geometry = feature.getGeometry() as LineString;
		const ends = [geometry.getFirstCoordinate(), geometry.getLastCoordinate()];

		const labelStyle = new Style({
			text: label,
			geometry: this.getLabelGeometry(feature, resolution),
		});

		const styleList = [lineStyle, labelStyle];

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

	/*
	 * OpenLayers has issues with labels that follow curved lines.  This function
	 * creates a straight line between two points on the curved line against which
	 * the label can be rendered.
	 */
	private getLabelGeometry(feature: Feature, resolution: number): LineString {
		const length = parseFloat(feature.get("length"));
		const geometry = feature.getGeometry() as LineString;
		const geoJsonGeometry = {
			coordinates: geometry.getCoordinates(),
		} as GeoJSON.LineString;

		const lineLenPixels = (length * 1000) / resolution;
		const textLenPixels = 60;
		const nDiv = Math.trunc(lineLenPixels / textLenPixels / 2) * 2 + 1;
		const nDiv1 = (nDiv - 1) / 2;
		const nDiv2 = nDiv1 + 1;

		const pointCoord1 = getCoord(
			along(geoJsonGeometry, (length / nDiv) * nDiv1)
		);
		const pointCoord2 = getCoord(
			along(geoJsonGeometry, (length / nDiv) * nDiv2)
		);

		return new LineString([pointCoord1, pointCoord2]);
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
