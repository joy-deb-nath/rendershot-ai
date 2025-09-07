  Here is a complete, step-by-step guide showing exactly how to use the new, enriched prompt within the API structure you provided.

This guide simulates the entire process, from a user making selections in your app to constructing the final, API-ready payload.

-----

### Full API Example Guide: Virtual Photoshoot

This example demonstrates the complete workflow for generating a professional product photo using our final, enriched JSON prompt.

#### Step 1: A User Makes Selections in Your App

First, imagine a user has selected the following options in the "Virtual Photoshoot" feature:

  * **Background**: `[Preset]` -\> `[Studio]` -\> `[Style: Polished Concrete Surface]`
  * **Camera Angle**: `[Preset]` -\> `[45° Angle]`
  * **Output**: `[Square (1:1)]`

#### Step 2: Your Backend Constructs and Stringifies the Enriched JSON Prompt

Your Node.js backend takes these user selections and builds the rich JSON object. It then converts this object into a string using `JSON.stringify()`.

```javascript
// --- Step 2.1: Construct the JSON Object ---
const promptObject = {
  "intent": "A professional, studio-quality product photograph suitable for a high-end e-commerce website, marketing materials, and social media advertising.",
  "style": {
    "primary": "photorealistic",
    "rendering_quality": "hyperrealistic",
    "realism_reference": "commercial product photography standards"
  },
  "subject": {
    "source": "master_image",
    "focus": "ultra-sharp focus on the product's key details and materials"
  },
  "background": {
    "type": "preset", // Dynamic from user
    "preset_details": {
      "category": "studio", // Dynamic from user
      "style": "polished_concrete_surface" // Dynamic from user
    },
    "upload_details": null,
    "description": null
  },
  "technical_specifications": {
    "lighting": {
      "setup": "professional three-point softbox setup",
      "goal": "to create soft, diffused highlights, eliminate harsh shadows, and accurately render material textures"
    },
    "camera": {
      "angle_type": "preset", // Dynamic from user
      "angle_preset": "45_degree", // Dynamic from user
      "angle_description": null,
      "lens": "85mm",
      "aperture": "f/1.8",
      "depth_of_field": "shallow, to create a soft, blurred background (bokeh) that makes the product stand out"
    }
  },
  "composition": {
    "framing": "rule of thirds, ensuring balanced and aesthetically pleasing subject placement",
    "negative_space": "ample, clean negative space around the product to allow for text overlays if needed"
  },
  "output_format": {
    "aspect_ratio": "1:1" // Dynamic from user
  },
  "quality_control": {
    "include": ["authentic material properties", "natural textures", "physically accurate rendering", "4K resolution"],
    "avoid": ["digital artifacts", "unrealistic proportions", "oversaturated colors", "blurry details", "flat lighting"]
  }
};

// --- Step 2.2: Stringify the object for the API call ---
const finalPromptText = JSON.stringify(promptObject);
```

#### Step 3: The Complete API Call

Finally, you assemble the complete `contents` payload. The stringified JSON from Step 2 is placed directly into the `text` field, alongside the Base64-encoded product image.

```javascript
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { writeFile, readFileSync } from 'fs';

// (This is the same file-saving function from your example)
function saveBinaryFile(fileName: string, content: Buffer) {
  // ... implementation ...
}

async function generateProductShot() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = 'gemini-2.5-flash-image-preview';
  
  // --- This is the final, complete prompt from Step 2 ---
  const finalPromptText = JSON.stringify({ /* ... The full JSON object from above ... */ });

  // --- Read your product image and convert to Base64 ---
  const masterProductImage = readFileSync('path/to/your/product-image.jpg').toString('base64');
  
  const contents = [
    {
      role: 'user',
      parts: [
        {
          // Part 1: The user's main product image
          inlineData: {
            data: masterProductImage,
            mimeType: 'image/jpeg',
          },
        },
        // NOTE: If the user had chosen the 'Upload' tab for the background,
        // you would add a second inlineData part here with their background image.
        {
          // Part 2: Our stringified, enriched JSON prompt
          text: finalPromptText,
        },
      ],
    },
  ];

  // (The rest of your API call logic remains the same)
  const response = await ai.models.generateContentStream({ model, contents });
  // ... process the response stream ...
}

generateProductShot();

```