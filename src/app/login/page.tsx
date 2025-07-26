'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import './login.css';
import { Button } from '@/components/ui/button'; // Using a styled component for consistency

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // In a real app, you'd get a token. Here, we'll use sessionStorage.
        sessionStorage.setItem('oraculo-auth-user', data.user.usuario);
        router.push('/');
      } else {
        setError(data.message || 'Falha no login.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container bg-background scanlines noise">
        <form onSubmit={handleLogin} className="container">
          <div className="input-container">
              <div className="input-content">
                  <div className="input-dist">
                  <span id="SubscribeTXT">Acessar painel Oráculo</span>
                      <div className="input-type">
                          <input 
                            placeholder="Usuário" 
                            required 
                            type="text" 
                            className="input-is"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                          />  
                          <input 
                            placeholder="Senha" 
                            required 
                            type="password" 
                            className="input-is"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                          />  
                      </div>
                      {error && <p className="text-destructive text-sm mt-2 text-glow-error">{error}</p>}
                      <button className="login-button" type="submit" disabled={isLoading}>
                        {isLoading ? 'Conectando...' : 'Login'}
                      </button>
                  </div>
              </div>
          </div>
        </form>
    </div>
  );
}
