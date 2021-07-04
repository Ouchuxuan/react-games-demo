import React, { useRef, useEffect, useState, useCallback } from 'react';
import './index.scss';
import RainLoading from '../../components/RainLoading';
import CountDownLoading from '../../components/CountDownLoading'
import { useRainCountDown } from '../../hooks'
import pkg1 from '../../assets/1.png';
import pkg2 from '../../assets/2.png';
import pkg3 from '../../assets/3.png';
import pkg4 from '../../assets/4.png';
import pkg5 from '../../assets/5.png';

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
}];

const getImage = imageSource => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSource;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = event => {
      reject(event);
    };
  });
};


export default function RedPacketRain(props) {
  // 注：如果要向requestAnimateFrame插入新的canvas绘制，可能要用taskList来存储绘制方法
  const container = useRef(null);
  const canvas = useRef(null);
  // 挂载requestAnimateFrameID
  const animateTimeId = useRef();
  // 挂载pkgList
  const pkgList = useRef(null);
  // 挂载绘图任务
  const taskList = useRef([]);
  // 挂载canvasConext
  const ctx = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  // 红包雨倒计时
  const [countDownTime, setCountDownTime] = useState(10)
  const countDownTimeRef = useRef();
  countDownTimeRef.current = countDownTime;



  // 清除&暂停动画
  const clearAnimate = () => {
    if (animateTimeId.current) {
      window.cancelAnimationFrame(animateTimeId.current);
    }
  };

  const drawText = (text, x, y) => {
    ctx.current.font = '20px Georgia';
    ctx.current.fillText(text, x, y);
  };


  const hitTest = (mouseX, mouseY, callBack = () => { }) => {
    for (let i = 0; i < pkgList.current.length; i++) {
      // X 轴命中
      const hitX = ((mouseX - pkgList.current[i].x) <= pkgWidth)
        && ((mouseX - pkgList.current[i].x) > 0);
      // Y 轴命中
      const hitY = ((mouseY - pkgList.current[i].y) <= pkgHeight)
        && ((mouseY - pkgList.current[i].y) > 0);
      if (hitX && hitY) {
        callBack(pkgList.current[i]);
        break;
      }
    }
  };

  const move = useCallback(() => {
    // 步进
    const step = 10;
    pkgList.current = pkgList.current.map(item => {
      // 计算当前的y轴位置
      let y = 0;
      if (item.y <= canvasSize.height) {
        y = item.y + step * item.speed;
      }
      return {
        ...item,
        y,
      };
    });
    pkgList.current.forEach(item => {
      ctx.current.drawImage(item.img, item.x, item.y);
    });
  }, [canvasSize]);

  taskList.current = [move];

  const draw = useCallback(canvasContext => {
    canvasContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
    taskList.current.forEach(task => {
      task();
    });
    clearAnimate();
    animateTimeId.current = window.requestAnimationFrame(() => { draw(canvasContext); });
  }, [canvasSize]);

  const initAnimate = useCallback(() => {
    Promise.all(imgSourceList.map(item => {
      return getImage(item.img).catch(error => console.error(error));
    })).then(res => {
      pkgList.current = res.map((item, index) => {
        return {
          ...imgSourceList[index],
          img: item,
        };
      });
      clearAnimate();
      animateTimeId.current = window.requestAnimationFrame(() => { draw(ctx.current); });
    });
  }, [draw]);

  const handleClick = event => {
    const { nativeEvent: { offsetX, offsetY } } = event;
    hitTest(offsetX, offsetY, pkgItem => {
      console.log('击中', pkgItem, canvasSize);
      taskList.current.push(() => drawText('hahah', 150, 150));
    });
  };

  const rainCountDownTime = useRainCountDown()
  useEffect(() => {
    if (rainCountDownTime < 0) {
      const { width, height } = container.current.getBoundingClientRect();
      ctx.current = canvas.current.getContext('2d');
      setCanvasSize({ width, height });
    }
  }, [rainCountDownTime]);

  useEffect(() => {
    if (canvasSize.width !== 0) {
      initAnimate();
    }
  }, [canvasSize, initAnimate]);

  useEffect(() => {
    let timeId = 0;
    // 开启动画的时候同时开启倒计时
    if (rainCountDownTime < 0) {
      timeId = setInterval(() => {
        console.log(countDownTimeRef.current)
        setCountDownTime(time => time - 1);
        if (countDownTimeRef.current === 0) {
          clearInterval(timeId);
          clearAnimate();
        }
      }, 1000)
    }
    return () => {
      clearInterval(timeId)
    }

  }, [rainCountDownTime])


  return (
    <div className="red-packets-rain-container" ref={container}>
      {(rainCountDownTime >= 0) && (
        <RainLoading countDownTime={rainCountDownTime} />
      )}
      {
        (rainCountDownTime < 0) && (
          <>
            <CountDownLoading countDownTime={countDownTime}/>
            <canvas
              width={canvasSize.width}
              height={canvasSize.height}
              ref={canvas}
              onClick={handleClick}
            />
          </>
        )
      }
    </div>
  );
}
