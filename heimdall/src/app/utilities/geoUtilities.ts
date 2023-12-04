import { Feature, Point } from "geojson";
import { LatLng } from "../models/LatLng";

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

/**
 * Returns a randomised point within a buffer of the given point.
 * @param lat The latitude of the point.
 * @param lng The longitude of the point.
 * @param buffer The buffer in metres.
 * @returns A randomised point.
 **/

export function randomisePoint(
	lat: number,
	lng: number,
	buffer: number
): LatLng {
	const projectedBuffer = buffer * 0.00001;

	const randomLat =
		Math.random() > 0.5
			? lat + projectedBuffer * Math.random()
			: lat - projectedBuffer * Math.random();

	const randomLng =
		Math.random() > 0.5
			? lng + projectedBuffer * Math.random()
			: lng - projectedBuffer * Math.random();

	return new LatLng(randomLat, randomLng);
}
