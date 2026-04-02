import supabase from '../config/supabaseClient.js';
import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const analyze = async (req, res) => {
  console.log('analyze controller hit');
  try {
    const { filePath } = req.body;
    const { data, error } = await supabase.storage
      .from('pdf_uploaded')
      .download(filePath);

    if (error) throw error;

    const buffer = Buffer.from(await data.arrayBuffer());
    const tempPath = path.join(os.tmpdir(), `temp_${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, buffer);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const uploadedFile = await fileManager.uploadFile(tempPath, {
      mimeType: 'application/pdf',
      displayName: filePath,
    });

    fs.unlinkSync(tempPath);

    let file = uploadedFile.file;
    let retries = 0;
    const maxRetries = 10; // 10 × 2 seconds = 20 seconds max wait

    while (file.state === 'PROCESSING' && retries < maxRetries) {
      console.log(`Processing... attempt ${retries + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await fileManager.getFile(file.name);
      retries++;
    }

    if (file.state !== 'ACTIVE') {
      throw new Error(`File never became active. Final state: ${file.state}`);
    }

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: 'application/pdf',
          fileUri: file.uri,
        },
      },
      {
        text: `Read this document and generate 5 multiple choice questions based on it.
                    Return ONLY a JSON array, no extra text, no markdown, no backticks.
                    Format:
                    [
                    {
                        "question": "question here",
                        "options": ["A", "B", "C", "D"],
                        "correctAnswer": "A"
                    }
                    ]`,
      },
    ]);

    const responseText = result.response.text();
    const questions = JSON.parse(responseText); // now it's a proper JS array
    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { analyze };
