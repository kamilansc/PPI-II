import { prisma } from "../infra/prisma/client";
import type { CreateMedicationInput } from "../validation/medications.schemas";

export type MedicationJson = {
	id: number;
	encounterId: number;
	medication: string;
	dosage: string;
};

export interface MedicationsRepository {
	findByEncounter(encounterId: number): Promise<MedicationJson[]>;
	create(encounterId: number, input: CreateMedicationInput): Promise<MedicationJson>;
}

export class PrismaMedicationsRepository implements MedicationsRepository {
	async findByEncounter(encounterId: number): Promise<MedicationJson[]> {
		return prisma.medicationRequest.findMany({
			where: { encounterId },
			orderBy: { id: "asc" },
		});
	}

	async create(
		encounterId: number,
		input: CreateMedicationInput,
	): Promise<MedicationJson> {
		return prisma.medicationRequest.create({
			data: { ...input, encounterId },
		});
	}
}
