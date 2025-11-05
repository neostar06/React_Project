import {TaskCard} from './TaskCard'

export function ListView({state, setState, DisplayedList}){
    //console.log(state.TaskList)
    
    let isTaskListEmpty = DisplayedList.length === 0 ? false : true;
    let index_count = -1;


    function handleClear(){
        let finalList = state.TaskList.filter(task => {
            return task.taskState !== 'Completed' ? true : false
        });
        setState({...state,'TaskList':finalList})
    }
    function showTask(event){
            setState({...state,'filterName':event.target.id})
    }

    return(
        <>
            <div className="flex justify-between mb-6 text-sm">
                <button id="All" className="filter-btn active px-3 py-1 rounded hover:bg-gray-100 transition-colors" onClick={showTask}>
                    All
                </button>
                <button id="Active" className="filter-btn px-3 py-1 rounded hover:bg-gray-100 transition-colors" onClick={showTask}>
                    Active
                </button>
                <button id="Completed" className="filter-btn px-3 py-1 rounded hover:bg-gray-100 transition-colors" onClick={showTask}>
                    Completed
                </button>
                <button id="clear-completed" className="text-indigo-600 hover:text-indigo-800 transition-colors" onClick={handleClear}>
                    Clear completed
                </button>
            </div>
            <div id="tasks-container" className="space-y-3">
                {
                    isTaskListEmpty ? (
                        DisplayedList.map((task) => {
                            index_count = index_count + 1;
                            return(
                            <TaskCard key={task.key} task={task} state={state} setState={setState} index={index_count} />
                            
                        )})
                    ) : (
                        <div id="empty-state" className="empty-state flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-gray-500"> 
                                {state.filterName === 'All' ? 
                                "No tasks yet. Add some tasks to get started!" : 
                                (state.filterName === 'Active' ? 
                                    "No Active tasks yet. Add some tasks to get started!" :
                                    "No Completed tasks yet. Add some tasks to get started!") }
                            </p>
                        </div>
                    )
                }
                
            </div>
        </>
    )
}