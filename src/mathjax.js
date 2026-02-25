window.MathJax = {
  loader: { load: ["[tex]/bussproofs"] },
  tex: {
    packages: { "[+]": ["bussproofs"] },
  },
  svg: {
    fontCache: "global",
  },
  options: {
    enableMenu: false,
  },
};

(function () {
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js";
  script.defer = true;
  document.head.appendChild(script);
})();
