/**
 * ============================================================
 * TODO 3 -- Service de Patient
 * ============================================================
 * O Service e onde mora a regra de negocio de verdade: o SQL
 * (db.prepare), a checagem de CNS duplicado (409), a traducao
 * snake_case -> camelCase (toPatientJson).
 *
 * O Service NUNCA:
 *   - conhece req/res (nao sabe que existe HTTP)
 *   - formata resposta HTTP
 *
 * Quando algo da errado (paciente nao encontrado, CNS
 * duplicado), por enquanto o Service pode continuar devolvendo
 * um valor especial (ex.: null) OU lancando um Error comum --
 * a hierarquia HttpError chega no TODO 8 (Encontro 2). Combine
 * com a dupla como vao sinalizar "nao encontrado" antes disso
 * existir.
 *
 * Migre para ca: a query de list, a query de getById, a
 * checagem de duplicata + insert de create, e a funcao
 * toPatientJson (que hoje esta em server.ts).
 *
 * Dica de assinatura:
 *   export const patientsService = {
 *     list() { ... },
 *     getById(id: string) { ... },
 *     create(data: { name: string; birthDate: string; nationalId: string }) { ... },
 *   };
 * ============================================================
 */
import { db } from "../database";

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  active: number;
};

function toPatientJson (row: any) {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    active: row.active === 1
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isBlank(value: unknown) {
  return typeof value !== 'string' || value.trim() === '';
}

function validatePatientInput(body: any): string | null {
  if (isBlank(body?.name)) {
    return "O campo 'nome' é obrigatório.";
  }
  if (isBlank(body?.birthDate) || !ISO_DATE.test(body.birthDate)) {
    return "O campo 'data de nascimento' é obrigatório e deve estar no formato AAAA-MM-DD";
  }
  if (isBlank(body?.nationalId)) {
    return "O campo 'cartão do SUS' é obrigatório.";
  }

  return null;
}

export const patientsService = {
    list() {
        const rows = db
        .prepare("SELECT id, name, birth_date, national_id, active FROM patients")
        .all() as PatientRow[];
        
        const patients = rows.map(row => toPatientJson(row));

        return patients;
    },

    getById(id: string) {
        const row = db.prepare("SELECT * FROM patients WHERE id = ?").get(id);
      
        if (row === undefined) {
          throw new Error ("Paciente não encontrado")
        }
      
        return toPatientJson(row);
    },

    create(data: { name: string; birthDate: string; nationalId: string, active: boolean} ) {
      const validation = validatePatientInput(data);
    
      if (validation != null) {
        throw new Error(validation)
      }

      const duplicate = db
      .prepare("SELECT id FROM patients WHERE national_id = ?")
      .get(data.nationalId.trim());
      
      if (duplicate) {
        throw new Error("Já existe um paciente com este CNS.")
      }
      
      const result = db.prepare("INSERT INTO patients (name, birth_date, national_id, active) VALUES (?, ?, ?, ?)").run(
        data.name, 
        data.birthDate, 
        data.nationalId, 
        data.active ? 1 : 0
      )

      const created = db
      .prepare("SELECT id, name, birth_date, national_id, active FROM patients WHERE id = ?")
      .get(result.lastInsertRowid);
      
      return toPatientJson(created);
    }
}




/**
 * ============================================================
 * TODO 13 (Encontro 2, continuacao) -- Service de upload
 * ============================================================
 * setPhoto(id, filename):
 *   - busca o paciente (senao existir -> throw NotFoundError)
 *   - UPDATE patients SET photo_path = ? WHERE id = ?
 *     (salve como `/uploads/${filename}`)
 *   - devolve o paciente atualizado (toPatientJson)
 * ============================================================
 */
