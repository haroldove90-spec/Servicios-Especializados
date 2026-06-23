export interface Client {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  services: ("Seguridad" | "Limpieza")[];
  contractStart: string;
  contractEnd: string;
}

export interface Personnel {
  id: string;
  name: string;
  role: "Guardia" | "Limpieza";
  status: "Activo" | "Inactivo";
  assignedClientId: string;
  phone: string;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  type: "Seguridad" | "Limpieza";
  assignedToId: string;
  frequency: "Diario" | "Semanal" | "Mensual";
  status: "Pendiente" | "En Progreso" | "Completada";
  completedAt?: string;
  photoEvidence?: string;
  textEvidence?: string;
}

export interface AttendanceLog {
  id: string;
  personnelId: string;
  personnelName: string;
  clientId: string;
  clientName: string;
  checkInTime: string;
  checkOutTime: string | null;
  checkInLat: number;
  checkInLng: number;
  checkInValid: boolean;
  checkOutLat?: number;
  checkOutLng?: number;
  checkOutValid?: boolean;
}

export interface IncidentReport {
  id: string;
  personnelId: string;
  personnelName: string;
  clientId: string;
  clientName: string;
  type: "Prioritaria" | "Informativa";
  description: string;
  photoUrl?: string;
  timestamp: string;
  status: "Abierta" | "Atendida";
  resolvedBy?: string;
  resolutionNotes?: string;
  isPanic: boolean;
  lat?: number;
  lng?: number;
}
