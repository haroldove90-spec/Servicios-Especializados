import { Client, Personnel, Task, AttendanceLog, IncidentReport } from "./types";

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "Corporativo Reforma 222",
    address: "Av. Paseo de la Reforma 222, Juárez, Cuauhtémoc, CDMX",
    lat: 19.4290,
    lng: -99.1625,
    radius: 150, // 150 meters
    services: ["Seguridad", "Limpieza"],
    contractStart: "2026-01-01",
    contractEnd: "2026-12-31"
  },
  {
    id: "cli-2",
    name: "Planta Industrial Vallejo",
    address: "Calz. Vallejo 820, Industrial Vallejo, Azcapotzalco, CDMX",
    lat: 19.4891,
    lng: -99.1643,
    radius: 300, // 300 meters
    services: ["Seguridad", "Limpieza"],
    contractStart: "2025-06-15",
    contractEnd: "2027-06-15"
  },
  {
    id: "cli-3",
    name: "Centro Comercial Santa Fe",
    address: "Vasco de Quiroga 3800, Lomas de Santa Fe, CDMX",
    lat: 19.3610,
    lng: -99.2611,
    radius: 200,
    services: ["Limpieza"],
    contractStart: "2026-02-10",
    contractEnd: "2027-02-10"
  },
  {
    id: "cli-4",
    name: "Condominios Polanco",
    address: "Campos Elíseos 120, Polanco V Sección, Miguel Hidalgo, CDMX",
    lat: 19.4326,
    lng: -99.2000,
    radius: 100,
    services: ["Seguridad"],
    contractStart: "2026-03-01",
    contractEnd: "2027-03-01"
  }
];

export const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: "per-1",
    name: "Carlos Ruiz Solís",
    role: "Guardia",
    status: "Activo",
    assignedClientId: "cli-1",
    phone: "55-1234-5678"
  },
  {
    id: "per-2",
    name: "Ana María Mendoza",
    role: "Limpieza",
    status: "Activo",
    assignedClientId: "cli-1",
    phone: "55-9876-5432"
  },
  {
    id: "per-3",
    name: "Héctor Gómez Pérez",
    role: "Guardia",
    status: "Activo",
    assignedClientId: "cli-2",
    phone: "55-4567-8901"
  },
  {
    id: "per-4",
    name: "Laura Ortega Castro",
    role: "Limpieza",
    status: "Activo",
    assignedClientId: "cli-3",
    phone: "55-3210-9876"
  },
  {
    id: "per-5",
    name: "Miguel Ángel Martínez",
    role: "Guardia",
    status: "Activo",
    assignedClientId: "cli-4",
    phone: "55-7890-1234"
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "tsk-1",
    clientId: "cli-1",
    title: "Rondín perimetral accesos A y B",
    type: "Seguridad",
    assignedToId: "per-1",
    frequency: "Diario",
    status: "Pendiente"
  },
  {
    id: "tsk-2",
    clientId: "cli-1",
    title: "Revisión de bitácora de visitantes en recepción",
    type: "Seguridad",
    assignedToId: "per-1",
    frequency: "Diario",
    status: "Completada",
    completedAt: "2026-06-23T09:15:00-07:00",
    photoEvidence: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
    textEvidence: "Todo en orden. Se registraron 12 visitantes matutinos."
  },
  {
    id: "tsk-3",
    clientId: "cli-1",
    title: "Limpieza profunda de cristales Lobby principal",
    type: "Limpieza",
    assignedToId: "per-2",
    frequency: "Diario",
    status: "Pendiente"
  },
  {
    id: "tsk-4",
    clientId: "cli-1",
    title: "Sanitización de cabinas de elevadores",
    type: "Limpieza",
    assignedToId: "per-2",
    frequency: "Diario",
    status: "Completada",
    completedAt: "2026-06-23T11:30:00-07:00",
    photoEvidence: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400",
    textEvidence: "Pisos y barandales desinfectados con sales cuaternarias."
  },
  {
    id: "tsk-5",
    clientId: "cli-2",
    title: "Inspección de esclusas de carga y descarga",
    type: "Seguridad",
    assignedToId: "per-3",
    frequency: "Diario",
    status: "Pendiente"
  },
  {
    id: "tsk-6",
    clientId: "cli-3",
    title: "Limpieza de pasillo de comida rápida zona centro",
    type: "Limpieza",
    assignedToId: "per-4",
    frequency: "Diario",
    status: "Pendiente"
  }
];

export const INITIAL_ATTENDANCE: AttendanceLog[] = [
  {
    id: "att-1",
    personnelId: "per-1",
    personnelName: "Carlos Ruiz Solís",
    clientId: "cli-1",
    clientName: "Corporativo Reforma 222",
    checkInTime: "2026-06-23T07:55:23-07:00",
    checkOutTime: null,
    checkInLat: 19.4291,
    checkInLng: -99.1624,
    checkInValid: true
  },
  {
    id: "att-2",
    personnelId: "per-2",
    personnelName: "Ana María Mendoza",
    clientId: "cli-1",
    clientName: "Corporativo Reforma 222",
    checkInTime: "2026-06-23T08:02:11-07:00",
    checkOutTime: null,
    checkInLat: 19.4289,
    checkInLng: -99.1626,
    checkInValid: true
  },
  {
    id: "att-3",
    personnelId: "per-5",
    personnelName: "Miguel Ángel Martínez",
    clientId: "cli-4",
    clientName: "Condominios Polanco",
    checkInTime: "2026-06-22T08:00:00-07:00",
    checkOutTime: "2026-06-22T17:03:15-07:00",
    checkInLat: 19.4325,
    checkInLng: -99.2001,
    checkInValid: true,
    checkOutLat: 19.4327,
    checkOutLng: -99.1999,
    checkOutValid: true
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: "inc-1",
    personnelId: "per-1",
    personnelName: "Carlos Ruiz Solís",
    clientId: "cli-1",
    clientName: "Corporativo Reforma 222",
    type: "Informativa",
    description: "Falla menor detectada en puerta giratoria del acceso A. Se notifica a mantenimiento de torre.",
    photoUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400",
    timestamp: "2026-06-23T10:20:00-07:00",
    status: "Atendida",
    resolvedBy: "Supervisor Ramírez",
    resolutionNotes: "Se agendó revisión técnica externa para mañana temprano.",
    isPanic: false,
    lat: 19.4290,
    lng: -99.1625
  },
  {
    id: "inc-2",
    personnelId: "per-3",
    personnelName: "Héctor Gómez Pérez",
    clientId: "cli-2",
    clientName: "Planta Industrial Vallejo",
    type: "Prioritaria",
    description: "Fuga de agua importante detectada en el patio trasero cerca del área de transformadores.",
    photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400",
    timestamp: "2026-06-23T12:45:00-07:00",
    status: "Abierta",
    isPanic: false,
    lat: 19.4893,
    lng: -99.1645
  }
];

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(`gestserv_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing storage key:", key, e);
    }
  }
  return defaultValue;
};

export const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(`gestserv_${key}`, JSON.stringify(value));
};

export const clearAllStorage = (): void => {
  localStorage.removeItem("gestserv_clients");
  localStorage.removeItem("gestserv_personnel");
  localStorage.removeItem("gestserv_tasks");
  localStorage.removeItem("gestserv_attendance");
  localStorage.removeItem("gestserv_incidents");
  window.location.reload();
};
