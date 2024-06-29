import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jsonexport from "jsonexport";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const convertJsonToCsv = async (jsonData : any, columns : any): Promise<string | null> => {
  try {
    return new Promise((resolve, reject) => {
      jsonexport(jsonData, { headers: columns }, (err, csv) => {
        if (err) {
          reject(err);
        } else {
          resolve(csv);
        }
      });
    });
  } catch (error) {
    console.error("Error converting JSON to CSV:", error);
    return null;
  }
};

export const downloadCsv = (content: string, fileName: string): void => {
  const blob = new Blob([content], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};


