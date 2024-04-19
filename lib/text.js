// Text utilities

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
  return chunks;
};