"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireWildcard(require("react"));

var _LogoIcon = require("./LogoIcon");

require("./preloader.css");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const offsetCalc = (line, offsetX, offsetLine, dotHorizontalOffset) => {
  if (Math.abs(line) < offsetLine) {
    const horizontalLine = 1 - Math.abs(line) / offsetLine;
    const offsetOnHover = horizontalLine * offsetX * dotHorizontalOffset;

    if (offsetX < 0) {
      return "".concat(Math.abs(offsetOnHover), "px");
    }

    return "-".concat(offsetOnHover, "px");
  }

  return '0px';
};

const heightOffsetCalc = (line, dotScaleSize) => {
  const formatNumber = dotScaleSize - Math.abs(line) / 100;

  if (formatNumber < 1) {
    return 1;
  }

  return formatNumber;
};

const calculateColor = (n, list1, list2) => {
  return list2.map((x, i) => {
    if (x === list1[i]) return x;
    return x + (list1[i] - x) * n;
  });
};

const getColor = (line, cycle, offsetLine, fillStyle) => {
  const horizontalLine = 1 - Math.abs(line) / offsetLine;

  if (horizontalLine > 0) {
    const currentColor = fillStyle[cycle % 2 ? 'first' : 'second'].replace(/[^\d,]/g, '').split(',');
    const secondColor = fillStyle[cycle % 2 ? 'second' : 'first'].replace(/[^\d,]/g, '').split(',');
    const color = calculateColor(horizontalLine, currentColor.map(Number), secondColor.map(Number));
    return "rgb(".concat(color[0], ", ").concat(color[1], ", ").concat(color[2], ")");
  }
};

const Preloader = _ref => {
  let {
    endPos = 310,
    duration = 1500,
    offsetLine = 50,
    dotScaleSize = 1.4,
    dotHorizontalOffset = 0.05,
    restartDelay = 0,
    fillStyle = {
      first: 'rgb(55, 164, 255)',
      second: 'rgb(255,255,255'
    }
  } = _ref;
  let startTime = new Date().getTime();

  const svgRef = /*#__PURE__*/_react.default.createRef();

  const lineRef = (0, _react.useRef)(null);
  const heightLineRef = (0, _react.useRef)(null);
  const pathOffsets = [];
  let cycle = 1;
  let customDuration = duration < 1000 ? 1000 : duration;

  const stopAnimation = async () => {
    startTime = null;
    cycle++;
    await new Promise(resolve => setTimeout(resolve, restartDelay));
    startTime = new Date().getTime();
  };

  const render = time => {
    if (startTime === null) return;
    const lineTopOffset = lineRef.current.getBoundingClientRect().top + window.scrollY;
    pathOffsets.forEach(dot => {
      const differenceSize = lineTopOffset - dot.offsetY;
      dot.path.style.transform = "scale(".concat(heightOffsetCalc(differenceSize, dotScaleSize), ") translateX(").concat(dot.offsetX > 8 || dot.offsetX < -8 ? offsetCalc(differenceSize, dot.offsetX, offsetLine, dotHorizontalOffset) : 0, ")");

      if (lineTopOffset >= dot.offsetY && differenceSize < offsetLine) {
        dot.path.style.fill = getColor(differenceSize, cycle, offsetLine, fillStyle); //  lineTopOffset >= dot.offsetY && differenceSize < offsetLine * 2 - bottom line
      }
    });
    const newOffset = (new Date().getTime() - startTime) / customDuration * endPos % endPos;

    if ((new Date().getTime() - startTime) / customDuration > 1) {
      return stopAnimation();
    }

    lineRef.current.style.bottom = "".concat(newOffset, "px");
  };

  const animationLoop = () => {
    render();
    requestAnimationFrame(animationLoop);
  };

  (0, _react.useEffect)(() => {
    const heightOffset = heightLineRef.current.getBoundingClientRect().left;
    svgRef.current.childNodes.forEach(path => {
      pathOffsets.push({
        offsetY: path.getBoundingClientRect().top + window.scrollY,
        offsetX: heightOffset - path.getBoundingClientRect().left,
        path
      });
    });
    animationLoop(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "widget-animation"
  }, /*#__PURE__*/_react.default.createElement(_LogoIcon.LogoIcon, {
    ref: svgRef
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: lineRef,
    className: "widget-stroke"
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: heightLineRef,
    className: "widget-stroke-top"
  }));
};

var _default = Preloader;
exports.default = _default;