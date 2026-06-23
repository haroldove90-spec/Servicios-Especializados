import React, { useState } from "react";
import { Client, Personnel, Task, AttendanceLog, IncidentReport } from "../types";
import {
  MapPin,
  CheckSquare,
  Square,
  AlertOctagon,
  Camera,
  Upload,
  Send,
  User,
  CheckCircle,
  HelpCircle,
  Clock,
  Shield,
  Briefcase,
  AlertTriangle
} from "lucide-react";

interface OperativeRoleProps {
  clients: Client[];
  personnel: Personnel[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  attendance: AttendanceLog[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceLog[]>>;
  incidents: IncidentReport[];
  setIncidents: React.Dispatch<React.SetStateAction<IncidentReport[]>>;
}

export default function OperativeRole({
  clients,
  personnel,
  tasks,
  setTasks,
  attendance,
  setAttendance,
  incidents,
  setIncidents,
}: OperativeRoleProps) {
  // Simulating active personnel switching (for demonstration convenience in UI)
  const [activeWorkerId, setActiveWorkerId] = useState(personnel[0]?.id || "");
  // Simulating custom coordinate positioning (to test geofencing!)
  const [gpsSimulatedStatus, setGpsSimulatedStatus] = useState<"dentro" | "fuera">("dentro");

  // State for completing a task
  const [activeTaskIdToComplete, setActiveTaskIdToComplete] = useState<string | null>(null);
  const [taskPhotoUrl, setTaskPhotoUrl] = useState("");
  const [taskNotes, setTaskNotes] = useState("");

  // State for adding a digital incident report
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentType, setIncidentType] = useState<"Prioritaria" | "Informativa">("Informativa");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentPhoto, setIncidentPhoto] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const currentWorker = personnel.find((p) => p.id === activeWorkerId);
  const currentClient = clients.find((c) => c?.id === currentWorker?.assignedClientId);

  // Filter tasks assigned to current active worker
  const myTasks = tasks.filter((t) => t.assignedToId === activeWorkerId);

  // Check if current worker has an active checked-in shift
  const currentShift = attendance.find((a) => a.personnelId === activeWorkerId && !a.checkOutTime);

  // Geofencing coordinates simulation
  const getGpsCoords = () => {
    if (!currentClient) return { lat: 19.42, lng: -99.16 };
    if (gpsSimulatedStatus === "dentro") {
      // Very close to client location (within radius)
      return {
        lat: currentClient.lat + (Math.random() - 0.5) * 0.0002,
        lng: currentClient.lng + (Math.random() - 0.5) * 0.0002,
        valid: true,
      };
    } else {
      // Far from client location (outside geofence radius)
      return {
        lat: currentClient.lat + 0.015,
        lng: currentClient.lng - 0.015,
        valid: false,
      };
    }
  };

  const handleCheckIn = () => {
    if (!currentWorker || !currentClient) return;

    const coords = getGpsCoords();
    const newLog: AttendanceLog = {
      id: `att-${Date.now()}`,
      personnelId: currentWorker.id,
      personnelName: currentWorker.name,
      clientId: currentClient.id,
      clientName: currentClient.name,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      checkInLat: coords.lat,
      checkInLng: coords.lng,
      checkInValid: coords.valid,
    };

    setAttendance((prev) => [...prev, newLog]);

    if (!coords.valid) {
      triggerNotification(
        `⚠️ ADVERTENCIA: Check-In fuera de geocerca del cliente (${currentClient.name}). Se alertó al supervisor.`
      );
    } else {
      triggerNotification(`✅ REGISTRO EXITOSO: Entrada confirmada en ${currentClient.name}.`);
    }
  };

  const handleCheckOut = () => {
    if (!currentShift || !currentClient) return;

    const coords = getGpsCoords();
    setAttendance((prev) =>
      prev.map((log) =>
        log.id === currentShift.id
          ? {
              ...log,
              checkOutTime: new Date().toISOString(),
              checkOutLat: coords.lat,
              checkOutLng: coords.lng,
              checkOutValid: coords.valid,
            }
          : log
      )
    );
    triggerNotification(`👋 Salida registrada correctamente. ¡Buen descanso!`);
  };

  // Submit task completion with simulated photo upload
  const handleCompleteTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskIdToComplete) return;

    // Use simulated photo or a neat fallback
    const simulatedPhoto =
      taskPhotoUrl ||
      (currentWorker?.role === "Guardia"
        ? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
        : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400");

    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTaskIdToComplete
          ? {
              ...t,
              status: "Completada" as const,
              completedAt: new Date().toISOString(),
              photoEvidence: simulatedPhoto,
              textEvidence: taskNotes || "Actividad completada de acuerdo a lineamientos operativos.",
            }
          : t
      )
    );

    setActiveTaskIdToComplete(null);
    setTaskPhotoUrl("");
    setTaskNotes("");
    triggerNotification("🚀 Reporte fotográfico enviado al supervisor.");
  };

  // Submit customized Incident Report
  const handleAddIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorker || !currentClient || !incidentDescription) return;

    const coords = getGpsCoords();
    const newInc: IncidentReport = {
      id: `inc-${Date.now()}`,
      personnelId: currentWorker.id,
      personnelName: currentWorker.name,
      clientId: currentClient.id,
      clientName: currentClient.name,
      type: incidentType,
      description: incidentDescription,
      photoUrl:
        incidentPhoto || "https://images.unsplash.com/photo-1590105577767-e21a1067899f?auto=format&fit=crop&q=80&w=400",
      timestamp: new Date().toISOString(),
      status: "Abierta",
      isPanic: false,
      lat: coords.lat,
      lng: coords.lng,
    };

    setIncidents((prev) => [newInc, ...prev]);
    setShowIncidentForm(false);
    setIncidentDescription("");
    setIncidentPhoto("");
    triggerNotification("✅ Novedad reportada. El supervisor ya tiene acceso a la bitácora.");
  };

  // Immediate PANIC Button
  const handlePanicTrigger = () => {
    if (!currentWorker || !currentClient) return;

    const coords = getGpsCoords();
    const panicAlert: IncidentReport = {
      id: `inc-panic-${Date.now()}`,
      personnelId: currentWorker.id,
      personnelName: currentWorker.name,
      clientId: currentClient.id,
      clientName: currentClient.name,
      type: "Prioritaria",
      description: "⚠️ BOTÓN DE PÁNICO ACTIVADO DESDE LA APP MÓVIL - SOLICITA APOYO INMEDIATO.",
      timestamp: new Date().toISOString(),
      status: "Abierta",
      isPanic: true,
      lat: coords.lat,
      lng: coords.lng,
    };

    setIncidents((prev) => [panicAlert, ...prev]);

    // Simulated vibration/siren sound effect alerts
    triggerNotification("🚨 ALERTA DE PÁNICO ENVIADA EN TIEMPO REAL. Se comparte tu GPS.");
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100" id="operative-module">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-rose-500 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-lg border border-rose-400 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header - Switch Worker for Demo convenience */}
      <div className="bg-zinc-950 p-4 pb-5 rounded-b-[2rem] border-b border-zinc-800 shadow-xl space-y-3 shrink-0">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-400">
              {currentWorker?.name.charAt(0) || "OP"}
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Personal Móvil</span>
              <h2 className="text-xs font-semibold text-zinc-200">{currentWorker?.name}</h2>
            </div>
          </div>
          <span
            className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
              currentWorker?.role === "Guardia" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            }`}
          >
            {currentWorker?.role}
          </span>
        </div>

        {/* Simulators Bar */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Demo Switcher */}
          <div className="flex gap-2 items-center bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80">
            <label className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">Simular Usuario:</label>
            <select
              value={activeWorkerId}
              onChange={(e) => {
                setActiveWorkerId(e.target.value);
                setActiveTaskIdToComplete(null);
                setShowIncidentForm(false);
              }}
              className="flex-1 bg-zinc-950 text-xs text-zinc-300 p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-700 border-none"
            >
              {personnel.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </div>

          {/* Geofence Simulator Toggle */}
          <div className="flex justify-between items-center text-[10px] bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/80">
            <span className="text-zinc-500 font-mono">Simulador GPS:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setGpsSimulatedStatus("dentro")}
                className={`px-2.5 py-1 rounded-md font-medium text-[9px] transition-all ${
                  gpsSimulatedStatus === "dentro" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-zinc-500"
                }`}
              >
                Dentro Geocerca
              </button>
              <button
                onClick={() => setGpsSimulatedStatus("fuera")}
                className={`px-2.5 py-1 rounded-md font-medium text-[9px] transition-all ${
                  gpsSimulatedStatus === "fuera" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "text-zinc-500"
                }`}
              >
                Fuera Geocerca
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operative Views Body - Centered max-width layout */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Asistencia & Panic (5/12) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Check-In / Check-Out Geolocalizado */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400" /> Registro de Asistencia
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1.5 font-mono">
                    Punto: <span className="text-zinc-300 font-semibold">{currentClient ? currentClient.name : "N/A"}</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Límite Geocerca: <span className="text-zinc-400">{currentClient ? `${currentClient.radius} metros` : "N/A"}</span>
                  </p>
                </div>
                {currentShift ? (
                  <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    EN TURNO
                  </span>
                ) : (
                  <span className="bg-zinc-850 text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    FUERA DE TURNO
                  </span>
                )}
              </div>

              <div className="pt-1">
                {!currentShift ? (
                  <button
                    onClick={handleCheckIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" /> Registrar Entrada (Check-In)
                  </button>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    className="w-full bg-zinc-800 hover:bg-zinc-750 text-zinc-100 text-xs font-bold py-3 rounded-xl transition shadow-lg active:scale-95 flex items-center justify-center gap-1.5 border border-zinc-700"
                  >
                    <Clock className="w-4 h-4" /> Registrar Salida (Check-Out)
                  </button>
                )}
              </div>
            </div>

            {/* PANIC BUTTON (Special for Security roles) */}
            {currentWorker?.role === "Guardia" && (
              <div className="bg-zinc-950 p-5 rounded-2xl border border-rose-950/40 shadow-lg text-center space-y-3.5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-widest block">
                    🚨 PROTOCOLO DE INCIDENTES CRÍTICOS
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                    Presiona el botón ante cualquier situación de riesgo o peligro inminente para enviar tu geolocalización.
                  </p>
                </div>

                <button
                  onClick={handlePanicTrigger}
                  className="w-24 h-24 rounded-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 mx-auto flex flex-col items-center justify-center border-4 border-rose-950/60 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse-slow font-black text-xs text-white uppercase tracking-wider gap-0.5"
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                  S.O.S
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Daily Routine checklists and digital logs (7/12) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Daily Routine / Tasks Checklist */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block px-1">
                Lista de Tareas Diarias ({myTasks.length})
              </span>

              {myTasks.length === 0 ? (
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-850 text-center text-zinc-500 text-xs">
                  No tienes actividades asignadas por tu supervisor para este turno.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myTasks.map((task) => {
                    const isCompleted = task.status === "Completada";

                    return (
                      <div
                        key={task.id}
                        className={`bg-zinc-950 p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isCompleted ? "border-zinc-900 opacity-60" : "border-zinc-850"
                        }`}
                      >
                        <div>
                          <div className="flex items-start gap-2.5">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <div
                                className="w-4 h-4 rounded border border-zinc-600 hover:border-zinc-400 flex items-center justify-center cursor-pointer shrink-0 mt-0.5"
                                onClick={() => {
                                  if (!currentShift) {
                                    triggerNotification("⚠️ Primero debes iniciar tu turno (Check-In) antes de completar tareas.");
                                    return;
                                  }
                                  setActiveTaskIdToComplete(task.id);
                                }}
                              ></div>
                            )}
                            <div className="flex-1">
                              <h4 className={`text-xs font-bold leading-tight ${isCompleted ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                                {task.title}
                              </h4>
                              <div className="flex gap-1.5 mt-2">
                                <span className="text-[8px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                                  {task.frequency}
                                </span>
                                <span className="text-[8px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">
                                  {task.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Completion evidence upload form */}
                        {activeTaskIdToComplete === task.id && (
                          <form onSubmit={handleCompleteTaskSubmit} className="mt-3 pt-3 border-t border-zinc-900 space-y-3 animate-fade-in">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Reportar Evidencia Fotográfica
                            </span>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setTaskPhotoUrl(
                                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400"
                                  )
                                }
                                className={`p-2 rounded-xl border border-zinc-800 text-left text-[10px] flex items-center gap-1.5 transition-colors ${
                                  taskPhotoUrl.includes("1581578731548") ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "text-zinc-400"
                                }`}
                              >
                                <Camera className="w-3.5 h-3.5" /> Foto Guardia
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setTaskPhotoUrl(
                                    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
                                  )
                                }
                                className={`p-2 rounded-xl border border-zinc-800 text-left text-[10px] flex items-center gap-1.5 transition-colors ${
                                  taskPhotoUrl.includes("1517245386807") ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "text-zinc-400"
                                }`}
                              >
                                <Camera className="w-3.5 h-3.5" /> Foto Limpieza
                              </button>
                            </div>

                            <div>
                              <input
                                type="text"
                                value={taskNotes}
                                onChange={(e) => setTaskNotes(e.target.value)}
                                placeholder="Comentario rápido (opcional)"
                                className="w-full text-xs p-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-700 text-zinc-100"
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 rounded-xl transition"
                              >
                                Enviar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTaskIdToComplete(null);
                                  setTaskPhotoUrl("");
                                  setTaskNotes("");
                                }}
                                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] rounded-xl transition"
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Digital Logs and Incidents Report */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">
                  Bitácora e Incidencias en Turno
                </span>
                <button
                  onClick={() => {
                    if (!currentShift) {
                      triggerNotification("⚠️ Primero debes iniciar tu turno (Check-In) antes de reportar incidencias.");
                      return;
                    }
                    setShowIncidentForm((prev) => !prev);
                  }}
                  className="text-[10px] text-amber-400 font-bold hover:underline"
                >
                  + Levantar Reporte
                </button>
              </div>

              {showIncidentForm && (
                <form onSubmit={handleAddIncidentSubmit} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-zinc-855 pb-2">
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Ficha de Incidencia</span>
                    <span className="text-[9px] text-zinc-500 font-mono">GPS Automático</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-mono mb-1">Clasificación</label>
                      <select
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value as any)}
                        className="w-full text-xs p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none"
                      >
                        <option value="Informativa">Informativa (Menor)</option>
                        <option value="Prioritaria">Prioritaria (Grave)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 font-mono mb-1">Foto de Evidencia</label>
                      <select
                        value={incidentPhoto}
                        onChange={(e) => setIncidentPhoto(e.target.value)}
                        className="w-full text-xs p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none"
                      >
                        <option value="">Ninguna...</option>
                        <option value="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400">
                          Anomalía de puerta
                        </option>
                        <option value="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400">
                          Fuga de líquidos
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-500 font-mono mb-1">Detalle / Descripción</label>
                    <textarea
                      required
                      rows={3}
                      value={incidentDescription}
                      onChange={(e) => setIncidentDescription(e.target.value)}
                      placeholder="Describe la novedad o incidente con precisión..."
                      className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> Enviar Reporte
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowIncidentForm(false)}
                      className="px-3 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs rounded-xl transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {/* Incidents preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incidents.filter((i) => i.personnelId === activeWorkerId).map((inc) => (
                  <div key={inc.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 text-xs flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          inc.type === "Prioritaria" ? "bg-rose-500/10 text-rose-400" : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {inc.type}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-zinc-300 font-medium leading-relaxed">{inc.description}</p>
                    </div>
                    <span className={`text-[8px] font-bold self-start px-2 py-0.5 rounded uppercase ${
                      inc.status === "Atendida" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
