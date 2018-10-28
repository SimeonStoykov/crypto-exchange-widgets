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

    getTickers() {
        if (Object.keys(this.props.tickersData).length > 0) {
            return (
                <React.Fragment>
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
                            let currency = pair.substr(3, 3);
                            let dailyChangeClass = currentTickerData.dailyChange < 0 ? 'lower' : 'higher';
                            let dailyChangePercent = Math.abs(currentTickerData.dailyChange * 100);
                            dailyChangePercent = Math.round(dailyChangePercent * 100) / 100;
                            return (
                                <div key={pair} className="ticker-data-wrapper">
                                    <div className="ticker-data-row">{coin}</div>
                                    <div className="ticker-data-row">{currentTickerData.lastPrice} <span className="ticker-currency">{currency}</span></div>
                                    <div className={`ticker-data-row ${dailyChangeClass}`}>{dailyChangePercent + '%'}</div>
                                    <div className="ticker-data-row">{Math.round(currentTickerData.volume)}</div>
                                </div>
                            );
                        })
                    }
                </React.Fragment>
            );
        }

        return 'Loading Tickers...';
    }

    render() {
        return (
            <div className="tickers">
                <h3 className="tickers-title">TICKERS</h3>
                {this.getTickers()}
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

export default connect(
    mapStateToProps
)(Ticker);