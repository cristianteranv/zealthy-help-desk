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
import MailOutlineIcon from '@mui/icons-material/MailOutline';
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
    const names = name.toUpperCase().split(' ');

    return {
      sx: {
        bgcolor: stringToColor(name),
        marginRight: '1rem',
        width: 36,
        height: 36,
      },
      children: names.length > 1 ? `${names[0][0]}${names[1][0]}` : `${names[0][0]}`,
    };
  }

  if (!selectedTicket) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{mb: 0, pb:0}}>
        Ticket # {selectedTicket.ticket.id}
        <Chip sx={{ml: 2}} label={selectedTicket.ticket.status} color={selectedTicket.ticket.status === 'new' ? 'error' : selectedTicket.ticket.status === 'in progress' ? 'warning' : 'success'} />
      </DialogTitle>
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
      <DialogContent sx={{pt:1}}>
        <Grid container spacing={2} sx={{mb:1,}}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
            <Avatar {...stringAvatar(selectedTicket.ticket.name)}  />
            <Typography variant="h6" gutterBottom>
              {selectedTicket.ticket.name}
            </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
            <MailOutlineIcon sx={{marginRight: '1rem', fontSize: 30}} />
            <Typography variant="h6" gutterBottom>
              {selectedTicket.ticket.email}
            </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body1" gutterBottom >
          <strong>Description: </strong>{selectedTicket.ticket.description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {selectedTicket.responses.length > 0 &&
        <>
          <Typography sx={{marginTop:'1rem'}} variant="body1"><strong>Responses:</strong></Typography>
          <Box sx={{ 
              maxHeight: { xs: '30vh', sm: '40vh' },
              overflowY: 'auto',
            }}>
            <List>
              {selectedTicket.responses.map((r) => (
                <ListItem key={r.id}>
                  <ListItemText 
                    primary={r.message} 
                    secondary={new Date(r.created_at).toLocaleString()} 
                    sx={{ m:0 }}
                    primaryTypographyProps={{ 
                      style: { 
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
        }
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          label="Enter your response"
          sx={{mt:1}}
        />
        </Box>
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