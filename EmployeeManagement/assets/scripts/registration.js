$(document).ready(function () {
    $("#registrationForm").submit(function (event) {
        event.preventDefault();

        let fullname = $("#fullname").val().trim();
        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
       

        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (fullname.length < 3) {
            $("#fullname").addClass("is-invalid");
            $("#fullnameError").text("Name must be at least 3 characters.").addClass("text-danger");
            return;
        } else {
            $("#fullname").removeClass("is-invalid").addClass("is-valid");
            $("#fullnameError").text("");
        }
        if (!emailPattern.test(email)) {
            $("#email").addClass("is-invalid");
            $("#emailError").text("Enter a valid email address.").addClass("text-danger");
            return;
        } else {
            $("#email").removeClass("is-invalid").addClass("is-valid");
            $("#emailError").text("");
        }
        if (password.length < 6) {
            $("#password").addClass("is-invalid");
            $("#passwordError").text("Password must be at least 6 characters long.").addClass("text-danger");
            return;
        } else {
            $("#password").removeClass("is-invalid").addClass("is-valid");
            $("#passwordError").text("");
        }
        

        $.ajax({
            type: "POST",
            url: "/API/registration.php",
            data: { full_name: fullname, email: email, password: password},
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (response) {
                console.log("Server Response:", response);
                if (response && response.status === true) {
                    Swal.fire({
                        title: "Registration Successful!",
                        text: "Welcome, " + fullname + "!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "login.html";
                    });
                } else {
                    $("#serverError").text(response.message || "Something went wrong!").addClass("text-danger").show();
                }
            },
            error: function (xhr) {
                try {
                    let response = JSON.parse(xhr.responseText);
                    $("#serverError").text(response.message || "An error occurred. Please try again.").addClass("text-danger").show();
                } catch (e) {
                    $("#serverError").text("An unexpected error occurred.").addClass("text-danger").show();
                }
            },
            complete: function () {
                $("#signupBtn").prop("disabled", false).text("Sign Up");
            }
        });
    });

    // Clear errors when user starts typing
    $(".form-control").on("input", function () {
        $(this).removeClass("is-invalid");
        $("#" + $(this).attr("id") + "Error").text("");
    });
});
