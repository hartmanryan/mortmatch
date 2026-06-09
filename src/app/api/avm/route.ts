import { NextResponse } from 'next/server';

// Hash function to generate a consistent value from a string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== 'string' || !address.trim()) {
      return NextResponse.json({ error: 'Property address is required.' }, { status: 400 });
    }

    const apiKey = process.env.REALESTATE_API_KEY;

    if (!apiKey) {
      console.warn("REALESTATE_API_KEY is not set. Using mock fallback AVM data.");
      
      // Hash-based consistent mock generator
      const hash = hashCode(address.trim().toLowerCase());
      
      // Generate a mock valuation between $250,000 and $950,000 in increments of $5,000
      const baseValue = 250000 + (hash % 141) * 5000;
      const confidence = 0.82 + (hash % 15) * 0.01; // 0.82 to 0.96
      const rangeLow = Math.round(baseValue * 0.93);
      const rangeHigh = Math.round(baseValue * 1.07);

      // Add a small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      return NextResponse.json({
        success: true,
        mocked: true,
        address: address.trim(),
        avm: {
          amount: baseValue,
          confidence_score: parseFloat(confidence.toFixed(2)),
          range_low: rangeLow,
          range_high: rangeHigh,
          valuation_date: new Date().toISOString().split('T')[0]
        }
      });
    }

    // Call RealEstateAPI
    console.log(`Calling RealEstateAPI.com AVM for address: ${address}`);
    
    // We try to call PropertyAvm bulk endpoint as it is verified to accept address lists,
    // or the single PropertyAvm if they support single POST with body.
    // Let's use PropertyAvm (single). If it errors, we can fallback to mock.
    const response = await fetch('https://api.realestateapi.com/v2/PropertyAvm', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        address: address.trim()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RealEstateAPI responded with error status ${response.status}:`, errorText);
      
      // Let's check if they require PropertyAvmBulk style or similar
      // In case of any API error, return the consistent mock data to prevent breaking the flow
      const hash = hashCode(address.trim().toLowerCase());
      const baseValue = 250000 + (hash % 141) * 5000;
      const confidence = 0.85;
      return NextResponse.json({
        success: true,
        mocked: true,
        error: `API returned status ${response.status}`,
        address: address.trim(),
        avm: {
          amount: baseValue,
          confidence_score: confidence,
          range_low: Math.round(baseValue * 0.93),
          range_high: Math.round(baseValue * 1.07),
          valuation_date: new Date().toISOString().split('T')[0]
        }
      });
    }

    const data = await response.json();

    // Check if the API request failed or returned a 404 mismatch even with HTTP status 200
    if (data.statusCode !== 200 || !data.data || !data.data.avm) {
      console.warn(`RealEstateAPI matched unsuccessfully. Error: ${data.errorMessage || data.statusMessage || "Missing data"}. Using mock fallback.`);
      const hash = hashCode(address.trim().toLowerCase());
      const baseValue = 250000 + (hash % 141) * 5000;
      const confidence = 0.85;
      return NextResponse.json({
        success: true,
        mocked: true,
        address: address.trim(),
        avm: {
          amount: baseValue,
          confidence_score: confidence,
          range_low: Math.round(baseValue * 0.93),
          range_high: Math.round(baseValue * 1.07),
          valuation_date: new Date().toISOString().split('T')[0]
        }
      });
    }

    // Standardize the API response properties to match what AvmCalculator expects
    const payload = data.data;
    const amount = parseFloat(payload.avm) || 0;
    const confidenceRaw = parseFloat(payload.confidence) || 85;
    // Normalize confidence percentage string to a decimal fraction (e.g. 80 -> 0.80)
    const confidence = confidenceRaw > 1 ? confidenceRaw / 100 : confidenceRaw;
    const rangeLow = parseFloat(payload.avmMin) || Math.round(amount * 0.9);
    const rangeHigh = parseFloat(payload.avmMax) || Math.round(amount * 1.1);
    const valDate = payload.lastUpdateDate ? payload.lastUpdateDate.split('T')[0] : new Date().toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      mocked: false,
      address: payload.label || address.trim(),
      avm: {
        amount,
        confidence_score: confidence,
        range_low: rangeLow,
        range_high: rangeHigh,
        valuation_date: valDate
      }
    });

  } catch (error: any) {
    console.error('AVM Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal AVM server error' }, { status: 500 });
  }
}
