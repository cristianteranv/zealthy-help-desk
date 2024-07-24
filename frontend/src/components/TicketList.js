import React, { useState, useEffect } from 'react';
import { 
  List, 
  Typography,
  Snackbar,
  Alert,
  Pagination,
  Box,
  Grid,
} from '@mui/material';
import { fetchTicketDetails, fetchTicketsData, respondToTicket, updateTicketStatus } from '../services/ticketServices';
import TicketItem from './TicketItem';
import TicketDialog from './TicketDialog';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const fetchTickets = async (pageNumber) => {
    try {
      const response = await fetchTicketsData(pageNumber);
      setTickets(response.data.tickets);
      setTotalPages(response.data.pages);
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

  const handlePageChange = (event, value) => {
    setPage(value);
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
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Ticket List
        </Typography>
        <Pagination
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          size='small'
        />
      </Grid>
      <List>
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} onClick={handleOpen} />
        ))}
      </List>
      <TicketDialog 
        open={open}
        onClose={handleClose}
        selectedTicket={selectedTicket}
        response={response}
        setResponse={setResponse}
        handleRespond={handleRespond}
      />
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