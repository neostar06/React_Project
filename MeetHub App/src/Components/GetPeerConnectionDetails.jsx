import SendPeerConnectionOffer from "./SendPeerConnectionOffer";
import createPeerConnection from "./CreatePeerConnection";


async function GetPeerConnectionDetails(socket, meetingCode, UserDetails){  

    let localStream = UserDetails.MediaStream;
    
    let {peerConnection, remoteStream} = await createPeerConnection( socket, meetingCode, localStream)

    //await SendPeerConnectionOffer(peerConnection, socket, meetingCode)
    //create offer time!
    // try{
    //     console.log("Creating offer...")
    //     const offer = await peerConnection.createOffer();
    //     console.log(offer);
    //     await peerConnection.setLocalDescription(offer);
    //     didIOffer = true;
    //     socket.emit('newOffer',offer); //send offer to signalingServer
    // }catch(err){
    //     console.log(err)
    // }
    return {peerConnection, remoteStream}; 

}

export default GetPeerConnectionDetails