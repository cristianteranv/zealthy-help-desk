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
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@gmail.com',
      description: 'This is a ticket description',
      status: 'resolved'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@gmail.com',
      description: 'This is a ticket description 2',
      status: 'new'
    },
    {
      id: 3,
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      description: 'This is a ticket description 3',
      status: 'in progress'
    }
  ]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tickets');
        setTickets(tickets.concat(response.data));
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');

  const handleOpen = (ticketId) => {
    setOpen(true);
    setSelectedTicket(tickets[ticketId - 1])
  }

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
            <Chip label={ticket.status} color={ticket.status === 'new' ? 'error' : ticket.status === 'in progress' ? 'warning' : 'success'} />
          </ListItemButton>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
        {selectedTicket && (
          <>
            <DialogTitle>Ticket # {selectedTicket.id}</DialogTitle>
            <IconButton
              aria-label="close"
              //onClick={handleClose}
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
              <Button  color="primary">
                Mark In Progress
              </Button>
              <Button  color="secondary">
                Mark Resolved
              </Button>
              <Button  color="primary">
                Submit Response
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default TicketList;