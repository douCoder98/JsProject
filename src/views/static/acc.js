$(document).ready(function () {
    $('#submit-account').click(function () {

        $('.text-danger').text('');
        $('#form-message').text('');


        const accountLabel = $('#account-label').val().trim();
        const accountAmount = $('#account-amount').val();
        const accountType = $('#account-type').val();
        const accountThreshold = $('#account-threshold').val();

        let isValid = true;


        if (!accountLabel) {
            $('#label-error').text("Le nom du compte est requis.");
            isValid = false;
        }
        if (!accountAmount || accountAmount <= 0) {
            $('#amount-error').text("Veuillez entrer un solde positif.");
            isValid = false;
        }
        if (!accountType) {
            $('#type-error').text("Veuillez sélectionner un type de compte.");
            isValid = false;
        }
        if (!accountThreshold || accountThreshold <= 0) {
            $('#threshold-error').text("Veuillez entrer un seuil de criticité positif.");
            isValid = false;
        }


        if (!isValid) {
            $('#form-message').text("Veuillez corriger les erreurs dans le formulaire.").addClass("text-danger");
            return;
        }


        const formData = new FormData();
        formData.append('label', accountLabel);
        formData.append('amount', accountAmount);
        formData.append('type', accountType);
        formData.append('threshold', accountThreshold);
        formData.append('user_id', '1');

        // Send AJAX request using jQuery
        $.ajax({
            url: 'http://127.0.0.1:5000/account/create/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false, // Important pour FormData
            success: function (response) {
                // Fermer la modal
                $('#createCompte').modal('hide');

                // Réinitialiser le formulaire
                $('#createCompte form')[0].reset();

                // Rafraîchir la page
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Une erreur est survenue lors de l'ajout du compte : " + error);
            }
        });
    });
});


// AFFIGAGE DES COMPTES
$(document).ready(function () {
    const userId = 1; // Remplacer par l'ID réel de l'utilisateur connecté

    // Fonction pour récupérer les comptes depuis le serveur
    function getAccounts() {
        $.ajax({
            url: `http://127.0.0.1:5000/account/${userId}/user`, // Remplacez par l'URL correcte
            type: 'GET',
            success: function (response) {
                // Réinitialiser la liste des comptes
                $('#accounts-list').empty();

                let totalBalance = 0;
                if (response.data.length === 0) {
                    $('#accounts-list').append('<p>Aucun compte disponible.</p>');
                }

                // Parcourir les comptes récupérés et les afficher
                response.data.forEach(function (account) {
                    // Créer un élément pour chaque compte    
                    const accountElement = `
                        <div class="account-item card border-0 shadow-sm mb-3 hover-shadow">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 class="card-title mb-1">
                                            <i class="fas fa-piggy-bank me-2 text-primary"></i>
                                            ${account.label} (${account.type})
                                        </h5>
                                        <span id="idAccount" style="display: none;">${account.id}</span>
                                        <h6 class="text-muted mb-0">Solde: ${account.amount} €</h6>
                                    </div>
                                    <div class="btn-group">
                                        <button class="btn btn-outline-primary show-transactions" data-account-id="${account.id}">
                                            <i class="fas fa-history me-2"></i>Historique
                                        </button>
                                        <button onclick="getAccountId(${account.id})" class="btn btn-success new-transaction" data-bs-toggle="modal" data-bs-target="#newTransaction" data-account-id="${account.id}">
                                            <i class="fas fa-plus me-2"></i>Transaction
                                        </button>
                                        <button class="btn btn-outline-danger" id="delete-account" data-bs-toggle="modal" data-bs-target="#suppCompte">
                                            <i class="fas fa-trash me-2"></i>Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    // Ajouter l'élément au DOM
                    $('#accounts-list').append(accountElement);

                    // Ajouter le solde de ce compte au solde total
                    totalBalance += parseFloat(account.amount);
                });

                // Afficher le solde total
                $('#total-balance').text(totalBalance.toFixed(2));
            },
            error: function (xhr, status, error) {
                console.error("Erreur lors de la récupération des comptes :", error);
            }
        });
    }

    // Appeler la fonction pour obtenir les comptes au chargement de la page
    getAccounts();
});


/// supression de compte
$(document).ready(function () {
    // Utiliser la délégation d'événements pour gérer les boutons de suppression
    $('#accounts-list').on('click', '#delete-account', function () {
        // Trouver l'ID du compte dans le parent le plus proche
        const idAccount = $(this).closest('.account-item').find('#idAccount').text();
        console.log(idAccount);
        // Stocker l'ID dans un attribut data du modal pour le récupérer plus tard
        $('#suppCompte').data('accountId', idAccount);
    });

    // Gérer la confirmation de suppression
    $('#confirm-delete').click(function () {
        const idAccount = parseInt($('#suppCompte').data('accountId'));

        if (idAccount) {
            $.ajax({
                url: `http://127.0.0.1:5000/account/${idAccount}`,
                type: 'DELETE',
                success: function (response) {
                    // Fermer le modal
                    $('#suppCompte').modal('hide');

                    // Rafraîchir la page
                    location.reload();
                },
                error: function (xhr, status, error) {
                    // Afficher une erreur plus détaillée
                    const errorMessage = xhr.responseJSON?.message || error;
                    alert("Erreur lors de la suppression du compte : " + errorMessage);
                }
            });
        } else {
            alert("Erreur : ID du compte non trouvé");
        }
    });
});

// TRANSACTION
// TRANSACTION
let currentAccountId;

function getAccountId(id) {
    currentAccountId = id;
}

$(document).ready(function () {
    // Écouter les modifications du type de transaction
    $('#transaction_type').change(function () {
        const transactionType = $(this).val();
        const amountField = $('#transaction_amount');

        // Forcer un montant négatif si "Débit" est sélectionné
        if (transactionType === 'debit' && amountField.val() > 0) {
            amountField.val(-Math.abs(amountField.val()));
        } else if (transactionType === 'credit' && amountField.val() < 0) {
            amountField.val(Math.abs(amountField.val()));
        }
    });

    // Soumission du formulaire de transaction
    $('#btnSubmitTrans').on('click', function (e) {
        $('#transaction-form').validate({
            rules: {
                transaction_type: {
                    required: true
                },
                transaction_amount: {
                    required: true
                },
                transaction_date: {
                    required: true
                }
            },
            messages: {
                transaction_type: {
                    required: "Veuillez choisir un type de transaction."
                },
                transaction_amount: {
                    required: "Veuillez entrer un montant."
                },
                transaction_date: {
                    required: "Veuillez entrer une date."
                }
            },
            submitHandler: function () {
                const formData = new FormData();
                formData.append('account_id', currentAccountId);
                formData.append('amount', parseFloat($('#transaction_amount').val()));
                formData.append('type', $('#transaction_type').val());
               

                // Envoi de la transaction via AJAX avec FormData
                $.ajax({
                    url: 'http://127.0.0.1:5000/transactions/create/',
                    type: 'POST',
                    data: formData,
                    processData: false,  // Important pour FormData
                    contentType: false,  // Important pour FormData
                    success: function (response) {
                        // Fermer la modal
                        $('#newTransaction').modal('hide');
                        
                        // Réinitialiser le formulaire
                        $('#transaction-form')[0].reset();
                        
                        // Rafraîchir la page
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Erreur:', error);
                        console.log('Status:', status);
                        console.log('Response:', xhr.responseText);
                        alert("Une erreur est survenue lors de l'ajout de la transaction");
                    }
                });
            }
        });
    });
});