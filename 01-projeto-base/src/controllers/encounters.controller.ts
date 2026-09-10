/**
 * ============================================================
 * TODO 5 -- Controller de Encounter
 * ============================================================
 * Mesma regra do TODO 2: traduz HTTP <-> dominio, chama o
 * Service (TODO 6), nunca acessa o banco diretamente.
 *
 * Repare que aqui o id do paciente vem de req.params.id (por
 * causa do mergeParams no TODO 4) -- e nao de um :patientId
 * separado.
 *
 *   import { encountersService } from "../services/encounters.service.ts";
 *
 *   export const encountersController = {
 *     list(req, res) { ... },
 *     create(req, res) { ... },
 *   };
 * ============================================================
 */
import { Request, Response } from "express";
import { encountersService } from "../services/encounters.service"


export const encountersController = {
    list (req: Request, res: Response) {
        const patientId = req.params.id;

        if (!patientId || Array.isArray(patientId)) {
            return res.status(400).json({ error: "O ID do paciente é inválido" })
        }

        const encounters = encountersService.list(patientId);
        res.status(200).json(encounters);
    },

    create(req: Request, res: Response) {
        const patientId = req.params.id;
        if (!patientId || Array.isArray(patientId)) {
            return res.status(400).json({ error: "O ID do paciente é inválido" })
        }

        const encounter = encountersService.create(patientId, req.body);
        res.status(201).json(encounter);
    }
}