import Button from "./UI/Button"
import Input from "./UI/Input"
import { useState} from "react";
import { useNavigate } from 'react-router-dom';
import { Plus, Video } from 'lucide-react';

import '../App.css'




function HomePage(){

  const navigate = useNavigate()
  // State needed to capture meeting code from Input field
  const [meetingCode, setMeetingCode] = useState('')
  let MeetingData = {
    'meetingCode':meetingCode,
    'meetingType':'New'
  }
  function GenerateNewMeetingCode(){
      const getRandomLetters = () => {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        result += letters[randomIndex];
      }
      return result;
    };
    
    return `${getRandomLetters()}-${getRandomLetters()}-${getRandomLetters()}`;
  }

  function handleNewMeeting (){
      let newCode = GenerateNewMeetingCode()
      setMeetingCode(newCode)
      MeetingData = {
                'meetingCode':newCode,
                'meetingType':'New'
              }
      navigate('/meeting/' + newCode, {state:MeetingData})
      return;
  }


  function handleKeyPress(event){
      return;
  }


  function handleJoinMeeting(){
      MeetingData = {
                'meetingCode':meetingCode,
                'meetingType':'Existing'
              }
      navigate('/meeting/' + meetingCode, {state:MeetingData})
      return;
  }

  
    return (
        <>
            <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
                    <div className="w-full max-w-md animate-fade-in">
                        {/* Logo & Header */}
                        <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-hover" style={{background: 'hsl(174, 58%, 45%)'}}>
                            <Video className="w-8 h-8 text-primary-foreground" />
                        </div>

                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Welcome to MeetHub
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Start or join a video call
                        </p>
                    </div>


                    <div className="bg-card border border-gray-200 rounded-2xl shadow-soft p-8 space-y-6" style={{background:'hsl(215, 33%, 20%)'}}>
                        {/* New Meeting Button */}
                        <Button
                        onClick={handleNewMeeting}
                        className="w-full h-14 text-base font-medium bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-hover rounded-xl"
                        style={{background: 'hsl(174, 58%, 45%)'}}>
                            <Plus className="w-5 h-5 mr-2" />
                            Start New Meeting
                        </Button>
        
                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute  flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-muted-foreground">or</span>
                          </div>
                        </div>
        
                        {/* Join Meeting */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="meeting-code" className="flex text-sm font-medium text-foreground" style={{textAlign:'left', alignContent:'left'}}>
                              Enter meeting code
                            </label>
                            <Input
                              id="meeting-code"
                              type="text"
                              placeholder="abc-defg-hij"
                              value={meetingCode}
                              onChange={(e) => setMeetingCode(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="h-12 bg-secondary border-gray-200 focus:border-primary focus:ring-primary rounded-xl text-base"
                            />
                          </div>
                          <Button
                            onClick={handleJoinMeeting}
                            variant="secondary"
                            className="w-full h-12 text-base font-medium rounded-xl hover:bg-secondary/80 transition-all duration-300"
                            style={{background:'hsl(219, 33%, 25%)'}}
                          >
                            Join Meeting
                          </Button>
                        </div>
                    </div>
        
                        <div className="text-center mt-8 text-sm text-muted-foreground">
                        <p>Secure, high-quality video calls</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage