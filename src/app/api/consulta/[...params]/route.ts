import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// This function now handles POST requests
export async function POST(
  request: Request,
  { params }: { params: { params: string[] } }
) {
  // The [...params] still captures the module from the URL
  // e.g., /api/consulta/cpf -> params.params will be ['cpf']
  const [module] = params.params;

  if (!module) {
    return NextResponse.json(
      { detail: 'Módulo ausente na requisição.' },
      { status: 400 }
    );
  }

  let value: string;
  try {
    const body = await request.json();
    value = body.valor;
    if (!value) throw new Error("Missing value");
  } catch (error) {
    return NextResponse.json(
      { detail: 'Corpo da requisição inválido ou valor ausente.' },
      { status: 400 }
    );
  }

  const externalApiUrl = `https://oraculo-api-enso.onrender.com/consulta/${module}`;

  // Get credentials from environment variables
  const apiUser = process.env.API_USER;
  const apiPassword = process.env.API_PASSWORD;

  if (!apiUser || !apiPassword) {
    console.error("Credenciais da API não configuradas no ambiente.");
    return NextResponse.json(
        { detail: 'Erro interno do servidor: credenciais não configuradas.' },
        { status: 500 }
    );
  }

  const requestBody = {
    usuario: apiUser,
    senha: apiPassword,
    valor: value,
  };

  try {
    const apiRes = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(65000), 
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json().catch(() => ({ 
        detail: `A API externa respondeu com o status: ${apiRes.status}`
      }));
      return NextResponse.json(errorData, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return NextResponse.json(data);

  } catch (error: any) {
    if (error.name === 'AbortError') {
        return NextResponse.json({ detail: 'A API externa demorou muito para responder (timeout).' }, { status: 504 });
    }
    
    console.error('Erro no proxy da API:', error);
    return NextResponse.json(
      { detail: 'Erro de comunicação ao contatar a API externa.' },
      { status: 502 }
    );
  }
}
