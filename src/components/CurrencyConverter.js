import React from 'react';
import currencies from '../utils/currencies';
import { checkStatus, json } from '../utils/fetchHelper';
import Chart from 'chart.js';

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    // const params = new URLSearchParams(props.location.search);
    this.state = {
      currencyA: 'USD',
      amountA: '1',
      rate: '0.84',
      currencyB: 'EUR',
      amountB: 1 * 0.84,
    };
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { currencyA, currencyB } = this.state;
    this.getRate(currencyA, currencyB);
    this.getHistoricalRates(currencyA, currencyB);
  }

  getRate = (a, b) => {
    fetch(`https://api.exchangeratesapi.io/latest?base=${a}&symbols=${b}`)
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

  getHistoricalRates = (a, b) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    fetch(
      `https://api.exchangeratesapi.io/history?start_at=${startDate}&end_at=${endDate}&base=${a}&symbols=${b}`
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map((rate) => rate[b]);
        const chartLabel = `${a}/${b}`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch((error) => console.error(error.message));
  };

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext('2d');

    if (typeof this.chart !== 'undefined') {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
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
    this.getHistoricalRates(currencyA, this.state.currencyB);
  };

  currencyBChange = (event) => {
    const currencyB = event.target.value;
    this.setState({ currencyB });
    this.getRate(this.state.currencyA, currencyB);
    this.getHistoricalRates(this.state.currencyA, currencyB);
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
    const { currencyA, amountA, amountB, currencyB } = this.state;

    const currencyChoices = Object.keys(currencies).map((eachCurrency) => (
      <option key={eachCurrency} value={eachCurrency}>
        {eachCurrency}
      </option>
    ));

    return (
      <React.Fragment>
        <div className="card shadow-lg text-white bg-dark mb-3">
          <div className="card-header text-center">
            <h3>Currency Converter</h3>
          </div>

          <div className="card-body">
            <form>
              <div className="row">
                <label className="form-label">
                  {currencies[currencyA].name}
                </label>
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
                <label className="form-label">
                  {currencies[currencyB].name}
                </label>
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
            <div className="accordion mt-3 text-info bg-light">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Historical Graph
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accodrion-collapse collapse"
                  aria-labelledby="headingOne"
                >
                  <div className="accordion-body">
                    <canvas ref={this.chartRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CurrencyConverter;
