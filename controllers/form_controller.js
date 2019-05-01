$(document).ready(function() {

    $('#additem').submit(function (ev) {
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

        $('#additem')[0].reset();
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

    $('#login').submit(function (ev) {
        ev.preventDefault();
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/login',
            
            success: function(response) {
                document.open();
                document.write(response);
                document.close();
            },

            error: function() {
                alert('You have entered the wrong password');
                $('#login')[0].reset();
            }

        });
    });

    $('#logout').submit(function (ev) {
        ev.preventDefault();
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/logout',
            
            success: function(response) {
                document.open();
                document.write(response);
                document.close();
            }

        });
    });

    $('#addreview').submit(function (ev) {
        ev.preventDefault();
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/addreview',
            
            success: function(response) {
                alert('Success: Review written');
                $('#reviews').append(response);
            },
            
            error: function() {
                alert('You have already written a review for this item');
            }
            
        });
        $('#addreview')[0].reset();
    });
    
});
