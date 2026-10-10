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
  findAll(): Promise<PatientJson[]>;
  findById(id: number): Promise<PatientJson | undefined>;
  findByNationalId(nationalId: string): Promise<PatientJson | undefined>;
  create(input: CreatePatientInput): Promise<PatientJson>;
  updatePhoto(id: number, url: string): Promise<PatientJson>;
}