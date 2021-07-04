import React, { } from 'react';
import './index.scss';

export default function CountDownLoading(props) {
  return (
    <div className='countdown-loading-container'>
      <span>剩余</span>
      <div className="progress">11</div>
      <span>{props.countDownTime}s</span>
    </div>
  )
}