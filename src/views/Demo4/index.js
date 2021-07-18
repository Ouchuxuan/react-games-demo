import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { Checkbox } from 'antd';
import List from '../../components/List'
import SwitchType from '../../components/SwitchType';
import Loading from '../../components/Loading'
import { getData, recrusiveGetData } from '../../utils/data';
import { filterLimitList, initSelectList } from '../../utils'
import { ListStateContext } from '../../store/ListState';
import './index.scss';

export default function Demo4() {
  const [toBottom, setToBottom] = useState(false);
  const currentListData = useRef([]);
  const [loading, toggleLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const { listState, dispatch: dispatchListState } = useContext(ListStateContext);

  const handleToBottom = useCallback((isToBottom) => {
    setToBottom(isToBottom);
  }, [])

  const loadMore = () => {
    getData(20).then(res => {
      if (res.length) {
        const addList = res.map(item => {
          return {
            ...item,
            disable: false,
          }
        })
        let result = [...listState.listData, ...addList];
        const isUnderLimit = checkUnderLimit(result);
        console.log('isUnderLimit', isUnderLimit)
        result = filterLimitList(result, isUnderLimit, { checked: false })
        dispatchListState({ type: 'setList', value: result })
      }
    })
  }

  const checkUnderLimit = useCallback((listData) => {
    let checkedLen = 0;
    let moneyCount = 0;
    let isDisable = false
    listData.forEach(item => {
      if (item.checked) {
        checkedLen += 1;
        moneyCount += item.money * 100;
      }
      if (item.disable) {
        isDisable = true;
      }
    })
    if (isDisable) {
      return false;
    }
    moneyCount = moneyCount / 100;
    console.log('len:', checkedLen, 'moneyCOunt', moneyCount)
    if (checkedLen > 500) return false;
    const maxMoney = listState.isSpecial ? 1000000 : 100000;
    if (moneyCount > maxMoney) return false;
    return true;
  }, [listState.isSpecial])

  const onSelectCurrentPage = useCallback((event) => {
    const checked = event.target.checked;
    let result = currentListData.current.map(item => {
      return {
        ...item,
        checked: checked,
      }
    })
    result = initSelectList(result, { checked, isSpecial: listState.isSpecial });
    dispatchListState({ type: 'setList', value: result });
    dispatchListState({ type: 'allCurrentPage', value: checked });
    if (listState.beenGetAllData) {
      dispatchListState({ type: 'allPage', value: checked });
    }
  }, [dispatchListState, listState.beenGetAllData, listState.isSpecial]);

  const getAllData = useCallback((checked) => {
    toggleLoading(true);
    recrusiveGetData(600).then(res => {
      dispatchListState({ type: 'beenGetAll', value: true })
      let result = res.map(item => {
        return {
          ...item,
          checked: true,
          disable: false,
        }
      })
      result = initSelectList(result, { checked, isSpecial: listState.isSpecial });
      dispatchListState({ type: 'setList', value: result })
    }).finally(() => {
      toggleLoading(false);
    })
  }, [dispatchListState, listState.isSpecial])

  const onSelectAll = useCallback((event) => {
    const checked = event.target.checked;
    dispatchListState({ type: 'allPage', value: checked });
    if (!checked) {
      const result = currentListData.current.map(item => {
        return {
          ...item,
          checked: false,
          disable: false,
        }
      })
      dispatchListState({ type: 'setList', value: result })
    } else {
      getAllData(checked);
    }
  }, [dispatchListState, getAllData]);

  useEffect(() => {
    getData(20).then(res => {
      const result = res.map(item => {
        return {
          ...item,
          disable: false,
        }
      })
      dispatchListState({ type: 'setList', value: result })
    })
  }, [dispatchListState])

  useEffect(() => {
    setToBottom(false);
  }, [listState.listData])

  // 缓存全选状态切换时当前列表数据
  useEffect(() => {
    currentListData.current = listState.listData
  }, [listState.listData, listState.selectCurrentPage])

  // 普通发票和特殊发票切换
  useEffect(() => {
    // 首先看看是否达到限制状态
    // 再看看是否全选
    // 排除没有选择的情景
    // const hasAnyChecked = currentListData.current.some(item=>{
    //   return item.checked === true;
    // })
    // if(!hasAnyChecked) return;
    // 计算切换订单类型后是否达到限制
    let dataList = currentListData.current;
    const isUnderLimitAfterSwitch = checkUnderLimit(dataList);
    // 排除没有达到限制的情况
    if (isUnderLimitAfterSwitch) return;
    // 如果达到限制，从最小值开始删减订单，直到达到限制值
    const getUnderLimitList = (dataList) => {
      let reslutList = [];
      const _getUnderLimitList = (dataList) => {
        const isUnderLimit = checkUnderLimit(dataList);
        console.log(isUnderLimit)
        if (isUnderLimit === false) {
          const minMoneyId = dataList.sort((a, b) => a.money - b.money)[0].id;
          reslutList = dataList.map(item=>{
            if(item.id === minMoneyId){
              return {
                ...item,
                checked:false,
                disable:true
              }
            } else{
              return item
            }
          })
          _getUnderLimitList(reslutList);
        }
      }
      _getUnderLimitList(dataList)
      return reslutList;
    }

    const result = getUnderLimitList(dataList);
    dispatchListState({type:'setlist', value:result});
  }, [checkUnderLimit, dispatchListState, listState.isSpecial])

  // 计算订单选择总数
  useEffect(() => {
    const count = listState.listData.filter(item => item.checked).length;
    setOrderCount(count)
  }, [listState.listData])

  return (
    <div className="demo-layout">
      <div className="operation-bar">
        <div className="operation-item">
          <Checkbox className="check-box" checked={listState.selectCurrentPage} onChange={onSelectCurrentPage} />
          <div className="label">本页全选</div>
        </div>
        <div className="operation-item">
          <Checkbox className="check-box" checked={listState.selectAll} onChange={onSelectAll} />
          <div className="label">全部全选</div>
        </div>
      </div>
      <List onScroll={handleToBottom} />
      {toBottom && (<div className="load-more" onClick={loadMore}>加载更多</div>)}
      <SwitchType orderCount={orderCount}></SwitchType>
      {loading && <Loading></Loading>}
    </div>
  )
}