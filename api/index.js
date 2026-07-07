import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// Ingest multiple API keys and strip out unconfigured empty slots
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

// Graceful fallback to legacy single-key configuration for local development
if (GEMINI_KEYS.length === 0 && process.env.GEMINI_API_KEY) {
  GEMINI_KEYS.push(process.env.GEMINI_API_KEY);
}

// Context Engineering System Instructions Matrix
function buildSystemInstruction(contextType, language) {
  let baseInstruction = '';
  
  if (contextType === 'dastavez') {
    baseInstruction = `You are the "Dastavez Kendra" (Document Desk) for SevaMitra AI. Your sole task is to analyze the user's civic or administrative request and produce an exhaustive, step-by-step checklist of mandatory identification documents (e.g., Aadhaar, PAN, Voter ID, Ration Card), application forms, certificate sheets, and address or income proofs required for that specific service. Format your response strictly as a clean, structured Markdown checkbox list (using - [ ]). Do not write long narrative paragraphs; provide clear, actionable checklist points.`;
  } else if (contextType === 'shikayat') {
    baseInstruction = `You are the "Shikayat Kendra" (Grievance Desk) for SevaMitra AI. Your task is to transform raw, informal citizen complaints about public utilities or infrastructure issues into highly structured, formal municipal grievance letters. You must explicitly determine and name the probable responsible government department context (e.g., Municipal Corporation, PWD, Electricity Board, Jal Board). Format the output cleanly with formal letter sections: To, Subject, Body of Complaint, and an Expected Resolution Timeline.`;
  } else {
    baseInstruction = `You are the "Seva Kendra" (Information Desk) for SevaMitra AI. Act as a high-trust, authoritative public utility advisor. Your objective is to simplify complex government policy frameworks, welfare schemes (such as PM-Kisan, Ayushman Bharat, MGNREGA), and public services into clear, accessible, and approachable summaries. Explicitly break down eligibility parameters, core benefits, application steps, and target timelines using clean Markdown bullet points.`;
  }

  // Absolute translation and behavior guardrails
  return `${baseInstruction}\n\nCRITICAL MANDATE: You MUST formulate your entire response, including all headings, checklist markers, descriptions, and labels, using the exact language script specified by the citizen: ${language}. Maintain absolute factual reliability. Do not hallucinate guidelines or deadlines. Set formatting using clear Markdown layout rules.`;
}

// Liveness Health Check Probe
app.get('/api/health', (req, res) => {
  return res.status(200).json({ 
    status: 'healthy', 
    service: 'SevaMitra AI Core Engine' 
  });
});

// Main Token-Rotating Content Generation Pipeline
app.post('/api/generate', async (req, res) => {
  const { prompt, contextType = 'seva', language = 'Hindi' } = req.body;

  // Rigid Structural Payload Validation Gate
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: "Validation failed: 'prompt' is required and must be a non-empty string."
    });
  }

  if (GEMINI_KEYS.length === 0) {
    console.error('[SevaMitra API] Operation aborted: Zero API keys are provisioned.');
    return res.status(500).json({
      error: 'AI generation failed. No valid API keys are configured on the server environment.'
    });
  }

  const systemInstruction = buildSystemInstruction(contextType, language);
  let responseText = null;
  let lastEncounteredError = null;

  // Sequential Fault-Tolerant Key Rotation Loop
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const activeKey = GEMINI_KEYS[i];
    try {
      // Initialize an isolated engine instance for the active key slot
      const ai = new GoogleGenAI({ apiKey: activeKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt.trim(),
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.25 // Low temperature prevents hallucinations and ensures deterministic output
        }
      });

      if (response && response.text) {
        responseText = response.text;
        break; // Success achieved, exit the fallback loop immediately
      }
    } catch (err) {
      console.warn(`[SevaMitra API] Warning: Key slot index ${i + 1} exhausted/rejected. Switching to backup...`);
      lastEncounteredError = err;
    }
  }

  // Response Dispatch Decision Gate
  if (responseText !== null) {
    return res.status(200).json({ success: true, text: responseText });
  }

  // Exhaustion Error Fallback Block
  console.error('[SevaMitra API] Critical: All configured API key slots are exhausted.', lastEncounteredError);
  return res.status(500).json({
    error: 'AI generation gateway is currently fully occupied. Please retry your request shortly.'
  });
});

// Catch-all route handler for undefined API entry points
app.all('/api/*', (req, res) => {
  return res.status(404).json({ error: 'Requested API endpoint does not exist.' });
});

// Serverless platform execution boundary encapsulation
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[SevaMitra Engine] Local debugging engine running on link http://localhost:${PORT}`);
  });
}

export default app;
