$("#registerButton").on("click", function () {
  $("#registerForm").validate({
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
    },
    messages: {
      name: {
        required: "Veuillez entrer votre nom complet.",
      },
      email: {
        required: "Veuillez entrer votre adresse email.",
        email: "Veuillez entrer une adresse email valide.",
      },
      password: {
        required: "Veuillez entrer votre mot de passe.",
        minlength: "Le mot de passe doit avoir au moins 8 caractères.",
      },
    },
  });
});
