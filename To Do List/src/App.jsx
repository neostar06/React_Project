import { useState } from 'react'
import './App.css'
import { TaskInput } from './TaskInput'
import { ListView } from './ListView'

function App() {
  //let taskList = []
  const [state, setState] = useState({
    'filterName': 'All',
    'TaskList':[]
  })
  //console.log(state)
  let DisplayedList = state.TaskList.filter(task => {
            return (state.filterName === 'All' ? true : (task.taskState === state.filterName ? true : false))
        });
  
  return (
    <>
      <div>
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
                <div className="flex items-center space-x-2">
                    <span id="task-count" className="text-sm font-medium text-gray-500"> {DisplayedList.length} of {state.TaskList.length} tasks</span>
                </div>
            </div>
            <TaskInput state={state} setState={setState} />
            <ListView state={state} setState={setState} DisplayedList={DisplayedList} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
