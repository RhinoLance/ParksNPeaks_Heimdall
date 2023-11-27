import {
	AfterViewInit,
	Component,
	DoCheck,
	ElementRef,
	Input,
	IterableDiffer,
	IterableDiffers,
	ViewChild,
} from "@angular/core";
import { FeatureCollection, Point, Position } from "geojson";
import maplibregl, { GeoJSONSource, LngLatBounds } from "maplibre-gl";
import { Subject, debounceTime, timer } from "rxjs";

import { HubUser } from "src/app/services/HeimdallSignalRService";
import {
	objectToGeoJSONPointFeature,
} from "src/app/utilities/geoJSONUtilities";

@Component({
	selector: "pph-user-map",
	templateUrl: "./user-map.component.html",
	styleUrls: [
		"./user-map.component.scss",
		"../../../../node_modules/maplibre-gl/dist/maplibre-gl.css",
	],
	standalone: true,
})
export class UserMapComponent implements AfterViewInit, DoCheck {
	@ViewChild("map") public mapEl!: ElementRef<HTMLElement>;

	@Input() public users: HubUser[] = [];

	private _map!: maplibregl.Map;
	private _iterableDiffer: IterableDiffer<HubUser>;
	private _userSource!: GeoJSONSource;
	private _users = new Map<string, HubUser>();
	private _usersUpdated = new Subject<void>();

	public constructor(private iterableDiffer: IterableDiffers) {
		this._iterableDiffer = this.iterableDiffer.find(this.users).create();

		this._usersUpdated.pipe(debounceTime(1000)).subscribe(() => {
			this.updateMap();
		});
	}

	public ngAfterViewInit(): void {
		this._map = this.buildMap(this.mapEl.nativeElement);
	}

	public ngDoCheck() {
		let changes = this._iterableDiffer.diff(this.users);
		if (changes) {
			
			changes.forEachAddedItem((change) => {
				if (change) {
					this.addUser(change.item);
				}
			});

			changes.forEachRemovedItem((change) => {
				if (change) {
					this.removeMapMarker(change.item);
				}
			});

			//const extent = this._markerLayerSource.getExtent() as Extent;
			//this._map.set  .getView().fit(extent, {padding: [1, 1, 1, 1]});
		}
	}

	private buildMap(container: HTMLElement): maplibregl.Map {
		const map = new maplibregl.Map({
			container: container, // container ID
			center: [133.67, -25.58], // starting position [lng, lat]
			zoom: 3, // starting zoom
			maxZoom: 12,
			style: {
				version: 8,
				sources: {
					bgTiles: {
						type: "raster",
						tiles: [
							"https://cartodb-basemaps-c.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
						],
						tileSize: 256,
						attribution: "",
					},
					users: {
						type: "geojson",
						data: {
							type: "FeatureCollection",
							features: [],
						},
						cluster: true,
						clusterMaxZoom: 14,
						clusterRadius: 50,
					},
				},
				layers: [
					{
						id: "bgTiles",
						type: "raster",
						source: "bgTiles",
						minzoom: 0,
						maxzoom: 22,
					},
					{
						id: "users",
						type: "circle",
						source: "users",
						filter: ["!", ["has", "point_count"]],
						paint: {
							"circle-radius": 10,
							"circle-color": "#007cbf",
						},
					},
					{
						id: "clustered_users",
						type: "circle",
						source: "users",
						filter: ["has", "point_count"],
						paint: {
							"circle-radius": 20,
							"circle-color": "#007cbf",
						},
					},
					{
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
					},
				],
				glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
			},
		});

		map.on("click", "users", (e) => {
			new maplibregl.Popup()
				.setLngLat(e.lngLat)
				.setHTML(e.features![0].properties["userName"] as string)
				.addTo(map);
		});

		map.on("styledata", () => {
			if (map.getLayer("users-label") !== undefined) {
				return;
			}

			map.addLayer({
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
		});

		return map;
	}

	private updateMap(): void {
		if (this._map === undefined) {
			this.retryUpdateMap();

			return;
		}

		if (this._userSource === undefined) {
			this._userSource = this._map.getSource("users") as GeoJSONSource;

			if (this._userSource === undefined) {
				this.retryUpdateMap();
			}
		}

		const users = Array.from(this._users.values());
		const features = users.map((user) => {
			return objectToGeoJSONPointFeature(user.location.lng, user.location.lat, {
				userName: user.userName,
			});
		});

		const geoJSON: FeatureCollection<Point> = {
			type: "FeatureCollection",
			features: features,
		};

		this._userSource.setData(geoJSON);

		const bounds = this.getBounds(geoJSON);
		this._map.fitBounds(bounds, { padding: 100 });
	}

	private retryUpdateMap(): void {
		timer(1000).subscribe(() => {
			this.updateMap();
		});
	}

	private addUser(item: HubUser): void {
		this._users.set(item.userName, item);
		this._usersUpdated.next();
	}

	private removeMapMarker(item: HubUser): void {
		this._users.delete(item.userName);
		this._usersUpdated.next();
	}

	private getBounds(geoJSON: FeatureCollection<Point>): LngLatBounds {
		const bounds = new LngLatBounds();

		geoJSON.features.forEach((feature) => {
			const coords: Position = feature.geometry.coordinates;
			bounds.extend([coords[0], coords[1]]);
		});

		return bounds;
	}
}
