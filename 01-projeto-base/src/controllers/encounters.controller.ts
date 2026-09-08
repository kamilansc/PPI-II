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
import { Request, response, Response } from "express";
import { encountersService } from "../services/encounters.service"


export const encountersController = {
    list (req: Request, res: Response) {
        const patientId = req.params.id;

        if (!patientId || Array.isArray(patientId)) {
            return res.status(400).json({ error: "O ID do paciente é inválido" })
        }

        try {
            const encounters = encountersService.list(patientId);
            res.status(200).json(encounters);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
        }
    },

    create(req: Request, res: Response) {
        const patientId = req.params.id;
        if (!patientId || Array.isArray(patientId)) {
            return res.status(400).json({ error: "O ID do paciente é inválido" })
        }

        try {
            const encounter = encountersService.create(patientId, req.body);
            res.status(201).json(encounter);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === "Paciente não encontrado") {
                    res.status(404).json({ error: error.message })
                }
                else res.status(400).json({ error: error.message })
            }
        }
    }
}