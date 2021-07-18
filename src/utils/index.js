// 对超过了限制的数据进行标记构造
export const initSelectList = (listData, selectOpt) => {
  const maxMoney = selectOpt.isSpecial ? 1000000 : 100000;
  const maxLen = 500;
  let moneyCount = 0;
  const reslut = [];
  if (!selectOpt.checked) {
    return listData;
  }
  listData.forEach((item, index) => {
    moneyCount += item.money * 100;
    if ((moneyCount / 100 <= maxMoney )&& (index + 1) <= maxLen) {
      reslut.push({
        ...item,
        checked: true,
        disable: false
      })
    } else {
      reslut.push({
        ...item,
        checked: false,
        disable: true,
      })
    }
  })
  return reslut
}

export const filterLimitList = (listData, isUnderLimit, filterOpt) => {
  let filterList = [];
  console.log(1)
  if (isUnderLimit === false) {
    console.log(2)
    filterList = listData.map(item => {
      if (filterOpt.id && item.id === filterOpt.id) {
        return {
          ...item,
          checked: false,
          disable: true,
        }
      } else {
        // 这里有问题啊
        // if (!item.checked) {
        //   return {
        //     ...item,
        //     disable: true
        //   }
        // } else {
        //   return item;
        // }
        console.log('22222')
        if (!item.checked) {
          return {
            ...item,
            disable: true
          }
        } else {
          return item;
        }

      }
    })
  } else {
    filterList = listData.map(item => {
      if (filterOpt.id && item.id === filterOpt.id) {
        return {
          ...item,
          checked: filterOpt.checked
        }
      } else {
        const isDisable = !item.checked ? false : item.disable;
        return {
          ...item,
          disable: isDisable
        }
      }
    })
  }
  return filterList;
}