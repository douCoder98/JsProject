// app.js

// Initialisation des données
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}
if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(null));
}

// Chargement initial
document.addEventListener("DOMContentLoaded", () => {
    displayRegisterForm();
});

// Affichage du formulaire d'inscription
function displayRegisterForm() {
    document.getElementById("form-container").innerHTML = `
        <h5>Création d'un compte</h5>
        <div class="mb-3">
            <input type="text" class="form-control" id="name" placeholder="Nom complet">
        </div>
        <div class="mb-3">
            <input type="email" class="form-control" id="email" placeholder="Email">
        </div>
        <div class="mb-3">
            <input type="password" class="form-control" id="password" placeholder="Mot de passe (8 caractères minimum)">
        </div>
        <button class="btn btn-primary" onclick="register()">S'inscrire</button>
        <p class="text-center mt-3">J'ai déjà un compte ? <a href="#" onclick="displayLoginForm()">Connexion</a></p>
    `;
}

// Affichage du formulaire de connexion
function displayLoginForm() {
    document.getElementById("form-container").innerHTML = `
        <h5>Connexion</h5>
        <div class="mb-3">
            <input type="email" class="form-control" id="loginEmail" placeholder="Email">
        </div>
        <div class="mb-3">
            <input type="password" class="form-control" id="loginPassword" placeholder="Mot de passe">
        </div>
        <button class="btn btn-primary" onclick="login()">Se connecter</button>
        <p class="text-center mt-3">Je n'ai pas de compte ? <a href="#" onclick="displayRegisterForm()">S'inscrire</a></p>
    `;
}

// Inscription
function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (name && email && password.length >= 8) {
        const users = JSON.parse(localStorage.getItem("users"));
        users.push({ name, email, password, accounts: [] });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Compte créé avec succès !");
        displayLoginForm();
    } else {
        alert("Veuillez remplir tous les champs et vérifier le mot de passe.");
    }
}

// Connexion
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const users = JSON.parse(localStorage.getItem("users"));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Connexion réussie !");
        displayDashboard();
    } else {
        alert("Email ou mot de passe incorrect.");
    }
}

// Affichage du tableau de bord de l'utilisateur
function displayDashboard() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return displayLoginForm();

    document.getElementById("form-container").innerHTML = `
        <h4>Bienvenue, ${currentUser.name}</h4>
        <p>Solde Total : ${getTotalBalance(currentUser)} €</p>
        <button class="btn btn-primary mb-3" onclick="displayAddAccountForm()">Ajouter un Compte</button>
        <button class="btn btn-secondary mb-3" onclick="logout()">Se Déconnecter</button>
        <div id="accounts"></div>
    `;
    renderAccounts(currentUser.accounts);
}

// Affichage du formulaire d'ajout de compte
function displayAddAccountForm() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const accountName = prompt("Nom du compte :");
    const accountType = prompt("Type du compte (épargne, courant...) :");

    if (accountName && accountType) {
        currentUser.accounts.push({ name: accountName, type: accountType, balance: 0, transactions: [] });
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        localStorage.setItem("users", JSON.stringify(updateUser(currentUser)));
        displayDashboard();
    }
}

// Rendu des comptes dans le tableau de bord
function renderAccounts(accounts) {
    const accountsDiv = document.getElementById("accounts");
    accountsDiv.innerHTML = accounts.map(acc => `
        <div class="alert alert-info">
            <strong>${acc.name} (${acc.type})</strong> - Solde : ${acc.balance} €
        </div>
    `).join('');
}

// Calcul du solde total de l'utilisateur
function getTotalBalance(user) {
    return user.accounts.reduce((total, acc) => total + acc.balance, 0);
}

// Mise à jour de l'utilisateur actuel
function updateUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem("users")).map(user =>
        user.email === updatedUser.email ? updatedUser : user
    );
    return users;
}

// Déconnexion de l'utilisateur
function logout() {
    localStorage.setItem("currentUser", JSON.stringify(null));
    displayLoginForm();
}
