/**
 * ============================================================
 * TODO 6 -- Service de Encounter
 * ============================================================
 * Migre para ca: a verificacao patientExists, a query de list
 * (ordenada por started_at DESC), a validacao + insert de
 * create, e a funcao toEncounterJson.
 *
 *   export const encountersService = {
 *     list(patientId: string) { ... },
 *     create(patientId: string, data: { startedAt: string; chiefComplaint: string; notes?: string }) { ... },
 *   };
 * ============================================================
 */

import { db } from "../database";
import { BadRequestError, NotFoundError } from "../errors/HttpError";

function toEncounterJson (row: any) {
  return {
    id: row.id,
    patientId: row.patient_id,
    startedAt: row.started_at,
    chiefComplaint: row.chief_complaint,
    notes: row.notes
  }
}

function validatePatientExist (id: number): string | null {
  const row = db.prepare("SELECT * FROM patients WHERE id = ?").get(id);
  
  if (row === undefined) {
    return "Paciente não encontrado!";
  }

  return null;
}

function isBlank(value: unknown) {
  return typeof value !== 'string' || value.trim() === '';
}

const ISO_DATE_HOUR = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function validateEncounterInput(body: any): string | null {
    if (isBlank(body?.startedAt) || !ISO_DATE_HOUR.test(body.startedAt)) {
      return 'O campo de horário de início da consulta deve ter o formato AAAA-MM-DDTHH:MM.'
    }
    else if (isBlank(body?.chiefComplaint)) {
        return 'O preenchimento do campo de queixas e sintomas é obrigatório.'
    }

  return null;
}

export const encountersService = {
  list(patientId: string) {
    const result = validatePatientExist(Number(patientId));
    if (result != null) {
      throw new NotFoundError(`Falha ao buscar os atendimentos: ${result}`);
    }
      
    const rows = db
    .prepare("SELECT * FROM encounters WHERE patient_id = ? ORDER BY started_at DESC")
    .all(patientId);
    
    const encounters = rows.map(row => toEncounterJson(row));
    
    return encounters;
  },
  
  create(patientId: string, data: { startedAt: string, chiefComplaint: string, notes: string }){
      const validationError = validateEncounterInput(data);
      if (validationError != null) {
          throw new BadRequestError(validationError)
      }
      
      const pacientError = validatePatientExist(Number(patientId));
      if (pacientError != null) {
          throw new NotFoundError(pacientError);
      }
      
      const result = db
      .prepare("INSERT INTO encounters (patient_id, started_at, chief_complaint, notes) VALUES (?, ?, ?, ?)")
      .run(
      patientId,
      data.startedAt,
      data.chiefComplaint.trim(),
      isBlank(data.notes) ? null : data.notes.trim()
      )
      
      const encounter = db
      .prepare("SELECT * FROM encounters WHERE id = ?")
      .get(result.lastInsertRowid);
      
      return toEncounterJson(encounter);
  }
}
