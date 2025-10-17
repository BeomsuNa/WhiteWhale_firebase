import React, { useState } from 'react';
import LoginForm from '@/sections/Login/LoginForm';
import Login from '@/sections/Login/Login';
import { useAuthStore } from '@/stores/authStore';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<{
    email: string;
    passWord: string;
  } | null>(null);
  const { login } = useAuthStore();

  const handleLogin = (email: string, passWord: string) => {
    setCredentials({ email, passWord });
  };

  const handleLoginSuccess = () => {
    if (credentials) {
      login(credentials.email, credentials.passWord);
    } // 로그인 상태 업데이트
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {credentials && (
        <Login
          email={credentials.email}
          passWord={credentials.passWord}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default LoginPage;
