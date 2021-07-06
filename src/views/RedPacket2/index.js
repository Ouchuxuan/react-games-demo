import React, { useState, useEffect, useCallback, useRef } from 'react';
import CountDownLoading from './components/CountDownLoading';
import './index.scss';
import redPacket from './assets/redpacket.png';
import gold from './assets/gold.png';
const fallList = [
  {
    type: 0,
    speed: 0.1,
    rotateDeg: 0,
    rotateDirection: 0,
    hidden: false,
    x: 10,
    y: 0,
    id: 0,
    offsetY: 0
  },
  {
    type: 1,
    speed: 0.2,
    rotateDeg: 20,
    rotateDirection: 1,
    hidden: false,
    x: 10,
    y: 0,
    id: 1,
    offsetY: 0
  },

]

export default function RedPackets() {
  const [fallItemList] = useState(fallList);
  const animateId = useRef()
  const containerRef = useRef();
  const [containerSize, setContainerSize] = useState({ with: 0, height: 0 });
  const descItem = (item) => {
    const className = item.type === 0 ? 'red-packet' : 'gold';
    const src = item.type === 0 ? redPacket : gold;
    return (
      <img
        src={src}
        alt=""
        key={item.id}
        className={[className]}
        style={{
          "left": item.x,
          "top": item.y,
          "transform": [`translateY(${item.offsetY}px) rotateZ(${item.rotateDeg}deg)`]
        }}
      />)
  }
  // 旋转跳跃
  const move = useCallback(
    () => {
      const offsetStep = 1;
      // const rotateStep = 1;
      for (let i = 0; i < fallItemList.length; i++) {
        fallItemList[i] = {
          ...fallItemList[i],
          offsetY: fallItemList[i] + offsetStep
        }
      }
    },
    [fallItemList]
  )
  useEffect(() => {
    const { width, height } = containerRef.current.getBoundingClientRect();
    setContainerSize({ width, height })
  }, [containerSize.with, containerSize.height])


  useEffect(() => {
    animateId.current = window.requestAnimationFrame(move);
  }, [])

  
  return (<div className='red-packets-layout' ref={containerRef}>
    <CountDownLoading />
    <div className="fall-layout">
      {fallItemList.map(item => {
        if (item.type === 0) {
          return descItem(item)
        } else {
          return descItem(item);
        }
      })
      }
    </div>
  </div>)
}