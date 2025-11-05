
export function TaskCard({task, state, setState, index}){

    let taskState = task.taskState === 'Active' ? false : true;

    function handleDelete(){
        let taskList = [...state.TaskList];
        taskList.splice(index, 1)
        setState({...state, 'TaskList':taskList})

    }

    function handleCheck(event){
        taskState = event.target.checked;
        let currentTask = {...task};
        currentTask.taskState = (taskState ? 'Completed' : 'Active');
        let taskList = [...state.TaskList];
        taskList[index] = currentTask;
        setState({...state, 'TaskList':taskList})
    }

    return(
        <div className="flex items-start" id="card">
            <input 
                type="checkbox" 
                className="checkbox-custom mt-1 mr-3"
                onChange={handleCheck}
                checked={taskState}
                value={taskState}
                ></input>
            <div className="flex-1">
                <div className="text-gray-800">{task.taskName}</div>
                <div className="text-xs text-gray-400 mt-1">{task.taskTimestamp}</div>
            </div>
            <button className="delete-btn" onClick={handleDelete}>
                <i className="fas fa-trash-alt"></i>
            </button>
        </div>

    ) 
}