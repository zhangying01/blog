parcelRequire = function (e) {
    var r = "function" == typeof parcelRequire && parcelRequire, n = "function" == typeof require && require, i = {};

    function u(e, u) {
        if (e in i) return i[e];
        var t = "function" == typeof parcelRequire && parcelRequire;
        if (!u && t) return t(e, !0);
        if (r) return r(e, !0);
        if (n && "string" == typeof e) return n(e);
        var o = new Error("Cannot find module '" + e + "'");
        throw o.code = "MODULE_NOT_FOUND", o
    }

    return u.register = function (e, r) {
        i[e] = r
    }, i = e(u), u.modules = i, u
}(function (require) {
    var d = {};

    function l(e) {
        for (var r, o = /\+/g, n = /([^&=]+)=?([^&]*)/g, p = function (e) {
            return decodeURIComponent(e.replace(o, " "))
        }, a = {}; r = n.exec(e);) a[p(r[1])] = p(r[2]);
        return a
    }

    function g(e) {
        var r = [];
        for (var o in e) e.hasOwnProperty(o) && e[o] && r.push(encodeURIComponent(o) + "=" + encodeURIComponent(e[o]));
        return r.join("&")
    }

    d.deparam = l, d.param = g;
    var f = {}, m = window.matchMedia("(prefers-color-scheme: dark)").matches ? "github-dark" : "github-light";
    f.preferredTheme = m;
    var q = "preferred-color-scheme";
    f.preferredThemeId = q;
    var h = l(location.search.substr(1)), i = h.utterances;
    if (i) {
        localStorage.setItem("utterances-session", i), delete h.utterances;
        var j = g(h);
        j.length && (j = "?" + j), history.replaceState(void 0, document.title, location.pathname + j + location.hash)
    }
    var c = document.currentScript;
    void 0 === c && (c = document.querySelector("script[src^=\"https://utteranc.es/client.js\"],script[src^=\"http://localhost:4000/client.js\"]"));
    for (var b = {}, k = 0; k < c.attributes.length; k++) {
        var s = c.attributes.item(k);
        b[s.name.replace(/^data-/, "")] = s.value
    }
    b.theme === q && (b.theme = m);
    var u = document.querySelector("link[rel='canonical']");
    b.url = u ? u.href : location.origin + location.pathname + location.search, b.origin = location.origin, b.pathname = location.pathname.length < 2 ? "index" : location.pathname.substr(1).replace(/\.\w+$/, ""), b.title = document.title;
    console.log("b.url" + b.url)
    var v = document.querySelector("meta[name='description']");
    b.description = v ? v.content : "";
    var w = encodeURIComponent(b.description).length;
    w > 1e3 && (b.description = b.description.substr(0, Math.floor(1e3 * b.description.length / w)));
    var x = document.querySelector("meta[property='og:title'],meta[name='og:title']");
    b["og:title"] = x ? x.content : "", b.session = i || localStorage.getItem("utterances-session") || "", document.head.insertAdjacentHTML("afterbegin", "<style>\n    .utterances {\n      position: relative;\n      box-sizing: border-box;\n      width: 100%;\n      max-width: 760px;\n      margin-left: auto;\n      margin-right: auto;\n    }\n    .utterances-frame {\n      position: absolute;\n      left: 0;\n      right: 0;\n      width: 1px;\n      min-width: 100%;\n      max-width: 100%;\n      height: 100%;\n      border: 0;\n    }\n  </style>");
    var y = c.src.match(/^https:\/\/utteranc\.es|http:\/\/localhost:\d+/)[0], z = y + "/utterances.html";
    c.insertAdjacentHTML("afterend", "<div class=\"utterances\">\n    <iframe class=\"utterances-frame\" title=\"Comments\" scrolling=\"no\" src=\"" + z + "?" + g(b) + "\" loading=\"lazy\"></iframe>\n  </div>");
    var A = c.nextElementSibling;
    c.parentElement.removeChild(c), addEventListener("message", function (t) {
        if (t.origin === y) {
            var r = t.data;
            r && "resize" === r.type && r.height && (A.style.height = r.height + "px")
        }
    });
    d.__esModule = true;
    f.__esModule = true;
    return {"D53L": {}, "ieWq": d, "N98m": f};
});