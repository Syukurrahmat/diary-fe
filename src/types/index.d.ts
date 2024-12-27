type CreateEntryForm = {
    content: string;
    date: string;
    time: string;
    images: File[];
    tags: string[];
    address?: string,
    coordinate?: MyLatLng
    section : CreateEntryFormSection
    coordinateEdited: boolean,
    userLocationIsLoading: boolean,
    datetimeEdited: boolean
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



type JournalItem = {
    id: number
    date: string
    entries: EntryItem[]
    habits: Habit[]
    summary?: Summary
}
type Habit = {
    id: number,
    name: string,
    icon: string,
    deleted: boolean
}

type Summary = {
    id: number,
    content: string,
    createdAt: string,
    updatedAt: string
}
type EntryItem = {
    id: number
    content: string
    datetime: string
    location: {
        address: string
        id: number
    } | null
    images: {
        imageUrl: string
        width: number
        height: number
    }[]
    tags: any[]

    createdAt: string
    updatedAt: string
}


type EntryImageData = {
    imageUrl: string;
    width: number;
    height: number;
}

type SimpleHabit = {
    id: number,
    name: string,
    icon: string
}