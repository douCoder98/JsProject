let currentUser = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    accounts: [
        {
            name: "Compte courant", type: "Courant", balance: 1200, transactions: [
                { type: "dépôt", amount: 500, date: "2024-11-01" },
                { type: "retrait", amount: 200, date: "2024-11-02" }
            ]
        },
        {
            name: "Compte épargne", type: "Épargne", balance: 5000, transactions: [
                { type: "dépôt", amount: 1000, date: "2024-11-01" }
            ]
        }
    ],
    totalBalance: 6200
};

// Affichage des comptes bancaires de l'utilisateur
function displayAccounts() {
    const accountsList = document.getElementById('accounts-list');
    accountsList.innerHTML = currentUser.accounts.map((account, index) => `
        <div class="account-item">
            <h5>${account.name} (${account.type}) - Solde: ${account.balance} €</h5>
            <button class="btn btn-info" onclick="viewTransactions(${index})">Voir Transactions</button>
            <button class="btn btn-danger" onclick="confirmDeleteAccount(${index})">Supprimer</button>
        </div>
    `).join('');
}

// Mise à jour du solde total
function displayTotalBalance() {
    const totalBalance = document.getElementById('total-balance');
    totalBalance.textContent = currentUser.totalBalance;
}

// Affichage des transactions d'un compte
function viewTransactions(accountIndex) {
    const account = currentUser.accounts[accountIndex];
    const transactionHistory = document.getElementById('transaction-history');
    transactionHistory.innerHTML = `<h4>Transactions de ${account.name}</h4>`;
    
    if (account.transactions.length === 0) {
        transactionHistory.innerHTML += `<p>Aucune transaction enregistrée.</p>`;
    } else {
        account.transactions.forEach(transaction => {
            transactionHistory.innerHTML += `
                <div class="transaction-item ${transaction.type}">
                    <p>Type: ${transaction.type}</p>
                    <p>Montant: ${transaction.amount} €</p>
                    <p>Date: ${transaction.date}</p>
                </div>
            `;
        });
    }
}

// Ajouter une transaction
function showAddTransactionForm() {
    document.getElementById('add-transaction-form').style.display = 'block';
}

function cancelAddTransaction() {
    document.getElementById('add-transaction-form').style.display = 'none';
}

function addTransaction(event) {
    event.preventDefault();
    
    const transactionType = document.getElementById('transaction-type').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionDate = document.getElementById('transaction-date').value;
    const accountIndex = 0; // Ajouter la logique pour sélectionner le compte spécifique

    const account = currentUser.accounts[accountIndex];
    const transaction = {
        type: transactionType,
        amount: transactionAmount,
        date: transactionDate
    };
    
    // Ajouter la transaction au compte sélectionné
    account.transactions.push(transaction);
    account.balance += (transactionType === 'dépôt') ? transactionAmount : -transactionAmount;
    currentUser.totalBalance += (transactionType === 'dépôt') ? transactionAmount : -transactionAmount;

    // Mise à jour de l'affichage
    displayAccounts();
    viewTransactions(accountIndex);
    displayTotalBalance();

    cancelAddTransaction();
}

// Ajouter un compte bancaire
function showAddAccountForm() {
    document.getElementById('add-account-form').style.display = 'block';
}

function cancelAddAccount() {
    document.getElementById('add-account-form').style.display = 'none';
}

function addAccount(event) {
    event.preventDefault();
    
    const accountName = document.getElementById('account-name').value;
    const accountType = document.getElementById('account-type').value;
    const newAccount = {
        name: accountName,
        type: accountType,
        balance: 0,
        transactions: []
    };

    currentUser.accounts.push(newAccount);
    currentUser.totalBalance += 0;

    displayAccounts();
    displayTotalBalance();
    cancelAddAccount();
}

// Confirmer la suppression d'un compte
function confirmDeleteAccount(accountIndex) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce compte ? Toutes les transactions seront également supprimées.");
    if (confirmation) {
        deleteAccount(accountIndex);
    }
}

function deleteAccount(accountIndex) {
    const account = currentUser.accounts[accountIndex];
    currentUser.totalBalance -= account.balance;

    currentUser.accounts.splice(accountIndex, 1);
    displayAccounts();
    displayTotalBalance();
}

// Modifier les informations de profil utilisateur
function showUserProfile() {
    document.getElementById('user-profile-form').style.display = 'block';
    document.getElementById('user-name').value = currentUser.name;
    document.getElementById('user-email').value = currentUser.email;
}

function cancelUserProfile() {
    document.getElementById('user-profile-form').style.display = 'none';
}

function updateUserProfile(event) {
    event.preventDefault();
    
    const updatedName = document.getElementById('user-name').value;
    const updatedEmail = document.getElementById('user-email').value;

    currentUser.name = updatedName;
    currentUser.email = updatedEmail;

    document.getElementById('profile-confirmation').style.display = 'block';
    setTimeout(() => {
        document.getElementById('profile-confirmation').style.display = 'none';
    }, 3000);

    cancelUserProfile();
}

// Déconnexion
function logout() {
    alert('Vous êtes maintenant déconnecté.');
}

// Définir le seuil de solde bas
function setLowBalanceThreshold(index, value) {
    currentUser.accounts[index].lowBalanceThreshold = parseFloat(value);
}

// Vérifier si le solde est inférieur au seuil après une transaction
function checkLowBalanceNotifications() {
    const notificationDiv = document.getElementById("lowBalanceNotification");
    notificationDiv.innerHTML = ""; // Reset the notification content
    notificationDiv.style.display = "none"; // Hide notification by default

    currentUser.accounts.forEach(account => {
        if (account.balance < account.lowBalanceThreshold) {
            notificationDiv.innerHTML += `Attention: Le solde de ${account.name} est en dessous du seuil de ${account.lowBalanceThreshold} €!<br>`;
            notificationDiv.style.display = "block"; // Show notification if any account is below threshold
        }
    });
}

checkLowBalanceNotifications();
