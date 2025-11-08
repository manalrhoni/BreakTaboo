document.getElementById('add-question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 1. Récupérer les valeurs du formulaire
    const newQuestion = {
        level: parseInt(document.getElementById('q-level').value),
        question: document.getElementById('q-text').value,
        answer: document.getElementById('q-answer').value,
        explanation: document.getElementById('q-explanation').value,
        isPhysicalCard: false // IMPORTANT: Marque comme question digitale
    };
    
    // 2. Récupérer la BDD de questions existante
    let questionsDB = JSON.parse(localStorage.getItem('breakTabooQuestions')) || [];
    
    // 3. Ajouter la nouvelle question
    questionsDB.push(newQuestion);
    
    // 4. Sauvegarder la BDD mise à jour
    localStorage.setItem('breakTabooQuestions', JSON.stringify(questionsDB));
    
    // 5. Donner un feedback à l'admin
    const feedback = document.getElementById('admin-feedback');
    feedback.innerText = "Question ajoutée avec succès !";
    setTimeout(() => { feedback.innerText = ""; }, 3000);
    
    // 6. Vider le formulaire
    e.target.reset();
});