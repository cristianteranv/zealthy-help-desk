import React, {useState} from 'react';
import { Alert, Snackbar, TextField, Button, Typography, Box } from '@mui/material';
import { postNewTicket } from '../services/ticketServices';

function TicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postNewTicket(name, email, description);
      setSnackMessage('Ticket submitted successfully.');
      setName('');
      setEmail('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setSnackMessage('Error submitting ticket.');
    }
    setOpenSnack(true);
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        Submit a ticket
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Button type="submit" variant='contained' color="primary" sx={{ mt: 2 }}>
        Submit Ticket
      </Button>
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}>
          <Alert 
            severity={snackMessage === 'Ticket submitted successfully.' ? 'success' : 'error'}
            onClose={() => setOpenSnack(false)}
            variant="filled"
            sx={{ width: '100%' }}
            >
            {snackMessage}
          </Alert>
      </Snackbar>
    </Box>
  )
}

export default TicketForm;