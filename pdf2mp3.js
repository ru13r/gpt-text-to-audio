import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

import pdf from 'pdf-parse/lib/pdf-parse.js';
// (.../lib/... required to work correctly with ES modules)


const splitTextIntoChunks = (text, maxSize) => {
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
    return chunks;
};

// Function reads PDF and and returns the array of chunks
const readPdfText = async (pdfPath) => {
  const dataBuffer = await fs.promises.readFile(pdfPath);
  const data = await pdf(dataBuffer);
  return splitTextIntoChunks(data.text, 4000);
  // (current TTS AI limit is 4096 chars per chunk)
};

// Returns a function to convert text to audio using OpenAI's TTS API
const getTTSFunction = (openai) => async (textChunk, index) => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: textChunk,
  });
  const mp3Data = Buffer.from(await mp3.arrayBuffer());
  console.log(`Chunk ${index + 1} processed successfully.`);
  return mp3Data;
};

// Function to write MP3 data to a file
const writeMp3ToFile = async (mp3Data, outputPath) => {
  const speechFile = path.resolve(outputPath);
  await fs.promises.writeFile(speechFile, mp3Data);
};

const main = async () => {
  // Command line arguments
  const [,, pdfPath, outputFlag, outputPath] = process.argv;

  if (outputFlag === '-o' && pdfPath && outputPath) {
      const chunks = await readPdfText(pdfPath);

      // Configure OpenAI API and the processing function
      dotenv.config();
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const textToVoice = getTTSFunction(openai);

      // convert the array of text chunks to the array of mp3 buffer promises
      console.log(`Processing ${chunks.length} chunks in parallel.`);
      const mp3Promises = chunks.map(textToVoice);
      const mp3Chunks = await Promise.all(mp3Promises);

      // combine all buffers
      const combinedMp3Data = Buffer.concat(mp3Chunks);  // Combine all MP3 data into a single buffer
      await writeMp3ToFile(combinedMp3Data, outputPath);  // Write the combined MP3 data to file
      console.log(`Audiobook saved as ${outputPath}`);
  } else {
    console.log('Usage: node pdf2mp3.js file.pdf -o output.mp3');
  }
}

// POSIX compliant apps should report an exit status
main()
  .then(() => { process.exit(0); })
  .catch((err) => {
    console.error(err); // Writes to stderr
    process.exit(1);
  });
