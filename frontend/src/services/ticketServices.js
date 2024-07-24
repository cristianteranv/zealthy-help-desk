import axios from 'axios';
import { API_URL } from '../utils/constants';

export const postNewTicket = async (name, email, description) => {
  try {
    await axios.post(`${API_URL}/api/tickets`, { name, email, description });
  } catch (error) {
    console.error('Error submitting ticket:', error);
    throw error;
  }
}

export const fetchTicketsData = async (pageNumber) => {
  try {
    const response = await axios.get(`${API_URL}/api/tickets?page=${pageNumber}&per_page=10`);
    return response;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const fetchTicketDetails = async (ticketId) => {
  try {
    const response = await axios.get(`${API_URL}/api/tickets/${ticketId}`);
    return response;
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, newStatus) => {
  try {
    await axios.put(`${API_URL}/api/tickets/${ticketId}/status`, { status: newStatus });
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export const respondToTicket = async (ticketId, message) => {
  try {
    await axios.post(`${API_URL}/api/tickets/${ticketId}/respond`, { message });
  } catch (error) {
    console.error('Error submitting response:', error);
    throw error;
  }
};