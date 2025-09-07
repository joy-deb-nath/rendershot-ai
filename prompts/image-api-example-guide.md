### The Template Specific Prompts
template-01-Prompt:
Make this product in the picture into an ad poster that is super-premium, creative, dramatic lighting, product focused, photoshop manipulation style

template-02-Prompt:
Create a 1/7 scale commercialized miniature version of the product in the picture, in a realistic style, in a real environment. The miniature is placed on a computer desk. The miniature has a round transparent acrylic base, with no text on the base. The content on the computer screen is a 3D modeling process of this miniature. Next to the computer screen is a toy packaging box, designed in a style reminiscent of high-quality collectible miniature, printed with original artwork. The packaging features two-dimensional flat illustrations

template-03-Prompt:
Make this product in the picture into an retro style ad poster that is carries a vibe of retro era, creative, product focused

template-04-Prompt:
A high-resolution advertising photograph of a realistic, miniature version of the product in the picture held delicately between a person's thumb and index finger.  clean and white background, studio lighting, soft shadows. The hand is well-groomed, natural skin tone, and positioned to highlight the product’s shape and details. The product appears extremely small but hyper-detailed and brand-accurate, centered in the frame with a shallow depth of field. Emulates luxury product photography and minimalist commercial style.


### Template Specific api example guide:

const dynamictemplatePrompt = template-01-Prompt

if user inputs any value on Additional Instructions Input field,
then:
const additionalInput = "Additional Instructions: " + here will be the value of Additional Instructions Input field" (e.g Prompt+ Input filed value)
if user dont inputs any value on Additional Instructions Input field,
then:
const additionalInput = null (e.g Prompt+)


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
          text: `dynamictemplatePrompt+additionalInput (Dynamic template specific Prompt)`,
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




