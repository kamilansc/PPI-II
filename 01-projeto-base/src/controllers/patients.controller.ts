/**
 * ============================================================
 * TODO 2 -- Controller de Patient
 * ============================================================
 * O controller traduz HTTP <-> dominio. Ele:
 *   - le req.params / req.body
 *   - chama o Service (que ainda nao existe -- e o TODO 3)
 *   - formata a resposta (res.status().json())
 *
 * O controller NUNCA:
 *   - chama db.prepare diretamente
 *   - contem "if" de regra de negocio (ex.: "CNS ja existe?")
 *
 * Migre a LOGICA DE TRADUCAO HTTP das 3 rotas de patients que
 * estao em server.ts (list, getById, create) para ca. A
 * validacao de formato e a checagem de duplicidade vao para o
 * Service, no TODO 3.
 *
 * Dica de assinatura:
 *   import { patientsService } from "../services/patients.service.ts";
 *
 *   export const patientsController = {
 *     list(req, res) { ... },
 *     getById(req, res) { ... },
 *     create(req, res) { ... },
 *   };
 * ============================================================
 */
import { Request, Response } from "express";
import { patientsService } from "../services/patients.service"

export const patientsController = {
    list(_req: Request, res: Response) {
        const patients = patientsService.list();
        res.json(patients);
    },

    getById(req: Request, res: Response) {
        const patientId = req.params.id;

        if (!patientId || Array.isArray(patientId)) {
            return res.status(400).json({ error: "O ID do paciente é inválido" });
        }

        try {
            const patient = patientsService.getById(patientId);
            res.json(patient);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
            }
        }
    },

    create(req: Request, res: Response) {
        try {
            const newPatient = patientsService.create(req.body);
            res.status(201).json(newPatient);
        }
        catch (error){
            if (error instanceof Error) {
                if (error.message === 'Já existe um paciente com este CNS.') {
                    res.status(409).json({ error: error.message })
                }
                else res.status(400).json({ error: error.message })
            }
        }
    }
}

/**
 * ============================================================
 * TODO 13 (Encontro 2, continuacao) -- Controller de upload
 * ============================================================
 * uploadPhoto(req, res):
 *   - se !req.file -> throw new UnprocessableEntityError()
 *   - chama patientsService.setPhoto(req.params.id, req.file.filename)
 *   - responde 200 com o paciente atualizado
 * ============================================================
 */
