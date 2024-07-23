import { 
  ListItemButton,
  ListItemText,
  Chip
} from '@mui/material';
import React from 'react';
import { STATUS } from '../utils/constants';

const TicketItem = ({ ticket, onClick }) => {

  return (
    <ListItemButton key={ticket.id} onClick={() => onClick(ticket.id)} divider={true}>
      <ListItemText
        primary={`Ticket #${ticket.id} - ${ticket.name}`}
        secondary={ticket.description}
      />
      <Chip label={ticket.status} color={ticket.status === STATUS.NEW ? 'error' : ticket.status === STATUS.IN_PROGRESS ? 'warning' : 'success'} />
    </ListItemButton>
  );
};

export default TicketItem;