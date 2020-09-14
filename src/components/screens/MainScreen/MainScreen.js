import React, { useEffect, useState } from 'react';
import styles from './MainScreen.module.css';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { cadFormatter } from '../../../utils/cadFormatter';
import LineChart from '../../common/LineChart/LineChart';
import { getTransactionHistory } from '../../../apis/Transactions/Transactions';
import {
  getCadToBtcRatesHistory,
  getCadToEthRatesHistory,
} from '../../../apis/Rates/Rates';

const emptyDataMax = {
  labels: [],
  datasets: [
    {
      label: 'CAD',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      legend: 'CAD',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [],
    },
  ],
};

const MainScreen = () => {
  const [cadToBtcRatesHistory, setCadToBtcRatesHistory] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState(null);
  const [dataMax, setDataMax] = useState(emptyDataMax);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    getCadToBtcRatesHistory(
      (cadToBtcRatesHistory) => {
        setCadToBtcRatesHistory(cadToBtcRatesHistory);
        getCadToEthRatesHistory((cadToEthRatesHistory) => {
          let currCadToBtcI = 0;
          let currCadToEthI = 0;
          let currCadToBtcRate = 0;
          let currCadToEthRate = 0;

          getTransactionHistory(
            (transactionHistory) => {
              transactionHistory.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
              cadToBtcRatesHistory.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
              cadToEthRatesHistory.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );

              setTransactionHistory(transactionHistory);

              let currNetWorth = 0;
              let cadAmt = 0;
              let btcAmt = 0;
              let ethAmt = 0;
              let newData = transactionHistory.map((transaction) => {
                let transactionDate = new Date(transaction.createdAt);
                while (
                  currCadToBtcI < cadToBtcRatesHistory.length &&
                  transactionDate >=
                    new Date(cadToBtcRatesHistory[currCadToBtcI].createdAt)
                ) {
                  currCadToBtcRate =
                    cadToBtcRatesHistory[currCadToBtcI].midMarketRate;
                  currCadToBtcI++;
                }

                while (
                  currCadToEthI < cadToEthRatesHistory.length &&
                  transactionDate >=
                    new Date(cadToEthRatesHistory[currCadToEthI].createdAt)
                ) {
                  currCadToEthRate =
                    cadToEthRatesHistory[currCadToEthI].midMarketRate;
                  currCadToEthI++;
                }

                if (transaction.direction === 'credit') {
                  if (transaction.currency === 'CAD') {
                    cadAmt += transaction.amount;
                  } else if (transaction.currency === 'BTC') {
                    btcAmt += transaction.amount;
                  } else if (transaction.currency === 'ETH') {
                    ethAmt += transaction.amount;
                  }
                } else if (transaction.direction === 'debit') {
                  if (transaction.currency === 'CAD') {
                    cadAmt -= transaction.amount;
                  } else if (transaction.currency === 'BTC') {
                    btcAmt -= transaction.amount;
                  } else if (transaction.currency === 'ETH') {
                    ethAmt -= transaction.amount;
                  }
                } else if (transaction.type === 'conversion') {
                  if (
                    transaction.from.currency === 'CAD' &&
                    transaction.to.currency === 'BTC'
                  ) {
                    cadAmt -= transaction.from.amount;
                    btcAmt += transaction.to.amount;
                  } else if (
                    transaction.from.currency === 'CAD' &&
                    transaction.to.currency === 'ETH'
                  ) {
                    cadAmt -= transaction.from.amount;
                    ethAmt += transaction.to.amount;
                  } else if (
                    transaction.from.currency === 'BTC' &&
                    transaction.to.currency === 'CAD'
                  ) {
                    btcAmt -= transaction.from.amount;
                    cadAmt += transaction.to.amount;
                  } else if (
                    transaction.from.currency === 'ETH' &&
                    transaction.to.currency === 'CAD'
                  ) {
                    ethAmt -= transaction.from.amount;
                    cadAmt += transaction.to.amount;
                  }
                }

                currNetWorth =
                  cadAmt +
                  btcAmt * currCadToBtcRate +
                  ethAmt * currCadToEthRate;

                return {
                  x: new Date(transaction.createdAt),
                  y: currNetWorth,
                };
              });

              setDataMax({
                ...dataMax,
                labels: transactionHistory.map((transaction) =>
                  new Date(transaction.createdAt).toLocaleString()
                ),
                datasets: [
                  {
                    ...dataMax.datasets[0],
                    data: newData,
                  },
                ],
              });
              setNetWorth(currNetWorth);
            },
            (error) => {
              console.error('Transaction History', error);
            }
          );
        });
      },
      (error) => {
        console.error('Cad To Btc Rates History', error);
      }
    );
  }, []);

  return (
    <Container>
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        spacing={4}
        className={styles.root}
      >
        {cadToBtcRatesHistory === null || transactionHistory === null ? (
          <Grid item>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item>
              <Typography variant='h3' className={styles.underlineText}>
                Personal Net Worth
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h4'>{cadFormatter(netWorth)}</Typography>
            </Grid>
            <Grid item>
              <LineChart
                data={dataMax}
                options={{
                  scales: {
                    xAxes: [
                      {
                        type: 'time',
                        time: {
                          displayFormats: {
                            quarter: 'MMM YYYY',
                          },
                        },
                      },
                    ],
                  },
                }}
                width={900}
                height={550}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default MainScreen;
