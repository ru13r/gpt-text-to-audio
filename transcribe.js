import { readMediaFile, removeFiles, splitMediaFile } from './lib/media.js';
import { speechToText } from './api/functions.js';
import { writeTextFile } from './lib/text.js';

const main = async () => {
  // Command line arguments
  const [,, inputPath, outputFlag, outputPath] = process.argv;

  if (outputFlag === '-o' && inputPath && outputPath) {
    const tempFiles = await splitMediaFile(inputPath);
    const chunks = await tempFiles.map(readMediaFile)

    // convert the array of text chunks to the array of mp3 buffer promises
    console.log(`Transcribing ${chunks.length} files using OpenAI whisper-1 model.`);
    const textPromises = chunks.map(speechToText);
    const textChunks = await Promise.all(textPromises);

    // combine all buffers and save to file
    await writeTextFile(textChunks.join(`\n\n`), outputPath);  // Write the combined text data to file

    // remove temporary files
    await removeFiles(tempFiles);

  } else {
    console.log('Usage: node transcribe.js file.mp3 -o output.txt');
  }
}

// POSIX compliant apps should report an exit status
main()
  .then(() => { process.exit(0); })
  .catch((err) => {
    console.error(err); // Writes to stderr
    process.exit(1);
  });
