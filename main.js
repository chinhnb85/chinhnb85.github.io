const socket=io('https://stream1005.herokuapp.com/');
//const socket=io('http://localhost:3000/');

$('#div-chat').hide();


socket.on('DS_ONLINE',arrUserInfo=>{
    //console.log(arrUserInfo);
    $('#div-chat').show();
    $('#div-dangky').hide();

    arrUserInfo.forEach(user=>{
        const {username,peerId}=user;
        $('#listUserOnline').append('<li id="'+peerId+'">'+username+'</li>');
    });

    socket.on('USER_NEW',user=>{
        //console.log(user);
        const {username,peerId}=user;
        $('#listUserOnline').append('<li id="'+peerId+'">'+username+'</li>');
    });

    socket.on('NGAT_KET_NOI',peerId=>{
        $('#'+peerId).remove();
    });
});

socket.on('DK_THAT_BAI',()=>{
    alert('Vui long chon username khac!');
});

function openStream(){
    const config={audio:false,video:true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video=document.getElementById(idVideoTag);
    video.srcObject=stream;
    video.play();
}

//openStream().then(stream => playStream('localStream',stream));

var peer = new Peer({key: 'io2762a9o95uq5mi'});

peer.on('open',id=>{
    $('#my-peer').append(id);
    //sign up
    $('#btnSignUp').click(()=>{
        const username=$('#txtUsername').val();
        socket.emit('DANG_KY',{username:username,peerId:id});
    });
});

//call
$('#btnCall').click(()=>{
    const id=$('#remoteId').val();
    openStream().then(stream => {
        playStream('localStream',stream);
        const call=peer.call(id,stream);
        call.on('stream',remoteStream=>playStream('remoteStream',remoteStream));
    });
});

//callee
peer.on('call',call=>{
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream',remoteStream=>playStream('remoteStream',remoteStream));
    });
});

//dang ky su kien click cho li sau khi sinh ra
$('#listUserOnline').on('click','li',function(){
    //console.log($(this).attr('id'));
    const id=$(this).attr('id');
    openStream().then(stream => {
        playStream('localStream',stream);
        const call=peer.call(id,stream);
        call.on('stream',remoteStream=>playStream('remoteStream',remoteStream));
    });
});