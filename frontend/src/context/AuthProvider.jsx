import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  function login(newToken) {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('adminToken');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}