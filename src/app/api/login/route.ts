'use server';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the structure of a user
interface User {
  usuario: string;
  senha?: string; // Keep password optional in the type for security best practices
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Usuário e senha são obrigatórios.' }, { status: 400 });
    }

    // Path to the usuarios.json file in the root directory
    const filePath = path.join(process.cwd(), 'usuarios.json');
    
    let users: User[] = [];
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        users = JSON.parse(fileContents);
    } catch (error) {
        console.error("Could not read or parse usuarios.json", error);
        return NextResponse.json({ success: false, message: 'Erro interno do servidor: não foi possível ler os dados de usuário.' }, { status: 500 });
    }

    // Find the user
    const user = users.find(u => u.usuario.toLowerCase() === username.toLowerCase());

    // Check if user exists and password matches
    if (user && user.senha === password) {
      // Return success without the password
      return NextResponse.json({ success: true, user: { usuario: user.usuario } });
    } else {
      return NextResponse.json({ success: false, message: 'Usuário ou senha inválidos.' }, { status: 401 });
    }

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro inesperado.' }, { status: 500 });
  }
}
