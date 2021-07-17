import React, { useEffect, useState, useCallback, useContext, useRef} from 'react';
import { Checkbox } from 'antd';
import List from '../../components/List'
import SwitchType from '../../components/SwitchType';
import { getData } from '../../utils/data';
import { ListStateContext } from '../../store/ListState';
import './index.scss';

export default function Demo4() {
  const [toBottom, setToBottom] = useState(false);
  const currentListData = useRef([]);
  const { listState, dispatch: dispatchListState } = useContext(ListStateContext);

  const handleToBottom = useCallback((isToBottom) => {
    setToBottom(isToBottom);
  }, [])

  const loadMore = () => {
    getData(20).then(res => {
      if (res.length) {
        dispatchListState({type:'addList', value:res})
      }
    })
  }

  const onSelectCurrentPage = useCallback((event) => {
    const checked = event.target.checked;
    const result = currentListData.current.map(item=>{
      return {
        ...item,
        checked:checked,
      }
    })
    dispatchListState({type:'setList',value:result});
    dispatchListState({ type: 'allCurrentPage', value: checked });
   
  }, [dispatchListState]);

  const onSelectAll = useCallback((event) => {
    const checked = event.target.checked;
    dispatchListState({ type: 'allPage', value: checked })
  }, [dispatchListState]);

  useEffect(() => {
    getData(20).then(res => {
      dispatchListState({type:'setList', value:res})
    })
  }, [dispatchListState])

  useEffect(() => {
    setToBottom(false);
  }, [listState.listData])

  // 缓存全选状态切换时当前列表数据
  useEffect(()=>{
    currentListData.current = listState.listData
  },[listState.listData, listState.selectCurrentPage])

  // 当前页全选状态切换（这里有问题啦）
  useEffect(()=>{
   
  },[dispatchListState, listState.selectCurrentPage])

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
      <SwitchType></SwitchType>
    </div>
  )
}