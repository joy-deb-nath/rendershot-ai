Image api example guide:


import {
  GoogleGenAI,
} from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseModalities: [
        'IMAGE',
        'TEXT',
    ],
  };
  const model = 'gemini-2.5-flash-image-preview';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            data: `/9j/2wBDAAAAAAAAP/2Q== (Image will sent to api with a converted Base64 String - For exmaple this is the main Product image)`,
            mimeType: `image/jpeg`,
          },
        },
        {
          inlineData: {
            data: `/9j/2wBDAAAAAAAAP/2Q== (Image will sent to api with a converted Base64 String) - This is any other additional image uploaded by user e.g. Background `,
            mimeType: `image/jpeg`,
          },
        },

        {
          text: `Weite Your Final Text Prompt Here`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || '');
      const buffer = Buffer.from(inlineData.data || '', 'base64');
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    }
    else {
      console.log(chunk.text);
    }
  }
}

main();




