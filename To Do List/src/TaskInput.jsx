import { useRef } from 'react'

export function TaskInput({state, setState}){
    const taskRef = useRef()

    function addTask(taskName){
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let currentDate = new Date()
        let currentDateFormat = months[currentDate.getMonth()] + " " + currentDate.getDate() + ", " + currentDate.getHours() + ":" + currentDate.getMinutes()
        //console.log(state.TaskList[state.TaskList.length -1])
        let task = {
            'key': state.TaskList.length !== 0 ? state.TaskList[state.TaskList.length-1].key + 1 : 0,
            'taskName': taskName,
            'taskState': 'Active',
            'taskTimestamp': currentDateFormat
        }
        let taskList = state.TaskList
        taskList.push(task);
        setState({...state, 'TaskCount': state.TaskCount + 1, 'TaskList': taskList})
        taskRef.current.value = ''
    }

    function handleClick(){
        if(taskRef.current.value !== ''){
            addTask(taskRef.current.value)
        }
        
    }

    function handleKeyPress(event){
        if(event.key === 'Enter'){
            addTask(event.target.value)
        }
    }
    return(
        <div className="mb-6 relative">
            <div className="flex items-center">
                    <input 
                        type="text" 
                        id="new-task" 
                        placeholder="What needs to be done?" 
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        onKeyDown={handleKeyPress}
                        ref={taskRef}
                        />
                    <button 
                        id="add-task" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-r-lg transition-colors"
                        onClick={handleClick}
                    >
                        Add
                    </button>
            </div>
        </div>
    )
}