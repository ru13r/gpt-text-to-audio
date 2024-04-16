import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

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

// Function to read PDF and extract text chunks
const readPdfText = async (pdfPath) => {
  const dataBuffer = await fs.promises.readFile(pdfPath);
  const data = await pdf(dataBuffer);
  return splitTextIntoChunks(data.text, 4000);
};

// Function to convert text to MP3 using OpenAI's TTS API
const textToMp3 = async (textChunk) => {
  // Configure OpenAI API
  dotenv.config();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: textChunk,
  });
  return Buffer.from(await mp3.arrayBuffer());
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

    console.log(`Processing ${chunks.length} chunks in parallel.`);
    const mp3Promises = chunks.map(async (chunk, index) => {
        const mp3Data = await textToMp3(chunk);
        console.log(`Chunk ${index + 1} processed successfully.`);
        return mp3Data;
      });

    const mp3Chunks = await Promise.all(mp3Promises);
    const combinedMp3Data = Buffer.concat(mp3Chunks);  // Combine all MP3 data into a single buffer
    await writeMp3ToFile(combinedMp3Data, outputPath);  // Write the combined MP3 data to file
    console.log(`Audiobook saved as ${outputPath}`);
  } else {
    console.log('Usage: node app.js file.pdf -o output.mp3');
  }
}

// POSIX compliant apps should report an exit status
main()
  .then(() => { process.exit(0); })
  .catch((err) => {
    console.error(err); // Writes to stderr
    process.exit(1);
  });
