import React from 'react';
import styles from './WelcomeScreen.module.css';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const WelcomeScreen = () => {
  const history = useHistory();

  return (
    <Container>
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        spacing={10}
        className={styles.root}
      >
        <Grid item>
          <img src={logo} alt='Girl in a jacket' width='300' height='300' />
        </Grid>
        <Grid item>
          <Button
            variant='outlined'
            onClick={() => {
              history.push('/net-worth');
            }}
          >
            <Typography variant='h4'>View net worth</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WelcomeScreen;
