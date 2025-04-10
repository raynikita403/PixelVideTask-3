$(document).ready(function () {
    let currentEmployeeId = null;
    $(document).on("click", ".edit-btn", function () {
        console.log("update- js file loaded");
        currentEmployeeId = $(this).data("id");  
        console.log("employee id", currentEmployeeId);

        if (!currentEmployeeId) {
            alert("Invalid Employee ID");
            return;
        }

        $.ajax({
            url: `/API/employee_details_id.php?id=${currentEmployeeId}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.status === true) {
                    $("#id").text(data.employee.id);
                    $("#updatefirstname").val(data.employee.firstname);
                    $("#updatelastname").val(data.employee.lastname);
                    $("#updatesurname").val(data.employee.surname || "");
                    $("#updatedoj").val(data.employee.doj);
                    $("#updatedob").val(data.employee.dob);
                    $("#updategender").val(data.employee.gender);
                    $("#updatephone").val(data.employee.phone);
                    $("#updateworking_status_id").val(data.employee.working_status_id);
                    $("#updatedesignation_id").val(data.employee.designation_id);
                    $("#updatelocation_id").val(data.employee.location_id);
                    $("#updategross").val(data.employee.gross);
                } else {
                    alert(data.message);
                }
            },
            error: function (xhr) {
                console.error("Error fetching employee details:", xhr.responseText);
            }
        });
    });

    $(document).on("submit", "#updateEmployeeForm", function (event) {
        event.preventDefault();
        
        const postData = {
            employeeId: currentEmployeeId,
            firstname: $("#updatefirstname").val(),
            lastname: $("#updatelastname").val(),
            surname: $("#updatesurname").val(),
            doj: $("#updatedoj").val(),
            dob: $("#updatedob").val(),
            gender: $("#updategender").val(),
            phone: $("#updatephone").val(),
            working_status_id: $("#updateworking_status_id").val(),
            designation_id: $("#updatedesignation_id").val(),
            location_id: $("#updatelocation_id").val(),
            gross: $("#updategross").val()
        };
    
        $.ajax({
            url: '/API/update_employee.php',
            type: 'POST',
            data: JSON.stringify(postData),
            dataType: 'json',
            success: function (response) {
                if (response.status === true) {
                    console.log("Update response", response);
                    console.log("Update response", response.status);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User updated successfully!',
                    });
                    $('#updateEmployeeModal').modal('hide');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error: ' + response.message,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'An error occurred while updating the employee details.',
                });
            }
        });
    
       
        window.location.reload();
    });
    
});
