import React, { useContext, useCallback } from 'react';
import Proptypes from 'proptypes'; 
import { Checkbox } from 'antd';
import { ListStateContext } from '../../store/ListState';
import './index.scss';
export default function SwitchType(props) {
  const {orderCount} = props;
  const { listState, dispatch: dispatchListState } = useContext(ListStateContext);
  const onSelectType = useCallback((event) => {
    const checked = event.target.checked;
    const id = event.target.id;
    let result;
    if (checked && id === "0") {
      result = false;
    }
    if (checked && id === "1") {
      result = true
    }
    dispatchListState({ type: "setSpecial", value: result });
  }, [dispatchListState]);
  return (
    <div className="switch-type-layout">
      <div className="switch-area">
        <div className="switch-item">
          <Checkbox className="check-box" id="0" checked={listState.isSpecial === false} onChange={onSelectType} />增值税电子普通发票<span>（单次开票上限10万）</span>
        </div>
        <div className="switch-item">
          <Checkbox className="check-box" id="1" checked={listState.isSpecial === true} onChange={onSelectType} />增值税专用发票<span>（单次开票上限100万）</span>
        </div>
      </div>
      <div className="select-info">
        已勾选<span>{orderCount}</span>笔订单，共<span>200</span>元
      </div>
    </div>
  )
}
SwitchType.defaultProps = {
  orderCount:0
}
SwitchType.propTypes = {
  orderCount:Proptypes.number
}