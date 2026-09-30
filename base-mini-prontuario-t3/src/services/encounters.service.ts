/**
 * Service de Encounter.
 *
 * TODO ARQ-2 — mesmo movimento do ARQ-1: extrair
 * `repositories/encounters.repository.ts` (interface + adapter
 * SQLite) e remover o `import { db }` daqui.
 *
 * TODO AUTH-8 — (parte NÃO guiada) quando `professional_id`
 * existir em encounters, `createEncounter` passa a registrar
 * QUEM registrou — e nasce aqui a regra de domínio da matriz
 * de permissões que middleware nenhum resolve sozinho.
 */
import { NotFoundError } from "../errors/HttpError";
import { getPatientById } from "./patients.service";
import type { CreateEncounterInput } from "../validation/encounters.schemas";
import type { EncountersRepository } from "../repositories/encounters.repository";

let encountersRepository: EncountersRepository | undefined;

export function configureEncountersRepository (repository: EncountersRepository) {
  encountersRepository = repository;
}

function getEncountersRepository(): EncountersRepository {
  if (!encountersRepository) {
    throw new Error("Repository de atendimentos não foi configurado.");
  }
  return encountersRepository;
}

export function listEncountersByPatient(patientId: number) {
  getPatientById(patientId); // 404 se o paciente não existe

  // Ordenamos no SQL: o banco tem índice e o dado chega pronto.
  const patientEncounters = getEncountersRepository().findByPatient(patientId);
  return patientEncounters;
}

export function getEncounterById(id: number) {
  const encounter = getEncountersRepository().findById(id);
  if (!encounter) {
    throw new NotFoundError("Atendimento não encontrado.");
  }
  return encounter;
}

export function createEncounter(patientId: number, input: CreateEncounterInput) {
  getPatientById(patientId);

  const encounterId = getEncountersRepository().create(patientId, input);

  return getEncounterById(encounterId);
}
