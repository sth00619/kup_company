/*!
 * TOAST UI Color Picker
 * @version 2.2.8
 * @author NHN Cloud FE Development Team <dl_javascript@nhn.com>
 * @license MIT
 */
! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.colorPicker = e() : (t.tui = t.tui || {}, t.tui.colorPicker = e())
}(window, (function() {
    return function(t) {
        var e = {};

        function r(n) {
            if (e[n]) return e[n].exports;
            var o = e[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return t[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports
        }
        return r.m = t, r.c = e, r.d = function(t, e, n) {
            r.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: n
            })
        }, r.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, r.t = function(t, e) {
            if (1 & e && (t = r(t)), 8 & e) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if (r.r(n), Object.defineProperty(n, "default", {
                    enumerable: !0,
                    value: t
                }), 2 & e && "string" != typeof t)
                for (var o in t) r.d(n, o, function(e) {
                    return t[e]
                }.bind(null, o));
            return n
        }, r.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return r.d(e, "a", e), e
        }, r.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, r.p = "dist", r(r.s = 33)
    }([function(t, e, r) {
        "use strict";
        t.exports = function(t, e) {
            var r, n, o, i, s = Object.prototype.hasOwnProperty;
            for (o = 1, i = arguments.length; o < i; o += 1)
                for (n in r = arguments[o]) s.call(r, n) && (t[n] = r[n]);
            return t
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return t instanceof Array
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(1),
            o = r(6),
            i = r(7);
        t.exports = function(t, e, r) {
            n(t) ? o(t, e, r) : i(t, e, r)
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return void 0 === t
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(22),
            o = r(2),
            i = r(6),
            s = r(7),
            a = r(37),
            c = 0,
            l = {
                getLength: function(t) {
                    var e = 0;
                    return s(t, (function() {
                        e += 1
                    })), e
                },
                map: function(t, e, r) {
                    var n = [];
                    return o(t, (function() {
                        n.push(e.apply(r || null, arguments))
                    })), n
                },
                filter: function(t, e, r) {
                    var n = [];
                    return i(t, (function(t) {
                        e.apply(r || null, arguments) && n.push(t)
                    })), n
                },
                generateId: function() {
                    return c += 1
                },
                isOldBrowser: n.msie && n.version < 9,
                sendHostName: function() {
                    a("color-picker", "UA-129987462-1")
                }
            };
        t.exports = l
    }, function(t, e, r) {
        "use strict";
        var n = r(1);
        t.exports = function(t, e, r) {
            var o, i;
            if (r = r || 0, !n(e)) return -1;
            if (Array.prototype.indexOf) return Array.prototype.indexOf.call(e, t, r);
            for (i = e.length, o = r; r >= 0 && o < i; o += 1)
                if (e[o] === t) return o;
            return -1
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t, e, r) {
            var n = 0,
                o = t.length;
            for (r = r || null; n < o && !1 !== e.call(r, t[n], n, t); n += 1);
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t, e, r) {
            var n;
            for (n in r = r || null, t)
                if (t.hasOwnProperty(n) && !1 === e.call(r, t[n], n, t)) break
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(39),
            o = r(13),
            i = r(41),
            s = r(3),
            a = r(9),
            c = r(19),
            l = r(4);

        function u(t, e) {
            var r = l.generateId();
            t = t || {}, s(e) && (e = a.appendHTMLElement("div")), n(e, "tui-view-" + r), this.id = r, this.container = e, this.childs = new c((function(t) {
                return t.id
            })), this.parent = null
        }
        u.prototype.addChild = function(t, e) {
            e && e.call(t, this), t.parent = this, this.childs.add(t)
        }, u.prototype.removeChild = function(t, e) {
            var r = i(t) ? this.childs.items[t] : t;
            e && e.call(r, this), this.childs.remove(r.id)
        }, u.prototype.render = function() {
            this.childs.each((function(t) {
                t.render()
            }))
        }, u.prototype.recursive = function(t, e) {
            o(t) && (e || t(this), this.childs.each((function(e) {
                e.recursive(t)
            })))
        }, u.prototype.resize = function() {
            for (var t = Array.prototype.slice.call(arguments), e = this.parent; e;) o(e._onResize) && e._onResize.apply(e, t), e = e.parent
        }, u.prototype._beforeDestroy = function() {}, u.prototype._destroy = function() {
            this._beforeDestroy(), this.container.innerHTML = "", this.id = this.parent = this.childs = this.container = null
        }, u.prototype.destroy = function(t) {
            this.childs && (this.childs.each((function(t) {
                t.destroy(!0), t._destroy()
            })), this.childs.clear()), t || this._destroy()
        }, u.prototype.getViewBound = function() {
            var t = this.container.getBoundingClientRect();
            return {
                x: t.left,
                y: t.top,
                width: t.right - t.left,
                height: t.bottom - t.top
            }
        }, t.exports = u
    }, function(t, e, r) {
        "use strict";
        var n = {
            appendHTMLElement: function(t, e, r) {
                var n = document.createElement(t);
                return n.className = r || "", e ? e.appendChild(n) : document.body.appendChild(n), n
            }
        };
        t.exports = n
    }, function(t, e, r) {
        "use strict";
        var n = r(0),
            o = r(20),
            i = r(11),
            s = r(21),
            a = r(1),
            c = r(13),
            l = r(2),
            u = /\s+/g;

        function f() {
            this.events = null, this.contexts = null
        }
        f.mixin = function(t) {
            n(t.prototype, f.prototype)
        }, f.prototype._getHandlerItem = function(t, e) {
            var r = {
                handler: t
            };
            return e && (r.context = e), r
        }, f.prototype._safeEvent = function(t) {
            var e, r = this.events;
            return r || (r = this.events = {}), t && ((e = r[t]) || (e = [], r[t] = e), r = e), r
        }, f.prototype._safeContext = function() {
            var t = this.contexts;
            return t || (t = this.contexts = []), t
        }, f.prototype._indexOfContext = function(t) {
            for (var e = this._safeContext(), r = 0; e[r];) {
                if (t === e[r][0]) return r;
                r += 1
            }
            return -1
        }, f.prototype._memorizeContext = function(t) {
            var e, r;
            o(t) && (e = this._safeContext(), (r = this._indexOfContext(t)) > -1 ? e[r][1] += 1 : e.push([t, 1]))
        }, f.prototype._forgetContext = function(t) {
            var e, r;
            o(t) && (e = this._safeContext(), (r = this._indexOfContext(t)) > -1 && (e[r][1] -= 1, e[r][1] <= 0 && e.splice(r, 1)))
        }, f.prototype._bindEvent = function(t, e, r) {
            var n = this._safeEvent(t);
            this._memorizeContext(r), n.push(this._getHandlerItem(e, r))
        }, f.prototype.on = function(t, e, r) {
            var n = this;
            i(t) ? (t = t.split(u), l(t, (function(t) {
                n._bindEvent(t, e, r)
            }))) : s(t) && (r = e, l(t, (function(t, e) {
                n.on(e, t, r)
            })))
        }, f.prototype.once = function(t, e, r) {
            var n = this;
            if (s(t)) return r = e, void l(t, (function(t, e) {
                n.once(e, t, r)
            }));
            this.on(t, (function o() {
                e.apply(r, arguments), n.off(t, o, r)
            }), r)
        }, f.prototype._spliceMatches = function(t, e) {
            var r, n = 0;
            if (a(t))
                for (r = t.length; n < r; n += 1) !0 === e(t[n]) && (t.splice(n, 1), r -= 1, n -= 1)
        }, f.prototype._matchHandler = function(t) {
            var e = this;
            return function(r) {
                var n = t === r.handler;
                return n && e._forgetContext(r.context), n
            }
        }, f.prototype._matchContext = function(t) {
            var e = this;
            return function(r) {
                var n = t === r.context;
                return n && e._forgetContext(r.context), n
            }
        }, f.prototype._matchHandlerAndContext = function(t, e) {
            var r = this;
            return function(n) {
                var o = t === n.handler,
                    i = e === n.context,
                    s = o && i;
                return s && r._forgetContext(n.context), s
            }
        }, f.prototype._offByEventName = function(t, e) {
            var r = this,
                n = c(e),
                o = r._matchHandler(e);
            t = t.split(u), l(t, (function(t) {
                var e = r._safeEvent(t);
                n ? r._spliceMatches(e, o) : (l(e, (function(t) {
                    r._forgetContext(t.context)
                })), r.events[t] = [])
            }))
        }, f.prototype._offByHandler = function(t) {
            var e = this,
                r = this._matchHandler(t);
            l(this._safeEvent(), (function(t) {
                e._spliceMatches(t, r)
            }))
        }, f.prototype._offByObject = function(t, e) {
            var r, n = this;
            this._indexOfContext(t) < 0 ? l(t, (function(t, e) {
                n.off(e, t)
            })) : i(e) ? (r = this._matchContext(t), n._spliceMatches(this._safeEvent(e), r)) : c(e) ? (r = this._matchHandlerAndContext(e, t), l(this._safeEvent(), (function(t) {
                n._spliceMatches(t, r)
            }))) : (r = this._matchContext(t), l(this._safeEvent(), (function(t) {
                n._spliceMatches(t, r)
            })))
        }, f.prototype.off = function(t, e) {
            i(t) ? this._offByEventName(t, e) : arguments.length ? c(t) ? this._offByHandler(t) : s(t) && this._offByObject(t, e) : (this.events = {}, this.contexts = [])
        }, f.prototype.fire = function(t) {
            this.invoke.apply(this, arguments)
        }, f.prototype.invoke = function(t) {
            var e, r, n, o;
            if (!this.hasListener(t)) return !0;
            for (e = this._safeEvent(t), r = Array.prototype.slice.call(arguments, 1), n = 0; e[n];) {
                if (!1 === (o = e[n]).handler.apply(o.context, r)) return !1;
                n += 1
            }
            return !0
        }, f.prototype.hasListener = function(t) {
            return this.getListenerLength(t) > 0
        }, f.prototype.getListenerLength = function(t) {
            return this._safeEvent(t).length
        }, t.exports = f
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return "string" == typeof t || t instanceof String
        }
    }, function(t, e, r) {
        "use strict";
        var n = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,
            o = {
                leadingZero: function(t, e) {
                    var r = "",
                        n = 0;
                    if ((t + "").length > e) return t + "";
                    for (; n < e - 1; n += 1) r += "0";
                    return (r + t).slice(-1 * e)
                },
                isValidRGB: function(t) {
                    return n.test(t)
                },
                // @license RGB <-> HSV conversion utilities based off of http://www.cs.rit.edu/~ncs/color/t_convert.html
                hexToRGB: function(t) {
                    return !!o.isValidRGB(t) && (t = t.substring(1), [parseInt(t.substr(0, 2), 16), parseInt(t.substr(2, 2), 16), parseInt(t.substr(4, 2), 16)])
                },
                rgbToHEX: function(t, e, r) {
                    var n = "#" + o.leadingZero(t.toString(16), 2) + o.leadingZero(e.toString(16), 2) + o.leadingZero(r.toString(16), 2);
                    return !!o.isValidRGB(n) && n
                },
                rgbToHSV: function(t, e, r) {
                    var n, o, i, s, a, c;
                    if (t /= 255, e /= 255, r /= 255, a = n = Math.max(t, e, r), c = n - (o = Math.min(t, e, r)), s = 0 === n ? 0 : c / n, n === o) i = 0;
                    else {
                        switch (n) {
                            case t:
                                i = (e - r) / c + (e < r ? 6 : 0);
                                break;
                            case e:
                                i = (r - t) / c + 2;
                                break;
                            case r:
                                i = (t - e) / c + 4
                        }
                        i /= 6
                    }
                    return [Math.round(360 * i), Math.round(100 * s), Math.round(100 * a)]
                },
                hsvToRGB: function(t, e, r) {
                    var n, o, i, s, a, c, l, u;
                    if (t = Math.max(0, Math.min(360, t)), e = Math.max(0, Math.min(100, e)), r = Math.max(0, Math.min(100, r)), r /= 100, 0 === (e /= 100)) return n = o = i = r, [Math.round(255 * n), Math.round(255 * o), Math.round(255 * i)];
                    switch (c = r * (1 - e), l = r * (1 - e * (a = (t /= 60) - (s = Math.floor(t)))), u = r * (1 - e * (1 - a)), s) {
                        case 0:
                            n = r, o = u, i = c;
                            break;
                        case 1:
                            n = l, o = r, i = c;
                            break;
                        case 2:
                            n = c, o = r, i = u;
                            break;
                        case 3:
                            n = c, o = l, i = r;
                            break;
                        case 4:
                            n = u, o = c, i = r;
                            break;
                        default:
                            n = r, o = c, i = l
                    }
                    return [Math.round(255 * n), Math.round(255 * o), Math.round(255 * i)]
                }
            };
        t.exports = o
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return t instanceof Function
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(11),
            o = r(2),
            i = r(26);

        function s(t, e, r, n) {
            function s(e) {
                r.call(n || t, e || window.event)
            }
            "addEventListener" in t ? t.addEventListener(e, s) : "attachEvent" in t && t.attachEvent("on" + e, s),
                function(t, e, r, n) {
                    var s = i(t, e),
                        a = !1;
                    o(s, (function(t) {
                        return t.handler !== r || (a = !0, !1)
                    })), a || s.push({
                        handler: r,
                        wrappedHandler: n
                    })
                }(t, e, r, s)
        }
        t.exports = function(t, e, r, i) {
            n(e) ? o(e.split(/\s+/g), (function(e) {
                s(t, e, r, i)
            })) : o(e, (function(e, n) {
                s(t, n, e, r)
            }))
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            t.preventDefault ? t.preventDefault() : t.returnValue = !1
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return t.replace(/([A-Z])/g, (function(t) {
                return "-" + t.toLowerCase()
            }))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(11),
            o = r(2),
            i = r(26);

        function s(t, e, r) {
            var n, s = i(t, e);
            r ? (o(s, (function(o, i) {
                return r !== o.handler || (a(t, e, o.wrappedHandler), n = i, !1)
            })), s.splice(n, 1)) : (o(s, (function(r) {
                a(t, e, r.wrappedHandler)
            })), s.splice(0, s.length))
        }

        function a(t, e, r) {
            "removeEventListener" in t ? t.removeEventListener(e, r) : "detachEvent" in t && t.detachEvent("on" + e, r)
        }
        t.exports = function(t, e, r) {
            n(e) ? o(e.split(/\s+/g), (function(e) {
                s(t, e, r)
            })) : o(e, (function(e, r) {
                s(t, r, e)
            }))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(50);
        t.exports = function(t, e) {
            var r = n(e.prototype);
            r.constructor = t, t.prototype = r
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(6),
            o = r(7),
            i = r(0),
            s = r(1),
            a = r(20),
            c = r(13),
            l = r(21),
            u = r(4),
            f = Array.prototype.slice;

        function h(t) {
            this.items = {}, this.length = 0, c(t) && (this.getItemID = t)
        }
        h.and = function(t) {
            var e;
            return t = f.call(arguments), e = t.length,
                function(r) {
                    for (var n = 0; n < e; n += 1)
                        if (!t[n].call(null, r)) return !1;
                    return !0
                }
        }, h.or = function(t) {
            var e;
            return t = f.call(arguments), e = t.length,
                function(r) {
                    for (var n = 1, o = t[0].call(null, r); n < e; n += 1) o = o || t[n].call(null, r);
                    return o
                }
        }, h.merge = function(t) {
            var e = {},
                r = new h(t.getItemID);
            return n(arguments, (function(t) {
                i(e, t.items)
            })), r.items = e, r.length = u.getLength(r.items), r
        }, h.prototype.getItemID = function(t) {
            return t._id + ""
        }, h.prototype.add = function(t) {
            var e, r;
            arguments.length > 1 ? n(f.call(arguments), (function(t) {
                this.add(t)
            }), this) : (e = this.getItemID(t), (r = this.items)[e] || (this.length += 1), r[e] = t)
        }, h.prototype.remove = function(t) {
            var e, r, n = [];
            return this.length ? arguments.length > 1 ? n = u.map(f.call(arguments), (function(t) {
                return this.remove(t)
            }), this) : (e = this.items, l(t) && (t = this.getItemID(t)), e[t] ? (this.length -= 1, r = e[t], delete e[t], r) : n) : n
        }, h.prototype.clear = function() {
            this.items = {}, this.length = 0
        }, h.prototype.has = function(t) {
            var e, r;
            return !!this.length && (e = c(t), r = !1, e ? this.each((function(e) {
                return !0 !== t(e) || (r = !0, !1)
            })) : (t = l(t) ? this.getItemID(t) : t, r = a(this.items[t])), r)
        }, h.prototype.doWhenHas = function(t, e, r) {
            var n = this.items[t];
            a(n) && e.call(r || this, n)
        }, h.prototype.find = function(t) {
            var e = new h;
            return this.hasOwnProperty("getItemID") && (e.getItemID = this.getItemID), this.each((function(r) {
                !0 === t(r) && e.add(r)
            })), e
        }, h.prototype.groupBy = function(t, e) {
            var r, o, i = {},
                a = c(t),
                l = this.getItemID;
            if (s(t)) {
                if (n(t, (function(t) {
                        i[t + ""] = new h(l)
                    })), !e) return i;
                t = e, a = !0
            }
            return this.each((function(e) {
                a ? o = t(e) : (o = e[t], c(o) && (o = o.apply(e))), (r = i[o]) || (r = i[o] = new h(l)), r.add(e)
            })), i
        }, h.prototype.single = function() {
            var t;
            return this.each((function(e) {
                return t = e, !1
            }), this), t
        }, h.prototype.sort = function(t) {
            var e = [];
            return this.each((function(t) {
                e.push(t)
            })), c(t) && (e = e.sort(t)), e
        }, h.prototype.each = function(t, e) {
            o(this.items, t, e || this)
        }, h.prototype.toArray = function() {
            return this.length ? u.map(this.items, (function(t) {
                return t
            })) : []
        }, t.exports = h
    }, function(t, e, r) {
        "use strict";
        var n = r(3),
            o = r(36);
        t.exports = function(t) {
            return !n(t) && !o(t)
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return t === Object(t)
        }
    }, function(t, e, r) {
        "use strict";
        var n, o, i, s, a, c, l, u, f, h, p = {
            chrome: !1,
            firefox: !1,
            safari: !1,
            msie: !1,
            edge: !1,
            others: !1,
            version: 0
        };
        "undefined" != typeof window && window.navigator && (i = window.navigator, s = i.appName.replace(/\s/g, "_"), a = i.userAgent, c = /MSIE\s([0-9]+[.0-9]*)/, l = /Trident.*rv:11\./, u = /Edge\/(\d+)\./, f = {
            firefox: /Firefox\/(\d+)\./,
            chrome: /Chrome\/(\d+)\./,
            safari: /Version\/([\d.]+).*Safari\/(\d+)/
        }, (h = {
            Microsoft_Internet_Explorer: function() {
                var t = a.match(c);
                t ? (p.msie = !0, p.version = parseFloat(t[1])) : p.others = !0
            },
            Netscape: function() {
                var t = !1;
                if (l.exec(a)) p.msie = !0, p.version = 11, t = !0;
                else if (u.exec(a)) p.edge = !0, p.version = a.match(u)[1], t = !0;
                else
                    for (n in f)
                        if (f.hasOwnProperty(n) && (o = a.match(f[n])) && o.length > 1) {
                            p[n] = t = !0, p.version = parseFloat(o[1] || 0);
                            break
                        } t || (p.others = !0)
            }
        })[s] && h[s]()), t.exports = p
    }, function(t, e, r) {
        "use strict";
        var n = r(3);
        t.exports = function(t) {
            return t && t.className ? n(t.className.baseVal) ? t.className : t.className.baseVal : ""
        }
    }, function(t, e, r) {
        "use strict";
        (function(e) {
            var n = r(10),
                o = r(42),
                i = r(44),
                s = r(47),
                a = r(28),
                c = r(17),
                l = r(14),
                u = r(15),
                f = r(0);

            function h(t, e) {
                l(e, "mousedown", this._onMouseDown, this), this.options = f({
                    distance: 10
                }, t), this.container = e, this._isMoved = !1, this._distance = 0, this._dragStartFired = !1, this._dragStartEventData = null
            }
            h.prototype.destroy = function() {
                c(this.container, "mousedown", this._onMouseDown), this.options = this.container = this._isMoved = this._distance = this._dragStartFired = this._dragStartEventData = null
            }, h.prototype._toggleDragEvent = function(t) {
                var r = this.container;
                t ? (o(r), l(window, "dragstart", u), l(e.document, {
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp
                }, this)) : (i(r), c(window, "dragstart", u), c(e.document, {
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp
                }))
            }, h.prototype._getEventData = function(t) {
                return {
                    target: a(t),
                    originEvent: t
                }
            }, h.prototype._onMouseDown = function(t) {
                0 === s(t) && (this._distance = 0, this._dragStartFired = !1, this._dragStartEventData = this._getEventData(t), this._toggleDragEvent(!0))
            }, h.prototype._onMouseMove = function(t) {
                var e = this.options.distance;
                u(t), this._isMoved = !0, this._distance < e ? this._distance += 1 : this._dragStartFired || (this._dragStartFired = !0, this.invoke("dragStart", this._dragStartEventData)) ? this.fire("drag", this._getEventData(t)) : this._toggleDragEvent(!1)
            }, h.prototype._onMouseUp = function(t) {
                if (this._toggleDragEvent(!1), this._isMoved) return this._isMoved = !1, void this.fire("dragEnd", this._getEventData(t));
                this.fire("click", this._getEventData(t))
            }, n.mixin(h), t.exports = h
        }).call(this, r(25))
    }, function(t, e) {
        var r;
        r = function() {
            return this
        }();
        try {
            r = r || new Function("return this")()
        } catch (t) {
            "object" == typeof window && (r = window)
        }
        t.exports = r
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t, e) {
            var r, n = t._feEventKey;
            return n || (n = t._feEventKey = {}), (r = n[e]) || (r = n[e] = []), r
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            var e, r, n = document.documentElement.style;
            for (e = 0, r = t.length; e < r; e += 1)
                if (t[e] in n) return t[e];
            return !1
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return t.target || t.srcElement
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(10),
            o = r(28),
            i = r(17),
            s = r(14),
            a = r(30),
            c = r(0),
            l = r(18),
            u = r(9),
            f = r(12),
            h = r(8),
            p = r(51);

        function d(t, e) {
            this.options = c({
                cssPrefix: "tui-colorpicker-",
                preset: ["#181818", "#282828", "#383838", "#585858", "#B8B8B8", "#D8D8D8", "#E8E8E8", "#F8F8F8", "#AB4642", "#DC9656", "#F7CA88", "#A1B56C", "#86C1B9", "#7CAFC2", "#BA8BAF", "#A16946"],
                detailTxt: "Detail"
            }, t), e = u.appendHTMLElement("div", e, this.options.cssPrefix + "palette-container"), h.call(this, t, e)
        }
        l(d, h), d.prototype._onClick = function(t) {
            var e = this.options,
                r = o(t),
                n = {};
            if (a(r, e.cssPrefix + "palette-button")) return n.color = r.value, void this.fire("_selectColor", n);
            a(r, e.cssPrefix + "palette-toggle-slider") && this.fire("_toggleSlider")
        }, d.prototype._onChange = function(t) {
            var e = this.options,
                r = o(t),
                n = {};
            a(r, e.cssPrefix + "palette-hex") && (n.color = r.value, this.fire("_selectColor", n))
        }, d.prototype._beforeDestroy = function() {
            this._toggleEvent(!1)
        }, d.prototype._toggleEvent = function(t) {
            var e, r = this.options,
                n = this.container,
                o = t ? s : i;
            o(n, "click", this._onClick, this), (e = n.querySelector("." + r.cssPrefix + "palette-hex", n)) && o(e, "change", this._onChange, this)
        }, d.prototype.render = function(t) {
            var e, r = this.options;
            this._toggleEvent(!1), e = p({
                cssPrefix: r.cssPrefix,
                preset: r.preset,
                detailTxt: r.detailTxt,
                color: t,
                isValidRGB: f.isValidRGB,
                getItemClass: function(t) {
                    return t ? "" : " " + r.cssPrefix + "color-transparent"
                },
                isSelected: function(e) {
                    return e === t ? " " + r.cssPrefix + "selected" : ""
                }
            }), this.container.innerHTML = e, this._toggleEvent(!0)
        }, n.mixin(d), t.exports = d
    }, function(t, e, r) {
        "use strict";
        var n = r(5),
            o = r(23);
        t.exports = function(t, e) {
            var r;
            return t.classList ? t.classList.contains(e) : (r = o(t).split(/\s+/), n(e, r) > -1)
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(10),
            o = r(53),
            i = r(54),
            s = r(30),
            a = r(0),
            c = r(18),
            l = r(9),
            u = r(32),
            f = r(12),
            h = r(8),
            p = r(24),
            d = r(57);

        function v(t, e) {
            (e = l.appendHTMLElement("div", e, t.cssPrefix + "slider-container")).style.display = "none", h.call(this, t, e), this.options = a({
                color: "#f8f8f8",
                cssPrefix: "tui-colorpicker-"
            }, t), this._dragDataCache = {}, this.sliderHandleElement = null, this.huebarHandleElement = null, this.baseColorElement = null, this.drag = new p({
                distance: 0
            }, e), this.colorSliderPosLimitRange = [-7, 112], this.huebarPosLimitRange = [-3, 115], this.drag.on({
                dragStart: this._onDragStart,
                drag: this._onDrag,
                dragEnd: this._onDragEnd,
                click: this._onClick
            }, this)
        }
        c(v, h), v.prototype._beforeDestroy = function() {
            this.drag.off(), this.drag = this.options = this._dragDataCache = this.sliderHandleElement = this.huebarHandleElement = this.baseColorElement = null
        }, v.prototype.toggle = function(t) {
            this.container.style.display = t ? "block" : "none"
        }, v.prototype.isVisible = function() {
            return "block" === this.container.style.display
        }, v.prototype.render = function(t) {
            var e, r, n = this.container,
                o = this.options,
                i = d.layout;
            f.isValidRGB(t) && (i = (i = (i = (i = i.replace(/{{slider}}/, d.slider)).replace(/{{huebar}}/, d.huebar)).replace(/{{cssPrefix}}/g, o.cssPrefix)).replace(/{{id}}/g, o.id), this.container.innerHTML = i, this.sliderSvgElement = n.querySelector("." + o.cssPrefix + "svg-slider"), this.huebarSvgElement = n.querySelector("." + o.cssPrefix + "svg-huebar"), this.sliderHandleElement = n.querySelector("." + o.cssPrefix + "slider-handle"), this.huebarHandleElement = n.querySelector("." + o.cssPrefix + "huebar-handle"), this.baseColorElement = n.querySelector("." + o.cssPrefix + "slider-basecolor"), e = f.hexToRGB(t), r = f.rgbToHSV.apply(null, e), this.moveHue(r[0], !0), this.moveSaturationAndValue(r[1], r[2], !0))
        }, v.prototype._setColorSliderPosMax = function() {
            var t = this.sliderSvgElement.getClientRects()[0];
            t && (this.colorSliderPosLimitRange[1] = t.height - 10)
        }, v.prototype._moveColorSliderHandle = function(t, e, r) {
            var n, o = this.sliderHandleElement;
            e = Math.max(this.colorSliderPosLimitRange[0], e), e = Math.min(this.colorSliderPosLimitRange[1], e), t = Math.max(this.colorSliderPosLimitRange[0], t), t = Math.min(this.colorSliderPosLimitRange[1], t), u.setTranslateXY(o, t, e), n = e > 50 ? "white" : "black", u.setStrokeColor(o, n), r || this.fire("_selectColor", {
                color: f.rgbToHEX.apply(null, this.getRGB())
            })
        }, v.prototype.moveSaturationAndValue = function(t, e, r) {
            var n, o, i, s;
            t = t || 0, e = e || 0, n = Math.abs(this.colorSliderPosLimitRange[0]), i = t * (o = this.colorSliderPosLimitRange[1]) / 100 - n, s = o - e * o / 100 - n, this._moveColorSliderHandle(i, s, r)
        }, v.prototype._moveColorSliderByPosition = function(t, e) {
            var r = this.colorSliderPosLimitRange[0];
            this._moveColorSliderHandle(t + r, e + r)
        }, v.prototype.getSaturationAndValue = function() {
            var t = Math.abs(this.colorSliderPosLimitRange[0]),
                e = t + this.colorSliderPosLimitRange[1],
                r = u.getTranslateXY(this.sliderHandleElement);
            return [(r[1] + t) / e * 100, 100 - (r[0] + t) / e * 100]
        }, v.prototype._setHueBarPosMax = function() {
            var t = this.huebarSvgElement.getClientRects()[0];
            t && (this.huebarPosLimitRange[1] = t.height - 7)
        }, v.prototype._moveHueHandle = function(t, e) {
            var r, n, o = this.huebarHandleElement,
                i = this.baseColorElement;
            t = Math.max(this.huebarPosLimitRange[0], t), t = Math.min(this.huebarPosLimitRange[1], t), u.setTranslateY(o, t), r = f.hsvToRGB(this.getHue(), 100, 100), n = f.rgbToHEX.apply(null, r), u.setGradientColorStop(i, n), e || this.fire("_selectColor", {
                color: f.rgbToHEX.apply(null, this.getRGB())
            })
        }, v.prototype.moveHue = function(t, e) {
            var r, n;
            r = ((n = Math.abs(this.huebarPosLimitRange[0])) + this.huebarPosLimitRange[1]) * (t = t || 0) / 359.99 - n, this._moveHueHandle(r, e)
        }, v.prototype._moveHueByPosition = function(t) {
            var e = this.huebarPosLimitRange[0];
            this._moveHueHandle(t + e)
        }, v.prototype.getHue = function() {
            var t, e, r = this.huebarHandleElement,
                n = u.getTranslateXY(r);
            return e = (t = Math.abs(this.huebarPosLimitRange[0])) + this.huebarPosLimitRange[1], 359.99 * (n[0] + t) / e
        }, v.prototype.getHSV = function() {
            var t = this.getSaturationAndValue();
            return [this.getHue()].concat(t)
        }, v.prototype.getRGB = function() {
            return f.hsvToRGB.apply(null, this.getHSV())
        }, v.prototype._prepareColorSliderForMouseEvent = function(t) {
            var e = this.options,
                r = i(t.target, "." + e.cssPrefix + "slider-part");
            return this._dragDataCache = {
                isColorSlider: s(r, e.cssPrefix + "slider-left"),
                parentElement: r
            }
        }, v.prototype._onClick = function(t) {
            var e = this._prepareColorSliderForMouseEvent(t),
                r = o(t.originEvent, e.parentElement);
            e.isColorSlider ? this._moveColorSliderByPosition(r[0], r[1]) : this._moveHueByPosition(r[1]), this._dragDataCache = null
        }, v.prototype._onDragStart = function(t) {
            this._setColorSliderPosMax(), this._setHueBarPosMax(), this._prepareColorSliderForMouseEvent(t)
        }, v.prototype._onDrag = function(t) {
            var e = this._dragDataCache,
                r = o(t.originEvent, e.parentElement);
            e.isColorSlider ? this._moveColorSliderByPosition(r[0], r[1]) : this._moveHueByPosition(r[1])
        }, v.prototype._onDragEnd = function() {
            this._dragDataCache = null
        }, n.mixin(v), t.exports = v
    }, function(t, e, r) {
        "use strict";
        var n = r(4).isOldBrowser,
            o = /[\.\-0-9]+/g,
            i = {
                getTranslateXY: function(t) {
                    var e;
                    return n ? (e = t.style, [parseFloat(e.top), parseFloat(e.left)]) : (e = t.getAttribute("transform")) ? (e = e.match(o), [parseFloat(e[1]), parseFloat(e[0])]) : [0, 0]
                },
                setTranslateXY: function(t, e, r) {
                    n ? (t.style.left = e + "px", t.style.top = r + "px") : t.setAttribute("transform", "translate(" + e + "," + r + ")")
                },
                setTranslateY: function(t, e) {
                    n ? t.style.top = e + "px" : t.setAttribute("transform", "translate(-6," + e + ")")
                },
                setStrokeColor: function(t, e) {
                    n ? t.strokecolor = e : t.setAttribute("stroke", e)
                },
                setGradientColorStop: function(t, e) {
                    n ? t.color = e : t.setAttribute("stop-color", e)
                }
            };
        t.exports = i
    }, function(t, e, r) {
        r(34), t.exports = r(35)
    }, function(t, e, r) {}, function(t, e, r) {
        "use strict";
        var n = {
            Collection: r(19),
            View: r(8),
            Drag: r(24),
            create: r(48),
            Palette: r(29),
            Slider: r(31),
            colorutil: r(12),
            svgvml: r(32)
        };
        t.exports = n
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return null === t
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(3),
            o = r(38);
        t.exports = function(t, e) {
            var r = location.hostname,
                i = "TOAST UI " + t + " for " + r + ": Statistics",
                s = window.localStorage.getItem(i);
            (n(window.tui) || !1 !== window.tui.usageStatistics) && (s && ! function(t) {
                return (new Date).getTime() - t > 6048e5
            }(s) || (window.localStorage.setItem(i, (new Date).getTime()), setTimeout((function() {
                "interactive" !== document.readyState && "complete" !== document.readyState || o("https://www.google-analytics.com/collect", {
                    v: 1,
                    t: "event",
                    tid: e,
                    cid: r,
                    dp: r,
                    dh: t,
                    el: t,
                    ec: "use"
                })
            }), 1e3)))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(7);
        t.exports = function(t, e) {
            var r = document.createElement("img"),
                o = "";
            return n(e, (function(t, e) {
                o += "&" + e + "=" + t
            })), o = o.substring(1), r.src = t + "?" + o, r.style.display = "none", document.body.appendChild(r), document.body.removeChild(r), r
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(2),
            o = r(5),
            i = r(23),
            s = r(40);
        t.exports = function(t) {
            var e, r = Array.prototype.slice.call(arguments, 1),
                a = t.classList,
                c = [];
            a ? n(r, (function(e) {
                t.classList.add(e)
            })) : ((e = i(t)) && (r = [].concat(e.split(/\s+/), r)), n(r, (function(t) {
                o(t, c) < 0 && c.push(t)
            })), s(t, c))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(1),
            o = r(3);
        t.exports = function(t, e) {
            e = (e = n(e) ? e.join(" ") : e).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""), o(t.className.baseVal) ? t.className = e : t.className.baseVal = e
        }
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            return "number" == typeof t || t instanceof Number
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(14),
            o = r(15),
            i = r(43),
            s = r(27),
            a = "onselectstart" in document,
            c = s(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);
        t.exports = function(t) {
            t || (t = document), a ? n(t, "selectstart", o) : (t = t === document ? document.documentElement : t, i(t, "prevUserSelect", t.style[c]), t.style[c] = "none")
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(16);
        t.exports = function(t, e, r) {
            t.dataset ? t.dataset[e] = r : t.setAttribute("data-" + n(e), r)
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(17),
            o = r(15),
            i = r(45),
            s = r(46),
            a = r(27),
            c = "onselectstart" in document,
            l = a(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);
        t.exports = function(t) {
            t || (t = document), c ? n(t, "selectstart", o) : ((t = t === document ? document.documentElement : t).style[l] = i(t, "prevUserSelect") || "auto", s(t, "prevUserSelect"))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(16);
        t.exports = function(t, e) {
            return t.dataset ? t.dataset[e] : t.getAttribute("data-" + n(e))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(16);
        t.exports = function(t, e) {
            t.dataset ? delete t.dataset[e] : t.removeAttribute("data-" + n(e))
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(22),
            o = r(5),
            i = ["0", "1", "3", "5", "7"],
            s = ["2", "6"],
            a = ["4"];
        t.exports = function(t) {
            return n.msie && n.version <= 8 ? function(t) {
                var e = String(t.button);
                if (o(e, i) > -1) return 0;
                if (o(e, s) > -1) return 2;
                if (o(e, a) > -1) return 1;
                return null
            }(t) : t.button
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(10),
            o = r(0),
            i = r(4),
            s = r(12),
            a = r(49),
            c = r(29),
            l = r(31),
            u = 0;

        function f(t) {
            var e;
            if (!(this instanceof f)) return new f(t);
            if (!(t = this.options = o({
                    container: null,
                    color: "#f8f8f8",
                    preset: ["#181818", "#282828", "#383838", "#585858", "#b8b8b8", "#d8d8d8", "#e8e8e8", "#f8f8f8", "#ab4642", "#dc9656", "#f7ca88", "#a1b56c", "#86c1b9", "#7cafc2", "#ba8baf", "#a16946"],
                    cssPrefix: "tui-colorpicker-",
                    detailTxt: "Detail",
                    id: u += 1,
                    usageStatistics: !0
                }, t)).container) throw new Error("ColorPicker(): need container option.");
            e = this.layout = new a(t, t.container), this.palette = new c(t, e.container), this.palette.on({
                _selectColor: this._onSelectColorInPalette,
                _toggleSlider: this._onToggleSlider
            }, this), this.slider = new l(t, e.container), this.slider.on("_selectColor", this._onSelectColorInSlider, this), e.addChild(this.palette), e.addChild(this.slider), this.render(t.color), t.usageStatistics && i.sendHostName()
        }
        f.prototype._onSelectColorInPalette = function(t) {
            var e = t.color,
                r = this.options;
            s.isValidRGB(e) || "" === e ? (this.fire("selectColor", {
                color: e,
                origin: "palette"
            }), r.color !== e && (r.color = e, this.render(e))) : this.render()
        }, f.prototype._onToggleSlider = function() {
            this.slider.toggle(!this.slider.isVisible())
        }, f.prototype._onSelectColorInSlider = function(t) {
            var e = t.color,
                r = this.options;
            this.fire("selectColor", {
                color: e,
                origin: "slider"
            }), r.color !== e && (r.color = e, this.palette.render(e))
        }, f.prototype.setColor = function(t) {
            if (!s.isValidRGB(t)) throw new Error("ColorPicker#setColor(): need valid hex string color value");
            this.options.color = t, this.render(t)
        }, f.prototype.getColor = function() {
            return this.options.color
        }, f.prototype.toggle = function(t) {
            this.layout.container.style.display = t ? "block" : "none"
        }, f.prototype.render = function(t) {
            this.layout.render(t || this.options.color)
        }, f.prototype.destroy = function() {
            this.layout.destroy(), this.options.container.innerHTML = "", this.layout = this.slider = this.palette = this.options = null
        }, n.mixin(f), t.exports = f
    }, function(t, e, r) {
        "use strict";
        var n = r(0),
            o = r(18),
            i = r(9),
            s = r(8);

        function a(t, e) {
            this.options = n({
                cssPrefix: "tui-colorpicker-"
            }, t), e = i.appendHTMLElement("div", e, this.options.cssPrefix + "container"), s.call(this, t, e), this.render()
        }
        o(a, s), a.prototype.render = function(t) {
            this.recursive((function(e) {
                e.render(t)
            }), !0)
        }, t.exports = a
    }, function(t, e, r) {
        "use strict";
        t.exports = function(t) {
            function e() {}
            return e.prototype = t, new e
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(52);
        t.exports = function(t) {
            var e = ['<ul class="{{cssPrefix}}clearfix">', "{{each preset}}", ['<li><input class="{{cssPrefix}}palette-button{{isSelected @this}}{{getItemClass @this}}" type="button"', "{{if isValidRGB @this}}", ' style="background-color:{{@this}};color:{{@this}}"', "{{/if}}", ' title="{{@this}}" value="{{@this}}" /></li>'].join(""), "{{/each}}", "</ul>", '<div class="{{cssPrefix}}clearfix" style="overflow:hidden">', '<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />', '<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />', '<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>', "</div>"].join("\n");
            return n(e, t)
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(5),
            o = r(2),
            i = r(1),
            s = r(11),
            a = r(0),
            c = /{{\s?|\s?}}/g,
            l = /^[a-zA-Z0-9_@]+\[[a-zA-Z0-9_@"']+\]$/,
            u = /\[\s?|\s?\]/,
            f = /^[a-zA-Z_]+\.[a-zA-Z_]+$/,
            h = /\./,
            p = /^["']\w+["']$/,
            d = /"|'/g,
            v = /^-?\d+\.?\d*$/,
            g = {
                if: function(t, e, r) {
                    var n = function(t, e) {
                            var r = [t],
                                n = [],
                                i = 0,
                                s = 0;
                            return o(e, (function(t, o) {
                                0 === t.indexOf("if") ? i += 1 : "/if" === t ? i -= 1 : i || 0 !== t.indexOf("elseif") && "else" !== t || (r.push("else" === t ? ["true"] : t.split(" ").slice(1)), n.push(e.slice(s, o)), s = o + 1)
                            })), n.push(e.slice(s)), {
                                exps: r,
                                sourcesInsideIf: n
                            }
                        }(t, e),
                        i = !1,
                        s = "";
                    return o(n.exps, (function(t, e) {
                        return (i = _(t, r)) && (s = b(n.sourcesInsideIf[e], r)), !i
                    })), s
                },
                each: function(t, e, r) {
                    var n = _(t, r),
                        s = i(n) ? "@index" : "@key",
                        c = {},
                        l = "";
                    return o(n, (function(t, n) {
                        c[s] = n, c["@this"] = t, a(r, c), l += b(e.slice(), r)
                    })), l
                },
                with: function(t, e, r) {
                    var o = n("as", t),
                        i = t[o + 1],
                        s = _(t.slice(0, o), r),
                        c = {};
                    return c[i] = s, b(e, a(r, c)) || ""
                }
            },
            m = 3 === "a".split(/a/).length ? function(t, e) {
                return t.split(e)
            } : function(t, e) {
                var r, n, o = [],
                    i = 0;
                for (e.global || (e = new RegExp(e, "g")), r = e.exec(t); null !== r;) n = r.index, o.push(t.slice(i, n)), i = n + r[0].length, r = e.exec(t);
                return o.push(t.slice(i)), o
            };

        function x(t, e) {
            var r, n = e[t];
            return "true" === t ? n = !0 : "false" === t ? n = !1 : p.test(t) ? n = t.replace(d, "") : l.test(t) ? n = x((r = t.split(u))[0], e)[x(r[1], e)] : f.test(t) ? n = x((r = t.split(h))[0], e)[r[1]] : v.test(t) && (n = parseFloat(t)), n
        }

        function y(t, e, r) {
            for (var n, o, i, a, c = g[t], l = 1, u = 2, f = e[u]; l && s(f);) 0 === f.indexOf(t) ? l += 1 : 0 === f.indexOf("/" + t) && (l -= 1, n = u), f = e[u += 2];
            if (l) throw Error(t + " needs {{/" + t + "}} expression.");
            return e[0] = c(e[0].split(" ").slice(1), (o = 0, i = n, (a = e.splice(o + 1, i - o)).pop(), a), r), e
        }

        function _(t, e) {
            var r = x(t[0], e);
            return r instanceof Function ? function(t, e, r) {
                var n = [];
                return o(e, (function(t) {
                    n.push(x(t, r))
                })), t.apply(null, n)
            }(r, t.slice(1), e) : r
        }

        function b(t, e) {
            for (var r, n, o, i = 1, a = t[i]; s(a);) n = (r = a.split(" "))[0], g[n] ? (o = y(n, t.splice(i, t.length - i), e), t = t.concat(o)) : t[i] = _(r, e), a = t[i += 2];
            return t.join("")
        }
        t.exports = function(t, e) {
            return b(m(t, c), e)
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(1);
        t.exports = function(t, e) {
            var r, o = n(t),
                i = o ? t[0] : t.clientX,
                s = o ? t[1] : t.clientY;
            return e ? [i - (r = e.getBoundingClientRect()).left - e.clientLeft, s - r.top - e.clientTop] : [i, s]
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(55);
        t.exports = function(t, e) {
            var r = t.parentNode;
            if (n(t, e)) return t;
            for (; r && r !== document;) {
                if (n(r, e)) return r;
                r = r.parentNode
            }
            return null
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(5),
            o = r(56),
            i = Element.prototype,
            s = i.matches || i.webkitMatchesSelector || i.mozMatchesSelector || i.msMatchesSelector || function(t) {
                var e = this.document || this.ownerDocument;
                return n(this, o(e.querySelectorAll(t))) > -1
            };
        t.exports = function(t, e) {
            return s.call(t, e)
        }
    }, function(t, e, r) {
        "use strict";
        var n = r(6);
        t.exports = function(t) {
            var e;
            try {
                e = Array.prototype.slice.call(t)
            } catch (r) {
                e = [], n(t, (function(t) {
                    e.push(t)
                }))
            }
            return e
        }
    }, function(t, e, r) {
        "use strict";
        (function(e) {
            var n = r(4).isOldBrowser,
                o = ['<div class="{{cssPrefix}}slider-left {{cssPrefix}}slider-part">{{slider}}</div>', '<div class="{{cssPrefix}}slider-right {{cssPrefix}}slider-part">{{huebar}}</div>'].join("\n"),
                i = ['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">', "<defs>", '<linearGradient id="{{cssPrefix}}svg-fill-color-{{id}}" x1="0%" y1="0%" x2="100%" y2="0%">', '<stop offset="0%" stop-color="rgb(255,255,255)" />', '<stop class="{{cssPrefix}}slider-basecolor" offset="100%" stop-color="rgb(255,0,0)" />', "</linearGradient>", '<linearGradient id="{{cssPrefix}}svn-fill-black-{{id}}" x1="0%" y1="0%" x2="0%" y2="100%">', '<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />', '<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />', "</linearGradient>", "</defs>", '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color-{{id}})"></rect>', '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black-{{id}})"></rect>', '<path transform="translate(0,0)" class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />', "</svg>"].join("\n"),
                s = ['<div class="{{cssPrefix}}vml-slider">', '<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">', '<v:fill class="{{cssPrefix}}vml {{cssPrefix}}slider-basecolor" type="gradient" method="none" color="#ff0000" color2="#fff" angle="90" />', "</v:rect>", '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">', '<v:fill type="gradient" method="none" color="black" color2="white" o:opacity2="0%" class="{{cssPrefix}}vml" />', "</v:rect>", '<v:shape class="{{cssPrefix}}vml {{cssPrefix}}slider-handle" coordsize="1 1" style="width:1px;height:1px;"path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" stroked="true" />', "</div>"].join("\n"),
                a = ['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">', "<defs>", '<linearGradient id="g-{{id}}" x1="0%" y1="0%" x2="0%" y2="100%">', '<stop offset="0%" stop-color="rgb(255,0,0)" />', '<stop offset="16.666%" stop-color="rgb(255,255,0)" />', '<stop offset="33.333%" stop-color="rgb(0,255,0)" />', '<stop offset="50%" stop-color="rgb(0,255,255)" />', '<stop offset="66.666%" stop-color="rgb(0,0,255)" />', '<stop offset="83.333%" stop-color="rgb(255,0,255)" />', '<stop offset="100%" stop-color="rgb(255,0,0)" />', "</linearGradient>", "</defs>", '<rect width="18px" height="100%" fill="url(#g-{{id}})"></rect>', '<path transform="translate(-6,-3)" class="{{cssPrefix}}huebar-handle" d="M0 0 L4 4 L0 8 L0 0 Z" fill="black" stroke="none" />', "</svg>"].join("\n"),
                c = ['<div class="{{cssPrefix}}vml-huebar">', '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">', '<v:fill type="gradient" method="none" colors="0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)" angle="180" class="{{cssPrefix}}vml" />', "</v:rect>", '<v:shape class="{{cssPrefix}}vml {{cssPrefix}}huebar-handle" coordsize="1 1" style="width:1px;height:1px;position:absolute;z-index:1;right:22px;top:-3px;"path="m 0,0 l 4,4 l 0,8 l 0,0 z" filled="true" fillcolor="black" stroked="false" />', "</div>"].join("\n");
            n && e.document.namespaces.add("v", "urn:schemas-microsoft-com:vml"), t.exports = {
                layout: o,
                slider: n ? s : i,
                huebar: n ? c : a
            }
        }).call(this, r(25))
    }])
}));