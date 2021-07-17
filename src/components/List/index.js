import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { Checkbox } from 'antd';
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
  const { onScroll } = props;
  const { listState, dispatch: dispatchListState } = useContext(ListStateContext);
  const onListScroll = () => {
    const isToBottom = toBottom(scrollContainer.current, scrollDom.current);
    onScroll(isToBottom);
  }
  const onCheckBoxChange = useCallback((event) => {
    const checked = event.target.checked;
    const id = event.target.id;
    const result = listState.listData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          checked: checked
        }
      } else {
        return item;
      }
    })
    console.log('---', result);
    dispatchListState({ type: 'setList', value: result });
  }, [dispatchListState, listState.listData])

  // 当前页全选状态切换
  useEffect(() => {
    // 这里被执行了
    let isNotAllChecked;
    if (listState.listData.length === 0) {
      isNotAllChecked = true;
    } else {
      isNotAllChecked = listState.listData.some(item => {
        return !item.checked
      })
    }
    console.log(1111, !isNotAllChecked);
    dispatchListState({ type: 'allCurrentPage', value: !isNotAllChecked })
  }, [dispatchListState, listState.listData]);
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