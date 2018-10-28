export function generateTickerSubscribeMsg(pair) {
    return JSON.stringify({
        event: 'subscribe',
        channel: 'ticker',
        symbol: `t${pair}`
    });
}