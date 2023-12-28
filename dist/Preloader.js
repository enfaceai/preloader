"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.push.js");
var _react = _interopRequireWildcard(require("react"));
var _LogoIcon = require("./LogoIcon");
require("./preloader.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
const heightOffsetCalc = (line, dotScaleSize, offsetLine) => {
  if (Math.abs(line) < offsetLine) {
    const horizontalLine = 1 - Math.abs(line) / offsetLine;
    const calc = horizontalLine * (dotScaleSize - 1);
    const dotSize = (calc + '').split('.')[1];
    return "1.".concat(dotSize);
  }
  return 1;
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
  let endPos = null;
  (0, _react.useEffect)(() => {
    var _document$getElementB;
    endPos = (_document$getElementB = document.getElementById('enface-preloader')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.clientHeight;
  }, []);
  const stopAnimation = async () => {
    startTime = null;
    cycle++;
    await new Promise(resolve => setTimeout(resolve, restartDelay));
    startTime = new Date().getTime();
  };
  const render = time => {
    if (startTime === null || !lineRef.current || !endPos) return;
    const lineTopOffset = lineRef.current.getBoundingClientRect().top + window.scrollY;
    pathOffsets.forEach(dot => {
      const differenceSize = lineTopOffset - dot.offsetY;
      dot.path.style.transform = "scale(".concat(heightOffsetCalc(differenceSize, dotScaleSize, offsetLine, dot.offsetY), ") translateX(").concat(dot.offsetX > 8 || dot.offsetX < -8 ? offsetCalc(differenceSize, dot.offsetX, offsetLine, dotHorizontalOffset) : 0, ")");
      if (lineTopOffset >= dot.offsetY && differenceSize < offsetLine) {
        dot.path.style.fill = getColor(differenceSize, cycle, offsetLine, fillStyle);
        //  lineTopOffset >= dot.offsetY && differenceSize < offsetLine * 2 - bottom line
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
    animationLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "widget-animation",
    id: "enface-preloader"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: "".concat(offsetLine, "px 0")
    }
  }, /*#__PURE__*/_react.default.createElement(_LogoIcon.LogoIcon, {
    ref: svgRef
  })), /*#__PURE__*/_react.default.createElement("div", {
    ref: lineRef,
    className: "widget-stroke"
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: heightLineRef,
    className: "widget-stroke-top"
  }));
};
var _default = exports.default = Preloader;