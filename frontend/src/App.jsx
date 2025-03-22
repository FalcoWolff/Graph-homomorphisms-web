import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Task from './pages/Task';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task/:taskId" element={<Task />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
