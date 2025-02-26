import { NgFor } from "@angular/common";
import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from "@angular/core";
import { FeatureCollection, Point, Position } from "geojson";
import { GeoJSONSource, LngLatBounds } from "maplibre-gl";
import { Subject, debounceTime, merge, timer } from "rxjs";
import { MapLibreBuilder } from "src/app/models/MapLibreBuilder";

import { HubUser } from "src/app/services/HeimdallSignalRService";
import { RealTimeUserService } from "src/app/services/RealTimeUserService";
import { objectToGeoJSONPointFeature } from "src/app/utilities/geoUtilities";

@Component({
	selector: "pph-user-map",
	templateUrl: "./user-map.component.html",
	styleUrls: [
		"./user-map.component.scss",
		//"../../../../node_modules/maplibre-gl/dist/maplibre-gl.css",
	],
	imports: [NgFor],
})
export class UserMapComponent implements AfterViewInit {
	@ViewChild("map") public mapEl!: ElementRef<HTMLElement>;

	@Input() public users: HubUser[] = [];

	private _map!: maplibregl.Map;
	private _userSource!: GeoJSONSource;
	public usersSansLocation: HubUser[] = [];
	public usersWithLocation: HubUser[] = [];
	private _usersUpdated = new Subject<void>();

	public constructor(private _realTimeUserService: RealTimeUserService) {
		this._usersUpdated.pipe(debounceTime(1000)).subscribe(() => {
			this.updateMap();
		});

		merge(
			this._realTimeUserService.connectionAdded,
			this._realTimeUserService.connectionRemoved
		)
			.pipe(debounceTime(1000))
			.subscribe(() => this.updateUsers());
	}

	public ngAfterViewInit(): void {
		this.initMap();
	}

	private updateUsers() {
		this.usersWithLocation = this.users.filter((v) => v.location.lat !== 0);
		this.usersSansLocation = this.users.filter((v) => v.location.lat === 0);
		this._usersUpdated.next();
	}

	private initMap() {
		this._map = new MapLibreBuilder({
			container: this.mapEl.nativeElement,
			center: [133.67, -25.58],
			zoom: 3,
			maxZoom: 20,
		})
			.addBackgroundTiles()
			.build();

		this._map.on("load", () => {
			this.addUsersToMap();
		});

		this._map.on("sourcedata", (e) => {
			if (e.isSourceLoaded && e.sourceId === "users") {
				this._userSource = this._map.getSource("users") as GeoJSONSource;
			}
		});
	}

	private updateMap(): void {
		if (this._userSource === undefined) {
			this.retryUpdateMap();

			return;
		}

		const geoJSON = this.usersToFeatureCollection();

		this._userSource.setData(geoJSON);

		this.setMapBounds(geoJSON);
	}

	private retryUpdateMap(): void {
		timer(1000).subscribe(() => {
			this.updateMap();
		});
	}

	private usersToFeatureCollection(): FeatureCollection<Point> {
		const features = this.usersWithLocation.map((user) => {
			return objectToGeoJSONPointFeature(user.location.lng, user.location.lat, {
				userName: user.userName,
			});
		});

		const geoJSON: FeatureCollection<Point> = {
			type: "FeatureCollection",
			features: features,
		};

		return geoJSON;
	}

	private getBounds(geoJSON: FeatureCollection<Point>): LngLatBounds {
		const bounds = new LngLatBounds();

		geoJSON.features.forEach((feature) => {
			const coords: Position = feature.geometry.coordinates;
			bounds.extend([coords[0], coords[1]]);
		});

		return bounds;
	}

	private setMapBounds(geoJSON: FeatureCollection<Point>): void {
		const bounds = this.getBounds(geoJSON);
		if (bounds.isEmpty()) return;

		this._map.fitBounds(bounds, { padding: 100 });
	}

	private addUsersToMap(): void {
		this._map.addSource("users", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [],
			},
			cluster: true,
			clusterMaxZoom: 14,
			clusterRadius: 50,
		});

		this._map.addLayer({
			id: "users",
			type: "circle",
			source: "users",
			filter: ["!", ["has", "point_count"]],
			paint: {
				"circle-radius": 10,
				"circle-color": "#007cbf",
				"circle-stroke-color": "#FFFFFF",
				"circle-stroke-width": 2,
			},
		});

		this._map.addLayer({
			id: "clustered_users",
			type: "circle",
			source: "users",
			filter: ["has", "point_count"],
			paint: {
				"circle-radius": 20,
				"circle-color": "#007cbf",
				"circle-stroke-color": "#FFFFFF",
				"circle-stroke-width": 2,
			},
		});

		this._map.addLayer({
			id: "cluster-count",
			type: "symbol",
			source: "users",
			filter: ["has", "point_count"],
			layout: {
				"text-field": "{point_count_abbreviated}",
				"text-font": ["Open Sans Bold"],
				"text-size": 12,
			},
			paint: {
				"text-color": "#FFFFFF",
			},
		});

		this._map.addLayer({
			id: "users-label",
			type: "symbol",
			source: "users",
			filter: ["!", ["has", "point_count"]],
			layout: {
				"text-field": ["get", "userName"],
				"text-font": ["Open Sans Bold"],
				"text-size": 12,
				"text-offset": [1.5, 1.5],
			},
			paint: {
				"text-color": "#888888",
				"text-halo-color": "#ffffff",
				"text-halo-width": 2,
				"text-halo-blur": 1,
			},
		});
	}
}
