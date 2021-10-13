/*
var user = AgoraRTC.createClient({
   mode:"rtc",
   codec:"vp8"
});
var localTracker ={
   videoTracker:null,
   audioTracker:null
};
var localTrackerState = {
   videoTrackerEnabled: true,
   audioTracker: true
};
var remoteUsers ={};
 
var userDetail ={
   appid: "5d563419191940c9a9e919623bbc734a",
   channel: null,
   userID: null,
   token: null
};
 
$("#join-form").submit(async function (e) {
   e.preventDefault();
   $("#join").attr("disabled", true);
   $("#create").attr("disabled", true);
   try{
       userDetail.appid = "5d563419191940c9a9e919623bbc734a",
       userDetail.channel = $("#channle").val();
       await join();
   }
   catch (error){
       console.error(error);
   }
   finally{
       $("#leave").attr("disabled", false);
 
   }
});
async function join(){
   $("#mic-btn").prop("disabled", false);
   $("#video-btn").prop("disabled", false);
   user.on("user-published", handleUserPublished);
   user.on("user-joined", handleUserJoined);
   user.on("user-left", handleUserLeft);
}
function handleUserJoined(user) {
   const id = user.userID;
   remoteUsers[id] = user;
}
 
// Handle user left
function handleUserLeft(user) {
   const id = user.userID;
   delete remoteUsers[id];
   $(`#player-wrapper-${id}`).remove();
}
 
// Handle user published
function handleUserPublished(user, mediaType) {
   userJoined(user, mediaType);
}
async function userJoined(user, mediaType) {
   const uid = user.userID;
   // subscribe to a remote user
   await client.subscribe(user, mediaType);
   console.log("subscribe success");
   // if the video wrapper element is not exist, create it.
   if (mediaType === 'video') {
       if ($(`#player-wrapper-${uid}`).length === 0) {
           const player = $(`
       <div id="player-wrapper-${uid}">
         <p class="player-name">remoteUser(${uid})</p>
         <div id="player-${uid}" class="player"></div>
       </div>
     `);
           $("#remote-playerlist").append(player);
       }
       // play the remote video.
       user.videoTracker.play(`player-${uid}`);
   }
   if (mediaType === 'audio') {
       user.audioTracker.play();
   }
}
$("#create-form").submit(async function (e) {
   e.preventDefault();
   $("#create").attr("disabled", true);
   $("#join").attr("disabled", true);
   $("#leave").attr("disabled", false);
});
 
$("#leave").click(function (e) {
   $("#join").attr("disabled", false);
   $("#create").attr("disabled", false);
   $("#leave").attr("disabled", true);
});
*/
 
function setPassword(){
    let password = document.getElementById("password")
    if (password.value.length >= 6) {
        password.className = ""
        return true
    } else {
        password.className = "incorrect"
        return false
    }
 }
 function setUserName(){
    var userName = document.getElementById("userName")
    if (userName.length > 0) {
        const playerName = $(`
    <div id="player-wrapper-${uname}>
      <p class="player-name">remoteUser(${uname})</p>
      <div id="player-${uname}" class="player"></div>
    </div>
  `);
        $("#remote-playerlist").append(playerName);
    }
 }


 // create Agora client
 var client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8"
 });
  
 var localTracks = {
    videoTrack: null,
    audioTrack: null
 };
  
 var localTrackState = {
    videoTrackEnabled: true,
    audioTrackEnabled: true
 }
  
 var remoteUsers = {};

 //var remoteUsersName={};
 // Agora client options
 var options = {
    appid: "a6af85f840ef43108491705e2315a857",
    channel: null,
    uid: null,
    uname:null,
    upassword:null,
    token: null
 };
 var check ={
     password:null
 };
  
 $("#toCreate").click(function (e) {

    $("#join").prop("disabled", true);
    $("#mic-btn").prop("disabled", true);
    $("#video-btn").prop("disabled", true);
    $("#leave").prop("disabled", true);
    $("#password").prop("disabled", true);
    $("#toCreate").attr("disabled", true);
    $("#backBtn").attr("disabled", false);
    $("#create").attr("disabled", false);
    document.getElementById("backBtn").innerHTML = "Back";
});
$("#backBtn").click(function (e) {
   $("#join").prop("disabled", false);
   $("#mic-btn").prop("disabled", true);
   $("#video-btn").prop("disabled", true);
   $("#leave").prop("disabled", true);
   $("#password").prop("disabled", false);
   $("#toCreate").attr("disabled", true);
   $("#backBtn").attr("disabled", false);
   $("#create").attr("disabled", false);
   $("#backBtn").attr("disabled", true);
   $("#create").prop("disabled", true);
   $("#toCreate").attr("disabled", false);
});
 $("#create-form").submit(async function (e) {
    e.preventDefault();
    $("#join").attr("disabled", true);
    $("#create").attr("disabled", true);
    $("#backBtn").attr("disabled", true);
    try {
        options.appid = "a6af85f840ef43108491705e2315a857";
        options.channel = $("#channel").val();
        options.uname = $("#userName").val();
        await join();
    } catch (error) {
        console.error(error);
    } finally {
        $("#leave").attr("disabled", false);
    }
    var password = options.channel;
    check.password=createPassword(password);

    console.log("--------------------");
    console.log(check.password);
    document.getElementById("printPassword").innerHTML = "Channel Password: "+ check.password;
 });
function createPassword(pass){
    var first = pass[0];
    var half = (pass.length /2)-1;
    var mid = pass[half];
    var last = pass[pass.length-1];
    var returnValue =first+("")+ mid+("")+last;
    return returnValue;
}

$("#join").click(async function (e) {
    e.preventDefault();
    $("#join").attr("disabled", true);
    $("#create").attr("disabled", true);
    try {
        options.appid = "a6af85f840ef43108491705e2315a857";
        options.channel = $("#channel").val();
        options.uname = $("#userName").val();
        options.upassword = $("#password").val();
        var password = options.channel;
        check.password=createPassword(password);
        if(!(check.password===null) && options.upassword === check.password){
            await join();
        }
        else{
            leave();
        }
    } catch (error) {
        console.error(error);
    } finally {
        $("#leave").attr("disabled", false);
    }
 });
 $("#leave").click(function (e) {
    leave();
 });
  
 $("#mic-btn").click(function (e) {
    if (localTrackState.audioTrackEnabled) {
        muteAudio();
    } else {
        unmuteAudio();
    }
 });
  
 $("#video-btn").click(function (e) {
    if (localTrackState.videoTrackEnabled) {
        muteVideo();
    } else {
        unmuteVideo();
    }
 })
  
 async function join() {
    $("#mic-btn").prop("disabled", false);
    $("#video-btn").prop("disabled", false);
  
    // add event listener to play remote tracks when remote users join, publish and leave.
    client.on("user-published", handleUserPublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    // join a channel and create local tracks, we can use Promise.all to run them concurrently
    [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        // join the channel
        client.join(options.appid, options.channel, options.token || null),
        // create local tracks, using microphone and camera
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
    ]);
    showMuteButton();
    // play local video track
    $("#local-player-name").text(`User(${options.uname})`);
    localTracks.videoTrack.play("local-player");
   
   
    //$("#local-player-name").text(`Channel Name: ${options.channel}`);
    // publish local tracks to channel
    await client.publish(Object.values(localTracks));
    console.log("publish success");
 }
  
 async function leave() {
    for (trackName in localTracks) {
        var track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            $('#mic-btn').prop('disabled', true);
            $('#video-btn').prop('disabled', true);
            localTracks[trackName] = undefined;
        }
    }
    // remove remote users and player views
    remoteUsers = {};
    $("#remote-playerlist").html("");
    // leave the channel
    await client.leave();
    $("#local-player-name").text("");
    $("#player-name").text("");
    $("#join").attr("disabled", false);
    $("#toCreate").attr("disabled", false);
    $("#password").attr("disabled", false);
    $("#create").attr("disabled", true);
    $("#leave").attr("disabled", true);
    document.getElementById("printPassword").innerHTML = "";
    hideMuteButton();
    
    console.log("client leaves channel success");
 }
 /*
 $(`
 <div id="player-wrapper-${uid}">
   <p class="player-name"> UserId(${uid})</p>
   <div id="player-${uid}" class="player"></div>
 </div>
`);
*/
function getObjSize(obj) {
   var size = 0,
     key;
   for (key in obj) {
     if (obj.hasOwnProperty(key)) {
        size++;
     }
   }
   return size;
 };
/*
 async function subscribe(user, mediaType) {
   var length =getObjSize(remoteUsers);
   console.log("----------------------------");
   console.log(length);
   for(var i=1; i<=length;i++){
      if(i%2==0){
         const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    // if the video wrapper element is not exist, create it.
    if (mediaType === 'video') {
        if ($(`#player-wrapper-${uid}`).length === 0) {
            const player = $(`
        <div id="player-wrapper-${uid}">
          <p class="player-name">remoteUser(${uid})</p>
          <div id="player-${uid}" class="player"></div>
        </div>
      `);
            $("#remote-playerlist").append(player);
        }
        // play the remote video.
        user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
   }
   else{
      const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    // if the video wrapper element is not exist, create it.
    if (mediaType === 'video') {
        if ($(`#player-wrapper-${uid}`).length === 0) {
            const player = $(`
        <div id="player-wrapper-${uid}">
          <p class="player-name">remoteUser(${uid})</p>
          <div id="player-${uid}" class="player"></div>
        </div>
      `);
            $("#remote-playerlist-nextline").append(player);
        }
        // play the remote video.
        user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
   }
   }
}
*/
async function subscribe(user, mediaType) {
         const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    // if the video wrapper element is not exist, create it.
    if (mediaType === 'video') {
        if ($(`#player-wrapper-${uid}`).length === 0) {
            const player = $(`
        <div id="player-wrapper-${uid}">
          <p class="player-name">remoteUser(${uid})</p>
          <div id="player-${uid}" class="player"></div>
        </div>
      `);
      var length =getObjSize(remoteUsers);
   console.log("----------------------------");
   console.log(length);
   if(length%2==0){
      $("#remote-playerlist-nextline").append(player);
   }
   else{
      $("#remote-playerlist").append(player);
   }
           
        }
        // play the remote video.
        user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}
  
 // Handle user joined
 function handleUserJoined(user) {
    const id = user.uid;
    remoteUsers[id] = user;
 }
  
 // Handle user left
 function handleUserLeft(user) {
    const id = user.uid;
    delete remoteUsers[id];
 }
  
 // Handle user published
 function handleUserPublished(user, mediaType) {
    subscribe(user, mediaType);
 }
  
 // Hide or show control buttons

 function hideMuteButton() {
    $("#video-btn").css("display", "none");
    $("#mic-btn").css("display", "none");
 }
  
 function showMuteButton() {
    $("#video-btn").css("display", "inline-block");
    $("#mic-btn").css("display", "inline-block");
 }
  
 // Mute audio and video
 async function muteAudio() {
    if (!localTracks.audioTrack) return;
    await localTracks.audioTrack.setEnabled(false);
    localTrackState.audioTrackEnabled = false;
    $("#mic-btn").text("Unmute Audio");
 }
 async function muteVideo() {
    if (!localTracks.videoTrack) return;
    await localTracks.videoTrack.setEnabled(false);
    localTrackState.videoTrackEnabled = false;
    $("#video-btn").text("Unmute Video");
 }
  
 // Unmute audio and video
 async function unmuteAudio() {
    if (!localTracks.audioTrack) return;
    await localTracks.audioTrack.setEnabled(true);
    localTrackState.audioTrackEnabled = true;
    $("#mic-btn").text("Mute Audio");
 }
  
 async function unmuteVideo() {
    if (!localTracks.videoTrack) return;
    await localTracks.videoTrack.setEnabled(true);
    localTrackState.videoTrackEnabled = true;
    $("#video-btn").text("Mute Video");
 }
