import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const userName = process.env.API_USER;

  if (!userName) {
    return NextResponse.json(
      { detail: 'Nome de usuário não configurado no ambiente.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ username: userName });
}
