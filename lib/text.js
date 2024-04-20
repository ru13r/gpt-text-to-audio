// text file functions
import fs from 'fs';
import path from 'path';

// Function reads text file and returns the promise
export const readTextFile = async (filePath) => {
  return await fs.promises.readFile(filePath, 'utf8');
};

// Function to write text data to a file
export const writeTextFile = async (textData, outputPath) => {
  const textFile = path.resolve(outputPath);
  await fs.promises.writeFile(textFile, textData, 'utf8');
  console.log(`Output saved as ${outputPath}`);
};

// Split text into chunks

export const splitTextIntoChunks = (text, maxSize) => {
  const words = text.split(/\s+/);  // Split text into words
  const chunks = [];
  let currentChunk = "";

  words.forEach(word => {
    if (currentChunk.length + word.length + 1 > maxSize) {  // Check if adding this word would exceed the limit
      chunks.push(currentChunk);  // Push the current chunk to the chunks array
      currentChunk = word;  // Start a new chunk with the current word
    } else {
      currentChunk += (currentChunk.length > 0 ? " " : "") + word;  // Add a space before the word if it's not the first word in the chunk
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);  // Push the last chunk if any
  }
  console.log(`Split text into chunks...`);
  return chunks;
};