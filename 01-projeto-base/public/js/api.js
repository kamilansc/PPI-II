/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO
 * ------------------------------------------------------------
 * Este é o ÚNICO arquivo do frontend autorizado a chamar `fetch`.
 *
 * Por quê? Porque no dia em que a URL mudar, o servidor exigir
 * um cabeçalho de autenticação, ou o formato do erro mudar, você
 * quer abrir UM arquivo — não caçar `fetch` espalhado em cinco.
 *
 * Ninguém aqui fora precisa saber que existe HTTP. Quem chama
 * `listPatients()` recebe uma lista de pacientes. Ponto.
 * ============================================================
 */


/**
 * A fonte dos dados.
 *
 * ENCONTRO 1: apontamos para um arquivo JSON estático.
 * ENCONTRO 2: trocaremos por "/api/patients" — e nada mais no
 * frontend vai precisar mudar. Guarde essa promessa.
 */
const PATIENTS_URL = "/api/patients";

/**
 * Busca a lista de pacientes.
 * @returns {Promise<Array<{id:number,name:string,birthDate:string,nationalId:string,active:boolean}>>}
 */
export async function listPatients() {
  const response = await fetch(PATIENTS_URL);

  // ATENÇÃO: `fetch` NÃO lança erro em 404 ou 500.
  // Ele só lança quando a rede falha (sem conexão, DNS, CORS).
  // Um 404 chega aqui como uma resposta perfeitamente "bem-sucedida".
  // Por isso a checagem de `response.ok` é obrigatória.
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os pacientes (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Busca um paciente específico.
 * @param {number} id
 */
export async function getPatient(id) {
  const response = await fetch(`/api/patients/${id}`);

  const body = await response.json();
  if (!response.ok) {
    throw { apiError: body};
  }

  return body;
}

export async function createPatient(patient) {
  const response = await fetch(PATIENTS_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(patient)
  })

  const body = await response.json();
  if (!response.ok) throw { apiError: body};
  
  return body;
}

export async function getPatientEncounters(id) {
  const response = await fetch(`/api/patients/${id}/encounters`);

  const body = await response.json();
  if (!response.ok) {
    throw { apiError: body};
  }

  return body;
}

export async function createPatientEncounter(patientId, encounterData) {
  const response = await fetch(`/api/patients/${patientId}/encounters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(encounterData)
  })

  const body = response.json();
  if (!response.ok) {
    throw { apiError: body};
  }

  return body;
}

/**
 * ============================================================
 * TODO 14 (Encontro 2) -- upload de foto
 * ============================================================
 * export async function uploadPatientPhoto(patientId, file) {
 *   const formData = new FormData();
 *   formData.append("photo", file);
 *   const response = await fetch(`${PATIENTS_URL}/${patientId}/photo`, {
 *     method: "POST",
 *     body: formData, // SEM Content-Type manual -- o navegador
 *                      // define o boundary do multipart sozinho
 *   });
 *   const body = await response.json();
 *   if (!response.ok) throw { apiError: body };
 *   return body;
 * }
 * ============================================================
 */
export async function uploadPatientPhoto(patientId, file) {
  const formData = new FormData();
  formData.append("photo", file);
  
  const response = await fetch(`${PATIENTS_URL}/${patientId}/photo`, {
    method: "POST",
    body: formData, // SEM Content-Type manual -- o navegador
                    // define o boundary do multipart sozinho
  });

  const body = await response.json();
  
  if (!response.ok) {
    throw { apiError: body};
  }
  
  return body;  
}