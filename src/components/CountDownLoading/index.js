import React, { } from 'react';
import './index.scss';
const totalTime = 20;
export default function CountDownLoading(props) {
  const getWidth = (countDownTime) => {
    return countDownTime/totalTime * 100 + '%';
  }
  return (
    <div className='countdown-loading-container'>
      <span>剩余</span>
      <div className="progress-wrapper">
        <div className='progress' style={{width:getWidth(props.countDownTime)}}></div>
      </div>
      <span>{props.countDownTime}s</span>
    </div>
  )
}