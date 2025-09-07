/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// This will be populated from environment variables or Supabase secrets in production
let API_KEY: string | null = null;

// Initialize AI instance when API key is available
let ai: GoogleGenAI | null = null;

// Auto-initialize with environment variable if available
const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (envApiKey && envApiKey !== 'your_api_key_here' && envApiKey.trim() !== '') {
  API_KEY = envApiKey;
  ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log('Gemini API initialized with environment variable');
}

/**
 * Initialize the Gemini service with API key
 */
export function initializeGemini(apiKey: string) {
  API_KEY = apiKey;
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

/**
 * Check if Gemini is initialized
 */
export function isGeminiInitialized(): boolean {
  return !!API_KEY && !!ai;
}



/**
 * Logs the prompt data to console and optionally to server
 * @param settings The user's selected settings
 * @param narrativePrompt The generated narrative prompt
 * @param finalPrompt The final prompt string
 */
function logPromptToFile(settings: any, narrativePrompt: string, finalPrompt: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `
================================================================================
🎯 VIRTUAL PHOTOSHOOT - NARRATIVE PROMPT GENERATION
⏰ ${timestamp}
================================================================================

📋 USER SETTINGS RECEIVED:
${JSON.stringify(settings, null, 2)}

📝 GENERATED NARRATIVE PROMPT:
${narrativePrompt}

📊 PROMPT STATISTICS:
- Total characters: ${finalPrompt.length}
- Total lines: ${finalPrompt.split('\n').length}
- Background type: ${settings.backgroundTab || 'auto'}
- Camera type: ${settings.cameraTab || 'auto'}
- Aspect ratio: ${settings.aspectRatio || 'square'}

================================================================================
✅ PROMPT READY FOR API CALL
================================================================================

`;

  // Log to browser console (visible in browser dev tools)
  console.log(logEntry);
  
  // Also try to send to server if available
  fetch('http://localhost:3001/api/log-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      settings,
      narrativePrompt,
      finalPrompt
    })
  }).catch(() => {
    // Server not available, that's okay
  });
}

// --- Helper Functions ---

/**
 * Creates a fallback prompt to use when the primary one is blocked.
 * @param decade The decade string (e.g., "1950s").
 * @returns The fallback prompt string.
 */
function getFallbackPrompt(decade: string): string {
  return `Create a photograph of the person in this image as if they were living in the ${decade}. The photograph should capture the distinct fashion, hairstyles, and overall atmosphere of that time period. Ensure the final image is a clear photograph that looks authentic to the era.`;
}

/**
 * Extracts the decade (e.g., "1950s") from a prompt string.
 * @param prompt The original prompt.
 * @returns The decade string or null if not found.
 */
function extractDecade(prompt: string): string | null {
  const match = prompt.match(/(\d{4}s)/);
  return match ? match[1] : null;
}

/**
 * Processes the Gemini API response, extracting the image or throwing an error if none is found.
 * @param response The response from the generateContent call.
 * @returns A data URL string for the generated image.
 */
function processGeminiResponse(response: GenerateContentResponse): string {
  const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePartFromResponse?.inlineData) {
    const { mimeType, data } = imagePartFromResponse.inlineData;
    return `data:${mimeType};base64,${data}`;
  }

  const textResponse = response.text;
  console.error("API did not return an image. Response:", textResponse);
  throw new Error(`The AI model responded with text instead of an image: "${textResponse || 'No text response received.'}"`);
}

/**
 * A wrapper for the Gemini API call that includes a retry mechanism for internal server errors.
 * @param imagePart The image part of the request payload.
 * @param textPart The text part of the request payload.
 * @returns The GenerateContentResponse from the API.
 */
async function callGeminiWithRetry(imagePart: object, textPart: object): Promise<GenerateContentResponse> {
  if (!ai) {
    throw new Error("Gemini API not initialized. Please provide your API key first.");
  }

  const maxRetries = 3;
  const initialDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
      });
    } catch (error) {
      console.error(`Error calling Gemini API (Attempt ${attempt}/${maxRetries}):`, error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      const isInternalError = errorMessage.includes('"code":500') || errorMessage.includes('INTERNAL');

      if (isInternalError && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Internal error detected. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Re-throw if not a retriable error or if max retries are reached.
    }
  }
  // This should be unreachable due to the loop and throw logic above.
  throw new Error("Gemini API call failed after all retries.");
}

/**
 * A wrapper for the Gemini API call with multiple images that includes a retry mechanism for internal server errors.
 * @param contentParts Array of content parts (images and text)
 * @returns The GenerateContentResponse from the API.
 */
async function callGeminiWithRetryMultipleImages(contentParts: any[]): Promise<GenerateContentResponse> {
  if (!ai) {
    throw new Error("Gemini API not initialized. Please provide your API key first.");
  }

  const maxRetries = 3;
  const initialDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: contentParts },
      });
    } catch (error) {
      console.error(`Error calling Gemini API (Attempt ${attempt}/${maxRetries}):`, error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      const isInternalError = errorMessage.includes('"code":500') || errorMessage.includes('INTERNAL');

      if (isInternalError && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Internal error detected. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Re-throw if not a retriable error or if max retries are reached.
    }
  }
  // This should be unreachable due to the loop and throw logic above.
  throw new Error("Gemini API call failed after all retries.");
}

/**
 * Generates a decade-styled image from a source image and a prompt.
 * It includes a fallback mechanism for prompts that might be blocked in certain regions.
 * @param imageDataUrl A data URL string of the source image (e.g., 'data:image/png;base64,...').
 * @param prompt The prompt to guide the image generation.
 * @returns A promise that resolves to a base64-encoded image data URL of the generated image.
 */
export async function generateDecadeImage(imageDataUrl: string, prompt: string): Promise<string> {
  const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format. Expected 'data:image/...;base64,...'");
  }
  const [, mimeType, base64Data] = match;

  const imagePart = {
    inlineData: { mimeType, data: base64Data },
  };

  // --- First attempt with the original prompt ---
  try {
    console.log("Attempting generation with original prompt...");
    const textPart = { text: prompt };
    const response = await callGeminiWithRetry(imagePart, textPart);
    return processGeminiResponse(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    const isNoImageError = errorMessage.includes("The AI model responded with text instead of an image");

    if (isNoImageError) {
      console.warn("Original prompt was likely blocked. Trying a fallback prompt.");
      const decade = extractDecade(prompt);
      if (!decade) {
        console.error("Could not extract decade from prompt, cannot use fallback.");
        throw error; // Re-throw the original "no image" error.
      }

      // --- Second attempt with the fallback prompt ---
      try {
        const fallbackPrompt = getFallbackPrompt(decade);
        console.log(`Attempting generation with fallback prompt for ${decade}...`);
        const fallbackTextPart = { text: fallbackPrompt };
        const fallbackResponse = await callGeminiWithRetry(imagePart, fallbackTextPart);
        return processGeminiResponse(fallbackResponse);
      } catch (fallbackError) {
        console.error("Fallback prompt also failed.", fallbackError);
        const finalErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        throw new Error(`The AI model failed with both original and fallback prompts. Last error: ${finalErrorMessage}`);
      }
    } else {
      // This is for other errors, like a final internal server error after retries.
      console.error("An unrecoverable error occurred during image generation.", error);
      throw new Error(`The AI model failed to generate an image. Details: ${errorMessage}`);
    }
  }
}

/**
 * Builds a narrative-style prompt for UGC-Style based on user settings
 * @param settings The user's selected settings from the control panel
 * @returns A narrative prompt string
 */
function buildUGCStylePrompt(settings: any): string {
  // Map shot composition to descriptive text
  const shotCompositionMap: { [key: string]: string } = {
    'product-only': 'The shot is a simple, clear photo focusing only on the product in an everyday setting.',
    'pov': 'The shot is from a first-person point of view (POV), looking down at the product as if being used by the viewer.',
    'selfie': 'The shot is a casual selfie-style photo, featuring a person happily holding and showcasing the product.',
    'candid': 'The shot is a candid action photo, capturing a person naturally using the product without posing for the camera.'
  };

  // Map photo style to descriptive text (revised for authentic UGC-style)
  const photoStyleMap: { [key: string]: string } = {
    'modern': 'The photo should look like it was taken on a modern smartphone in good, bright daylight. It should be crisp and clear, with everything in sharp focus.',
    'action': 'The photo should feel dynamic, with a slight, natural motion blur on the surrounding action to convey movement. The product itself should remain in focus, as if captured by a phone during a real activity.',
    'golden': 'The photo should be taken during the golden hour, with the warm, soft sunlight creating an atmospheric glow. The lighting should feel opportunistic and natural, not like a planned professional photoshoot.'
  };

  // Map background styles to descriptive text
  const backgroundStyleMap: { [key: string]: string } = {
    'cafe': 'Cafe',
    'at-home': 'At Home',
    'in-car': 'In a Car',
    'beach': 'Beach',
    'forest': 'Forest',
    'city': 'City',
    'garden': 'Garden'
  };

  // Determine shot composition description
  const shotCompositionDescription = shotCompositionMap[settings.shotComposition] || shotCompositionMap['product-only'];

  // Determine background description
  let backgroundDescription = ""; // Empty for auto (will result in "a background that suits the product")
  
  if (settings.backgroundTab === "presets" && settings.backgroundType !== "auto") {
    if (settings.backgroundStyle && backgroundStyleMap[settings.backgroundStyle]) {
      backgroundDescription = backgroundStyleMap[settings.backgroundStyle];
    } else if (settings.backgroundType === "studio") {
      backgroundDescription = "Indoor";
    } else if (settings.backgroundType === "outdoor") {
      backgroundDescription = "Outdoor";
    }
  } else if (settings.backgroundTab === "describe" && settings.backgroundDescription) {
    backgroundDescription = `custom environment described as: '${settings.backgroundDescription}'`;
  } else if (settings.backgroundTab === "upload" && settings.backgroundImage) {
    backgroundDescription = "user-provided background, ensuring the product is integrated in a realistic, non-professional manner";
  }

  // Determine photo style description
  const photoStyleDescription = photoStyleMap[settings.photoStyle] || photoStyleMap['modern'];

  // Build the narrative prompt following the revised template for authentic UGC-style
  const prompt = `Analyze the provided product image. Using the product, create an authentic, realistic, user-generated style photograph that looks like it was captured in-the-moment on a standard smartphone.

${shotCompositionDescription} The setting is a ${backgroundDescription} background that suits the product.

${photoStyleDescription} Crucially, the image must have a deep focus, meaning both the product and the background should be clear, as if taken by a phone camera. Avoid any artificial depth-of-field blur or "bokeh" effects. The final image should feel genuine and spontaneous, like a real customer photo with slight, natural imperfections.`;

  return prompt;
}

/**
 * Builds a narrative-style prompt for Virtual Models based on user settings
 * @param settings The user's selected settings from the control panel
 * @returns A narrative prompt string
 */
function buildVirtualModelsPrompt(settings: any): string {
  // Map camera presets to descriptive text for Virtual Models
  const cameraPresetMap: { [key: string]: string } = {
    'full-body': 'full body shot',
    'upper-body': 'upper body shot',
    'close-up-product': 'close-up shot on the product being worn/used'
  };

  // Map background styles to descriptive text (without "background" at the end)
  const backgroundStyleMap: { [key: string]: string } = {
    'white-seamless': 'a clean white seamless studio',
    'gradient-backdrop': 'a professional gradient',
    'textured-wall': 'a textured wall',
    'beach': 'a beach',
    'forest': 'a forest',
    'city': 'an urban cityscape',
    'garden': 'a garden',
    'cafe': 'a cozy cafe',
    'at-home': 'a home',
    'in-car': 'a car interior'
  };

  // Handle model characteristics
  let gender = "person";
  let ethnicity = "";
  let ageRange = "adult";

  if (settings.gender && settings.gender !== "any") {
    gender = settings.gender;
  }

  if (settings.ethnicity && settings.ethnicity !== "any") {
    ethnicity = ` of ${settings.ethnicity} ethnicity`;
  }

  if (settings.ageRange && settings.ageRange !== "any") {
    ageRange = settings.ageRange;
  }

  // Determine background description
  let backgroundDescription = ""; // Empty for auto (will result in "a background that suits the product")
  
  if (settings.backgroundTab === "presets" && settings.backgroundType !== "auto") {
    if (settings.backgroundStyle && backgroundStyleMap[settings.backgroundStyle]) {
      backgroundDescription = backgroundStyleMap[settings.backgroundStyle] + " ";
    } else if (settings.backgroundType === "studio") {
      backgroundDescription = "a professional studio ";
    } else if (settings.backgroundType === "outdoor") {
      backgroundDescription = "an outdoor environment ";
    }
  } else if (settings.backgroundTab === "describe" && settings.backgroundDescription) {
    backgroundDescription = `custom environment described as: '${settings.backgroundDescription}' `;
  } else if (settings.backgroundTab === "upload" && settings.backgroundImage) {
    backgroundDescription = "user-provided background, ensuring the model and product are seamlessly integrated ";
  }

  // Determine camera angle description
  let cameraAngleDescription = "same"; // Default for auto
  
  if (settings.cameraTab === "preset" && settings.cameraPreset) {
    cameraAngleDescription = cameraPresetMap[settings.cameraPreset] || settings.cameraPreset;
  } else if (settings.cameraTab === "describe" && settings.cameraDescription) {
    cameraAngleDescription = `shot framing described as: '${settings.cameraDescription}'`;
  } else if (settings.cameraTab === "auto") {
    cameraAngleDescription = "same angle as the original product shot";
  }

  // Build the narrative prompt following the template from prompt-guide-2.md
  const prompt = `Analyze the provided product image. Using the product, create a hyperrealistic and professional photograph intended for high-end e-commerce, lifestyle advertising, and social media campaigns.

The image must feature a photorealistic model who is a ${gender}${ethnicity}, within the ${ageRange} age range, interacting naturally with the product. The model should be placed in a ${backgroundDescription}background that suits the product.

The shot is captured from a ${cameraAngleDescription} to best showcase the product in use. The lighting must emulate a cinematic vibe with dramatic lighting, creating a high-end, aspirational mood. Employ a shallow depth of field, as if shot with an 85mm f/1.8 lens, to create a subtle background blur (bokeh) that keeps the focus on the model and product.

The final image must be of ultra-high resolution, with authentic, physically accurate textures on both the product and the model. The composition should be balanced and aesthetically pleasing.`;

  return prompt;
}

/**
 * Builds a narrative-style prompt for Virtual Photoshoot based on user settings
 * @param settings The user's selected settings from the control panel
 * @returns A narrative prompt string
 */
function buildVirtualPhotoshootPrompt(settings: any): string {
  // Map camera presets to descriptive text
  const cameraPresetMap: { [key: string]: string } = {
    'front-view': 'front',
    'side-view': 'side',
    'top-down': 'top-down',
    '45-angle': '45-degree',
    'close-up': 'close-up'
  };

  // Map background styles to descriptive text (without "background" at the end)
  const backgroundStyleMap: { [key: string]: string } = {
    'white-seamless': 'a clean white seamless studio',
    'gradient-backdrop': 'a professional gradient',
    'textured-wall': 'a textured wall',
    'beach': 'a beach',
    'forest': 'a forest',
    'city': 'an urban cityscape',
    'garden': 'a garden',
    'cafe': 'a cozy cafe',
    'at-home': 'a home',
    'in-car': 'a car interior'
  };

  // Determine background description
  let backgroundDescription = ""; // Empty for auto (will result in "a background that suits the product")
  
  if (settings.backgroundTab === "presets" && settings.backgroundType !== "auto") {
    if (settings.backgroundStyle && backgroundStyleMap[settings.backgroundStyle]) {
      backgroundDescription = backgroundStyleMap[settings.backgroundStyle] + " ";
    } else if (settings.backgroundType === "studio") {
      backgroundDescription = "a professional studio ";
    } else if (settings.backgroundType === "outdoor") {
      backgroundDescription = "an outdoor environment ";
    }
  } else if (settings.backgroundTab === "describe" && settings.backgroundDescription) {
    backgroundDescription = settings.backgroundDescription + " ";
  } else if (settings.backgroundTab === "upload" && settings.backgroundImage) {
    backgroundDescription = "provide background image in a realistic way so the ";
  }

  // Determine camera angle description
  let cameraAngleDescription = "same"; // Default for auto
  
  if (settings.cameraTab === "preset" && settings.cameraPreset) {
    cameraAngleDescription = cameraPresetMap[settings.cameraPreset] || settings.cameraPreset;
  } else if (settings.cameraTab === "describe" && settings.cameraDescription) {
    cameraAngleDescription = settings.cameraDescription;
  }

  // Build the narrative prompt (without aspect ratio)
  const prompt = `### Prompt:

Analyze the provide product image properly and using the product, create a hyperrealistic and professional product photograph intended for high-end e-commerce and marketing and advertising.

The product is set in a ${backgroundDescription}background that suits the product. The shot is captured in ${cameraAngleDescription} angle to best showcase the product's form and key details.

The lighting must emulate a cinematic vibe with dramatic lighting. Employ a shallow depth of field, as if shot with an 85mm f/1.8 lens, to create a subtle background blur (bokeh) that makes the product stand out.

The final image must be of ultra-high resolution, with authentic, physically accurate textures. The composition should be balanced and aesthetically pleasing.`;

  return prompt;
}

/**
 * Generic image generation function for various studio types
 * @param imageDataUrl A data URL string of the source image
 * @param prompt The prompt to guide the image generation (can be string or settings object for Virtual Photoshoot)
 * @param studioType The type of studio generation being performed
 * @param backgroundImageUrl Optional background image data URL
 * @returns A promise that resolves to a base64-encoded image data URL of the generated image
 */
export async function generateStudioImage(imageDataUrl: string, prompt: string | any, studioType?: string, backgroundImageUrl?: string): Promise<string> {
  console.log("🚀 generateStudioImage called with studioType:", studioType, "prompt type:", typeof prompt, "background:", !!backgroundImageUrl);
  
  const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format. Expected 'data:image/...;base64,...'");
  }
  const [, mimeType, base64Data] = match;

  const imagePart = {
    inlineData: { mimeType, data: base64Data },
  };

  // Prepare content parts array
  const contentParts: any[] = [imagePart];

  // Add background image if provided
  if (backgroundImageUrl) {
    const bgMatch = backgroundImageUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (bgMatch) {
      const [, bgMimeType, bgBase64Data] = bgMatch;
      const backgroundImagePart = {
        inlineData: { mimeType: bgMimeType, data: bgBase64Data },
      };
      contentParts.push(backgroundImagePart);
      console.log("🎨 Background image added to content parts");
    }
  }

  try {
    let finalPrompt: string;
    
    // If it's Virtual Photoshoot and prompt is a settings object, use the narrative prompt
    if (studioType === "virtual-photoshoot" && typeof prompt === "object") {
      console.log("🎯 VIRTUAL PHOTOSHOOT DETECTED - Building narrative prompt...");
      console.log("📋 Settings received:", prompt);
      finalPrompt = buildVirtualPhotoshootPrompt(prompt);
      console.log("📝 Generated prompt:", finalPrompt);
      
      // Log prompt data to console and optionally to server
      logPromptToFile(prompt, finalPrompt, finalPrompt);
    } else if (studioType === "virtual-models" && typeof prompt === "object") {
      console.log("🎯 VIRTUAL MODELS DETECTED - Building narrative prompt...");
      console.log("📋 Settings received:", prompt);
      finalPrompt = buildVirtualModelsPrompt(prompt);
      console.log("📝 Generated prompt:", finalPrompt);
      
      // Log prompt data to console and optionally to server
      logPromptToFile(prompt, finalPrompt, finalPrompt);
    } else if (studioType === "ugc-style" && typeof prompt === "object") {
      console.log("🎯 UGC-STYLE DETECTED - Building narrative prompt...");
      console.log("📋 Settings received:", prompt);
      finalPrompt = buildUGCStylePrompt(prompt);
      console.log("📝 Generated prompt:", finalPrompt);
      
      // Log prompt data to console and optionally to server
      logPromptToFile(prompt, finalPrompt, finalPrompt);
    } else {
      // Use the traditional string prompt for other cases
      finalPrompt = prompt as string;
      console.log("Generating studio image with prompt:", finalPrompt);
    }
    
    const textPart = { text: finalPrompt };
    contentParts.push(textPart);
    
    const response = await callGeminiWithRetryMultipleImages(contentParts);
    return processGeminiResponse(response);
  } catch (error) {
    console.error("Studio image generation failed:", error);
    throw error;
  }
}