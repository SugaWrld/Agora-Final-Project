 // creating clinet and variables
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

// creating clicks and buttons' funtion
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
    document.getElementById("printPassword").innerHTML = "Channel Password: "+ check.password;
 });
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

 //main methods
 async function join() {
    $("#mic-btn").prop("disabled", false);
    $("#video-btn").prop("disabled", false);
    client.on("user-published", handleUserPublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(options.appid, options.channel, options.token || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
    ]);
    showMuteButton();
    $("#local-player-name").text(`Username(${options.uname})-ID(${options.uid})`);
    localTracks.videoTrack.play("local-player");
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
    remoteUsers = {};
    $("#remote-playerlist").html(``);
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
async function subscribe(user, mediaType) {
         const uid = user.uid;
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
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
        user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}
 function handleUserJoined(user) {
    const id = user.uid;
    remoteUsers[id] = user;
 }
  
 function handleUserLeft(user) {
    const id = user.uid;
    delete remoteUsers[id];
 }
 function handleUserPublished(user, mediaType) {
    subscribe(user, mediaType);
 }

 //other methods
 function hideMuteButton() {
    $("#video-btn").css("display", "none");
    $("#mic-btn").css("display", "none");
 }
 function showMuteButton() {
    $("#video-btn").css("display", "inline-block");
    $("#mic-btn").css("display", "inline-block");
 }
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
