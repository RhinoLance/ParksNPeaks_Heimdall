export class SiOtaSite {
    id: number;
    lat: number;
    lon: number;
    arty: boolean;
    name: string;
    locality: string;
    state: string;
    country: string;
    comment: string;
    total_activations: number;
    silo_code: string;
    rail_status: string;
    railway: string;
    link: string;
    lga_code: string;
    locator: string;
    rating: string;
    street_view: string;
    park: string;
    not_before: number;
    not_after: number;

    constructor({
        id,
        lat,
        lon,
        arty,
        name,
        locality,
        state,
        country,
        comment,
        total_activations,
        silo_code,
        rail_status,
        railway,
        link,
        lga_code,
        locator,
        rating,
        street_view,
        park,
        not_before,
        not_after,
    }: {
        id: number;
        lat: number;
        lon: number;
        arty: boolean;
        name: string;
        locality: string;
        state: string;
        country: string;
        comment: string;
        total_activations: number;
        silo_code: string;
        rail_status: string;
        railway: string;
        link: string;
        lga_code: string;
        locator: string;
        rating: string;
        street_view: string;
        park: string;
        not_before: number;
        not_after: number;
    }) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
        this.arty = arty;
        this.name = name;
        this.locality = locality;
        this.state = state;
        this.country = country;
        this.comment = comment;
        this.total_activations = total_activations;
        this.silo_code = silo_code;
        this.rail_status = rail_status;
        this.railway = railway;
        this.link = link;
        this.lga_code = lga_code;
        this.locator = locator;
        this.rating = rating;
        this.street_view = street_view;
        this.park = park;
        this.not_before = not_before;
        this.not_after = not_after;
    }
}