/*!
 * TOAST UI Editor : Color Syntax Plugin
 * @version 3.0.3 | Thu Apr 14 2022
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("tui-color-picker")) : "function" == typeof define && define.amd ? define(["tui-color-picker"], e) : "object" == typeof exports ? exports.toastui = e(require("tui-color-picker")) : (t.toastui = t.toastui || {}, t.toastui.Editor = t.toastui.Editor || {}, t.toastui.Editor.plugin = t.toastui.Editor.plugin || {}, t.toastui.Editor.plugin.colorSyntax = e(t.tui.colorPicker))
}(self, (function(t) {
    return function() {
        "use strict";
        var e = {
                858: function(e) {
                    e.exports = t
                }
            },
            o = {};

        function r(t) {
            var n = o[t];
            if (void 0 !== n) return n.exports;
            var a = o[t] = {
                exports: {}
            };
            return e[t](a, a.exports, r), a.exports
        }
        r.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return r.d(e, {
                a: e
            }), e
        }, r.d = function(t, e) {
            for (var o in e) r.o(e, o) && !r.o(t, o) && Object.defineProperty(t, o, {
                enumerable: !0,
                get: e[o]
            })
        }, r.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        };
        var n = {};
        return function() {
            r.d(n, {
                default: function() {
                    return s
                }
            });
            var t = r(858),
                e = r.n(t);

            function o(t, e) {
                return t.classList.contains(e)
            }
            var a, u, c = "toastui-editor-";

            function i(t, e) {
                return function(t, e) {
                    for (var r = t; r && !o(r, e);) r = r.parentElement;
                    return r
                }(t, c + "defaultUI").querySelector("." + e + " .ProseMirror")
            }

            function s(t, o) {
                void 0 === o && (o = {});
                var r = t.eventEmitter,
                    n = t.i18n,
                    s = t.usageStatistics,
                    l = void 0 === s || s,
                    g = t.pmState,
                    p = o.preset,
                    d = document.createElement("div"),
                    f = {
                        container: d,
                        usageStatistics: l
                    };
                ! function(t) {
                    t.setLanguage("ar", {
                        "Text color": "لون النص"
                    }), t.setLanguage(["cs", "cs-CZ"], {
                        "Text color": "Barva textu"
                    }), t.setLanguage(["de", "de-DE"], {
                        "Text color": "Textfarbe"
                    }), t.setLanguage(["en", "en-US"], {
                        "Text color": "Text color"
                    }), t.setLanguage(["es", "es-ES"], {
                        "Text color": "Color del texto"
                    }), t.setLanguage(["fi", "fi-FI"], {
                        "Text color": "Tekstin väri"
                    }), t.setLanguage(["fr", "fr-FR"], {
                        "Text color": "Couleur du texte"
                    }), t.setLanguage(["gl", "gl-ES"], {
                        "Text color": "Cor do texto"
                    }), t.setLanguage(["hr", "hr-HR"], {
                        "Text color": "Boja teksta"
                    }), t.setLanguage(["it", "it-IT"], {
                        "Text color": "Colore del testo"
                    }), t.setLanguage(["ja", "ja-JP"], {
                        "Text color": "文字色相"
                    }), t.setLanguage(["ko", "ko-KR"], {
                        "Text color": "글자 색상"
                    }), t.setLanguage(["nb", "nb-NO"], {
                        "Text color": "Tekstfarge"
                    }), t.setLanguage(["nl", "nl-NL"], {
                        "Text color": "Tekstkleur"
                    }), t.setLanguage(["pl", "pl-PL"], {
                        "Text color": "Kolor tekstu"
                    }), t.setLanguage(["pt", "pt-BR"], {
                        "Text color": "Cor do texto"
                    }), t.setLanguage(["ru", "ru-RU"], {
                        "Text color": "Цвет текста"
                    }), t.setLanguage(["sv", "sv-SE"], {
                        "Text color": "Textfärg"
                    }), t.setLanguage(["tr", "tr-TR"], {
                        "Text color": "Metin rengi"
                    }), t.setLanguage(["uk", "uk-UA"], {
                        "Text color": "Колір тексту"
                    }), t.setLanguage("zh-CN", {
                        "Text color": "文字颜色"
                    }), t.setLanguage("zh-TW", {
                        "Text color": "文字顏色"
                    })
                }(n), p && (f.preset = p);
                var x = e().create(f),
                    m = function(t) {
                        var e = document.createElement("button");
                        return e.setAttribute("type", "button"), e.textContent = t, e
                    }(n.get("OK"));
                r.listen("focus", (function(t) {
                    a = c + ("markdown" === t ? "md" : "ww") + "-container"
                })), d.addEventListener("click", (function(t) {
                    if ("button" === t.target.getAttribute("type")) {
                        var e = x.getColor();
                        u = i(d, a), r.emit("command", "color", {
                            selectedColor: e
                        }), r.emit("closePopup"), u.focus()
                    }
                })), x.slider.toggle(!0), d.appendChild(m);
                var T = function(t, e) {
                    return {
                        name: "color",
                        tooltip: e.get("Text color"),
                        className: c + "toolbar-icons color",
                        popup: {
                            className: c + "popup-color",
                            body: t,
                            style: {
                                width: "auto"
                            }
                        }
                    }
                }(d, n);
                return {
                    markdownCommands: {
                        color: function(t, e, o) {
                            var r = t.selectedColor,
                                n = e.tr,
                                a = e.selection,
                                u = e.schema;
                            if (r) {
                                var c = a.content(),
                                    i = '<span style="color: ' + r + '">',
                                    s = "</span>",
                                    l = "" + i + c.content.textBetween(0, c.content.size, "\n") + s;
                                return n.replaceSelectionWith(u.text(l)).setSelection(function(t, e, o, r, n) {
                                    var a = t.mapping,
                                        u = t.doc,
                                        c = e.from,
                                        i = e.to,
                                        s = e.empty,
                                        l = a.map(c) + r.length,
                                        g = a.map(i) - n.length;
                                    return s ? o.create(u, g, g) : o.create(u, l, g)
                                }(n, a, g.TextSelection, i, s)), o(n), !0
                            }
                            return !1
                        }
                    },
                    wysiwygCommands: {
                        color: function(t, e, o) {
                            var r = t.selectedColor,
                                n = e.tr,
                                a = e.selection,
                                u = e.schema;
                            if (r) {
                                var c = a.from,
                                    i = a.to,
                                    s = {
                                        htmlAttrs: {
                                            style: "color: " + r
                                        }
                                    },
                                    l = u.marks.span.create(s);
                                return n.addMark(c, i, l), o(n), !0
                            }
                            return !1
                        }
                    },
                    toolbarItems: [{
                        groupIndex: 0,
                        itemIndex: 3,
                        item: T
                    }],
                    toHTMLRenderers: {
                        htmlInline: {
                            span: function(t, e) {
                                return e.entering ? {
                                    type: "openTag",
                                    tagName: "span",
                                    attributes: t.attrs
                                } : {
                                    type: "closeTag",
                                    tagName: "span"
                                }
                            }
                        }
                    }
                }
            }
        }(), n = n.default
    }()
}));