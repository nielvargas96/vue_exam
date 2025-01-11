import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://api.test.com',
});

export const api_pwnedpasswords = axios.create({
  baseURL: 'https://api.pwnedpasswords.com/range/',
});

export const otp_api = axios.create({
  baseURL: 'https://dummyjson.com/c/'
})
