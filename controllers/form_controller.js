$(document).ready(function() {

    $('#loginbtn').css('cursor', 'pointer');
    $('#signupbtn').css('cursor', 'pointer');
    $('#logout').css('cursor', 'pointer');
    
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
                $('#login')[0].reset();
                alert('You have entered the wrong password');
            }

        });
    });

    $('#logout').click(function (ev) {
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
                $('#reviews').append(response);
                alert('Success: Review written');
            },
            error: function(xhr) {
                if (JSON.parse(xhr.responseText).code == 'ER_DUP_ENTRY') {
                    alert('You have already written a review for this item');
                }
                else {
                    alert('Please login to write a review');
                }
            }
            
        });
        $('#addreview')[0].reset();
    });

    $('#purchase').submit(function (ev) {
        ev.preventDefault();
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/purchase',
            
            success: function(response) {
                document.open();
                document.write(response);
                document.close();
                alert('You have successfully purchased the item!');
            },
            error: function(xhr) {
                if (JSON.parse(xhr.responseText).quantity)
                    alert('Please enter a number from 1 to ' + JSON.parse(xhr.responseText).quantity);
                else if (JSON.parse(xhr.responseText).error)
                    alert(JSON.parse(xhr.responseText).error);
            }
            
        });
        $('#addreview')[0].reset();
    });

    $('#loginbtn').click(function() {
        $('#loginModal').modal('show');
    });

    $('#signupbtn').click(function() {
        $('#signupModal').modal('show');
    });
    
});

