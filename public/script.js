

    var $client, $session;
    function vlineShell(serviceId, elem) {
      
      $client = vline.Client.create({serviceId: serviceId, ui: true});
      
    

    $('#Login').click(function() {
        return $client.login(serviceId).done(function(session) {
            $session = session;
            var person = $session.getLocalPerson();
            console.log('Logged in as ' + person.getDisplayName());
            $(this).text('Logout');
            }, this);
    });


    }

    vlineShell('powspace', $('#video-box'));


