import React, { useState } from "react";
import { Client, Personnel, Task, AttendanceLog, IncidentReport } from "../types";
import {
  Calendar,
  Camera,
  Check,
  AlertTriangle,
  User,
  Plus,
  MapPin,
  RefreshCw,
  Clock,
  Shield,
  Briefcase,
  Sliders,
  HelpCircle
} from "lucide-react";
import MapSimulator from "./MapSimulator";

interface SupervisorRoleProps {
  clients: Client[];
  personnel: Personnel[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  attendance: AttendanceLog[];
  incidents: IncidentReport[];
  setIncidents: React.Dispatch<React.SetStateAction<IncidentReport[]>>;
}

export default function SupervisorRole({
  clients,
  personnel,
  tasks,
  setTasks,
  attendance,
  incidents,
  setIncidents,
}: SupervisorRoleProps) {
  const [activeTab, setActiveTab] = useState<"tareas" | "evidencia" | "recorridos" | "alertas">("tareas");

  // State for creating a new task
  const [taskClientId, setTaskClientId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState<"Seguridad" | "Limpieza">("Seguridad");
  const [taskAssignedToId, setTaskAssignedToId] = useState("");
  const [taskFrequency, setTaskFrequency] = useState<"Diario" | "Semanal" | "Mensual">("Diario");

  // State for alert management
  const [resolvingIncidentId, setResolvingIncidentId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Filtering personnel based on client selection & service type
  const availablePersonnel = personnel.filter(
    (p) =>
      (!taskClientId || p.assignedClientId === taskClientId) &&
      p.role === (taskType === "Seguridad" ? "Guardia" : "Limpieza")
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskClientId || !taskTitle || !taskAssignedToId) return;

    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      clientId: taskClientId,
      title: taskTitle,
      type: taskType,
      assignedToId: taskAssignedToId,
      frequency: taskFrequency,
      status: "Pendiente",
    };

    setTasks((prev) => [...prev, newTask]);
    // Reset form
    setTaskTitle("");
    triggerNotification("Actividad programada y asignada exitosamente.");
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: "Atendida" as const,
              resolvedBy: "Coordinador de Guardia (Campo)",
              resolutionNotes: resolutionNotes || "Atendido y validado en campo por Supervisor.",
            }
          : inc
      )
    );
    setResolvingIncidentId(null);
    setResolutionNotes("");
    triggerNotification("Incidente resuelto y registrado en la bitácora.");
  };

  // Reassign / Delegate a task when there is an emergency
  const handleReassignTask = (taskId: string, newStaffId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignedToId: newStaffId } : t))
    );
    triggerNotification("Colaborador reasignado con éxito ante contingencia.");
  };

  // Filter tasks with evidence to review
  const tasksWithEvidence = tasks.filter((t) => t.status === "Completada" && t.photoEvidence);

  // Active panic alerts
  const activeAlerts = incidents.filter((i) => i.status === "Abierta");

  return (
    <div className="flex flex-col h-full bg-zinc-50 text-zinc-900" id="supervisor-module">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-lg border border-zinc-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner Context */}
      <div className="bg-zinc-900 text-white pb-6 rounded-b-[2rem] shadow-md relative overflow-hidden shrink-0">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-zinc-700 rounded-full opacity-30"></div>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center border border-zinc-600 font-bold text-sky-400">
                SO
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Monitoreo y Campo</span>
                <h1 className="text-sm font-semibold text-zinc-100">Supervisor de Operaciones</h1>
              </div>
            </div>
            <span className="bg-sky-400/10 text-sky-400 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border border-sky-400/20">
              COORDINADOR
            </span>
          </div>

          {/* Minimal Nav pills */}
          <div className="flex gap-1.5 mt-5 bg-zinc-950/40 p-1 rounded-xl max-w-md">
            <button
              onClick={() => setActiveTab("tareas")}
              className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all ${
                activeTab === "tareas" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Asignación
            </button>
            <button
              onClick={() => setActiveTab("evidencia")}
              className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all ${
                activeTab === "evidencia" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Evidencias ({tasksWithEvidence.length})
            </button>
            <button
              onClick={() => setActiveTab("recorridos")}
              className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all ${
                activeTab === "recorridos" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Recorridos
            </button>
            <button
              onClick={() => setActiveTab("alertas")}
              className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all relative ${
                activeTab === "alertas" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Alertas ({activeAlerts.length})
              {activeAlerts.some((a) => a.isPanic) && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Body - Centered max-width viewport */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-20">
          {activeTab === "tareas" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: Form (5/12) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm sticky top-6">
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-500" /> Programar Rutina de Trabajo
                  </h3>
                  <form onSubmit={handleCreateTask} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Cliente / Punto</label>
                        <select
                          required
                          value={taskClientId}
                          onChange={(e) => {
                            setTaskClientId(e.target.value);
                            setTaskAssignedToId(""); // reset assigned
                          }}
                          className="w-full text-xs p-2.5 border border-zinc-200 rounded-xl focus:ring-1 focus:ring-zinc-400 focus:outline-none bg-white"
                        >
                          <option value="">Seleccionar...</option>
                          {clients.map((cli) => (
                            <option key={cli.id} value={cli.id}>
                              {cli.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Especialidad</label>
                        <select
                          value={taskType}
                          onChange={(e) => {
                            setTaskType(e.target.value as "Seguridad" | "Limpieza");
                            setTaskAssignedToId(""); // reset assigned
                          }}
                          className="w-full text-xs p-2.5 border border-zinc-200 rounded-xl focus:ring-1 focus:ring-zinc-400 focus:outline-none bg-white"
                        >
                          <option value="Seguridad">🛡️ Seguridad</option>
                          <option value="Limpieza">🧼 Limpieza</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Descripción de la Actividad</label>
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Ej. Rondín perimetral de patio norte"
                        className="w-full text-xs p-2.5 border border-zinc-200 rounded-xl focus:ring-1 focus:ring-zinc-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Colaborador Asignado</label>
                        <select
                          required
                          value={taskAssignedToId}
                          onChange={(e) => setTaskAssignedToId(e.target.value)}
                          className="w-full text-xs p-2.5 border border-zinc-200 rounded-xl focus:ring-1 focus:ring-zinc-400 focus:outline-none bg-white"
                        >
                          <option value="">Seleccionar...</option>
                          {availablePersonnel.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Frecuencia</label>
                        <select
                          value={taskFrequency}
                          onChange={(e) => setTaskFrequency(e.target.value as any)}
                          className="w-full text-xs p-2.5 border border-zinc-200 rounded-xl focus:ring-1 focus:ring-zinc-400 focus:outline-none bg-white"
                        >
                          <option value="Diario">Diario</option>
                          <option value="Semanal">Semanal</option>
                          <option value="Mensual">Mensual</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!taskClientId || !taskAssignedToId || !taskTitle}
                      className="w-full bg-zinc-900 text-white text-xs font-semibold py-2.5 rounded-xl transition hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm mt-3"
                    >
                      <Plus className="w-4 h-4" /> Agregar Actividad Programada
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Scheduled Tasks List (7/12) */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block px-1">
                  Todas las Actividades del Turno ({tasks.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task) => {
                    const client = clients.find((c) => c.id === task.clientId);
                    const staff = personnel.find((p) => p.id === task.assignedToId);
                    const backupStaff = personnel.filter(
                      (p) => p.assignedClientId === task.clientId && p.role === task.type && p.id !== task.assignedToId
                    );

                    return (
                      <div key={task.id} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase ${
                                task.type === "Seguridad" ? "bg-rose-50 text-rose-700" : "bg-cyan-50 text-cyan-700"
                              }`}
                            >
                              {task.type}
                            </span>
                            <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-mono">
                              {task.frequency}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                                task.status === "Completada"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700 animate-pulse-subtle"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-zinc-800 mt-2 leading-snug">{task.title}</h4>
                          <div className="text-[10px] text-zinc-500 mt-2 space-y-0.5 font-mono">
                            <div>Punto: <span className="font-semibold text-zinc-700">{client ? client.name : "N/A"}</span></div>
                            <div>Asignado: <span className="font-semibold text-zinc-700">{staff ? staff.name : "Sin asignar"}</span></div>
                          </div>
                        </div>

                        {/* Absences / Emergency Reassignment option */}
                        {task.status !== "Completada" && backupStaff.length > 0 && (
                          <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 space-y-1 mt-2">
                            <label className="block text-[9px] text-zinc-500 font-medium">
                              🚨 ¿Inasistencia o emergencia? Reasignar a:
                            </label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) handleReassignTask(task.id, e.target.value);
                              }}
                              className="w-full text-[10px] p-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none"
                              defaultValue=""
                            >
                              <option value="">Seleccionar relevo...</option>
                              {backupStaff.map((bk) => (
                                <option key={bk.id} value={bk.id}>
                                  {bk.name} ({bk.role})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "evidencia" && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block px-1">
                Revisiones Fotográficas Pendientes y Reportes ({tasksWithEvidence.length})
              </span>

              {tasksWithEvidence.length === 0 ? (
                <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-3">
                  <Camera className="w-10 h-10 text-zinc-300 mx-auto" />
                  <h4 className="text-sm font-bold text-zinc-500">Sin evidencias por validar</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Las fotos tomadas por el personal operativo al finalizar sus tareas aparecerán aquí para tu aprobación en tiempo real.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasksWithEvidence.map((task) => {
                    const client = clients.find((c) => c.id === task.clientId);
                    const staff = personnel.find((p) => p.id === task.assignedToId);

                    return (
                      <div key={task.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          <img
                            src={task.photoEvidence}
                            alt="Evidencia fotográfica"
                            referrerPolicy="no-referrer"
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-mono px-2 py-0.5 rounded ${
                                  task.type === "Seguridad" ? "bg-rose-50 text-rose-700" : "bg-cyan-50 text-cyan-700"
                                }`}
                              >
                                {task.type}
                              </span>
                              <span className="text-xs text-zinc-400 font-mono">
                                Completado: {task.completedAt ? new Date(task.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "N/A"}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-zinc-800 leading-tight">{task.title}</h4>
                              <p className="text-xs text-zinc-500 mt-1">
                                Punto: <span className="font-semibold text-zinc-700">{client ? client.name : "N/A"}</span>
                              </p>
                              <p className="text-xs text-zinc-500">
                                Colaborador: <span className="font-semibold text-zinc-700">{staff ? staff.name : "N/A"}</span>
                              </p>
                            </div>

                            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 text-xs text-zinc-600 italic">
                              "{task.textEvidence || "Sin descripción proporcionada."}"
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <button
                            onClick={() => {
                              // Approve task: set text evidence / status approved
                              setTasks((prev) =>
                                prev.map((t) => (t.id === task.id ? { ...t, status: "Completada" as const } : t))
                              );
                              triggerNotification("Evidencia fotográfica aprobada exitosamente.");
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Aprobar Reporte
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "recorridos" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: Map Simulator (8/12) */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Geolocalización de Colaboradores en Campo
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">Total: {personnel.length} en plantilla</span>
                </div>
                <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
                  <MapSimulator
                    clients={clients}
                    personnel={personnel}
                    incidents={incidents}
                    attendance={attendance}
                  />
                </div>
              </div>

              {/* Right Column: Active shifts (4/12) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Turnos e Ingresos Activos</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Control de asistencia georreferenciada.</p>
                  </div>
                  <div className="space-y-3">
                    {attendance.filter((a) => !a.checkOutTime).map((log) => {
                      return (
                        <div key={log.id} className="flex flex-col justify-between text-xs border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                          <div>
                            <span className="font-semibold text-zinc-800 block text-xs">{log.personnelName}</span>
                            <div className="text-xs text-zinc-500 mt-1">
                              Ubicación: <span className="font-medium text-zinc-600">{log.clientName}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1">
                            <span className="text-xs font-mono text-zinc-500">
                              Ingreso: {new Date(log.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded font-bold font-mono ${
                              log.checkInValid ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {log.checkInValid ? "RANGO VÁLIDO" : "FUERA DE RANGO"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {attendance.filter((a) => !a.checkOutTime).length === 0 && (
                      <p className="text-xs text-zinc-400 text-center py-4">No hay personal con turno iniciado en este momento.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alertas" && (
            <div className="space-y-4 animate-fade-in">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block px-1">
                Atención Inmediata de Alertas ({activeAlerts.length})
              </span>

              {activeAlerts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-3">
                  <Check className="w-10 h-10 text-emerald-500 mx-auto bg-emerald-50 p-2 rounded-full" />
                  <h4 className="text-sm font-bold text-zinc-800">Todo en orden en campo</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    No se han registrado reportes críticos o pulsaciones de botón de pánico en las últimas horas. El personal opera con normalidad.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeAlerts.map((inc) => (
                    <div
                      key={inc.id}
                      className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-colors flex flex-col justify-between ${
                        inc.isPanic ? "border-rose-300 bg-rose-50/10" : "border-zinc-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          {inc.isPanic ? (
                            <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded animate-pulse">
                              🚨 BOTÓN DE PÁNICO
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded">
                              ⚠️ INCIDENCIA PRIORITARIA
                            </span>
                          )}
                          <span className="text-xs text-zinc-400 font-mono">
                            {new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-800 mt-3">{inc.clientName}</h4>
                        <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                          "{inc.description}"
                        </p>
                        <div className="text-xs text-zinc-400 mt-2.5 font-mono">
                          Reportado por: <span className="text-zinc-600 font-semibold">{inc.personnelName}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-2">
                        {resolvingIncidentId === inc.id ? (
                          <div className="bg-white p-3.5 rounded-xl border border-zinc-200 space-y-3 animate-fade-in">
                            <label className="block text-xs text-zinc-500 font-medium">
                              Instrucciones / Bitácora de Resolución
                            </label>
                            <textarea
                              rows={2}
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                              placeholder="Ej. Se envió patrulla de apoyo."
                              className="w-full text-xs p-2.5 border border-zinc-200 rounded-lg focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResolveIncident(inc.id)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition"
                              >
                                Guardar y Cerrar
                              </button>
                              <button
                                onClick={() => setResolvingIncidentId(null)}
                                className="px-3 py-2 border border-zinc-200 text-zinc-500 text-xs rounded-lg hover:bg-zinc-50"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingIncidentId(inc.id)}
                            className="w-full bg-zinc-900 text-white text-xs font-semibold py-2.5 rounded-xl transition hover:bg-zinc-800 flex items-center justify-center gap-1"
                          >
                            Atender y Registrar Resolución
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
