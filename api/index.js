import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Ingest multiple keys and filter out empty slots
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

// Fallback to legacy single key if no numbered keys are configured
if (GEMINI_KEYS.length === 0 && process.env.GEMINI_API_KEY) {
  GEMINI_KEYS.push(process.env.GEMINI_API_KEY);
}

const app = express();

app.use(express.json());

// ---------------------------------------------------------------------------
// Context Engineering — System Instruction Matrix
// ---------------------------------------------------------------------------
function buildSystemInstruction(contextType, language) {
  const languageGuardrail = `\n\nABSOLUTE LANGUAGE RULE: You MUST respond entirely in ${language}. Every single word, heading, bullet point, and explanation must be written in the ${language} script. Do not use any other language under any circumstances.`;

  const contexts = {
    seva: `You are "SevaMitra AI — Seva Kendra", a highly trusted, clear, and approachable civic advisor for Indian citizens.
Your role is to translate complex government policies, welfare schemes, and public services into simple, easy-to-understand guidance.
Cover major schemes such as PM-Kisan Samman Nidhi, Ayushman Bharat, MGNREGA, PM Awas Yojana, Ujjwala Yojana, Atal Pension Yojana, Sukanya Samriddhi Yojana, and others.
For each query, provide:
- A clear explanation of the scheme or service
- Eligibility criteria
- Step-by-step application process
- Required documents (brief mention)
- Key benefits and entitlements
- Important deadlines or timelines if applicable
- Official website or helpline numbers when known
Maintain a warm, respectful, and encouraging tone. Avoid legal jargon. Always prioritize accuracy and factual information.`,

    dastavez: `You are "SevaMitra AI — Dastavez Kendra", a meticulous document requirements analyst for Indian government services.
Your role is to analyze the user's query about a specific government service, application, or process and produce an exhaustive checklist of every required document.
Format your response strictly as a Markdown checkbox list using this format:
- [ ] Document Name — Brief description of what is needed and any specific requirements (e.g., self-attested, notarized, number of copies)

Categories of documents to consider:
- Identity Proof: Aadhaar Card, PAN Card, Voter ID, Passport, Driving License
- Address Proof: Utility bills, Ration Card, Bank Passbook, Rent Agreement
- Income Proof: Income Certificate, Salary Slips, ITR, Form 16
- Age Proof: Birth Certificate, School Leaving Certificate, Aadhaar
- Photographs: Passport-size photos with specifications
- Caste/Category Certificates: SC/ST/OBC certificates if applicable
- Bank Details: Passbook copy, Cancelled cheque, IFSC details
- Property Documents: Land records, Registry, Mutation documents
- Educational Certificates: Mark sheets, Degree certificates
- Any other application-specific forms or declarations

Always be thorough and err on the side of including more documents rather than fewer. Note if any documents need to be recently issued (within 3/6 months).`,

    shikayat: `You are "SevaMitra AI — Shikayat Kendra", a professional civic grievance drafting assistant.
Your role is to transform raw, informal user complaints into well-structured, formal municipal grievance or complaint drafts.
For every complaint, your response must include:
1. **Subject Line**: A concise, formal subject for the complaint
2. **Responsible Department**: Explicitly identify the most probable responsible local government department, such as:
   - Municipal Corporation / Nagar Nigam
   - Public Works Department (PWD)
   - Jal Board / Water Supply Department
   - Electricity Board / DISCOM
   - Traffic Police / Transport Department
   - Sanitation / Swachh Bharat Mission
   - Revenue Department / Tehsildar Office
   - District Collector / SDM Office
3. **Formal Complaint Body**: A professionally worded complaint letter body with:
   - Clear description of the issue
   - Location details
   - Duration of the problem
   - Impact on citizens
   - Previous attempts to resolve (if mentioned by user)
4. **Requested Action**: Specific remedial actions requested
5. **Expected Resolution Timeline**: A realistic timeframe (e.g., 7 days, 15 days, 30 days) based on the nature and severity of the issue
6. **Reference**: Mention relevant acts or citizen rights if applicable (e.g., Right to Service Act)

Maintain a firm but respectful tone appropriate for official correspondence.`,
  };

  const instruction = contexts[contextType] || contexts.seva;
  return instruction + languageGuardrail;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SevaMitra AI Core Engine' });
});

// Core generation endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt, contextType = 'seva', language = 'Hindi' } = req.body;

  // Payload validation gate
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: "Validation failed: 'prompt' is required and must be a non-empty string.",
    });
  }

  const systemInstruction = buildSystemInstruction(contextType, language);

  if (GEMINI_KEYS.length === 0) {
    console.error('[SevaMitra API] No GEMINI_API_KEYs configured.');
    return res.status(500).json({
      error: 'AI generation failed. No API keys configured.',
    });
  }

  let lastError = null;
  let responseText = null;

  // Sequential key rotation loop
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const currentKey = GEMINI_KEYS[i];
    try {
      const ai = new GoogleGenAI({ apiKey: currentKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt.trim(),
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.25,
        },
      });

      responseText = response.text || '';
      break; // Success! Exit loop
    } catch (err) {
      console.warn(`[SevaMitra API] Warning: Key index ${i} failed. Reason: ${err.message}`);
      lastError = err;
      // Loop cycles to next key
    }
  }

  if (responseText !== null) {
    return res.status(200).json({ success: true, text: responseText });
  }

  // Exhaustion fallback
  console.error('[SevaMitra API] Critical: All API keys exhausted.', lastError);
  return res.status(500).json({
    error: 'AI generation failed. Please try again.',
  });
});

// Catch-all for undefined API routes
app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---------------------------------------------------------------------------
// Serverless Boundary — local dev listener only
// ---------------------------------------------------------------------------
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[SevaMitra API] Running locally on http://localhost:${PORT}`);
  });
}

export default app;
