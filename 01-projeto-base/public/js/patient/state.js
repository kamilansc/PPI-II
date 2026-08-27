let state = {
    patient: null,
    encounters: [],
    isLoading: true,
    errorMessagePatient: null,
    errorMessageEncounters: null,
}

/** Quem quer ser avisado quando o estado mudar. */
const listeners = [];

/**
 * Registra um interessado nas mudanças de estado.
*/
export function subscribe(listener) {
  listeners.push(listener);
}



export function getState() {
  return {
    ...state,
    patient: state.patient ? {...state.patient, age: calculateAge(state.patient.birthDate)} : null,
  };
}

/* ------------------------------------------------------------
   DADOS DERIVADOS
   ------------------------------------------------------------ */

function calculateAge(birthDate) {
  let age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  
  const mesAniv = new Date(birthDate).getMonth();
  const mesAtual = new Date().getMonth();
  
  if (mesAtual < mesAniv || (mesAtual === mesAniv && new Date().getDate() < new Date(birthDate).getDate())) {
    age--;
  }

  return age;
}

/** Avisa todo mundo que o estado mudou. */
export function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}

/** Registra uma falha para a tela poder mostrar. */
export function setError(message) {
  state.errorMessagePatient = message;
  state.isLoading = false;
  notify();
}

export function setPatient (patient) {
  state.patient = patient;
  state.isLoading = false;
  notify();
}

export function setEncounters (encounters) {
  state.encounters = encounters;
  state.isLoading = false;
  notify();
}