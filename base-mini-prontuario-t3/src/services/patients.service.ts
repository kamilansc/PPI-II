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

export function listPatients() {
  return getPatientsRepository().findAll();
}

export function getPatientById(id: number) {
  const patient = getPatientsRepository().findById(id);

  if (!patient) {
    // "Não encontrei" não é problema do servidor: é 404, não 500.
    throw new NotFoundError("Paciente não encontrado.");
  }
  return patient;
}

export function createPatient(input: CreatePatientInput) {
  const repository = getPatientsRepository();
  // Invariante N1: CNS único. Deixar o INSERT estourar viraria um
  // 500 mentiroso — o servidor está ótimo; o dado é que repetiu.
  const duplicate = repository.findByNationalId(input.nationalId);

  if (duplicate) {
    throw new ConflictError("Já existe um paciente com este CNS.");
  }

  return getPatientById(repository.create(input));
}

export function setPatientPhoto(id: number, photoUrl: string) {
  getPatientById(id); // garante o 404 antes de gravar
  getPatientsRepository().updatePhoto(id, photoUrl);
  return getPatientById(id);
}
