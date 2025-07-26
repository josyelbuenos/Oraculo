'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import './login.css';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you'd perform authentication here.
    // For this simulation, we'll just set a session item.
    sessionStorage.setItem('oraculo-auth', 'true');
    router.push('/');
  };

  return (
    <div className="login-page-container bg-background scanlines noise">
        <form onSubmit={handleLogin} className="container">
          <div className="input-container">
              <div className="input-content">
                  <div className="input-dist">
                  <span id="SubscribeTXT">Subscription</span>
                      <div className="input-type">
                          <input placeholder="Email" required type="text" className="input-is" />  
                          <input placeholder="Password" required type="password" className="input-is" />  
                      </div>
                      <button className="login-button" type="submit">Subscribe</button>
                  </div>
              </div>
          </div>
        </form>
    </div>
  );
}
