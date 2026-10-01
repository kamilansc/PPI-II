// import { db } from "../database";
// import { getPatientById } from "../services/patients.service";
import { prisma } from "../infra/prisma/client";
import type { CreateEncounterInput } from "../validation/encounters.schemas";

type EncounterJson = {
    id: number,
    patientId: number,
    startedAt: string,
    chiefComplaint: string,
    notes: string | null,
}

export interface EncountersRepository {
    findByPatient(patientId: number): Promise<EncounterJson[]>;
    findById(id: number): Promise<EncounterJson | undefined>;
    create(patientId: number, input: CreateEncounterInput): Promise<EncounterJson>;
}

export class PrismaEncountersRepository implements EncountersRepository {
  async findByPatient(patientId: number): Promise<EncounterJson[]> {
    return await prisma.encounter.findMany({
      where: {patientId},
      orderBy: {startedAt: "desc"}
    }) as EncounterJson[];
  }

  async findById(id: number): Promise<EncounterJson | undefined> {
    return await prisma.encounter.findUnique({where: {id}}) as EncounterJson | undefined;
  }

  async create(patientId: number, input: CreateEncounterInput): Promise<EncounterJson> {
    return await prisma.encounter.create({data: {...input, patientId}}) as EncounterJson;
  }
}

// type EncounterRow = {
//   id: number;
//   patient_id: number;
//   started_at: string;
//   chief_complaint: string;
//   notes: string | null;
// };

// function toEncounterJson(row: EncounterRow): EncounterJson {
//   return {
//     id: row.id,
//     patientId: row.patient_id,
//     startedAt: row.started_at,
//     chiefComplaint: row.chief_complaint,
//     notes: row.notes,
//   };
// }

// const SELECT = "SELECT id, patient_id, started_at, chief_complaint, notes FROM encounters";

// export class SqliteEncountersRepository implements EncountersRepository{
//   findByPatient(patientId: number) {
//     getPatientById(patientId); // 404 se o paciente não existe
  
//     // Ordenamos no SQL: o banco tem índice e o dado chega pronto.
//     const rows = db
//       .prepare(`${SELECT} WHERE patient_id = ? ORDER BY started_at DESC`)
//       .all(patientId) as EncounterRow[];
  
//     return rows.map(toEncounterJson);
//   }

//   findById(id: number) {
//     const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as EncounterRow | undefined;
  
//     return row ? toEncounterJson(row) : undefined;
//   }
  
//   create(patientId: number, input: CreateEncounterInput) {
//     getPatientById(patientId);
  
//     const result = db
//       .prepare(
//         `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
//          VALUES (?, ?, ?, ?)`,
//       )
//       .run(patientId, input.startedAt, input.chiefComplaint, input.notes ?? null);
  
//     return Number(result.lastInsertRowid);
//   }
// }