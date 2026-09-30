/**
 * Service de Encounter.
 *
 * TODO ARQ-2 — mesmo movimento do ARQ-1: extrair
 * `repositories/encounters.repository.ts` (interface + adapter
 * SQLite) e remover o `import { db }` daqui.
 *
 */
import { db } from "../database";
import { getPatientById } from "../services/patients.service";
import type { CreateEncounterInput } from "../validation/encounters.schemas";

type EncounterRow = {
  id: number;
  patient_id: number;
  started_at: string;
  chief_complaint: string;
  notes: string | null;
};

function toEncounterJson(row: EncounterRow): EncounterJson {
  return {
    id: row.id,
    patientId: row.patient_id,
    startedAt: row.started_at,
    chiefComplaint: row.chief_complaint,
    notes: row.notes,
  };
}

type EncounterJson = {
    id: number,
    patientId: number,
    startedAt: string,
    chiefComplaint: string,
    notes: string | null,
}

export interface EncountersRepository {
    findByPatient(patientId: number): EncounterJson[];
    findById(id: number): EncounterJson | undefined;
    create(patientId: number, input: CreateEncounterInput): number;
}

const SELECT = "SELECT id, patient_id, started_at, chief_complaint, notes FROM encounters";

export class SqliteEncountersRepository implements EncountersRepository{
  findByPatient(patientId: number) {
    getPatientById(patientId); // 404 se o paciente não existe
  
    // Ordenamos no SQL: o banco tem índice e o dado chega pronto.
    const rows = db
      .prepare(`${SELECT} WHERE patient_id = ? ORDER BY started_at DESC`)
      .all(patientId) as EncounterRow[];
  
    return rows.map(toEncounterJson);
  }

  findById(id: number) {
    const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as EncounterRow | undefined;
  
    return row ? toEncounterJson(row) : undefined;
  }
  
  create(patientId: number, input: CreateEncounterInput) {
    getPatientById(patientId);
  
    const result = db
      .prepare(
        `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
         VALUES (?, ?, ?, ?)`,
      )
      .run(patientId, input.startedAt, input.chiefComplaint, input.notes ?? null);
  
    return Number(result.lastInsertRowid);
  }
}


