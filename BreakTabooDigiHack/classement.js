window.addEventListener('DOMContentLoaded', () => {
    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // 1. Récupérer les VRAIS scores du localStorage
    let scores = JSON.parse(localStorage.getItem('breakTabooScores')) || [];

    // 2. Vérifier s'il n'y a VRAIMENT aucun score
    if (scores.length === 0) {
        // Affiche un message au lieu des faux scores
        leaderboardBody.innerHTML = '<tr><td colspan="3">Aucun score pour le moment. Jouez une partie !</td></tr>';
        return; // Arrête le script ici
    }
    
    // 3. Trier (sécurité)
    scores.sort((a, b) => b.score - a.score);

    // 4. Afficher les scores
    leaderboardBody.innerHTML = ""; // Vider le tableau
    scores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
});