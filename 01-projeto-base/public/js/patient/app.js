import { getPatient, getPatientEncounters, createPatientEncounter } from "../api.js";
import { getEncounterFormData } from "./form-patient-encounter.js";
import { renderErrorPatient, renderLoading, renderPatientEncounters, renderPatientSummary, renderEncounterFormError, renderEncounterForm } from "./render.js";
import { setError, setPatient, subscribe, getState, setEncounters, openEncounterForm, closeEncounterForm, addEncounter } from "./state.js";

const patientSummary = document.querySelector('#patient-summary');
const encounterList = document.querySelector('#encounter-list'); 
const newEncounterForm = document.querySelector('#new-encounter-form');
const encounterFormError = document.querySelector('#encounter-form__error');


function renderAppPatient(state) {
    if (state.errorMessagePatient) {
        renderErrorPatient(state.errorMessagePatient, patientSummary);
        return;
    }

    if (state.isLoading) {
        renderLoading(patientSummary);
        return;
    }
    renderPatientSummary(state.patient, patientSummary);
    renderEncounterForm(newEncounterForm, state.isEncounterFormOpen);
    renderPatientEncounters(state.encounters, encounterList);
}

subscribe(renderAppPatient);

// newEncounterForm.addEventListener('submit', async (event) => {
//   event.preventDefault();
//   encounterFormError.innerHTML = '';

//   const encounterData = getEncounterFormData(newEncounterForm);

//   saveEncounter(encounterData);
// });

patientSummary.addEventListener("click", (event) => {
    if (event.target.id === "patient-summary__new-encounter-button"){
        openEncounterForm();
    }
})

newEncounterForm.addEventListener("click", (event) => {
    if (event.target.id === "encounter-cancel-button") {
        closeEncounterForm();
    }

    else if (event.target.id === "encounter-save-button") {
        saveEncounter(event.target);
    }
})

async function saveEncounter(button) {
    const state = getState();
    const patientId = state.patient.id;
    const feedback = document.querySelector("#encounter-form__feedback");

    button.disable = true;
    feedback.textContent = "Enviando...";

    const encounterData = {
        startedAt: document.querySelector("#encounter-started-at").value,
        chiefComplaint: document.querySelector("#encounter-chief-complaint").value,
        notes: document.querySelector("#encounter-notes").value
    }
    
    try {
        const created = await createPatientEncounter(patientId, encounterData);
        addEncounter(created);

        const feedback = document.querySelector("#encounter-form__feedback");
        feedback.classList = "encounter-form__feedback encounter-form__feedback--success";
        feedback.textContent = "Consulta cadastrada com sucesso!"
        
    } catch (error) {
        const feedback = document.querySelector("#encounter-form__feedback");
        feedback.classList = "encounter-form__feedback encounter-form__feedback--error"
        feedback.textContent = error.message;
        button.disable = false;
    }
}

async function start() {
    renderAppPatient(getState());
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('id');

    try {
        const [patient, encounters] = await Promise.all([
            getPatient(patientId),
            getPatientEncounters(patientId)
        ])

        setPatient(patient);
        setEncounters(encounters); 
    }
    catch (error) {
        setError(error.message);
    }
}

start();

