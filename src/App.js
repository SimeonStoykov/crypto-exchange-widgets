import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ticker from './components/Ticker/Ticker';
import OrderBook from './components/OrderBook/OrderBook';
import Trade from './components/Trade/Trade';
import PropTypes from 'prop-types';
import './App.css';

import {
  setChannelInfo
} from './actions/appActions';

import {
  setTickerData
} from './actions/tickerActions';

import {
  setOrderBookData,
  updateOrderBookData,
  removeOrderBookData
} from './actions/orderBookActions';

import {
  setTradeData,
  updateTradeData
} from './actions/tradeActions';

const webSocket = new WebSocket('wss://api.bitfinex.com/ws/2');

class App extends Component {
  componentDidMount() {
    webSocket.addEventListener('message', (msg) => {
      let data = JSON.parse(msg.data);

      if (data && data.event && data.event === 'subscribed' && data.chanId && data.channel) {
        this.props.setChannelInfo({
          chanId: data.chanId,
          channelInfo: {
            pair: data.pair,
            type: data.channel
          }
        });
      } else if (Array.isArray(data) && data.length === 2 && data[1] !== 'hb') {
        const currentChannelId = data[0];
        const mainData = data[1];
        let currentChannel = this.props.channelsInfo[currentChannelId];

        if (currentChannel) {
          switch (currentChannel.type) {
            case 'ticker':
              this.props.setTickerData({
                pair: currentChannel.pair,
                tickerInfo: {
                  lastPrice: mainData[6],
                  dailyChange: mainData[5],
                  volume: mainData[7]
                }
              });
              break;
            case 'book':
              // Setting the snapshot order book data
              if (mainData.length === 50) {
                let initialData = { bids: [], asks: [] };
                for (let i = 0; i < mainData.length; i++) {
                  const currentBookData = mainData[i];
                  const price = Math.round(currentBookData[0] * 100) / 100;
                  const count = currentBookData[1];
                  const amount = currentBookData[2];

                  if (count > 0) {
                    amount > 0 && initialData.bids.push({ price, count, amount });
                    amount < 0 && initialData.asks.push({ price, count, amount });
                  }
                }

                this.props.setOrderBookData(initialData);
              } else if (mainData.length === 3) { // Updating existing order book data
                const price = Math.round(mainData[0] * 100) / 100;
                const count = mainData[1];
                const amount = mainData[2];

                if (count > 0) {
                  if (amount !== 0) {
                    let updatedPart = 'bids';
                    amount < 0 && (updatedPart = 'asks');
                    this.props.updateOrderBookData({ updatedPart, updatedData: { price, count, amount } });
                  } else if (count === 0 && (amount === 1 || amount === -1)) {
                    let partToRemoveFrom = 'bids';
                    amount === -1 && (partToRemoveFrom = 'asks');
                    this.props.removeOrderBookData({ partToRemoveFrom, removedPrice: price });
                  }
                }
              }
              break;
            case 'trades':
              let trades = [];

              for (let i = 0; i < mainData.length; i++) {
                const currentTrade = mainData[i];

                trades.push({
                  id: currentTrade[0],
                  milliseconds: currentTrade[1],
                  amount: currentTrade[2],
                  price: Math.round(currentTrade[3] * 10) / 10
                });

              }
              this.props.setTradeData(trades);
              break;
            default:
              break;
          }
        }
      } else if (Array.isArray(data) && data.length === 3) { // Update Trades
        const msgType = data[1];
        const tradeData = data[2];

        if (msgType === 'tu') {
          this.props.updateTradeData({
            id: tradeData[0],
            milliseconds: tradeData[1],
            amount: tradeData[2],
            price: Math.round(tradeData[3] * 10) / 10
          });
        }
      }

    });
  }

  render() {
    return (
      <div className="app">
        <Ticker webSocket={webSocket} />
        <OrderBook webSocket={webSocket} />
        <Trade webSocket={webSocket} />
      </div>
    );
  }
}

App.propTypes = {
  channelsInfo: PropTypes.object,
  setChannelInfo: PropTypes.func,
  setTickerData: PropTypes.func,
  setOrderBookData: PropTypes.func,
  updateOrderBookData: PropTypes.func,
  removeOrderBookData: PropTypes.func,
  setTradeData: PropTypes.func,
  updateTradeData: PropTypes.func
};

const mapStateToProps = state => {
  return {
    channelsInfo: state.appReducer.get('channelsInfo').toJS()
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setChannelInfo: data => dispatch(setChannelInfo(data)),
    setTickerData: data => dispatch(setTickerData(data)),
    setOrderBookData: data => dispatch(setOrderBookData(data)),
    updateOrderBookData: data => dispatch(updateOrderBookData(data)),
    removeOrderBookData: data => dispatch(removeOrderBookData(data)),
    setTradeData: data => dispatch(setTradeData(data)),
    updateTradeData: data => dispatch(updateTradeData(data))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
