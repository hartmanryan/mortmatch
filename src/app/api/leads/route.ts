import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';

const resend = new Resend(process.env.RESEND_API_KEY || 're_test123'); // Dummy fallback if not set

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, contact, campaign, refId } = body;

    // Parse the new dictionary format using the step IDs
    const situation = answers["situation"] || "Unknown";
    const priceRange = answers["priceRange"] || "Unknown";
    const employment = answers["employment"] || "Unknown";
    const downPayment = answers["downPayment"] || "Unknown";
    const creditScore = answers["creditScore"] || "Unknown";
    
    // Parse dynamic campaign fields
    const timeline = answers["timeline"] || null;
    const location = answers["location"] || null;

    // Split name into first/last safely
    const nameParts = contact.name.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Find the associated lender (if refId exists)
    let lender = null;
    if (refId) {
      lender = await prisma.lender.findUnique({ where: { clerkId: refId } });
    }
    
    // Default to organic admin user if no ref provided or lender not found
    if (!lender) {
      lender = await prisma.lender.findUnique({ where: { email: 'propknocks@gmail.com' } });
    }

    // 1. Save to Database using Prisma
    let lead;
    try {
      lead = await prisma.lead.create({
        data: {
          firstName,
          lastName,
          email: contact.email || `${contact.phone.replace(/\D/g, '') || 'unknown'}@noemail.com`,
          phone: contact.phone || 'Unknown',
          street: contact.street || null,
          city: contact.city || null,
          state: contact.state || null,
          situation,
          priceRange,
          employment,
          downPayment,
          creditScore,
          campaign: campaign || "general",
          timeline,
          location,
          rawAnswers: answers, // Save the complete dynamic answers object
          status: 'NEW',
        },
      });
      console.log("Lead created successfully:", lead.id);
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return NextResponse.json({ error: 'Failed to save lead to database.' }, { status: 500 });
    }

    // 2. Return lender info so the frontend can start the AI chat
    let lenderPhone = lender?.phone || null;
    let lenderName = lender ? `${lender.firstName || ''} ${lender.lastName || ''}`.trim() : null;

    // 3. Send Email Notification via Resend (fire and forget)
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")) {
        const notifyEmail = lender?.email || process.env.ADMIN_EMAIL || 'propknocks@gmail.com';
        await resend.emails.send({
          from: 'Mortmatch Leads <onboarding@resend.dev>',
          to: notifyEmail,
          subject: `New Lead: ${firstName} ${lastName} (${campaign})`,
          html: `
            <h2>New Mortgage Lead Received!</h2>
            <p><strong>Campaign:</strong> ${campaign}</p>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Address:</strong> ${contact.street || 'N/A'}, ${contact.city || 'N/A'}, ${contact.state || 'N/A'}</p>
            <hr />
            <h3>Lead Questionnaire Answers:</h3>
            ${Object.entries(answers).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
          `,
        });
      }
    } catch (emailError) {
      console.error("Resend Error:", emailError);
    }

    return NextResponse.json(
      { success: true, leadId: lead.id, lenderPhone, lenderName },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to process lead.' }, { status: 500 });
  }
}
