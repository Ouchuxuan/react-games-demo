// 获取container宽度和高度
const { width, height } = document.querySelector('.container').getBoundingClientRect();
const canvasDom = document.querySelector('.canvasDom');
canvasDom.width = width;
canvasDom.height = height;
const ctx = canvasDom.getContext('2d');

const loadImgs = (arr) => {
  return new Promise(resolve => {
    let count = 0;
    // 循环图片数组，每张图片都生成一个新的图片对象
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      // 创建图片对象
      const image = new Image();
      // 成功的异步回调
      // eslint-disable-next-line no-loop-func
      image.onload = () => {
        count++;
        arr.splice(i, 1, {
          // 加载完的图片对象都缓存在这里了，canvas可以直接绘制
          img: image,
          // 这里可以直接生成并缓存离屏canvas，用于优化性能，但本次不用，只是举个例子
          // offScreenCanvas: this.createOffScreenCanvas(image)
        });
        // 这里说明 整个图片数组arr里面的图片全都加载好了
        if (count == len) {
          resolve();
        }
      };
      image.src = arr[i].img;
    }
  });
}