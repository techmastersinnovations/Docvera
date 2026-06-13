def generate_ai_medical_suggestion(symptoms):

    symptoms = symptoms.lower()

    if 'fever' in symptoms and 'cough' in symptoms:
        return (
            "Possible viral infection. "
            "Recommend hydration, rest, "
            "CBC test if symptoms persist."
        )

    if 'chest pain' in symptoms:
        return (
            "Possible cardiac condition. "
            "Recommend ECG and cardiology consultation immediately."
        )

    if 'headache' in symptoms:
        return (
            "Possible migraine or stress-related headache. "
            "Recommend neurological evaluation if persistent."
        )

    return (
        "Further medical evaluation required. "
        "Please conduct clinical examination."
    )