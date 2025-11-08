document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche l'envoi du formulaire
    
    // Récupère le pseudo
    const username = document.getElementById('username').value;
    
    // Sauvegarde le pseudo dans le "localStorage" (la BDD du navigateur)
    localStorage.setItem('breakTabooUser', username);
    
    // Redirige vers la page du jeu
    window.location.href = 'index.html';
});