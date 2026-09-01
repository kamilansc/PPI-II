/**
 * ============================================================
 * RENDERIZAÇÃO
 * ------------------------------------------------------------
 * Desenha o estado na tela. Não decide nada. Mesmo padrão do
 * Mini-Prontuário.
 * ============================================================
 */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDateTime(isoDateTime) {
  const [datePart, timePart] = isoDateTime.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year} às ${timePart}`;
}

function medicationCardTemplate(med) {
  return `
    <li class="medication-card" data-medication-id="${med.id}" role="button" tabindex="0">
      <h2 class="medication-card__name">${escapeHtml(med.medicationName)} — ${escapeHtml(med.dosage)}</h2>
      <p class="medication-card__meta">${escapeHtml(med.patientName)}</p>
      <p class="medication-card__meta">${escapeHtml(med.route)} · ${formatDateTime(med.scheduledAt)}</p>
    </li>
  `;
}

function emptyStateTemplate() {
  return `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Nada por aqui</p>
        <p class="m-0">Nenhuma prescrição cadastrada ainda.</p>
      </div>
    </li>
  `;
}

// ============================================================
// PASSO 2 — implemente renderMedicationList(medications, container)
//   vazio -> emptyStateTemplate(); senão -> map + join('') com medicationCardTemplate
// ============================================================
export function renderMedicationList(medications, container) {
  if (medications.length === 0) {
    container.innerHTML = emptyStateTemplate();
    return;
  }

  container.innerHTML = medications.map(medicationCardTemplate).join("");
}


export function renderCounter(count, container) {
  container.textContent = `${count} prescrição(ões) no painel`;
}

export function renderLoading(container) {
  container.innerHTML = `<li><div class="empty-state"><p class="empty-state__title">Carregando…</p></div></li>`;
}

export function renderError(message, container) {
  container.innerHTML = `<li><div class="empty-state"><p class="empty-state__title">Algo deu errado</p><p class="m-0">${escapeHtml(message)}</p></div></li>`;
}

// ============================================================
// PASSO 4 — implemente renderDetail(state, container)
//   sem selectedMedication -> container.hidden = true; container.innerHTML = ""
//   com selectedMedication -> desenhe nome, paciente, dosagem, via, horário,
//   observações (se houver) e um botão <button id="remove-button">Suspender</button>
//   dica: veja o padrão renderDetail do Mini-Prontuário (gabarito da Atividade 01)
// ============================================================
export function renderDetail(state, container) {
  if (!state.selectedId) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  const medication = state.selectedMedication;

  const hasNotes = Boolean(medication.notes && medication.notes.trim());
  const notesText = hasNotes ? escapeHtml(medication.notes) : "Sem observações adicionais.";
  
  container.innerHTML = `
    <h3 class="medication-detail__title">
      ${medication.medicationName}
    </h3>

    <div class="medication-detail__patient">
      <span class="medication-detail__label">
        Paciente
      </span>

      <p class="medication-detail__patient-name">
        ${medication.patientName}
      </p>
    </div>

    <div class="medication-detail__grid">

      <div>
        <span class="medication-detail__label">
          Dosagem
        </span>

        <p class="medication-detail__value">
          ${medication.dosage}
        </p>
      </div>

      <div>
        <span class="medication-detail__label">
          Via
        </span>

        <p class="medication-detail__value">
          ${medication.route}
        </p>
      </div>

      <div>
        <span class="medication-detail__label">
          Horário
        </span>

        <p class="medication-detail__value">
          ${formatDateTime(medication.scheduledAt)}
        </p>
      </div>

    </div>

    <p class="medication-detail__notes">
      ${notesText}
    </p>

    <button id="remove-button" class="medication-detail__remove-button">
      Suspender
    </button>
  `;
  // container.innerHTML = `
  //   <h3 class="medication-detail__title medication-detail__patient">
  //     ${medication.medicationName}
  //   </h3>

  //   <p class="medication-detail__item">
  //     Paciente: ${medication.patientName}
  //   </p>

  //   <p class="medication-detail__item">
  //     Dosagem: ${medication.dosage}
  //   </p>

  //   <p class="medication-detail__item">
  //     Via: ${medication.route}
  //   </p>

  //   <p class="medication-detail__item">
  //     Horário: ${formatDateTime(medication.scheduledAt)}
  //   </p>

  //   <p class="medication-detail__notes">
  //     ${notesText}
  //   </p>

  //   <button id="remove-button" class="medication-detail__remove-button">
  //     Suspender
  //   </button>
  // `;
  // const body = state.encounterError
  // ? `<div class="empty-state"><p class="empty-state__title">Algo deu errado</p><p class="m-0">${escapeHtml(state.encounterError)}</p></div>`
  // : state.isLoadingEncounters
  //   ? `<div class="empty-state"><p class="m-0">Carregando atendimentos…</p></div>`
  //   : state.encounters.length === 0
  //     ? `<div class="empty-state"><p class="empty-state__title">Sem atendimentos</p><p class="m-0">Este paciente ainda não tem registros.</p></div>`
  //     : `<ul class="encounter-list">${state.encounters.map(encounterItemTemplate).join("")}</ul>`;

  // container.innerHTML = `
  //   <div class="detail-panel__header">
  //     <div>
  //       <p class="detail-panel__eyebrow">Prontuário de</p>
  //       <h2 class="detail-panel__title">${escapeHtml(state.selectedPatient.name)}</h2>
  //     </div>
  //     <button id="close-detail-button" class="btn btn-outline-secondary btn-sm" type="button">
  //       Fechar
  //     </button>
  //   </div>
  // `
}