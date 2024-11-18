$(document).ready(function () {
    $("#logout-link").click(function (e) {
        e.preventDefault();
        localStorage.clear();
        
        window.location.href = '/';
    })
   
})