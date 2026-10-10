import { MedicationsRepository } from "./medications.repository";
import { MedicationJson } from "./medications.repository";
import { prisma } from "../../prisma/client";
import type { CreateMedicationInput } from "../validation/medications.schemas";

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
