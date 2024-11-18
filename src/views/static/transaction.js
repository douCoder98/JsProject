$(document).ready(function () {
    
    let allTransactions = [];

    // Fonction pour charger les transactions
    function loadTransactions() {
        $.ajax({
            url:  `http://127.0.0.1:5000/transactions/account/${accountId}/ `,
            method: 'GET',
            success: function (result) {
                if (result && result.data) {
                    allTransactions = result.data;
                    $('#transactionsName').append(result.account.label + " (" + result.account.type + ")");
                    filterTransactions();
                }
            }
        });
    }

    // Fonction pour filtrer les transactions
    function filterTransactions() {
        const typeFilter = $('#filterTransactions').val();
        const periodFilter = $('#filterPeriod').val();


        let filteredTransactions = allTransactions;

        // Filtre par type
        if (typeFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.type.toLowerCase() === typeFilter);
        }

        // Filtre par période
        if (periodFilter) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - parseInt(periodFilter));

            filteredTransactions = filteredTransactions.filter(t => {
                const transactionDate = new Date(t.created_at);
                return transactionDate >= daysAgo;
            });
        }

        // Mise à jour de l'affichage
        $('#transactionsTableBody').empty();
        if (allTransactions.length == 0) {
            $('#noTransactionsMessage').append("Aucune transaction disponible.");
            $('#noTransactionsMessage').removeClass('d-none');

        } else if (filteredTransactions.length === 0) {
            $('#noTransactionsMessage').append("Aucune transaction ne correspond aux critères sélectionnés.")
            $('#noTransactionsMessage').removeClass('d-none');
        } else {
            $('#noTransactionsMessage').addClass('d-none');

            filteredTransactions.forEach(function (transaction) {
                const row = `
                    <tr>
                        <td>${transaction.reference}</td>
                        <td>${transaction.account}</td>
                        <td>${transaction.type}</td>
                        <td>${transaction.amount}</td>
                        <td>${transaction.balance}</td>
                        <td>${transaction.created_at}</td>
                    </tr>
                `;
                $('#transactionsTableBody').append(row);
            });
        }
    }

    // Fonction pour télécharger le CSV
    function downloadCSV() {
        const typeFilter = $('#filterTransactions').val();
        const periodFilter = $('#filterPeriod').val();

        let filteredTransactions = allTransactions;

        // Appliquer les mêmes filtres que pour l'affichage
        if (typeFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.type.toLowerCase() === typeFilter);
        }
        if (periodFilter) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - parseInt(periodFilter));
            alert(daysAgo);
            filteredTransactions = filteredTransactions.filter(t => new Date(t.created_at) >= daysAgo);
        }

        // Création du contenu CSV
        const headers = ['Référence', 'Compte', 'Type', 'Montant', 'Solde', 'Date'];
        let csvContent = headers.join(',') + '\n';

        filteredTransactions.forEach(function (transaction) {
            const row = [
                transaction.reference,
                transaction.account,
                transaction.type,
                transaction.amount,
                transaction.balance,
                transaction.created_at
            ].join(',');
            csvContent += row + '\n';
        });

        // Création et téléchargement du fichier
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);


    }
    // Event listeners
    $('#filterTransactions, #filterPeriod').on('change', filterTransactions);
    $('#downloadCSV').on('click', downloadCSV);

    // Chargement initial
    loadTransactions();
});