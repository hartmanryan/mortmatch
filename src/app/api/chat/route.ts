import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, leadProfile, lenderName, campaignName, leadId } = await req.json();

  const filename = campaignName === 'reverse' ? 'reverseknowledge.md' : 'knowledge.md';
  const knowledgePath = path.join(process.cwd(), 'src', 'data', filename);
  let knowledgeBase = "";
  try {
    knowledgeBase = await fs.readFile(knowledgePath, 'utf8');
  } catch (e) {
    console.warn("Could not read knowledge base", e);
  }

  const systemPrompt = `
    ${knowledgeBase}
    
    You are Mort, a highly consultative expert mortgage advisor.
    The user has just completed a questionnaire and submitted this profile:
    ${JSON.stringify(leadProfile, null, 2)}
    
    They have been matched with a local mortgage expert named: ${lenderName || "our top lender"}.
    
    IMPORTANT INSTRUCTIONS FOR THIS CONVERSATION:
    1. Do NOT push for a meeting immediately. Instead, in your first reply, analyze the profile and give 1‑2 consultative thoughts (e.g., suggest FHA, VA, or Reverse Mortgage).
    2. Ask an engaging follow‑up question about timeline, concerns, or goals.
    3. Guide the conversation toward scheduling a call: politely ask the user for a convenient time (e.g., “What time tomorrow works for a quick call with ${lenderName || 'your lender'}?”) and confirm the agreed time.
    4. Once the user provides a specific time, respond with a friendly confirmation and include that time in the chat summary.
    5. If the user explicitly AGREES to connect or get pre-approved, you MUST call the 'requestMeeting' tool immediately. Do NOT include the phone number in your text response.
    6. Never guarantee specific interest rates, but you can speak generally about trends.
    7. Do not provide legal or financial advice.
  `;

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      if (leadId) {
        try {
          const allMessages = [...messages, { role: 'assistant', content: text }];
          await prisma.lead.update({
            where: { id: leadId },
            data: { chatTranscript: allMessages }
          });
        } catch (e) {
          console.error("Failed to save chat transcript", e);
        }
      }
    }
  });

  return result.toUIMessageStreamResponse();
}
