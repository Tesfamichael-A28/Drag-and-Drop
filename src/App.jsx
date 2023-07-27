import React, { useState, useEffect } from "react"
import CreateTask from "./components/CreateTask"
import ListTask from "./components/ListTask"
import { Toaster } from "react-hot-toast"
import { DndProvider } from "react-dnd"
import { MultiBackend } from "react-dnd-multi-backend"
import { HTML5toTouch } from "rdndmb-html5-to-touch"

function App() {
  const [tasks, setTasks] = useState([])

  //console.log("tasks", tasks)

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem("tasks")))
  }, [])
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Toaster />

      <div className="bg-gray-800 flex flex-col w-screen h-screen items-center pt-32 gap-16">
        <CreateTask tasks={tasks} setTasks={setTasks} />
        <ListTask tasks={tasks} setTasks={setTasks} />
      </div>
    </DndProvider>
  )
}

export default App
