import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import toast from "react-hot-toast"

const CreateTask = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo" //can also be inprogress or closed
  })

  //console.log(task)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (task.name.length < 3)
      return toast.error("A task must have more than 3 characters")
    if (task.name.length > 100)
      return toast.error("A task must not be more than 100 characters")
    setTasks((prev) => {
      const list = [...prev, task]
      localStorage.setItem("tasks", JSON.stringify(list))
      return list
    })
    toast.success("Task Completed")
    setTask({
      id: "",
      name: "",
      status: "todo"
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-slate-400 bg-slate-100 rounded-md px-1 mr-4 h-12 w-64"
        value={task.name}
        onChange={(e) =>
          setTask({ ...tasks, id: uuidv4(), name: e.target.value })
        }
      />
      <button className="bg-cyan-600 rounded-md px-4 h-12 text-white">
        Create
      </button>
    </form>
  )
}

export default CreateTask
