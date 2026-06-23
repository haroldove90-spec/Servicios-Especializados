import React, { useState, useEffect } from "react";
import {
  INITIAL_CLIENTS,
  INITIAL_PERSONNEL,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE,
  INITIAL_INCIDENTS,
  loadFromStorage,
  saveToStorage,
  clearAllStorage
} from "./data";
import { Client, Personnel, Task, AttendanceLog, IncidentReport } from "./types";
import {
  ShieldAlert,
  ClipboardList,
  Smartphone,
  ChevronLeft,
  Battery,
  Wifi,
  Signal,
  Sparkles,
  RefreshCw,
  Clock,
  Shield,
  Brush
} from "lucide-react";
import AdminRole from "./components/AdminRole";
import SupervisorRole from "./components/SupervisorRole";
import { motion } from "motion/react";
import OperativeRole from "./components/OperativeRole";

export default function App() {
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage("clients", INITIAL_CLIENTS));
  const [personnel, setPersonnel] = useState<Personnel[]>(() => loadFromStorage("personnel", INITIAL_PERSONNEL));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage("tasks", INITIAL_TASKS));
  const [attendance, setAttendance] = useState<AttendanceLog[]>(() => loadFromStorage("attendance", INITIAL_ATTENDANCE));
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => loadFromStorage("incidents", INITIAL_INCIDENTS));

  // Current active role view inside our simulated mobile container
  // "home" | "admin" | "supervisor" | "operative"
  const [activeRole, setActiveRole] = useState<"home" | "admin" | "supervisor" | "operative">("home");

  // Local Time clock for mobile status bar
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save states to local storage on changes
  useEffect(() => {
    saveToStorage("clients", clients);
  }, [clients]);

  useEffect(() => {
    saveToStorage("personnel", personnel);
  }, [personnel]);

  useEffect(() => {
    saveToStorage("tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage("attendance", attendance);
  }, [attendance]);

  useEffect(() => {
    saveToStorage("incidents", incidents);
  }, [incidents]);

  return (
    <div className="h-screen w-full bg-stone-50 text-stone-900 flex flex-col select-none overflow-hidden" id="app-root">
      {/* Dynamic Global Top Header Bar */}
      <header className="bg-stone-900 text-white px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-stone-800 shadow-lg shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold tracking-tight text-stone-100 uppercase font-sans flex items-center gap-1.5">
              OPERACIONES INTEGRALES
            </h1>
            <p className="text-[10px] text-stone-400 hidden sm:block">
              Seguridad Privada &bull; Limpieza Industrial &bull; Control Geolocalizado CDMX
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeRole !== "home" && (
            <button
              onClick={() => setActiveRole("home")}
              className="flex items-center gap-1 text-[11px] md:text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-750 px-3 py-1.5 rounded-lg border border-stone-700 transition"
              id="btn-back-home"
            >
              <ChevronLeft className="w-4 h-4" /> Volver al Inicio
            </button>
          )}
          
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400 font-mono hidden md:inline">{currentTime || "14:33"}</span>
            {activeRole !== "home" && (
              <span className={`text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase ${
                activeRole === "admin" 
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" 
                  : activeRole === "supervisor" 
                    ? "bg-sky-400/10 text-sky-400 border border-sky-400/20" 
                    : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
              }`}>
                {activeRole === "admin" ? "S. ADMIN" : activeRole === "supervisor" ? "COORD" : "OPERATIVO"}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Smartphone Screen Content - Now a Full Screen responsive view */}
      <main className="flex-1 bg-stone-50 text-stone-900 overflow-hidden relative flex flex-col">
        {activeRole === "home" && (
          <div className="flex-1 flex flex-col justify-between p-6 md:p-12 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full my-auto space-y-8 md:space-y-12">
              {/* Home Hero Header */}
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 animate-pulse" /> Servicios Especializados de México
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-stone-100 font-sans max-w-3xl mx-auto leading-tight">
                    PORTAL DE CONTROL OPERATIVO
                  </h1>
                  <p className="text-xs md:text-sm text-stone-400 mt-2 max-w-xl mx-auto leading-relaxed">
                    Sistema integral de gestión de rondines de seguridad, asistencia de personal de limpieza industrial, bitácora de novedades y auditoría en tiempo real.
                  </p>
                </div>
              </div>

              {/* Service Pillars Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
                <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 text-left flex items-center gap-4 h-24">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-bold block text-stone-100">Seguridad Privada</span>
                    <span className="text-[10px] text-stone-400">Control de rondas, alertas SOS satelitales y geofencing.</span>
                  </div>
                </div>
                <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 text-left flex items-center gap-4 h-24">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Brush className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-bold block text-stone-100">Limpieza Industrial</span>
                    <span className="text-[10px] text-stone-400">Ruleros de sanitización, evidencias fotográficas y check-ins.</span>
                  </div>
                </div>
              </div>

              {/* Interactive Role Buttons - Styled for Tablet/Desktop side-by-side grids */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block text-center">
                  SELECCIONAR ACCESO POR ROL
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                  {/* Rol 1: Super Administrador / Dueño */}
                  <button
                    onClick={() => setActiveRole("admin")}
                    className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 p-5 rounded-2xl flex flex-col justify-between text-left transition duration-300 group hover:border-amber-400/40 active:scale-[0.98] shadow-lg min-h-[170px]"
                    id="btn-role-admin"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                        <ShieldAlert className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/30 font-mono font-bold px-2 py-0.5 rounded-full">
                        S. ADMIN
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition">Super Administrador</span>
                      <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">Alta de clientes, definición de contratos, mapa GPS y descarga de reportes CSV.</p>
                    </div>
                  </button>

                  {/* Rol 2: Supervisor / Coordinador */}
                  <button
                    onClick={() => setActiveRole("supervisor")}
                    className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 p-5 rounded-2xl flex flex-col justify-between text-left transition duration-300 group hover:border-sky-400/40 active:scale-[0.98] shadow-lg min-h-[170px]"
                    id="btn-role-supervisor"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-11 h-11 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
                        <ClipboardList className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[9px] bg-sky-400/15 text-sky-400 border border-sky-400/30 font-mono font-bold px-2 py-0.5 rounded-full">
                        CAMPO
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-bold text-stone-100 group-hover:text-sky-300 transition">Supervisor de Campo</span>
                      <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">Programación de rutinas, relevos de personal, atención de pánicos y aprobación de evidencias.</p>
                    </div>
                  </button>

                  {/* Rol 3: Personal Operativo */}
                  <button
                    onClick={() => setActiveRole("operative")}
                    className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 p-5 rounded-2xl flex flex-col justify-between text-left transition duration-300 group hover:border-emerald-400/40 active:scale-[0.98] shadow-lg min-h-[170px]"
                    id="btn-role-operative"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Smartphone className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[9px] bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 font-mono font-bold px-2 py-0.5 rounded-full">
                        MÓVIL
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition">Personal Operativo</span>
                      <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">Check-in geolocalizado, envío de bitácoras, botón de pánico SOS y subida de fotos.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Maintenance Reset Button & Footer */}
            <div className="pt-6 border-t border-stone-800 text-center flex flex-col gap-1 mt-6 max-w-5xl mx-auto w-full">
              <button
                onClick={clearAllStorage}
                className="text-[10px] font-mono text-stone-500 hover:text-stone-300 flex items-center justify-center gap-1 mx-auto py-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restaurar base de datos simulación
              </button>
              <span className="text-[9px] text-stone-600 font-mono">
                Desarrollado en entorno corporativo para demostración interactiva de roles y geolocalización.
              </span>
            </div>
          </div>
        )}

        {activeRole === "admin" && (
          <AdminRole
            clients={clients}
            setClients={setClients}
            personnel={personnel}
            setPersonnel={setPersonnel}
            tasks={tasks}
            attendance={attendance}
            incidents={incidents}
            setIncidents={setIncidents}
          />
        )}

        {activeRole === "supervisor" && (
          <SupervisorRole
            clients={clients}
            personnel={personnel}
            tasks={tasks}
            setTasks={setTasks}
            attendance={attendance}
            incidents={incidents}
            setIncidents={setIncidents}
          />
        )}

        {activeRole === "operative" && (
          <OperativeRole
            clients={clients}
            personnel={personnel}
            tasks={tasks}
            setTasks={setTasks}
            attendance={attendance}
            setAttendance={setAttendance}
            incidents={incidents}
            setIncidents={setIncidents}
          />
        )}
      </main>
    </div>
  );
}
