//Register Form
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
    submitHandler: function () {
      var csrftoken = $("meta[name=csrf-token]").attr("content");

      $.ajaxSetup({
        beforeSend: function (xhr, settings) {
          if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        },
      });

      $.ajax({
        url: "/users/create",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          name: $("#name").val(),
          email: $("#email").val(),
          password: $("#password").val(),
        }),
        success: function (response) {
          console.log(response);
          if (response.status == 200) {
            window.location.replace("/index.html");
          }
        },
        error: function (response) {
          console.log(response);
        },
      });
    },
  });
});

//Login Form
$("#loginButton").on("click", function () {
  $("#loginForm").validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      email: {
        required: "Veuillez entrer votre adresse email.",
        email: "Veuillez entrer une adresse email valide.",
      },
      password: {
        required: "Veuillez entrer votre mot de passe.",
      },
    },
    submitHandler: function () {
      var csrftoken = $("meta[name=csrf-token]").attr("content");

      $.ajaxSetup({
        beforeSend: function (xhr, settings) {
          if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
        },
      });

      $.ajax({
        url: "/login",
        type: "POST",
        dataType: "json",
        data: {
          email: $("#email").val(),
          password: $("#password").val(),
        },
        success: function (response) {
          if (response == true) {
            window.location.replace("/accueil");
          }
        },
        error: function (response) {
          console.log(response);
        },
      });
    },
  });
});
