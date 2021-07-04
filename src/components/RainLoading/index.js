import React from 'react';
import './index.scss';

export default function RainLoading(props){
  return(
    <div className='rain-loading-container'>
      {props.countDownTime} s 后红包雨开抢
    </div>
  )
}