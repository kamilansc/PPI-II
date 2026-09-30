import { db } from "../database";
import type { CreateMedicationInput } from "../validation/medications.schemas";

export type MedicationJson = {
	id: number;
	encounterId: number;
	medication: string;
	dosage: string;
};

export interface MedicationsRepository {
	findByEncounter(encounterId: number): MedicationJson[];
	create(encounterId: number, input: CreateMedicationInput): MedicationJson;
}

type MedicationRow = {
	id: number;
	encounter_id: number;
	medication: string;
	dosage: string;
};

const SELECT = "SELECT id, encounter_id, medication, dosage FROM medication_requests";

function toMedicationJson(row: MedicationRow): MedicationJson {
	return {
		id: row.id,
		encounterId: row.encounter_id,
		medication: row.medication,
		dosage: row.dosage,
	};
}

export class SqliteMedicationsRepository implements MedicationsRepository {
	findByEncounter(encounterId: number): MedicationJson[] {
		const rows = db
			.prepare(`${SELECT} WHERE encounter_id = ? ORDER BY id`)
			.all(encounterId) as MedicationRow[];

		return rows.map(toMedicationJson);
	}

	create(encounterId: number, input: CreateMedicationInput): MedicationJson {
		const result = db
			.prepare(
				`INSERT INTO medication_requests (encounter_id, medication, dosage)
				 VALUES (?, ?, ?)`,
			)
			.run(encounterId, input.medication, input.dosage);

		const row = db.prepare(`${SELECT} WHERE id = ?`).get(result.lastInsertRowid) as MedicationRow;
		return toMedicationJson(row);
	}
}
