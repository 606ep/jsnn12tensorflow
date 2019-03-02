function getNotIntNum(arr, num) {
  const prev = Math.floor(num);
  const part = num - prev;

  if (part < 0.00005 ) {
    return (arr[prev]);
  } else {
    return arr[prev] + (arr[prev + 1] - arr[prev] ) * part; 
  }
}

export function smartResizeArr(arr, newSize) {
  if (newSize == 0 ) {
    return [];
  }

  if (arr.length > newSize) {
    return arr.slice(arr.length - newSize, arr.length);
  } else {
    const ret = []
    const step = (arr.length - 1) / (newSize - 1)
    let num = 0;
    for (let i = 0; i < newSize; i ++) {
      ret.push(getNotIntNum(arr, num));
      num += step;
    }

    return ret;
  }
}


export function normalizeArr(arr) {
  const max = arr.reduce((accum, current) => {
    if (Math.abs(current) > accum) {
      return Math.abs(current);
    } else {
      return accum
    }
  }, 0);

  return arr.map(el => max ? el / max : 0);
}