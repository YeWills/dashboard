export default function watermark(options = {}) {
  const isIe = () => {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
    return false;
  };
  // 默认设置
  const {
    text = '',
    width = 200,
    height = 160,
    fontSize = '15px',
    fontFamily = '微软雅黑',
    color = '#0003',
    alpha = 0.4,
    angle = -30,
    // container = document.body,
  } = options;

  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  const ctx = canvas.getContext('2d');

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((angle * Math.PI) / 180);

  // 绘制文本
  ctx.font = `${fontSize} ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;

  // 位置移动
  ctx.fillText(text, 0, 0, width);
  ctx.restore();

  ctx.drawImage(canvas, 0, 0);

  try {
    const src = canvas.toDataURL('image/png');
    // const src = 'https://img2.baidu.com/it/u=3796972118,2325277349&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300';
    const warterModel = document.createElement('div');
    warterModel.style.backgroundImage = `url(${src})`;
    warterModel.style.width = '100%';
    warterModel.style.height = '100%';
    // 这个才是精髓
    warterModel.style.pointerEvents = 'none';
    warterModel.style.position = 'absolute';
    warterModel.style.left = '0';
    warterModel.style.top = '0';
    warterModel.style.zIndex = '1000';
    warterModel.style.opacity = isIe() ? '0.1' : '0.4';
    document.body.appendChild(warterModel);
  } catch (e) {
    console.error('Cannot watermark image with text:', text);
  }
}
