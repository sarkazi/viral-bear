
import axios from 'axios'


const baseUrl = process.env.REACT_APP_SERVER_BASE_URL
const trelloApiKey = process.env.REACT_APP_TRELLO_API_KEY
const trelloApiToken = process.env.REACT_APP_TRELLO_API_TOKEN

export const trelloInstance = axios.create({
   baseURL: 'https://api.trello.com',
   params: {
      key: trelloApiKey,
      token: trelloApiToken,
   }

});