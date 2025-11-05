export function NotesCard({note, state, setState, index}){

    function handleDelete(){
        let NotesList = [...state.NotesList];
        NotesList.splice(index, 1)
        setState({...state, 'NotesList':NotesList})
    }

    function handleOpenCard(event){
        if(event.target.id === 'delete-btn'){
            return handleDelete()
        }
        setState({...state, 'isFormOpen':true, 'Selectedindx': index})
    }

    return(
            <div className="note-card" onClick={handleOpenCard}>
                <div className="note-actions">
                    <button className="action-btn delete-btn" id="delete-btn" data-id={note.id} onClick={handleDelete}>🗑️</button>
                </div>
                <div className="note-title">{note.title || 'Untitled Note'}</div>
                <div className="note-content">{note.content || 'No content yet'}</div>
                <div className="note-date">Last edited: {new Date(note.updatedAt).toLocaleString()}</div>
            </div>
    )
}