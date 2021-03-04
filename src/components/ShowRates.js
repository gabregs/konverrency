import React from 'react';

const ShowRates = (props) => {
  const { currency, rate, name, symbol } = props.rate;

  return (
    <tr>
      <th scope="row">{symbol}</th>
      <td>{name}</td>
      <td>{currency}</td>
      <td>{rate.toFixed(2)}</td>
    </tr>
  );
};

export default ShowRates;
