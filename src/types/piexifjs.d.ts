declare module "piexifjs" {
  export interface ExifData {
    "0th"?: Record<number, any>;
    Exif?: Record<number, any>;
    GPS?: Record<number, any>;
    Interop?: Record<number, any>;
    "1st"?: Record<number, any>;
    thumbnail?: string;
  }

  export interface ExifIFD {
    DateTimeOriginal: number;
    LensMake: number;
    Sharpness: number;
    LensSpecification: number;
    [key: number]: number;
  }

  export interface ImageIFD {
    Make: number;
    XResolution: number;
    YResolution: number;
    Software: number;
    DateTime: number;
    [key: number]: number;
  }

  export interface GPSIFD {
    GPSVersionID: number;
    GPSDateStamp: number;
    GPSLatitude: number;
    GPSLongitude: number;
    [key: number]: number;
  }

  export interface TAGS {
    [ifd: string]: {
      [tag: number]: {
        name: string;
        [key: string]: any;
      };
    };
  }

  export const ExifIFD: ExifIFD;
  export const ImageIFD: ImageIFD;
  export const GPSIFD: GPSIFD;
  export const TAGS: TAGS;

  export function load(jpegData: string): ExifData;
  export function dump(exifObj: ExifData): string;
  export function insert(exifBytes: string, jpegData: string): string;
  export function remove(jpegData: string): string;

  const piexif: {
    load: typeof load;
    dump: typeof dump;
    insert: typeof insert;
    remove: typeof remove;
    ExifIFD: ExifIFD;
    ImageIFD: ImageIFD;
    GPSIFD: GPSIFD;
    TAGS: TAGS;
  };

  export default piexif;
}
