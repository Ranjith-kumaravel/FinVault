<<<<<<< HEAD
import axios from "axios";

//const API = "[localhost](http://localhost:5001)";

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
  return axios.get(
    `${API}/balance/${accountNumber}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const deposit = (
  accountNumber,
  amount
) => {
  return axios.post(
    `${API}/deposit`,
    {
      accountNumber,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const withdraw = (
  accountNumber,
  amount
) => {
  return axios.post(
    `${API}/withdraw`,
    {
      accountNumber,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const getAccount = (
  accountNumber
) => {
  return axios.get(
    `${API}/account/${accountNumber}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const transferMoney = (data) => {
  return axios.post(
    `${API}/transfer`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};
=======
import axios from "axios";

//const API = "[localhost](http://localhost:5001)";

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
  return axios.get(
    `${API}/balance/${accountNumber}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const deposit = (
  accountNumber,
  amount
) => {
  return axios.post(
    `${API}/deposit`,
    {
      accountNumber,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const withdraw = (
  accountNumber,
  amount
) => {
  return axios.post(
    `${API}/withdraw`,
    {
      accountNumber,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const getAccount = (
  accountNumber
) => {
  return axios.get(
    `${API}/account/${accountNumber}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};

export const transferMoney = (data) => {
  return axios.post(
    `${API}/transfer`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
};
>>>>>>> 72013941db107fbe5324f851cececbb36dff5b68
