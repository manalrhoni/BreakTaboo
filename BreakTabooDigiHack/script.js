/* --- NIVEAU 1 : Base de Données des 8 Cartes Physiques --- */
const level1Questions = [
    // C1
    {
        isPhysicalCard: true,
        cardID: "C1",
        question: "L'hymen est toujours déchiré après le premier rapport sexuel.",
        answer: "mythe",
        explanation: "Réalité : L'hymen peut être flexible, s'étirer, ou même être absent. Il peut aussi être rompu par des activités non sexuelles (sport, tampons). Sa présence n'est pas une preuve de virginité."
    },
    // C2
    {
        isPhysicalCard: true,
        cardID: "C2",
        question: "Les changements hormonaux pendant l'adolescence influencent le comportement émotionnel et sexuel.",
        answer: "realite",
        explanation: "Réalité : Les hormones (comme les œstrogènes et la testostérone) ont un impact direct sur les émotions, l'humeur et le développement du désir sexuel (libido) à l'adolescence."
    },
    // C3
    {
        isPhysicalCard: true,
        cardID: "C3",
        question: "Le papillomavirus (HPV) ne touche que les filles.",
        answer: "mythe",
        explanation: "Réalité : Le HPV touche tout le monde. Chez les garçons, il peut aussi causer des cancers (gorge, anus) et ils peuvent le transmettre. La vaccination est aussi recommandée pour eux."
    },
    // C4
    {
        isPhysicalCard: true,
        cardID: "C4",
        question: "Le HPV peut causer des cancers.",
        answer: "realite",
        explanation: "Réalité : Oui, certaines souches de HPV sont la cause principale du cancer du col de l'utérus. Il peut aussi causer d'autres cancers (gorge, anus, etc.). La vaccination est le meilleur moyen de prévention."
    },
    // C5
    {
        isPhysicalCard: true,
        cardID: "C5",
        question: "Les garçons ne connaissent pas de cycles hormonaux.",
        answer: "mythe",
        explanation: "Réalité : C'est différent, mais les garçons ont aussi des cycles. Le plus connu est le cycle de la testostérone, qui est généralement plus élevé le matin et plus bas le soir."
    },
    // C6
    {
        isPhysicalCard: true,
        cardID: "C6",
        question: "Les IST peuvent causer l'infertilité.",
        answer: "realite",
        explanation: "Réalité : Oui. Des IST non traitées, comme la Chlamydia ou la gonorrhée, peuvent entraîner l'infertilité chez les hommes comme chez les femmes."
    },
    // C7
    {
        isPhysicalCard: true,
        cardID: "C7",
        question: "Le stérilet protège contre les IST.",
        answer: "mythe",
        explanation: "Réalité : Le stérilet (DIU) est une contraception, il n'empêche pas la transmission des IST. Seul le préservatif (interne ou externe) protège à la fois des IST et d'une grossesse."
    },
    // C8
    {
        isPhysicalCard: true,
        cardID: "C8",
        question: "les infections sexuellement transmissibles peuvent toujours être guéries .",
        answer: "mythe",
        explanation: "Réalité : Les IST *bactériennes* (Chlamydia, syphilis) se guérissent avec des antibiotiques. Mais les IST *virales* (VIH, Herpès, HPV) ne se guérissent pas, on gère les symptômes et la transmission à vie."
    }
];

/* --- NIVEAU 2 : Questions Digitales (celles que vous ajoutez dans l'Admin) --- */
const defaultDigitalQuestions = [
    { level: 2, isPhysicalCard: false, question: "La 'pilule du lendemain' est une méthode d'avortement.", answer: "mythe", explanation: "Réalité : C'est une contraception d'urgence qui empêche ou retarde l'ovulation." },
    { level: 2, isPhysicalCard: false, question: "Se laver après un rapport sexuel empêche de tomber enceinte.", answer: "mythe", explanation: "Réalité : Les douches vaginales n'ont aucune efficacité contraceptive." }
];

// --- Chargement de la "Base de Données" ---
let allUserAddedQuestions = JSON.parse(localStorage.getItem('breakTabooQuestions')) || defaultDigitalQuestions;
// S'assurer que les questions de l'admin sont marquées comme "digitales"
allUserAddedQuestions = allUserAddedQuestions.map(q => ({ ...q, isPhysicalCard: false, level: q.level || 2 })); // Assure un niveau 2 par défaut

// La base de données finale : Niveau 1 (Cartes) + Niveau 2 (Digital)
let questionsDB = [...level1Questions, ...allUserAddedQuestions];


// --- Éléments du DOM ---
const questionText = document.getElementById('question-text');
const mythBtn = document.getElementById('myth-btn');
const realityBtn = document.getElementById('reality-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackText = document.getElementById('feedback-text');
const levelDisplay = document.getElementById('level-display');
const levelTitleEl = document.getElementById('level-title');
const usernameDisplay = document.getElementById('username-display');
const card = document.getElementById('card');
const xpBar = document.getElementById('xp-bar');
const xpText = document.getElementById('xp-text');
const timerBar = document.getElementById('timer-bar');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const timerSound = document.getElementById('timer-sound');
const avatarDisplay = document.getElementById('avatar-display');
const certificateModal = document.getElementById('certificate-modal');
const closeCertBtn = document.getElementById('close-cert-btn');

// --- Constantes du Jeu ---
const TIME_LIMIT_MS = 12000; // 12 secondes
const TIMER_INTERVAL_MS = 50;

// --- État du Jeu ---
let currentQuestionIndex = 0;
let isAnswered = false;
let timerIntervalId = null;
let timeLeft = 0;
let userStats = {
    name: 'Invité',
    level: 1,
    xp: 0,
    totalXp: 0,
    xpToNextLevel: 100,
    correctStreak: 0,
    mythCount: 0,
    realityCount: 0,
    unlockedAchievements: {}
};

// Charger les stats du joueur
function loadUser() {
    const savedStats = JSON.parse(localStorage.getItem('breakTabooUserStats'));
    if (savedStats) {
        userStats = savedStats;
    } else {
        userStats.name = localStorage.getItem('breakTabooUser') || 'Invité';
    }
    const avatar = localStorage.getItem('breakTabooAvatar') || '👤';
    avatarDisplay.innerText = avatar;
    usernameDisplay.innerText = userStats.name;
    updateUI();
}

// Mettre à jour tous les éléments visuels
function updateUI() {
    levelDisplay.innerText = `Niveau ${userStats.level}`;
    const percent = (userStats.xp / userStats.xpToNextLevel) * 100;
    xpBar.style.width = `${percent}%`;
    xpText.innerText = `${userStats.xp} / ${userStats.xpToNextLevel} XP`;
}

// Sauvegarder les stats
function saveUser() {
    localStorage.setItem('breakTabooUserStats', JSON.stringify(userStats));
}

// Ajouter de l'XP et gérer les niveaux
function addXp(amount) {
    userStats.xp += amount;
    userStats.totalXp += amount;
    
    // Montée de niveau normale (basée sur l'XP)
    if (userStats.xp >= userStats.xpToNextLevel) {
        userStats.level++;
        userStats.xp = userStats.xp - userStats.xpToNextLevel;
        userStats.xpToNextLevel = Math.floor(userStats.xpToNextLevel * 1.5);
        levelDisplay.classList.add('level-up');
        setTimeout(() => levelDisplay.classList.remove('level-up'), 1000);
        checkAchievements('level_up');
    }
    updateUI();
    saveUser();
}

// --- Système de Succès ---
const allAchievements = {
    'first_answer': { title: 'Premiers Pas', desc: 'Répondre à votre première question.' },
    'first_correct': { title: 'Juste !', desc: 'Avoir votre première bonne réponse.' },
    'myth_buster': { title: 'Tueur de Mythes', desc: 'Démonter 3 mythes.' },
    'reality_check': { title: 'Chercheur', desc: 'Confirmer 3 réalités.' },
    'streak_3': { title: 'Série Chaude', desc: '3 bonnes réponses d\'affilée.' },
    'level_2': { title: 'Apprenti', desc: 'Atteindre le niveau 2.' }
};

function unlockAchievement(id) {
    if (!userStats.unlockedAchievements[id]) {
        userStats.unlockedAchievements[id] = true;
        showAchievementPopup(allAchievements[id]);
        saveUser();
    }
}

function showAchievementPopup(ach) {
    const container = document.getElementById('achievement-popup-container');
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `<h4>Succès Débloqué !</h4><p>${ach.title}</p>`;
    container.appendChild(popup);
    setTimeout(() => { popup.remove(); }, 4500);
}

function checkAchievements(trigger, data) {
    unlockAchievement('first_answer');
    if (trigger === 'correct') {
        unlockAchievement('first_correct');
        if (userStats.correctStreak >= 3) unlockAchievement('streak_3');
        if (data === 'mythe' && userStats.mythCount >= 3) unlockAchievement('myth_buster');
        if (data === 'realite' && userStats.realityCount >= 3) unlockAchievement('reality_check');
    }
    if (trigger === 'level_up') {
        if (userStats.level >= 2) unlockAchievement('level_2');
    }
}

// --- Gère le compte à rebours ---
function startTimer() {
    clearInterval(timerIntervalId);
    timerSound.currentTime = 0;
    timerSound.play();
    timeLeft = TIME_LIMIT_MS;
    timerBar.style.width = '100%';
    timerBar.classList.remove('hidden');
    
    timerIntervalId = setInterval(() => {
        timeLeft -= TIMER_INTERVAL_MS;
        const percentLeft = (timeLeft / TIME_LIMIT_MS) * 100;
        timerBar.style.width = `${percentLeft}%`;
        
        if (timeLeft <= 0) {
            clearInterval(timerIntervalId);
            checkAnswer(null);
        }
    }, TIMER_INTERVAL_MS);
}

// --- Logique du Jeu ---
function loadQuestion() {
    if (currentQuestionIndex >= questionsDB.length) {
        // Fin du jeu
        timerSound.pause();
        card.innerHTML = `
            <h2>Débat Terminé !</h2>
            <p>Merci d'avoir joué. Le plus important n'est pas le score, c'est la discussion que vous avez eue.</p>
            <p style="font-weight: bold;">Engagez-vous à briser les tabous en partageant des informations correctes et en respectant les autres.</p>
        `;
        card.classList.add('correct-answer');
        levelTitleEl.innerText = "Jeu Terminé";
        mythBtn.classList.add('hidden');
        realityBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        timerBar.classList.add('hidden');
        
        feedbackText.innerHTML = `
            Votre score final est de ${userStats.totalXp} XP ! <br> 
            <a href="classement.html" class="nav-link">Voir le Classement</a>
            <button id="show-cert-btn" class="choice-btn" style="margin-top:15px;">🏆 Afficher notre Certificat</button>
        `;
        
        saveScore(userStats.name, userStats.totalXp);
        activateCertificateButton(); // Activer le bouton du certificat
        return;
    }

    const q = questionsDB[currentQuestionIndex];
    
    if (q.isPhysicalCard) {
        // NIVEAU 1 : CARTE PHYSIQUE
        levelTitleEl.innerText = `Niveau 1 - Cartes Physiques`;
        questionText.innerHTML = `
            <span class="card-instruction">Prenez la carte ${q.cardID}</span>
        `;
    } else {
        // NIVEAU 2 : QUESTION DIGITALE
        levelTitleEl.innerText = `Niveau 2 - Question Digitale`;
        questionText.innerHTML = `<span class="card-digital-q">${q.question}</span>`;
    }

    isAnswered = false;
    feedbackText.innerText = "";
    nextBtn.classList.add('hidden');
    mythBtn.classList.remove('hidden', 'correct', 'incorrect');
    realityBtn.classList.remove('hidden', 'correct', 'incorrect');
    card.classList.remove('correct-answer', 'incorrect-answer');
    mythBtn.disabled = false;
    realityBtn.disabled = false;
    
    startTimer();
}

// --- Logique de Réponse ---
function checkAnswer(userChoice) {
    if (isAnswered) return;
    
    clearInterval(timerIntervalId);
    timerSound.pause();
    
    isAnswered = true;
    mythBtn.disabled = true;
    realityBtn.disabled = true;

    const q = questionsDB[currentQuestionIndex];
    const correctBtn = (q.answer === 'mythe') ? mythBtn : realityBtn;
    const incorrectBtn = (q.answer ==='mythe') ? realityBtn : mythBtn;

    const isTimeout = (userChoice === null);
    const isCorrect = (userChoice === q.answer);

    if (isCorrect) {
        // Bonne réponse
        const xpGained = 10 * (q.level || 1);
        addXp(xpGained);
        feedbackText.innerText = `Correct (+${xpGained} XP) ! ${q.explanation}`;
        feedbackText.style.color = 'var(--success-green)';
        correctBtn.classList.add('correct');
        card.classList.add('correct-answer');
        correctSound.play();
        
        userStats.correctStreak++;
        if (q.answer === 'mythe') userStats.mythCount++;
        if (q.answer === 'realite') userStats.realityCount++;
        checkAchievements('correct', q.answer);
        
    } else {
        // Mauvaise réponse (ou temps écoulé)
        if (isTimeout) {
            feedbackText.innerText = `Temps écoulé ! ${q.explanation}`;
        } else {
            feedbackText.innerText = `Incorrect. ${q.explanation}`;
        }
        
        feedbackText.style.color = 'var(--error-red)';
        correctBtn.classList.add('correct');
        if (incorrectBtn) incorrectBtn.classList.add('incorrect');
        
        card.classList.add('incorrect-answer');
        wrongSound.play();
        userStats.correctStreak = 0;
        checkAchievements('incorrect');
    }

    // *** NOUVELLE LOGIQUE : PASSAGE AU NIVEAU 2 ***
    // (level1Questions.length - 1) est l'index de la dernière carte (7)
    if (currentQuestionIndex === (level1Questions.length - 1)) {
        if (userStats.level === 1) { // Seulement si on est encore niveau 1
            userStats.level = 2; // Forcer le passage au niveau 2
            userStats.xp = 0; // Réinitialise l'XP pour le nouveau niveau
            userStats.xpToNextLevel = Math.floor(userStats.xpToNextLevel * 1.5);
            
            // Animation ! (On met à jour le texte directement)
            levelDisplay.innerText = `Niveau ${userStats.level}`;
            levelDisplay.classList.add('level-up');
            setTimeout(() => levelDisplay.classList.remove('level-up'), 1000);
            
            checkAchievements('level_up'); // Déclenche le succès "level_2"
        }
    }
    // *** FIN DE LA NOUVELLE LOGIQUE ***

    updateUI(); // Met à jour la barre de XP
    saveUser();
    nextBtn.classList.remove('hidden');
}

// --- Fonctions du Certificat ---
function activateCertificateButton() {
    closeCertBtn.addEventListener('click', () => {
        certificateModal.classList.add('hidden');
    });

    const showBtn = document.getElementById('show-cert-btn');
    if (showBtn) { // Vérifie si le bouton existe
        showBtn.addEventListener('click', () => {
            document.getElementById('cert-avatar').innerText = localStorage.getItem('breakTabooAvatar') || '🏆';
            document.getElementById('cert-name').innerText = userStats.name;
            document.getElementById('cert-stat').innerText = `A atteint le Niveau ${userStats.level} avec ${userStats.totalXp} XP !`;
            
            certificateModal.classList.remove('hidden');
        });
    }
}

// --- Fonction pour sauvegarder le score (pour le classement) ---
function saveScore(user, score) {
    let scores = JSON.parse(localStorage.getItem('breakTabooScores')) || [];
    const existingScoreIndex = scores.findIndex(s => s.name === user);
    
    if (existingScoreIndex > -1) {
        if (scores[existingScoreIndex].score < score) {
            scores[existingScoreIndex].score = score;
        }
    } else {
        scores.push({ name: user, score: score });
    }
    
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('breakTabooScores', JSON.stringify(scores));
}

// --- Écouteurs d'événements ---
mythBtn.addEventListener('click', () => checkAnswer('mythe'));
realityBtn.addEventListener('click', () => checkAnswer('realite'));

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// --- Démarrage ---
loadUser();
loadQuestion();