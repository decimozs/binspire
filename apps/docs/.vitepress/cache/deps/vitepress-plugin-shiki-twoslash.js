import "./chunk-7D4SUZUM.js";

// ../../node_modules/.bun/vitepress-plugin-shiki-twoslash@0.0.6+4f95027bf3978a5e/node_modules/vitepress-plugin-shiki-twoslash/dist/vitepress-plugin-shiki-twoslash.es.mjs
async function C(t) {
  var r, m;
  const { setupForFile: h, transformAttributesToHTML: u } = await import("./remark-shiki-twoslash.esm-ASYLZSMB.js");
  t.markdown || (t.markdown = {});
  const w = t.markdown.config || (() => null), e = (r = t.markdown) == null ? void 0 : r.theme;
  let s = ["material-theme-palenight"];
  (m = t.twoslash) != null && m.themes ? s = t.twoslash.themes : typeof e == "object" ? "dark" in e && "light" in e ? s = [e.dark, e.light] : s = [e] : typeof e == "string" && (s = [e]);
  const i = {
    theme: s[0],
    themes: s,
    ...t.twoslash
  }, { highlighters: d } = await h(i);
  t.markdown.config = (o) => {
    const k = o.options.highlight;
    o.options.highlight = (n, a, l) => {
      const p = a === "twoslash";
      if (p || /twoslash/.test(l)) {
        const y = u(
          n.replace(/\r?\n$/, ""),
          // strip trailing newline fed during code block parsing
          [a, l].join(" "),
          d,
          {
            ...i,
            addTryButton: /noplayground/.test(l) ? void 0 : i.addTryButton
          }
        );
        return p ? "<pre />" : y;
      }
      return k(n, a, l);
    }, w(o);
  }, t.vue || (t.vue = {}), t.vue.template || (t.vue.template = {}), t.vue.template.compilerOptions || (t.vue.template.compilerOptions = {});
  const v = t.vue.template.compilerOptions.isCustomElement ?? (() => false);
  return t.vue.template.compilerOptions = {
    ...t.vue.template.compilerOptions,
    isCustomElement(o) {
      return v(o) || o.includes("data-lsp");
    }
  }, t;
}
export {
  C as withTwoslash
};
//# sourceMappingURL=vitepress-plugin-shiki-twoslash.js.map
