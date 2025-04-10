$(document).on("click", ".salary-component-btn", function () {
    let employeeId = $(this).data("id");
    console.log("Clicked Employee ID:", employeeId);

    if (!employeeId || employeeId === "undefined") {
        alert("Invalid Employee ID");
        return;
    }

    $.ajax({
        url: `/API/salary_component_based_on_id.php?id=${employeeId}`,
        type: "GET",
        headers: { "Authorization": `${token}` },
        dataType: "json",
        success: function (data) {
            console.log("Employee Data:", data);

            if (data.status === true) {
                $("#basicSalary").text(data.salary_components.basic);
                $("#hraSalary").text(data.salary_components.hra);
                $("#caSalary").text(data.salary_components.ca);
                $("#medicalAllowance").text(data.salary_components.medicalAllowance);
                $("#bonusSalary").text(data.salary_components.bonus);
                $("#tdsSalary").text(data.salary_components.tds);
            } else {
                alert(data.message);
            }
        },
        error: function (xhr) {
            console.error("Error fetching employee details:", xhr.responseText);
        }
    });
});