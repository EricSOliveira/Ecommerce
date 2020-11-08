import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333'
  //baseURL: 'https://pastebin.com/raw/8t83iHMc'
  //baseURL: 'https://jsonplaceholder.typicode.com/posts/'
})

export default api;