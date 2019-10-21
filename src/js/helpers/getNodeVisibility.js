const getNodeVisibility = (node) => {
  // position: left, top, right, bottom, x, y, width, height
  const position = node.getBoundingClientRect();
  const { clientWidth } = document.documentElement;

  const left = position.left <= clientWidth && position.left >= 0;
  const right = position.right <= clientWidth && position.right >= 0;

  const centered = position.left < clientWidth / 2 && position.right > clientWidth / 2;
  const filled = position.left <= 0 && position.right >= clientWidth;
  const completely = left && right;
  const visible = left || right || filled;

  const clientWidthRatio = position.width / clientWidth;

  return {
    visible,
    filled,
    completely,
    centered,
    left,
    right,
    position,
    clientWidth,
    clientWidthRatio,
  };
};

export default getNodeVisibility;
