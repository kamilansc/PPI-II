// import { db } from "../database";
import type { CreatePatientInput } from "../validation/patients.schemas";
import { prisma } from "../infra/prisma/client";

export interface PatientJson {
  id: number;
  name: string;
  birthDate: string;
  nationalId: string;
  photoUrl: string | null;
  active: boolean;
}

export interface PatientsRepository {
  findAll(): Promise<PatientJson[]>;
  findById(id: number): Promise<PatientJson | undefined>;
  findByNationalId(nationalId: string): Promise<PatientJson | undefined>;
  create(input: CreatePatientInput): Promise<PatientJson>;
  updatePhoto(id: number, url: string): Promise<void>;
}

type PatientRow = {
  id: number;
  name: string;
  birthDate: string;
  nationalId: string;
  photoUrl: string | null;
  active: number;
};

function toPatient(row: PatientRow): PatientJson {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birthDate,
    nationalId: row.nationalId,
    photoUrl: row.photoUrl,
    active: row.active === 1,
  };
}

export class PrismaPatientsRepository implements PatientsRepository {
  async findAll(): Promise<PatientJson[]> {
    const patients = await prisma.patient.findMany();
    return patients.map(toPatient)
  }

  async findById(id: number): Promise<PatientJson | undefined> {
    const patient = await prisma.patient.findUnique({where: {id}}) as PatientRow | undefined;
    return patient ? toPatient(patient) : undefined;
  }

  async findByNationalId(nationalId: string): Promise<PatientJson | undefined> {
    const patient = await prisma.patient.findUnique({where: {nationalId}}) as PatientRow | undefined;
    return patient ? toPatient(patient) : undefined;
  }

  async create(input: CreatePatientInput): Promise<PatientJson> {
    const patient = await prisma.patient.create({data: input });
    return toPatient(patient);
  }

  async updatePhoto(id: number, url: string): Promise<void> {
    await prisma.patient.update({
      where: {id}, 
      data: {
        photoUrl: url
      }
    })
  }
}

// const SELECT =
//   "SELECT id, name, birth_date, national_id, photo_url, active FROM patients";

// export class SqlitePatientsRepository implements PatientsRepository {
//   findAll(): PatientJson[] {
//     const rows = db.prepare(`${SELECT} ORDER BY name`).all() as PatientRow[];
//     return rows.map(toPatient);
//   }

//   findById(id: number): PatientJson | undefined {
//     const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as
//       | PatientRow
//       | undefined;
//     return row ? toPatient(row) : undefined;
//   }

//   findByNationalId(nationalId: string): PatientJson | undefined {
//     const row = db
//       .prepare(`${SELECT} WHERE national_id = ?`)
//       .get(nationalId) as PatientRow | undefined;
//     return row ? toPatient(row) : undefined;
//   }

//   create(input: CreatePatientInput): number {
//     const result = db
//       .prepare(
//         `INSERT INTO patients (name, birth_date, national_id, active)
//          VALUES (?, ?, ?, 1)`,
//       )
//       .run(input.name, input.birthDate, input.nationalId);

//     return Number(result.lastInsertRowid);
//   }

//   updatePhoto(id: number, url: string): void {
//     db.prepare("UPDATE patients SET photo_url = ? WHERE id = ?").run(url, id);
//   }
// }