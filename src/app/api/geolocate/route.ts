import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const IP2LOCATION_API_KEY = 'EE859C0C54AD4CBC62A3376C848A5DA7';

export async function POST(request: Request) {
  let ip: string;
  try {
    const body = await request.json();
    ip = body.ip;
    if (!ip) throw new Error("Missing IP address");
  } catch (error) {
    return NextResponse.json(
      { detail: 'Corpo da requisição inválido ou endereço de IP ausente.' },
      { status: 400 }
    );
  }

  // Basic IP validation
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (!ipRegex.test(ip)) {
      return NextResponse.json({ detail: 'Endereço de IP inválido.' }, { status: 400 });
  }

  const externalApiUrl = `https://api.ip2location.io/?key=${IP2LOCATION_API_KEY}&ip=${ip}`;

  try {
    const apiRes = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000), 
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("IP2Location API Error:", errorText);
      return NextResponse.json({ detail: `A API externa respondeu com o status: ${apiRes.status}` }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    if(data.error_message) {
        return NextResponse.json({ detail: `Erro da API de geolocalização: ${data.error_message}` }, { status: 400 });
    }
    
    // We will just pass the JSON object as a string for the AI to analyze
    const formattedResult = JSON.stringify(data, null, 2);

    return NextResponse.json({ resultado: formattedResult });

  } catch (error: any) {
    if (error.name === 'AbortError') {
        return NextResponse.json({ detail: 'A API de geolocalização demorou muito para responder.' }, { status: 504 });
    }
    
    console.error('Erro no proxy da API de geolocalização:', error);
    return NextResponse.json(
      { detail: 'Erro de comunicação ao contatar a API de geolocalização.' },
      { status: 502 }
    );
  }
}
