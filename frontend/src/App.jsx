import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'flowbite/dist/flowbite.css';
import 'flowbite';
import Login from './pages/login';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
