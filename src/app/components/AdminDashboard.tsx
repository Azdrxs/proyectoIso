import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, LogOut, Building2, Users, Activity, TrendingUp, Eye, Edit, Settings, ExternalLink, FileCheck, BarChart3, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CompanyDashboard } from './CompanyDashboard';
import { motion } from 'motion/react';

interface Company {
  id: string;
  name: string;
  status: 'Activo' | 'Inactivo' | 'En revisión';
  controls: number;
  compliance: number;
  lastActivity: Date;
  email?: string;
  nit?: string;
  phone?: string;
  address?: string;
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingCompanyDashboard, setViewingCompanyDashboard] = useState<Company | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    status: 'Activo' as 'Activo' | 'Inactivo' | 'En revisión',
    controls: 0,
    compliance: 0,
  });

  // Datos de ejemplo de empresas
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 'comp-001',
      name: 'TechCorp S.A.',
      status: 'Activo',
      controls: 18,
      compliance: 85,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      email: 'empresa@test.com',
      nit: '900123456-7',
      phone: '+57 300 123 4567',
      address: 'Calle 72 #10-51, Bogotá',
    },
    {
      id: 'comp-002',
      name: 'SecureData Inc.',
      status: 'Activo',
      controls: 22,
      compliance: 92,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
      email: 'contacto@securedata.com',
      nit: '900234567-8',
      phone: '+57 310 234 5678',
      address: 'Carrera 15 #93-45, Bogotá',
    },
    {
      id: 'comp-003',
      name: 'GlobalSystems Ltd.',
      status: 'En revisión',
      controls: 15,
      compliance: 78,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5),
      email: 'info@globalsystems.com',
      nit: '900345678-9',
      phone: '+57 320 345 6789',
      address: 'Calle 100 #18-30, Bogotá',
    },
    {
      id: 'comp-004',
      name: 'CloudNet Solutions',
      status: 'Activo',
      controls: 20,
      compliance: 88,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
      email: 'soporte@cloudnet.com',
      nit: '900456789-0',
      phone: '+57 315 456 7890',
      address: 'Avenida 19 #104-60, Bogotá',
    },
    {
      id: 'comp-005',
      name: 'DataProtect Corp.',
      status: 'Inactivo',
      controls: 12,
      compliance: 65,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 72),
      email: 'contacto@dataprotect.com',
      nit: '900567890-1',
      phone: '+57 318 567 8901',
      address: 'Calle 85 #12-20, Bogotá',
    },
  ]);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactivo': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'En revisión': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 75) return 'text-blue-600';
    if (compliance >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowDetailModal(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setEditForm({
      name: company.name,
      status: company.status,
      controls: company.controls,
      compliance: company.compliance,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedCompany) {
      setCompanies(companies.map(comp =>
        comp.id === selectedCompany.id
          ? {
              ...comp,
              name: editForm.name,
              status: editForm.status,
              controls: editForm.controls,
              compliance: editForm.compliance,
              lastActivity: new Date(),
            }
          : comp
      ));
      setShowEditModal(false);
    }
  };

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'Activo').length;
  const avgCompliance = Math.round(companies.reduce((acc, c) => acc + c.compliance, 0) / companies.length);
  const totalControls = companies.reduce((acc, c) => acc + c.controls, 0);

  // Si estamos viendo el dashboard de una empresa
  if (viewingCompanyDashboard) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header de navegación */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingCompanyDashboard(null)}
                  className="border-slate-300 hover:bg-slate-100"
                >
                  ← Volver al Panel de Admin
                </Button>
                <div className="flex items-center gap-3 ml-4">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vista: {viewingCompanyDashboard.name}</h1>
                    <p className="text-sm text-slate-600">Acceso administrativo al dashboard de empresa</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                  <Settings className="w-3 h-3 mr-1" />
                  Administrador
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-slate-300 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mostrar el dashboard de empresa sin el header (lo manejamos arriba) */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Información de la empresa seleccionada */}
          <Card className="bg-white border-slate-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">ID de Empresa</p>
                  <p className="text-sm font-mono font-semibold">{viewingCompanyDashboard.id}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Nombre</p>
                  <p className="text-sm font-semibold">{viewingCompanyDashboard.name}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Estado</p>
                  <Badge className={getStatusColor(viewingCompanyDashboard.status)}>
                    {viewingCompanyDashboard.status}
                  </Badge>
                </div>
                {viewingCompanyDashboard.nit && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">NIT</p>
                    <p className="text-sm font-semibold">{viewingCompanyDashboard.nit}</p>
                  </div>
                )}
                {viewingCompanyDashboard.email && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Correo</p>
                    <p className="text-sm font-semibold">{viewingCompanyDashboard.email}</p>
                  </div>
                )}
                {viewingCompanyDashboard.phone && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                    <p className="text-sm font-semibold">{viewingCompanyDashboard.phone}</p>
                  </div>
                )}
                {viewingCompanyDashboard.address && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 lg:col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Dirección</p>
                    <p className="text-sm font-semibold">{viewingCompanyDashboard.address}</p>
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Controles</p>
                  <p className="text-sm font-semibold">{viewingCompanyDashboard.controls}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Cumplimiento</p>
                  <p className={`text-sm font-bold ${getComplianceColor(viewingCompanyDashboard.compliance)}`}>
                    {viewingCompanyDashboard.compliance}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas y gráficos de ejemplo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Estado General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Shield className="w-10 h-10 text-green-500" />
                  <span className="text-3xl font-bold text-green-500">Normal</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Controles Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <FileCheck className="w-10 h-10 text-blue-500" />
                  <span className="text-3xl font-bold">{viewingCompanyDashboard.controls}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Tasa de Cumplimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-10 h-10 text-purple-500" />
                  <span className="text-3xl font-bold">{viewingCompanyDashboard.compliance}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Incidentes del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-10 h-10 text-orange-500" />
                  <span className="text-3xl font-bold">4</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
                <p className="text-sm text-slate-600">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                <Settings className="w-3 h-3 mr-1" />
                Administrador
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-slate-300 hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPIs Globales */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Building2 className="w-10 h-10 text-blue-500" />
                <span className="text-3xl font-bold">{totalCompanies}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Registradas en el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Empresas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Activity className="w-10 h-10 text-green-500" />
                <span className="text-3xl font-bold">{activeCompanies}</span>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {Math.round((activeCompanies / totalCompanies) * 100)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Cumplimiento Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Shield className="w-10 h-10 text-purple-500" />
                <span className="text-3xl font-bold">{avgCompliance}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">ISO 27001</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Controles Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10 text-orange-500" />
                <span className="text-3xl font-bold">{totalControls}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">En todas las empresas</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de empresas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestión de Empresas</CardTitle>
                <CardDescription>Lista de empresas registradas en el sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Nombre de Empresa</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Estado</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Controles</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Cumplimiento</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Última Actividad</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-mono text-slate-600">{company.id}</td>
                      <td className="py-3 px-4 text-sm font-medium">{company.name}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusColor(company.status)}>
                          {company.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-semibold">{company.controls}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-sm font-bold ${getComplianceColor(company.compliance)}`}>
                          {company.compliance}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {formatDateTime(company.lastActivity)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(company)}
                            className="border-slate-300 hover:bg-slate-100"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(company)}
                            className="border-blue-300 hover:bg-blue-50"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => setViewingCompanyDashboard(company)}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Acceder
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Modal de detalles */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-white border-slate-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 text-2xl">
              <Building2 className="w-8 h-8" />
              Detalles de la Empresa
            </DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">ID de Empresa</p>
                  <p className="text-sm font-mono font-semibold">{selectedCompany.id}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Nombre</p>
                  <p className="text-sm font-semibold">{selectedCompany.name}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Estado</p>
                  <Badge className={getStatusColor(selectedCompany.status)}>
                    {selectedCompany.status}
                  </Badge>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Controles Activos</p>
                  <p className="text-sm font-semibold">{selectedCompany.controls}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Tasa de Cumplimiento</p>
                  <p className={`text-sm font-bold ${getComplianceColor(selectedCompany.compliance)}`}>
                    {selectedCompany.compliance}%
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Última Actividad</p>
                  <p className="text-sm font-semibold">{formatDateTime(selectedCompany.lastActivity)}</p>
                </div>
                {selectedCompany.nit && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">NIT</p>
                    <p className="text-sm font-semibold">{selectedCompany.nit}</p>
                  </div>
                )}
                {selectedCompany.email && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Correo Electrónico</p>
                    <p className="text-sm font-semibold">{selectedCompany.email}</p>
                  </div>
                )}
                {selectedCompany.phone && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                    <p className="text-sm font-semibold">{selectedCompany.phone}</p>
                  </div>
                )}
                {selectedCompany.address && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Dirección</p>
                    <p className="text-sm font-semibold">{selectedCompany.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowDetailModal(false)} className="border-slate-300">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 text-2xl">
              <Edit className="w-8 h-8" />
              Editar Empresa
            </DialogTitle>
            <DialogDescription className="text-slate-700">
              Modifica la información de la empresa seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nombre de la Empresa</Label>
              <Input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as 'Activo' | 'Inactivo' | 'En revisión' })}
              >
                <SelectTrigger>
                  <SelectValue>{editForm.status}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Controles</Label>
                <Input
                  type="number"
                  value={editForm.controls}
                  onChange={(e) => setEditForm({ ...editForm, controls: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cumplimiento (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.compliance}
                  onChange={(e) => setEditForm({ ...editForm, compliance: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="border-slate-300">
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
