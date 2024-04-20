import path from 'path';
import fs from 'fs';
import { unlink } from 'fs/promises';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';


const getAudioDetails = async (filePath) => {
  const execAsync = promisify(exec);
  try {
    // Command to get both bitrate and duration of the audio stream
    const ffprobeCommand = `ffprobe -v error -select_streams a -show_entries stream=bit_rate,duration -of default=noprint_wrappers=1 "${filePath}"`;

    // Execute the ffprobe command
    const { stdout } = await execAsync(ffprobeCommand);
    const lines = stdout.trim().split('\n');

    let audioBitrateBits = 0;
    let audioDurationSeconds = 0;

    // Parse the output to get bitrate and duration
    lines.forEach(line => {
      if (line.startsWith('bit_rate=')) {
        audioBitrateBits = parseFloat(line.split('=')[1]);
      }
      if (line.startsWith('duration=')) {
        audioDurationSeconds = parseFloat(line.split('=')[1]);
      }
    });

    // Log and return the results
    console.log(`Bitrate: ${audioBitrateBits} bits/sec, Duration: ${audioDurationSeconds} seconds`);
    return  audioDurationSeconds;

  } catch (error) {
      console.error('Error executing FFprobe:', error);
      throw error;  // Rethrow to allow the caller to handle it
  }
};

// Async function to split the media file into 20 MB chunks
export const splitMediaFile = async (filePath) => {
  const outputTemplate = `temp_chunk_%03d.mp3`;

  // these shall correspond to each other
  const targetBitrate = 65536;
  const targetAB = '64k';  // codec parameter for ffmpeg

  console.log('Getting audio data..');
  const duration  = await getAudioDetails(filePath);
  const chunkSize = 10 * 1024 * 1024; // set to 10Mb (current OpenAI limit is 25Mb)
  const chunkDurationSeconds = chunkSize / (targetBitrate / 8); // Calculate duration of each chunk in seconds
  const numChunks = Math.ceil(duration / chunkDurationSeconds); // Estimate number of chunks
  console.log(`File will be split into ${numChunks} chunks.`);
  console.log(`Each ±10MB chunk will have duration of max. ${(chunkDurationSeconds / 60).toFixed(0)} minutes.`);

  return new Promise((resolve, reject) => {
    const args = [
      '-i', `"${filePath}"`,
      '-vn',                    // Disable video processing
      '-acodec', 'libmp3lame',  // Specify the MP3 codec
      '-ab', targetAB,
      '-f', 'segment',
      '-segment_time', `${chunkDurationSeconds}`,
      `"${outputTemplate}"`
    ];
    const ffmpegProcess = spawn('ffmpeg', args, { shell: true });

    ffmpegProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    ffmpegProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`FFmpeg exited with code ${code}`);
        reject(new Error('FFmpeg process failed.'));
      } else {
        console.log('FFmpeg process completed successfully');
        const filePaths = Array.from({ length: numChunks }, (_, i) =>
          `${outputTemplate.replace('%03d', ('000' + i).slice(-3))}`);
        resolve(filePaths);
      }
    });

    ffmpegProcess.on('error', (error) => {
      console.error('Error executing FFmpeg:', error);
      reject(error);
    });
  });
}


// Writing audio data to mp3 file
export const writeMediaToFile = async (mp3Data, filePath) => {
  const speechFile = path.resolve(filePath);
  await fs.promises.writeFile(speechFile, mp3Data);
  console.log(`Saved stream to file: ${filePath}`);
};

// Reading audio file
export const readMediaFile = (filePath) =>  {
  const stream = fs.createReadStream(filePath);
  console.log(`Created stream from file: ${filePath}`);
  return stream;
};

// removes files, provided an array of paths
export const removeFiles = (filePaths) => {
  console.log('Removing temporary files...');
  filePaths.forEach(async (filePath) => {
    try {
      await unlink(filePath);
    } catch(err) {
      // Log the error message and continue with the next file
      console.error(`Failed to remove ${filePath}:`, err.message);
    }
    });
};


