import moment, { Moment } from "moment";

export const getReverseCoordinateUrl = ({ lat, lng }: MyLatLng) => `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&zoom=13&normalizeaddress=0&oceans=1&accept-language=id&format=json`
export const getAutocompletePlaceUrl = (query: string) => `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`

export async function reverseCoordinate({ lat, lng }: MyLatLng) {
    const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&zoom=13&normalizeaddress=0&oceans=1&accept-language=id&format=json`
    );

    return await resp.json() as PlaceItem
}

export async function autocompleteSearch(query: string) {
    const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`
    );

    return await resp.json() as PlaceItem[]
}

export const filetoBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
});

export const relativeDay = (date: Date | Moment | string) => {
    const diff = moment().diff(date, 'day')

    return diff == 0 ? 'Hari Ini' : diff == 1 ? 'Kemaren' : diff == 2 ? 'Lusa' : moment(date).format('DD MMM YYYY')
}

export const qs = (json: Record<string, any>) => {
    return Object.keys(json)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
        .join('&');
}
