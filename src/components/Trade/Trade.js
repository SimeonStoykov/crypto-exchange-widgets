import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Trade.css';

class Trade extends Component {
    componentDidMount() {
        const { webSocket } = this.props;

        let msg = JSON.stringify({
            event: 'subscribe',
            channel: 'trades',
            symbol: 'tBTCUSD'
        });

        webSocket.addEventListener('open', () => webSocket.send(msg));
    }

    getTrades() {
        if (this.props.tradesData.length > 0) {
            return (
                <React.Fragment>
                    <div>
                        <div className="trades-col">TIME</div>
                        <div className="trades-col">PRICE</div>
                        <div className="trades-col">AMOUNT</div>
                    </div>
                    {
                        this.props.tradesData.map(tr => {
                            let tradeTime = new Date(tr.milliseconds);
                            let utcTradeTime = new Date(tradeTime.getTime() + tradeTime.getTimezoneOffset() * 60000);
                            let seconds = utcTradeTime.getSeconds();
                            let minutes = utcTradeTime.getMinutes();
                            let hour = utcTradeTime.getHours();
                            seconds < 10 && (seconds = '0' + seconds);
                            minutes < 10 && (minutes = '0' + minutes);
                            hour < 10 && (hour = '0' + hour);
                            let amountRowClass = tr.amount < 0 ? 'minus-trade' : 'plus-trade';
                            let amountToDisplay = Math.abs(Math.round(tr.amount * 10000) / 10000);

                            return (
                                <div key={tr.id} className={amountRowClass}>
                                    <div className="trades-col">{`${hour}:${minutes}:${seconds}`}</div>
                                    <div className="trades-col">{tr.price.toFixed(1)}</div>
                                    <div className="trades-col">{amountToDisplay.toFixed(4)}</div>
                                </div>
                            );
                        })
                    }
                </React.Fragment>
            );
        }

        return 'Loading Trades...';
    }

    render() {
        return (
            <div className="trades">
                <h3 className="trades-title">TRADES BTC/USD</h3>
                {this.getTrades()}
            </div>
        );
    }
}

Trade.propTypes = {
    tradesData: PropTypes.array
};

const mapStateToProps = state => {
    return {
        tradesData: state.tradeReducer.get('tradesData').toJS()
    };
}

// const mapDispatchToProps = dispatch => {
//     return {
//         setChannelInfo: data => dispatch(setChannelInfo(data)),
//         settradesData: data => dispatch(settradesData(data))
//     }
// };

export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(Trade);