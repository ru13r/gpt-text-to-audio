import { writeMp3ToFile } from './lib/mp3.js';
import { splitTextIntoChunks } from './lib/text.js';
import { readPdfText } from './lib/pdf.js';
import { textChunkToSpeech } from './api/functions.js';

// OpenAI: ensure this value has at most 4096 characters
const TTS_CHUNK_SIZE = 4000;

const main = async () => {
  // Command line arguments
  const [,, pdfPath, outputFlag, outputPath] = process.argv;

  if (outputFlag === '-o' && pdfPath && outputPath) {
      const data = await readPdfText(pdfPath);
      console.log(`Read PDF file. Splitting into chunks...`);
      const chunks = splitTextIntoChunks(data, TTS_CHUNK_SIZE);

      // convert the array of text chunks to the array of mp3 buffer promises
      console.log(`Processing ${chunks.length} chunks in parallel.`);
      const mp3Promises = chunks.map(textChunkToSpeech);
      const mp3Chunks = await Promise.all(mp3Promises);

      // combine all buffers and save to file
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
