
async function AddPeerConnectionAnswer(peerConnection, offerObj) {

    //addAnswer is called in socketListeners when an answerResponse is emitted.
    //at this point, the offer and answer have been exchanged!
    //now CLIENT1 needs to set the remote
    await peerConnection.setRemoteDescription(offerObj)
    // console.log(peerConnection.signalingState)
    return peerConnection;
}

export default AddPeerConnectionAnswer;