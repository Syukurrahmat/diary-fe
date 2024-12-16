type CreateEntryForm = {
  content: string;
  date: string;
  time: string;
  images: File[];
  tags: string[];
  coordinateLabel?: string,
  coordinate?: MyLatLng
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