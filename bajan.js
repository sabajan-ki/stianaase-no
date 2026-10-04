/* Bajanen puster: bassdelen vippes ut rundt hengselet nederst, slik den trekkes ut med
   venstrehånda, og belgen åpner seg som en vifte – mest øverst, nesten lukket nede.
   Uten JavaScript, eller med redusert bevegelse, står den stille litt åpen. */
(function () {
  "use strict";
  var MIN = 1.5, MAKS = 10, PERIODE = 7000; // grader og millisekunder
  var rolig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rolig) return;

  var svgs = Array.prototype.slice.call(document.querySelectorAll("svg.bajan"));
  if (!svgs.length) return;

  var data = svgs.map(function (svg) {
    var d = svg.dataset;
    return {
      top: +d.top, bot: +d.bot, x0: +d.x0, x1: +d.x1, n: +d.n,
      folder: svg.querySelectorAll(".fold"),
      kanter: svg.querySelectorAll(".foldkant"),
      topp: svg.querySelector(".belgtopp"),
      bass: svg.querySelector(".bassdel-g"),
      synlig: true
    };
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (inn) {
      inn.forEach(function (e) {
        var i = svgs.indexOf(e.target);
        if (i > -1) data[i].synlig = e.isIntersecting;
      });
    });
    svgs.forEach(function (s) { io.observe(s); });
  }

  function tegn(g, aGrader) {
    var a = aGrader * Math.PI / 180, h = g.bot - g.top;
    var tx = g.x1 + h * Math.sin(a), ty = g.bot - h * Math.cos(a);
    var topp = [], bunn = [];
    for (var i = 0; i <= g.n; i++) {
      var f = i / g.n;
      bunn.push([g.x0 + (g.x1 - g.x0) * f, g.bot]);
      topp.push([g.x0 + (tx - g.x0) * f, g.top + (ty - g.top) * f]);
    }
    for (var k = 0; k < g.n; k++) {
      g.folder[k].setAttribute("points",
        bunn[k][0].toFixed(2) + "," + bunn[k][1] + " " +
        bunn[k + 1][0].toFixed(2) + "," + bunn[k + 1][1] + " " +
        topp[k + 1][0].toFixed(2) + "," + topp[k + 1][1].toFixed(2) + " " +
        topp[k][0].toFixed(2) + "," + topp[k][1].toFixed(2));
    }
    for (var m = 0; m <= g.n; m++) {
      var l = g.kanter[m];
      l.setAttribute("x2", topp[m][0].toFixed(2));
      l.setAttribute("y2", topp[m][1].toFixed(2));
    }
    g.topp.setAttribute("points", topp.map(function (p) { return p[0].toFixed(2) + "," + p[1].toFixed(2); }).join(" "));
    g.bass.setAttribute("transform", "rotate(" + aGrader.toFixed(3) + " " + g.x1 + " " + g.bot + ")");
  }

  var start = null;
  function steg(tid) {
    if (start === null) start = tid;
    var fase = ((tid - start) % PERIODE) / PERIODE;
    var a = MIN + (MAKS - MIN) * (0.5 - 0.5 * Math.cos(fase * 2 * Math.PI));
    for (var i = 0; i < data.length; i++) if (data[i].synlig) tegn(data[i], a);
    requestAnimationFrame(steg);
  }
  requestAnimationFrame(steg);
})();
