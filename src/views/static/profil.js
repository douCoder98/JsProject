// Configuration globale de jQuery AJAX
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            const csrftoken = $("meta[name=csrf-token]").attr("content");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    },
});

// Attendre que le document soit chargé
$(document).ready(function () {
    // Initialiser la validation une seule fois
    const profileForm = $('#profile-form');
    profileForm.validate({
        rules: {
            user_name: {
                required: true
            }
        },
        messages: {
            user_name: {
                required: "Veuillez entrer votre nouveau nom."
            }
        }
    });

    // Utiliser la délégation d'événements pour le bouton
    $(document).on('click', '#btnSubmitModif', function (e) {
        e.preventDefault();
        
        // Vérifier si le formulaire est valide
        if (!profileForm.valid()) {
            return;
        }

        // Récupérer l'ID utilisateur
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Erreur : ID utilisateur non trouvé");
            return;
        }

        // Faire l'appel AJAX
        $.ajax({
            url: `/users/${userId}`,
            type: "PUT",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                name: $('#user-name').val()
            }),
            success: function (response) {
                // Mettre à jour le localStorage
                localStorage.setItem('userName', response.name);
                
                // Afficher le message de confirmation
                $('#profile-confirmation')
                    .removeClass('d-none')
                    .html("<div class='alert alert-success'>Votre profil a bien été modifié.</div>");

                // Recharger la page après un délai
                setTimeout(function () {
                    location.reload();
                }, 1500);
            },
            error: function (xhr, status, error) {
                alert("Une erreur est survenue lors de la modification du profil : " + error);
            }
        });
    });

    // Réinitialiser le formulaire quand le modal se ferme
    $('#modifyProfil').on('hidden.bs.modal', function () {
        profileForm[0].reset();
        $('#profile-confirmation').addClass('d-none');
    });
});