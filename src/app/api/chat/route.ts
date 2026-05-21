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
  const messages = sanitizeMessages(rawMessages);

  const filename = campaignName === 'reverse' ? 'reverseknowledge.md' : 'knowledge.md';
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

    const campaignContext = (chatslug || topic)
      ? `CONTEXT: The user has arrived on a customized campaign page about: "${chatslug || topic}". The welcome greeting they saw was: "Looks like you're looking to learn more about ${chatslug || topic}?". They expect to chat specifically about this topic (${chatslug || topic}). Do NOT ask generic qualifying questions such as "are you looking to buy your first home, refinance, or something else" unless it is directly related to their topic. Immediately address, advise, and focus the conversation on "${chatslug || topic}".`
      : "";

    systemPrompt = `
      ${knowledgeBase}

      ${assistantRole}

      ${campaignContext}

      YOUR SPECIFIC CONVERSATION GOALS:
      1. Answer any mortgage-related questions the user asks clearly, concisely, and supportively. Keep the conversation going naturally, answering questions and educating the user first.
      2. Since the user is inquiring about "${chatslug || topic || "mortgages"}", tailor all replies, recommendations, and explanations to center around this topic.
      3. After the chat has naturally occurred a bit (e.g. after answering 1-2 questions and providing some educational value), your objective is to naturally let the person know that they can text the mortgage professional at their direct number: ${lenderPhone || "215-900-4065"} right now to talk directly with a real human.
      4. Tell them they can text that number for immediate assistance. Do NOT collect contact details, ask for their phone number, or present any forms. Just provide this phone number naturally in the flow of conversation.
      5. Do NOT refer to "our top lender", "your matched lender", or "matched lender" under any circumstances.
      6. If a representative name is provided (${lenderName || ""}), always refer to them directly by their name. Otherwise, refer to them as "a specialist" or "a mortgage specialist".
      7. Keep replies friendly, concise, and helpful.
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
