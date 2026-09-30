/**
 * Controller de Encounter.
 */
import type { Request, Response } from "express";
import * as encountersService from "../services/encounters.service";

export function listByPatient(request: Request, response: Response) {
  const encounters = encountersService.listEncountersByPatient(Number(request.params.id));
  response.status(200).json(encounters);
}

export function create(request: Request, response: Response) {
  const created = encountersService.createEncounter(
    Number(request.params.id),
    request.body,
  );
  response.status(201).json(created);
}
