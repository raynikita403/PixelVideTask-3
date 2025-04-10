$(document).ready(function () {
    console.log("Update Salary JS loaded");

    $('#updateSalaryForm').on('submit', function (e) {
        e.preventDefault();
        resetErrors();

        var employeeId = $('#id').text().trim();
        var month = $('#month').val();
        var year = $('#year').val();
        var grossSalary = parseFloat($('#gross_salary').val()) || 0;
        var deduction = parseFloat($('#deduction').val()) || 0;

        var basic = parseFloat($('#basic').val()) || 0;
        var hra = parseFloat($('#hra').val()) || 0;
        var da = parseFloat($('#da').val()) || 0;
        var pf = parseFloat($('#pf').val()) || 0;
        var bonus = parseFloat($('#bonus').val()) || 0;
        var ca = parseFloat($('#ca').val()) || 0;
        var tds = parseFloat($('#tds').val()) || 0;
        var medicalAllowance = parseFloat($('#medicalAllowance').val()) || 0;

        // Basic validation
        if (!month || !year || grossSalary <= 0) {
            displayError('Please fill out all required fields.', 'netSalaryError');
            return;
        }

        var formData = {
            employee_id: employeeId,
            month: month,
            year: year,
            gross_salary: grossSalary,
            deduction: deduction,
            basic: basic,
            hra: hra,
            da: da,
            pf: pf,
            bonus: bonus,
            ca: ca,
            tds: tds,
            medicalAllowance: medicalAllowance
        };

        console.log("Data being sent:", formData);

        $.ajax({
            url: '/API/update_salary.php',
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                console.log("Response from PHP:", response);
                if (response.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Salary updated successfully!',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        $('#addSalaryModal').modal('hide');
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Something went wrong.',
                        confirmButtonText: 'OK'
                    });
                }
            },
            
            error: function (xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Status:', status);
                console.log('Response Text:', xhr.responseText);
                displayError('Error: ' + error, 'netSalaryError');
            }
        });
    });

    function resetErrors() {
        $('.text-danger').html('');
    }

    function displayError(message, errorFieldId) {
        $('#' + errorFieldId).html(message);
    }
});
