import { Request, Response } from "express";
import { db } from "./database";

type medicationRow = {
  id: number,
  patient_name: string,
  medication_name: string,
  dosage: string,
  route: string,
  scheduled_at: string,
  notes: string
}

function toMedicationsRow (row: medicationRow) {
  return {
    id: row.id,
    patientName: row.patient_name,
    medicationName: row.medication_name,
    dosage: row.dosage,
    route: row.route,
    scheduledAt: row.scheduled_at,
    notes: row.notes
  }
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function validateMedicationInput(body: any) {
  if (isBlank(body.patientName)) {
    return "O campo Nome do paciente é obrigatório";
  }

  if (isBlank(body.medicationName)) {
    return "O campo Nome do medicamento é obrigatório";
  }

  if (isBlank(body.dosage)) {
    return "O campo Dosagem é obrigatória";
  }

  if (isBlank(body.route)) {
    return "O campo Via de administração é obrigatória";
  }

  if (isBlank(body.scheduledAt) || !ISO_DATE_TIME.test(body.scheduledAt)) {
    return "O campo Data e horário são obrigatórios e deve estar no formato AAAA-MM-DD.";
  }

  return null;
}


export const medicationsService = { 
    list(){
        const rows = db
            .prepare("SELECT id, patient_name, medication_name, dosage, route, scheduled_at, notes FROM medication_orders")
            .all()as medicationRow[];

        const medications = rows.map(toMedicationsRow);
        return medications;
    },
    
    create(data: {patientName: string, medicationName: string, dosage: string, route: string, scheduledAt: string, notes: string | null}) {
        const error = validateMedicationInput(data);

        if (error) {
            throw new Error(error);
        }

        const result = db
            .prepare(`INSERT INTO medication_orders (
            patient_name,
            medication_name,
            dosage,
            route,
            scheduled_at,
            notes
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `)
            .run(
            data.patientName,
            data.medicationName,
            data.dosage,
            data.route,
            data.scheduledAt,
            data.notes ?? null
            );

        const medication = db
            .prepare(`
            SELECT
                id,
                patient_name,
                medication_name,
                dosage,
                route,
                scheduled_at,
                notes
            FROM medication_orders
            WHERE id = ?
            `)
            .get(result.lastInsertRowid) as medicationRow;

        return toMedicationsRow(medication);
    }
}