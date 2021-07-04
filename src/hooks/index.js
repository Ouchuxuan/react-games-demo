import { useEffect, useReducer, useRef } from 'react';
export const useRainCountDown = () => {
  const [rainLoadingTime, dispatchTime] = useReducer((state, action) => {
    switch (action.type) {
      case 'count':
        return state - 1;
      case 'set':
        return action.value;
      default:
        return state;
    }
  }, 3);
  const countDownTime = useRef();
  countDownTime.current = rainLoadingTime;
  useEffect(() => {
    let timeId = 0;
    if (countDownTime.current > 0) {
      timeId = setInterval(() => {
        if (countDownTime.current < 0) {
          clearInterval(timeId);
          return;
        }
        dispatchTime({type:'count'});
      }, 1000);
    }
    return () => {
      clearInterval(timeId)
    }
  }, []);
  return rainLoadingTime;
}