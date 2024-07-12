import React, {useState} from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

function TicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tickets', { name, email, description });
      alert('Ticket submitted successfully');
      setName('');
      setEmail('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket');
    }
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
    </Box>
  )
}

export default TicketForm;