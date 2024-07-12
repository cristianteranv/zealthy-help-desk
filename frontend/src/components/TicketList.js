import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { 
  List, 
  ListItemButton,
  ListItemText, 
  Typography, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const STATUS = Object.freeze({
    NEW: 'new',
    IN_PROGRESS: 'in progress',
    DONE: 'done'
  })

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');

  const handleOpen = async (ticketId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tickets/${ticketId}`);
      setSelectedTicket(response.data.ticket);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTicket(null);
    setResponse('');
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tickets/${selectedTicket.id}/status`, { status: newStatus });
      alert('Status updated successfully');
      handleClose();
      fetchTickets();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleRespond = async (status) => {
    try {
      handleStatusChange(status);
      if (response !== '') {
        await axios.post(`http://localhost:5000/api/tickets/${selectedTicket.id}/respond`, { message: response });
        alert('Response submitted successfully');
        setResponse('');
      }
      handleClose();
      fetchTickets();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Error submitting response');
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Ticket List
      </Typography>
      <List>
        {tickets.map((ticket) => (
          <ListItemButton key={ticket.id} onClick={() => handleOpen(ticket.id)} divider={true}>
            <ListItemText
              primary={`Ticket #${ticket.id} - ${ticket.name}`}
              secondary={ticket.description}
            />
            <Chip label={ticket.status} color={ticket.status === STATUS.NEW ? 'error' : ticket.status === STATUS.IN_PROGRESS ? 'warning' : 'success'} />
          </ListItemButton>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        {selectedTicket && (
          <>
            <DialogTitle>Ticket # {selectedTicket.id}</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent >
              <Typography variant="h6" gutterBottom>
                {selectedTicket.name} - {selectedTicket.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Description: </strong>{selectedTicket.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status: </strong>
                <Chip label={selectedTicket.status} color={selectedTicket.status === 'new' ? 'error' : selectedTicket.status === 'in progress' ? 'warning' : 'success'} />
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                label="Enter your response"
                style={{ marginTop: '1rem' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>handleRespond('in progress')} color="primary">
                Mark In Progress
              </Button>
              <Button onClick={()=>handleRespond('done')} color="secondary">
                Mark Resolved
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default TicketList;