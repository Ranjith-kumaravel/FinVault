import axios from "axios";

const API = "http://localhost:5001";

export const signup = (data) => {
  return axios.post(`${API}/signup`, data);
};

export const login = (accountNumber, pin) => {
  return axios.post(`${API}/login`, {
    accountNumber,
    pin,
  });
};

export const getBalance = (accountNumber) => {
  return axios.get(`${API}/balance/${accountNumber}`);
};

export const deposit = (accountNumber, amount) => {
  return axios.post(`${API}/deposit`, {
    accountNumber,
    amount,
  });
};

export const withdraw = (accountNumber, amount) => {
  return axios.post(`${API}/withdraw`, {
    accountNumber,
    amount,
  });
};
export const getAccount = (accountNumber) => {
  return axios.get(
    `${API}/account/${accountNumber}`
  );
};