import { v4 as uuid } from 'uuid';
export const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export const getData = (count) => {
  return new Promise(resolve => {
    let list = [];
    for (let i = 0; i < count; i++) {
      const id = uuid();
      list.push({
        id,
        money: randomNum(10, 10000),
        name: id
      });
    }
    resolve(list);
  })
}

export const recrusiveGetData = (count) => {
  return new Promise(resolve => {
    let list = [];
    for (let i = 0; i < count; i++) {
      const id = uuid();
      list.push({
        id,
        money: randomNum(10, 10000),
        name: id
      });
    }
    setTimeout(()=>{
      resolve(list);
    }, 2000)
  })
}