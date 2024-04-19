// Configure OpenAI API and the processing function
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables at module evaluation
dotenv.config();

// Singleton instance variable
let openAIInstance = null;

// Function to get or create the singleton OpenAI instance
export const getOpenAIClient = () => {
  if (!openAIInstance) {
    // Create the OpenAI instance only if it doesn't already exist
    openAIInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openAIInstance;
}
