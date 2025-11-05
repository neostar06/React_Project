let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302',
              "stun:stun.l.google.com:5349",
              "stun:stun1.l.google.com:3478",
              "stun:stun1.l.google.com:5349",
              "stun:stun2.l.google.com:19302",
              "stun:stun2.l.google.com:5349",
              "stun:stun3.l.google.com:3478",
              "stun:stun3.l.google.com:5349",
              "stun:stun4.l.google.com:19302",
              "stun:stun4.l.google.com:5349" 
            ]
        }
    ]
}

//let localStream; //a var to hold the local video stream
//let remoteStream; //a var to hold the remote video stream
let peerConnection; //the peerConnection that the two clients use to talk
let didIOffer = false;


async function createPeerConnection (socket, meetingCode, localStream){

    //RTCPeerConnection is the thing that creates the connection
    //we can pass a config object, and that config object can contain stun servers
    //which will fetch us ICE candidates
    peerConnection = await new RTCPeerConnection(peerConfiguration)
    let remoteStream = new MediaStream()
    //remoteVideoEl.srcObject = remoteStream;

    localStream.getTracks().forEach(track=>{
        //add localtracks so that they can be sent once the connection is established
        peerConnection.addTrack(track,localStream);
    })

    peerConnection.addEventListener("signalingstatechange", (event) => {
        //console.log(event);
        //console.log(peerConnection.signalingState)
    });

    peerConnection.addEventListener('icecandidate',e=>{
        //console.log('........Ice candidate found!......')
        //console.log(e)
        if(e.candidate){
            socket.emit('sendIceCandidateToSignalingServer',{
                iceCandidate: e.candidate,
                socketId: socket.id,
                didIOffer,
                meetingCode: meetingCode
            })    
        }
    })
    
    peerConnection.addEventListener('track',e=>{
        console.log("Got a track from the other peer!! How excting")
        console.log(e)
        e.streams[0].getTracks().forEach(track=>{
            remoteStream.addTrack(track,remoteStream);
            console.log("Here's an exciting moment... fingers cross")
        })
    })
    // if(offerObj){
    //     //this won't be set when called from call();
    //     //will be set when we call from answerOffer()
    //     // console.log(peerConnection.signalingState) //should be stable because no setDesc has been run yet
    //     await peerConnection.setRemoteDescription(offerObj.offer)
    //     // console.log(peerConnection.signalingState) //should be have-remote-offer, because client2 has setRemoteDesc on the offer
    // }
    return {peerConnection, remoteStream};

}

export default createPeerConnection;