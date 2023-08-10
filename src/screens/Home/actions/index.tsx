import axios from 'axios';

export const fetchDetailuser = async (data: any) => {
  return await axios
    .get('https://sandbox-pay.hyfen.gg/api/v1/user', {
      headers: {
        Authorization: `Bearer ${data}`,
      },
    })
    .then(res => {
      console.log(res.data, '<<<res detail user');
      return res.data;
    });
};
