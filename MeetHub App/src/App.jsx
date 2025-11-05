
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './Components/HomePage'
import MeetingPage from './Components/MeetingPage'
import NotFound from './Components/NotFound'



function App() {

  return (
    <>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meeting/*" element={<MeetingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
