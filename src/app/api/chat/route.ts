import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
function sanitizeMessages(messages: any[]): any[] {
  if (!Array.isArray(messages)) return [];

  return messages.map(msg => {
    const role = msg.role;
    
    if (role === 'system') {
      return {
        role: 'system',
        content: typeof msg.content === 'string' ? msg.content : ''
      };
    }

    if (role === 'user') {
      let textContent = "";
      if (typeof msg.content === 'string') {
        textContent = msg.content;
      } else if (Array.isArray(msg.parts)) {
        textContent = msg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text || '')
          .join('');
      } else if (typeof msg.text === 'string') {
        textContent = msg.text;
      }
      return {
        role: 'user',
        content: textContent
      };
    }

    if (role === 'assistant') {
      let textContent = "";
      if (typeof msg.content === 'string') {
        textContent = msg.content;
      } else if (Array.isArray(msg.parts)) {
        textContent = msg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text || '')
          .join('');
      } else if (typeof msg.text === 'string') {
        textContent = msg.text;
      }

      const toolCalls: any[] = [];
      if (Array.isArray(msg.parts)) {
        msg.parts.forEach((p: any) => {
          if (p.type === 'tool-call') {
            toolCalls.push({
              type: 'tool-call',
              toolCallId: p.toolCallId,
              toolName: p.toolName,
              args: p.args
            });
          }
        });
      }

      if (toolCalls.length > 0) {
        const contentParts: any[] = [];
        if (textContent) {
          contentParts.push({ type: 'text', text: textContent });
        }
        contentParts.push(...toolCalls);
        return {
          role: 'assistant',
          content: contentParts
        };
      }

      return {
        role: 'assistant',
        content: textContent
      };
    }

    if (role === 'tool') {
      const toolResults: any[] = [];
      if (Array.isArray(msg.parts)) {
        msg.parts.forEach((p: any) => {
          if (p.type === 'tool-result') {
            toolResults.push({
              type: 'tool-result',
              toolCallId: p.toolCallId,
              toolName: p.toolName,
              result: p.result
            });
          }
        });
      }
      if (Array.isArray(msg.content)) {
        msg.content.forEach((c: any) => {
          if (c.type === 'tool-result') {
            toolResults.push({
              type: 'tool-result',
              toolCallId: c.toolCallId,
              toolName: c.toolName,
              result: c.result
            });
          }
        });
      }
      
      if (toolResults.length === 0) {
        const toolCallId = msg.toolCallId || 'unknown';
        const toolName = msg.toolName || 'unknown';
        let result = msg.result;
        if (result === undefined) {
          try {
            result = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
          } catch (e) {
            result = msg.content;
          }
        }
        toolResults.push({
          type: 'tool-result',
          toolCallId,
          toolName,
          result
        });
      }

      return {
        role: 'tool',
        content: toolResults
      };
    }

    return {
      role: 'user',
      content: typeof msg.content === 'string' ? msg.content : ''
    };
  });
}

export async function POST(req: Request) {
  const { messages: rawMessages, leadProfile, lenderName, lenderPhone, campaignName, leadId, refId, topic, chatslug } = await req.json();
  console.log("=== API CHAT ROUTE INCOMING BODY ===", { campaignName, topic, chatslug, lenderName, lenderPhone, rawMessagesLength: rawMessages?.length });
  console.log("=== API CHAT ROUTE RAW MESSAGES ===", JSON.stringify(rawMessages, null, 2));
  const messages = sanitizeMessages(rawMessages);

  // Fallback: extract topic/chatslug from initial message if not provided in the body
  let detectedTopic = topic || chatslug || "";
  if (!detectedTopic && messages.length > 0) {
    const firstMsg = messages.find(m => m.role === 'assistant');
    if (firstMsg && typeof firstMsg.content === 'string') {
      const match = firstMsg.content.match(/learn more about ([^?]+)\?/i);
      if (match && match[1]) {
        detectedTopic = match[1].trim();
      }
    }
  }

  const normalizedTopic = (detectedTopic || "").toLowerCase();
  const normalizedCampaign = (campaignName || "").toLowerCase();

  let filename = 'knowledge.md';

  if (
    normalizedCampaign === 'reverse' ||
    normalizedTopic.includes('reverse') ||
    normalizedTopic.includes('hecm') ||
    normalizedTopic.includes('senior')
  ) {
    filename = 'reverseknowledge.md';
  } else if (
    normalizedCampaign === 'self-employed' ||
    normalizedCampaign === 'selfemployed' ||
    normalizedTopic.includes('self-employed') ||
    normalizedTopic.includes('self employed') ||
    normalizedTopic.includes('1099') ||
    normalizedTopic.includes('bank statement') ||
    normalizedTopic.includes('freelance') ||
    normalizedTopic.includes('business owner') ||
    normalizedTopic.includes('contractor')
  ) {
    filename = 'selfemployedknowledge.md';
  } else if (
    normalizedCampaign === 'refinance' ||
    normalizedCampaign === 'refi' ||
    normalizedTopic.includes('refinance') ||
    normalizedTopic.includes('refi') ||
    normalizedTopic.includes('lower payment') ||
    normalizedTopic.includes('lower rate') ||
    normalizedTopic.includes('cash out') ||
    normalizedTopic.includes('cash-out') ||
    normalizedTopic.includes('rate-and-term') ||
    normalizedTopic.includes('rate and term')
  ) {
    filename = 'refinanceknowledge.md';
  } else if (
    normalizedCampaign === 'first-time' ||
    normalizedCampaign === 'firsttime' ||
    normalizedTopic.includes('first') ||
    normalizedTopic.includes('dpa') ||
    normalizedTopic.includes('assistance') ||
    normalizedTopic.includes('down payment') ||
    normalizedTopic.includes('low-down') ||
    normalizedTopic.includes('zero-down') ||
    normalizedTopic.includes('low down') ||
    normalizedTopic.includes('zero down')
  ) {
    filename = 'firsttimeknowledge.md';
  }

  console.log(`=== API CHAT ROUTE KNOWLEDGE BASE SELECTED === Filename: ${filename} (detectedTopic: "${detectedTopic}", campaignName: "${campaignName}")`);

  const knowledgePath = path.join(process.cwd(), 'src', 'data', filename);
  let knowledgeBase = "";
  try {
    knowledgeBase = await fs.readFile(knowledgePath, 'utf8');
  } catch (e) {
    console.warn("Could not read knowledge base", e);
  }

  let systemPrompt = "";
  if (campaignName === 'connect') {
    const assistantRole = lenderName 
      ? `You are Mort, a friendly, professional AI mortgage assistant. You are the assistant to ${lenderName}.`
      : `You are Mort, a friendly, professional, and helpful AI mortgage assistant.`;

    const campaignContext = detectedTopic
      ? `CONTEXT: The user has arrived on a customized campaign page about: "${detectedTopic}".
- The welcome greeting they saw on the page was: "Hi I'm Mort, a well trained mortgage AI. Looks like you're looking to learn more about ${detectedTopic}?".
- The user's first response (e.g. "yes", "sure", "ok", or details they typed) is directly replying to this welcome greeting.
- You MUST acknowledge this topic ("${detectedTopic}") immediately in your response and keep the conversation focused on it.
- Do NOT ask generic qualifying questions (like "Are you a first-time homebuyer, looking to refinance, or something else?") if the topic/chatslug already specifies what they want (e.g. if the topic/chatslug is about "Reverse Mortgages" or "First-Time Buyer Programs", you already know what they want!).
- Instead, dive directly into discussing "${detectedTopic}" by providing helpful information, asking relevant follow-up questions specific to that topic, and helping them understand how it works.
- For example, if they confirm they want to learn about a reverse mortgage for a property (e.g., "123 Main Street"), explain the benefits (like no monthly payments, FHA insurance protection) and check if they or their spouse is 62+ years old.`
      : "";

    systemPrompt = `
      ${knowledgeBase}

      ${assistantRole}

      ${campaignContext}

      YOUR SPECIFIC CONVERSATION GOALS:
      1. Answer any mortgage-related questions the user asks clearly, concisely, and supportively. Keep the conversation going naturally, answering questions and educating the user first.
      2. Since the user is inquiring about "${detectedTopic || "mortgages"}", tailor all replies, recommendations, and explanations to center around this topic.
      3. After the chat has naturally occurred a bit (e.g. after answering 1-2 questions and providing some educational value), your objective is to naturally let the person know that they can text the mortgage professional at their direct number: ${lenderPhone || "215-900-4065"} right now to talk directly with a real human.
      4. Tell them they can text that number for immediate assistance. Do NOT collect contact details, ask for their phone number, or present any forms. Just provide this phone number naturally in the flow of conversation.
      5. Do NOT refer to "our top lender", "your matched lender", or "matched lender" under any circumstances.
      6. If a representative name is provided (${lenderName || ""}), always refer to them directly by their name. Otherwise, refer to them as "a specialist" or "a mortgage specialist".
      7. Keep replies friendly, concise, and helpful.
      8. You are a senior expert mortgage advisor. For advanced concepts, regulations, or specific details not explicitly spelled out in the loaded knowledge base (e.g. Non-QM guidelines, DTI thresholds, conforming loan limits, or ARM adjustment frequencies), you are fully authorized and expected to draw upon your extensive pre-trained knowledge of US residential mortgage guidelines and regulations to provide accurate, consultative, and compliant advice.

      CRITICAL OVERRIDE FOR CONNECT CAMPAIGN:
      - This is a direct chat session, NOT a questionnaire. There is NO pre-submitted lead profile or numbers.
      - Ignore any rules in the knowledge base that mention "Acknowledge their Profile" or "Look at the user's hidden profile submission".
      - Instead, in your very first response, you MUST acknowledge the landing page topic "${detectedTopic}" immediately and directly address the user's initial confirmation regarding this topic.
      - Maintain context of the initial welcome greeting ("Hi I'm Mort... Looks like you're looking to learn more about ${detectedTopic}?") and the user's confirmation ("yes" or similar). 
      - Start by saying something like: "Great! Let's talk about the ${detectedTopic}..." or "Awesome, I'm glad you want to learn more about ${detectedTopic}!" and then immediately provide helpful information or ask a specific question relevant to that topic.
    `;
  } else {
    systemPrompt = `
      ${knowledgeBase}
      
      You are Mort, a highly consultative expert mortgage advisor.
      The user has just completed a questionnaire and submitted this profile:
      ${JSON.stringify(leadProfile, null, 2)}
      
      They are browsing the page of: ${lenderName || "a mortgage specialist"}.
      
      IMPORTANT INSTRUCTIONS FOR THIS CONVERSATION:
      1. Do NOT push for a meeting immediately. Instead, in your first reply, analyze the profile and give 1‑2 consultative thoughts (e.g., suggest FHA, VA, or Reverse Mortgage).
      2. Ask an engaging follow‑up question about timeline, concerns, or goals.
      3. Guide the conversation toward scheduling a call: politely ask the user for a convenient time (e.g., “What time tomorrow works for a quick call with ${lenderName || 'a specialist'}?”) and confirm the agreed time.
      4. Once the user provides a specific time, respond with a friendly confirmation and include that time in the chat summary.
      5. If the user explicitly AGREES to connect or get pre-approved, you MUST call the 'requestMeeting' tool immediately. Do NOT include the phone number in your text response.
      6. Never guarantee specific interest rates, but you can speak generally about trends.
      7. Do not provide legal or financial advice.
      8. You are a senior expert mortgage advisor. For advanced concepts, regulations, or specific details not explicitly spelled out in the loaded knowledge base (e.g. Non-QM guidelines, DTI thresholds, conforming loan limits, or ARM adjustment frequencies), you are fully authorized and expected to draw upon your extensive pre-trained knowledge of US residential mortgage guidelines and regulations to provide accurate, consultative, and compliant advice.
    `;
  }

  let activeLeadId = leadId;
  const tools: Record<string, any> = {};

  if (campaignName === 'connect') {
    // No tools are needed for the connect campaign anymore as Mort simply gives out the cell phone number directly.
  } else {
    tools.requestMeeting = tool({
      description: 'Call this tool to request/schedule a meeting/callback between the user and their matched lender.',
      parameters: z.object({
        meetingTime: z.string().describe('The agreed meeting time, e.g. "tomorrow at 3pm"')
      }),
      execute: async ({ meetingTime }: { meetingTime: string }) => {
        return { success: true, meetingTime };
      }
    } as any);
  }

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
    maxSteps: 5,
    tools,
    onFinish: async (event: any) => {
      const text = event.text || "";
      if (activeLeadId) {
        try {
          const allMessages = [...messages, { role: 'assistant', content: text }];
          await prisma.lead.update({
            where: { id: activeLeadId },
            data: { chatTranscript: allMessages }
          });
        } catch (e) {
          console.error("Failed to save chat transcript", e);
        }
      }
    }
  } as any);

  return result.toUIMessageStreamResponse();
}
