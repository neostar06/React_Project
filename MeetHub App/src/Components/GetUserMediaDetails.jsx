

async function GetUserMediaDetails(){
    let CurrentUser = {
        'name': Math.floor(1000 + Math.random() * 9000),
        'MediaStream': '',
        'VideoTrack': '',
        'MicTrack': '',
        'isMicActive': false,
        'isVideoActive': false,
        'didOffer': false
    }
    const constraints = {
        audio: true,
        video: true
    }


    await navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        stream.getTracks().forEach((track) => {
            //console.log(track)
            if(track.kind == 'audio'){
                CurrentUser.MicTrack = track;
                CurrentUser.isMicActive = true;
            }
            if(track.kind == 'video'){
                CurrentUser.VideoTrack = track;
                CurrentUser.isVideoActive = true;
            }
            
        })
        CurrentUser.MediaStream = stream;
    }).catch((error) => {
        console.log(error)
    })

    return CurrentUser
    
}

export default GetUserMediaDetails