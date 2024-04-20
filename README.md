# GPT Tools

A set of prototype Node.js command line tools for OpenAI API.

## Prerequisites

Before you run these tools, you need the following:
- Node.js installed on your system.
- An API key from OpenAI.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/ru13r/gpt-tools.git
cd gpt-tools
npm install
```

[ffmpeg](https://ffmpeg.org/) is used to work with media files and 
must be installed on your system. 

On macOS it can be installed using [Homebrew](https://docs.brew.sh/Installation) with
the following command:

```bash
brew install ffmpeg
```

## Configuration
Create a `.env` file in the project root and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
```
## GPT Tools 

### PDF to speech converter (pdf2mp3)

Converts PDF documents into audiobooks using OpenAI's text-to-speech service. It processes the text extracted from PDFs and converts it into spoken audio in MP3 format. This tool is ideal for creating audiobooks from written documents, enhancing accessibility, and providing a hands-free way of consuming information.

#### Features

- Extract text from PDF files.
- Convert text to spoken audio using OpenAI's text-to-speech.
- Save the audio in MP3 format.
- Process large PDFs by splitting text into manageable chunks.

#### Usage
Run the application using the following command:

```bash
node pdf2mp3.js <path_to_pdf_file> -o <output_mp3_file>
```

For example:

```bash
node pdf2mp3.js example.pdf -o example.mp3
```

#### How It Works
* Reading PDF: The application reads the PDF file and extracts text using .
* Text Processing: The text is split into chunks to manage size limitations of the TTS API.
* Text-to-Speech Conversion: Each text chunk is converted to speech and stored as MP3 data.
* Combining Audio: All MP3 chunks are combined into a single MP3 file.
* Output: The final MP3 file is saved to the specified output path.

### Video and audio files transcriber (transcribe)
Processes audio or video files, transcribing audio 
using the Whisper-1 model, and saving the transcription outputs 
to a text file.

#### Features
- Works with small and large video and audio files of different types.
- Transcribes audio using OpenAI's **Whisper-1** model.
- **ffmpeg** tool is used to process and split files into chunks.


#### Usage

Run the utility with a command in the following format:

```bash
node transcribe.js file.mp4 -o file.txt
```

#### How It Works
* The utility first uses ffmpeg to split the input 
audio or video file into files of approximately 10 MB in size. 
This ensures each segment fits 
within API constraints for transcription. 
* Each file is then transcribed using the Whisper-1 model.
* The output is saved to a single text file.
* Temporary chunk files are removed.

