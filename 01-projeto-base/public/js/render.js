/**
 * ============================================================
 * RENDERIZAÇÃO
 * ------------------------------------------------------------
 * Este arquivo desenha o estado na tela. E só isso.
 *
 * REGRA DE OURO: aqui não se DECIDE nada.
 * Não se filtra, não se ordena, não se calcula regra de negócio.
 * Ele recebe o que deve aparecer e coloca na tela.
 *
 * Um bom `render` é burro de propósito. Toda a inteligência
 * mora no estado.
 * ============================================================
 */

export function renderFormError(formError, fieldErrors, container) {
  container.innerHTML = '';
  
  if (!formError) {
    container.hidden = true;
    return
  };

  const message = document.createElement("p");
  message.className = "patient-form__feedback-message";
  message.textContent = formError;
  container.appendChild(message);

  const fieldNames = Object.keys(fieldErrors ?? {});
  if (fieldNames.length > 0) {
    const list = document.createElement("ul");
    list.className = "patient-form__feedback-list";
    fieldNames.forEach((field) => {
      const item = document.createElement("li");
      item.textContent = fieldErrors[field];
      list.appendChild(item);
    });
    container.appendChild(list);
  }

  container.hidden = false;
}

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

/** Monta o HTML de UM cartão de paciente. */
function patientCardTemplate(patient) {
  const cardModifier = patient.active ? "" : " patient-card--inactive";
  const badgeModifier = patient.active ? "status-badge--active" : "status-badge--inactive";
  const badgeLabel = patient.active ? "Ativo" : "Inativo";
  const photoSrc = patient.photoUrl || "";

  return `
    <li class="patient-card${cardModifier}">
      ${photoSrc ? `<img class="patient-card__photo" src="${photoSrc}" alt="" />` : `<div class="patient-card__photo"></div>`}
      <div class="d-flex justify-content-between align-items-start gap-2">
        <h2 class="patient-card__name">${escapeHtml(patient.name)}</h2>
        <span class="status-badge ${badgeModifier}">${badgeLabel}</span>
      </div>
      <p class="patient-card__meta">
        Nascimento: ${formatDate(patient.birthDate)} · ${patient.age} anos
      </p>
      <p class="patient-card__meta patient-card__id">
        CNS ${escapeHtml(patient.nationalId)} · #${patient.id}
      </p>
      <a class="patient-card__link" href="patient.html?id=${patient.id}">Ver detalhes →</a>
    </li>
  `;
}

/** Tela de "nada encontrado". */
function emptyStateTemplate(searchTerm) {
  const complement = searchTerm
    ? `Nenhum paciente corresponde a “${escapeHtml(searchTerm)}”.`
    : "Nenhum paciente cadastrado ainda.";

  return `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Nada por aqui</p>
        <p class="m-0">${complement}</p>
      </div>
    </li>
  `;
}

/**
 * TODO RENDER-1 (Encontro 1, Prática 1)
 * Desenhe a lista de pacientes dentro do elemento `container`.
 *
 * Passos:
 *   1. se `patients` estiver vazio, use emptyStateTemplate(searchTerm)
 *   2. senão, transforme cada paciente em HTML com patientCardTemplate
 *      e junte tudo numa única string
 *   3. coloque o resultado em container.innerHTML
 *
 * Dica: `patients.map(...).join("")`
 *
 * Repare que redesenhamos a lista INTEIRA a cada mudança. Para
 * oito pacientes isso é instantâneo e o código fica trivial.
 * Para dez mil linhas com foco e rolagem, não seria — e é
 * exatamente esse problema que o React resolve. Você vai
 * entender o React muito melhor depois de ter vivido isso.
 */
export function renderPatientList(patients) {
  const container = document.getElementById("patient-list");

  if (patients.length == 0) {
    container.innerHTML = emptyStateTemplate(searchTerm);
    return;
  }
  const cards = patients.map(patient => patientCardTemplate(patient));
  container.innerHTML = cards.join("");
}

/** Atualiza o contador de resultados. */
export function renderCounter(visibleCount, totalCount, container) {
  container.textContent =
    visibleCount === totalCount
      ? `${totalCount} paciente(s) no prontuário`
      : `${visibleCount} de ${totalCount} paciente(s)`;
}

/** Mensagem enquanto os dados não chegaram. */
export function renderLoading(container) {
  container.innerHTML = `
    <li>
      <div class="empty-state">
        <div class="spinner-border text-secondary" role="status"></div>
        <p class="empty-state__title">Carregando…</p>
        <p class="m-0">Buscando os pacientes.</p>
      </div>
    </li>
  `;
}

/** Mensagem quando a comunicação falhou. */
export function renderError(message, container) {
  container.innerHTML = `
    <li>
      <div class="empty-state empty-state--error">
        <p class="empty-state__title">Algo deu errado</p>
        <p class="m-0">${escapeHtml(message)}</p>
      </div>
    </li>
  `;
}

/**
 * ============================================================
 * TODO 14 (Encontro 2) -- preview de foto antes do envio
 * ============================================================
 * Uma funcao renderPhotoPreview() que le um novo campo de estado
 * (ex.: state.previewUrl, setado via URL.createObjectURL no
 * listener do <input type="file">) e mostra a imagem antes de
 * qualquer requisicao ao servidor.
 * ============================================================
 */
export function renderPhotoPreview(photoUrl, filename, container, containerTitle) {
    if (!photoUrl) {
      container.innerHTML = `<span class="patient-form__dropzone-icon" aria-hidden="true">🖼</span>`;
      containerTitle.textContent = "Clique para anexar uma foto";
    return;
  }

  container.innerHTML = `<img src="${photoUrl}" alt="Pré-visualização da foto do paciente" />`;
  containerTitle.textContent = filename;
}
