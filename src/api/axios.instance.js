
import axios from 'axios'


const baseUrl = process.env.REACT_APP_SERVER_BASE_URL

export const Axios = axios.create({
   baseURL: baseUrl,
});