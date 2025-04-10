$.ajax({
    url: '/API/salary_report.php',
    type: 'GET',
    success: function(data) {
      const designations = [];
      const salaries = [];
  
      data.designations_salary.forEach(item => {
        designations.push(item.designation);
        salaries.push(parseFloat(item.avg_year_salary));
      });
  
      new Chart(document.getElementById('yearlySalaryChart'), {
        type: 'bar',
        data: {
          labels: designations,
          datasets: [{
            label: 'Avg Yearly Salary (₹)',
            data: salaries,
            backgroundColor: 'rgb(42, 175, 175)',
            borderColor: 'rgb(42, 175, 175)',
            borderWidth: 1,
            borderRadius: 6,
            barThickness: 25
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Yearly Salary (₹)' }
            }
          }
        }
      });
    }
  });

  //monthly salary
  $.ajax({
    url: '/API/salary_report.php',
    type: 'GET',
    success: function(data) {
      const designations = [];
      const monthSalaries = [];

      data.designations_salary.forEach(item => {
        designations.push(item.designation);
        monthSalaries.push(parseFloat(item.avg_month_salary));
      });

      // Monthly Salary Chart
      new Chart(document.getElementById('monthlySalaryChart'), {
        type: 'bar',
        data: {
          labels: designations,
          datasets: [{
            label: 'Avg Monthly Salary (₹)',
            data: monthSalaries,
            backgroundColor: 'rgb(42, 175, 175)',
            borderColor: 'rgb(42, 175, 175)',
            borderWidth: 1,
            borderRadius: 6,
            barThickness: 25
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Monthly Salary (₹)' }
            }
          }
        }
      });
    }
});

  