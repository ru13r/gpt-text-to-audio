const fs = require('fs');
const pdf = require('pdf-parse');
const { Configuration, OpenAIApi } = require('@openai/client');
require('dotenv').config();

const convertPdfToAudiobook = async (pdfPath, outputPath) => {
  // Read the PDF file
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  // Configure OpenAI API
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Extract text and convert to speech
  try {
    const response = await openai.createTts({
      model: "tts-1",
      input: data.text,
      output_format: "mp3"
    });
    fs.writeFileSync(outputPath, response.data);
    console.log(`Audiobook saved as ${outputPath}`);
  } catch (error) {
    console.error('Error in generating audiobook:', error);
  }
};

// Command line arguments
const [,, pdfPath, outputFlag, outputPath] = process.argv;

if (outputFlag === '-o' && pdfPath && outputPath) {
  convertPdfToAudiobook(pdfPath, outputPath);
} else {
  console.log('Usage: node app.js file.pdf -o output.mp3');
}