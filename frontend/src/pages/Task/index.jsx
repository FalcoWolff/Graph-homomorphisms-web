import { useParams } from "react-router"

export default function Task({}) {
    const {taskId} = useParams();
    return <div>task {taskId}</div>
}