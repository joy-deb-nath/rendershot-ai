const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Function to display the final narrative prompt in a formatted way
function displayFinalPrompt(settings, narrativePrompt, finalPrompt) {
  console.log("\n" + "=".repeat(80));
  console.log("🎯 VIRTUAL PHOTOSHOOT - NARRATIVE PROMPT GENERATION");
  console.log("=".repeat(80));
  
  console.log("\n📋 USER SETTINGS RECEIVED:");
  console.log(JSON.stringify(settings, null, 2));
  
  console.log("\n📝 GENERATED NARRATIVE PROMPT:");
  console.log(narrativePrompt);
  
  console.log("\n📊 PROMPT STATISTICS:");
  console.log(`- Total characters: ${finalPrompt.length}`);
  console.log(`- Total lines: ${finalPrompt.split('\n').length}`);
  console.log(`- Background type: ${settings.backgroundTab || 'auto'}`);
  console.log(`- Camera type: ${settings.cameraTab || 'auto'}`);
  console.log(`- Aspect ratio: ${settings.aspectRatio || 'square'}`);
  
  console.log("\n" + "=".repeat(80));
  console.log("✅ PROMPT READY FOR API CALL");
  console.log("=".repeat(80) + "\n");
}

// Endpoint to receive and display prompt data
app.post('/api/log-prompt', (req, res) => {
  try {
    const { settings, narrativePrompt, finalPrompt } = req.body;
    
    displayFinalPrompt(settings, narrativePrompt, finalPrompt);
    
    res.json({ success: true, message: 'Prompt logged to terminal successfully' });
  } catch (error) {
    console.error('Error logging prompt:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Prompt logging server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Prompt logging server running on http://localhost:${PORT}`);
  console.log(`📝 Ready to receive prompt data from your React app`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});
