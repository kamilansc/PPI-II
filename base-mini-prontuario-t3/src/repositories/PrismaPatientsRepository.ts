import { PatientsRepository } from "./patients.repository";
import { PatientJson } from "./patients.repository";
import { prisma } from "../../prisma/client";
import type { CreatePatientInput } from "../validation/patients.schemas";


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

type PatientRow = {
  id: number;
  name: string;
  birthDate: string;
  nationalId: string;
  photoUrl: string | null;
  active: number;
};

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

  async updatePhoto(id: number, url: string): Promise<PatientJson> {
    const patient = await prisma.patient
    .update({
      where: {id}, 
      data: {
        photoUrl: url
      }
    })

    return toPatient(patient);
  }
}
