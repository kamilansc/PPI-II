import { Request, Response } from "express";
import { medicationsService } from "./service";


export const medicationsController = {
  list(_req: Request, res: Response) {
    const medications = medicationsService.list();
  
    res.status(200).json(medications);
  },

  create (req: Request, res: Response) {
    try {
      const created = medicationsService.create(req.body);
      res.status(201).json(created);
    }
    catch (error) {
      if (error instanceof Error) {
        res.status(400).json(error.message)
      } else {
        res.status(500).json(error)
      }
    }
  }

}

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
