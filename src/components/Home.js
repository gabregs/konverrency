import React from 'react';
import currencies from '../utils/currencies';
import ShowRates from './ShowRates';
import { checkStatus, json } from '../utils/fetchHelper';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      base: 'USD',
      rates: [],
      amount: 1,
    };
  }

  baseChange = (event) => {
    this.setState({ base: event.target.value });
  };

  amountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  getRates = (event) => {
    event.preventDefault();
    let { base, amount } = this.state; // ES6 destructuring
    // make the AJAX request to Foreign exchange rates API to get a list of results
    fetch(`https://alt-exchange-rate.herokuapp.com/latest?base=${base}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        const rates = Object.keys(data.rates)
          .filter((currency) => currency !== base)
          .map((currency) => ({
            currency,
            rate: data.rates[currency] * amount,
            name: currencies[currency].name,
            symbol: currencies[currency].symbol,
          }));
        this.setState({ rates: rates });
      })
      .catch((error) => console.error(error.message));
  };

  render() {
    const { base, rates, amount } = this.state;

    return (
      <div className="container">
        <div
          className="card shadow-lg text-center text-white bg-dark mb-3"
          style={{ maxWidth: 288 }}
        >
          <div className="card-header">
            <h3>Exchange Rate</h3>
          </div>
          <div className="card-body">
            <form onSubmit={this.getRates}>
              <div className="input-group mb-3">
                <span className="input-group-text bg-info">Currency</span>
                <select
                  id="base"
                  value={base}
                  onChange={this.baseChange}
                  className="form-select"
                >
                  {Object.keys(currencies).map((eachCurrency) => (
                    <option key={eachCurrency} value={eachCurrency}>
                      {eachCurrency} ({currencies[eachCurrency].symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text bg-info" id="basic-addon1">
                  Amount
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1"
                  value={amount}
                  onChange={this.amountChange}
                />
              </div>
              <button type="submit" className="btn btn-outline-info">
                Show Rates
              </button>
            </form>
          </div>
        </div>

        <div className="card shadow-lg text-center text-white bg-dark">
          <table className="table table-dark table-striped table-bordered my-3">
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Name</th>
                <th scope="col">Curerncy</th>
                <th scope="col">Rate</th>
              </tr>
            </thead>
            <tbody>
              {console.log(rates)}
              {rates.map((rate) => {
                return (
                  <ShowRates key={rate.currency} rate={rate} symbol={rate} />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
