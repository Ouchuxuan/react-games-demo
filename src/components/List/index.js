import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { Checkbox } from 'antd';
import { filterLimitList } from '../../utils'
import Proptypes from 'proptypes';
import { ListStateContext } from '../../store/ListState';
import './index.scss';
const toBottom = (scrollContainer, scrollDom) => {
  const scrollContainerHeight = scrollContainer.offsetHeight;
  const scrollTop = scrollContainer.scrollTop;
  const scrollDomHeight = scrollDom.offsetHeight;
  return (scrollDomHeight - scrollTop - scrollContainerHeight) <= 0;
}

export default function List(props) {
  const scrollContainer = useRef();
  const scrollDom = useRef();
  const currentListData = useRef([]);
  const currentSelectAll = useRef(false);
  const { onScroll } = props;
  const { listState, dispatch: dispatchListState } = useContext(ListStateContext);
  const onListScroll = () => {
    const isToBottom = toBottom(scrollContainer.current, scrollDom.current);
    onScroll(isToBottom);
  }
  const checkUnderLimit = useCallback((listData) => {
    let checkedLen = 0;
    let moneyCount = 0;
    listData.forEach(item => {
      if (item.checked) {
        checkedLen += 1;
        moneyCount += item.money * 100;
      }
    })
    moneyCount = moneyCount / 100;
    console.log('len:', checkedLen, 'moneyCOunt', moneyCount)
    if (checkedLen > 500) return false;
    const maxMoney = listState.isSpecial ? 1000000 : 100000;
    if (moneyCount > maxMoney) return false;
    return true;
  }, [listState.isSpecial])

  const onCheckBoxChange = useCallback((event) => {
    const checked = event.target.checked;
    const id = event.target.id;
    let result = listState.listData.map(item => {
      const isChecked = item.id === id ? checked : item.checked;
      return {
        ...item,
        checked: isChecked
      }
    })
    const isUnderLimit = checkUnderLimit(result);
    result = filterLimitList(result, isUnderLimit, {id, checked})
    let isNotAllChecked = false;
    if (listState.listData.length === 0) {
      isNotAllChecked = true;
    } else {
      listState.listData.forEach(item=>{
        if(!item.checked && !item.disable) {
          isNotAllChecked = true
        }
      })
    }
    if (listState.beenGetAllData) {
      dispatchListState({ type: 'allPage', value: isNotAllChecked });
    }
    dispatchListState({ type: 'setList', value: result });
  }, [checkUnderLimit, dispatchListState, listState.beenGetAllData, listState.listData])

  //缓存状态
  useEffect(() => {
    currentListData.current = listState.listData
    currentSelectAll.current = listState.selectAll
  }, [listState.listData, listState.selectAll])

  // 当前页全选状态切换
  useEffect(() => {
    let isNotAllChecked = false;
    if (listState.listData.length === 0) {
      isNotAllChecked = true;
    } else {
      listState.listData.forEach(item=>{
        if(!item.checked && !item.disable) {
          isNotAllChecked = true
        }
      })
    }
    dispatchListState({ type: 'allCurrentPage', value: !isNotAllChecked });
  }, [dispatchListState, listState.listData]);

  // 单个订单取消导致全选取消
  useEffect(() => {
    if (currentSelectAll.current) {
      let isNotAllChecked = false
      if (listState.listData.length === 0) {
        isNotAllChecked = true;
      } else {
        listState.listData.forEach(item=>{
          if(!item.checked && !item.disable) {
            isNotAllChecked = true
          }
        })
      }
      dispatchListState({ type: 'allPage', value: !isNotAllChecked });
    }
  }, [dispatchListState, listState.listData])

  return (
    <div className="list-layout" onScroll={onListScroll} ref={scrollContainer}>
      <div className="list-wrapper" ref={scrollDom}>
        {
          listState.listData.map(item => {
            return (
              <div className="list-item" key={item.id}>
                <Checkbox
                  className="check-box"
                  checked={item.checked}
                  onChange={onCheckBoxChange}
                  id={item.id}
                  disabled={item.disable}
                />
                <div className="list-item-detail">
                  {item.name}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
// List.defaultProps = {
//   dataSource: []
// }
List.propTypes = {
  onScroll: Proptypes.func,
}