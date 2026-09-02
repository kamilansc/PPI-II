/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO
 * ------------------------------------------------------------
 * Único arquivo autorizado a chamar `fetch`. Mesmo padrão do
 * Mini-Prontuário (Semana 01).
 * ============================================================
 */

const MEDICATIONS_URL = "/api/medications";

// ============================================================
// PASSO 2 — implemente listMedications()
//   const response = await fetch(MEDICATIONS_URL);
//   if (!response.ok) throw new Error(...)
//   return response.json();
// ============================================================
export async function listMedications() {
  const response = await fetch(MEDICATIONS_URL);

  if (!response.ok) {
    const body = await response.json();
    throw new Error(`Não foi possível carregar as medicações. HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================
// PASSO 3 — implemente createMedication(medication)
//   method: "POST", headers Content-Type, body: JSON.stringify(medication)
//   se !response.ok, leia o corpo e jogue o erro com a mensagem do servidor
// ============================================================
export async function createMedication(medication) {
  const response = await fetch(MEDICATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medication),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error ?? `Falha ao cadastrar (HTTP ${response.status})`);
  }

  return response.json();
}

// ============================================================
// PASSO 4 — implemente getMedication(id)
//   fetch(`${MEDICATIONS_URL}/${id}`)
//   response.status === 404 -> throw new Error("Prescrição não encontrada.")
// ============================================================
export async function getMedication(id) {
  const response = await fetch(`${MEDICATIONS_URL}/${id}`);

  if (response.status === 404) {
    const body = await response.json();
    throw new Error (body.error);
  }

  return response.json();
}

// ============================================================
// PASSO 5 — implemente removeMedication(id)
//   method: "DELETE"
//   sucesso = response.status === 204 (sem corpo, não dá pra fazer .json())
// ============================================================
export async function removeMedication(id) {
  const response = await fetch(`${MEDICATIONS_URL}/${id}`, {
    method: "DELETE"
  });

  if (response.status !== 204) {
    const body = await response.json();
    throw new Error (body.error);
  }

  return;
}