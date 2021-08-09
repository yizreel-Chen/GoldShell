import BigNumber from "bignumber.js"
export default {
  //   数据格式化
  dataFormat(value, unit) {
    if (unit === 'H/s') {
      return new BigNumber(value).multipliedBy(1000000).toFixed(1)
    } else if (unit === 'KH/s') {
      return new BigNumber(value).multipliedBy(1000).toFixed(1);
    } else if (unit === 'MH/s') {
      return new BigNumber(value).toFixed(1);
    } else if (unit === 'GH/s') {
      return new BigNumber(value).dividedBy(1000).toFixed(1);
    } else if (unit === 'TH/s') {
      return new BigNumber(value).dividedBy(1000000).toFixed(1);
    } else if (unit === 'PH/s') {
      return new BigNumber(value).dividedBy(1000000000000000).toFixed(1);
    } else if (unit === 'EH/s') {
      return new BigNumber(value).dividedBy(1000000000000000000).toFixed(1);
    } else if (unit === 'ZH/s') {
      return new BigNumber(value).dividedBy(1000000000000000000000).toFixed(1);
    } else if (unit === 'YH/s') {
      return new BigNumber(value).dividedBy(1000000000000000000000000).toFixed(1);
    }
  },

  unitFormat(value) {
    let result
    if (value.length !== 0) {
      result = Math.max.apply(null, value)
    } else {
      return
    }
    result = result * 1000000
    if (result === 0) {
      return 'MH/s'
    } else if (result <= 1000) {
      return 'H/s'
    } else if (result <= 1000000) {
      return 'KH/s'
    } else if (result <= 1000000000) {
      return 'MH/s'
    } else if (result <= 1000000000000) {
      return 'GH/s'
    } else if (result <= 1000000000000000) {
      return 'TH/s'
    } else if (result <= 1000000000000000000) {
      return 'PH/s'
    } else if (result <= 1000000000000000000000) {
      return 'EH/s'
    } else if (result <= 1000000000000000000000000) {
      return 'ZH/s'
    } else if (result <= 10000000000000000000000000000) {
      return 'YH/s'
    }
  },

  hashrateConversion(data) {
    let value = new BigNumber(data).multipliedBy(1000000).toNumber()
    if (value < 10000) {
      return (value).toFixed(2) + ' H/s'
    } else if (value < 10000000) {
      return new BigNumber(value).dividedBy(1000).toFixed(2) + ' KH/s'
    } else if (value < 10000000000) {
      return new BigNumber(value).dividedBy(1000000).toFixed(2) + ' MH/s'
    } else if (value < 10000000000000) {
      return new BigNumber(value).dividedBy(1000000000).toFixed(2) + ' GH/s'
    } else if (value < 10000000000000000) {
      return new BigNumber(value).dividedBy(1000000000000).toFixed(2) + ' TH/s'
    } else if (value < 10000000000000000000) {
      return new BigNumber(value).dividedBy(1000000000000000).toFixed(2) + ' PH/s'
    } else if (value < 10000000000000000000000) {
      return new BigNumber(value).dividedBy(1000000000000000000).toFixed(2) + ' EH/s'
    } else if (value < 10000000000000000000000000) {
      return new BigNumber(value).dividedBy(1000000000000000000000).toFixed(2) + ' ZH/s'
    } else if (value < 10000000000000000000000000000) {
      return new BigNumber(value).dividedBy(1000000000000000000000000).toFixed(2) + ' YH/s'
    }
  },

  minute2string(m) {
    let d = Math.floor(m / 1440);
    m %= 1440;
    let h = Math.floor(m / 60);
    m %= 60;

    return d + 'd ' + h + 'h ' + m + 'm';
  }
}