import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = (props) => {
  return (
    <Line
      data={props.data}
      options={props.options}
      width={props.width}
      height={props.height}
    />
  );
};

export default LineChart;
