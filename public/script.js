

    var $client, $session, $remote_client, $user_id;
    $user_id = 'powspace:ebt1fp76cv2mozrn'
    function vlineShell(serviceId, elem) {
      
      $client = vline.Client.create({serviceId: serviceId, ui: true, uiVideoPanel: '#video-box'});
      
    

    $('#Login').click(function() {
        if($('#Login').text() == "Login") {
          return $client.login(serviceId).done(function(session) {
            $session = session;
            var person = $session.getLocalPerson();
            // console.log('Logged in as ' + person.getDisplayName());
            $(this).text('Logout');
            }, this);
        }  else if ($('#Login').text() == "Logout"){
            $session = null;
            $(this).text("Login");
            return $client.logout();
        }
    });

    $('#Call').click(function() {
        return $session.getPerson($user_id).
        done(function(person) {
            $remote_client = person;
            $session.startMedia($user_id);
            // console.log(person.getDisplayName());
    // Got remote person
    // You can now send messages and make calls
    })
});

    }

    vlineShell('powspace', $('#video-box'));