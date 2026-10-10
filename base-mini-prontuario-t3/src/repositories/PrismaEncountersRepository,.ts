import { prisma } from "../../prisma/client";
import type { CreateEncounterInput } from "../validation/encounters.schemas";
import { EncountersRepository } from "./encounters.repository";
import { EncounterJson } from "./encounters.repository";

export class PrismaEncountersRepository implements EncountersRepository {
  async findByPatient(patientId: number): Promise<EncounterJson[]> {
    return await prisma.encounter.findMany({
      where: {patientId},
      orderBy: {startedAt: "desc"}
    }) as EncounterJson[];
  }

  async findById(id: number): Promise<EncounterJson | undefined> {
    return await prisma.encounter.findUnique({where: {id}}) as EncounterJson | undefined;
  }

  async create(patientId: number, input: CreateEncounterInput): Promise<EncounterJson> {
    return await prisma.encounter.create({data: {...input, patientId}}) as EncounterJson;
  }
}