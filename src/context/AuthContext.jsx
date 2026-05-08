import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = ({ email, password }) => {
    const validEmail = 'user@example.com';
    const validPassword = 'password123';

    if (email.trim() === '' || password.trim() === '') {
      throw new Error('Email and password are required.');
    }

    if (email !== validEmail || password !== validPassword) {
      throw new Error('Invalid credentials. Please try again.');
    }

    const fakeToken = 'auth_token_example_12345';
    setToken(fakeToken);
    setUser({ email });
    return fakeToken;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, logout, isAuthenticated: Boolean(token) }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
