import React, { useRef, useEffect, useState, useCallback } from 'react'
import './index.scss'
import pkg1 from '../../assets/1.png'
import pkg2 from '../../assets/2.png'
import pkg3 from '../../assets/3.png'
import pkg4 from '../../assets/4.png'
import pkg5 from '../../assets/5.png'

const pkgWidth = 64;
const pkgHeight = 64;

const imgSourceList = [{
  img: pkg1,
  x: 0,
  y: 0,
  speed: 0.04,
  id: 0
}, {
  img: pkg2,
  x: 60,
  y: 0,
  speed: 0.4,
  id: 1
}, {
  img: pkg3,
  x: 120,
  y: 0,
  speed: 0.2,
  id: 2
}, {
  img: pkg4,
  x: 180,
  y: 0,
  speed: 0.3,
  id: 3
}, {
  img: pkg5,
  x: 240,
  y: 0,
  speed: 0.15,
  id: 4
}]


const getImage = (imageSource) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSource;
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (event) => {
      reject(event)
    }
  })
}


export default function RedPacket(props) {
  const container = useRef(null);
  const canvas = useRef(null);
  // 挂载requestAnimateFrameID
  const timeId = useRef(null);
  // 挂载pkgList
  const pkgList = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)

  // 清除&暂停动画
  const clearAnimate = () => {
    if (timeId.current) {
      window.cancelAnimationFrame(timeId.current)
    }
  }

  // const drawText = (canvasContext) => {

  // }

  const hitTest = (mouseX, mouseY) => {
    pkgList.current.forEach(item => {
      // X 轴命中
      const hitX = ((mouseX - item.x) <= pkgWidth) && ((mouseX - item.x) > 0);
      // Y 轴命中
      const hitY = ((mouseY - item.y) <= pkgHeight) && ((mouseY - item.y) > 0);
      if (hitX && hitY) {
        console.log('命中了')
      }
    })

  }

  const move = useCallback((canvasContext) => {
    // 步进
    const step = 10;
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    pkgList.current = pkgList.current.map(item => {
      // 计算当前的y轴位置
      let y = 0;
      if (item.y <= canvasHeight) {
        y = item.y + step * item.speed
      }
      return {
        ...item,
        y,
      }
    })
    pkgList.current.forEach(item => {
      canvasContext.drawImage(item.img, item.x, item.y)
    })
    clearAnimate()
    timeId.current = window.requestAnimationFrame(() => { move(canvasContext) })
  }, [canvasWidth, canvasHeight])


  useEffect(() => {

    const { width, height } = container.current.getBoundingClientRect();
    const ctx = canvas.current.getContext('2d');
    setCanvasWidth(width);
    setCanvasHeight(height);


    Promise.all(imgSourceList.map(item => {
      return getImage(item.img).catch(error => console.error(error))
    })).then(res => {

      pkgList.current = res.map((item, index) => {
        return {
          ...imgSourceList[index],
          img: item,
        }
      })
      pkgList.current.forEach(item => {
        ctx.drawImage(item.img, item.x, item.y)
      })
      clearAnimate()
      timeId.current = window.requestAnimationFrame(() => { move(ctx) })
    })
    // 清除副作用
    return () => {
      clearAnimate()
    }
  }, [canvasWidth, canvasHeight, move])




  const handleClick = useCallback(
    (event) => {
      console.log(event);
      console.log(pkgList.current)
      // clearAnimate()
      const { nativeEvent: { offsetX, offsetY } } = event;
      hitTest(offsetX, offsetY);
      clearAnimate()
    }, [])


  return (
    <div className='container' ref={container}>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvas} onClick={handleClick}></canvas>
    </div>
  )
}
