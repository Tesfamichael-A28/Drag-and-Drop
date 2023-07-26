import { useState, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { toast } from "react-hot-toast"

const ListTask = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [closed, setClosed] = useState([])

  useEffect(() => {
    const tasksArray = tasks || []
    const fTodos = tasksArray.filter((task) => task.status === "todo")
    const fInProgress = tasksArray.filter(
      (task) => task.status === "inProgress"
    )
    const fClosed = tasksArray.filter((task) => task.status === "closed")

    setTodos(fTodos)
    setInProgress(fInProgress)
    setClosed(fClosed)
  }, [tasks])

  const statuses = ["todo", "inProgress", "closed"]
  return (
    <div className="flex gap-16">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  )
}

export default ListTask

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  let text = "Todo"
  let bg = "bg-slate-500"
  let tasksToMap = todos

  if (status === "inProgress") {
    text = "In Progress"
    bg = "bg-purple-500"
    tasksToMap = inProgress
  }
  if (status === "closed") {
    text = "Closed"
    bg = "bg-green-500"
    tasksToMap = closed
  }

  const addItemToSection = (id) => {
    setTasks((prev) => {
      //modified task
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status }
        }
        return t
      })
      localStorage.setItem("tasks", JSON.stringify(mTasks))
      toast("Task Status Chnaged", { icon: "😁" })
      return mTasks
    })
    // console.log("dropped", id, status)
  }

  return (
    <div
      ref={drop}
      className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-200" : ""}`}
    >
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  )
}
const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}
    >
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center ">
        {count}
      </div>
    </div>
  )
}
const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  //console.log(isDragging)

  const handleRemove = (id) => {
    const fTasks = tasks.filter((t) => t.id !== id)
    localStorage.setItem("tasks", JSON.stringify(fTasks))
    setTasks(fTasks)
    toast("Task Removed", { icon: "🔺" })
  }
  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${
        isDragging ? "opacity-25" : "opacity-100"
      }`}
    >
      <p>{task.name}</p>
      <button
        className="absolute bottom-1 right-1 text-slate-400"
        onClick={() => handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  )
}
