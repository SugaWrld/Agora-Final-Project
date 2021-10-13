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
    var num1 = pass.charCodeAt(1);
    var num2 = pass.charCodeAt(pass.length - 2);
    pass = pass.toLowerCase();
    var first = pass.charCodeAt(0)+3;
    first = String.fromCharCode(first);
    var half = (pass.length /2);
    var mid = pass.charCodeAt(half.toPrecision(1))+5;
    mid = String.fromCharCode(mid);
    var last = pass.charCodeAt(pass.length-1)+1;
    last = String.fromCharCode(last);
    var returnValue =mid+("")+num1+("")+first+("")+num2+("")+last;
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
    $("#local-player-name").text(`Username(${options.uname})-ID(${options.uid})`);
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
    $("#remote-playerlist").html(``);
    // leave the channel
    await client.leave();
    $("#local-player-name").text(``);
    $("#local-player-name-nextline").text(``);
    $("#player-name").text(``);
    $("#join").attr("disabled", false);
    $("#toCreate").attr("disabled", false);
    $("#password").attr("disabled", false);
    $("#create").attr("disabled", true);
    $("#leave").attr("disabled", true);
    document.getElementById("printPassword").innerHTML = "";
    hideMuteButton();
    
    console.log("client leaves channel success");
 }

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
   for(var i=0; i<length; i++){
      console.log(remoteUsers[i]+"");
   }
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
