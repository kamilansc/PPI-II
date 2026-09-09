/* ------------------------------------------------------------
   SEGURANÇA - por que escapar o texto?
   ------------------------------------------------------------
   Vamos montar HTML com `innerHTML`. Se o nome de um paciente
   fosse `<img src=x onerror="alert(1)">`, o navegador executaria
   esse código. Isso se chama XSS.
   Escapar significa: transformar caractere de marcação em texto.
   Voltaremos a isso com calma em OWASP Top 10.
   ------------------------------------------------------------ */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** 1991-03-14  ->  14/03/1991 */
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function renderPatientHeading(patient) {
  const badgeModifier = patient.active ? "status-badge--active" : "status-badge--inactive";
  const badgeLabel = patient.active ? "Ativo" : "Inativo";
  
  return `
  <h2 class="patient-summary__name">${escapeHtml(patient.name)}</h2>
  <span class="status-badge ${badgeModifier}">${badgeLabel}</span>
  `
}

export function renderPatientFields(patient) {
  return `
    <div>
      <p class="patient-summary__field-label">Nascimento</p>
      <p class="patient-summary__field-value">${formatDate(patient.birthDate)} · ${patient.age} ano(s)</p>
    </div>
    <div>
      <p class="patient-summary__field-label">CNS</p>
      <p class="patient-summary__field-value patient-summary__field-value--mono">${escapeHtml(patient.nationalId)}</p>
    </div>
    <div>
      <p class="patient-summary__field-label">Prontuário</p>
      <p class="patient-summary__field-value">#${patient.id}</p>
    </div>
  `;
}

export function renderPatientSummary(patient, container) {
  container.classList.remove('patient-summary--plain');
  container.hidden = false;
  container.innerHTML = `
    <div class="patient-summary__body">
      <div id="patient-summary__heading" class="patient-summary__heading">
      ${renderPatientHeading(patient)}
      </div>

      <div id="patient-summary__fields" class="patient-summary__fields">
      ${renderPatientFields(patient)}
      </div>
    </div>       

    <div id="patient-summary__actions" class="patient-summary__actions">
      <button type="button" id="patient-summary__new-encounter-button" class="action-button action-button--primary">
        + Nova consulta
      </button>
      <button type="button" class="action-button action-button--ghost">Editar paciente</button>
    </div>
  `
}

/** Desenha os campos de preenchimento de uma nova consulta dentro do `container`. */
export function renderEncounterForm(container, formOpen) {
  if (!formOpen) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  container.innerHTML = `
    <div class="encounter-form__group">
      <div class="encounter-form__field">
        <label for="encounter-started-at" class="encounter-form__label">
          Data e hora
        </label>
        <input type="datetime-local" id="encounter-started-at" class="encounter-form__input"/>
      </div>

      <div class="encounter-form__field">
        <label for="encounter-chief-complaint" class="encounter-form__label">
          Queixa principal
        </label>
        <input type="text" id="encounter-chief-complaint" class="encounter-form__input" placeholder="Ex.: Dor de cabeça há 2 dias"/>
      </div>
    </div>

    <div class="encounter-form__field">
      <label for="encounter-notes" class="encounter-form__label">
        Observações
      </label>
      <textarea id="encounter-notes" class="encounter-form__textarea" rows="3" placeholder="Observações adicionais (opcional)"></textarea>
    </div>

    <div class="encounter-form__actions">
      <button type="button" id="encounter-save-button" class="action-button action-button--primary">
        Salvar
      </button>
      <button type="button" id="encounter-cancel-button" class="action-button action-button--ghost">
        Cancelar
      </button>
    </div>
    
    <p id="encounter-form__feedback" class="encounter-form__feedback" role="alert"></p>
  `;
}


/** 2026-08-22T09:40:00.000Z  ->  22/08/2026 · 09:40 */
function formatDateTime(isoDateTime) {
  const [date, time] = isoDateTime.split('T');
  const datePart = formatDate(date);
  const timePart = time;
  return `${datePart} · ${timePart}`;
}

/** Monta o HTML de UM cartão de atendimento. */
function encounterCardTemplate(encounter) {
  const hasNotes = Boolean(encounter.notes && encounter.notes.trim());
  const notesModifier = hasNotes ? "" : " encounter-card__notes--empty";
  const notesText = hasNotes ? escapeHtml(encounter.notes) : "Sem observações adicionais.";

  return `
    <li class="encounter-card">
      <p class="encounter-card__date">${formatDateTime(encounter.startedAt)}</p>
      <p class="encounter-card__complaint">${escapeHtml(encounter.chiefComplaint)}</p>
      <p class="encounter-card__notes${notesModifier}">${notesText}</p>
    </li>
  `;
}

/** Desenha a lista de atendimentos dentro do elemento `container`. */
export function renderPatientEncounters(encounters, container) {
  if (encounters.length === 0) {
    container.innerHTML = emptyEncountersTemplate();
    return;
  }

  const cards = encounters.map(encounterCardTemplate);
  container.innerHTML = cards.join("");
}

/** Tela de "nenhum atendimento". */
function emptyEncountersTemplate() {
  return `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Nenhum atendimento</p>
        <p class="m-0">Este paciente ainda não possui atendimentos registrados.</p>
      </div>
    </li>
  `;
}

/** Mensagem quando a comunicação falhou. */
export function renderErrorPatient(message, container) {
  container.classList.add('patient-summary--plain');
  container.hidden = false;
  container.innerHTML = `
    <div class="empty-state empty-state--error">
      <div>
        <div class="empty-state__icon">!</div>
        <p class="empty-state__title">Algo deu errado</p>
        <p class="m-0">${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

export function renderLoading(container) {
  container.classList.add('patient-summary--plain');
  container.hidden = false;
  container.innerHTML = `
    <div class="empty-state">
      <div class="spinner-border text-secondary" role="status"></div> 
      <p class="empty-state__title">Carregando…</p>
      <p class="m-0">Buscando informações do paciente.</p>
    </div>
      `;
  }

export function renderEncounterFormError(message, container) {
    container.innerHTML = `
      <div class="empty-state empty-state--error">
        <p class="empty-state__title">Não foi possível salvar</p>
        <p class="m-0">${escapeHtml(message)}</p>
      </div>
    `;
}