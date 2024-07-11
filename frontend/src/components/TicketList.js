import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText, Typography, Chip } from '@mui/material';

function TicketList() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@gmail.com',
      status: 'done'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@gmail.com',
      status: 'new'
    },
    {
      id: 3,
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      status: 'in progress'
    }
  ]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Ticket List
      </Typography>
      <List>
        {tickets.map((ticket) => (
          <ListItemButton key={ticket.id} component={Link} to={`/ticket/${ticket.id}`} divider={true}>
            <ListItemText
              primary={`Ticket #${ticket.id} - ${ticket.name}`}
              secondary={ticket.description}
            />
            <Chip label={ticket.status} color={ticket.status === 'new' ? 'error' : ticket.status === 'in progress' ? 'warning' : 'success'} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
}

export default TicketList;