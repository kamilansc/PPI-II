/**
 * Controller de Encounter.
 */
import type { Request, Response } from "express";
import * as encountersService from "../services/encounters.service";

export async function listByPatient(request: Request, response: Response) {
  const encounters = await encountersService.listEncountersByPatient(Number(request.params.id));
  response.status(200).json(encounters);
}

export async function create(request: Request, response: Response) {
  const created = await encountersService.createEncounter(
    Number(request.params.id),
    request.body,
  );
  response.status(201).json(created);
}
