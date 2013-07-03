

    var $client, $session, $remote_client, $user_id, $message;
    var $counter = 0;
    $user_id = ''
    function vlineShell(serviceId) {
      this.calls_ = [];
      $client = vline.Client.create({"serviceId": serviceId, "uiBigGreenArrow": true});
      
    

    $('#Login').click(function() {
        if($('#Login').text() == "Login") {
          return $client.login(serviceId).done(function(session) {
            $session = session;
            $client.on('recv:im', onIm, self).on('add:mediaSession', onAddMediaSession, self).
            on('remove:mediaSession', onRemoveMediaSession, self);
            $(this).text('Logout');
            }, this);
        }  else if ($('#Login').text() == "Logout"){
            $session = null;
            $(this).text("Login");
            $user_id = '';
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

      function onIm(event) {
        var msg = event.message;
        var sender = msg.getSender();
            confirm(sender.getDisplayName() + " says: " + msg.getBody(false));
            console.log("hello");
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
    this.calls_.push(new Call(mediaSession));
  }

  function removeMediaSession_(mediaSession) {
    // Clean up call list when call ends
    this.calls_.splice(this.calls_.indexOf(mediaSession), 1);
  }

  function Call(mediaSession) {
    mediaSession.on('enterState:incoming', onEnterIncoming, this);

    function onEnterIncoming() {
      var accept = confirm('Incoming call from ' + mediaSession.getDisplayName() + " accept?");
      if (accept == true) {
        mediaSession.start();
        $('#Call').text('End Call');
      } else {
        mediaSession.stop();
      }
    }

  }


    $('#Call').click(function() {
        if($('#Call').text() == "Call") {
            setUser();
            $session.getPerson($user_id).
                done(function(person) {
                  $remote_client = person;
                   $session.startMedia($user_id).done(function() {
                    $('#Call').text('End Call');
                });
                person.release();

            // console.log(person.getDisplayName());
    // Got remote person
    // You can now send messages and make calls
            });
        } else if ($('#Call').text() == "End Call") {
            $('#Call').text('Call');
            $client.stopMediaSessions();
            
        }
            
    });

    function setUser() {
        if($user_id == '' || $user_id == null) {
            $user_id = prompt("Please enter the User Id");
        } 
    }

    $('#Message').click(function() {
        setUser();
        $message = prompt("Please type your message below");
        $session.postMessage($user_id, $message);
    });

    }

    vlineShell('powspace');