import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TicketForm from './components/TicketForm';

const TicketList = () => {
  return (
    <div>
      <h1>Ticket List</h1>
      <ul>
        <li>ticket 1</li>
        <li>ticket 2</li>
        <li>ticket 3</li>
      </ul>
    </div>
  )
}


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Submit Ticket</Link>
            </li>
            <li>
              <Link to="/admin">Admin Panel</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path='/' element={<TicketForm/>} />
          <Route exact path='/admin' element={<TicketList/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;