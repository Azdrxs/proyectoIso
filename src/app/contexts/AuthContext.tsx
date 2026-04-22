import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'empresa' | 'admin';

export interface User {
  email: string;
  role: UserRole;
  name: string;
  companyId?: string;
  nit?: string;
  phone?: string;
  address?: string;
  registeredDate?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  register: (companyData: CompanyRegistrationData) => void;
  isAuthenticated: boolean;
}

interface CompanyRegistrationData {
  companyName: string;
  nit: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de prueba
const mockUsers: Record<string, any> = {
  'empresa@test.com': {
    email: 'empresa@test.com',
    password: 'empresa123',
    role: 'empresa' as UserRole,
    name: 'TechCorp S.A.',
    companyId: 'comp-001',
    nit: '900123456-7',
    phone: '+57 300 123 4567',
    address: 'Calle 72 #10-51, Bogotá',
    registeredDate: new Date('2024-01-15'),
  },
  'admin@test.com': {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    name: 'Administrador del Sistema',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

const login = (userData: User) => {
  setUser(userData);
};

  const logout = () => {
    setUser(null);
  };

  const register = (companyData: CompanyRegistrationData) => {
    // Crear un nuevo usuario empresa
    const newCompanyId = `comp-${String(Object.keys(mockUsers).length + 1).padStart(3, '0')}`;
    const newUser = {
      email: companyData.email,
      password: companyData.password,
      role: 'empresa' as UserRole,
      name: companyData.companyName,
      companyId: newCompanyId,
      nit: companyData.nit,
      phone: companyData.phone,
      address: companyData.address,
      registeredDate: new Date(),
    };

    // Agregar a la lista de usuarios simulados
    mockUsers[companyData.email] = newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
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

