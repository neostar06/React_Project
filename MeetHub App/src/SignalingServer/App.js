
const express = require('express');
const https = require('https');
const http = require('http')
const { Server } = require('socket.io');
const app = express();
const fs = require('fs')

//we need a key and cert to run https
//we generated them with mkcert
// $ mkcert create-ca
// $ mkcert create-cert
const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');


//const expressServer = https.createServer({key, cert}, app);
const expressServer = http.createServer(app);

const io = new Server(expressServer, {
    cors: {
        origin: [
            "http://localhost:5173"
        //    "https://192.168.1.200:5173"
        ], // Allow your React app to connect
        methods: ["GET", "POST"]
    }
});

//expressServer.listen(3000);

const MeetingDetails = {};

// offer - set local RTCSessionDescription
// ice candidate -> peer connection m add karenge

// let participantDetail = {
//             'socketId':'',
//             'name': Math.floor(1000 + Math.random() * 9000),
//             'MediaStream': '',
//             'VideoTrack': '',
//             'MicTrack': '',
//             'isMicActive': false,
//             'isVideoActive': false,
//             'iceCandidates':[],
//             'offer':{},
//             'didOffer':false
// };

//offers will contain {}
// const offers = [
//     // offererUserName
//     // offer
//     // offerIceCandidates
//     // answererUserName
//     // answer
//     // answererIceCandidates
// ];

// let meetingDetail = {
//     'participant':[
//         participantDetail
//     ]
// };

// data = {
//     'MeetingId':'',
//     'participant':{}
// }


console.log('app running')

io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('addParticipant', (data) => {
            console.log("add participant event recieved")
            if(MeetingDetails[data.MeetingId] == null){
                MeetingDetails[data.MeetingId] = {'participantDetails':[]};
                MeetingDetails[data.MeetingId].participantDetails.push(data.participant);
            }
            else{
                MeetingDetails[data.MeetingId].participantDetails.push(data.participant);
                MeetingDetails[data.MeetingId].participantDetails.forEach((participant) => {
                    //console.log(participant.socketId)
                    //io.to(participant.socketId).emit('NewParticipantJoined', MeetingDetails[data.MeetingId].participantDetails)
                    if(participant.socketId == data.participant.socketId){
                        socket.emit('NewParticipantJoined', MeetingDetails[data.MeetingId].participantDetails)
                    };
                });
            }
            //console.log(MeetingDetails)
        });



        //New Code to be used
        socket.on('newOffer',newOffer=>{

            //console.log(newOffer)
            let SocketIdToOffer;
            MeetingDetails[newOffer.meetingCode].participantDetails.forEach((participant) => {

                if(participant.socketId == newOffer.socketId){
                    participant.offer = newOffer.offer;
                    participant.didOffer = true;

                }
                else{
                    SocketIdToOffer = participant.socketId;
                }
            })
            io.to(SocketIdToOffer).emit('newOfferAwaiting', MeetingDetails[newOffer.meetingCode].participantDetails);
            // console.log(newOffer.sdp.slice(50))
            //send out to all connected sockets EXCEPT the caller
            
            //socket.broadcast.emit('newOfferAwaiting',participantOfferDetails)
        })

        socket.on('newAnswer',(offerObj,ackFunction)=>{
            //console.log(offerObj);
            //emit this answer (offerObj) back to CLIENT1
            //in order to do that, we need CLIENT1's socketid
            let socketIdToAnswer;
            let offerIceCandidates;
            MeetingDetails[offerObj.meetingCode].participantDetails.forEach((participant) =>{
                if(participant.didOffer){
                    socketIdToAnswer = participant.socketId;
                    offerIceCandidates = participant.iceCandidates;
                }
            });

            //const socketToAnswer = connectedSockets.find(s=>s.userName === offerObj.offererUserName)
            if(!socketIdToAnswer){
                console.log("No matching socket");
                return;
            }
            
            //we find the offer to update so we can emit it
            //send back to the answerer all the iceCandidates we have already collected
            ackFunction(offerIceCandidates);
            
            //socket has a .to() which allows emiting to a "room"
            //every socket has it's own room
            socket.to(socketIdToAnswer).emit('answerResponse',offerObj.offer)
        })

        socket.on('sendIceCandidateToSignalingServer',iceCandidateObj=>{
            
            MeetingDetails[iceCandidateObj.meetingCode].participantDetails.forEach((participant) => {

                if(participant.socketId == iceCandidateObj.socketId){
                    if(participant.iceCandidates == null){
                        participant.iceCandidates = [];
                    }
                    participant.iceCandidates.push(iceCandidateObj.iceCandidate);
                }
                else{
                    io.to(participant.socketId).emit('receivedIceCandidateFromServer', iceCandidateObj.iceCandidate)
                }
            })
        })

        socket.on('leaveCall', (data) => {
            let removedParticipant;
            //console.log("leave call triggered")
            MeetingDetails[data.meetingCode].participantDetails = MeetingDetails[data.meetingCode].participantDetails.filter((participant) => {
                if(participant.socketId != data.socketId){
                    participant.didOffer = false;
                    io.to(participant.socketId).emit('participantRemoved',{} );
                    return true;
                }
                else{
                    removedParticipant = participant
                    return false;
                }
            });
            // MeetingDetails[data.meetingCode].participantDetails.forEach((participant) => {

            //     if(participant.socketId != data.socketId){
                    
            //         participant.didOffer = false;
            //         socket.emit('participantRemoved',{} );
            //     }
            // });


        });

        socket.on('disconnect', (data) => {
            console.log('User disconnected:', socket.id);

        });
});

const PORT = process.env.PORT || 3000;
expressServer.listen(PORT, () => {
    console.log(`Signaling server listening on port ${PORT}`);
});


