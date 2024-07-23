import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { 
  List,
  ListItem,
  ListItemButton,
  ListItemText, 
  Typography, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import { STATUS } from '../utils/constants';
import { fetchTicketDetails, fetchTicketsData, respondToTicket, updateTicketStatus } from '../services/ticketServices';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetchTicketsData();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setSnackMessage('Error fetching tickets');
      setOpenSnack(true);
    }
  };

  const handleOpen = async (ticketId) => {
    try {
      const response = await fetchTicketDetails(ticketId);
      setSelectedTicket(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setSnackMessage('Error fetching ticket details');
      setOpenSnack(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTicket(null);
    setResponse('');
  };

  const handleRespond = async (status) => {
    try {
      await updateTicketStatus(selectedTicket.ticket.id, status);
      if (response !== '') {
        await respondToTicket(selectedTicket.ticket.id, response);
        setResponse('');
      }
      handleClose();
      fetchTickets();
      setSnackMessage('Response submitted successfully');
    } catch (error) {
      console.error('Error submitting response:', error);
      setSnackMessage('Error submitting response');
    }
    setOpenSnack(true);
  };

  return (
    <>
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
            <DialogTitle>Ticket # {selectedTicket.ticket.id}</DialogTitle>
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
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Name: </strong>{selectedTicket.ticket.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Email: </strong>{selectedTicket.ticket.email}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description: </strong>{selectedTicket.ticket.description}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status: </strong>
                    <Chip label={selectedTicket.ticket.status} color={selectedTicket.ticket.status === 'new' ? 'error' : selectedTicket.ticket.status === 'in progress' ? 'warning' : 'success'} />
                  </Typography>
                </Grid>
              </Grid>
              {selectedTicket.responses.length > 0 &&
              <>
                <Typography variant="h6"><strong>Responses:</strong></Typography>
                <List>
                  {selectedTicket.responses.map((r) => (
                    <ListItem key={r.id}>
                      <ListItemText primary={r.message} secondary={new Date(r.created_at).toLocaleString()} />
                    </ListItem>
                  ))}
                </List>
              </>
              }
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
            <DialogActions style={{marginBottom: '0.5rem'}}>
              <Button onClick={()=>handleRespond('in progress')} variant='contained'>
                Mark In Progress
              </Button>
              <Button onClick={()=>handleRespond('done')} variant='contained'>
                Mark Resolved
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
          open={openSnack}
          autoHideDuration={3000}
          onClose={() => setOpenSnack(false)}>
            <Alert 
              severity={snackMessage === 'Response submitted successfully' ? 'success' : 'error'}
              onClose={() => setOpenSnack(false)}
              variant="filled"
              sx={{ width: '100%' }}
              >
              {snackMessage}
            </Alert>
        </Snackbar>
    </>
  );
}

export default TicketList;