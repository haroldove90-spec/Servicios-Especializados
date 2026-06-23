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

  // Current active role view inside our mobile viewport
  const [activeRole, setActiveRole] = useState<"home" | "admin" | "supervisor" | "operative">("home");

  // Local Time clock for status bar
  const [currentTime, setCurrentTime] = useState("");

  // PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

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
      <header className="bg-stone-900 text-white px-4 md:px-8 py-4 flex items-center justify-between border-b border-stone-800 shadow-lg shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-extrabold tracking-tight text-stone-100 uppercase font-sans flex items-center gap-1.5">
              SERVICIOS ESPECIALIZADOS
            </h1>
            <p className="text-xs text-stone-400 hidden sm:block">
              Seguridad Privada &bull; Limpieza Industrial &bull; Control Inteligente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {activeRole !== "home" ? (
            <button
              onClick={() => setActiveRole("home")}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-750 px-4 py-2 rounded-xl border border-stone-700 transition"
              id="btn-back-home"
            >
              <ChevronLeft className="w-4 h-4" /> Volver al Inicio
            </button>
          ) : (
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-xl shadow-md transition transform active:scale-95"
              id="btn-install-pwa-header"
            >
              <Smartphone className="w-4 h-4" /> Instalar App PWA
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-300 font-mono hidden md:inline">{currentTime || "14:33"}</span>
            {activeRole !== "home" && (
              <span className={`text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase ${
                activeRole === "admin" 
                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" 
                  : activeRole === "supervisor" 
                    ? "bg-sky-400/10 text-sky-400 border border-sky-400/20" 
                    : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
              }`}>
                {activeRole === "admin" ? "ADMIN" : activeRole === "supervisor" ? "COORD" : "MÓVIL"}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Smartphone Screen Content */}
      <main className="flex-1 bg-stone-50 text-stone-900 overflow-hidden relative flex flex-col">
        {activeRole === "home" && (
          <div className="flex-1 flex flex-col justify-between p-6 md:p-12 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full my-auto space-y-10 md:space-y-14">
              
              {/* Home Hero Header */}
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Servicios Especializados
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-100 font-sans max-w-3xl mx-auto leading-tight">
                    PORTAL DE CONTROL OPERATIVO
                  </h1>
                  <p className="text-sm md:text-base text-stone-400 mt-3 max-w-xl mx-auto leading-relaxed">
                    Acceso unificado para el monitoreo de rondines, reporte de asistencia con geolocalización y atención inmediata de incidencias.
                  </p>
                </div>
              </div>

              {/* Install PWA Prompt Banner */}
              <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-400/20 max-w-2xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">Acceso Móvil Rápido</span>
                  <p className="text-xs text-stone-300 mt-1">Usa la aplicación directamente en tu dispositivo sin necesidad de tiendas.</p>
                </div>
                <button
                  onClick={handleInstallApp}
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition transform active:scale-95 shadow-md shrink-0"
                >
                  <Smartphone className="w-4 h-4" /> Instalar Aplicación
                </button>
              </div>

              {/* Service Pillars Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
                <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 text-left flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-stone-100">Seguridad Privada</span>
                    <p className="text-xs text-stone-400 mt-0.5">Control de rondines, reportes de pánico y geocercas satelitales.</p>
                  </div>
                </div>
                <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 text-left flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Brush className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-stone-100">Limpieza Industrial</span>
                    <p className="text-xs text-stone-400 mt-0.5">Control de asistencia, bitácora fotográfica y tareas diarias.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Role Buttons */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block text-center font-semibold">
                  SELECCIONAR ACCESO POR ROL
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                  {/* Rol 1: Super Administrador / Dueño */}
                  <button
                    onClick={() => setActiveRole("admin")}
                    className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between text-left transition duration-300 group hover:border-amber-400/40 active:scale-[0.98] shadow-lg min-h-[160px]"
                    id="btn-role-admin"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <span className="text-xs bg-amber-400/15 text-amber-400 border border-amber-400/30 font-mono font-bold px-3 py-0.5 rounded-full">
                        ADMIN
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition block">Super Administrador</span>
                      <p className="text-xs text-stone-400 mt-1 leading-normal">Clientes, contratos, plantilla y reportes en tiempo real.</p>
                    </div>
                  </button>

                  {/* Rol 2: Supervisor / Coordinador */}
                  <button
                    onClick={() => setActiveRole("supervisor")}
                    className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between text-left transition duration-300 group hover:border-sky-400/40 active:scale-[0.98] shadow-lg min-h-[160px]"
                    id="btn-role-supervisor"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <span className="text-xs bg-sky-400/15 text-sky-400 border border-sky-400/30 font-mono font-bold px-3 py-0.5 rounded-full">
                        COORD
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-bold text-stone-100 group-hover:text-sky-300 transition block">Supervisor de Campo</span>
                      <p className="text-xs text-stone-400 mt-1 leading-normal">Asignación de tareas, incidencias y validación de evidencias.</p>
                    </div>
                  </button>

                  {/* Rol 3: Personal Operativo */}
                  <button
                    onClick={() => setActiveRole("operative")}
                    className="bg-stone-900/80 hover:bg-stone-850 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between text-left transition duration-300 group hover:border-emerald-400/40 active:scale-[0.98] shadow-lg min-h-[160px]"
                    id="btn-role-operative"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <span className="text-xs bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 font-mono font-bold px-3 py-0.5 rounded-full">
                        OPERATIVO
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-bold text-stone-100 group-hover:text-emerald-300 transition block">Personal Móvil</span>
                      <p className="text-xs text-stone-400 mt-1 leading-normal">Check-In geolocalizado, tareas del día y reporte de pánicos.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Maintenance Reset Button & Footer */}
            <div className="pt-6 border-t border-stone-800 text-center flex flex-col gap-1 mt-6 max-w-5xl mx-auto w-full">
              <button
                onClick={clearAllStorage}
                className="text-xs font-mono text-stone-500 hover:text-stone-300 flex items-center justify-center gap-1 mx-auto py-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reestablecer base de datos demo
              </button>
              <span className="text-xs text-stone-600 font-mono">
                Servicios Especializados &bull; Portal de demostración operativa
              </span>
            </div>
          </div>
        )}

        {/* PWA Install Guide Modal */}
        {showInstallGuide && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl max-w-sm w-full text-white space-y-4 animate-fade-in shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <h3 className="text-sm font-extrabold tracking-wider text-amber-400 uppercase flex items-center gap-2">
                  <Smartphone className="w-5 h-5" /> Instalar en Dispositivo
                </h3>
                <button 
                  onClick={() => setShowInstallGuide(false)}
                  className="text-stone-400 hover:text-white font-bold text-base px-2 py-1 hover:bg-stone-800 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3.5 text-xs text-stone-300 leading-relaxed">
                <p>Para instalar <strong className="text-white">Servicios Especializados</strong> en la pantalla de inicio de tu dispositivo móvil:</p>
                <div className="space-y-2 bg-stone-950/50 p-3.5 rounded-xl border border-stone-850">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <p><strong className="text-white">En iOS (Safari):</strong> Pulsa el botón <strong className="text-white">Compartir</strong> (icono de cuadrado con flecha hacia arriba) y selecciona <strong className="text-white">"Añadir a pantalla de inicio"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5 mt-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <p><strong className="text-white">En Android (Chrome):</strong> Pulsa el icono de <strong className="text-white">tres puntos</strong> en la esquina superior derecha y selecciona <strong className="text-white">"Instalar aplicación"</strong>.</p>
                  </div>
                </div>
                <p className="text-stone-400 text-[11px]">Esto te permitirá abrir la app en pantalla completa, offline y de forma independiente.</p>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="w-full bg-stone-800 hover:bg-stone-750 text-white text-xs font-bold py-2.5 rounded-xl border border-stone-700 transition"
              >
                Entendido
              </button>
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
