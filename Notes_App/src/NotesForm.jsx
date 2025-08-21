import { useRef, useEffect } from 'react'
export function NotesForm({state, setState}){

    let TitleRef = useRef()
    let ContentRef = useRef()
    let VisibleState = (state.isFormOpen) ? 'editor-container active' : 'editor-container';
    let note = (state.Selectedindx !== null) ? state.NotesList[state.Selectedindx] : 
                {
                    'id': state.LastNotesKey + 1,
                    'title': '',
                    'content':'',
                    'updatedAt': new Date()
                }
    let TitleError = '';
    let ContentError = '';
    
    console.log(state)
    useEffect(() => {
        TitleRef.current.value = state.Selectedindx !== null ? state.NotesList[state.Selectedindx].title : '';
        ContentRef.current.value = state.Selectedindx !== null ? state.NotesList[state.Selectedindx].content : '';
    })

    function handleClose(){
        setState({...state, 'isFormOpen':!state.isFormOpen, 'Selectedindx':null })
    }

    function handleClickOutside(event){
        console.log(event.target.className)
        if(event.target.className === 'editor-container active'){
            handleClose()
        }
    }

    function handleSave(){
        let UpdatedNote = {
            'id':note.id,
            'title':TitleRef.current.value,
            'content':ContentRef.current.value,
            'updatedAt': note.updatedAt
        }
        if(UpdatedNote.title === '' || UpdatedNote.content === ''){
            handleClose()
            return
        }
        let noteList = [...state.NotesList]
        if(state.Selectedindx !== null){
            noteList[state.Selectedindx] = UpdatedNote
        }
        else{
            noteList.push(UpdatedNote)
        }
        let newLastNotesKey = state.LastNotesKey + 1;
        setState({'NotesList': noteList, 'isFormOpen':false, 'Selectedindx':null, 'LastNotesKey':newLastNotesKey, 'ShowError':false})
    }

    return(
    <div className={VisibleState} onClick={handleClickOutside}>    
        <div className="editor">
            <div className="editor-header">
                <h2 id="editorHeader">{(state.Selectedindx !==null) ? 'Edit Note': 'New Note'}</h2>
                <button className="action-btn" id="closeEditorBtn" onClick={handleClose}>✕</button>
            </div>
            <input ref={TitleRef} type="text" className="editor-title" id="noteTitle" placeholder="Note title" />
            <textarea ref={ContentRef} className="editor-body" id="noteContent" placeholder="Start writing your note here..."></textarea>
            <div className="editor-footer">
                <button className="btn btn-cancel" id="cancelEditBtn" onClick={handleClose}>Cancel</button>
                <button className="btn" id="saveNoteBtn" onClick={handleSave}>Save</button>
            </div>
        </div>
    </div>
    )
}