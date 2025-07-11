import "./chunk-KBUIKKCC.js";

// node_modules/decode-base64/dist/browser.js
var decode = (base64) => {
  const binary = atob(base64);
  const u8 = new Uint8Array(binary.length);
  for (let i = 0, l = binary.length; i < l; i++) {
    u8[i] = binary.charCodeAt(i);
  }
  return u8;
};
var browser_default = decode;
export {
  browser_default as default
};
//# sourceMappingURL=decode-base64.js.map
