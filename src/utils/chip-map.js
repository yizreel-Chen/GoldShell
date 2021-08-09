export default {
  KDBox(data, dataFormat) {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < data.length; i++) {
        if ((data[i].chipindex % 4 === 1 && j === 0) || (data[i].chipindex % 4 === 0 && j === 0)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 4 === 2 && j === 1) || (data[i].chipindex % 4 === 3 && j === 1)) dataFormat(i, j, 'push')
      }
    }
  },
  STCBox(data, dataFormat) {
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < data.length; i++) {
        if ((data[i].chipindex % 8 === 1 && j === 0) || (data[i].chipindex % 8 === 0 && j === 0)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 8 === 2 && j === 1) || (data[i].chipindex % 8 === 7 && j === 1)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 8 === 3 && j === 2) || (data[i].chipindex % 8 === 6 && j === 2)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 8 === 4 && j === 3) || (data[i].chipindex % 8 === 5 && j === 3)) dataFormat(i, j, 'push')
      }
    }
  },
  SBox(data, dataFormat) {
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < data.length; i++) {
        if ((data[i].chipindex % 8 === 1 && j === 0) || (data[i].chipindex % 8 === 0 && j === 0)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 8 === 2 && j === 1) || (data[i].chipindex % 8 === 7 && j === 1)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 8 === 3 && j === 2) || (data[i].chipindex % 8 === 6 && j === 2)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 8 === 4 && j === 3) || (data[i].chipindex % 8 === 5 && j === 3)) dataFormat(i, j, 'push')
      }
    }
  },
  HS5(data, dataFormat) {
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].chipindex >= 25) {
          if ((data[i].chipindex % 4 === 1 && j === 0) || (data[i].chipindex % 4 === 0 && j === 0)) dataFormat(i, j, 'unshift', 'space', 11)
          if ((data[i].chipindex % 4 === 2 && j === 1) || (data[i].chipindex % 4 === 3 && j === 1)) dataFormat(i, j, 'unshift', 'space', 11)
        } else {
          if ((data[i].chipindex % 4 === 2 && j === 2) || (data[i].chipindex % 4 === 3 && j === 2)) dataFormat(i, j, 'push')
          if ((data[i].chipindex % 4 === 1 && j === 3) || (data[i].chipindex % 4 === 0 && j === 3)) dataFormat(i, j, 'push')
        }
      }
    }
  },
  STCSE(data, dataFormat) {
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < data.length; i++) {
        if ((data[i].chipindex % 6 === 3 && j === 0) || (data[i].chipindex % 6 === 4 && j === 0)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 6 === 2 && j === 1) || (data[i].chipindex % 6 === 5 && j === 1)) dataFormat(i, j, 'push')
        if ((data[i].chipindex % 6 === 1 && j === 2) || (data[i].chipindex % 6 === 0 && j === 2)) dataFormat(i, j, 'push')
      }
    }
  }
}