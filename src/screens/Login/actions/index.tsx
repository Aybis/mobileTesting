import axios from 'axios';

export const login = async ({
  email = '' as string,
  password = '' as string,
}) => {
  return await axios
    .post('https://sandbox-pay.hyfen.gg/api/v1/auth/login', {
      email: email,
      password: password,
    })
    .then(res => {
      return res;
    });
};

export const loginWithBiometric = async () => {
  return await axios
    .post('https://sandbox-pay.hyfen.gg/api/v1/auth/login', {
      email: 'andre@hyfen.gg',
      password: 'Andre23t',
    })
    .then(res => {
      return res;
    });
};
