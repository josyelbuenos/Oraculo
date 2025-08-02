
'use server';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Usuário e senha são obrigatórios.' }, { status: 400 });
    }

    // New authentication logic using the external API
    const externalApiUrl = `https://oraculo-api-enso.onrender.com/usuario-por-senha/${password}`;

    const apiRes = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000), 
    });

    if (!apiRes.ok) {
        // If the API returns a 404 or other error, it's likely an invalid password
        if (apiRes.status === 404) {
            return NextResponse.json({ success: false, message: 'Usuário ou senha inválidos.' }, { status: 401 });
        }
        const errorData = await apiRes.json().catch(() => ({}));
        const detail = errorData.detail || `A API de autenticação respondeu com o status: ${apiRes.status}`;
        return NextResponse.json({ success: false, message: detail }, { status: apiRes.status });
    }

    const apiUserData = await apiRes.json();

    // Check if the returned username matches the one provided (case-insensitive)
    if (apiUserData.usuario && apiUserData.usuario.toLowerCase() === username.toLowerCase()) {
      // Return success without the password or any other sensitive info like the gemini_key
      return NextResponse.json({ success: true, user: { usuario: apiUserData.usuario } });
    } else {
      return NextResponse.json({ success: false, message: 'Usuário ou senha inválidos.' }, { status: 401 });
    }

  } catch (error: any) {
    if (error.name === 'AbortError') {
        return NextResponse.json({ success: false, message: 'O servidor de autenticação demorou para responder.' }, { status: 504 });
    }
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro inesperado durante o login.' }, { status: 500 });
  }
}
