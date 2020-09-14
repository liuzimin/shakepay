import axios from 'axios';
import { CURRENT_RATES, CAD_TO_BTC_RATES_HISTORY, CAD_TO_ETH_RATES_HISTORY } from '../Urls';

export const getCurrentRates = (
  callback = () => {},
  errorCallback = () => {}
) => {
  axios
    .get(CURRENT_RATES)
    .then((result) => {
      callback(result.data);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

export const getCadToBtcRatesHistory = (
  callback = () => {},
  errorCallback = () => {}
) => {
  axios
    .get(CAD_TO_BTC_RATES_HISTORY)
    .then((result) => {
      callback(result.data);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

export const getCadToEthRatesHistory = (
  callback = () => {},
  errorCallback = () => {}
) => {
  axios
    .get(CAD_TO_ETH_RATES_HISTORY)
    .then((result) => {
      callback(result.data);
    })
    .catch((error) => {
      errorCallback(error);
    });
};
