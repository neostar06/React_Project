
async function SendPeerConnectionAnswer(peerConnection, socket, meetingCode, offer) {

    let offerObj = {
        'meetingCode':meetingCode,
        'socketId':socket.Id,
        'offer':null
    }

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer({}); //just to make the docs happy

    await peerConnection.setLocalDescription(answer); //this is CLIENT2, and CLIENT2 uses the answer as the localDesc

    //console.log(offerObj)
    //console.log(answer)
    // console.log(peerConnection.signalingState) //should be have-local-pranswer because CLIENT2 has set its local desc to it's answer (but it won't be)
    //add the answer to the offerObj so the server knows which offer this is related to
    offerObj.offer = answer;
    //emit the answer to the signaling server, so it can emit to CLIENT1
    //expect a response from the server with the already existing ICE candidates
    const offerIceCandidates = await socket.emitWithAck('newAnswer',offerObj)
    offerIceCandidates.forEach(c=>{
        peerConnection.addIceCandidate(c);
        console.log("======Added Ice Candidate======")
    })
    console.log("Answer sent",offerIceCandidates)
}

export default SendPeerConnectionAnswer;