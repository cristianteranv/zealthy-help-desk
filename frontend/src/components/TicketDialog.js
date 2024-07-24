import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { 
  List,
  ListItem,
  ListItemText, 
  Typography, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import React from 'react';

function TicketDialog({open, onClose, selectedTicket, response, setResponse, handleRespond}) {
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  function stringAvatar(name) {
    const names = name.split(' ');

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: names.length > 1 ? `${names[0][0]}${names[1][0]}` : `${names[0][0]}`,
    };
  }

  if (!selectedTicket) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Ticket # {selectedTicket.ticket.id}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
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
          <Grid item xs={6} direction="row">
            <Typography variant="h6" gutterBottom>
              <Avatar {...stringAvatar(selectedTicket.ticket.name)} />{selectedTicket.ticket.name}
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
    </Dialog>
  );
}

export default TicketDialog;