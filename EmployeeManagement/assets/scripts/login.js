$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        let username = $("#username").val().trim();
        let password = $("#password").val().trim();

        $(".is-invalid").removeClass("is-invalid");
        $(".text-danger").text("");

        if (username.length < 3) {
            $("#username").addClass("is-invalid");
            $("#usernameError").text("Username must be at least 3 characters.").addClass("text-danger");
            return;
        } else {
            $("#username").addClass("is-valid");
        }
        if (password.length < 6) {
            $("#password").addClass("is-invalid");
            $("#passwordError").text("Password must be at least 6 characters.").addClass("text-danger");
            return;
        } else {
            $("#password").addClass("is-valid");
        }
        $("#loginBtn").prop("disabled", true).text("Logging in...");

        $.ajax({
            method: "POST",
            url: "/API/login.php",
            data: { username: username, password: password },
            dataType: "json",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }).done(function (response) {
            console.log("Success Response:", response);

            if (response.status === true) {
                let user = response.data;
                localStorage.setItem("token", user.token);
                localStorage.setItem("username", user.username);
                localStorage.setItem("role", user.role);  
                Swal.fire({
                    title: "Login Successful!",
                    text: "Welcome, " + user.username + "!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    let dashboardUrl = (user.role === "admin") ? "/admin_dashboard.html" : "/employee_dashboard.html";
                    window.location.href = dashboardUrl;
                });
            } else {
                $("#serverError").text(response.message).addClass("text-danger").show();
                Swal.fire("Login Failed!", response.message, "error");
            }
        }).fail(function (xhr) {
            let errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Something went wrong!";
            $("#serverError").text(errorMessage).addClass("text-danger").show();
            Swal.fire("Oops!", errorMessage, "error");
        }).always(function () {
            $("#loginBtn").prop("disabled", false).text("Login"); 
        });
    });

    // Clear errors when user starts typing
    $(".form-control").on("input", function () {
        $(this).removeClass("is-invalid is-valid");
        $("#" + $(this).attr("id") + "Error").text("");
    });
});
