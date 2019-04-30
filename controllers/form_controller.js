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
    });

    $('#verify').submit(function () {
        ev.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/ui/verify',
            success: function(response) {
                $("html").html(response);
            }
        });
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/../verify',
        });
    });
    
    $('#login').submit(function () {
        $.ajax({
            type: 'POST',
            data : $(this).serialize(),
            url: '/../login'
        });
    });
});
