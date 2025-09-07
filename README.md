This is an application designed to empower e-commerce businesses, marketers, and solo entrepreneurs by automating the creation of high-quality product visuals. Using the latest state-of-the-art AI image editing model Nao Banana (Gemini 2.5 Flash Image Preview) API, users can generate a complete suite of visuals—from clean catalog shots to complex, creative marketing images—from just one of their own product photos. 

## What technologies are used for this project?

Image Generation and Editing API
- gemini-2.5-flash-image-preview

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Setup

### Environment Variables

To avoid entering your API key every time you use the app, create a `.env.local` file in the root directory and add your Google GenAI API key:

```bash
# .env.local
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

**Note:** The `.env.local` file is already included in `.gitignore` to keep your API key secure.



