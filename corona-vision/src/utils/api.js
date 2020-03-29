import axios from 'axios';

const API_URL = 'https://dbb7k004t9.execute-api.us-east-1.amazonaws.com/dev/events';

export const postEvents = data => {
  return axios({
    method: 'POST',
    url: API_URL,
    data
  });
};

export const getEvents = query => {
  return axios({
    method: 'GET',
    url: API_URL,
    query
  });
};

export default {
  postEvents,
  getEvents
}
