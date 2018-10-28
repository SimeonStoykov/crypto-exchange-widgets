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

  render() {
    // console.log(this.props.orderBookData);
    return (
      <div>
        <h1>Order Book</h1>
        <h3>Bids</h3>
        {
          this.props.orderBookData.bids.map((el, index) => {
            return (
              <div key={index}>count - {el.count} amount - {el.amount} price - {el.price}</div>
            );
          })
        }
        <h3>Asks</h3>
        {
          this.props.orderBookData.asks.map((el, index) => {
            return (
              <div key={index}>count - {el.count} amount - {el.amount} price - {el.price}</div>
            );
          })
        }
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

// const mapDispatchToProps = dispatch => {
//     return {
//         setChannelInfo: data => dispatch(setChannelInfo(data)),
//         setTickerData: data => dispatch(setTickerData(data))
//     }
// };

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(OrderBook);