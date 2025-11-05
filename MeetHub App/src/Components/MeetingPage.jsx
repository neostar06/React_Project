import ControlBar from "./UI/ControlBar";
import VideoTile from "./UI/VideoTile";
import Button from "./UI/Button";
import { Check, Copy, User } from 'lucide-react';
import GetUserMediaDetails from "./GetUserMediaDetails";
import GetPeerConnectionDetails from "./GetPeerConnectionDetails";
import SendPeerConnectionOffer from "./SendPeerConnectionOffer";
import SendPeerConnectionAnswer from "./SendPeerConnectionAnswer";
import AddPeerConnectionAnswer from "./AddPeerConnectionAnswer";
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useReducer, useCallback } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3000");
// const socket = io.connect("https://192.168.1.200:3000", {
//   rejectUnauthorized: false // only needed for local self-signed certs
// }) 

function MeetingReducer(state, action){
  let MicTrack = '';
  let VideoTrack = '';
  
  switch (action.type) {
    case "SwitchMic":
      MicTrack = state.NativeParticipant.MicTrack;
      MicTrack.enabled = MicTrack.enabled ?  false : true;
      return {
        ...state,
        NativeParticipant: {
          ...state.NativeParticipant,
          isMicActive: !state.NativeParticipant.isMicActive,
          MicTrack: MicTrack
        }
      };

    case "SwitchVideo":
      VideoTrack = state.NativeParticipant.VideoTrack;
      VideoTrack.enabled = VideoTrack.enabled ? false : true;
      return {
        ...state,
        NativeParticipant: {
          ...state.NativeParticipant,
          isVideoActive: !state.NativeParticipant.isVideoActive,
          VideoTrack: VideoTrack
        }
      };

    case "updateExternalParticipant":
      return {
        ...state,
        ExternalParticipant:action.value
      };

    case "setState":
      return {
        ...state,
        NativeParticipant:action.value // Ensure you return a new state from action.value
      };

    default:
      return state; // Return the current state if action type is unrecognized
  }
}


function MeetingPage({copied}){

  // Get Meeting ID details
  const location = useLocation()
  let meetingCode = location.state.meetingCode;

  // setup connection with signaling server
  //const socket = io.connect("http://localhost:3000"); // Connect to your signaling server
  
  
  // Maintain meeting details within state
  const [state, dispatch] = useReducer(MeetingReducer,
    {'NativeParticipant':{},
    'ExternalParticipant':{}
    }
  )

  console.log(state,socket)

  let participants = [];

  if(state.NativeParticipant.name != null){
    participants.push(state.NativeParticipant);
  };
  //console.log("test", state.ExternalParticipants)

  if(state.ExternalParticipant.name != null){
    participants.push(state.ExternalParticipant);
  };

  async function GetUserDetails(){

    let UserDetails = await GetUserMediaDetails();

    //peerConnection = await GetPeerConnectionDetails(socket, meetingCode, UserDetails);

    dispatch({type:"setState", value: UserDetails});

    return UserDetails;
  }
    
  useEffect(()=>{

    GetUserDetails().then( (UserDetails) => {
      console.log("get user media executed")
      let participantDetails = {...UserDetails, 'socketId':socket.id}
      let data = {
        'MeetingId': meetingCode,
        'participant': participantDetails
      }

      //console.log("socket yet to be executed", participantDetails)
      //########################
      socket.emit('addParticipant', data)

      console.log("Participant details added", participantDetails);

      // wait for new participant to join
      // ############################
      socket.on('NewParticipantJoined', (AllparticipantDetails) => {
        console.log("new participant joined event triggered", AllparticipantDetails)
        //console.log(AllparticipantDetails);
        //let {peerConnection, remoteStream} = 
        GetPeerConnectionDetails(socket, meetingCode, UserDetails).then((response) => {
          let {peerConnection, remoteStream} = response
          let ExternalParticipant = {};
          AllparticipantDetails.forEach((participant) => {
            console.log(participant, UserDetails)
            if(participant.name != UserDetails.name){
              ExternalParticipant = {...participant};
              ExternalParticipant.MediaStream = remoteStream;
              //SendPeerConnectionOffer(peerConnection, socket, meetingCode)
              
            };
          });

          dispatch({type: 'updateExternalParticipant', value: ExternalParticipant});

          SendPeerConnectionOffer(peerConnection, socket, meetingCode).then((response)=>{
            console.log("offer sent", response);
            socket.on('answerResponse', (offerToUpdate) => {
              console.log("answer recieved", offerToUpdate);
              AddPeerConnectionAnswer(peerConnection, offerToUpdate).then((response) => {
                console.log("answer ack", response)
                socket.on('receivedIceCandidateFromServer', (iceCandidateDetails) =>{
                  //console.log("Ice Candidates Recieved", iceCandidateDetails);
                  peerConnection.addIceCandidate(iceCandidateDetails);
                });
                socket.on('participantRemoved', () => {
                  console.log("participant Removed")
                  dispatch({type:'updateExternalParticipant', value:{}})
                });
              })
            })
          })

          

        })
        

      })

      // event listner for who recieved offer or joined earlier
      //####################################
      socket.on('newOfferAwaiting', (AllparticipantDetails) => {
    
        console.log("offer recieved", AllparticipantDetails);

        //let {peerConnection, remoteStream} = 
        GetPeerConnectionDetails(socket, meetingCode, UserDetails).then((response) => {

          let {peerConnection, remoteStream} = response
          let ExternalParticipant = {};
          let offer;
          AllparticipantDetails.forEach((participant) => {
            if(participant.name != UserDetails.name){
              offer = participant.offer;
              participant.MediaStream = remoteStream;
              ExternalParticipant = {...participant};
              ExternalParticipant.MediaStream = remoteStream;
              //SendPeerConnectionAnswer(peerConnection, socket, meetingCode)
              

            };
          });

          dispatch({type: 'updateExternalParticipant', value: ExternalParticipant});

          SendPeerConnectionAnswer(peerConnection, socket, meetingCode, offer);

          socket.on('receivedIceCandidateFromServer', (iceCandidateDetails) =>{
              //console.log("Ice Candidates Recieved", iceCandidateDetails);
              peerConnection.addIceCandidate(iceCandidateDetails);
          })

          socket.on('participantRemoved', () => {
            console.log("participantRemoved")
            dispatch({type:'updateExternalParticipant', value:{}})
          });

        })
        
      
      })


    })
    
    return () => {
      socket.off('NewParticipantJoined');
      socket.off('newOfferAwaiting');
      socket.off('answerResponse');
      socket.off('receivedIceCandidateFromServer');
      

    };

  },[meetingCode])

 
  function handleCopyCode(){
      copied = true;
      return ;
  }

    return(
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">{meetingCode}</span>
              <Button
                size="icon"
                variant="ghost"
                className="w-6 h-6 hover:bg-primary/20"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-primary/20 rounded-lg border border-primary/30">
              <span className="text-sm font-medium text-primary">
                {participants.length} participants
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Video Grid */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 h-full animate-scale-in">
            {participants.map((participant, index) => (
              <VideoTile
                key={index}
                name={participant.name}
                isMicActive={participant.isMicActive}
                isVideoActive={participant.isVideoActive}
                isLocal={index?false:true}
                MediaStream={participant.MediaStream}
              />
            ))}
          </div>
        </div>
      </main>
        {/* Control Bar */}
        <ControlBar state={state} dispatch={dispatch} socket={socket} meetingCode={meetingCode} />
    </div>
  );
}

export default MeetingPage