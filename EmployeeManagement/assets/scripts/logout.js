$(document).ready(function () {
    $("#logoutBtn").click(function () {
        let token = localStorage.getItem("token");

        if (!token) {
            Swal.fire( "You are not logged in!", "error");
            return;
        }

        $.ajax({
            method: "POST",
            url: "/API/logout.php",
            data: { token: token },
            dataType: "json",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }).done(function (response) {
            console.log("Logout Response:", response);

            if (response.status === true) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");

                Swal.fire({
                    title: "Logged Out!",
                    text: "You have been successfully logged out.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "/login.html"; 
                });
            } else {
                Swal.fire("Logout Failed!", response.message, "error");
            }
        }).fail(function (xhr) {
            let errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Something went wrong!";
            Swal.fire("Oops!", errorMessage, "error");
        });
    });
});
