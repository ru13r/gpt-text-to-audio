// OpenAI functions
import { getOpenAIClient } from './index.js';

// Returns a function to convert text to audio using OpenAI's TTS API
export const textChunkToSpeech = async (textChunk, index) => {
  const openai = getOpenAIClient();
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "onyx",
    input: textChunk,
  });
  const mp3Data = Buffer.from(await mp3.arrayBuffer());
  console.log(`Chunk ${index + 1} processed successfully.`);
  return mp3Data;
};