/**
 * Service de MedicationRequest (a prescrição de um atendimento).
 *
 * TODO ARQ-3 — extrair `repositories/medications.repository.ts`
 * (interface + adapter SQLite), como nos ARQ-1 e ARQ-2.
 */
import { getEncounterById } from "./encounters.service";
import type { CreateMedicationInput } from "../validation/medications.schemas";
import type { MedicationsRepository } from "../repositories/medications.repository";

let medicationsRepository: MedicationsRepository | undefined;

export function configureMedicationsRepository(repository: MedicationsRepository) {
  medicationsRepository = repository;
}

function getMedicationsRepository(): MedicationsRepository {
  if (!medicationsRepository) {
    throw new Error("Repository de medicamentos não foi configurado.");
  }
  return medicationsRepository;
}

export function listMedicationsByEncounter(encounterId: number) {
  getEncounterById(encounterId); // 404 se o atendimento não existe

  return getMedicationsRepository().findByEncounter(encounterId);
}

export function createMedication(encounterId: number, input: CreateMedicationInput) {
  getEncounterById(encounterId);

  return getMedicationsRepository().create(encounterId, input); 
}
