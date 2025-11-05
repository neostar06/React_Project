
async function SendPeerConnectionOffer(peerConnection, socket, meetingCode) {

    let offerObj = {
        'meetingCode': meetingCode,
        'socketId':socket.id,
        'offer':{}
    }

    try{
        console.log("Creating offer...", peerConnection)
        const offer = await peerConnection.createOffer();
        console.log(offer);
        await peerConnection.setLocalDescription(offer);
        offerObj.offer = offer;
        socket.emit('newOffer',offerObj); //send offer to signalingServer
    }catch(err){
        console.log(err)
    }
    return ;
}
export default SendPeerConnectionOffer