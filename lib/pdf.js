import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
// (.../lib/... required to work correctly with ES modules)


// Function reads PDF and and returns the promise
export const readPdfText = async (pdfPath) => {
  const dataBuffer = await fs.promises.readFile(pdfPath);
  return (await pdf(dataBuffer)).text;
};