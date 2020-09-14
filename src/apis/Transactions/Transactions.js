import axios from 'axios';
import { TRANSACTION_HISTORY } from '../Urls';

export const getTransactionHistory = (
  callback = () => {},
  errorCallback = () => {}
) => {
  axios
    .get(TRANSACTION_HISTORY)
    .then((result) => {
      callback(result.data);
    })
    .catch((error) => {
      errorCallback(error);
    });
};
