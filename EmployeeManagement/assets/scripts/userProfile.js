
$(document).ready(function () {
    console.log("user profile loaded");
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");
    let role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "login.html";
        return;
    }
    $("#adminName").text(username);
    $("#profileIcon").click(function () {
        $("#fullName").text(username);
        $("#adminRole").text(role.charAt(0).toUpperCase() + role.slice(1));
    });

  
    $("#logoutBtn").click(function () {
        localStorage.removeItem("token"); 
        window.location.href = "login.html"; 
    });
});
