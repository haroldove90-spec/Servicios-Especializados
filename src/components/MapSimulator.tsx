import React, { useState } from "react";
import { Client, Personnel, IncidentReport, AttendanceLog } from "../types";
import { MapPin, Shield, Trash2, HelpCircle, AlertTriangle, CheckCircle, Crosshair } from "lucide-react";

interface MapSimulatorProps {
  clients: Client[];
  personnel: Personnel[];
  incidents: IncidentReport[];
  attendance: AttendanceLog[];
  selectedClientId?: string;
  onSelectClient?: (clientId: string) => void;
  showHeatmap?: boolean;
}

export default function MapSimulator({
  clients,
  personnel,
  incidents,
  attendance,
  selectedClientId,
  onSelectClient,
  showHeatmap = false,
}: MapSimulatorProps) {
  const [hoveredItem, setHoveredItem] = useState<{ name: string; info: string } | null>(null);

  // CDMX bounding box simulation: Reforma / Centro area.
  // We'll map the client coordinates to SVG viewport dimensions (w: 500, h: 400).
  // Lat: 19.35 to 19.50
  // Lng: -99.28 to -99.15
  const mapWidth = 500;
  const mapHeight = 400;

  const getXY = (lat: number, lng: number) => {
    // Mercator-like quick linear scaling for the CDMX viewport
    const minLat = 19.34;
    const maxLat = 19.51;
    const minLng = -99.28;
    const maxLng = -99.14;

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    // Y is inverted in SVG
    const y = mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight;

    return { x, y };
  };

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm select-none">
      {/* Map Header */}
      <div className="absolute top-3 left-3 z-10 bg-slate-950/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>GPS SIMULATION ACTIVE (CDMX)</span>
      </div>

      {/* SVG Canvas Map */}
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-auto bg-slate-950"
        style={{ maxHeight: "350px" }}
      >
        {/* Abstract grids & simulated city layout */}
        <g opacity="0.15">
          <line x1="0" y1="100" x2="500" y2="100" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="200" x2="500" y2="200" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="300" x2="500" y2="300" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="100" y1="0" x2="100" y2="400" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="400" y1="0" x2="400" y2="400" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
        </g>

        {/* Major Simulated Avenues (Polanco, Reforma, Santa Fe, Vallejo) */}
        <g opacity="0.25" stroke="#334155" strokeWidth="3" fill="none">
          {/* Paseo de la Reforma simulation */}
          <path d="M 50,300 Q 250,220 450,150" />
          {/* Periférico simulation */}
          <path d="M 120,50 L 250,380" />
          {/* Calzada Vallejo */}
          <path d="M 320,50 L 400,250" />
        </g>

        {/* Heatmap overlay (if enabled) */}
        {showHeatmap &&
          incidents.map((inc) => {
            if (!inc.lat || !inc.lng) return null;
            const { x, y } = getXY(inc.lat, inc.lng);
            return (
              <g key={`heat-${inc.id}`} opacity="0.3">
                <circle cx={x} cy={y} r="45" fill={inc.type === "Prioritaria" ? "#ef4444" : "#f59e0b"} />
                <circle cx={x} cy={y} r="25" fill={inc.type === "Prioritaria" ? "#ef4444" : "#f59e0b"} />
              </g>
            );
          })}

        {/* Geofences & Clients circles */}
        {clients.map((client) => {
          const { x, y } = getXY(client.lat, client.lng);
          const isSelected = client.id === selectedClientId;
          // Scale radius slightly for visual presentation
          const visualRadius = Math.max(18, Math.min(35, client.radius * 0.12));

          return (
            <g key={client.id} className="cursor-pointer" onClick={() => onSelectClient?.(client.id)}>
              {/* Geofence Ring */}
              <circle
                cx={x}
                cy={y}
                r={visualRadius}
                fill={isSelected ? "rgba(16, 185, 129, 0.08)" : "rgba(59, 130, 246, 0.04)"}
                stroke={isSelected ? "#10b981" : "#3b82f6"}
                strokeWidth={isSelected ? "1.5" : "1"}
                strokeDasharray={isSelected ? "none" : "3 2"}
                className="transition-all duration-300"
              />
              {/* Client Center Dot */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={isSelected ? "#10b981" : "#3b82f6"}
                onMouseEnter={() => setHoveredItem({ name: client.name, info: `Geocerca: ${client.radius}m | Servicios: ${client.services.join(", ")}` })}
                onMouseLeave={() => setHoveredItem(null)}
              />
              <text
                x={x}
                y={y - visualRadius - 4}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontFamily="sans-serif"
                className="font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              >
                {client.name.split(" ")[0]}..
              </text>
            </g>
          );
        })}

        {/* Real-time Personnel / Patrol Positions */}
        {personnel.map((person) => {
          const client = clients.find((c) => c.id === person.assignedClientId);
          if (!client) return null;

          // Add a slight deterministic offset based on personnel ID so they don't overlap on the center pin
          const offsetHash = person.id.charCodeAt(person.id.length - 1) || 0;
          const offsetX = ((offsetHash % 5) - 2) * 8;
          const offsetY = (((offsetHash >> 2) % 5) - 2) * 8;

          const clientCoords = getXY(client.lat, client.lng);
          const x = clientCoords.x + offsetX;
          const y = clientCoords.y + offsetY;

          // Check if checked-in (is Active in logs)
          const isCheckedIn = attendance.some((a) => a.personnelId === person.id && !a.checkOutTime);

          if (!isCheckedIn) return null;

          return (
            <g
              key={`staff-${person.id}`}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() =>
                setHoveredItem({
                  name: person.name,
                  info: `Rol: ${person.role} | Asignado: ${client.name} | Cel: ${person.phone}`,
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Pulse animation */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="none"
                stroke={person.role === "Guardia" ? "#f43f5e" : "#06b6d4"}
                strokeWidth="1"
                className="animate-ping"
                style={{ transformOrigin: `${x}px ${y}px`, animationDuration: "2s" }}
                opacity="0.6"
              />
              {/* Outer circle */}
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill={person.role === "Guardia" ? "#f43f5e" : "#06b6d4"}
                stroke="#fff"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Active Incidents & Panic alerts */}
        {incidents.map((inc) => {
          if (!inc.lat || !inc.lng || inc.status === "Atendida") return null;
          const { x, y } = getXY(inc.lat, inc.lng);

          return (
            <g
              key={`inc-${inc.id}`}
              className="cursor-pointer"
              onMouseEnter={() =>
                setHoveredItem({
                  name: inc.isPanic ? "🚨 ALERTA DE PÁNICO 🚨" : `Incidencia: ${inc.clientName}`,
                  info: inc.description,
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Panic Radar pulse */}
              <circle
                cx={x}
                cy={y}
                r="18"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                className="animate-ping"
                style={{ transformOrigin: `${x}px ${y}px`, animationDuration: "1s" }}
              />
              {/* Red glow */}
              <circle cx={x} cy={y} r="7" fill="#ef4444" className="animate-pulse" />
              {/* Marker Icon */}
              <path
                d={`M ${x} ${y - 12} L ${x - 4} ${y - 4} L ${x + 4} ${y - 4} Z`}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="0.75"
              />
            </g>
          );
        })}
      </svg>

      {/* Legend & Hover Details */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-xs flex flex-col gap-1.5">
        {hoveredItem ? (
          <div className="min-h-[40px] flex flex-col justify-center animate-fade-in">
            <span className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1">
              {hoveredItem.name.includes("PÁNICO") && (
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
              {hoveredItem.name}
            </span>
            <span className="text-slate-400 text-[10px] truncate">{hoveredItem.info}</span>
          </div>
        ) : (
          <div className="min-h-[40px] flex items-center justify-between text-slate-500 text-[10px] font-mono">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Clientes (Geocercas)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Guardias Activos
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Limpieza Activos
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> Alertas / Incidencias
              </span>
            </div>
            <div className="text-[9px] text-right">
              Pase el cursor sobre los elementos para ver detalles
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
