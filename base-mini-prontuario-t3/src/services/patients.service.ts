/**
 * ============================================================
 * Service de Patient — a camada que DECIDE.
 * ------------------------------------------------------------
 * Aqui moram as regras de negócio e os erros do domínio. O acesso
 * a dados e a tradução snake_case -> camelCase pertencem ao repository.
 * ============================================================
 */
import { ConflictError, NotFoundError } from "../errors/HttpError";
import type { CreatePatientInput } from "../validation/patients.schemas";
import type { PatientsRepository } from "../repositories/patients.repository";

let patientsRepository: PatientsRepository | undefined;

export function configurePatientsRepository(repository: PatientsRepository) {
  patientsRepository = repository;
}

function getPatientsRepository(): PatientsRepository {
  if (!patientsRepository) {
    throw new Error("Repository de pacientes não foi configurado.");
  }
  return patientsRepository;
}

export async function listPatients() {
  return await getPatientsRepository().findAll();
}

export async function getPatientById(id: number) {
  const patient = await getPatientsRepository().findById(id);

  if (!patient) {
    // "Não encontrei" não é problema do servidor: é 404, não 500.
    throw new NotFoundError("Paciente não encontrado.");
  }
  return patient;
}

export async function createPatient(input: CreatePatientInput) {
  const repository = getPatientsRepository();
  // Invariante N1: CNS único. Deixar o INSERT estourar viraria um
  // 500 mentiroso — o servidor está ótimo; o dado é que repetiu.
  const duplicate = await repository.findByNationalId(input.nationalId);

  if (duplicate) {
    throw new ConflictError("Já existe um paciente com este CNS.");
  }

  return await repository.create(input);
}

export async function setPatientPhoto(id: number, photoUrl: string) {
  await getPatientById(id); // garante o 404 antes de gravar
  return await getPatientsRepository().updatePhoto(id, photoUrl);
}
