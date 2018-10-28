import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Ticker.css';

import {
    generateTickerSubscribeMsg
} from '../../utils';

const TICKER_PAIRS = ['BTCUSD', 'ETHUSD', 'BCHUSD', 'XRPUSD', 'EOSUSD', 'LTCUSD', 'NEOUSD', 'XMRUSD', 'IOTUSD', 'OMGUSD'];

class Ticker extends Component {
    componentDidMount() {
        const { webSocket } = this.props;

        webSocket.addEventListener('open', () => {
            TICKER_PAIRS.forEach(pair => {
                webSocket.send(generateTickerSubscribeMsg(pair));
            });
        });
    }

    render() {
        return (
            <div className="tickers">
                <h1 className="tickers-title">Tickers</h1>
                <div className="ticker-header-wrapper">
                    <div className="ticker-header-row">NAME</div>
                    <div className="ticker-header-row">LAST</div>
                    <div className="ticker-header-row">24H</div>
                    <div className="ticker-header-row">VOL</div>
                </div>
                {
                    Object.keys(this.props.tickersData).map((pair) => {
                        let currentTickerData = this.props.tickersData[pair];
                        let coin = pair.substr(0, 3);
                        // let currency = pair.substr(3, 3);
                        return (
                            <div key={pair} className="ticker-data-wrapper">
                                <div className="ticker-data-row">{coin}</div>
                                <div className="ticker-data-row">{currentTickerData.lastPrice}</div>
                                <div className="ticker-data-row">{currentTickerData.dailyChange}</div>
                                <div className="ticker-data-row">{currentTickerData.volume}</div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

Ticker.propTypes = {
    tickersData: PropTypes.object
};

const mapStateToProps = state => {
    return {
        tickersData: state.tickerReducer.get('tickersData').toJS()
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
)(Ticker);