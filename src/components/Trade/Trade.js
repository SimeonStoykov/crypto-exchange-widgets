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

    render() {
        return (
            <div className="trades">
                <h3>Trades BTC/USD</h3>
                <div>
                    <div className="trades-col">TIME</div>
                    <div className="trades-col">PRICE</div>
                    <div className="trades-col">AMOUNT</div>
                </div>
                {
                    this.props.tradesData.map(tr => {
                        let tradeTime = new Date(tr.milliseconds);
                        let utcTradeTime = new Date(tradeTime.getTime() + tradeTime.getTimezoneOffset() * 60000);
                        var seconds = utcTradeTime.getSeconds();
                        var minutes = utcTradeTime.getMinutes();
                        var hour = utcTradeTime.getHours();
                        return (
                            <div key={tr.id}>
                                <div className="trades-col">{`${hour}:${minutes}:${seconds}`}</div>
                                <div className="trades-col">{tr.price}</div>
                                <div className="trades-col">{tr.amount}</div>
                            </div>
                        );
                    })
                }
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