

    var $client, $session, $remote_client, $user_id;
    var $counter = 0;
    $user_id = 'powspace:ebt1fp76cv2mozrn'
    function vlineShell(serviceId, elem) {
      
      $client = vline.Client.create({"serviceId": serviceId});
      
    

    $('#Login').click(function() {
        if($('#Login').text() == "Login") {
          return $client.login(serviceId).done(function(session) {
            $session = session;
            $client.on('add:mediaSession', onAddMediaSession, self).
            on('remove:mediaSession', onRemoveMediaSession, self);
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

    function onAddMediaSession(event) {
        var mediaSession = event.target;
        addMediaSession_(mediaSession);
      }

      function onRemoveMediaSession(event) {
        var mediaSession = event.target;
        removeMediaSession_(mediaSession);
      }

       // HELPERS
  //
  function addMediaSession_(mediaSession) {
    // add event handler for add stream events
    mediaSession.on('mediaSession:addLocalStream mediaSession:addRemoteStream', function(event) {
      var stream = event.stream;

      // guard against adding a local video stream twice if it is attached to two media sessions
      if ($('#' + stream.getId()).length) {
        return;
      }

      // create video or audio element
      $counter += 1
      var elem = $(event.stream.createMediaElement());
      elem.prop('id', stream.getId());
      if($counter == 2) {
        elem.addClass('restrict-video-large');
        $('.video_large').append(elem);
        $counter = 0;
      }  else {
        elem.addClass('restrict');
        $('.small_video').append(elem);
      }
    });
    // add event handler for remove stream events
    mediaSession.on('mediaSession:removeLocalStream mediaSession:removeRemoteStream', function(event) {
      $('#' + event.stream.getId()).remove();
    });

    // The Call object tracks the lifecycle of the mediaSession
    // this.calls_.push(new Call(this.term_, mediaSession));
  }

  function removeMediaSession_(mediaSession) {
    // Clean up call list when call ends
    this.calls_.splice(this.calls_.indexOf(mediaSession), 1);
  }


    $('#Call').click(function() {
            $session.getPerson($user_id).
        done(function(person) {
            $remote_client = person;
            $session.startMedia($user_id).done(function() {
            });
            person.release();
            // console.log(person.getDisplayName());
    // Got remote person
    // You can now send messages and make calls
    });
});

    }

    vlineShell('powspace', 'video');