type CreateEntryForm = {
    content: string;
    date: string;
    time: string;
    images: File[];
    tags: string[];
    address?: string,
    coordinate?: MyLatLng

    coordinateEdited : boolean,
    datetimeEdited : boolean
};

type MyLatLng = {
    lat: number,
    lng: number
}

type CreateEntryFormSection = 'main' | 'datepicker' | 'locationpicker'


type PlaceItem = {
    placeId: number
    licence: string
    name: string
    displayName: string
    lat: number
    lng: number
}

declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module "*.css" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default any;
}


type JournalList = {
    date: string,
    entries: SimpleEntryData[]
}

type SimpleEntryData = {
    id: number;
    content: string;
    datetime: string;
    location: {
        address: string;
        id: number;
    } | null;
    images: EntryImageData[];
    tags: {
        id: number,
        name: string,
    }[]
}

type EntryImageData = {
    imageUrl: string;
    width: number;
    height: number;
}