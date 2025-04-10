$(document).ready(function () {
    $(document).on("click", ".delete-btn", function () {
        console.log("Delete button clicked!");
        let employeeId = $(this).data("id");
        console.log("Employee ID:", employeeId);
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (!result.isConfirmed) {
                console.log("Deletion cancelled!");
                return;
            }
            console.log("Sending AJAX request...");
            $.ajax({
                type: "POST",
                url: "/API/delete_employee.php",
                data: { id: employeeId },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (response) {
                    console.log("Server Response:", response); 

                    if (typeof response === "string") {
                        response = JSON.parse(response);
                    }
                    if (response && response.success) {
                       
                        alert("employee deleted");
                        Swal.fire("Deleted!", response.message || "Employee deleted successfully!", "success");
                    } else {
                        alert(response.message || "Something went wrong!");
                    }
                },
                error: function (xhr) {
                    try {
                        let response = JSON.parse(xhr.responseText);
                        alert(response.message || "An error occurred. Please try again.");
                    } catch (e) {
                        alert("An unknown error occurred.");
                    }
                }

            });
            window.location.reload();
        });
    })
});
