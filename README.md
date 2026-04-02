# PDF Quiz Generator

A backend API service that allows users to upload PDF documents and generate multiple-choice quizzes using AI. The system extracts content from uploaded PDFs, processes it through Google's Gemini 2.5 Flash model, and returns quiz questions with multiple options and correct answers.

## Features

- **PDF Upload**: Upload PDF documents directly via POST request
- **AI-Powered Quiz Generation**: Automatically generate MCQs with 4 options and correct answers
- **Supabase Storage**: Secure cloud storage for uploaded PDFs
- **RESTful API**: Easy integration with frontend applications

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Storage**: Supabase (Bucket Storage)
- **AI Model**: Google Gemini 2.5 Flash
- **PDF Processing**: pdf-parse

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account with bucket storage configured
- Google Gemini API key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the server:

```bash
npm start
```

## API Endpoints

### Upload PDF and Generate Quiz

**POST** `/api/upload`

Uploads a PDF file and generates a quiz based on its content.

**Request**:

- Content-Type: `multipart/form-data`
- Body: `file` - PDF file

**Response**:

```json
{
  "success": true,
  "quiz": [
    {
      "question": "What is the main topic of the document?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    }
  ]
}
```

### Health Check

**GET** `/api/health`

Returns the health status of the server.

**Response**:

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Usage

### Using Postman

1. Open Postman
2. Set the request type to `POST`
3. Enter the URL: `http://localhost:3000/api/upload`
4. Go to the **Body** tab
5. Select **form-data**
6. Add a key named `file` and select your PDF file
7. Click **Send**

### Frontend Integration

You can integrate this API into your frontend application using any HTTP client:

```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.quiz);
```

## Project Structure

```
├── server.js          # Main server file
├── .env              # Environment variables (create this)
├── package.json      # Dependencies and scripts
├── README.md         # This file
```

## Environment Variables

| Variable         | Description           | Required           |
| ---------------- | --------------------- | ------------------ |
| `PORT`           | Server port number    | No (default: 3000) |
| `SUPABASE_URL`   | Supabase project URL  | Yes                |
| `SUPABASE_KEY`   | Supabase API key      | Yes                |
| `GEMINI_API_KEY` | Google Gemini API key | Yes                |

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
