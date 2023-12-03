import maplibregl, {
	LayerSpecification,
	MapOptions,
	SourceSpecification,
} from "maplibre-gl";

export type MapBuilderOptions = {
	container: string | HTMLElement;
	center?: [number, number];
	zoom?: number;
	minZoom?: number;
	maxZoom?: number;
};

export class MapLibreBuilder {
	private _map: maplibregl.Map;

	public constructor(options: MapBuilderOptions) {
		const mapOptions: MapOptions = {
			container: options?.container,
			center: options?.center,
			zoom: options?.zoom,
			minZoom: options?.minZoom,
			maxZoom: options?.maxZoom,
			attributionControl: false,
			style: {
				version: 8,
				sources: {},
				layers: [],
				glyphs: defaultGlyfUrl,
			},
		};

		this._map = new maplibregl.Map(mapOptions);
	}

	public build(): maplibregl.Map {
		return this._map;
	}

	public addLayer(layer: LayerSpecification): MapLibreBuilder {
		this._map.addLayer(layer);
		return this;
	}

	public addSource(id: string, source: SourceSpecification): MapLibreBuilder {
		this._map.addSource(id, source);
		return this;
	}

	public addBackgroundTiles(): MapLibreBuilder {
		this._map.on("load", () => {
			this.addSource("bgTiles", voyagerTileSource);
			this.addLayer(voyagerTileLayer);
		});

		return this;
	}
}

const voyagerTileSource: SourceSpecification = {
	type: "raster",
	tiles: [
		"https://cartodb-basemaps-c.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
	],
	tileSize: 256,
	attribution: "",
};

const voyagerTileLayer: LayerSpecification = {
	id: "bgTiles",
	type: "raster",
	source: "bgTiles",
	minzoom: 0,
	maxzoom: 22,
};

const defaultGlyfUrl = "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf";

enum defaultGlyfFonts {
	OpenSansRegular = "Open Sans Regular",
	OpenSansBold = "Open Sans Bold",
	MetropolisRegular = "Metropolis Regular",
	MetropolisBold = "Metropolis Bold",
}

export { defaultGlyfFonts, voyagerTileLayer, voyagerTileSource };
