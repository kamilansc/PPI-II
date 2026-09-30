import { db } from "../database";
import type { CreatePatientInput } from "../validation/patients.schemas";

export interface PatientJson {
  id: number;
  name: string;
  birthDate: string;
  nationalId: string;
  photoUrl: string | null;
  active: boolean;
}

export interface PatientsRepository {
  findAll(): PatientJson[];
  findById(id: number): PatientJson | undefined;
  findByNationalId(nationalId: string): PatientJson | undefined;
  create(input: CreatePatientInput): number;
  updatePhoto(id: number, url: string): void;
}

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  photo_url: string | null;
  active: number;
};

const SELECT =
  "SELECT id, name, birth_date, national_id, photo_url, active FROM patients";

function toPatient(row: PatientRow): PatientJson {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    photoUrl: row.photo_url,
    active: row.active === 1,
  };
}

export class SqlitePatientsRepository implements PatientsRepository {
  findAll(): PatientJson[] {
    const rows = db.prepare(`${SELECT} ORDER BY name`).all() as PatientRow[];
    return rows.map(toPatient);
  }

  findById(id: number): PatientJson | undefined {
    const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as
      | PatientRow
      | undefined;
    return row ? toPatient(row) : undefined;
  }

  findByNationalId(nationalId: string): PatientJson | undefined {
    const row = db
      .prepare(`${SELECT} WHERE national_id = ?`)
      .get(nationalId) as PatientRow | undefined;
    return row ? toPatient(row) : undefined;
  }

  create(input: CreatePatientInput): number {
    const result = db
      .prepare(
        `INSERT INTO patients (name, birth_date, national_id, active)
         VALUES (?, ?, ?, 1)`,
      )
      .run(input.name, input.birthDate, input.nationalId);

    return Number(result.lastInsertRowid);
  }

  updatePhoto(id: number, url: string): void {
    db.prepare("UPDATE patients SET photo_url = ? WHERE id = ?").run(url, id);
  }
}