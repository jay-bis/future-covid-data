import axios from 'axios';

const API_URL = 'https://dbb7k004t9.execute-api.us-east-1.amazonaws.com/dev/events';

export const postEvents = data => {
  return axios({
    method: 'POST',
    url: API_URL,
    data
  });
};

export const getEvents = async query => {
  try {
    const resp = await axios.get(API_URL, {
      params: {
        maxlat: query.maxlat,
        maxlng: query.maxlng,
        minlat: query.minlat,
        minlng: query.minlng
      }
    });
    if (resp.data.errorMessage) {
      console.log(resp.errorMessage);
      return ([]);
    }
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  postEvents,
  getEvents
}
