export function getEncounterFormData(form) {
    const formData = new FormData(form);

    return {
        chiefComplaint: formData.get('chiefComplaint'),
        notes: formData.get('notes') || null,
        startedAt: formData.get('startedAt')
    };
}