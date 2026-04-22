import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, AlertTriangle, Activity, TrendingUp, TrendingDown, LogOut, BarChart3, FileCheck, Clock, Building2, Mail, Phone, MapPin, FileText, Calendar, Plus, Trash2, Edit2, CheckCircle2, XCircle, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import { useEffect } from 'react';

interface Control {
  id: string;
  code: string;
  name: string;
  category: string;
  selected: boolean;
  compliance?: 'cumple' | 'no-cumple' | null;
  observations?: string;
}

interface Threat {
  id: string;
  name: string;
  description: string;
  riskLevel: 'alto' | 'medio' | 'bajo';
}

export function CompanyDashboard() {
  const { user, logout } = useAuth();
  const [systemStatus, setSystemStatus] = useState<'Activo' | 'Alerta' | 'Normal'>('Normal');

  const [controls, setControls] = useState<Control[]>([]);

  useEffect(() => {
  fetch('http://localhost:3000/controls/full')
    .then(res => res.json())
    .then(data => {
      // 👇 IMPORTANTE: mapear al formato que usas
      const formatted = data.map((c: any) => ({
        id: c.code, // usamos code como id
        code: c.code,
        name: c.name,
        category: c.category,
        selected: c.selected,
        compliance: c.compliance,
        observations: c.observations || ''
      }));

      setControls(formatted);
    });
}, []);

  // Estado para amenazas
const [threats, setThreats] = useState<Threat[]>([]);

useEffect(() => {
  fetch('http://localhost:3000/threats')
    .then(res => res.json())
    .then(data => {
      const formatted = data.map((t: any) => ({
        id: t.id.toString(),
        name: t.name,
        description: t.description,
        riskLevel: t.risk_level
      }));

      setThreats(formatted);
    });
}, []);

  const [editingThreat, setEditingThreat] = useState<Threat | null>(null);
  const [newThreat, setNewThreat] = useState<{ name: string; description: string; riskLevel: 'alto' | 'medio' | 'bajo' }>({ name: '', description: '', riskLevel: 'medio' });
  const [showAddThreat, setShowAddThreat] = useState(false);

  // Calcular KPIs para el dashboard de seguridad
  const selectedControls = controls.filter(c => c.selected);
  const evaluatedControls = selectedControls.filter(c => c.compliance !== null && c.compliance !== undefined);
  const compliantControls = evaluatedControls.filter(c => c.compliance === 'cumple');
  const complianceRate = evaluatedControls.length > 0
    ? Math.round((compliantControls.length / evaluatedControls.length) * 100)
    : 0;

  const activeRisks = threats.filter(t => t.riskLevel === 'alto' || t.riskLevel === 'medio').length;

  // Funciones para controles
  const toggleControlSelection = (id: string) => {
    setControls(controls.map(c =>
      c.id === id ? { ...c, selected: !c.selected, compliance: !c.selected ? c.compliance : null } : c
    ));
  };

  const updateControlCompliance = (id: string, compliance: 'cumple' | 'no-cumple') => {
    setControls(controls.map(c =>
      c.id === id ? { ...c, compliance } : c
    ));
  };

  const updateControlObservations = (id: string, observations: string) => {
    setControls(controls.map(c =>
      c.id === id ? { ...c, observations } : c
    ));
  };

  const saveControls = async () => {
  try {
    await fetch('http://localhost:3000/controls/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(controls)
    });

    alert('Guardado correctamente');
  } catch (error) {
    console.error(error);
    alert('Error al guardar');
  }
  };

  // Funciones para amenazas
const addThreat = async () => {
  if (newThreat.name.trim() && newThreat.description.trim()) {
    try {
      const res = await fetch('http://localhost:3000/threats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newThreat)
      });

      const saved = await res.json();

      setThreats([
        {
          id: saved.id.toString(),
          name: saved.name,
          description: saved.description,
          riskLevel: saved.risk_level
        },
        ...threats
      ]);

      setNewThreat({ name: '', description: '', riskLevel: 'medio' });
      setShowAddThreat(false);

    } catch (error) {
      console.error(error);
    }
  }
};

const updateThreat = async () => {
  if (editingThreat) {
    try {
      await fetch(`http://localhost:3000/threats/${editingThreat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingThreat)
      });

      setThreats(threats.map(t => t.id === editingThreat.id ? editingThreat : t));
      setEditingThreat(null);

    } catch (error) {
      console.error(error);
    }
  }
};

const deleteThreat = async (id: string) => {
  try {
    await fetch(`http://localhost:3000/threats/${id}`, {
      method: 'DELETE'
    });

    setThreats(threats.filter(t => t.id !== id));

  } catch (error) {
    console.error(error);
  }
};

  // Función de exportación a Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Controles seleccionados
    const controlsDataExport = selectedControls.map(c => ({
      'Código': c.code,
      'Nombre del Control': c.name,
      'Categoría': c.category,
      'Estado': c.compliance === 'cumple' ? 'Cumple' : c.compliance === 'no-cumple' ? 'No Cumple' : 'Pendiente',
      'Observaciones': c.observations || 'N/A',
    }));
    const ws1 = XLSX.utils.json_to_sheet(controlsDataExport);
    XLSX.utils.book_append_sheet(workbook, ws1, 'Controles');

    // Hoja 2: Amenazas y Vulnerabilidades
    const threatsDataExport = threats.map(t => ({
      'Amenaza/Vulnerabilidad': t.name,
      'Descripción': t.description,
      'Nivel de Riesgo': t.riskLevel.toUpperCase(),
    }));
    const ws2 = XLSX.utils.json_to_sheet(threatsDataExport);
    XLSX.utils.book_append_sheet(workbook, ws2, 'Amenazas');

    // Hoja 3: Resumen
    const summaryDataExport = [
      { 'Métrica': 'Total de controles seleccionados', 'Valor': selectedControls.length },
      { 'Métrica': 'Controles evaluados', 'Valor': evaluatedControls.length },
      { 'Métrica': 'Controles en cumplimiento', 'Valor': compliantControls.length },
      { 'Métrica': 'Tasa de cumplimiento (%)', 'Valor': complianceRate },
      { 'Métrica': 'Riesgos activos', 'Valor': activeRisks },
      { 'Métrica': 'Total de amenazas', 'Valor': threats.length },
    ];
    const ws3 = XLSX.utils.json_to_sheet(summaryDataExport);
    XLSX.utils.book_append_sheet(workbook, ws3, 'Resumen');

    // Generar archivo
    const fileName = `Auditoria_Seguridad_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'alto': return 'bg-red-50 text-red-700 border-red-200';
      case 'medio': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'bajo': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getComplianceColor = (rate: number) => {
  if (rate >= 80) {
    return 'bg-green-50 border-green-200 text-green-700';
  } else if (rate >= 40) {
    return 'bg-orange-50 border-orange-200 text-orange-700';
  } else {
    return 'bg-red-50 border-red-200 text-red-700';
  }
};

const getComplianceText = (rate: number) => {
  if (rate >= 80) return 'Excelente';
  if (rate >= 40) return 'Aceptable';
  return 'Crítico';
};

  // Datos de ejemplo para gráficos
  const controlsData = [
    { name: 'Ene', cumple: 12, noCumple: 2 },
    { name: 'Feb', cumple: 14, noCumple: 1 },
    { name: 'Mar', cumple: 13, noCumple: 3 },
    { name: 'Abr', cumple: 15, noCumple: 1 },
  ];

  const incidentTrend = [
    { mes: 'Ene', incidentes: 5 },
    { mes: 'Feb', incidentes: 3 },
    { mes: 'Mar', incidentes: 7 },
    { mes: 'Abr', incidentes: 4 },
  ];

  const complianceData = [
    { name: 'Cumple', value: 85, color: '#10b981' },
    { name: 'No Cumple', value: 15, color: '#ef4444' },
  ];

  const recentActivities = [
    { id: 1, action: 'Control ISO-A.9.1 actualizado a "Cumple"', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 2, action: 'Nuevo control agregado: ISO-A.14.1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 3, action: 'Incidente de seguridad resuelto', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { id: 4, action: 'Auditoría de seguridad completada', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ];

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard de Seguridad</h1>
                <p className="text-sm text-slate-600">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar a Excel
              </Button>
              <Button onClick={saveControls} className="bg-blue-600 hover:bg-blue-700">
                Guardar Cambios
              </Button>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                Empresa
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
      <div className="max-w-[1920px] mx-auto px-6 py-6">

        {/* Perfil de empresa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white border-slate-200 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Perfil de Empresa
              </CardTitle>
              <CardDescription>Información registrada de su empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Nombre de Empresa</p>
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    </div>
                  </div>
                </div>

                {user?.nit && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">NIT</p>
                        <p className="text-sm font-semibold text-slate-900">{user.nit}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Correo Electrónico</p>
                      <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {user?.phone && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                        <p className="text-sm font-semibold text-slate-900">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.address && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Dirección</p>
                        <p className="text-sm font-semibold text-slate-900">{user.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.registeredDate && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Fecha de Registro</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(user.registeredDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard de Seguridad - 3 Columnas */}
        <div className="grid grid-cols-12 gap-6">

          {/* Columna izquierda - KPIs y Gráficos */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* KPIs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Indicadores Clave
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-900">Riesgos Activos</span>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-red-700">{activeRisks}</div>
                    <p className="text-xs text-red-600 mt-1">Requieren atención</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Controles Implementados</span>
                      <FileCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700">{selectedControls.length}</div>
                    <p className="text-xs text-blue-600 mt-1">De {controls.length} disponibles</p>
                  </div>

                  <div className={`rounded-lg p-4 border ${getComplianceColor(complianceRate)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-900">Cumplimiento</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold">{complianceRate}%</div>

<p className="text-xs mt-1 flex items-center gap-1">
  {complianceRate >= 80 ? (
    <><TrendingUp className="w-3 h-3" /> {getComplianceText(complianceRate)}</>
  ) : (
    <><TrendingDown className="w-3 h-3" /> {getComplianceText(complianceRate)}</>
  )}
</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gráfico de Tendencia */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle>Tendencia de Cumplimiento</CardTitle>
                  <CardDescription>Evolución mensual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={controlsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="cumple" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="noCumple" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gráfico de Incidentes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle>Tendencia de Incidentes</CardTitle>
                  <CardDescription>Incidentes por mes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={incidentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="mes" stroke="#64748b" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="incidentes" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Columna central - Checklists */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Checklist de Controles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Selección de Controles
                  </CardTitle>
                  <CardDescription>Marque los controles que desea implementar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {controls.map((control) => (
                      <div
                        key={control.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          control.selected
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Checkbox
                          id={control.id}
                          checked={control.selected}
                          onCheckedChange={() => toggleControlSelection(control.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={control.id}
                            className="text-sm font-medium text-slate-900 cursor-pointer block"
                          >
                            {control.code} - {control.name}
                          </label>
                          <p className="text-xs text-slate-600 mt-0.5">{control.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Checklist de Amenazas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Amenazas y Vulnerabilidades
                      </CardTitle>
                      <CardDescription>Gestión de riesgos identificados</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddThreat(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {/* Formulario de agregar nueva amenaza */}
                    {showAddThreat && (
                      <div className="bg-slate-50 border-2 border-blue-300 rounded-lg p-4 space-y-3">
                        <Input
                          placeholder="Nombre de la amenaza"
                          value={newThreat.name}
                          onChange={(e) => setNewThreat({ ...newThreat, name: e.target.value })}
                          className="bg-white"
                        />
                        <Textarea
                          placeholder="Descripción"
                          value={newThreat.description}
                          onChange={(e) => setNewThreat({ ...newThreat, description: e.target.value })}
                          className="bg-white"
                          rows={2}
                        />
                        <Select
                          value={newThreat.riskLevel}
                          onValueChange={(value) => setNewThreat({ ...newThreat, riskLevel: value as 'alto' | 'medio' | 'bajo' })}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alto">Alto</SelectItem>
                            <SelectItem value="medio">Medio</SelectItem>
                            <SelectItem value="bajo">Bajo</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button onClick={addThreat} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            Guardar
                          </Button>
                          <Button onClick={() => setShowAddThreat(false)} size="sm" variant="outline" className="flex-1">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Lista de amenazas */}
                    {threats.map((threat) => (
                      <div key={threat.id}>
                        {editingThreat?.id === threat.id ? (
                          <div className="bg-slate-50 border-2 border-blue-300 rounded-lg p-4 space-y-3">
                            <Input
                              value={editingThreat.name}
                              onChange={(e) => setEditingThreat({ ...editingThreat, name: e.target.value })}
                              className="bg-white"
                            />
                            <Textarea
                              value={editingThreat.description}
                              onChange={(e) => setEditingThreat({ ...editingThreat, description: e.target.value })}
                              className="bg-white"
                              rows={2}
                            />
                            <Select
                              value={editingThreat.riskLevel}
                              onValueChange={(value) => setEditingThreat({ ...editingThreat, riskLevel: value as 'alto' | 'medio' | 'bajo' })}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alto">Alto</SelectItem>
                                <SelectItem value="medio">Medio</SelectItem>
                                <SelectItem value="bajo">Bajo</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                              <Button onClick={updateThreat} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                Guardar
                              </Button>
                              <Button onClick={() => setEditingThreat(null)} size="sm" variant="outline" className="flex-1">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-900">{threat.name}</h4>
                                <p className="text-xs text-slate-600 mt-1">{threat.description}</p>
                              </div>
                              <Badge className={getRiskColor(threat.riskLevel)}>
                                {threat.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingThreat(threat)}
                                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteThreat(threat.id)}
                                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Columna derecha - Evaluación */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Evaluación de Controles
                  </CardTitle>
                  <CardDescription>
                    {selectedControls.length > 0
                      ? `Evalúe los ${selectedControls.length} controles seleccionados`
                      : 'Seleccione controles para evaluar'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedControls.length === 0 ? (
                    <div className="text-center py-12">
                      <FileCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-sm">
                        No hay controles seleccionados para evaluar.
                      </p>
                      <p className="text-slate-400 text-xs mt-2">
                        Seleccione controles en la sección "Selección de Controles"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                      {selectedControls.map((control) => (
                        <div key={control.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <div className="mb-3">
                            <h4 className="text-sm font-semibold text-slate-900">{control.code} - {control.name}</h4>
                            <p className="text-xs text-slate-600 mt-1">{control.category}</p>
                          </div>

                          {/* Estado de cumplimiento */}
                          <div className="mb-3">
                            <Label className="text-xs text-slate-700 mb-2 block">Estado de Cumplimiento</Label>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={control.compliance === 'cumple' ? 'default' : 'outline'}
                                onClick={() => updateControlCompliance(control.id, 'cumple')}
                                className={`flex-1 ${
                                  control.compliance === 'cumple'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'border-green-300 text-green-700 hover:bg-green-50'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Cumple
                              </Button>
                              <Button
                                size="sm"
                                variant={control.compliance === 'no-cumple' ? 'default' : 'outline'}
                                onClick={() => updateControlCompliance(control.id, 'no-cumple')}
                                className={`flex-1 ${
                                  control.compliance === 'no-cumple'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'border-red-300 text-red-700 hover:bg-red-50'
                                }`}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                No Cumple
                              </Button>
                            </div>
                          </div>

                          {/* Observaciones */}
                          <div>
                            <Label htmlFor={`obs-${control.id}`} className="text-xs text-slate-700 mb-2 block">
                              Observaciones (opcional)
                            </Label>
                            <Textarea
                              id={`obs-${control.id}`}
                              placeholder="Agregue comentarios o notas sobre este control..."
                              value={control.observations || ''}
                              onChange={(e) => updateControlObservations(control.id, e.target.value)}
                              className="bg-white text-sm"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

