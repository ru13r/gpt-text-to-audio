import { textImprove} from './api/functions.js';
import { readTextFile, writeTextFile } from './lib/text.js';

const main = async () => {
  // Command line arguments
  const [,, inputPath, outputFlag, outputPath] = process.argv;

  if (outputFlag === '-o' && inputPath && outputPath) {
    const data = await readTextFile(inputPath);
    const chunks = data
      .split('\n').filter(paragraph => paragraph.trim().length > 0);

    // convert the array of text chunks to the array of completion promises
    console.log(`Processing ${chunks.length} text chunks via model.`);
    const completionPromises = chunks.map(textImprove);
    const completionChunks = await Promise.all(completionPromises);

    // combine all buffers and save to file
    const combinedData = completionChunks.join('\n\n');  // Combine all MP3 data into a single buffer
    await writeTextFile(combinedData, outputPath);  // Write the combined media (MP3) data to file

  } else {
    console.log('Usage: node improve.js <text_file> -o <output_file.txt>');
  }
}

// POSIX compliant apps should report an exit status
main()
  .then(() => { process.exit(0); })
  .catch((err) => {
    console.error(err); // Writes to stderr
    process.exit(1);
  });
