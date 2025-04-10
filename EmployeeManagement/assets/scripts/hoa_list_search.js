$(document).ready(function() {
    $("#scheme, #file1, #file2, #file3, #file4, #file5, #file6").prop('disabled', true);
    $("#department").on('change', function() {
        if ($(this).val()) {
            $("#scheme").prop('disabled', false); 
        } else {
            $("#scheme").prop('disabled', true); d
            resetFields();
        }
    });

    
    $("#scheme").on('change', function() {
        if ($(this).val()) {
            $("#file1").prop('disabled', false); 
        } else {
            $("#file1").prop('disabled', true); 
            resetFields();
        }
    });

  
    function enableNextField(currentField, nextField) {
        if ($(currentField).val().length > 0) {
            $(nextField).prop('disabled', false); 
        } else {
            $(nextField).prop('disabled', true); 
        }
    }
    $("#file1").on('input', function() {
        enableNextField("#file1", "#file2");
    });
    $("#file2").on('input', function() {
        enableNextField("#file2", "#file3");
    });

    $("#file3").on('input', function() {
        enableNextField("#file3", "#file4");
    });
    $("#file4").on('input', function() {
        enableNextField("#file4", "#file5");
    });
    $("#file5").on('input', function() {
        enableNextField("#file5", "#file6");
    });
    function resetFields() {
        $("#file1, #file2, #file3, #file4, #file5, #file6").prop('disabled', true);
    }
});
