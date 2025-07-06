import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { params: string[] } }
) {
  // The [...params] route segment captures all parts of the path after /api/consulta/
  // For a URL like /api/consulta/cpf/12345, params.params will be ['cpf', '12345']
  const [module, value] = params.params;

  if (!module || !value) {
    return NextResponse.json(
      { detail: 'Módulo ou valor ausente na requisição.' },
      { status: 400 }
    );
  }

  const externalApiUrl = `https://oraculo-api-enso.onrender.com/consulta/${module}/${value}`;

  try {
    // We use a timeout to prevent the serverless function from hanging for too long
    // if the external API is unresponsive. 65s is a bit more than the API's own timeout.
    const apiRes = await fetch(externalApiUrl, {
      signal: AbortSignal.timeout(65000), 
    });

    // If the external API returns an error status, we forward it
    if (!apiRes.ok) {
      const errorData = await apiRes.json().catch(() => ({ 
        detail: `A API externa respondeu com o status: ${apiRes.status}`
      }));
      return NextResponse.json(errorData, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return NextResponse.json(data);

  } catch (error: any) {
    // This catches network errors, DNS issues, or the timeout from AbortSignal
    if (error.name === 'AbortError') {
        return NextResponse.json({ detail: 'A API externa demorou muito para responder (timeout).' }, { status: 504 });
    }
    
    console.error('Erro no proxy da API:', error);
    return NextResponse.json(
      { detail: 'Erro de comunicação ao contatar a API externa.' },
      { status: 502 } // 502 Bad Gateway is appropriate here
    );
  }
}
