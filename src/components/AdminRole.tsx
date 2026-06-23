import React, { useState } from "react";
import { Client, Personnel, Task, AttendanceLog, IncidentReport } from "../types";
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  Trash2,
  Download,
  AlertOctagon,
  CheckCircle,
  Clock,
  Shield,
  Sparkles,
  MapPin,
  ChevronRight,
  TrendingUp,
  Map as MapIcon
} from "lucide-react";
import MapSimulator from "./MapSimulator";

interface AdminRoleProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  personnel: Personnel[];
  setPersonnel: React.Dispatch<React.SetStateAction<Personnel[]>>;
  tasks: Task[];
  attendance: AttendanceLog[];
  incidents: IncidentReport[];
  setIncidents: React.Dispatch<React.SetStateAction<IncidentReport[]>>;
}

export default function AdminRole({
  clients,
  setClients,
  personnel,
  setPersonnel,
  tasks,
  attendance,
  incidents,
  setIncidents,
}: AdminRoleProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "clientes" | "personal" | "reportes">("dashboard");

  // Client form state
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientLat, setClientLat] = useState("19.4285");
  const [clientLng, setClientLng] = useState("-99.1630");
  const [clientRadius, setClientRadius] = useState("150");
  const [selectedServices, setSelectedServices] = useState<("Seguridad" | "Limpieza")[]>(["Seguridad"]);
  const [contractStart, setContractStart] = useState("2026-06-01");
  const [contractEnd, setContractEnd] = useState("2027-06-01");

  // Personnel form state
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState<"Guardia" | "Limpieza">("Guardia");
  const [staffPhone, setStaffPhone] = useState("");
  const [assignedClientId, setAssignedClientId] = useState("");

  const [selectedClientForMap, setSelectedClientForMap] = useState<string | undefined>(clients[0]?.id);

  // Stats calculation
  const totalServices = tasks.length;
  const completedServices = tasks.filter((t) => t.status === "Completada").length;
  const pendingServices = tasks.filter((t) => t.status === "Pendiente").length;
  const completionRate = totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0;

  const activeIncidents = incidents.filter((i) => i.status === "Abierta");
  const activePanicCount = activeIncidents.filter((i) => i.isPanic).length;

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientAddress) return;

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: clientName,
      address: clientAddress,
      lat: parseFloat(clientLat) || 19.42,
      lng: parseFloat(clientLng) || -99.16,
      radius: parseInt(clientRadius) || 150,
      services: selectedServices,
      contractStart,
      contractEnd,
    };

    setClients((prev) => [...prev, newClient]);
    setSelectedClientForMap(newClient.id);
    // Reset form
    setClientName("");
    setClientAddress("");
    setClientLat((19.42 + (Math.random() - 0.5) * 0.1).toFixed(4));
    setClientLng((-99.16 + (Math.random() - 0.5) * 0.1).toFixed(4));
    setClientRadius("150");
    setSelectedServices(["Seguridad"]);
  };

  const handleDeleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (selectedClientForMap === id) {
      setSelectedClientForMap(clients.find((c) => c.id !== id)?.id);
    }
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffPhone || !assignedClientId) return;

    const newStaff: Personnel = {
      id: `per-${Date.now()}`,
      name: staffName,
      role: staffRole,
      status: "Activo",
      assignedClientId,
      phone: staffPhone,
    };

    setPersonnel((prev) => [...prev, newStaff]);
    // Reset form
    setStaffName("");
    setStaffPhone("");
    setAssignedClientId("");
  };

  const handleDeleteStaff = (id: string) => {
    setPersonnel((prev) => prev.filter((p) => p.id !== id));
  };

  // CSV Exporter mock downloads
  const downloadCSV = (type: "asistencia" | "incidencias") => {
    let headers = "";
    let rows = [];

    if (type === "asistencia") {
      headers = "ID Registro,Colaborador,Cliente,Fecha Entrada,Fecha Salida,Ubicación Entrada Valida?\n";
      rows = attendance.map(
        (log) =>
          `"${log.id}","${log.personnelName}","${log.clientName}","${log.checkInTime}","${
            log.checkOutTime || "En turno"
          }","${log.checkInValid ? "SÍ" : "NO"}"`
      );
    } else {
      headers = "ID Incidencia,Colaborador,Cliente,Tipo,Descripción,Prioridad,Fecha,Estado\n";
      rows = incidents.map(
        (inc) =>
          `"${inc.id}","${inc.personnelName}","${inc.clientName}","${inc.isPanic ? "Botón Pánico" : "Bitácora"}","${
            inc.description
          }","${inc.type}","${inc.timestamp}","${inc.status}"`
      );
    }

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_${type}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 text-stone-900" id="admin-module">
      {/* Top Banner Context - Spans full width, content stays aligned */}
      <div className="bg-stone-900 text-white pb-6 rounded-b-[2rem] shadow-md relative overflow-hidden shrink-0">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-stone-800 rounded-full opacity-30"></div>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700 font-bold text-amber-400">
                JH
              </div>
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">Panel Global</span>
                <h1 className="text-sm font-semibold text-stone-100">José Hernández</h1>
              </div>
            </div>
            <span className="bg-amber-400/10 text-amber-400 text-xs uppercase font-mono px-2.5 py-0.5 rounded-full border border-amber-400/20">
              DUEÑO / ADMIN
            </span>
          </div>

          {/* Minimal Nav pills */}
          <div className="flex gap-1.5 mt-5 bg-stone-950/40 p-1 rounded-xl max-w-md">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                activeTab === "dashboard" ? "bg-stone-100 text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("clientes")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                activeTab === "clientes" ? "bg-stone-100 text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                activeTab === "personal" ? "bg-stone-100 text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setActiveTab("reportes")}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                activeTab === "reportes" ? "bg-stone-100 text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Reportes
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Body - Centered max-width viewport */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-20">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: KPIs and Live Map (8/12 wide on desktop) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Quick KPIs Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between h-24">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Asistencia</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-stone-800">
                        {attendance.filter((a) => !a.checkOutTime).length}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">activos</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between h-24">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Servicios</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-stone-800">{completionRate}%</span>
                      <span className="text-xs text-emerald-500 font-mono">éxito</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between relative overflow-hidden h-24">
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Alertas</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-bold ${activePanicCount > 0 ? "text-rose-600 animate-pulse" : "text-amber-600"}`}>
                        {activeIncidents.length}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">abiertas</span>
                    </div>
                    {activePanicCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                </div>

                {/* Simulated Live Map Area */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-stone-600" /> Monitoreo GPS en Vivo
                    </h3>
                    <span className="text-xs text-stone-400 font-mono">Total: {clients.length} geocercas</span>
                  </div>
                  <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                    <MapSimulator
                      clients={clients}
                      personnel={personnel}
                      incidents={incidents}
                      attendance={attendance}
                      selectedClientId={selectedClientForMap}
                      onSelectClient={(id) => setSelectedClientForMap(id)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Alerts and Contracts Status (4/12 wide on desktop) */}
              <div className="lg:col-span-4 space-y-6">
                {/* List of Panic alerts or Emergencies */}
                {activeIncidents.length > 0 && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        Alertas Críticas
                      </span>
                      <span className="bg-rose-100 text-rose-800 text-xs font-mono font-bold px-2 py-0.5 rounded">
                        URGENTE
                      </span>
                    </div>
                    <div className="space-y-2">
                      {activeIncidents.map((inc) => (
                        <div
                          key={inc.id}
                          className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                              {inc.isPanic && <span className="text-xs bg-rose-600 text-white font-bold px-1.5 rounded">PANIC</span>}
                              <span>{inc.clientName}</span>
                            </div>
                            <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{inc.description}</p>
                            <div className="text-xs text-stone-400 mt-1.5 flex gap-2 font-mono">
                              <span>De: {inc.personnelName}</span>
                              <span>•</span>
                              <span>{new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>
                          <span className="bg-rose-50 text-rose-700 text-xs font-bold py-1 px-1.5 rounded-lg flex items-center gap-1 shrink-0">
                            <AlertOctagon className="w-3.5 h-3.5" /> {inc.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contracts status overview */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4.5 space-y-4.5 shadow-sm">
                  <div>
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Estatus Operativo de Servicios</h3>
                    <p className="text-xs text-stone-400 mt-0.5">Control de cumplimiento por geocercas fijas.</p>
                  </div>
                  <div className="space-y-3.5">
                    {clients.map((cli) => {
                      const clientTasks = tasks.filter((t) => t.clientId === cli.id);
                      const total = clientTasks.length;
                      const done = clientTasks.filter((t) => t.status === "Completada").length;
                      const rate = total > 0 ? Math.round((done / total) * 100) : 0;

                      return (
                        <div key={cli.id} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-stone-800 truncate max-w-[180px]">{cli.name}</span>
                            <span className="text-xs text-stone-500 font-mono">
                              {done}/{total} tareas
                            </span>
                          </div>
                          <div className="flex gap-1.5 mt-1.5">
                            {cli.services.map((srv) => (
                              <span
                                key={srv}
                                className={`text-xs font-mono px-2 py-0.5 rounded ${
                                  srv === "Seguridad"
                                    ? "bg-rose-50 text-rose-700 border border-rose-100"
                                    : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                                }`}
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                rate === 100 ? "bg-emerald-500" : rate > 0 ? "bg-amber-400" : "bg-stone-300"
                              }`}
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clientes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: Form (5/12) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm sticky top-6">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-stone-500" /> Alta de Cliente y Contrato
                  </h3>
                  <form onSubmit={handleAddClient} className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-stone-500 mb-1">Nombre Comercial</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Corporativo Chapultepec"
                        className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-stone-500 mb-1">Dirección Física</label>
                      <input
                        type="text"
                        required
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        placeholder="Av. Paseo de la Reforma #15, CDMX"
                        className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Geocerca Radio (metros)</label>
                        <select
                          value={clientRadius}
                          onChange={(e) => setClientRadius(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none bg-white"
                        >
                          <option value="100">100m (Estándar)</option>
                          <option value="150">150m (Corporativos)</option>
                          <option value="300">300m (Plantas Industriales)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Servicios Contratados</label>
                        <div className="flex gap-3 mt-2">
                          <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes("Seguridad")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServices((prev) => [...prev, "Seguridad"]);
                                } else {
                                  setSelectedServices((prev) => prev.filter((s) => s !== "Seguridad"));
                                }
                              }}
                              className="rounded text-stone-800"
                            />
                            <span>Seguridad</span>
                          </label>
                          <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes("Limpieza")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServices((prev) => [...prev, "Limpieza"]);
                                } else {
                                  setSelectedServices((prev) => prev.filter((s) => s !== "Limpieza"));
                                }
                              }}
                              className="rounded text-stone-800"
                            />
                            <span>Limpieza</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Inicio de Contrato</label>
                        <input
                          type="date"
                          value={contractStart}
                          onChange={(e) => setContractStart(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Fin de Contrato</label>
                        <input
                          type="date"
                          value={contractEnd}
                          onChange={(e) => setContractEnd(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Latitud GPS</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={clientLat}
                          onChange={(e) => setClientLat(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Longitud GPS</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={clientLng}
                          onChange={(e) => setClientLng(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedServices.length === 0}
                      className="w-full bg-stone-900 text-white text-xs font-semibold py-2.5 rounded-xl transition hover:bg-stone-800 disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm mt-3"
                    >
                      <Plus className="w-4 h-4" /> Agregar Cliente
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Clients List Grid (7/12) */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block px-1">
                  Clientes Registrados ({clients.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.map((cli) => (
                    <div
                      key={cli.id}
                      className={`bg-white p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        selectedClientForMap === cli.id ? "border-stone-400 ring-1 ring-stone-400" : "border-stone-200"
                      }`}
                    >
                      <div className="cursor-pointer" onClick={() => setSelectedClientForMap(cli.id)}>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-stone-800">{cli.name}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClient(cli.id);
                            }}
                            className="text-stone-400 hover:text-rose-600 transition p-1 shrink-0"
                            title="Eliminar Cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">{cli.address}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          <span className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">
                            Radio: {cli.radius}m
                          </span>
                          {cli.services.map((srv) => (
                            <span
                              key={srv}
                              className={`text-xs font-mono px-2 py-0.5 rounded ${
                                srv === "Seguridad"
                                  ? "bg-rose-50 text-rose-700 border border-rose-100"
                                  : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                              }`}
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-stone-400 mt-3.5 pt-2 border-t border-stone-50 font-mono flex justify-between items-center">
                        <span>Vigencia:</span>
                        <span>{cli.contractEnd}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: Form (5/12) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm sticky top-6">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-stone-500" /> Registro de Personal Operativo
                  </h3>
                  <form onSubmit={handleAddStaff} className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-stone-500 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="Carlos Ruiz Solís"
                        className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Rol / Especialidad</label>
                        <select
                          value={staffRole}
                          onChange={(e) => setStaffRole(e.target.value as "Guardia" | "Limpieza")}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none bg-white"
                        >
                          <option value="Guardia">🛡️ Guardia (Seguridad)</option>
                          <option value="Limpieza">🧼 Limpieza Industrial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-stone-500 mb-1">Teléfono Móvil</label>
                        <input
                          type="tel"
                          required
                          value={staffPhone}
                          onChange={(e) => setStaffPhone(e.target.value)}
                          placeholder="55-1234-5678"
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-500 mb-1">Asignar Cliente Fijo / Ubicación</label>
                      <select
                        required
                        value={assignedClientId}
                        onChange={(e) => setAssignedClientId(e.target.value)}
                        className="w-full text-xs p-2.5 border border-stone-200 rounded-xl focus:ring-1 focus:ring-stone-400 focus:outline-none bg-white"
                      >
                        <option value="">Selecciona un cliente...</option>
                        {clients.map((cli) => (
                          <option key={cli.id} value={cli.id}>
                            {cli.name} ({cli.services.join(", ")})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-stone-900 text-white text-xs font-semibold py-2.5 rounded-xl transition hover:bg-stone-800 flex items-center justify-center gap-1 shadow-sm mt-3"
                    >
                      <Plus className="w-4 h-4" /> Registrar Colaborador
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Personnel Grid List (7/12) */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block px-1">
                  Personal Operativo Registrado ({personnel.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personnel.map((p) => {
                    const client = clients.find((c) => c.id === p.assignedClientId);
                    return (
                      <div
                        key={p.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-stone-800 truncate">{p.name}</span>
                            <span
                              className={`text-xs font-mono px-2 py-0.5 rounded shrink-0 ${
                                p.role === "Guardia"
                                  ? "bg-rose-50 text-rose-700 border border-rose-100"
                                  : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                              }`}
                            >
                              {p.role}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-2">
                            Cliente: <span className="font-semibold text-stone-700">{client ? client.name : "Sin asignar"}</span>
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-50">
                          <span className="text-xs text-stone-400 font-mono">Cel: {p.phone}</span>
                          <button
                            onClick={() => handleDeleteStaff(p.id)}
                            className="text-stone-400 hover:text-rose-600 transition p-1 shrink-0"
                            title="Eliminar Personal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reportes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Left Column: Download forms (4/12) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-stone-500" /> Exportar Auditoría Consolidada
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Descarga las bitácoras operativas consolidadas en formato CSV compatible con Excel para control de nóminas y reporteo a clientes.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => downloadCSV("asistencia")}
                      className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-xl p-4 text-left flex flex-col justify-between gap-4 transition w-full"
                    >
                      <Download className="w-5 h-5 text-stone-600" />
                      <div>
                        <span className="text-xs font-bold block">Bitácora Asistencia</span>
                        <span className="text-xs text-stone-400 font-mono">Geofencing Logs</span>
                      </div>
                    </button>

                    <button
                      onClick={() => downloadCSV("incidencias")}
                      className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-xl p-4 text-left flex flex-col justify-between gap-4 transition w-full"
                    >
                      <Download className="w-5 h-5 text-stone-600" />
                      <div>
                        <span className="text-xs font-bold block">Bitácora Incidencias</span>
                        <span className="text-xs text-stone-400 font-mono">Fichas de Evidencia</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Heatmaps and stats (8/12) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Análisis de Novedades e Incidencias</h3>
                    <p className="text-xs text-stone-500 leading-relaxed mt-1">
                      Visualización de densidad de incidencias y novedades en zonas operativas. Se detectan anomalías para reajuste de rondines.
                    </p>
                  </div>

                  {/* Map simulator with heatmaps turned on */}
                  <div className="pt-2">
                    <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
                      Mapa de Calor de Frecuencia (Zonas Críticas)
                    </span>
                    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200">
                      <MapSimulator
                        clients={clients}
                        personnel={personnel}
                        incidents={incidents}
                        attendance={attendance}
                        showHeatmap={true}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="text-xs text-stone-500 block uppercase font-semibold">Total de reportes</span>
                      <span className="text-lg font-bold text-stone-800 mt-1 block">{incidents.length}</span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="text-xs text-stone-500 block uppercase font-semibold">Incidentes Prioridad</span>
                      <span className="text-lg font-bold text-amber-600 mt-1 block">
                        {incidents.filter((i) => i.type === "Prioritaria").length}
                      </span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="text-xs text-stone-500 block uppercase font-semibold">Pánicos S.O.S</span>
                      <span className="text-lg font-bold text-rose-600 mt-1 block">
                        {incidents.filter((i) => i.isPanic).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
