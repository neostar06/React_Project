import { useState } from 'react'
import './App.css'
import { NotesForm } from './NotesForm'
import { NotesCard } from './NotesCard'

function App() {
  const [state, setState] = useState({
    'isFormOpen': false,
    'Selectedindx': null,
    'NotesList':[],
    'LastNotesKey':0
  })

  //const [isopenForm,SetOpenForm] = useState(false)

  function OpenForm(){
    setState({...state, 'isFormOpen':!state.isFormOpen, 'Selectedindx':null})
  }

  let index_count = -1;

  return (
    <>
      <div className="container">
        <header>
            <h1>Notes App</h1>
            <button className="btn" id="addNoteBtn" onClick={OpenForm}>
                <span className="btn-icon">+</span>
                <span>Add Note</span>
            </button>
        </header>
        {state.NotesList.length !== 0 ? (
          <div className="notes-container" id="notesContainer">
            {state.NotesList.map((note) => {
              index_count = index_count + 1;
              return (
              <NotesCard key={note.id} state={state} note={note} setState={setState} index={index_count} />
            )})}
          </div>
        ): (
          <div className="empty-state" id="emptyState">
            <div className="empty-state-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Click "Add Note" to create your first note</p>
          </div>
        )}
      </div>
      <NotesForm state={state} setState={setState} />
    </>
  )
}

export default App
