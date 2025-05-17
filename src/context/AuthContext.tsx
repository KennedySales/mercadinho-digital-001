
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a simple implementation. In a real-world scenario, 
// this would connect to a backend for authentication.
const ADMIN_USER = {
  id: '1',
  username: 'admin',
  password: 'admin123',
  isAdmin: true
};

const REGULAR_USER = {
  id: '2',
  username: 'user',
  password: 'user123',
  isAdmin: false
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;

  const login = (username: string, password: string) => {
    // Check if the credentials match our admin or regular user
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const { password: _, ...adminWithoutPassword } = ADMIN_USER;
      setUser(adminWithoutPassword);
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo, administrador",
      });
      return true;
    } 
    else if (username === REGULAR_USER.username && password === REGULAR_USER.password) {
      const { password: _, ...userWithoutPassword } = REGULAR_USER;
      setUser(userWithoutPassword);
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao sistema",
      });
      return true;
    }
    
    toast({
      title: "Erro de autenticação",
      description: "Usuário ou senha incorretos",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
