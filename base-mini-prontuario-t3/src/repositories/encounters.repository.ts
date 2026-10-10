import type { CreateEncounterInput } from "../validation/encounters.schemas";

export interface EncounterJson {
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