import Button from "./Button"
import { MicOff, Mic, Video, VideoOff, MonitorUp, Users, MessageSquare, PhoneOff } from 'lucide-react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function ControlBar({state, dispatch, socket, meetingCode}){

    //console.log(CurrentParticipant)

    const navigate = useNavigate();
    let isMicOn = state.NativeParticipant.isMicActive;
    let isCameraOn = state.NativeParticipant.isVideoActive;
    //console.log(isMicOn, isCameraOn, state)
    //let isMicOn = CurrentParticipant.isMicActive;
    //let isCameraOn = CurrentParticipant.isVideoActive;

    // useEffect(()=>{
    //   //console.log(CurrentParticipant);
    //   return;
    // }, [CurrentParticipant])

    function handleMicToggle(){
        dispatch({type:"SwitchMic"});
    }
    
    function handleCameraToggle(){
        dispatch({type:"SwitchVideo"});
    }

  

    function handleLeaveCall(){
        console.log("phoneOff clicked");
        let data = {
          'meetingCode': meetingCode,
          'socketId': socket.socketId
        }
        console.log("before socket")
        socket.emit('leaveCall', data);
        console.log("after socket")
        navigate("/");
        return ;
    }


    return(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in"
        style={{alignContent:'center'}}>
      <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-soft px-4 py-3 flex items-center gap-2">
        {/* Mic Control */}
        <Button
          size="icon"
          variant={isMicOn ? "secondary" : "destructive"}
          className="w-12 h-12 rounded-xl transition-all duration-300"
          
          onClick={handleMicToggle}
        >
            {/*cn(
            "w-12 h-12 rounded-xl transition-all duration-300",
            isMicOn && "hover:bg-secondary/80"
          )*/}
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>

        {/* Camera Control */}
        <Button
          size="icon"
          variant={isCameraOn ? "secondary" : "destructive"}
          className="w-12 h-12 rounded-xl transition-all duration-300"
          
          onClick={handleCameraToggle}
        >
            {/*cn(
            "w-12 h-12 rounded-xl transition-all duration-300",
            isCameraOn && "hover:bg-secondary/80"
          )*/}
          {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>

        {/* Screen Share */}
        {/*<Button
          size="icon"
          variant={isScreenSharing ? "default" : "secondary"}
          className="w-12 h-12 rounded-xl hover:bg-secondary/80 transition-all duration-300"
          onClick={handleScreenShare}
        >
          <MonitorUp className="w-5 h-5" />
        </Button>}*/}

        {/* Participants */}
        {/*<Button
          size="icon"
          variant="secondary"
          className="w-12 h-12 rounded-xl hover:bg-secondary/80 transition-all duration-300"
          onClick={onShowParticipants}
        >
          <Users className="w-5 h-5" />
        </Button>*/}

        {/* Chat */}
        {/*<Button
          size="icon"
          variant="secondary"
          className="w-12 h-12 rounded-xl hover:bg-secondary/80 transition-all duration-300"
          onClick={onShowChat}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>*/}

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* Leave Call */}
        <Button
          size="icon"
          variant="destructive"
          className="w-12 h-12 rounded-xl hover:bg-destructive/90 transition-all duration-300"
          onClick={handleLeaveCall}
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
    )
}
export default ControlBar