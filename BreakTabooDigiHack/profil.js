// Base de données de TOUS les succès possibles
const allAchievements = {
    'first_answer': { icon: '✅', title: 'Premiers Pas', desc: 'Répondre à votre première question.' },
    'first_correct': { icon: '🎯', title: 'Juste !', desc: 'Avoir votre première bonne réponse.' },
    'myth_buster': { icon: '💥', title: 'Tueur de Mythes', desc: 'Démonter 3 mythes.' },
    'reality_check': { icon: '🧐', title: 'Chercheur', desc: 'Confirmer 3 réalités.' },
    'streak_3': { icon: '🔥', title: 'Série Chaude', desc: '3 bonnes réponses d\'affilée.' },
    'level_2': { icon: '📈', title: 'Apprenti', desc: 'Atteindre le niveau 2.' }
};

document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les données du joueur
    const userStats = JSON.parse(localStorage.getItem('breakTabooUserStats')) || 
                      { name: 'Invité', level: 1, xp: 0, totalXp: 0, unlockedAchievements: {} };
    
    // Récupérer les succès débloqués
    const unlocked = userStats.unlockedAchievements;

    // Afficher les stats
    document.getElementById('profile-username').innerText = userStats.name;
    document.getElementById('profile-level').innerText = `Niveau: ${userStats.level}`;
    document.getElementById('profile-xp').innerText = `XP Total: ${userStats.totalXp}`;

    // Afficher la grille des succès
    const grid = document.getElementById('achievements-grid');
    for (const id in allAchievements) {
        const ach = allAchievements[id];
        const isUnlocked = unlocked[id];
        
        const box = document.createElement('div');
        box.className = 'achievement-box';
        if (isUnlocked) {
            box.classList.add('unlocked');
        }
        
        box.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-title">${ach.title}</div>
            <div class="achievement-desc">${isUnlocked ? ach.desc : '???'}</div>
        `;
        grid.appendChild(box);
    }
});

// Logique pour le bouton Reset
document.getElementById('reset-btn').addEventListener('click', () => {
    // Demande de confirmation
    if (confirm('Voulez-vous vraiment effacer tout votre progrès ?\nCela inclut votre niveau, XP, succès et score.')) {
        
        // Efface toutes les données du joueur
        localStorage.removeItem('breakTabooUserStats');
        localStorage.removeItem('breakTabooScores');
        localStorage.removeItem('breakTabooUser');
        
        // (Optionnel) Effacer aussi les questions ajoutées par l'admin :
        // localStorage.removeItem('breakTabooQuestions');
        
        // Renvoie à la page de connexion
        alert('Progrès réinitialisé.');
        window.location.href = 'login.html';
    }
});