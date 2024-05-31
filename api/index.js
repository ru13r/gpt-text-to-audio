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
        openAIInstance = new OpenAI();
    }
    return openAIInstance
}
