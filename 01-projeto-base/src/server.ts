/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP
 * ============================================================
 * Este arquivo AINDA esta como veio da rodada 1 do Topico 2:
 * tudo em um unico arquivo, sem camadas. Ele FUNCIONA -- rode
 * `npm run dev` agora mesmo e confirme.
 *
 * O trabalho desta etapa e mover este codigo para:
 *   src/routes/       (so roteamento)
 *   src/controllers/  (traducao HTTP <-> dominio)
 *   src/services/     (regra de negocio)
 *
 * Siga os TODOs NUMERADOS em routes/, controllers/ e services/
 * primeiro (TODO 1 a TODO 7). So volte a este arquivo no TODO 7,
 * para trocar as rotas abaixo pelos routers novos.
 *
 * NAO APAGUE nada abaixo antes de ter a camada nova funcionando --
 * use este código como a fonte da verdade de "o que o endpoint
 * precisa continuar fazendo".
 * ============================================================
 */

import express from "express";
import { patientsRouter } from "./routes/patients.routes";
import { encountersRouter } from "./routes/encounters.routes";
import { errorHandler } from "./middlewares/errorHandler";


const app = express();
const PORT = 3000;

// ------------------------------------------------------------
// MIDDLEWARES - executam ANTES das rotas, em ordem
// ------------------------------------------------------------

// Le o corpo da requisicao quando o Content-Type e application/json
// e coloca o resultado em req.body.
// SEM ESTA LINHA, req.body vem `undefined`. Erro numero 1 da turma.
app.use(express.json());

// Serve os arquivos de public/ como conteudo estatico.
// Por isso o frontend e a API vivem na MESMA origem (localhost:3000)
// e nao precisamos falar de CORS ainda.
app.use(express.static("public"));

// ------------------------------------------------------------
// ROTAS
// ------------------------------------------------------------

/** Rota de saude: serve para saber se o servidor esta de pe. */
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/patients", patientsRouter);

app.use("/api/patients/:id/encounters", encountersRouter);

/* ============================================================
   TODO 7 (depois de TODO 1-6 prontos em routes/controllers/services)
   ------------------------------------------------------------
   Troque TUDO acima (a partir de "PATIENTS -- implementacao
   atual") por:

     import { patientsRouter } from "./routes/patients.routes.ts";
     import { encountersRouter } from "./routes/encounters.routes.ts";

     app.use("/api/patients", patientsRouter);
     app.use("/api/patients/:id/encounters", encountersRouter);

   Teste com requests.http antes e depois: toda resposta -- status
   code, corpo, headers -- precisa continuar identica.

   ------------------------------------------------------------
   TODO 9 (Encontro 2, depois de errors/ e middlewares/errorHandler.ts prontos)
   ------------------------------------------------------------
   Registre o error handler POR ULTIMO, depois de todas as rotas:

     import { errorHandler } from "./middlewares/errorHandler.ts";
     app.use(errorHandler);
   ============================================================ 
*/

app.use(errorHandler);

   // ============================================================
// TODO 1 (Encontro 2, Pratica 1)
// GET /api/patients  ->  200 com um ARRAY de pacientes.
// Comece devolvendo um array fixo, escrito na mao. Sem banco ainda.
// ============================================================
// const patients = [
  //   {
    //     "id": 1,
    //     "nome": "Kamila Rocha",
    //     "dtNascimento": "2006-03-04",
    //     "cns": "12398403320",
//     "active": true
//   },
//   {
//     "id": 2,
//     "nome": "Thiago Alisson",
//     "dtNascimento": "2000-05-21",
//     "cns": "20283338402",
//     "active": false
//   }
// ]

// app.get("/api/patients", (request, response) => {
  
//   if (request.query.active === 'true'){
  //     return response.json(patients.filter((patient) => {
    //       return patient.active;
    //     }))
    //   }
//   else if (request.query.active === 'false') {
  //     return response.json(patients.filter((patient) => {
//       return patient.active === false;
//     }))
//   }

//   response.json(patients);

// })


// ============================================================
// TODO 2 (Encontro 2, Pratica 2)
// POST /api/patients
//   - leia req.body
//   - valide: name obrigatorio (texto nao vazio)
//              birthDate obrigatorio no formato AAAA-MM-DD
//              nationalId obrigatorio
//   - se invalido:  400  { "error": "mensagem util" }
//   - se valido:    201  com o paciente criado
// ============================================================
// const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// function isBlank(value: unknown) {
  //   return typeof value !== 'string' || value.trim() === '';
  // }
  
  // function validationPatientInput(body: any): string | null {
//   if (isBlank(body?.name)) {
  //     return 'O campo nome é obrigatório.';
//   }
//   if (isBlank(body?.birthDate) || !ISO_DATE.test(body.birthDate)) {
  //     return 'O campo birthdate deve ser no formato AAAA-MM-DD';
  //   }
  
  //   return null;
  // }
  
  // app.post ('/api/patients', (request, response) => {
    //   const validacao = validationPatientInput(request.body);
    
    //   if (validacao != null) {
//     return response.status(400).json({
//       error: validacao});
//   }

//   const id = (pacientes.length) + 1;
//   request.body.id = id;
//   pacientes.push(request.body);

//   response.status(201).json(request.body);
// })

// ============================================================
// TODO 3 (Encontro 2, Pratica 3)
// Troque o array em memoria pelo banco:
//   import { db } from "./database";
//   const rows = db.prepare("SELECT ... FROM patients ORDER BY name").all();
// E crie GET /api/patients/:id devolvendo 404 quando nao existir.
// ============================================================
// function toPatientJson (row: any) {
  //   return {
    //     id: row.id,
    //     name: row.name,
    //     birthDate: row.birth_date,
    //     nationalId: row.national_id,
    //     active: row.active === 1
    //   };
    // }
    
    // function toEncounterJson (row: any) {
//   return {
  //     id: row.id,
  //     patientId: row.patient_id,
  //     startedAt: row.started_at,
  //     chiefComplaint: row.chief_complaint,
  //     notes: row.notes
  //   };
  // }

// app.get("/api/patients", (request, response) => {
  //   const rows = db.prepare("SELECT * FROM patients").all();

//   const patients = rows.map(row => toPatientJson(row));
//   if (request.query.active === 'true'){
  //     return response.json(patients.filter((patient) => {
    //       return patient.active;
    //     }))
//   }
//   else if (request.query.active === 'false') {
  //     return response.json(patients.filter((patient) => {
//       return patient.active === false;
//     }))
//   }

//   response.json(patients);

// })

// app.get("/api/patients/:id", (request, response) => {
//   const row = db.prepare("SELECT * FROM patients WHERE id = ?").get(request.params.id);

//   if (row === undefined) {
  //     return response.status(404).json({
    //       error: "Paciente não encontrado"
    //     })
    //   }

    //   const paciente = toPatientJson(row);
    
    //   response.json(paciente);
// })

// app.post ('/api/patients', (request, response) => {
  //   const validation = validationPatientInput(request.body);
  
  //   if (validation != null) {
//     return response.status(400).json({
  //       error: validation
//     });
//   }

//   const duplicate = db.prepare("SELECT id FROM patients WHERE national_id = ?").get(request.body.nationalId.trim());
//   if (duplicate) {
  //     return response.status(409).json({
    //       error: "Já existe um paciente com este CNS."
    //     })
    //   }
    
    //   const result = db.prepare("INSERT INTO patients (name, birth_date, national_id, active) VALUES (?, ?, ?, ?)").run(
      //     request.body.name, 
      //     request.body.birthDate, 
      //     request.body.nationalId, 
//     request.body.active ? 1 : 0
//   )

//   request.body.id = result.lastInsertRowid;

//   response.status(201).json(request.body);
// })

// ============================================================
// ROTAS DE ENCOUNTERS
// ============================================================
// function validatePatientExist (id: number): string | null {
  //   const row = db.prepare("SELECT * FROM patients WHERE id = ?").get(id);
  
  //   if (row === undefined) {
    //     return "Paciente não encontrado";
    //   }

//   return null;
// }

// app.get("/api/patients/:id/encounters", (request, response) => {
  //   const result = validatePatientExist(Number(request.params.id))
  //   if (result != null) {
//     return response.status(404).json({
  //       error: `Falha ao buscar os atendimentos: ${result}`
//     })
//   }

//   const rows = db.prepare("SELECT * FROM encounters WHERE patient_id = ? ORDER BY started_at DESC").all(request.params.id);
//   const encounters = rows.map(row => toEncounterJson(row));

//   response.json(encounters);
// })

// const ISO_DATE_HOUR = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
// function validationEncounterInput(body: any): string | null {
  //   if (isBlank(body?.chiefComplaint)) {
    //     return 'O preenchimento do campo de queixas e sintomas é obrigatório.'
    //   }
    //   else if (isBlank(body?.startedAt) || !ISO_DATE_HOUR.test(body.startedAt)) {
      //     return 'O campo de horário de início da consulta deve ter o formato AAAA-MM-DDTHH:MM.'
      //   }
      
      //   return null;
      // }
      
      // app.post("/api/patients/:id/encounters", (request, response) => {
        //   const validationError = validationEncounterInput(request.body);
//   if (validationError != null) {
  //     return response.status(400).json({
    //       error: validationError
    //     })
    //   }
    
    //   const pacientError = validatePatientExist(Number(request.params.id));
    //   if (pacientError != null) {
      //     return response.status(404).json({
        //       error: pacientError
        //     })
        //   }
        
//   const result = db.prepare("INSERT INTO encounters (patient_id, started_at, chief_complaint, notes) VALUES (?, ?, ?, ?)").run(
  //     request.params.id,
//     request.body.startedAt,
//     request.body.chiefComplaint,
//     request.body.notes
//   )

//   const encounter = db.prepare("SELECT * FROM encounters WHERE id = ?").get(result.lastInsertRowid);

//   response.json(toEncounterJson(encounter));
// })

// ------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});
