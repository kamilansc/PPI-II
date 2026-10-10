import type { CreateMedicationInput } from "../validation/medications.schemas";

export interface MedicationJson {
	id: number;
	encounterId: number;
	medication: string;
	dosage: string;
};

export interface MedicationsRepository {
	findByEncounter(encounterId: number): Promise<MedicationJson[]>;
	create(encounterId: number, input: CreateMedicationInput): Promise<MedicationJson>;
}