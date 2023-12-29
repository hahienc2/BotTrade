const ccxt = require ('ccxt');
const moment = require('moment');
//import delay from 'delay';

const binance = new ccxt.binance({
    'apiKey': 'CxplRSa46TBbaXFN6M0pOx7BmpLx30ubQs369Kuz9Wat5jz7nSyiK553UblZmZJU',
    'secret':'yRRRZgXSWWuvtpz9riRHnCSpXTFHe2d36LJFNJbtx2yi974oiE2lqdhCvXRAvV1n',
});


binance.setSandboxMode(true);

async function printBalance(usdtPrice){
    const balance = await binance.fetchBalance();
    const total = balance.total;
    console.log(`Balance: XRP ${total.XRP},USDT: ${total.USDT}`);
    console.log(`Total USDT: ${(total.XRP - 1) * usdtPrice +total.USDT}.\n`);

}

async function tick(){
    const price = await binance.fetchOHLCV('XRP/USDT','1m',undefined,5);
   // console.log(price);
    const bPrice = price.map(price =>{
        return {
            timestamp : moment(price[0]).format(),
            open : price[1], high : price[2], low : price[3], close : price[4], volum : price[5]
        }
    });

    const averagePrice = bPrice.reduce((acc,price) => acc + price.close, 0) / 5;
    const lastPrice = bPrice[bPrice.length - 1].close;
    console.log(bPrice.map(p => p.close), averagePrice, lastPrice)

    var isBuy = false;
    const direction = lastPrice > averagePrice ? isBuy = false:isBuy = true;
    const TRADE_SIZE = 1;
    const quantity = (TRADE_SIZE/lastPrice) +'';
    console.log(`Avetage price: ${averagePrice}. Last price: ${lastPrice}`)


   //await binance.createLimitBuyOrder('BTC/USDT',1, 42000);
   // await binance.createLimitBuyOrder ('XRP/USDT', 20, 0.7);
  if(isBuy) await binance.createMarketBuyOrder('XRP/USDT',20,lastPrice);
   else await binance.createMarketSellOrder('XRP/USDT',20,lastPrice);
     console.log(`${moment().format()}:${direction}${quantity} XRP at ${lastPrice}`);

     printBalance(lastPrice);

    // console.log(order);
    //console.log(bPrice);
}

async function main(){
    tick();
// while(true){
//     bar();
//     await tick();
//     await delay(60*1000);
//     baz();
// }


}
main();
//printBalance();