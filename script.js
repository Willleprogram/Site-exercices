// Ajoute de l'interactivité au site

document.addEventListener('DOMContentLoaded', function () {
    console.log('Site chargé !');

    // Animation au chargement des cartes
    const cards = document.querySelectorAll('.subject-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`;
    });

    updateWelcomeBanner();
    updateAuthUI();
    showAdminAccessHint();
    initializeExercisePage();
});

function updateWelcomeBanner() {
    const banner = document.getElementById('welcome-banner');
    if (!banner) return;

    const loggedUser = getLoggedUser();
    if (loggedUser) {
        banner.style.display = 'block';
        banner.textContent = `Bienvenue ${loggedUser} ! Prêt à réviser ?`;
    }
}

function getLoggedUser() {
    return localStorage.getItem('loggedUser') || '';
}

function isUserLoggedIn() {
    return !!getLoggedUser();
}

function logout() {
    localStorage.removeItem('loggedUser');
    showToast('Déconnexion réussie. À bientôt !');
    setTimeout(() => {
        if (window.location.pathname.endsWith('login.html')) {
            window.location.reload();
        } else {
            window.location.href = 'index.html';
        }
    }, 700);
}

function updateAuthUI() {
    const loggedUser = getLoggedUser();
    const logoutBtn = document.getElementById('logout-button');
    const loginStatus = document.getElementById('login-status');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (logoutBtn) {
        if (loggedUser) {
            logoutBtn.style.display = 'inline-flex';
            logoutBtn.textContent = `Se déconnecter (${loggedUser})`;
            logoutBtn.addEventListener('click', logout);
        } else {
            logoutBtn.style.display = 'none';
        }
    }

    if (loginStatus) {
        if (loggedUser) {
            loginStatus.style.display = 'block';
            loginStatus.textContent = `Connecté en tant que ${loggedUser}.`;
        } else {
            loginStatus.style.display = 'none';
            loginStatus.textContent = '';
        }
    }

    if (loggedUser && loginSection && registerSection) {
        loginSection.style.display = 'none';
        registerSection.style.display = 'none';

        let alreadyLogged = document.querySelector('.already-logged-in');
        if (!alreadyLogged) {
            alreadyLogged = document.createElement('div');
            alreadyLogged.className = 'already-logged-in';
            registerSection.parentNode.insertBefore(alreadyLogged, registerSection);
        }
        alreadyLogged.textContent = `Vous êtes déjà connecté en tant que ${loggedUser}. Déconnectez-vous pour changer de compte.`;
    }

    if (!loggedUser) {
        const alreadyLogged = document.querySelector('.already-logged-in');
        if (alreadyLogged) {
            alreadyLogged.remove();
        }
    }
}

function showAdminAccessHint() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') !== '1') return;

    const loginSection = document.getElementById('login-section');
    if (!loginSection) return;

    const hint = document.createElement('div');
    hint.className = 'admin-hint';
    hint.textContent = 'Accès administrateur détecté : utilise ton compte admin pour te connecter.';
    loginSection.insertBefore(hint, loginSection.firstChild);
}

function initializeExercisePage() {
    const section = document.getElementById('exercise-section');
    if (!section) return;

    const subject = section.dataset.subject;
    const grade = section.dataset.grade;
    const exercises = getExercises(subject, grade);
    if (!exercises || !exercises.length) return;

    const list = document.getElementById('exercise-list');
    const solutionList = document.getElementById('solution-list');
    const refreshInfo = document.getElementById('refresh-info');

    if (list) {
        exercises.forEach((exercise, index) => {
            const item = document.createElement('li');
            item.innerHTML = `<strong>Exercice ${index + 1} :</strong> ${exercise.question}`;
            list.appendChild(item);
        });
    }

    if (solutionList) {
        exercises.forEach((exercise) => {
            const answerItem = document.createElement('li');
            answerItem.textContent = exercise.answer;
            solutionList.appendChild(answerItem);
        });
    }

    const toggleButton = document.getElementById('toggle-solutions');
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            const solutions = document.getElementById('solutions');
            if (!solutions) return;
            solutions.classList.toggle('hidden');
            toggleButton.textContent = solutions.classList.contains('hidden') ? 'Voir les réponses' : 'Masquer les réponses';
        });
    }

    if (refreshInfo) {
        refreshInfo.textContent = `Cette page contient ${exercises.length} exercices générés pour ${subject} ${grade}.`;
    }
}

function getExercises(subject, grade) {
    if (!subject || !grade) return null;

    switch (subject.toLowerCase()) {
        case 'anglais':
            return generateAnglaisExercises(grade);
        case 'francais':
            return generateFrancaisExercises(grade);
        case 'maths':
            return generateMathsExercises(grade);
        case 'histoire-geographie':
            return generateHistoireGeographieExercises(grade);
        case 'physique-chimie':
            return generatePhysiqueChimieExercises(grade);
        case 'sciences':
            return generateSciencesExercises(grade);
        case 'svt':
            return generateSVTExercises(grade);
        case 'technologie':
            return generateTechnologieExercises(grade);
        default:
            return null;
    }
}

function generateExercises(patterns) {
    return Array.from({ length: 30 }, (_, index) => {
        const pattern = patterns[index % patterns.length];
        return {
            question: typeof pattern.question === 'function' ? pattern.question(index + 1) : pattern.question,
            answer: typeof pattern.answer === 'function' ? pattern.answer(index + 1) : pattern.answer,
        };
    });
}

function generateAnglaisExercises(grade) {
    const verbs = ['play', 'go', 'have', 'see', 'eat', 'write'];
    const adjectives = ['happy', 'sad', 'tired', 'hungry', 'angry', 'excited'];
    const nouns = ['books', 'school', 'music', 'friends', 'sports', 'food'];

    if (grade === '3e') {
        return generateExercises([
            {
                question: () => `Traduis en anglais : 'Je suis ${adjectives[0]}'.`,
                answer: () => 'I am happy.',
            },
            {
                question: (n) => `Conjugue le verbe '${verbs[n % verbs.length]}' au présent pour he/she/it.`, 
                answer: (n) => `he/she/it ${verbs[n % verbs.length]}s`,
            },
            {
                question: () => "Complète : 'I ___ (be) happy'.", 
                answer: () => 'I am happy.',
            },
            {
                question: () => "Transforme en phrase négative : 'She likes chocolate'.", 
                answer: () => 'She does not like chocolate.',
            },
            {
                question: () => "Forme une question : 'What is your favorite color?'", 
                answer: () => 'My favorite color is blue.',
            },
            {
                question: () => "Relie le mot anglais au mot français : 'book' → ?", 
                answer: () => 'livre',
            },
        ]);
    }

    if (grade === '4e') {
        return generateExercises([
            {
                question: () => "Présent perfect : 'I ___ (live) here for 5 years'.", 
                answer: () => 'I have lived here for 5 years.',
            },
            {
                question: () => "Conditional : 'If I were you, I ___ (go)'.", 
                answer: () => 'If I were you, I would go.',
            },
            {
                question: () => "Utilise un modal : 'You ___ (must/should) study more'.", 
                answer: () => 'You should study more.',
            },
            {
                question: () => "Transforme en phrase passive : 'The book was written by Shakespeare'.", 
                answer: () => 'The book was written by Shakespeare.',
            },
            {
                question: () => "Complète : 'I wish I ___ (be) taller'.", 
                answer: () => 'I wish I were taller.',
            },
            {
                question: () => "Forme une question indirecte avec 'know'.", 
                answer: () => 'Do you know where she lives?',
            },
        ]);
    }

    return generateExercises([
        {
            question: () => "Traduis : 'Je n'en ai aucune idée'.", 
            answer: () => 'I have no idea.',
        },
        {
            question: () => "Formule une phrase avec 'It is essential that he ___'.", 
            answer: () => 'It is essential that he be present.',
        },
        {
            question: () => "Explique l'expression : 'break the ice'.", 
            answer: () => 'It means to start a conversation in a comfortable way.',
        },
        {
            question: () => 'Transforme en discours indirect : "She said, \"I am tired\"".', 
            answer: () => 'She said that she was tired.',
        },
        {
            question: () => "Complète : 'I would rather you ___ (come)'.", 
            answer: () => 'I would rather you came.',
        },
        {
            question: () => "Donne un exemple de phrase avec 'despite' et 'in spite of'.", 
            answer: () => 'Despite the rain, we went outside.',
        },
    ]);
}

function generateFrancaisExercises(grade) {
    const verbs = ['avoir', 'être', 'faire', 'aller', 'pouvoir', 'vouloir'];
    const adjectives = ['petit', 'grand', 'heureux', 'triste', 'rapide', 'lent'];

    if (grade === '3e') {
        return generateExercises([
            {
                question: () => "Conjugue 'avoir' au passé composé : je ___", 
                answer: () => 'j’ai eu',
            },
            {
                question: () => `Accorde l'adjectif : 'Les filles sont ${adjectives[0]}'.`, 
                answer: () => 'Les filles sont petites.',
            },
            {
                question: () => "Choisis : 'c'est' ou 'sait' ? 'Je ___ que ___'.", 
                answer: () => 'Je sais que c’est.',
            },
            {
                question: () => "Transforme au subjonctif : 'Il faut que je ___ (être)'.", 
                answer: () => 'Il faut que je sois.',
            },
            {
                question: () => "Orthographe : 'son' ou 'sont' ? 'C'est ___ ami'.", 
                answer: () => 'C’est son ami.',
            },
            {
                question: () => "Analyse : 'rapidement' est un(e) ?", 
                answer: () => 'adverbe',
            },
        ]);
    }

    if (grade === '4e') {
        return generateExercises([
            {
                question: () => "Complète au plus-que-parfait : 'Quand j'arrivai, il ___ (partir)'.", 
                answer: () => 'il était parti',
            },
            {
                question: () => "Écris une phrase avec 'bien que' + subjonctif.", 
                answer: () => 'Bien qu’il fasse froid, nous sortons.',
            },
            {
                question: () => "Utilise 'lequel' dans une phrase avec un pronom relatif.", 
                answer: () => 'Le livre auquel je pense est sur la table.',
            },
            {
                question: () => "Orthographe : 'aucun' ou 'aucune' ? 'Je n'ai ___ idée'.", 
                answer: () => 'Je n’ai aucune idée.',
            },
            {
                question: () => "Définis 'métaphore'.", 
                answer: () => 'C’est une figure de style qui compare sans utiliser « comme ».',
            },
            {
                question: () => "Explique la différence entre ':' et ';'.", 
                answer: () => 'Le deux-points introduit une explication, le point-virgule relie deux phrases proches.',
            },
        ]);
    }

    return generateExercises([
        {
            question: () => "Donne un exemple de discours rapporté (elle dit que...).", 
            answer: () => 'Elle a dit qu’elle viendrait.',
        },
        {
            question: () => "Écris une phrase au subjonctif imparfait avec 'fallait que'.", 
                answer: () => 'Il fallait qu’il fît un effort.',
        },
        {
            question: () => "Définis le 'champ lexical'.", 
                answer: () => 'Un ensemble de mots autour d’une même idée.',
        },
        {
            question: () => "Transforme : 'Le chien mordait le facteur' à la voix passive.", 
                answer: () => 'Le facteur était mordu par le chien.',
        },
        {
            question: () => "Qu'est-ce qu'un 'néologisme' ?", 
                answer: () => 'Un mot nouveau ou une expression récente.',
        },
        {
            question: () => "Trouve une figure de style : 'Cette pluie est un rideau'.", 
                answer: () => 'C’est une métaphore.',
        },
    ]);
}

function generateMathsExercises(grade) {
    if (grade === '3e') {
        return generateExercises([
            {
                question: () => 'Calcule : 45 + 37 = ?', 
                answer: () => '82',
            },
            {
                question: () => 'Simplifie : 6/8 = ?', 
                answer: () => '3/4',
            },
            {
                question: () => 'Résous : x + 5 = 12', 
                answer: () => 'x = 7',
            },
            {
                question: () => 'Pythagore : a=3, b=4, c = ?', 
                answer: () => '5',
            },
            {
                question: () => 'Pourcentage : 25% de 80 = ?', 
                answer: () => '20',
            },
            {
                question: () => 'Fraction : 1/2 + 1/3 = ?', 
                answer: () => '5/6',
            },
        ]);
    }

    if (grade === '4e') {
        return generateExercises([
            {
                question: () => 'Puissance : 2^5 = ?', 
                answer: () => '32',
            },
            {
                question: () => 'Factorise : a^2 + 2ab + b^2', 
                answer: () => '(a + b)^2',
            },
            {
                question: () => 'Thalès : données proportionnelles pour deux segments.', 
                answer: () => 'Utiliser le rapport égalité des proportions.',
            },
            {
                question: () => 'Trigonométrie : cos(30°) = ?', 
                answer: () => '√3/2',
            },
            {
                question: () => 'Aire du trapèze : b1=3, b2=5, h=2, A = ?', 
                answer: () => '8',
            },
            {
                question: () => 'Résous : (x - 2)(x + 3) = 0', 
                answer: () => 'x = 2 ou x = -3',
            },
        ]);
    }

    return generateExercises([
        {
            question: () => 'Fonctions : étudie la variation de y = x^2 - 4x + 3.', 
            answer: () => 'Parabole, minimum en x = 2.',
        },
        {
            question: () => 'Statistiques : calcule la moyenne de 5, 10, 15, 20.', 
            answer: () => '12,5',
        },
        {
            question: () => 'Équation : 3x - 7 = 8', 
            answer: () => 'x = 5',
        },
        {
            question: () => 'Géométrie : formule de l’aire d’un cercle.', 
            answer: () => 'πr²',
        },
        {
            question: () => 'Résous : x/2 + 4 = 10', 
            answer: () => 'x = 12',
        },
        {
            question: () => 'Calcul littéral : simplifie 4x + 3x - 2x.', 
            answer: () => '5x',
        },
    ]);
}

function generateHistoireGeographieExercises(grade) {
    const events = ['Révolution française', 'Première Guerre mondiale', 'Moyen Âge', 'Guerre froide', 'Antiquité'];
    const regions = ['Europe', 'Afrique', 'Asie', 'Amérique', 'Océanie'];

    return generateExercises([
        {
            question: (n) => `Décris un événement majeur de l'histoire : ${events[n % events.length]}.`, 
            answer: () => 'Évoque les causes, les acteurs et les conséquences.',
        },
        {
            question: (n) => `Localise sur une carte : ${regions[n % regions.length]}.`, 
            answer: () => 'Montre les pays et les principales régions géographiques.',
        },
        {
            question: () => 'Explique la différence entre climat et météo.', 
            answer: () => 'Le climat correspond aux conditions sur le long terme et la météo au court terme.',
        },
        {
            question: () => 'Identifie des repères chronologiques pour le XXe siècle.', 
            answer: () => '1914-1918, 1939-1945, 1968, 1989.',
        },
        {
            question: () => 'Analyse une source historique courte.', 
            answer: () => 'Reprends le contexte, l’auteur et l’intention.',
        },
        {
            question: () => 'Explique un phénomène géographique : le volcanisme.', 
            answer: () => 'Mouvements de l’écorce terrestre et émission de lave.',
        },
    ]);
}

function generatePhysiqueChimieExercises(grade) {
    return generateExercises([
        {
            question: () => 'Définis la loi d’Ohm.', 
            answer: () => 'U = R × I',
        },
        {
            question: () => 'Explique la différence entre masse et volume.', 
            answer: () => 'La masse mesure la quantité de matière, le volume l’espace occupé.',
        },
        {
            question: () => 'Donne un exemple de réaction chimique.', 
            answer: () => 'Combustion : CH4 + 2O2 → CO2 + 2H2O.',
        },
        {
            question: () => 'Calcul : si I = 2 A et R = 5 Ω, U = ?', 
            answer: () => '10 V',
        },
        {
            question: () => 'Explique le rôle des atomes dans la matière.', 
            answer: () => 'Les atomes sont les unités de base de la matière.',
        },
        {
            question: () => 'Compare un solide et un gaz.', 
            answer: () => 'Un solide a une forme définie, un gaz se dilate pour remplir son contenant.',
        },
    ]);
}

function generateSciencesExercises(grade) {
    return generateExercises([
        {
            question: () => 'Décris le cycle de l’eau.', 
            answer: () => 'Évaporation, condensation, précipitation, ruissellement.',
        },
        {
            question: () => 'Explique le rôle des glucides dans l’alimentation.', 
            answer: () => 'Fournir de l’énergie à l’organisme.',
        },
        {
            question: () => 'Donne un exemple d’écosystème.', 
            answer: () => 'Une forêt, un étang, une prairie.',
        },
        {
            question: () => 'Explique la photosynthèse en une phrase.', 
            answer: () => 'Les plantes transforment l’eau et le CO2 en glucose et oxygène grâce à la lumière.',
        },
        {
            question: () => 'Différence entre animal et végétal.', 
            answer: () => 'Les végétaux produisent leur nourriture par photosynthèse.',
        },
        {
            question: () => 'Définis l’évolution biologique.', 
            answer: () => 'Changements progressifs des espèces au fil du temps.',
        },
    ]);
}

function generateSVTExercises(grade) {
    return generateExercises([
        {
            question: () => 'Explique les plaques tectoniques.', 
            answer: () => 'Mouvements de grandes plaques de la croûte terrestre.',
        },
        {
            question: () => 'Décris le rôle des fossiles.', 
            answer: () => 'Indices du passé et de l’évolution des espèces.',
        },
        {
            question: () => 'Donne un exemple de chaîne alimentaire.', 
            answer: () => 'Plante → herbivore → carnivore.',
        },
        {
            question: () => 'Explique la photosynthèse chez les plantes.', 
            answer: () => 'C’est la production de matière organique par la lumière.',
        },
        {
            question: () => 'Définis la biodiversité.', 
            answer: () => 'La variété des espèces dans un milieu.',
        },
        {
            question: () => 'Quels sont les organes du système digestif ?', 
            answer: () => 'Estomac, intestin, foie, pancréas.',
        },
    ]);
}

function generateTechnologieExercises(grade) {
    return generateExercises([
        {
            question: () => 'Explique ce qu’est un programme informatique.', 
            answer: () => 'Un ensemble d’instructions pour un ordinateur.',
        },
        {
            question: () => 'Décris le rôle d’un capteur.', 
            answer: () => 'Mesurer une grandeur physique et envoyer une information.',
        },
        {
            question: () => 'Donne un exemple d’énergie renouvelable.', 
            answer: () => 'Solaire, éolienne, hydraulique.',
        },
        {
            question: () => 'Qu’est-ce qu’un circuit électronique simple ?', 
            answer: () => 'Une source, un conducteur et une charge.',
        },
        {
            question: () => 'Explique la notion de CAO.', 
            answer: () => 'Conception Assistée par Ordinateur pour dessiner des objets.',
        },
        {
            question: () => 'Donne une étape du design d’un produit.', 
            answer: () => 'Analyse du besoin ou prototype.',
        },
    ]);
}

// Animation de fondu
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Ajoute un message de bienvenue dans la console
console.log('%cBienvenue sur le Site d\'Exercices !', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('Sélectionne une matière pour commencer à réviser.');

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('users') || '{}');
    } catch (error) {
        console.warn('Impossible de lire les utilisateurs depuis localStorage.', error);
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function login(username, password) {
    return new Promise((resolve) => {
        if (!username || !password) {
            return resolve(false);
        }

        const users = getUsers();
        const normalized = username.trim().toLowerCase();

        if (normalized === 'invite' || normalized === 'guest') {
            localStorage.setItem('loggedUser', 'Invité');
            return resolve(true);
        }

        if (!users[normalized]) {
            return resolve(false);
        }

        if (users[normalized].password === password) {
            localStorage.setItem('loggedUser', users[normalized].displayName || username);
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

function register(username, password, confirmPassword) {
    const normalized = username.trim().toLowerCase();
    const users = getUsers();

    if (!username || !password || !confirmPassword) {
        return { success: false, error: 'Tous les champs sont requis.' };
    }

    if (normalized in users) {
        return { success: false, error: 'Ce nom d\'utilisateur est déjà utilisé.' };
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
        return { success: false, error: usernameError };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return { success: false, error: passwordError };
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas.' };
    }

    users[normalized] = {
        displayName: username.trim(),
        password,
        createdAt: new Date().toISOString(),
    };
    saveUsers(users);
    localStorage.setItem('loggedUser', username.trim());

    return { success: true };
}

function loginGuest() {
    localStorage.setItem('loggedUser', 'Invité');
}

function showToast(message, duration = 3200) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

function validateUsername(username) {
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
        return 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères.';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return 'Utilise uniquement des lettres, chiffres et underscores.';
    }

    return '';
}

function validatePassword(password) {
    if (password.length < 6) {
        return 'Le mot de passe doit contenir au moins 6 caractères.';
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une lettre et un chiffre.';
    }

    return '';
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
}
