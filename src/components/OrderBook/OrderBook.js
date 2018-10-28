import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './OrderBook.css';

class OrderBook extends Component {
  componentDidMount() {
    const { webSocket } = this.props;

    let msg = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: 'tBTCUSD',
      prec: 'P0',
      freq: 'F0'
    });

    webSocket.addEventListener('open', () => webSocket.send(msg));
  }

  getBids() {
    if (this.props.orderBookData.bids.length > 0) {
      return (
        <div className="order-book-list">
          <div>
            <div className="order-book-col">COUNT</div>
            <div className="order-book-col">AMOUNT</div>
            <div className="order-book-col">PRICE</div>
          </div>
          {
            this.props.orderBookData.bids.map((el, index) => {
              return (
                <div key={index} className="order-book-row">
                  <div className="order-book-col">{el.count}</div>
                  <div className="order-book-col">{el.amount}</div>
                  <div className="order-book-col">{el.price}</div>
                </div>
              );
            })
          }
        </div>
      );
    }

    return <div className="loading-order-book">Loading Bids...</div>;
  }

  getAsks() {
    if (this.props.orderBookData.asks.length > 0) {
      return (
        <div className="order-book-list">
          <div>
            <div className="order-book-col">PRICE</div>
            <div className="order-book-col">AMOUNT</div>
            <div className="order-book-col">COUNT</div>
          </div>
          {
            this.props.orderBookData.asks.map((el, index) => {
              return (
                <div key={index} className="order-book-row">
                  <div className="order-book-col">{el.price}</div>
                  <div className="order-book-col">{Math.abs(el.amount)}</div>
                  <div className="order-book-col">{el.count}</div>
                </div>
              );
            })
          }
        </div>
      );
    }

    return <div  className="loading-order-book">Loading Asks...</div>;
  }

  render() {
    return (
      <div className="order-book">
        <h3 className="order-book-title">Order Book - BTC/USD</h3>
        {this.getBids()}
        {this.getAsks()}
      </div>
    );
  }
}

OrderBook.propTypes = {
  orderBookData: PropTypes.object
};

const mapStateToProps = state => {
  return {
    orderBookData: state.orderBookReducer.get('orderBookData').toJS()
  };
}

export default connect(
  mapStateToProps,
)(OrderBook);