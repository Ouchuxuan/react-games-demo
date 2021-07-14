import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.scss';
const data = [
  {
    id: 1,
    name: '1'
  },
  {
    id: 2,
    name: '2'
  },
  {
    id: 3,
    name: '3'
  },
]
export default function List(props) {
  const { getSelectIds, listData, isSelectAllByParent, childSelectAll } = props;
  const [renderList, setRenderData] = useState([]);
  const changeStatus = useRef();
  const handleChange = useCallback(event => {
    const id = event.target.id;
    const checked = event.target.checked;
    setRenderData(list => {
      const res = list.map(item => {
        if (item.id == id) {
          return {
            ...item,
            checked,
          };
        }
        return item;
      });
      console.log('0000', res,id, checked)
      getSelectIds(res.filter(item => item.checked));
      const count = res.filter(item => item.checked).length;
      if (count === list.length) {
        changeStatus.current = 'child'
        childSelectAll(true);
      } else {

       changeStatus.current = 'child'
        childSelectAll(false);
      }
      return res;
    });
  }, [getSelectIds, childSelectAll]);
  useEffect(() => {
    setRenderData(list => {
      return listData?.map(item => {
        return {
          ...item,
          checked: false,
        }
      })
    })
  }, [listData])

  useEffect(() => {
    console.log('00isSelectAllByParent', isSelectAllByParent)
      if(isSelectAllByParent.from === 'child') return;
      const checked = isSelectAllByParent.checked;
      const renderList = listData.map(item => {
        return {
          ...item,
          checked,
        };
      });
      setRenderData(()=>{
        return renderList
      })
      getSelectIds(renderList.filter(item => item.checked));

  }, [listData, getSelectIds, isSelectAllByParent.checked]);

  return (
    <div className="listlayout">
      {
        renderList?.map(item => {
          return (
            <div key={item.id}>
              <input type="checkbox" name="" value={""} id={item.id} checked={item.checked} className="inputForm" onChange={handleChange} />{item.time}
            </div>
          )
        })
      }
    </div>
  )
}