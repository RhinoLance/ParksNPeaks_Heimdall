import { Feature, Point } from "geojson";

type LooseObject = {
	[key: string]: unknown;
};

export enum GeoJSONFeatureTypes {
	Point = "Point",
	Polygon = "Polygon",
	LineString = "LineString",
	MultiPoint = "MultiPoint",
	MultiLineString = "MultiLineString",
	MultiPolygon = "MultiPolygon",
}

export function objectToGeoJSONPointFeature(
	lat: number,
	lng: number,
	object: LooseObject
): Feature<Point> {
	const propNames = Object.getOwnPropertyNames(object);
	const props: LooseObject = {};
	propNames.forEach((propName) => {
		props[propName] = object[propName];
	});

	const feature: Feature<Point> = {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [lat, lng],
		},
		properties: props,
	};

	return feature;
}
