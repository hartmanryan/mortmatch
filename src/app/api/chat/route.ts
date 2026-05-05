import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import fs from 'fs/promises';
import path from 'path';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, leadProfile, lenderName, campaignName } = await req.json();
  console.log("RECEIVED PAYLOAD IN API/CHAT:", { leadProfile, lenderName, campaignName });

  // Load the robust knowledge base directly from the markdown file based on the campaign
  const filename = campaignName === 'reverse' ? 'reverseknowledge.md' : 'knowledge.md';
  const knowledgePath = path.join(process.cwd(), filename);
  const knowledgeBase = await fs.readFile(knowledgePath, 'utf8');

  const systemPrompt = `
    ${knowledgeBase}
    
    You are speaking to a lead who just submitted this profile:
    ${JSON.stringify(leadProfile, null, 2)}
    
    They have been matched with a local mortgage expert named: ${lenderName || "our top lender"}.
    
    IMPORTANT INSTRUCTIONS FOR THIS CONVERSATION:
    1. In your first message, carefully analyze their profile data and explicitly name 1 or 2 specific mortgage programs (e.g., FHA, VA, Conventional, or Down Payment Assistance) they might be a great fit for based on their credit score, down payment, or military status.
    2. After highlighting these specific programs, enthusiastically suggest that it's a great idea to directly text ${lenderName || "their matched lender"} right now to explore these exact options and start their pre-approval.
    3. Keep your first message concise and punchy (3-4 sentences max).
    4. If they continue chatting, answer their questions using your knowledge base.
    5. Be incredibly supportive, knowledgeable, and empathetic.
    6. Never give exact daily interest rates (as they fluctuate).
    7. Always gently steer the conversation toward taking action by texting the lender.
  `;

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
