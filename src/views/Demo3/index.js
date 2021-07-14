import React, { useEffect, useState, useCallback ,useRef} from 'react';
import './index.scss';
import axios from 'axios';
import List from './components/list';

export default function Demo3() {
  const [selectList, setSelectList] = useState([]);
  const [isSelectAllByChild, setIsSelectAllByChild] = useState({checked:false,from:null});
  const [isSelectAllByParent, setIsSelectAllByParnet] = useState({checked:false, from:null});
  const [listData, setListData] = useState([]);

  const handleSelectAllChange = useCallback(event => {
    setIsSelectAllByParnet(()=>{
      return {
        from:null,
        checked:event.target.checked
      }
    })
  }, []);
  const childSelectAll =useCallback((isSelectAll)=>{
    // setIsSelectAll(isSelectAll)
    console.log(isSelectAll)
    const res = {
      checked:isSelectAll,
      from:'child',
    }
    setIsSelectAllByParnet(res);
  },[])
  useEffect(() => {
    axios.get('./data.json').then(res => {
      console.log(res.data, '--')
      setListData(res.data);
    })
  }, [])
  const getSelectIds = useCallback((list) => {
    // setSelectList(list);
  }, [])
  useEffect(()=>{
    console.log(11111)

  },[isSelectAllByChild.checked])

  return (
    <div className="table-layout">
      <input type="checkbox" name="" value={""} checked={isSelectAllByParent.checked} className="inputForm" onChange={handleSelectAllChange} />
      <List getSelectIds={getSelectIds} listData={listData} isSelectAllByParent={isSelectAllByParent} childSelectAll={childSelectAll}/>
    </div>
  )
}