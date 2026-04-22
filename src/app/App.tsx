import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { SecurityDashboard } from "./components/SecurityDashboard";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  // Redirigir según el rol del usuario
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  if (user?.role === "empresa") {
    return <CompanyDashboard />;
  }

  // Fallback al dashboard de seguridad original (sin autenticación específica)
  return <SecurityDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}