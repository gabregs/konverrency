import React from 'react';
import currencies from '../utils/currencies';
import { checkStatus, json } from '../utils/fetchHelper';

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyA: 'USD',
      amountA: '1',
      rate: '0.84',
      currencyB: 'EUR',
      amountB: 1 * 0.84,
    };
  }

  componentDidMount() {
    const { currencyA, currencyB } = this.state;
    this.getRate(currencyA, currencyB);
  }

  getRate = (a, b) => {
    fetch(
      `https://alt-exchange-rate.herokuapp.com/latest?base=${a}&symbols=${b}`
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log(data.rates);
        const rate = data.rates[b];
        this.setState({
          rate,
          amountA: 1,
          amountB: Number((1 * rate).toFixed(2)),
        });
      })
      .catch((error) => console.error(error.message));
  };

  toA(amount, rate) {
    return amount * (1 / rate);
  }
  toB(amount, rate) {
    return amount * rate;
  }

  convert(amount, rate, equation) {
    console.log(typeof amount);
    const input = parseFloat(amount);
    if (Number.isNaN(input)) {
      return '';
    }
    return equation(input, rate).toFixed(2);
  }

  currencyAChange = (event) => {
    const currencyA = event.target.value;
    this.setState({ currencyA });
    this.getRate(currencyA, this.state.currencyB);
  };

  currencyBChange = (event) => {
    const currencyB = event.target.value;
    this.setState({ currencyB });
    this.getRate(this.state.currencyA, currencyB);
  };

  amountAChange = (event) => {
    let { rate } = this.state;
    const amountB = this.convert(event.target.value, rate, this.toB);
    this.setState({
      amountA: event.target.value,
      amountB,
    });
  };

  amountBChange = (event) => {
    let { rate } = this.state;
    const amountA = this.convert(event.target.value, rate, this.toA);
    this.setState({
      amountB: event.target.value,
      amountA,
    });
  };

  render() {
    const { currencyA, amountA, amountB, rate, currencyB } = this.state;

    const currencyChoices = Object.keys(currencies).map((eachCurrency) => (
      <option key={eachCurrency} value={eachCurrency}>
        {eachCurrency}
      </option>
    ));

    return (
      <div className="card shadow-lg text-white bg-dark mb-3">
        <div className="card-header text-center">
          <h3>Currency Converter</h3>
        </div>

        <div className="card-body">
          <form>
            <div className="row">
              <label className="form-label">{currencies[currencyA].name}</label>
              <div className="col input-group mb-3">
                <select
                  value={currencyA}
                  onChange={this.currencyAChange}
                  className="form-select"
                >
                  {currencyChoices}
                </select>
              </div>
              <div className="col input-group mb-3">
                <span className="input-group-text bg-info" id="basic-addon1">
                  {currencies[currencyA].symbol}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0"
                  value={amountA}
                  onChange={this.amountAChange}
                />
              </div>
            </div>

            <div className="row">
              <label className="form-label">{currencies[currencyB].name}</label>
              <div className="col input-group mb-3">
                <select
                  value={currencyB}
                  onChange={this.currencyBChange}
                  className="form-select"
                >
                  {currencyChoices}
                </select>
              </div>
              <div className="col input-group mb-3">
                <span className="input-group-text bg-info" id="basic-addon1">
                  {currencies[currencyB].symbol}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0"
                  value={amountB}
                  onChange={this.amountBChange}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
