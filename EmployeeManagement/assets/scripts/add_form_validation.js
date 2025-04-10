
function validateEmployeeForm() {
    let isValid = true;
    if (!$("#firstname").val().trim()) {
        $("#firstnameError").text("First Name is required.").addClass('text-danger');
        isValid = false;
    } else {
        $("#firstnameError").text("").removeClass('text-danger');
    }
    if (!$("#lastname").val().trim()) {
        $("#lastnameError").text("Last Name is required.").addClass('text-danger');
        isValid = false;
    } else {
        $("#lastnameError").text("").removeClass('text-danger');
    }
    if (!$("#doj").val()) {
        $("#dojError").text("Date of Joining is required.").addClass('text-danger');
        isValid = false;
    } else {
        $("#dojError").text("").removeClass('text-danger');
    }
    let dob = $("#dob").val();
    if (!dob) {
        $("#dobError").text("Date of Birth is required.").addClass('text-danger');
        isValid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (age < 18 || (age === 18 && m < 0)) {
            $("#dobError").text("You must be at least 18 years old.").addClass('text-danger');
            isValid = false;
        } else {
            $("#dobError").text("").removeClass('text-danger');
        }
    }
    if (!$("#gender").val()) {
        $("#genderError").text("Gender is required.").addClass('text-danger');
        isValid = false;
    } else {
        $("#genderError").text("").removeClass('text-danger');
    }
    if (!$("#phone").val().trim()) {
        $("#phoneError").text("Phone Number is required.").addClass('text-danger');
        isValid = false;
    } else {
        $("#phoneError").text("").removeClass('text-danger');
    }
    if (!$("#working_status_id").val()) {
        alert("Working Status is required.");
        isValid = false;
    }
    if (!$("#designation_id").val()) {
        alert("Designation is required.");
        isValid = false;
    }
    if (!$("#location_id").val()) {
        alert("Location is required.");
        isValid = false;
    }
    let grossSalary = $("#gross").val().trim();
    if (!grossSalary || grossSalary <= 0) {
        $("#grossError").text("Gross Salary must be a positive number.").addClass('text-danger');
        isValid = false;
    } else {
        $("#grossError").text("").removeClass('text-danger');
    }

    return isValid;
}
