/**
 * ============================================================
 * ORQUESTRAÇÃO
 * ------------------------------------------------------------
 * Este arquivo é o maestro. Ele não guarda estado e não desenha
 * nada sozinho. Ele apenas:
 *
 *   1. liga eventos do usuário às AÇÕES do estado
 *   2. manda a tela ser redesenhada quando o estado muda
 *   3. dispara a carga inicial dos dados
 *
 * O fluxo é sempre o mesmo, e sempre em um sentido só:
 *
 *   evento  ->  ação  ->  estado  ->  render  ->  tela
 *
 * Nunca o contrário. A tela nunca é a fonte da verdade.
 * ============================================================
 */
import { createPatient, listPatients, uploadPatientPhoto } from "./api.js";
import { subscribe, getState, setPatients, setSearchTerm, setOnlyActive, setError, setPreviewUrl, addPatient, setFormError } from "./state.js";
import { renderPatientList, renderCounter, renderLoading, renderError, renderPhotoPreview, renderFormError } from "./render.js";
import { renderApiError } from "./errors.js";

/* --- Os elementos que existem na página. Buscamos UMA vez. --- */
const searchInput = document.querySelector("#search-input");
const onlyActiveInput = document.querySelector("#only-active-input");
const patientListElement = document.querySelector("#patient-list");
const resultCounterElement = document.querySelector("#result-counter");
const patientPhotoPreview = document.querySelector("#patient-photo-preview");
const patientAttachment = document.querySelector("#patient-attachment");
const patientPhotoTitle = document.querySelector("#patient-photo-title");
const patientForm = document.querySelector("#patient-form");
const patientFormFeedback = document.querySelector("#patient-form-error");
const buttonSaveNewPatient = document.querySelector("#save-new-patient");
const patientFormStatus = document.querySelector("#patient-form-status");

/**
 * A ÚNICA função que desenha a tela inteira.
 * Ela é chamada toda vez que o estado muda — e apenas por isso.
 */
function renderApp(state) {
  if (state.errorMessage) {
    renderError(state.errorMessage, patientListElement);
    resultCounterElement.textContent = "";
    return;
  }

  if (state.isLoading) {
    renderLoading(patientListElement);
    resultCounterElement.textContent = "";
    return;
  }

  renderPatientList(state.visiblePatients, state.searchTerm, patientListElement);
  renderCounter(state.visiblePatients.length, state.patients.length, resultCounterElement);
  renderPhotoPreview(state.previewUrl, state.previewFilename, patientPhotoPreview, patientPhotoTitle);
  renderFormError(state.formError, state.fieldErrors, patientFormFeedback)
}

/* --- Eventos do usuário viram AÇÕES, nunca alterações de DOM --- */
searchInput.addEventListener("input", (event) => {
  setSearchTerm(event.target.value);
});

onlyActiveInput.addEventListener("change", (event) => {
  setOnlyActive(event.target.checked);
});

patientAttachment.addEventListener('change', () => {
  const file = patientAttachment.files[0];
  setPreviewUrl(URL.createObjectURL(file), file.name);
});

patientForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // impede o reload da página
  buttonSaveNewPatient.disabled = true;
  try {
    await savePatient();
  }
  finally {
    buttonSaveNewPatient.disabled = false;
  }
});

async function savePatient() {
  setFormError(null);
  clearStatus();
  patientFormStatus.textContent = "Enviando...";
  patientFormStatus.hidden = false;

  try {
    const patient = await createPatient({
      name: document.querySelector("#patient-name").value,
      birthDate: document.querySelector("#patient-birth-date").value,
      nationalId: document.querySelector("#patient-national-id").value
    });
    
    const file = patientAttachment.files[0];
    const finalPatient = file ? await uploadPatientPhoto(patient.id, file) : patient;
    addPatient(finalPatient);
    
    setPreviewUrl(null, null);
    patientForm.reset();

    clearStatus();
    patientFormStatus.classList.add("patient-form__status--success")
    patientFormStatus.textContent = "Paciente cadastrado com sucesso!";
    patientFormStatus.hidden = false;
  }
  catch(error) {
    clearStatus();
    renderApiError(error.apiError)
  }
}

function clearStatus() {
  patientFormStatus.hidden = true;
  patientFormStatus.textContent = "";
  patientFormStatus.classList.remove("patient-form__status--success");
}

/* --- Sempre que o estado mudar, a tela é redesenhada --- */
subscribe(renderApp);

/* --- Carga inicial --- */
async function start() {
  renderApp(getState());

  try {
    const patients = await listPatients();
    setPatients(patients);
  } catch (error) {
    setError(error.message);
  }
}

start();
