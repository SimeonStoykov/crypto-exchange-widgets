import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ticker from './components/Ticker/Ticker';
import OrderBook from './components/OrderBook/OrderBook';
import PropTypes from 'prop-types';
import './App.css';

import {
  setChannelInfo
} from './actions/appActions';

import {
  setTickerData
} from './actions/tickerActions';

import {
  setOrderBookData
} from './actions/orderBookActions';

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
              if (mainData.length === 50) {
                let initialData = { bids: [], asks: [] };
                for (let i = 0; i < mainData.length; i++) {
                  const currentBookData = mainData[i];
                  const price = currentBookData[0];
                  const count = currentBookData[1];
                  const amount = currentBookData[2];

                  if (count > 0) {
                    amount > 0 && initialData.bids.push({price, count, amount});
                    amount < 0 && initialData.asks.push({price, count, amount});
                  }
                }

                this.props.setOrderBookData(initialData);
              } else if (mainData.length === 3) {

              }
              break;
            default:
              break;
          }
        }
      }

    });
  }

  render() {
    return (
      <React.Fragment>
        <Ticker webSocket={webSocket} />
        <OrderBook webSocket={webSocket} />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  channelsInfo: PropTypes.object,
  setChannelInfo: PropTypes.func,
  setTickerData: PropTypes.func,
  setOrderBookData: PropTypes.func
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
    setOrderBookData: data => dispatch(setOrderBookData(data))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
