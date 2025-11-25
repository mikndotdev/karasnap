import Compressor from "compressorjs";
import piexif from "piexifjs";

interface ProcessedImageResult {
  file: File;
  capturedAt: Date;
}

/**
 * Process an image file by:
 * 1. Extracting the EXIF date (DateTimeOriginal)
 * 2. Compressing the image
 * 3. Stripping all EXIF data including GPS
 *
 * @param file - The original image file
 * @returns Promise with the processed file and captured date
 */
export async function processImage(file: File): Promise<ProcessedImageResult> {
  // Extract EXIF data before compression
  const capturedAt = await extractExifDate(file);

  // Compress the image
  const compressedFile = await compressImage(file);

  // Strip EXIF data from compressed image
  const cleanedFile = await stripExifData(compressedFile);

  return {
    file: cleanedFile,
    capturedAt,
  };
}

/**
 * Extract the capture date from EXIF data
 * Falls back to current time if not available
 */
async function extractExifDate(file: File): Promise<Date> {
  try {
    const dataUrl = await fileToDataUrl(file);
    const exifData = piexif.load(dataUrl);

    // Try to get DateTimeOriginal from Exif IFD
    const dateTimeOriginal = exifData.Exif?.[piexif.ExifIFD.DateTimeOriginal];

    if (dateTimeOriginal && typeof dateTimeOriginal === "string") {
      // EXIF date format: "YYYY:MM:DD HH:MM:SS"
      const parsedDate = parseExifDate(dateTimeOriginal);
      if (parsedDate) {
        return parsedDate;
      }
    }

    // Fallback: Try DateTime from 0th IFD
    const dateTime = exifData["0th"]?.[piexif.ImageIFD.DateTime];
    if (dateTime && typeof dateTime === "string") {
      const parsedDate = parseExifDate(dateTime);
      if (parsedDate) {
        return parsedDate;
      }
    }
  } catch (error) {
    console.warn("Failed to extract EXIF date:", error);
  }

  // Fallback to current time
  return new Date();
}

/**
 * Parse EXIF date string format (YYYY:MM:DD HH:MM:SS)
 */
function parseExifDate(exifDateStr: string): Date | null {
  try {
    // EXIF format: "2010:10:10 10:10:10"
    const [datePart, timePart] = exifDateStr.split(" ");
    const [year, month, day] = datePart.split(":").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    const date = new Date(year, month - 1, day, hour, minute, second);

    // Validate the date
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (error) {
    console.warn("Failed to parse EXIF date:", error);
  }

  return null;
}

/**
 * Compress the image using Compressor.js
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 2048,
      maxHeight: 2048,
      mimeType: "image/jpeg",
      convertSize: 5000000, // Convert images larger than 5MB to JPEG
      success(result) {
        // Convert Blob to File
        const compressedFile = new File([result], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

/**
 * Strip all EXIF data (including GPS) from the image
 */
async function stripExifData(file: File): Promise<File> {
  try {
    const dataUrl = await fileToDataUrl(file);

    // Remove all EXIF data
    const cleanedDataUrl = piexif.remove(dataUrl);

    // Convert back to File
    const blob = await dataUrlToBlob(cleanedDataUrl);
    const cleanedFile = new File([blob], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    return cleanedFile;
  } catch (error) {
    console.warn("Failed to strip EXIF data:", error);
    // If stripping fails, return the original file
    return file;
  }
}

/**
 * Convert File to Data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert Data URL to Blob
 */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}
