$(document).ready(function () {
    console.log("HOA file is loaded");
  let hoaFormFields = [
    { id: "nameOfHOD", label: "Name of HOD", rules: ["required"] },
    { id: "budgetYear", label: "Budget Year", rules: ["required"] },
    { id: "establishment", label: "Establishment/Scheme", rules: ["required"] },
    { id: "majorHead", label: "Major Head", rules: ["required", "digits:4"] },
    { id: "subMajorHead", label: "Sub Major Head", rules: ["required", "digits:2"] },
    { id: "minorHead", label: "Minor Head", rules: ["required", "digits:3"] },
    { id: "groupSubHead", label: "Group Sub Head", rules: ["required", "digits:2"] },
    { id: "subHead", label: "Sub Head", rules: ["required", "digits:2"] },
    { id: "detailedHead", label: "Detailed Head", rules: ["required", "digits:3"] },
    { id: "subDetailedHead", label: "Sub Detailed Head", rules: ["required", "digits:3"] },
    { id: "chargedVoted", label: "Charged/Voted", rules: ["required"] },
  ];

  function validateFormField(field) {
    let input = $("#" + field.id);
    let value = input.val().trim();
    let error = $("#" + field.id + "Error");

    error.html("");
    input.removeClass("is-invalid is-valid");

    for (let rule of field.rules) {
      if (rule === "required" && !value) {
        error.html(`${field.label} is required.`);
        input.addClass("is-invalid");
        return false;
      }

      if (rule.startsWith("digits:")) {
        let length = parseInt(rule.split(":")[1]);
        if (!/^\d+$/.test(value) || value.length !== length) {
          error.html(`${field.label} must be exactly ${length} digits.`);
          input.addClass("is-invalid");
          return false;
        }
      }
    }

    input.addClass("is-valid");
    return true;
  }

  function validateHOAForm() {
    let valid = true;
    for (let field of hoaFormFields) {
      valid = validateFormField(field) && valid;
    }
    return valid;
  }

  $("#hoaForm").on("submit", function (e) {
    e.preventDefault();
    if (!validateHOAForm()) return;

        $('#hoaForm').submit(function (e) {
            e.preventDefault();
            let hod = $('#nameOfHOD').val();
            let estScheme = $('#establishment').val();
            let mjH = $('#majorHead').val();
            let smjH = $('#subMajorHead').val();
            let mnH = $('#minorHead').val();
            let gsH = $('#groupSubHead').val();
            let sH = $('#subHead').val();
            let dH = $('#detailedHead').val();
            let sdH = $('#subDetailedHead').val();
            let year = $('#budgetYear').val();
            let status = $('#chargedVoted').val();  
            let amount = 100.00;  
    
            let data = {
                hod: hod,
                estScheme: estScheme,
                mjH: mjH,
                smjH: smjH,
                mnH: mnH,
                gsH: gsH,
                sH: sH,
                dH: dH,
                sdH: sdH,
                year: year,
                status: status,
                amount: amount
            };
            console.log("this is coming from data variable :",data)
            $.ajax({
                url: '/API/hoa.php', 
                type: 'POST',
                data: JSON.stringify(data),  
                contentType: "application/json", 
                success: function (response) {
                    console.log(response);
                    if (response.status === true) { 
                        alert('HOA submitted successfully!');
                        $('#hoaForm')[0].reset(); 
                        window.location.href = '/hoa_list.html';  
                    } else {
                        alert('Error: ' + response.message);  
                    }
                },
                error: function () {
                    alert('An error occurred while submitting the form.');
                }
            });
        });
    
    
  });
});
