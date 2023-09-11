/*!
 * TOAST UI Editor : Table Merged Cell Plugin
 * @version 3.0.2 | Thu Feb 10 2022
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.toastui = t() : (e.toastui = e.toastui || {}, e.toastui.Editor = e.toastui.Editor || {}, e.toastui.Editor.plugin = e.toastui.Editor.plugin || {}, e.toastui.Editor.plugin.tableMergedCell = t())
}(self, (function() {
    return function() {
        "use strict";
        var e = {
                893: function(e) {
                    e.exports = function(e, t, n) {
                        var a = 0,
                            r = e.length;
                        for (n = n || null; a < r && !1 !== t.call(n, e[a], a, e); a += 1);
                    }
                },
                990: function(e, t, n) {
                    var a = n(893);
                    e.exports = function(e) {
                        var t;
                        try {
                            t = Array.prototype.slice.call(e)
                        } catch (n) {
                            t = [], a(e, (function(e) {
                                t.push(e)
                            }))
                        }
                        return t
                    }
                }
            },
            t = {};

        function n(a) {
            var r = t[a];
            if (void 0 !== r) return r.exports;
            var o = t[a] = {
                exports: {}
            };
            return e[a](o, o.exports, n), o.exports
        }
        n.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return n.d(t, {
                a: t
            }), t
        }, n.d = function(e, t) {
            for (var a in t) n.o(t, a) && !n.o(e, a) && Object.defineProperty(e, a, {
                enumerable: !0,
                get: t[a]
            })
        }, n.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        };
        var a = {};
        return function() {
            function e(e, t, n) {
                var a = new RegExp("^((?:" + n + "=[0-9]+:)?)" + t + "=([0-9]+):(.*)").exec(e),
                    r = 1;
                return a && (r = parseInt(a[2], 10), e = a[1] + a[3]), [r, e]
            }
            n.d(a, {
                default: function() {
                    return T
                }
            });
            var t = {
                    tableRow: function(e, t) {
                        if (t.entering && (e.rowspanMap = {}, e.prev && !e.firstChild)) {
                            var n = e.prev.rowspanMap;
                            Object.keys(n).forEach((function(t) {
                                n[t] > 1 && (e.rowspanMap[t] = n[t] - 1)
                            }))
                        }
                    },
                    tableCell: function(t, n) {
                        var a, r, o = n.entering,
                            l = t.parent,
                            s = t.prev,
                            i = t.stringContent;
                        if (o) {
                            var c, d, p = {},
                                u = i,
                                f = [1, 1];
                            c = (a = e(u, "@cols", "@rows"))[0], d = (r = e(u = a[1], "@rows", "@cols"))[0], u = r[1], t.stringContent = u, s && (t.startIdx = s.endIdx + 1, t.endIdx = t.startIdx), c > 1 && (p.colspan = c, t.endIdx += c - 1), d > 1 && (p.rowspan = d), t.attrs = p,
                                function(e, t, n) {
                                    var a = t.prev;
                                    if (a)
                                        for (var r = t.parent.parent.columns.length, o = e.startIdx; o < r; o += 1) {
                                            var l = a.rowspanMap[o];
                                            l && l > 1 && (t.rowspanMap[o] = l - 1, o <= e.endIdx && (e.startIdx += 1, e.endIdx += 1))
                                        }
                                    if (n > 1) {
                                        var s = e.startIdx,
                                            i = e.endIdx;
                                        for (o = s; o <= i; o += 1) t.rowspanMap[o] = n
                                    }
                                }(t, l, d);
                            var g = l.parent;
                            "tableBody" === g.type && t.endIdx >= g.parent.columns.length && (t.ignored = !0)
                        }
                    }
                },
                r = function() {
                    return r = Object.assign || function(e) {
                        for (var t, n = 1, a = arguments.length; n < a; n++)
                            for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                        return e
                    }, r.apply(this, arguments)
                },
                o = {
                    tableRow: function(e, t) {
                        var n = t.entering,
                            a = t.origin;
                        if (n) return a();
                        var r = [];
                        if (e.lastChild)
                            for (var o = e.parent.parent.columns.length, l = e.lastChild.endIdx + 1; l < o; l += 1)(!e.prev || !e.prev.rowspanMap[l] || e.prev.rowspanMap[l] <= 1) && r.push({
                                type: "openTag",
                                tagName: "td",
                                outerNewLine: !0
                            }, {
                                type: "closeTag",
                                tagName: "td",
                                outerNewLine: !0
                            });
                        return r.push({
                            type: "closeTag",
                            tagName: "tr",
                            outerNewLine: !0
                        }), r
                    },
                    tableCell: function(e, t) {
                        var n = t.entering,
                            a = (0, t.origin)();
                        if (e.ignored) return a;
                        if (n) {
                            var o = r({}, e.attrs);
                            a.attributes = r(r({}, a.attributes), o)
                        }
                        return a
                    }
                };

            function l(e) {
                var t = e.attrs,
                    n = t.rowspan,
                    a = t.colspan,
                    r = "";
                return n && (r = "@rows=" + n + ":"), a && (r = "@cols=" + a + ":" + r), {
                    delim: "| " + r
                }
            }
            var s = {
                tableHead: function(e) {
                    var t = e.node.firstChild,
                        n = "";
                    return t && t.forEach((function(e) {
                        var t = e.textContent,
                            a = e.attrs,
                            r = function(e, t) {
                                var n = e.length,
                                    a = "",
                                    r = "";
                                return "left" === t ? (a = ":", n -= 1) : "right" === t ? (r = ":", n -= 1) : "center" === t && (a = ":", r = ":", n -= 2), "" + a + function(e, t) {
                                    for (var n = "", a = 0; a < t; a += 1) n += e;
                                    return n
                                }("-", Math.max(n, 3)) + r
                            }(t, a.align);
                        if (n += "| " + r + " ", a.colspan)
                            for (var o = 0; o < a.colspan - 1; o += 1) n += "| " + r + " "
                    })), {
                        delim: n
                    }
                },
                tableHeadCell: function(e) {
                    return l(e.node)
                },
                tableBodyCell: function(e) {
                    return l(e.node)
                }
            };
            var i = function() {
                    return i = Object.assign || function(e) {
                        for (var t, n = 1, a = arguments.length; n < a; n++)
                            for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                        return e
                    }, i.apply(this, arguments)
                },
                c = {
                    extendedRowspan: function(e, t) {
                        var n = this.rowInfo[e].rowspanMap[t];
                        return !!n && n.startSpanIdx !== e
                    },
                    extendedColspan: function(e, t) {
                        var n = this.rowInfo[e].colspanMap[t];
                        return !!n && n.startSpanIdx !== t
                    },
                    getRowspanCount: function(e, t) {
                        var n = this.rowInfo[e].rowspanMap[t];
                        return n ? n.count : 0
                    },
                    getColspanCount: function(e, t) {
                        var n = this.rowInfo[e].colspanMap[t];
                        return n ? n.count : 0
                    },
                    decreaseColspanCount: function(e, t) {
                        var n = this.rowInfo[e].colspanMap[t],
                            a = this.rowInfo[e].colspanMap[n.startSpanIdx];
                        return a.count -= 1, a.count
                    },
                    decreaseRowspanCount: function(e, t) {
                        var n = this.rowInfo[e].rowspanMap[t],
                            a = this.rowInfo[n.startSpanIdx].rowspanMap[t];
                        return a.count -= 1, a.count
                    },
                    getColspanStartInfo: function(e, t) {
                        var n = this.rowInfo[e].colspanMap,
                            a = n[t];
                        if (a) {
                            var r = a.startSpanIdx,
                                o = this.rowInfo[e][r];
                            return {
                                node: this.table.nodeAt(o.offset - this.tableStartOffset),
                                pos: o.offset,
                                startSpanIdx: r,
                                count: n[r].count
                            }
                        }
                        return null
                    },
                    getRowspanStartInfo: function(e, t) {
                        var n = this.rowInfo[e].rowspanMap[t];
                        if (n) {
                            var a = n.startSpanIdx,
                                r = this.rowInfo[a][t];
                            return {
                                node: this.table.nodeAt(r.offset - this.tableStartOffset),
                                pos: r.offset,
                                startSpanIdx: a,
                                count: this.rowInfo[a].rowspanMap[t].count
                            }
                        }
                        return null
                    },
                    getSpannedOffsets: function(e) {
                        for (var t = e.startRowIdx, n = e.startColIdx, a = e.endRowIdx, r = e.endColIdx, o = a; o >= t; o -= 1)
                            if (this.rowInfo[o])
                                for (var l = this.rowInfo[o], s = l.rowspanMap, i = l.colspanMap, c = r; c >= n; c -= 1) {
                                    var d = s[c],
                                        p = i[c];
                                    d && (t = Math.min(t, d.startSpanIdx)), p && (n = Math.min(n, p.startSpanIdx))
                                }
                        for (o = t; o <= a; o += 1)
                            if (this.rowInfo[o]) {
                                var u = this.rowInfo[o];
                                for (s = u.rowspanMap, i = u.colspanMap, c = n; c <= r; c += 1) {
                                    d = s[c], p = i[c];
                                    d && (a = Math.max(a, o + d.count - 1)), p && (r = Math.max(r, c + p.count - 1))
                                }
                            } return {
                            startRowIdx: t,
                            startColIdx: n,
                            endRowIdx: a,
                            endColIdx: r
                        }
                    }
                };
            var d = function(e, t, n) {
                    void 0 === n && (n = !1);
                    var a = [],
                        r = "tableBody" === e.type.name;
                    return e.forEach((function(e, o, l) {
                        var s = r && !n ? l + 1 : l,
                            c = a[l - 1],
                            d = {
                                rowspanMap: {},
                                colspanMap: {},
                                length: 0
                            };
                        c && function(e, t) {
                            var n = t.rowspanMap,
                                a = t.colspanMap,
                                r = e.rowspanMap,
                                o = e.colspanMap;
                            Object.keys(r).forEach((function(l) {
                                var s = Number(l),
                                    c = r[s];
                                if ((null == c ? void 0 : c.count) > 1) {
                                    var d = o[s],
                                        p = c.count,
                                        u = c.startSpanIdx;
                                    n[s] = {
                                        count: p - 1,
                                        startSpanIdx: u
                                    }, a[s] = d, t[s] = i(i({}, e[s]), {
                                        extended: !0
                                    }), t.length += 1
                                }
                            }))
                        }(c, d), e.forEach((function(e, n) {
                            for (var a, r, l = e.nodeSize, c = e.attrs, p = null !== (a = c.colspan) && void 0 !== a ? a : 1, u = null !== (r = c.rowspan) && void 0 !== r ? r : 1, f = 0; d[f];) f += 1;
                            d[f] = {
                                offset: t + o + n + 2,
                                nodeSize: l
                            }, d.length += 1, u > 1 && (d.rowspanMap[f] = {
                                count: u,
                                startSpanIdx: s
                            }), p > 1 && (d.colspanMap[f] = {
                                count: p,
                                startSpanIdx: f
                            }, function(e, t, n, a, r) {
                                for (var o = r.rowspanMap, l = r.colspanMap, s = 1; s < t; s += 1) l[a + s] = {
                                    count: t - s,
                                    startSpanIdx: a
                                }, e > 1 && (o[a + s] = {
                                    count: e,
                                    startSpanIdx: n
                                }), r[a + s] = i({}, r[a]), r.length += 1
                            }(u, p, s, f, d))
                        })), a.push(d)
                    })), a
                },
                p = n(990),
                u = n.n(p),
                f = ".toastui-editor-cell-selected";

            function g(e) {
                return Number(e.getAttribute("colspan")) > 1 || Number(e.getAttribute("rowspan")) > 1
            }

            function m(e, t) {
                var n = e.i18n,
                    a = e.eventEmitter,
                    r = t.parentElement.parentElement,
                    o = [];
                return function(e) {
                    return !!e.querySelectorAll(f).length
                }(r) && o.push({
                    label: n.get("Merge cells"),
                    onClick: function() {
                        return a.emit("command", "mergeCells")
                    },
                    className: "merge-cells"
                }), (g(t) || function(e) {
                    return u()(e.querySelectorAll(f)).some(g)
                }(r)) && o.push({
                    label: n.get("Split cells"),
                    onClick: function() {
                        return a.emit("command", "splitCells")
                    },
                    className: "split-cells"
                }), o
            }
            var h, v = function() {
                return v = Object.assign || function(e) {
                    for (var t, n = 1, a = arguments.length; n < a; n++)
                        for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                    return e
                }, v.apply(this, arguments)
            };

            function C(e, t) {
                if (e instanceof t.pmState.TextSelection) {
                    var n = e.$anchor,
                        a = function(e, t) {
                            for (var n = e.depth; n >= 0;) {
                                var a = e.node(n);
                                if (t(a, n)) return {
                                    node: a,
                                    depth: n,
                                    offset: n > 0 ? e.before(n) : 0
                                };
                                n -= 1
                            }
                            return null
                        }(n, (function(e) {
                            var t = e.type;
                            return "tableHeadCell" === t.name || "tableBodyCell" === t.name
                        }));
                    if (a) {
                        var r = n.node(0).resolve(n.before(a.depth));
                        return {
                            anchor: r,
                            head: r
                        }
                    }
                }
                var o = e;
                return {
                    anchor: o.startCell,
                    head: o.endCell
                }
            }

            function w(e) {
                var t = e.startRowIdx,
                    n = e.startColIdx;
                return {
                    rowCount: e.endRowIdx - t + 1,
                    columnCount: e.endColIdx - n + 1
                }
            }

            function x(e, t) {
                return v(v({}, e.attrs), t)
            }

            function I(e) {
                return Object.getPrototypeOf(e).constructor
            }

            function b(e, t, n, a) {
                void 0 === a && (a = null);
                for (var r = n.nodes, o = r.tableHeadCell, l = r.tableBodyCell, s = r.paragraph, i = 0 === t ? o : l, c = [], d = 0; d < e; d += 1) c.push(i.create(a, s.create()));
                return c
            }

            function S(e, t) {
                var n = e.pmModel.Fragment;
                return function(a, r, o) {
                    var l = r.selection,
                        s = r.tr,
                        i = C(l, e),
                        c = i.anchor,
                        d = i.head;
                    if (!c || !d || !l.isCellSelection) return !1;
                    var p = t.create(c),
                        u = I(l),
                        f = p.totalRowCount,
                        g = p.totalColumnCount,
                        m = p.getRectOffsets(c, d),
                        h = w(m),
                        v = h.rowCount,
                        b = h.columnCount,
                        S = m.startRowIdx,
                        R = m.startColIdx,
                        y = m.endRowIdx,
                        k = m.endColIdx;
                    if (v >= f - 1 && b === g || 0 === S && y > S) return !1;
                    for (var j = n.empty, N = S; N <= y; N += 1)
                        for (var z = R; z <= k; z += 1)
                            if (N === S && z === R) j = M(N, z, j, p);
                            else if (!p.extendedRowspan(N, z) && !p.extendedColspan(N, z)) {
                        var L = p.getCellInfo(N, z),
                            O = L.offset,
                            E = L.nodeSize,
                            T = s.mapping.map(O),
                            A = T + E;
                        j = M(N, z, j, p), s.delete(T, A)
                    }
                    var P = p.getNodeAndPos(S, R),
                        H = P.node,
                        U = P.pos;
                    return function(e, t, n) {
                        var a = n.startNode,
                            r = n.startPos,
                            o = n.rowCount,
                            l = n.columnCount;
                        e.setNodeMarkup(r, null, x(a, {
                            colspan: l,
                            rowspan: o
                        })), t.size && e.replaceWith(r + 1, r + a.content.size, t)
                    }(s, j, {
                        startNode: H,
                        startPos: U,
                        rowCount: v,
                        columnCount: b
                    }), s.setSelection(new u(s.doc.resolve(U))), o(s), !0
                }
            }

            function M(e, t, n, a) {
                var r = a.getNodeAndPos(e, t).node.content;
                return r.size > 2 ? n.append(r) : n
            }

            function R(e, t, n) {
                var a = t;
                if (!n.extendedRowspan(e, t) && n.extendedColspan(e, t)) {
                    var r = n.getColspanStartInfo(e, t);
                    a = r.startSpanIdx + r.count
                }
                return a
            }

            function y(e, t, n, a) {
                var r = e.totalColumnCount;
                return e.extendedRowspan(n, a) && e.extendedRowspan(n, r - 1) && t === e.posAt(n, r - 1)
            }

            function k(e, t) {
                return function(n, a, r, o) {
                    var l = a.selection,
                        s = a.tr,
                        i = C(l, e),
                        c = i.anchor,
                        d = i.head;
                    if (!c || !d) return !1;
                    for (var p = t.create(c), u = p.getRectOffsets(c, d), f = u.startRowIdx, g = u.startColIdx, m = u.endRowIdx, h = u.endColIdx, v = -1, w = f; w <= m; w += 1)
                        for (var b = g; b <= h; b += 1)
                            if (p.extendedRowspan(w, b) || p.extendedColspan(w, b)) {
                                var S = p.getNodeAndPos(w, b).node,
                                    M = R(w, b, p),
                                    k = p.posAt(w, M),
                                    j = s.mapping.map(k);
                                y(p, k, w, M) && (j += 2), v = Math.max(j, v), s.insert(j, S.type.createAndFill(x(S, {
                                    colspan: null,
                                    rowspan: null
                                })))
                            } else {
                                var N = p.getNodeAndPos(w, b);
                                S = N.node, j = N.pos;
                                v = Math.max(s.mapping.map(j), v), s.setNodeMarkup(s.mapping.map(j), null, x(S, {
                                    colspan: null,
                                    rowspan: null
                                }))
                            } return r(s),
                        function(e, t, n, a, r) {
                            if (t.isCellSelection) {
                                var o = e.state.tr,
                                    l = I(t),
                                    s = r.startRowIdx,
                                    i = r.startColIdx,
                                    c = r.endRowIdx,
                                    d = r.endColIdx,
                                    p = n.create(o.doc.resolve(a)),
                                    u = p.getCellInfo(s, i).offset,
                                    f = p.getCellInfo(c, d).offset;
                                o.setSelection(new l(o.doc.resolve(u), o.doc.resolve(f))), e.dispatch(o)
                            }
                        }(o, l, t, p.tableStartOffset, u), !0
                }
            }

            function j(e, t) {
                return function(n, a, r) {
                    var o = a.selection,
                        l = a.tr,
                        s = C(o, e),
                        i = s.anchor,
                        c = s.head;
                    if (!i || !c) return !1;
                    var d = t.create(i),
                        p = d.getRectOffsets(i, c),
                        u = d.totalColumnCount,
                        f = d.totalRowCount;
                    if (w(p).columnCount === u) return !1;
                    for (var g = p.startColIdx, m = p.endColIdx, h = l.mapping.maps.length, v = 0; v < f; v += 1)
                        for (var I = m; I >= g; I -= 1) {
                            var b = d.getCellInfo(v, I),
                                S = b.offset,
                                M = b.nodeSize,
                                R = d.getColspanStartInfo(v, I);
                            if (!d.extendedRowspan(v, I))
                                if ((null == R ? void 0 : R.count) > 1) {
                                    var y = d.getColspanStartInfo(v, I),
                                        k = y.node,
                                        j = y.pos,
                                        N = d.decreaseColspanCount(v, I),
                                        z = x(k, {
                                            colspan: N > 1 ? N : null
                                        });
                                    l.setNodeMarkup(l.mapping.slice(h).map(j), null, z)
                                } else {
                                    var L = l.mapping.slice(h).map(S),
                                        O = L + M;
                                    l.delete(L, O)
                                }
                        }
                    return r(l), !0
                }
            }

            function N(e, t) {
                for (var n = e.totalColumnCount, a = Number.MAX_VALUE, r = 0, o = 0; o < n; o += 1)
                    if (!e.extendedRowspan(t, o)) {
                        var l = e.getCellInfo(t, o),
                            s = l.offset,
                            i = l.nodeSize;
                        a = Math.min(a, s), r = Math.max(r, s + i)
                    } return {
                    from: a,
                    to: r
                }
            }

            function z(e, t) {
                return function(n, a, r) {
                    var o = a.selection,
                        l = a.tr,
                        s = C(o, e),
                        i = s.anchor,
                        c = s.head;
                    if (i && c) {
                        var d = t.create(i),
                            p = d.totalRowCount,
                            u = d.totalColumnCount,
                            f = d.getRectOffsets(i, c),
                            g = w(f).rowCount,
                            m = f.startRowIdx,
                            h = f.endRowIdx;
                        if (g === p - 1 || 0 === m) return !1;
                        for (var v = h; v >= m; v -= 1) {
                            var I = l.mapping.maps.length,
                                b = N(d, v),
                                S = b.from,
                                M = b.to;
                            l.delete(S - 1, M + 1);
                            for (var R = 0; R < u; R += 1) {
                                var y = d.getRowspanStartInfo(v, R);
                                if ((null == y ? void 0 : y.count) > 1 && !d.extendedColspan(v, R))
                                    if (d.extendedRowspan(v, R)) {
                                        var k = d.getRowspanStartInfo(v, R),
                                            j = k.node,
                                            z = k.pos,
                                            L = d.decreaseRowspanCount(v, R),
                                            O = x(j, {
                                                rowspan: L > 1 ? L : null
                                            });
                                        l.setNodeMarkup(l.mapping.slice(I).map(z), null, O)
                                    } else if (!d.extendedRowspan(v, R)) {
                                    var E = d.getRowspanStartInfo(v, R),
                                        T = (j = E.node, E.count),
                                        A = (O = x(j, {
                                            rowspan: T > 2 ? T - 1 : null
                                        }), j.type.create(O, j.content));
                                    l.insert(l.mapping.slice(I).map(d.posAt(v + 1, R)), A)
                                }
                            }
                            d = t.create(l.doc.resolve(d.tableStartOffset))
                        }
                        return r(l), !0
                    }
                    return !1
                }
            }

            function L(e, t, n) {
                return function(a, r, o) {
                    var l = r.selection,
                        s = r.schema,
                        i = r.tr,
                        c = C(l, e),
                        d = c.anchor,
                        p = c.head;
                    if (!d || !p) return !1;
                    var u = t.create(d),
                        f = u.totalColumnCount,
                        g = u.getRectOffsets(d, p),
                        m = w(g).rowCount,
                        v = function(e, t, n) {
                            var a, r, o, l;
                            return e === h.UP ? (a = n.startRowIdx, r = function(e) {
                                return t.extendedRowspan(a, e)
                            }, o = 0, l = -1) : (a = n.endRowIdx, r = function(e) {
                                return t.getRowspanCount(a, e) > 1
                            }, o = t.totalColumnCount - 1, l = t.extendedRowspan(a, o) ? 2 : t.getCellInfo(a, o).nodeSize + 1), {
                                targetRowIdx: a,
                                judgeToExtendRowspan: r,
                                insertColIdx: o,
                                nodeSize: l
                            }
                        }(n, u, g),
                        I = v.targetRowIdx,
                        S = v.judgeToExtendRowspan,
                        M = v.insertColIdx,
                        R = v.nodeSize;
                    if (0 === I) return !1;
                    for (var y = [], k = i.mapping.map(u.posAt(I, M)) + R, j = [], N = 0; N < f; N += 1)
                        if (S(N)) {
                            var z = u.getRowspanStartInfo(I, N),
                                L = z.node,
                                O = z.pos,
                                E = x(L, {
                                    rowspan: L.attrs.rowspan + m
                                });
                            i.setNodeMarkup(i.mapping.map(O), null, E)
                        } else j = j.concat(b(1, I, s));
                    for (var T = 0; T < m; T += 1) y.push(s.nodes.tableRow.create(null, j));
                    return o(i.insert(k, y)), !0
                }
            }

            function O(e, t, n) {
                return function(a, r, o) {
                    var l = r.selection,
                        s = r.tr,
                        i = r.schema,
                        c = C(l, e),
                        d = c.anchor,
                        p = c.head;
                    if (!d || !p) return !1;
                    for (var u = t.create(d), f = u.getRectOffsets(d, p), g = function(e, t, n) {
                            var a, r, o;
                            return e === h.LEFT ? (r = function(e) {
                                return t.extendedColspan(e, a)
                            }, o = a = n.startColIdx) : (r = function(e) {
                                return t.getColspanCount(e, a) > 1
                            }, o = (a = n.endColIdx) + 1), {
                                targetColIdx: a,
                                judgeToExtendColspan: r,
                                insertColIdx: o
                            }
                        }(n, u, f), m = g.targetColIdx, v = g.judgeToExtendColspan, I = g.insertColIdx, S = w(f).columnCount, M = u.totalRowCount, R = 0; R < M; R += 1)
                        if (v(R)) {
                            var y = u.getColspanStartInfo(R, m),
                                k = y.node,
                                j = y.pos,
                                N = x(k, {
                                    colspan: k.attrs.colspan + S
                                });
                            s.setNodeMarkup(s.mapping.map(j), null, N)
                        } else {
                            var z = b(S, R, i);
                            s.insert(s.mapping.map(u.posAt(R, I)), z)
                        } return o(s), !0
                }
            }

            function E(e, t) {
                return {
                    mergeCells: S(e, t),
                    splitCells: k(e, t),
                    addRowToUp: L(e, t, h.UP),
                    addRowToDown: L(e, t, h.DOWN),
                    removeRow: z(e, t),
                    addColumnToLeft: O(e, t, h.LEFT),
                    addColumnToRight: O(e, t, h.RIGHT),
                    removeColumn: j(e, t)
                }
            }

            function T(e) {
                var n = e.i18n,
                    a = e.eventEmitter.emitReduce("mixinTableOffsetMapPrototype", c, d);
                return function(e) {
                        e.setLanguage(["ko", "ko-KR"], {
                            "Merge cells": "셀 병합",
                            "Split cells": "셀 병합해제",
                            "Cannot change part of merged cell": "병합된 셀의 일부를 변경할 수 없습니다.",
                            "Cannot paste row merged cells into the table header": "테이블 헤더에는 행 병합된 셀을 붙여넣을 수 없습니다."
                        }), e.setLanguage(["en", "en-US"], {
                            "Merge cells": "Merge cells",
                            "Split cells": "Split cells",
                            "Cannot change part of merged cell": "Cannot change part of merged cell.",
                            "Cannot paste row merged cells into the table header": "Cannot paste row merged cells into the table header."
                        }), e.setLanguage(["es", "es-ES"], {
                            "Merge cells": "Combinar celdas",
                            "Split cells": "Separar celdas",
                            "Cannot change part of merged cell": "No se puede cambiar parte de una celda combinada.",
                            "Cannot paste row merged cells into the table header": "No se pueden pegar celdas combinadas en el encabezado de tabla."
                        }), e.setLanguage(["ja", "ja-JP"], {
                            "Merge cells": "セルの結合",
                            "Split cells": "セルの結合を解除",
                            "Cannot change part of merged cell": "結合されたセルの一部を変更することはできません。",
                            "Cannot paste row merged cells into the table header": "行にマージされたセルをヘッダーに貼り付けることはできません。"
                        }), e.setLanguage(["nl", "nl-NL"], {
                            "Merge cells": "Cellen samenvoegen",
                            "Split cells": "Samengevoegde cellen ongedaan maken",
                            "Cannot change part of merged cell": "Kan geen deel uit van een samengevoegde cel veranderen.",
                            "Cannot paste row merged cells into the table header": "Kan geen rij met samengevoegde cellen in de koptekst plakken."
                        }), e.setLanguage("zh-CN", {
                            "Merge cells": "合并单元格",
                            "Split cells": "取消合并单元格",
                            "Cannot change part of merged cell": "无法更改合并单元格的一部分。",
                            "Cannot paste row merged cells into the table header": "无法将行合并单元格粘贴到标题中。"
                        }), e.setLanguage(["de", "de-DE"], {
                            "Merge cells": "Zellen zusammenführen",
                            "Split cells": "Zusammenführen rückgängig machen",
                            "Cannot change part of merged cell": "Der Teil der verbundenen Zelle kann nicht geändert werden.",
                            "Cannot paste row merged cells into the table header": "Die Zeile der verbundenen Zellen kann nicht in die Kopfzeile eingefügt werden."
                        }), e.setLanguage(["ru", "ru-RU"], {
                            "Merge cells": "Объединить ячейки",
                            "Split cells": "Разъединить ячейки",
                            "Cannot change part of merged cell": "Вы не можете изменять часть комбинированной ячейки.",
                            "Cannot paste row merged cells into the table header": "Вы не можете вставлять объединенные ячейки в заголовок таблицы."
                        }), e.setLanguage(["fr", "fr-FR"], {
                            "Merge cells": "Fusionner les cellules",
                            "Split cells": "Séparer les cellules",
                            "Cannot change part of merged cell": "Impossible de modifier une partie de la cellule fusionnée.",
                            "Cannot paste row merged cells into the table header": "Impossible de coller les cellules fusionnées dans l'en-tête du tableau."
                        }), e.setLanguage(["uk", "uk-UA"], {
                            "Merge cells": "Об'єднати комірки",
                            "Split cells": "Роз'єднати комірки",
                            "Cannot change part of merged cell": "Ви не можете змінювати частину комбінованої комірки.",
                            "Cannot paste row merged cells into the table header": "Ви не можете вставляти об'єднані комірки в заголовок таблиці."
                        }), e.setLanguage(["tr", "tr-TR"], {
                            "Merge cells": "Hücreleri birleştir",
                            "Split cells": "Hücreleri ayır",
                            "Cannot change part of merged cell": "Birleştirilmiş hücrelerin bir kısmı değiştirelemez.",
                            "Cannot paste row merged cells into the table header": "Satırda birleştirilmiş hücreler sütun başlığına yapıştırılamaz"
                        }), e.setLanguage(["fi", "fi-FI"], {
                            "Merge cells": "Yhdistä solut",
                            "Split cells": "Jaa solut",
                            "Cannot change part of merged cell": "Yhdistettyjen solujen osaa ei voi muuttaa",
                            "Cannot paste row merged cells into the table header": "Soluja ei voi yhdistää taulukon otsikkoriviin"
                        }), e.setLanguage(["cs", "cs-CZ"], {
                            "Merge cells": "Spojit buňky",
                            "Split cells": "Rozpojit buňky",
                            "Cannot change part of merged cell": "Nelze měnit část spojené buňky",
                            "Cannot paste row merged cells into the table header": "Nelze vkládat spojené buňky do záhlaví tabulky"
                        }), e.setLanguage("ar", {
                            "Merge cells": "دمج الوحدات",
                            "Split cells": "إلغاء دمج الوحدات",
                            "Cannot change part of merged cell": "لا يمكن تغيير جزء من الخلية المدموجة",
                            "Cannot paste row merged cells into the table header": "لا يمكن لصق الخلايا المدموجة من صف واحد في رأس الجدول"
                        }), e.setLanguage(["pl", "pl-PL"], {
                            "Merge cells": "Scal komórki",
                            "Split cells": "Rozłącz komórki",
                            "Cannot change part of merged cell": "Nie można zmienić części scalonej komórki.",
                            "Cannot paste row merged cells into the table header": "Nie można wkleić komórek o scalonym rzędzie w nagłówek tabeli."
                        }), e.setLanguage("zh-TW", {
                            "Merge cells": "合併儲存格",
                            "Split cells": "取消合併儲存格",
                            "Cannot change part of merged cell": "無法變更儲存格的一部分。",
                            "Cannot paste row merged cells into the table header": "無法將合併的儲存格貼上至表格標題中。"
                        }), e.setLanguage(["gl", "gl-ES"], {
                            "Merge cells": "Combinar celas",
                            "Split cells": "Separar celas",
                            "Cannot change part of merged cell": "Non se pode cambiar parte dunha cela combinada",
                            "Cannot paste row merged cells into the table header": "Non se poden pegar celas no encabezado da táboa"
                        }), e.setLanguage(["sv", "sv-SE"], {
                            "Merge cells": "Sammanfoga celler",
                            "Split cells": "Dela celler",
                            "Cannot change part of merged cell": "Ej möjligt att ändra en del av en sammanfogad cell",
                            "Cannot paste row merged cells into the table header": "Ej möjligt att klistra in rad-sammanfogade celler i tabellens huvud"
                        }), e.setLanguage(["it", "it-IT"], {
                            "Merge cells": "Unisci celle",
                            "Split cells": "Separa celle",
                            "Cannot change part of merged cell": "Non è possibile modificare parte di una cella unita",
                            "Cannot paste row merged cells into the table header": "Non è possibile incollare celle unite per riga nell'intestazione della tabella"
                        }), e.setLanguage(["nb", "nb-NO"], {
                            "Merge cells": "Slå sammen celler",
                            "Split cells": "Separer celler",
                            "Cannot change part of merged cell": "Kan ikke endre deler av sammenslåtte celler",
                            "Cannot paste row merged cells into the table header": "Kan ikke lime inn rad med sammenslåtte celler"
                        }), e.setLanguage(["hr", "hr-HR"], {
                            "Merge cells": "Spoji ćelije",
                            "Split cells": "Odspoji ćelije",
                            "Cannot change part of merged cell": "Ne mogu mijenjati dio spojene ćelije.",
                            "Cannot paste row merged cells into the table header": "Ne mogu zaljepiti redak spojenih ćelija u zaglavlje tablice"
                        })
                    }(n),
                    function(e) {
                        e.eventEmitter.listen("contextmenu", (function() {
                            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                            var a = t[0],
                                r = a.menuGroups,
                                o = a.tableCell,
                                l = m(e, o);
                            l.length && r.splice(2, 0, l)
                        }))
                    }(e), {
                        toHTMLRenderers: o,
                        markdownParsers: t,
                        toMarkdownRenderers: s,
                        wysiwygCommands: E(e, a)
                    }
            }! function(e) {
                e.LEFT = "left", e.RIGHT = "right", e.UP = "up", e.DOWN = "down"
            }(h || (h = {}))
        }(), a = a.default
    }()
}));