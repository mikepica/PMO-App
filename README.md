# Program Management Assistant

A React application that helps manage and analyze multiple programs through an AI-powered chat interface.

## Features

- Display of three program boxes with program-specific information
- Real-time chat interface with AI assistant
- Program selection with checkboxes
- Parallel processing of queries for selected programs
- Modern, responsive UI with Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Select the programs you want to analyze using the checkboxes
2. Type your query in the chat interface
3. The AI will process your query for each selected program
4. Responses will appear in the respective program boxes

## Project Structure

- `src/App.js` - Main application component
- `src/data/programs.js` - Program data structure
- `src/config/systemInstructions.js` - LLM system instructions

## Technologies Used

- React
- Tailwind CSS
- OpenAI API (GPT-4) 