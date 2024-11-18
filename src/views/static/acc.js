let currentAccountId;
let currentUserId = localStorage.getItem("userId");
function getAccountId(id) {
    currentAccountId = id;
}
let warning = localStorage.getItem("warning");
if (warning) {
    $('#warning-message').text(warning);
    $('#warning-message').append("ce message disparaitra dans 10 secondes.");
    $('#warningModal').removeClass('d-none');

    setTimeout(function () {
        $('#warningModal').addClass('d-none');
        localStorage.removeItem("warning");
    }, 10000);
}


$(document).ready(function () {
    $("#connection-history-link").attr("href", "/get_connection_history/" + currentUserId);
    $("#profil-name").text(localStorage.getItem("userName"));
    $("#current-user-name").text(localStorage.getItem("userName"));

    //creation de compte
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
            $('#solde-error').text("Veuillez entrer un solde positif.");
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
        if ($('#account-amount').val()< $('#account-threshold').val()) {
            $('#threshold-error').text("Le seuil de criticité doit être inférieur au solde du compte.");
            isValid = false;
        }

        if (!isValid) {
            $('#form-message').text("Veuillez corriger les erreurs dans le formulaire.").addClass("text-danger");
            return;
        }

        // Envoi de la requête avec AJAX
        $.ajax({
            url: 'http://127.0.0.1:5000/account/create/',
            type: 'POST',
            data: JSON.stringify({
                label: accountLabel,
                amount: accountAmount,
                type: accountType,
                threshold: accountThreshold,
                user_id: localStorage.getItem('userId')
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                // Rafraîchir la page
                $('#createCompte').modal('hide');
                $('#success-message').text("Le compte a été créé avec succès !").removeClass('d-none');
                setTimeout(function () {
                    $('#success-message').addClass('d-none');
                    // Rafraîchir la page
                    location.reload();
                }, 3000);
            },
            error: function (xhr, status, error) {
                alert("Une erreur est survenue lors de l'ajout du compte : " + error);
            }
        });
    });



    // AFFIGAGE DES COMPTES
    const userId = localStorage.getItem('userId');
    function getAccounts() {
        $.ajax({
            url: `http://127.0.0.1:5000/account/${userId}/user`,
            type: 'GET',
            success: function (response) {

                let totalBalance = 0;
                if (response.data.length === 0) {
                    $('#accounts-list').append('<p>Aucun compte disponible.</p>');
                }

                // Parcourir les comptes récupérés et les afficher
                response.data.forEach(function (account) {
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
                                        <h6 class="text-muted mb-0">
                                            <span class="balance" style="color: ${account.amount < account.threshold ? 'red' : 'black'}"> Solde: ${account.amount} €</span>
                                        </h6>
                                        <!-- Display threshold value and color it red if the balance is below threshold -->
                                        <small  style="color: ${account.amount < account.threshold ? 'red' : 'black'}">
                                            Seuil: ${account.threshold} €
                                        </small>
                                    </div>
                                    <div class="btn-group">
                                        <a href="/transactions/${account.id}/" class="btn btn-outline-primary show-transactions" data-account-id="${account.id}">
                                            <i class="fas fa-history me-2"></i>Historique
                                        </a>
                                        <button onclick="getAccountId(${account.id})" id="modalTransaction" class="btn btn-success new-transaction" data-bs-toggle="modal" data-bs-target="#newTransaction" data-account-id="${account.id}">
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
    getAccounts();






    /// supression de compte

    $('#accounts-list').on('click', '#delete-account', function () {
        const idAccount = $(this).closest('.account-item').find('#idAccount').text();

        $('#suppCompte').data('accountId', idAccount);
    });

    // Gérer la confirmation de suppression
    $('#confirm-delete').click(function () {
        const idAccount = parseInt($('#suppCompte').data('accountId'));

        if (idAccount) {
            $.ajax({
                url: `/account/${idAccount}`,
                type: 'DELETE',
                success: function (response) {

                    // Rafraîchir la page
                    location.reload();
                },
                error: function (xhr, status, error) {
                    // Afficher une erreur plus détaillée
                    const errorMessage = xhr.responseJSON?.message || error;
                    console.error("Erreur lors de la suppression du compte : " + errorMessage);
                }
            });
        } else {
            alert("Erreur : ID du compte non trouvé");
        }
    });



    // ajout de TRANSACTION

    const today = new Date().toISOString().split('T')[0]; // la date actuelle 
    $('#transaction_date').attr('max', today);

    let solde = 0;

    // Fonction pour obtenir le solde du compte actuel
    function getSolde(accountId) {

        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://127.0.0.1:5000/account/${accountId}`,
                type: 'GET',
                success: function (response) {
                    solde = response.amount;
                    resolve(solde);// permet de retourner la valeur de solde
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });
    }


    $('#newTransaction').on('show.bs.modal', async function (e) {
        try {
            const accountId = $(e.relatedTarget).data('account-id');
            await getSolde(accountId);

        } catch (error) {
            console.error('Erreur lors de la récupération du solde:', error);
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
                if ($('#transaction_type').val() === 'retrait') {
                    if (parseFloat($('#transaction_amount').val()) > solde) {
                        $('#amount-error').text(`Solde insuffisant. Votre solde actuel est de ${solde}€`).show();
                        return false;
                    }
                }

                // Envoi de la transaction avec AJAX 
                $.ajax({
                    url: 'http://127.0.0.1:5000/transactions/create/',
                    type: 'POST',
                    data: JSON.stringify({
                        account_id: currentAccountId,
                        amount: parseFloat($('#transaction_amount').val()),
                        type: $('#transaction_type').val(),
                        date: $('#transaction_date').val()
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (response) {
                        // Fermer la modal
                        $('#newTransaction').modal('hide');

                        // Réinitialiser le formulaire
                        $('#transaction-form')[0].reset();
                        if (response.warning_message) {
                            $('#warning-message').text(response.warning_message);
                            $('#warning-message').append("ce message sera affiché pendant 10 secondes.");
                            const warningModal = new bootstrap.Modal(document.getElementById('warningModal'));


                            warningModal.show();

                            setTimeout(function () {
                                warningModal.hide();
                            }, 10000);
                        }
                        $('#success-message').text("Le compte a été créé avec succès !").removeClass('d-none');
                        setTimeout(function () {
                            $('#success-message').addClass('d-none');
                            // Rafraîchir la page
                            location.reload();
                        }, 3000);

                        // Événement qui se déclenche quand le modal est complètement caché
                        
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