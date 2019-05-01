$(document).ready(function() {

    $('#add').submit(function (ev) {
        ev.preventDefault();
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/additem',
            
            success: function(response) {
                alert('Added item ' + response.Name + ' with Id: ' + response.ItemId);
            },

            error: function(xhr) {
                alert(JSON.parse(xhr.responseText).sqlMessage);
            }

        });
        
        $('#add')[0].reset();
    });

    $('#signup').submit(function (ev) {
        ev.preventDefault();
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/signup',
            
            success: function(response) {
                alert('You have successfully registered!');
            },

            error: function(xhr) {
                alert(JSON.parse(xhr.responseText).sqlMessage);
            }

        });

        $('#signup')[0].reset();
    });
    
});
