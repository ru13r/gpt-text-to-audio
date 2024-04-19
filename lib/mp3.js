import path from 'path';
import fs from 'fs';

// Function to write MP3 data to a file
export const writeMp3ToFile = async (mp3Data, outputPath) => {
  const speechFile = path.resolve(outputPath);
  await fs.promises.writeFile(speechFile, mp3Data);
};