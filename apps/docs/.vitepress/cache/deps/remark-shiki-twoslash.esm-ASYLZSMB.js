import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-7D4SUZUM.js";

// browser-external:typescript
var require_typescript = __commonJS({
  "browser-external:typescript"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "typescript" has been externalized for browser compatibility. Cannot access "typescript.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:lz-string
var require_lz_string = __commonJS({
  "browser-external:lz-string"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "lz-string" has been externalized for browser compatibility. Cannot access "lz-string.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// ../../node_modules/.bun/unist-util-is@4.1.0/node_modules/unist-util-is/convert.js
var require_convert = __commonJS({
  "../../node_modules/.bun/unist-util-is@4.1.0/node_modules/unist-util-is/convert.js"(exports, module) {
    "use strict";
    module.exports = convert;
    function convert(test) {
      if (test == null) {
        return ok;
      }
      if (typeof test === "string") {
        return typeFactory(test);
      }
      if (typeof test === "object") {
        return "length" in test ? anyFactory(test) : allFactory(test);
      }
      if (typeof test === "function") {
        return test;
      }
      throw new Error("Expected function, string, or object as test");
    }
    function allFactory(test) {
      return all;
      function all(node) {
        var key;
        for (key in test) {
          if (node[key] !== test[key]) return false;
        }
        return true;
      }
    }
    function anyFactory(tests) {
      var checks = [];
      var index = -1;
      while (++index < tests.length) {
        checks[index] = convert(tests[index]);
      }
      return any;
      function any() {
        var index2 = -1;
        while (++index2 < checks.length) {
          if (checks[index2].apply(this, arguments)) {
            return true;
          }
        }
        return false;
      }
    }
    function typeFactory(test) {
      return type;
      function type(node) {
        return Boolean(node && node.type === test);
      }
    }
    function ok() {
      return true;
    }
  }
});

// ../../node_modules/.bun/unist-util-visit-parents@3.1.1/node_modules/unist-util-visit-parents/color.browser.js
var require_color_browser = __commonJS({
  "../../node_modules/.bun/unist-util-visit-parents@3.1.1/node_modules/unist-util-visit-parents/color.browser.js"(exports, module) {
    module.exports = identity;
    function identity(d) {
      return d;
    }
  }
});

// ../../node_modules/.bun/unist-util-visit-parents@3.1.1/node_modules/unist-util-visit-parents/index.js
var require_unist_util_visit_parents = __commonJS({
  "../../node_modules/.bun/unist-util-visit-parents@3.1.1/node_modules/unist-util-visit-parents/index.js"(exports, module) {
    "use strict";
    module.exports = visitParents;
    var convert = require_convert();
    var color = require_color_browser();
    var CONTINUE = true;
    var SKIP = "skip";
    var EXIT = false;
    visitParents.CONTINUE = CONTINUE;
    visitParents.SKIP = SKIP;
    visitParents.EXIT = EXIT;
    function visitParents(tree, test, visitor, reverse) {
      var step;
      var is;
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
        test = null;
      }
      is = convert(test);
      step = reverse ? -1 : 1;
      factory(tree, null, [])();
      function factory(node, index, parents) {
        var value = typeof node === "object" && node !== null ? node : {};
        var name;
        if (typeof value.type === "string") {
          name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
          visit3.displayName = "node (" + color(value.type + (name ? "<" + name + ">" : "")) + ")";
        }
        return visit3;
        function visit3() {
          var grandparents = parents.concat(node);
          var result = [];
          var subresult;
          var offset;
          if (!test || is(node, index, parents[parents.length - 1] || null)) {
            result = toResult(visitor(node, parents));
            if (result[0] === EXIT) {
              return result;
            }
          }
          if (node.children && result[0] !== SKIP) {
            offset = (reverse ? node.children.length : -1) + step;
            while (offset > -1 && offset < node.children.length) {
              subresult = factory(node.children[offset], offset, grandparents)();
              if (subresult[0] === EXIT) {
                return subresult;
              }
              offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
            }
          }
          return result;
        }
      }
    }
    function toResult(value) {
      if (value !== null && typeof value === "object" && "length" in value) {
        return value;
      }
      if (typeof value === "number") {
        return [CONTINUE, value];
      }
      return [value];
    }
  }
});

// ../../node_modules/.bun/unist-util-visit@2.0.3/node_modules/unist-util-visit/index.js
var require_unist_util_visit = __commonJS({
  "../../node_modules/.bun/unist-util-visit@2.0.3/node_modules/unist-util-visit/index.js"(exports, module) {
    "use strict";
    module.exports = visit3;
    var visitParents = require_unist_util_visit_parents();
    var CONTINUE = visitParents.CONTINUE;
    var SKIP = visitParents.SKIP;
    var EXIT = visitParents.EXIT;
    visit3.CONTINUE = CONTINUE;
    visit3.SKIP = SKIP;
    visit3.EXIT = EXIT;
    function visit3(tree, test, visitor, reverse) {
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
        test = null;
      }
      visitParents(tree, test, overload, reverse);
      function overload(node, parents) {
        var parent = parents[parents.length - 1];
        var index = parent ? parent.children.indexOf(node) : null;
        return visitor(node, index, parent);
      }
    }
  }
});

// ../../node_modules/.bun/vscode-oniguruma@1.7.0/node_modules/vscode-oniguruma/release/main.js
var require_main = __commonJS({
  "../../node_modules/.bun/vscode-oniguruma@1.7.0/node_modules/vscode-oniguruma/release/main.js"(exports, module) {
    !(function(t, n) {
      "object" == typeof exports && "object" == typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define([], n) : "object" == typeof exports ? exports.onig = n() : t.onig = n();
    })(exports, (() => {
      return t = { 770: function(t2, n2, e) {
        "use strict";
        var r = this && this.__importDefault || function(t3) {
          return t3 && t3.__esModule ? t3 : { default: t3 };
        };
        Object.defineProperty(n2, "__esModule", { value: true }), n2.setDefaultDebugCall = n2.createOnigScanner = n2.createOnigString = n2.loadWASM = n2.OnigScanner = n2.OnigString = void 0;
        const i = r(e(418));
        let o = null, a = false;
        class f {
          static _utf8ByteLength(t3) {
            let n3 = 0;
            for (let e2 = 0, r2 = t3.length; e2 < r2; e2++) {
              const i2 = t3.charCodeAt(e2);
              let o2 = i2, a2 = false;
              if (i2 >= 55296 && i2 <= 56319 && e2 + 1 < r2) {
                const n4 = t3.charCodeAt(e2 + 1);
                n4 >= 56320 && n4 <= 57343 && (o2 = 65536 + (i2 - 55296 << 10) | n4 - 56320, a2 = true);
              }
              n3 += o2 <= 127 ? 1 : o2 <= 2047 ? 2 : o2 <= 65535 ? 3 : 4, a2 && e2++;
            }
            return n3;
          }
          constructor(t3) {
            const n3 = t3.length, e2 = f._utf8ByteLength(t3), r2 = e2 !== n3, i2 = r2 ? new Uint32Array(n3 + 1) : null;
            r2 && (i2[n3] = e2);
            const o2 = r2 ? new Uint32Array(e2 + 1) : null;
            r2 && (o2[e2] = n3);
            const a2 = new Uint8Array(e2);
            let s2 = 0;
            for (let e3 = 0; e3 < n3; e3++) {
              const f2 = t3.charCodeAt(e3);
              let u2 = f2, c2 = false;
              if (f2 >= 55296 && f2 <= 56319 && e3 + 1 < n3) {
                const n4 = t3.charCodeAt(e3 + 1);
                n4 >= 56320 && n4 <= 57343 && (u2 = 65536 + (f2 - 55296 << 10) | n4 - 56320, c2 = true);
              }
              r2 && (i2[e3] = s2, c2 && (i2[e3 + 1] = s2), u2 <= 127 ? o2[s2 + 0] = e3 : u2 <= 2047 ? (o2[s2 + 0] = e3, o2[s2 + 1] = e3) : u2 <= 65535 ? (o2[s2 + 0] = e3, o2[s2 + 1] = e3, o2[s2 + 2] = e3) : (o2[s2 + 0] = e3, o2[s2 + 1] = e3, o2[s2 + 2] = e3, o2[s2 + 3] = e3)), u2 <= 127 ? a2[s2++] = u2 : u2 <= 2047 ? (a2[s2++] = 192 | (1984 & u2) >>> 6, a2[s2++] = 128 | (63 & u2) >>> 0) : u2 <= 65535 ? (a2[s2++] = 224 | (61440 & u2) >>> 12, a2[s2++] = 128 | (4032 & u2) >>> 6, a2[s2++] = 128 | (63 & u2) >>> 0) : (a2[s2++] = 240 | (1835008 & u2) >>> 18, a2[s2++] = 128 | (258048 & u2) >>> 12, a2[s2++] = 128 | (4032 & u2) >>> 6, a2[s2++] = 128 | (63 & u2) >>> 0), c2 && e3++;
            }
            this.utf16Length = n3, this.utf8Length = e2, this.utf16Value = t3, this.utf8Value = a2, this.utf16OffsetToUtf8 = i2, this.utf8OffsetToUtf16 = o2;
          }
          createString(t3) {
            const n3 = t3._omalloc(this.utf8Length);
            return t3.HEAPU8.set(this.utf8Value, n3), n3;
          }
        }
        class s {
          constructor(t3) {
            if (this.id = ++s.LAST_ID, !o) throw new Error("Must invoke loadWASM first.");
            this._onigBinding = o, this.content = t3;
            const n3 = new f(t3);
            this.utf16Length = n3.utf16Length, this.utf8Length = n3.utf8Length, this.utf16OffsetToUtf8 = n3.utf16OffsetToUtf8, this.utf8OffsetToUtf16 = n3.utf8OffsetToUtf16, this.utf8Length < 1e4 && !s._sharedPtrInUse ? (s._sharedPtr || (s._sharedPtr = o._omalloc(1e4)), s._sharedPtrInUse = true, o.HEAPU8.set(n3.utf8Value, s._sharedPtr), this.ptr = s._sharedPtr) : this.ptr = n3.createString(o);
          }
          convertUtf8OffsetToUtf16(t3) {
            return this.utf8OffsetToUtf16 ? t3 < 0 ? 0 : t3 > this.utf8Length ? this.utf16Length : this.utf8OffsetToUtf16[t3] : t3;
          }
          convertUtf16OffsetToUtf8(t3) {
            return this.utf16OffsetToUtf8 ? t3 < 0 ? 0 : t3 > this.utf16Length ? this.utf8Length : this.utf16OffsetToUtf8[t3] : t3;
          }
          dispose() {
            this.ptr === s._sharedPtr ? s._sharedPtrInUse = false : this._onigBinding._ofree(this.ptr);
          }
        }
        n2.OnigString = s, s.LAST_ID = 0, s._sharedPtr = 0, s._sharedPtrInUse = false;
        class u {
          constructor(t3) {
            if (!o) throw new Error("Must invoke loadWASM first.");
            const n3 = [], e2 = [];
            for (let r3 = 0, i3 = t3.length; r3 < i3; r3++) {
              const i4 = new f(t3[r3]);
              n3[r3] = i4.createString(o), e2[r3] = i4.utf8Length;
            }
            const r2 = o._omalloc(4 * t3.length);
            o.HEAPU32.set(n3, r2 / 4);
            const i2 = o._omalloc(4 * t3.length);
            o.HEAPU32.set(e2, i2 / 4);
            const a2 = o._createOnigScanner(r2, i2, t3.length);
            for (let e3 = 0, r3 = t3.length; e3 < r3; e3++) o._ofree(n3[e3]);
            o._ofree(i2), o._ofree(r2), 0 === a2 && (function(t4) {
              throw new Error(t4.UTF8ToString(t4._getLastOnigError()));
            })(o), this._onigBinding = o, this._ptr = a2;
          }
          dispose() {
            this._onigBinding._freeOnigScanner(this._ptr);
          }
          findNextMatchSync(t3, n3, e2) {
            let r2 = a, i2 = 0;
            if ("number" == typeof e2 ? (8 & e2 && (r2 = true), i2 = e2) : "boolean" == typeof e2 && (r2 = e2), "string" == typeof t3) {
              t3 = new s(t3);
              const e3 = this._findNextMatchSync(t3, n3, r2, i2);
              return t3.dispose(), e3;
            }
            return this._findNextMatchSync(t3, n3, r2, i2);
          }
          _findNextMatchSync(t3, n3, e2, r2) {
            const i2 = this._onigBinding;
            let o2;
            if (o2 = e2 ? i2._findNextOnigScannerMatchDbg(this._ptr, t3.id, t3.ptr, t3.utf8Length, t3.convertUtf16OffsetToUtf8(n3), r2) : i2._findNextOnigScannerMatch(this._ptr, t3.id, t3.ptr, t3.utf8Length, t3.convertUtf16OffsetToUtf8(n3), r2), 0 === o2) return null;
            const a2 = i2.HEAPU32;
            let f2 = o2 / 4;
            const s2 = a2[f2++], u2 = a2[f2++];
            let c2 = [];
            for (let n4 = 0; n4 < u2; n4++) {
              const e3 = t3.convertUtf8OffsetToUtf16(a2[f2++]), r3 = t3.convertUtf8OffsetToUtf16(a2[f2++]);
              c2[n4] = { start: e3, end: r3, length: r3 - e3 };
            }
            return { index: s2, captureIndices: c2 };
          }
        }
        n2.OnigScanner = u;
        let c = false, l = null;
        n2.loadWASM = function(t3) {
          if (c) return l;
          let n3, e2, r2, a2;
          if (c = true, (function(t4) {
            return "function" == typeof t4.instantiator;
          })(t3)) n3 = t3.instantiator, e2 = t3.print;
          else {
            let r3;
            !(function(t4) {
              return void 0 !== t4.data;
            })(t3) ? r3 = t3 : (r3 = t3.data, e2 = t3.print), n3 = (function(t4) {
              return "undefined" != typeof Response && t4 instanceof Response;
            })(r3) ? "function" == typeof WebAssembly.instantiateStreaming ? /* @__PURE__ */ (function(t4) {
              return (n4) => WebAssembly.instantiateStreaming(t4, n4);
            })(r3) : /* @__PURE__ */ (function(t4) {
              return async (n4) => {
                const e3 = await t4.arrayBuffer();
                return WebAssembly.instantiate(e3, n4);
              };
            })(r3) : /* @__PURE__ */ (function(t4) {
              return (n4) => WebAssembly.instantiate(t4, n4);
            })(r3);
          }
          return l = new Promise(((t4, n4) => {
            r2 = t4, a2 = n4;
          })), (function(t4, n4, e3, r3) {
            (0, i.default)({ print: n4, instantiateWasm: (n5, e4) => {
              if ("undefined" == typeof performance) {
                const t5 = () => Date.now();
                n5.env.emscripten_get_now = t5, n5.wasi_snapshot_preview1.emscripten_get_now = t5;
              }
              return t4(n5).then(((t5) => e4(t5.instance)), r3), {};
            } }).then(((t5) => {
              o = t5, e3();
            }));
          })(n3, e2, r2, a2), l;
        }, n2.createOnigString = function(t3) {
          return new s(t3);
        }, n2.createOnigScanner = function(t3) {
          return new u(t3);
        }, n2.setDefaultDebugCall = function(t3) {
          a = t3;
        };
      }, 418: (t2) => {
        var n2 = ("undefined" != typeof document && document.currentScript && document.currentScript.src, function(t3) {
          var n3, e, r = void 0 !== (t3 = t3 || {}) ? t3 : {};
          r.ready = new Promise((function(t4, r2) {
            n3 = t4, e = r2;
          }));
          var i, o = Object.assign({}, r), a = [], f = false, s = false, u = true, c = "";
          function l(t4) {
            return r.locateFile ? r.locateFile(t4, c) : c + t4;
          }
          u && (i = function(t4) {
            let n4;
            return "function" == typeof readbuffer ? new Uint8Array(readbuffer(t4)) : (n4 = read(t4, "binary"), m("object" == typeof n4), n4);
          }, "undefined" != typeof scriptArgs ? a = scriptArgs : void 0 !== arguments && (a = arguments), "undefined" != typeof onig_print && ("undefined" == typeof console && (console = {}), console.log = onig_print, console.warn = console.error = "undefined" != typeof printErr ? printErr : onig_print));
          var h, p, d = r.print || console.log.bind(console), g = r.printErr || console.warn.bind(console);
          Object.assign(r, o), o = null, r.arguments && (a = r.arguments), r.thisProgram && r.thisProgram, r.quit && r.quit, r.wasmBinary && (h = r.wasmBinary), r.noExitRuntime, "object" != typeof WebAssembly && k("no native wasm support detected");
          var _ = false;
          function m(t4, n4) {
            t4 || k(n4);
          }
          var y, w, S, v = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
          function A(t4, n4, e2) {
            for (var r2 = n4 + e2, i2 = n4; t4[i2] && !(i2 >= r2); ) ++i2;
            if (i2 - n4 > 16 && t4.buffer && v) return v.decode(t4.subarray(n4, i2));
            for (var o2 = ""; n4 < i2; ) {
              var a2 = t4[n4++];
              if (128 & a2) {
                var f2 = 63 & t4[n4++];
                if (192 != (224 & a2)) {
                  var s2 = 63 & t4[n4++];
                  if ((a2 = 224 == (240 & a2) ? (15 & a2) << 12 | f2 << 6 | s2 : (7 & a2) << 18 | f2 << 12 | s2 << 6 | 63 & t4[n4++]) < 65536) o2 += String.fromCharCode(a2);
                  else {
                    var u2 = a2 - 65536;
                    o2 += String.fromCharCode(55296 | u2 >> 10, 56320 | 1023 & u2);
                  }
                } else o2 += String.fromCharCode((31 & a2) << 6 | f2);
              } else o2 += String.fromCharCode(a2);
            }
            return o2;
          }
          function b(t4, n4) {
            return t4 ? A(w, t4, n4) : "";
          }
          function O(t4) {
            y = t4, r.HEAP8 = new Int8Array(t4), r.HEAP16 = new Int16Array(t4), r.HEAP32 = new Int32Array(t4), r.HEAPU8 = w = new Uint8Array(t4), r.HEAPU16 = new Uint16Array(t4), r.HEAPU32 = S = new Uint32Array(t4), r.HEAPF32 = new Float32Array(t4), r.HEAPF64 = new Float64Array(t4);
          }
          r.INITIAL_MEMORY;
          var U = [], P = [], R = [];
          function x() {
            if (r.preRun) for ("function" == typeof r.preRun && (r.preRun = [r.preRun]); r.preRun.length; ) M(r.preRun.shift());
            G(U);
          }
          function T() {
            G(P);
          }
          function E() {
            if (r.postRun) for ("function" == typeof r.postRun && (r.postRun = [r.postRun]); r.postRun.length; ) I(r.postRun.shift());
            G(R);
          }
          function M(t4) {
            U.unshift(t4);
          }
          function L(t4) {
            P.unshift(t4);
          }
          function I(t4) {
            R.unshift(t4);
          }
          var W = 0, D = null, C = null;
          function N(t4) {
            W++, r.monitorRunDependencies && r.monitorRunDependencies(W);
          }
          function j(t4) {
            if (W--, r.monitorRunDependencies && r.monitorRunDependencies(W), 0 == W && (null !== D && (clearInterval(D), D = null), C)) {
              var n4 = C;
              C = null, n4();
            }
          }
          function k(t4) {
            r.onAbort && r.onAbort(t4), g(t4 = "Aborted(" + t4 + ")"), _ = true, t4 += ". Build with -sASSERTIONS for more info.";
            var n4 = new WebAssembly.RuntimeError(t4);
            throw e(n4), n4;
          }
          var B, H, F = "data:application/octet-stream;base64,";
          function V(t4) {
            return t4.startsWith(F);
          }
          function z(t4) {
            try {
              if (t4 == B && h) return new Uint8Array(h);
              if (i) return i(t4);
              throw "both async and sync fetching of the wasm failed";
            } catch (t5) {
              k(t5);
            }
          }
          function q() {
            return h || !f && !s || "function" != typeof fetch ? Promise.resolve().then((function() {
              return z(B);
            })) : fetch(B, { credentials: "same-origin" }).then((function(t4) {
              if (!t4.ok) throw "failed to load wasm binary file at '" + B + "'";
              return t4.arrayBuffer();
            })).catch((function() {
              return z(B);
            }));
          }
          function Y() {
            var t4 = { env: nt, wasi_snapshot_preview1: nt };
            function n4(t5, n5) {
              var e2 = t5.exports;
              r.asm = e2, O((p = r.asm.memory).buffer), r.asm.__indirect_function_table, L(r.asm.__wasm_call_ctors), j();
            }
            function i2(t5) {
              n4(t5.instance);
            }
            function o2(n5) {
              return q().then((function(n6) {
                return WebAssembly.instantiate(n6, t4);
              })).then((function(t5) {
                return t5;
              })).then(n5, (function(t5) {
                g("failed to asynchronously prepare wasm: " + t5), k(t5);
              }));
            }
            if (N(), r.instantiateWasm) try {
              return r.instantiateWasm(t4, n4);
            } catch (t5) {
              g("Module.instantiateWasm callback failed with error: " + t5), e(t5);
            }
            return (h || "function" != typeof WebAssembly.instantiateStreaming || V(B) || "function" != typeof fetch ? o2(i2) : fetch(B, { credentials: "same-origin" }).then((function(n5) {
              return WebAssembly.instantiateStreaming(n5, t4).then(i2, (function(t5) {
                return g("wasm streaming compile failed: " + t5), g("falling back to ArrayBuffer instantiation"), o2(i2);
              }));
            }))).catch(e), {};
          }
          function G(t4) {
            for (; t4.length > 0; ) t4.shift()(r);
          }
          function J(t4, n4, e2) {
            w.copyWithin(t4, n4, n4 + e2);
          }
          function K(t4) {
            try {
              return p.grow(t4 - y.byteLength + 65535 >>> 16), O(p.buffer), 1;
            } catch (t5) {
            }
          }
          function Q(t4) {
            var n4, e2 = w.length, r2 = 2147483648;
            if ((t4 >>>= 0) > r2) return false;
            for (var i2 = 1; i2 <= 4; i2 *= 2) {
              var o2 = e2 * (1 + 0.2 / i2);
              if (o2 = Math.min(o2, t4 + 100663296), K(Math.min(r2, (n4 = Math.max(t4, o2)) + (65536 - n4 % 65536) % 65536))) return true;
            }
            return false;
          }
          V(B = "onig.wasm") || (B = l(B)), H = "undefined" != typeof dateNow ? dateNow : () => performance.now();
          var X = [null, [], []];
          function Z(t4, n4) {
            var e2 = X[t4];
            0 === n4 || 10 === n4 ? ((1 === t4 ? d : g)(A(e2, 0)), e2.length = 0) : e2.push(n4);
          }
          function $(t4, n4, e2, r2) {
            for (var i2 = 0, o2 = 0; o2 < e2; o2++) {
              var a2 = S[n4 >> 2], f2 = S[n4 + 4 >> 2];
              n4 += 8;
              for (var s2 = 0; s2 < f2; s2++) Z(t4, w[a2 + s2]);
              i2 += f2;
            }
            return S[r2 >> 2] = i2, 0;
          }
          var tt, nt = { emscripten_get_now: H, emscripten_memcpy_big: J, emscripten_resize_heap: Q, fd_write: $ };
          function et(t4) {
            function e2() {
              tt || (tt = true, r.calledRun = true, _ || (T(), n3(r), r.onRuntimeInitialized && r.onRuntimeInitialized(), E()));
            }
            t4 = t4 || a, W > 0 || (x(), W > 0 || (r.setStatus ? (r.setStatus("Running..."), setTimeout((function() {
              setTimeout((function() {
                r.setStatus("");
              }), 1), e2();
            }), 1)) : e2()));
          }
          if (Y(), r.___wasm_call_ctors = function() {
            return (r.___wasm_call_ctors = r.asm.__wasm_call_ctors).apply(null, arguments);
          }, r.___errno_location = function() {
            return (r.___errno_location = r.asm.__errno_location).apply(null, arguments);
          }, r._omalloc = function() {
            return (r._omalloc = r.asm.omalloc).apply(null, arguments);
          }, r._ofree = function() {
            return (r._ofree = r.asm.ofree).apply(null, arguments);
          }, r._getLastOnigError = function() {
            return (r._getLastOnigError = r.asm.getLastOnigError).apply(null, arguments);
          }, r._createOnigScanner = function() {
            return (r._createOnigScanner = r.asm.createOnigScanner).apply(null, arguments);
          }, r._freeOnigScanner = function() {
            return (r._freeOnigScanner = r.asm.freeOnigScanner).apply(null, arguments);
          }, r._findNextOnigScannerMatch = function() {
            return (r._findNextOnigScannerMatch = r.asm.findNextOnigScannerMatch).apply(null, arguments);
          }, r._findNextOnigScannerMatchDbg = function() {
            return (r._findNextOnigScannerMatchDbg = r.asm.findNextOnigScannerMatchDbg).apply(null, arguments);
          }, r.stackSave = function() {
            return (r.stackSave = r.asm.stackSave).apply(null, arguments);
          }, r.stackRestore = function() {
            return (r.stackRestore = r.asm.stackRestore).apply(null, arguments);
          }, r.stackAlloc = function() {
            return (r.stackAlloc = r.asm.stackAlloc).apply(null, arguments);
          }, r.dynCall_jiji = function() {
            return (r.dynCall_jiji = r.asm.dynCall_jiji).apply(null, arguments);
          }, r.UTF8ToString = b, C = function t4() {
            tt || et(), tt || (C = t4);
          }, r.preInit) for ("function" == typeof r.preInit && (r.preInit = [r.preInit]); r.preInit.length > 0; ) r.preInit.pop()();
          return et(), t3.ready;
        });
        t2.exports = n2;
      } }, n = {}, (function e(r) {
        var i = n[r];
        if (void 0 !== i) return i.exports;
        var o = n[r] = { exports: {} };
        return t[r].call(o.exports, o, o.exports, e), o.exports;
      })(770);
      var t, n;
    }));
  }
});

// ../../node_modules/.bun/vscode-textmate@5.2.0/node_modules/vscode-textmate/release/main.js
var require_main2 = __commonJS({
  "../../node_modules/.bun/vscode-textmate@5.2.0/node_modules/vscode-textmate/release/main.js"(exports, module) {
    !(function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.vscodetextmate = t() : e.vscodetextmate = t();
    })(exports, (function() {
      return (function(e) {
        var t = {};
        function n(r) {
          if (t[r]) return t[r].exports;
          var i = t[r] = { i: r, l: false, exports: {} };
          return e[r].call(i.exports, i, i.exports, n), i.l = true, i.exports;
        }
        return n.m = e, n.c = t, n.d = function(e2, t2, r) {
          n.o(e2, t2) || Object.defineProperty(e2, t2, { enumerable: true, get: r });
        }, n.r = function(e2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
        }, n.t = function(e2, t2) {
          if (1 & t2 && (e2 = n(e2)), 8 & t2) return e2;
          if (4 & t2 && "object" == typeof e2 && e2 && e2.__esModule) return e2;
          var r = /* @__PURE__ */ Object.create(null);
          if (n.r(r), Object.defineProperty(r, "default", { enumerable: true, value: e2 }), 2 & t2 && "string" != typeof e2) for (var i in e2) n.d(r, i, (function(t3) {
            return e2[t3];
          }).bind(null, i));
          return r;
        }, n.n = function(e2) {
          var t2 = e2 && e2.__esModule ? function() {
            return e2.default;
          } : function() {
            return e2;
          };
          return n.d(t2, "a", t2), t2;
        }, n.o = function(e2, t2) {
          return Object.prototype.hasOwnProperty.call(e2, t2);
        }, n.p = "", n(n.s = 3);
      })([function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: true });
        var r = n(1), i = n(5), o = n(6), s = n(2), a = "undefined" == typeof performance ? function() {
          return Date.now();
        } : function() {
          return performance.now();
        };
        t.createGrammar = function(e2, t2, n2, r2, i2, o2) {
          return new v(e2, t2, n2, r2, i2, o2);
        };
        var c = function(e2) {
          this.scopeName = e2;
        };
        t.FullScopeDependency = c;
        var u = (function() {
          function e2(e3, t2) {
            this.scopeName = e3, this.include = t2;
          }
          return e2.prototype.toKey = function() {
            return this.scopeName + "#" + this.include;
          }, e2;
        })();
        t.PartialScopeDependency = u;
        var l = (function() {
          function e2() {
            this.full = [], this.partial = [], this.visitedRule = /* @__PURE__ */ new Set(), this._seenFull = /* @__PURE__ */ new Set(), this._seenPartial = /* @__PURE__ */ new Set();
          }
          return e2.prototype.add = function(e3) {
            e3 instanceof c ? this._seenFull.has(e3.scopeName) || (this._seenFull.add(e3.scopeName), this.full.push(e3)) : this._seenPartial.has(e3.toKey()) || (this._seenPartial.add(e3.toKey()), this.partial.push(e3));
          }, e2;
        })();
        function h(e2, t2, n2, i2, o2) {
          for (var s2 = 0, a2 = i2; s2 < a2.length; s2++) {
            var l2 = a2[s2];
            if (!e2.visitedRule.has(l2)) {
              e2.visitedRule.add(l2);
              var d2 = l2.repository ? r.mergeObjects({}, o2, l2.repository) : o2;
              Array.isArray(l2.patterns) && h(e2, t2, n2, l2.patterns, d2);
              var g2 = l2.include;
              if (g2) if ("$base" === g2 || g2 === t2.scopeName) f(e2, t2, t2);
              else if ("$self" === g2 || g2 === n2.scopeName) f(e2, t2, n2);
              else if ("#" === g2.charAt(0)) p(e2, t2, n2, g2.substring(1), d2);
              else {
                var m2 = g2.indexOf("#");
                if (m2 >= 0) {
                  var _2 = g2.substring(0, m2), y2 = g2.substring(m2 + 1);
                  _2 === t2.scopeName ? p(e2, t2, t2, y2, d2) : _2 === n2.scopeName ? p(e2, t2, n2, y2, d2) : e2.add(new u(_2, g2.substring(m2 + 1)));
                } else e2.add(new c(g2));
              }
            }
          }
        }
        function p(e2, t2, n2, r2, i2) {
          (void 0 === i2 && (i2 = n2.repository), i2 && i2[r2]) && h(e2, t2, n2, [i2[r2]], i2);
        }
        function f(e2, t2, n2) {
          if (n2.patterns && Array.isArray(n2.patterns) && h(e2, t2, n2, n2.patterns, n2.repository), n2.injections) {
            var r2 = [];
            for (var i2 in n2.injections) r2.push(n2.injections[i2]);
            h(e2, t2, n2, r2, n2.repository);
          }
        }
        function d(e2, t2) {
          if (!e2) return false;
          if (e2 === t2) return true;
          var n2 = t2.length;
          return e2.length > n2 && e2.substr(0, n2) === t2 && "." === e2[n2];
        }
        function g(e2, t2) {
          if (t2.length < e2.length) return false;
          var n2 = 0;
          return e2.every((function(e3) {
            for (var r2 = n2; r2 < t2.length; r2++) if (d(t2[r2], e3)) return n2 = r2 + 1, true;
            return false;
          }));
        }
        function m(e2, t2, n2, r2, s2) {
          for (var a2 = o.createMatchers(t2, g), c2 = i.RuleFactory.getCompiledRuleId(n2, r2, s2.repository), u2 = 0, l2 = a2; u2 < l2.length; u2++) {
            var h2 = l2[u2];
            e2.push({ matcher: h2.matcher, ruleId: c2, grammar: s2, priority: h2.priority });
          }
        }
        t.ScopeDependencyCollector = l, t.collectSpecificDependencies = p, t.collectDependencies = f;
        var _ = function(e2, t2, n2, r2) {
          this.scopeName = e2, this.languageId = t2, this.tokenType = n2, this.themeData = r2;
        };
        t.ScopeMetadata = _;
        var y = (function() {
          function e2(t2, n2, r2) {
            if (this._initialLanguage = t2, this._themeProvider = n2, this._cache = /* @__PURE__ */ new Map(), this._defaultMetaData = new _("", this._initialLanguage, 0, [this._themeProvider.getDefaults()]), this._embeddedLanguages = /* @__PURE__ */ Object.create(null), r2) for (var i2 = Object.keys(r2), o2 = 0, s2 = i2.length; o2 < s2; o2++) {
              var a2 = i2[o2], c2 = r2[a2];
              "number" == typeof c2 && 0 !== c2 ? this._embeddedLanguages[a2] = c2 : console.warn("Invalid embedded language found at scope " + a2 + ": <<" + c2 + ">>");
            }
            var u2 = Object.keys(this._embeddedLanguages).map((function(t3) {
              return e2._escapeRegExpCharacters(t3);
            }));
            0 === u2.length ? this._embeddedLanguagesRegex = null : (u2.sort(), u2.reverse(), this._embeddedLanguagesRegex = new RegExp("^((" + u2.join(")|(") + "))($|\\.)", ""));
          }
          return e2.prototype.onDidChangeTheme = function() {
            this._cache = /* @__PURE__ */ new Map(), this._defaultMetaData = new _("", this._initialLanguage, 0, [this._themeProvider.getDefaults()]);
          }, e2.prototype.getDefaultMetadata = function() {
            return this._defaultMetaData;
          }, e2._escapeRegExpCharacters = function(e3) {
            return e3.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
          }, e2.prototype.getMetadataForScope = function(t2) {
            if (null === t2) return e2._NULL_SCOPE_METADATA;
            var n2 = this._cache.get(t2);
            return n2 || (n2 = this._doGetMetadataForScope(t2), this._cache.set(t2, n2), n2);
          }, e2.prototype._doGetMetadataForScope = function(e3) {
            var t2 = this._scopeToLanguage(e3), n2 = this._toStandardTokenType(e3), r2 = this._themeProvider.themeMatch(e3);
            return new _(e3, t2, n2, r2);
          }, e2.prototype._scopeToLanguage = function(e3) {
            if (!e3) return 0;
            if (!this._embeddedLanguagesRegex) return 0;
            var t2 = e3.match(this._embeddedLanguagesRegex);
            if (!t2) return 0;
            var n2 = this._embeddedLanguages[t2[1]] || 0;
            return n2 || 0;
          }, e2.prototype._toStandardTokenType = function(t2) {
            var n2 = t2.match(e2.STANDARD_TOKEN_TYPE_REGEXP);
            if (!n2) return 0;
            switch (n2[1]) {
              case "comment":
                return 1;
              case "string":
                return 2;
              case "regex":
                return 4;
              case "meta.embedded":
                return 8;
            }
            throw new Error("Unexpected match for standard token type!");
          }, e2._NULL_SCOPE_METADATA = new _("", 0, 0, null), e2.STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/, e2;
        })(), v = (function() {
          function e2(e3, t2, n2, r2, i2, s2) {
            if (this._scopeMetadataProvider = new y(t2, i2, n2), this._onigLib = s2, this._rootId = -1, this._lastRuleId = 0, this._ruleId2desc = [null], this._includedGrammars = {}, this._grammarRepository = i2, this._grammar = C(e3, null), this._injections = null, this._tokenTypeMatchers = [], r2) for (var a2 = 0, c2 = Object.keys(r2); a2 < c2.length; a2++) for (var u2 = c2[a2], l2 = 0, h2 = o.createMatchers(u2, g); l2 < h2.length; l2++) {
              var p2 = h2[l2];
              this._tokenTypeMatchers.push({ matcher: p2.matcher, type: r2[u2] });
            }
          }
          return e2.prototype.dispose = function() {
            for (var e3 = 0, t2 = this._ruleId2desc; e3 < t2.length; e3++) {
              var n2 = t2[e3];
              n2 && n2.dispose();
            }
          }, e2.prototype.createOnigScanner = function(e3) {
            return this._onigLib.createOnigScanner(e3);
          }, e2.prototype.createOnigString = function(e3) {
            return this._onigLib.createOnigString(e3);
          }, e2.prototype.onDidChangeTheme = function() {
            this._scopeMetadataProvider.onDidChangeTheme();
          }, e2.prototype.getMetadataForScope = function(e3) {
            return this._scopeMetadataProvider.getMetadataForScope(e3);
          }, e2.prototype.getInjections = function() {
            var e3 = this;
            if (null === this._injections) {
              this._injections = [];
              var t2 = this._grammar.injections;
              if (t2) for (var n2 in t2) m(this._injections, n2, t2[n2], this, this._grammar);
              if (this._grammarRepository) {
                var r2 = this._grammarRepository.injections(this._grammar.scopeName);
                r2 && r2.forEach((function(t3) {
                  var n3 = e3.getExternalGrammar(t3);
                  if (n3) {
                    var r3 = n3.injectionSelector;
                    r3 && m(e3._injections, r3, n3, e3, n3);
                  }
                }));
              }
              this._injections.sort((function(e4, t3) {
                return e4.priority - t3.priority;
              }));
            }
            return this._injections;
          }, e2.prototype.registerRule = function(e3) {
            var t2 = ++this._lastRuleId, n2 = e3(t2);
            return this._ruleId2desc[t2] = n2, n2;
          }, e2.prototype.getRule = function(e3) {
            return this._ruleId2desc[e3];
          }, e2.prototype.getExternalGrammar = function(e3, t2) {
            if (this._includedGrammars[e3]) return this._includedGrammars[e3];
            if (this._grammarRepository) {
              var n2 = this._grammarRepository.lookup(e3);
              if (n2) return this._includedGrammars[e3] = C(n2, t2 && t2.$base), this._includedGrammars[e3];
            }
            return null;
          }, e2.prototype.tokenizeLine = function(e3, t2) {
            var n2 = this._tokenize(e3, t2, false);
            return { tokens: n2.lineTokens.getResult(n2.ruleStack, n2.lineLength), ruleStack: n2.ruleStack };
          }, e2.prototype.tokenizeLine2 = function(e3, t2) {
            var n2 = this._tokenize(e3, t2, true);
            return { tokens: n2.lineTokens.getBinaryResult(n2.ruleStack, n2.lineLength), ruleStack: n2.ruleStack };
          }, e2.prototype._tokenize = function(e3, t2, n2) {
            var r2;
            if (-1 === this._rootId && (this._rootId = i.RuleFactory.getCompiledRuleId(this._grammar.repository.$self, this, this._grammar.repository)), t2 && t2 !== I.NULL) r2 = false, t2.reset();
            else {
              r2 = true;
              var o2 = this._scopeMetadataProvider.getDefaultMetadata(), s2 = o2.themeData[0], a2 = P.set(0, o2.languageId, o2.tokenType, s2.fontStyle, s2.foreground, s2.background), c2 = this.getRule(this._rootId).getName(null, null), u2 = this._scopeMetadataProvider.getMetadataForScope(c2), l2 = x.mergeMetadata(a2, null, u2), h2 = new x(null, null === c2 ? "unknown" : c2, l2);
              t2 = new I(null, this._rootId, -1, -1, false, null, h2, h2);
            }
            e3 += "\n";
            var p2 = this.createOnigString(e3), f2 = p2.content.length, d2 = new T(n2, e3, this._tokenTypeMatchers), g2 = S(this, p2, r2, 0, t2, d2, true);
            return b(p2), { lineLength: f2, lineTokens: d2, ruleStack: g2 };
          }, e2;
        })();
        function b(e2) {
          "function" == typeof e2.dispose && e2.dispose();
        }
        function C(e2, t2) {
          return (e2 = r.clone(e2)).repository = e2.repository || {}, e2.repository.$self = { $vscodeTextmateLocation: e2.$vscodeTextmateLocation, patterns: e2.patterns, name: e2.scopeName }, e2.repository.$base = t2 || e2.repository.$self, e2;
        }
        function w(e2, t2, n2, r2, i2, o2, s2) {
          if (0 !== o2.length) {
            for (var a2 = t2.content, c2 = Math.min(o2.length, s2.length), u2 = [], l2 = s2[0].end, h2 = 0; h2 < c2; h2++) {
              var p2 = o2[h2];
              if (null !== p2) {
                var f2 = s2[h2];
                if (0 !== f2.length) {
                  if (f2.start > l2) break;
                  for (; u2.length > 0 && u2[u2.length - 1].endPos <= f2.start; ) i2.produceFromScopes(u2[u2.length - 1].scopes, u2[u2.length - 1].endPos), u2.pop();
                  if (u2.length > 0 ? i2.produceFromScopes(u2[u2.length - 1].scopes, f2.start) : i2.produce(r2, f2.start), p2.retokenizeCapturedWithRuleId) {
                    var d2 = p2.getName(a2, s2), g2 = r2.contentNameScopesList.push(e2, d2), m2 = p2.getContentName(a2, s2), _2 = g2.push(e2, m2), y2 = r2.push(p2.retokenizeCapturedWithRuleId, f2.start, -1, false, null, g2, _2), v2 = e2.createOnigString(a2.substring(0, f2.end));
                    S(e2, v2, n2 && 0 === f2.start, f2.start, y2, i2, false), b(v2);
                  } else {
                    var C2 = p2.getName(a2, s2);
                    if (null !== C2) {
                      var w2 = (u2.length > 0 ? u2[u2.length - 1].scopes : r2.contentNameScopesList).push(e2, C2);
                      u2.push(new A(w2, f2.end));
                    }
                  }
                }
              }
            }
            for (; u2.length > 0; ) i2.produceFromScopes(u2[u2.length - 1].scopes, u2[u2.length - 1].endPos), u2.pop();
          }
        }
        function k(e2) {
          for (var t2 = [], n2 = 0, r2 = e2.rules.length; n2 < r2; n2++) t2.push("   - " + e2.rules[n2] + ": " + e2.debugRegExps[n2]);
          return t2.join("\n");
        }
        function R(e2, t2, n2, r2, i2, o2) {
          var c2 = (function(e3, t3, n3, r3, i3, o3) {
            var c3 = i3.getRule(e3), u3 = c3.compile(e3, i3.endRule, n3, r3 === o3), l3 = 0;
            s.DebugFlags.InDebugMode && (l3 = a());
            var h3 = u3.scanner.findNextMatchSync(t3, r3);
            if (s.DebugFlags.InDebugMode) {
              var p3 = a() - l3;
              p3 > 5 && console.warn("Rule " + c3.debugName + " (" + c3.id + ") matching took " + p3 + " against '" + t3 + "'"), h3 && console.log("matched rule id: " + u3.rules[h3.index] + " from " + h3.captureIndices[0].start + " to " + h3.captureIndices[0].end);
            }
            return h3 ? { captureIndices: h3.captureIndices, matchedRuleId: u3.rules[h3.index] } : null;
          })(e2, t2, n2, r2, i2, o2), u2 = e2.getInjections();
          if (0 === u2.length) return c2;
          var l2 = (function(e3, t3, n3, r3, i3, o3, a2) {
            for (var c3, u3 = Number.MAX_VALUE, l3 = null, h3 = 0, p3 = o3.contentNameScopesList.generateScopes(), f2 = 0, d2 = e3.length; f2 < d2; f2++) {
              var g2 = e3[f2];
              if (g2.matcher(p3)) {
                var m2 = t3.getRule(g2.ruleId).compile(t3, null, r3, i3 === a2), _2 = m2.scanner.findNextMatchSync(n3, i3);
                if (s.DebugFlags.InDebugMode && (console.log("  scanning for injections"), console.log(k(m2))), _2) {
                  var y2 = _2.captureIndices[0].start;
                  if (!(y2 >= u3) && (u3 = y2, l3 = _2.captureIndices, c3 = m2.rules[_2.index], h3 = g2.priority, u3 === i3)) break;
                }
              }
            }
            return l3 ? { priorityMatch: -1 === h3, captureIndices: l3, matchedRuleId: c3 } : null;
          })(u2, e2, t2, n2, r2, i2, o2);
          if (!l2) return c2;
          if (!c2) return l2;
          var h2 = c2.captureIndices[0].start, p2 = l2.captureIndices[0].start;
          return p2 < h2 || l2.priorityMatch && p2 === h2 ? l2 : c2;
        }
        function S(e2, t2, n2, r2, o2, a2, c2) {
          var u2 = t2.content.length, l2 = false, h2 = -1;
          if (c2) {
            var p2 = (function(e3, t3, n3, r3, o3, a3) {
              for (var c3 = o3.beginRuleCapturedEOL ? 0 : -1, u3 = [], l3 = o3; l3; l3 = l3.pop()) {
                var h3 = l3.getRule(e3);
                h3 instanceof i.BeginWhileRule && u3.push({ rule: h3, stack: l3 });
              }
              for (var p3 = u3.pop(); p3; p3 = u3.pop()) {
                var f3 = p3.rule.compileWhile(e3, p3.stack.endRule, n3, c3 === r3), d2 = f3.scanner.findNextMatchSync(t3, r3);
                if (s.DebugFlags.InDebugMode && (console.log("  scanning for while rule"), console.log(k(f3))), !d2) {
                  s.DebugFlags.InDebugMode && console.log("  popping " + p3.rule.debugName + " - " + p3.rule.debugWhileRegExp), o3 = p3.stack.pop();
                  break;
                }
                if (-2 !== f3.rules[d2.index]) {
                  o3 = p3.stack.pop();
                  break;
                }
                d2.captureIndices && d2.captureIndices.length && (a3.produce(p3.stack, d2.captureIndices[0].start), w(e3, t3, n3, p3.stack, a3, p3.rule.whileCaptures, d2.captureIndices), a3.produce(p3.stack, d2.captureIndices[0].end), c3 = d2.captureIndices[0].end, d2.captureIndices[0].end > r3 && (r3 = d2.captureIndices[0].end, n3 = false));
              }
              return { stack: o3, linePos: r3, anchorPosition: c3, isFirstLine: n3 };
            })(e2, t2, n2, r2, o2, a2);
            o2 = p2.stack, r2 = p2.linePos, n2 = p2.isFirstLine, h2 = p2.anchorPosition;
          }
          for (; !l2; ) f2();
          function f2() {
            s.DebugFlags.InDebugMode && (console.log(""), console.log("@@scanNext " + r2 + ": |" + t2.content.substr(r2).replace(/\n$/, "\\n") + "|"));
            var c3 = R(e2, t2, n2, r2, o2, h2);
            if (!c3) return s.DebugFlags.InDebugMode && console.log("  no more matches."), a2.produce(o2, u2), void (l2 = true);
            var p3 = c3.captureIndices, f3 = c3.matchedRuleId, d2 = !!(p3 && p3.length > 0) && p3[0].end > r2;
            if (-1 === f3) {
              var g2 = o2.getRule(e2);
              s.DebugFlags.InDebugMode && console.log("  popping " + g2.debugName + " - " + g2.debugEndRegExp), a2.produce(o2, p3[0].start), o2 = o2.setContentNameScopesList(o2.nameScopesList), w(e2, t2, n2, o2, a2, g2.endCaptures, p3), a2.produce(o2, p3[0].end);
              var m2 = o2;
              if (o2 = o2.pop(), h2 = m2.getAnchorPos(), !d2 && m2.getEnterPos() === r2) return s.DebugFlags.InDebugMode && console.error("[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"), o2 = m2, a2.produce(o2, u2), void (l2 = true);
            } else {
              var _2 = e2.getRule(f3);
              a2.produce(o2, p3[0].start);
              var y2 = o2, v2 = _2.getName(t2.content, p3), b2 = o2.contentNameScopesList.push(e2, v2);
              if (o2 = o2.push(f3, r2, h2, p3[0].end === u2, null, b2, b2), _2 instanceof i.BeginEndRule) {
                var C2 = _2;
                s.DebugFlags.InDebugMode && console.log("  pushing " + C2.debugName + " - " + C2.debugBeginRegExp), w(e2, t2, n2, o2, a2, C2.beginCaptures, p3), a2.produce(o2, p3[0].end), h2 = p3[0].end;
                var k2 = C2.getContentName(t2.content, p3), S2 = b2.push(e2, k2);
                if (o2 = o2.setContentNameScopesList(S2), C2.endHasBackReferences && (o2 = o2.setEndRule(C2.getEndWithResolvedBackReferences(t2.content, p3))), !d2 && y2.hasSameRuleAs(o2)) return s.DebugFlags.InDebugMode && console.error("[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"), o2 = o2.pop(), a2.produce(o2, u2), void (l2 = true);
              } else if (_2 instanceof i.BeginWhileRule) {
                C2 = _2;
                s.DebugFlags.InDebugMode && console.log("  pushing " + C2.debugName), w(e2, t2, n2, o2, a2, C2.beginCaptures, p3), a2.produce(o2, p3[0].end), h2 = p3[0].end;
                k2 = C2.getContentName(t2.content, p3), S2 = b2.push(e2, k2);
                if (o2 = o2.setContentNameScopesList(S2), C2.whileHasBackReferences && (o2 = o2.setEndRule(C2.getWhileWithResolvedBackReferences(t2.content, p3))), !d2 && y2.hasSameRuleAs(o2)) return s.DebugFlags.InDebugMode && console.error("[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"), o2 = o2.pop(), a2.produce(o2, u2), void (l2 = true);
              } else {
                var P2 = _2;
                if (s.DebugFlags.InDebugMode && console.log("  matched " + P2.debugName + " - " + P2.debugMatchRegExp), w(e2, t2, n2, o2, a2, P2.captures, p3), a2.produce(o2, p3[0].end), o2 = o2.pop(), !d2) return s.DebugFlags.InDebugMode && console.error("[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"), o2 = o2.safePop(), a2.produce(o2, u2), void (l2 = true);
              }
            }
            p3[0].end > r2 && (r2 = p3[0].end, n2 = false);
          }
          return o2;
        }
        t.Grammar = v;
        var P = (function() {
          function e2() {
          }
          return e2.toBinaryStr = function(e3) {
            for (var t2 = e3.toString(2); t2.length < 32; ) t2 = "0" + t2;
            return t2;
          }, e2.printMetadata = function(t2) {
            var n2 = e2.getLanguageId(t2), r2 = e2.getTokenType(t2), i2 = e2.getFontStyle(t2), o2 = e2.getForeground(t2), s2 = e2.getBackground(t2);
            console.log({ languageId: n2, tokenType: r2, fontStyle: i2, foreground: o2, background: s2 });
          }, e2.getLanguageId = function(e3) {
            return (255 & e3) >>> 0;
          }, e2.getTokenType = function(e3) {
            return (1792 & e3) >>> 8;
          }, e2.getFontStyle = function(e3) {
            return (14336 & e3) >>> 11;
          }, e2.getForeground = function(e3) {
            return (8372224 & e3) >>> 14;
          }, e2.getBackground = function(e3) {
            return (4286578688 & e3) >>> 23;
          }, e2.set = function(t2, n2, r2, i2, o2, s2) {
            var a2 = e2.getLanguageId(t2), c2 = e2.getTokenType(t2), u2 = e2.getFontStyle(t2), l2 = e2.getForeground(t2), h2 = e2.getBackground(t2);
            return 0 !== n2 && (a2 = n2), 0 !== r2 && (c2 = 8 === r2 ? 0 : r2), -1 !== i2 && (u2 = i2), 0 !== o2 && (l2 = o2), 0 !== s2 && (h2 = s2), (a2 << 0 | c2 << 8 | u2 << 11 | l2 << 14 | h2 << 23) >>> 0;
          }, e2;
        })();
        t.StackElementMetadata = P;
        var x = (function() {
          function e2(e3, t2, n2) {
            this.parent = e3, this.scope = t2, this.metadata = n2;
          }
          return e2._equals = function(e3, t2) {
            for (; ; ) {
              if (e3 === t2) return true;
              if (!e3 && !t2) return true;
              if (!e3 || !t2) return false;
              if (e3.scope !== t2.scope || e3.metadata !== t2.metadata) return false;
              e3 = e3.parent, t2 = t2.parent;
            }
          }, e2.prototype.equals = function(t2) {
            return e2._equals(this, t2);
          }, e2._matchesScope = function(e3, t2, n2) {
            return t2 === e3 || e3.substring(0, n2.length) === n2;
          }, e2._matches = function(e3, t2) {
            if (null === t2) return true;
            for (var n2 = t2.length, r2 = 0, i2 = t2[r2], o2 = i2 + "."; e3; ) {
              if (this._matchesScope(e3.scope, i2, o2)) {
                if (++r2 === n2) return true;
                o2 = (i2 = t2[r2]) + ".";
              }
              e3 = e3.parent;
            }
            return false;
          }, e2.mergeMetadata = function(e3, t2, n2) {
            if (null === n2) return e3;
            var r2 = -1, i2 = 0, o2 = 0;
            if (null !== n2.themeData) for (var s2 = 0, a2 = n2.themeData.length; s2 < a2; s2++) {
              var c2 = n2.themeData[s2];
              if (this._matches(t2, c2.parentScopes)) {
                r2 = c2.fontStyle, i2 = c2.foreground, o2 = c2.background;
                break;
              }
            }
            return P.set(e3, n2.languageId, n2.tokenType, r2, i2, o2);
          }, e2._push = function(t2, n2, r2) {
            for (var i2 = 0, o2 = r2.length; i2 < o2; i2++) {
              var s2 = r2[i2], a2 = n2.getMetadataForScope(s2), c2 = e2.mergeMetadata(t2.metadata, t2, a2);
              t2 = new e2(t2, s2, c2);
            }
            return t2;
          }, e2.prototype.push = function(t2, n2) {
            return null === n2 ? this : n2.indexOf(" ") >= 0 ? e2._push(this, t2, n2.split(/ /g)) : e2._push(this, t2, [n2]);
          }, e2._generateScopes = function(e3) {
            for (var t2 = [], n2 = 0; e3; ) t2[n2++] = e3.scope, e3 = e3.parent;
            return t2.reverse(), t2;
          }, e2.prototype.generateScopes = function() {
            return e2._generateScopes(this);
          }, e2;
        })();
        t.ScopeListElement = x;
        var I = (function() {
          function e2(e3, t2, n2, r2, i2, o2, s2, a2) {
            this.parent = e3, this.depth = this.parent ? this.parent.depth + 1 : 1, this.ruleId = t2, this._enterPos = n2, this._anchorPos = r2, this.beginRuleCapturedEOL = i2, this.endRule = o2, this.nameScopesList = s2, this.contentNameScopesList = a2;
          }
          return e2._structuralEquals = function(e3, t2) {
            for (; ; ) {
              if (e3 === t2) return true;
              if (!e3 && !t2) return true;
              if (!e3 || !t2) return false;
              if (e3.depth !== t2.depth || e3.ruleId !== t2.ruleId || e3.endRule !== t2.endRule) return false;
              e3 = e3.parent, t2 = t2.parent;
            }
          }, e2._equals = function(e3, t2) {
            return e3 === t2 || !!this._structuralEquals(e3, t2) && e3.contentNameScopesList.equals(t2.contentNameScopesList);
          }, e2.prototype.clone = function() {
            return this;
          }, e2.prototype.equals = function(t2) {
            return null !== t2 && e2._equals(this, t2);
          }, e2._reset = function(e3) {
            for (; e3; ) e3._enterPos = -1, e3._anchorPos = -1, e3 = e3.parent;
          }, e2.prototype.reset = function() {
            e2._reset(this);
          }, e2.prototype.pop = function() {
            return this.parent;
          }, e2.prototype.safePop = function() {
            return this.parent ? this.parent : this;
          }, e2.prototype.push = function(t2, n2, r2, i2, o2, s2, a2) {
            return new e2(this, t2, n2, r2, i2, o2, s2, a2);
          }, e2.prototype.getEnterPos = function() {
            return this._enterPos;
          }, e2.prototype.getAnchorPos = function() {
            return this._anchorPos;
          }, e2.prototype.getRule = function(e3) {
            return e3.getRule(this.ruleId);
          }, e2.prototype._writeString = function(e3, t2) {
            return this.parent && (t2 = this.parent._writeString(e3, t2)), e3[t2++] = "(" + this.ruleId + ", TODO-" + this.nameScopesList + ", TODO-" + this.contentNameScopesList + ")", t2;
          }, e2.prototype.toString = function() {
            var e3 = [];
            return this._writeString(e3, 0), "[" + e3.join(",") + "]";
          }, e2.prototype.setContentNameScopesList = function(e3) {
            return this.contentNameScopesList === e3 ? this : this.parent.push(this.ruleId, this._enterPos, this._anchorPos, this.beginRuleCapturedEOL, this.endRule, this.nameScopesList, e3);
          }, e2.prototype.setEndRule = function(t2) {
            return this.endRule === t2 ? this : new e2(this.parent, this.ruleId, this._enterPos, this._anchorPos, this.beginRuleCapturedEOL, t2, this.nameScopesList, this.contentNameScopesList);
          }, e2.prototype.hasSameRuleAs = function(e3) {
            return this.ruleId === e3.ruleId;
          }, e2.NULL = new e2(null, 0, 0, 0, false, null, null, null), e2;
        })();
        t.StackElement = I;
        var A = function(e2, t2) {
          this.scopes = e2, this.endPos = t2;
        };
        t.LocalStackElement = A;
        var T = (function() {
          function e2(e3, t2, n2) {
            this._emitBinaryTokens = e3, this._tokenTypeOverrides = n2, s.DebugFlags.InDebugMode ? this._lineText = t2 : this._lineText = null, this._tokens = [], this._binaryTokens = [], this._lastTokenEndIndex = 0;
          }
          return e2.prototype.produce = function(e3, t2) {
            this.produceFromScopes(e3.contentNameScopesList, t2);
          }, e2.prototype.produceFromScopes = function(e3, t2) {
            if (!(this._lastTokenEndIndex >= t2)) {
              if (this._emitBinaryTokens) {
                for (var n2 = e3.metadata, r2 = 0, i2 = this._tokenTypeOverrides; r2 < i2.length; r2++) {
                  var o2 = i2[r2];
                  o2.matcher(e3.generateScopes()) && (n2 = P.set(n2, 0, L(o2.type), -1, 0, 0));
                }
                return this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 1] === n2 || (this._binaryTokens.push(this._lastTokenEndIndex), this._binaryTokens.push(n2)), void (this._lastTokenEndIndex = t2);
              }
              var a2 = e3.generateScopes();
              if (s.DebugFlags.InDebugMode) {
                console.log("  token: |" + this._lineText.substring(this._lastTokenEndIndex, t2).replace(/\n$/, "\\n") + "|");
                for (var c2 = 0; c2 < a2.length; c2++) console.log("      * " + a2[c2]);
              }
              this._tokens.push({ startIndex: this._lastTokenEndIndex, endIndex: t2, scopes: a2 }), this._lastTokenEndIndex = t2;
            }
          }, e2.prototype.getResult = function(e3, t2) {
            return this._tokens.length > 0 && this._tokens[this._tokens.length - 1].startIndex === t2 - 1 && this._tokens.pop(), 0 === this._tokens.length && (this._lastTokenEndIndex = -1, this.produce(e3, t2), this._tokens[this._tokens.length - 1].startIndex = 0), this._tokens;
          }, e2.prototype.getBinaryResult = function(e3, t2) {
            this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 2] === t2 - 1 && (this._binaryTokens.pop(), this._binaryTokens.pop()), 0 === this._binaryTokens.length && (this._lastTokenEndIndex = -1, this.produce(e3, t2), this._binaryTokens[this._binaryTokens.length - 2] = 0);
            for (var n2 = new Uint32Array(this._binaryTokens.length), r2 = 0, i2 = this._binaryTokens.length; r2 < i2; r2++) n2[r2] = this._binaryTokens[r2];
            return n2;
          }, e2;
        })();
        function L(e2) {
          switch (e2) {
            case 4:
              return 4;
            case 2:
              return 2;
            case 1:
              return 1;
            case 0:
            default:
              return 8;
          }
        }
      }, function(e, t, n) {
        "use strict";
        function r(e2) {
          return Array.isArray(e2) ? (function(e3) {
            for (var t2 = [], n2 = 0, i2 = e3.length; n2 < i2; n2++) t2[n2] = r(e3[n2]);
            return t2;
          })(e2) : "object" == typeof e2 ? (function(e3) {
            var t2 = {};
            for (var n2 in e3) t2[n2] = r(e3[n2]);
            return t2;
          })(e2) : e2;
        }
        Object.defineProperty(t, "__esModule", { value: true }), t.clone = function(e2) {
          return r(e2);
        }, t.mergeObjects = function(e2) {
          for (var t2 = [], n2 = 1; n2 < arguments.length; n2++) t2[n2 - 1] = arguments[n2];
          return t2.forEach((function(t3) {
            for (var n3 in t3) e2[n3] = t3[n3];
          })), e2;
        }, t.basename = function e2(t2) {
          var n2 = ~t2.lastIndexOf("/") || ~t2.lastIndexOf("\\");
          return 0 === n2 ? t2 : ~n2 == t2.length - 1 ? e2(t2.substring(0, t2.length - 1)) : t2.substr(1 + ~n2);
        };
        var i = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/, o = (function() {
          function e2() {
          }
          return e2.hasCaptures = function(e3) {
            return null !== e3 && i.test(e3);
          }, e2.replaceCaptures = function(e3, t2, n2) {
            return e3.replace(i, (function(e4, r2, i2, o2) {
              var s = n2[parseInt(r2 || i2, 10)];
              if (!s) return e4;
              for (var a = t2.substring(s.start, s.end); "." === a[0]; ) a = a.substring(1);
              switch (o2) {
                case "downcase":
                  return a.toLowerCase();
                case "upcase":
                  return a.toUpperCase();
                default:
                  return a;
              }
            }));
          }, e2;
        })();
        t.RegexSource = o;
      }, function(e, t, n) {
        "use strict";
        (function(e2) {
          Object.defineProperty(t, "__esModule", { value: true }), t.DebugFlags = { InDebugMode: void 0 !== e2 && !!e2.env.VSCODE_TEXTMATE_DEBUG };
        }).call(this, n(7));
      }, function(e, t, n) {
        "use strict";
        var r = this && this.__awaiter || function(e2, t2, n2, r2) {
          return new (n2 || (n2 = Promise))((function(i2, o2) {
            function s2(e3) {
              try {
                c2(r2.next(e3));
              } catch (e4) {
                o2(e4);
              }
            }
            function a2(e3) {
              try {
                c2(r2.throw(e3));
              } catch (e4) {
                o2(e4);
              }
            }
            function c2(e3) {
              var t3;
              e3.done ? i2(e3.value) : (t3 = e3.value, t3 instanceof n2 ? t3 : new n2((function(e4) {
                e4(t3);
              }))).then(s2, a2);
            }
            c2((r2 = r2.apply(e2, t2 || [])).next());
          }));
        }, i = this && this.__generator || function(e2, t2) {
          var n2, r2, i2, o2, s2 = { label: 0, sent: function() {
            if (1 & i2[0]) throw i2[1];
            return i2[1];
          }, trys: [], ops: [] };
          return o2 = { next: a2(0), throw: a2(1), return: a2(2) }, "function" == typeof Symbol && (o2[Symbol.iterator] = function() {
            return this;
          }), o2;
          function a2(o3) {
            return function(a3) {
              return (function(o4) {
                if (n2) throw new TypeError("Generator is already executing.");
                for (; s2; ) try {
                  if (n2 = 1, r2 && (i2 = 2 & o4[0] ? r2.return : o4[0] ? r2.throw || ((i2 = r2.return) && i2.call(r2), 0) : r2.next) && !(i2 = i2.call(r2, o4[1])).done) return i2;
                  switch (r2 = 0, i2 && (o4 = [2 & o4[0], i2.value]), o4[0]) {
                    case 0:
                    case 1:
                      i2 = o4;
                      break;
                    case 4:
                      return s2.label++, { value: o4[1], done: false };
                    case 5:
                      s2.label++, r2 = o4[1], o4 = [0];
                      continue;
                    case 7:
                      o4 = s2.ops.pop(), s2.trys.pop();
                      continue;
                    default:
                      if (!(i2 = s2.trys, (i2 = i2.length > 0 && i2[i2.length - 1]) || 6 !== o4[0] && 2 !== o4[0])) {
                        s2 = 0;
                        continue;
                      }
                      if (3 === o4[0] && (!i2 || o4[1] > i2[0] && o4[1] < i2[3])) {
                        s2.label = o4[1];
                        break;
                      }
                      if (6 === o4[0] && s2.label < i2[1]) {
                        s2.label = i2[1], i2 = o4;
                        break;
                      }
                      if (i2 && s2.label < i2[2]) {
                        s2.label = i2[2], s2.ops.push(o4);
                        break;
                      }
                      i2[2] && s2.ops.pop(), s2.trys.pop();
                      continue;
                  }
                  o4 = t2.call(e2, s2);
                } catch (e3) {
                  o4 = [6, e3], r2 = 0;
                } finally {
                  n2 = i2 = 0;
                }
                if (5 & o4[0]) throw o4[1];
                return { value: o4[0] ? o4[1] : void 0, done: true };
              })([o3, a3]);
            };
          }
        };
        Object.defineProperty(t, "__esModule", { value: true });
        var o = n(4), s = n(8), a = n(11), c = n(0), u = (function() {
          function e2(e3) {
            this._options = e3, this._syncRegistry = new o.SyncRegistry(a.Theme.createFromRawTheme(e3.theme, e3.colorMap), e3.onigLib), this._ensureGrammarCache = /* @__PURE__ */ new Map();
          }
          return e2.prototype.dispose = function() {
            this._syncRegistry.dispose();
          }, e2.prototype.setTheme = function(e3, t2) {
            this._syncRegistry.setTheme(a.Theme.createFromRawTheme(e3, t2));
          }, e2.prototype.getColorMap = function() {
            return this._syncRegistry.getColorMap();
          }, e2.prototype.loadGrammarWithEmbeddedLanguages = function(e3, t2, n2) {
            return this.loadGrammarWithConfiguration(e3, t2, { embeddedLanguages: n2 });
          }, e2.prototype.loadGrammarWithConfiguration = function(e3, t2, n2) {
            return this._loadGrammar(e3, t2, n2.embeddedLanguages, n2.tokenTypes);
          }, e2.prototype.loadGrammar = function(e3) {
            return this._loadGrammar(e3, 0, null, null);
          }, e2.prototype._doLoadSingleGrammar = function(e3) {
            return r(this, void 0, void 0, (function() {
              var t2, n2;
              return i(this, (function(r2) {
                switch (r2.label) {
                  case 0:
                    return [4, this._options.loadGrammar(e3)];
                  case 1:
                    return (t2 = r2.sent()) && (n2 = "function" == typeof this._options.getInjections ? this._options.getInjections(e3) : void 0, this._syncRegistry.addGrammar(t2, n2)), [2];
                }
              }));
            }));
          }, e2.prototype._loadSingleGrammar = function(e3) {
            return r(this, void 0, void 0, (function() {
              return i(this, (function(t2) {
                return this._ensureGrammarCache.has(e3) || this._ensureGrammarCache.set(e3, this._doLoadSingleGrammar(e3)), [2, this._ensureGrammarCache.get(e3)];
              }));
            }));
          }, e2.prototype._collectDependenciesForDep = function(e3, t2, n2) {
            var r2 = this._syncRegistry.lookup(n2.scopeName);
            if (r2) {
              n2 instanceof c.FullScopeDependency ? c.collectDependencies(t2, this._syncRegistry.lookup(e3), r2) : c.collectSpecificDependencies(t2, this._syncRegistry.lookup(e3), r2, n2.include);
              var i2 = this._syncRegistry.injections(n2.scopeName);
              if (i2) for (var o2 = 0, s2 = i2; o2 < s2.length; o2++) {
                var a2 = s2[o2];
                t2.add(new c.FullScopeDependency(a2));
              }
            } else if (n2.scopeName === e3) throw new Error("No grammar provided for <" + e3 + ">");
          }, e2.prototype._loadGrammar = function(e3, t2, n2, o2) {
            return r(this, void 0, void 0, (function() {
              var r2, s2, a2, u2, l, h, p, f, d, g, m, _, y = this;
              return i(this, (function(i2) {
                switch (i2.label) {
                  case 0:
                    r2 = /* @__PURE__ */ new Set(), s2 = /* @__PURE__ */ new Set(), r2.add(e3), a2 = [new c.FullScopeDependency(e3)], i2.label = 1;
                  case 1:
                    return a2.length > 0 ? (u2 = a2, a2 = [], [4, Promise.all(u2.map((function(e4) {
                      return y._loadSingleGrammar(e4.scopeName);
                    })))]) : [3, 3];
                  case 2:
                    for (i2.sent(), l = new c.ScopeDependencyCollector(), h = 0, p = u2; h < p.length; h++) _ = p[h], this._collectDependenciesForDep(e3, l, _);
                    for (f = 0, d = l.full; f < d.length; f++) _ = d[f], r2.has(_.scopeName) || (r2.add(_.scopeName), a2.push(_));
                    for (g = 0, m = l.partial; g < m.length; g++) _ = m[g], r2.has(_.scopeName) || s2.has(_.toKey()) || (s2.add(_.toKey()), a2.push(_));
                    return [3, 1];
                  case 3:
                    return [2, this.grammarForScopeName(e3, t2, n2, o2)];
                }
              }));
            }));
          }, e2.prototype.addGrammar = function(e3, t2, n2, o2) {
            return void 0 === t2 && (t2 = []), void 0 === n2 && (n2 = 0), void 0 === o2 && (o2 = null), r(this, void 0, void 0, (function() {
              return i(this, (function(r2) {
                switch (r2.label) {
                  case 0:
                    return this._syncRegistry.addGrammar(e3, t2), [4, this.grammarForScopeName(e3.scopeName, n2, o2)];
                  case 1:
                    return [2, r2.sent()];
                }
              }));
            }));
          }, e2.prototype.grammarForScopeName = function(e3, t2, n2, r2) {
            return void 0 === t2 && (t2 = 0), void 0 === n2 && (n2 = null), void 0 === r2 && (r2 = null), this._syncRegistry.grammarForScopeName(e3, t2, n2, r2);
          }, e2;
        })();
        t.Registry = u, t.INITIAL = c.StackElement.NULL, t.parseRawGrammar = s.parseRawGrammar;
      }, function(e, t, n) {
        "use strict";
        var r = this && this.__awaiter || function(e2, t2, n2, r2) {
          return new (n2 || (n2 = Promise))((function(i2, o2) {
            function s2(e3) {
              try {
                c(r2.next(e3));
              } catch (e4) {
                o2(e4);
              }
            }
            function a(e3) {
              try {
                c(r2.throw(e3));
              } catch (e4) {
                o2(e4);
              }
            }
            function c(e3) {
              var t3;
              e3.done ? i2(e3.value) : (t3 = e3.value, t3 instanceof n2 ? t3 : new n2((function(e4) {
                e4(t3);
              }))).then(s2, a);
            }
            c((r2 = r2.apply(e2, t2 || [])).next());
          }));
        }, i = this && this.__generator || function(e2, t2) {
          var n2, r2, i2, o2, s2 = { label: 0, sent: function() {
            if (1 & i2[0]) throw i2[1];
            return i2[1];
          }, trys: [], ops: [] };
          return o2 = { next: a(0), throw: a(1), return: a(2) }, "function" == typeof Symbol && (o2[Symbol.iterator] = function() {
            return this;
          }), o2;
          function a(o3) {
            return function(a2) {
              return (function(o4) {
                if (n2) throw new TypeError("Generator is already executing.");
                for (; s2; ) try {
                  if (n2 = 1, r2 && (i2 = 2 & o4[0] ? r2.return : o4[0] ? r2.throw || ((i2 = r2.return) && i2.call(r2), 0) : r2.next) && !(i2 = i2.call(r2, o4[1])).done) return i2;
                  switch (r2 = 0, i2 && (o4 = [2 & o4[0], i2.value]), o4[0]) {
                    case 0:
                    case 1:
                      i2 = o4;
                      break;
                    case 4:
                      return s2.label++, { value: o4[1], done: false };
                    case 5:
                      s2.label++, r2 = o4[1], o4 = [0];
                      continue;
                    case 7:
                      o4 = s2.ops.pop(), s2.trys.pop();
                      continue;
                    default:
                      if (!(i2 = s2.trys, (i2 = i2.length > 0 && i2[i2.length - 1]) || 6 !== o4[0] && 2 !== o4[0])) {
                        s2 = 0;
                        continue;
                      }
                      if (3 === o4[0] && (!i2 || o4[1] > i2[0] && o4[1] < i2[3])) {
                        s2.label = o4[1];
                        break;
                      }
                      if (6 === o4[0] && s2.label < i2[1]) {
                        s2.label = i2[1], i2 = o4;
                        break;
                      }
                      if (i2 && s2.label < i2[2]) {
                        s2.label = i2[2], s2.ops.push(o4);
                        break;
                      }
                      i2[2] && s2.ops.pop(), s2.trys.pop();
                      continue;
                  }
                  o4 = t2.call(e2, s2);
                } catch (e3) {
                  o4 = [6, e3], r2 = 0;
                } finally {
                  n2 = i2 = 0;
                }
                if (5 & o4[0]) throw o4[1];
                return { value: o4[0] ? o4[1] : void 0, done: true };
              })([o3, a2]);
            };
          }
        };
        Object.defineProperty(t, "__esModule", { value: true });
        var o = n(0), s = (function() {
          function e2(e3, t2) {
            this._theme = e3, this._grammars = {}, this._rawGrammars = {}, this._injectionGrammars = {}, this._onigLibPromise = t2;
          }
          return e2.prototype.dispose = function() {
            for (var e3 in this._grammars) this._grammars.hasOwnProperty(e3) && this._grammars[e3].dispose();
          }, e2.prototype.setTheme = function(e3) {
            var t2 = this;
            this._theme = e3, Object.keys(this._grammars).forEach((function(e4) {
              t2._grammars[e4].onDidChangeTheme();
            }));
          }, e2.prototype.getColorMap = function() {
            return this._theme.getColorMap();
          }, e2.prototype.addGrammar = function(e3, t2) {
            this._rawGrammars[e3.scopeName] = e3, t2 && (this._injectionGrammars[e3.scopeName] = t2);
          }, e2.prototype.lookup = function(e3) {
            return this._rawGrammars[e3];
          }, e2.prototype.injections = function(e3) {
            return this._injectionGrammars[e3];
          }, e2.prototype.getDefaults = function() {
            return this._theme.getDefaults();
          }, e2.prototype.themeMatch = function(e3) {
            return this._theme.match(e3);
          }, e2.prototype.grammarForScopeName = function(e3, t2, n2, s2) {
            return r(this, void 0, void 0, (function() {
              var r2, a, c, u, l;
              return i(this, (function(i2) {
                switch (i2.label) {
                  case 0:
                    return this._grammars[e3] ? [3, 2] : (r2 = this._rawGrammars[e3]) ? (a = this._grammars, c = e3, u = o.createGrammar, l = [r2, t2, n2, s2, this], [4, this._onigLibPromise]) : [2, null];
                  case 1:
                    a[c] = u.apply(void 0, l.concat([i2.sent()])), i2.label = 2;
                  case 2:
                    return [2, this._grammars[e3]];
                }
              }));
            }));
          }, e2;
        })();
        t.SyncRegistry = s;
      }, function(e, t, n) {
        "use strict";
        var r, i = this && this.__extends || (r = function(e2, t2) {
          return (r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e3, t3) {
            e3.__proto__ = t3;
          } || function(e3, t3) {
            for (var n2 in t3) t3.hasOwnProperty(n2) && (e3[n2] = t3[n2]);
          })(e2, t2);
        }, function(e2, t2) {
          function n2() {
            this.constructor = e2;
          }
          r(e2, t2), e2.prototype = null === t2 ? Object.create(t2) : (n2.prototype = t2.prototype, new n2());
        });
        Object.defineProperty(t, "__esModule", { value: true });
        var o = n(1), s = /\\(\d+)/, a = /\\(\d+)/g, c = (function() {
          function e2(e3, t2, n2) {
            this.debugRegExps = t2, this.rules = n2, this.scanner = e3.createOnigScanner(t2);
          }
          return e2.prototype.dispose = function() {
            "function" == typeof this.scanner.dispose && this.scanner.dispose();
          }, e2;
        })();
        t.CompiledRule = c;
        var u = (function() {
          function e2(e3, t2, n2, r2) {
            this.$location = e3, this.id = t2, this._name = n2 || null, this._nameIsCapturing = o.RegexSource.hasCaptures(this._name), this._contentName = r2 || null, this._contentNameIsCapturing = o.RegexSource.hasCaptures(this._contentName);
          }
          return Object.defineProperty(e2.prototype, "debugName", { get: function() {
            var e3 = this.$location ? o.basename(this.$location.filename) + ":" + this.$location.line : "unknown";
            return this.constructor.name + "#" + this.id + " @ " + e3;
          }, enumerable: true, configurable: true }), e2.prototype.getName = function(e3, t2) {
            return this._nameIsCapturing && null !== this._name && null !== e3 && null !== t2 ? o.RegexSource.replaceCaptures(this._name, e3, t2) : this._name;
          }, e2.prototype.getContentName = function(e3, t2) {
            return this._contentNameIsCapturing && null !== this._contentName ? o.RegexSource.replaceCaptures(this._contentName, e3, t2) : this._contentName;
          }, e2;
        })();
        t.Rule = u;
        var l = (function(e2) {
          function t2(t3, n2, r2, i2, o2) {
            var s2 = e2.call(this, t3, n2, r2, i2) || this;
            return s2.retokenizeCapturedWithRuleId = o2, s2;
          }
          return i(t2, e2), t2.prototype.dispose = function() {
          }, t2.prototype.collectPatternsRecursive = function(e3, t3, n2) {
            throw new Error("Not supported!");
          }, t2.prototype.compile = function(e3, t3, n2, r2) {
            throw new Error("Not supported!");
          }, t2;
        })(u);
        t.CaptureRule = l;
        var h = (function() {
          function e2(e3, t2, n2) {
            if (void 0 === n2 && (n2 = true), n2) if (e3) {
              for (var r2 = e3.length, i2 = 0, o2 = [], a2 = false, c2 = 0; c2 < r2; c2++) {
                if ("\\" === e3.charAt(c2) && c2 + 1 < r2) {
                  var u2 = e3.charAt(c2 + 1);
                  "z" === u2 ? (o2.push(e3.substring(i2, c2)), o2.push("$(?!\\n)(?<!\\n)"), i2 = c2 + 2) : "A" !== u2 && "G" !== u2 || (a2 = true), c2++;
                }
              }
              this.hasAnchor = a2, 0 === i2 ? this.source = e3 : (o2.push(e3.substring(i2, r2)), this.source = o2.join(""));
            } else this.hasAnchor = false, this.source = e3;
            else this.hasAnchor = false, this.source = e3;
            this.hasAnchor ? this._anchorCache = this._buildAnchorCache() : this._anchorCache = null, this.ruleId = t2, this.hasBackReferences = s.test(this.source);
          }
          return e2.prototype.clone = function() {
            return new e2(this.source, this.ruleId, true);
          }, e2.prototype.setSource = function(e3) {
            this.source !== e3 && (this.source = e3, this.hasAnchor && (this._anchorCache = this._buildAnchorCache()));
          }, e2.prototype.resolveBackReferences = function(e3, t2) {
            var n2 = t2.map((function(t3) {
              return e3.substring(t3.start, t3.end);
            }));
            return a.lastIndex = 0, this.source.replace(a, (function(e4, t3) {
              return (n2[parseInt(t3, 10)] || "").replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
            }));
          }, e2.prototype._buildAnchorCache = function() {
            var e3, t2, n2, r2, i2 = [], o2 = [], s2 = [], a2 = [];
            for (e3 = 0, t2 = this.source.length; e3 < t2; e3++) n2 = this.source.charAt(e3), i2[e3] = n2, o2[e3] = n2, s2[e3] = n2, a2[e3] = n2, "\\" === n2 && e3 + 1 < t2 && ("A" === (r2 = this.source.charAt(e3 + 1)) ? (i2[e3 + 1] = "￿", o2[e3 + 1] = "￿", s2[e3 + 1] = "A", a2[e3 + 1] = "A") : "G" === r2 ? (i2[e3 + 1] = "￿", o2[e3 + 1] = "G", s2[e3 + 1] = "￿", a2[e3 + 1] = "G") : (i2[e3 + 1] = r2, o2[e3 + 1] = r2, s2[e3 + 1] = r2, a2[e3 + 1] = r2), e3++);
            return { A0_G0: i2.join(""), A0_G1: o2.join(""), A1_G0: s2.join(""), A1_G1: a2.join("") };
          }, e2.prototype.resolveAnchors = function(e3, t2) {
            return this.hasAnchor && this._anchorCache ? e3 ? t2 ? this._anchorCache.A1_G1 : this._anchorCache.A1_G0 : t2 ? this._anchorCache.A0_G1 : this._anchorCache.A0_G0 : this.source;
          }, e2;
        })();
        t.RegExpSource = h;
        var p = (function() {
          function e2() {
            this._items = [], this._hasAnchors = false, this._cached = null, this._anchorCache = { A0_G0: null, A0_G1: null, A1_G0: null, A1_G1: null };
          }
          return e2.prototype.dispose = function() {
            this._disposeCaches();
          }, e2.prototype._disposeCaches = function() {
            this._cached && (this._cached.dispose(), this._cached = null), this._anchorCache.A0_G0 && (this._anchorCache.A0_G0.dispose(), this._anchorCache.A0_G0 = null), this._anchorCache.A0_G1 && (this._anchorCache.A0_G1.dispose(), this._anchorCache.A0_G1 = null), this._anchorCache.A1_G0 && (this._anchorCache.A1_G0.dispose(), this._anchorCache.A1_G0 = null), this._anchorCache.A1_G1 && (this._anchorCache.A1_G1.dispose(), this._anchorCache.A1_G1 = null);
          }, e2.prototype.push = function(e3) {
            this._items.push(e3), this._hasAnchors = this._hasAnchors || e3.hasAnchor;
          }, e2.prototype.unshift = function(e3) {
            this._items.unshift(e3), this._hasAnchors = this._hasAnchors || e3.hasAnchor;
          }, e2.prototype.length = function() {
            return this._items.length;
          }, e2.prototype.setSource = function(e3, t2) {
            this._items[e3].source !== t2 && (this._disposeCaches(), this._items[e3].setSource(t2));
          }, e2.prototype.compile = function(e3, t2, n2) {
            if (this._hasAnchors) return t2 ? n2 ? (this._anchorCache.A1_G1 || (this._anchorCache.A1_G1 = this._resolveAnchors(e3, t2, n2)), this._anchorCache.A1_G1) : (this._anchorCache.A1_G0 || (this._anchorCache.A1_G0 = this._resolveAnchors(e3, t2, n2)), this._anchorCache.A1_G0) : n2 ? (this._anchorCache.A0_G1 || (this._anchorCache.A0_G1 = this._resolveAnchors(e3, t2, n2)), this._anchorCache.A0_G1) : (this._anchorCache.A0_G0 || (this._anchorCache.A0_G0 = this._resolveAnchors(e3, t2, n2)), this._anchorCache.A0_G0);
            if (!this._cached) {
              var r2 = this._items.map((function(e4) {
                return e4.source;
              }));
              this._cached = new c(e3, r2, this._items.map((function(e4) {
                return e4.ruleId;
              })));
            }
            return this._cached;
          }, e2.prototype._resolveAnchors = function(e3, t2, n2) {
            var r2 = this._items.map((function(e4) {
              return e4.resolveAnchors(t2, n2);
            }));
            return new c(e3, r2, this._items.map((function(e4) {
              return e4.ruleId;
            })));
          }, e2;
        })();
        t.RegExpSourceList = p;
        var f = (function(e2) {
          function t2(t3, n2, r2, i2, o2) {
            var s2 = e2.call(this, t3, n2, r2, null) || this;
            return s2._match = new h(i2, s2.id), s2.captures = o2, s2._cachedCompiledPatterns = null, s2;
          }
          return i(t2, e2), t2.prototype.dispose = function() {
            this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null);
          }, Object.defineProperty(t2.prototype, "debugMatchRegExp", { get: function() {
            return "" + this._match.source;
          }, enumerable: true, configurable: true }), t2.prototype.collectPatternsRecursive = function(e3, t3, n2) {
            t3.push(this._match);
          }, t2.prototype.compile = function(e3, t3, n2, r2) {
            return this._cachedCompiledPatterns || (this._cachedCompiledPatterns = new p(), this.collectPatternsRecursive(e3, this._cachedCompiledPatterns, true)), this._cachedCompiledPatterns.compile(e3, n2, r2);
          }, t2;
        })(u);
        t.MatchRule = f;
        var d = (function(e2) {
          function t2(t3, n2, r2, i2, o2) {
            var s2 = e2.call(this, t3, n2, r2, i2) || this;
            return s2.patterns = o2.patterns, s2.hasMissingPatterns = o2.hasMissingPatterns, s2._cachedCompiledPatterns = null, s2;
          }
          return i(t2, e2), t2.prototype.dispose = function() {
            this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null);
          }, t2.prototype.collectPatternsRecursive = function(e3, t3, n2) {
            var r2, i2;
            for (r2 = 0, i2 = this.patterns.length; r2 < i2; r2++) e3.getRule(this.patterns[r2]).collectPatternsRecursive(e3, t3, false);
          }, t2.prototype.compile = function(e3, t3, n2, r2) {
            return this._cachedCompiledPatterns || (this._cachedCompiledPatterns = new p(), this.collectPatternsRecursive(e3, this._cachedCompiledPatterns, true)), this._cachedCompiledPatterns.compile(e3, n2, r2);
          }, t2;
        })(u);
        t.IncludeOnlyRule = d;
        var g = (function(e2) {
          function t2(t3, n2, r2, i2, o2, s2, a2, c2, u2, l2) {
            var p2 = e2.call(this, t3, n2, r2, i2) || this;
            return p2._begin = new h(o2, p2.id), p2.beginCaptures = s2, p2._end = new h(a2 || "￿", -1), p2.endHasBackReferences = p2._end.hasBackReferences, p2.endCaptures = c2, p2.applyEndPatternLast = u2 || false, p2.patterns = l2.patterns, p2.hasMissingPatterns = l2.hasMissingPatterns, p2._cachedCompiledPatterns = null, p2;
          }
          return i(t2, e2), t2.prototype.dispose = function() {
            this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null);
          }, Object.defineProperty(t2.prototype, "debugBeginRegExp", { get: function() {
            return "" + this._begin.source;
          }, enumerable: true, configurable: true }), Object.defineProperty(t2.prototype, "debugEndRegExp", { get: function() {
            return "" + this._end.source;
          }, enumerable: true, configurable: true }), t2.prototype.getEndWithResolvedBackReferences = function(e3, t3) {
            return this._end.resolveBackReferences(e3, t3);
          }, t2.prototype.collectPatternsRecursive = function(e3, t3, n2) {
            if (n2) {
              var r2, i2 = void 0;
              for (i2 = 0, r2 = this.patterns.length; i2 < r2; i2++) e3.getRule(this.patterns[i2]).collectPatternsRecursive(e3, t3, false);
            } else t3.push(this._begin);
          }, t2.prototype.compile = function(e3, t3, n2, r2) {
            return this._cachedCompiledPatterns || (this._cachedCompiledPatterns = new p(), this.collectPatternsRecursive(e3, this._cachedCompiledPatterns, true), this.applyEndPatternLast ? this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end) : this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end)), this._end.hasBackReferences && (this.applyEndPatternLast ? this._cachedCompiledPatterns.setSource(this._cachedCompiledPatterns.length() - 1, t3) : this._cachedCompiledPatterns.setSource(0, t3)), this._cachedCompiledPatterns.compile(e3, n2, r2);
          }, t2;
        })(u);
        t.BeginEndRule = g;
        var m = (function(e2) {
          function t2(t3, n2, r2, i2, o2, s2, a2, c2, u2) {
            var l2 = e2.call(this, t3, n2, r2, i2) || this;
            return l2._begin = new h(o2, l2.id), l2.beginCaptures = s2, l2.whileCaptures = c2, l2._while = new h(a2, -2), l2.whileHasBackReferences = l2._while.hasBackReferences, l2.patterns = u2.patterns, l2.hasMissingPatterns = u2.hasMissingPatterns, l2._cachedCompiledPatterns = null, l2._cachedCompiledWhilePatterns = null, l2;
          }
          return i(t2, e2), t2.prototype.dispose = function() {
            this._cachedCompiledPatterns && (this._cachedCompiledPatterns.dispose(), this._cachedCompiledPatterns = null), this._cachedCompiledWhilePatterns && (this._cachedCompiledWhilePatterns.dispose(), this._cachedCompiledWhilePatterns = null);
          }, Object.defineProperty(t2.prototype, "debugBeginRegExp", { get: function() {
            return "" + this._begin.source;
          }, enumerable: true, configurable: true }), Object.defineProperty(t2.prototype, "debugWhileRegExp", { get: function() {
            return "" + this._while.source;
          }, enumerable: true, configurable: true }), t2.prototype.getWhileWithResolvedBackReferences = function(e3, t3) {
            return this._while.resolveBackReferences(e3, t3);
          }, t2.prototype.collectPatternsRecursive = function(e3, t3, n2) {
            if (n2) {
              var r2, i2 = void 0;
              for (i2 = 0, r2 = this.patterns.length; i2 < r2; i2++) e3.getRule(this.patterns[i2]).collectPatternsRecursive(e3, t3, false);
            } else t3.push(this._begin);
          }, t2.prototype.compile = function(e3, t3, n2, r2) {
            return this._cachedCompiledPatterns || (this._cachedCompiledPatterns = new p(), this.collectPatternsRecursive(e3, this._cachedCompiledPatterns, true)), this._cachedCompiledPatterns.compile(e3, n2, r2);
          }, t2.prototype.compileWhile = function(e3, t3, n2, r2) {
            return this._cachedCompiledWhilePatterns || (this._cachedCompiledWhilePatterns = new p(), this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while)), this._while.hasBackReferences && this._cachedCompiledWhilePatterns.setSource(0, t3 || "￿"), this._cachedCompiledWhilePatterns.compile(e3, n2, r2);
          }, t2;
        })(u);
        t.BeginWhileRule = m;
        var _ = (function() {
          function e2() {
          }
          return e2.createCaptureRule = function(e3, t2, n2, r2, i2) {
            return e3.registerRule((function(e4) {
              return new l(t2, e4, n2, r2, i2);
            }));
          }, e2.getCompiledRuleId = function(t2, n2, r2) {
            return t2.id || n2.registerRule((function(i2) {
              if (t2.id = i2, t2.match) return new f(t2.$vscodeTextmateLocation, t2.id, t2.name, t2.match, e2._compileCaptures(t2.captures, n2, r2));
              if (void 0 === t2.begin) {
                t2.repository && (r2 = o.mergeObjects({}, r2, t2.repository));
                var s2 = t2.patterns;
                return void 0 === s2 && t2.include && (s2 = [{ include: t2.include }]), new d(t2.$vscodeTextmateLocation, t2.id, t2.name, t2.contentName, e2._compilePatterns(s2, n2, r2));
              }
              return t2.while ? new m(t2.$vscodeTextmateLocation, t2.id, t2.name, t2.contentName, t2.begin, e2._compileCaptures(t2.beginCaptures || t2.captures, n2, r2), t2.while, e2._compileCaptures(t2.whileCaptures || t2.captures, n2, r2), e2._compilePatterns(t2.patterns, n2, r2)) : new g(t2.$vscodeTextmateLocation, t2.id, t2.name, t2.contentName, t2.begin, e2._compileCaptures(t2.beginCaptures || t2.captures, n2, r2), t2.end, e2._compileCaptures(t2.endCaptures || t2.captures, n2, r2), t2.applyEndPatternLast, e2._compilePatterns(t2.patterns, n2, r2));
            })), t2.id;
          }, e2._compileCaptures = function(t2, n2, r2) {
            var i2 = [];
            if (t2) {
              var o2 = 0;
              for (var s2 in t2) {
                if ("$vscodeTextmateLocation" !== s2) (c2 = parseInt(s2, 10)) > o2 && (o2 = c2);
              }
              for (var a2 = 0; a2 <= o2; a2++) i2[a2] = null;
              for (var s2 in t2) if ("$vscodeTextmateLocation" !== s2) {
                var c2 = parseInt(s2, 10), u2 = 0;
                t2[s2].patterns && (u2 = e2.getCompiledRuleId(t2[s2], n2, r2)), i2[c2] = e2.createCaptureRule(n2, t2[s2].$vscodeTextmateLocation, t2[s2].name, t2[s2].contentName, u2);
              }
            }
            return i2;
          }, e2._compilePatterns = function(t2, n2, r2) {
            var i2 = [];
            if (t2) for (var o2 = 0, s2 = t2.length; o2 < s2; o2++) {
              var a2 = t2[o2], c2 = -1;
              if (a2.include) if ("#" === a2.include.charAt(0)) {
                var u2 = r2[a2.include.substr(1)];
                u2 && (c2 = e2.getCompiledRuleId(u2, n2, r2));
              } else if ("$base" === a2.include || "$self" === a2.include) c2 = e2.getCompiledRuleId(r2[a2.include], n2, r2);
              else {
                var l2 = null, h2 = null, p2 = a2.include.indexOf("#");
                p2 >= 0 ? (l2 = a2.include.substring(0, p2), h2 = a2.include.substring(p2 + 1)) : l2 = a2.include;
                var f2 = n2.getExternalGrammar(l2, r2);
                if (f2) if (h2) {
                  var _2 = f2.repository[h2];
                  _2 && (c2 = e2.getCompiledRuleId(_2, n2, f2.repository));
                } else c2 = e2.getCompiledRuleId(f2.repository.$self, n2, f2.repository);
              }
              else c2 = e2.getCompiledRuleId(a2, n2, r2);
              if (-1 !== c2) {
                var y = n2.getRule(c2), v = false;
                if ((y instanceof d || y instanceof g || y instanceof m) && y.hasMissingPatterns && 0 === y.patterns.length && (v = true), v) continue;
                i2.push(c2);
              }
            }
            return { patterns: i2, hasMissingPatterns: (t2 ? t2.length : 0) !== i2.length };
          }, e2;
        })();
        t.RuleFactory = _;
      }, function(e, t, n) {
        "use strict";
        function r(e2) {
          return !!e2 && !!e2.match(/[\w\.:]+/);
        }
        Object.defineProperty(t, "__esModule", { value: true }), t.createMatchers = function(e2, t2) {
          for (var n2, i, o, s = [], a = (o = (i = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g).exec(n2 = e2), { next: function() {
            if (!o) return null;
            var e3 = o[0];
            return o = i.exec(n2), e3;
          } }), c = a.next(); null !== c; ) {
            var u = 0;
            if (2 === c.length && ":" === c.charAt(1)) {
              switch (c.charAt(0)) {
                case "R":
                  u = 1;
                  break;
                case "L":
                  u = -1;
                  break;
                default:
                  console.log("Unknown priority " + c + " in scope selector");
              }
              c = a.next();
            }
            var l = p();
            if (s.push({ matcher: l, priority: u }), "," !== c) break;
            c = a.next();
          }
          return s;
          function h() {
            if ("-" === c) {
              c = a.next();
              var e3 = h();
              return function(t3) {
                return !!e3 && !e3(t3);
              };
            }
            if ("(" === c) {
              c = a.next();
              var n3 = (function() {
                var e4 = [], t3 = p();
                for (; t3 && (e4.push(t3), "|" === c || "," === c); ) {
                  do {
                    c = a.next();
                  } while ("|" === c || "," === c);
                  t3 = p();
                }
                return function(t4) {
                  return e4.some((function(e5) {
                    return e5(t4);
                  }));
                };
              })();
              return ")" === c && (c = a.next()), n3;
            }
            if (r(c)) {
              var i2 = [];
              do {
                i2.push(c), c = a.next();
              } while (r(c));
              return function(e4) {
                return t2(i2, e4);
              };
            }
            return null;
          }
          function p() {
            for (var e3 = [], t3 = h(); t3; ) e3.push(t3), t3 = h();
            return function(t4) {
              return e3.every((function(e4) {
                return e4(t4);
              }));
            };
          }
        };
      }, function(e, t) {
        var n, r, i = e.exports = {};
        function o() {
          throw new Error("setTimeout has not been defined");
        }
        function s() {
          throw new Error("clearTimeout has not been defined");
        }
        function a(e2) {
          if (n === setTimeout) return setTimeout(e2, 0);
          if ((n === o || !n) && setTimeout) return n = setTimeout, setTimeout(e2, 0);
          try {
            return n(e2, 0);
          } catch (t2) {
            try {
              return n.call(null, e2, 0);
            } catch (t3) {
              return n.call(this, e2, 0);
            }
          }
        }
        !(function() {
          try {
            n = "function" == typeof setTimeout ? setTimeout : o;
          } catch (e2) {
            n = o;
          }
          try {
            r = "function" == typeof clearTimeout ? clearTimeout : s;
          } catch (e2) {
            r = s;
          }
        })();
        var c, u = [], l = false, h = -1;
        function p() {
          l && c && (l = false, c.length ? u = c.concat(u) : h = -1, u.length && f());
        }
        function f() {
          if (!l) {
            var e2 = a(p);
            l = true;
            for (var t2 = u.length; t2; ) {
              for (c = u, u = []; ++h < t2; ) c && c[h].run();
              h = -1, t2 = u.length;
            }
            c = null, l = false, (function(e3) {
              if (r === clearTimeout) return clearTimeout(e3);
              if ((r === s || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e3);
              try {
                r(e3);
              } catch (t3) {
                try {
                  return r.call(null, e3);
                } catch (t4) {
                  return r.call(this, e3);
                }
              }
            })(e2);
          }
        }
        function d(e2, t2) {
          this.fun = e2, this.array = t2;
        }
        function g() {
        }
        i.nextTick = function(e2) {
          var t2 = new Array(arguments.length - 1);
          if (arguments.length > 1) for (var n2 = 1; n2 < arguments.length; n2++) t2[n2 - 1] = arguments[n2];
          u.push(new d(e2, t2)), 1 !== u.length || l || a(f);
        }, d.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, i.title = "browser", i.browser = true, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = g, i.addListener = g, i.once = g, i.off = g, i.removeListener = g, i.removeAllListeners = g, i.emit = g, i.prependListener = g, i.prependOnceListener = g, i.listeners = function(e2) {
          return [];
        }, i.binding = function(e2) {
          throw new Error("process.binding is not supported");
        }, i.cwd = function() {
          return "/";
        }, i.chdir = function(e2) {
          throw new Error("process.chdir is not supported");
        }, i.umask = function() {
          return 0;
        };
      }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: true });
        var r = n(9), i = n(2), o = n(10);
        t.parseRawGrammar = function(e2, t2) {
          return void 0 === t2 && (t2 = null), null !== t2 && /\.json$/.test(t2) ? (function(e3, t3) {
            if (i.DebugFlags.InDebugMode) return o.parse(e3, t3, true);
            return JSON.parse(e3);
          })(e2, t2) : (function(e3, t3) {
            if (i.DebugFlags.InDebugMode) return r.parseWithLocation(e3, t3, "$vscodeTextmateLocation");
            return r.parse(e3);
          })(e2, t2);
        };
      }, function(e, t, n) {
        "use strict";
        function r(e2, t2, n2) {
          var r2 = e2.length, i = 0, o = 1, s = 0;
          function a(t3) {
            if (null === n2) i += t3;
            else for (; t3 > 0; ) {
              10 === e2.charCodeAt(i) ? (i++, o++, s = 0) : (i++, s++), t3--;
            }
          }
          function c(e3) {
            null === n2 ? i = e3 : a(e3 - i);
          }
          function u() {
            for (; i < r2; ) {
              var t3 = e2.charCodeAt(i);
              if (32 !== t3 && 9 !== t3 && 13 !== t3 && 10 !== t3) break;
              a(1);
            }
          }
          function l(t3) {
            return e2.substr(i, t3.length) === t3 && (a(t3.length), true);
          }
          function h(t3) {
            var n3 = e2.indexOf(t3, i);
            c(-1 !== n3 ? n3 + t3.length : r2);
          }
          function p(t3) {
            var n3 = e2.indexOf(t3, i);
            if (-1 !== n3) {
              var o2 = e2.substring(i, n3);
              return c(n3 + t3.length), o2;
            }
            o2 = e2.substr(i);
            return c(r2), o2;
          }
          r2 > 0 && 65279 === e2.charCodeAt(0) && (i = 1);
          var f = 0, d = null, g = [], m = [], _ = null;
          function y(e3, t3) {
            g.push(f), m.push(d), f = e3, d = t3;
          }
          function v() {
            if (0 === g.length) return b("illegal state stack");
            f = g.pop(), d = m.pop();
          }
          function b(t3) {
            throw new Error("Near offset " + i + ": " + t3 + " ~~~" + e2.substr(i, 50) + "~~~");
          }
          var C, w, k, R = function() {
            if (null === _) return b("missing <key>");
            var e3 = {};
            null !== n2 && (e3[n2] = { filename: t2, line: o, char: s }), d[_] = e3, _ = null, y(1, e3);
          }, S = function() {
            if (null === _) return b("missing <key>");
            var e3 = [];
            d[_] = e3, _ = null, y(2, e3);
          }, P = function() {
            var e3 = {};
            null !== n2 && (e3[n2] = { filename: t2, line: o, char: s }), d.push(e3), y(1, e3);
          }, x = function() {
            var e3 = [];
            d.push(e3), y(2, e3);
          };
          function I() {
            if (1 !== f) return b("unexpected </dict>");
            v();
          }
          function A() {
            return 1 === f || 2 !== f ? b("unexpected </array>") : void v();
          }
          function T(e3) {
            if (1 === f) {
              if (null === _) return b("missing <key>");
              d[_] = e3, _ = null;
            } else 2 === f ? d.push(e3) : d = e3;
          }
          function L(e3) {
            if (isNaN(e3)) return b("cannot parse float");
            if (1 === f) {
              if (null === _) return b("missing <key>");
              d[_] = e3, _ = null;
            } else 2 === f ? d.push(e3) : d = e3;
          }
          function M(e3) {
            if (isNaN(e3)) return b("cannot parse integer");
            if (1 === f) {
              if (null === _) return b("missing <key>");
              d[_] = e3, _ = null;
            } else 2 === f ? d.push(e3) : d = e3;
          }
          function G(e3) {
            if (1 === f) {
              if (null === _) return b("missing <key>");
              d[_] = e3, _ = null;
            } else 2 === f ? d.push(e3) : d = e3;
          }
          function D(e3) {
            if (1 === f) {
              if (null === _) return b("missing <key>");
              d[_] = e3, _ = null;
            } else 2 === f ? d.push(e3) : d = e3;
          }
          function N(e3) {
            if (1 === f) {
              if (null === _) return b("missing <key>");
              d[_] = e3, _ = null;
            } else 2 === f ? d.push(e3) : d = e3;
          }
          function E(e3) {
            if (e3.isClosed) return "";
            var t3 = p("</");
            return h(">"), t3.replace(/&#([0-9]+);/g, (function(e4, t4) {
              return String.fromCodePoint(parseInt(t4, 10));
            })).replace(/&#x([0-9a-f]+);/g, (function(e4, t4) {
              return String.fromCodePoint(parseInt(t4, 16));
            })).replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, (function(e4) {
              switch (e4) {
                case "&amp;":
                  return "&";
                case "&lt;":
                  return "<";
                case "&gt;":
                  return ">";
                case "&quot;":
                  return '"';
                case "&apos;":
                  return "'";
              }
              return e4;
            }));
          }
          for (; i < r2 && (u(), !(i >= r2)); ) {
            var O = e2.charCodeAt(i);
            if (a(1), 60 !== O) return b("expected <");
            if (i >= r2) return b("unexpected end of input");
            var j = e2.charCodeAt(i);
            if (63 !== j) if (33 !== j) {
              if (47 === j) {
                if (a(1), u(), l("plist")) {
                  h(">");
                  continue;
                }
                if (l("dict")) {
                  h(">"), I();
                  continue;
                }
                if (l("array")) {
                  h(">"), A();
                  continue;
                }
                return b("unexpected closed tag");
              }
              var F = (w = void 0, k = void 0, w = p(">"), k = false, 47 === w.charCodeAt(w.length - 1) && (k = true, w = w.substring(0, w.length - 1)), { name: w.trim(), isClosed: k });
              switch (F.name) {
                case "dict":
                  1 === f ? R() : 2 === f ? P() : (d = {}, null !== n2 && (d[n2] = { filename: t2, line: o, char: s }), y(1, d)), F.isClosed && I();
                  continue;
                case "array":
                  1 === f ? S() : 2 === f ? x() : y(2, d = []), F.isClosed && A();
                  continue;
                case "key":
                  C = E(F), 1 !== f ? b("unexpected <key>") : null !== _ ? b("too many <key>") : _ = C;
                  continue;
                case "string":
                  T(E(F));
                  continue;
                case "real":
                  L(parseFloat(E(F)));
                  continue;
                case "integer":
                  M(parseInt(E(F), 10));
                  continue;
                case "date":
                  G(new Date(E(F)));
                  continue;
                case "data":
                  D(E(F));
                  continue;
                case "true":
                  E(F), N(true);
                  continue;
                case "false":
                  E(F), N(false);
                  continue;
              }
              if (!/^plist/.test(F.name)) return b("unexpected opened tag " + F.name);
            } else {
              if (a(1), l("--")) {
                h("-->");
                continue;
              }
              h(">");
            }
            else a(1), h("?>");
          }
          return d;
        }
        Object.defineProperty(t, "__esModule", { value: true }), t.parseWithLocation = function(e2, t2, n2) {
          return r(e2, t2, n2);
        }, t.parse = function(e2) {
          return r(e2, null, null);
        };
      }, function(e, t, n) {
        "use strict";
        function r(e2, t2) {
          throw new Error("Near offset " + e2.pos + ": " + t2 + " ~~~" + e2.source.substr(e2.pos, 50) + "~~~");
        }
        Object.defineProperty(t, "__esModule", { value: true }), t.parse = function(e2, t2, n2) {
          var a = new i(e2), c = new o(), u = 0, l = null, h = [], p = [];
          function f() {
            h.push(u), p.push(l);
          }
          function d() {
            u = h.pop(), l = p.pop();
          }
          function g(e3) {
            r(a, e3);
          }
          for (; s(a, c); ) {
            if (0 === u) {
              if (null !== l && g("too many constructs in root"), 3 === c.type) {
                l = {}, n2 && (l.$vscodeTextmateLocation = c.toLocation(t2)), f(), u = 1;
                continue;
              }
              if (2 === c.type) {
                l = [], f(), u = 4;
                continue;
              }
              g("unexpected token in root");
            }
            if (2 === u) {
              if (5 === c.type) {
                d();
                continue;
              }
              if (7 === c.type) {
                u = 3;
                continue;
              }
              g("expected , or }");
            }
            if (1 === u || 3 === u) {
              if (1 === u && 5 === c.type) {
                d();
                continue;
              }
              if (1 === c.type) {
                var m = c.value;
                if (s(a, c) && 6 === c.type || g("expected colon"), s(a, c) || g("expected value"), u = 2, 1 === c.type) {
                  l[m] = c.value;
                  continue;
                }
                if (8 === c.type) {
                  l[m] = null;
                  continue;
                }
                if (9 === c.type) {
                  l[m] = true;
                  continue;
                }
                if (10 === c.type) {
                  l[m] = false;
                  continue;
                }
                if (11 === c.type) {
                  l[m] = parseFloat(c.value);
                  continue;
                }
                if (2 === c.type) {
                  var _ = [];
                  l[m] = _, f(), u = 4, l = _;
                  continue;
                }
                if (3 === c.type) {
                  var y = {};
                  n2 && (y.$vscodeTextmateLocation = c.toLocation(t2)), l[m] = y, f(), u = 1, l = y;
                  continue;
                }
              }
              g("unexpected token in dict");
            }
            if (5 === u) {
              if (4 === c.type) {
                d();
                continue;
              }
              if (7 === c.type) {
                u = 6;
                continue;
              }
              g("expected , or ]");
            }
            if (4 === u || 6 === u) {
              if (4 === u && 4 === c.type) {
                d();
                continue;
              }
              if (u = 5, 1 === c.type) {
                l.push(c.value);
                continue;
              }
              if (8 === c.type) {
                l.push(null);
                continue;
              }
              if (9 === c.type) {
                l.push(true);
                continue;
              }
              if (10 === c.type) {
                l.push(false);
                continue;
              }
              if (11 === c.type) {
                l.push(parseFloat(c.value));
                continue;
              }
              if (2 === c.type) {
                _ = [];
                l.push(_), f(), u = 4, l = _;
                continue;
              }
              if (3 === c.type) {
                y = {};
                n2 && (y.$vscodeTextmateLocation = c.toLocation(t2)), l.push(y), f(), u = 1, l = y;
                continue;
              }
              g("unexpected token in array");
            }
            g("unknown state");
          }
          return 0 !== p.length && g("unclosed constructs"), l;
        };
        var i = function(e2) {
          this.source = e2, this.pos = 0, this.len = e2.length, this.line = 1, this.char = 0;
        }, o = (function() {
          function e2() {
            this.value = null, this.type = 0, this.offset = -1, this.len = -1, this.line = -1, this.char = -1;
          }
          return e2.prototype.toLocation = function(e3) {
            return { filename: e3, line: this.line, char: this.char };
          }, e2;
        })();
        function s(e2, t2) {
          t2.value = null, t2.type = 0, t2.offset = -1, t2.len = -1, t2.line = -1, t2.char = -1;
          for (var n2, i2 = e2.source, o2 = e2.pos, s2 = e2.len, a = e2.line, c = e2.char; ; ) {
            if (o2 >= s2) return false;
            if (32 !== (n2 = i2.charCodeAt(o2)) && 9 !== n2 && 13 !== n2) {
              if (10 !== n2) break;
              o2++, a++, c = 0;
            } else o2++, c++;
          }
          if (t2.offset = o2, t2.line = a, t2.char = c, 34 === n2) {
            for (t2.type = 1, o2++, c++; ; ) {
              if (o2 >= s2) return false;
              if (n2 = i2.charCodeAt(o2), o2++, c++, 92 !== n2) {
                if (34 === n2) break;
              } else o2++, c++;
            }
            t2.value = i2.substring(t2.offset + 1, o2 - 1).replace(/\\u([0-9A-Fa-f]{4})/g, (function(e3, t3) {
              return String.fromCodePoint(parseInt(t3, 16));
            })).replace(/\\(.)/g, (function(t3, n3) {
              switch (n3) {
                case '"':
                  return '"';
                case "\\":
                  return "\\";
                case "/":
                  return "/";
                case "b":
                  return "\b";
                case "f":
                  return "\f";
                case "n":
                  return "\n";
                case "r":
                  return "\r";
                case "t":
                  return "	";
                default:
                  r(e2, "invalid escape sequence");
              }
              throw new Error("unreachable");
            }));
          } else if (91 === n2) t2.type = 2, o2++, c++;
          else if (123 === n2) t2.type = 3, o2++, c++;
          else if (93 === n2) t2.type = 4, o2++, c++;
          else if (125 === n2) t2.type = 5, o2++, c++;
          else if (58 === n2) t2.type = 6, o2++, c++;
          else if (44 === n2) t2.type = 7, o2++, c++;
          else if (110 === n2) {
            if (t2.type = 8, o2++, c++, 117 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 108 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 108 !== (n2 = i2.charCodeAt(o2))) return false;
            o2++, c++;
          } else if (116 === n2) {
            if (t2.type = 9, o2++, c++, 114 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 117 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 101 !== (n2 = i2.charCodeAt(o2))) return false;
            o2++, c++;
          } else if (102 === n2) {
            if (t2.type = 10, o2++, c++, 97 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 108 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 115 !== (n2 = i2.charCodeAt(o2))) return false;
            if (o2++, c++, 101 !== (n2 = i2.charCodeAt(o2))) return false;
            o2++, c++;
          } else for (t2.type = 11; ; ) {
            if (o2 >= s2) return false;
            if (!(46 === (n2 = i2.charCodeAt(o2)) || n2 >= 48 && n2 <= 57 || 101 === n2 || 69 === n2 || 45 === n2 || 43 === n2)) break;
            o2++, c++;
          }
          return t2.len = o2 - t2.offset, null === t2.value && (t2.value = i2.substr(t2.offset, t2.len)), e2.pos = o2, e2.line = a, e2.char = c, true;
        }
      }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: true });
        var r = function(e2, t2, n2, r2, i2, o2) {
          this.scope = e2, this.parentScopes = t2, this.index = n2, this.fontStyle = r2, this.foreground = i2, this.background = o2;
        };
        function i(e2) {
          return !!/^#[0-9a-f]{6}$/i.test(e2) || (!!/^#[0-9a-f]{8}$/i.test(e2) || (!!/^#[0-9a-f]{3}$/i.test(e2) || !!/^#[0-9a-f]{4}$/i.test(e2)));
        }
        function o(e2) {
          if (!e2) return [];
          if (!e2.settings || !Array.isArray(e2.settings)) return [];
          for (var t2 = e2.settings, n2 = [], o2 = 0, s2 = 0, a2 = t2.length; s2 < a2; s2++) {
            var c2 = t2[s2];
            if (c2.settings) {
              var u2 = void 0;
              if ("string" == typeof c2.scope) u2 = c2.scope.replace(/^[,]+/, "").replace(/[,]+$/, "").split(",");
              else u2 = Array.isArray(c2.scope) ? c2.scope : [""];
              var l2 = -1;
              if ("string" == typeof c2.settings.fontStyle) {
                l2 = 0;
                for (var h2 = 0, p2 = (g = c2.settings.fontStyle.split(" ")).length; h2 < p2; h2++) {
                  switch (g[h2]) {
                    case "italic":
                      l2 |= 1;
                      break;
                    case "bold":
                      l2 |= 2;
                      break;
                    case "underline":
                      l2 |= 4;
                  }
                }
              }
              var f = null;
              "string" == typeof c2.settings.foreground && i(c2.settings.foreground) && (f = c2.settings.foreground);
              var d = null;
              "string" == typeof c2.settings.background && i(c2.settings.background) && (d = c2.settings.background);
              for (h2 = 0, p2 = u2.length; h2 < p2; h2++) {
                var g, m = (g = u2[h2].trim().split(" "))[g.length - 1], _ = null;
                g.length > 1 && (_ = g.slice(0, g.length - 1)).reverse(), n2[o2++] = new r(m, _, s2, l2, f, d);
              }
            }
          }
          return n2;
        }
        function s(e2, t2) {
          e2.sort((function(e3, t3) {
            var n3 = u(e3.scope, t3.scope);
            return 0 !== n3 || 0 !== (n3 = l(e3.parentScopes, t3.parentScopes)) ? n3 : e3.index - t3.index;
          }));
          for (var n2 = 0, r2 = "#000000", i2 = "#ffffff"; e2.length >= 1 && "" === e2[0].scope; ) {
            var o2 = e2.shift();
            -1 !== o2.fontStyle && (n2 = o2.fontStyle), null !== o2.foreground && (r2 = o2.foreground), null !== o2.background && (i2 = o2.background);
          }
          for (var s2 = new a(t2), f = new h(0, null, n2, s2.getId(r2), s2.getId(i2)), d = new p(new h(0, null, -1, 0, 0), []), g = 0, m = e2.length; g < m; g++) {
            var _ = e2[g];
            d.insert(0, _.scope, _.parentScopes, _.fontStyle, s2.getId(_.foreground), s2.getId(_.background));
          }
          return new c(s2, f, d);
        }
        t.ParsedThemeRule = r, t.parseTheme = o;
        var a = (function() {
          function e2(e3) {
            if (this._lastColorId = 0, this._id2color = [], this._color2id = /* @__PURE__ */ Object.create(null), Array.isArray(e3)) {
              this._isFrozen = true;
              for (var t2 = 0, n2 = e3.length; t2 < n2; t2++) this._color2id[e3[t2]] = t2, this._id2color[t2] = e3[t2];
            } else this._isFrozen = false;
          }
          return e2.prototype.getId = function(e3) {
            if (null === e3) return 0;
            e3 = e3.toUpperCase();
            var t2 = this._color2id[e3];
            if (t2) return t2;
            if (this._isFrozen) throw new Error("Missing color in color map - " + e3);
            return t2 = ++this._lastColorId, this._color2id[e3] = t2, this._id2color[t2] = e3, t2;
          }, e2.prototype.getColorMap = function() {
            return this._id2color.slice(0);
          }, e2;
        })();
        t.ColorMap = a;
        var c = (function() {
          function e2(e3, t2, n2) {
            this._colorMap = e3, this._root = n2, this._defaults = t2, this._cache = {};
          }
          return e2.createFromRawTheme = function(e3, t2) {
            return this.createFromParsedTheme(o(e3), t2);
          }, e2.createFromParsedTheme = function(e3, t2) {
            return s(e3, t2);
          }, e2.prototype.getColorMap = function() {
            return this._colorMap.getColorMap();
          }, e2.prototype.getDefaults = function() {
            return this._defaults;
          }, e2.prototype.match = function(e3) {
            return this._cache.hasOwnProperty(e3) || (this._cache[e3] = this._root.match(e3)), this._cache[e3];
          }, e2;
        })();
        function u(e2, t2) {
          return e2 < t2 ? -1 : e2 > t2 ? 1 : 0;
        }
        function l(e2, t2) {
          if (null === e2 && null === t2) return 0;
          if (!e2) return -1;
          if (!t2) return 1;
          var n2 = e2.length, r2 = t2.length;
          if (n2 === r2) {
            for (var i2 = 0; i2 < n2; i2++) {
              var o2 = u(e2[i2], t2[i2]);
              if (0 !== o2) return o2;
            }
            return 0;
          }
          return n2 - r2;
        }
        t.Theme = c, t.strcmp = u, t.strArrCmp = l;
        var h = (function() {
          function e2(e3, t2, n2, r2, i2) {
            this.scopeDepth = e3, this.parentScopes = t2, this.fontStyle = n2, this.foreground = r2, this.background = i2;
          }
          return e2.prototype.clone = function() {
            return new e2(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
          }, e2.cloneArr = function(e3) {
            for (var t2 = [], n2 = 0, r2 = e3.length; n2 < r2; n2++) t2[n2] = e3[n2].clone();
            return t2;
          }, e2.prototype.acceptOverwrite = function(e3, t2, n2, r2) {
            this.scopeDepth > e3 ? console.log("how did this happen?") : this.scopeDepth = e3, -1 !== t2 && (this.fontStyle = t2), 0 !== n2 && (this.foreground = n2), 0 !== r2 && (this.background = r2);
          }, e2;
        })();
        t.ThemeTrieElementRule = h;
        var p = (function() {
          function e2(e3, t2, n2) {
            void 0 === t2 && (t2 = []), void 0 === n2 && (n2 = {}), this._mainRule = e3, this._rulesWithParentScopes = t2, this._children = n2;
          }
          return e2._sortBySpecificity = function(e3) {
            return 1 === e3.length || e3.sort(this._cmpBySpecificity), e3;
          }, e2._cmpBySpecificity = function(e3, t2) {
            if (e3.scopeDepth === t2.scopeDepth) {
              var n2 = e3.parentScopes, r2 = t2.parentScopes, i2 = null === n2 ? 0 : n2.length, o2 = null === r2 ? 0 : r2.length;
              if (i2 === o2) for (var s2 = 0; s2 < i2; s2++) {
                var a2 = n2[s2].length, c2 = r2[s2].length;
                if (a2 !== c2) return c2 - a2;
              }
              return o2 - i2;
            }
            return t2.scopeDepth - e3.scopeDepth;
          }, e2.prototype.match = function(t2) {
            if ("" === t2) return e2._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
            var n2, r2, i2 = t2.indexOf(".");
            return -1 === i2 ? (n2 = t2, r2 = "") : (n2 = t2.substring(0, i2), r2 = t2.substring(i2 + 1)), this._children.hasOwnProperty(n2) ? this._children[n2].match(r2) : e2._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
          }, e2.prototype.insert = function(t2, n2, r2, i2, o2, s2) {
            if ("" !== n2) {
              var a2, c2, u2, l2 = n2.indexOf(".");
              -1 === l2 ? (a2 = n2, c2 = "") : (a2 = n2.substring(0, l2), c2 = n2.substring(l2 + 1)), this._children.hasOwnProperty(a2) ? u2 = this._children[a2] : (u2 = new e2(this._mainRule.clone(), h.cloneArr(this._rulesWithParentScopes)), this._children[a2] = u2), u2.insert(t2 + 1, c2, r2, i2, o2, s2);
            } else this._doInsertHere(t2, r2, i2, o2, s2);
          }, e2.prototype._doInsertHere = function(e3, t2, n2, r2, i2) {
            if (null !== t2) {
              for (var o2 = 0, s2 = this._rulesWithParentScopes.length; o2 < s2; o2++) {
                var a2 = this._rulesWithParentScopes[o2];
                if (0 === l(a2.parentScopes, t2)) return void a2.acceptOverwrite(e3, n2, r2, i2);
              }
              -1 === n2 && (n2 = this._mainRule.fontStyle), 0 === r2 && (r2 = this._mainRule.foreground), 0 === i2 && (i2 = this._mainRule.background), this._rulesWithParentScopes.push(new h(e3, t2, n2, r2, i2));
            } else this._mainRule.acceptOverwrite(e3, n2, r2, i2);
          }, e2;
        })();
        t.ThemeTrieElement = p;
      }]);
    }));
  }
});

// browser-external:path
var require_path = __commonJS({
  "browser-external:path"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "path" has been externalized for browser compatibility. Cannot access "path.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:fs
var require_fs = __commonJS({
  "browser-external:fs"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "fs" has been externalized for browser compatibility. Cannot access "fs.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// ../../node_modules/.bun/@typescript+twoslash@3.1.0/node_modules/@typescript/twoslash/package.json
var require_package = __commonJS({
  "../../node_modules/.bun/@typescript+twoslash@3.1.0/node_modules/@typescript/twoslash/package.json"(exports, module) {
    module.exports = {
      name: "@typescript/twoslash",
      version: "3.1.0",
      license: "MIT",
      author: "TypeScript team",
      homepage: "https://github.com/microsoft/TypeScript-Website",
      repository: {
        url: "https://github.com/microsoft/TypeScript-Website.git",
        directory: "packages/create-typescript-playground-plugin",
        type: "git"
      },
      bugs: {
        url: "https://github.com/microsoft/TypeScript-Website/issues"
      },
      main: "dist/index.js",
      module: "dist/twoslash.esm.js",
      typings: "dist/index.d.ts",
      files: [
        "dist"
      ],
      scripts: {
        start: "tsdx watch",
        bootstrap: "yarn build",
        build: "tsdx build && yarn readme && yarn make-global",
        "make-global": "node scripts/makeGlobals.js",
        readme: "yarn md-magic README.md --config ./scripts/inline-results.js && yarn prettier README.md --write",
        test: "tsdx test",
        lint: "tsdx lint"
      },
      devDependencies: {
        "@types/jest": "^25.1.3",
        "@types/lz-string": "^1.3.33",
        "@types/prettier": "^1.19.0",
        husky: "^4.2.3",
        "jest-file-snapshot": "^0.3.8",
        "markdown-magic": "^1.0.0",
        prettier: "^2.3.2",
        tsdx: "^0.14.1",
        tslib: "^1.10.0",
        typescript: "*"
      },
      jest: {
        watchPathIgnorePatterns: [
          "test/results"
        ]
      },
      browser: {
        fs: false,
        "lz-string": false,
        typescript: false
      },
      dependencies: {
        "@typescript/vfs": "1.3.5",
        debug: "^4.1.1",
        "lz-string": "^1.4.4"
      }
    };
  }
});

// ../../node_modules/.bun/typescript@5.9.3/node_modules/typescript/package.json
var require_package2 = __commonJS({
  "../../node_modules/.bun/typescript@5.9.3/node_modules/typescript/package.json"(exports, module) {
    module.exports = {
      name: "typescript",
      author: "Microsoft Corp.",
      homepage: "https://www.typescriptlang.org/",
      version: "5.9.3",
      license: "Apache-2.0",
      description: "TypeScript is a language for application scale JavaScript development",
      keywords: [
        "TypeScript",
        "Microsoft",
        "compiler",
        "language",
        "javascript"
      ],
      bugs: {
        url: "https://github.com/microsoft/TypeScript/issues"
      },
      repository: {
        type: "git",
        url: "https://github.com/microsoft/TypeScript.git"
      },
      main: "./lib/typescript.js",
      typings: "./lib/typescript.d.ts",
      bin: {
        tsc: "./bin/tsc",
        tsserver: "./bin/tsserver"
      },
      engines: {
        node: ">=14.17"
      },
      files: [
        "bin",
        "lib",
        "!lib/enu",
        "LICENSE.txt",
        "README.md",
        "SECURITY.md",
        "ThirdPartyNoticeText.txt",
        "!**/.gitattributes"
      ],
      devDependencies: {
        "@dprint/formatter": "^0.4.1",
        "@dprint/typescript": "0.93.4",
        "@esfx/canceltoken": "^1.0.0",
        "@eslint/js": "^9.20.0",
        "@octokit/rest": "^21.1.1",
        "@types/chai": "^4.3.20",
        "@types/diff": "^7.0.1",
        "@types/minimist": "^1.2.5",
        "@types/mocha": "^10.0.10",
        "@types/ms": "^0.7.34",
        "@types/node": "latest",
        "@types/source-map-support": "^0.5.10",
        "@types/which": "^3.0.4",
        "@typescript-eslint/rule-tester": "^8.24.1",
        "@typescript-eslint/type-utils": "^8.24.1",
        "@typescript-eslint/utils": "^8.24.1",
        "azure-devops-node-api": "^14.1.0",
        c8: "^10.1.3",
        chai: "^4.5.0",
        chokidar: "^4.0.3",
        diff: "^7.0.0",
        dprint: "^0.49.0",
        esbuild: "^0.25.0",
        eslint: "^9.20.1",
        "eslint-formatter-autolinkable-stylish": "^1.4.0",
        "eslint-plugin-regexp": "^2.7.0",
        "fast-xml-parser": "^4.5.2",
        glob: "^10.4.5",
        globals: "^15.15.0",
        hereby: "^1.10.0",
        "jsonc-parser": "^3.3.1",
        knip: "^5.44.4",
        minimist: "^1.2.8",
        mocha: "^10.8.2",
        "mocha-fivemat-progress-reporter": "^0.1.0",
        "monocart-coverage-reports": "^2.12.1",
        ms: "^2.1.3",
        picocolors: "^1.1.1",
        playwright: "^1.50.1",
        "source-map-support": "^0.5.21",
        tslib: "^2.8.1",
        typescript: "^5.7.3",
        "typescript-eslint": "^8.24.1",
        which: "^3.0.1"
      },
      overrides: {
        "typescript@*": "$typescript"
      },
      scripts: {
        test: "hereby runtests-parallel --light=false",
        "test:eslint-rules": "hereby run-eslint-rules-tests",
        build: "npm run build:compiler && npm run build:tests",
        "build:compiler": "hereby local",
        "build:tests": "hereby tests",
        "build:tests:notypecheck": "hereby tests --no-typecheck",
        clean: "hereby clean",
        gulp: "hereby",
        lint: "hereby lint",
        knip: "hereby knip",
        format: "dprint fmt",
        "setup-hooks": "node scripts/link-hooks.mjs"
      },
      browser: {
        fs: false,
        os: false,
        path: false,
        crypto: false,
        buffer: false,
        "source-map-support": false,
        inspector: false,
        perf_hooks: false
      },
      packageManager: "npm@8.19.4",
      volta: {
        node: "20.1.0",
        npm: "8.19.4"
      },
      gitHead: "c63de15a992d37f0d6cec03ac7631872838602cb"
    };
  }
});

// ../../node_modules/.bun/@typescript+vfs@1.3.5/node_modules/@typescript/vfs/dist/vfs.esm.js
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var hasLocalStorage = false;
try {
  hasLocalStorage = typeof localStorage !== "undefined";
} catch (error) {
}
var hasProcess = typeof process !== "undefined";
var shouldDebug = hasLocalStorage && localStorage.getItem("DEBUG") || hasProcess && process.env.DEBUG;
var debugLog = shouldDebug ? console.log : function(_message) {
  return "";
};
function createVirtualTypeScriptEnvironment(sys, rootFiles, ts, compilerOptions, customTransformers) {
  if (compilerOptions === void 0) {
    compilerOptions = {};
  }
  var mergedCompilerOpts = _extends({}, defaultCompilerOptions(ts), compilerOptions);
  var _createVirtualLanguag = createVirtualLanguageServiceHost(sys, rootFiles, mergedCompilerOpts, ts, customTransformers), languageServiceHost = _createVirtualLanguag.languageServiceHost, _updateFile = _createVirtualLanguag.updateFile;
  var languageService = ts.createLanguageService(languageServiceHost);
  var diagnostics = languageService.getCompilerOptionsDiagnostics();
  if (diagnostics.length) {
    var compilerHost = createVirtualCompilerHost(sys, compilerOptions, ts);
    throw new Error(ts.formatDiagnostics(diagnostics, compilerHost.compilerHost));
  }
  return {
    // @ts-ignore
    name: "vfs",
    sys,
    languageService,
    getSourceFile: function getSourceFile(fileName) {
      var _languageService$getP;
      return (_languageService$getP = languageService.getProgram()) == null ? void 0 : _languageService$getP.getSourceFile(fileName);
    },
    createFile: function createFile(fileName, content) {
      _updateFile(ts.createSourceFile(fileName, content, mergedCompilerOpts.target, false));
    },
    updateFile: function updateFile(fileName, content, optPrevTextSpan) {
      var prevSourceFile = languageService.getProgram().getSourceFile(fileName);
      if (!prevSourceFile) {
        throw new Error("Did not find a source file for " + fileName);
      }
      var prevFullContents = prevSourceFile.text;
      var prevTextSpan = optPrevTextSpan != null ? optPrevTextSpan : ts.createTextSpan(0, prevFullContents.length);
      var newText = prevFullContents.slice(0, prevTextSpan.start) + content + prevFullContents.slice(prevTextSpan.start + prevTextSpan.length);
      var newSourceFile = ts.updateSourceFile(prevSourceFile, newText, {
        span: prevTextSpan,
        newLength: content.length
      });
      _updateFile(newSourceFile);
    }
  };
}
function notImplemented(methodName) {
  throw new Error("Method '" + methodName + "' is not implemented.");
}
function audit(name, fn) {
  return function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var res = fn.apply(void 0, args);
    var smallres = typeof res === "string" ? res.slice(0, 80) + "..." : res;
    debugLog.apply(void 0, ["> " + name].concat(args));
    debugLog("< " + smallres);
    return res;
  };
}
var defaultCompilerOptions = function defaultCompilerOptions2(ts) {
  return _extends({}, ts.getDefaultCompilerOptions(), {
    jsx: ts.JsxEmit.React,
    strict: true,
    esModuleInterop: true,
    module: ts.ModuleKind.ESNext,
    suppressOutputPathCheck: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs
  });
};
var libize = function libize2(path) {
  return path.replace("/", "/lib.").toLowerCase();
};
function createSystem(files) {
  return {
    args: [],
    createDirectory: function createDirectory() {
      return notImplemented("createDirectory");
    },
    // TODO: could make a real file tree
    directoryExists: audit("directoryExists", function(directory) {
      return Array.from(files.keys()).some(function(path) {
        return path.startsWith(directory);
      });
    }),
    exit: function exit() {
      return notImplemented("exit");
    },
    fileExists: audit("fileExists", function(fileName) {
      return files.has(fileName) || files.has(libize(fileName));
    }),
    getCurrentDirectory: function getCurrentDirectory() {
      return "/";
    },
    getDirectories: function getDirectories() {
      return [];
    },
    getExecutingFilePath: function getExecutingFilePath() {
      return notImplemented("getExecutingFilePath");
    },
    readDirectory: audit("readDirectory", function(directory) {
      return directory === "/" ? Array.from(files.keys()) : [];
    }),
    readFile: audit("readFile", function(fileName) {
      return files.get(fileName) || files.get(libize(fileName));
    }),
    resolvePath: function resolvePath(path) {
      return path;
    },
    newLine: "\n",
    useCaseSensitiveFileNames: true,
    write: function write() {
      return notImplemented("write");
    },
    writeFile: function writeFile(fileName, contents) {
      files.set(fileName, contents);
    }
  };
}
function createFSBackedSystem(files, _projectRoot, ts) {
  var root = _projectRoot + "/vfs";
  var path = requirePath();
  var nodeSys = ts.sys;
  var tsLib = path.dirname(__require.resolve("typescript"));
  return {
    // @ts-ignore
    name: "fs-vfs",
    root,
    args: [],
    createDirectory: function createDirectory() {
      return notImplemented("createDirectory");
    },
    // TODO: could make a real file tree
    directoryExists: audit("directoryExists", function(directory) {
      return Array.from(files.keys()).some(function(path2) {
        return path2.startsWith(directory);
      }) || nodeSys.directoryExists(directory);
    }),
    exit: nodeSys.exit,
    fileExists: audit("fileExists", function(fileName) {
      if (files.has(fileName)) return true;
      if (fileName.includes("tsconfig.json") || fileName.includes("tsconfig.json")) return false;
      if (fileName.startsWith("/lib")) {
        var tsLibName = tsLib + "/" + fileName.replace("/", "");
        return nodeSys.fileExists(tsLibName);
      }
      return nodeSys.fileExists(fileName);
    }),
    getCurrentDirectory: function getCurrentDirectory() {
      return root;
    },
    getDirectories: nodeSys.getDirectories,
    getExecutingFilePath: function getExecutingFilePath() {
      return notImplemented("getExecutingFilePath");
    },
    readDirectory: audit("readDirectory", function() {
      if ((arguments.length <= 0 ? void 0 : arguments[0]) === "/") {
        return Array.from(files.keys());
      } else {
        return nodeSys.readDirectory.apply(nodeSys, arguments);
      }
    }),
    readFile: audit("readFile", function(fileName) {
      if (files.has(fileName)) return files.get(fileName);
      if (fileName.startsWith("/lib")) {
        var tsLibName = tsLib + "/" + fileName.replace("/", "");
        var result = nodeSys.readFile(tsLibName);
        if (!result) {
          var libs = nodeSys.readDirectory(tsLib);
          throw new Error("TSVFS: A request was made for " + tsLibName + " but there wasn't a file found in the file map. You likely have a mismatch in the compiler options for the CDN download vs the compiler program. Existing Libs: " + libs + ".");
        }
        return result;
      }
      return nodeSys.readFile(fileName);
    }),
    resolvePath: function resolvePath(path2) {
      if (files.has(path2)) return path2;
      return nodeSys.resolvePath(path2);
    },
    newLine: "\n",
    useCaseSensitiveFileNames: true,
    write: function write() {
      return notImplemented("write");
    },
    writeFile: function writeFile(fileName, contents) {
      files.set(fileName, contents);
    }
  };
}
function createVirtualCompilerHost(sys, compilerOptions, ts) {
  var sourceFiles = /* @__PURE__ */ new Map();
  var save = function save2(sourceFile) {
    sourceFiles.set(sourceFile.fileName, sourceFile);
    return sourceFile;
  };
  var vHost = {
    compilerHost: _extends({}, sys, {
      getCanonicalFileName: function getCanonicalFileName(fileName) {
        return fileName;
      },
      getDefaultLibFileName: function getDefaultLibFileName() {
        return "/" + ts.getDefaultLibFileName(compilerOptions);
      },
      // getDefaultLibLocation: () => '/',
      getDirectories: function getDirectories() {
        return [];
      },
      getNewLine: function getNewLine() {
        return sys.newLine;
      },
      getSourceFile: function getSourceFile(fileName) {
        return sourceFiles.get(fileName) || save(ts.createSourceFile(fileName, sys.readFile(fileName), compilerOptions.target || defaultCompilerOptions(ts).target, false));
      },
      useCaseSensitiveFileNames: function useCaseSensitiveFileNames() {
        return sys.useCaseSensitiveFileNames;
      }
    }),
    updateFile: function updateFile(sourceFile) {
      var alreadyExists = sourceFiles.has(sourceFile.fileName);
      sys.writeFile(sourceFile.fileName, sourceFile.text);
      sourceFiles.set(sourceFile.fileName, sourceFile);
      return alreadyExists;
    }
  };
  return vHost;
}
function createVirtualLanguageServiceHost(sys, rootFiles, compilerOptions, ts, customTransformers) {
  var fileNames = [].concat(rootFiles);
  var _createVirtualCompile = createVirtualCompilerHost(sys, compilerOptions, ts), compilerHost = _createVirtualCompile.compilerHost, _updateFile2 = _createVirtualCompile.updateFile;
  var fileVersions = /* @__PURE__ */ new Map();
  var projectVersion = 0;
  var languageServiceHost = _extends({}, compilerHost, {
    getProjectVersion: function getProjectVersion() {
      return projectVersion.toString();
    },
    getCompilationSettings: function getCompilationSettings() {
      return compilerOptions;
    },
    getCustomTransformers: function getCustomTransformers() {
      return customTransformers;
    },
    getScriptFileNames: function getScriptFileNames() {
      return fileNames;
    },
    getScriptSnapshot: function getScriptSnapshot(fileName) {
      var contents = sys.readFile(fileName);
      if (contents) {
        return ts.ScriptSnapshot.fromString(contents);
      }
      return;
    },
    getScriptVersion: function getScriptVersion(fileName) {
      return fileVersions.get(fileName) || "0";
    },
    writeFile: sys.writeFile
  });
  var lsHost = {
    languageServiceHost,
    updateFile: function updateFile(sourceFile) {
      projectVersion++;
      fileVersions.set(sourceFile.fileName, projectVersion.toString());
      if (!fileNames.includes(sourceFile.fileName)) {
        fileNames.push(sourceFile.fileName);
      }
      _updateFile2(sourceFile);
    }
  };
  return lsHost;
}
var requirePath = function requirePath2() {
  return __require(String.fromCharCode(112, 97, 116, 104));
};

// ../../node_modules/.bun/@typescript+twoslash@3.1.0/node_modules/@typescript/twoslash/dist/twoslash.esm.js
function _extends2() {
  _extends2 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends2.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf3(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2) _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2)) return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function() {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  it = o[Symbol.iterator]();
  return it.next.bind(it);
}
function parsePrimitive(value, type) {
  switch (type) {
    case "number":
      return +value;
    case "string":
      return value;
    case "boolean":
      return value.toLowerCase() === "true" || value.length === 0;
  }
  throw new TwoslashError("Unknown primitive value in compiler flag", "The only recognized primitives are number, string and boolean. Got " + type + " with " + value + ".", "This is likely a typo.");
}
function cleanMarkdownEscaped(code) {
  code = code.replace(/¨D/g, "$");
  code = code.replace(/¨T/g, "~");
  return code;
}
function typesToExtension(types) {
  var map = {
    js: "js",
    javascript: "js",
    ts: "ts",
    typescript: "ts",
    tsx: "tsx",
    jsx: "jsx",
    json: "json",
    jsn: "json"
  };
  if (map[types]) return map[types];
  throw new TwoslashError("Unknown TypeScript extension given to Twoslash", "Received " + types + " but Twoslash only accepts: " + Object.keys(map) + " ", "");
}
function getIdentifierTextSpans(ts, sourceFile) {
  var textSpans = [];
  checkChildren(sourceFile);
  return textSpans;
  function checkChildren(node) {
    ts.forEachChild(node, function(child) {
      if (ts.isIdentifier(child)) {
        var start = child.getStart(sourceFile, false);
        textSpans.push({
          span: ts.createTextSpan(start, child.end - start),
          text: child.getText(sourceFile)
        });
      }
      checkChildren(child);
    });
  }
}
function getClosestWord(str, pos) {
  str = String(str);
  pos = Number(pos) >>> 0;
  var left = str.slice(0, pos + 1).search(/\S+$/), right = str.slice(pos).search(/\s/);
  if (right < 0) {
    return {
      word: str.slice(left),
      startPos: left
    };
  }
  return {
    word: str.slice(left, right + pos),
    startPos: left
  };
}
function validateCodeForErrors(relevantErrors, handbookOptions, extension, originalCode, vfsRoot) {
  var inErrsButNotFoundInTheHeader = relevantErrors.filter(function(e) {
    return !handbookOptions.errors.includes(e.code);
  });
  var errorsFound = Array.from(new Set(inErrsButNotFoundInTheHeader.map(function(e) {
    return e.code;
  }))).join(" ");
  if (inErrsButNotFoundInTheHeader.length) {
    var errorsToShow = new Set(relevantErrors.map(function(e) {
      return e.code;
    }));
    var codeToAdd = "// @errors: " + Array.from(errorsToShow).join(" ");
    var missing = handbookOptions.errors.length ? "\nThe existing annotation specified " + handbookOptions.errors.join(" ") : "\nExpected: " + codeToAdd;
    var filesToErrors = {};
    var noFiles = [];
    inErrsButNotFoundInTheHeader.forEach(function(d) {
      var _d$file;
      var fileRef = ((_d$file = d.file) == null ? void 0 : _d$file.fileName) && d.file.fileName.replace(vfsRoot, "");
      if (!fileRef) noFiles.push(d);
      else {
        var existing = filesToErrors[fileRef];
        if (existing) existing.push(d);
        else filesToErrors[fileRef] = [d];
      }
    });
    var showDiagnostics = function showDiagnostics2(title, diags) {
      return title + "\n  " + diags.map(function(e) {
        var msg = typeof e.messageText === "string" ? e.messageText : e.messageText.messageText;
        return "[" + e.code + "] " + e.start + " - " + msg;
      }).join("\n  ");
    };
    var innerDiags = [];
    if (noFiles.length) {
      innerDiags.push(showDiagnostics("Ambient Errors", noFiles));
    }
    Object.keys(filesToErrors).forEach(function(filepath) {
      innerDiags.push(showDiagnostics(filepath, filesToErrors[filepath]));
    });
    var allMessages = innerDiags.join("\n\n");
    var newErr = new TwoslashError("Errors were thrown in the sample, but not included in an errors tag", "These errors were not marked as being expected: " + errorsFound + ". " + missing, "Compiler Errors:\n\n" + allMessages);
    newErr.code = "## Code\n\n'''" + extension + "\n" + originalCode + "\n'''";
    throw newErr;
  }
}
function validateInput(code) {
  if (code.includes("// @errors ")) {
    throw new TwoslashError("You have '// @errors ' (with a space)", "You want '// @errors: ' (with a colon)", "This is a pretty common typo");
  }
  if (code.includes("// @filename ")) {
    throw new TwoslashError("You have '// @filename ' (with a space)", "You want '// @filename: ' (with a colon)", "This is a pretty common typo");
  }
}
var hasLocalStorage2 = false;
try {
  hasLocalStorage2 = typeof localStorage !== "undefined";
} catch (error) {
}
var hasProcess2 = typeof process !== "undefined";
var shouldDebug2 = hasLocalStorage2 && localStorage.getItem("DEBUG") || hasProcess2 && process.env.DEBUG;
var log = shouldDebug2 ? console.log : function(_message) {
  return "";
};
var TwoslashError = (function(_Error) {
  _inheritsLoose(TwoslashError2, _Error);
  function TwoslashError2(title, description, recommendation, code) {
    var _this;
    var message = "\n## " + title + "\n\n" + description + "\n";
    if (recommendation) {
      message += "\n" + recommendation;
    }
    if (code) {
      message += "\n" + code;
    }
    _this = _Error.call(this, message) || this;
    _this.title = void 0;
    _this.description = void 0;
    _this.recommendation = void 0;
    _this.code = void 0;
    _this.title = title;
    _this.description = description;
    _this.recommendation = recommendation;
    _this.code = code;
    return _this;
  }
  return TwoslashError2;
})(_wrapNativeSuper(Error));
function filterHighlightLines(codeLines) {
  var highlights = [];
  var queries = [];
  var nextContentOffset = 0;
  var contentOffset = 0;
  var removedLines = 0;
  var _loop = function _loop2(_i) {
    var line = codeLines[_i];
    var moveForward = function moveForward2() {
      contentOffset = nextContentOffset;
      nextContentOffset += line.length + 1;
    };
    var stripLine = function stripLine2(logDesc) {
      log("Removing line " + _i + " for " + logDesc);
      removedLines++;
      codeLines.splice(_i, 1);
      _i--;
    };
    if (!line.includes("//")) {
      moveForward();
    } else {
      var highlightMatch = /^\s*\/\/\s*\^+( .+)?$/.exec(line);
      var queryMatch = /^\s*\/\/\s*\^\?\s*$/.exec(line);
      var removePrettierIgnoreMatch = /^\s*\/\/ prettier-ignore$/.exec(line);
      var completionsQuery = /^\s*\/\/\s*\^\|$/.exec(line);
      if (queryMatch !== null) {
        var start = line.indexOf("^");
        queries.push({
          kind: "query",
          offset: start,
          text: void 0,
          docs: void 0,
          line: _i + removedLines - 1
        });
        stripLine("having a query");
      } else if (highlightMatch !== null) {
        var _start = line.indexOf("^");
        var length = line.lastIndexOf("^") - _start + 1;
        var description = highlightMatch[1] ? highlightMatch[1].trim() : "";
        highlights.push({
          kind: "highlight",
          offset: _start + contentOffset,
          length,
          text: description,
          line: _i + removedLines - 1,
          start: _start
        });
        stripLine("having a highlight");
      } else if (removePrettierIgnoreMatch !== null) {
        stripLine("being a prettier ignore");
      } else if (completionsQuery !== null) {
        var _start2 = line.indexOf("^");
        queries.push({
          kind: "completion",
          offset: _start2,
          text: void 0,
          docs: void 0,
          line: _i + removedLines - 1
        });
        stripLine("having a completion query");
      } else {
        moveForward();
      }
    }
    i = _i;
  };
  for (var i = 0; i < codeLines.length; i++) {
    _loop(i);
  }
  return {
    highlights,
    queries
  };
}
function getOptionValueFromMap(name, key, optMap) {
  var result = optMap.get(key.toLowerCase());
  log("Get " + name + " mapped option: " + key + " => " + result);
  if (result === void 0) {
    var keys = Array.from(optMap.keys());
    throw new TwoslashError("Invalid inline compiler value", "Got " + key + " for " + name + " but it is not a supported value by the TS compiler.", "Allowed values: " + keys.join(","));
  }
  return result;
}
function setOption(name, value, opts, ts) {
  log("Setting " + name + " to " + value);
  var _loop2 = function _loop22() {
    var opt = _step.value;
    if (opt.name.toLowerCase() === name.toLowerCase()) {
      switch (opt.type) {
        case "number":
        case "string":
        case "boolean":
          opts[opt.name] = parsePrimitive(value, opt.type);
          break;
        case "list":
          var elementType = opt.element.type;
          var strings = value.split(",");
          if (typeof elementType === "string") {
            opts[opt.name] = strings.map(function(v) {
              return parsePrimitive(v, elementType);
            });
          } else {
            opts[opt.name] = strings.map(function(v) {
              return getOptionValueFromMap(opt.name, v, elementType);
            });
          }
          break;
        default:
          var optMap = opt.type;
          opts[opt.name] = getOptionValueFromMap(opt.name, value, optMap);
          break;
      }
      return {
        v: void 0
      };
    }
  };
  for (var _iterator = _createForOfIteratorHelperLoose(ts.optionDeclarations), _step; !(_step = _iterator()).done; ) {
    var _ret = _loop2();
    if (typeof _ret === "object") return _ret.v;
  }
  throw new TwoslashError("Invalid inline compiler flag", "There isn't a TypeScript compiler flag called '" + name + "'.", "This is likely a typo, you can check all the compiler flags in the TSConfig reference, or check the additional Twoslash flags in the npm page for @typescript/twoslash.");
}
var booleanConfigRegexp = /^\/\/\s?@(\w+)$/;
var valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/;
function filterCompilerOptions(codeLines, defaultCompilerOptions3, ts) {
  var options = _extends2({}, defaultCompilerOptions3);
  for (var _i2 = 0; _i2 < codeLines.length; ) {
    var match = void 0;
    if (match = booleanConfigRegexp.exec(codeLines[_i2])) {
      options[match[1]] = true;
      setOption(match[1], "true", options, ts);
    } else if (match = valuedConfigRegexp.exec(codeLines[_i2])) {
      if (match[1] === "filename") {
        _i2++;
        continue;
      }
      setOption(match[1], match[2], options, ts);
    } else {
      _i2++;
      continue;
    }
    codeLines.splice(_i2, 1);
  }
  return options;
}
function filterCustomTags(codeLines, customTags) {
  var tags = [];
  for (var _i3 = 0; _i3 < codeLines.length; ) {
    var match = void 0;
    if (match = valuedConfigRegexp.exec(codeLines[_i3])) {
      if (customTags.includes(match[1])) {
        tags.push({
          name: match[1],
          line: _i3,
          annotation: codeLines[_i3].split("@" + match[1] + ": ")[1]
        });
        codeLines.splice(_i3, 1);
      }
    }
    _i3++;
  }
  return tags;
}
var defaultHandbookOptions = {
  errors: [],
  noErrors: false,
  showEmit: false,
  showEmittedFile: void 0,
  noStaticSemanticInfo: false,
  emit: false,
  noErrorValidation: false
};
function filterHandbookOptions(codeLines) {
  var options = _extends2({}, defaultHandbookOptions);
  for (var _i4 = 0; _i4 < codeLines.length; _i4++) {
    var match = void 0;
    if (match = booleanConfigRegexp.exec(codeLines[_i4])) {
      if (match[1] in options) {
        options[match[1]] = true;
        log("Setting options." + match[1] + " to true");
        codeLines.splice(_i4, 1);
        _i4--;
      }
    } else if (match = valuedConfigRegexp.exec(codeLines[_i4])) {
      if (match[1] in options) {
        options[match[1]] = match[2];
        log("Setting options." + match[1] + " to " + match[2]);
        codeLines.splice(_i4, 1);
        _i4--;
      }
    }
  }
  if ("errors" in options && typeof options.errors === "string") {
    options.errors = options.errors.split(" ").map(Number);
    log("Setting options.error to ", options.errors);
  }
  return options;
}
function twoslasher(code, extension, options) {
  var _options$tsModule, _options$lzstringModu, _options$defaultCompi;
  if (options === void 0) {
    options = {};
  }
  var ts = (_options$tsModule = options.tsModule) != null ? _options$tsModule : require_typescript();
  var lzstring = (_options$lzstringModu = options.lzstringModule) != null ? _options$lzstringModu : require_lz_string();
  var originalCode = code;
  var safeExtension = typesToExtension(extension);
  var defaultFileName = "index." + safeExtension;
  log("\n\nLooking at code: \n```" + safeExtension + "\n" + code + "\n```\n");
  var defaultCompilerOptions3 = _extends2({
    strict: true,
    target: ts.ScriptTarget.ES2016,
    allowJs: true
  }, (_options$defaultCompi = options.defaultCompilerOptions) != null ? _options$defaultCompi : {});
  validateInput(code);
  code = cleanMarkdownEscaped(code);
  var codeLines = code.split(/\r\n?|\n/g);
  var tags = options.customTags ? filterCustomTags(codeLines, options.customTags) : [];
  var handbookOptions = _extends2({}, filterHandbookOptions(codeLines), options.defaultOptions);
  var compilerOptions = filterCompilerOptions(codeLines, defaultCompilerOptions3, ts);
  if (!handbookOptions.showEmittedFile) {
    handbookOptions.showEmittedFile = compilerOptions.jsx && compilerOptions.jsx === ts.JsxEmit.Preserve ? "index.jsx" : "index.js";
  }
  var getRoot = function getRoot2() {
    var pa = "pa";
    var path = __require(pa + "th");
    var rootPath = options.vfsRoot || process.cwd();
    return rootPath.split(path.sep).join(path.posix.sep);
  };
  var useFS = !!options.fsMap;
  var vfs = useFS && options.fsMap ? options.fsMap : /* @__PURE__ */ new Map();
  var system = useFS ? createSystem(vfs) : createFSBackedSystem(vfs, getRoot(), ts);
  var fsRoot = useFS ? "/" : getRoot() + "/";
  var env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions, options.customTransformers);
  var ls = env.languageService;
  code = codeLines.join("\n");
  var partialQueries = [];
  var queries = [];
  var highlights = [];
  var nameContent = splitTwoslashCodeInfoFiles(code, defaultFileName, fsRoot);
  var sourceFiles = ["js", "jsx", "ts", "tsx"];
  var filenames = nameContent.map(function(nc) {
    return nc[0];
  });
  var _loop3 = function _loop32() {
    var file2 = _step2.value;
    var filename = file2[0], codeLines2 = file2[1];
    var filetype = filename.split(".").pop() || "";
    var allowJSON = compilerOptions.resolveJsonModule && filetype === "json";
    if (!sourceFiles.includes(filetype) && !allowJSON) {
      return "continue";
    }
    var newFileCode = codeLines2.join("\n");
    env.createFile(filename, newFileCode);
    var updates = filterHighlightLines(codeLines2);
    highlights = highlights.concat(updates.highlights);
    var lspedQueries = updates.queries.map(function(q, i) {
      var sourceFile = env.getSourceFile(filename);
      var position = ts.getPositionOfLineAndCharacter(sourceFile, q.line, q.offset);
      switch (q.kind) {
        case "query": {
          var quickInfo = ls.getQuickInfoAtPosition(filename, position);
          var text;
          var docs;
          if (quickInfo && quickInfo.displayParts) {
            text = quickInfo.displayParts.map(function(dp) {
              return dp.text;
            }).join("");
            docs = quickInfo.documentation ? quickInfo.documentation.map(function(d) {
              return d.text;
            }).join("<br/>") : void 0;
          } else {
            throw new TwoslashError("Invalid QuickInfo query", "The request on line " + q.line + " in " + filename + " for quickinfo via ^? returned no from the compiler.", "This is likely that the x positioning is off.");
          }
          var queryResult = {
            kind: "query",
            text,
            docs,
            line: q.line - i,
            offset: q.offset,
            file: filename
          };
          return queryResult;
        }
        case "completion": {
          var completions = ls.getCompletionsAtPosition(filename, position - 1, {});
          if (!completions && !handbookOptions.noErrorValidation) {
            throw new TwoslashError("Invalid completion query", "The request on line " + q.line + " in " + filename + " for completions via ^| returned no completions from the compiler.", "This is likely that the positioning is off.");
          }
          var word = getClosestWord(sourceFile.text, position - 1);
          var prefix = sourceFile.text.slice(word.startPos, position);
          var lastDot = prefix.split(".").pop() || "";
          var _queryResult = {
            kind: "completions",
            completions: (completions == null ? void 0 : completions.entries) || [],
            completionPrefix: lastDot,
            line: q.line - i,
            offset: q.offset,
            file: filename
          };
          return _queryResult;
        }
      }
    });
    partialQueries = partialQueries.concat(lspedQueries);
    var newEditedFileCode = codeLines2.join("\n");
    env.updateFile(filename, newEditedFileCode);
  };
  for (var _iterator2 = _createForOfIteratorHelperLoose(nameContent), _step2; !(_step2 = _iterator2()).done; ) {
    var _ret2 = _loop3();
    if (_ret2 === "continue") continue;
  }
  var allCodeLines = code.split(/\r\n?|\n/g);
  filterHighlightLines(allCodeLines);
  code = allCodeLines.join("\n");
  if (handbookOptions.emit) {
    filenames.forEach(function(f) {
      var filetype = f.split(".").pop() || "";
      if (!sourceFiles.includes(filetype)) return;
      var output2 = ls.getEmitOutput(f);
      output2.outputFiles.forEach(function(output3) {
        system.writeFile(output3.name, output3.text);
      });
    });
  }
  var errs = [];
  var staticQuickInfos = [];
  filenames.forEach(function(file2) {
    var filetype = file2.split(".").pop() || "";
    if (!sourceFiles.includes(filetype)) {
      return;
    }
    if (!handbookOptions.noErrors) {
      errs = errs.concat(ls.getSemanticDiagnostics(file2), ls.getSyntacticDiagnostics(file2));
    }
    var source = env.sys.readFile(file2);
    var sourceFile = env.getSourceFile(file2);
    if (!sourceFile) {
      throw new TwoslashError("Could not find a  TypeScript sourcefile for '" + file2 + "' in the Twoslash vfs", "It's a little hard to provide useful advice on this error. Maybe you imported something which the compiler doesn't think is a source file?", "");
    }
    if (!handbookOptions.showEmit) {
      var fileContentStartIndexInModifiedFile2 = code.indexOf(source) == -1 ? 0 : code.indexOf(source);
      var linesAbove = code.slice(0, fileContentStartIndexInModifiedFile2).split("\n").length - 1;
      var identifiers = handbookOptions.noStaticSemanticInfo ? [] : getIdentifierTextSpans(ts, sourceFile);
      for (var _iterator3 = _createForOfIteratorHelperLoose(identifiers), _step3; !(_step3 = _iterator3()).done; ) {
        var identifier = _step3.value;
        var span = identifier.span;
        var quickInfo = ls.getQuickInfoAtPosition(file2, span.start);
        if (quickInfo && quickInfo.displayParts) {
          var text = quickInfo.displayParts.map(function(dp) {
            return dp.text;
          }).join("");
          var targetString = identifier.text;
          var docs = quickInfo.documentation ? quickInfo.documentation.map(function(d) {
            return d.text;
          }).join("\n") : void 0;
          var position = span.start + fileContentStartIndexInModifiedFile2;
          var burnerSourceFile = ts.createSourceFile("_.ts", code, ts.ScriptTarget.ES2015);
          var _ts$getLineAndCharact = ts.getLineAndCharacterOfPosition(burnerSourceFile, position), line2 = _ts$getLineAndCharact.line, character2 = _ts$getLineAndCharact.character;
          staticQuickInfos.push({
            text,
            docs,
            start: position,
            length: span.length,
            line: line2,
            character: character2,
            targetString
          });
        }
      }
      partialQueries.filter(function(q) {
        return q.file === file2;
      }).forEach(function(q) {
        var pos = ts.getPositionOfLineAndCharacter(sourceFile, q.line, q.offset) + fileContentStartIndexInModifiedFile2;
        switch (q.kind) {
          case "query": {
            queries.push({
              docs: q.docs,
              kind: "query",
              start: pos + fileContentStartIndexInModifiedFile2,
              length: q.text.length,
              text: q.text,
              offset: q.offset,
              line: q.line + linesAbove + 1
            });
            break;
          }
          case "completions": {
            queries.push({
              completions: q.completions,
              kind: "completions",
              start: pos + fileContentStartIndexInModifiedFile2,
              completionsPrefix: q.completionPrefix,
              length: 1,
              offset: q.offset,
              line: q.line + linesAbove + 1
            });
          }
        }
      });
    }
  });
  var relevantErrors = errs.filter(function(e) {
    return e.file && filenames.includes(e.file.fileName);
  });
  if (!handbookOptions.noErrorValidation && relevantErrors.length) {
    validateCodeForErrors(relevantErrors, handbookOptions, extension, originalCode, fsRoot);
  }
  var errors = [];
  for (var _iterator4 = _createForOfIteratorHelperLoose(relevantErrors), _step4; !(_step4 = _iterator4()).done; ) {
    var err = _step4.value;
    var codeWhereErrorLives = env.sys.readFile(err.file.fileName);
    var fileContentStartIndexInModifiedFile = code.indexOf(codeWhereErrorLives);
    var renderedMessage = ts.flattenDiagnosticMessageText(err.messageText, "\n");
    var id = "err-" + err.code + "-" + err.start + "-" + err.length;
    var _ts$getLineAndCharact2 = ts.getLineAndCharacterOfPosition(err.file, err.start), line = _ts$getLineAndCharact2.line, character = _ts$getLineAndCharact2.character;
    errors.push({
      category: err.category,
      code: err.code,
      length: err.length,
      start: err.start ? err.start + fileContentStartIndexInModifiedFile : void 0,
      line,
      character,
      renderedMessage,
      id
    });
  }
  if (handbookOptions.showEmit) {
    var emitFilename = handbookOptions.showEmittedFile || defaultFileName;
    var emitSourceFilename = fsRoot + emitFilename.replace(".jsx", "").replace(".js", "").replace(".d.ts", "").replace(".map", "");
    var emitSource = filenames.find(function(f) {
      return f === emitSourceFilename + ".ts" || f === emitSourceFilename + ".tsx";
    });
    if (!emitSource && !compilerOptions.outFile) {
      var allFiles = filenames.join(", ");
      throw new TwoslashError("Could not find source file to show the emit for", "Cannot find the corresponding **source** file  " + emitFilename + " for completions via ^| returned no quickinfo from the compiler.", "Looked for: " + emitSourceFilename + " in the vfs - which contains: " + allFiles);
    }
    if (compilerOptions.outFile) {
      emitSource = filenames[0];
    }
    var output = ls.getEmitOutput(emitSource);
    var file = output.outputFiles.find(function(o) {
      return o.name === fsRoot + handbookOptions.showEmittedFile || o.name === handbookOptions.showEmittedFile;
    });
    if (!file) {
      var _allFiles = output.outputFiles.map(function(o) {
        return o.name;
      }).join(", ");
      throw new TwoslashError("Cannot find the output file in the Twoslash VFS", "Looking for " + handbookOptions.showEmittedFile + " in the Twoslash vfs after compiling", 'Looked for" ' + (fsRoot + handbookOptions.showEmittedFile) + " in the vfs - which contains " + _allFiles + ".");
    }
    code = file.text;
    extension = file.name.split(".").pop();
    highlights = [];
    partialQueries = [];
    staticQuickInfos = [];
  }
  var zippedCode = lzstring.compressToEncodedURIComponent(originalCode);
  var playgroundURL = "https://www.typescriptlang.org/play/#code/" + zippedCode;
  var cutString = "// ---cut---\n";
  if (code.includes(cutString)) {
    var cutIndex = code.indexOf(cutString) + cutString.length;
    var lineOffset = code.substr(0, cutIndex).split("\n").length - 1;
    code = code.split(cutString).pop();
    staticQuickInfos.forEach(function(info) {
      info.start -= cutIndex;
      info.line -= lineOffset;
    });
    staticQuickInfos = staticQuickInfos.filter(function(s) {
      return s.start > -1;
    });
    errors.forEach(function(err2) {
      if (err2.start) err2.start -= cutIndex;
      if (err2.line) err2.line -= lineOffset;
    });
    errors = errors.filter(function(e) {
      return e.start && e.start > -1;
    });
    highlights.forEach(function(highlight) {
      highlight.start -= cutIndex;
      highlight.line -= lineOffset;
    });
    highlights = highlights.filter(function(e) {
      return e.start > -1;
    });
    queries.forEach(function(q) {
      return q.line -= lineOffset;
    });
    queries = queries.filter(function(q) {
      return q.line > -1;
    });
    tags.forEach(function(q) {
      return q.line -= lineOffset;
    });
    tags = tags.filter(function(q) {
      return q.line > -1;
    });
  }
  var cutAfterString = "// ---cut-after---\n";
  if (code.includes(cutAfterString)) {
    var _cutIndex = code.indexOf(cutAfterString) + cutAfterString.length;
    var _lineOffset = code.substr(0, _cutIndex).split("\n").length - 1;
    code = code.split(cutAfterString).shift().trimEnd();
    staticQuickInfos = staticQuickInfos.filter(function(s) {
      return s.line < _lineOffset;
    });
    errors = errors.filter(function(e) {
      return e.line && e.line < _lineOffset;
    });
    highlights = highlights.filter(function(e) {
      return e.line < _lineOffset;
    });
    queries = queries.filter(function(q) {
      return q.line < _lineOffset;
    });
    tags = tags.filter(function(q) {
      return q.line < _lineOffset;
    });
  }
  return {
    code,
    extension,
    highlights,
    queries,
    staticQuickInfos,
    errors,
    playgroundURL,
    tags
  };
}
var splitTwoslashCodeInfoFiles = function splitTwoslashCodeInfoFiles2(code, defaultFileName, root) {
  var lines = code.split(/\r\n?|\n/g);
  var nameForFile = code.includes("@filename: " + defaultFileName) ? "global.ts" : defaultFileName;
  var currentFileContent = [];
  var fileMap = [];
  for (var _iterator5 = _createForOfIteratorHelperLoose(lines), _step5; !(_step5 = _iterator5()).done; ) {
    var line = _step5.value;
    if (line.includes("// @filename: ")) {
      fileMap.push([root + nameForFile, currentFileContent]);
      nameForFile = line.split("// @filename: ")[1].trim();
      currentFileContent = [];
    } else {
      currentFileContent.push(line);
    }
  }
  fileMap.push([root + nameForFile, currentFileContent]);
  var nameContent = fileMap.filter(function(n) {
    return n[1].length > 0 && (n[1].length > 1 || n[1][0] !== "");
  });
  return nameContent;
};

// ../../node_modules/.bun/remark-shiki-twoslash@3.1.3+1fb4c65d43e298b9/node_modules/remark-shiki-twoslash/dist/remark-shiki-twoslash.esm.js
var import_unist_util_visit = __toESM(require_unist_util_visit());

// ../../node_modules/.bun/fenceparser@1.1.1/node_modules/fenceparser/dist/fenceparser.esm.js
function _extends3() {
  _extends3 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends3.apply(this, arguments);
}
function _inheritsLoose2(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf2(subClass, superClass);
}
function _setPrototypeOf2(o, p) {
  _setPrototypeOf2 = Object.setPrototypeOf || function _setPrototypeOf3(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf2(o, p);
}
var isQuoted = function isQuoted2(s) {
  var first = s[0];
  var last = s[s.length - 1];
  return s.length > 1 && first === last && (first === '"' || last === "'");
};
var Iterator = (function() {
  function Iterator2(input) {
    this.input = input;
    this.start = 0;
    this.current = 0;
  }
  var _proto = Iterator2.prototype;
  _proto.error = function error(err) {
    throw new Error("Fenceparser: " + err + ".");
  };
  _proto.peek = function peek(n) {
    return this.input[this.current + (n != null ? n : 0)];
  };
  _proto.advance = function advance() {
    return this.input[this.current++];
  };
  _proto.isAtEnd = function isAtEnd() {
    return this.current >= this.input.length;
  };
  return Iterator2;
})();
var lex = function lex2(input) {
  return new Lexer(input).scan();
};
var KEYWORDS = {
  "true": true,
  "false": false
};
var isAlpha = function isAlpha2(s) {
  return /[a-zA-Z_$-]/.test(s);
};
var isNumeric = function isNumeric2(s) {
  return /[0-9]/.test(s);
};
var isAlphaNumeric = function isAlphaNumeric2(s) {
  return isAlpha(s) || isNumeric(s);
};
var Lexer = (function(_Iterator) {
  _inheritsLoose2(Lexer2, _Iterator);
  function Lexer2() {
    var _this;
    _this = _Iterator.apply(this, arguments) || this;
    _this.output = [];
    return _this;
  }
  var _proto = Lexer2.prototype;
  _proto.string = function string(quote) {
    while (this.peek() !== quote && !this.isAtEnd()) {
      this.advance();
    }
    if (this.isAtEnd()) {
      this.error("Unterminated string");
    }
    this.advance();
    this.output.push(this.input.substring(this.start, this.current));
  };
  _proto.number = function number() {
    while (isNumeric(this.peek()) && !this.isAtEnd()) {
      this.advance();
    }
    if (this.peek() === "-" && isNumeric(this.peek(1))) {
      this.advance();
      while (isNumeric(this.peek())) {
        this.advance();
      }
      this.output.push(this.input.substring(this.start, this.current));
      return;
    } else if (this.peek() === "." && isNumeric(this.peek(1))) {
      this.advance();
      while (isNumeric(this.peek())) {
        this.advance();
      }
    }
    this.output.push(parseFloat(this.input.substring(this.start, this.current)));
  };
  _proto.identifier = function identifier() {
    while (isAlphaNumeric(this.peek()) && !this.isAtEnd()) {
      this.advance();
    }
    var text = this.input.substring(this.start, this.current);
    if (Object.keys(KEYWORDS).includes(text)) {
      this.output.push(KEYWORDS[text]);
    } else {
      this.output.push(text);
    }
  };
  _proto.scan = function scan() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      var next = this.advance();
      switch (next) {
        case "{":
        case "}":
        case "=":
        case ",":
        case ":":
        case "[":
        case "]":
          this.output.push(next);
          break;
        case '"':
        case "'":
          this.string(next);
          break;
        case " ":
        case "\r":
        case "	":
        case "\n":
          break;
        default:
          if (isNumeric(next)) {
            this.number();
          } else if (isAlpha(next)) {
            this.identifier();
          } else {
            this.error("Unexpected character " + next);
          }
      }
    }
    return this.output;
  };
  return Lexer2;
})(Iterator);
var parse = function parse2(input) {
  return new Parser(input).parse();
};
var Parser = (function(_Iterator) {
  _inheritsLoose2(Parser2, _Iterator);
  function Parser2() {
    var _this;
    _this = _Iterator.apply(this, arguments) || this;
    _this.output = {};
    return _this;
  }
  var _proto = Parser2.prototype;
  _proto.object = function object() {
    var _this2 = this;
    var result = {};
    var parseValue = function parseValue2() {
      var identifier = _this2.advance();
      if (typeof identifier === "number") {
        identifier = identifier;
      } else if (typeof identifier === "string" && isQuoted(identifier)) {
        identifier = identifier.slice(1, -1);
      }
      identifier = identifier;
      if (_this2.peek() === ":") {
        _this2.advance();
        result[identifier] = _this2.value();
      } else {
        result[identifier] = true;
      }
    };
    this.advance();
    if (this.peek() !== "}") {
      parseValue();
      while (this.peek() === ",") {
        this.advance();
        if (this.peek() === "}") {
          this.error("Trailing comma");
        }
        parseValue();
      }
    }
    if (this.advance() !== "}") {
      this.error("Unterminated object");
    }
    return result;
  };
  _proto.array = function array() {
    var result = [];
    this.advance();
    if (this.peek() !== "]") {
      result.push(this.value());
      while (this.peek() === ",") {
        this.advance();
        if (this.peek() === "]") {
          this.error("Trailing comma");
        }
        result.push(this.value());
      }
    }
    if (this.advance() !== "]") {
      this.error("Unterminated array");
    }
    return result;
  };
  _proto.value = function value() {
    if (this.peek() === "{") {
      return this.object();
    } else if (this.peek() === "[") {
      return this.array();
    } else if (typeof this.peek() === "string" && isQuoted(this.peek())) {
      return this.advance().slice(1, -1);
    } else {
      return this.advance();
    }
  };
  _proto.parse = function parse4() {
    if (this.input.length < 1) {
      return null;
    }
    while (!this.isAtEnd()) {
      var peeked = this.peek();
      if (peeked === "{") {
        if (!this.output.highlight) {
          this.output.highlight = {};
        }
        this.output.highlight = _extends3({}, this.output.highlight, this.object());
      } else {
        var identifier = this.advance();
        if (this.peek() === "=") {
          this.advance();
          this.output[identifier] = this.value();
        } else {
          this.output[identifier] = true;
        }
      }
    }
    return this.output;
  };
  return Parser2;
})(Iterator);

// ../../node_modules/.bun/shiki@0.10.1/node_modules/shiki/dist/index.esm.js
var import_vscode_oniguruma = __toESM(require_main());
var import_vscode_textmate = __toESM(require_main2());
var languages = [
  {
    id: "abap",
    scopeName: "source.abap",
    path: "abap.tmLanguage.json",
    samplePath: "abap.sample"
  },
  {
    id: "actionscript-3",
    scopeName: "source.actionscript.3",
    path: "actionscript-3.tmLanguage.json",
    samplePath: "actionscript-3.sample"
  },
  {
    id: "ada",
    scopeName: "source.ada",
    path: "ada.tmLanguage.json",
    samplePath: "ada.sample"
  },
  {
    id: "apache",
    scopeName: "source.apacheconf",
    path: "apache.tmLanguage.json"
  },
  {
    id: "apex",
    scopeName: "source.apex",
    path: "apex.tmLanguage.json",
    samplePath: "apex.sample"
  },
  {
    id: "apl",
    scopeName: "source.apl",
    path: "apl.tmLanguage.json",
    embeddedLangs: ["html", "xml", "css", "javascript", "json"]
  },
  {
    id: "applescript",
    scopeName: "source.applescript",
    path: "applescript.tmLanguage.json",
    samplePath: "applescript.sample"
  },
  {
    id: "asm",
    scopeName: "source.asm.x86_64",
    path: "asm.tmLanguage.json",
    samplePath: "asm.sample"
  },
  {
    id: "astro",
    scopeName: "text.html.astro",
    path: "astro.tmLanguage.json",
    samplePath: "astro.sample",
    embeddedLangs: ["css", "javascript", "less", "sass", "scss", "stylus", "typescript", "tsx"]
  },
  {
    id: "awk",
    scopeName: "source.awk",
    path: "awk.tmLanguage.json",
    samplePath: "awk.sample"
  },
  {
    id: "ballerina",
    scopeName: "source.ballerina",
    path: "ballerina.tmLanguage.json",
    samplePath: "ballerina.sample"
  },
  {
    id: "bat",
    scopeName: "source.batchfile",
    path: "bat.tmLanguage.json",
    samplePath: "bat.sample",
    aliases: ["batch"]
  },
  {
    id: "berry",
    scopeName: "source.berry",
    path: "berry.tmLanguage.json",
    samplePath: "berry.sample",
    aliases: ["be"]
  },
  {
    id: "bibtex",
    scopeName: "text.bibtex",
    path: "bibtex.tmLanguage.json"
  },
  {
    id: "bicep",
    scopeName: "source.bicep",
    path: "bicep.tmLanguage.json",
    samplePath: "bicep.sample"
  },
  {
    id: "c",
    scopeName: "source.c",
    path: "c.tmLanguage.json",
    samplePath: "c.sample"
  },
  {
    id: "clojure",
    scopeName: "source.clojure",
    path: "clojure.tmLanguage.json",
    samplePath: "clojure.sample",
    aliases: ["clj"]
  },
  {
    id: "cobol",
    scopeName: "source.cobol",
    path: "cobol.tmLanguage.json",
    samplePath: "cobol.sample",
    embeddedLangs: ["sql", "html", "java"]
  },
  {
    id: "codeql",
    scopeName: "source.ql",
    path: "codeql.tmLanguage.json",
    samplePath: "codeql.sample",
    aliases: ["ql"]
  },
  {
    id: "coffee",
    scopeName: "source.coffee",
    path: "coffee.tmLanguage.json",
    samplePath: "coffee.sample",
    embeddedLangs: ["javascript"]
  },
  {
    id: "cpp",
    scopeName: "source.cpp",
    path: "cpp.tmLanguage.json",
    samplePath: "cpp.sample",
    embeddedLangs: ["sql"]
  },
  {
    id: "crystal",
    scopeName: "source.crystal",
    path: "crystal.tmLanguage.json",
    samplePath: "crystal.sample",
    embeddedLangs: ["html", "sql", "css", "c", "javascript", "shellscript"]
  },
  {
    id: "csharp",
    scopeName: "source.cs",
    path: "csharp.tmLanguage.json",
    samplePath: "csharp.sample",
    aliases: ["c#"]
  },
  {
    id: "css",
    scopeName: "source.css",
    path: "css.tmLanguage.json",
    samplePath: "css.sample"
  },
  {
    id: "cue",
    scopeName: "source.cue",
    path: "cue.tmLanguage.json",
    samplePath: "cue.sample"
  },
  {
    id: "d",
    scopeName: "source.d",
    path: "d.tmLanguage.json",
    samplePath: "d.sample"
  },
  {
    id: "dart",
    scopeName: "source.dart",
    path: "dart.tmLanguage.json",
    samplePath: "dart.sample"
  },
  {
    id: "diff",
    scopeName: "source.diff",
    path: "diff.tmLanguage.json",
    samplePath: "diff.sample"
  },
  {
    id: "docker",
    scopeName: "source.dockerfile",
    path: "docker.tmLanguage.json",
    samplePath: "docker.sample"
  },
  {
    id: "dream-maker",
    scopeName: "source.dm",
    path: "dream-maker.tmLanguage.json"
  },
  {
    id: "elixir",
    scopeName: "source.elixir",
    path: "elixir.tmLanguage.json",
    samplePath: "elixir.sample",
    embeddedLangs: ["html"]
  },
  {
    id: "elm",
    scopeName: "source.elm",
    path: "elm.tmLanguage.json",
    samplePath: "elm.sample"
  },
  {
    id: "erb",
    scopeName: "text.html.erb",
    path: "erb.tmLanguage.json",
    samplePath: "erb.sample",
    embeddedLangs: ["html", "ruby"]
  },
  {
    id: "erlang",
    scopeName: "source.erlang",
    path: "erlang.tmLanguage.json",
    samplePath: "erlang.sample"
  },
  {
    id: "fish",
    scopeName: "source.fish",
    path: "fish.tmLanguage.json",
    samplePath: "fish.sample"
  },
  {
    id: "fsharp",
    scopeName: "source.fsharp",
    path: "fsharp.tmLanguage.json",
    samplePath: "fsharp.sample",
    aliases: ["f#"],
    embeddedLangs: ["markdown"]
  },
  {
    id: "gherkin",
    scopeName: "text.gherkin.feature",
    path: "gherkin.tmLanguage.json"
  },
  {
    id: "git-commit",
    scopeName: "text.git-commit",
    path: "git-commit.tmLanguage.json",
    embeddedLangs: ["diff"]
  },
  {
    id: "git-rebase",
    scopeName: "text.git-rebase",
    path: "git-rebase.tmLanguage.json",
    embeddedLangs: ["shellscript"]
  },
  {
    id: "gnuplot",
    scopeName: "source.gnuplot",
    path: "gnuplot.tmLanguage.json"
  },
  {
    id: "go",
    scopeName: "source.go",
    path: "go.tmLanguage.json",
    samplePath: "go.sample"
  },
  {
    id: "graphql",
    scopeName: "source.graphql",
    path: "graphql.tmLanguage.json",
    embeddedLangs: ["javascript", "typescript", "jsx", "tsx"]
  },
  {
    id: "groovy",
    scopeName: "source.groovy",
    path: "groovy.tmLanguage.json"
  },
  {
    id: "hack",
    scopeName: "source.hack",
    path: "hack.tmLanguage.json",
    embeddedLangs: ["html", "sql"]
  },
  {
    id: "haml",
    scopeName: "text.haml",
    path: "haml.tmLanguage.json",
    embeddedLangs: ["ruby", "javascript", "sass", "coffee", "markdown", "css"]
  },
  {
    id: "handlebars",
    scopeName: "text.html.handlebars",
    path: "handlebars.tmLanguage.json",
    aliases: ["hbs"],
    embeddedLangs: ["html", "css", "javascript", "yaml"]
  },
  {
    id: "haskell",
    scopeName: "source.haskell",
    path: "haskell.tmLanguage.json"
  },
  {
    id: "hcl",
    scopeName: "source.hcl",
    path: "hcl.tmLanguage.json"
  },
  {
    id: "hlsl",
    scopeName: "source.hlsl",
    path: "hlsl.tmLanguage.json"
  },
  {
    id: "html",
    scopeName: "text.html.basic",
    path: "html.tmLanguage.json",
    samplePath: "html.sample",
    embeddedLangs: ["javascript", "css"]
  },
  {
    id: "ini",
    scopeName: "source.ini",
    path: "ini.tmLanguage.json"
  },
  {
    id: "java",
    scopeName: "source.java",
    path: "java.tmLanguage.json",
    samplePath: "java.sample"
  },
  {
    id: "javascript",
    scopeName: "source.js",
    path: "javascript.tmLanguage.json",
    samplePath: "javascript.sample",
    aliases: ["js"]
  },
  {
    id: "jinja-html",
    scopeName: "text.html.jinja",
    path: "jinja-html.tmLanguage.json",
    embeddedLangs: ["html"]
  },
  {
    id: "json",
    scopeName: "source.json",
    path: "json.tmLanguage.json"
  },
  {
    id: "jsonc",
    scopeName: "source.json.comments",
    path: "jsonc.tmLanguage.json"
  },
  {
    id: "jsonnet",
    scopeName: "source.jsonnet",
    path: "jsonnet.tmLanguage.json"
  },
  {
    id: "jssm",
    scopeName: "source.jssm",
    path: "jssm.tmLanguage.json",
    samplePath: "jssm.sample",
    aliases: ["fsl"]
  },
  {
    id: "jsx",
    scopeName: "source.js.jsx",
    path: "jsx.tmLanguage.json"
  },
  {
    id: "julia",
    scopeName: "source.julia",
    path: "julia.tmLanguage.json",
    embeddedLangs: ["cpp", "python", "javascript", "r", "sql"]
  },
  {
    id: "jupyter",
    scopeName: "source.jupyter",
    path: "jupyter.tmLanguage.json",
    embeddedLangs: ["json"]
  },
  {
    id: "kotlin",
    scopeName: "source.kotlin",
    path: "kotlin.tmLanguage.json"
  },
  {
    id: "latex",
    scopeName: "text.tex.latex",
    path: "latex.tmLanguage.json",
    embeddedLangs: ["tex", "css", "html", "java", "javascript", "typescript", "lua", "python", "julia", "ruby", "xml", "yaml", "cpp", "haskell", "scala", "gnuplot"]
  },
  {
    id: "less",
    scopeName: "source.css.less",
    path: "less.tmLanguage.json",
    embeddedLangs: ["css"]
  },
  {
    id: "lisp",
    scopeName: "source.lisp",
    path: "lisp.tmLanguage.json"
  },
  {
    id: "logo",
    scopeName: "source.logo",
    path: "logo.tmLanguage.json"
  },
  {
    id: "lua",
    scopeName: "source.lua",
    path: "lua.tmLanguage.json",
    embeddedLangs: ["c"]
  },
  {
    id: "make",
    scopeName: "source.makefile",
    path: "make.tmLanguage.json",
    aliases: ["makefile"]
  },
  {
    id: "markdown",
    scopeName: "text.html.markdown",
    path: "markdown.tmLanguage.json",
    aliases: ["md"],
    embeddedLangs: ["css", "html", "ini", "java", "lua", "make", "perl", "r", "ruby", "php", "sql", "vb", "xml", "xsl", "yaml", "bat", "clojure", "coffee", "c", "cpp", "diff", "docker", "git-commit", "git-rebase", "go", "groovy", "pug", "javascript", "json", "jsonc", "less", "objective-c", "swift", "scss", "raku", "powershell", "python", "rust", "scala", "shellscript", "typescript", "tsx", "csharp", "fsharp", "dart", "handlebars", "erlang", "elixir", "latex", "bibtex"]
  },
  {
    id: "marko",
    scopeName: "text.marko",
    path: "marko.tmLanguage.json",
    samplePath: "marko.sample",
    embeddedLangs: ["css", "less", "scss", "javascript"]
  },
  {
    id: "matlab",
    scopeName: "source.matlab",
    path: "matlab.tmLanguage.json"
  },
  {
    id: "mdx",
    scopeName: "text.html.markdown.jsx",
    path: "mdx.tmLanguage.json",
    embeddedLangs: ["jsx", "markdown"]
  },
  {
    id: "nginx",
    scopeName: "source.nginx",
    path: "nginx.tmLanguage.json",
    embeddedLangs: ["lua"]
  },
  {
    id: "nim",
    scopeName: "source.nim",
    path: "nim.tmLanguage.json",
    embeddedLangs: ["c", "html", "xml", "javascript", "css", "markdown"]
  },
  {
    id: "nix",
    scopeName: "source.nix",
    path: "nix.tmLanguage.json"
  },
  {
    id: "objective-c",
    scopeName: "source.objc",
    path: "objective-c.tmLanguage.json",
    aliases: ["objc"]
  },
  {
    id: "objective-cpp",
    scopeName: "source.objcpp",
    path: "objective-cpp.tmLanguage.json"
  },
  {
    id: "ocaml",
    scopeName: "source.ocaml",
    path: "ocaml.tmLanguage.json"
  },
  {
    id: "pascal",
    scopeName: "source.pascal",
    path: "pascal.tmLanguage.json"
  },
  {
    id: "perl",
    scopeName: "source.perl",
    path: "perl.tmLanguage.json",
    embeddedLangs: ["html", "xml", "css", "javascript", "sql"]
  },
  {
    id: "php",
    scopeName: "source.php",
    path: "php.tmLanguage.json",
    embeddedLangs: ["html", "xml", "sql", "javascript", "json", "css"]
  },
  {
    id: "plsql",
    scopeName: "source.plsql.oracle",
    path: "plsql.tmLanguage.json"
  },
  {
    id: "postcss",
    scopeName: "source.css.postcss",
    path: "postcss.tmLanguage.json"
  },
  {
    id: "powershell",
    scopeName: "source.powershell",
    path: "powershell.tmLanguage.json",
    aliases: ["ps", "ps1"]
  },
  {
    id: "prisma",
    scopeName: "source.prisma",
    path: "prisma.tmLanguage.json",
    samplePath: "prisma.sample"
  },
  {
    id: "prolog",
    scopeName: "source.prolog",
    path: "prolog.tmLanguage.json"
  },
  {
    id: "pug",
    scopeName: "text.pug",
    path: "pug.tmLanguage.json",
    aliases: ["jade"],
    embeddedLangs: ["javascript", "css", "sass", "stylus", "coffee", "html"]
  },
  {
    id: "puppet",
    scopeName: "source.puppet",
    path: "puppet.tmLanguage.json"
  },
  {
    id: "purescript",
    scopeName: "source.purescript",
    path: "purescript.tmLanguage.json"
  },
  {
    id: "python",
    scopeName: "source.python",
    path: "python.tmLanguage.json",
    samplePath: "python.sample",
    aliases: ["py"]
  },
  {
    id: "r",
    scopeName: "source.r",
    path: "r.tmLanguage.json"
  },
  {
    id: "raku",
    scopeName: "source.perl.6",
    path: "raku.tmLanguage.json",
    aliases: ["perl6"]
  },
  {
    id: "razor",
    scopeName: "text.aspnetcorerazor",
    path: "razor.tmLanguage.json",
    embeddedLangs: ["html", "csharp"]
  },
  {
    id: "rel",
    scopeName: "source.rel",
    path: "rel.tmLanguage.json",
    samplePath: "rel.sample"
  },
  {
    id: "riscv",
    scopeName: "source.riscv",
    path: "riscv.tmLanguage.json"
  },
  {
    id: "ruby",
    scopeName: "source.ruby",
    path: "ruby.tmLanguage.json",
    samplePath: "ruby.sample",
    aliases: ["rb"],
    embeddedLangs: ["html", "xml", "sql", "css", "c", "javascript", "shellscript", "lua"]
  },
  {
    id: "rust",
    scopeName: "source.rust",
    path: "rust.tmLanguage.json",
    aliases: ["rs"]
  },
  {
    id: "sas",
    scopeName: "source.sas",
    path: "sas.tmLanguage.json",
    embeddedLangs: ["sql"]
  },
  {
    id: "sass",
    scopeName: "source.sass",
    path: "sass.tmLanguage.json"
  },
  {
    id: "scala",
    scopeName: "source.scala",
    path: "scala.tmLanguage.json"
  },
  {
    id: "scheme",
    scopeName: "source.scheme",
    path: "scheme.tmLanguage.json"
  },
  {
    id: "scss",
    scopeName: "source.css.scss",
    path: "scss.tmLanguage.json",
    embeddedLangs: ["css"]
  },
  {
    id: "shaderlab",
    scopeName: "source.shaderlab",
    path: "shaderlab.tmLanguage.json",
    aliases: ["shader"],
    embeddedLangs: ["hlsl"]
  },
  {
    id: "shellscript",
    scopeName: "source.shell",
    path: "shellscript.tmLanguage.json",
    aliases: ["shell", "bash", "sh", "zsh"],
    embeddedLangs: ["ruby", "python", "applescript", "html", "markdown"]
  },
  {
    id: "smalltalk",
    scopeName: "source.smalltalk",
    path: "smalltalk.tmLanguage.json"
  },
  {
    id: "solidity",
    scopeName: "source.solidity",
    path: "solidity.tmLanguage.json"
  },
  {
    id: "sparql",
    scopeName: "source.sparql",
    path: "sparql.tmLanguage.json",
    samplePath: "sparql.sample",
    embeddedLangs: ["turtle"]
  },
  {
    id: "sql",
    scopeName: "source.sql",
    path: "sql.tmLanguage.json"
  },
  {
    id: "ssh-config",
    scopeName: "source.ssh-config",
    path: "ssh-config.tmLanguage.json"
  },
  {
    id: "stata",
    scopeName: "source.stata",
    path: "stata.tmLanguage.json",
    samplePath: "stata.sample",
    embeddedLangs: ["sql"]
  },
  {
    id: "stylus",
    scopeName: "source.stylus",
    path: "stylus.tmLanguage.json",
    aliases: ["styl"]
  },
  {
    id: "svelte",
    scopeName: "source.svelte",
    path: "svelte.tmLanguage.json",
    embeddedLangs: ["javascript", "typescript", "coffee", "stylus", "sass", "css", "scss", "less", "postcss", "pug", "markdown"]
  },
  {
    id: "swift",
    scopeName: "source.swift",
    path: "swift.tmLanguage.json"
  },
  {
    id: "system-verilog",
    scopeName: "source.systemverilog",
    path: "system-verilog.tmLanguage.json"
  },
  {
    id: "tasl",
    scopeName: "source.tasl",
    path: "tasl.tmLanguage.json",
    samplePath: "tasl.sample"
  },
  {
    id: "tcl",
    scopeName: "source.tcl",
    path: "tcl.tmLanguage.json"
  },
  {
    id: "tex",
    scopeName: "text.tex",
    path: "tex.tmLanguage.json",
    embeddedLangs: ["r"]
  },
  {
    id: "toml",
    scopeName: "source.toml",
    path: "toml.tmLanguage.json"
  },
  {
    id: "tsx",
    scopeName: "source.tsx",
    path: "tsx.tmLanguage.json",
    samplePath: "tsx.sample"
  },
  {
    id: "turtle",
    scopeName: "source.turtle",
    path: "turtle.tmLanguage.json",
    samplePath: "turtle.sample"
  },
  {
    id: "twig",
    scopeName: "text.html.twig",
    path: "twig.tmLanguage.json",
    embeddedLangs: ["css", "javascript", "php", "python", "ruby"]
  },
  {
    id: "typescript",
    scopeName: "source.ts",
    path: "typescript.tmLanguage.json",
    aliases: ["ts"]
  },
  {
    id: "vb",
    scopeName: "source.asp.vb.net",
    path: "vb.tmLanguage.json",
    aliases: ["cmd"]
  },
  {
    id: "verilog",
    scopeName: "source.verilog",
    path: "verilog.tmLanguage.json"
  },
  {
    id: "vhdl",
    scopeName: "source.vhdl",
    path: "vhdl.tmLanguage.json"
  },
  {
    id: "viml",
    scopeName: "source.viml",
    path: "viml.tmLanguage.json",
    aliases: ["vim", "vimscript"]
  },
  {
    id: "vue-html",
    scopeName: "text.html.vue-html",
    path: "vue-html.tmLanguage.json",
    embeddedLangs: ["vue", "javascript"]
  },
  {
    id: "vue",
    scopeName: "source.vue",
    path: "vue.tmLanguage.json",
    embeddedLangs: ["json", "markdown", "pug", "haml", "vue-html", "sass", "scss", "less", "stylus", "postcss", "css", "typescript", "coffee", "javascript"]
  },
  {
    id: "wasm",
    scopeName: "source.wat",
    path: "wasm.tmLanguage.json"
  },
  {
    id: "wenyan",
    scopeName: "source.wenyan",
    path: "wenyan.tmLanguage.json",
    aliases: ["文言"]
  },
  {
    id: "xml",
    scopeName: "text.xml",
    path: "xml.tmLanguage.json",
    embeddedLangs: ["java"]
  },
  {
    id: "xsl",
    scopeName: "text.xml.xsl",
    path: "xsl.tmLanguage.json",
    embeddedLangs: ["xml"]
  },
  {
    id: "yaml",
    scopeName: "source.yaml",
    path: "yaml.tmLanguage.json"
  },
  {
    id: "zenscript",
    scopeName: "source.zenscript",
    path: "zenscript.tmLanguage.json",
    samplePath: "zenscript.sample"
  }
];
var FontStyle;
(function(FontStyle2) {
  FontStyle2[FontStyle2["NotSet"] = -1] = "NotSet";
  FontStyle2[FontStyle2["None"] = 0] = "None";
  FontStyle2[FontStyle2["Italic"] = 1] = "Italic";
  FontStyle2[FontStyle2["Bold"] = 2] = "Bold";
  FontStyle2[FontStyle2["Underline"] = 4] = "Underline";
})(FontStyle || (FontStyle = {}));
var StackElementMetadata = class _StackElementMetadata {
  static toBinaryStr(metadata) {
    let r = metadata.toString(2);
    while (r.length < 32) {
      r = "0" + r;
    }
    return r;
  }
  static printMetadata(metadata) {
    let languageId = _StackElementMetadata.getLanguageId(metadata);
    let tokenType = _StackElementMetadata.getTokenType(metadata);
    let fontStyle = _StackElementMetadata.getFontStyle(metadata);
    let foreground = _StackElementMetadata.getForeground(metadata);
    let background = _StackElementMetadata.getBackground(metadata);
    console.log({
      languageId,
      tokenType,
      fontStyle,
      foreground,
      background
    });
  }
  static getLanguageId(metadata) {
    return (metadata & 255) >>> 0;
  }
  static getTokenType(metadata) {
    return (metadata & 1792) >>> 8;
  }
  static getFontStyle(metadata) {
    return (metadata & 14336) >>> 11;
  }
  static getForeground(metadata) {
    return (metadata & 8372224) >>> 14;
  }
  static getBackground(metadata) {
    return (metadata & 4286578688) >>> 23;
  }
  static set(metadata, languageId, tokenType, fontStyle, foreground, background) {
    let _languageId = _StackElementMetadata.getLanguageId(metadata);
    let _tokenType = _StackElementMetadata.getTokenType(metadata);
    let _fontStyle = _StackElementMetadata.getFontStyle(metadata);
    let _foreground = _StackElementMetadata.getForeground(metadata);
    let _background = _StackElementMetadata.getBackground(metadata);
    if (languageId !== 0) {
      _languageId = languageId;
    }
    if (tokenType !== 0) {
      _tokenType = tokenType === 8 ? 0 : tokenType;
    }
    if (fontStyle !== FontStyle.NotSet) {
      _fontStyle = fontStyle;
    }
    if (foreground !== 0) {
      _foreground = foreground;
    }
    if (background !== 0) {
      _background = background;
    }
    return (_languageId << 0 | _tokenType << 8 | _fontStyle << 11 | _foreground << 14 | _background << 23) >>> 0;
  }
};
function trimEndSlash(str) {
  if (str.endsWith("/") || str.endsWith("\\"))
    return str.slice(0, -1);
  return str;
}
function trimStartDot(str) {
  if (str.startsWith("./"))
    return str.slice(2);
  return str;
}
function dirname(str) {
  const parts = str.split(/[\/\\]/g);
  return parts[parts.length - 2];
}
function join(...parts) {
  return parts.map(trimEndSlash).map(trimStartDot).join("/");
}
function groupBy(elements, keyGetter) {
  const map = /* @__PURE__ */ new Map();
  for (const element of elements) {
    const key = keyGetter(element);
    if (map.has(key)) {
      const group = map.get(key);
      group.push(element);
    } else {
      map.set(key, [element]);
    }
  }
  return map;
}
function createScanner(text, ignoreTrivia) {
  if (ignoreTrivia === void 0) {
    ignoreTrivia = false;
  }
  var len = text.length;
  var pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count, exact) {
    var digits = 0;
    var value2 = 0;
    while (digits < count || !exact) {
      var ch = text.charCodeAt(pos);
      if (ch >= 48 && ch <= 57) {
        value2 = value2 * 16 + ch - 48;
      } else if (ch >= 65 && ch <= 70) {
        value2 = value2 * 16 + ch - 65 + 10;
      } else if (ch >= 97 && ch <= 102) {
        value2 = value2 * 16 + ch - 97 + 10;
      } else {
        break;
      }
      pos++;
      digits++;
    }
    if (digits < count) {
      value2 = -1;
    }
    return value2;
  }
  function setPosition(newPosition) {
    pos = newPosition;
    value = "";
    tokenOffset = 0;
    token = 16;
    scanError = 0;
  }
  function scanNumber() {
    var start = pos;
    if (text.charCodeAt(pos) === 48) {
      pos++;
    } else {
      pos++;
      while (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
      }
    }
    if (pos < text.length && text.charCodeAt(pos) === 46) {
      pos++;
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
      } else {
        scanError = 3;
        return text.substring(start, pos);
      }
    }
    var end = pos;
    if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
      pos++;
      if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
        pos++;
      }
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
        end = pos;
      } else {
        scanError = 3;
      }
    }
    return text.substring(start, end);
  }
  function scanString() {
    var result = "", start = pos;
    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        scanError = 2;
        break;
      }
      var ch = text.charCodeAt(pos);
      if (ch === 34) {
        result += text.substring(start, pos);
        pos++;
        break;
      }
      if (ch === 92) {
        result += text.substring(start, pos);
        pos++;
        if (pos >= len) {
          scanError = 2;
          break;
        }
        var ch2 = text.charCodeAt(pos++);
        switch (ch2) {
          case 34:
            result += '"';
            break;
          case 92:
            result += "\\";
            break;
          case 47:
            result += "/";
            break;
          case 98:
            result += "\b";
            break;
          case 102:
            result += "\f";
            break;
          case 110:
            result += "\n";
            break;
          case 114:
            result += "\r";
            break;
          case 116:
            result += "	";
            break;
          case 117:
            var ch3 = scanHexDigits(4, true);
            if (ch3 >= 0) {
              result += String.fromCharCode(ch3);
            } else {
              scanError = 4;
            }
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31) {
        if (isLineBreak(ch)) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        } else {
          scanError = 6;
        }
      }
      pos++;
    }
    return result;
  }
  function scanNext() {
    value = "";
    scanError = 0;
    tokenOffset = pos;
    lineStartOffset = lineNumber;
    prevTokenLineStartOffset = tokenLineStartOffset;
    if (pos >= len) {
      tokenOffset = len;
      return token = 17;
    }
    var code = text.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do {
        pos++;
        value += String.fromCharCode(code);
        code = text.charCodeAt(pos);
      } while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      pos++;
      value += String.fromCharCode(code);
      if (code === 13 && text.charCodeAt(pos) === 10) {
        pos++;
        value += "\n";
      }
      lineNumber++;
      tokenLineStartOffset = pos;
      return token = 14;
    }
    switch (code) {
      // tokens: []{}:,
      case 123:
        pos++;
        return token = 1;
      case 125:
        pos++;
        return token = 2;
      case 91:
        pos++;
        return token = 3;
      case 93:
        pos++;
        return token = 4;
      case 58:
        pos++;
        return token = 6;
      case 44:
        pos++;
        return token = 5;
      // strings
      case 34:
        pos++;
        value = scanString();
        return token = 10;
      // comments
      case 47:
        var start = pos - 1;
        if (text.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text.charCodeAt(pos))) {
              break;
            }
            pos++;
          }
          value = text.substring(start, pos);
          return token = 12;
        }
        if (text.charCodeAt(pos + 1) === 42) {
          pos += 2;
          var safeLength = len - 1;
          var commentClosed = false;
          while (pos < safeLength) {
            var ch = text.charCodeAt(pos);
            if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
              pos += 2;
              commentClosed = true;
              break;
            }
            pos++;
            if (isLineBreak(ch)) {
              if (ch === 13 && text.charCodeAt(pos) === 10) {
                pos++;
              }
              lineNumber++;
              tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed) {
            pos++;
            scanError = 1;
          }
          value = text.substring(start, pos);
          return token = 13;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
      // numbers
      case 45:
        value += String.fromCharCode(code);
        pos++;
        if (pos === len || !isDigit(text.charCodeAt(pos))) {
          return token = 16;
        }
      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        value += scanNumber();
        return token = 11;
      // literals and unknown symbols
      default:
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text.charCodeAt(pos);
        }
        if (tokenOffset !== pos) {
          value = text.substring(tokenOffset, pos);
          switch (value) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
    }
  }
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  function scanNextNonTrivia() {
    var result;
    do {
      result = scanNext();
    } while (result >= 12 && result <= 15);
    return result;
  }
  return {
    setPosition,
    getPosition: function() {
      return pos;
    },
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: function() {
      return token;
    },
    getTokenValue: function() {
      return value;
    },
    getTokenOffset: function() {
      return tokenOffset;
    },
    getTokenLength: function() {
      return pos - tokenOffset;
    },
    getTokenStartLine: function() {
      return lineStartOffset;
    },
    getTokenStartCharacter: function() {
      return tokenOffset - prevTokenLineStartOffset;
    },
    getTokenError: function() {
      return scanError;
    }
  };
}
function isWhiteSpace(ch) {
  return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch === 5760 || ch >= 8192 && ch <= 8203 || ch === 8239 || ch === 8287 || ch === 12288 || ch === 65279;
}
function isLineBreak(ch) {
  return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
}
function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}
var ParseOptions;
(function(ParseOptions2) {
  ParseOptions2.DEFAULT = {
    allowTrailingComma: false
  };
})(ParseOptions || (ParseOptions = {}));
function parse$1(text, errors, options) {
  if (errors === void 0) {
    errors = [];
  }
  if (options === void 0) {
    options = ParseOptions.DEFAULT;
  }
  var currentProperty = null;
  var currentParent = [];
  var previousParents = [];
  function onValue(value) {
    if (Array.isArray(currentParent)) {
      currentParent.push(value);
    } else if (currentProperty !== null) {
      currentParent[currentProperty] = value;
    }
  }
  var visitor = {
    onObjectBegin: function() {
      var object = {};
      onValue(object);
      previousParents.push(currentParent);
      currentParent = object;
      currentProperty = null;
    },
    onObjectProperty: function(name) {
      currentProperty = name;
    },
    onObjectEnd: function() {
      currentParent = previousParents.pop();
    },
    onArrayBegin: function() {
      var array = [];
      onValue(array);
      previousParents.push(currentParent);
      currentParent = array;
      currentProperty = null;
    },
    onArrayEnd: function() {
      currentParent = previousParents.pop();
    },
    onLiteralValue: onValue,
    onError: function(error, offset, length) {
      errors.push({ error, offset, length });
    }
  };
  visit(text, visitor, options);
  return currentParent[0];
}
function visit(text, visitor, options) {
  if (options === void 0) {
    options = ParseOptions.DEFAULT;
  }
  var _scanner = createScanner(text, false);
  function toNoArgVisit(visitFunction) {
    return visitFunction ? function() {
      return visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
    } : function() {
      return true;
    };
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? function(arg) {
      return visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
    } : function() {
      return true;
    };
  }
  var onObjectBegin = toNoArgVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisit(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisit(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisit(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
  var disallowComments = options && options.disallowComments;
  var allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (true) {
      var token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(
            14
            /* InvalidUnicode */
          );
          break;
        case 5:
          handleError(
            15
            /* InvalidEscapeCharacter */
          );
          break;
        case 3:
          handleError(
            13
            /* UnexpectedEndOfNumber */
          );
          break;
        case 1:
          if (!disallowComments) {
            handleError(
              11
              /* UnexpectedEndOfComment */
            );
          }
          break;
        case 2:
          handleError(
            12
            /* UnexpectedEndOfString */
          );
          break;
        case 6:
          handleError(
            16
            /* InvalidCharacter */
          );
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(
              10
              /* InvalidCommentToken */
            );
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(
            1
            /* InvalidSymbol */
          );
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error, skipUntilAfter, skipUntil) {
    if (skipUntilAfter === void 0) {
      skipUntilAfter = [];
    }
    if (skipUntil === void 0) {
      skipUntil = [];
    }
    onError(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      var token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    var value = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value);
    } else {
      onObjectProperty(value);
    }
    scanNext();
    return true;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        var tokenValue = _scanner.getTokenValue();
        var value = Number(tokenValue);
        if (isNaN(value)) {
          handleError(
            2
            /* InvalidNumberFormat */
          );
          value = 0;
        }
        onLiteralValue(value);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [
        2,
        5
        /* CommaToken */
      ]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [
          2,
          5
          /* CommaToken */
        ]);
      }
    } else {
      handleError(5, [], [
        2,
        5
        /* CommaToken */
      ]);
    }
    return true;
  }
  function parseObject() {
    onObjectBegin();
    scanNext();
    var needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [
          2,
          5
          /* CommaToken */
        ]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [
        2
        /* CloseBraceToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseArray() {
    onArrayBegin();
    scanNext();
    var needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseValue()) {
        handleError(4, [], [
          4,
          5
          /* CommaToken */
        ]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (_scanner.getToken() !== 4) {
      handleError(8, [
        4
        /* CloseBracketToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}
var parse3 = parse$1;
var isWebWorker = typeof self !== "undefined" && typeof self.WorkerGlobalScope !== "undefined";
var isBrowser = isWebWorker || typeof window !== "undefined" && typeof window.document !== "undefined" && typeof fetch !== "undefined";
var CDN_ROOT = "";
var WASM = "";
var _onigurumaPromise = null;
async function getOniguruma() {
  if (!_onigurumaPromise) {
    let loader;
    if (isBrowser) {
      if (typeof WASM === "string") {
        loader = (0, import_vscode_oniguruma.loadWASM)({
          data: await fetch(_resolvePath("dist/onig.wasm")).then((r) => r.arrayBuffer())
        });
      } else {
        loader = (0, import_vscode_oniguruma.loadWASM)(WASM);
      }
    } else {
      const path = require_path();
      const wasmPath = path.join(__require.resolve("vscode-oniguruma"), "../onig.wasm");
      const fs = require_fs();
      const wasmBin = fs.readFileSync(wasmPath).buffer;
      loader = (0, import_vscode_oniguruma.loadWASM)(wasmBin);
    }
    _onigurumaPromise = loader.then(() => {
      return {
        createOnigScanner(patterns) {
          return (0, import_vscode_oniguruma.createOnigScanner)(patterns);
        },
        createOnigString(s) {
          return (0, import_vscode_oniguruma.createOnigString)(s);
        }
      };
    });
  }
  return _onigurumaPromise;
}
function _resolvePath(filepath) {
  if (isBrowser) {
    if (!CDN_ROOT) {
      console.warn("[Shiki] no CDN provider found, use `setCDN()` to specify the CDN for loading the resources before calling `getHighlighter()`");
    }
    return `${CDN_ROOT}${filepath}`;
  } else {
    const path = require_path();
    if (path.isAbsolute(filepath)) {
      return filepath;
    } else {
      return path.resolve(__dirname, "..", filepath);
    }
  }
}
async function _fetchAssets(filepath) {
  const path = _resolvePath(filepath);
  if (isBrowser) {
    return await fetch(path).then((r) => r.text());
  } else {
    const fs = require_fs();
    return await fs.promises.readFile(path, "utf-8");
  }
}
async function _fetchJSONAssets(filepath) {
  const errors = [];
  const rawTheme = parse3(await _fetchAssets(filepath), errors, {
    allowTrailingComma: true
  });
  if (errors.length) {
    throw errors[0];
  }
  return rawTheme;
}
async function fetchTheme(themePath) {
  let theme = await _fetchJSONAssets(themePath);
  const shikiTheme = toShikiTheme(theme);
  if (shikiTheme.include) {
    const includedTheme = await fetchTheme(join(dirname(themePath), shikiTheme.include));
    if (includedTheme.settings) {
      shikiTheme.settings = includedTheme.settings.concat(shikiTheme.settings);
    }
    if (includedTheme.bg && !shikiTheme.bg) {
      shikiTheme.bg = includedTheme.bg;
    }
    if (includedTheme.colors) {
      shikiTheme.colors = Object.assign(Object.assign({}, includedTheme.colors), shikiTheme.colors);
    }
    delete shikiTheme.include;
  }
  return shikiTheme;
}
async function fetchGrammar(filepath) {
  return await _fetchJSONAssets(filepath);
}
function repairTheme(theme) {
  if (!theme.settings)
    theme.settings = [];
  if (theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope) {
    return;
  }
  theme.settings.unshift({
    settings: {
      foreground: theme.fg,
      background: theme.bg
    }
  });
}
function toShikiTheme(rawTheme) {
  const type = rawTheme.type || "dark";
  const shikiTheme = Object.assign(Object.assign({ name: rawTheme.name, type }, rawTheme), getThemeDefaultColors(rawTheme));
  if (rawTheme.include) {
    shikiTheme.include = rawTheme.include;
  }
  if (rawTheme.tokenColors) {
    shikiTheme.settings = rawTheme.tokenColors;
    delete shikiTheme.tokenColors;
  }
  repairTheme(shikiTheme);
  return shikiTheme;
}
var VSCODE_FALLBACK_EDITOR_FG = { light: "#333333", dark: "#bbbbbb" };
var VSCODE_FALLBACK_EDITOR_BG = { light: "#fffffe", dark: "#1e1e1e" };
function getThemeDefaultColors(theme) {
  var _a, _b, _c, _d, _e, _f;
  let fg, bg;
  let settings = theme.settings ? theme.settings : theme.tokenColors;
  const globalSetting = settings ? settings.find((s) => {
    return !s.name && !s.scope;
  }) : void 0;
  if ((_a = globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) === null || _a === void 0 ? void 0 : _a.foreground) {
    fg = globalSetting.settings.foreground;
  }
  if ((_b = globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) === null || _b === void 0 ? void 0 : _b.background) {
    bg = globalSetting.settings.background;
  }
  if (!fg && ((_d = (_c = theme) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d["editor.foreground"])) {
    fg = theme.colors["editor.foreground"];
  }
  if (!bg && ((_f = (_e = theme) === null || _e === void 0 ? void 0 : _e.colors) === null || _f === void 0 ? void 0 : _f["editor.background"])) {
    bg = theme.colors["editor.background"];
  }
  if (!fg) {
    fg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark;
  }
  if (!bg) {
    bg = theme.type === "light" ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark;
  }
  return {
    fg,
    bg
  };
}
var Resolver = class {
  constructor(onigLibPromise, onigLibName) {
    this.languagesPath = "languages/";
    this.languageMap = {};
    this.scopeToLangMap = {};
    this._onigLibPromise = onigLibPromise;
    this._onigLibName = onigLibName;
  }
  get onigLib() {
    return this._onigLibPromise;
  }
  getOnigLibName() {
    return this._onigLibName;
  }
  getLangRegistration(langIdOrAlias) {
    return this.languageMap[langIdOrAlias];
  }
  async loadGrammar(scopeName) {
    const lang = this.scopeToLangMap[scopeName];
    if (!lang) {
      return null;
    }
    if (lang.grammar) {
      return lang.grammar;
    }
    const g = await fetchGrammar(languages.includes(lang) ? `${this.languagesPath}${lang.path}` : lang.path);
    lang.grammar = g;
    return g;
  }
  addLanguage(l) {
    this.languageMap[l.id] = l;
    if (l.aliases) {
      l.aliases.forEach((a) => {
        this.languageMap[a] = l;
      });
    }
    this.scopeToLangMap[l.scopeName] = l;
  }
};
function tokenizeWithTheme(theme, colorMap, fileContents, grammar, options) {
  let lines = fileContents.split(/\r\n|\r|\n/);
  let ruleStack = import_vscode_textmate.INITIAL;
  let actual = [];
  let final = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    let line = lines[i];
    if (line === "") {
      actual = [];
      final.push([]);
      continue;
    }
    let resultWithScopes;
    let tokensWithScopes;
    let tokensWithScopesIndex;
    if (options.includeExplanation) {
      resultWithScopes = grammar.tokenizeLine(line, ruleStack);
      tokensWithScopes = resultWithScopes.tokens;
      tokensWithScopesIndex = 0;
    }
    let result = grammar.tokenizeLine2(line, ruleStack);
    let tokensLength = result.tokens.length / 2;
    for (let j = 0; j < tokensLength; j++) {
      let startIndex = result.tokens[2 * j];
      let nextStartIndex = j + 1 < tokensLength ? result.tokens[2 * j + 2] : line.length;
      if (startIndex === nextStartIndex) {
        continue;
      }
      let metadata = result.tokens[2 * j + 1];
      let foreground = StackElementMetadata.getForeground(metadata);
      let foregroundColor = colorMap[foreground];
      let fontStyle = StackElementMetadata.getFontStyle(metadata);
      let explanation = [];
      if (options.includeExplanation) {
        let offset = 0;
        while (startIndex + offset < nextStartIndex) {
          let tokenWithScopes = tokensWithScopes[tokensWithScopesIndex];
          let tokenWithScopesText = line.substring(tokenWithScopes.startIndex, tokenWithScopes.endIndex);
          offset += tokenWithScopesText.length;
          explanation.push({
            content: tokenWithScopesText,
            scopes: explainThemeScopes(theme, tokenWithScopes.scopes)
          });
          tokensWithScopesIndex++;
        }
      }
      actual.push({
        content: line.substring(startIndex, nextStartIndex),
        color: foregroundColor,
        fontStyle,
        explanation
      });
    }
    final.push(actual);
    actual = [];
    ruleStack = result.ruleStack;
  }
  return final;
}
function explainThemeScopes(theme, scopes) {
  let result = [];
  for (let i = 0, len = scopes.length; i < len; i++) {
    let parentScopes = scopes.slice(0, i);
    let scope = scopes[i];
    result[i] = {
      scopeName: scope,
      themeMatches: explainThemeScope(theme, scope, parentScopes)
    };
  }
  return result;
}
function matchesOne(selector, scope) {
  let selectorPrefix = selector + ".";
  if (selector === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) {
    return true;
  }
  return false;
}
function matches(selector, selectorParentScopes, scope, parentScopes) {
  if (!matchesOne(selector, scope)) {
    return false;
  }
  let selectorParentIndex = selectorParentScopes.length - 1;
  let parentIndex = parentScopes.length - 1;
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) {
      selectorParentIndex--;
    }
    parentIndex--;
  }
  if (selectorParentIndex === -1) {
    return true;
  }
  return false;
}
function explainThemeScope(theme, scope, parentScopes) {
  let result = [], resultLen = 0;
  for (let i = 0, len = theme.settings.length; i < len; i++) {
    let setting = theme.settings[i];
    let selectors;
    if (typeof setting.scope === "string") {
      selectors = setting.scope.split(/,/).map((scope2) => scope2.trim());
    } else if (Array.isArray(setting.scope)) {
      selectors = setting.scope;
    } else {
      continue;
    }
    for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
      let rawSelector = selectors[j];
      let rawSelectorPieces = rawSelector.split(/ /);
      let selector = rawSelectorPieces[rawSelectorPieces.length - 1];
      let selectorParentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1);
      if (matches(selector, selectorParentScopes, scope, parentScopes)) {
        result[resultLen++] = setting;
        j = lenJ;
      }
    }
  }
  return result;
}
function renderToHtml(lines, options = {}) {
  var _a;
  const bg = options.bg || "#fff";
  const optionsByLineNumber = groupBy((_a = options.lineOptions) !== null && _a !== void 0 ? _a : [], (option) => option.line);
  let html = "";
  html += `<pre class="shiki" style="background-color: ${bg}">`;
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`;
  }
  html += `<code>`;
  lines.forEach((l, lineIndex) => {
    var _a2;
    const lineNumber = lineIndex + 1;
    const lineOptions = (_a2 = optionsByLineNumber.get(lineNumber)) !== null && _a2 !== void 0 ? _a2 : [];
    const lineClasses = getLineClasses(lineOptions).join(" ");
    html += `<span class="${lineClasses}">`;
    l.forEach((token) => {
      const cssDeclarations = [`color: ${token.color || options.fg}`];
      if (token.fontStyle & FontStyle.Italic) {
        cssDeclarations.push("font-style: italic");
      }
      if (token.fontStyle & FontStyle.Bold) {
        cssDeclarations.push("font-weight: bold");
      }
      if (token.fontStyle & FontStyle.Underline) {
        cssDeclarations.push("text-decoration: underline");
      }
      html += `<span style="${cssDeclarations.join("; ")}">${escapeHtml(token.content)}</span>`;
    });
    html += `</span>
`;
  });
  html = html.replace(/\n*$/, "");
  html += `</code></pre>`;
  return html;
}
var htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function escapeHtml(html) {
  return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}
function getLineClasses(lineOptions) {
  var _a;
  const lineClasses = /* @__PURE__ */ new Set(["line"]);
  for (const lineOption of lineOptions) {
    for (const lineClass of (_a = lineOption.classes) !== null && _a !== void 0 ? _a : []) {
      lineClasses.add(lineClass);
    }
  }
  return Array.from(lineClasses);
}
var Registry = class extends import_vscode_textmate.Registry {
  constructor(_resolver) {
    super(_resolver);
    this._resolver = _resolver;
    this.themesPath = "themes/";
    this._resolvedThemes = {};
    this._resolvedGrammars = {};
  }
  getTheme(theme) {
    if (typeof theme === "string") {
      return this._resolvedThemes[theme];
    } else {
      return theme;
    }
  }
  async loadTheme(theme) {
    if (typeof theme === "string") {
      if (!this._resolvedThemes[theme]) {
        this._resolvedThemes[theme] = await fetchTheme(`${this.themesPath}${theme}.json`);
      }
      return this._resolvedThemes[theme];
    } else {
      theme = toShikiTheme(theme);
      if (theme.name) {
        this._resolvedThemes[theme.name] = theme;
      }
      return theme;
    }
  }
  async loadThemes(themes) {
    return await Promise.all(themes.map((theme) => this.loadTheme(theme)));
  }
  getLoadedThemes() {
    return Object.keys(this._resolvedThemes);
  }
  getGrammar(name) {
    return this._resolvedGrammars[name];
  }
  async loadLanguage(lang) {
    const g = await this.loadGrammar(lang.scopeName);
    this._resolvedGrammars[lang.id] = g;
    if (lang.aliases) {
      lang.aliases.forEach((la) => {
        this._resolvedGrammars[la] = g;
      });
    }
  }
  async loadLanguages(langs) {
    for (const lang of langs) {
      this._resolver.addLanguage(lang);
    }
    for (const lang of langs) {
      await this.loadLanguage(lang);
    }
  }
  getLoadedLanguages() {
    return Object.keys(this._resolvedGrammars);
  }
};
function resolveLang(lang) {
  return typeof lang === "string" ? languages.find((l) => {
    var _a;
    return l.id === lang || ((_a = l.aliases) === null || _a === void 0 ? void 0 : _a.includes(lang));
  }) : lang;
}
function resolveOptions(options) {
  var _a;
  let _languages = languages;
  let _themes = options.themes || [];
  if ((_a = options.langs) === null || _a === void 0 ? void 0 : _a.length) {
    _languages = options.langs.map(resolveLang);
  }
  if (options.theme) {
    _themes.unshift(options.theme);
  }
  if (!_themes.length) {
    _themes = ["nord"];
  }
  return { _languages, _themes };
}
async function getHighlighter(options) {
  var _a, _b;
  const { _languages, _themes } = resolveOptions(options);
  const _resolver = new Resolver(getOniguruma(), "vscode-oniguruma");
  const _registry = new Registry(_resolver);
  if ((_a = options.paths) === null || _a === void 0 ? void 0 : _a.themes) {
    _registry.themesPath = options.paths.themes;
  }
  if ((_b = options.paths) === null || _b === void 0 ? void 0 : _b.languages) {
    _resolver.languagesPath = options.paths.languages;
  }
  const themes = await _registry.loadThemes(_themes);
  const _defaultTheme = themes[0];
  let _currentTheme;
  await _registry.loadLanguages(_languages);
  const COLOR_REPLACEMENTS = {
    "#000001": "var(--shiki-color-text)",
    "#000002": "var(--shiki-color-background)",
    "#000004": "var(--shiki-token-constant)",
    "#000005": "var(--shiki-token-string)",
    "#000006": "var(--shiki-token-comment)",
    "#000007": "var(--shiki-token-keyword)",
    "#000008": "var(--shiki-token-parameter)",
    "#000009": "var(--shiki-token-function)",
    "#000010": "var(--shiki-token-string-expression)",
    "#000011": "var(--shiki-token-punctuation)",
    "#000012": "var(--shiki-token-link)"
  };
  function fixCssVariablesTheme(theme, colorMap) {
    theme.bg = COLOR_REPLACEMENTS[theme.bg] || theme.bg;
    theme.fg = COLOR_REPLACEMENTS[theme.fg] || theme.fg;
    colorMap.forEach((val, i) => {
      colorMap[i] = COLOR_REPLACEMENTS[val] || val;
    });
  }
  function getTheme(theme) {
    const _theme = theme ? _registry.getTheme(theme) : _defaultTheme;
    if (!_theme) {
      throw Error(`No theme registration for ${theme}`);
    }
    if (!_currentTheme || _currentTheme.name !== _theme.name) {
      _registry.setTheme(_theme);
      _currentTheme = _theme;
    }
    const _colorMap = _registry.getColorMap();
    if (_theme.name === "css-variables") {
      fixCssVariablesTheme(_theme, _colorMap);
    }
    return { _theme, _colorMap };
  }
  function getGrammar(lang) {
    const _grammar = _registry.getGrammar(lang);
    if (!_grammar) {
      throw Error(`No language registration for ${lang}`);
    }
    return { _grammar };
  }
  function codeToThemedTokens(code, lang = "text", theme, options2 = { includeExplanation: true }) {
    if (isPlaintext(lang)) {
      const lines = code.split(/\r\n|\r|\n/);
      return [...lines.map((line) => [{ content: line }])];
    }
    const { _grammar } = getGrammar(lang);
    const { _theme, _colorMap } = getTheme(theme);
    return tokenizeWithTheme(_theme, _colorMap, code, _grammar, options2);
  }
  function codeToHtml(code, arg1 = "text", arg2) {
    let options2;
    if (typeof arg1 === "object") {
      options2 = arg1;
    } else {
      options2 = {
        lang: arg1,
        theme: arg2
      };
    }
    const tokens = codeToThemedTokens(code, options2.lang, options2.theme, {
      includeExplanation: false
    });
    const { _theme } = getTheme(options2.theme);
    return renderToHtml(tokens, {
      fg: _theme.fg,
      bg: _theme.bg,
      lineOptions: options2 === null || options2 === void 0 ? void 0 : options2.lineOptions
    });
  }
  async function loadTheme(theme) {
    await _registry.loadTheme(theme);
  }
  async function loadLanguage(lang) {
    const _lang = resolveLang(lang);
    _resolver.addLanguage(_lang);
    await _registry.loadLanguage(_lang);
  }
  function getLoadedThemes() {
    return _registry.getLoadedThemes();
  }
  function getLoadedLanguages() {
    return _registry.getLoadedLanguages();
  }
  function getBackgroundColor(theme) {
    const { _theme } = getTheme(theme);
    return _theme.bg;
  }
  function getForegroundColor(theme) {
    const { _theme } = getTheme(theme);
    return _theme.fg;
  }
  return {
    codeToThemedTokens,
    codeToHtml,
    getTheme: (theme) => {
      return getTheme(theme)._theme;
    },
    loadTheme,
    loadLanguage,
    getBackgroundColor,
    getForegroundColor,
    getLoadedThemes,
    getLoadedLanguages
  };
}
function isPlaintext(lang) {
  return !lang || ["plaintext", "txt", "text"].includes(lang);
}

// ../../node_modules/.bun/shiki-twoslash@3.1.2+1fb4c65d43e298b9/node_modules/shiki-twoslash/dist/shiki-twoslash.esm.js
function _extends4() {
  _extends4 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends4.apply(this, arguments);
}
var htmlForTags = function htmlForTags2(tags) {
  var html = "";
  tags.forEach(function(t) {
    if (t.name === "annotate" && t.annotation) {
      var meta = t.annotation.split(" - ");
      var text = meta.pop();
      var info = (meta[0] || "").trim();
      var flipped = info.includes("right");
      var settings = {
        flipped,
        arrowRot: flipped ? "90deg 20px 20px" : "90deg 20px 20px",
        textDegree: "0deg",
        top: t.line + "em"
      };
      if (info.includes("{")) {
        var theInfo = "{" + info.split("{")[1];
        try {
          var specificSettings = JSON.parse(theInfo);
          settings = _extends4({}, settings, specificSettings);
        } catch (error) {
          throw new TwoslashError("Could not parse annotation", "The annotation " + JSON.stringify(t) + " could convert '" + theInfo + "' into JSON", "Look at " + error.message + ".");
        }
      }
      var arrowSVG = arrow(settings);
      html += "\n<div class='twoslash-annotation " + (flipped ? "right" : "left") + `' style="top: ` + settings.top + '">\n  ' + arrowSVG + `
  <p class='twoslash-annotation-text' style="transform: rotate(` + settings.textDegree + ')">' + text + "</p>\n</div>";
    }
  });
  return html;
};
var arrow = function arrow2(style) {
  var leftInner = "M27 39C26.5 32.7511 21.9 17.5173 7.5 6.57333M16.5 4.04L0.999999 0.999998C3.16667 4.88444 7.5 13.16 7.5 15.1867";
  var rightInner = "M1 39C1.5 32.7511 6.1 17.5173 20.5 6.57333M11.5 4.04L27 0.999998C24.8333 4.88444 20.5 13.16 20.5 15.1867";
  var inner = style.flipped ? leftInner : rightInner;
  var rot = style.arrowRot.split(" ");
  return "<svg style='transform: translateX(" + rot[1] + ") translateY(" + rot[2] + ") rotate(" + rot[0] + `);' width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="` + inner + '" stroke="black" />\n</svg>';
};
function createHighlightedString(ranges, text, targetedWord) {
  if (targetedWord === void 0) {
    targetedWord = "";
  }
  var tag = function tag2(x) {
    return "⇍" + x + "⇏";
  };
  var makeTagFromRange = function makeTagFromRange2(r, close) {
    switch (r.classes) {
      case "lsp":
        var lsp = htmlAttrReplacer(r.lsp || "");
        var underLineTargetedWord = r.lsp === targetedWord ? "style=⇯border-bottom: solid 2px lightgrey;⇯" : "";
        return close ? tag("/data-lsp") : tag("data-lsp lsp=¿" + lsp + "¿ " + underLineTargetedWord);
      case "query":
        return tag((close ? "/" : "") + "data-highlight");
      // handle both unknown and err variant as error-tag
      // case "err": is not required, just to be useful for others
      case "err":
      default:
        return tag((close ? "/" : "") + "data-err");
    }
  };
  ranges.sort(function(a, b) {
    var precedenceOf = function precedenceOf2(x) {
      return ["err", "query", "lsp"].indexOf(x != null ? x : "");
    };
    var cmp = 0;
    !(cmp = a.begin - b.begin) && /*2*/
    !(cmp = b.end - a.end) && /*3*/
    !(cmp = precedenceOf(a.classes) - precedenceOf(b.classes));
    return cmp;
  });
  var cursor = 0;
  var nest = function nest2(data2) {
    var stack = "";
    var top = data2.shift();
    stack += text.substring(cursor, top.begin);
    cursor = top.begin;
    stack += makeTagFromRange(top);
    if (data2.some(function(x) {
      return x.begin < top.end;
    })) {
      stack += nest2(data2);
    } else {
      stack += text.substring(top.begin, top.end);
      cursor = top.end;
    }
    stack += makeTagFromRange(top, true);
    if (data2.length !== 0) {
      stack += nest2(data2);
    }
    return stack;
  };
  var data = JSON.parse(JSON.stringify(ranges));
  var html = nest(data) + text.substring(cursor);
  return htmlAttrUnReplacer(replaceTripleArrow(stripHTML(html)));
}
var htmlAttrReplacer = function htmlAttrReplacer2(str) {
  return str.replace(/"/g, "⃟");
};
var htmlAttrUnReplacer = function htmlAttrUnReplacer2(str) {
  return str.replace(/⃟/g, '"');
};
var subTripleArrow = function subTripleArrow2(str) {
  return str.replace(/</g, "⇍").replace(/>/g, "⇏").replace(/'/g, "⇯");
};
var replaceTripleArrow = function replaceTripleArrow2(str) {
  return str.replace(/⇍/g, "<").replace(/⇏/g, ">").replace(/⇯/g, "'").replace(/¿/g, "'");
};
var replaceTripleArrowEncoded = function replaceTripleArrowEncoded2(str) {
  return str.replace(/⇍/g, "&lt;").replace(/⇏/g, "&gt;").replace(/⇯/g, "&apos;");
};
function stripHTML(text) {
  var table = {
    "<": "lt",
    '"': "quot",
    "'": "apos",
    "&": "amp",
    "\r": "#13",
    "\n": "#10"
  };
  return text.toString().replace(/[<"'\r\n&]/g, function(chr) {
    return "&" + table[chr] + ";";
  });
}
function escapeHtml2(html) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var shouldBeHighlightable = function shouldBeHighlightable2(highlight) {
  return !!Object.keys(highlight || {}).find(function(key) {
    if (key.includes("-")) return true;
    if (!isNaN(parseInt(key))) return true;
    return false;
  });
};
var shouldHighlightLine = function shouldHighlightLine2(highlight) {
  var lines = [];
  Object.keys(highlight || {}).find(function(key) {
    if (!isNaN(parseInt(key))) lines.push(parseInt(key));
    if (key.includes("-")) {
      var _key$split = key.split("-"), first = _key$split[0], last = _key$split[1];
      var lastIndex = parseInt(last) + 1;
      for (var i = parseInt(first); i < lastIndex; i++) {
        lines.push(i);
      }
    }
  });
  return function(line) {
    return lines.includes(line);
  };
};
var preOpenerFromRenderingOptsWithExtras = function preOpenerFromRenderingOptsWithExtras2(opts, meta, classes) {
  var bg = opts.bg || "#fff";
  var fg = opts.fg || "black";
  var theme = opts.themeName || "";
  var classList = ["shiki", theme, meta["class"], meta.title ? "with-title" : ""].concat(classes || []).filter(Boolean).join(" ").trim();
  var attributes = Object.entries(meta).filter(function(entry) {
    return ["string", "number", "boolean"].includes(typeof entry[1]) && !["class", "twoslash"].includes(entry[0]) && entry[1] !== false;
  }).map(function(_ref) {
    var key = _ref[0], value = _ref[1];
    return key + '="' + value + '"';
  }).join(" ").trim();
  return '<pre class="' + classList + '" style="background-color: ' + bg + "; color: " + fg + '"' + (attributes ? " " + attributes : "") + ">";
};
function plainTextRenderer(code, options, meta) {
  var html = "";
  html += preOpenerFromRenderingOptsWithExtras(options, meta, []);
  if (meta.title) {
    html += "<div class='code-title'>" + meta.title + "</div>";
  }
  if (options.langId) {
    html += '<div class="language-id">' + options.langId + "</div>";
  }
  html += "<div class='code-container'><code>";
  html += escapeHtml2(code);
  html = html.replace(/\n*$/, "");
  html += "</code></div></pre>";
  return html;
}
function twoslashRenderer(lines, options, twoslash, meta) {
  var html = "";
  var hasHighlight = meta.highlight && shouldBeHighlightable(meta.highlight);
  var hl = shouldHighlightLine(meta.highlight);
  if (twoslash.tags && twoslash.tags.length) html += "<div class='tag-container'>";
  html += preOpenerFromRenderingOptsWithExtras(options, meta, ["twoslash", "lsp"]);
  if (meta.title) {
    html += "<div class='code-title'>" + meta.title + "</div>";
  }
  if (options.langId) {
    html += '<div class="language-id">' + options.langId + "</div>";
  }
  html += "<div class='code-container'><code>";
  var errorsGroupedByLine = groupBy2(twoslash.errors, function(e) {
    return e.line;
  }) || /* @__PURE__ */ new Map();
  var staticQuickInfosGroupedByLine = groupBy2(twoslash.staticQuickInfos, function(q) {
    return q.line;
  }) || /* @__PURE__ */ new Map();
  var queriesGroupedByLine = groupBy2(twoslash.queries, function(q) {
    return q.line - 1;
  }) || /* @__PURE__ */ new Map();
  var tagsGroupedByLine = groupBy2(twoslash.tags, function(q) {
    return q.line - 1;
  }) || /* @__PURE__ */ new Map();
  var filePos = 0;
  lines.forEach(function(l, i) {
    var errors = errorsGroupedByLine.get(i) || [];
    var lspValues = staticQuickInfosGroupedByLine.get(i) || [];
    var queries = queriesGroupedByLine.get(i) || [];
    var tags = tagsGroupedByLine.get(i) || [];
    var hiClass = hasHighlight ? hl(i + 1) ? " highlight" : " dim" : "";
    var prefix = "<div class='line" + hiClass + "'>";
    if (l.length === 0 && i === 0) {
      filePos += 1;
    } else if (l.length === 0) {
      var emptyLine = prefix + "&nbsp;</div>";
      html += emptyLine;
      filePos += 1;
    } else {
      html += prefix;
      var tokenPos = 0;
      l.forEach(function(token) {
        var targetedQueryWord;
        var tokenContent = "";
        var findTokenFunc = function findTokenFunc2(start) {
          return function(e) {
            return start <= e.character && start + token.content.length >= e.character + e.length;
          };
        };
        var errorsInToken = errors.filter(findTokenFunc(tokenPos));
        var lspResponsesInToken = lspValues.filter(findTokenFunc(tokenPos));
        var queriesInToken = queries.filter(findTokenFunc(tokenPos));
        targetedQueryWord = targetedQueryWord || lspResponsesInToken.find(function(response) {
          return response.text === (queries.length && queries[0].text);
        });
        var allTokens = [].concat(errorsInToken, lspResponsesInToken, queriesInToken);
        var allTokensByStart = allTokens.sort(function(l2, r) {
          return (l2.start || 0) - (r.start || 0);
        });
        if (allTokensByStart.length) {
          var _targetedQueryWord;
          var ranges = allTokensByStart.map(function(token2) {
            var range = {
              begin: token2.start - filePos,
              end: token2.start + token2.length - filePos
            };
            if ("renderedMessage" in token2) range.classes = "err";
            if ("kind" in token2) range.classes = token2.kind;
            if ("targetString" in token2) {
              range.classes = "lsp";
              var lspText = options.includeJSDocInHover && token2.docs ? token2.docs + "\n\n" + token2.text : token2.text;
              range["lsp"] = lspText;
            }
            return range;
          });
          tokenContent += createHighlightedString(ranges, token.content, (_targetedQueryWord = targetedQueryWord) == null ? void 0 : _targetedQueryWord.text);
        } else {
          tokenContent += subTripleArrow(token.content);
        }
        html += '<span style="color: ' + token.color + '">' + tokenContent + "</span>";
        tokenPos += token.content.length;
        filePos += token.content.length;
      });
      html += "</div>";
      filePos += 1;
    }
    if (errors.length) {
      var messages = errors.map(function(e) {
        return escapeHtml2(e.renderedMessage);
      }).join("</br>");
      var codes = errors.map(function(e) {
        return e.code;
      }).join("<br/>");
      html += '<span class="error"><span>' + messages + '</span><span class="code">' + codes + "</span></span>";
      html += '<span class="error-behind">' + messages + "</span>";
    }
    if (queries.length) {
      queries.forEach(function(query) {
        html += "<div class='meta-line'>";
        switch (query.kind) {
          case "query": {
            var queryTextWithPrefix = escapeHtml2(query.text);
            var _lspValues = staticQuickInfosGroupedByLine.get(i) || [];
            var targetedWord = _lspValues.find(function(response) {
              return response.text === (queries.length && queries[0].text);
            });
            var halfWayAcrossTheTargetedWord = (targetedWord && targetedWord.character + (targetedWord == null ? void 0 : targetedWord.length) / 2) - 1 || 0;
            html += "<span class='popover-prefix'>" + " ".repeat(halfWayAcrossTheTargetedWord) + "</span>" + ("<span class='popover'><div class='arrow'></div>" + queryTextWithPrefix + "</span>");
            break;
          }
          case "completions": {
            if (!query.completions) {
              html += "<span class='query'>" + ("//" + "".padStart(query.offset - 2) + "^ - No completions found") + "</span>";
            } else {
              var prefixed = query.completions.filter(function(c) {
                return c.name.startsWith(query.completionsPrefix || "____");
              });
              var lis = prefixed.sort(function(l2, r) {
                return l2.name.localeCompare(r.name);
              }).map(function(c) {
                var _query$completionsPre, _c$kindModifiers;
                var after = c.name.substr(((_query$completionsPre = query.completionsPrefix) == null ? void 0 : _query$completionsPre.length) || 0);
                var name = "<span><span class='result-found'>" + (query.completionsPrefix || "") + "</span>" + after + "</span>";
                var isDeprecated = (_c$kindModifiers = c.kindModifiers) == null ? void 0 : _c$kindModifiers.split(",").includes("deprecated");
                var liClass = isDeprecated ? "deprecated" : "";
                return "<li class='" + liClass + "'>" + name + "</li>";
              }).join("");
              html += "&nbsp;".repeat(query.offset) + "<span class='inline-completions'><ul class='dropdown'>" + lis + "</ul></span>";
            }
          }
        }
        html += "</div>";
      });
    }
    if (tags.length) {
      tags.forEach(function(tag) {
        if (!["error", "warn", "log"].includes(tag.name)) return;
        html += "<div class='meta-line logger " + tag.name + "-log'>";
        switch (tag.name) {
          case "error":
            html += errorSVG + "<span class='message'>" + (tag.annotation || "N/A") + "</span>";
            break;
          case "warn":
            html += warningSVG + "<span class='message'>" + (tag.annotation || "N/A") + "</span>";
            break;
          case "log":
            html += logSVG + "<span class='message'>" + (tag.annotation || "N/A") + "</span>";
            break;
        }
        html += "</div>";
      });
    }
  });
  html = replaceTripleArrowEncoded(html.replace(/\n*$/, ""));
  if (options.addTryButton) {
    var playgroundLink = "<a class='playground-link' href='" + twoslash.playgroundURL + "'>Try</a>";
    html += "</code>" + playgroundLink;
  } else {
    html += "</code>";
  }
  html += "</div></pre>";
  if (twoslash.tags && twoslash.tags.length) {
    html += htmlForTags(twoslash.tags);
    html += "</div>";
  }
  return html;
}
function groupBy2(list, keyGetter) {
  var map = /* @__PURE__ */ new Map();
  list.forEach(function(item) {
    var key = keyGetter(item);
    var collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
var errorSVG = '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.63018 1.29289L1.29289 4.63018C1.10536 4.81772 1 5.07207 1 5.33729V13.6627C1 13.9279 1.10536 14.1823 1.29289 14.3698L4.63018 17.7071C4.81772 17.8946 5.07207 18 5.33729 18H13.6627C13.9279 18 14.1823 17.8946 14.3698 17.7071L17.7071 14.3698C17.8946 14.1823 18 13.9279 18 13.6627V5.33729C18 5.07207 17.8946 4.81772 17.7071 4.63018L14.3698 1.29289C14.1823 1.10536 13.9279 1 13.6627 1H5.33729C5.07207 1 4.81772 1.10536 4.63018 1.29289Z" fill="#E72622" stroke="#E72622"/><rect x="8" y="4" width="3" height="7" fill="white"/><rect x="8" y="13" width="3" height="3" fill="white"/></svg>';
var warningSVG = '<svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.63401 0.5C10.0189 -0.166667 10.9812 -0.166667 11.3661 0.5L20.4593 16.25C20.8442 16.9167 20.3631 17.75 19.5933 17.75H1.40676C0.636965 17.75 0.15584 16.9167 0.54074 16.25L9.63401 0.5Z" fill="#E5A604"/><rect x="9" y="4" width="3" height="7" fill="white"/><rect x="9" y="13" width="3" height="3" fill="white"/></svg>';
var logSVG = '<svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.76822 0.359816C5.41466 -0.0644613 4.78409 -0.121785 4.35982 0.231779C3.93554 0.585343 3.87821 1.21591 4.23178 1.64018L5.76822 0.359816ZM10 7L10.7926 7.60971L11.2809 6.97499L10.7682 6.35982L10 7ZM4.20738 12.8903C3.87064 13.328 3.95254 13.9559 4.39029 14.2926C4.82804 14.6294 5.45589 14.5475 5.79262 14.1097L4.20738 12.8903ZM4.23178 1.64018L9.23178 7.64018L10.7682 6.35982L5.76822 0.359816L4.23178 1.64018ZM9.20738 6.39029L4.20738 12.8903L5.79262 14.1097L10.7926 7.60971L9.20738 6.39029Z" fill="#BDBDBD"/><line y1="3.5" x2="4" y2="3.5" stroke="#BDBDBD"/><path d="M0 7H4" stroke="#BDBDBD"/><line y1="10.5" x2="4" y2="10.5" stroke="#BDBDBD"/></svg>';
function defaultShikiRenderer(lines, options, meta) {
  var html = "";
  var hasHighlight = meta.highlight && shouldBeHighlightable(meta.highlight);
  var hl = shouldHighlightLine(meta.highlight);
  html += preOpenerFromRenderingOptsWithExtras(options, meta, []);
  if (meta.title) {
    html += "<div class='code-title'>" + meta.title + "</div>";
  }
  if (options.langId) {
    html += '<div class="language-id">' + options.langId + "</div>";
  }
  html += "<div class='code-container'><code>";
  lines.forEach(function(l, i) {
    if (l.length === 0) {
      html += "<div class='line'></div>";
    } else {
      var hiClass = hasHighlight ? hl(i) ? " highlight" : " dim" : "";
      var prefix = "<div class='line" + hiClass + "'>";
      html += prefix;
      l.forEach(function(token) {
        html += '<span style="color: ' + token.color + '">' + escapeHtml2(token.content) + "</span>";
      });
      html += "</div>";
    }
  });
  html = html.replace(/\n*$/, "");
  html += "</code></div></pre>";
  return html;
}
var tsconfig = {
  compilerOptions: "The set of compiler options for your project",
  allowArbitraryExtensions: "Enable importing files with any extension, provided a declaration file is present.",
  allowImportingTsExtensions: "Allow imports to include TypeScript file extensions.",
  allowJs: "Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files.",
  allowSyntheticDefaultImports: "Allow 'import x from y' when a module doesn't have a default export.",
  allowUmdGlobalAccess: "Allow accessing UMD globals from modules.",
  allowUnreachableCode: "Disable error reporting for unreachable code.",
  allowUnusedLabels: "Disable error reporting for unused labels.",
  alwaysStrict: "Ensure 'use strict' is always emitted.",
  assumeChangesOnlyAffectDirectDependencies: "Have recompiles in projects that use [`incremental`](#incremental) and `watch` mode assume that changes within a file will only affect files directly depending on it.",
  baseUrl: "Specify the base directory to resolve non-relative module names.",
  charset: "No longer supported. In early versions, manually set the text encoding for reading files.",
  checkJs: "Enable error reporting in type-checked JavaScript files.",
  clean: "Delete the outputs of all projects.",
  composite: "Enable constraints that allow a TypeScript project to be used with project references.",
  customConditions: "Conditions to set in addition to the resolver-specific defaults when resolving imports.",
  declaration: "Generate .d.ts files from TypeScript and JavaScript files in your project.",
  declarationDir: "Specify the output directory for generated declaration files.",
  declarationMap: "Create sourcemaps for d.ts files.",
  diagnostics: "Output compiler performance information after building.",
  disableFilenameBasedTypeAcquisition: "Disables inference for type acquisition by looking at filenames in a project.",
  disableReferencedProjectLoad: "Reduce the number of projects loaded automatically by TypeScript.",
  disableSizeLimit: "Remove the 20mb cap on total source code size for JavaScript files in the TypeScript language server.",
  disableSolutionSearching: "Opt a project out of multi-project reference checking when editing.",
  disableSourceOfProjectReferenceRedirect: "Disable preferring source files instead of declaration files when referencing composite projects.",
  downlevelIteration: "Emit more compliant, but verbose and less performant JavaScript for iteration.",
  emitBOM: "Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.",
  emitDeclarationOnly: "Only output d.ts files and not JavaScript files.",
  emitDecoratorMetadata: "Emit design-type metadata for decorated declarations in source files.",
  enable: "Disable the type acquisition for JavaScript projects.",
  esModuleInterop: "Emit additional JavaScript to ease support for importing CommonJS modules. This enables [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports) for type compatibility.",
  exactOptionalPropertyTypes: "Interpret optional property types as written, rather than adding `undefined`.",
  exclude: "Filters results from the [`include`](#include) option.",
  excludeDirectories: "Remove a list of directories from the watch process.",
  excludeFiles: "Remove a list of files from the watch mode's processing.",
  experimentalDecorators: "Enable experimental support for TC39 stage 2 draft decorators.",
  explainFiles: "Print files read during the compilation including why it was included.",
  extendedDiagnostics: "Output more detailed compiler performance information after building.",
  "extends": "Specify one or more path or node module references to base configuration files from which settings are inherited.",
  fallbackPolling: "Specify what approach the watcher should use if the system runs out of native file watchers.",
  files: "Include a list of files. This does not support glob patterns, as opposed to [`include`](#include).",
  force: "Build all projects, including those that appear to be up to date.",
  forceConsistentCasingInFileNames: "Ensure that casing is correct in imports.",
  generateCpuProfile: "Emit a v8 CPU profile of the compiler run for debugging.",
  importHelpers: "Allow importing helper functions from tslib once per project, instead of including them per-file.",
  importsNotUsedAsValues: "Specify emit/checking behavior for imports that are only used for types.",
  include: "Specify a list of glob patterns that match files to be included in compilation.",
  incremental: "Save .tsbuildinfo files to allow for incremental compilation of projects.",
  inlineSourceMap: "Include sourcemap files inside the emitted JavaScript.",
  inlineSources: "Include source code in the sourcemaps inside the emitted JavaScript.",
  isolatedModules: "Ensure that each file can be safely transpiled without relying on other imports.",
  jsx: "Specify what JSX code is generated.",
  jsxFactory: "Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'.",
  jsxFragmentFactory: "Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.",
  jsxImportSource: "Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.",
  keyofStringsOnly: "Make keyof only return strings instead of string, numbers or symbols. Legacy option.",
  lib: "Specify a set of bundled library declaration files that describe the target runtime environment.",
  listEmittedFiles: "Print the names of emitted files after a compilation.",
  listFiles: "Print all of the files read during the compilation.",
  locale: "Set the language of the messaging from TypeScript. This does not affect emit.",
  mapRoot: "Specify the location where debugger should locate map files instead of generated locations.",
  maxNodeModuleJsDepth: "Specify the maximum folder depth used for checking JavaScript files from `node_modules`. Only applicable with [`allowJs`](#allowJs).",
  module: "Specify what module code is generated.",
  moduleDetection: "Control what method is used to detect the whether a JS file is a module.",
  moduleResolution: "Specify how TypeScript looks up a file from a given module specifier.",
  moduleSuffixes: "List of file name suffixes to search when resolving a module.",
  newLine: "Set the newline character for emitting files.",
  noEmit: "Disable emitting files from a compilation.",
  noEmitHelpers: "Disable generating custom helper functions like `__extends` in compiled output.",
  noEmitOnError: "Disable emitting files if any type checking errors are reported.",
  noErrorTruncation: "Disable truncating types in error messages.",
  noFallthroughCasesInSwitch: "Enable error reporting for fallthrough cases in switch statements.",
  noImplicitAny: "Enable error reporting for expressions and declarations with an implied `any` type.",
  noImplicitOverride: "Ensure overriding members in derived classes are marked with an override modifier.",
  noImplicitReturns: "Enable error reporting for codepaths that do not explicitly return in a function.",
  noImplicitThis: "Enable error reporting when `this` is given the type `any`.",
  noImplicitUseStrict: "Disable adding 'use strict' directives in emitted JavaScript files.",
  noLib: "Disable including any library files, including the default lib.d.ts.",
  noPropertyAccessFromIndexSignature: "Enforces using indexed accessors for keys declared using an indexed type.",
  noResolve: "Disallow `import`s, `require`s or `<reference>`s from expanding the number of files TypeScript should add to a project.",
  noStrictGenericChecks: "Disable strict checking of generic signatures in function types.",
  noUncheckedIndexedAccess: "Add `undefined` to a type when accessed using an index.",
  noUnusedLocals: "Enable error reporting when local variables aren't read.",
  noUnusedParameters: "Raise an error when a function parameter isn't read.",
  out: "Deprecated setting. Use [`outFile`](#outFile) instead.",
  outDir: "Specify an output folder for all emitted files.",
  outFile: "Specify a file that bundles all outputs into one JavaScript file. If [`declaration`](#declaration) is true, also designates a file that bundles all .d.ts output.",
  paths: "Specify a set of entries that re-map imports to additional lookup locations.",
  plugins: "Specify a list of language service plugins to include.",
  preserveConstEnums: "Disable erasing `const enum` declarations in generated code.",
  preserveSymlinks: "Disable resolving symlinks to their realpath. This correlates to the same flag in node.",
  preserveValueImports: "Preserve unused imported values in the JavaScript output that would otherwise be removed.",
  preserveWatchOutput: "Disable wiping the console in watch mode.",
  pretty: "Enable color and formatting in TypeScript's output to make compiler errors easier to read.",
  reactNamespace: "Specify the object invoked for `createElement`. This only applies when targeting `react` JSX emit.",
  references: "Specify an array of objects that specify paths for projects. Used in project references.",
  removeComments: "Disable emitting comments.",
  resolveJsonModule: "Enable importing .json files.",
  resolvePackageJsonExports: "Use the package.json 'exports' field when resolving package imports.",
  resolvePackageJsonImports: "Use the package.json 'imports' field when resolving imports.",
  rootDir: "Specify the root folder within your source files.",
  rootDirs: "Allow multiple folders to be treated as one when resolving modules.",
  skipDefaultLibCheck: "Skip type checking .d.ts files that are included with TypeScript.",
  skipLibCheck: "Skip type checking all .d.ts files.",
  sourceMap: "Create source map files for emitted JavaScript files.",
  sourceRoot: "Specify the root path for debuggers to find the reference source code.",
  strict: "Enable all strict type-checking options.",
  strictBindCallApply: "Check that the arguments for `bind`, `call`, and `apply` methods match the original function.",
  strictFunctionTypes: "When assigning functions, check to ensure parameters and the return values are subtype-compatible.",
  strictNullChecks: "When type checking, take into account `null` and `undefined`.",
  strictPropertyInitialization: "Check for class properties that are declared but not set in the constructor.",
  stripInternal: "Disable emitting declarations that have `@internal` in their JSDoc comments.",
  suppressExcessPropertyErrors: "Disable reporting of excess property errors during the creation of object literals.",
  suppressImplicitAnyIndexErrors: "Suppress [`noImplicitAny`](#noImplicitAny) errors when indexing objects that lack index signatures.",
  synchronousWatchDirectory: "Synchronously call callbacks and update the state of directory watchers on platforms that don`t support recursive watching natively.",
  target: "Set the JavaScript language version for emitted JavaScript and include compatible library declarations.",
  traceResolution: "Log paths used during the [`moduleResolution`](#moduleResolution) process.",
  tsBuildInfoFile: "Specify the folder for .tsbuildinfo incremental compilation files.",
  typeAcquisition: "Specify options for automatic acquisition of declaration files.",
  typeRoots: "Specify multiple folders that act like `./node_modules/@types`.",
  types: "Specify type package names to be included without being referenced in a source file.",
  useDefineForClassFields: "Emit ECMAScript-standard-compliant class fields.",
  useUnknownInCatchVariables: "Default catch clause variables as `unknown` instead of `any`.",
  verbatimModuleSyntax: "Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting.",
  verbose: "Enable verbose logging.",
  watchDirectory: "Specify how directories are watched on systems that lack recursive file-watching functionality.",
  watchFile: "Specify how the TypeScript watch mode works."
};
var tokenIsJSONKey = function tokenIsJSONKey2(token) {
  if (!token.explanation) return false;
  return token.explanation.find(function(e) {
    return e.scopes.find(function(s) {
      return s.scopeName.includes("support.type.property-name");
    });
  });
};
var isKeyInTSConfig = function isKeyInTSConfig2(token) {
  if (token.content === '"') return;
  var name = token.content.slice(1, token.content.length - 1);
  return name in tsconfig;
};
function tsconfigJSONRenderer(lines, options, meta) {
  var html = "";
  html += preOpenerFromRenderingOptsWithExtras(options, meta, ["tsconfig", "lsp"]);
  if (meta.title) {
    html += '<div class="code-title">' + meta.title + "</div>";
  }
  if (options.langId) {
    html += '<div class="language-id">' + options.langId + "</div>";
  }
  html += "<div class='code-container'><code>";
  lines.forEach(function(l) {
    if (l.length === 0) {
      html += "<div class='line'></div>";
    } else {
      html += "<div class='line'>";
      l.forEach(function(token) {
        if (tokenIsJSONKey(token) && isKeyInTSConfig(token)) {
          var key = token.content.slice(1, token.content.length - 1);
          var oneliner = tsconfig[key];
          html += '<span style="color: ' + token.color + `">"<a aria-hidden=true tabindex="-1" href='https://www.typescriptlang.org/tsconfig#` + key + `'><data-lsp lsp="` + oneliner + '">' + escapeHtml2(key) + '</data-lsp></a>"</span>';
        } else {
          html += '<span style="color: ' + token.color + '">' + escapeHtml2(token.content) + "</span>";
        }
      });
      html += "</div>";
    }
  });
  html = html.replace(/\n*$/, "");
  html += "</code></div></pre>";
  return html;
}
var storedHighlighter = null;
var renderCodeToHTML = function renderCodeToHTML2(code, lang, meta, shikiOptions, highlighter, twoslash) {
  if (!highlighter && !storedHighlighter) {
    throw new Error("The highlighter object hasn't been initialised via `setupHighLighter` yet in shiki-twoslash");
  }
  var renderHighlighter = highlighter || storedHighlighter;
  var renderOpts = _extends4({
    fg: renderHighlighter.getForegroundColor(),
    bg: renderHighlighter.getBackgroundColor()
  }, shikiOptions);
  var tokens;
  try {
    var tmpLang = lang === "jsx" ? "tsx" : lang;
    tokens = renderHighlighter.codeToThemedTokens(code, tmpLang);
  } catch (error) {
    var note = "<!-- Note from shiki-twoslash: the language " + lang + " was not set up for Shiki to use, and so there is no code highlighting -->";
    return plainTextRenderer(code, renderOpts, meta) + note;
  }
  if (lang && meta.twoslash && twoslash) {
    return twoslashRenderer(tokens, _extends4({}, renderOpts, {
      langId: lang
    }), twoslash, meta);
  }
  if (lang && lang.startsWith("json") && meta.tsconfig) {
    return tsconfigJSONRenderer(tokens, renderOpts, meta);
  }
  return defaultShikiRenderer(tokens, _extends4({}, renderOpts, {
    langId: lang
  }), meta);
};
var runTwoSlash = function runTwoSlash2(input, lang, settings) {
  if (settings === void 0) {
    settings = {};
  }
  var code = input;
  var replacer = {
    json5: "json",
    yml: "yaml"
  };
  if (replacer[lang]) lang = replacer[lang];
  var hasReactImport = /^import\s+React(?:.*)\s+from\s+('|")react\1/gm;
  if (["tsx", "jsx"].includes(lang) && !settings.disableImplicitReactImport && !hasReactImport.test(code)) {
    var reactImport = "import React from 'react'\n";
    var cutString = "// ---cut---\n";
    if (code.includes(cutString)) {
      code = code.split(cutString).map(function(item, index) {
        return index == 0 ? reactImport.concat(item) : item;
      }).join(cutString);
    } else {
      code = [reactImport, cutString, code].join("");
    }
  }
  settings.customTags = ["annotate", "log", "warn", "error"];
  var results = twoslasher(code, lang, settings);
  return results;
};

// ../../node_modules/.bun/remark-shiki-twoslash@3.1.3+1fb4c65d43e298b9/node_modules/remark-shiki-twoslash/dist/remark-shiki-twoslash.esm.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function() {
    var self2 = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self2, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
function _extends5() {
  _extends5 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends5.apply(this, arguments);
}
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var runtime_1 = createCommonjsModule(function(module) {
  var runtime = (function(exports) {
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1;
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define2(obj, key, value) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      define2({}, "");
    } catch (err) {
      define2 = function define3(obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self2, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);
      generator._invoke = makeInvokeMethod(innerFn, self2, context);
      return generator;
    }
    exports.wrap = wrap;
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";
    var ContinueSentinel = {};
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function() {
      return this;
    };
    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      IteratorPrototype = NativeIteratorPrototype;
    }
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define2(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }
    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };
    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define2(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };
    exports.awrap = function(arg) {
      return {
        __await: arg
      };
    };
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value2) {
              invoke("next", value2, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }
          return PromiseImpl.resolve(value).then(function(unwrapped) {
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            return invoke("throw", error, resolve, reject);
          });
        }
      }
      var previousPromise;
      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
      }
      this._invoke = enqueue;
    }
    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function() {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;
    exports.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
        return result.done ? result.value : iter.next();
      });
    };
    function makeInvokeMethod(innerFn, self2, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }
        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }
          return doneResult();
        }
        context.method = method;
        context.arg = arg;
        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if (context.method === "next") {
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }
            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }
          state = GenStateExecuting;
          var record = tryCatch(innerFn, self2, context);
          if (record.type === "normal") {
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;
            if (record.arg === ContinueSentinel) {
              continue;
            }
            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        context.delegate = null;
        if (context.method === "throw") {
          if (delegate.iterator["return"]) {
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);
            if (context.method === "throw") {
              return ContinueSentinel;
            }
          }
          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }
        return ContinueSentinel;
      }
      var record = tryCatch(method, delegate.iterator, context.arg);
      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }
      var info = record.arg;
      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }
      if (info.done) {
        context[delegate.resultName] = info.value;
        context.next = delegate.nextLoc;
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        return info;
      }
      context.delegate = null;
      return ContinueSentinel;
    }
    defineIteratorMethods(Gp);
    define2(Gp, toStringTagSymbol, "Generator");
    Gp[iteratorSymbol] = function() {
      return this;
    };
    Gp.toString = function() {
      return "[object Generator]";
    };
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      if (1 in locs) {
        entry.catchLoc = locs[1];
      }
      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }
      this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }
    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();
      return function next() {
        while (keys.length) {
          var key2 = keys.pop();
          if (key2 in object) {
            next.value = key2;
            next.done = false;
            return next;
          }
        }
        next.done = true;
        return next;
      };
    };
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }
        if (typeof iterable.next === "function") {
          return iterable;
        }
        if (!isNaN(iterable.length)) {
          var i = -1, next = function next2() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next2.value = iterable[i];
                next2.done = false;
                return next2;
              }
            }
            next2.value = undefined$1;
            next2.done = true;
            return next2;
          };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    exports.values = values;
    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }
    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);
        if (!skipTempReset) {
          for (var name in this) {
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }
        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }
        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;
          if (caught) {
            context.method = "next";
            context.arg = undefined$1;
          }
          return !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;
          if (entry.tryLoc === "root") {
            return handle("end");
          }
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          finallyEntry = null;
        }
        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;
        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }
        return this.complete(record);
      },
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }
        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }
        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName,
          nextLoc
        };
        if (this.method === "next") {
          this.arg = undefined$1;
        }
        return ContinueSentinel;
      }
    };
    return exports;
  })(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports
  );
  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
});
var cachedTwoslashCall = function cachedTwoslashCall2(code, lang, settings) {
  var isWebWorker2 = typeof self !== "undefined" && typeof self.WorkerGlobalScope !== "undefined";
  var isBrowser2 = isWebWorker2 || typeof window !== "undefined" && typeof window.document !== "undefined" && typeof fetch !== "undefined";
  if (isBrowser2) {
    return runTwoSlash(code, lang, settings);
  }
  var _require = require_crypto(), createHash = _require.createHash;
  var _require2 = require_fs(), readFileSync = _require2.readFileSync, existsSync = _require2.existsSync, mkdirSync = _require2.mkdirSync, writeFileSync = _require2.writeFileSync;
  var _require3 = require_path(), join2 = _require3.join;
  var shikiVersion = require_package().version;
  var tsVersion = require_package2().version;
  var shasum = createHash("sha1");
  var codeSha = shasum.update(code + "-" + shikiVersion + "-" + tsVersion).digest("hex");
  var getNmCache = function getNmCache2() {
    if (__dirname.includes("node_modules")) {
      return join2(__dirname.split("node_modules")[0], "node_modules", ".cache", "twoslash");
    } else {
      return join2(__dirname, "..", "..", ".cache", "twoslash");
    }
  };
  var getPnpCache = function getPnpCache2() {
    try {
      var pnp = __require("pnpapi");
      return join2(pnp.getPackageInformation(pnp.topLevel).packageLocation, "node_modules", ".cache", "twoslash");
    } catch (error) {
      return getNmCache();
    }
  };
  var cacheRoot = process.versions.pnp ? getPnpCache() : getNmCache();
  var cachePath = join2(cacheRoot, codeSha + ".json");
  if (existsSync(cachePath)) {
    if (process.env.debug) console.log("Using cached twoslash results from " + cachePath);
    return JSON.parse(readFileSync(cachePath, "utf8"));
  } else {
    var results = runTwoSlash(code, lang, settings);
    if (!existsSync(cacheRoot)) mkdirSync(cacheRoot, {
      recursive: true
    });
    writeFileSync(cachePath, JSON.stringify(results), "utf8");
    return results;
  }
};
var addIncludes = function addIncludes2(map, name, code) {
  var lines = [];
  code.split("\n").forEach(function(l, _i) {
    var trimmed = l.trim();
    if (trimmed.startsWith("// - ")) {
      var key = trimmed.split("// - ")[1].split(" ")[0];
      map.set(name + "-" + key, lines.join("\n"));
    } else {
      lines.push(l);
    }
  });
  map.set(name, lines.join("\n"));
};
var replaceIncludesInCode = function replaceIncludesInCode2(_map, code) {
  var includes2 = /\/\/ @include: (.*)$/gm;
  var toReplace = [];
  var match;
  while ((match = includes2.exec(code)) !== null) {
    if (match.index === includes2.lastIndex) {
      includes2.lastIndex++;
    }
    var key = match[1];
    var replaceWith = _map.get(key);
    if (!replaceWith) {
      var msg = "Could not find an include with the key: '" + key + "'.\nThere is: " + Array.from(_map.keys()) + ".";
      throw new Error(msg);
    }
    toReplace.push([match.index, match[0].length, replaceWith]);
  }
  var newCode = code.toString();
  toReplace.reverse().forEach(function(r) {
    newCode = newCode.substring(0, r[0]) + r[2] + newCode.substring(r[0] + r[1]);
  });
  return newCode;
};
function escapeHtml3(html) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var setupNodeForTwoslashException = function setupNodeForTwoslashException2(code, node, error) {
  var css = `<style>
@import url('http://fonts.cdnfonts.com/css/caslon-os'); 

.twoslash-fixed-error-note { 
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    padding: .25rem .75rem;
    color: black;
    background-color: #FCF3D9;
    background-clip: padding-box;
    border-bottom: 1px solid rgba(0,0,0,.05);
    border-radius: .25rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
 } 

 #__docusaurus .twoslash-fixed-error-note {
    top: 80px;
 }

 .twoslash-fixed-error-note:hover {
    border-bottom: 1px solid rgba(226, 61, 30, 0.8);
 }

 .twoslash-error-color {
    background-color: #E23D1E;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    margin-right:  10px;
    color: black;
 }

.twoslash-exception-message { 
    font-family: 'Caslon OS', sans-serif; 
    background-color: #FCF3D9;
    font-size: 1.1rem;
    padding: 2rem;
    border-left: 2px solid #E23D1E;
}

.twoslash-exception-message p {
    margin-top: 1rem;
    margin-bottom: 0.6rem;
}

.twoslash-exception-message h3 { 
    margin-top: 0.6rem;
    margin-bottom: 0.3rem;
    font-size: 1.8rem;
}

.twoslash-exception-message code {
     white-space: pre-wrap;
     font-family: "JetBrains Mono", Menlo, Monaco, Consolas, Courier New, monospace;
     margin-bottom: 20px;
     background-color: #FCF3D9;
     color: black;
     border: none;
     padding-left: 0;
 }

 .twoslash-exception-message > code {
     display: block;
     margin-bottom: 1.5rem;
     margin-top: 3rem;
 }

.twoslash-exception-code {
    border-left: 2px solid #E5A604;
    padding-left: 20px;
    background-color: #FCF3D9;
    color: black;
}
</style>`;
  var bodyFromTwoslashError = function bodyFromTwoslashError2(error2) {
    return "\n<h3>" + escapeHtml3(error2.title) + "</h3>\n<p>" + escapeHtml3(error2.description).replace(/(?:\r\n|\r|\n)/g, "<br>") + "</p>\n<code>" + escapeHtml3(error2.recommendation).replace(/(?:\r\n|\r|\n)/g, "<br>") + "</code>\n";
  };
  var bodyFromError = function bodyFromError2(error2) {
    return "<pre><code>" + error2.message.split("## Code")[0] + "</code></pre>";
  };
  var isWebWorker2 = typeof self !== "undefined" && typeof self.WorkerGlobalScope !== "undefined";
  var isBrowser2 = isWebWorker2 || typeof window !== "undefined" && typeof window.document !== "undefined" && typeof fetch !== "undefined";
  var isJest = typeof jest !== "undefined";
  var eLog = !isBrowser2 && !isJest ? console.error : function(_str) {
  };
  var body = "<pre><code>" + error + "</code></pre>";
  if (typeof error !== "object") {
    body = String(error);
    eLog("### Unexpected error:");
    eLog(error);
  } else if (error instanceof TwoslashError) {
    body = bodyFromTwoslashError(error);
    eLog("### Twoslash error: " + error.title);
    eLog(error.description);
    eLog(error.recommendation);
    eLog("\n### Code Sample");
    eLog(code);
  } else if (error instanceof Error) {
    body = bodyFromError(error);
    eLog("### Unexpected error:");
    eLog(error);
  }
  var codeSample = "<p>Raising Code:</p><pre class='twoslash-exception-code'><code>" + escapeHtml3(code) + "</code></pre>";
  var html = "\n    <a href='#twoslash-error'><div class='twoslash-fixed-error-note'><span class='twoslash-error-color'></span>Twoslash failure</div></a>\n    <div class='twoslash-exception-message'>" + body + codeSample + "</div>";
  node.type = "html";
  node.value = "<div id='twoslash-error'>" + css + html + "</div>";
  node.children = [];
};
var includes = /* @__PURE__ */ new Map();
function getHTML(code, fence, highlighters, twoslash, twoslashSettings) {
  var replacer = {
    json5: "json"
  };
  if (replacer[fence.lang]) fence.lang = replacer[fence.lang];
  var results;
  if (fence.lang === "twoslash") {
    if (!fence.meta.include || typeof fence.meta.include !== "string") {
      throw new Error("A twoslash code block needs a pragma like 'twoslash include [name]'");
    }
    addIncludes(includes, fence.meta.include, code);
    results = twoslashSettings.wrapFragments ? '<div class="shiki-twoslash-fragment"></div>' : "";
  } else {
    var output = highlighters.map(function(highlighter) {
      var themeName = highlighter.customName.split("/").pop().replace(".json", "");
      return renderCodeToHTML(code, fence.lang, fence.meta, _extends5({
        themeName
      }, twoslashSettings), highlighter, twoslash);
    });
    results = output.join("\n");
    if (highlighters.length > 1 && twoslashSettings.wrapFragments) {
      results = '<div class="shiki-twoslash-fragment">' + results + "</div>";
    }
  }
  return results;
}
var runTwoSlashOnNode = function runTwoSlashOnNode2(code, _ref, settings) {
  var lang = _ref.lang, meta = _ref.meta;
  if (settings === void 0) {
    settings = {};
  }
  var shouldDisableTwoslash = typeof process !== "undefined" && process.env && !!process.env.TWOSLASH_DISABLE;
  if (shouldDisableTwoslash) return void 0;
  if (meta.twoslash) {
    var importedCode = replaceIncludesInCode(includes, code);
    return cachedTwoslashCall(importedCode, lang, settings);
  }
  return void 0;
};
var highlighterCache = /* @__PURE__ */ new Map();
var highlightersFromSettings = function highlightersFromSettings2(settings) {
  var themes = settings.themes || (settings.theme ? [settings.theme] : ["light-plus"]);
  return Promise.all(themes.map((function() {
    var _ref2 = _asyncToGenerator(runtime_1.mark(function _callee(theme) {
      var themeName, highlighter;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              themeName = theme.name || theme;
              _context.next = 3;
              return getHighlighter(_extends5({}, settings, {
                theme,
                themes: void 0
              }));
            case 3:
              highlighter = _context.sent;
              highlighter.customName = themeName;
              return _context.abrupt("return", highlighter);
            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function(_x) {
      return _ref2.apply(this, arguments);
    };
  })()));
};
var parsingNewFile = function parsingNewFile2() {
  return includes.clear();
};
var parseFence = function parseFence2(fence) {
  var _parse;
  var _lex = lex(fence), lang = _lex[0], tokens = _lex.slice(1);
  if (lang === "twoslash") {
    var index = tokens.indexOf("include");
    if (index !== -1) {
      tokens.splice(index + 1, 0, "=");
    }
  }
  var meta = (_parse = parse(tokens)) != null ? _parse : {};
  return {
    lang: (lang || "").toString(),
    meta
  };
};
function remarkTwoslash(settings) {
  if (settings === void 0) {
    settings = {};
  }
  if (!highlighterCache.has(settings)) {
    highlighterCache.set(settings, highlightersFromSettings(settings));
  }
  var transform = (function() {
    var _ref3 = _asyncToGenerator(runtime_1.mark(function _callee2(markdownAST) {
      var highlighters;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return highlighterCache.get(settings);
            case 2:
              highlighters = _context2.sent;
              parsingNewFile();
              (0, import_unist_util_visit.default)(markdownAST, "code", remarkVisitor(highlighters, settings));
            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return function transform2(_x2) {
      return _ref3.apply(this, arguments);
    };
  })();
  return transform;
}
var remarkVisitor = function remarkVisitor2(highlighters, twoslashSettings) {
  if (twoslashSettings === void 0) {
    twoslashSettings = {};
  }
  return function(node) {
    var code = node.value;
    var fence = void 0;
    try {
      fence = parseFence([node.lang, node.meta].filter(Boolean).join(" "));
    } catch (error) {
      var twoslashError = new TwoslashError("Codefence error", "Could not parse the codefence for this code sample", "It's usually an unclosed string", code);
      return setupNodeForTwoslashException(code, node, twoslashError);
    }
    if (Object.keys(fence.meta).filter(function(key) {
      return (twoslashSettings.ignoreCodeblocksWithCodefenceMeta || []).includes(key);
    }).length > 0) {
      return;
    }
    var twoslash;
    try {
      twoslash = node.twoslash || runTwoSlashOnNode(code, fence, twoslashSettings);
    } catch (error) {
      var shouldAlwaysRaise = process && process.env && !!process.env.CI;
      var yeahButNotInTests = typeof jest === "undefined";
      if (shouldAlwaysRaise && yeahButNotInTests || twoslashSettings.alwayRaiseForTwoslashExceptions) {
        throw error;
      } else {
        return setupNodeForTwoslashException(code, node, error);
      }
    }
    if (twoslash) {
      node.value = twoslash.code;
      node.lang = twoslash.extension;
      node.twoslash = twoslash;
    }
    var shikiHTML = getHTML(node.value, fence, highlighters, twoslash, twoslashSettings);
    node.type = "html";
    node.value = shikiHTML;
    node.children = [];
  };
};
var setupForFile = (function() {
  var _ref4 = _asyncToGenerator(runtime_1.mark(function _callee3(settings) {
    var highlighters;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (settings === void 0) {
              settings = {};
            }
            parsingNewFile();
            if (!highlighterCache.has(settings)) {
              highlighterCache.set(settings, highlightersFromSettings(settings));
            }
            _context3.next = 5;
            return highlighterCache.get(settings);
          case 5:
            highlighters = _context3.sent;
            return _context3.abrupt("return", {
              settings,
              highlighters
            });
          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return function setupForFile2(_x3) {
    return _ref4.apply(this, arguments);
  };
})();
var transformAttributesToHTML = function transformAttributesToHTML2(code, fenceString, highlighters, settings) {
  var fence = parseFence(fenceString);
  var twoslash = runTwoSlashOnNode(code, fence, settings);
  var newCode = twoslash && twoslash.code || code;
  return getHTML(newCode, fence, highlighters, twoslash, settings);
};
var remark_shiki_twoslash_esm_default = remarkTwoslash;
export {
  remark_shiki_twoslash_esm_default as default,
  highlightersFromSettings,
  remarkVisitor,
  runTwoSlashOnNode,
  setupForFile,
  transformAttributesToHTML
};
//# sourceMappingURL=remark-shiki-twoslash.esm-ASYLZSMB.js.map
