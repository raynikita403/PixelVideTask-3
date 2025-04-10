$(document).ready(function () {
    console.log("salary JavaScript loaded");
    $.ajax({
        url: '/API/salary_report.php',
        type: 'GET',
        success: function (data) {
            console.log("This data is coming from salary report js file ", data);
            if (data) {
                // Location - Monthly Salary
                let locationSalaryHtmlMonth = `
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th>District</th>
                                    <th>Avg. Monthly Salary (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.locations_salary.forEach(function (location) {
                    let avgMonthSalary = parseFloat(location.avg_month_salary);
                    locationSalaryHtmlMonth += `
                        <tr>
                            <td>${location.district}</td>
                            <td>${isNaN(avgMonthSalary) ? 'N/A' : avgMonthSalary.toFixed(2)}</td>
                        </tr>
                    `;
                });

                locationSalaryHtmlMonth += `
                            </tbody>
                        </table>
                    </div>
                `;
                $('#locationEmployeesSalaryMonth').html(locationSalaryHtmlMonth);

                // Designation - Monthly Salary
                let designationSalaryHtmlMonth = `
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th>Designation</th>
                                    <th>Avg. Monthly Salary (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.designations_salary.forEach(function (designation) {
                    let avgMonthSalary = parseFloat(designation.avg_month_salary);
                    designationSalaryHtmlMonth += `
                        <tr>
                            <td>${designation.designation}</td>
                            <td>${isNaN(avgMonthSalary) ? 'N/A' : avgMonthSalary.toFixed(2)}</td>
                        </tr>
                    `;
                });

                designationSalaryHtmlMonth += `
                            </tbody>
                        </table>
                    </div>
                `;
                $('#designationEmployeesSalaryMonth').html(designationSalaryHtmlMonth);

                // Location - Yearly Salary
                let locationSalaryHtmlYear = `
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th>District</th>
                                    <th>Avg. Yearly Salary (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.locations_salary.forEach(function (location) {
                    let avgYearSalary = parseFloat(location.avg_year_salary);
                    locationSalaryHtmlYear += `
                        <tr>
                            <td>${location.district}</td>
                            <td>${isNaN(avgYearSalary) ? 'N/A' : avgYearSalary.toFixed(2)}</td>
                        </tr>
                    `;
                });

                locationSalaryHtmlYear += `
                            </tbody>
                        </table>
                    </div>
                `;
                $('#locationEmployeesSalaryYear').html(locationSalaryHtmlYear);

                // Designation - Yearly Salary
                let designationSalaryHtmlYear = `
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th>Designation</th>
                                    <th>Avg. Yearly Salary (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.designations_salary.forEach(function (designation) {
                    let avgYearSalary = parseFloat(designation.avg_year_salary);
                    designationSalaryHtmlYear += `
                        <tr>
                            <td>${designation.designation}</td>
                            <td>${isNaN(avgYearSalary) ? 'N/A' : avgYearSalary.toFixed(2)}</td>
                        </tr>
                    `;
                });

                designationSalaryHtmlYear += `
                            </tbody>
                        </table>
                    </div>
                `;
                $('#designationEmployeesSalaryYear').html(designationSalaryHtmlYear);

                // Calculate and display total average salaries
                let totalAvgMonthSalary = 0;
                let totalEntries = 0;

                data.locations_salary.forEach(function (location) {
                    totalAvgMonthSalary += parseFloat(location.avg_month_salary);
                    totalEntries++;
                });

                data.designations_salary.forEach(function (designation) {
                    totalAvgMonthSalary += parseFloat(designation.avg_month_salary);
                    totalEntries++;
                });

                $('#totalAvgMonthSalary').text('₹' + (totalAvgMonthSalary / totalEntries).toFixed(2));

                let totalAvgYearSalary = 0;
                totalEntries = 0;

                data.locations_salary.forEach(function (location) {
                    totalAvgYearSalary += parseFloat(location.avg_year_salary);
                    totalEntries++;
                });

                data.designations_salary.forEach(function (designation) {
                    totalAvgYearSalary += parseFloat(designation.avg_year_salary);
                    totalEntries++;
                });

                $('#totalAvgYearSalary').text('₹' + (totalAvgYearSalary / totalEntries).toFixed(2));
            } else {
                console.error("No data received from the server.");
                $('#locationEmployeesSalaryMonth').html('<p>No data available.</p>');
                $('#designationEmployeesSalaryMonth').html('<p>No data available.</p>');
                $('#locationEmployeesSalaryYear').html('<p>No data available.</p>');
                $('#designationEmployeesSalaryYear').html('<p>No data available.</p>');
            }
        },
        error: function (error) {
            console.error("Error fetching data:", error);
            $('#locationEmployeesSalaryMonth').html('<p>Error fetching data.</p>');
            $('#designationEmployeesSalaryMonth').html('<p>Error fetching data.</p>');
            $('#locationEmployeesSalaryYear').html('<p>Error fetching data.</p>');
            $('#designationEmployeesSalaryYear').html('<p>Error fetching data.</p>');
        }
    });
});
