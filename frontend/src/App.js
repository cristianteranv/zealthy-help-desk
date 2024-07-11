import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Help Desk
          </Typography>
          <Button color="inherit" component={Link} to="/">Ticket Form</Button>
          <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<TicketForm />} />
        <Route path="/admin" element={<TicketList />} />
      </Routes>
    </Router>
  );
}

export default App;