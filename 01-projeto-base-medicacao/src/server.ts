/**
 * ============================================================
 * Painel de Medicacao - Servidor HTTP
 * ============================================================
 * Isto e um "Hello World": so a rota de saude e o servidor
 * estatico. As quatro rotas da atividade (listar, criar, obter
 * um, remover) ainda nao existem — sao o que voce vai construir.
 */
import express, { response } from "express";
import { db } from "./database";
import { request } from "http";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

type medicationRow = {
  id: number,
  patient_name: string,
  medication_name: string,
  dosage: string,
  route: string,
  scheduled_at: string,
  notes: string
}

function toMedicationsRow (row: medicationRow) {
  return {
    id: row.id,
    patientName: row.patient_name,
    medicationName: row.medication_name,
    dosage: row.dosage,
    route: row.route,
    scheduledAt: row.scheduled_at,
    notes: row.notes
  }
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

// ============================================================
// PASSO 1 — GET /api/medications
//   db.prepare("SELECT ... FROM medication_orders").all()
//   Nao esqueca de traduzir snake_case -> camelCase antes de responder.
// ============================================================

app.get("/api/medications", (_request, response) => {
  const rows = db
    .prepare("SELECT id, patient_name, medication_name, dosage, route, scheduled_at, notes FROM medication_orders")
    .all()as medicationRow[];

  // 200 e o padrao do Express quando ha corpo. Explicitamos para
  // deixar o contrato visivel no codigo.
  response.json(rows.map(toMedicationsRow));
});

// ============================================================
// PASSO 3 — POST /api/medications
//   valide patientName, medicationName, dosage, route, scheduledAt
//   INSERT parametrizado -> responda 201 com o registro criado
// ============================================================
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function validateMedicationInput(body: any) {
  if (isBlank(body.patientName)) {
    return "O campo Nome do paciente é obrigatório";
  }

  if (isBlank(body.medicationName)) {
    return "O campo Nome do medicamento é obrigatório";
  }

  if (isBlank(body.dosage)) {
    return "O campo Dosagem é obrigatória";
  }

  if (isBlank(body.route)) {
    return "O campo Via de administração é obrigatória";
  }

  if (isBlank(body.scheduledAt) || !ISO_DATE_TIME.test(body.scheduledAt)) {
    return "O campo Data e horário são obrigatórios e deve estar no formato AAAA-MM-DD.";
  }

  return null;
}

app.post("/api/medications", (request, response) => {
  const error = validateMedicationInput(request.body);

  if (error) {
    return response.status(400).json({ error });
  }

  const {
    patientName,
    medicationName,
    dosage,
    route,
    scheduledAt,
    notes
  } = request.body;

  const result = db
    .prepare(`INSERT INTO medication_orders (
      patient_name,
      medication_name,
      dosage,
      route,
      scheduled_at,
      notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      patientName,
      medicationName,
      dosage,
      route,
      scheduledAt,
      notes ?? null
    );

  const medication = db
    .prepare(`
      SELECT
        id,
        patient_name,
        medication_name,
        dosage,
        route,
        scheduled_at,
        notes
      FROM medication_orders
      WHERE id = ?
    `)
    .get(result.lastInsertRowid) as medicationRow;

  return response.status(201).json(toMedicationsRow(medication));

});

// ============================================================
// PASSO 4 — GET /api/medications/:id
//   db.prepare("SELECT ... WHERE id = ?").get(id)
//   undefined -> 404
// ============================================================

app.get("/api/medications/:id", (request, response) => {
  const row = db.prepare(`
    SELECT 
      id, patient_name, medication_name, dosage, route, scheduled_at, notes
    FROM medication_orders
    WHERE id = ?`)
    .get(request.params.id) as medicationRow | undefined;

  if (!row) {
    response.status(404).json({ error: "Prescrição não encontrada."});
    return;
  }
  
  return response.json(toMedicationsRow(row));
})

// ============================================================
// PASSO 5 — DELETE /api/medications/:id
//   db.prepare("DELETE FROM medication_orders WHERE id = ?").run(id)
//   responda 204, sem corpo
// ============================================================

app.delete("/api/medications/:id", (request, response) => {
  const row = db
    .prepare("DELETE FROM medication_orders WHERE ID = ?")
    .run(request.params.id);

  if (row.changes === 0) {
    return response.status(404).json({
      error: "Não é possível deletar. Prescrição não existe."
    });
  }
  response.status(204).send();
})

app.listen(PORT, () => {
  console.log(`Painel de Medicacao no ar em http://localhost:${PORT}`);
});
