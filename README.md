# PDF to Audiobook Converter

This prototype Node.js application converts PDF documents into audiobooks using OpenAI's text-to-speech service. It processes the text extracted from PDFs and converts it into spoken audio in MP3 format. This tool is ideal for creating audiobooks from written documents, enhancing accessibility, and providing a hands-free way of consuming information.

## Features

- Extract text from PDF files.
- Convert text to spoken audio using OpenAI's text-to-speech.
- Save the audio in MP3 format.
- Process large PDFs by splitting text into manageable chunks.

## Prerequisites

Before you run this application, you need the following:
- Node.js installed on your system.
- An API key from OpenAI.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/ru13r/gpt-text-to-audio.git
cd gpt-text-to-audio
npm install
```

## Configuration
Create a `.env` file in the project root and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
```
## Usage
Run the application using the following command:

```bash
node app.js <path_to_pdf_file> -o <output_mp3_file>
```

For example:

```bash
node app.js example.pdf -o example.mp3
```

## How It Works
* Reading PDF: The application reads the PDF file and extracts text using .
* Text Processing: The text is split into chunks to manage size limitations of the TTS API.
* Text-to-Speech Conversion: Each text chunk is converted to speech and stored as MP3 data.
* Combining Audio: All MP3 chunks are combined into a single MP3 file.
* Output: The final MP3 file is saved to the specified output path.