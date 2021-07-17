import React, { createContext, useReducer } from 'react';

// 创建context
export const ListStateContext = createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    case 'allCurrentPage':
      return {
        ...state,
        selectCurrentPage: action.value
      }
    case 'allPage':
      return {
        ...state,
        selectAll: action.value
      }
    case 'setList':
      return {
        ...state,
        listData: action.value
      }
    case 'addList':
      return {
        ...state,
        listData:[...state.listData, ...action.value]
      }
    default:
      return state;
  }
}
const initState = {
  selectCurrentPage: false,
  selectAll: false,
  listData: []
}

/**
 * 创建一个 ListState 组件
 * ListState 组件包裹的所有子组件都可以通过调用 ListStateContext 访问到 value
 */
export const ListState = props => {
  const [listState, dispatch] = useReducer(reducer, initState)
  return (
    <ListStateContext.Provider value={{ listState, dispatch }}>
      {props.children}
    </ListStateContext.Provider>
  )
}

