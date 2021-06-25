import React, { useRef, useEffect, useState, useCallback } from 'react'
import './index.scss'
import pkg1 from '../../assets/1.png'
import pkg2 from '../../assets/2.png'
import pkg3 from '../../assets/3.png'
import pkg4 from '../../assets/4.png'
import pkg5 from '../../assets/5.png'

const imgSourceList = [{
  img: pkg1,
  x: 0,
  y: 0,
  speed: 0.1,
}, {
  img: pkg2,
  x: 60,
  y: 0,
  speed: 0.4,
}, {
  img: pkg3,
  x: 120,
  y: 0,
  speed: 0.2,
}, {
  img: pkg4,
  x: 180,
  y: 0,
  speed: 0.3,
}, {
  img: pkg5,
  x: 240,
  y: 0,
  speed: 0.1,
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


  useEffect(() => {

    const { width, height } = container.current.getBoundingClientRect();
    setCanvasWidth(width);
    setCanvasHeight(height);
    const ctx = canvas.current.getContext('2d');

    Promise.all(imgSourceList.map(item => {
      return getImage(item.img).catch(error => console.error(error))
    })).then(res => {

      pkgList.current = res.map((item, index) => {
        return {
          img: item,
          x: imgSourceList[index].x,
          y: imgSourceList[index].y,
          speed: imgSourceList[index].speed
        }
      })


      pkgList.current.forEach(item => {
        ctx.drawImage(item.img, item.x, item.y)
      })

      // console.log('pkgList', pkgList.current);
      console.log('canvasHeight0000', canvasHeight)


      // 加了这句就行了------------------------------
      if (timeId.current) {
        cancelAnimationFrame(timeId.current)
      }
      //这个move方法是否被覆盖了 
      const move = () => {
        console.log('canvasHeight1111', canvasHeight)
        // 步进
        const step = 10;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        if (true) {
          pkgList.current = pkgList.current.map(item => {
            // 计算当前的y轴位置
            let y;
            if (item.y > canvasHeight) {
              y = 0;
            } else {
              y = item.y + step * item.speed
            }
            return {
              ...item,
              y,
            }
          })
          pkgList.current.forEach(item => {
            ctx.drawImage(item.img, item.x, item.y)
          })
          if (timeId.current) {
            cancelAnimationFrame(timeId.current)
          }
          timeId.current = window.requestAnimationFrame(move)
        }
      }

      timeId.current = window.requestAnimationFrame(move)
      // timeId.current = setTimeout(move, 4000)
    })
  }, [canvasWidth, canvasHeight])




  const handleClick = useCallback(
    (event) => {
      console.log(event)
    }, [])


  return (
    <div className='container' ref={container}>
      <canvas width={canvasWidth} height={canvasHeight} ref={canvas} onClick={handleClick}></canvas>
    </div>
  )
}