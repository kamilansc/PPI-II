/**
 * ============================================================
 * TODO 10 (Encontro 2) -- Schema Zod de Patient
 * ============================================================
 * export const createPatientSchema = z.object({ ... });
 *
 * Campos: name (string, min 1), birthDate (string, formato
 * AAAA-MM-DD), nationalId (string).
 *
 * Depois de escrever o schema, use-o no TODO 11 (middleware
 * validate) e monte na rota de criar paciente:
 *   patientsRouter.post("/", validate(createPatientSchema), patientsController.create);
 * ============================================================
 */

import { z } from 'zod';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const createPatientSchema = z.object({ 
    name: 
        z.string({ error: 'O campo Nome é obrigatório!' })
        .trim().min(1, 'O campo Nome é obrigatório!'),
    birthDate: z.string({ error: 'O campo Data de nascimento é obrigatório!' })
        .trim().min(1, 'O campo Data de nascimento é obrigatório!')
        .pipe(z.string().regex(ISO_DATE, 'O campo Data de nascimento deve estar no formato AAAA-MM-DD!')),
    nationalId: z.string({ error: 'O campo CNS é obrigatório!'})
        .trim().min(1, 'O campo CNS é obrigatório!')
        .pipe(z .string().length(15, 'O campo CNS deve conter 15 dígitos!'))
})