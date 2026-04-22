import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, Shield, ShieldAlert, Activity, Clock, Plus, RefreshCw, Trash2, Bell, TrendingUp, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Tipos de datos
interface SecurityControl {
  id: string;
  name: string;
  status: 'Cumple' | 'No cumple';
  lastUpdated: Date;
}

interface Alert {
  id: string;
  type: 'Acceso sospechoso' | 'Cambio en control' | 'Incidente detectado';
  severity: 'bajo' | 'medio' | 'alto' | 'crítico';
  timestamp: Date;
  description: string;
}

type SystemStatus = 'Seguro' | 'Riesgo' | 'Crítico';

export function SecurityDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('Seguro');
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [incidentCount, setIncidentCount] = useState(0);
  
  // Estado para edición de controles
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingControl, setEditingControl] = useState<SecurityControl | null>(null);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    status: 'Cumple' as 'Cumple' | 'No cumple',
    date: '',
  });

  // Datos para gráficos
  const [incidentHistory, setIncidentHistory] = useState([
    { fecha: '10:00', incidentes: 2 },
    { fecha: '11:00', incidentes: 5 },
    { fecha: '12:00', incidentes: 3 },
    { fecha: '13:00', incidentes: 7 },
    { fecha: '14:00', incidentes: 4 },
    { fecha: '15:00', incidentes: 9 },
    { fecha: '16:00', incidentes: 6 },
  ]);

  // Inicializar controles de seguridad
  useEffect(() => {
    const initialControls: SecurityControl[] = [
      { id: 'ISO-A.5.1', name: 'Políticas de seguridad de la información', status: 'Cumple', lastUpdated: new Date() },
      { id: 'ISO-A.6.1', name: 'Organización interna', status: 'Cumple', lastUpdated: new Date() },
      { id: 'ISO-A.7.1', name: 'Selección de personal', status: 'No cumple', lastUpdated: new Date() },
      { id: 'ISO-A.8.1', name: 'Responsabilidad sobre activos', status: 'Cumple', lastUpdated: new Date() },
      { id: 'ISO-A.9.1', name: 'Control de acceso', status: 'No cumple', lastUpdated: new Date() },
      { id: 'ISO-A.10.1', name: 'Criptografía', status: 'Cumple', lastUpdated: new Date() },
      { id: 'ISO-A.11.1', name: 'Seguridad física y ambiental', status: 'No cumple', lastUpdated: new Date() },
      { id: 'ISO-A.12.1', name: 'Seguridad de las operaciones', status: 'Cumple', lastUpdated: new Date() },
    ];
    setControls(initialControls);

    // Inicializar alertas
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'Acceso sospechoso',
        severity: 'alto',
        timestamp: new Date(Date.now() - 5 * 60000),
        description: 'Intento de acceso desde IP no reconocida (192.168.1.100)',
      },
      {
        id: '2',
        type: 'Cambio en control',
        severity: 'medio',
        timestamp: new Date(Date.now() - 15 * 60000),
        description: 'Control ISO-A.9.1 modificado a estado No cumple',
      },
      {
        id: '3',
        type: 'Incidente detectado',
        severity: 'crítico',
        timestamp: new Date(Date.now() - 30 * 60000),
        description: 'Detección de malware en servidor principal',
      },
    ];
    setAlerts(initialAlerts);
    setIncidentCount(initialAlerts.length);
  }, []);

  // Verificar estado del sistema basado en controles no cumplidos
  useEffect(() => {
    const nonCompliantCount = controls.filter(c => c.status === 'No cumple').length;
    
    if (nonCompliantCount >= 10) {
      setSystemStatus('Crítico');
      setShowCriticalModal(true);
    } else if (nonCompliantCount >= 5) {
      setSystemStatus('Riesgo');
    } else {
      setSystemStatus('Seguro');
    }
  }, [controls]);

  // Simulador de nuevas alertas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTypes: Array<'Acceso sospechoso' | 'Cambio en control' | 'Incidente detectado'> = [
        'Acceso sospechoso',
        'Cambio en control',
        'Incidente detectado',
      ];
      const randomSeverities: Array<'bajo' | 'medio' | 'alto' | 'crítico'> = ['bajo', 'medio', 'alto', 'crítico'];
      
      const descriptions = {
        'Acceso sospechoso': [
          'Múltiples intentos de login fallidos detectados',
          'Acceso desde ubicación geográfica inusual',
          'Patrón de acceso anómalo detectado',
        ],
        'Cambio en control': [
          'Actualización de políticas de seguridad',
          'Modificación en control de acceso',
          'Cambio en configuración de firewall',
        ],
        'Incidente detectado': [
          'Anomalía en tráfico de red',
          'Archivo sospechoso detectado',
          'Actividad inusual en base de datos',
        ],
      };

      const type = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      
      const newAlert: Alert = {
        id: Date.now().toString(),
        type,
        severity: randomSeverities[Math.floor(Math.random() * randomSeverities.length)],
        timestamp: new Date(),
        description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      };

      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      setIncidentCount(prev => prev + 1);
    }, 15000); // Nueva alerta cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  const nonCompliantControls = controls.filter(c => c.status === 'No cumple').length;

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'Seguro': return 'text-green-500';
      case 'Riesgo': return 'text-yellow-500';
      case 'Crítico': return 'text-red-500';
    }
  };

  const getStatusBgColor = (status: SystemStatus) => {
    switch (status) {
      case 'Seguro': return 'bg-green-500/10 border-green-500/20';
      case 'Riesgo': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'Crítico': return 'bg-red-500/10 border-red-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'bajo': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medio': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'alto': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'crítico': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const addControl = () => {
    const newControl: SecurityControl = {
      id: `ISO-A.${controls.length + 1}.1`,
      name: `Nuevo control de seguridad ${controls.length + 1}`,
      status: Math.random() > 0.5 ? 'Cumple' : 'No cumple',
      lastUpdated: new Date(),
    };
    setControls([...controls, newControl]);
  };

  const toggleControlStatus = (id: string) => {
    setControls(controls.map(control => 
      control.id === id 
        ? { ...control, status: control.status === 'Cumple' ? 'No cumple' : 'Cumple', lastUpdated: new Date() }
        : control
    ));
  };

  const deleteControl = (id: string) => {
    setControls(controls.filter(control => control.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateTimeForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Funciones para edición de controles
  const handleEditClick = (control: SecurityControl) => {
    setEditingControl(control);
    setEditForm({
      id: control.id,
      name: control.name,
      status: control.status,
      date: formatDateTimeForInput(control.lastUpdated),
    });
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (editingControl) {
      setControls(controls.map(control => 
        control.id === editingControl.id 
          ? { 
              id: editForm.id,
              name: editForm.name, 
              status: editForm.status, 
              lastUpdated: new Date(editForm.date) 
            }
          : control
      ));
      setShowEditModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Centro de Operaciones de Seguridad</h1>
              <p className="text-slate-600">Monitoreo ISO 27001 en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            <span className="text-sm text-slate-600">Sistema activo</span>
          </div>
        </div>
      </div>

      {/* Banner Crítico */}
      {nonCompliantControls >= 10 && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <div>
            <h3 className="font-bold text-lg text-red-900">¡ALERTA CRÍTICA DEL SISTEMA!</h3>
            <p className="text-red-700">Se alcanzó el máximo de controles no admitidos. Se requiere acción inmediata.</p>
          </div>
        </div>
      )}

      {/* Indicadores principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className={`border-2 ${getStatusBgColor(systemStatus)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {systemStatus === 'Crítico' ? (
                <ShieldAlert className={`w-10 h-10 ${getStatusColor(systemStatus)}`} />
              ) : (
                <Shield className={`w-10 h-10 ${getStatusColor(systemStatus)}`} />
              )}
              <span className={`text-3xl font-bold ${getStatusColor(systemStatus)}`}>
                {systemStatus}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Incidentes Detectados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Bell className="w-10 h-10 text-blue-500" />
              <span className="text-3xl font-bold">{incidentCount}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{alerts.filter(a => a.severity === 'crítico' || a.severity === 'alto').length} de alta prioridad
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Controles Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Activity className="w-10 h-10 text-purple-500" />
              <span className="text-3xl font-bold">{controls.length}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">ISO 27001 activos</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${nonCompliantControls >= 10 ? 'bg-red-50 border-red-500' : 'bg-white border-slate-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Controles No Cumplidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-10 h-10 ${nonCompliantControls >= 10 ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={`text-3xl font-bold ${nonCompliantControls >= 10 ? 'text-red-500' : 'text-yellow-500'}`}>
                {nonCompliantControls}
              </span>
            </div>
            {nonCompliantControls >= 10 && (
              <p className="text-xs text-red-600 mt-2 font-semibold">⚠️ Límite crítico alcanzado</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alertas en tiempo real */}
        <Card className="lg:col-span-2 bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alertas en Tiempo Real
            </CardTitle>
            <CardDescription>Notificaciones de eventos de seguridad</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-semibold">{alert.type}</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(alert.timestamp)}
                      </div>
                    </div>
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'crítico' ? 'text-red-500' :
                      alert.severity === 'alto' ? 'text-orange-500' :
                      alert.severity === 'medio' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de incidentes */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Incidentes por Hora</CardTitle>
            <CardDescription>Tendencia de eventos detectados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fecha" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="incidentes" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de controles de seguridad */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Controles de Seguridad ISO 27001</CardTitle>
              <CardDescription>Gestión y monitoreo de controles</CardDescription>
            </div>
            <Button onClick={addControl} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Control
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">ID Control</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Nombre del Control</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Última Actualización</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <tr 
                    key={control.id} 
                    className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                      control.status === 'No cumple' ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-sm font-mono">{control.id}</td>
                    <td className="py-3 px-4 text-sm">{control.name}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        className={
                          control.status === 'Cumple' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {control.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {formatDateTime(control.lastUpdated)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => toggleControlStatus(control.id)}
                          className="border-slate-300 hover:bg-slate-100"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Actualizar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => deleteControl(control.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditClick(control)}
                          className="border-slate-300 hover:bg-slate-100"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
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

      {/* Modal de advertencia crítica */}
      <Dialog open={showCriticalModal} onOpenChange={setShowCriticalModal}>
        <DialogContent className="bg-white border-red-500 border-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-2xl">
              <ShieldAlert className="w-8 h-8" />
              ALERTA CRÍTICA DEL SISTEMA
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-base mt-4">
              <div className="space-y-4">
                <p className="font-semibold text-red-600">
                  ⚠️ Se ha alcanzado el límite máximo de controles no admitidos ({nonCompliantControls} controles)
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium mb-2 text-slate-900">Acciones requeridas:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                    <li>Revisar y corregir controles marcados como "No cumple"</li>
                    <li>Implementar medidas correctivas inmediatas</li>
                    <li>Notificar al equipo de cumplimiento ISO 27001</li>
                    <li>Documentar plan de acción y timeline de resolución</li>
                  </ul>
                </div>
                <p className="text-sm text-slate-600">
                  El sistema permanecerá en estado CRÍTICO hasta que se resuelvan los controles no cumplidos.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowCriticalModal(false)} className="border-slate-300">
              Entendido
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              Ir a Controles
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de edición de controles */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 text-2xl">
              <Edit className="w-8 h-8" />
              Editar Control de Seguridad
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-base mt-4">
              <div className="space-y-4">
                <p className="font-semibold text-slate-900">
                  Modifica los detalles del control de seguridad seleccionado
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="font-medium mb-2 text-slate-900">Formulario de edición:</p>
                  <div className="space-y-2">
                    <Label>ID Control</Label>
                    <Input 
                      type="text" 
                      value={editForm.id} 
                      onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                      className="bg-slate-100"
                      readOnly
                    />
                    <Label>Nombre del Control</Label>
                    <Input 
                      type="text" 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <Label>Estado</Label>
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value) => setEditForm({ ...editForm, status: value as 'Cumple' | 'No cumple' })}
                    >
                      <SelectTrigger>
                        <SelectValue>{editForm.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cumple">Cumple</SelectItem>
                        <SelectItem value="No cumple">No cumple</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label>Última Actualización</Label>
                    <Input 
                      type="datetime-local" 
                      value={editForm.date} 
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="border-slate-300">
              Cancelar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditSave}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}