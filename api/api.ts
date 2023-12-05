import axios, { type AxiosResponse } from 'axios'
import moment from 'moment';

const instance = axios.create()

export type DataFormat = {
  x: number;
  y: number;
}

export default async function getOHLCV(
  symbol: string,
  startTime: number,
  endTime: number,
): Promise<DataFormat[]> {
  if (
    symbol === undefined ||
    startTime === undefined ||
    !Number.isInteger(startTime)
  ) {
    throw new Error('Wrong parameters')
  }

  
  endTime = Number.isInteger(endTime) ? endTime * 1000 : moment().unix() * 1000;
  startTime *= 1000;
  
  console.log(symbol, startTime, endTime)

  const period: number = calcDaysBetweenDates(startTime, endTime);

  console.log(period)
  const emptyArray: number[] = getEmptyArrayByDays(period)

  const promises = []
  for (let i = 1; i <= emptyArray.length; i++) {
    const start = moment().subtract(i, 'days').unix() * 1000;
    promises.push(instance.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&startTime=${start}&endTime=${endTime}`,
    ))
  
    endTime = start;
  }

  const res: AxiosResponse<number[][]>[] = await Promise.all(promises);
  const array: number[][] = res.map((i) => i.data).flat()
  const ohlcv: DataFormat[] = array
    .map((i: number[]) => /*[i[0], i[1], i[2], i[3], i[4]]*/({
      x: i[0],
      y: i[2]
    }))
    .sort((a, b) => a.x - b.x)

  return ohlcv;
}

function calcDaysBetweenDates(startTime: number, endTime: number): number {
  const difference = endTime - startTime;
  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

  return daysDifference
}

function getEmptyArrayByDays(count: number): number[] {
  const res: number[] = [];
  for (let i = 1; i <= count; i++) {
    res.push(i);
  }

  return res;
}

