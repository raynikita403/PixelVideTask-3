$(document).ready(function () {
    console.log("add_employee.js loaded");
    $(document).on("click", "#addEmployeeBtn", function () {
        $("#addEmployeeForm")[0].reset();
        $("#employeeId").val("");
        $("#addEmployeeForm input, #addEmployeeForm select").prop("disabled", false);
        $("#addEmployeeModalLabel").text("Add Employee");
        $("#submitEmployeeBtn").text("Add Employee").show();
        $("#addEmployeeModal").modal("show");
    });
    $("#addEmployeeForm").submit(function (event) {
        event.preventDefault();
        let employeeId = $("#employeeId").val();
        let firstname = $("#firstname").val().trim();
        let lastname = $("#lastname").val().trim();
        let surname = $("#surname").val().trim();
        let email = $("#email").val().trim();
        let doj = $("#doj").val();
        let dob = $("#dob").val();
        let gender = $("#gender").val();
        let phone = $("#phone").val().trim();
        let working_status_id = $("#working_status_id").val();
        let designation_id = $("#designation_id").val();
        let location_id = $("#location_id").val();
        let gross = $("#gross").val().trim();

        $(".is-invalid").removeClass("is-invalid");
        $(".text-danger").text("");
        let isValid = true;


        if (firstname.length < 3 || /[^a-zA-Z ]/.test(firstname)) {
            $("#firstname").addClass("is-invalid");
            $("#firstnameError").text("First name must be at least 3 characters and contain no special characters.").addClass("text-danger");
            isValid = false;      
        }else {
            $("#firstname").addClass("is-valid").removeClass("is-invalid");
            $("#firstnameError").text("").removeClass("text-danger");
        }
        

        if (lastname.length < 3 || /[^a-zA-Z ]/.test(lastname)) {
            $("#lastname").addClass("is-invalid");
            $("#lastnameError").text("Last name must be at least 3 characters and contain no special characters.").addClass("text-danger");
            isValid = false;
        }else {
            $("#lastname").addClass("is-valid").removeClass("is-invalid");
            $("#lastnameError").text("").removeClass("text-danger");
        }

        if (surname.length < 3 || /[^a-zA-Z ]/.test(surname)) {
            $("#surname").addClass("is-invalid");
            $("#surnameError").text("Last name must be at least 3 characters and contain no special characters.").addClass("text-danger");
            isValid = false;
        }else {
            $("#surname").addClass("is-valid").removeClass("is-invalid");
            $("#surnameError").text("").removeClass("text-danger");
        }

        let dobDate = new Date(dob);
        let age = new Date().getFullYear() - dobDate.getFullYear();
        if (age < 18) {
            $("#dob").addClass("is-invalid");
            $("#dobError").text("You must be at least 18 years old.").addClass("text-danger");
            isValid = false;
        }else {
            $("#dob").addClass("is-valid").removeClass("is-invalid");
            $("#dobError").text("").removeClass("text-danger");
        }

        if (!/^\d{10}$/.test(phone)) {
            $("#phone").addClass("is-invalid");
            $("#phoneError").text("Please enter a valid 10-digit phone number.").addClass("text-danger");
            isValid = false;
        }else {
            $("#phone").addClass("is-valid").removeClass("is-invalid");
            $("#phoneError").text("").removeClass("text-danger");
        }

        if (isNaN(gross) || gross <= 0) {
            $("#gross").addClass("is-invalid");
            $("#grossError").text("Please enter a valid salary amount.").addClass("text-danger");
            isValid = false;
        }
        else {
            $("#gross").addClass("is-valid").removeClass("is-invalid");
            $("#grossError").text("").removeClass("text-danger");
        }
        if (!isValid) {
            return;
        }

        let actionUrl = "/API/add_employees.php";
       

        $.ajax({
            type: "POST",
            url: actionUrl,
            data: JSON.stringify({
                employeeId: employeeId,
                firstname: firstname,
                lastname: lastname,
                surname: surname,
                email:email,
                doj: doj,
                dob: dob,
                gender: gender,
                phone: phone,
                working_status_id: working_status_id,
                designation_id: designation_id,
                location_id: location_id,
                gross: gross
            }),
            contentType: "application/json", 
            success: function (response) {
                if (typeof response === "string") {
                    console.log(response)
                    response = JSON.parse(response);
                }
                if (response.status === true) {
                    Swal.fire({
                        title: "Successful!",
                        text: response.message,
                        icon: "success",
                        showConfirmButton: true,
                        confirmButtonColor: "#28a745"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                    $("#addEmployeeModal").modal("hide");
                } else {
                    Swal.fire(response.message, "error");

                }
            },
            error: function (xhr) {
                try {
                    let response = JSON.parse(xhr.responseText);
                    console.log("AJAX Error:", xhr);
                    console.log("Response Text:", xhr.responseText);
                    alert(response.message || "An error occurred. Please try again.");
                } catch (e) {
                    alert("An unknown error occurred.");
                }
            },
            complete: function () {
                $("#submitEmployeeBtn").prop("disabled", false).text(actionType);
            }
        });
        window.location.reload();
    });
});
