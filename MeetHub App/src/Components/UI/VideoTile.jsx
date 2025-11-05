import User from "./User"
import { MicOff, Mic } from 'lucide-react';
import { useRef, useEffect } from "react";
import GetUserMediaDetails from "../GetUserMediaDetails";


function VideoTile({name, isMicActive, MediaStream, isLocal, isVideoActive}){
    const VideoRef = useRef()
    let avatar = ''
    // async function SetVideoStream(videoRef){
    //   let currentUser = await GetUserMediaDetails();
    //   videoRef.current.srcObject = currentUser.MediaStream;
    //   console.log(currentUser)
    //   return currentUser;
    // }
  //console.log(MediaStream)

    
    useEffect(()=>{
      if(MediaStream != ''){
        VideoRef.current.srcObject = MediaStream;
      };
      //VideoRef.current.muted = true;
      //VideoRef.current.autoPlay = false;
      
      return ;
    })

    return(
        <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden border border-border shadow-soft group hover:shadow-hover transition-all duration-300"
        style={{background: "hsl(218, 32%, 25%)"}}>
            {/* Video placeholder / Avatar */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  {/*<User className="w-10 h-10 text-primary" />*/}
                </div>
              )}
            </div>
            <video ref={VideoRef} autoPlay playsInline controls style={{transform: "scaleX(-1)"}}></video>

            {/* Name badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                <span className="text-sm font-medium text-foreground">
                  {name} {isLocal && "(You)"}
                </span>
                {isMicActive ? (
                  <Mic className="w-4 h-4 text-primary" />
                ) : (
                  <MicOff className="w-4 h-4 text-destructive" />
                )}
            </div>

            {/* Active speaker indicator */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-xl transition-all duration-300 pointer-events-none" />
        </div>
    )
}
export default VideoTile