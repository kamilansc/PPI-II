import { getPatient, getPatientEncounters, createPatientEncounter } from "../api.js";
import { getEncounterFormData } from "./form-patient-encounter.js";
import { renderErrorPatient, renderLoading, renderPatientEncounters, renderPatientSummary, renderEncounterFormError } from "./render.js";
import { setError, setPatient, subscribe, getState, setEncounters } from "./state.js";

const patientSummary = document.querySelector('#patient-summary');
const sectionHeadingTitle = document.querySelector('#section-heading__title');
const encounterList = document.querySelector('#encounter-list'); 
const newEncounterForm = document.querySelector('#new-encounter-form');
const encounterFormError = document.querySelector('#encounter-form__error');

const newEncounterModalElement = document.querySelector('#new-encounter-modal');
const newEncounterModal = bootstrap.Modal.getOrCreateInstance(newEncounterModalElement);

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
    renderPatientEncounters(state.encounters, encounterList);
}

subscribe(renderAppPatient);

newEncounterForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  encounterFormError.innerHTML = '';

  const encounterData = getEncounterFormData(newEncounterForm);

  saveEncounter(encounterData);
});

async function saveEncounter(encounterData) {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('id');

    try {
        await createPatientEncounter(patientId, encounterData);
        newEncounterForm.reset();
        newEncounterModal.hide();

        const encounters = await getPatientEncounters(patientId);
        setEncounters(encounters);
  } catch (error) {
        renderEncounterFormError(error.message, encounterFormError);
  }
}

async function start() {
    console.log(getState());
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

