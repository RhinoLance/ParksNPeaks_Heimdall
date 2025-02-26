import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from "@angular/core";
import { LatLng } from "src/app/models/LatLng";
import { greatCircle, distance, along } from "@turf/turf";
import {
	MapLibreBuilder,
	defaultGlyfFonts,
} from "src/app/models/MapLibreBuilder";
import { LngLatBounds } from "maplibre-gl";
import { FeatureCollection, LineString, Point } from "geojson";

@Component({
	selector: "pph-activation-path-map",
	templateUrl: "./activation-path-map.component.html",
	styleUrls: [
		"./activation-path-map.component.scss",
		//"../../../../node_modules/maplibre-gl/dist/maplibre-gl.css",
	],
	standalone: true,
})
export class ActivationPathMapComponent implements OnInit, AfterViewInit {
	private _latLngStart: LatLng = new LatLng(0, 0);
	private _latLngEnd: LatLng = new LatLng(0, 0);

	@Input() public set latLngStart(latLng: LatLng) {
		this._latLngStart = latLng;
	}

	@Input() public set latLngEnd(latLng: LatLng) {
		this._latLngEnd = latLng;
	}

	@Input() public padding: number = 50;
	@Input() public pathColour: string = "#fb8500";
	@Input() public pathWidth: number = 1.5;

	@ViewChild("map") public mapEl!: ElementRef<HTMLElement>;

	private _map!: maplibregl.Map;

	public constructor() {}

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
		if (!this._latLngEnd || !this._latLngStart) {
			return;
		}

		this._map = this.initMap();
	}

	private buildPathData(): FeatureCollection<LineString> {
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

		const featureCollection = {
			type: "FeatureCollection",
			features: [path],
		};

		return featureCollection as FeatureCollection<LineString>;
	}

	private buildEndPointData(): FeatureCollection<Point> {
		const data = {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					properties: {
						label: "Start",
					},
					geometry: {
						type: "Point",
						coordinates: [this._latLngStart.lng, this._latLngStart.lat],
					},
				},
				{
					type: "Feature",
					properties: {
						label: "End",
					},
					geometry: {
						type: "Point",
						coordinates: [this._latLngEnd.lng, this._latLngEnd.lat],
					},
				},
			],
		};

		return data as FeatureCollection<Point>;
	}

	private buildLabelSourceData(
		path: FeatureCollection<LineString>
	): FeatureCollection<Point> {
		const pathLabelPoint = along(
			path.features[0].geometry,
			path.features[0].properties["length"] / 2,
			{ units: "kilometers" }
		);

		pathLabelPoint.properties["label"] = path.features[0].properties["label"];

		const featCollection = {
			type: "FeatureCollection",
			features: [pathLabelPoint],
		};
		return featCollection as FeatureCollection<Point>;
	}

	private getBounds(): LngLatBounds {
		const bounds = new LngLatBounds();

		bounds.extend([this._latLngStart.lng, this._latLngStart.lat]);
		bounds.extend([this._latLngEnd.lng, this._latLngEnd.lat]);

		return bounds;
	}

	private initMap(): maplibregl.Map {
		const map = new MapLibreBuilder({
			container: this.mapEl.nativeElement,
			center: [146.3399, -41.0889],
			zoom: 2,
		})
			.addBackgroundTiles()
			.build();

		map.on("load", () => {
			this.addPath();

			const bounds = this.getBounds();
			this._map.fitBounds(bounds, { padding: this.padding });
		});

		return map;
	}

	private addPath(): void {
		const path = this.buildPathData();
		const endPoints = this.buildEndPointData();
		const labelPoint = this.buildLabelSourceData(path);

		this._map.addSource("path", {
			type: "geojson",
			data: path,
		});

		this._map.addSource("pathLabelPoint", {
			type: "geojson",
			data: labelPoint,
		});

		this._map.addSource("endPoints", {
			type: "geojson",
			data: endPoints,
		});

		this._map.addLayer({
			id: "path-line",
			type: "line",
			source: "path",
			layout: {
				"line-cap": "round",
				"line-join": "round",
			},
			paint: {
				"line-color": this.pathColour,
				"line-width": this.pathWidth,
			},
		});
		this._map.addLayer({
			id: "users",
			type: "circle",
			source: "endPoints",
			paint: {
				"circle-radius": 4.5,
				"circle-color": "#ffffff",
				"circle-opacity": 1,
				"circle-stroke-color": this.pathColour,
				"circle-stroke-width": this.pathWidth,
			},
		});

		this._map.addLayer({
			id: "users-label",
			type: "symbol",
			source: "pathLabelPoint",
			layout: {
				"symbol-placement": "point",
				"text-anchor": "center",
				"text-justify": "center",
				"text-field": ["get", "label"],
				"text-font": [defaultGlyfFonts.OpenSansRegular],
				"text-size": 15,
				"text-allow-overlap": true,
				"text-ignore-placement": true,
				"text-offset": [0, 1],
			},
			paint: {
				"text-color": "#444444",
				"text-halo-color": "#ffffff",
				"text-halo-width": 2,
				"text-halo-blur": 1,
			},
		});
	}
}
