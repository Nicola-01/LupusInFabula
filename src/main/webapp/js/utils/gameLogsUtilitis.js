/*!
  * Bootstrap v5.2.0 (https://getbootstrap.com/)
  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).bootstrap = e()
}(this, (function() {
        "use strict";
        const t = "transitionend"
            , e = t=>{
            let e = t.getAttribute("data-bs-target");
            if (!e || "#" === e) {
                let i = t.getAttribute("href");
                if (!i || !i.includes("#") && !i.startsWith("."))
                    return null;
                i.includes("#") && !i.startsWith("#") && (i = `#${i.split("#")[1]}`),
                    e = i && "#" !== i ? i.trim() : null
            }
            return e
        }
            , i = t=>{
            const i = e(t);
            return i && document.querySelector(i) ? i : null
        }
            , n = t=>{
            const i = e(t);
            return i ? document.querySelector(i) : null
        }
            , s = e=>{
            e.dispatchEvent(new Event(t))
        }
            , o = t=>!(!t || "object" != typeof t) && (void 0 !== t.jquery && (t = t[0]),
        void 0 !== t.nodeType)
            , r = t=>o(t) ? t.jquery ? t[0] : t : "string" == typeof t && t.length > 0 ? document.querySelector(t) : null
            , a = t=>{
            if (!o(t) || 0 === t.getClientRects().length)
                return !1;
            const e = "visible" === getComputedStyle(t).getPropertyValue("visibility")
                , i = t.closest("details:not([open])");
            if (!i)
                return e;
            if (i !== t) {
                const e = t.closest("summary");
                if (e && e.parentNode !== i)
                    return !1;
                if (null === e)
                    return !1
            }
            return e
        }
            , l = t=>!t || t.nodeType !== Node.ELEMENT_NODE || !!t.classList.contains("disabled") || (void 0 !== t.disabled ? t.disabled : t.hasAttribute("disabled") && "false" !== t.getAttribute("disabled"))
            , c = t=>{
            if (!document.documentElement.attachShadow)
                return null;
            if ("function" == typeof t.getRootNode) {
                const e = t.getRootNode();
                return e instanceof ShadowRoot ? e : null
            }
            return t instanceof ShadowRoot ? t : t.parentNode ? c(t.parentNode) : null
        }
            , h = ()=>{}
            , d = t=>{
            t.offsetHeight
        }
            , u = ()=>window.jQuery && !document.body.hasAttribute("data-bs-no-jquery") ? window.jQuery : null
            , f = []
            , p = ()=>"rtl" === document.documentElement.dir
            , g = t=>{
            var e;
            e = ()=>{
                const e = u();
                if (e) {
                    const i = t.NAME
                        , n = e.fn[i];
                    e.fn[i] = t.jQueryInterface,
                        e.fn[i].Constructor = t,
                        e.fn[i].noConflict = ()=>(e.fn[i] = n,
                            t.jQueryInterface)
                }
            }
                ,
                "loading" === document.readyState ? (f.length || document.addEventListener("DOMContentLoaded", (()=>{
                        for (const t of f)
                            t()
                    }
                )),
                    f.push(e)) : e()
        }
            , m = t=>{
            "function" == typeof t && t()
        }
            , _ = (e,i,n=!0)=>{
            if (!n)
                return void m(e);
            const o = (t=>{
                    if (!t)
                        return 0;
                    let {transitionDuration: e, transitionDelay: i} = window.getComputedStyle(t);
                    const n = Number.parseFloat(e)
                        , s = Number.parseFloat(i);
                    return n || s ? (e = e.split(",")[0],
                        i = i.split(",")[0],
                    1e3 * (Number.parseFloat(e) + Number.parseFloat(i))) : 0
                }
            )(i) + 5;
            let r = !1;
            const a = ({target: n})=>{
                    n === i && (r = !0,
                        i.removeEventListener(t, a),
                        m(e))
                }
            ;
            i.addEventListener(t, a),
                setTimeout((()=>{
                        r || s(i)
                    }
                ), o)
        }
            , b = (t,e,i,n)=>{
            const s = t.length;
            let o = t.indexOf(e);
            return -1 === o ? !i && n ? t[s - 1] : t[0] : (o += i ? 1 : -1,
            n && (o = (o + s) % s),
                t[Math.max(0, Math.min(o, s - 1))])
        }
            , v = /[^.]*(?=\..*)\.|.*/
            , y = /\..*/
            , w = /::\d+$/
            , A = {};
        let E = 1;
        const T = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }
            , C = new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
        function O(t, e) {
            return e && `${e}::${E++}` || t.uidEvent || E++
        }
        function x(t) {
            const e = O(t);
            return t.uidEvent = e,
                A[e] = A[e] || {},
                A[e]
        }
        function k(t, e, i=null) {
            return Object.values(t).find((t=>t.callable === e && t.delegationSelector === i))
        }
        function L(t, e, i) {
            const n = "string" == typeof e
                , s = n ? i : e || i;
            let o = N(t);
            return C.has(o) || (o = t),
                [n, s, o]
        }
        function D(t, e, i, n, s) {
            if ("string" != typeof e || !t)
                return;
            let[o,r,a] = L(e, i, n);
            if (e in T) {
                const t = t=>function(e) {
                        if (!e.relatedTarget || e.relatedTarget !== e.delegateTarget && !e.delegateTarget.contains(e.relatedTarget))
                            return t.call(this, e)
                    }
                ;
                r = t(r)
            }
            const l = x(t)
                , c = l[a] || (l[a] = {})
                , h = k(c, r, o ? i : null);
            if (h)
                return void (h.oneOff = h.oneOff && s);
            const d = O(r, e.replace(v, ""))
                , u = o ? function(t, e, i) {
                return function n(s) {
                    const o = t.querySelectorAll(e);
                    for (let {target: r} = s; r && r !== this; r = r.parentNode)
                        for (const a of o)
                            if (a === r)
                                return j(s, {
                                    delegateTarget: r
                                }),
                                n.oneOff && P.off(t, s.type, e, i),
                                    i.apply(r, [s])
                }
            }(t, i, r) : function(t, e) {
                return function i(n) {
                    return j(n, {
                        delegateTarget: t
                    }),
                    i.oneOff && P.off(t, n.type, e),
                        e.apply(t, [n])
                }
            }(t, r);
            u.delegationSelector = o ? i : null,
                u.callable = r,
                u.oneOff = s,
                u.uidEvent = d,
                c[d] = u,
                t.addEventListener(a, u, o)
        }
        function S(t, e, i, n, s) {
            const o = k(e[i], n, s);
            o && (t.removeEventListener(i, o, Boolean(s)),
                delete e[i][o.uidEvent])
        }
        function I(t, e, i, n) {
            const s = e[i] || {};
            for (const o of Object.keys(s))
                if (o.includes(n)) {
                    const n = s[o];
                    S(t, e, i, n.callable, n.delegationSelector)
                }
        }
        function N(t) {
            return t = t.replace(y, ""),
            T[t] || t
        }
        const P = {
            on(t, e, i, n) {
                D(t, e, i, n, !1)
            },
            one(t, e, i, n) {
                D(t, e, i, n, !0)
            },
            off(t, e, i, n) {
                if ("string" != typeof e || !t)
                    return;
                const [s,o,r] = L(e, i, n)
                    , a = r !== e
                    , l = x(t)
                    , c = l[r] || {}
                    , h = e.startsWith(".");
                if (void 0 === o) {
                    if (h)
                        for (const i of Object.keys(l))
                            I(t, l, i, e.slice(1));
                    for (const i of Object.keys(c)) {
                        const n = i.replace(w, "");
                        if (!a || e.includes(n)) {
                            const e = c[i];
                            S(t, l, r, e.callable, e.delegationSelector)
                        }
                    }
                } else {
                    if (!Object.keys(c).length)
                        return;
                    S(t, l, r, o, s ? i : null)
                }
            },
            trigger(t, e, i) {
                if ("string" != typeof e || !t)
                    return null;
                const n = u();
                let s = null
                    , o = !0
                    , r = !0
                    , a = !1;
                e !== N(e) && n && (s = n.Event(e, i),
                    n(t).trigger(s),
                    o = !s.isPropagationStopped(),
                    r = !s.isImmediatePropagationStopped(),
                    a = s.isDefaultPrevented());
                let l = new Event(e,{
                    bubbles: o,
                    cancelable: !0
                });
                return l = j(l, i),
                a && l.preventDefault(),
                r && t.dispatchEvent(l),
                l.defaultPrevented && s && s.preventDefault(),
                    l
            }
        };
        function j(t, e) {
            for (const [i,n] of Object.entries(e || {}))
                try {
                    t[i] = n
                } catch (e) {
                    Object.defineProperty(t, i, {
                        configurable: !0,
                        get: ()=>n
                    })
                }
            return t
        }
        const M = new Map
            , H = {
            set(t, e, i) {
                M.has(t) || M.set(t, new Map);
                const n = M.get(t);
                n.has(e) || 0 === n.size ? n.set(e, i) : console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(n.keys())[0]}.`)
            },
            get: (t,e)=>M.has(t) && M.get(t).get(e) || null,
            remove(t, e) {
                if (!M.has(t))
                    return;
                const i = M.get(t);
                i.delete(e),
                0 === i.size && M.delete(t)
            }
        };
        function $(t) {
            if ("true" === t)
                return !0;
            if ("false" === t)
                return !1;
            if (t === Number(t).toString())
                return Number(t);
            if ("" === t || "null" === t)
                return null;
            if ("string" != typeof t)
                return t;
            try {
                return JSON.parse(decodeURIComponent(t))
            } catch (e) {
                return t
            }
        }
        function W(t) {
            return t.replace(/[A-Z]/g, (t=>`-${t.toLowerCase()}`))
        }
        const B = {
            setDataAttribute(t, e, i) {
                t.setAttribute(`data-bs-${W(e)}`, i)
            },
            removeDataAttribute(t, e) {
                t.removeAttribute(`data-bs-${W(e)}`)
            },
            getDataAttributes(t) {
                if (!t)
                    return {};
                const e = {}
                    , i = Object.keys(t.dataset).filter((t=>t.startsWith("bs") && !t.startsWith("bsConfig")));
                for (const n of i) {
                    let i = n.replace(/^bs/, "");
                    i = i.charAt(0).toLowerCase() + i.slice(1, i.length),
                        e[i] = $(t.dataset[n])
                }
                return e
            },
            getDataAttribute: (t,e)=>$(t.getAttribute(`data-bs-${W(e)}`))
        };
        class F {
            static get Default() {
                return {}
            }
            static get DefaultType() {
                return {}
            }
            static get NAME() {
                throw new Error('You have to implement the static method "NAME", for each component!')
            }
            _getConfig(t) {
                return t = this._mergeConfigObj(t),
                    t = this._configAfterMerge(t),
                    this._typeCheckConfig(t),
                    t
            }
            _configAfterMerge(t) {
                return t
            }
            _mergeConfigObj(t, e) {
                const i = o(e) ? B.getDataAttribute(e, "config") : {};
                return {
                    ...this.constructor.Default,
                    ..."object" == typeof i ? i : {},
                    ...o(e) ? B.getDataAttributes(e) : {},
                    ..."object" == typeof t ? t : {}
                }
            }
            _typeCheckConfig(t, e=this.constructor.DefaultType) {
                for (const n of Object.keys(e)) {
                    const s = e[n]
                        , r = t[n]
                        , a = o(r) ? "element" : null == (i = r) ? `${i}` : Object.prototype.toString.call(i).match(/\s([a-z]+)/i)[1].toLowerCase();
                    if (!new RegExp(s).test(a))
                        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${n}" provided type "${a}" but expected type "${s}".`)
                }
                var i
            }
        }
        class z extends F {
            constructor(t, e) {
                super(),
                (t = r(t)) && (this._element = t,
                    this._config = this._getConfig(e),
                    H.set(this._element, this.constructor.DATA_KEY, this))
            }
            dispose() {
                H.remove(this._element, this.constructor.DATA_KEY),
                    P.off(this._element, this.constructor.EVENT_KEY);
                for (const t of Object.getOwnPropertyNames(this))
                    this[t] = null
            }
            _queueCallback(t, e, i=!0) {
                _(t, e, i)
            }
            _getConfig(t) {
                return t = this._mergeConfigObj(t, this._element),
                    t = this._configAfterMerge(t),
                    this._typeCheckConfig(t),
                    t
            }
            static getInstance(t) {
                return H.get(r(t), this.DATA_KEY)
            }
            static getOrCreateInstance(t, e={}) {
                return this.getInstance(t) || new this(t,"object" == typeof e ? e : null)
            }
            static get VERSION() {
                return "5.2.0"
            }
            static get DATA_KEY() {
                return `bs.${this.NAME}`
            }
            static get EVENT_KEY() {
                return `.${this.DATA_KEY}`
            }
            static eventName(t) {
                return `${t}${this.EVENT_KEY}`
            }
        }
        const R = (t,e="hide")=>{
                const i = `click.dismiss${t.EVENT_KEY}`
                    , s = t.NAME;
                P.on(document, i, `[data-bs-dismiss="${s}"]`, (function(i) {
                        if (["A", "AREA"].includes(this.tagName) && i.preventDefault(),
                            l(this))
                            return;
                        const o = n(this) || this.closest(`.${s}`);
                        t.getOrCreateInstance(o)[e]()
                    }
                ))
            }
        ;
        class q extends z {
            static get NAME() {
                return "alert"
            }
            close() {
                if (P.trigger(this._element, "close.bs.alert").defaultPrevented)
                    return;
                this._element.classList.remove("show");
                const t = this._element.classList.contains("fade");
                this._queueCallback((()=>this._destroyElement()), this._element, t)
            }
            _destroyElement() {
                this._element.remove(),
                    P.trigger(this._element, "closed.bs.alert"),
                    this.dispose()
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = q.getOrCreateInstance(this);
                        if ("string" == typeof t) {
                            if (void 0 === e[t] || t.startsWith("_") || "constructor" === t)
                                throw new TypeError(`No method named "${t}"`);
                            e[t](this)
                        }
                    }
                ))
            }
        }
        R(q, "close"),
            g(q);
        const V = '[data-bs-toggle="button"]';
        class K extends z {
            static get NAME() {
                return "button"
            }
            toggle() {
                this._element.setAttribute("aria-pressed", this._element.classList.toggle("active"))
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = K.getOrCreateInstance(this);
                        "toggle" === t && e[t]()
                    }
                ))
            }
        }
        P.on(document, "click.bs.button.data-api", V, (t=>{
                t.preventDefault();
                const e = t.target.closest(V);
                K.getOrCreateInstance(e).toggle()
            }
        )),
            g(K);
        const Q = {
            find: (t,e=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(e, t)),
            findOne: (t,e=document.documentElement)=>Element.prototype.querySelector.call(e, t),
            children: (t,e)=>[].concat(...t.children).filter((t=>t.matches(e))),
            parents(t, e) {
                const i = [];
                let n = t.parentNode.closest(e);
                for (; n; )
                    i.push(n),
                        n = n.parentNode.closest(e);
                return i
            },
            prev(t, e) {
                let i = t.previousElementSibling;
                for (; i; ) {
                    if (i.matches(e))
                        return [i];
                    i = i.previousElementSibling
                }
                return []
            },
            next(t, e) {
                let i = t.nextElementSibling;
                for (; i; ) {
                    if (i.matches(e))
                        return [i];
                    i = i.nextElementSibling
                }
                return []
            },
            focusableChildren(t) {
                const e = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((t=>`${t}:not([tabindex^="-"])`)).join(",");
                return this.find(e, t).filter((t=>!l(t) && a(t)))
            }
        }
            , X = {
            endCallback: null,
            leftCallback: null,
            rightCallback: null
        }
            , Y = {
            endCallback: "(function|null)",
            leftCallback: "(function|null)",
            rightCallback: "(function|null)"
        };
        class U extends F {
            constructor(t, e) {
                super(),
                    this._element = t,
                t && U.isSupported() && (this._config = this._getConfig(e),
                    this._deltaX = 0,
                    this._supportPointerEvents = Boolean(window.PointerEvent),
                    this._initEvents())
            }
            static get Default() {
                return X
            }
            static get DefaultType() {
                return Y
            }
            static get NAME() {
                return "swipe"
            }
            dispose() {
                P.off(this._element, ".bs.swipe")
            }
            _start(t) {
                this._supportPointerEvents ? this._eventIsPointerPenTouch(t) && (this._deltaX = t.clientX) : this._deltaX = t.touches[0].clientX
            }
            _end(t) {
                this._eventIsPointerPenTouch(t) && (this._deltaX = t.clientX - this._deltaX),
                    this._handleSwipe(),
                    m(this._config.endCallback)
            }
            _move(t) {
                this._deltaX = t.touches && t.touches.length > 1 ? 0 : t.touches[0].clientX - this._deltaX
            }
            _handleSwipe() {
                const t = Math.abs(this._deltaX);
                if (t <= 40)
                    return;
                const e = t / this._deltaX;
                this._deltaX = 0,
                e && m(e > 0 ? this._config.rightCallback : this._config.leftCallback)
            }
            _initEvents() {
                this._supportPointerEvents ? (P.on(this._element, "pointerdown.bs.swipe", (t=>this._start(t))),
                    P.on(this._element, "pointerup.bs.swipe", (t=>this._end(t))),
                    this._element.classList.add("pointer-event")) : (P.on(this._element, "touchstart.bs.swipe", (t=>this._start(t))),
                    P.on(this._element, "touchmove.bs.swipe", (t=>this._move(t))),
                    P.on(this._element, "touchend.bs.swipe", (t=>this._end(t))))
            }
            _eventIsPointerPenTouch(t) {
                return this._supportPointerEvents && ("pen" === t.pointerType || "touch" === t.pointerType)
            }
            static isSupported() {
                return "ontouchstart"in document.documentElement || navigator.maxTouchPoints > 0
            }
        }
        const G = "next"
            , J = "prev"
            , Z = "left"
            , tt = "right"
            , et = "slid.bs.carousel"
            , it = "carousel"
            , nt = "active"
            , st = {
            ArrowLeft: tt,
            ArrowRight: Z
        }
            , ot = {
            interval: 5e3,
            keyboard: !0,
            pause: "hover",
            ride: !1,
            touch: !0,
            wrap: !0
        }
            , rt = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            pause: "(string|boolean)",
            ride: "(boolean|string)",
            touch: "boolean",
            wrap: "boolean"
        };
        class at extends z {
            constructor(t, e) {
                super(t, e),
                    this._interval = null,
                    this._activeElement = null,
                    this._isSliding = !1,
                    this.touchTimeout = null,
                    this._swipeHelper = null,
                    this._indicatorsElement = Q.findOne(".carousel-indicators", this._element),
                    this._addEventListeners(),
                this._config.ride === it && this.cycle()
            }
            static get Default() {
                return ot
            }
            static get DefaultType() {
                return rt
            }
            static get NAME() {
                return "carousel"
            }
            next() {
                this._slide(G)
            }
            nextWhenVisible() {
                !document.hidden && a(this._element) && this.next()
            }
            prev() {
                this._slide(J)
            }
            pause() {
                this._isSliding && s(this._element),
                    this._clearInterval()
            }
            cycle() {
                this._clearInterval(),
                    this._updateInterval(),
                    this._interval = setInterval((()=>this.nextWhenVisible()), this._config.interval)
            }
            _maybeEnableCycle() {
                this._config.ride && (this._isSliding ? P.one(this._element, et, (()=>this.cycle())) : this.cycle())
            }
            to(t) {
                const e = this._getItems();
                if (t > e.length - 1 || t < 0)
                    return;
                if (this._isSliding)
                    return void P.one(this._element, et, (()=>this.to(t)));
                const i = this._getItemIndex(this._getActive());
                if (i === t)
                    return;
                const n = t > i ? G : J;
                this._slide(n, e[t])
            }
            dispose() {
                this._swipeHelper && this._swipeHelper.dispose(),
                    super.dispose()
            }
            _configAfterMerge(t) {
                return t.defaultInterval = t.interval,
                    t
            }
            _addEventListeners() {
                this._config.keyboard && P.on(this._element, "keydown.bs.carousel", (t=>this._keydown(t))),
                "hover" === this._config.pause && (P.on(this._element, "mouseenter.bs.carousel", (()=>this.pause())),
                    P.on(this._element, "mouseleave.bs.carousel", (()=>this._maybeEnableCycle()))),
                this._config.touch && U.isSupported() && this._addTouchEventListeners()
            }
            _addTouchEventListeners() {
                for (const t of Q.find(".carousel-item img", this._element))
                    P.on(t, "dragstart.bs.carousel", (t=>t.preventDefault()));
                const t = {
                    leftCallback: ()=>this._slide(this._directionToOrder(Z)),
                    rightCallback: ()=>this._slide(this._directionToOrder(tt)),
                    endCallback: ()=>{
                        "hover" === this._config.pause && (this.pause(),
                        this.touchTimeout && clearTimeout(this.touchTimeout),
                            this.touchTimeout = setTimeout((()=>this._maybeEnableCycle()), 500 + this._config.interval))
                    }
                };
                this._swipeHelper = new U(this._element,t)
            }
            _keydown(t) {
                if (/input|textarea/i.test(t.target.tagName))
                    return;
                const e = st[t.key];
                e && (t.preventDefault(),
                    this._slide(this._directionToOrder(e)))
            }
            _getItemIndex(t) {
                return this._getItems().indexOf(t)
            }
            _setActiveIndicatorElement(t) {
                if (!this._indicatorsElement)
                    return;
                const e = Q.findOne(".active", this._indicatorsElement);
                e.classList.remove(nt),
                    e.removeAttribute("aria-current");
                const i = Q.findOne(`[data-bs-slide-to="${t}"]`, this._indicatorsElement);
                i && (i.classList.add(nt),
                    i.setAttribute("aria-current", "true"))
            }
            _updateInterval() {
                const t = this._activeElement || this._getActive();
                if (!t)
                    return;
                const e = Number.parseInt(t.getAttribute("data-bs-interval"), 10);
                this._config.interval = e || this._config.defaultInterval
            }
            _slide(t, e=null) {
                if (this._isSliding)
                    return;
                const i = this._getActive()
                    , n = t === G
                    , s = e || b(this._getItems(), i, n, this._config.wrap);
                if (s === i)
                    return;
                const o = this._getItemIndex(s)
                    , r = e=>P.trigger(this._element, e, {
                    relatedTarget: s,
                    direction: this._orderToDirection(t),
                    from: this._getItemIndex(i),
                    to: o
                });
                if (r("slide.bs.carousel").defaultPrevented)
                    return;
                if (!i || !s)
                    return;
                const a = Boolean(this._interval);
                this.pause(),
                    this._isSliding = !0,
                    this._setActiveIndicatorElement(o),
                    this._activeElement = s;
                const l = n ? "carousel-item-start" : "carousel-item-end"
                    , c = n ? "carousel-item-next" : "carousel-item-prev";
                s.classList.add(c),
                    d(s),
                    i.classList.add(l),
                    s.classList.add(l),
                    this._queueCallback((()=>{
                            s.classList.remove(l, c),
                                s.classList.add(nt),
                                i.classList.remove(nt, c, l),
                                this._isSliding = !1,
                                r(et)
                        }
                    ), i, this._isAnimated()),
                a && this.cycle()
            }
            _isAnimated() {
                return this._element.classList.contains("slide")
            }
            _getActive() {
                return Q.findOne(".active.carousel-item", this._element)
            }
            _getItems() {
                return Q.find(".carousel-item", this._element)
            }
            _clearInterval() {
                this._interval && (clearInterval(this._interval),
                    this._interval = null)
            }
            _directionToOrder(t) {
                return p() ? t === Z ? J : G : t === Z ? G : J
            }
            _orderToDirection(t) {
                return p() ? t === J ? Z : tt : t === J ? tt : Z
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = at.getOrCreateInstance(this, t);
                        if ("number" != typeof t) {
                            if ("string" == typeof t) {
                                if (void 0 === e[t] || t.startsWith("_") || "constructor" === t)
                                    throw new TypeError(`No method named "${t}"`);
                                e[t]()
                            }
                        } else
                            e.to(t)
                    }
                ))
            }
        }
        P.on(document, "click.bs.carousel.data-api", "[data-bs-slide], [data-bs-slide-to]", (function(t) {
                const e = n(this);
                if (!e || !e.classList.contains(it))
                    return;
                t.preventDefault();
                const i = at.getOrCreateInstance(e)
                    , s = this.getAttribute("data-bs-slide-to");
                return s ? (i.to(s),
                    void i._maybeEnableCycle()) : "next" === B.getDataAttribute(this, "slide") ? (i.next(),
                    void i._maybeEnableCycle()) : (i.prev(),
                    void i._maybeEnableCycle())
            }
        )),
            P.on(window, "load.bs.carousel.data-api", (()=>{
                    const t = Q.find('[data-bs-ride="carousel"]');
                    for (const e of t)
                        at.getOrCreateInstance(e)
                }
            )),
            g(at);
        const lt = "show"
            , ct = "collapse"
            , ht = "collapsing"
            , dt = '[data-bs-toggle="collapse"]'
            , ut = {
            parent: null,
            toggle: !0
        }
            , ft = {
            parent: "(null|element)",
            toggle: "boolean"
        };
        class pt extends z {
            constructor(t, e) {
                super(t, e),
                    this._isTransitioning = !1,
                    this._triggerArray = [];
                const n = Q.find(dt);
                for (const t of n) {
                    const e = i(t)
                        , n = Q.find(e).filter((t=>t === this._element));
                    null !== e && n.length && this._triggerArray.push(t)
                }
                this._initializeChildren(),
                this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()),
                this._config.toggle && this.toggle()
            }
            static get Default() {
                return ut
            }
            static get DefaultType() {
                return ft
            }
            static get NAME() {
                return "collapse"
            }
            toggle() {
                this._isShown() ? this.hide() : this.show()
            }
            show() {
                if (this._isTransitioning || this._isShown())
                    return;
                let t = [];
                if (this._config.parent && (t = this._getFirstLevelChildren(".collapse.show, .collapse.collapsing").filter((t=>t !== this._element)).map((t=>pt.getOrCreateInstance(t, {
                    toggle: !1
                })))),
                t.length && t[0]._isTransitioning)
                    return;
                if (P.trigger(this._element, "show.bs.collapse").defaultPrevented)
                    return;
                for (const e of t)
                    e.hide();
                const e = this._getDimension();
                this._element.classList.remove(ct),
                    this._element.classList.add(ht),
                    this._element.style[e] = 0,
                    this._addAriaAndCollapsedClass(this._triggerArray, !0),
                    this._isTransitioning = !0;
                const i = `scroll${e[0].toUpperCase() + e.slice(1)}`;
                this._queueCallback((()=>{
                        this._isTransitioning = !1,
                            this._element.classList.remove(ht),
                            this._element.classList.add(ct, lt),
                            this._element.style[e] = "",
                            P.trigger(this._element, "shown.bs.collapse")
                    }
                ), this._element, !0),
                    this._element.style[e] = `${this._element[i]}px`
            }
            hide() {
                if (this._isTransitioning || !this._isShown())
                    return;
                if (P.trigger(this._element, "hide.bs.collapse").defaultPrevented)
                    return;
                const t = this._getDimension();
                this._element.style[t] = `${this._element.getBoundingClientRect()[t]}px`,
                    d(this._element),
                    this._element.classList.add(ht),
                    this._element.classList.remove(ct, lt);
                for (const t of this._triggerArray) {
                    const e = n(t);
                    e && !this._isShown(e) && this._addAriaAndCollapsedClass([t], !1)
                }
                this._isTransitioning = !0,
                    this._element.style[t] = "",
                    this._queueCallback((()=>{
                            this._isTransitioning = !1,
                                this._element.classList.remove(ht),
                                this._element.classList.add(ct),
                                P.trigger(this._element, "hidden.bs.collapse")
                        }
                    ), this._element, !0)
            }
            _isShown(t=this._element) {
                return t.classList.contains(lt)
            }
            _configAfterMerge(t) {
                return t.toggle = Boolean(t.toggle),
                    t.parent = r(t.parent),
                    t
            }
            _getDimension() {
                return this._element.classList.contains("collapse-horizontal") ? "width" : "height"
            }
            _initializeChildren() {
                if (!this._config.parent)
                    return;
                const t = this._getFirstLevelChildren(dt);
                for (const e of t) {
                    const t = n(e);
                    t && this._addAriaAndCollapsedClass([e], this._isShown(t))
                }
            }
            _getFirstLevelChildren(t) {
                const e = Q.find(":scope .collapse .collapse", this._config.parent);
                return Q.find(t, this._config.parent).filter((t=>!e.includes(t)))
            }
            _addAriaAndCollapsedClass(t, e) {
                if (t.length)
                    for (const i of t)
                        i.classList.toggle("collapsed", !e),
                            i.setAttribute("aria-expanded", e)
            }
            static jQueryInterface(t) {
                const e = {};
                return "string" == typeof t && /show|hide/.test(t) && (e.toggle = !1),
                    this.each((function() {
                            const i = pt.getOrCreateInstance(this, e);
                            if ("string" == typeof t) {
                                if (void 0 === i[t])
                                    throw new TypeError(`No method named "${t}"`);
                                i[t]()
                            }
                        }
                    ))
            }
        }
        P.on(document, "click.bs.collapse.data-api", dt, (function(t) {
                ("A" === t.target.tagName || t.delegateTarget && "A" === t.delegateTarget.tagName) && t.preventDefault();
                const e = i(this)
                    , n = Q.find(e);
                for (const t of n)
                    pt.getOrCreateInstance(t, {
                        toggle: !1
                    }).toggle()
            }
        )),
            g(pt);
        var gt = "top"
            , mt = "bottom"
            , _t = "right"
            , bt = "left"
            , vt = "auto"
            , yt = [gt, mt, _t, bt]
            , wt = "start"
            , At = "end"
            , Et = "clippingParents"
            , Tt = "viewport"
            , Ct = "popper"
            , Ot = "reference"
            , xt = yt.reduce((function(t, e) {
                return t.concat([e + "-" + wt, e + "-" + At])
            }
        ), [])
            , kt = [].concat(yt, [vt]).reduce((function(t, e) {
                return t.concat([e, e + "-" + wt, e + "-" + At])
            }
        ), [])
            , Lt = "beforeRead"
            , Dt = "read"
            , St = "afterRead"
            , It = "beforeMain"
            , Nt = "main"
            , Pt = "afterMain"
            , jt = "beforeWrite"
            , Mt = "write"
            , Ht = "afterWrite"
            , $t = [Lt, Dt, St, It, Nt, Pt, jt, Mt, Ht];
        function Wt(t) {
            return t ? (t.nodeName || "").toLowerCase() : null
        }
        function Bt(t) {
            if (null == t)
                return window;
            if ("[object Window]" !== t.toString()) {
                var e = t.ownerDocument;
                return e && e.defaultView || window
            }
            return t
        }
        function Ft(t) {
            return t instanceof Bt(t).Element || t instanceof Element
        }
        function zt(t) {
            return t instanceof Bt(t).HTMLElement || t instanceof HTMLElement
        }
        function Rt(t) {
            return "undefined" != typeof ShadowRoot && (t instanceof Bt(t).ShadowRoot || t instanceof ShadowRoot)
        }
        const qt = {
            name: "applyStyles",
            enabled: !0,
            phase: "write",
            fn: function(t) {
                var e = t.state;
                Object.keys(e.elements).forEach((function(t) {
                        var i = e.styles[t] || {}
                            , n = e.attributes[t] || {}
                            , s = e.elements[t];
                        zt(s) && Wt(s) && (Object.assign(s.style, i),
                            Object.keys(n).forEach((function(t) {
                                    var e = n[t];
                                    !1 === e ? s.removeAttribute(t) : s.setAttribute(t, !0 === e ? "" : e)
                                }
                            )))
                    }
                ))
            },
            effect: function(t) {
                var e = t.state
                    , i = {
                    popper: {
                        position: e.options.strategy,
                        left: "0",
                        top: "0",
                        margin: "0"
                    },
                    arrow: {
                        position: "absolute"
                    },
                    reference: {}
                };
                return Object.assign(e.elements.popper.style, i.popper),
                    e.styles = i,
                e.elements.arrow && Object.assign(e.elements.arrow.style, i.arrow),
                    function() {
                        Object.keys(e.elements).forEach((function(t) {
                                var n = e.elements[t]
                                    , s = e.attributes[t] || {}
                                    , o = Object.keys(e.styles.hasOwnProperty(t) ? e.styles[t] : i[t]).reduce((function(t, e) {
                                        return t[e] = "",
                                            t
                                    }
                                ), {});
                                zt(n) && Wt(n) && (Object.assign(n.style, o),
                                    Object.keys(s).forEach((function(t) {
                                            n.removeAttribute(t)
                                        }
                                    )))
                            }
                        ))
                    }
            },
            requires: ["computeStyles"]
        };
        function Vt(t) {
            return t.split("-")[0]
        }
        var Kt = Math.max
            , Qt = Math.min
            , Xt = Math.round;
        function Yt(t, e) {
            void 0 === e && (e = !1);
            var i = t.getBoundingClientRect()
                , n = 1
                , s = 1;
            if (zt(t) && e) {
                var o = t.offsetHeight
                    , r = t.offsetWidth;
                r > 0 && (n = Xt(i.width) / r || 1),
                o > 0 && (s = Xt(i.height) / o || 1)
            }
            return {
                width: i.width / n,
                height: i.height / s,
                top: i.top / s,
                right: i.right / n,
                bottom: i.bottom / s,
                left: i.left / n,
                x: i.left / n,
                y: i.top / s
            }
        }
        function Ut(t) {
            var e = Yt(t)
                , i = t.offsetWidth
                , n = t.offsetHeight;
            return Math.abs(e.width - i) <= 1 && (i = e.width),
            Math.abs(e.height - n) <= 1 && (n = e.height),
                {
                    x: t.offsetLeft,
                    y: t.offsetTop,
                    width: i,
                    height: n
                }
        }
        function Gt(t, e) {
            var i = e.getRootNode && e.getRootNode();
            if (t.contains(e))
                return !0;
            if (i && Rt(i)) {
                var n = e;
                do {
                    if (n && t.isSameNode(n))
                        return !0;
                    n = n.parentNode || n.host
                } while (n)
            }
            return !1
        }
        function Jt(t) {
            return Bt(t).getComputedStyle(t)
        }
        function Zt(t) {
            return ["table", "td", "th"].indexOf(Wt(t)) >= 0
        }
        function te(t) {
            return ((Ft(t) ? t.ownerDocument : t.document) || window.document).documentElement
        }
        function ee(t) {
            return "html" === Wt(t) ? t : t.assignedSlot || t.parentNode || (Rt(t) ? t.host : null) || te(t)
        }
        function ie(t) {
            return zt(t) && "fixed" !== Jt(t).position ? t.offsetParent : null
        }
        function ne(t) {
            for (var e = Bt(t), i = ie(t); i && Zt(i) && "static" === Jt(i).position; )
                i = ie(i);
            return i && ("html" === Wt(i) || "body" === Wt(i) && "static" === Jt(i).position) ? e : i || function(t) {
                var e = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
                if (-1 !== navigator.userAgent.indexOf("Trident") && zt(t) && "fixed" === Jt(t).position)
                    return null;
                var i = ee(t);
                for (Rt(i) && (i = i.host); zt(i) && ["html", "body"].indexOf(Wt(i)) < 0; ) {
                    var n = Jt(i);
                    if ("none" !== n.transform || "none" !== n.perspective || "paint" === n.contain || -1 !== ["transform", "perspective"].indexOf(n.willChange) || e && "filter" === n.willChange || e && n.filter && "none" !== n.filter)
                        return i;
                    i = i.parentNode
                }
                return null
            }(t) || e
        }
        function se(t) {
            return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y"
        }
        function oe(t, e, i) {
            return Kt(t, Qt(e, i))
        }
        function re(t) {
            return Object.assign({}, {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }, t)
        }
        function ae(t, e) {
            return e.reduce((function(e, i) {
                    return e[i] = t,
                        e
                }
            ), {})
        }
        const le = {
            name: "arrow",
            enabled: !0,
            phase: "main",
            fn: function(t) {
                var e, i = t.state, n = t.name, s = t.options, o = i.elements.arrow, r = i.modifiersData.popperOffsets, a = Vt(i.placement), l = se(a), c = [bt, _t].indexOf(a) >= 0 ? "height" : "width";
                if (o && r) {
                    var h = function(t, e) {
                        return re("number" != typeof (t = "function" == typeof t ? t(Object.assign({}, e.rects, {
                            placement: e.placement
                        })) : t) ? t : ae(t, yt))
                    }(s.padding, i)
                        , d = Ut(o)
                        , u = "y" === l ? gt : bt
                        , f = "y" === l ? mt : _t
                        , p = i.rects.reference[c] + i.rects.reference[l] - r[l] - i.rects.popper[c]
                        , g = r[l] - i.rects.reference[l]
                        , m = ne(o)
                        , _ = m ? "y" === l ? m.clientHeight || 0 : m.clientWidth || 0 : 0
                        , b = p / 2 - g / 2
                        , v = h[u]
                        , y = _ - d[c] - h[f]
                        , w = _ / 2 - d[c] / 2 + b
                        , A = oe(v, w, y)
                        , E = l;
                    i.modifiersData[n] = ((e = {})[E] = A,
                        e.centerOffset = A - w,
                        e)
                }
            },
            effect: function(t) {
                var e = t.state
                    , i = t.options.element
                    , n = void 0 === i ? "[data-popper-arrow]" : i;
                null != n && ("string" != typeof n || (n = e.elements.popper.querySelector(n))) && Gt(e.elements.popper, n) && (e.elements.arrow = n)
            },
            requires: ["popperOffsets"],
            requiresIfExists: ["preventOverflow"]
        };
        function ce(t) {
            return t.split("-")[1]
        }
        var he = {
            top: "auto",
            right: "auto",
            bottom: "auto",
            left: "auto"
        };
        function de(t) {
            var e, i = t.popper, n = t.popperRect, s = t.placement, o = t.variation, r = t.offsets, a = t.position, l = t.gpuAcceleration, c = t.adaptive, h = t.roundOffsets, d = t.isFixed, u = r.x, f = void 0 === u ? 0 : u, p = r.y, g = void 0 === p ? 0 : p, m = "function" == typeof h ? h({
                x: f,
                y: g
            }) : {
                x: f,
                y: g
            };
            f = m.x,
                g = m.y;
            var _ = r.hasOwnProperty("x")
                , b = r.hasOwnProperty("y")
                , v = bt
                , y = gt
                , w = window;
            if (c) {
                var A = ne(i)
                    , E = "clientHeight"
                    , T = "clientWidth";
                A === Bt(i) && "static" !== Jt(A = te(i)).position && "absolute" === a && (E = "scrollHeight",
                    T = "scrollWidth"),
                (s === gt || (s === bt || s === _t) && o === At) && (y = mt,
                    g -= (d && A === w && w.visualViewport ? w.visualViewport.height : A[E]) - n.height,
                    g *= l ? 1 : -1),
                s !== bt && (s !== gt && s !== mt || o !== At) || (v = _t,
                    f -= (d && A === w && w.visualViewport ? w.visualViewport.width : A[T]) - n.width,
                    f *= l ? 1 : -1)
            }
            var C, O = Object.assign({
                position: a
            }, c && he), x = !0 === h ? function(t) {
                var e = t.x
                    , i = t.y
                    , n = window.devicePixelRatio || 1;
                return {
                    x: Xt(e * n) / n || 0,
                    y: Xt(i * n) / n || 0
                }
            }({
                x: f,
                y: g
            }) : {
                x: f,
                y: g
            };
            return f = x.x,
                g = x.y,
                l ? Object.assign({}, O, ((C = {})[y] = b ? "0" : "",
                    C[v] = _ ? "0" : "",
                    C.transform = (w.devicePixelRatio || 1) <= 1 ? "translate(" + f + "px, " + g + "px)" : "translate3d(" + f + "px, " + g + "px, 0)",
                    C)) : Object.assign({}, O, ((e = {})[y] = b ? g + "px" : "",
                    e[v] = _ ? f + "px" : "",
                    e.transform = "",
                    e))
        }
        const ue = {
            name: "computeStyles",
            enabled: !0,
            phase: "beforeWrite",
            fn: function(t) {
                var e = t.state
                    , i = t.options
                    , n = i.gpuAcceleration
                    , s = void 0 === n || n
                    , o = i.adaptive
                    , r = void 0 === o || o
                    , a = i.roundOffsets
                    , l = void 0 === a || a
                    , c = {
                    placement: Vt(e.placement),
                    variation: ce(e.placement),
                    popper: e.elements.popper,
                    popperRect: e.rects.popper,
                    gpuAcceleration: s,
                    isFixed: "fixed" === e.options.strategy
                };
                null != e.modifiersData.popperOffsets && (e.styles.popper = Object.assign({}, e.styles.popper, de(Object.assign({}, c, {
                    offsets: e.modifiersData.popperOffsets,
                    position: e.options.strategy,
                    adaptive: r,
                    roundOffsets: l
                })))),
                null != e.modifiersData.arrow && (e.styles.arrow = Object.assign({}, e.styles.arrow, de(Object.assign({}, c, {
                    offsets: e.modifiersData.arrow,
                    position: "absolute",
                    adaptive: !1,
                    roundOffsets: l
                })))),
                    e.attributes.popper = Object.assign({}, e.attributes.popper, {
                        "data-popper-placement": e.placement
                    })
            },
            data: {}
        };
        var fe = {
            passive: !0
        };
        const pe = {
            name: "eventListeners",
            enabled: !0,
            phase: "write",
            fn: function() {},
            effect: function(t) {
                var e = t.state
                    , i = t.instance
                    , n = t.options
                    , s = n.scroll
                    , o = void 0 === s || s
                    , r = n.resize
                    , a = void 0 === r || r
                    , l = Bt(e.elements.popper)
                    , c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
                return o && c.forEach((function(t) {
                        t.addEventListener("scroll", i.update, fe)
                    }
                )),
                a && l.addEventListener("resize", i.update, fe),
                    function() {
                        o && c.forEach((function(t) {
                                t.removeEventListener("scroll", i.update, fe)
                            }
                        )),
                        a && l.removeEventListener("resize", i.update, fe)
                    }
            },
            data: {}
        };
        var ge = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };
        function me(t) {
            return t.replace(/left|right|bottom|top/g, (function(t) {
                    return ge[t]
                }
            ))
        }
        var _e = {
            start: "end",
            end: "start"
        };
        function be(t) {
            return t.replace(/start|end/g, (function(t) {
                    return _e[t]
                }
            ))
        }
        function ve(t) {
            var e = Bt(t);
            return {
                scrollLeft: e.pageXOffset,
                scrollTop: e.pageYOffset
            }
        }
        function ye(t) {
            return Yt(te(t)).left + ve(t).scrollLeft
        }
        function we(t) {
            var e = Jt(t)
                , i = e.overflow
                , n = e.overflowX
                , s = e.overflowY;
            return /auto|scroll|overlay|hidden/.test(i + s + n)
        }
        function Ae(t) {
            return ["html", "body", "#document"].indexOf(Wt(t)) >= 0 ? t.ownerDocument.body : zt(t) && we(t) ? t : Ae(ee(t))
        }
        function Ee(t, e) {
            var i;
            void 0 === e && (e = []);
            var n = Ae(t)
                , s = n === (null == (i = t.ownerDocument) ? void 0 : i.body)
                , o = Bt(n)
                , r = s ? [o].concat(o.visualViewport || [], we(n) ? n : []) : n
                , a = e.concat(r);
            return s ? a : a.concat(Ee(ee(r)))
        }
        function Te(t) {
            return Object.assign({}, t, {
                left: t.x,
                top: t.y,
                right: t.x + t.width,
                bottom: t.y + t.height
            })
        }
        function Ce(t, e) {
            return e === Tt ? Te(function(t) {
                var e = Bt(t)
                    , i = te(t)
                    , n = e.visualViewport
                    , s = i.clientWidth
                    , o = i.clientHeight
                    , r = 0
                    , a = 0;
                return n && (s = n.width,
                    o = n.height,
                /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (r = n.offsetLeft,
                    a = n.offsetTop)),
                    {
                        width: s,
                        height: o,
                        x: r + ye(t),
                        y: a
                    }
            }(t)) : Ft(e) ? function(t) {
                var e = Yt(t);
                return e.top = e.top + t.clientTop,
                    e.left = e.left + t.clientLeft,
                    e.bottom = e.top + t.clientHeight,
                    e.right = e.left + t.clientWidth,
                    e.width = t.clientWidth,
                    e.height = t.clientHeight,
                    e.x = e.left,
                    e.y = e.top,
                    e
            }(e) : Te(function(t) {
                var e, i = te(t), n = ve(t), s = null == (e = t.ownerDocument) ? void 0 : e.body, o = Kt(i.scrollWidth, i.clientWidth, s ? s.scrollWidth : 0, s ? s.clientWidth : 0), r = Kt(i.scrollHeight, i.clientHeight, s ? s.scrollHeight : 0, s ? s.clientHeight : 0), a = -n.scrollLeft + ye(t), l = -n.scrollTop;
                return "rtl" === Jt(s || i).direction && (a += Kt(i.clientWidth, s ? s.clientWidth : 0) - o),
                    {
                        width: o,
                        height: r,
                        x: a,
                        y: l
                    }
            }(te(t)))
        }
        function Oe(t) {
            var e, i = t.reference, n = t.element, s = t.placement, o = s ? Vt(s) : null, r = s ? ce(s) : null, a = i.x + i.width / 2 - n.width / 2, l = i.y + i.height / 2 - n.height / 2;
            switch (o) {
                case gt:
                    e = {
                        x: a,
                        y: i.y - n.height
                    };
                    break;
                case mt:
                    e = {
                        x: a,
                        y: i.y + i.height
                    };
                    break;
                case _t:
                    e = {
                        x: i.x + i.width,
                        y: l
                    };
                    break;
                case bt:
                    e = {
                        x: i.x - n.width,
                        y: l
                    };
                    break;
                default:
                    e = {
                        x: i.x,
                        y: i.y
                    }
            }
            var c = o ? se(o) : null;
            if (null != c) {
                var h = "y" === c ? "height" : "width";
                switch (r) {
                    case wt:
                        e[c] = e[c] - (i[h] / 2 - n[h] / 2);
                        break;
                    case At:
                        e[c] = e[c] + (i[h] / 2 - n[h] / 2)
                }
            }
            return e
        }
        function xe(t, e) {
            void 0 === e && (e = {});
            var i = e
                , n = i.placement
                , s = void 0 === n ? t.placement : n
                , o = i.boundary
                , r = void 0 === o ? Et : o
                , a = i.rootBoundary
                , l = void 0 === a ? Tt : a
                , c = i.elementContext
                , h = void 0 === c ? Ct : c
                , d = i.altBoundary
                , u = void 0 !== d && d
                , f = i.padding
                , p = void 0 === f ? 0 : f
                , g = re("number" != typeof p ? p : ae(p, yt))
                , m = h === Ct ? Ot : Ct
                , _ = t.rects.popper
                , b = t.elements[u ? m : h]
                , v = function(t, e, i) {
                var n = "clippingParents" === e ? function(t) {
                    var e = Ee(ee(t))
                        , i = ["absolute", "fixed"].indexOf(Jt(t).position) >= 0 && zt(t) ? ne(t) : t;
                    return Ft(i) ? e.filter((function(t) {
                            return Ft(t) && Gt(t, i) && "body" !== Wt(t)
                        }
                    )) : []
                }(t) : [].concat(e)
                    , s = [].concat(n, [i])
                    , o = s[0]
                    , r = s.reduce((function(e, i) {
                        var n = Ce(t, i);
                        return e.top = Kt(n.top, e.top),
                            e.right = Qt(n.right, e.right),
                            e.bottom = Qt(n.bottom, e.bottom),
                            e.left = Kt(n.left, e.left),
                            e
                    }
                ), Ce(t, o));
                return r.width = r.right - r.left,
                    r.height = r.bottom - r.top,
                    r.x = r.left,
                    r.y = r.top,
                    r
            }(Ft(b) ? b : b.contextElement || te(t.elements.popper), r, l)
                , y = Yt(t.elements.reference)
                , w = Oe({
                reference: y,
                element: _,
                strategy: "absolute",
                placement: s
            })
                , A = Te(Object.assign({}, _, w))
                , E = h === Ct ? A : y
                , T = {
                top: v.top - E.top + g.top,
                bottom: E.bottom - v.bottom + g.bottom,
                left: v.left - E.left + g.left,
                right: E.right - v.right + g.right
            }
                , C = t.modifiersData.offset;
            if (h === Ct && C) {
                var O = C[s];
                Object.keys(T).forEach((function(t) {
                        var e = [_t, mt].indexOf(t) >= 0 ? 1 : -1
                            , i = [gt, mt].indexOf(t) >= 0 ? "y" : "x";
                        T[t] += O[i] * e
                    }
                ))
            }
            return T
        }
        function ke(t, e) {
            void 0 === e && (e = {});
            var i = e
                , n = i.placement
                , s = i.boundary
                , o = i.rootBoundary
                , r = i.padding
                , a = i.flipVariations
                , l = i.allowedAutoPlacements
                , c = void 0 === l ? kt : l
                , h = ce(n)
                , d = h ? a ? xt : xt.filter((function(t) {
                    return ce(t) === h
                }
            )) : yt
                , u = d.filter((function(t) {
                    return c.indexOf(t) >= 0
                }
            ));
            0 === u.length && (u = d);
            var f = u.reduce((function(e, i) {
                    return e[i] = xe(t, {
                        placement: i,
                        boundary: s,
                        rootBoundary: o,
                        padding: r
                    })[Vt(i)],
                        e
                }
            ), {});
            return Object.keys(f).sort((function(t, e) {
                    return f[t] - f[e]
                }
            ))
        }
        const Le = {
            name: "flip",
            enabled: !0,
            phase: "main",
            fn: function(t) {
                var e = t.state
                    , i = t.options
                    , n = t.name;
                if (!e.modifiersData[n]._skip) {
                    for (var s = i.mainAxis, o = void 0 === s || s, r = i.altAxis, a = void 0 === r || r, l = i.fallbackPlacements, c = i.padding, h = i.boundary, d = i.rootBoundary, u = i.altBoundary, f = i.flipVariations, p = void 0 === f || f, g = i.allowedAutoPlacements, m = e.options.placement, _ = Vt(m), b = l || (_ !== m && p ? function(t) {
                        if (Vt(t) === vt)
                            return [];
                        var e = me(t);
                        return [be(t), e, be(e)]
                    }(m) : [me(m)]), v = [m].concat(b).reduce((function(t, i) {
                            return t.concat(Vt(i) === vt ? ke(e, {
                                placement: i,
                                boundary: h,
                                rootBoundary: d,
                                padding: c,
                                flipVariations: p,
                                allowedAutoPlacements: g
                            }) : i)
                        }
                    ), []), y = e.rects.reference, w = e.rects.popper, A = new Map, E = !0, T = v[0], C = 0; C < v.length; C++) {
                        var O = v[C]
                            , x = Vt(O)
                            , k = ce(O) === wt
                            , L = [gt, mt].indexOf(x) >= 0
                            , D = L ? "width" : "height"
                            , S = xe(e, {
                            placement: O,
                            boundary: h,
                            rootBoundary: d,
                            altBoundary: u,
                            padding: c
                        })
                            , I = L ? k ? _t : bt : k ? mt : gt;
                        y[D] > w[D] && (I = me(I));
                        var N = me(I)
                            , P = [];
                        if (o && P.push(S[x] <= 0),
                        a && P.push(S[I] <= 0, S[N] <= 0),
                            P.every((function(t) {
                                    return t
                                }
                            ))) {
                            T = O,
                                E = !1;
                            break
                        }
                        A.set(O, P)
                    }
                    if (E)
                        for (var j = function(t) {
                            var e = v.find((function(e) {
                                    var i = A.get(e);
                                    if (i)
                                        return i.slice(0, t).every((function(t) {
                                                return t
                                            }
                                        ))
                                }
                            ));
                            if (e)
                                return T = e,
                                    "break"
                        }, M = p ? 3 : 1; M > 0 && "break" !== j(M); M--)
                            ;
                    e.placement !== T && (e.modifiersData[n]._skip = !0,
                        e.placement = T,
                        e.reset = !0)
                }
            },
            requiresIfExists: ["offset"],
            data: {
                _skip: !1
            }
        };
        function De(t, e, i) {
            return void 0 === i && (i = {
                x: 0,
                y: 0
            }),
                {
                    top: t.top - e.height - i.y,
                    right: t.right - e.width + i.x,
                    bottom: t.bottom - e.height + i.y,
                    left: t.left - e.width - i.x
                }
        }
        function Se(t) {
            return [gt, _t, mt, bt].some((function(e) {
                    return t[e] >= 0
                }
            ))
        }
        const Ie = {
            name: "hide",
            enabled: !0,
            phase: "main",
            requiresIfExists: ["preventOverflow"],
            fn: function(t) {
                var e = t.state
                    , i = t.name
                    , n = e.rects.reference
                    , s = e.rects.popper
                    , o = e.modifiersData.preventOverflow
                    , r = xe(e, {
                    elementContext: "reference"
                })
                    , a = xe(e, {
                    altBoundary: !0
                })
                    , l = De(r, n)
                    , c = De(a, s, o)
                    , h = Se(l)
                    , d = Se(c);
                e.modifiersData[i] = {
                    referenceClippingOffsets: l,
                    popperEscapeOffsets: c,
                    isReferenceHidden: h,
                    hasPopperEscaped: d
                },
                    e.attributes.popper = Object.assign({}, e.attributes.popper, {
                        "data-popper-reference-hidden": h,
                        "data-popper-escaped": d
                    })
            }
        }
            , Ne = {
            name: "offset",
            enabled: !0,
            phase: "main",
            requires: ["popperOffsets"],
            fn: function(t) {
                var e = t.state
                    , i = t.options
                    , n = t.name
                    , s = i.offset
                    , o = void 0 === s ? [0, 0] : s
                    , r = kt.reduce((function(t, i) {
                        return t[i] = function(t, e, i) {
                            var n = Vt(t)
                                , s = [bt, gt].indexOf(n) >= 0 ? -1 : 1
                                , o = "function" == typeof i ? i(Object.assign({}, e, {
                                placement: t
                            })) : i
                                , r = o[0]
                                , a = o[1];
                            return r = r || 0,
                                a = (a || 0) * s,
                                [bt, _t].indexOf(n) >= 0 ? {
                                    x: a,
                                    y: r
                                } : {
                                    x: r,
                                    y: a
                                }
                        }(i, e.rects, o),
                            t
                    }
                ), {})
                    , a = r[e.placement]
                    , l = a.x
                    , c = a.y;
                null != e.modifiersData.popperOffsets && (e.modifiersData.popperOffsets.x += l,
                    e.modifiersData.popperOffsets.y += c),
                    e.modifiersData[n] = r
            }
        }
            , Pe = {
            name: "popperOffsets",
            enabled: !0,
            phase: "read",
            fn: function(t) {
                var e = t.state
                    , i = t.name;
                e.modifiersData[i] = Oe({
                    reference: e.rects.reference,
                    element: e.rects.popper,
                    strategy: "absolute",
                    placement: e.placement
                })
            },
            data: {}
        }
            , je = {
            name: "preventOverflow",
            enabled: !0,
            phase: "main",
            fn: function(t) {
                var e = t.state
                    , i = t.options
                    , n = t.name
                    , s = i.mainAxis
                    , o = void 0 === s || s
                    , r = i.altAxis
                    , a = void 0 !== r && r
                    , l = i.boundary
                    , c = i.rootBoundary
                    , h = i.altBoundary
                    , d = i.padding
                    , u = i.tether
                    , f = void 0 === u || u
                    , p = i.tetherOffset
                    , g = void 0 === p ? 0 : p
                    , m = xe(e, {
                    boundary: l,
                    rootBoundary: c,
                    padding: d,
                    altBoundary: h
                })
                    , _ = Vt(e.placement)
                    , b = ce(e.placement)
                    , v = !b
                    , y = se(_)
                    , w = "x" === y ? "y" : "x"
                    , A = e.modifiersData.popperOffsets
                    , E = e.rects.reference
                    , T = e.rects.popper
                    , C = "function" == typeof g ? g(Object.assign({}, e.rects, {
                    placement: e.placement
                })) : g
                    , O = "number" == typeof C ? {
                    mainAxis: C,
                    altAxis: C
                } : Object.assign({
                    mainAxis: 0,
                    altAxis: 0
                }, C)
                    , x = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null
                    , k = {
                    x: 0,
                    y: 0
                };
                if (A) {
                    if (o) {
                        var L, D = "y" === y ? gt : bt, S = "y" === y ? mt : _t, I = "y" === y ? "height" : "width", N = A[y], P = N + m[D], j = N - m[S], M = f ? -T[I] / 2 : 0, H = b === wt ? E[I] : T[I], $ = b === wt ? -T[I] : -E[I], W = e.elements.arrow, B = f && W ? Ut(W) : {
                            width: 0,
                            height: 0
                        }, F = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }, z = F[D], R = F[S], q = oe(0, E[I], B[I]), V = v ? E[I] / 2 - M - q - z - O.mainAxis : H - q - z - O.mainAxis, K = v ? -E[I] / 2 + M + q + R + O.mainAxis : $ + q + R + O.mainAxis, Q = e.elements.arrow && ne(e.elements.arrow), X = Q ? "y" === y ? Q.clientTop || 0 : Q.clientLeft || 0 : 0, Y = null != (L = null == x ? void 0 : x[y]) ? L : 0, U = N + K - Y, G = oe(f ? Qt(P, N + V - Y - X) : P, N, f ? Kt(j, U) : j);
                        A[y] = G,
                            k[y] = G - N
                    }
                    if (a) {
                        var J, Z = "x" === y ? gt : bt, tt = "x" === y ? mt : _t, et = A[w], it = "y" === w ? "height" : "width", nt = et + m[Z], st = et - m[tt], ot = -1 !== [gt, bt].indexOf(_), rt = null != (J = null == x ? void 0 : x[w]) ? J : 0, at = ot ? nt : et - E[it] - T[it] - rt + O.altAxis, lt = ot ? et + E[it] + T[it] - rt - O.altAxis : st, ct = f && ot ? function(t, e, i) {
                            var n = oe(t, e, i);
                            return n > i ? i : n
                        }(at, et, lt) : oe(f ? at : nt, et, f ? lt : st);
                        A[w] = ct,
                            k[w] = ct - et
                    }
                    e.modifiersData[n] = k
                }
            },
            requiresIfExists: ["offset"]
        };
        function Me(t, e, i) {
            void 0 === i && (i = !1);
            var n, s, o = zt(e), r = zt(e) && function(t) {
                var e = t.getBoundingClientRect()
                    , i = Xt(e.width) / t.offsetWidth || 1
                    , n = Xt(e.height) / t.offsetHeight || 1;
                return 1 !== i || 1 !== n
            }(e), a = te(e), l = Yt(t, r), c = {
                scrollLeft: 0,
                scrollTop: 0
            }, h = {
                x: 0,
                y: 0
            };
            return (o || !o && !i) && (("body" !== Wt(e) || we(a)) && (c = (n = e) !== Bt(n) && zt(n) ? {
                scrollLeft: (s = n).scrollLeft,
                scrollTop: s.scrollTop
            } : ve(n)),
                zt(e) ? ((h = Yt(e, !0)).x += e.clientLeft,
                    h.y += e.clientTop) : a && (h.x = ye(a))),
                {
                    x: l.left + c.scrollLeft - h.x,
                    y: l.top + c.scrollTop - h.y,
                    width: l.width,
                    height: l.height
                }
        }
        function He(t) {
            var e = new Map
                , i = new Set
                , n = [];
            function s(t) {
                i.add(t.name),
                    [].concat(t.requires || [], t.requiresIfExists || []).forEach((function(t) {
                            if (!i.has(t)) {
                                var n = e.get(t);
                                n && s(n)
                            }
                        }
                    )),
                    n.push(t)
            }
            return t.forEach((function(t) {
                    e.set(t.name, t)
                }
            )),
                t.forEach((function(t) {
                        i.has(t.name) || s(t)
                    }
                )),
                n
        }
        var $e = {
            placement: "bottom",
            modifiers: [],
            strategy: "absolute"
        };
        function We() {
            for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
                e[i] = arguments[i];
            return !e.some((function(t) {
                    return !(t && "function" == typeof t.getBoundingClientRect)
                }
            ))
        }
        function Be(t) {
            void 0 === t && (t = {});
            var e = t
                , i = e.defaultModifiers
                , n = void 0 === i ? [] : i
                , s = e.defaultOptions
                , o = void 0 === s ? $e : s;
            return function(t, e, i) {
                void 0 === i && (i = o);
                var s, r, a = {
                    placement: "bottom",
                    orderedModifiers: [],
                    options: Object.assign({}, $e, o),
                    modifiersData: {},
                    elements: {
                        reference: t,
                        popper: e
                    },
                    attributes: {},
                    styles: {}
                }, l = [], c = !1, h = {
                    state: a,
                    setOptions: function(i) {
                        var s = "function" == typeof i ? i(a.options) : i;
                        d(),
                            a.options = Object.assign({}, o, a.options, s),
                            a.scrollParents = {
                                reference: Ft(t) ? Ee(t) : t.contextElement ? Ee(t.contextElement) : [],
                                popper: Ee(e)
                            };
                        var r, c, u = function(t) {
                            var e = He(t);
                            return $t.reduce((function(t, i) {
                                    return t.concat(e.filter((function(t) {
                                            return t.phase === i
                                        }
                                    )))
                                }
                            ), [])
                        }((r = [].concat(n, a.options.modifiers),
                            c = r.reduce((function(t, e) {
                                    var i = t[e.name];
                                    return t[e.name] = i ? Object.assign({}, i, e, {
                                        options: Object.assign({}, i.options, e.options),
                                        data: Object.assign({}, i.data, e.data)
                                    }) : e,
                                        t
                                }
                            ), {}),
                            Object.keys(c).map((function(t) {
                                    return c[t]
                                }
                            ))));
                        return a.orderedModifiers = u.filter((function(t) {
                                return t.enabled
                            }
                        )),
                            a.orderedModifiers.forEach((function(t) {
                                    var e = t.name
                                        , i = t.options
                                        , n = void 0 === i ? {} : i
                                        , s = t.effect;
                                    if ("function" == typeof s) {
                                        var o = s({
                                            state: a,
                                            name: e,
                                            instance: h,
                                            options: n
                                        });
                                        l.push(o || function() {}
                                        )
                                    }
                                }
                            )),
                            h.update()
                    },
                    forceUpdate: function() {
                        if (!c) {
                            var t = a.elements
                                , e = t.reference
                                , i = t.popper;
                            if (We(e, i)) {
                                a.rects = {
                                    reference: Me(e, ne(i), "fixed" === a.options.strategy),
                                    popper: Ut(i)
                                },
                                    a.reset = !1,
                                    a.placement = a.options.placement,
                                    a.orderedModifiers.forEach((function(t) {
                                            return a.modifiersData[t.name] = Object.assign({}, t.data)
                                        }
                                    ));
                                for (var n = 0; n < a.orderedModifiers.length; n++)
                                    if (!0 !== a.reset) {
                                        var s = a.orderedModifiers[n]
                                            , o = s.fn
                                            , r = s.options
                                            , l = void 0 === r ? {} : r
                                            , d = s.name;
                                        "function" == typeof o && (a = o({
                                            state: a,
                                            options: l,
                                            name: d,
                                            instance: h
                                        }) || a)
                                    } else
                                        a.reset = !1,
                                            n = -1
                            }
                        }
                    },
                    update: (s = function() {
                            return new Promise((function(t) {
                                    h.forceUpdate(),
                                        t(a)
                                }
                            ))
                        }
                            ,
                            function() {
                                return r || (r = new Promise((function(t) {
                                        Promise.resolve().then((function() {
                                                r = void 0,
                                                    t(s())
                                            }
                                        ))
                                    }
                                ))),
                                    r
                            }
                    ),
                    destroy: function() {
                        d(),
                            c = !0
                    }
                };
                if (!We(t, e))
                    return h;
                function d() {
                    l.forEach((function(t) {
                            return t()
                        }
                    )),
                        l = []
                }
                return h.setOptions(i).then((function(t) {
                        !c && i.onFirstUpdate && i.onFirstUpdate(t)
                    }
                )),
                    h
            }
        }
        var Fe = Be()
            , ze = Be({
            defaultModifiers: [pe, Pe, ue, qt]
        })
            , Re = Be({
            defaultModifiers: [pe, Pe, ue, qt, Ne, Le, je, le, Ie]
        });
        const qe = Object.freeze(Object.defineProperty({
            __proto__: null,
            popperGenerator: Be,
            detectOverflow: xe,
            createPopperBase: Fe,
            createPopper: Re,
            createPopperLite: ze,
            top: gt,
            bottom: mt,
            right: _t,
            left: bt,
            auto: vt,
            basePlacements: yt,
            start: wt,
            end: At,
            clippingParents: Et,
            viewport: Tt,
            popper: Ct,
            reference: Ot,
            variationPlacements: xt,
            placements: kt,
            beforeRead: Lt,
            read: Dt,
            afterRead: St,
            beforeMain: It,
            main: Nt,
            afterMain: Pt,
            beforeWrite: jt,
            write: Mt,
            afterWrite: Ht,
            modifierPhases: $t,
            applyStyles: qt,
            arrow: le,
            computeStyles: ue,
            eventListeners: pe,
            flip: Le,
            hide: Ie,
            offset: Ne,
            popperOffsets: Pe,
            preventOverflow: je
        }, Symbol.toStringTag, {
            value: "Module"
        }))
            , Ve = "dropdown"
            , Ke = "ArrowUp"
            , Qe = "ArrowDown"
            , Xe = "click.bs.dropdown.data-api"
            , Ye = "keydown.bs.dropdown.data-api"
            , Ue = "show"
            , Ge = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)'
            , Je = `${Ge}.show`
            , Ze = ".dropdown-menu"
            , ti = p() ? "top-end" : "top-start"
            , ei = p() ? "top-start" : "top-end"
            , ii = p() ? "bottom-end" : "bottom-start"
            , ni = p() ? "bottom-start" : "bottom-end"
            , si = p() ? "left-start" : "right-start"
            , oi = p() ? "right-start" : "left-start"
            , ri = {
            autoClose: !0,
            boundary: "clippingParents",
            display: "dynamic",
            offset: [0, 2],
            popperConfig: null,
            reference: "toggle"
        }
            , ai = {
            autoClose: "(boolean|string)",
            boundary: "(string|element)",
            display: "string",
            offset: "(array|string|function)",
            popperConfig: "(null|object|function)",
            reference: "(string|element|object)"
        };
        class li extends z {
            constructor(t, e) {
                super(t, e),
                    this._popper = null,
                    this._parent = this._element.parentNode,
                    this._menu = Q.findOne(Ze, this._parent),
                    this._inNavbar = this._detectNavbar()
            }
            static get Default() {
                return ri
            }
            static get DefaultType() {
                return ai
            }
            static get NAME() {
                return Ve
            }
            toggle() {
                return this._isShown() ? this.hide() : this.show()
            }
            show() {
                if (l(this._element) || this._isShown())
                    return;
                const t = {
                    relatedTarget: this._element
                };
                if (!P.trigger(this._element, "show.bs.dropdown", t).defaultPrevented) {
                    if (this._createPopper(),
                    "ontouchstart"in document.documentElement && !this._parent.closest(".navbar-nav"))
                        for (const t of [].concat(...document.body.children))
                            P.on(t, "mouseover", h);
                    this._element.focus(),
                        this._element.setAttribute("aria-expanded", !0),
                        this._menu.classList.add(Ue),
                        this._element.classList.add(Ue),
                        P.trigger(this._element, "shown.bs.dropdown", t)
                }
            }
            hide() {
                if (l(this._element) || !this._isShown())
                    return;
                const t = {
                    relatedTarget: this._element
                };
                this._completeHide(t)
            }
            dispose() {
                this._popper && this._popper.destroy(),
                    super.dispose()
            }
            update() {
                this._inNavbar = this._detectNavbar(),
                this._popper && this._popper.update()
            }
            _completeHide(t) {
                if (!P.trigger(this._element, "hide.bs.dropdown", t).defaultPrevented) {
                    if ("ontouchstart"in document.documentElement)
                        for (const t of [].concat(...document.body.children))
                            P.off(t, "mouseover", h);
                    this._popper && this._popper.destroy(),
                        this._menu.classList.remove(Ue),
                        this._element.classList.remove(Ue),
                        this._element.setAttribute("aria-expanded", "false"),
                        B.removeDataAttribute(this._menu, "popper"),
                        P.trigger(this._element, "hidden.bs.dropdown", t)
                }
            }
            _getConfig(t) {
                if ("object" == typeof (t = super._getConfig(t)).reference && !o(t.reference) && "function" != typeof t.reference.getBoundingClientRect)
                    throw new TypeError(`${Ve.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
                return t
            }
            _createPopper() {
                if (void 0 === qe)
                    throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
                let t = this._element;
                "parent" === this._config.reference ? t = this._parent : o(this._config.reference) ? t = r(this._config.reference) : "object" == typeof this._config.reference && (t = this._config.reference);
                const e = this._getPopperConfig();
                this._popper = Re(t, this._menu, e)
            }
            _isShown() {
                return this._menu.classList.contains(Ue)
            }
            _getPlacement() {
                const t = this._parent;
                if (t.classList.contains("dropend"))
                    return si;
                if (t.classList.contains("dropstart"))
                    return oi;
                if (t.classList.contains("dropup-center"))
                    return "top";
                if (t.classList.contains("dropdown-center"))
                    return "bottom";
                const e = "end" === getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();
                return t.classList.contains("dropup") ? e ? ei : ti : e ? ni : ii
            }
            _detectNavbar() {
                return null !== this._element.closest(".navbar")
            }
            _getOffset() {
                const {offset: t} = this._config;
                return "string" == typeof t ? t.split(",").map((t=>Number.parseInt(t, 10))) : "function" == typeof t ? e=>t(e, this._element) : t
            }
            _getPopperConfig() {
                const t = {
                    placement: this._getPlacement(),
                    modifiers: [{
                        name: "preventOverflow",
                        options: {
                            boundary: this._config.boundary
                        }
                    }, {
                        name: "offset",
                        options: {
                            offset: this._getOffset()
                        }
                    }]
                };
                return (this._inNavbar || "static" === this._config.display) && (B.setDataAttribute(this._menu, "popper", "static"),
                    t.modifiers = [{
                        name: "applyStyles",
                        enabled: !1
                    }]),
                    {
                        ...t,
                        ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(t) : this._config.popperConfig
                    }
            }
            _selectMenuItem({key: t, target: e}) {
                const i = Q.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", this._menu).filter((t=>a(t)));
                i.length && b(i, e, t === Qe, !i.includes(e)).focus()
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = li.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === e[t])
                                throw new TypeError(`No method named "${t}"`);
                            e[t]()
                        }
                    }
                ))
            }
            static clearMenus(t) {
                if (2 === t.button || "keyup" === t.type && "Tab" !== t.key)
                    return;
                const e = Q.find(Je);
                for (const i of e) {
                    const e = li.getInstance(i);
                    if (!e || !1 === e._config.autoClose)
                        continue;
                    const n = t.composedPath()
                        , s = n.includes(e._menu);
                    if (n.includes(e._element) || "inside" === e._config.autoClose && !s || "outside" === e._config.autoClose && s)
                        continue;
                    if (e._menu.contains(t.target) && ("keyup" === t.type && "Tab" === t.key || /input|select|option|textarea|form/i.test(t.target.tagName)))
                        continue;
                    const o = {
                        relatedTarget: e._element
                    };
                    "click" === t.type && (o.clickEvent = t),
                        e._completeHide(o)
                }
            }
            static dataApiKeydownHandler(t) {
                const e = /input|textarea/i.test(t.target.tagName)
                    , i = "Escape" === t.key
                    , n = [Ke, Qe].includes(t.key);
                if (!n && !i)
                    return;
                if (e && !i)
                    return;
                t.preventDefault();
                const s = Q.findOne(Ge, t.delegateTarget.parentNode)
                    , o = li.getOrCreateInstance(s);
                if (n)
                    return t.stopPropagation(),
                        o.show(),
                        void o._selectMenuItem(t);
                o._isShown() && (t.stopPropagation(),
                    o.hide(),
                    s.focus())
            }
        }
        P.on(document, Ye, Ge, li.dataApiKeydownHandler),
            P.on(document, Ye, Ze, li.dataApiKeydownHandler),
            P.on(document, Xe, li.clearMenus),
            P.on(document, "keyup.bs.dropdown.data-api", li.clearMenus),
            P.on(document, Xe, Ge, (function(t) {
                    t.preventDefault(),
                        li.getOrCreateInstance(this).toggle()
                }
            )),
            g(li);
        const ci = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"
            , hi = ".sticky-top"
            , di = "padding-right"
            , ui = "margin-right";
        class fi {
            constructor() {
                this._element = document.body
            }
            getWidth() {
                const t = document.documentElement.clientWidth;
                return Math.abs(window.innerWidth - t)
            }
            hide() {
                const t = this.getWidth();
                this._disableOverFlow(),
                    this._setElementAttributes(this._element, di, (e=>e + t)),
                    this._setElementAttributes(ci, di, (e=>e + t)),
                    this._setElementAttributes(hi, ui, (e=>e - t))
            }
            reset() {
                this._resetElementAttributes(this._element, "overflow"),
                    this._resetElementAttributes(this._element, di),
                    this._resetElementAttributes(ci, di),
                    this._resetElementAttributes(hi, ui)
            }
            isOverflowing() {
                return this.getWidth() > 0
            }
            _disableOverFlow() {
                this._saveInitialAttribute(this._element, "overflow"),
                    this._element.style.overflow = "hidden"
            }
            _setElementAttributes(t, e, i) {
                const n = this.getWidth();
                this._applyManipulationCallback(t, (t=>{
                        if (t !== this._element && window.innerWidth > t.clientWidth + n)
                            return;
                        this._saveInitialAttribute(t, e);
                        const s = window.getComputedStyle(t).getPropertyValue(e);
                        t.style.setProperty(e, `${i(Number.parseFloat(s))}px`)
                    }
                ))
            }
            _saveInitialAttribute(t, e) {
                const i = t.style.getPropertyValue(e);
                i && B.setDataAttribute(t, e, i)
            }
            _resetElementAttributes(t, e) {
                this._applyManipulationCallback(t, (t=>{
                        const i = B.getDataAttribute(t, e);
                        null !== i ? (B.removeDataAttribute(t, e),
                            t.style.setProperty(e, i)) : t.style.removeProperty(e)
                    }
                ))
            }
            _applyManipulationCallback(t, e) {
                if (o(t))
                    e(t);
                else
                    for (const i of Q.find(t, this._element))
                        e(i)
            }
        }
        const pi = "show"
            , gi = "mousedown.bs.backdrop"
            , mi = {
            className: "modal-backdrop",
            clickCallback: null,
            isAnimated: !1,
            isVisible: !0,
            rootElement: "body"
        }
            , _i = {
            className: "string",
            clickCallback: "(function|null)",
            isAnimated: "boolean",
            isVisible: "boolean",
            rootElement: "(element|string)"
        };
        class bi extends F {
            constructor(t) {
                super(),
                    this._config = this._getConfig(t),
                    this._isAppended = !1,
                    this._element = null
            }
            static get Default() {
                return mi
            }
            static get DefaultType() {
                return _i
            }
            static get NAME() {
                return "backdrop"
            }
            show(t) {
                if (!this._config.isVisible)
                    return void m(t);
                this._append();
                const e = this._getElement();
                this._config.isAnimated && d(e),
                    e.classList.add(pi),
                    this._emulateAnimation((()=>{
                            m(t)
                        }
                    ))
            }
            hide(t) {
                this._config.isVisible ? (this._getElement().classList.remove(pi),
                    this._emulateAnimation((()=>{
                            this.dispose(),
                                m(t)
                        }
                    ))) : m(t)
            }
            dispose() {
                this._isAppended && (P.off(this._element, gi),
                    this._element.remove(),
                    this._isAppended = !1)
            }
            _getElement() {
                if (!this._element) {
                    const t = document.createElement("div");
                    t.className = this._config.className,
                    this._config.isAnimated && t.classList.add("fade"),
                        this._element = t
                }
                return this._element
            }
            _configAfterMerge(t) {
                return t.rootElement = r(t.rootElement),
                    t
            }
            _append() {
                if (this._isAppended)
                    return;
                const t = this._getElement();
                this._config.rootElement.append(t),
                    P.on(t, gi, (()=>{
                            m(this._config.clickCallback)
                        }
                    )),
                    this._isAppended = !0
            }
            _emulateAnimation(t) {
                _(t, this._getElement(), this._config.isAnimated)
            }
        }
        const vi = ".bs.focustrap"
            , yi = "backward"
            , wi = {
            autofocus: !0,
            trapElement: null
        }
            , Ai = {
            autofocus: "boolean",
            trapElement: "element"
        };
        class Ei extends F {
            constructor(t) {
                super(),
                    this._config = this._getConfig(t),
                    this._isActive = !1,
                    this._lastTabNavDirection = null
            }
            static get Default() {
                return wi
            }
            static get DefaultType() {
                return Ai
            }
            static get NAME() {
                return "focustrap"
            }
            activate() {
                this._isActive || (this._config.autofocus && this._config.trapElement.focus(),
                    P.off(document, vi),
                    P.on(document, "focusin.bs.focustrap", (t=>this._handleFocusin(t))),
                    P.on(document, "keydown.tab.bs.focustrap", (t=>this._handleKeydown(t))),
                    this._isActive = !0)
            }
            deactivate() {
                this._isActive && (this._isActive = !1,
                    P.off(document, vi))
            }
            _handleFocusin(t) {
                const {trapElement: e} = this._config;
                if (t.target === document || t.target === e || e.contains(t.target))
                    return;
                const i = Q.focusableChildren(e);
                0 === i.length ? e.focus() : this._lastTabNavDirection === yi ? i[i.length - 1].focus() : i[0].focus()
            }
            _handleKeydown(t) {
                "Tab" === t.key && (this._lastTabNavDirection = t.shiftKey ? yi : "forward")
            }
        }
        const Ti = "hidden.bs.modal"
            , Ci = "show.bs.modal"
            , Oi = "modal-open"
            , xi = "show"
            , ki = "modal-static"
            , Li = {
            backdrop: !0,
            focus: !0,
            keyboard: !0
        }
            , Di = {
            backdrop: "(boolean|string)",
            focus: "boolean",
            keyboard: "boolean"
        };
        class Si extends z {
            constructor(t, e) {
                super(t, e),
                    this._dialog = Q.findOne(".modal-dialog", this._element),
                    this._backdrop = this._initializeBackDrop(),
                    this._focustrap = this._initializeFocusTrap(),
                    this._isShown = !1,
                    this._isTransitioning = !1,
                    this._scrollBar = new fi,
                    this._addEventListeners()
            }
            static get Default() {
                return Li
            }
            static get DefaultType() {
                return Di
            }
            static get NAME() {
                return "modal"
            }
            toggle(t) {
                return this._isShown ? this.hide() : this.show(t)
            }
            show(t) {
                this._isShown || this._isTransitioning || P.trigger(this._element, Ci, {
                    relatedTarget: t
                }).defaultPrevented || (this._isShown = !0,
                    this._isTransitioning = !0,
                    this._scrollBar.hide(),
                    document.body.classList.add(Oi),
                    this._adjustDialog(),
                    this._backdrop.show((()=>this._showElement(t))))
            }
            hide() {
                this._isShown && !this._isTransitioning && (P.trigger(this._element, "hide.bs.modal").defaultPrevented || (this._isShown = !1,
                    this._isTransitioning = !0,
                    this._focustrap.deactivate(),
                    this._element.classList.remove(xi),
                    this._queueCallback((()=>this._hideModal()), this._element, this._isAnimated())))
            }
            dispose() {
                for (const t of [window, this._dialog])
                    P.off(t, ".bs.modal");
                this._backdrop.dispose(),
                    this._focustrap.deactivate(),
                    super.dispose()
            }
            handleUpdate() {
                this._adjustDialog()
            }
            _initializeBackDrop() {
                return new bi({
                    isVisible: Boolean(this._config.backdrop),
                    isAnimated: this._isAnimated()
                })
            }
            _initializeFocusTrap() {
                return new Ei({
                    trapElement: this._element
                })
            }
            _showElement(t) {
                document.body.contains(this._element) || document.body.append(this._element),
                    this._element.style.display = "block",
                    this._element.removeAttribute("aria-hidden"),
                    this._element.setAttribute("aria-modal", !0),
                    this._element.setAttribute("role", "dialog"),
                    this._element.scrollTop = 0;
                const e = Q.findOne(".modal-body", this._dialog);
                e && (e.scrollTop = 0),
                    d(this._element),
                    this._element.classList.add(xi),
                    this._queueCallback((()=>{
                            this._config.focus && this._focustrap.activate(),
                                this._isTransitioning = !1,
                                P.trigger(this._element, "shown.bs.modal", {
                                    relatedTarget: t
                                })
                        }
                    ), this._dialog, this._isAnimated())
            }
            _addEventListeners() {
                P.on(this._element, "keydown.dismiss.bs.modal", (t=>{
                        if ("Escape" === t.key)
                            return this._config.keyboard ? (t.preventDefault(),
                                void this.hide()) : void this._triggerBackdropTransition()
                    }
                )),
                    P.on(window, "resize.bs.modal", (()=>{
                            this._isShown && !this._isTransitioning && this._adjustDialog()
                        }
                    )),
                    P.on(this._element, "mousedown.dismiss.bs.modal", (t=>{
                            t.target === t.currentTarget && ("static" !== this._config.backdrop ? this._config.backdrop && this.hide() : this._triggerBackdropTransition())
                        }
                    ))
            }
            _hideModal() {
                this._element.style.display = "none",
                    this._element.setAttribute("aria-hidden", !0),
                    this._element.removeAttribute("aria-modal"),
                    this._element.removeAttribute("role"),
                    this._isTransitioning = !1,
                    this._backdrop.hide((()=>{
                            document.body.classList.remove(Oi),
                                this._resetAdjustments(),
                                this._scrollBar.reset(),
                                P.trigger(this._element, Ti)
                        }
                    ))
            }
            _isAnimated() {
                return this._element.classList.contains("fade")
            }
            _triggerBackdropTransition() {
                if (P.trigger(this._element, "hidePrevented.bs.modal").defaultPrevented)
                    return;
                const t = this._element.scrollHeight > document.documentElement.clientHeight
                    , e = this._element.style.overflowY;
                "hidden" === e || this._element.classList.contains(ki) || (t || (this._element.style.overflowY = "hidden"),
                    this._element.classList.add(ki),
                    this._queueCallback((()=>{
                            this._element.classList.remove(ki),
                                this._queueCallback((()=>{
                                        this._element.style.overflowY = e
                                    }
                                ), this._dialog)
                        }
                    ), this._dialog),
                    this._element.focus())
            }
            _adjustDialog() {
                const t = this._element.scrollHeight > document.documentElement.clientHeight
                    , e = this._scrollBar.getWidth()
                    , i = e > 0;
                if (i && !t) {
                    const t = p() ? "paddingLeft" : "paddingRight";
                    this._element.style[t] = `${e}px`
                }
                if (!i && t) {
                    const t = p() ? "paddingRight" : "paddingLeft";
                    this._element.style[t] = `${e}px`
                }
            }
            _resetAdjustments() {
                this._element.style.paddingLeft = "",
                    this._element.style.paddingRight = ""
            }
            static jQueryInterface(t, e) {
                return this.each((function() {
                        const i = Si.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === i[t])
                                throw new TypeError(`No method named "${t}"`);
                            i[t](e)
                        }
                    }
                ))
            }
        }
        P.on(document, "click.bs.modal.data-api", '[data-bs-toggle="modal"]', (function(t) {
                const e = n(this);
                ["A", "AREA"].includes(this.tagName) && t.preventDefault(),
                    P.one(e, Ci, (t=>{
                            t.defaultPrevented || P.one(e, Ti, (()=>{
                                    a(this) && this.focus()
                                }
                            ))
                        }
                    ));
                const i = Q.findOne(".modal.show");
                i && Si.getInstance(i).hide(),
                    Si.getOrCreateInstance(e).toggle(this)
            }
        )),
            R(Si),
            g(Si);
        const Ii = "show"
            , Ni = "showing"
            , Pi = "hiding"
            , ji = ".offcanvas.show"
            , Mi = "hidePrevented.bs.offcanvas"
            , Hi = "hidden.bs.offcanvas"
            , $i = {
            backdrop: !0,
            keyboard: !0,
            scroll: !1
        }
            , Wi = {
            backdrop: "(boolean|string)",
            keyboard: "boolean",
            scroll: "boolean"
        };
        class Bi extends z {
            constructor(t, e) {
                super(t, e),
                    this._isShown = !1,
                    this._backdrop = this._initializeBackDrop(),
                    this._focustrap = this._initializeFocusTrap(),
                    this._addEventListeners()
            }
            static get Default() {
                return $i
            }
            static get DefaultType() {
                return Wi
            }
            static get NAME() {
                return "offcanvas"
            }
            toggle(t) {
                return this._isShown ? this.hide() : this.show(t)
            }
            show(t) {
                this._isShown || P.trigger(this._element, "show.bs.offcanvas", {
                    relatedTarget: t
                }).defaultPrevented || (this._isShown = !0,
                    this._backdrop.show(),
                this._config.scroll || (new fi).hide(),
                    this._element.setAttribute("aria-modal", !0),
                    this._element.setAttribute("role", "dialog"),
                    this._element.classList.add(Ni),
                    this._queueCallback((()=>{
                            this._config.scroll && !this._config.backdrop || this._focustrap.activate(),
                                this._element.classList.add(Ii),
                                this._element.classList.remove(Ni),
                                P.trigger(this._element, "shown.bs.offcanvas", {
                                    relatedTarget: t
                                })
                        }
                    ), this._element, !0))
            }
            hide() {
                this._isShown && (P.trigger(this._element, "hide.bs.offcanvas").defaultPrevented || (this._focustrap.deactivate(),
                    this._element.blur(),
                    this._isShown = !1,
                    this._element.classList.add(Pi),
                    this._backdrop.hide(),
                    this._queueCallback((()=>{
                            this._element.classList.remove(Ii, Pi),
                                this._element.removeAttribute("aria-modal"),
                                this._element.removeAttribute("role"),
                            this._config.scroll || (new fi).reset(),
                                P.trigger(this._element, Hi)
                        }
                    ), this._element, !0)))
            }
            dispose() {
                this._backdrop.dispose(),
                    this._focustrap.deactivate(),
                    super.dispose()
            }
            _initializeBackDrop() {
                const t = Boolean(this._config.backdrop);
                return new bi({
                    className: "offcanvas-backdrop",
                    isVisible: t,
                    isAnimated: !0,
                    rootElement: this._element.parentNode,
                    clickCallback: t ? ()=>{
                            "static" !== this._config.backdrop ? this.hide() : P.trigger(this._element, Mi)
                        }
                        : null
                })
            }
            _initializeFocusTrap() {
                return new Ei({
                    trapElement: this._element
                })
            }
            _addEventListeners() {
                P.on(this._element, "keydown.dismiss.bs.offcanvas", (t=>{
                        "Escape" === t.key && (this._config.keyboard ? this.hide() : P.trigger(this._element, Mi))
                    }
                ))
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = Bi.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === e[t] || t.startsWith("_") || "constructor" === t)
                                throw new TypeError(`No method named "${t}"`);
                            e[t](this)
                        }
                    }
                ))
            }
        }
        P.on(document, "click.bs.offcanvas.data-api", '[data-bs-toggle="offcanvas"]', (function(t) {
                const e = n(this);
                if (["A", "AREA"].includes(this.tagName) && t.preventDefault(),
                    l(this))
                    return;
                P.one(e, Hi, (()=>{
                        a(this) && this.focus()
                    }
                ));
                const i = Q.findOne(ji);
                i && i !== e && Bi.getInstance(i).hide(),
                    Bi.getOrCreateInstance(e).toggle(this)
            }
        )),
            P.on(window, "load.bs.offcanvas.data-api", (()=>{
                    for (const t of Q.find(ji))
                        Bi.getOrCreateInstance(t).show()
                }
            )),
            P.on(window, "resize.bs.offcanvas", (()=>{
                    for (const t of Q.find("[aria-modal][class*=show][class*=offcanvas-]"))
                        "fixed" !== getComputedStyle(t).position && Bi.getOrCreateInstance(t).hide()
                }
            )),
            R(Bi),
            g(Bi);
        const Fi = new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"])
            , zi = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i
            , Ri = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i
            , qi = (t,e)=>{
            const i = t.nodeName.toLowerCase();
            return e.includes(i) ? !Fi.has(i) || Boolean(zi.test(t.nodeValue) || Ri.test(t.nodeValue)) : e.filter((t=>t instanceof RegExp)).some((t=>t.test(i)))
        }
            , Vi = {
            "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
            a: ["target", "href", "title", "rel"],
            area: [],
            b: [],
            br: [],
            col: [],
            code: [],
            div: [],
            em: [],
            hr: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            i: [],
            img: ["src", "srcset", "alt", "title", "width", "height"],
            li: [],
            ol: [],
            p: [],
            pre: [],
            s: [],
            small: [],
            span: [],
            sub: [],
            sup: [],
            strong: [],
            u: [],
            ul: []
        }
            , Ki = {
            allowList: Vi,
            content: {},
            extraClass: "",
            html: !1,
            sanitize: !0,
            sanitizeFn: null,
            template: "<div></div>"
        }
            , Qi = {
            allowList: "object",
            content: "object",
            extraClass: "(string|function)",
            html: "boolean",
            sanitize: "boolean",
            sanitizeFn: "(null|function)",
            template: "string"
        }
            , Xi = {
            entry: "(string|element|function|null)",
            selector: "(string|element)"
        };
        class Yi extends F {
            constructor(t) {
                super(),
                    this._config = this._getConfig(t)
            }
            static get Default() {
                return Ki
            }
            static get DefaultType() {
                return Qi
            }
            static get NAME() {
                return "TemplateFactory"
            }
            getContent() {
                return Object.values(this._config.content).map((t=>this._resolvePossibleFunction(t))).filter(Boolean)
            }
            hasContent() {
                return this.getContent().length > 0
            }
            changeContent(t) {
                return this._checkContent(t),
                    this._config.content = {
                        ...this._config.content,
                        ...t
                    },
                    this
            }
            toHtml() {
                const t = document.createElement("div");
                t.innerHTML = this._maybeSanitize(this._config.template);
                for (const [e,i] of Object.entries(this._config.content))
                    this._setContent(t, i, e);
                const e = t.children[0]
                    , i = this._resolvePossibleFunction(this._config.extraClass);
                return i && e.classList.add(...i.split(" ")),
                    e
            }
            _typeCheckConfig(t) {
                super._typeCheckConfig(t),
                    this._checkContent(t.content)
            }
            _checkContent(t) {
                for (const [e,i] of Object.entries(t))
                    super._typeCheckConfig({
                        selector: e,
                        entry: i
                    }, Xi)
            }
            _setContent(t, e, i) {
                const n = Q.findOne(i, t);
                n && ((e = this._resolvePossibleFunction(e)) ? o(e) ? this._putElementInTemplate(r(e), n) : this._config.html ? n.innerHTML = this._maybeSanitize(e) : n.textContent = e : n.remove())
            }
            _maybeSanitize(t) {
                return this._config.sanitize ? function(t, e, i) {
                    if (!t.length)
                        return t;
                    if (i && "function" == typeof i)
                        return i(t);
                    const n = (new window.DOMParser).parseFromString(t, "text/html")
                        , s = [].concat(...n.body.querySelectorAll("*"));
                    for (const t of s) {
                        const i = t.nodeName.toLowerCase();
                        if (!Object.keys(e).includes(i)) {
                            t.remove();
                            continue
                        }
                        const n = [].concat(...t.attributes)
                            , s = [].concat(e["*"] || [], e[i] || []);
                        for (const e of n)
                            qi(e, s) || t.removeAttribute(e.nodeName)
                    }
                    return n.body.innerHTML
                }(t, this._config.allowList, this._config.sanitizeFn) : t
            }
            _resolvePossibleFunction(t) {
                return "function" == typeof t ? t(this) : t
            }
            _putElementInTemplate(t, e) {
                if (this._config.html)
                    return e.innerHTML = "",
                        void e.append(t);
                e.textContent = t.textContent
            }
        }
        const Ui = new Set(["sanitize", "allowList", "sanitizeFn"])
            , Gi = "fade"
            , Ji = "show"
            , Zi = ".modal"
            , tn = "hide.bs.modal"
            , en = "hover"
            , nn = "focus"
            , sn = {
            AUTO: "auto",
            TOP: "top",
            RIGHT: p() ? "left" : "right",
            BOTTOM: "bottom",
            LEFT: p() ? "right" : "left"
        }
            , on = {
            allowList: Vi,
            animation: !0,
            boundary: "clippingParents",
            container: !1,
            customClass: "",
            delay: 0,
            fallbackPlacements: ["top", "right", "bottom", "left"],
            html: !1,
            offset: [0, 0],
            placement: "top",
            popperConfig: null,
            sanitize: !0,
            sanitizeFn: null,
            selector: !1,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            title: "",
            trigger: "hover focus"
        }
            , rn = {
            allowList: "object",
            animation: "boolean",
            boundary: "(string|element)",
            container: "(string|element|boolean)",
            customClass: "(string|function)",
            delay: "(number|object)",
            fallbackPlacements: "array",
            html: "boolean",
            offset: "(array|string|function)",
            placement: "(string|function)",
            popperConfig: "(null|object|function)",
            sanitize: "boolean",
            sanitizeFn: "(null|function)",
            selector: "(string|boolean)",
            template: "string",
            title: "(string|element|function)",
            trigger: "string"
        };
        class an extends z {
            constructor(t, e) {
                if (void 0 === qe)
                    throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
                super(t, e),
                    this._isEnabled = !0,
                    this._timeout = 0,
                    this._isHovered = !1,
                    this._activeTrigger = {},
                    this._popper = null,
                    this._templateFactory = null,
                    this._newContent = null,
                    this.tip = null,
                    this._setListeners()
            }
            static get Default() {
                return on
            }
            static get DefaultType() {
                return rn
            }
            static get NAME() {
                return "tooltip"
            }
            enable() {
                this._isEnabled = !0
            }
            disable() {
                this._isEnabled = !1
            }
            toggleEnabled() {
                this._isEnabled = !this._isEnabled
            }
            toggle(t) {
                if (this._isEnabled) {
                    if (t) {
                        const e = this._initializeOnDelegatedTarget(t);
                        return e._activeTrigger.click = !e._activeTrigger.click,
                            void (e._isWithActiveTrigger() ? e._enter() : e._leave())
                    }
                    this._isShown() ? this._leave() : this._enter()
                }
            }
            dispose() {
                clearTimeout(this._timeout),
                    P.off(this._element.closest(Zi), tn, this._hideModalHandler),
                this.tip && this.tip.remove(),
                    this._disposePopper(),
                    super.dispose()
            }
            show() {
                if ("none" === this._element.style.display)
                    throw new Error("Please use show on visible elements");
                if (!this._isWithContent() || !this._isEnabled)
                    return;
                const t = P.trigger(this._element, this.constructor.eventName("show"))
                    , e = (c(this._element) || this._element.ownerDocument.documentElement).contains(this._element);
                if (t.defaultPrevented || !e)
                    return;
                this.tip && (this.tip.remove(),
                    this.tip = null);
                const i = this._getTipElement();
                this._element.setAttribute("aria-describedby", i.getAttribute("id"));
                const {container: n} = this._config;
                if (this._element.ownerDocument.documentElement.contains(this.tip) || (n.append(i),
                    P.trigger(this._element, this.constructor.eventName("inserted"))),
                    this._popper ? this._popper.update() : this._popper = this._createPopper(i),
                    i.classList.add(Ji),
                "ontouchstart"in document.documentElement)
                    for (const t of [].concat(...document.body.children))
                        P.on(t, "mouseover", h);
                this._queueCallback((()=>{
                        const t = this._isHovered;
                        this._isHovered = !1,
                            P.trigger(this._element, this.constructor.eventName("shown")),
                        t && this._leave()
                    }
                ), this.tip, this._isAnimated())
            }
            hide() {
                if (!this._isShown())
                    return;
                if (P.trigger(this._element, this.constructor.eventName("hide")).defaultPrevented)
                    return;
                const t = this._getTipElement();
                if (t.classList.remove(Ji),
                "ontouchstart"in document.documentElement)
                    for (const t of [].concat(...document.body.children))
                        P.off(t, "mouseover", h);
                this._activeTrigger.click = !1,
                    this._activeTrigger.focus = !1,
                    this._activeTrigger.hover = !1,
                    this._isHovered = !1,
                    this._queueCallback((()=>{
                            this._isWithActiveTrigger() || (this._isHovered || t.remove(),
                                this._element.removeAttribute("aria-describedby"),
                                P.trigger(this._element, this.constructor.eventName("hidden")),
                                this._disposePopper())
                        }
                    ), this.tip, this._isAnimated())
            }
            update() {
                this._popper && this._popper.update()
            }
            _isWithContent() {
                return Boolean(this._getTitle())
            }
            _getTipElement() {
                return this.tip || (this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())),
                    this.tip
            }
            _createTipElement(t) {
                const e = this._getTemplateFactory(t).toHtml();
                if (!e)
                    return null;
                e.classList.remove(Gi, Ji),
                    e.classList.add(`bs-${this.constructor.NAME}-auto`);
                const i = (t=>{
                        do {
                            t += Math.floor(1e6 * Math.random())
                        } while (document.getElementById(t));
                        return t
                    }
                )(this.constructor.NAME).toString();
                return e.setAttribute("id", i),
                this._isAnimated() && e.classList.add(Gi),
                    e
            }
            setContent(t) {
                this._newContent = t,
                this._isShown() && (this._disposePopper(),
                    this.show())
            }
            _getTemplateFactory(t) {
                return this._templateFactory ? this._templateFactory.changeContent(t) : this._templateFactory = new Yi({
                    ...this._config,
                    content: t,
                    extraClass: this._resolvePossibleFunction(this._config.customClass)
                }),
                    this._templateFactory
            }
            _getContentForTemplate() {
                return {
                    ".tooltip-inner": this._getTitle()
                }
            }
            _getTitle() {
                return this._resolvePossibleFunction(this._config.title) || this._config.originalTitle
            }
            _initializeOnDelegatedTarget(t) {
                return this.constructor.getOrCreateInstance(t.delegateTarget, this._getDelegateConfig())
            }
            _isAnimated() {
                return this._config.animation || this.tip && this.tip.classList.contains(Gi)
            }
            _isShown() {
                return this.tip && this.tip.classList.contains(Ji)
            }
            _createPopper(t) {
                const e = "function" == typeof this._config.placement ? this._config.placement.call(this, t, this._element) : this._config.placement
                    , i = sn[e.toUpperCase()];
                return Re(this._element, t, this._getPopperConfig(i))
            }
            _getOffset() {
                const {offset: t} = this._config;
                return "string" == typeof t ? t.split(",").map((t=>Number.parseInt(t, 10))) : "function" == typeof t ? e=>t(e, this._element) : t
            }
            _resolvePossibleFunction(t) {
                return "function" == typeof t ? t.call(this._element) : t
            }
            _getPopperConfig(t) {
                const e = {
                    placement: t,
                    modifiers: [{
                        name: "flip",
                        options: {
                            fallbackPlacements: this._config.fallbackPlacements
                        }
                    }, {
                        name: "offset",
                        options: {
                            offset: this._getOffset()
                        }
                    }, {
                        name: "preventOverflow",
                        options: {
                            boundary: this._config.boundary
                        }
                    }, {
                        name: "arrow",
                        options: {
                            element: `.${this.constructor.NAME}-arrow`
                        }
                    }, {
                        name: "preSetPlacement",
                        enabled: !0,
                        phase: "beforeMain",
                        fn: t=>{
                            this._getTipElement().setAttribute("data-popper-placement", t.state.placement)
                        }
                    }]
                };
                return {
                    ...e,
                    ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(e) : this._config.popperConfig
                }
            }
            _setListeners() {
                const t = this._config.trigger.split(" ");
                for (const e of t)
                    if ("click" === e)
                        P.on(this._element, this.constructor.eventName("click"), this._config.selector, (t=>this.toggle(t)));
                    else if ("manual" !== e) {
                        const t = e === en ? this.constructor.eventName("mouseenter") : this.constructor.eventName("focusin")
                            , i = e === en ? this.constructor.eventName("mouseleave") : this.constructor.eventName("focusout");
                        P.on(this._element, t, this._config.selector, (t=>{
                                const e = this._initializeOnDelegatedTarget(t);
                                e._activeTrigger["focusin" === t.type ? nn : en] = !0,
                                    e._enter()
                            }
                        )),
                            P.on(this._element, i, this._config.selector, (t=>{
                                    const e = this._initializeOnDelegatedTarget(t);
                                    e._activeTrigger["focusout" === t.type ? nn : en] = e._element.contains(t.relatedTarget),
                                        e._leave()
                                }
                            ))
                    }
                this._hideModalHandler = ()=>{
                    this._element && this.hide()
                }
                    ,
                    P.on(this._element.closest(Zi), tn, this._hideModalHandler),
                    this._config.selector ? this._config = {
                        ...this._config,
                        trigger: "manual",
                        selector: ""
                    } : this._fixTitle()
            }
            _fixTitle() {
                const t = this._config.originalTitle;
                t && (this._element.getAttribute("aria-label") || this._element.textContent.trim() || this._element.setAttribute("aria-label", t),
                    this._element.removeAttribute("title"))
            }
            _enter() {
                this._isShown() || this._isHovered ? this._isHovered = !0 : (this._isHovered = !0,
                    this._setTimeout((()=>{
                            this._isHovered && this.show()
                        }
                    ), this._config.delay.show))
            }
            _leave() {
                this._isWithActiveTrigger() || (this._isHovered = !1,
                    this._setTimeout((()=>{
                            this._isHovered || this.hide()
                        }
                    ), this._config.delay.hide))
            }
            _setTimeout(t, e) {
                clearTimeout(this._timeout),
                    this._timeout = setTimeout(t, e)
            }
            _isWithActiveTrigger() {
                return Object.values(this._activeTrigger).includes(!0)
            }
            _getConfig(t) {
                const e = B.getDataAttributes(this._element);
                for (const t of Object.keys(e))
                    Ui.has(t) && delete e[t];
                return t = {
                    ...e,
                    ..."object" == typeof t && t ? t : {}
                },
                    t = this._mergeConfigObj(t),
                    t = this._configAfterMerge(t),
                    this._typeCheckConfig(t),
                    t
            }
            _configAfterMerge(t) {
                return t.container = !1 === t.container ? document.body : r(t.container),
                "number" == typeof t.delay && (t.delay = {
                    show: t.delay,
                    hide: t.delay
                }),
                    t.originalTitle = this._element.getAttribute("title") || "",
                "number" == typeof t.title && (t.title = t.title.toString()),
                "number" == typeof t.content && (t.content = t.content.toString()),
                    t
            }
            _getDelegateConfig() {
                const t = {};
                for (const e in this._config)
                    this.constructor.Default[e] !== this._config[e] && (t[e] = this._config[e]);
                return t
            }
            _disposePopper() {
                this._popper && (this._popper.destroy(),
                    this._popper = null)
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = an.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === e[t])
                                throw new TypeError(`No method named "${t}"`);
                            e[t]()
                        }
                    }
                ))
            }
        }
        g(an);
        const ln = {
            ...an.Default,
            content: "",
            offset: [0, 8],
            placement: "right",
            template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
            trigger: "click"
        }
            , cn = {
            ...an.DefaultType,
            content: "(null|string|element|function)"
        };
        class hn extends an {
            static get Default() {
                return ln
            }
            static get DefaultType() {
                return cn
            }
            static get NAME() {
                return "popover"
            }
            _isWithContent() {
                return this._getTitle() || this._getContent()
            }
            _getContentForTemplate() {
                return {
                    ".popover-header": this._getTitle(),
                    ".popover-body": this._getContent()
                }
            }
            _getContent() {
                return this._resolvePossibleFunction(this._config.content)
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = hn.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === e[t])
                                throw new TypeError(`No method named "${t}"`);
                            e[t]()
                        }
                    }
                ))
            }
        }
        g(hn);
        const dn = "click.bs.scrollspy"
            , un = "active"
            , fn = "[href]"
            , pn = {
            offset: null,
            rootMargin: "0px 0px -25%",
            smoothScroll: !1,
            target: null
        }
            , gn = {
            offset: "(number|null)",
            rootMargin: "string",
            smoothScroll: "boolean",
            target: "element"
        };
        class mn extends z {
            constructor(t, e) {
                super(t, e),
                    this._targetLinks = new Map,
                    this._observableSections = new Map,
                    this._rootElement = "visible" === getComputedStyle(this._element).overflowY ? null : this._element,
                    this._activeTarget = null,
                    this._observer = null,
                    this._previousScrollData = {
                        visibleEntryTop: 0,
                        parentScrollTop: 0
                    },
                    this.refresh()
            }
            static get Default() {
                return pn
            }
            static get DefaultType() {
                return gn
            }
            static get NAME() {
                return "scrollspy"
            }
            refresh() {
                this._initializeTargetsAndObservables(),
                    this._maybeEnableSmoothScroll(),
                    this._observer ? this._observer.disconnect() : this._observer = this._getNewObserver();
                for (const t of this._observableSections.values())
                    this._observer.observe(t)
            }
            dispose() {
                this._observer.disconnect(),
                    super.dispose()
            }
            _configAfterMerge(t) {
                return t.target = r(t.target) || document.body,
                    t
            }
            _maybeEnableSmoothScroll() {
                this._config.smoothScroll && (P.off(this._config.target, dn),
                    P.on(this._config.target, dn, fn, (t=>{
                            const e = this._observableSections.get(t.target.hash);
                            if (e) {
                                t.preventDefault();
                                const i = this._rootElement || window
                                    , n = e.offsetTop - this._element.offsetTop;
                                if (i.scrollTo)
                                    return void i.scrollTo({
                                        top: n,
                                        behavior: "smooth"
                                    });
                                i.scrollTop = n
                            }
                        }
                    )))
            }
            _getNewObserver() {
                const t = {
                    root: this._rootElement,
                    threshold: [.1, .5, 1],
                    rootMargin: this._getRootMargin()
                };
                return new IntersectionObserver((t=>this._observerCallback(t)),t)
            }
            _observerCallback(t) {
                const e = t=>this._targetLinks.get(`#${t.target.id}`)
                    , i = t=>{
                    this._previousScrollData.visibleEntryTop = t.target.offsetTop,
                        this._process(e(t))
                }
                    , n = (this._rootElement || document.documentElement).scrollTop
                    , s = n >= this._previousScrollData.parentScrollTop;
                this._previousScrollData.parentScrollTop = n;
                for (const o of t) {
                    if (!o.isIntersecting) {
                        this._activeTarget = null,
                            this._clearActiveClass(e(o));
                        continue
                    }
                    const t = o.target.offsetTop >= this._previousScrollData.visibleEntryTop;
                    if (s && t) {
                        if (i(o),
                            !n)
                            return
                    } else
                        s || t || i(o)
                }
            }
            _getRootMargin() {
                return this._config.offset ? `${this._config.offset}px 0px -30%` : this._config.rootMargin
            }
            _initializeTargetsAndObservables() {
                this._targetLinks = new Map,
                    this._observableSections = new Map;
                const t = Q.find(fn, this._config.target);
                for (const e of t) {
                    if (!e.hash || l(e))
                        continue;
                    const t = Q.findOne(e.hash, this._element);
                    a(t) && (this._targetLinks.set(e.hash, e),
                        this._observableSections.set(e.hash, t))
                }
            }
            _process(t) {
                this._activeTarget !== t && (this._clearActiveClass(this._config.target),
                    this._activeTarget = t,
                    t.classList.add(un),
                    this._activateParents(t),
                    P.trigger(this._element, "activate.bs.scrollspy", {
                        relatedTarget: t
                    }))
            }
            _activateParents(t) {
                if (t.classList.contains("dropdown-item"))
                    Q.findOne(".dropdown-toggle", t.closest(".dropdown")).classList.add(un);
                else
                    for (const e of Q.parents(t, ".nav, .list-group"))
                        for (const t of Q.prev(e, ".nav-link, .nav-item > .nav-link, .list-group-item"))
                            t.classList.add(un)
            }
            _clearActiveClass(t) {
                t.classList.remove(un);
                const e = Q.find("[href].active", t);
                for (const t of e)
                    t.classList.remove(un)
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = mn.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === e[t] || t.startsWith("_") || "constructor" === t)
                                throw new TypeError(`No method named "${t}"`);
                            e[t]()
                        }
                    }
                ))
            }
        }
        P.on(window, "load.bs.scrollspy.data-api", (()=>{
                for (const t of Q.find('[data-bs-spy="scroll"]'))
                    mn.getOrCreateInstance(t)
            }
        )),
            g(mn);
        const _n = "ArrowLeft"
            , bn = "ArrowRight"
            , vn = "ArrowUp"
            , yn = "ArrowDown"
            , wn = "active"
            , An = "fade"
            , En = "show"
            , Tn = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'
            , Cn = `.nav-link:not(.dropdown-toggle), .list-group-item:not(.dropdown-toggle), [role="tab"]:not(.dropdown-toggle), ${Tn}`;
        class On extends z {
            constructor(t) {
                super(t),
                    this._parent = this._element.closest('.list-group, .nav, [role="tablist"]'),
                this._parent && (this._setInitialAttributes(this._parent, this._getChildren()),
                    P.on(this._element, "keydown.bs.tab", (t=>this._keydown(t))))
            }
            static get NAME() {
                return "tab"
            }
            show() {
                const t = this._element;
                if (this._elemIsActive(t))
                    return;
                const e = this._getActiveElem()
                    , i = e ? P.trigger(e, "hide.bs.tab", {
                    relatedTarget: t
                }) : null;
                P.trigger(t, "show.bs.tab", {
                    relatedTarget: e
                }).defaultPrevented || i && i.defaultPrevented || (this._deactivate(e, t),
                    this._activate(t, e))
            }
            _activate(t, e) {
                t && (t.classList.add(wn),
                    this._activate(n(t)),
                    this._queueCallback((()=>{
                            "tab" === t.getAttribute("role") ? (t.focus(),
                                t.removeAttribute("tabindex"),
                                t.setAttribute("aria-selected", !0),
                                this._toggleDropDown(t, !0),
                                P.trigger(t, "shown.bs.tab", {
                                    relatedTarget: e
                                })) : t.classList.add(En)
                        }
                    ), t, t.classList.contains(An)))
            }
            _deactivate(t, e) {
                t && (t.classList.remove(wn),
                    t.blur(),
                    this._deactivate(n(t)),
                    this._queueCallback((()=>{
                            "tab" === t.getAttribute("role") ? (t.setAttribute("aria-selected", !1),
                                t.setAttribute("tabindex", "-1"),
                                this._toggleDropDown(t, !1),
                                P.trigger(t, "hidden.bs.tab", {
                                    relatedTarget: e
                                })) : t.classList.remove(En)
                        }
                    ), t, t.classList.contains(An)))
            }
            _keydown(t) {
                if (![_n, bn, vn, yn].includes(t.key))
                    return;
                t.stopPropagation(),
                    t.preventDefault();
                const e = [bn, yn].includes(t.key)
                    , i = b(this._getChildren().filter((t=>!l(t))), t.target, e, !0);
                i && On.getOrCreateInstance(i).show()
            }
            _getChildren() {
                return Q.find(Cn, this._parent)
            }
            _getActiveElem() {
                return this._getChildren().find((t=>this._elemIsActive(t))) || null
            }
            _setInitialAttributes(t, e) {
                this._setAttributeIfNotExists(t, "role", "tablist");
                for (const t of e)
                    this._setInitialAttributesOnChild(t)
            }
            _setInitialAttributesOnChild(t) {
                t = this._getInnerElement(t);
                const e = this._elemIsActive(t)
                    , i = this._getOuterElement(t);
                t.setAttribute("aria-selected", e),
                i !== t && this._setAttributeIfNotExists(i, "role", "presentation"),
                e || t.setAttribute("tabindex", "-1"),
                    this._setAttributeIfNotExists(t, "role", "tab"),
                    this._setInitialAttributesOnTargetPanel(t)
            }
            _setInitialAttributesOnTargetPanel(t) {
                const e = n(t);
                e && (this._setAttributeIfNotExists(e, "role", "tabpanel"),
                t.id && this._setAttributeIfNotExists(e, "aria-labelledby", `#${t.id}`))
            }
            _toggleDropDown(t, e) {
                const i = this._getOuterElement(t);
                if (!i.classList.contains("dropdown"))
                    return;
                const n = (t,n)=>{
                        const s = Q.findOne(t, i);
                        s && s.classList.toggle(n, e)
                    }
                ;
                n(".dropdown-toggle", wn),
                    n(".dropdown-menu", En),
                    n(".dropdown-item", wn),
                    i.setAttribute("aria-expanded", e)
            }
            _setAttributeIfNotExists(t, e, i) {
                t.hasAttribute(e) || t.setAttribute(e, i)
            }
            _elemIsActive(t) {
                return t.classList.contains(wn)
            }
            _getInnerElement(t) {
                return t.matches(Cn) ? t : Q.findOne(Cn, t)
            }
            _getOuterElement(t) {
                return t.closest(".nav-item, .list-group-item") || t
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = On.getOrCreateInstance(this);
                        if ("string" == typeof t) {
                            if (void 0 === e[t] || t.startsWith("_") || "constructor" === t)
                                throw new TypeError(`No method named "${t}"`);
                            e[t]()
                        }
                    }
                ))
            }
        }
        P.on(document, "click.bs.tab", Tn, (function(t) {
                ["A", "AREA"].includes(this.tagName) && t.preventDefault(),
                l(this) || On.getOrCreateInstance(this).show()
            }
        )),
            P.on(window, "load.bs.tab", (()=>{
                    for (const t of Q.find('.active[data-bs-toggle="tab"], .active[data-bs-toggle="pill"], .active[data-bs-toggle="list"]'))
                        On.getOrCreateInstance(t)
                }
            )),
            g(On);
        const xn = "hide"
            , kn = "show"
            , Ln = "showing"
            , Dn = {
            animation: "boolean",
            autohide: "boolean",
            delay: "number"
        }
            , Sn = {
            animation: !0,
            autohide: !0,
            delay: 5e3
        };
        class In extends z {
            constructor(t, e) {
                super(t, e),
                    this._timeout = null,
                    this._hasMouseInteraction = !1,
                    this._hasKeyboardInteraction = !1,
                    this._setListeners()
            }
            static get Default() {
                return Sn
            }
            static get DefaultType() {
                return Dn
            }
            static get NAME() {
                return "toast"
            }
            show() {
                P.trigger(this._element, "show.bs.toast").defaultPrevented || (this._clearTimeout(),
                this._config.animation && this._element.classList.add("fade"),
                    this._element.classList.remove(xn),
                    d(this._element),
                    this._element.classList.add(kn, Ln),
                    this._queueCallback((()=>{
                            this._element.classList.remove(Ln),
                                P.trigger(this._element, "shown.bs.toast"),
                                this._maybeScheduleHide()
                        }
                    ), this._element, this._config.animation))
            }
            hide() {
                this.isShown() && (P.trigger(this._element, "hide.bs.toast").defaultPrevented || (this._element.classList.add(Ln),
                    this._queueCallback((()=>{
                            this._element.classList.add(xn),
                                this._element.classList.remove(Ln, kn),
                                P.trigger(this._element, "hidden.bs.toast")
                        }
                    ), this._element, this._config.animation)))
            }
            dispose() {
                this._clearTimeout(),
                this.isShown() && this._element.classList.remove(kn),
                    super.dispose()
            }
            isShown() {
                return this._element.classList.contains(kn)
            }
            _maybeScheduleHide() {
                this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout((()=>{
                        this.hide()
                    }
                ), this._config.delay)))
            }
            _onInteraction(t, e) {
                switch (t.type) {
                    case "mouseover":
                    case "mouseout":
                        this._hasMouseInteraction = e;
                        break;
                    case "focusin":
                    case "focusout":
                        this._hasKeyboardInteraction = e
                }
                if (e)
                    return void this._clearTimeout();
                const i = t.relatedTarget;
                this._element === i || this._element.contains(i) || this._maybeScheduleHide()
            }
            _setListeners() {
                P.on(this._element, "mouseover.bs.toast", (t=>this._onInteraction(t, !0))),
                    P.on(this._element, "mouseout.bs.toast", (t=>this._onInteraction(t, !1))),
                    P.on(this._element, "focusin.bs.toast", (t=>this._onInteraction(t, !0))),
                    P.on(this._element, "focusout.bs.toast", (t=>this._onInteraction(t, !1)))
            }
            _clearTimeout() {
                clearTimeout(this._timeout),
                    this._timeout = null
            }
            static jQueryInterface(t) {
                return this.each((function() {
                        const e = In.getOrCreateInstance(this, t);
                        if ("string" == typeof t) {
                            if (void 0 === e[t])
                                throw new TypeError(`No method named "${t}"`);
                            e[t](this)
                        }
                    }
                ))
            }
        }
        return R(In),
            g(In),
            {
                Alert: q,
                Button: K,
                Carousel: at,
                Collapse: pt,
                Dropdown: li,
                Modal: Si,
                Offcanvas: Bi,
                Popover: hn,
                ScrollSpy: mn,
                Tab: On,
                Toast: In,
                Tooltip: an
            }
    }
));
//# sourceMappingURL=bootstrap.bundle.min.js.map



/*!jQuery v1.11.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license*/
!function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
            if (!a.document)
                throw new Error("jQuery requires a window with a document");
            return b(a)
        }
        : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    var c = []
        , d = c.slice
        , e = c.concat
        , f = c.push
        , g = c.indexOf
        , h = {}
        , i = h.toString
        , j = h.hasOwnProperty
        , k = {}
        , l = "1.11.1"
        , m = function(a, b) {
        return new m.fn.init(a,b)
    }
        , n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        , o = /^-ms-/
        , p = /-([\da-z])/gi
        , q = function(a, b) {
        return b.toUpperCase()
    };
    m.fn = m.prototype = {
        jquery: l,
        constructor: m,
        selector: "",
        length: 0,
        toArray: function() {
            return d.call(this)
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
        },
        pushStack: function(a) {
            var b = m.merge(this.constructor(), a);
            return b.prevObject = this,
                b.context = this.context,
                b
        },
        each: function(a, b) {
            return m.each(this, a, b)
        },
        map: function(a) {
            return this.pushStack(m.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length
                , c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: f,
        sort: c.sort,
        splice: c.splice
    },
        m.extend = m.fn.extend = function() {
            var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
            for ("boolean" == typeof g && (j = g,
                g = arguments[h] || {},
                h++),
                 "object" == typeof g || m.isFunction(g) || (g = {}),
                 h === i && (g = this,
                     h--); i > h; h++)
                if (null != (e = arguments[h]))
                    for (d in e)
                        a = g[d],
                            c = e[d],
                        g !== c && (j && c && (m.isPlainObject(c) || (b = m.isArray(c))) ? (b ? (b = !1,
                            f = a && m.isArray(a) ? a : []) : f = a && m.isPlainObject(a) ? a : {},
                            g[d] = m.extend(j, f, c)) : void 0 !== c && (g[d] = c));
            return g
        }
        ,
        m.extend({
            expando: "jQuery" + (l + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(a) {
                throw new Error(a)
            },
            noop: function() {},
            isFunction: function(a) {
                return "function" === m.type(a)
            },
            isArray: Array.isArray || function(a) {
                return "array" === m.type(a)
            }
            ,
            isWindow: function(a) {
                return null != a && a == a.window
            },
            isNumeric: function(a) {
                return !m.isArray(a) && a - parseFloat(a) >= 0
            },
            isEmptyObject: function(a) {
                var b;
                for (b in a)
                    return !1;
                return !0
            },
            isPlainObject: function(a) {
                var b;
                if (!a || "object" !== m.type(a) || a.nodeType || m.isWindow(a))
                    return !1;
                try {
                    if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf"))
                        return !1
                } catch (c) {
                    return !1
                }
                if (k.ownLast)
                    for (b in a)
                        return j.call(a, b);
                for (b in a)
                    ;
                return void 0 === b || j.call(a, b)
            },
            type: function(a) {
                return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
            },
            globalEval: function(b) {
                b && m.trim(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    }
                )(b)
            },
            camelCase: function(a) {
                return a.replace(o, "ms-").replace(p, q)
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
            },
            each: function(a, b, c) {
                var d, e = 0, f = a.length, g = r(a);
                if (c) {
                    if (g) {
                        for (; f > e; e++)
                            if (d = b.apply(a[e], c),
                            d === !1)
                                break
                    } else
                        for (e in a)
                            if (d = b.apply(a[e], c),
                            d === !1)
                                break
                } else if (g) {
                    for (; f > e; e++)
                        if (d = b.call(a[e], e, a[e]),
                        d === !1)
                            break
                } else
                    for (e in a)
                        if (d = b.call(a[e], e, a[e]),
                        d === !1)
                            break;
                return a
            },
            trim: function(a) {
                return null == a ? "" : (a + "").replace(n, "")
            },
            makeArray: function(a, b) {
                var c = b || [];
                return null != a && (r(Object(a)) ? m.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)),
                    c
            },
            inArray: function(a, b, c) {
                var d;
                if (b) {
                    if (g)
                        return g.call(b, a, c);
                    for (d = b.length,
                             c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                        if (c in b && b[c] === a)
                            return c
                }
                return -1
            },
            merge: function(a, b) {
                var c = +b.length
                    , d = 0
                    , e = a.length;
                while (c > d)
                    a[e++] = b[d++];
                if (c !== c)
                    while (void 0 !== b[d])
                        a[e++] = b[d++];
                return a.length = e,
                    a
            },
            grep: function(a, b, c) {
                for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
                    d = !b(a[f], f),
                    d !== h && e.push(a[f]);
                return e
            },
            map: function(a, b, c) {
                var d, f = 0, g = a.length, h = r(a), i = [];
                if (h)
                    for (; g > f; f++)
                        d = b(a[f], f, c),
                        null != d && i.push(d);
                else
                    for (f in a)
                        d = b(a[f], f, c),
                        null != d && i.push(d);
                return e.apply([], i)
            },
            guid: 1,
            proxy: function(a, b) {
                var c, e, f;
                return "string" == typeof b && (f = a[b],
                    b = a,
                    a = f),
                    m.isFunction(a) ? (c = d.call(arguments, 2),
                        e = function() {
                            return a.apply(b || this, c.concat(d.call(arguments)))
                        }
                        ,
                        e.guid = a.guid = a.guid || m.guid++,
                        e) : void 0
            },
            now: function() {
                return +new Date
            },
            support: k
        }),
        m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
            h["[object " + b + "]"] = b.toLowerCase()
        });
    function r(a) {
        var b = a.length
            , c = m.type(a);
        return "function" === c || m.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }
    var s = function(a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + -new Date, v = a.document, w = 0, x = 0, y = gb(), z = gb(), A = gb(), B = function(a, b) {
            return a === b && (l = !0),
                0
        }, C = "undefined", D = 1 << 31, E = {}.hasOwnProperty, F = [], G = F.pop, H = F.push, I = F.push, J = F.slice, K = F.indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (this[b] === a)
                    return b;
            return -1
        }
            , L = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", M = "[\\x20\\t\\r\\n\\f]", N = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", O = N.replace("w", "w#"), P = "\\[" + M + "*(" + N + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + O + "))|)" + M + "*\\]", Q = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + P + ")*)|.*)\\)|)", R = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$","g"), S = new RegExp("^" + M + "*," + M + "*"), T = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"), U = new RegExp("=" + M + "*([^\\]'\"]*?)" + M + "*\\]","g"), V = new RegExp(Q), W = new RegExp("^" + O + "$"), X = {
            ID: new RegExp("^#(" + N + ")"),
            CLASS: new RegExp("^\\.(" + N + ")"),
            TAG: new RegExp("^(" + N.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + P),
            PSEUDO: new RegExp("^" + Q),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)","i"),
            bool: new RegExp("^(?:" + L + ")$","i"),
            needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)","i")
        }, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ab = /[+~]/, bb = /'|\\/g, cb = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)","ig"), db = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        };
        try {
            I.apply(F = J.call(v.childNodes), v.childNodes),
                F[v.childNodes.length].nodeType
        } catch (eb) {
            I = {
                apply: F.length ? function(a, b) {
                        H.apply(a, J.call(b))
                    }
                    : function(a, b) {
                        var c = a.length
                            , d = 0;
                        while (a[c++] = b[d++])
                            ;
                        a.length = c - 1
                    }
            }
        }
        function fb(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w, x;
            if ((b ? b.ownerDocument || b : v) !== n && m(b),
                b = b || n,
                d = d || [],
            !a || "string" != typeof a)
                return d;
            if (1 !== (k = b.nodeType) && 9 !== k)
                return [];
            if (p && !e) {
                if (f = _.exec(a))
                    if (j = f[1]) {
                        if (9 === k) {
                            if (h = b.getElementById(j),
                            !h || !h.parentNode)
                                return d;
                            if (h.id === j)
                                return d.push(h),
                                    d
                        } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j)
                            return d.push(h),
                                d
                    } else {
                        if (f[2])
                            return I.apply(d, b.getElementsByTagName(a)),
                                d;
                        if ((j = f[3]) && c.getElementsByClassName && b.getElementsByClassName)
                            return I.apply(d, b.getElementsByClassName(j)),
                                d
                    }
                if (c.qsa && (!q || !q.test(a))) {
                    if (s = r = u,
                        w = b,
                        x = 9 === k && a,
                    1 === k && "object" !== b.nodeName.toLowerCase()) {
                        o = g(a),
                            (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s),
                            s = "[id='" + s + "'] ",
                            l = o.length;
                        while (l--)
                            o[l] = s + qb(o[l]);
                        w = ab.test(a) && ob(b.parentNode) || b,
                            x = o.join(",")
                    }
                    if (x)
                        try {
                            return I.apply(d, w.querySelectorAll(x)),
                                d
                        } catch (y) {} finally {
                            r || b.removeAttribute("id")
                        }
                }
            }
            return i(a.replace(R, "$1"), b, d, e)
        }
        function gb() {
            var a = [];
            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()],
                    b[c + " "] = e
            }
            return b
        }
        function hb(a) {
            return a[u] = !0,
                a
        }
        function ib(a) {
            var b = n.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b),
                    b = null
            }
        }
        function jb(a, b) {
            var c = a.split("|")
                , e = a.length;
            while (e--)
                d.attrHandle[c[e]] = b
        }
        function kb(a, b) {
            var c = b && a
                , d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || D) - (~a.sourceIndex || D);
            if (d)
                return d;
            if (c)
                while (c = c.nextSibling)
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function lb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }
        function mb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function nb(a) {
            return hb(function(b) {
                return b = +b,
                    hb(function(c, d) {
                        var e, f = a([], c.length, b), g = f.length;
                        while (g--)
                            c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    })
            })
        }
        function ob(a) {
            return a && typeof a.getElementsByTagName !== C && a
        }
        c = fb.support = {},
            f = fb.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return b ? "HTML" !== b.nodeName : !1
            }
            ,
            m = fb.setDocument = function(a) {
                var b, e = a ? a.ownerDocument || a : v, g = e.defaultView;
                return e !== n && 9 === e.nodeType && e.documentElement ? (n = e,
                    o = e.documentElement,
                    p = !f(e),
                g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function() {
                    m()
                }, !1) : g.attachEvent && g.attachEvent("onunload", function() {
                    m()
                })),
                    c.attributes = ib(function(a) {
                        return a.className = "i",
                            !a.getAttribute("className")
                    }),
                    c.getElementsByTagName = ib(function(a) {
                        return a.appendChild(e.createComment("")),
                            !a.getElementsByTagName("*").length
                    }),
                    c.getElementsByClassName = $.test(e.getElementsByClassName) && ib(function(a) {
                        return a.innerHTML = "<div class='a'></div><div class='a i'></div>",
                            a.firstChild.className = "i",
                        2 === a.getElementsByClassName("i").length
                    }),
                    c.getById = ib(function(a) {
                        return o.appendChild(a).id = u,
                        !e.getElementsByName || !e.getElementsByName(u).length
                    }),
                    c.getById ? (d.find.ID = function(a, b) {
                            if (typeof b.getElementById !== C && p) {
                                var c = b.getElementById(a);
                                return c && c.parentNode ? [c] : []
                            }
                        }
                            ,
                            d.filter.ID = function(a) {
                                var b = a.replace(cb, db);
                                return function(a) {
                                    return a.getAttribute("id") === b
                                }
                            }
                    ) : (delete d.find.ID,
                            d.filter.ID = function(a) {
                                var b = a.replace(cb, db);
                                return function(a) {
                                    var c = typeof a.getAttributeNode !== C && a.getAttributeNode("id");
                                    return c && c.value === b
                                }
                            }
                    ),
                    d.find.TAG = c.getElementsByTagName ? function(a, b) {
                            return typeof b.getElementsByTagName !== C ? b.getElementsByTagName(a) : void 0
                        }
                        : function(a, b) {
                            var c, d = [], e = 0, f = b.getElementsByTagName(a);
                            if ("*" === a) {
                                while (c = f[e++])
                                    1 === c.nodeType && d.push(c);
                                return d
                            }
                            return f
                        }
                    ,
                    d.find.CLASS = c.getElementsByClassName && function(a, b) {
                        return typeof b.getElementsByClassName !== C && p ? b.getElementsByClassName(a) : void 0
                    }
                    ,
                    r = [],
                    q = [],
                (c.qsa = $.test(e.querySelectorAll)) && (ib(function(a) {
                    a.innerHTML = "<select msallowclip=''><option selected=''></option></select>",
                    a.querySelectorAll("[msallowclip^='']").length && q.push("[*^$]=" + M + "*(?:''|\"\")"),
                    a.querySelectorAll("[selected]").length || q.push("\\[" + M + "*(?:value|" + L + ")"),
                    a.querySelectorAll(":checked").length || q.push(":checked")
                }),
                    ib(function(a) {
                        var b = e.createElement("input");
                        b.setAttribute("type", "hidden"),
                            a.appendChild(b).setAttribute("name", "D"),
                        a.querySelectorAll("[name=d]").length && q.push("name" + M + "*[*^$|!~]?="),
                        a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"),
                            a.querySelectorAll("*,:x"),
                            q.push(",.*:")
                    })),
                (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ib(function(a) {
                    c.disconnectedMatch = s.call(a, "div"),
                        s.call(a, "[s!='']:x"),
                        r.push("!=", Q)
                }),
                    q = q.length && new RegExp(q.join("|")),
                    r = r.length && new RegExp(r.join("|")),
                    b = $.test(o.compareDocumentPosition),
                    t = b || $.test(o.contains) ? function(a, b) {
                            var c = 9 === a.nodeType ? a.documentElement : a
                                , d = b && b.parentNode;
                            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                        }
                        : function(a, b) {
                            if (b)
                                while (b = b.parentNode)
                                    if (b === a)
                                        return !0;
                            return !1
                        }
                    ,
                    B = b ? function(a, b) {
                            if (a === b)
                                return l = !0,
                                    0;
                            var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
                                1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === v && t(v, a) ? -1 : b === e || b.ownerDocument === v && t(v, b) ? 1 : k ? K.call(k, a) - K.call(k, b) : 0 : 4 & d ? -1 : 1)
                        }
                        : function(a, b) {
                            if (a === b)
                                return l = !0,
                                    0;
                            var c, d = 0, f = a.parentNode, g = b.parentNode, h = [a], i = [b];
                            if (!f || !g)
                                return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : k ? K.call(k, a) - K.call(k, b) : 0;
                            if (f === g)
                                return kb(a, b);
                            c = a;
                            while (c = c.parentNode)
                                h.unshift(c);
                            c = b;
                            while (c = c.parentNode)
                                i.unshift(c);
                            while (h[d] === i[d])
                                d++;
                            return d ? kb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
                        }
                    ,
                    e) : n
            }
            ,
            fb.matches = function(a, b) {
                return fb(a, null, null, b)
            }
            ,
            fb.matchesSelector = function(a, b) {
                if ((a.ownerDocument || a) !== n && m(a),
                    b = b.replace(U, "='$1']"),
                    !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b)))
                    try {
                        var d = s.call(a, b);
                        if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                            return d
                    } catch (e) {}
                return fb(b, n, null, [a]).length > 0
            }
            ,
            fb.contains = function(a, b) {
                return (a.ownerDocument || a) !== n && m(a),
                    t(a, b)
            }
            ,
            fb.attr = function(a, b) {
                (a.ownerDocument || a) !== n && m(a);
                var e = d.attrHandle[b.toLowerCase()]
                    , f = e && E.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
                return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
            }
            ,
            fb.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            }
            ,
            fb.uniqueSort = function(a) {
                var b, d = [], e = 0, f = 0;
                if (l = !c.detectDuplicates,
                    k = !c.sortStable && a.slice(0),
                    a.sort(B),
                    l) {
                    while (b = a[f++])
                        b === a[f] && (e = d.push(f));
                    while (e--)
                        a.splice(d[e], 1)
                }
                return k = null,
                    a
            }
            ,
            e = fb.getText = function(a) {
                var b, c = "", d = 0, f = a.nodeType;
                if (f) {
                    if (1 === f || 9 === f || 11 === f) {
                        if ("string" == typeof a.textContent)
                            return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling)
                            c += e(a)
                    } else if (3 === f || 4 === f)
                        return a.nodeValue
                } else
                    while (b = a[d++])
                        c += e(b);
                return c
            }
            ,
            d = fb.selectors = {
                cacheLength: 50,
                createPseudo: hb,
                match: X,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(a) {
                        return a[1] = a[1].replace(cb, db),
                            a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db),
                        "~=" === a[2] && (a[3] = " " + a[3] + " "),
                            a.slice(0, 4)
                    },
                    CHILD: function(a) {
                        return a[1] = a[1].toLowerCase(),
                            "nth" === a[1].slice(0, 3) ? (a[3] || fb.error(a[0]),
                                a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                                a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && fb.error(a[0]),
                            a
                    },
                    PSEUDO: function(a) {
                        var b, c = !a[6] && a[2];
                        return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
                            a[2] = c.slice(0, b)),
                            a.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(a) {
                        var b = a.replace(cb, db).toLowerCase();
                        return "*" === a ? function() {
                                return !0
                            }
                            : function(a) {
                                return a.nodeName && a.nodeName.toLowerCase() === b
                            }
                    },
                    CLASS: function(a) {
                        var b = y[a + " "];
                        return b || (b = new RegExp("(^|" + M + ")" + a + "(" + M + "|$)")) && y(a, function(a) {
                            return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== C && a.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(a, b, c) {
                        return function(d) {
                            var e = fb.attr(d, a);
                            return null == e ? "!=" === b : b ? (e += "",
                                "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                        }
                    },
                    CHILD: function(a, b, c, d, e) {
                        var f = "nth" !== a.slice(0, 3)
                            , g = "last" !== a.slice(-4)
                            , h = "of-type" === b;
                        return 1 === d && 0 === e ? function(a) {
                                return !!a.parentNode
                            }
                            : function(b, c, i) {
                                var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                                if (q) {
                                    if (f) {
                                        while (p) {
                                            l = b;
                                            while (l = l[p])
                                                if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
                                                    return !1;
                                            o = p = "only" === a && !o && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (o = [g ? q.firstChild : q.lastChild],
                                    g && s) {
                                        k = q[u] || (q[u] = {}),
                                            j = k[a] || [],
                                            n = j[0] === w && j[1],
                                            m = j[0] === w && j[2],
                                            l = n && q.childNodes[n];
                                        while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                            if (1 === l.nodeType && ++m && l === b) {
                                                k[a] = [w, n, m];
                                                break
                                            }
                                    } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w)
                                        m = j[1];
                                    else
                                        while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                            if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]),
                                            l === b))
                                                break;
                                    return m -= e,
                                    m === d || m % d === 0 && m / d >= 0
                                }
                            }
                    },
                    PSEUDO: function(a, b) {
                        var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || fb.error("unsupported pseudo: " + a);
                        return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b],
                                d.setFilters.hasOwnProperty(a.toLowerCase()) ? hb(function(a, c) {
                                    var d, f = e(a, b), g = f.length;
                                    while (g--)
                                        d = K.call(a, f[g]),
                                            a[d] = !(c[d] = f[g])
                                }) : function(a) {
                                    return e(a, 0, c)
                                }
                        ) : e
                    }
                },
                pseudos: {
                    not: hb(function(a) {
                        var b = []
                            , c = []
                            , d = h(a.replace(R, "$1"));
                        return d[u] ? hb(function(a, b, c, e) {
                            var f, g = d(a, null, e, []), h = a.length;
                            while (h--)
                                (f = g[h]) && (a[h] = !(b[h] = f))
                        }) : function(a, e, f) {
                            return b[0] = a,
                                d(b, null, f, c),
                                !c.pop()
                        }
                    }),
                    has: hb(function(a) {
                        return function(b) {
                            return fb(a, b).length > 0
                        }
                    }),
                    contains: hb(function(a) {
                        return function(b) {
                            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                        }
                    }),
                    lang: hb(function(a) {
                        return W.test(a || "") || fb.error("unsupported lang: " + a),
                            a = a.replace(cb, db).toLowerCase(),
                            function(b) {
                                var c;
                                do
                                    if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                                        return c = c.toLowerCase(),
                                        c === a || 0 === c.indexOf(a + "-");
                                while ((b = b.parentNode) && 1 === b.nodeType);
                                return !1
                            }
                    }),
                    target: function(b) {
                        var c = a.location && a.location.hash;
                        return c && c.slice(1) === b.id
                    },
                    root: function(a) {
                        return a === o
                    },
                    focus: function(a) {
                        return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                    },
                    enabled: function(a) {
                        return a.disabled === !1
                    },
                    disabled: function(a) {
                        return a.disabled === !0
                    },
                    checked: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && !!a.checked || "option" === b && !!a.selected
                    },
                    selected: function(a) {
                        return a.parentNode && a.parentNode.selectedIndex,
                        a.selected === !0
                    },
                    empty: function(a) {
                        for (a = a.firstChild; a; a = a.nextSibling)
                            if (a.nodeType < 6)
                                return !1;
                        return !0
                    },
                    parent: function(a) {
                        return !d.pseudos.empty(a)
                    },
                    header: function(a) {
                        return Z.test(a.nodeName)
                    },
                    input: function(a) {
                        return Y.test(a.nodeName)
                    },
                    button: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && "button" === a.type || "button" === b
                    },
                    text: function(a) {
                        var b;
                        return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                    },
                    first: nb(function() {
                        return [0]
                    }),
                    last: nb(function(a, b) {
                        return [b - 1]
                    }),
                    eq: nb(function(a, b, c) {
                        return [0 > c ? c + b : c]
                    }),
                    even: nb(function(a, b) {
                        for (var c = 0; b > c; c += 2)
                            a.push(c);
                        return a
                    }),
                    odd: nb(function(a, b) {
                        for (var c = 1; b > c; c += 2)
                            a.push(c);
                        return a
                    }),
                    lt: nb(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; --d >= 0; )
                            a.push(d);
                        return a
                    }),
                    gt: nb(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; ++d < b; )
                            a.push(d);
                        return a
                    })
                }
            },
            d.pseudos.nth = d.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            d.pseudos[b] = lb(b);
        for (b in {
            submit: !0,
            reset: !0
        })
            d.pseudos[b] = mb(b);
        function pb() {}
        pb.prototype = d.filters = d.pseudos,
            d.setFilters = new pb,
            g = fb.tokenize = function(a, b) {
                var c, e, f, g, h, i, j, k = z[a + " "];
                if (k)
                    return b ? 0 : k.slice(0);
                h = a,
                    i = [],
                    j = d.preFilter;
                while (h) {
                    (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h),
                        i.push(f = [])),
                        c = !1,
                    (e = T.exec(h)) && (c = e.shift(),
                        f.push({
                            value: c,
                            type: e[0].replace(R, " ")
                        }),
                        h = h.slice(c.length));
                    for (g in d.filter)
                        !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(),
                            f.push({
                                value: c,
                                type: g,
                                matches: e
                            }),
                            h = h.slice(c.length));
                    if (!c)
                        break
                }
                return b ? h.length : h ? fb.error(a) : z(a, i).slice(0)
            }
        ;
        function qb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++)
                d += a[b].value;
            return d
        }
        function rb(a, b, c) {
            var d = b.dir
                , e = c && "parentNode" === d
                , f = x++;
            return b.first ? function(b, c, f) {
                    while (b = b[d])
                        if (1 === b.nodeType || e)
                            return a(b, c, f)
                }
                : function(b, c, g) {
                    var h, i, j = [w, f];
                    if (g) {
                        while (b = b[d])
                            if ((1 === b.nodeType || e) && a(b, c, g))
                                return !0
                    } else
                        while (b = b[d])
                            if (1 === b.nodeType || e) {
                                if (i = b[u] || (b[u] = {}),
                                (h = i[d]) && h[0] === w && h[1] === f)
                                    return j[2] = h[2];
                                if (i[d] = j,
                                    j[2] = a(b, c, g))
                                    return !0
                            }
                }
        }
        function sb(a) {
            return a.length > 1 ? function(b, c, d) {
                    var e = a.length;
                    while (e--)
                        if (!a[e](b, c, d))
                            return !1;
                    return !0
                }
                : a[0]
        }
        function tb(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++)
                fb(a, b[d], c);
            return c
        }
        function ub(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
                (f = a[h]) && (!c || c(f, d, e)) && (g.push(f),
                j && b.push(h));
            return g
        }
        function vb(a, b, c, d, e, f) {
            return d && !d[u] && (d = vb(d)),
            e && !e[u] && (e = vb(e, f)),
                hb(function(f, g, h, i) {
                    var j, k, l, m = [], n = [], o = g.length, p = f || tb(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : ub(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                    if (c && c(q, r, h, i),
                        d) {
                        j = ub(r, n),
                            d(j, [], h, i),
                            k = j.length;
                        while (k--)
                            (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                    }
                    if (f) {
                        if (e || a) {
                            if (e) {
                                j = [],
                                    k = r.length;
                                while (k--)
                                    (l = r[k]) && j.push(q[k] = l);
                                e(null, r = [], j, i)
                            }
                            k = r.length;
                            while (k--)
                                (l = r[k]) && (j = e ? K.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                        }
                    } else
                        r = ub(r === g ? r.splice(o, r.length) : r),
                            e ? e(null, g, r, i) : I.apply(g, r)
                })
        }
        function wb(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = rb(function(a) {
                return a === b
            }, h, !0), l = rb(function(a) {
                return K.call(b, a) > -1
            }, h, !0), m = [function(a, c, d) {
                return !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
            }
            ]; f > i; i++)
                if (c = d.relative[a[i].type])
                    m = [rb(sb(m), c)];
                else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches),
                        c[u]) {
                        for (e = ++i; f > e; e++)
                            if (d.relative[a[e].type])
                                break;
                        return vb(i > 1 && sb(m), i > 1 && qb(a.slice(0, i - 1).concat({
                            value: " " === a[i - 2].type ? "*" : ""
                        })).replace(R, "$1"), c, e > i && wb(a.slice(i, e)), f > e && wb(a = a.slice(e)), f > e && qb(a))
                    }
                    m.push(c)
                }
            return sb(m)
        }
        function xb(a, b) {
            var c = b.length > 0
                , e = a.length > 0
                , f = function(f, g, h, i, k) {
                var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || .1, x = u.length;
                for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                    if (e && l) {
                        m = 0;
                        while (o = a[m++])
                            if (o(l, g, h)) {
                                i.push(l);
                                break
                            }
                        k && (w = v)
                    }
                    c && ((l = !o && l) && p--,
                    f && r.push(l))
                }
                if (p += q,
                c && q !== p) {
                    m = 0;
                    while (o = b[m++])
                        o(r, s, g, h);
                    if (f) {
                        if (p > 0)
                            while (q--)
                                r[q] || s[q] || (s[q] = G.call(i));
                        s = ub(s)
                    }
                    I.apply(i, s),
                    k && !f && s.length > 0 && p + b.length > 1 && fb.uniqueSort(i)
                }
                return k && (w = v,
                    j = t),
                    r
            };
            return c ? hb(f) : f
        }
        return h = fb.compile = function(a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)),
                    c = b.length;
                while (c--)
                    f = wb(b[c]),
                        f[u] ? d.push(f) : e.push(f);
                f = A(a, xb(e, d)),
                    f.selector = a
            }
            return f
        }
            ,
            i = fb.select = function(a, b, e, f) {
                var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a);
                if (e = e || [],
                1 === o.length) {
                    if (j = o[0] = o[0].slice(0),
                    j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                        if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0],
                            !b)
                            return e;
                        n && (b = b.parentNode),
                            a = a.slice(j.shift().value.length)
                    }
                    i = X.needsContext.test(a) ? 0 : j.length;
                    while (i--) {
                        if (k = j[i],
                            d.relative[l = k.type])
                            break;
                        if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && ob(b.parentNode) || b))) {
                            if (j.splice(i, 1),
                                a = f.length && qb(j),
                                !a)
                                return I.apply(e, f),
                                    e;
                            break
                        }
                    }
                }
                return (n || h(a, o))(f, b, !p, e, ab.test(a) && ob(b.parentNode) || b),
                    e
            }
            ,
            c.sortStable = u.split("").sort(B).join("") === u,
            c.detectDuplicates = !!l,
            m(),
            c.sortDetached = ib(function(a) {
                return 1 & a.compareDocumentPosition(n.createElement("div"))
            }),
        ib(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || jb("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }),
        c.attributes && ib(function(a) {
            return a.innerHTML = "<input/>",
                a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || jb("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }),
        ib(function(a) {
            return null == a.getAttribute("disabled")
        }) || jb(L, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
            fb
    }(a);
    m.find = s,
        m.expr = s.selectors,
        m.expr[":"] = m.expr.pseudos,
        m.unique = s.uniqueSort,
        m.text = s.getText,
        m.isXMLDoc = s.isXML,
        m.contains = s.contains;
    var t = m.expr.match.needsContext
        , u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
        , v = /^.[^:#\[\.,]*$/;
    function w(a, b, c) {
        if (m.isFunction(b))
            return m.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
        if (b.nodeType)
            return m.grep(a, function(a) {
                return a === b !== c
            });
        if ("string" == typeof b) {
            if (v.test(b))
                return m.filter(b, a, c);
            b = m.filter(b, a)
        }
        return m.grep(a, function(a) {
            return m.inArray(a, b) >= 0 !== c
        })
    }
    m.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"),
            1 === b.length && 1 === d.nodeType ? m.find.matchesSelector(d, a) ? [d] : [] : m.find.matches(a, m.grep(b, function(a) {
                return 1 === a.nodeType
            }))
    }
        ,
        m.fn.extend({
            find: function(a) {
                var b, c = [], d = this, e = d.length;
                if ("string" != typeof a)
                    return this.pushStack(m(a).filter(function() {
                        for (b = 0; e > b; b++)
                            if (m.contains(d[b], this))
                                return !0
                    }));
                for (b = 0; e > b; b++)
                    m.find(a, d[b], c);
                return c = this.pushStack(e > 1 ? m.unique(c) : c),
                    c.selector = this.selector ? this.selector + " " + a : a,
                    c
            },
            filter: function(a) {
                return this.pushStack(w(this, a || [], !1))
            },
            not: function(a) {
                return this.pushStack(w(this, a || [], !0))
            },
            is: function(a) {
                return !!w(this, "string" == typeof a && t.test(a) ? m(a) : a || [], !1).length
            }
        });
    var x, y = a.document, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = m.fn.init = function(a, b) {
            var c, d;
            if (!a)
                return this;
            if ("string" == typeof a) {
                if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : z.exec(a),
                !c || !c[1] && b)
                    return !b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof m ? b[0] : b,
                        m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)),
                    u.test(c[1]) && m.isPlainObject(b))
                        for (c in b)
                            m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                if (d = y.getElementById(c[2]),
                d && d.parentNode) {
                    if (d.id !== c[2])
                        return x.find(a);
                    this.length = 1,
                        this[0] = d
                }
                return this.context = y,
                    this.selector = a,
                    this
            }
            return a.nodeType ? (this.context = this[0] = a,
                this.length = 1,
                this) : m.isFunction(a) ? "undefined" != typeof x.ready ? x.ready(a) : a(m) : (void 0 !== a.selector && (this.selector = a.selector,
                this.context = a.context),
                m.makeArray(a, this))
        }
    ;
    A.prototype = m.fn,
        x = m(y);
    var B = /^(?:parents|prev(?:Until|All))/
        , C = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    m.extend({
        dir: function(a, b, c) {
            var d = []
                , e = a[b];
            while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c)))
                1 === e.nodeType && d.push(e),
                    e = e[b];
            return d
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling)
                1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    }),
        m.fn.extend({
            has: function(a) {
                var b, c = m(a, this), d = c.length;
                return this.filter(function() {
                    for (b = 0; d > b; b++)
                        if (m.contains(this, c[b]))
                            return !0
                })
            },
            closest: function(a, b) {
                for (var c, d = 0, e = this.length, f = [], g = t.test(a) || "string" != typeof a ? m(a, b || this.context) : 0; e > d; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))) {
                            f.push(c);
                            break
                        }
                return this.pushStack(f.length > 1 ? m.unique(f) : f)
            },
            index: function(a) {
                return a ? "string" == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(a, b) {
                return this.pushStack(m.unique(m.merge(this.get(), m(a, b))))
            },
            addBack: function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }
        });
    function D(a, b) {
        do
            a = a[b];
        while (a && 1 !== a.nodeType);
        return a
    }
    m.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return m.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return m.dir(a, "parentNode", c)
        },
        next: function(a) {
            return D(a, "nextSibling")
        },
        prev: function(a) {
            return D(a, "previousSibling")
        },
        nextAll: function(a) {
            return m.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return m.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return m.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return m.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return m.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return m.sibling(a.firstChild)
        },
        contents: function(a) {
            return m.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : m.merge([], a.childNodes)
        }
    }, function(a, b) {
        m.fn[a] = function(c, d) {
            var e = m.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c),
            d && "string" == typeof d && (e = m.filter(d, e)),
            this.length > 1 && (C[a] || (e = m.unique(e)),
            B.test(a) && (e = e.reverse())),
                this.pushStack(e)
        }
    });
    var E = /\S+/g
        , F = {};
    function G(a) {
        var b = F[a] = {};
        return m.each(a.match(E) || [], function(a, c) {
            b[c] = !0
        }),
            b
    }
    m.Callbacks = function(a) {
        a = "string" == typeof a ? F[a] || G(a) : m.extend({}, a);
        var b, c, d, e, f, g, h = [], i = !a.once && [], j = function(l) {
            for (c = a.memory && l,
                     d = !0,
                     f = g || 0,
                     g = 0,
                     e = h.length,
                     b = !0; h && e > f; f++)
                if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break
                }
            b = !1,
            h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
        }, k = {
            add: function() {
                if (h) {
                    var d = h.length;
                    !function f(b) {
                        m.each(b, function(b, c) {
                            var d = m.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                        })
                    }(arguments),
                        b ? e = h.length : c && (g = d,
                            j(c))
                }
                return this
            },
            remove: function() {
                return h && m.each(arguments, function(a, c) {
                    var d;
                    while ((d = m.inArray(c, h, d)) > -1)
                        h.splice(d, 1),
                        b && (e >= d && e--,
                        f >= d && f--)
                }),
                    this
            },
            has: function(a) {
                return a ? m.inArray(a, h) > -1 : !(!h || !h.length)
            },
            empty: function() {
                return h = [],
                    e = 0,
                    this
            },
            disable: function() {
                return h = i = c = void 0,
                    this
            },
            disabled: function() {
                return !h
            },
            lock: function() {
                return i = void 0,
                c || k.disable(),
                    this
            },
            locked: function() {
                return !i
            },
            fireWith: function(a, c) {
                return !h || d && !i || (c = c || [],
                    c = [a, c.slice ? c.slice() : c],
                    b ? i.push(c) : j(c)),
                    this
            },
            fire: function() {
                return k.fireWith(this, arguments),
                    this
            },
            fired: function() {
                return !!d
            }
        };
        return k
    }
        ,
        m.extend({
            Deferred: function(a) {
                var b = [["resolve", "done", m.Callbacks("once memory"), "resolved"], ["reject", "fail", m.Callbacks("once memory"), "rejected"], ["notify", "progress", m.Callbacks("memory")]]
                    , c = "pending"
                    , d = {
                    state: function() {
                        return c
                    },
                    always: function() {
                        return e.done(arguments).fail(arguments),
                            this
                    },
                    then: function() {
                        var a = arguments;
                        return m.Deferred(function(c) {
                            m.each(b, function(b, f) {
                                var g = m.isFunction(a[b]) && a[b];
                                e[f[1]](function() {
                                    var a = g && g.apply(this, arguments);
                                    a && m.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                })
                            }),
                                a = null
                        }).promise()
                    },
                    promise: function(a) {
                        return null != a ? m.extend(a, d) : d
                    }
                }
                    , e = {};
                return d.pipe = d.then,
                    m.each(b, function(a, f) {
                        var g = f[2]
                            , h = f[3];
                        d[f[1]] = g.add,
                        h && g.add(function() {
                            c = h
                        }, b[1 ^ a][2].disable, b[2][2].lock),
                            e[f[0]] = function() {
                                return e[f[0] + "With"](this === e ? d : this, arguments),
                                    this
                            }
                            ,
                            e[f[0] + "With"] = g.fireWith
                    }),
                    d.promise(e),
                a && a.call(e, e),
                    e
            },
            when: function(a) {
                var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && m.isFunction(a.promise) ? e : 0, g = 1 === f ? a : m.Deferred(), h = function(a, b, c) {
                    return function(e) {
                        b[a] = this,
                            c[a] = arguments.length > 1 ? d.call(arguments) : e,
                            c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                    }
                }, i, j, k;
                if (e > 1)
                    for (i = new Array(e),
                             j = new Array(e),
                             k = new Array(e); e > b; b++)
                        c[b] && m.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
                return f || g.resolveWith(k, c),
                    g.promise()
            }
        });
    var H;
    m.fn.ready = function(a) {
        return m.ready.promise().done(a),
            this
    }
        ,
        m.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? m.readyWait++ : m.ready(!0)
            },
            ready: function(a) {
                if (a === !0 ? !--m.readyWait : !m.isReady) {
                    if (!y.body)
                        return setTimeout(m.ready);
                    m.isReady = !0,
                    a !== !0 && --m.readyWait > 0 || (H.resolveWith(y, [m]),
                    m.fn.triggerHandler && (m(y).triggerHandler("ready"),
                        m(y).off("ready")))
                }
            }
        });
    function I() {
        y.addEventListener ? (y.removeEventListener("DOMContentLoaded", J, !1),
            a.removeEventListener("load", J, !1)) : (y.detachEvent("onreadystatechange", J),
            a.detachEvent("onload", J))
    }
    function J() {
        (y.addEventListener || "load" === event.type || "complete" === y.readyState) && (I(),
            m.ready())
    }
    m.ready.promise = function(b) {
        if (!H)
            if (H = m.Deferred(),
            "complete" === y.readyState)
                setTimeout(m.ready);
            else if (y.addEventListener)
                y.addEventListener("DOMContentLoaded", J, !1),
                    a.addEventListener("load", J, !1);
            else {
                y.attachEvent("onreadystatechange", J),
                    a.attachEvent("onload", J);
                var c = !1;
                try {
                    c = null == a.frameElement && y.documentElement
                } catch (d) {}
                c && c.doScroll && !function e() {
                    if (!m.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (a) {
                            return setTimeout(e, 50)
                        }
                        I(),
                            m.ready()
                    }
                }()
            }
        return H.promise(b)
    }
    ;
    var K = "undefined", L;
    for (L in m(k))
        break;
    k.ownLast = "0" !== L,
        k.inlineBlockNeedsLayout = !1,
        m(function() {
            var a, b, c, d;
            c = y.getElementsByTagName("body")[0],
            c && c.style && (b = y.createElement("div"),
                d = y.createElement("div"),
                d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                c.appendChild(d).appendChild(b),
            typeof b.style.zoom !== K && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
                k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth,
            a && (c.style.zoom = 1)),
                c.removeChild(d))
        }),
        function() {
            var a = y.createElement("div");
            if (null == k.deleteExpando) {
                k.deleteExpando = !0;
                try {
                    delete a.test
                } catch (b) {
                    k.deleteExpando = !1
                }
            }
            a = null
        }(),
        m.acceptData = function(a) {
            var b = m.noData[(a.nodeName + " ").toLowerCase()]
                , c = +a.nodeType || 1;
            return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
        }
    ;
    var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
        , N = /([A-Z])/g;
    function O(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(N, "-$1").toLowerCase();
            if (c = a.getAttribute(d),
            "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : M.test(c) ? m.parseJSON(c) : c
                } catch (e) {}
                m.data(a, b, c)
            } else
                c = void 0
        }
        return c
    }
    function P(a) {
        var b;
        for (b in a)
            if (("data" !== b || !m.isEmptyObject(a[b])) && "toJSON" !== b)
                return !1;
        return !0
    }
    function Q(a, b, d, e) {
        if (m.acceptData(a)) {
            var f, g, h = m.expando, i = a.nodeType, j = i ? m.cache : a, k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b)
                return k || (k = i ? a[h] = c.pop() || m.guid++ : h),
                j[k] || (j[k] = i ? {} : {
                    toJSON: m.noop
                }),
                ("object" == typeof b || "function" == typeof b) && (e ? j[k] = m.extend(j[k], b) : j[k].data = m.extend(j[k].data, b)),
                    g = j[k],
                e || (g.data || (g.data = {}),
                    g = g.data),
                void 0 !== d && (g[m.camelCase(b)] = d),
                    "string" == typeof b ? (f = g[b],
                    null == f && (f = g[m.camelCase(b)])) : f = g,
                    f
        }
    }
    function R(a, b, c) {
        if (m.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? m.cache : a, h = f ? a[m.expando] : m.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    m.isArray(b) ? b = b.concat(m.map(b, m.camelCase)) : b in d ? b = [b] : (b = m.camelCase(b),
                        b = b in d ? [b] : b.split(" ")),
                        e = b.length;
                    while (e--)
                        delete d[b[e]];
                    if (c ? !P(d) : !m.isEmptyObject(d))
                        return
                }
                (c || (delete g[h].data,
                    P(g[h]))) && (f ? m.cleanData([a], !0) : k.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }
    m.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando],
            !!a && !P(a)
        },
        data: function(a, b, c) {
            return Q(a, b, c)
        },
        removeData: function(a, b) {
            return R(a, b)
        },
        _data: function(a, b, c) {
            return Q(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return R(a, b, !0)
        }
    }),
        m.fn.extend({
            data: function(a, b) {
                var c, d, e, f = this[0], g = f && f.attributes;
                if (void 0 === a) {
                    if (this.length && (e = m.data(f),
                    1 === f.nodeType && !m._data(f, "parsedAttrs"))) {
                        c = g.length;
                        while (c--)
                            g[c] && (d = g[c].name,
                            0 === d.indexOf("data-") && (d = m.camelCase(d.slice(5)),
                                O(f, d, e[d])));
                        m._data(f, "parsedAttrs", !0)
                    }
                    return e
                }
                return "object" == typeof a ? this.each(function() {
                    m.data(this, a)
                }) : arguments.length > 1 ? this.each(function() {
                    m.data(this, a, b)
                }) : f ? O(f, a, m.data(f, a)) : void 0
            },
            removeData: function(a) {
                return this.each(function() {
                    m.removeData(this, a)
                })
            }
        }),
        m.extend({
            queue: function(a, b, c) {
                var d;
                return a ? (b = (b || "fx") + "queue",
                    d = m._data(a, b),
                c && (!d || m.isArray(c) ? d = m._data(a, b, m.makeArray(c)) : d.push(c)),
                d || []) : void 0
            },
            dequeue: function(a, b) {
                b = b || "fx";
                var c = m.queue(a, b)
                    , d = c.length
                    , e = c.shift()
                    , f = m._queueHooks(a, b)
                    , g = function() {
                    m.dequeue(a, b)
                };
                "inprogress" === e && (e = c.shift(),
                    d--),
                e && ("fx" === b && c.unshift("inprogress"),
                    delete f.stop,
                    e.call(a, g, f)),
                !d && f && f.empty.fire()
            },
            _queueHooks: function(a, b) {
                var c = b + "queueHooks";
                return m._data(a, c) || m._data(a, c, {
                    empty: m.Callbacks("once memory").add(function() {
                        m._removeData(a, b + "queue"),
                            m._removeData(a, c)
                    })
                })
            }
        }),
        m.fn.extend({
            queue: function(a, b) {
                var c = 2;
                return "string" != typeof a && (b = a,
                    a = "fx",
                    c--),
                    arguments.length < c ? m.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                        var c = m.queue(this, a, b);
                        m._queueHooks(this, a),
                        "fx" === a && "inprogress" !== c[0] && m.dequeue(this, a)
                    })
            },
            dequeue: function(a) {
                return this.each(function() {
                    m.dequeue(this, a)
                })
            },
            clearQueue: function(a) {
                return this.queue(a || "fx", [])
            },
            promise: function(a, b) {
                var c, d = 1, e = m.Deferred(), f = this, g = this.length, h = function() {
                    --d || e.resolveWith(f, [f])
                };
                "string" != typeof a && (b = a,
                    a = void 0),
                    a = a || "fx";
                while (g--)
                    c = m._data(f[g], a + "queueHooks"),
                    c && c.empty && (d++,
                        c.empty.add(h));
                return h(),
                    e.promise(b)
            }
        });
    var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
        , T = ["Top", "Right", "Bottom", "Left"]
        , U = function(a, b) {
        return a = b || a,
        "none" === m.css(a, "display") || !m.contains(a.ownerDocument, a)
    }
        , V = m.access = function(a, b, c, d, e, f, g) {
        var h = 0
            , i = a.length
            , j = null == c;
        if ("object" === m.type(c)) {
            e = !0;
            for (h in c)
                m.access(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0,
        m.isFunction(d) || (g = !0),
        j && (g ? (b.call(a, d),
            b = null) : (j = b,
                b = function(a, b, c) {
                    return j.call(m(a), c)
                }
        )),
            b))
            for (; i > h; h++)
                b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }
        , W = /^(?:checkbox|radio)$/i;
    !function() {
        var a = y.createElement("input")
            , b = y.createElement("div")
            , c = y.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
            k.leadingWhitespace = 3 === b.firstChild.nodeType,
            k.tbody = !b.getElementsByTagName("tbody").length,
            k.htmlSerialize = !!b.getElementsByTagName("link").length,
            k.html5Clone = "<:nav></:nav>" !== y.createElement("nav").cloneNode(!0).outerHTML,
            a.type = "checkbox",
            a.checked = !0,
            c.appendChild(a),
            k.appendChecked = a.checked,
            b.innerHTML = "<textarea>x</textarea>",
            k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue,
            c.appendChild(b),
            b.innerHTML = "<input type='radio' checked='checked' name='t'/>",
            k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked,
            k.noCloneEvent = !0,
        b.attachEvent && (b.attachEvent("onclick", function() {
            k.noCloneEvent = !1
        }),
            b.cloneNode(!0).click()),
        null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete b.test
            } catch (d) {
                k.deleteExpando = !1
            }
        }
    }(),
        function() {
            var b, c, d = y.createElement("div");
            for (b in {
                submit: !0,
                change: !0,
                focusin: !0
            })
                c = "on" + b,
                (k[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"),
                    k[b + "Bubbles"] = d.attributes[c].expando === !1);
            d = null
        }();
    var X = /^(?:input|select|textarea)$/i
        , Y = /^key/
        , Z = /^(?:mouse|pointer|contextmenu)|click/
        , $ = /^(?:focusinfocus|focusoutblur)$/
        , _ = /^([^.]*)(?:\.(.+)|)$/;
    function ab() {
        return !0
    }
    function bb() {
        return !1
    }
    function cb() {
        try {
            return y.activeElement
        } catch (a) {}
    }
    m.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m._data(a);
            if (r) {
                c.handler && (i = c,
                    c = i.handler,
                    e = i.selector),
                c.guid || (c.guid = m.guid++),
                (g = r.events) || (g = r.events = {}),
                (k = r.handle) || (k = r.handle = function(a) {
                    return typeof m === K || a && m.event.triggered === a.type ? void 0 : m.event.dispatch.apply(k.elem, arguments)
                }
                    ,
                    k.elem = a),
                    b = (b || "").match(E) || [""],
                    h = b.length;
                while (h--)
                    f = _.exec(b[h]) || [],
                        o = q = f[1],
                        p = (f[2] || "").split(".").sort(),
                    o && (j = m.event.special[o] || {},
                        o = (e ? j.delegateType : j.bindType) || o,
                        j = m.event.special[o] || {},
                        l = m.extend({
                            type: o,
                            origType: q,
                            data: d,
                            handler: c,
                            guid: c.guid,
                            selector: e,
                            needsContext: e && m.expr.match.needsContext.test(e),
                            namespace: p.join(".")
                        }, i),
                    (n = g[o]) || (n = g[o] = [],
                        n.delegateCount = 0,
                    j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))),
                    j.add && (j.add.call(a, l),
                    l.handler.guid || (l.handler.guid = c.guid)),
                        e ? n.splice(n.delegateCount++, 0, l) : n.push(l),
                        m.event.global[o] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m.hasData(a) && m._data(a);
            if (r && (k = r.events)) {
                b = (b || "").match(E) || [""],
                    j = b.length;
                while (j--)
                    if (h = _.exec(b[j]) || [],
                        o = q = h[1],
                        p = (h[2] || "").split(".").sort(),
                        o) {
                        l = m.event.special[o] || {},
                            o = (d ? l.delegateType : l.bindType) || o,
                            n = k[o] || [],
                            h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                            i = f = n.length;
                        while (f--)
                            g = n[f],
                            !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (n.splice(f, 1),
                            g.selector && n.delegateCount--,
                            l.remove && l.remove.call(a, g));
                        i && !n.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || m.removeEvent(a, o, r.handle),
                            delete k[o])
                    } else
                        for (o in k)
                            m.event.remove(a, o + b[j], c, d, !0);
                m.isEmptyObject(k) && (delete r.handle,
                    m._removeData(a, "events"))
            }
        },
        trigger: function(b, c, d, e) {
            var f, g, h, i, k, l, n, o = [d || y], p = j.call(b, "type") ? b.type : b, q = j.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = l = d = d || y,
            3 !== d.nodeType && 8 !== d.nodeType && !$.test(p + m.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."),
                p = q.shift(),
                q.sort()),
                g = p.indexOf(":") < 0 && "on" + p,
                b = b[m.expando] ? b : new m.Event(p,"object" == typeof b && b),
                b.isTrigger = e ? 2 : 3,
                b.namespace = q.join("."),
                b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                b.result = void 0,
            b.target || (b.target = d),
                c = null == c ? [b] : m.makeArray(c, [b]),
                k = m.event.special[p] || {},
            e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
                if (!e && !k.noBubble && !m.isWindow(d)) {
                    for (i = k.delegateType || p,
                         $.test(i + p) || (h = h.parentNode); h; h = h.parentNode)
                        o.push(h),
                            l = h;
                    l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a)
                }
                n = 0;
                while ((h = o[n++]) && !b.isPropagationStopped())
                    b.type = n > 1 ? i : k.bindType || p,
                        f = (m._data(h, "events") || {})[b.type] && m._data(h, "handle"),
                    f && f.apply(h, c),
                        f = g && h[g],
                    f && f.apply && m.acceptData(h) && (b.result = f.apply(h, c),
                    b.result === !1 && b.preventDefault());
                if (b.type = p,
                !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && m.acceptData(d) && g && d[p] && !m.isWindow(d)) {
                    l = d[g],
                    l && (d[g] = null),
                        m.event.triggered = p;
                    try {
                        d[p]()
                    } catch (r) {}
                    m.event.triggered = void 0,
                    l && (d[g] = l)
                }
                return b.result
            }
        },
        dispatch: function(a) {
            a = m.event.fix(a);
            var b, c, e, f, g, h = [], i = d.call(arguments), j = (m._data(this, "events") || {})[a.type] || [], k = m.event.special[a.type] || {};
            if (i[0] = a,
                a.delegateTarget = this,
            !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                h = m.event.handlers.call(this, a, j),
                    b = 0;
                while ((f = h[b++]) && !a.isPropagationStopped()) {
                    a.currentTarget = f.elem,
                        g = 0;
                    while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())
                        (!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e,
                            a.data = e.data,
                            c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i),
                        void 0 !== c && (a.result = c) === !1 && (a.preventDefault(),
                            a.stopPropagation()))
                }
                return k.postDispatch && k.postDispatch.call(this, a),
                    a.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [],
                                 f = 0; h > f; f++)
                            d = b[f],
                                c = d.selector + " ",
                            void 0 === e[c] && (e[c] = d.needsContext ? m(c, this).index(i) >= 0 : m.find(c, this, null, [i]).length),
                            e[c] && e.push(d);
                        e.length && g.push({
                            elem: i,
                            handlers: e
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }),
                g
        },
        fix: function(a) {
            if (a[m.expando])
                return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}),
                d = g.props ? this.props.concat(g.props) : this.props,
                a = new m.Event(f),
                b = d.length;
            while (b--)
                c = d[b],
                    a[c] = f[c];
            return a.target || (a.target = f.srcElement || y),
            3 === a.target.nodeType && (a.target = a.target.parentNode),
                a.metaKey = !!a.metaKey,
                g.filter ? g.filter(a, f) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
                    a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button, g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || y,
                    e = d.documentElement,
                    c = d.body,
                    a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0),
                    a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)),
                !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
                a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
                    a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== cb() && this.focus)
                        try {
                            return this.focus(),
                                !1
                        } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === cb() && this.blur ? (this.blur(),
                        !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return m.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                        !1) : void 0
                },
                _default: function(a) {
                    return m.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = m.extend(new m.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e),
            e.isDefaultPrevented() && c.preventDefault()
        }
    },
        m.removeEvent = y.removeEventListener ? function(a, b, c) {
                a.removeEventListener && a.removeEventListener(b, c, !1)
            }
            : function(a, b, c) {
                var d = "on" + b;
                a.detachEvent && (typeof a[d] === K && (a[d] = null),
                    a.detachEvent(d, c))
            }
        ,
        m.Event = function(a, b) {
            return this instanceof m.Event ? (a && a.type ? (this.originalEvent = a,
                this.type = a.type,
                this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ab : bb) : this.type = a,
            b && m.extend(this, b),
                this.timeStamp = a && a.timeStamp || m.now(),
                void (this[m.expando] = !0)) : new m.Event(a,b)
        }
        ,
        m.Event.prototype = {
            isDefaultPrevented: bb,
            isPropagationStopped: bb,
            isImmediatePropagationStopped: bb,
            preventDefault: function() {
                var a = this.originalEvent;
                this.isDefaultPrevented = ab,
                a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                var a = this.originalEvent;
                this.isPropagationStopped = ab,
                a && (a.stopPropagation && a.stopPropagation(),
                    a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var a = this.originalEvent;
                this.isImmediatePropagationStopped = ab,
                a && a.stopImmediatePropagation && a.stopImmediatePropagation(),
                    this.stopPropagation()
            }
        },
        m.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(a, b) {
            m.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c, d = this, e = a.relatedTarget, f = a.handleObj;
                    return (!e || e !== d && !m.contains(d, e)) && (a.type = f.origType,
                        c = f.handler.apply(this, arguments),
                        a.type = b),
                        c
                }
            }
        }),
    k.submitBubbles || (m.event.special.submit = {
        setup: function() {
            return m.nodeName(this, "form") ? !1 : void m.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target
                    , c = m.nodeName(b, "input") || m.nodeName(b, "button") ? b.form : void 0;
                c && !m._data(c, "submitBubbles") && (m.event.add(c, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }),
                    m._data(c, "submitBubbles", !0))
            })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble,
            this.parentNode && !a.isTrigger && m.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            return m.nodeName(this, "form") ? !1 : void m.event.remove(this, "._submit")
        }
    }),
    k.changeBubbles || (m.event.special.change = {
        setup: function() {
            return X.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (m.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }),
                m.event.add(this, "click._change", function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1),
                        m.event.simulate("change", this, a, !0)
                })),
                !1) : void m.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                X.test(b.nodeName) && !m._data(b, "changeBubbles") && (m.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || m.event.simulate("change", this.parentNode, a, !0)
                }),
                    m._data(b, "changeBubbles", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return m.event.remove(this, "._change"),
                !X.test(this.nodeName)
        }
    }),
    k.focusinBubbles || m.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            m.event.simulate(b, a.target, m.event.fix(a), !0)
        };
        m.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this
                    , e = m._data(d, b);
                e || d.addEventListener(a, c, !0),
                    m._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this
                    , e = m._data(d, b) - 1;
                e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0),
                    m._removeData(d, b))
            }
        }
    }),
        m.fn.extend({
            on: function(a, b, c, d, e) {
                var f, g;
                if ("object" == typeof a) {
                    "string" != typeof b && (c = c || b,
                        b = void 0);
                    for (f in a)
                        this.on(f, b, c, a[f], e);
                    return this
                }
                if (null == c && null == d ? (d = b,
                    c = b = void 0) : null == d && ("string" == typeof b ? (d = c,
                    c = void 0) : (d = c,
                    c = b,
                    b = void 0)),
                d === !1)
                    d = bb;
                else if (!d)
                    return this;
                return 1 === e && (g = d,
                    d = function(a) {
                        return m().off(a),
                            g.apply(this, arguments)
                    }
                    ,
                    d.guid = g.guid || (g.guid = m.guid++)),
                    this.each(function() {
                        m.event.add(this, a, d, c, b)
                    })
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1)
            },
            off: function(a, b, c) {
                var d, e;
                if (a && a.preventDefault && a.handleObj)
                    return d = a.handleObj,
                        m(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                        this;
                if ("object" == typeof a) {
                    for (e in a)
                        this.off(e, b, a[e]);
                    return this
                }
                return (b === !1 || "function" == typeof b) && (c = b,
                    b = void 0),
                c === !1 && (c = bb),
                    this.each(function() {
                        m.event.remove(this, a, c, b)
                    })
            },
            trigger: function(a, b) {
                return this.each(function() {
                    m.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                var c = this[0];
                return c ? m.event.trigger(a, b, c, !0) : void 0
            }
        });
    function db(a) {
        var b = eb.split("|")
            , c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length)
                c.createElement(b.pop());
        return c
    }
    var eb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
        , fb = / jQuery\d+="(?:null|\d+)"/g
        , gb = new RegExp("<(?:" + eb + ")[\\s/>]","i")
        , hb = /^\s+/
        , ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
        , jb = /<([\w:]+)/
        , kb = /<tbody/i
        , lb = /<|&#?\w+;/
        , mb = /<(?:script|style|link)/i
        , nb = /checked\s*(?:[^=]|=\s*.checked.)/i
        , ob = /^$|\/(?:java|ecma)script/i
        , pb = /^true\/(.*)/
        , qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
        , rb = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: k.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }
        , sb = db(y)
        , tb = sb.appendChild(y.createElement("div"));
    rb.optgroup = rb.option,
        rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead,
        rb.th = rb.td;
    function ub(a, b) {
        var c, d, e = 0, f = typeof a.getElementsByTagName !== K ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [],
                     c = a.childNodes || a; null != (d = c[e]); e++)
                !b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b));
        return void 0 === b || b && m.nodeName(a, b) ? m.merge([a], f) : f
    }
    function vb(a) {
        W.test(a.type) && (a.defaultChecked = a.checked)
    }
    function wb(a, b) {
        return m.nodeName(a, "table") && m.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function xb(a) {
        return a.type = (null !== m.find.attr(a, "type")) + "/" + a.type,
            a
    }
    function yb(a) {
        var b = pb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"),
            a
    }
    function zb(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++)
            m._data(c, "globalEval", !b || m._data(b[d], "globalEval"))
    }
    function Ab(a, b) {
        if (1 === b.nodeType && m.hasData(a)) {
            var c, d, e, f = m._data(a), g = m._data(b, f), h = f.events;
            if (h) {
                delete g.handle,
                    g.events = {};
                for (c in h)
                    for (d = 0,
                             e = h[c].length; e > d; d++)
                        m.event.add(b, c, h[c][d])
            }
            g.data && (g.data = m.extend({}, g.data))
        }
    }
    function Bb(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(),
            !k.noCloneEvent && b[m.expando]) {
                e = m._data(b);
                for (d in e.events)
                    m.removeEvent(b, d, e.handle);
                b.removeAttribute(m.expando)
            }
            "script" === c && b.text !== a.text ? (xb(b).text = a.text,
                yb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML),
            k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && W.test(a.type) ? (b.defaultChecked = b.checked = a.checked,
            b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }
    }
    m.extend({
        clone: function(a, b, c) {
            var d, e, f, g, h, i = m.contains(a.ownerDocument, a);
            if (k.html5Clone || m.isXMLDoc(a) || !gb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (tb.innerHTML = a.outerHTML,
                tb.removeChild(f = tb.firstChild)),
                !(k.noCloneEvent && k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || m.isXMLDoc(a)))
                for (d = ub(f),
                         h = ub(a),
                         g = 0; null != (e = h[g]); ++g)
                    d[g] && Bb(e, d[g]);
            if (b)
                if (c)
                    for (h = h || ub(a),
                             d = d || ub(f),
                             g = 0; null != (e = h[g]); g++)
                        Ab(e, d[g]);
                else
                    Ab(a, f);
            return d = ub(f, "script"),
            d.length > 0 && zb(d, !i && ub(a, "script")),
                d = h = e = null,
                f
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++)
                if (f = a[q],
                f || 0 === f)
                    if ("object" === m.type(f))
                        m.merge(p, f.nodeType ? [f] : f);
                    else if (lb.test(f)) {
                        h = h || o.appendChild(b.createElement("div")),
                            i = (jb.exec(f) || ["", ""])[1].toLowerCase(),
                            l = rb[i] || rb._default,
                            h.innerHTML = l[1] + f.replace(ib, "<$1></$2>") + l[2],
                            e = l[0];
                        while (e--)
                            h = h.lastChild;
                        if (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])),
                            !k.tbody) {
                            f = "table" !== i || kb.test(f) ? "<table>" !== l[1] || kb.test(f) ? 0 : h : h.firstChild,
                                e = f && f.childNodes.length;
                            while (e--)
                                m.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
                        }
                        m.merge(p, h.childNodes),
                            h.textContent = "";
                        while (h.firstChild)
                            h.removeChild(h.firstChild);
                        h = o.lastChild
                    } else
                        p.push(b.createTextNode(f));
            h && o.removeChild(h),
            k.appendChecked || m.grep(ub(p, "input"), vb),
                q = 0;
            while (f = p[q++])
                if ((!d || -1 === m.inArray(f, d)) && (g = m.contains(f.ownerDocument, f),
                    h = ub(o.appendChild(f), "script"),
                g && zb(h),
                    c)) {
                    e = 0;
                    while (f = h[e++])
                        ob.test(f.type || "") && c.push(f)
                }
            return h = null,
                o
        },
        cleanData: function(a, b) {
            for (var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special; null != (d = a[h]); h++)
                if ((b || m.acceptData(d)) && (f = d[i],
                    g = f && j[f])) {
                    if (g.events)
                        for (e in g.events)
                            n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle);
                    j[f] && (delete j[f],
                        l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : d[i] = null,
                        c.push(f))
                }
        }
    }),
        m.fn.extend({
            text: function(a) {
                return V(this, function(a) {
                    return void 0 === a ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || y).createTextNode(a))
                }, null, a, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = wb(this, a);
                        b.appendChild(a)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = wb(this, a);
                        b.insertBefore(a, b.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                })
            },
            remove: function(a, b) {
                for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
                    b || 1 !== c.nodeType || m.cleanData(ub(c)),
                    c.parentNode && (b && m.contains(c.ownerDocument, c) && zb(ub(c, "script")),
                        c.parentNode.removeChild(c));
                return this
            },
            empty: function() {
                for (var a, b = 0; null != (a = this[b]); b++) {
                    1 === a.nodeType && m.cleanData(ub(a, !1));
                    while (a.firstChild)
                        a.removeChild(a.firstChild);
                    a.options && m.nodeName(a, "select") && (a.options.length = 0)
                }
                return this
            },
            clone: function(a, b) {
                return a = null == a ? !1 : a,
                    b = null == b ? a : b,
                    this.map(function() {
                        return m.clone(this, a, b)
                    })
            },
            html: function(a) {
                return V(this, function(a) {
                    var b = this[0] || {}
                        , c = 0
                        , d = this.length;
                    if (void 0 === a)
                        return 1 === b.nodeType ? b.innerHTML.replace(fb, "") : void 0;
                    if (!("string" != typeof a || mb.test(a) || !k.htmlSerialize && gb.test(a) || !k.leadingWhitespace && hb.test(a) || rb[(jb.exec(a) || ["", ""])[1].toLowerCase()])) {
                        a = a.replace(ib, "<$1></$2>");
                        try {
                            for (; d > c; c++)
                                b = this[c] || {},
                                1 === b.nodeType && (m.cleanData(ub(b, !1)),
                                    b.innerHTML = a);
                            b = 0
                        } catch (e) {}
                    }
                    b && this.empty().append(a)
                }, null, a, arguments.length)
            },
            replaceWith: function() {
                var a = arguments[0];
                return this.domManip(arguments, function(b) {
                    a = this.parentNode,
                        m.cleanData(ub(this)),
                    a && a.replaceChild(b, this)
                }),
                    a && (a.length || a.nodeType) ? this : this.remove()
            },
            detach: function(a) {
                return this.remove(a, !0)
            },
            domManip: function(a, b) {
                a = e.apply([], a);
                var c, d, f, g, h, i, j = 0, l = this.length, n = this, o = l - 1, p = a[0], q = m.isFunction(p);
                if (q || l > 1 && "string" == typeof p && !k.checkClone && nb.test(p))
                    return this.each(function(c) {
                        var d = n.eq(c);
                        q && (a[0] = p.call(this, c, d.html())),
                            d.domManip(a, b)
                    });
                if (l && (i = m.buildFragment(a, this[0].ownerDocument, !1, this),
                    c = i.firstChild,
                1 === i.childNodes.length && (i = c),
                    c)) {
                    for (g = m.map(ub(i, "script"), xb),
                             f = g.length; l > j; j++)
                        d = i,
                        j !== o && (d = m.clone(d, !0, !0),
                        f && m.merge(g, ub(d, "script"))),
                            b.call(this[j], d, j);
                    if (f)
                        for (h = g[g.length - 1].ownerDocument,
                                 m.map(g, yb),
                                 j = 0; f > j; j++)
                            d = g[j],
                            ob.test(d.type || "") && !m._data(d, "globalEval") && m.contains(h, d) && (d.src ? m._evalUrl && m._evalUrl(d.src) : m.globalEval((d.text || d.textContent || d.innerHTML || "").replace(qb, "")));
                    i = c = null
                }
                return this
            }
        }),
        m.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(a, b) {
            m.fn[a] = function(a) {
                for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++)
                    c = d === h ? this : this.clone(!0),
                        m(g[d])[b](c),
                        f.apply(e, c.get());
                return this.pushStack(e)
            }
        });
    var Cb, Db = {};
    function Eb(b, c) {
        var d, e = m(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : m.css(e[0], "display");
        return e.detach(),
            f
    }
    function Fb(a) {
        var b = y
            , c = Db[a];
        return c || (c = Eb(a, b),
        "none" !== c && c || (Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),
            b = (Cb[0].contentWindow || Cb[0].contentDocument).document,
            b.write(),
            b.close(),
            c = Eb(a, b),
            Cb.detach()),
            Db[a] = c),
            c
    }
    !function() {
        var a;
        k.shrinkWrapBlocks = function() {
            if (null != a)
                return a;
            a = !1;
            var b, c, d;
            return c = y.getElementsByTagName("body")[0],
                c && c.style ? (b = y.createElement("div"),
                    d = y.createElement("div"),
                    d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    c.appendChild(d).appendChild(b),
                typeof b.style.zoom !== K && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
                    b.appendChild(y.createElement("div")).style.width = "5px",
                    a = 3 !== b.offsetWidth),
                    c.removeChild(d),
                    a) : void 0
        }
    }();
    var Gb = /^margin/, Hb = new RegExp("^(" + S + ")(?!px)[a-z%]+$","i"), Ib, Jb, Kb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ib = function(a) {
            return a.ownerDocument.defaultView.getComputedStyle(a, null)
        }
            ,
            Jb = function(a, b, c) {
                var d, e, f, g, h = a.style;
                return c = c || Ib(a),
                    g = c ? c.getPropertyValue(b) || c[b] : void 0,
                c && ("" !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)),
                Hb.test(g) && Gb.test(b) && (d = h.width,
                    e = h.minWidth,
                    f = h.maxWidth,
                    h.minWidth = h.maxWidth = h.width = g,
                    g = c.width,
                    h.width = d,
                    h.minWidth = e,
                    h.maxWidth = f)),
                    void 0 === g ? g : g + ""
            }
    ) : y.documentElement.currentStyle && (Ib = function(a) {
            return a.currentStyle
        }
            ,
            Jb = function(a, b, c) {
                var d, e, f, g, h = a.style;
                return c = c || Ib(a),
                    g = c ? c[b] : void 0,
                null == g && h && h[b] && (g = h[b]),
                Hb.test(g) && !Kb.test(b) && (d = h.left,
                    e = a.runtimeStyle,
                    f = e && e.left,
                f && (e.left = a.currentStyle.left),
                    h.left = "fontSize" === b ? "1em" : g,
                    g = h.pixelLeft + "px",
                    h.left = d,
                f && (e.left = f)),
                    void 0 === g ? g : g + "" || "auto"
            }
    );
    function Lb(a, b) {
        return {
            get: function() {
                var c = a();
                if (null != c)
                    return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    !function() {
        var b, c, d, e, f, g, h;
        if (b = y.createElement("div"),
            b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
            d = b.getElementsByTagName("a")[0],
            c = d && d.style) {
            c.cssText = "float:left;opacity:.5",
                k.opacity = "0.5" === c.opacity,
                k.cssFloat = !!c.cssFloat,
                b.style.backgroundClip = "content-box",
                b.cloneNode(!0).style.backgroundClip = "",
                k.clearCloneStyle = "content-box" === b.style.backgroundClip,
                k.boxSizing = "" === c.boxSizing || "" === c.MozBoxSizing || "" === c.WebkitBoxSizing,
                m.extend(k, {
                    reliableHiddenOffsets: function() {
                        return null == g && i(),
                            g
                    },
                    boxSizingReliable: function() {
                        return null == f && i(),
                            f
                    },
                    pixelPosition: function() {
                        return null == e && i(),
                            e
                    },
                    reliableMarginRight: function() {
                        return null == h && i(),
                            h
                    }
                });
            function i() {
                var b, c, d, i;
                c = y.getElementsByTagName("body")[0],
                c && c.style && (b = y.createElement("div"),
                    d = y.createElement("div"),
                    d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    c.appendChild(d).appendChild(b),
                    b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
                    e = f = !1,
                    h = !0,
                a.getComputedStyle && (e = "1%" !== (a.getComputedStyle(b, null) || {}).top,
                    f = "4px" === (a.getComputedStyle(b, null) || {
                        width: "4px"
                    }).width,
                    i = b.appendChild(y.createElement("div")),
                    i.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                    i.style.marginRight = i.style.width = "0",
                    b.style.width = "1px",
                    h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight)),
                    b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
                    i = b.getElementsByTagName("td"),
                    i[0].style.cssText = "margin:0;border:0;padding:0;display:none",
                    g = 0 === i[0].offsetHeight,
                g && (i[0].style.display = "",
                    i[1].style.display = "none",
                    g = 0 === i[0].offsetHeight),
                    c.removeChild(d))
            }
        }
    }(),
        m.swap = function(a, b, c, d) {
            var e, f, g = {};
            for (f in b)
                g[f] = a.style[f],
                    a.style[f] = b[f];
            e = c.apply(a, d || []);
            for (f in b)
                a.style[f] = g[f];
            return e
        }
    ;
    var Mb = /alpha\([^)]*\)/i
        , Nb = /opacity\s*=\s*([^)]*)/
        , Ob = /^(none|table(?!-c[ea]).+)/
        , Pb = new RegExp("^(" + S + ")(.*)$","i")
        , Qb = new RegExp("^([+-])=(" + S + ")","i")
        , Rb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
        , Sb = {
        letterSpacing: "0",
        fontWeight: "400"
    }
        , Tb = ["Webkit", "O", "Moz", "ms"];
    function Ub(a, b) {
        if (b in a)
            return b;
        var c = b.charAt(0).toUpperCase() + b.slice(1)
            , d = b
            , e = Tb.length;
        while (e--)
            if (b = Tb[e] + c,
            b in a)
                return b;
        return d
    }
    function Vb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
            d = a[g],
            d.style && (f[g] = m._data(d, "olddisplay"),
                c = d.style.display,
                b ? (f[g] || "none" !== c || (d.style.display = ""),
                "" === d.style.display && U(d) && (f[g] = m._data(d, "olddisplay", Fb(d.nodeName)))) : (e = U(d),
                (c && "none" !== c || !e) && m._data(d, "olddisplay", e ? c : m.css(d, "display"))));
        for (g = 0; h > g; g++)
            d = a[g],
            d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }
    function Wb(a, b, c) {
        var d = Pb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }
    function Xb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
            "margin" === c && (g += m.css(a, c + T[f], !0, e)),
                d ? ("content" === c && (g -= m.css(a, "padding" + T[f], !0, e)),
                "margin" !== c && (g -= m.css(a, "border" + T[f] + "Width", !0, e))) : (g += m.css(a, "padding" + T[f], !0, e),
                "padding" !== c && (g += m.css(a, "border" + T[f] + "Width", !0, e)));
        return g
    }
    function Yb(a, b, c) {
        var d = !0
            , e = "width" === b ? a.offsetWidth : a.offsetHeight
            , f = Ib(a)
            , g = k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Jb(a, b, f),
            (0 > e || null == e) && (e = a.style[b]),
                Hb.test(e))
                return e;
            d = g && (k.boxSizingReliable() || e === a.style[b]),
                e = parseFloat(e) || 0
        }
        return e + Xb(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    m.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Jb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": k.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = m.camelCase(b), i = a.style;
                if (b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h)),
                    g = m.cssHooks[b] || m.cssHooks[h],
                void 0 === c)
                    return g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c,
                "string" === f && (e = Qb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b)),
                    f = "number"),
                null != c && c === c && ("number" !== f || m.cssNumber[h] || (c += "px"),
                k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                    !(g && "set"in g && void 0 === (c = g.set(a, c, d)))))
                    try {
                        i[b] = c
                    } catch (j) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = m.camelCase(b);
            return b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h)),
                g = m.cssHooks[b] || m.cssHooks[h],
            g && "get"in g && (f = g.get(a, !0, c)),
            void 0 === f && (f = Jb(a, b, d)),
            "normal" === f && b in Sb && (f = Sb[b]),
                "" === c || c ? (e = parseFloat(f),
                    c === !0 || m.isNumeric(e) ? e || 0 : f) : f
        }
    }),
        m.each(["height", "width"], function(a, b) {
            m.cssHooks[b] = {
                get: function(a, c, d) {
                    return c ? Ob.test(m.css(a, "display")) && 0 === a.offsetWidth ? m.swap(a, Rb, function() {
                        return Yb(a, b, d)
                    }) : Yb(a, b, d) : void 0
                },
                set: function(a, c, d) {
                    var e = d && Ib(a);
                    return Wb(a, c, d ? Xb(a, b, d, k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, e), e) : 0)
                }
            }
        }),
    k.opacity || (m.cssHooks.opacity = {
        get: function(a, b) {
            return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style
                , d = a.currentStyle
                , e = m.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : ""
                , f = d && d.filter || c.filter || "";
            c.zoom = 1,
            (b >= 1 || "" === b) && "" === m.trim(f.replace(Mb, "")) && c.removeAttribute && (c.removeAttribute("filter"),
            "" === b || d && !d.filter) || (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + " " + e)
        }
    }),
        m.cssHooks.marginRight = Lb(k.reliableMarginRight, function(a, b) {
            return b ? m.swap(a, {
                display: "inline-block"
            }, Jb, [a, "marginRight"]) : void 0
        }),
        m.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(a, b) {
            m.cssHooks[a + b] = {
                expand: function(c) {
                    for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
                        e[a + T[d] + b] = f[d] || f[d - 2] || f[0];
                    return e
                }
            },
            Gb.test(a) || (m.cssHooks[a + b].set = Wb)
        }),
        m.fn.extend({
            css: function(a, b) {
                return V(this, function(a, b, c) {
                    var d, e, f = {}, g = 0;
                    if (m.isArray(b)) {
                        for (d = Ib(a),
                                 e = b.length; e > g; g++)
                            f[b[g]] = m.css(a, b[g], !1, d);
                        return f
                    }
                    return void 0 !== c ? m.style(a, b, c) : m.css(a, b)
                }, a, b, arguments.length > 1)
            },
            show: function() {
                return Vb(this, !0)
            },
            hide: function() {
                return Vb(this)
            },
            toggle: function(a) {
                return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                    U(this) ? m(this).show() : m(this).hide()
                })
            }
        });
    function Zb(a, b, c, d, e) {
        return new Zb.prototype.init(a,b,c,d,e)
    }
    m.Tween = Zb,
        Zb.prototype = {
            constructor: Zb,
            init: function(a, b, c, d, e, f) {
                this.elem = a,
                    this.prop = c,
                    this.easing = e || "swing",
                    this.options = b,
                    this.start = this.now = this.cur(),
                    this.end = d,
                    this.unit = f || (m.cssNumber[c] ? "" : "px")
            },
            cur: function() {
                var a = Zb.propHooks[this.prop];
                return a && a.get ? a.get(this) : Zb.propHooks._default.get(this)
            },
            run: function(a) {
                var b, c = Zb.propHooks[this.prop];
                return this.pos = b = this.options.duration ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a,
                    this.now = (this.end - this.start) * b + this.start,
                this.options.step && this.options.step.call(this.elem, this.now, this),
                    c && c.set ? c.set(this) : Zb.propHooks._default.set(this),
                    this
            }
        },
        Zb.prototype.init.prototype = Zb.prototype,
        Zb.propHooks = {
            _default: {
                get: function(a) {
                    var b;
                    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = m.css(a.elem, a.prop, ""),
                        b && "auto" !== b ? b : 0) : a.elem[a.prop]
                },
                set: function(a) {
                    m.fx.step[a.prop] ? m.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop]) ? m.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                }
            }
        },
        Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {
            set: function(a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
            }
        },
        m.easing = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2
            }
        },
        m.fx = Zb.prototype.init,
        m.fx.step = {};
    var $b, _b, ac = /^(?:toggle|show|hide)$/, bc = new RegExp("^(?:([+-])=|)(" + S + ")([a-z%]*)$","i"), cc = /queueHooks$/, dc = [ic], ec = {
        "*": [function(a, b) {
            var c = this.createTween(a, b)
                , d = c.cur()
                , e = bc.exec(b)
                , f = e && e[3] || (m.cssNumber[a] ? "" : "px")
                , g = (m.cssNumber[a] || "px" !== f && +d) && bc.exec(m.css(c.elem, a))
                , h = 1
                , i = 20;
            if (g && g[3] !== f) {
                f = f || g[3],
                    e = e || [],
                    g = +d || 1;
                do
                    h = h || ".5",
                        g /= h,
                        m.style(c.elem, a, g + f);
                while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0,
                c.unit = f,
                c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]),
                c
        }
        ]
    };
    function fc() {
        return setTimeout(function() {
            $b = void 0
        }),
            $b = m.now()
    }
    function gc(a, b) {
        var c, d = {
            height: a
        }, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b)
            c = T[e],
                d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a),
            d
    }
    function hc(a, b, c) {
        for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function ic(a, b, c) {
        var d, e, f, g, h, i, j, l, n = this, o = {}, p = a.style, q = a.nodeType && U(a), r = m._data(a, "fxshow");
        c.queue || (h = m._queueHooks(a, "fx"),
        null == h.unqueued && (h.unqueued = 0,
                i = h.empty.fire,
                h.empty.fire = function() {
                    h.unqueued || i()
                }
        ),
            h.unqueued++,
            n.always(function() {
                n.always(function() {
                    h.unqueued--,
                    m.queue(a, "fx").length || h.empty.fire()
                })
            })),
        1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY],
            j = m.css(a, "display"),
            l = "none" === j ? m._data(a, "olddisplay") || Fb(a.nodeName) : j,
        "inline" === l && "none" === m.css(a, "float") && (k.inlineBlockNeedsLayout && "inline" !== Fb(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")),
        c.overflow && (p.overflow = "hidden",
        k.shrinkWrapBlocks() || n.always(function() {
            p.overflow = c.overflow[0],
                p.overflowX = c.overflow[1],
                p.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d],
                ac.exec(e)) {
                if (delete b[d],
                    f = f || "toggle" === e,
                e === (q ? "hide" : "show")) {
                    if ("show" !== e || !r || void 0 === r[d])
                        continue;
                    q = !0
                }
                o[d] = r && r[d] || m.style(a, d)
            } else
                j = void 0;
        if (m.isEmptyObject(o))
            "inline" === ("none" === j ? Fb(a.nodeName) : j) && (p.display = j);
        else {
            r ? "hidden"in r && (q = r.hidden) : r = m._data(a, "fxshow", {}),
            f && (r.hidden = !q),
                q ? m(a).show() : n.done(function() {
                    m(a).hide()
                }),
                n.done(function() {
                    var b;
                    m._removeData(a, "fxshow");
                    for (b in o)
                        m.style(a, b, o[b])
                });
            for (d in o)
                g = hc(q ? r[d] : 0, d, n),
                d in r || (r[d] = g.start,
                q && (g.end = g.start,
                    g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }
    function jc(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = m.camelCase(c),
                e = b[d],
                f = a[c],
            m.isArray(f) && (e = f[1],
                f = a[c] = f[0]),
            c !== d && (a[d] = f,
                delete a[c]),
                g = m.cssHooks[d],
            g && "expand"in g) {
                f = g.expand(f),
                    delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c],
                        b[c] = e)
            } else
                b[d] = e
    }
    function kc(a, b, c) {
        var d, e, f = 0, g = dc.length, h = m.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            if (e)
                return !1;
            for (var b = $b || fc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
                j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]),
                1 > f && i ? c : (h.resolveWith(a, [j]),
                    !1)
        }, j = h.promise({
            elem: a,
            props: m.extend({}, b),
            opts: m.extend(!0, {
                specialEasing: {}
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: $b || fc(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d),
                    d
            },
            stop: function(b) {
                var c = 0
                    , d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; d > c; c++)
                    j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]),
                    this
            }
        }), k = j.props;
        for (jc(k, j.opts.specialEasing); g > f; f++)
            if (d = dc[f].call(j, a, k, j.opts))
                return d;
        return m.map(k, hc, j),
        m.isFunction(j.opts.start) && j.opts.start.call(a, j),
            m.fx.timer(m.extend(i, {
                elem: a,
                anim: j,
                queue: j.opts.queue
            })),
            j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    m.Animation = m.extend(kc, {
        tweener: function(a, b) {
            m.isFunction(a) ? (b = a,
                a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++)
                c = a[d],
                    ec[c] = ec[c] || [],
                    ec[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? dc.unshift(a) : dc.push(a)
        }
    }),
        m.speed = function(a, b, c) {
            var d = a && "object" == typeof a ? m.extend({}, a) : {
                complete: c || !c && b || m.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !m.isFunction(b) && b
            };
            return d.duration = m.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default,
            (null == d.queue || d.queue === !0) && (d.queue = "fx"),
                d.old = d.complete,
                d.complete = function() {
                    m.isFunction(d.old) && d.old.call(this),
                    d.queue && m.dequeue(this, d.queue)
                }
                ,
                d
        }
        ,
        m.fn.extend({
            fadeTo: function(a, b, c, d) {
                return this.filter(U).css("opacity", 0).show().end().animate({
                    opacity: b
                }, a, c, d)
            },
            animate: function(a, b, c, d) {
                var e = m.isEmptyObject(a)
                    , f = m.speed(b, c, d)
                    , g = function() {
                    var b = kc(this, m.extend({}, a), f);
                    (e || m._data(this, "finish")) && b.stop(!0)
                };
                return g.finish = g,
                    e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
            },
            stop: function(a, b, c) {
                var d = function(a) {
                    var b = a.stop;
                    delete a.stop,
                        b(c)
                };
                return "string" != typeof a && (c = b,
                    b = a,
                    a = void 0),
                b && a !== !1 && this.queue(a || "fx", []),
                    this.each(function() {
                        var b = !0
                            , e = null != a && a + "queueHooks"
                            , f = m.timers
                            , g = m._data(this);
                        if (e)
                            g[e] && g[e].stop && d(g[e]);
                        else
                            for (e in g)
                                g[e] && g[e].stop && cc.test(e) && d(g[e]);
                        for (e = f.length; e--; )
                            f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
                                b = !1,
                                f.splice(e, 1));
                        (b || !c) && m.dequeue(this, a)
                    })
            },
            finish: function(a) {
                return a !== !1 && (a = a || "fx"),
                    this.each(function() {
                        var b, c = m._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = m.timers, g = d ? d.length : 0;
                        for (c.finish = !0,
                                 m.queue(this, a, []),
                             e && e.stop && e.stop.call(this, !0),
                                 b = f.length; b--; )
                            f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
                                f.splice(b, 1));
                        for (b = 0; g > b; b++)
                            d[b] && d[b].finish && d[b].finish.call(this);
                        delete c.finish
                    })
            }
        }),
        m.each(["toggle", "show", "hide"], function(a, b) {
            var c = m.fn[b];
            m.fn[b] = function(a, d, e) {
                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gc(b, !0), a, d, e)
            }
        }),
        m.each({
            slideDown: gc("show"),
            slideUp: gc("hide"),
            slideToggle: gc("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(a, b) {
            m.fn[a] = function(a, c, d) {
                return this.animate(b, a, c, d)
            }
        }),
        m.timers = [],
        m.fx.tick = function() {
            var a, b = m.timers, c = 0;
            for ($b = m.now(); c < b.length; c++)
                a = b[c],
                a() || b[c] !== a || b.splice(c--, 1);
            b.length || m.fx.stop(),
                $b = void 0
        }
        ,
        m.fx.timer = function(a) {
            m.timers.push(a),
                a() ? m.fx.start() : m.timers.pop()
        }
        ,
        m.fx.interval = 13,
        m.fx.start = function() {
            _b || (_b = setInterval(m.fx.tick, m.fx.interval))
        }
        ,
        m.fx.stop = function() {
            clearInterval(_b),
                _b = null
        }
        ,
        m.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        m.fn.delay = function(a, b) {
            return a = m.fx ? m.fx.speeds[a] || a : a,
                b = b || "fx",
                this.queue(b, function(b, c) {
                    var d = setTimeout(b, a);
                    c.stop = function() {
                        clearTimeout(d)
                    }
                })
        }
        ,
        function() {
            var a, b, c, d, e;
            b = y.createElement("div"),
                b.setAttribute("className", "t"),
                b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
                d = b.getElementsByTagName("a")[0],
                c = y.createElement("select"),
                e = c.appendChild(y.createElement("option")),
                a = b.getElementsByTagName("input")[0],
                d.style.cssText = "top:1px",
                k.getSetAttribute = "t" !== b.className,
                k.style = /top/.test(d.getAttribute("style")),
                k.hrefNormalized = "/a" === d.getAttribute("href"),
                k.checkOn = !!a.value,
                k.optSelected = e.selected,
                k.enctype = !!y.createElement("form").enctype,
                c.disabled = !0,
                k.optDisabled = !e.disabled,
                a = y.createElement("input"),
                a.setAttribute("value", ""),
                k.input = "" === a.getAttribute("value"),
                a.value = "t",
                a.setAttribute("type", "radio"),
                k.radioValue = "t" === a.value
        }();
    var lc = /\r/g;
    m.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            {
                if (arguments.length)
                    return d = m.isFunction(a),
                        this.each(function(c) {
                            var e;
                            1 === this.nodeType && (e = d ? a.call(this, c, m(this).val()) : a,
                                null == e ? e = "" : "number" == typeof e ? e += "" : m.isArray(e) && (e = m.map(e, function(a) {
                                    return null == a ? "" : a + ""
                                })),
                                b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()],
                            b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                        });
                if (e)
                    return b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()],
                        b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
                            "string" == typeof c ? c.replace(lc, "") : null == c ? "" : c)
            }
        }
    }),
        m.extend({
            valHooks: {
                option: {
                    get: function(a) {
                        var b = m.find.attr(a, "value");
                        return null != b ? b : m.trim(m.text(a))
                    }
                },
                select: {
                    get: function(a) {
                        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                            if (c = d[i],
                                !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && m.nodeName(c.parentNode, "optgroup"))) {
                                if (b = m(c).val(),
                                    f)
                                    return b;
                                g.push(b)
                            }
                        return g
                    },
                    set: function(a, b) {
                        var c, d, e = a.options, f = m.makeArray(b), g = e.length;
                        while (g--)
                            if (d = e[g],
                            m.inArray(m.valHooks.option.get(d), f) >= 0)
                                try {
                                    d.selected = c = !0
                                } catch (h) {
                                    d.scrollHeight
                                }
                            else
                                d.selected = !1;
                        return c || (a.selectedIndex = -1),
                            e
                    }
                }
            }
        }),
        m.each(["radio", "checkbox"], function() {
            m.valHooks[this] = {
                set: function(a, b) {
                    return m.isArray(b) ? a.checked = m.inArray(m(a).val(), b) >= 0 : void 0
                }
            },
            k.checkOn || (m.valHooks[this].get = function(a) {
                    return null === a.getAttribute("value") ? "on" : a.value
                }
            )
        });
    var mc, nc, oc = m.expr.attrHandle, pc = /^(?:checked|selected)$/i, qc = k.getSetAttribute, rc = k.input;
    m.fn.extend({
        attr: function(a, b) {
            return V(this, m.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                m.removeAttr(this, a)
            })
        }
    }),
        m.extend({
            attr: function(a, b, c) {
                var d, e, f = a.nodeType;
                if (a && 3 !== f && 8 !== f && 2 !== f)
                    return typeof a.getAttribute === K ? m.prop(a, b, c) : (1 === f && m.isXMLDoc(a) || (b = b.toLowerCase(),
                        d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc)),
                        void 0 === c ? d && "get"in d && null !== (e = d.get(a, b)) ? e : (e = m.find.attr(a, b),
                            null == e ? void 0 : e) : null !== c ? d && "set"in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""),
                            c) : void m.removeAttr(a, b))
            },
            removeAttr: function(a, b) {
                var c, d, e = 0, f = b && b.match(E);
                if (f && 1 === a.nodeType)
                    while (c = f[e++])
                        d = m.propFix[c] || c,
                            m.expr.match.bool.test(c) ? rc && qc || !pc.test(c) ? a[d] = !1 : a[m.camelCase("default-" + c)] = a[d] = !1 : m.attr(a, c, ""),
                            a.removeAttribute(qc ? c : d)
            },
            attrHooks: {
                type: {
                    set: function(a, b) {
                        if (!k.radioValue && "radio" === b && m.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b),
                            c && (a.value = c),
                                b
                        }
                    }
                }
            }
        }),
        nc = {
            set: function(a, b, c) {
                return b === !1 ? m.removeAttr(a, c) : rc && qc || !pc.test(c) ? a.setAttribute(!qc && m.propFix[c] || c, c) : a[m.camelCase("default-" + c)] = a[c] = !0,
                    c
            }
        },
        m.each(m.expr.match.bool.source.match(/\w+/g), function(a, b) {
            var c = oc[b] || m.find.attr;
            oc[b] = rc && qc || !pc.test(b) ? function(a, b, d) {
                    var e, f;
                    return d || (f = oc[b],
                        oc[b] = e,
                        e = null != c(a, b, d) ? b.toLowerCase() : null,
                        oc[b] = f),
                        e
                }
                : function(a, b, c) {
                    return c ? void 0 : a[m.camelCase("default-" + b)] ? b.toLowerCase() : null
                }
        }),
    rc && qc || (m.attrHooks.value = {
        set: function(a, b, c) {
            return m.nodeName(a, "input") ? void (a.defaultValue = b) : mc && mc.set(a, b, c)
        }
    }),
    qc || (mc = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)),
                d.value = b += "",
                "value" === c || b === a.getAttribute(c) ? b : void 0
        }
    },
        oc.id = oc.name = oc.coords = function(a, b, c) {
            var d;
            return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
        }
        ,
        m.valHooks.button = {
            get: function(a, b) {
                var c = a.getAttributeNode(b);
                return c && c.specified ? c.value : void 0
            },
            set: mc.set
        },
        m.attrHooks.contenteditable = {
            set: function(a, b, c) {
                mc.set(a, "" === b ? !1 : b, c)
            }
        },
        m.each(["width", "height"], function(a, b) {
            m.attrHooks[b] = {
                set: function(a, c) {
                    return "" === c ? (a.setAttribute(b, "auto"),
                        c) : void 0
                }
            }
        })),
    k.style || (m.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a, b) {
            return a.style.cssText = b + ""
        }
    });
    var sc = /^(?:input|select|textarea|button|object)$/i
        , tc = /^(?:a|area)$/i;
    m.fn.extend({
        prop: function(a, b) {
            return V(this, m.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = m.propFix[a] || a,
                this.each(function() {
                    try {
                        this[a] = void 0,
                            delete this[a]
                    } catch (b) {}
                })
        }
    }),
        m.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(a, b, c) {
                var d, e, f, g = a.nodeType;
                if (a && 3 !== g && 8 !== g && 2 !== g)
                    return f = 1 !== g || !m.isXMLDoc(a),
                    f && (b = m.propFix[b] || b,
                        e = m.propHooks[b]),
                        void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
            },
            propHooks: {
                tabIndex: {
                    get: function(a) {
                        var b = m.find.attr(a, "tabindex");
                        return b ? parseInt(b, 10) : sc.test(a.nodeName) || tc.test(a.nodeName) && a.href ? 0 : -1
                    }
                }
            }
        }),
    k.hrefNormalized || m.each(["href", "src"], function(a, b) {
        m.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    }),
    k.optSelected || (m.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex),
                null
        }
    }),
        m.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            m.propFix[this.toLowerCase()] = this
        }),
    k.enctype || (m.propFix.enctype = "encoding");
    var uc = /[\t\r\n\f]/g;
    m.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
            if (m.isFunction(a))
                return this.each(function(b) {
                    m(this).addClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(E) || []; i > h; h++)
                    if (c = this[h],
                        d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : " ")) {
                        f = 0;
                        while (e = b[f++])
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = m.trim(d),
                        c.className !== g && (c.className = g)
                    }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
            if (m.isFunction(a))
                return this.each(function(b) {
                    m(this).removeClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(E) || []; i > h; h++)
                    if (c = this[h],
                        d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : "")) {
                        f = 0;
                        while (e = b[f++])
                            while (d.indexOf(" " + e + " ") >= 0)
                                d = d.replace(" " + e + " ", " ");
                        g = a ? m.trim(d) : "",
                        c.className !== g && (c.className = g)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(m.isFunction(a) ? function(c) {
                        m(this).toggleClass(a.call(this, c, this.className, b), b)
                    }
                    : function() {
                        if ("string" === c) {
                            var b, d = 0, e = m(this), f = a.match(E) || [];
                            while (b = f[d++])
                                e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                        } else
                            (c === K || "boolean" === c) && (this.className && m._data(this, "__className__", this.className),
                                this.className = this.className || a === !1 ? "" : m._data(this, "__className__") || "")
                    }
            )
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(uc, " ").indexOf(b) >= 0)
                    return !0;
            return !1
        }
    }),
        m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            m.fn[b] = function(a, c) {
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }
        }),
        m.fn.extend({
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
            }
        });
    var vc = m.now()
        , wc = /\?/
        , xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    m.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse)
            return a.JSON.parse(b + "");
        var c, d = null, e = m.trim(b + "");
        return e && !m.trim(e.replace(xc, function(a, b, e, f) {
            return c && b && (d = 0),
                0 === d ? a : (c = e || b,
                    d += !f - !e,
                    "")
        })) ? Function("return " + e)() : m.error("Invalid JSON: " + b)
    }
        ,
        m.parseXML = function(b) {
            var c, d;
            if (!b || "string" != typeof b)
                return null;
            try {
                a.DOMParser ? (d = new DOMParser,
                    c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"),
                    c.async = "false",
                    c.loadXML(b))
            } catch (e) {
                c = void 0
            }
            return c && c.documentElement && !c.getElementsByTagName("parsererror").length || m.error("Invalid XML: " + b),
                c
        }
    ;
    var yc, zc, Ac = /#.*$/, Bc = /([?&])_=[^&]*/, Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ec = /^(?:GET|HEAD)$/, Fc = /^\/\//, Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Hc = {}, Ic = {}, Jc = "*/".concat("*");
    try {
        zc = location.href
    } catch (Kc) {
        zc = y.createElement("a"),
            zc.href = "",
            zc = zc.href
    }
    yc = Gc.exec(zc.toLowerCase()) || [];
    function Lc(a) {
        return function(b, c) {
            "string" != typeof b && (c = b,
                b = "*");
            var d, e = 0, f = b.toLowerCase().match(E) || [];
            if (m.isFunction(c))
                while (d = f[e++])
                    "+" === d.charAt(0) ? (d = d.slice(1) || "*",
                        (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function Mc(a, b, c, d) {
        var e = {}
            , f = a === Ic;
        function g(h) {
            var i;
            return e[h] = !0,
                m.each(a[h] || [], function(a, h) {
                    var j = h(b, c, d);
                    return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
                        g(j),
                        !1)
                }),
                i
        }
        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }
    function Nc(a, b) {
        var c, d, e = m.ajaxSettings.flatOptions || {};
        for (d in b)
            void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && m.extend(!0, a, c),
            a
    }
    function Oc(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0])
            i.shift(),
            void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0]in c)
            f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f),
            c[f]) : void 0
    }
    function Pc(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b),
            !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
                i = f,
                f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f],
                        !g)
                        for (e in j)
                            if (h = e.split(" "),
                            h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
                                    k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a["throws"])
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (l) {
                                return {
                                    state: "parsererror",
                                    error: g ? l : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    m.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: zc,
            type: "GET",
            isLocal: Dc.test(yc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Jc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": m.parseJSON,
                "text xml": m.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a)
        },
        ajaxPrefilter: Lc(Hc),
        ajaxTransport: Lc(Ic),
        ajax: function(a, b) {
            "object" == typeof a && (b = a,
                a = void 0),
                b = b || {};
            var c, d, e, f, g, h, i, j, k = m.ajaxSetup({}, b), l = k.context || k, n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event, o = m.Deferred(), p = m.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === t) {
                        if (!j) {
                            j = {};
                            while (b = Cc.exec(f))
                                j[b[1].toLowerCase()] = b[2]
                        }
                        b = j[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === t ? f : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a,
                        r[a] = b),
                        this
                },
                overrideMimeType: function(a) {
                    return t || (k.mimeType = a),
                        this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (2 > t)
                            for (b in a)
                                q[b] = [q[b], a[b]];
                        else
                            v.always(a[v.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || u;
                    return i && i.abort(b),
                        x(0, b),
                        this
                }
            };
            if (o.promise(v).complete = p.add,
                v.success = v.done,
                v.error = v.fail,
                k.url = ((a || k.url || zc) + "").replace(Ac, "").replace(Fc, yc[1] + "//"),
                k.type = b.method || b.type || k.method || k.type,
                k.dataTypes = m.trim(k.dataType || "*").toLowerCase().match(E) || [""],
            null == k.crossDomain && (c = Gc.exec(k.url.toLowerCase()),
                k.crossDomain = !(!c || c[1] === yc[1] && c[2] === yc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (yc[3] || ("http:" === yc[1] ? "80" : "443")))),
            k.data && k.processData && "string" != typeof k.data && (k.data = m.param(k.data, k.traditional)),
                Mc(Hc, k, b, v),
            2 === t)
                return v;
            h = k.global,
            h && 0 === m.active++ && m.event.trigger("ajaxStart"),
                k.type = k.type.toUpperCase(),
                k.hasContent = !Ec.test(k.type),
                e = k.url,
            k.hasContent || (k.data && (e = k.url += (wc.test(e) ? "&" : "?") + k.data,
                delete k.data),
            k.cache === !1 && (k.url = Bc.test(e) ? e.replace(Bc, "$1_=" + vc++) : e + (wc.test(e) ? "&" : "?") + "_=" + vc++)),
            k.ifModified && (m.lastModified[e] && v.setRequestHeader("If-Modified-Since", m.lastModified[e]),
            m.etag[e] && v.setRequestHeader("If-None-Match", m.etag[e])),
            (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType),
                v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Jc + "; q=0.01" : "") : k.accepts["*"]);
            for (d in k.headers)
                v.setRequestHeader(d, k.headers[d]);
            if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t))
                return v.abort();
            u = "abort";
            for (d in {
                success: 1,
                error: 1,
                complete: 1
            })
                v[d](k[d]);
            if (i = Mc(Ic, k, b, v)) {
                v.readyState = 1,
                h && n.trigger("ajaxSend", [v, k]),
                k.async && k.timeout > 0 && (g = setTimeout(function() {
                    v.abort("timeout")
                }, k.timeout));
                try {
                    t = 1,
                        i.send(r, x)
                } catch (w) {
                    if (!(2 > t))
                        throw w;
                    x(-1, w)
                }
            } else
                x(-1, "No Transport");
            function x(a, b, c, d) {
                var j, r, s, u, w, x = b;
                2 !== t && (t = 2,
                g && clearTimeout(g),
                    i = void 0,
                    f = d || "",
                    v.readyState = a > 0 ? 4 : 0,
                    j = a >= 200 && 300 > a || 304 === a,
                c && (u = Oc(k, v, c)),
                    u = Pc(k, u, v, j),
                    j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"),
                    w && (m.lastModified[e] = w),
                        w = v.getResponseHeader("etag"),
                    w && (m.etag[e] = w)),
                        204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state,
                            r = u.data,
                            s = u.error,
                            j = !s)) : (s = x,
                    (a || !x) && (x = "error",
                    0 > a && (a = 0))),
                    v.status = a,
                    v.statusText = (b || x) + "",
                    j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]),
                    v.statusCode(q),
                    q = void 0,
                h && n.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]),
                    p.fireWith(l, [v, x]),
                h && (n.trigger("ajaxComplete", [v, k]),
                --m.active || m.event.trigger("ajaxStop")))
            }
            return v
        },
        getJSON: function(a, b, c) {
            return m.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return m.get(a, void 0, b, "script")
        }
    }),
        m.each(["get", "post"], function(a, b) {
            m[b] = function(a, c, d, e) {
                return m.isFunction(c) && (e = e || d,
                    d = c,
                    c = void 0),
                    m.ajax({
                        url: a,
                        type: b,
                        dataType: e,
                        data: c,
                        success: d
                    })
            }
        }),
        m.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
            m.fn[b] = function(a) {
                return this.on(b, a)
            }
        }),
        m._evalUrl = function(a) {
            return m.ajax({
                url: a,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }
        ,
        m.fn.extend({
            wrapAll: function(a) {
                if (m.isFunction(a))
                    return this.each(function(b) {
                        m(this).wrapAll(a.call(this, b))
                    });
                if (this[0]) {
                    var b = m(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]),
                        b.map(function() {
                            var a = this;
                            while (a.firstChild && 1 === a.firstChild.nodeType)
                                a = a.firstChild;
                            return a
                        }).append(this)
                }
                return this
            },
            wrapInner: function(a) {
                return this.each(m.isFunction(a) ? function(b) {
                            m(this).wrapInner(a.call(this, b))
                        }
                        : function() {
                            var b = m(this)
                                , c = b.contents();
                            c.length ? c.wrapAll(a) : b.append(a)
                        }
                )
            },
            wrap: function(a) {
                var b = m.isFunction(a);
                return this.each(function(c) {
                    m(this).wrapAll(b ? a.call(this, c) : a)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
                }).end()
            }
        }),
        m.expr.filters.hidden = function(a) {
            return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !k.reliableHiddenOffsets() && "none" === (a.style && a.style.display || m.css(a, "display"))
        }
        ,
        m.expr.filters.visible = function(a) {
            return !m.expr.filters.hidden(a)
        }
    ;
    var Qc = /%20/g
        , Rc = /\[\]$/
        , Sc = /\r?\n/g
        , Tc = /^(?:submit|button|image|reset|file)$/i
        , Uc = /^(?:input|select|textarea|keygen)/i;
    function Vc(a, b, c, d) {
        var e;
        if (m.isArray(b))
            m.each(b, function(b, e) {
                c || Rc.test(a) ? d(a, e) : Vc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== m.type(b))
            d(a, b);
        else
            for (e in b)
                Vc(a + "[" + e + "]", b[e], c, d)
    }
    m.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = m.isFunction(b) ? b() : null == b ? "" : b,
                d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional),
        m.isArray(a) || a.jquery && !m.isPlainObject(a))
            m.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                Vc(c, a[c], b, e);
        return d.join("&").replace(Qc, "+")
    }
        ,
        m.fn.extend({
            serialize: function() {
                return m.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var a = m.prop(this, "elements");
                    return a ? m.makeArray(a) : this
                }).filter(function() {
                    var a = this.type;
                    return this.name && !m(this).is(":disabled") && Uc.test(this.nodeName) && !Tc.test(a) && (this.checked || !W.test(a))
                }).map(function(a, b) {
                    var c = m(this).val();
                    return null == c ? null : m.isArray(c) ? m.map(c, function(a) {
                        return {
                            name: b.name,
                            value: a.replace(Sc, "\r\n")
                        }
                    }) : {
                        name: b.name,
                        value: c.replace(Sc, "\r\n")
                    }
                }).get()
            }
        }),
        m.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
                return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc() || $c()
            }
            : Zc;
    var Wc = 0
        , Xc = {}
        , Yc = m.ajaxSettings.xhr();
    a.ActiveXObject && m(a).on("unload", function() {
        for (var a in Xc)
            Xc[a](void 0, !0)
    }),
        k.cors = !!Yc && "withCredentials"in Yc,
        Yc = k.ajax = !!Yc,
    Yc && m.ajaxTransport(function(a) {
        if (!a.crossDomain || k.cors) {
            var b;
            return {
                send: function(c, d) {
                    var e, f = a.xhr(), g = ++Wc;
                    if (f.open(a.type, a.url, a.async, a.username, a.password),
                        a.xhrFields)
                        for (e in a.xhrFields)
                            f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
                    a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c)
                        void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null),
                        b = function(c, e) {
                            var h, i, j;
                            if (b && (e || 4 === f.readyState))
                                if (delete Xc[g],
                                    b = void 0,
                                    f.onreadystatechange = m.noop,
                                    e)
                                    4 !== f.readyState && f.abort();
                                else {
                                    j = {},
                                        h = f.status,
                                    "string" == typeof f.responseText && (j.text = f.responseText);
                                    try {
                                        i = f.statusText
                                    } catch (k) {
                                        i = ""
                                    }
                                    h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                                }
                            j && d(h, i, j, f.getAllResponseHeaders())
                        }
                        ,
                        a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Xc[g] = b : b()
                },
                abort: function() {
                    b && b(void 0, !0)
                }
            }
        }
    });
    function Zc() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }
    function $c() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }
    m.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return m.globalEval(a),
                    a
            }
        }
    }),
        m.ajaxPrefilter("script", function(a) {
            void 0 === a.cache && (a.cache = !1),
            a.crossDomain && (a.type = "GET",
                a.global = !1)
        }),
        m.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var b, c = y.head || m("head")[0] || y.documentElement;
                return {
                    send: function(d, e) {
                        b = y.createElement("script"),
                            b.async = !0,
                        a.scriptCharset && (b.charset = a.scriptCharset),
                            b.src = a.url,
                            b.onload = b.onreadystatechange = function(a, c) {
                                (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null,
                                b.parentNode && b.parentNode.removeChild(b),
                                    b = null,
                                c || e(200, "success"))
                            }
                            ,
                            c.insertBefore(b, c.firstChild)
                    },
                    abort: function() {
                        b && b.onload(void 0, !0)
                    }
                }
            }
        });
    var _c = []
        , ad = /(=)\?(?=&|$)|\?\?/;
    m.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = _c.pop() || m.expando + "_" + vc++;
            return this[a] = !0,
                a
        }
    }),
        m.ajaxPrefilter("json jsonp", function(b, c, d) {
            var e, f, g, h = b.jsonp !== !1 && (ad.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ad.test(b.data) && "data");
            return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = m.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                h ? b[h] = b[h].replace(ad, "$1" + e) : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
                b.converters["script json"] = function() {
                    return g || m.error(e + " was not called"),
                        g[0]
                }
                ,
                b.dataTypes[0] = "json",
                f = a[e],
                a[e] = function() {
                    g = arguments
                }
                ,
                d.always(function() {
                    a[e] = f,
                    b[e] && (b.jsonpCallback = c.jsonpCallback,
                        _c.push(e)),
                    g && m.isFunction(f) && f(g[0]),
                        g = f = void 0
                }),
                "script") : void 0
        }),
        m.parseHTML = function(a, b, c) {
            if (!a || "string" != typeof a)
                return null;
            "boolean" == typeof b && (c = b,
                b = !1),
                b = b || y;
            var d = u.exec(a)
                , e = !c && [];
            return d ? [b.createElement(d[1])] : (d = m.buildFragment([a], b, e),
            e && e.length && m(e).remove(),
                m.merge([], d.childNodes))
        }
    ;
    var bd = m.fn.load;
    m.fn.load = function(a, b, c) {
        if ("string" != typeof a && bd)
            return bd.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = m.trim(a.slice(h, a.length)),
            a = a.slice(0, h)),
            m.isFunction(b) ? (c = b,
                b = void 0) : b && "object" == typeof b && (f = "POST"),
        g.length > 0 && m.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments,
                g.html(d ? m("<div>").append(m.parseHTML(a)).find(d) : a)
        }).complete(c && function(a, b) {
            g.each(c, e || [a.responseText, b, a])
        }
        ),
            this
    }
        ,
        m.expr.filters.animated = function(a) {
            return m.grep(m.timers, function(b) {
                return a === b.elem
            }).length
        }
    ;
    var cd = a.document.documentElement;
    function dd(a) {
        return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    m.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = m.css(a, "position"), l = m(a), n = {};
            "static" === k && (a.style.position = "relative"),
                h = l.offset(),
                f = m.css(a, "top"),
                i = m.css(a, "left"),
                j = ("absolute" === k || "fixed" === k) && m.inArray("auto", [f, i]) > -1,
                j ? (d = l.position(),
                    g = d.top,
                    e = d.left) : (g = parseFloat(f) || 0,
                    e = parseFloat(i) || 0),
            m.isFunction(b) && (b = b.call(a, c, h)),
            null != b.top && (n.top = b.top - h.top + g),
            null != b.left && (n.left = b.left - h.left + e),
                "using"in b ? b.using.call(a, n) : l.css(n)
        }
    },
        m.fn.extend({
            offset: function(a) {
                if (arguments.length)
                    return void 0 === a ? this : this.each(function(b) {
                        m.offset.setOffset(this, a, b)
                    });
                var b, c, d = {
                    top: 0,
                    left: 0
                }, e = this[0], f = e && e.ownerDocument;
                if (f)
                    return b = f.documentElement,
                        m.contains(b, e) ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()),
                            c = dd(f),
                            {
                                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                            }) : d
            },
            position: function() {
                if (this[0]) {
                    var a, b, c = {
                        top: 0,
                        left: 0
                    }, d = this[0];
                    return "fixed" === m.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(),
                        b = this.offset(),
                    m.nodeName(a[0], "html") || (c = a.offset()),
                        c.top += m.css(a[0], "borderTopWidth", !0),
                        c.left += m.css(a[0], "borderLeftWidth", !0)),
                        {
                            top: b.top - c.top - m.css(d, "marginTop", !0),
                            left: b.left - c.left - m.css(d, "marginLeft", !0)
                        }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    var a = this.offsetParent || cd;
                    while (a && !m.nodeName(a, "html") && "static" === m.css(a, "position"))
                        a = a.offsetParent;
                    return a || cd
                })
            }
        }),
        m.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(a, b) {
            var c = /Y/.test(b);
            m.fn[a] = function(d) {
                return V(this, function(a, d, e) {
                    var f = dd(a);
                    return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop()) : a[d] = e)
                }, a, d, arguments.length, null)
            }
        }),
        m.each(["top", "left"], function(a, b) {
            m.cssHooks[b] = Lb(k.pixelPosition, function(a, c) {
                return c ? (c = Jb(a, b),
                    Hb.test(c) ? m(a).position()[b] + "px" : c) : void 0
            })
        }),
        m.each({
            Height: "height",
            Width: "width"
        }, function(a, b) {
            m.each({
                padding: "inner" + a,
                content: b,
                "": "outer" + a
            }, function(c, d) {
                m.fn[d] = function(d, e) {
                    var f = arguments.length && (c || "boolean" != typeof d)
                        , g = c || (d === !0 || e === !0 ? "margin" : "border");
                    return V(this, function(b, c, d) {
                        var e;
                        return m.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement,
                            Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g)
                    }, b, f ? d : void 0, f, null)
                }
            })
        }),
        m.fn.size = function() {
            return this.length
        }
        ,
        m.fn.andSelf = m.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return m
    });
    var ed = a.jQuery
        , fd = a.$;
    return m.noConflict = function(b) {
        return a.$ === m && (a.$ = fd),
        b && a.jQuery === m && (a.jQuery = ed),
            m
    }
        ,
    typeof b === K && (a.jQuery = a.$ = m),
        m
});

// Copyright 2012 Google Inc. All rights reserved.

(function() {

        var data = {
            "resource": {
                "version": "1",

                "macros": [{
                    "function": "__e"
                }, {
                    "function": "__c",
                    "vtp_value": "google.it"
                }, {
                    "function": "__c",
                    "vtp_value": 0
                }, {
                    "vtp_signal": 0,
                    "function": "__c",
                    "vtp_value": 0
                }],
                "tags": [{
                    "function": "__gct",
                    "vtp_trackingId": "G-F1RTS0P1CD",
                    "vtp_sessionDuration": 0,
                    "tag_id": 1
                }, {
                    "function": "__ccd_conversion_marking",
                    "vtp_conversionRules": ["list", ["map", "matchingRules", "{\"type\":5,\"args\":[{\"stringValue\":\"purchase\"},{\"contextValue\":{\"namespaceType\":1,\"keyParts\":[\"eventName\"]}}]}"]],
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 3
                }, {
                    "function": "__ccd_em_download",
                    "vtp_includeParams": true,
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 5
                }, {
                    "function": "__ccd_em_outbound_click",
                    "priority": 0,
                    "vtp_includeParams": true,
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 6
                }, {
                    "function": "__ccd_em_page_view",
                    "vtp_historyEvents": true,
                    "vtp_includeParams": true,
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 7
                }, {
                    "function": "__ccd_em_scroll",
                    "vtp_includeParams": true,
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 8
                }, {
                    "function": "__ccd_em_site_search",
                    "vtp_searchQueryParams": "q,s,search,query,keyword",
                    "vtp_includeParams": true,
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 9
                }, {
                    "function": "__ccd_em_video",
                    "vtp_includeParams": true,
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 10
                }, {
                    "function": "__ccd_ga_regscope",
                    "vtp_settingsTable": ["list", ["map", "redactFieldGroup", "DEVICE_AND_GEO", "disallowAllRegions", false, "disallowedRegions", ""], ["map", "redactFieldGroup", "GOOGLE_SIGNALS", "disallowAllRegions", true, "disallowedRegions", ""]],
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "tag_id": 11
                }, {
                    "function": "__set_product_settings",
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "vtp_foreignTldMacroResult": ["macro", 1],
                    "vtp_isChinaVipRegionMacroResult": ["macro", 2],
                    "tag_id": 12
                }, {
                    "function": "__ogt_google_signals",
                    "vtp_googleSignals": "DISABLED",
                    "vtp_instanceDestinationId": "G-F1RTS0P1CD",
                    "vtp_serverMacroResult": ["macro", 3],
                    "tag_id": 13
                }],
                "predicates": [{
                    "function": "_eq",
                    "arg0": ["macro", 0],
                    "arg1": "gtm.js"
                }, {
                    "function": "_eq",
                    "arg0": ["macro", 0],
                    "arg1": "gtm.init"
                }],
                "rules": [[["if", 0], ["add", 0]], [["if", 1], ["add", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]]
            },
            "runtime": [[50, "__ccd_conversion_marking", [46, "a"], [22, [30, [28, [17, [15, "a"], "conversionRules"]], [20, [17, [17, [15, "a"], "conversionRules"], "length"], 0]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "b", ["require", "internal.copyPreHit"]], [52, "c", ["require", "internal.evaluateBooleanExpression"]], [52, "d", ["require", "internal.registerCcdCallback"]], [52, "e", "is_conversion"], [52, "f", "is_first_visit"], [52, "g", "is_first_visit_conversion"], [52, "h", "is_session_start"], [52, "i", "is_session_start_conversion"], [52, "j", "first_visit"], [52, "k", "session_start"], [41, "l"], [41, "m"], ["d", [17, [15, "a"], "instanceDestinationId"], [51, "", [7, "n"], [52, "o", [8, "preHit", [15, "n"]]], [65, "p", [17, [15, "a"], "conversionRules"], [46, [22, ["c", [17, [15, "p"], "matchingRules"], [15, "o"]], [46, [2, [15, "n"], "setMetadata", [7, [15, "e"], true]], [4]]]]], [22, [2, [15, "n"], "getMetadata", [7, [15, "f"]]], [46, [22, [28, [15, "l"]], [46, [53, [52, "p", ["b", [15, "n"], [8, "omitHitData", true, "omitMetadata", true]]], [2, [15, "p"], "setEventName", [7, [15, "j"]]], [3, "l", [8, "preHit", [15, "p"]]]]]], [65, "p", [17, [15, "a"], "conversionRules"], [46, [22, ["c", [17, [15, "p"], "matchingRules"], [15, "l"]], [46, [2, [15, "n"], "setMetadata", [7, [15, "g"], true]], [4]]]]]]], [22, [2, [15, "n"], "getMetadata", [7, [15, "h"]]], [46, [22, [28, [15, "m"]], [46, [53, [52, "p", ["b", [15, "n"], [8, "omitHitData", true, "omitMetadata", true]]], [2, [15, "p"], "setEventName", [7, [15, "k"]]], [3, "m", [8, "preHit", [15, "p"]]]]]], [65, "p", [17, [15, "a"], "conversionRules"], [46, [22, ["c", [17, [15, "p"], "matchingRules"], [15, "m"]], [46, [2, [15, "n"], "setMetadata", [7, [15, "i"], true]], [4]]]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]], [36]], [50, "__ccd_em_download", [46, "a"], [50, "r", [46, "x"], [36, [1, [15, "x"], [21, [2, [2, [15, "x"], "toLowerCase", [7]], "match", [7, [15, "q"]]], [45]]]]], [50, "s", [46, "x"], [52, "y", [2, [17, [15, "x"], "pathname"], "split", [7, "."]]], [52, "z", [39, [18, [17, [15, "y"], "length"], 1], [16, [15, "y"], [37, [17, [15, "y"], "length"], 1]], ""]], [36, [16, [2, [15, "z"], "split", [7, "/"]], 0]]], [50, "t", [46, "x"], [36, [39, [12, [2, [17, [15, "x"], "pathname"], "substring", [7, 0, 1]], "/"], [17, [15, "x"], "pathname"], [0, "/", [17, [15, "x"], "pathname"]]]]], [50, "u", [46, "x"], [41, "y"], [3, "y", ""], [22, [1, [15, "x"], [17, [15, "x"], "href"]], [46, [53, [41, "z"], [3, "z", [2, [17, [15, "x"], "href"], "indexOf", [7, "#"]]], [3, "y", [39, [23, [15, "z"], 0], [17, [15, "x"], "href"], [2, [17, [15, "x"], "href"], "substring", [7, 0, [15, "z"]]]]]]]], [36, [15, "y"]]], [50, "w", [46, "x"], [52, "y", [8]], [43, [15, "y"], [15, "j"], true], [43, [15, "y"], [15, "f"], true], [43, [15, "x"], "eventMetadata", [15, "y"]]], [52, "b", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "c", ["require", "internal.getProductSettingsParameter"]], [52, "d", ["require", "templateStorage"]], [52, "e", [15, "__module_ccdEmDownloadActivity"]], [52, "f", "speculative"], [52, "g", "ae_block_downloads"], [52, "h", "file_download"], [52, "i", "isRegistered"], [52, "j", "em_event"], [52, "k", [17, [15, "a"], "instanceDestinationId"]], [22, ["c", [15, "k"], [15, "g"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [2, [15, "e"], "registerDownloadActivityCallback", [7, [15, "k"], [17, [15, "a"], "includeParams"]]], [22, [2, [15, "d"], "getItem", [7, [15, "i"]]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "l", ["require", "internal.addDataLayerEventListener"]], [52, "m", ["require", "internal.enableAutoEventOnLinkClick"]], [52, "n", ["require", "internal.getDestinationIds"]], [52, "o", ["require", "parseUrl"]], [52, "p", ["require", "internal.sendGtagEvent"]], [52, "q", [0, "^(pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|", "mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma)$"]], [52, "v", ["m", [8, "checkValidation", true]]], [22, [28, [15, "v"]], [46, [2, [15, "a"], "gtmOnFailure", [7]], [36]]], [2, [15, "d"], "setItem", [7, [15, "i"], true]], ["l", "gtm.linkClick", [51, "", [7, "x", "y"], ["y"], [52, "z", [8, "eventId", [16, [15, "x"], "gtm.uniqueEventId"]]], [22, [16, [15, "b"], "enableDeferAllEnhancedMeasurement"], [46, [43, [15, "z"], "deferrable", true]]], [52, "ba", [16, [15, "x"], "gtm.elementUrl"]], [52, "bb", ["o", [15, "ba"]]], [22, [28, [15, "bb"]], [46, [36]]], [52, "bc", ["s", [15, "bb"]]], [22, [28, ["r", [15, "bc"]]], [46, [36]]], [52, "bd", [8, "link_id", [16, [15, "x"], "gtm.elementId"], "link_url", ["u", [15, "bb"]], "link_text", [16, [15, "x"], "gtm.elementText"], "file_name", ["t", [15, "bb"]], "file_extension", [15, "bc"]]], ["w", [15, "z"]], ["p", ["n"], [15, "h"], [15, "bd"], [15, "z"]]], [15, "v"]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__ccd_em_outbound_click", [46, "a"], [50, "s", [46, "y"], [22, [28, [15, "y"]], [46, [36, [44]]]], [41, "z"], [3, "z", ""], [22, [1, [15, "y"], [17, [15, "y"], "href"]], [46, [53, [41, "ba"], [3, "ba", [2, [17, [15, "y"], "href"], "indexOf", [7, "#"]]], [3, "z", [39, [23, [15, "ba"], 0], [17, [15, "y"], "href"], [2, [17, [15, "y"], "href"], "substring", [7, 0, [15, "ba"]]]]]]]], [36, [15, "z"]]], [50, "t", [46, "y"], [22, [28, [15, "y"]], [46, [36, [44]]]], [41, "z"], [3, "z", [17, [15, "y"], "hostname"]], [52, "ba", [2, [15, "z"], "match", [7, "^www\\d*\\."]]], [22, [1, [15, "ba"], [16, [15, "ba"], 0]], [46, [3, "z", [2, [15, "z"], "substring", [7, [17, [16, [15, "ba"], 0], "length"]]]]]], [36, [15, "z"]]], [50, "u", [46, "y"], [22, [28, [15, "y"]], [46, [36, false]]], [52, "z", [2, [17, [15, "y"], "hostname"], "toLowerCase", [7]]], [41, "ba"], [3, "ba", [2, ["t", ["q", ["p"]]], "toLowerCase", [7]]], [41, "bb"], [3, "bb", [37, [17, [15, "z"], "length"], [17, [15, "ba"], "length"]]], [22, [1, [18, [15, "bb"], 0], [29, [2, [15, "ba"], "charAt", [7, 0]], "."]], [46, [32, [15, "bb"], [3, "bb", [37, [15, "bb"], 1]]], [3, "ba", [0, ".", [15, "ba"]]]]], [22, [1, [19, [15, "bb"], 0], [12, [2, [15, "z"], "indexOf", [7, [15, "ba"], [15, "bb"]]], [15, "bb"]]], [46, [36, false]]], [36, true]], [50, "x", [46, "y"], [52, "z", [8]], [43, [15, "z"], [15, "j"], true], [43, [15, "z"], [15, "f"], true], [43, [15, "y"], "eventMetadata", [15, "z"]]], [52, "b", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "c", ["require", "internal.getProductSettingsParameter"]], [52, "d", ["require", "templateStorage"]], [52, "e", [15, "__module_ccdEmOutboundClickActivity"]], [52, "f", "speculative"], [52, "g", "ae_block_outbound_click"], [52, "h", "click"], [52, "i", "isRegistered"], [52, "j", "em_event"], [52, "k", [17, [15, "a"], "instanceDestinationId"]], [22, ["c", [15, "k"], [15, "g"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [2, [15, "e"], "registerOutbackClickActivityCallback", [7, [15, "k"], [17, [15, "a"], "includeParams"]]], [22, [2, [15, "d"], "getItem", [7, [15, "i"]]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "l", ["require", "internal.addDataLayerEventListener"]], [52, "m", ["require", "internal.enableAutoEventOnLinkClick"]], [52, "n", ["require", "internal.getDestinationIds"]], [52, "o", ["require", "internal.getRemoteConfigParameter"]], [52, "p", ["require", "getUrl"]], [52, "q", ["require", "parseUrl"]], [52, "r", ["require", "internal.sendGtagEvent"]], [52, "v", ["o", [15, "k"], "cross_domain_conditions"]], [52, "w", ["m", [8, "affiliateDomains", [15, "v"], "checkValidation", true, "waitForTags", false]]], [22, [28, [15, "w"]], [46, [2, [15, "a"], "gtmOnFailure", [7]], [36]]], [2, [15, "d"], "setItem", [7, [15, "i"], true]], ["l", "gtm.linkClick", [51, "", [7, "y", "z"], [52, "ba", ["q", [16, [15, "y"], "gtm.elementUrl"]]], [22, [28, ["u", [15, "ba"]]], [46, ["z"], [36]]], [52, "bb", [8, "link_id", [16, [15, "y"], "gtm.elementId"], "link_classes", [16, [15, "y"], "gtm.elementClasses"], "link_url", ["s", [15, "ba"]], "link_domain", ["t", [15, "ba"]], "outbound", true]], [43, [15, "bb"], "event_callback", [15, "z"]], [52, "bc", [8, "eventId", [16, [15, "y"], "gtm.uniqueEventId"]]], [22, [16, [15, "b"], "enableDeferAllEnhancedMeasurement"], [46, [43, [15, "bc"], "deferrable", true]]], ["x", [15, "bc"]], ["r", ["n"], [15, "h"], [15, "bb"], [15, "bc"]]], [15, "w"]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__ccd_em_page_view", [46, "a"], [50, "s", [46, "t"], [52, "u", [8]], [43, [15, "u"], [15, "k"], true], [43, [15, "u"], [15, "g"], true], [43, [15, "t"], "eventMetadata", [15, "u"]]], [22, [28, [17, [15, "a"], "historyEvents"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "b", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "c", ["require", "internal.getProductSettingsParameter"]], [52, "d", ["require", "internal.setRemoteConfigParameter"]], [52, "e", ["require", "templateStorage"]], [52, "f", [15, "__module_ccdEmPageViewActivity"]], [52, "g", "speculative"], [52, "h", "ae_block_history"], [52, "i", "page_view"], [52, "j", "isRegistered"], [52, "k", "em_event"], [52, "l", [17, [15, "a"], "instanceDestinationId"]], [22, ["c", [15, "l"], [15, "h"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [2, [15, "f"], "registerPageViewActivityCallback", [7, [15, "l"]]], [22, [2, [15, "e"], "getItem", [7, [15, "j"]]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "m", ["require", "internal.addDataLayerEventListener"]], [52, "n", ["require", "internal.enableAutoEventOnHistoryChange"]], [52, "o", ["require", "internal.getDestinationIds"]], [52, "p", ["require", "internal.sendGtagEvent"]], [52, "q", [8, "interval", 1000, "useV2EventName", true]], [52, "r", ["n", [15, "q"]]], [22, [28, [15, "r"]], [46, [2, [15, "a"], "gtmOnFailure", [7]], [36]]], [2, [15, "e"], "setItem", [7, [15, "j"], true]], ["m", "gtm.historyChange-v2", [51, "", [7, "t", "u"], ["u"], [52, "v", [16, [15, "t"], "gtm.oldUrl"]], [22, [20, [16, [15, "t"], "gtm.newUrl"], [15, "v"]], [46, [36]]], [52, "w", [16, [15, "t"], "gtm.historyChangeSource"]], [22, [1, [1, [21, [15, "w"], "pushState"], [21, [15, "w"], "popstate"]], [21, [15, "w"], "replaceState"]], [46, [36]]], [52, "x", [8]], [22, [17, [15, "a"], "includeParams"], [46, [43, [15, "x"], "page_location", [16, [15, "t"], "gtm.newUrl"]], [43, [15, "x"], "page_referrer", [15, "v"]]]], [52, "y", [8, "eventId", [16, [15, "t"], "gtm.uniqueEventId"]]], [22, [16, [15, "b"], "enableDeferAllEnhancedMeasurement"], [46, [43, [15, "y"], "deferrable", true]]], ["s", [15, "y"]], ["p", ["o"], [15, "i"], [15, "x"], [15, "y"]]], [15, "r"]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__ccd_em_scroll", [46, "a"], [50, "q", [46, "r"], [52, "s", [8]], [43, [15, "s"], [15, "j"], true], [43, [15, "s"], [15, "f"], true], [43, [15, "r"], "eventMetadata", [15, "s"]]], [52, "b", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "c", ["require", "internal.getProductSettingsParameter"]], [52, "d", ["require", "templateStorage"]], [52, "e", [15, "__module_ccdEmScrollActivity"]], [52, "f", "speculative"], [52, "g", "ae_block_scroll"], [52, "h", "scroll"], [52, "i", "isRegistered"], [52, "j", "em_event"], [52, "k", [17, [15, "a"], "instanceDestinationId"]], [22, ["c", [15, "k"], [15, "g"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [2, [15, "e"], "registerScrollActivityCallback", [7, [15, "k"], [17, [15, "a"], "includeParams"]]], [22, [2, [15, "d"], "getItem", [7, [15, "i"]]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "l", ["require", "internal.addDataLayerEventListener"]], [52, "m", ["require", "internal.enableAutoEventOnScroll"]], [52, "n", ["require", "internal.getDestinationIds"]], [52, "o", ["require", "internal.sendGtagEvent"]], [52, "p", ["m", [8, "verticalThresholdUnits", "PERCENT", "verticalThresholds", 90]]], [22, [28, [15, "p"]], [46, [2, [15, "a"], "gtmOnFailure", [7]], [36]]], [2, [15, "d"], "setItem", [7, [15, "i"], true]], ["l", "gtm.scrollDepth", [51, "", [7, "r", "s"], ["s"], [52, "t", [8, "eventId", [16, [15, "r"], "gtm.uniqueEventId"]]], [22, [16, [15, "b"], "enableDeferAllEnhancedMeasurement"], [46, [43, [15, "t"], "deferrable", true]]], [52, "u", [8, "percent_scrolled", [16, [15, "r"], "gtm.scrollThreshold"]]], ["q", [15, "t"]], ["o", ["n"], [15, "h"], [15, "u"], [15, "t"]]], [15, "p"]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__ccd_em_site_search", [46, "a"], [52, "b", ["require", "getQueryParameters"]], [52, "c", ["require", "internal.sendGtagEvent"]], [52, "d", ["require", "getContainerVersion"]], [52, "e", [15, "__module_ccdEmSiteSearchActivity"]], [52, "f", [2, [15, "e"], "getSearchTerm", [7, [17, [15, "a"], "searchQueryParams"], [15, "b"]]]], [52, "g", [30, [17, [15, "a"], "instanceDestinationId"], [17, ["d"], "containerId"]]], [52, "h", [8, "deferrable", true, "eventId", [17, [15, "a"], "gtmEventId"], "eventMetadata", [8, "em_event", true]]], [22, [15, "f"], [46, [53, [52, "i", [39, [28, [28, [17, [15, "a"], "includeParams"]]], [2, [15, "e"], "buildEventParams", [7, [15, "f"], [17, [15, "a"], "additionalQueryParams"], [15, "b"]]], [8]]], ["c", [15, "g"], "view_search_results", [15, "i"], [15, "h"]]]]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__ccd_em_video", [46, "a"], [50, "s", [46, "t"], [52, "u", [8]], [43, [15, "u"], [15, "l"], true], [43, [15, "u"], [15, "f"], true], [43, [15, "t"], "eventMetadata", [15, "u"]]], [52, "b", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "c", ["require", "internal.getProductSettingsParameter"]], [52, "d", ["require", "templateStorage"]], [52, "e", [15, "__module_ccdEmVideoActivity"]], [52, "f", "speculative"], [52, "g", "ae_block_video"], [52, "h", "video_start"], [52, "i", "video_progress"], [52, "j", "video_complete"], [52, "k", "isRegistered"], [52, "l", "em_event"], [52, "m", [17, [15, "a"], "instanceDestinationId"]], [22, ["c", [15, "m"], [15, "g"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [2, [15, "e"], "registerVideoActivityCallback", [7, [15, "m"], [17, [15, "a"], "includeParams"]]], [22, [2, [15, "d"], "getItem", [7, [15, "k"]]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "n", ["require", "internal.addDataLayerEventListener"]], [52, "o", ["require", "internal.enableAutoEventOnYouTubeActivity"]], [52, "p", ["require", "internal.getDestinationIds"]], [52, "q", ["require", "internal.sendGtagEvent"]], [52, "r", ["o", [8, "captureComplete", true, "captureStart", true, "progressThresholdsPercent", [7, 10, 25, 50, 75]]]], [22, [28, [15, "r"]], [46, [2, [15, "a"], "gtmOnFailure", [7]], [36]]], [2, [15, "d"], "setItem", [7, [15, "k"], true]], ["n", "gtm.video", [51, "", [7, "t", "u"], ["u"], [52, "v", [16, [15, "t"], "gtm.videoStatus"]], [41, "w"], [22, [20, [15, "v"], "start"], [46, [3, "w", [15, "h"]]], [46, [22, [20, [15, "v"], "progress"], [46, [3, "w", [15, "i"]]], [46, [22, [20, [15, "v"], "complete"], [46, [3, "w", [15, "j"]]], [46, [36]]]]]]], [52, "x", [8, "video_current_time", [16, [15, "t"], "gtm.videoCurrentTime"], "video_duration", [16, [15, "t"], "gtm.videoDuration"], "video_percent", [16, [15, "t"], "gtm.videoPercent"], "video_provider", [16, [15, "t"], "gtm.videoProvider"], "video_title", [16, [15, "t"], "gtm.videoTitle"], "video_url", [16, [15, "t"], "gtm.videoUrl"], "visible", [16, [15, "t"], "gtm.videoVisible"]]], [52, "y", [8, "eventId", [16, [15, "t"], "gtm.uniqueEventId"]]], [22, [16, [15, "b"], "enableDeferAllEnhancedMeasurement"], [46, [43, [15, "y"], "deferrable", true]]], ["s", [15, "y"]], ["q", ["p"], [15, "w"], [15, "x"], [15, "y"]]], [15, "r"]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__ccd_ga_regscope", [46, "a"], [52, "b", [15, "__module_ccdGaRegionScopedSettings"]], [52, "c", [2, [15, "b"], "extractRedactedLocations", [7, [15, "a"]]]], [2, [15, "b"], "applyRegionScopedSettings", [7, [15, "a"], [15, "c"]]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__e", [46, "a"], [36, [13, [41, "$0"], [3, "$0", ["require", "internal.getEventData"]], ["$0", "event"]]]], [50, "__ogt_google_signals", [46, "a"], [52, "b", ["require", "internal.setProductSettingsParameter"]], [52, "c", ["require", "getContainerVersion"]], [52, "d", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "e", [30, [17, [15, "a"], "instanceDestinationId"], [17, ["c"], "containerId"]]], ["b", [15, "e"], "google_signals", [39, [17, [15, "d"], "ignoreServerMacroInGoogleSignal"], [20, [17, [15, "a"], "googleSignals"], "ENABLED"], [20, [17, [15, "a"], "serverMacroResult"], 1]]], [52, "f", [39, [17, [15, "d"], "renameOnoToNonGaiaRemarketing"], "google_ng", "google_ono"]], ["b", [15, "e"], [15, "f"], [39, [17, [15, "d"], "ignoreServerMacroInGoogleSignal"], [20, [17, [15, "a"], "googleSignals"], "NON_GAIA_REMARKETING"], [20, [17, [15, "a"], "serverMacroResult"], 2]]], [2, [15, "a"], "gtmOnSuccess", [7]]], [50, "__set_product_settings", [46, "a"], [2, [15, "a"], "gtmOnSuccess", [7]]], [52, "__module_activities", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "b", [46, "c", "d"], [36, [39, [15, "d"], ["d", [15, "c"]], [15, "c"]]]], [36, [8, "withRequestContext", [15, "b"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdEmDownloadActivity", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "h", [46, "i", "j"], ["c", [15, "i"], [51, "", [7, "k"], [22, [30, [21, [2, [15, "k"], "getEventName", [7]], [15, "f"]], [28, [2, [15, "k"], "getMetadata", [7, [15, "g"]]]]], [46, [36]]], [22, ["b", [15, "i"], [15, "e"]], [46, [2, [15, "k"], "abort", [7]], [36]]], [2, [15, "k"], "setMetadata", [7, [15, "d"], false]], [22, [28, [15, "j"]], [46, [2, [15, "k"], "setHitData", [7, "link_id", [44]]], [2, [15, "k"], "setHitData", [7, "link_url", [44]]], [2, [15, "k"], "setHitData", [7, "link_text", [44]]], [2, [15, "k"], "setHitData", [7, "file_name", [44]]], [2, [15, "k"], "setHitData", [7, "file_extension", [44]]]]]]]], [52, "b", ["require", "internal.getProductSettingsParameter"]], [52, "c", ["require", "internal.registerCcdCallback"]], [52, "d", "speculative"], [52, "e", "ae_block_downloads"], [52, "f", "file_download"], [52, "g", "em_event"], [36, [8, "registerDownloadActivityCallback", [15, "h"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdEmOutboundClickActivity", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "h", [46, "i", "j"], ["c", [15, "i"], [51, "", [7, "k"], [22, [30, [21, [2, [15, "k"], "getEventName", [7]], [15, "f"]], [28, [2, [15, "k"], "getMetadata", [7, [15, "g"]]]]], [46, [36]]], [22, ["b", [15, "i"], [15, "e"]], [46, [2, [15, "k"], "abort", [7]], [36]]], [2, [15, "k"], "setMetadata", [7, [15, "d"], false]], [22, [28, [15, "j"]], [46, [2, [15, "k"], "setHitData", [7, "link_id", [44]]], [2, [15, "k"], "setHitData", [7, "link_classes", [44]]], [2, [15, "k"], "setHitData", [7, "link_url", [44]]], [2, [15, "k"], "setHitData", [7, "link_domain", [44]]], [2, [15, "k"], "setHitData", [7, "outbound", [44]]]]]]]], [52, "b", ["require", "internal.getProductSettingsParameter"]], [52, "c", ["require", "internal.registerCcdCallback"]], [52, "d", "speculative"], [52, "e", "ae_block_outbound_click"], [52, "f", "click"], [52, "g", "em_event"], [36, [8, "registerOutbackClickActivityCallback", [15, "h"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdEmPageViewActivity", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "j", [46, "k"], ["c", [15, "k"], [51, "", [7, "l"], [22, [30, [21, [2, [15, "l"], "getEventName", [7]], [15, "h"]], [28, [2, [15, "l"], "getMetadata", [7, [15, "i"]]]]], [46, [36]]], [22, ["b", [15, "k"], [15, "g"]], [46, [2, [15, "l"], "abort", [7]], [36]]], [22, [28, [2, [15, "l"], "getMetadata", [7, [15, "f"]]]], [46, ["d", [15, "k"], "page_referrer", [2, [15, "l"], "getHitData", [7, "page_referrer"]]]]], [2, [15, "l"], "setMetadata", [7, [15, "e"], false]]]]], [52, "b", ["require", "internal.getProductSettingsParameter"]], [52, "c", ["require", "internal.registerCcdCallback"]], [52, "d", ["require", "internal.setRemoteConfigParameter"]], [52, "e", "speculative"], [52, "f", "is_sgtm_prehit"], [52, "g", "ae_block_history"], [52, "h", "page_view"], [52, "i", "em_event"], [36, [8, "registerPageViewActivityCallback", [15, "j"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdEmSiteSearchActivity", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "b", [46, "d", "e"], [52, "f", [2, [30, [15, "d"], ""], "split", [7, ","]]], [53, [41, "g"], [3, "g", 0], [63, [7, "g"], [23, [15, "g"], [17, [15, "f"], "length"]], [33, [15, "g"], [3, "g", [0, [15, "g"], 1]]], [46, [53, [52, "h", ["e", [2, [16, [15, "f"], [15, "g"]], "trim", [7]]]], [22, [21, [15, "h"], [44]], [46, [36, [15, "h"]]]]]]]]], [50, "c", [46, "d", "e", "f"], [52, "g", [8, "search_term", [15, "d"]]], [52, "h", [2, [30, [15, "e"], ""], "split", [7, ","]]], [53, [41, "i"], [3, "i", 0], [63, [7, "i"], [23, [15, "i"], [17, [15, "h"], "length"]], [33, [15, "i"], [3, "i", [0, [15, "i"], 1]]], [46, [53, [52, "j", [2, [16, [15, "h"], [15, "i"]], "trim", [7]]], [52, "k", ["f", [15, "j"]]], [22, [21, [15, "k"], [44]], [46, [43, [15, "g"], [0, "q_", [15, "j"]], [15, "k"]]]]]]]], [36, [15, "g"]]], [36, [8, "getSearchTerm", [15, "b"], "buildEventParams", [15, "c"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdEmScrollActivity", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "h", [46, "i", "j"], ["c", [15, "i"], [51, "", [7, "k"], [22, [30, [21, [2, [15, "k"], "getEventName", [7]], [15, "f"]], [28, [2, [15, "k"], "getMetadata", [7, [15, "g"]]]]], [46, [36]]], [22, ["b", [15, "i"], [15, "e"]], [46, [2, [15, "k"], "abort", [7]], [36]]], [2, [15, "k"], "setMetadata", [7, [15, "d"], false]], [22, [28, [15, "j"]], [46, [2, [15, "k"], "setHitData", [7, "percent_scrolled", [44]]]]]]]], [52, "b", ["require", "internal.getProductSettingsParameter"]], [52, "c", ["require", "internal.registerCcdCallback"]], [52, "d", "speculative"], [52, "e", "ae_block_scroll"], [52, "f", "scroll"], [52, "g", "em_event"], [36, [8, "registerScrollActivityCallback", [15, "h"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdEmVideoActivity", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "j", [46, "k", "l"], ["c", [15, "k"], [51, "", [7, "m"], [52, "n", [2, [15, "m"], "getEventName", [7]]], [52, "o", [30, [30, [20, [15, "n"], [15, "f"]], [20, [15, "n"], [15, "g"]]], [20, [15, "n"], [15, "h"]]]], [22, [30, [28, [15, "o"]], [28, [2, [15, "m"], "getMetadata", [7, [15, "i"]]]]], [46, [36]]], [22, ["b", [15, "k"], [15, "e"]], [46, [2, [15, "m"], "abort", [7]], [36]]], [2, [15, "m"], "setMetadata", [7, [15, "d"], false]], [22, [28, [15, "l"]], [46, [2, [15, "m"], "setHitData", [7, "video_current_time", [44]]], [2, [15, "m"], "setHitData", [7, "video_duration", [44]]], [2, [15, "m"], "setHitData", [7, "video_percent", [44]]], [2, [15, "m"], "setHitData", [7, "video_provider", [44]]], [2, [15, "m"], "setHitData", [7, "video_title", [44]]], [2, [15, "m"], "setHitData", [7, "video_url", [44]]], [2, [15, "m"], "setHitData", [7, "visible", [44]]]]]]]], [52, "b", ["require", "internal.getProductSettingsParameter"]], [52, "c", ["require", "internal.registerCcdCallback"]], [52, "d", "speculative"], [52, "e", "ae_block_video"], [52, "f", "video_start"], [52, "g", "video_progress"], [52, "h", "video_complete"], [52, "i", "em_event"], [36, [8, "registerVideoActivityCallback", [15, "j"]]]], [36, ["a"]]]], ["$0"]]], [52, "__module_ccdGaRegionScopedSettings", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "n", [46, "q", "r", "s"], [50, "y", [46, "bb"], [52, "bc", [16, [15, "m"], [15, "bb"]]], [22, [28, [15, "bc"]], [46, [36]]], [53, [41, "bd"], [3, "bd", 0], [63, [7, "bd"], [23, [15, "bd"], [17, [15, "bc"], "length"]], [33, [15, "bd"], [3, "bd", [0, [15, "bd"], 1]]], [46, [53, [52, "be", [16, [15, "bc"], [15, "bd"]]], ["v", [15, "u"], [17, [15, "be"], "name"], [17, [15, "be"], "value"]]]]]]], [50, "z", [46, "bb"], [22, [30, [28, [15, "w"]], [21, [17, [15, "w"], "length"], 2]], [46, [36, false]]], [41, "bc"], [3, "bc", [16, [15, "bb"], [15, "x"]]], [22, [20, [15, "bc"], [44]], [46, [3, "bc", [16, [15, "bb"], [15, "w"]]]]], [36, [28, [28, [15, "bc"]]]]], [50, "ba", [46, "bb"], [22, [30, [28, [15, "w"]], [21, [17, [15, "w"], "length"], 2]], [46, [36, false]]], [52, "bc", ["o", [15, "bb"]]], [53, [41, "bd"], [3, "bd", 0], [63, [7, "bd"], [23, [15, "bd"], [17, [15, "bc"], "length"]], [33, [15, "bd"], [3, "bd", [0, [15, "bd"], 1]]], [46, [53, [52, "be", [16, [15, "bc"], [15, "bd"]]], [52, "bf", [17, [15, "be"], "countryCode"]], [52, "bg", [17, [15, "be"], "regionCode"]], [52, "bh", [20, [15, "bf"], [15, "w"]]], [52, "bi", [30, [28, [15, "bg"]], [20, [15, "bg"], [15, "x"]]]], [22, [1, [15, "bh"], [15, "bi"]], [46, [36, true]]]]]]], [36, false]], [52, "t", [39, [17, [15, "c"], "enableGaRegionActivityPerformanceFix"], [15, "r"], [17, [15, "q"], "settingsTable"]]], [22, [28, [15, "t"]], [46, [36]]], [52, "u", [30, [17, [15, "q"], "instanceDestinationId"], [17, ["d"], "containerId"]]], [52, "v", ["i", [15, "g"], [15, "s"]]], [52, "w", [13, [41, "$0"], [3, "$0", ["i", [15, "e"], [15, "s"]]], ["$0"]]], [52, "x", [13, [41, "$0"], [3, "$0", ["i", [15, "f"], [15, "s"]]], ["$0"]]], [53, [41, "bb"], [3, "bb", 0], [63, [7, "bb"], [23, [15, "bb"], [17, [15, "t"], "length"]], [33, [15, "bb"], [3, "bb", [0, [15, "bb"], 1]]], [46, [53, [52, "bc", [16, [15, "t"], [15, "bb"]]], [52, "bd", [39, [17, [15, "c"], "enableGaRegionActivityPerformanceFix"], ["z", [17, [15, "bc"], "disallowedRegions"]], ["ba", [17, [15, "bc"], "disallowedRegions"]]]], [22, [30, [17, [15, "bc"], "disallowAllRegions"], [15, "bd"]], [46, ["y", [17, [15, "bc"], "redactFieldGroup"]]]]]]]]], [50, "o", [46, "q"], [52, "r", [39, [17, [15, "c"], "enableGaRegionActivityPerformanceFix"], [8], [7]]], [22, [28, [15, "q"]], [46, [36, [15, "r"]]]], [52, "s", [2, [15, "q"], "split", [7, ","]]], [53, [41, "t"], [3, "t", 0], [63, [7, "t"], [23, [15, "t"], [17, [15, "s"], "length"]], [33, [15, "t"], [3, "t", [0, [15, "t"], 1]]], [46, [53, [52, "u", [2, [16, [15, "s"], [15, "t"]], "trim", [7]]], [22, [28, [15, "u"]], [46, [6]]], [52, "v", [2, [15, "u"], "split", [7, "-"]]], [52, "w", [16, [15, "v"], 0]], [52, "x", [39, [20, [17, [15, "v"], "length"], 2], [15, "u"], [44]]], [22, [30, [28, [15, "w"]], [21, [17, [15, "w"], "length"], 2]], [46, [6]]], [22, [1, [21, [15, "x"], [44]], [30, [23, [17, [15, "x"], "length"], 4], [18, [17, [15, "x"], "length"], 6]]], [46, [6]]], [22, [17, [15, "c"], "enableGaRegionActivityPerformanceFix"], [46, [43, [15, "r"], [15, "u"], true]], [46, [2, [15, "r"], "push", [7, [8, "countryCode", [15, "w"], "regionCode", [15, "x"]]]]]]]]]], [36, [15, "r"]]], [50, "p", [46, "q"], [22, [28, [17, [15, "c"], "enableGaRegionActivityPerformanceFix"]], [46, [36, [44]]]], [22, [28, [17, [15, "q"], "settingsTable"]], [46, [36, [7]]]], [52, "r", [8]], [53, [41, "s"], [3, "s", 0], [63, [7, "s"], [23, [15, "s"], [17, [17, [15, "q"], "settingsTable"], "length"]], [33, [15, "s"], [3, "s", [0, [15, "s"], 1]]], [46, [53, [52, "t", [16, [17, [15, "q"], "settingsTable"], [15, "s"]]], [52, "u", [17, [15, "t"], "redactFieldGroup"]], [22, [28, [16, [15, "m"], [15, "u"]]], [46, [6]]], [43, [15, "r"], [15, "u"], [8, "redactFieldGroup", [15, "u"], "disallowAllRegions", false, "disallowedRegions", [8]]], [52, "v", [16, [15, "r"], [15, "u"]]], [22, [17, [15, "t"], "disallowAllRegions"], [46, [43, [15, "v"], "disallowAllRegions", true], [6]]], [43, [15, "v"], "disallowedRegions", ["o", [17, [15, "t"], "disallowedRegions"]]]]]]], [36, [2, [15, "b"], "values", [7, [15, "r"]]]]], [52, "b", ["require", "Object"]], [52, "c", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "d", ["require", "getContainerVersion"]], [52, "e", ["require", "internal.getCountryCode"]], [52, "f", ["require", "internal.getRegionCode"]], [52, "g", ["require", "internal.setRemoteConfigParameter"]], [52, "h", [15, "__module_activities"]], [52, "i", [17, [15, "h"], "withRequestContext"]], [41, "j"], [41, "k"], [41, "l"], [52, "m", [8, "GOOGLE_SIGNALS", [7, [8, "name", "allow_google_signals", "value", false]], "DEVICE_AND_GEO", [7, [8, "name", "geo_granularity", "value", true], [8, "name", "redact_device_info", "value", true]]]], [36, [8, "applyRegionScopedSettings", [15, "n"], "extractRedactedLocations", [15, "p"]]]], [36, ["a"]]]], ["$0"]]]
            ],
            "entities": {
                "__ccd_conversion_marking": {
                    "2": true,
                    "4": true
                },
                "__ccd_em_download": {
                    "2": true,
                    "4": true
                },
                "__ccd_em_outbound_click": {
                    "2": true,
                    "4": true
                },
                "__ccd_em_page_view": {
                    "2": true,
                    "4": true
                },
                "__ccd_em_scroll": {
                    "2": true,
                    "4": true
                },
                "__ccd_em_site_search": {
                    "2": true,
                    "4": true
                },
                "__ccd_em_video": {
                    "2": true,
                    "4": true
                },
                "__ccd_ga_regscope": {
                    "2": true,
                    "4": true
                },
                "__e": {
                    "2": true,
                    "4": true
                },
                "__ogt_google_signals": {
                    "2": true,
                    "4": true
                },
                "__set_product_settings": {
                    "2": true,
                    "4": true
                }

            },
            "blob": {
                "1": "1"
            },
            "permissions": {
                "__ccd_conversion_marking": {},
                "__ccd_em_download": {
                    "listen_data_layer": {
                        "accessType": "specific",
                        "allowedEvents": ["gtm.linkClick"]
                    },
                    "access_template_storage": {},
                    "detect_link_click_events": {
                        "allowWaitForTags": ""
                    }
                },
                "__ccd_em_outbound_click": {
                    "get_url": {
                        "urlParts": "any",
                        "queriesAllowed": "any"
                    },
                    "listen_data_layer": {
                        "accessType": "specific",
                        "allowedEvents": ["gtm.linkClick"]
                    },
                    "access_template_storage": {},
                    "detect_link_click_events": {
                        "allowWaitForTags": ""
                    }
                },
                "__ccd_em_page_view": {
                    "listen_data_layer": {
                        "accessType": "specific",
                        "allowedEvents": ["gtm.historyChange-v2"]
                    },
                    "access_template_storage": {},
                    "detect_history_change_events": {}
                },
                "__ccd_em_scroll": {
                    "listen_data_layer": {
                        "accessType": "specific",
                        "allowedEvents": ["gtm.scrollDepth"]
                    },
                    "process_dom_events": {
                        "targets": [{
                            "targetType": "window",
                            "eventName": "resize"
                        }, {
                            "targetType": "window",
                            "eventName": "scroll"
                        }, {
                            "targetType": "window",
                            "eventName": "scrollend"
                        }]
                    },
                    "access_template_storage": {},
                    "detect_scroll_events": {}
                },
                "__ccd_em_site_search": {
                    "get_url": {
                        "urlParts": "any",
                        "queriesAllowed": "any"
                    },
                    "read_container_data": {}
                },
                "__ccd_em_video": {
                    "listen_data_layer": {
                        "accessType": "specific",
                        "allowedEvents": ["gtm.video"]
                    },
                    "access_template_storage": {},
                    "detect_youtube_activity_events": {
                        "allowFixMissingJavaScriptApi": false
                    }
                },
                "__ccd_ga_regscope": {
                    "read_container_data": {}
                },
                "__e": {
                    "read_event_data": {
                        "eventDataAccess": "specific",
                        "keyPatterns": ["event"]
                    }
                },
                "__ogt_google_signals": {
                    "read_container_data": {}
                },
                "__set_product_settings": {}

            }
            ,
            "security_groups": {
                "google": ["__ccd_conversion_marking", "__ccd_em_download", "__ccd_em_outbound_click", "__ccd_em_page_view", "__ccd_em_scroll", "__ccd_em_site_search", "__ccd_em_video", "__ccd_ga_regscope", "__e", "__ogt_google_signals", "__set_product_settings"
                ]

            }

        };

        var aa, ba = function(a) {
                var b = 0;
                return function() {
                    return b < a.length ? {
                        done: !1,
                        value: a[b++]
                    } : {
                        done: !0
                    }
                }
            }, da = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
                if (a == Array.prototype || a == Object.prototype)
                    return a;
                a[b] = c.value;
                return a
            }
            , fa = function(a) {
                for (var b = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global], c = 0; c < b.length; ++c) {
                    var d = b[c];
                    if (d && d.Math == Math)
                        return d
                }
                throw Error("Cannot find global object");
            }, ha = fa(this), ja = function(a, b) {
                if (b)
                    a: {
                        for (var c = ha, d = a.split("."), e = 0; e < d.length - 1; e++) {
                            var f = d[e];
                            if (!(f in c))
                                break a;
                            c = c[f]
                        }
                        var g = d[d.length - 1]
                            , h = c[g]
                            , m = b(h);
                        m != h && null != m && da(c, g, {
                            configurable: !0,
                            writable: !0,
                            value: m
                        })
                    }
            }, ka = function(a) {
                return a.raw = a
            }, la = function(a, b) {
                a.raw = b;
                return a
            }, ma = function(a) {
                var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
                if (b)
                    return b.call(a);
                if ("number" == typeof a.length)
                    return {
                        next: ba(a)
                    };
                throw Error(String(a) + " is not an iterable or ArrayLike");
            }, oa = function(a) {
                for (var b, c = []; !(b = a.next()).done; )
                    c.push(b.value);
                return c
            }, pa = function(a) {
                return a instanceof Array ? a : oa(ma(a))
            }, qa = "function" == typeof Object.assign ? Object.assign : function(a, b) {
                for (var c = 1; c < arguments.length; c++) {
                    var d = arguments[c];
                    if (d)
                        for (var e in d)
                            Object.prototype.hasOwnProperty.call(d, e) && (a[e] = d[e])
                }
                return a
            }
        ;
        ja("Object.assign", function(a) {
            return a || qa
        });
        var ra = "function" == typeof Object.create ? Object.create : function(a) {
            var b = function() {};
            b.prototype = a;
            return new b
        }
            , sa;
        if ("function" == typeof Object.setPrototypeOf)
            sa = Object.setPrototypeOf;
        else {
            var ta;
            a: {
                var ua = {
                    a: !0
                }
                    , va = {};
                try {
                    va.__proto__ = ua;
                    ta = va.a;
                    break a
                } catch (a) {}
                ta = !1
            }
            sa = ta ? function(a, b) {
                    a.__proto__ = b;
                    if (a.__proto__ !== b)
                        throw new TypeError(a + " is not extensible");
                    return a
                }
                : null
        }
        var xa = sa
            , ya = function(a, b) {
            a.prototype = ra(b.prototype);
            a.prototype.constructor = a;
            if (xa)
                xa(a, b);
            else
                for (var c in b)
                    if ("prototype" != c)
                        if (Object.defineProperties) {
                            var d = Object.getOwnPropertyDescriptor(b, c);
                            d && Object.defineProperty(a, c, d)
                        } else
                            a[c] = b[c];
            a.Yn = b.prototype
        }
            , za = function() {
            for (var a = Number(this), b = [], c = a; c < arguments.length; c++)
                b[c - a] = arguments[c];
            return b
        };
        /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
        var Ba = this || self
            , Ca = function(a, b, c) {
            return a.call.apply(a.bind, arguments)
        }
            , Da = function(a, b, c) {
            if (!a)
                throw Error();
            if (2 < arguments.length) {
                var d = Array.prototype.slice.call(arguments, 2);
                return function() {
                    var e = Array.prototype.slice.call(arguments);
                    Array.prototype.unshift.apply(e, d);
                    return a.apply(b, e)
                }
            }
            return function() {
                return a.apply(b, arguments)
            }
        }
            , Ea = function(a, b, c) {
            Ea = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? Ca : Da;
            return Ea.apply(null, arguments)
        }
            , Fa = function(a) {
            return a
        };
        var Ga = function(a, b) {
            this.type = a;
            this.data = b
        };
        var Ha = function() {
            this.m = {};
            this.H = {}
        };
        aa = Ha.prototype;
        aa.get = function(a) {
            return this.m["dust." + a]
        }
        ;
        aa.set = function(a, b) {
            a = "dust." + a;
            this.H.hasOwnProperty(a) || (this.m[a] = b)
        }
        ;
        aa.Sh = function(a, b) {
            this.set(a, b);
            this.H["dust." + a] = !0
        }
        ;
        aa.has = function(a) {
            return this.m.hasOwnProperty("dust." + a)
        }
        ;
        aa.zf = function(a) {
            a = "dust." + a;
            this.H.hasOwnProperty(a) || delete this.m[a]
        }
        ;
        var Ia = function() {};
        Ia.prototype.reset = function() {}
        ;
        var Ja = function(a, b) {
            this.T = a;
            this.parent = b;
            this.m = this.F = void 0;
            this.M = function(c, d, e) {
                return c.apply(d, e)
            }
            ;
            this.values = new Ha
        };
        Ja.prototype.add = function(a, b) {
            Ka(this, a, b, !1)
        }
        ;
        var Ka = function(a, b, c, d) {
            d ? a.values.Sh(b, c) : a.values.set(b, c)
        };
        Ja.prototype.set = function(a, b) {
            !this.values.has(a) && this.parent && this.parent.has(a) ? this.parent.set(a, b) : this.values.set(a, b)
        }
        ;
        Ja.prototype.get = function(a) {
            return this.values.has(a) ? this.values.get(a) : this.parent ? this.parent.get(a) : void 0
        }
        ;
        Ja.prototype.has = function(a) {
            return !!this.values.has(a) || !(!this.parent || !this.parent.has(a))
        }
        ;
        var La = function(a) {
            var b = new Ja(a.T,a);
            a.F && (b.F = a.F);
            b.M = a.M;
            b.m = a.m;
            return b
        };
        Ja.prototype.H = function() {
            return this.T
        }
        ;
        function Ma(a, b) {
            for (var c, d = 0; d < b.length && !(c = Na(a, b[d]),
            c instanceof Ga); d++)
                ;
            return c
        }
        function Na(a, b) {
            try {
                var c = a.get(String(b[0]));
                if (!c || "function" !== typeof c.invoke)
                    throw Error("Attempting to execute non-function " + b[0] + ".");
                return c.invoke.apply(c, [a].concat(b.slice(1)))
            } catch (e) {
                var d = a.F;
                d && d(e, b.context ? {
                    id: b[0],
                    line: b.context.line
                } : null);
                throw e;
            }
        }
        ;var Pa = function() {
            this.M = new Ia;
            this.m = new Ja(this.M)
        };
        Pa.prototype.H = function() {
            return this.M
        }
        ;
        Pa.prototype.execute = function(a) {
            var b = Array.prototype.slice.call(arguments, 0);
            return this.F(b)
        }
        ;
        Pa.prototype.F = function() {
            for (var a, b = 0; b < arguments.length; b++)
                a = Na(this.m, arguments[b]);
            return a
        }
        ;
        Pa.prototype.T = function(a) {
            var b = La(this.m);
            b.m = a;
            for (var c, d = 1; d < arguments.length; d++)
                c = Na(b, arguments[d]);
            return c
        }
        ;
        var Qa = function() {
            Ha.call(this);
            this.F = !1
        };
        ya(Qa, Ha);
        var Ra = function(a, b) {
            var c = [], d;
            for (d in a.m)
                if (a.m.hasOwnProperty(d))
                    switch (d = d.substr(5),
                        b) {
                        case 1:
                            c.push(d);
                            break;
                        case 2:
                            c.push(a.get(d));
                            break;
                        case 3:
                            c.push([d, a.get(d)])
                    }
            return c
        };
        Qa.prototype.set = function(a, b) {
            this.F || Ha.prototype.set.call(this, a, b)
        }
        ;
        Qa.prototype.Sh = function(a, b) {
            this.F || Ha.prototype.Sh.call(this, a, b)
        }
        ;
        Qa.prototype.zf = function(a) {
            this.F || Ha.prototype.zf.call(this, a)
        }
        ;
        Qa.prototype.Lb = function() {
            this.F = !0
        }
        ;
        /*
 jQuery (c) 2005, 2012 jQuery Foundation, Inc. jquery.org/license.
*/
        var Sa = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/
            , Ta = function(a) {
            if (null == a)
                return String(a);
            var b = Sa.exec(Object.prototype.toString.call(Object(a)));
            return b ? b[1].toLowerCase() : "object"
        }
            , Ua = function(a, b) {
            return Object.prototype.hasOwnProperty.call(Object(a), b)
        }
            , Va = function(a) {
            if (!a || "object" != Ta(a) || a.nodeType || a == a.window)
                return !1;
            try {
                if (a.constructor && !Ua(a, "constructor") && !Ua(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (c) {
                return !1
            }
            for (var b in a)
                ;
            return void 0 === b || Ua(a, b)
        }
            , k = function(a, b) {
            var c = b || ("array" == Ta(a) ? [] : {}), d;
            for (d in a)
                if (Ua(a, d)) {
                    var e = a[d];
                    "array" == Ta(e) ? ("array" != Ta(c[d]) && (c[d] = []),
                        c[d] = k(e, c[d])) : Va(e) ? (Va(c[d]) || (c[d] = {}),
                        c[d] = k(e, c[d])) : c[d] = e
                }
            return c
        };
        function Wa(a) {
            if (void 0 == a || Array.isArray(a) || Va(a))
                return !0;
            switch (typeof a) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    return !0
            }
            return !1
        }
        function Xa(a) {
            return "number" === typeof a && 0 <= a && isFinite(a) && 0 === a % 1 || "string" === typeof a && "-" !== a[0] && a === "" + parseInt(a)
        }
        ;var Ya = function(a) {
            this.m = [];
            this.H = !1;
            this.F = new Qa;
            a = a || [];
            for (var b in a)
                a.hasOwnProperty(b) && (Xa(b) ? this.m[Number(b)] = a[Number(b)] : this.F.set(b, a[b]))
        };
        aa = Ya.prototype;
        aa.toString = function(a) {
            if (a && 0 <= a.indexOf(this))
                return "";
            for (var b = [], c = 0; c < this.m.length; c++) {
                var d = this.m[c];
                null === d || void 0 === d ? b.push("") : d instanceof Ya ? (a = a || [],
                    a.push(this),
                    b.push(d.toString(a)),
                    a.pop()) : b.push(String(d))
            }
            return b.join(",")
        }
        ;
        aa.set = function(a, b) {
            if (!this.H)
                if ("length" === a) {
                    if (!Xa(b))
                        throw Error("RangeError: Length property must be a valid integer.");
                    this.m.length = Number(b)
                } else
                    Xa(a) ? this.m[Number(a)] = b : this.F.set(a, b)
        }
        ;
        aa.get = function(a) {
            return "length" === a ? this.length() : Xa(a) ? this.m[Number(a)] : this.F.get(a)
        }
        ;
        aa.length = function() {
            return this.m.length
        }
        ;
        aa.Zb = function() {
            for (var a = Ra(this.F, 1), b = 0; b < this.m.length; b++)
                a.push(b + "");
            return new Ya(a)
        }
        ;
        var Za = function(a, b) {
            Xa(b) ? delete a.m[Number(b)] : a.F.zf(b)
        };
        aa = Ya.prototype;
        aa.pop = function() {
            return this.m.pop()
        }
        ;
        aa.push = function() {
            return this.m.push.apply(this.m, Array.prototype.slice.call(arguments))
        }
        ;
        aa.shift = function() {
            return this.m.shift()
        }
        ;
        aa.splice = function(a, b) {
            return new Ya(this.m.splice.apply(this.m, arguments))
        }
        ;
        aa.unshift = function() {
            return this.m.unshift.apply(this.m, Array.prototype.slice.call(arguments))
        }
        ;
        aa.has = function(a) {
            return Xa(a) && this.m.hasOwnProperty(a) || this.F.has(a)
        }
        ;
        aa.Lb = function() {
            this.H = !0;
            Object.freeze(this.m);
            this.F.Lb()
        }
        ;
        function $a(a) {
            for (var b = [], c = 0; c < a.length(); c++)
                a.has(c) && (b[c] = a.get(c));
            return b
        }
        ;var ab = function() {
            Qa.call(this)
        };
        ya(ab, Qa);
        ab.prototype.Zb = function() {
            return new Ya(Ra(this, 1))
        }
        ;
        var bb = function(a) {
            for (var b = Ra(a, 3), c = new Ya, d = 0; d < b.length; d++) {
                var e = new Ya(b[d]);
                c.push(e)
            }
            return c
        };
        function cb() {
            for (var a = eb, b = {}, c = 0; c < a.length; ++c)
                b[a[c]] = c;
            return b
        }
        function fb() {
            var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            a += a.toLowerCase() + "0123456789-_";
            return a + "."
        }
        var eb, gb;
        function hb(a) {
            eb = eb || fb();
            gb = gb || cb();
            for (var b = [], c = 0; c < a.length; c += 3) {
                var d = c + 1 < a.length
                    , e = c + 2 < a.length
                    , f = a.charCodeAt(c)
                    , g = d ? a.charCodeAt(c + 1) : 0
                    , h = e ? a.charCodeAt(c + 2) : 0
                    , m = f >> 2
                    , n = (f & 3) << 4 | g >> 4
                    , p = (g & 15) << 2 | h >> 6
                    , q = h & 63;
                e || (q = 64,
                d || (p = 64));
                b.push(eb[m], eb[n], eb[p], eb[q])
            }
            return b.join("")
        }
        function ib(a) {
            function b(m) {
                for (; d < a.length; ) {
                    var n = a.charAt(d++)
                        , p = gb[n];
                    if (null != p)
                        return p;
                    if (!/^[\s\xa0]*$/.test(n))
                        throw Error("Unknown base64 encoding at char: " + n);
                }
                return m
            }
            eb = eb || fb();
            gb = gb || cb();
            for (var c = "", d = 0; ; ) {
                var e = b(-1)
                    , f = b(0)
                    , g = b(64)
                    , h = b(64);
                if (64 === h && -1 === e)
                    return c;
                c += String.fromCharCode(e << 2 | f >> 4);
                64 !== g && (c += String.fromCharCode(f << 4 & 240 | g >> 2),
                64 !== h && (c += String.fromCharCode(g << 6 & 192 | h)))
            }
        }
        ;var jb = {};
        function kb(a, b) {
            jb[a] = jb[a] || [];
            jb[a][b] = !0
        }
        function lb(a) {
            var b = jb[a];
            if (!b || 0 === b.length)
                return "";
            for (var c = [], d = 0, e = 0; e < b.length; e++)
                0 === e % 8 && 0 < e && (c.push(String.fromCharCode(d)),
                    d = 0),
                b[e] && (d |= 1 << e % 8);
            0 < d && c.push(String.fromCharCode(d));
            return hb(c.join("")).replace(/\.+$/, "")
        }
        function mb() {
            for (var a = [], b = jb.fdr || [], c = 0; c < b.length; c++)
                b[c] && a.push(c);
            return 0 < a.length ? a : void 0
        }
        ;function nb() {}
        function ob(a) {
            return "function" === typeof a
        }
        function l(a) {
            return "string" === typeof a
        }
        function pb(a) {
            return "number" === typeof a && !isNaN(a)
        }
        function qb(a) {
            return Array.isArray(a) ? a : [a]
        }
        function rb(a, b) {
            if (a && Array.isArray(a))
                for (var c = 0; c < a.length; c++)
                    if (a[c] && b(a[c]))
                        return a[c]
        }
        function sb(a, b) {
            if (!pb(a) || !pb(b) || a > b)
                a = 0,
                    b = 2147483647;
            return Math.floor(Math.random() * (b - a + 1) + a)
        }
        function tb(a, b) {
            for (var c = new ub, d = 0; d < a.length; d++)
                c.set(a[d], !0);
            for (var e = 0; e < b.length; e++)
                if (c.get(b[e]))
                    return !0;
            return !1
        }
        function z(a, b) {
            for (var c in a)
                Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c])
        }
        function vb(a) {
            return !!a && ("[object Arguments]" === Object.prototype.toString.call(a) || Object.prototype.hasOwnProperty.call(a, "callee"))
        }
        function wb(a) {
            return Math.round(Number(a)) || 0
        }
        function xb(a) {
            return "false" === String(a).toLowerCase() ? !1 : !!a
        }
        function yb(a) {
            var b = [];
            if (Array.isArray(a))
                for (var c = 0; c < a.length; c++)
                    b.push(String(a[c]));
            return b
        }
        function zb(a) {
            return a ? a.replace(/^\s+|\s+$/g, "") : ""
        }
        function Bb() {
            return new Date(Date.now())
        }
        function Cb() {
            return Bb().getTime()
        }
        var ub = function() {
            this.prefix = "gtm.";
            this.values = {}
        };
        ub.prototype.set = function(a, b) {
            this.values[this.prefix + a] = b
        }
        ;
        ub.prototype.get = function(a) {
            return this.values[this.prefix + a]
        }
        ;
        function Db(a, b, c) {
            return a && a.hasOwnProperty(b) ? a[b] : c
        }
        function Eb(a) {
            var b = a;
            return function() {
                if (b) {
                    var c = b;
                    b = void 0;
                    try {
                        c()
                    } catch (d) {}
                }
            }
        }
        function Fb(a, b) {
            for (var c in b)
                b.hasOwnProperty(c) && (a[c] = b[c])
        }
        function Gb(a, b) {
            for (var c = [], d = 0; d < a.length; d++)
                c.push(a[d]),
                    c.push.apply(c, b[a[d]] || []);
            return c
        }
        function Hb(a, b) {
            return a.substring(0, b.length) === b
        }
        function Ib(a, b) {
            var c = G;
            b = b || [];
            for (var d = c, e = 0; e < a.length - 1; e++) {
                if (!d.hasOwnProperty(a[e]))
                    return;
                d = d[a[e]];
                if (0 <= b.indexOf(d))
                    return
            }
            return d
        }
        function Jb(a, b) {
            for (var c = {}, d = c, e = a.split("."), f = 0; f < e.length - 1; f++)
                d = d[e[f]] = {};
            d[e[e.length - 1]] = b;
            return c
        }
        var Kb = /^\w{1,9}$/;
        function Lb(a, b) {
            a = a || {};
            b = b || ",";
            var c = [];
            z(a, function(d, e) {
                Kb.test(d) && e && c.push(d)
            });
            return c.join(b)
        }
        function Mb(a, b) {
            function c() {
                e && ++d === b && (e(),
                    e = null,
                    c.done = !0)
            }
            var d = 0
                , e = a;
            c.done = !1;
            return c
        }
        ;var Nb, Ob = function() {
            if (void 0 === Nb) {
                var a = null
                    , b = Ba.trustedTypes;
                if (b && b.createPolicy) {
                    try {
                        a = b.createPolicy("goog#html", {
                            createHTML: Fa,
                            createScript: Fa,
                            createScriptURL: Fa
                        })
                    } catch (c) {
                        Ba.console && Ba.console.error(c.message)
                    }
                    Nb = a
                } else
                    Nb = a
            }
            return Nb
        };
        var Pb = function(a) {
            this.m = a
        };
        Pb.prototype.toString = function() {
            return this.m + ""
        }
        ;
        var Qb = function(a) {
            return a instanceof Pb && a.constructor === Pb ? a.m : "type_error:TrustedResourceUrl"
        }
            , Rb = {}
            , Sb = function(a) {
            var b = a
                , c = Ob()
                , d = c ? c.createScriptURL(b) : b;
            return new Pb(d,Rb)
        };
        /*

 SPDX-License-Identifier: Apache-2.0
*/
        var Tb = ka([""])
            , Ub = la(["\x00"], ["\\0"])
            , Vb = la(["\n"], ["\\n"])
            , Wb = la(["\x00"], ["\\u0000"]);
        function Xb(a) {
            return -1 === a.toString().indexOf("`")
        }
        Xb(function(a) {
            return a(Tb)
        }) || Xb(function(a) {
            return a(Ub)
        }) || Xb(function(a) {
            return a(Vb)
        }) || Xb(function(a) {
            return a(Wb)
        });
        var Yb = function(a) {
            this.m = a
        };
        Yb.prototype.toString = function() {
            return this.m
        }
        ;
        var Zb = new Yb("about:invalid#zClosurez");
        var $b = function(a) {
            this.hm = a
        };
        function ac(a) {
            return new $b(function(b) {
                    return b.substr(0, a.length + 1).toLowerCase() === a + ":"
                }
            )
        }
        var bc = [ac("data"), ac("http"), ac("https"), ac("mailto"), ac("ftp"), new $b(function(a) {
                return /^[^:]*([/?#]|$)/.test(a)
            }
        )];
        function cc(a, b) {
            b = void 0 === b ? bc : b;
            if (a instanceof Yb)
                return a;
            for (var c = 0; c < b.length; ++c) {
                var d = b[c];
                if (d instanceof $b && d.hm(a))
                    return new Yb(a)
            }
        }
        function dc(a) {
            var b;
            b = void 0 === b ? bc : b;
            return cc(a, b) || Zb
        }
        var ec = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
        function fc(a) {
            var b;
            if (a instanceof Yb)
                if (a instanceof Yb)
                    b = a.m;
                else
                    throw Error("");
            else
                b = ec.test(a) ? a : void 0;
            return b
        }
        ;var hc = function() {
            this.m = gc[0].toLowerCase()
        };
        hc.prototype.toString = function() {
            return this.m
        }
        ;
        var ic = Array.prototype.indexOf ? function(a, b) {
                    return Array.prototype.indexOf.call(a, b, void 0)
                }
                : function(a, b) {
                    if ("string" === typeof a)
                        return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
                    for (var c = 0; c < a.length; c++)
                        if (c in a && a[c] === b)
                            return c;
                    return -1
                }
        ;
        var jc = {}
            , kc = function(a) {
            this.m = a
        };
        kc.prototype.toString = function() {
            return this.m.toString()
        }
        ;
        function lc(a, b) {
            var c = [new hc];
            if (0 === c.length)
                throw Error("");
            var d = c.map(function(f) {
                var g;
                if (f instanceof hc)
                    g = f.m;
                else
                    throw Error("");
                return g
            })
                , e = b.toLowerCase();
            if (d.every(function(f) {
                return 0 !== e.indexOf(f)
            }))
                throw Error('Attribute "' + b + '" does not match any of the allowed prefixes.');
            a.setAttribute(b, "true")
        }
        ;function mc(a, b) {
            var c = fc(b);
            void 0 !== c && (a.action = c)
        }
        ;"ARTICLE SECTION NAV ASIDE H1 H2 H3 H4 H5 H6 HEADER FOOTER ADDRESS P HR PRE BLOCKQUOTE OL UL LH LI DL DT DD FIGURE FIGCAPTION MAIN DIV EM STRONG SMALL S CITE Q DFN ABBR RUBY RB RT RTC RP DATA TIME CODE VAR SAMP KBD SUB SUP I B U MARK BDI BDO SPAN BR WBR INS DEL PICTURE PARAM TRACK MAP TABLE CAPTION COLGROUP COL TBODY THEAD TFOOT TR TD TH SELECT DATALIST OPTGROUP OPTION OUTPUT PROGRESS METER FIELDSET LEGEND DETAILS SUMMARY MENU DIALOG SLOT CANVAS FONT CENTER ACRONYM BASEFONT BIG DIR HGROUP STRIKE TT".split(" ").concat(["BUTTON", "INPUT"]);
        function nc(a) {
            return null === a ? "null" : void 0 === a ? "undefined" : a
        }
        ;var G = window
            , H = document
            , oc = navigator
            , pc = function() {
                var a;
                try {
                    a = oc.serviceWorker
                } catch (b) {
                    return
                }
                return a
            }
            , qc = H.currentScript && H.currentScript.src
            , rc = function(a, b) {
                var c = G[a];
                G[a] = void 0 === c ? b : c;
                return G[a]
            }
            , sc = function(a, b) {
                b && (a.addEventListener ? a.onload = b : a.onreadystatechange = function() {
                        a.readyState in {
                            loaded: 1,
                            complete: 1
                        } && (a.onreadystatechange = null,
                            b())
                    }
                )
            }
            , tc = {
                async: 1,
                nonce: 1,
                onerror: 1,
                onload: 1,
                src: 1,
                type: 1
            }
            , uc = {
                onload: 1,
                src: 1,
                width: 1,
                height: 1,
                style: 1
            };
        function vc(a, b, c) {
            b && z(b, function(d, e) {
                d = d.toLowerCase();
                c.hasOwnProperty(d) || a.setAttribute(d, e)
            })
        }
        var wc = function(a, b, c, d, e) {
            var f = H.createElement("script");
            vc(f, d, tc);
            f.type = "text/javascript";
            f.async = d && !1 === d.async ? !1 : !0;
            var g;
            g = Sb(nc(a));
            f.src = Qb(g);
            var h, m, n, p = null == (n = (m = (f.ownerDocument && f.ownerDocument.defaultView || window).document).querySelector) ? void 0 : n.call(m, "script[nonce]");
            (h = p ? p.nonce || p.getAttribute("nonce") || "" : "") && f.setAttribute("nonce", h);
            sc(f, b);
            c && (f.onerror = c);
            if (e)
                e.appendChild(f);
            else {
                var q = H.getElementsByTagName("script")[0] || H.body || H.head;
                q.parentNode.insertBefore(f, q)
            }
            return f
        }
            , xc = function() {
            if (qc) {
                var a = qc.toLowerCase();
                if (0 === a.indexOf("https://"))
                    return 2;
                if (0 === a.indexOf("http://"))
                    return 3
            }
            return 1
        }
            , yc = function(a, b, c, d, e) {
            var f;
            f = void 0 === f ? !0 : f;
            var g = e
                , h = !1;
            g || (g = H.createElement("iframe"),
                h = !0);
            vc(g, c, uc);
            d && z(d, function(n, p) {
                g.dataset[n] = p
            });
            f && (g.height = "0",
                g.width = "0",
                g.style.display = "none",
                g.style.visibility = "hidden");
            void 0 !== a && (g.src = a);
            if (h) {
                var m = H.body && H.body.lastChild || H.body || H.head;
                m.parentNode.insertBefore(g, m)
            }
            sc(g, b);
            return g
        }
            , zc = function(a, b, c, d) {
            var e = new Image(1,1);
            vc(e, d, {});
            e.onload = function() {
                e.onload = null;
                b && b()
            }
            ;
            e.onerror = function() {
                e.onerror = null;
                c && c()
            }
            ;
            e.src = a;
            return e
        }
            , Ac = function(a, b, c, d) {
            a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c)
        }
            , Bc = function(a, b, c) {
            a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent && a.detachEvent("on" + b, c)
        }
            , I = function(a) {
            G.setTimeout(a, 0)
        }
            , Cc = function(a, b) {
            return a && b && a.attributes && a.attributes[b] ? a.attributes[b].value : null
        }
            , Dc = function(a) {
            var b = a.innerText || a.textContent || "";
            b && " " != b && (b = b.replace(/^[\s\xa0]+|[\s\xa0]+$/g, ""));
            b && (b = b.replace(/(\xa0+|\s{2,}|\n|\r\t)/g, " "));
            return b
        }
            , Ec = function(a) {
            var b = H.createElement("div"), c = b, d, e = nc("A<div>" + a + "</div>"), f = Ob(), g = f ? f.createHTML(e) : e;
            d = new kc(g,jc);
            if (1 === c.nodeType) {
                var h = c.tagName;
                if ("SCRIPT" === h || "STYLE" === h)
                    throw Error("");
            }
            c.innerHTML = d instanceof kc && d.constructor === kc ? d.m : "type_error:SafeHtml";
            b = b.lastChild;
            for (var m = []; b.firstChild; )
                m.push(b.removeChild(b.firstChild));
            return m
        }
            , Fc = function(a, b, c) {
            c = c || 100;
            for (var d = {}, e = 0; e < b.length; e++)
                d[b[e]] = !0;
            for (var f = a, g = 0; f && g <= c; g++) {
                if (d[String(f.tagName).toLowerCase()])
                    return f;
                f = f.parentElement
            }
            return null
        }
            , Gc = function(a) {
            var b;
            try {
                b = oc.sendBeacon && oc.sendBeacon(a)
            } catch (c) {
                kb("TAGGING", 15)
            }
            b || zc(a)
        }
            , Hc = function(a, b) {
            try {
                if (oc.sendBeacon)
                    return oc.sendBeacon(a, b)
            } catch (c) {
                kb("TAGGING", 15)
            }
            return !1
        }
            , Ic = {
            cache: "no-store",
            credentials: "include",
            keepalive: !0,
            method: "POST",
            mode: "no-cors",
            redirect: "follow"
        }
            , Jc = function(a, b, c) {
            if ("fetch"in G) {
                var d = Object.assign({}, Ic);
                b && (d.body = b);
                c && (c.attributionReporting && (d.attributionReporting = c.attributionReporting),
                c.browsingTopics && (d.browsingTopics = c.browsingTopics));
                try {
                    return G.fetch(a, d),
                        !0
                } catch (e) {}
            }
            if (c && c.noFallback)
                return !1;
            if (b)
                return Hc(a, b);
            Gc(a);
            return !0
        }
            , Kc = function(a, b) {
            var c = a[b];
            c && "string" === typeof c.animVal && (c = c.animVal);
            return c
        }
            , Lc = function() {
            var a = G.performance;
            if (a && ob(a.now))
                return a.now()
        }
            , Mc = function() {
            return G.performance || void 0
        };
        var Nc = function(a, b) {
            return this.evaluate(a) && this.evaluate(b)
        }
            , Oc = function(a, b) {
            return this.evaluate(a) === this.evaluate(b)
        }
            , Pc = function(a, b) {
            return this.evaluate(a) || this.evaluate(b)
        }
            , Qc = function(a, b) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            return -1 < String(a).indexOf(String(b))
        }
            , Rc = function(a, b) {
            a = String(this.evaluate(a));
            b = String(this.evaluate(b));
            return a.substring(0, b.length) === b
        }
            , Sc = function(a, b) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            switch (a) {
                case "pageLocation":
                    var c = G.location.href;
                    b instanceof ab && b.get("stripProtocol") && (c = c.replace(/^https?:\/\//, ""));
                    return c
            }
        };
        var Tc = function(a, b) {
            Qa.call(this);
            this.M = a;
            this.T = b
        };
        ya(Tc, Qa);
        aa = Tc.prototype;
        aa.toString = function() {
            return this.M
        }
        ;
        aa.getName = function() {
            return this.M
        }
        ;
        aa.Zb = function() {
            return new Ya(Ra(this, 1))
        }
        ;
        aa.invoke = function(a) {
            return this.T.apply(new Uc(this,a), Array.prototype.slice.call(arguments, 1))
        }
        ;
        aa.fb = function(a) {
            try {
                return this.invoke.apply(this, Array.prototype.slice.call(arguments, 0))
            } catch (b) {}
        }
        ;
        var Uc = function(a, b) {
            this.m = a;
            this.J = b
        };
        Uc.prototype.evaluate = function(a) {
            var b = this.J;
            return Array.isArray(a) ? Na(b, a) : a
        }
        ;
        Uc.prototype.getName = function() {
            return this.m.getName()
        }
        ;
        Uc.prototype.H = function() {
            return this.J.H()
        }
        ;
        var Vc = function() {
            this.map = new Map
        };
        Vc.prototype.set = function(a, b) {
            this.map.set(a, b)
        }
        ;
        Vc.prototype.get = function(a) {
            return this.map.get(a)
        }
        ;
        var Wc = function() {
            this.keys = [];
            this.values = []
        };
        Wc.prototype.set = function(a, b) {
            this.keys.push(a);
            this.values.push(b)
        }
        ;
        Wc.prototype.get = function(a) {
            var b = this.keys.indexOf(a);
            if (-1 < b)
                return this.values[b]
        }
        ;
        function Xc() {
            try {
                return Map ? new Vc : new Wc
            } catch (a) {
                return new Wc
            }
        }
        ;var Yc = function(a) {
            if (a instanceof Yc)
                return a;
            if (Wa(a))
                throw Error("Type of given value has an equivalent Pixie type.");
            this.value = a
        };
        Yc.prototype.getValue = function() {
            return this.value
        }
        ;
        Yc.prototype.toString = function() {
            return String(this.value)
        }
        ;
        var $c = function(a) {
            Qa.call(this);
            this.promise = a;
            this.set("then", Zc(this));
            this.set("catch", Zc(this, !0));
            this.set("finally", Zc(this, !1, !0))
        };
        ya($c, ab);
        var Zc = function(a, b, c) {
            b = void 0 === b ? !1 : b;
            c = void 0 === c ? !1 : c;
            return new Tc("",function(d, e) {
                    b && (e = d,
                        d = void 0);
                    c && (e = d);
                    d instanceof Tc || (d = void 0);
                    e instanceof Tc || (e = void 0);
                    var f = La(this.J)
                        , g = function(m) {
                        return function(n) {
                            return c ? (m.invoke(f),
                                a.promise) : m.invoke(f, n)
                        }
                    }
                        , h = a.promise.then(d && g(d), e && g(e));
                    return new $c(h)
                }
            )
        };
        function J(a, b, c) {
            var d = Xc()
                , e = function(g, h) {
                for (var m = Ra(g, 1), n = 0; n < m.length; n++)
                    h[m[n]] = f(g.get(m[n]))
            }
                , f = function(g) {
                var h = d.get(g);
                if (h)
                    return h;
                if (g instanceof Ya) {
                    var m = [];
                    d.set(g, m);
                    for (var n = g.Zb(), p = 0; p < n.length(); p++)
                        m[n.get(p)] = f(g.get(n.get(p)));
                    return m
                }
                if (g instanceof $c)
                    return g.promise;
                if (g instanceof ab) {
                    var q = {};
                    d.set(g, q);
                    e(g, q);
                    return q
                }
                if (g instanceof Tc) {
                    var t = function() {
                        for (var u = Array.prototype.slice.call(arguments, 0), v = 0; v < u.length; v++)
                            u[v] = ad(u[v], b, c);
                        var w = new Ja(b ? b.H() : new Ia);
                        b && (w.m = b.m);
                        return f(g.invoke.apply(g, [w].concat(u)))
                    };
                    d.set(g, t);
                    e(g, t);
                    return t
                }
                var r = !1;
                switch (c) {
                    case 1:
                        r = !0;
                        break;
                    case 2:
                        r = !1;
                        break;
                    case 3:
                        r = !1;
                        break;
                    default:
                }
                if (g instanceof Yc && r)
                    return g.getValue();
                switch (typeof g) {
                    case "boolean":
                    case "number":
                    case "string":
                    case "undefined":
                        return g;
                    case "object":
                        if (null === g)
                            return null
                }
            };
            return f(a)
        }
        function ad(a, b, c) {
            var d = Xc()
                , e = function(g, h) {
                for (var m in g)
                    g.hasOwnProperty(m) && h.set(m, f(g[m]))
            }
                , f = function(g) {
                var h = d.get(g);
                if (h)
                    return h;
                if (Array.isArray(g) || vb(g)) {
                    var m = new Ya([]);
                    d.set(g, m);
                    for (var n in g)
                        g.hasOwnProperty(n) && m.set(n, f(g[n]));
                    return m
                }
                if (Va(g)) {
                    var p = new ab;
                    d.set(g, p);
                    e(g, p);
                    return p
                }
                if ("function" === typeof g) {
                    var q = new Tc("",function() {
                            for (var x = Array.prototype.slice.call(arguments, 0), y = 0; y < x.length; y++)
                                x[y] = J(this.evaluate(x[y]), b, c);
                            return f((0,
                                this.J.M)(g, g, x))
                        }
                    );
                    d.set(g, q);
                    e(g, q);
                    return q
                }
                var v = typeof g;
                if (null === g || "string" === v || "number" === v || "boolean" === v)
                    return g;
                var w = !1;
                switch (c) {
                    case 1:
                        w = !0;
                        break;
                    case 2:
                        w = !1;
                        break;
                    default:
                }
                if (void 0 !== g && w)
                    return new Yc(g)
            };
            return f(a)
        }
        ;function bd() {
            var a = !1;
            return a
        }
        ;var cd = {
            supportedMethods: "concat every filter forEach hasOwnProperty indexOf join lastIndexOf map pop push reduce reduceRight reverse shift slice some sort splice unshift toString".split(" "),
            concat: function(a) {
                for (var b = [], c = 0; c < this.length(); c++)
                    b.push(this.get(c));
                for (var d = 1; d < arguments.length; d++)
                    if (arguments[d]instanceof Ya)
                        for (var e = arguments[d], f = 0; f < e.length(); f++)
                            b.push(e.get(f));
                    else
                        b.push(arguments[d]);
                return new Ya(b)
            },
            every: function(a, b) {
                for (var c = this.length(), d = 0; d < this.length() && d < c; d++)
                    if (this.has(d) && !b.invoke(a, this.get(d), d, this))
                        return !1;
                return !0
            },
            filter: function(a, b) {
                for (var c = this.length(), d = [], e = 0; e < this.length() && e < c; e++)
                    this.has(e) && b.invoke(a, this.get(e), e, this) && d.push(this.get(e));
                return new Ya(d)
            },
            forEach: function(a, b) {
                for (var c = this.length(), d = 0; d < this.length() && d < c; d++)
                    this.has(d) && b.invoke(a, this.get(d), d, this)
            },
            hasOwnProperty: function(a, b) {
                return this.has(b)
            },
            indexOf: function(a, b, c) {
                var d = this.length()
                    , e = void 0 === c ? 0 : Number(c);
                0 > e && (e = Math.max(d + e, 0));
                for (var f = e; f < d; f++)
                    if (this.has(f) && this.get(f) === b)
                        return f;
                return -1
            },
            join: function(a, b) {
                for (var c = [], d = 0; d < this.length(); d++)
                    c.push(this.get(d));
                return c.join(b)
            },
            lastIndexOf: function(a, b, c) {
                var d = this.length()
                    , e = d - 1;
                void 0 !== c && (e = 0 > c ? d + c : Math.min(c, e));
                for (var f = e; 0 <= f; f--)
                    if (this.has(f) && this.get(f) === b)
                        return f;
                return -1
            },
            map: function(a, b) {
                for (var c = this.length(), d = [], e = 0; e < this.length() && e < c; e++)
                    this.has(e) && (d[e] = b.invoke(a, this.get(e), e, this));
                return new Ya(d)
            },
            pop: function() {
                return this.pop()
            },
            push: function(a) {
                return this.push.apply(this, Array.prototype.slice.call(arguments, 1))
            },
            reduce: function(a, b, c) {
                var d = this.length(), e, f = 0;
                if (void 0 !== c)
                    e = c;
                else {
                    if (0 === d)
                        throw Error("TypeError: Reduce on List with no elements.");
                    for (var g = 0; g < d; g++)
                        if (this.has(g)) {
                            e = this.get(g);
                            f = g + 1;
                            break
                        }
                    if (g === d)
                        throw Error("TypeError: Reduce on List with no elements.");
                }
                for (var h = f; h < d; h++)
                    this.has(h) && (e = b.invoke(a, e, this.get(h), h, this));
                return e
            },
            reduceRight: function(a, b, c) {
                var d = this.length(), e, f = d - 1;
                if (void 0 !== c)
                    e = c;
                else {
                    if (0 === d)
                        throw Error("TypeError: ReduceRight on List with no elements.");
                    for (var g = 1; g <= d; g++)
                        if (this.has(d - g)) {
                            e = this.get(d - g);
                            f = d - (g + 1);
                            break
                        }
                    if (g > d)
                        throw Error("TypeError: ReduceRight on List with no elements.");
                }
                for (var h = f; 0 <= h; h--)
                    this.has(h) && (e = b.invoke(a, e, this.get(h), h, this));
                return e
            },
            reverse: function() {
                for (var a = $a(this), b = a.length - 1, c = 0; 0 <= b; b--,
                    c++)
                    a.hasOwnProperty(b) ? this.set(c, a[b]) : Za(this, c);
                return this
            },
            shift: function() {
                return this.shift()
            },
            slice: function(a, b, c) {
                var d = this.length();
                void 0 === b && (b = 0);
                b = 0 > b ? Math.max(d + b, 0) : Math.min(b, d);
                c = void 0 === c ? d : 0 > c ? Math.max(d + c, 0) : Math.min(c, d);
                c = Math.max(b, c);
                for (var e = [], f = b; f < c; f++)
                    e.push(this.get(f));
                return new Ya(e)
            },
            some: function(a, b) {
                for (var c = this.length(), d = 0; d < this.length() && d < c; d++)
                    if (this.has(d) && b.invoke(a, this.get(d), d, this))
                        return !0;
                return !1
            },
            sort: function(a, b) {
                var c = $a(this);
                void 0 === b ? c.sort() : c.sort(function(e, f) {
                    return Number(b.invoke(a, e, f))
                });
                for (var d = 0; d < c.length; d++)
                    c.hasOwnProperty(d) ? this.set(d, c[d]) : Za(this, d);
                return this
            },
            splice: function(a, b, c) {
                return this.splice.apply(this, Array.prototype.splice.call(arguments, 1, arguments.length - 1))
            },
            toString: function() {
                return this.toString()
            },
            unshift: function(a) {
                return this.unshift.apply(this, Array.prototype.slice.call(arguments, 1))
            }
        };
        var dd = function(a) {
            var b;
            b = Error.call(this, a);
            this.message = b.message;
            "stack"in b && (this.stack = b.stack)
        };
        ya(dd, Error);
        var ed = {
            charAt: 1,
            concat: 1,
            indexOf: 1,
            lastIndexOf: 1,
            match: 1,
            replace: 1,
            search: 1,
            slice: 1,
            split: 1,
            substring: 1,
            toLowerCase: 1,
            toLocaleLowerCase: 1,
            toString: 1,
            toUpperCase: 1,
            toLocaleUpperCase: 1,
            trim: 1
        }
            , fd = new Ga("break")
            , gd = new Ga("continue");
        function hd(a, b) {
            return this.evaluate(a) + this.evaluate(b)
        }
        function id(a, b) {
            return this.evaluate(a) && this.evaluate(b)
        }
        function jd(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            if (!(c instanceof Ya))
                throw Error("Error: Non-List argument given to Apply instruction.");
            if (null === a || void 0 === a) {
                var d = "TypeError: Can't read property " + b + " of " + a + ".";
                if (bd())
                    throw new dd(d);
                throw Error(d);
            }
            var e = "number" === typeof a;
            if ("boolean" === typeof a || e) {
                if ("toString" === b) {
                    if (e && c.length()) {
                        var f = J(c.get(0));
                        try {
                            return a.toString(f)
                        } catch (y) {}
                    }
                    return a.toString()
                }
                var g = "TypeError: " + a + "." + b + " is not a function.";
                if (bd())
                    throw new dd(g);
                throw Error(g);
            }
            if ("string" === typeof a) {
                if (ed.hasOwnProperty(b)) {
                    var h = 2;
                    h = 1;
                    var m = J(c, void 0, h);
                    return ad(a[b].apply(a, m), this.J)
                }
                var n = "TypeError: " + b + " is not a function";
                if (bd())
                    throw new dd(n);
                throw Error(n);
            }
            if (a instanceof Ya) {
                if (a.has(b)) {
                    var p = a.get(b);
                    if (p instanceof Tc) {
                        var q = $a(c);
                        q.unshift(this.J);
                        return p.invoke.apply(p, q)
                    }
                    var t = "TypeError: " + b + " is not a function";
                    if (bd())
                        throw new dd(t);
                    throw Error(t);
                }
                if (0 <= cd.supportedMethods.indexOf(b)) {
                    var r = $a(c);
                    r.unshift(this.J);
                    return cd[b].apply(a, r)
                }
            }
            if (a instanceof Tc || a instanceof ab) {
                if (a.has(b)) {
                    var u = a.get(b);
                    if (u instanceof Tc) {
                        var v = $a(c);
                        v.unshift(this.J);
                        return u.invoke.apply(u, v)
                    }
                    var w = "TypeError: " + b + " is not a function";
                    if (bd())
                        throw new dd(w);
                    throw Error(w);
                }
                if ("toString" === b)
                    return a instanceof Tc ? a.getName() : a.toString();
                if ("hasOwnProperty" === b)
                    return a.has.apply(a, $a(c))
            }
            if (a instanceof Yc && "toString" === b)
                return a.toString();
            var x = "TypeError: Object has no '" + b + "' property.";
            if (bd())
                throw new dd(x);
            throw Error(x);
        }
        function kd(a, b) {
            a = this.evaluate(a);
            if ("string" !== typeof a)
                throw Error("Invalid key name given for assignment.");
            var c = this.J;
            if (!c.has(a))
                throw Error("Attempting to assign to undefined value " + b);
            var d = this.evaluate(b);
            c.set(a, d);
            return d
        }
        function ld() {
            var a = La(this.J)
                , b = Ma(a, Array.prototype.slice.apply(arguments));
            if (b instanceof Ga)
                return b
        }
        function md() {
            return fd
        }
        function nd(a) {
            for (var b = this.evaluate(a), c = 0; c < b.length; c++) {
                var d = this.evaluate(b[c]);
                if (d instanceof Ga)
                    return d
            }
        }
        function od() {
            for (var a = this.J, b = 0; b < arguments.length - 1; b += 2) {
                var c = arguments[b];
                if ("string" === typeof c) {
                    var d = this.evaluate(arguments[b + 1]);
                    Ka(a, c, d, !0)
                }
            }
        }
        function qd() {
            return gd
        }
        function rd(a, b) {
            return new Ga(a,this.evaluate(b))
        }
        function sd(a, b) {
            var c = new Ya;
            b = this.evaluate(b);
            for (var d = 0; d < b.length; d++)
                c.push(b[d]);
            var e = [51, a, c].concat(Array.prototype.splice.call(arguments, 2, arguments.length - 2));
            this.J.add(a, this.evaluate(e))
        }
        function td(a, b) {
            return this.evaluate(a) / this.evaluate(b)
        }
        function ud(a, b) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            var c = a instanceof Yc
                , d = b instanceof Yc;
            return c || d ? c && d ? a.getValue() === b.getValue() : !1 : a == b
        }
        function vd() {
            for (var a, b = 0; b < arguments.length; b++)
                a = this.evaluate(arguments[b]);
            return a
        }
        function wd(a, b, c, d) {
            for (var e = 0; e < b(); e++) {
                var f = a(c(e))
                    , g = Ma(f, d);
                if (g instanceof Ga) {
                    if ("break" === g.type)
                        break;
                    if ("return" === g.type)
                        return g
                }
            }
        }
        function xd(a, b, c) {
            if ("string" === typeof b)
                return wd(a, function() {
                    return b.length
                }, function(f) {
                    return f
                }, c);
            if (b instanceof ab || b instanceof Ya || b instanceof Tc) {
                var d = b.Zb()
                    , e = d.length();
                return wd(a, function() {
                    return e
                }, function(f) {
                    return d.get(f)
                }, c)
            }
        }
        function yd(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            var d = this.J;
            return xd(function(e) {
                d.set(a, e);
                return d
            }, b, c)
        }
        function zd(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            var d = this.J;
            return xd(function(e) {
                var f = La(d);
                Ka(f, a, e, !0);
                return f
            }, b, c)
        }
        function Ad(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            var d = this.J;
            return xd(function(e) {
                var f = La(d);
                f.add(a, e);
                return f
            }, b, c)
        }
        function Bd(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            var d = this.J;
            return Cd(function(e) {
                d.set(a, e);
                return d
            }, b, c)
        }
        function Dd(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            var d = this.J;
            return Cd(function(e) {
                var f = La(d);
                Ka(f, a, e, !0);
                return f
            }, b, c)
        }
        function Ed(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            var d = this.J;
            return Cd(function(e) {
                var f = La(d);
                f.add(a, e);
                return f
            }, b, c)
        }
        function Cd(a, b, c) {
            if ("string" === typeof b)
                return wd(a, function() {
                    return b.length
                }, function(d) {
                    return b[d]
                }, c);
            if (b instanceof Ya)
                return wd(a, function() {
                    return b.length()
                }, function(d) {
                    return b.get(d)
                }, c);
            if (bd())
                throw new dd("The value is not iterable.");
            throw new TypeError("The value is not iterable.");
        }
        function Fd(a, b, c, d) {
            function e(p, q) {
                for (var t = 0; t < f.length(); t++) {
                    var r = f.get(t);
                    q.add(r, p.get(r))
                }
            }
            var f = this.evaluate(a);
            if (!(f instanceof Ya))
                throw Error("TypeError: Non-List argument given to ForLet instruction.");
            var g = this.J;
            d = this.evaluate(d);
            var h = La(g);
            for (e(g, h); Na(h, b); ) {
                var m = Ma(h, d);
                if (m instanceof Ga) {
                    if ("break" === m.type)
                        break;
                    if ("return" === m.type)
                        return m
                }
                var n = La(g);
                e(h, n);
                Na(n, c);
                h = n
            }
        }
        function Gd(a, b) {
            var c = this.J
                , d = this.evaluate(b);
            if (!(d instanceof Ya))
                throw Error("Error: non-List value given for Fn argument names.");
            var e = Array.prototype.slice.call(arguments, 2);
            return new Tc(a,function() {
                return function(f) {
                    var g = La(c);
                    void 0 === g.m && (g.m = this.J.m);
                    for (var h = Array.prototype.slice.call(arguments, 0), m = 0; m < h.length; m++)
                        if (h[m] = this.evaluate(h[m]),
                        h[m]instanceof Ga)
                            return h[m];
                    for (var n = d.get("length"), p = 0; p < n; p++)
                        p < h.length ? g.add(d.get(p), h[p]) : g.add(d.get(p), void 0);
                    g.add("arguments", new Ya(h));
                    var q = Ma(g, e);
                    if (q instanceof Ga)
                        return "return" === q.type ? q.data : q
                }
            }())
        }
        function Hd(a) {
            a = this.evaluate(a);
            var b = this.J;
            if (Id && !b.has(a))
                throw new ReferenceError(a + " is not defined.");
            return b.get(a)
        }
        function Jd(a, b) {
            var c;
            a = this.evaluate(a);
            b = this.evaluate(b);
            if (void 0 === a || null === a) {
                var d = "TypeError: Cannot read properties of " + a + " (reading '" + b + "')";
                if (bd())
                    throw new dd(d);
                throw Error(d);
            }
            if (a instanceof ab || a instanceof Ya || a instanceof Tc)
                c = a.get(b);
            else if ("string" === typeof a)
                "length" === b ? c = a.length : Xa(b) && (c = a[b]);
            else if (a instanceof Yc)
                return;
            return c
        }
        function Kd(a, b) {
            return this.evaluate(a) > this.evaluate(b)
        }
        function Ld(a, b) {
            return this.evaluate(a) >= this.evaluate(b)
        }
        function Md(a, b) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            a instanceof Yc && (a = a.getValue());
            b instanceof Yc && (b = b.getValue());
            return a === b
        }
        function Nd(a, b) {
            return !Md.call(this, a, b)
        }
        function Od(a, b, c) {
            var d = [];
            this.evaluate(a) ? d = this.evaluate(b) : c && (d = this.evaluate(c));
            var e = Ma(this.J, d);
            if (e instanceof Ga)
                return e
        }
        var Id = !1;
        function Pd(a, b) {
            return this.evaluate(a) < this.evaluate(b)
        }
        function Qd(a, b) {
            return this.evaluate(a) <= this.evaluate(b)
        }
        function Rd() {
            for (var a = new Ya, b = 0; b < arguments.length; b++) {
                var c = this.evaluate(arguments[b]);
                a.push(c)
            }
            return a
        }
        function Sd() {
            for (var a = new ab, b = 0; b < arguments.length - 1; b += 2) {
                var c = this.evaluate(arguments[b]) + ""
                    , d = this.evaluate(arguments[b + 1]);
                a.set(c, d)
            }
            return a
        }
        function Td(a, b) {
            return this.evaluate(a) % this.evaluate(b)
        }
        function Ud(a, b) {
            return this.evaluate(a) * this.evaluate(b)
        }
        function Vd(a) {
            return -this.evaluate(a)
        }
        function Wd(a) {
            return !this.evaluate(a)
        }
        function Xd(a, b) {
            return !ud.call(this, a, b)
        }
        function Yd() {
            return null
        }
        function Zd(a, b) {
            return this.evaluate(a) || this.evaluate(b)
        }
        function $d(a, b) {
            var c = this.evaluate(a);
            this.evaluate(b);
            return c
        }
        function ae(a) {
            return this.evaluate(a)
        }
        function be() {
            return Array.prototype.slice.apply(arguments)
        }
        function ce(a) {
            return new Ga("return",this.evaluate(a))
        }
        function de(a, b, c) {
            a = this.evaluate(a);
            b = this.evaluate(b);
            c = this.evaluate(c);
            if (null === a || void 0 === a) {
                var d = "TypeError: Can't set property " + b + " of " + a + ".";
                if (bd())
                    throw new dd(d);
                throw Error(d);
            }
            (a instanceof Tc || a instanceof Ya || a instanceof ab) && a.set(b, c);
            return c
        }
        function ee(a, b) {
            return this.evaluate(a) - this.evaluate(b)
        }
        function fe(a, b, c) {
            a = this.evaluate(a);
            var d = this.evaluate(b)
                , e = this.evaluate(c);
            if (!Array.isArray(d) || !Array.isArray(e))
                throw Error("Error: Malformed switch instruction.");
            for (var f, g = !1, h = 0; h < d.length; h++)
                if (g || a === this.evaluate(d[h]))
                    if (f = this.evaluate(e[h]),
                    f instanceof Ga) {
                        var m = f.type;
                        if ("break" === m)
                            return;
                        if ("return" === m || "continue" === m)
                            return f
                    } else
                        g = !0;
            if (e.length === d.length + 1 && (f = this.evaluate(e[e.length - 1]),
            f instanceof Ga && ("return" === f.type || "continue" === f.type)))
                return f
        }
        function ge(a, b, c) {
            return this.evaluate(a) ? this.evaluate(b) : this.evaluate(c)
        }
        function he(a) {
            a = this.evaluate(a);
            return a instanceof Tc ? "function" : typeof a
        }
        function ie() {
            for (var a = this.J, b = 0; b < arguments.length; b++) {
                var c = arguments[b];
                "string" !== typeof c || a.add(c, void 0)
            }
        }
        function je(a, b, c, d) {
            var e = this.evaluate(d);
            if (this.evaluate(c)) {
                var f = Ma(this.J, e);
                if (f instanceof Ga) {
                    if ("break" === f.type)
                        return;
                    if ("return" === f.type)
                        return f
                }
            }
            for (; this.evaluate(a); ) {
                var g = Ma(this.J, e);
                if (g instanceof Ga) {
                    if ("break" === g.type)
                        break;
                    if ("return" === g.type)
                        return g
                }
                this.evaluate(b)
            }
        }
        function ke(a) {
            return ~Number(this.evaluate(a))
        }
        function le(a, b) {
            return Number(this.evaluate(a)) << Number(this.evaluate(b))
        }
        function me(a, b) {
            return Number(this.evaluate(a)) >> Number(this.evaluate(b))
        }
        function ne(a, b) {
            return Number(this.evaluate(a)) >>> Number(this.evaluate(b))
        }
        function oe(a, b) {
            return Number(this.evaluate(a)) & Number(this.evaluate(b))
        }
        function pe(a, b) {
            return Number(this.evaluate(a)) ^ Number(this.evaluate(b))
        }
        function qe(a, b) {
            return Number(this.evaluate(a)) | Number(this.evaluate(b))
        }
        function re() {}
        function se(a, b, c, d, e) {
            var f = !0;
            try {
                var g = this.evaluate(c);
                if (g instanceof Ga)
                    return g
            } catch (t) {
                if (!(t instanceof dd && a))
                    throw f = t instanceof dd,
                        t;
                var h = La(this.J)
                    , m = new Yc(t);
                h.add(b, m);
                var n = this.evaluate(d)
                    , p = Ma(h, n);
                if (p instanceof Ga)
                    return p
            } finally {
                if (f && void 0 !== e) {
                    var q = this.evaluate(e);
                    if (q instanceof Ga)
                        return q
                }
            }
        }
        ;var ue = function() {
            this.m = new Pa;
            te(this)
        };
        ue.prototype.execute = function(a) {
            return this.m.F(a)
        }
        ;
        var te = function(a) {
            var b = function(c, d) {
                var e = new Tc(String(c),d);
                e.Lb();
                a.m.m.set(String(c), e)
            };
            b("map", Sd);
            b("and", Nc);
            b("contains", Qc);
            b("equals", Oc);
            b("or", Pc);
            b("startsWith", Rc);
            b("variable", Sc)
        };
        var we = function() {
            this.F = !1;
            this.m = new Pa;
            ve(this);
            this.F = !0
        };
        we.prototype.execute = function(a) {
            return xe(this.m.F(a))
        }
        ;
        var ye = function(a, b, c) {
            return xe(a.m.T(b, c))
        }
            , ve = function(a) {
            var b = function(c, d) {
                var e = String(c)
                    , f = new Tc(e,d);
                f.Lb();
                a.m.m.set(e, f)
            };
            b(0, hd);
            b(1, id);
            b(2, jd);
            b(3, kd);
            b(56, oe);
            b(57, le);
            b(58, ke);
            b(59, qe);
            b(60, me);
            b(61, ne);
            b(62, pe);
            b(53, ld);
            b(4, md);
            b(5, nd);
            b(52, od);
            b(6, qd);
            b(49, rd);
            b(7, Rd);
            b(8, Sd);
            b(9, nd);
            b(50, sd);
            b(10, td);
            b(12, ud);
            b(13, vd);
            b(51, Gd);
            b(47, yd);
            b(54, zd);
            b(55, Ad);
            b(63, Fd);
            b(64, Bd);
            b(65, Dd);
            b(66, Ed);
            b(15, Hd);
            b(16, Jd);
            b(17, Jd);
            b(18, Kd);
            b(19, Ld);
            b(20, Md);
            b(21, Nd);
            b(22, Od);
            b(23, Pd);
            b(24, Qd);
            b(25, Td);
            b(26, Ud);
            b(27, Vd);
            b(28, Wd);
            b(29, Xd);
            b(45, Yd);
            b(30, Zd);
            b(32, $d);
            b(33, $d);
            b(34, ae);
            b(35, ae);
            b(46, be);
            b(36, ce);
            b(43, de);
            b(37, ee);
            b(38, fe);
            b(39, ge);
            b(67, se);
            b(40, he);
            b(44, re);
            b(41, ie);
            b(42, je)
        };
        we.prototype.H = function() {
            return this.m.H()
        }
        ;
        function xe(a) {
            if (a instanceof Ga || a instanceof Tc || a instanceof Ya || a instanceof ab || a instanceof Yc || null === a || void 0 === a || "string" === typeof a || "number" === typeof a || "boolean" === typeof a)
                return a
        }
        ;var ze = function(a) {
            this.message = a
        };
        function Ae(a) {
            var b = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[a];
            return void 0 === b ? new ze("Value " + a + " can not be encoded in web-safe base64 dictionary.") : b
        }
        ;function Be(a) {
            switch (a) {
                case 1:
                    return "1";
                case 2:
                case 4:
                    return "0";
                default:
                    return "-"
            }
        }
        ;var Ce = function() {
            var a = function(b) {
                return {
                    toString: function() {
                        return b
                    }
                }
            };
            return {
                rk: a("consent"),
                ei: a("convert_case_to"),
                fi: a("convert_false_to"),
                gi: a("convert_null_to"),
                hi: a("convert_true_to"),
                ii: a("convert_undefined_to"),
                nn: a("debug_mode_metadata"),
                ra: a("function"),
                Pg: a("instance_name"),
                Qk: a("live_only"),
                Rk: a("malware_disabled"),
                Sk: a("metadata"),
                Vk: a("original_activity_id"),
                An: a("original_vendor_template_id"),
                zn: a("once_on_load"),
                Uk: a("once_per_event"),
                oj: a("once_per_load"),
                En: a("priority_override"),
                Gn: a("respected_consent_types"),
                vj: a("setup_tags"),
                pe: a("tag_id"),
                Bj: a("teardown_tags")
            }
        }();
        var Ye;
        var Ze = [], $e = [], af = [], bf = [], cf = [], df = {}, ef, ff, gf = function(a) {
            ff = ff || a
        }, hf = function(a) {}, jf, kf = [], lf = [], mf = function(a, b) {
            var c = {};
            c[Ce.ra] = "__" + a;
            for (var d in b)
                b.hasOwnProperty(d) && (c["vtp_" + d] = b[d]);
            return c
        }, nf = function(a, b) {
            var c = a[Ce.ra]
                , d = b && b.event;
            if (!c)
                throw Error("Error: No function name given for function call.");
            var e = df[c], f = b && 2 === b.type && d.reportMacroDiscrepancy && e && -1 !== kf.indexOf(c), g = {}, h = {}, m;
            for (m in a)
                a.hasOwnProperty(m) && 0 === m.indexOf("vtp_") && (e && (g[m] = a[m]),
                !e || f) && (h[m.substr(4)] = a[m]);
            e && d && d.cachedModelValues && (g.vtp_gtmCachedValues = d.cachedModelValues);
            if (b) {
                if (null == b.name) {
                    var n;
                    a: {
                        var p = b.type
                            , q = b.index;
                        if (null == q)
                            n = "";
                        else {
                            var t;
                            switch (p) {
                                case 2:
                                    t = Ze[q];
                                    break;
                                case 1:
                                    t = bf[q];
                                    break;
                                default:
                                    n = "";
                                    break a
                            }
                            var r = t && t[Ce.Pg];
                            n = r ? String(r) : ""
                        }
                    }
                    b.name = n
                }
                e && (g.vtp_gtmEntityIndex = b.index,
                    g.vtp_gtmEntityName = b.name)
            }
            var u, v, w;
            if (f && -1 === lf.indexOf(c)) {
                lf.push(c);
                var x = Cb();
                u = e(g);
                var y = Cb() - x
                    , B = Cb();
                v = Ye(c, h, b);
                w = y - (Cb() - B)
            } else if (e && (u = e(g)),
            !e || f)
                v = Ye(c, h, b);
            f && d && (d.reportMacroDiscrepancy(d.id, c, void 0, !0),
                Wa(u) ? (Array.isArray(u) ? Array.isArray(v) : Va(u) ? Va(v) : "function" === typeof u ? "function" === typeof v : u === v) || d.reportMacroDiscrepancy(d.id, c) : u !== v && d.reportMacroDiscrepancy(d.id, c),
            void 0 != w && d.reportMacroDiscrepancy(d.id, c, w));
            return e ? u : v
        }, pf = function(a, b, c) {
            c = c || [];
            var d = {}, e;
            for (e in a)
                a.hasOwnProperty(e) && (d[e] = of(a[e], b, c));
            return d
        }, of = function(a, b, c) {
            if (Array.isArray(a)) {
                var d;
                switch (a[0]) {
                    case "function_id":
                        return a[1];
                    case "list":
                        d = [];
                        for (var e = 1; e < a.length; e++)
                            d.push(of(a[e], b, c));
                        return d;
                    case "macro":
                        var f = a[1];
                        if (c[f])
                            return;
                        var g = Ze[f];
                        if (!g || b.isBlocked(g))
                            return;
                        c[f] = !0;
                        var h = String(g[Ce.Pg]);
                        try {
                            var m = pf(g, b, c);
                            m.vtp_gtmEventId = b.id;
                            b.priorityId && (m.vtp_gtmPriorityId = b.priorityId);
                            d = nf(m, {
                                event: b,
                                index: f,
                                type: 2,
                                name: h
                            });
                            jf && (d = jf.ql(d, m))
                        } catch (y) {
                            b.logMacroError && b.logMacroError(y, Number(f), h),
                                d = !1
                        }
                        c[f] = !1;
                        return d;
                    case "map":
                        d = {};
                        for (var n = 1; n < a.length; n += 2)
                            d[of(a[n], b, c)] = of(a[n + 1], b, c);
                        return d;
                    case "template":
                        d = [];
                        for (var p = !1, q = 1; q < a.length; q++) {
                            var t = of(a[q], b, c);
                            ff && (p = p || ff.dm(t));
                            d.push(t)
                        }
                        return ff && p ? ff.vl(d) : d.join("");
                    case "escape":
                        d = of(a[1], b, c);
                        if (ff && Array.isArray(a[1]) && "macro" === a[1][0] && ff.fm(a))
                            return ff.Dm(d);
                        d = String(d);
                        for (var r = 2; r < a.length; r++)
                            De[a[r]] && (d = De[a[r]](d));
                        return d;
                    case "tag":
                        var u = a[1];
                        if (!bf[u])
                            throw Error("Unable to resolve tag reference " + u + ".");
                        return {
                            Lj: a[2],
                            index: u
                        };
                    case "zb":
                        var v = {
                            arg0: a[2],
                            arg1: a[3],
                            ignore_case: a[5]
                        };
                        v[Ce.ra] = a[1];
                        var w = qf(v, b, c)
                            , x = !!a[4];
                        return x || 2 !== w ? x !== (1 === w) : null;
                    default:
                        throw Error("Attempting to expand unknown Value type: " + a[0] + ".");
                }
            }
            return a
        }, qf = function(a, b, c) {
            try {
                return ef(pf(a, b, c))
            } catch (d) {
                JSON.stringify(a)
            }
            return 2
        }, rf = function(a) {
            var b = a[Ce.ra];
            if (!b)
                throw Error("Error: No function name given for function call.");
            return !!df[b]
        };
        var sf = function(a, b, c) {
            var d;
            d = Error.call(this, c);
            this.message = d.message;
            "stack"in d && (this.stack = d.stack);
            this.m = a;
            this.name = "PermissionError"
        };
        ya(sf, Error);
        function tf(a, b) {
            if (Array.isArray(a)) {
                Object.defineProperty(a, "context", {
                    value: {
                        line: b[0]
                    }
                });
                for (var c = 1; c < a.length; c++)
                    tf(a[c], b[c])
            }
        }
        ;var uf = function(a, b) {
            var c;
            c = Error.call(this);
            this.message = c.message;
            "stack"in c && (this.stack = c.stack);
            this.xm = a;
            this.F = b;
            this.m = []
        };
        ya(uf, Error);
        var wf = function() {
            return function(a, b) {
                a instanceof uf || (a = new uf(a,vf));
                b && a.m.push(b);
                throw a;
            }
        };
        function vf(a) {
            if (!a.length)
                return a;
            a.push({
                id: "main",
                line: 0
            });
            for (var b = a.length - 1; 0 < b; b--)
                pb(a[b].id) && a.splice(b++, 1);
            for (var c = a.length - 1; 0 < c; c--)
                a[c].line = a[c - 1].line;
            a.splice(0, 1);
            return a
        }
        ;var zf = function(a) {
            function b(t) {
                for (var r = 0; r < t.length; r++)
                    d[t[r]] = !0
            }
            for (var c = [], d = [], e = xf(a), f = 0; f < $e.length; f++) {
                var g = $e[f]
                    , h = yf(g, e);
                if (h) {
                    for (var m = g.add || [], n = 0; n < m.length; n++)
                        c[m[n]] = !0;
                    b(g.block || [])
                } else
                    null === h && b(g.block || []);
            }
            for (var p = [], q = 0; q < bf.length; q++)
                c[q] && !d[q] && (p[q] = !0);
            return p
        }
            , yf = function(a, b) {
                for (var c = a["if"] || [], d = 0; d < c.length; d++) {
                    var e = b(c[d]);
                    if (0 === e)
                        return !1;
                    if (2 === e)
                        return null
                }
                for (var f = a.unless || [], g = 0; g < f.length; g++) {
                    var h = b(f[g]);
                    if (2 === h)
                        return null;
                    if (1 === h)
                        return !1
                }
                return !0
            }
            , xf = function(a) {
                var b = [];
                return function(c) {
                    void 0 === b[c] && (b[c] = qf(af[c], a));
                    return b[c]
                }
            };
        var Af = {
            ql: function(a, b) {
                b[Ce.ei] && "string" === typeof a && (a = 1 == b[Ce.ei] ? a.toLowerCase() : a.toUpperCase());
                b.hasOwnProperty(Ce.gi) && null === a && (a = b[Ce.gi]);
                b.hasOwnProperty(Ce.ii) && void 0 === a && (a = b[Ce.ii]);
                b.hasOwnProperty(Ce.hi) && !0 === a && (a = b[Ce.hi]);
                b.hasOwnProperty(Ce.fi) && !1 === a && (a = b[Ce.fi]);
                return a
            }
        };
        var Bf = function() {
            this.m = {}
        }
            , Df = function(a, b) {
            var c = Cf.F, d;
            null != (d = c.m)[a] || (d[a] = []);
            c.m[a].push(function() {
                return b.apply(null, pa(za.apply(0, arguments)))
            })
        };
        function Ef(a, b, c, d) {
            if (a)
                for (var e = 0; e < a.length; e++) {
                    var f = void 0
                        , g = "A policy function denied the permission request";
                    try {
                        f = a[e](b, c, d),
                            g += "."
                    } catch (h) {
                        g = "string" === typeof h ? g + (": " + h) : h instanceof Error ? g + (": " + h.message) : g + "."
                    }
                    if (!f)
                        throw new sf(c,d,g);
                }
        }
        function Ff(a, b, c) {
            return function() {
                var d = arguments[0];
                if (d) {
                    var e = a.m[d]
                        , f = a.m.all;
                    if (e || f) {
                        var g = c.apply(void 0, Array.prototype.slice.call(arguments, 0));
                        Ef(e, b, d, g);
                        Ef(f, b, d, g)
                    }
                }
            }
        }
        ;var Jf = function() {
            var a = data.permissions || {}
                , b = Gf.ctid
                , c = this;
            this.F = new Bf;
            this.m = {};
            var d = {}
                , e = {}
                , f = Ff(this.F, b, function() {
                var g = arguments[0];
                return g && d[g] ? d[g].apply(void 0, Array.prototype.slice.call(arguments, 0)) : {}
            });
            z(a, function(g, h) {
                var m = {};
                z(h, function(p, q) {
                    var t = Hf(p, q);
                    m[p] = t.assert;
                    d[p] || (d[p] = t.O);
                    t.Fj && !e[p] && (e[p] = t.Fj)
                });
                var n = function(p) {
                    var q = za.apply(1, arguments);
                    if (!m[p])
                        throw If(p, {}, "The requested additional permission " + p + " is not configured.");
                    f.apply(null, [p].concat(pa(q)))
                };
                c.m[g] = function(p, q) {
                    var t = m[p];
                    if (!t)
                        throw If(p, {}, "The requested permission " + p + " is not configured.");
                    var r = Array.prototype.slice.call(arguments, 0);
                    t.apply(void 0, r);
                    f.apply(void 0, r);
                    var u = e[p];
                    u && u.apply(null, [n].concat(pa(r.slice(1))))
                }
            })
        }
            , Kf = function(a) {
                return Cf.m[a] || function() {}
            };
        function Hf(a, b) {
            var c = mf(a, b);
            c.vtp_permissionName = a;
            c.vtp_createPermissionError = If;
            try {
                return nf(c)
            } catch (d) {
                return {
                    assert: function(e) {
                        throw new sf(e,{},"Permission " + e + " is unknown.");
                    },
                    O: function() {
                        throw new sf(a,{},"Permission " + a + " is unknown.");
                    }
                }
            }
        }
        function If(a, b, c) {
            return new sf(a,b,c)
        }
        ;var Lf = !1;
        var Mf = {};
        Mf.fn = xb('');
        Mf.yl = xb('');
        var Nf = Lf
            , Of = Mf.yl
            , Pf = Mf.fn;
        var Tf = function(a) {
            var b = {}
                , c = 0;
            z(a, function(e, f) {
                if (null != f)
                    if (f = ("" + f).replace(/~/g, "~~"),
                        Qf.hasOwnProperty(e))
                        b[Qf[e]] = f;
                    else if (Rf.hasOwnProperty(e)) {
                        var g = Rf[e]
                            , h = f;
                        b.hasOwnProperty(g) || (b[g] = h)
                    } else if ("category" === e)
                        for (var m = f.split("/", 5), n = 0; n < m.length; n++) {
                            var p = b
                                , q = Sf[n]
                                , t = m[n];
                            p.hasOwnProperty(q) || (p[q] = t)
                        }
                    else if (27 > c) {
                        var r = String.fromCharCode(10 > c ? 48 + c : 65 + c - 10);
                        b["k" + r] = ("" + String(e)).replace(/~/g, "~~");
                        b["v" + r] = f;
                        c++
                    }
            });
            var d = [];
            z(b, function(e, f) {
                d.push("" + e + f)
            });
            return d.join("~")
        }
            , Qf = {
            item_id: "id",
            item_name: "nm",
            item_brand: "br",
            item_category: "ca",
            item_category2: "c2",
            item_category3: "c3",
            item_category4: "c4",
            item_category5: "c5",
            item_variant: "va",
            price: "pr",
            quantity: "qt",
            coupon: "cp",
            item_list_name: "ln",
            index: "lp",
            item_list_id: "li",
            discount: "ds",
            affiliation: "af",
            promotion_id: "pi",
            promotion_name: "pn",
            creative_name: "cn",
            creative_slot: "cs",
            location_id: "lo"
        }
            , Rf = {
            id: "id",
            name: "nm",
            brand: "br",
            variant: "va",
            list_name: "ln",
            list_position: "lp",
            list: "ln",
            position: "lp",
            creative: "cn"
        }
            , Sf = ["ca", "c2", "c3", "c4", "c5"];
        var Uf = function(a) {
            var b = [];
            z(a, function(c, d) {
                null != d && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(String(d)))
            });
            return b.join("&")
        }
            , Vf = function(a, b, c, d) {
            this.na = a.na;
            this.Pc = a.Pc;
            this.kh = a.kh;
            this.baseUrl = b;
            this.H = c;
            this.F = Uf(a.na);
            this.m = Uf(a.kh);
            this.M = this.m.length;
            if (d && 16384 < this.M)
                throw Error("EVENT_TOO_LARGE");
        };
        var Wf = function() {
            this.events = [];
            this.m = "";
            this.na = {};
            this.baseUrl = "";
            this.H = 0;
            this.M = this.F = !1;
        };
        Wf.prototype.add = function(a) {
            return this.T(a) ? (this.events.push(a),
                this.m = a.F,
                this.na = a.na,
                this.baseUrl = a.baseUrl,
                this.H += a.M,
                this.F = a.H,
                !0) : !1
        }
        ;
        Wf.prototype.T = function(a) {
            return this.events.length ? 20 <= this.events.length || 16384 <= a.M + this.H ? !1 : this.baseUrl === a.baseUrl && this.F === a.H && this.da(a) : !0
        }
        ;
        Wf.prototype.da = function(a) {
            var b = this;
            if (this.M) {
                var c = Object.keys(this.na);
                return c.length === Object.keys(a.na).length && c.every(function(d) {
                    return a.na.hasOwnProperty(d) && String(b.na[d]) === String(a.na[d])
                })
            }
            return this.m === a.F
        }
        ;
        var Xf = {}
            , Yf = (Xf.uaa = !0,
            Xf.uab = !0,
            Xf.uafvl = !0,
            Xf.uamb = !0,
            Xf.uam = !0,
            Xf.uap = !0,
            Xf.uapv = !0,
            Xf.uaw = !0,
            Xf);
        var Zf = function(a, b) {
            z(a, function(c, d) {
                null != d && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(d))
            })
        }
            , $f = function(a, b) {
            var c = [];
            a.F && c.push(a.F);
            b && c.push("_s=" + b);
            Zf(a.Pc, c);
            var d = !1;
            a.m && (c.push(a.m),
                d = !0);
            var e = c.join("&")
                , f = ""
                , g = e.length + a.baseUrl.length + 1;
            d && 2048 < g && (f = c.pop(),
                e = c.join("&"));
            return {
                params: e,
                body: f
            }
        }
            , ag = function(a, b) {
            var c = a.events;
            if (1 == c.length)
                return $f(c[0], b);
            var d = [];
            a.m && d.push(a.m);
            for (var e = {}, f = 0; f < c.length; f++)
                z(c[f].Pc, function(r, u) {
                    null != u && (e[r] = e[r] || {},
                        e[r][String(u)] = e[r][String(u)] + 1 || 1)
                });
            var g = {};
            z(e, function(r, u) {
                var v, w = -1, x = 0;
                z(u, function(y, B) {
                    x += B;
                    var A = (y.length + r.length + 2) * (B - 1);
                    A > w && (v = y,
                        w = A)
                });
                x == c.length && (g[r] = v)
            });
            Zf(g, d);
            b && d.push("_s=" + b);
            for (var h = d.join("&"), m = [], n = {}, p = 0; p < c.length; n = {
                Eh: void 0
            },
                p++) {
                var q = [];
                n.Eh = {};
                z(c[p].Pc, function(r) {
                    return function(u, v) {
                        g[u] != "" + v && (r.Eh[u] = v)
                    }
                }(n));
                c[p].m && q.push(c[p].m);
                Zf(n.Eh, q);
                m.push(q.join("&"))
            }
            var t = m.join("\r\n");
            return {
                params: h,
                body: t
            }
        };
        var bg = /^[a-z$_][\w$]*$/i
            , cg = /^(?:[a-z_$][a-z_$0-9]*\.)*[a-z_$][a-z_$0-9]*(?:\.\*)?$/i
            , dg = function(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = a
                    , e = b[c];
                if (!cg.exec(e))
                    throw Error("Invalid key wildcard");
                var f = e.indexOf(".*"), g = -1 !== f && f === e.length - 2, h = g ? e.slice(0, e.length - 2) : e, m;
                a: if (0 === d.length)
                    m = !1;
                else {
                    for (var n = d.split("."), p = 0; p < n.length; p++)
                        if (!bg.exec(n[p])) {
                            m = !1;
                            break a
                        }
                    m = !0
                }
                if (!m || h.length > d.length || !g && d.length != e.length ? 0 : g ? 0 === d.indexOf(h) && (d === h || "." == d.charAt(h.length)) : d === h)
                    return !0
            }
            return !1
        };
        var eg = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"];
        function fg(a, b) {
            a = String(a);
            b = String(b);
            var c = a.length - b.length;
            return 0 <= c && a.indexOf(b, c) === c
        }
        var gg = new ub;
        function hg(a, b, c) {
            var d = c ? "i" : void 0;
            try {
                var e = String(b) + d
                    , f = gg.get(e);
                f || (f = new RegExp(b,d),
                    gg.set(e, f));
                return f.test(a)
            } catch (g) {
                return !1
            }
        }
        function ig(a, b) {
            return 0 <= String(a).indexOf(String(b))
        }
        function jg(a, b) {
            return String(a) === String(b)
        }
        function kg(a, b) {
            return Number(a) >= Number(b)
        }
        function lg(a, b) {
            return Number(a) <= Number(b)
        }
        function mg(a, b) {
            return Number(a) > Number(b)
        }
        function ng(a, b) {
            return Number(a) < Number(b)
        }
        function og(a, b) {
            return 0 === String(a).indexOf(String(b))
        }
        ;var vg = /^[1-9a-zA-Z_-][1-9a-c][1-9a-v]\d$/;
        function wg(a, b) {
            for (var c = "", d = !0; 7 < a; ) {
                var e = a & 31;
                a >>= 5;
                d ? d = !1 : e |= 32;
                c = Ae(e) + c
            }
            a <<= 2;
            d || (a |= 32);
            return c = Ae(a | b) + c
        }
        ;var xg = /^([a-z][a-z0-9]*):(!|\?)(\*|string|boolean|number|Fn|PixieMap|List|OpaqueValue)$/i
            , yg = {
                Fn: "function",
                PixieMap: "Object",
                List: "Array"
            }
            , K = function(a, b, c) {
                for (var d = 0; d < b.length; d++) {
                    var e = xg.exec(b[d]);
                    if (!e)
                        throw Error("Internal Error in " + a);
                    var f = e[1]
                        , g = "!" === e[2]
                        , h = e[3]
                        , m = c[d];
                    if (null == m) {
                        if (g)
                            throw Error("Error in " + a + ". Required argument " + f + " not supplied.");
                    } else if ("*" !== h) {
                        var n = typeof m;
                        m instanceof Tc ? n = "Fn" : m instanceof Ya ? n = "List" : m instanceof ab ? n = "PixieMap" : m instanceof Yc && (n = "OpaqueValue");
                        if (n != h)
                            throw Error("Error in " + a + ". Argument " + f + " has type " + (yg[n] || n) + ", which does not match required type " + (yg[h] || h) + ".");
                    }
                }
            };
        function zg(a) {
            return "" + a
        }
        function Ag(a, b) {
            var c = [];
            return c
        }
        ;var Bg = function(a, b) {
            var c = new Tc(a,function() {
                    for (var d = Array.prototype.slice.call(arguments, 0), e = 0; e < d.length; e++)
                        d[e] = this.evaluate(d[e]);
                    try {
                        return b.apply(this, d)
                    } catch (g) {
                        if (bd())
                            throw new dd(g.message);
                        throw g;
                    }
                }
            );
            c.Lb();
            return c
        }
            , Cg = function(a, b) {
                var c = new ab, d;
                for (d in b)
                    if (b.hasOwnProperty(d)) {
                        var e = b[d];
                        ob(e) ? c.set(d, Bg(a + "_" + d, e)) : Va(e) ? c.set(d, Cg(a + "_" + d, e)) : (pb(e) || l(e) || "boolean" === typeof e) && c.set(d, e)
                    }
                c.Lb();
                return c
            };
        var Dg = function(a, b) {
            K(this.getName(), ["apiName:!string", "message:?string"], arguments);
            var c = {}
                , d = new ab;
            return d = Cg("AssertApiSubject", c)
        };
        var Eg = function(a, b) {
            K(this.getName(), ["actual:?*", "message:?string"], arguments);
            if (a instanceof $c)
                throw Error("Argument actual cannot have type Promise. Assertions on asynchronous code aren't supported.");
            var c = {}
                , d = new ab;
            return d = Cg("AssertThatSubject", c)
        };
        function Fg(a) {
            return function() {
                for (var b = [], c = this.J, d = 0; d < arguments.length; ++d)
                    b.push(J(arguments[d], c));
                return ad(a.apply(null, b))
            }
        }
        var Hg = function() {
            for (var a = Math, b = Gg, c = {}, d = 0; d < b.length; d++) {
                var e = b[d];
                a.hasOwnProperty(e) && (c[e] = Fg(a[e].bind(a)))
            }
            return c
        };
        var Ig = function(a) {
            var b;
            return b
        };
        var Jg = function(a) {
            var b;
            return b
        };
        var Kg = function(a) {
            try {
                return encodeURI(a)
            } catch (b) {}
        };
        var Lg = function(a) {
            try {
                return encodeURIComponent(a)
            } catch (b) {}
        };
        function Mg(a, b) {
            var c = !1;
            K(this.getName(), ["booleanExpression:!string", "context:?PixieMap"], arguments);
            var d = JSON.parse(a);
            if (!d)
                throw Error("Invalid boolean expression string was given.");
            var e = b ? J(b) : {};
            c = Ng(d, e);
            return c
        }
        var Og = function(a, b) {
            for (var c = 0; c < b.length; c++) {
                if (void 0 === a)
                    return;
                a = a[b[c]]
            }
            return a
        }
            , Pg = function(a, b) {
            var c = b.preHit;
            if (c) {
                var d = a[0];
                switch (d) {
                    case "hitData":
                        return 2 > a.length ? void 0 : Og(c.getHitData(a[1]), a.slice(2));
                    case "metadata":
                        return 2 > a.length ? void 0 : Og(c.getMetadata(a[1]), a.slice(2));
                    case "eventName":
                        return c.getEventName();
                    case "destinationId":
                        return c.getDestinationId();
                    default:
                        throw Error(d + " is not a valid field that can be accessed\n                      from PreHit data.");
                }
            }
        }
            , Qg = function(a, b) {
            if (a) {
                if (void 0 !== a.contextValue) {
                    var c;
                    a: {
                        var d = a.contextValue
                            , e = d.keyParts;
                        if (e && 0 !== e.length) {
                            var f = d.namespaceType;
                            switch (f) {
                                case 1:
                                    c = Pg(e, b);
                                    break a;
                                case 2:
                                    var g = b.macro;
                                    c = g ? g[e[0]] : void 0;
                                    break a;
                                default:
                                    throw Error("Unknown Namespace Type used: " + f);
                            }
                        }
                        c = void 0
                    }
                    return c
                }
                if (void 0 !== a.booleanExpressionValue)
                    return Ng(a.booleanExpressionValue, b);
                if (void 0 !== a.booleanValue)
                    return !!a.booleanValue;
                if (void 0 !== a.stringValue)
                    return String(a.stringValue);
                if (void 0 !== a.integerValue)
                    return Number(a.integerValue);
                if (void 0 !== a.doubleValue)
                    return Number(a.doubleValue);
                throw Error("Unknown field used for variable of type ExpressionValue:" + a);
            }
        }
            , Ng = function(a, b) {
            var c = a.args;
            if (!Array.isArray(c) || 0 === c.length)
                throw Error('Invalid boolean expression format. Expected "args":' + c + " property to\n         be non-empty array.");
            var d = function(g) {
                return Qg(g, b)
            };
            switch (a.type) {
                case 1:
                    for (var e = 0; e < c.length; e++)
                        if (d(c[e]))
                            return !0;
                    return !1;
                case 2:
                    for (var f = 0; f < c.length; f++)
                        if (!d(c[f]))
                            return !1;
                    return 0 < c.length;
                case 3:
                    return !d(c[0]);
                case 4:
                    return hg(d(c[0]), d(c[1]), !1);
                case 5:
                    return jg(d(c[0]), d(c[1]));
                case 6:
                    return og(d(c[0]), d(c[1]));
                case 7:
                    return fg(d(c[0]), d(c[1]));
                case 8:
                    return ig(d(c[0]), d(c[1]));
                case 9:
                    return ng(d(c[0]), d(c[1]));
                case 10:
                    return lg(d(c[0]), d(c[1]));
                case 11:
                    return mg(d(c[0]), d(c[1]));
                case 12:
                    return kg(d(c[0]), d(c[1]));
                default:
                    throw Error('Invalid boolean expression format. Expected "type" property tobe a positive integer which is less than 13.');
            }
        };
        Mg.K = "internal.evaluateBooleanExpression";
        var Rg = function(a) {
            K(this.getName(), ["message:?string"], arguments);
        };
        var Sg = function(a, b) {
            K(this.getName(), ["min:!number", "max:!number"], arguments);
            return sb(a, b)
        };
        var Tg = function() {
            return (new Date).getTime()
        };
        var Ug = function(a) {
            if (null === a)
                return "null";
            if (a instanceof Ya)
                return "array";
            if (a instanceof Tc)
                return "function";
            if (a instanceof Yc) {
                a = a.getValue();
                if (void 0 === a.constructor || void 0 === a.constructor.name) {
                    var b = String(a);
                    return b.substring(8, b.length - 1)
                }
                return String(a.constructor.name)
            }
            return typeof a
        };
        var Vg = function(a) {
            function b(c) {
                return function(d) {
                    try {
                        return c(d)
                    } catch (e) {
                        (Nf || Pf) && a.call(this, e.message)
                    }
                }
            }
            return {
                parse: b(function(c) {
                    return ad(JSON.parse(c))
                }),
                stringify: b(function(c) {
                    return JSON.stringify(J(c))
                })
            }
        };
        var Wg = function(a) {
            return wb(J(a, this.J))
        };
        var Xg = function(a) {
            return Number(J(a, this.J))
        };
        var Yg = function(a) {
            return null === a ? "null" : void 0 === a ? "undefined" : a.toString()
        };
        var Zg = function(a, b, c) {
            var d = null
                , e = !1;
            return e ? d : null
        };
        var Gg = "floor ceil round max min abs pow sqrt".split(" ");
        var $g = function() {
            var a = {};
            return {
                Il: function(b) {
                    return a.hasOwnProperty(b) ? a[b] : void 0
                },
                hk: function(b, c) {
                    a[b] = c
                },
                reset: function() {
                    a = {}
                }
            }
        }
            , ah = function(a, b) {
            return function() {
                var c = Array.prototype.slice.call(arguments, 0);
                c.unshift(b);
                return Tc.prototype.invoke.apply(a, c)
            }
        }
            , bh = function(a, b) {
            K(this.getName(), ["apiName:!string", "mock:?*"], arguments);
        }
            , ch = function(a, b) {
            K(this.getName(), ["apiName:!string", "mock:!PixieMap"], arguments);
        };
        var dh = {};
        var eh = function(a) {
            var b = new ab;
            if (a instanceof Ya)
                for (var c = a.Zb(), d = 0; d < c.length(); d++) {
                    var e = c.get(d);
                    a.has(e) && b.set(e, a.get(e))
                }
            else if (a instanceof Tc)
                for (var f = Ra(a, 1), g = 0; g < f.length; g++) {
                    var h = f[g];
                    b.set(h, a.get(h))
                }
            else
                for (var m = 0; m < a.length; m++)
                    b.set(m, a[m]);
            return b
        };
        dh.keys = function(a) {
            K(this.getName(), ["input:!*"], arguments);
            if (a instanceof Ya || a instanceof Tc || "string" === typeof a)
                a = eh(a);
            if (a instanceof ab)
                return a.Zb();
            return new Ya
        }
        ;
        dh.values = function(a) {
            K(this.getName(), ["input:!*"], arguments);
            if (a instanceof Ya || a instanceof Tc || "string" === typeof a)
                a = eh(a);
            if (a instanceof ab)
                return new Ya(Ra(a, 2));
            return new Ya
        }
        ;
        dh.entries = function(a) {
            K(this.getName(), ["input:!*"], arguments);
            if (a instanceof Ya || a instanceof Tc || "string" === typeof a)
                a = eh(a);
            if (a instanceof ab)
                return bb(a);
            return new Ya
        }
        ;
        dh.freeze = function(a) {
            (a instanceof ab || a instanceof Ya || a instanceof Tc) && a.Lb();
            return a
        }
        ;
        dh.delete = function(a, b) {
            if (a instanceof ab && !a.F)
                return a.zf(b),
                    !0;
            return !1
        }
        ;
        var L = function(a, b, c) {
            var d = a.J.m;
            if (!d)
                throw Error("Missing program state.");
            if (d.Jm) {
                try {
                    d.Gj.apply(null, Array.prototype.slice.call(arguments, 1))
                } catch (e) {
                    throw kb("TAGGING", 21),
                        e;
                }
                return
            }
            d.Gj.apply(null, Array.prototype.slice.call(arguments, 1))
        };
        var fh = function() {
            this.m = {};
            this.F = {};
        };
        fh.prototype.get = function(a, b) {
            var c = this.m.hasOwnProperty(a) ? this.m[a] : void 0;
            return c
        }
        ;
        fh.prototype.add = function(a, b, c) {
            if (this.m.hasOwnProperty(a))
                throw "Attempting to add a function which already exists: " + a + ".";
            if (this.F.hasOwnProperty(a))
                throw "Attempting to add an API with an existing private API name: " + a + ".";
            this.m[a] = c ? void 0 : ob(b) ? Bg(a, b) : Cg(a, b)
        }
        ;
        function gh(a, b) {
            var c = void 0;
            return c
        }
        ;function hh() {
            var a = {};
            return a
        }
        ;function mh(a) {
            return nh ? H.querySelectorAll(a) : null
        }
        function oh(a, b) {
            if (!nh)
                return null;
            if (Element.prototype.closest)
                try {
                    return a.closest(b)
                } catch (e) {
                    return null
                }
            var c = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector
                , d = a;
            if (!H.documentElement.contains(d))
                return null;
            do {
                try {
                    if (c.call(d, b))
                        return d
                } catch (e) {
                    break
                }
                d = d.parentElement || d.parentNode
            } while (null !== d && 1 === d.nodeType);
            return null
        }
        var ph = !1;
        if (H.querySelectorAll)
            try {
                var qh = H.querySelectorAll(":root");
                qh && 1 == qh.length && qh[0] == H.documentElement && (ph = !0)
            } catch (a) {}
        var nh = ph;
        var rh = /^[0-9A-Fa-f]{64}$/;
        function sh(a) {
            try {
                return (new TextEncoder).encode(a)
            } catch (e) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var d = a.charCodeAt(c);
                    128 > d ? b.push(d) : 2048 > d ? b.push(192 | d >> 6, 128 | d & 63) : 55296 > d || 57344 <= d ? b.push(224 | d >> 12, 128 | d >> 6 & 63, 128 | d & 63) : (d = 65536 + ((d & 1023) << 10 | a.charCodeAt(++c) & 1023),
                        b.push(240 | d >> 18, 128 | d >> 12 & 63, 128 | d >> 6 & 63, 128 | d & 63))
                }
                return new Uint8Array(b)
            }
        }
        function th(a) {
            if ("" === a || "e0" === a)
                return Promise.resolve(a);
            var b;
            if (null == (b = G.crypto) ? 0 : b.subtle) {
                if (rh.test(a))
                    return Promise.resolve(a);
                try {
                    var c = sh(a);
                    return G.crypto.subtle.digest("SHA-256", c).then(function(d) {
                        var e = Array.from(new Uint8Array(d)).map(function(f) {
                            return String.fromCharCode(f)
                        }).join("");
                        return G.btoa(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
                    }).catch(function() {
                        return "e2"
                    })
                } catch (d) {
                    return Promise.resolve("e2")
                }
            } else
                return Promise.resolve("e1")
        }
        ;function O(a) {
            kb("GTM", a)
        }
        ;var xh = function(a) {
            var b = {}
                , c = ["tv.1"]
                , d = 0;
            var u = c.join("~");
            return {
                Th: {
                    userData: b
                },
                Wm: u,
                hn: d
            }
        }
            , zh = function(a) {
                if (G.Promise)
                    try {
                        return new Promise(function(b) {
                                yh(a, function(c, d) {
                                    b({
                                        Sj: c,
                                        Kh: d
                                    })
                                })
                            }
                        )
                    } catch (b) {}
            }
            , Ah = function(a) {
                for (var b = ["tv.1"], c = 0, d = 0; d < a.length; ++d) {
                    var e = a[d].name
                        , f = a[d].value
                        , g = a[d].index
                        , h = uh[e];
                    h && f && (-1 === vh.indexOf(e) || /^e\d+$/.test(f) || wh.test(f) || rh.test(f)) && (void 0 !== g && (h += g),
                        b.push(h + "." + f),
                        c++)
                }
                1 === a.length && "error_code" === a[0].name && (c = 0);
                return {
                    Tj: encodeURIComponent(b.join("~")),
                    Kh: c
                }
            }
            , yh = function(a, b) {
                Bh(a, function(c) {
                    var d = Ah(c);
                    b(d.Tj, d.Kh)
                })
            }
            , Jh = function(a) {
                function b(t, r, u, v) {
                    var w = Ch(t);
                    "" !== w && (rh.test(w) ? h.push({
                        name: r,
                        value: w,
                        index: v
                    }) : h.push({
                        name: r,
                        value: u(w),
                        index: v
                    }))
                }
                function c(t, r) {
                    var u = t;
                    if (l(u) || Array.isArray(u)) {
                        u = qb(t);
                        for (var v = 0; v < u.length; ++v) {
                            var w = Ch(u[v])
                                , x = rh.test(w);
                            r && !x && O(89);
                            !r && x && O(88)
                        }
                    }
                }
                function d(t, r) {
                    var u = t[r];
                    c(u, !1);
                    var v = Dh[r];
                    t[v] && (t[r] && O(90),
                        u = t[v],
                        c(u, !0));
                    return u
                }
                function e(t, r, u) {
                    for (var v = qb(d(t, r)), w = 0; w < v.length; ++w)
                        b(v[w], r, u)
                }
                function f(t, r, u, v) {
                    var w = d(t, r);
                    b(w, r, u, v)
                }
                function g(t) {
                    return function(r) {
                        O(64);
                        return t(r)
                    }
                }
                var h = [];
                if ("https:" !== G.location.protocol)
                    return h.push({
                        name: "error_code",
                        value: "e3",
                        index: void 0
                    }),
                        h;
                e(a, "email", Eh);
                e(a, "phone_number", Fh);
                e(a, "first_name", g(Gh));
                e(a, "last_name", g(Gh));
                var m = a.home_address || {};
                e(m, "street", g(Hh));
                e(m, "city", g(Hh));
                e(m, "postal_code", g(Ih));
                e(m, "region", g(Hh));
                e(m, "country", g(Ih));
                for (var n = qb(a.address || {}), p = 0; p < n.length; p++) {
                    var q = n[p];
                    f(q, "first_name", Gh, p);
                    f(q, "last_name", Gh, p);
                    f(q, "street", Hh, p);
                    f(q, "city", Hh, p);
                    f(q, "postal_code", Ih, p);
                    f(q, "region", Hh, p);
                    f(q, "country", Ih, p)
                }
                return h
            }
            , Bh = function(a, b) {
                var c = Jh(a);
                Kh(c, b)
            }
            , Ch = function(a) {
                return null == a ? "" : l(a) ? zb(String(a)) : "e0"
            }
            , Ih = function(a) {
                return a.replace(Lh, "")
            }
            , Gh = function(a) {
                return Hh(a.replace(/\s/g, ""))
            }
            , Hh = function(a) {
                return zb(a.replace(Mh, "").toLowerCase())
            }
            , Fh = function(a) {
                a = a.replace(/[\s-()/.]/g, "");
                "+" !== a.charAt(0) && (a = "+" + a);
                return Nh.test(a) ? a : "e0"
            }
            , Eh = function(a) {
                var b = a.toLowerCase().split("@");
                if (2 === b.length) {
                    var c = b[0];
                    /^(gmail|googlemail)\./.test(b[1]) && (c = c.replace(/\./g, ""));
                    c = c + "@" + b[1];
                    if (Oh.test(c))
                        return c
                }
                return "e0"
            }
            , Kh = function(a, b) {
                a.some(function(c) {
                    c.value && vh.indexOf(c.name)
                }) ? b(a) : G.Promise ? Promise.all(a.map(function(c) {
                    return c.value && -1 !== vh.indexOf(c.name) ? th(c.value).then(function(d) {
                        c.value = d
                    }) : Promise.resolve()
                })).then(function() {
                    b(a)
                }).catch(function() {
                    b([])
                }) : b([])
            }
            , Mh = /[0-9`~!@#$%^&*()_\-+=:;<>,.?|/\\[\]]/g
            , Oh = /^\S+@\S+\.\S+$/
            , Nh = /^\+\d{10,15}$/
            , Lh = /[.~]/g
            , wh = /^[0-9A-Za-z_-]{43}$/
            , Ph = {}
            , uh = (Ph.email = "em",
                Ph.phone_number = "pn",
                Ph.first_name = "fn",
                Ph.last_name = "ln",
                Ph.street = "sa",
                Ph.city = "ct",
                Ph.region = "rg",
                Ph.country = "co",
                Ph.postal_code = "pc",
                Ph.error_code = "ec",
                Ph)
            , Qh = {}
            , Dh = (Qh.email = "sha256_email_address",
                Qh.phone_number = "sha256_phone_number",
                Qh.first_name = "sha256_first_name",
                Qh.last_name = "sha256_last_name",
                Qh.street = "sha256_street",
                Qh)
            , vh = Object.freeze(["email", "phone_number", "first_name", "last_name", "street"]);
        var P = {
            g: {
                Aa: "ad_personalization",
                R: "ad_storage",
                P: "ad_user_data",
                W: "analytics_storage",
                kc: "region",
                mc: "consent_updated",
                Ue: "wait_for_update",
                ki: "app_remove",
                li: "app_store_refund",
                mi: "app_store_subscription_cancel",
                ni: "app_store_subscription_convert",
                oi: "app_store_subscription_renew",
                uk: "consent_update",
                Xf: "add_payment_info",
                Yf: "add_shipping_info",
                nc: "add_to_cart",
                oc: "remove_from_cart",
                Zf: "view_cart",
                Pb: "begin_checkout",
                qc: "select_item",
                hb: "view_item_list",
                Bb: "select_promotion",
                ib: "view_promotion",
                Ja: "purchase",
                sc: "refund",
                Na: "view_item",
                cg: "add_to_wishlist",
                vk: "exception",
                ri: "first_open",
                si: "first_visit",
                fa: "gtag.config",
                Ra: "gtag.get",
                ui: "in_app_purchase",
                Qb: "page_view",
                wk: "screen_view",
                vi: "session_start",
                xk: "timing_complete",
                yk: "track_social",
                uc: "user_engagement",
                jb: "gclgb",
                Sa: "gclid",
                wi: "gclgs",
                xi: "gclst",
                ja: "ads_data_redaction",
                yi: "gad_source",
                Id: "gclid_url",
                zi: "gclsrc",
                dg: "gbraid",
                Ve: "wbraid",
                oa: "allow_ad_personalization_signals",
                We: "allow_custom_scripts",
                Xe: "allow_display_features",
                Jd: "allow_enhanced_conversions",
                kb: "allow_google_signals",
                Ea: "allow_interest_groups",
                zk: "app_id",
                Ak: "app_installer_id",
                Bk: "app_name",
                Ck: "app_version",
                Cb: "auid",
                Ai: "auto_detection_enabled",
                Rb: "aw_remarketing",
                Ye: "aw_remarketing_only",
                Kd: "discount",
                Ld: "aw_feed_country",
                Md: "aw_feed_language",
                ia: "items",
                Nd: "aw_merchant_id",
                eg: "aw_basket_type",
                Qc: "campaign_content",
                Rc: "campaign_id",
                Sc: "campaign_medium",
                Tc: "campaign_name",
                Uc: "campaign",
                Vc: "campaign_source",
                Wc: "campaign_term",
                lb: "client_id",
                Bi: "rnd",
                fg: "consent_update_type",
                Ci: "content_group",
                Di: "content_type",
                Za: "conversion_cookie_prefix",
                Xc: "conversion_id",
                wa: "conversion_linker",
                Ei: "conversion_linker_disabled",
                Sb: "conversion_api",
                Ze: "cookie_deprecation",
                Ta: "cookie_domain",
                Ua: "cookie_expires",
                ab: "cookie_flags",
                vc: "cookie_name",
                Db: "cookie_path",
                Oa: "cookie_prefix",
                wc: "cookie_update",
                xc: "country",
                Ba: "currency",
                Od: "customer_lifetime_value",
                Yc: "custom_map",
                gg: "gcldc",
                Pd: "dclid",
                Fi: "debug_mode",
                la: "developer_id",
                Gi: "disable_merchant_reported_purchases",
                Zc: "dc_custom_params",
                Hi: "dc_natural_search",
                hg: "dynamic_event_settings",
                ig: "affiliation",
                Qd: "checkout_option",
                af: "checkout_step",
                jg: "coupon",
                bd: "item_list_name",
                bf: "list_name",
                Ii: "promotions",
                dd: "shipping",
                cf: "tax",
                Rd: "engagement_time_msec",
                Sd: "enhanced_client_id",
                Td: "enhanced_conversions",
                kg: "enhanced_conversions_automatic_settings",
                Ud: "estimated_delivery_date",
                df: "euid_logged_in_state",
                ed: "event_callback",
                Dk: "event_category",
                ob: "event_developer_id_string",
                Ek: "event_label",
                fd: "event",
                Vd: "event_settings",
                Wd: "event_timeout",
                Fk: "description",
                Gk: "fatal",
                Ji: "experiments",
                ef: "firebase_id",
                yc: "first_party_collection",
                Xd: "_x_20",
                pb: "_x_19",
                Ki: "fledge_drop_reason",
                lg: "fledge",
                mg: "flight_error_code",
                ng: "flight_error_message",
                Li: "fl_activity_category",
                Mi: "fl_activity_group",
                og: "fl_advertiser_id",
                Ni: "fl_ar_dedupe",
                pg: "match_id",
                Oi: "fl_random_number",
                Pi: "tran",
                Qi: "u",
                Yd: "gac_gclid",
                zc: "gac_wbraid",
                qg: "gac_wbraid_multiple_conversions",
                rg: "ga_restrict_domain",
                ff: "ga_temp_client_id",
                Ac: "gdpr_applies",
                sg: "geo_granularity",
                Eb: "value_callback",
                qb: "value_key",
                Hk: "google_ng",
                Ik: "google_ono",
                Tb: "google_signals",
                ug: "google_tld",
                Zd: "groups",
                vg: "gsa_experiment_id",
                Ri: "gtm_up",
                Fb: "iframe_state",
                gd: "ignore_referrer",
                hf: "internal_traffic_results",
                Ub: "is_legacy_converted",
                Gb: "is_legacy_loaded",
                ae: "is_passthrough",
                hd: "_lps",
                Pa: "language",
                be: "legacy_developer_id_string",
                xa: "linker",
                Bc: "accept_incoming",
                sb: "decorate_forms",
                Z: "domains",
                Hb: "url_position",
                wg: "method",
                Jk: "name",
                jd: "new_customer",
                xg: "non_interaction",
                Si: "optimize_id",
                Ti: "page_hostname",
                kd: "page_path",
                Fa: "page_referrer",
                Ib: "page_title",
                yg: "passengers",
                zg: "phone_conversion_callback",
                Ui: "phone_conversion_country_code",
                Ag: "phone_conversion_css_class",
                Vi: "phone_conversion_ids",
                Bg: "phone_conversion_number",
                Cg: "phone_conversion_options",
                Dg: "_protected_audience_enabled",
                ld: "quantity",
                ce: "redact_device_info",
                jf: "referral_exclusion_definition",
                Vb: "restricted_data_processing",
                Wi: "retoken",
                Kk: "sample_rate",
                kf: "screen_name",
                Jb: "screen_resolution",
                Xi: "search_term",
                Ka: "send_page_view",
                Wb: "send_to",
                md: "server_container_url",
                nd: "session_duration",
                de: "session_engaged",
                lf: "session_engaged_time",
                tb: "session_id",
                ee: "session_number",
                Eg: "_shared_user_id",
                od: "delivery_postal_code",
                Lk: "temporary_client_id",
                nf: "topmost_url",
                Yi: "tracking_id",
                pf: "traffic_type",
                Ca: "transaction_id",
                Kb: "transport_url",
                Fg: "trip_type",
                Xb: "update",
                Va: "url_passthrough",
                qf: "_user_agent_architecture",
                rf: "_user_agent_bitness",
                tf: "_user_agent_full_version_list",
                uf: "_user_agent_mobile",
                vf: "_user_agent_model",
                wf: "_user_agent_platform",
                xf: "_user_agent_platform_version",
                yf: "_user_agent_wow64",
                Ga: "user_data",
                Gg: "user_data_auto_latency",
                Hg: "user_data_auto_meta",
                Ig: "user_data_auto_multi",
                Jg: "user_data_auto_selectors",
                Kg: "user_data_auto_status",
                pd: "user_data_mode",
                fe: "user_data_settings",
                Da: "user_id",
                cb: "user_properties",
                Zi: "_user_region",
                he: "us_privacy_string",
                qa: "value",
                Lg: "wbraid_multiple_conversions",
                ij: "_host_name",
                jj: "_in_page_command",
                kj: "_is_passthrough_cid",
                Mb: "non_personalized_ads",
                oe: "_sst_parameters",
                nb: "conversion_label",
                ya: "page_location",
                rb: "global_developer_id_string",
                Cc: "tc_privacy_string"
            }
        }
            , Rh = {}
            , Sh = Object.freeze((Rh[P.g.oa] = 1,
            Rh[P.g.Xe] = 1,
            Rh[P.g.Jd] = 1,
            Rh[P.g.kb] = 1,
            Rh[P.g.ia] = 1,
            Rh[P.g.Ta] = 1,
            Rh[P.g.Ua] = 1,
            Rh[P.g.ab] = 1,
            Rh[P.g.vc] = 1,
            Rh[P.g.Db] = 1,
            Rh[P.g.Oa] = 1,
            Rh[P.g.wc] = 1,
            Rh[P.g.Yc] = 1,
            Rh[P.g.la] = 1,
            Rh[P.g.hg] = 1,
            Rh[P.g.ed] = 1,
            Rh[P.g.Vd] = 1,
            Rh[P.g.Wd] = 1,
            Rh[P.g.yc] = 1,
            Rh[P.g.rg] = 1,
            Rh[P.g.Tb] = 1,
            Rh[P.g.ug] = 1,
            Rh[P.g.Zd] = 1,
            Rh[P.g.hf] = 1,
            Rh[P.g.Ub] = 1,
            Rh[P.g.Gb] = 1,
            Rh[P.g.xa] = 1,
            Rh[P.g.jf] = 1,
            Rh[P.g.Vb] = 1,
            Rh[P.g.Ka] = 1,
            Rh[P.g.Wb] = 1,
            Rh[P.g.md] = 1,
            Rh[P.g.nd] = 1,
            Rh[P.g.lf] = 1,
            Rh[P.g.od] = 1,
            Rh[P.g.Kb] = 1,
            Rh[P.g.Xb] = 1,
            Rh[P.g.fe] = 1,
            Rh[P.g.cb] = 1,
            Rh[P.g.oe] = 1,
            Rh));
        Object.freeze([P.g.ya, P.g.Fa, P.g.Ib, P.g.Pa, P.g.kf, P.g.Da, P.g.ef, P.g.Ci]);
        var Th = {}
            , Uh = Object.freeze((Th[P.g.ki] = 1,
            Th[P.g.li] = 1,
            Th[P.g.mi] = 1,
            Th[P.g.ni] = 1,
            Th[P.g.oi] = 1,
            Th[P.g.ri] = 1,
            Th[P.g.si] = 1,
            Th[P.g.ui] = 1,
            Th[P.g.vi] = 1,
            Th[P.g.uc] = 1,
            Th))
            , Vh = {}
            , Wh = Object.freeze((Vh[P.g.Xf] = 1,
            Vh[P.g.Yf] = 1,
            Vh[P.g.nc] = 1,
            Vh[P.g.oc] = 1,
            Vh[P.g.Zf] = 1,
            Vh[P.g.Pb] = 1,
            Vh[P.g.qc] = 1,
            Vh[P.g.hb] = 1,
            Vh[P.g.Bb] = 1,
            Vh[P.g.ib] = 1,
            Vh[P.g.Ja] = 1,
            Vh[P.g.sc] = 1,
            Vh[P.g.Na] = 1,
            Vh[P.g.cg] = 1,
            Vh))
            , Xh = Object.freeze([P.g.oa, P.g.kb, P.g.wc, P.g.yc, P.g.gd, P.g.Ka, P.g.Xb])
            , Yh = Object.freeze([].concat(pa(Xh)))
            , Zh = Object.freeze([P.g.Ua, P.g.Wd, P.g.nd, P.g.lf, P.g.Rd])
            , $h = Object.freeze([].concat(pa(Zh)))
            , ai = {}
            , bi = (ai[P.g.R] = "1",
            ai[P.g.W] = "2",
            ai[P.g.P] = "3",
            ai[P.g.Aa] = "4",
            ai)
            , ci = {}
            , di = Object.freeze((ci[P.g.oa] = 1,
            ci[P.g.Jd] = 1,
            ci[P.g.Ea] = 1,
            ci[P.g.Rb] = 1,
            ci[P.g.Ye] = 1,
            ci[P.g.Kd] = 1,
            ci[P.g.Ld] = 1,
            ci[P.g.Md] = 1,
            ci[P.g.ia] = 1,
            ci[P.g.Nd] = 1,
            ci[P.g.Za] = 1,
            ci[P.g.wa] = 1,
            ci[P.g.Ta] = 1,
            ci[P.g.Ua] = 1,
            ci[P.g.ab] = 1,
            ci[P.g.Oa] = 1,
            ci[P.g.Ba] = 1,
            ci[P.g.Od] = 1,
            ci[P.g.la] = 1,
            ci[P.g.Gi] = 1,
            ci[P.g.Td] = 1,
            ci[P.g.Ud] = 1,
            ci[P.g.ef] = 1,
            ci[P.g.yc] = 1,
            ci[P.g.Ub] = 1,
            ci[P.g.Gb] = 1,
            ci[P.g.Pa] = 1,
            ci[P.g.jd] = 1,
            ci[P.g.ya] = 1,
            ci[P.g.Fa] = 1,
            ci[P.g.zg] = 1,
            ci[P.g.Ag] = 1,
            ci[P.g.Bg] = 1,
            ci[P.g.Cg] = 1,
            ci[P.g.Vb] = 1,
            ci[P.g.Ka] = 1,
            ci[P.g.Wb] = 1,
            ci[P.g.md] = 1,
            ci[P.g.od] = 1,
            ci[P.g.Ca] = 1,
            ci[P.g.Kb] = 1,
            ci[P.g.Xb] = 1,
            ci[P.g.Va] = 1,
            ci[P.g.Ga] = 1,
            ci[P.g.Da] = 1,
            ci[P.g.qa] = 1,
            ci))
            , ei = {}
            , fi = Object.freeze((ei.search = "s",
            ei.youtube = "y",
            ei.playstore = "p",
            ei.shopping = "h",
            ei.ads = "a",
            ei.maps = "m",
            ei));
        Object.freeze(P.g);
        var gi = {}
            , hi = G.google_tag_manager = G.google_tag_manager || {};
        gi.Qg = "45d0";
        gi.ne = Number("0") || 0;
        gi.Ya = "dataLayer";
        gi.ln = "ChEI8JeMsgYQrqulpvSx+ubMARIlABfG0Bf5dIXzi4oYfBHoV7IZCNUQnAQ+LZzneUlczICCmdtWWRoC9Wc\x3d";
        var ii = {
            __cl: 1,
            __ecl: 1,
            __ehl: 1,
            __evl: 1,
            __fal: 1,
            __fil: 1,
            __fsl: 1,
            __hl: 1,
            __jel: 1,
            __lcl: 1,
            __sdl: 1,
            __tl: 1,
            __ytl: 1
        }, ji = {
            __paused: 1,
            __tg: 1
        }, ki;
        for (ki in ii)
            ii.hasOwnProperty(ki) && (ji[ki] = 1);
        var li = xb(""), mi, ni = !1;
        ni = !0;
        mi = ni;
        var oi, pi = !1;
        oi = pi;
        var qi, ri = !1;
        qi = ri;
        gi.Hd = "www.googletagmanager.com";
        var si = "" + gi.Hd + (mi ? "/gtag/js" : "/gtm.js")
            , ti = null
            , ui = null
            , vi = {}
            , wi = {};
        function xi() {
            var a = hi.sequence || 1;
            hi.sequence = a + 1;
            return a
        }
        gi.sk = "true";
        var yi = "";
        gi.Ef = yi;
        var zi = new function() {
                this.m = "";
                this.M = this.F = !1;
                this.Wa = this.T = this.da = this.H = ""
            }
        ;
        function Ai() {
            var a = zi.H.length;
            return "/" === zi.H[a - 1] ? zi.H.substring(0, a - 1) : zi.H
        }
        function Bi(a) {
            for (var b = {}, c = ma(a.split("|")), d = c.next(); !d.done; d = c.next())
                b[d.value] = !0;
            return b
        }
        var Ci = new ub
            , Di = {}
            , Ei = {}
            , Hi = {
            name: gi.Ya,
            set: function(a, b) {
                k(Jb(a, b), Di);
                Fi()
            },
            get: function(a) {
                return Gi(a, 2)
            },
            reset: function() {
                Ci = new ub;
                Di = {};
                Fi()
            }
        };
        function Gi(a, b) {
            return 2 != b ? Ci.get(a) : Ii(a)
        }
        function Ii(a, b) {
            var c = a.split(".");
            b = b || [];
            for (var d = Di, e = 0; e < c.length; e++) {
                if (null === d)
                    return !1;
                if (void 0 === d)
                    break;
                d = d[c[e]];
                if (-1 !== b.indexOf(d))
                    return
            }
            return d
        }
        function Ji(a, b) {
            Ei.hasOwnProperty(a) || (Ci.set(a, b),
                k(Jb(a, b), Di),
                Fi())
        }
        function Ki() {
            for (var a = ["gtm.allowlist", "gtm.blocklist", "gtm.whitelist", "gtm.blacklist", "tagTypeBlacklist"], b = 0; b < a.length; b++) {
                var c = a[b]
                    , d = Gi(c, 1);
                if (Array.isArray(d) || Va(d))
                    d = k(d);
                Ei[c] = d
            }
        }
        function Fi(a) {
            z(Ei, function(b, c) {
                Ci.set(b, c);
                k(Jb(b), Di);
                k(Jb(b, c), Di);
                a && delete Ei[b]
            })
        }
        function Li(a, b) {
            var c, d = 1 !== (void 0 === b ? 2 : b) ? Ii(a) : Ci.get(a);
            "array" === Ta(d) || "object" === Ta(d) ? c = k(d) : c = d;
            return c
        }
        ;var Mi = function(a, b, c) {
            if (!c)
                return !1;
            var d = c.selector_type, e = String(c.value), f;
            if ("js_variable" === d) {
                e = e.replace(/\["?'?/g, ".").replace(/"?'?\]/g, "");
                for (var g = e.split(","), h = 0; h < g.length; h++) {
                    var m = g[h].trim();
                    if (m) {
                        if (0 === m.indexOf("dataLayer."))
                            f = Gi(m.substring(10));
                        else {
                            var n = m.split(".");
                            f = G[n.shift()];
                            for (var p = 0; p < n.length; p++)
                                f = f && f[n[p]]
                        }
                        if (void 0 !== f)
                            break
                    }
                }
            } else if ("css_selector" === d && nh) {
                var q = mh(e);
                if (q && 0 < q.length) {
                    f = [];
                    for (var t = 0; t < q.length && t < ("email" === b || "phone_number" === b ? 5 : 1); t++)
                        f.push(Dc(q[t]) || zb(q[t].value));
                    f = 1 === f.length ? f[0] : f
                }
            }
            return f ? (a[b] = f,
                !0) : !1
        }
            , Ni = function(a) {
                if (a) {
                    var b = {}
                        , c = !1;
                    c = Mi(b, "email", a.email) || c;
                    c = Mi(b, "phone_number", a.phone) || c;
                    b.address = [];
                    for (var d = a.name_and_address || [], e = 0; e < d.length; e++) {
                        var f = {};
                        c = Mi(f, "first_name", d[e].first_name) || c;
                        c = Mi(f, "last_name", d[e].last_name) || c;
                        c = Mi(f, "street", d[e].street) || c;
                        c = Mi(f, "city", d[e].city) || c;
                        c = Mi(f, "region", d[e].region) || c;
                        c = Mi(f, "country", d[e].country) || c;
                        c = Mi(f, "postal_code", d[e].postal_code) || c;
                        b.address.push(f)
                    }
                    return c ? b : void 0
                }
            }
            , Oi = function(a) {
                return Va(a) ? !!a.enable_code : !1
            };
        function Pi(a, b) {
            if ("" === a)
                return b;
            var c = Number(a);
            return isNaN(c) ? b : c
        }
        ;var Qi = []
            , Ri = {};
        function Si(a) {
            return void 0 === Qi[a] ? !1 : Qi[a]
        }
        ;var Ti = [];
        function Ui(a) {
            switch (a) {
                case 0:
                    return 0;
                case 27:
                    return 7;
                case 35:
                    return 1;
                case 36:
                    return 2;
                case 42:
                    return 3;
                case 53:
                    return 6;
                case 61:
                    return 4;
                case 72:
                    return 5
            }
        }
        function T(a) {
            Ti[a] = !0;
            var b = Ui(a);
            void 0 !== b && (Qi[b] = !0)
        }
        T(22);
        T(18);
        T(19);
        T(20);
        T(21);
        T(37);
        T(58);
        T(40);
        T(55);
        T(26);
        T(11);
        T(80);
        T(10);
        T(88);
        T(79);
        T(43);
        T(63);
        T(33);
        T(6);
        T(4);
        T(59);
        T(76);
        T(49);
        T(50);
        T(51);
        T(46);
        T(69);
        T(86);
        T(23);

        T(66);
        T(85);
        T(60);
        T(91);
        T(89);
        Ti[74] = !0;
        T(61);
        T(5);
        T(72);
        T(65);
        Ri[1] = Pi('1', 6E4);
        Ri[3] = Pi('10', 1);
        Ri[2] = Pi('', 50);
        T(70);
        T(84);
        T(77);
        T(82);
        function U(a) {
            return !!Ti[a]
        }
        function Vi(a) {
            kb("HEALTH", a)
        }
        ;var Wi;
        try {
            Wi = JSON.parse(ib("eyIwIjoiSVQiLCIxIjoiSVQtMzQiLCIyIjpmYWxzZSwiMyI6Imdvb2dsZS5pdCIsIjQiOiJyZWdpb24xIiwiNSI6ZmFsc2UsIjYiOnRydWUsIjciOiJhZF9zdG9yYWdlfGFuYWx5dGljc19zdG9yYWdlfGFkX3VzZXJfZGF0YXxhZF9wZXJzb25hbGl6YXRpb24ifQ"))
        } catch (a) {
            O(123),
                Vi(2),
                Wi = {}
        }
        function Xi() {
            return Wi["0"] || ""
        }
        function Yi() {
            var a = !1;
            a = !!Wi["2"];
            return a
        }
        function Zi() {
            return !1 !== Wi["6"]
        }
        function $i() {
            var a = "";
            a = Wi["4"] || "";
            return a
        }
        function aj() {
            var a = !1;
            a = !!Wi["5"];
            return a
        }
        function bj() {
            var a = "";
            a = Wi["3"] || "";
            return a
        }
        var cj = /:[0-9]+$/
            , dj = /^\d+\.fls\.doubleclick\.net$/
            , ej = function(a, b, c, d) {
            for (var e = [], f = ma(a.split("&")), g = f.next(); !g.done; g = f.next()) {
                var h = ma(g.value.split("="))
                    , m = h.next().value
                    , n = oa(h);
                if (decodeURIComponent(m.replace(/\+/g, " ")) === b) {
                    var p = n.join("=");
                    if (!c)
                        return d ? p : decodeURIComponent(p.replace(/\+/g, " "));
                    e.push(d ? p : decodeURIComponent(p.replace(/\+/g, " ")))
                }
            }
            return c ? e : void 0
        }
            , hj = function(a, b, c, d, e) {
            b && (b = String(b).toLowerCase());
            if ("protocol" === b || "port" === b)
                a.protocol = fj(a.protocol) || fj(G.location.protocol);
            "port" === b ? a.port = String(Number(a.hostname ? a.port : G.location.port) || ("http" === a.protocol ? 80 : "https" === a.protocol ? 443 : "")) : "host" === b && (a.hostname = (a.hostname || G.location.hostname).replace(cj, "").toLowerCase());
            return gj(a, b, c, d, e)
        }
            , gj = function(a, b, c, d, e) {
            var f, g = fj(a.protocol);
            b && (b = String(b).toLowerCase());
            switch (b) {
                case "url_no_fragment":
                    f = ij(a);
                    break;
                case "protocol":
                    f = g;
                    break;
                case "host":
                    f = a.hostname.replace(cj, "").toLowerCase();
                    if (c) {
                        var h = /^www\d*\./.exec(f);
                        h && h[0] && (f = f.substr(h[0].length))
                    }
                    break;
                case "port":
                    f = String(Number(a.port) || ("http" === g ? 80 : "https" === g ? 443 : ""));
                    break;
                case "path":
                    a.pathname || a.hostname || kb("TAGGING", 1);
                    f = "/" === a.pathname.substr(0, 1) ? a.pathname : "/" + a.pathname;
                    var m = f.split("/");
                    0 <= (d || []).indexOf(m[m.length - 1]) && (m[m.length - 1] = "");
                    f = m.join("/");
                    break;
                case "query":
                    f = a.search.replace("?", "");
                    e && (f = ej(f, e, !1));
                    break;
                case "extension":
                    var n = a.pathname.split(".");
                    f = 1 < n.length ? n[n.length - 1] : "";
                    f = f.split("/")[0];
                    break;
                case "fragment":
                    f = a.hash.replace("#", "");
                    break;
                default:
                    f = a && a.href
            }
            return f
        }
            , fj = function(a) {
            return a ? a.replace(":", "").toLowerCase() : ""
        }
            , ij = function(a) {
            var b = "";
            if (a && a.href) {
                var c = a.href.indexOf("#");
                b = 0 > c ? a.href : a.href.substr(0, c)
            }
            return b
        }
            , jj = {}
            , kj = 0
            , lj = function(a) {
            var b = jj[a];
            if (!b) {
                var c = H.createElement("a");
                a && (c.href = a);
                var d = c.pathname;
                "/" !== d[0] && (a || kb("TAGGING", 1),
                    d = "/" + d);
                var e = c.hostname.replace(cj, "");
                b = {
                    href: c.href,
                    protocol: c.protocol,
                    host: c.host,
                    hostname: e,
                    pathname: d,
                    search: c.search,
                    hash: c.hash,
                    port: c.port
                };
                5 > kj && (jj[a] = b,
                    kj++)
            }
            return b
        }
            , mj = function(a) {
            function b(n) {
                var p = n.split("=")[0];
                return 0 > d.indexOf(p) ? n : p + "=0"
            }
            function c(n) {
                return n.split("&").map(b).filter(function(p) {
                    return void 0 !== p
                }).join("&")
            }
            var d = "gclid dclid gbraid wbraid gclaw gcldc gclha gclgf gclgb _gl".split(" ")
                , e = lj(a)
                , f = a.split(/[?#]/)[0]
                , g = e.search
                , h = e.hash;
            "?" === g[0] && (g = g.substring(1));
            "#" === h[0] && (h = h.substring(1));
            g = c(g);
            h = c(h);
            "" !== g && (g = "?" + g);
            "" !== h && (h = "#" + h);
            var m = "" + f + g + h;
            "/" === m[m.length - 1] && (m = m.substring(0, m.length - 1));
            return m
        }
            , nj = function(a) {
            var b = lj(G.location.href)
                , c = hj(b, "host", !1);
            if (c && c.match(dj)) {
                var d = hj(b, "path").split(a + "=");
                if (1 < d.length)
                    return d[1].split(";")[0].split("?")[0]
            }
        };
        var oj = {
            "https://www.google.com": "/g",
            "https://www.googleadservices.com": "/as",
            "https://pagead2.googlesyndication.com": "/gs"
        };
        function pj(a, b) {
            if (a) {
                var c = "" + a;
                0 !== c.indexOf("http://") && 0 !== c.indexOf("https://") && (c = "https://" + c);
                "/" === c[c.length - 1] && (c = c.substring(0, c.length - 1));
                return lj("" + c + b).href
            }
        }
        function qj() {
            return zi.F || oi
        }
        function rj() {
            return !!gi.Ef && "SGTM_TOKEN" !== gi.Ef.split("@@").join("")
        }
        function sj(a) {
            for (var b = ma([P.g.md, P.g.Kb]), c = b.next(); !c.done; c = b.next()) {
                var d = V(a, c.value);
                if (d)
                    return d
            }
        }
        function tj(a, b) {
            return zi.F ? "" + Ai() + (b ? oj[a] || "" : "") : a
        }
        ;function uj(a) {
            var b = String(a[Ce.ra] || "").replace(/_/g, "");
            0 === b.indexOf("cvt") && (b = "cvt");
            return b
        }
        var vj = 0 <= G.location.search.indexOf("?gtm_latency=") || 0 <= G.location.search.indexOf("&gtm_latency=");
        var xj = function(a, b) {
            var c = wj();
            c.pending || (c.pending = []);
            rb(c.pending, function(d) {
                return d.target.ctid === a.ctid && d.target.isDestination === a.isDestination
            }) || c.pending.push({
                target: a,
                onLoad: b
            })
        }
            , yj = function() {
            this.container = {};
            this.destination = {};
            this.canonical = {};
            this.pending = [];
            this.siloed = []
        }
            , wj = function() {
            var a = rc("google_tag_data", {})
                , b = a.tidr;
            b || (b = new yj,
                a.tidr = b);
            return b
        };
        var zj = {}
            , Aj = !1
            , Gf = {
            ctid: "G-F1RTS0P1CD",
            canonicalContainerId: "84851950",
            Uj: "G-F1RTS0P1CD",
            Vj: "G-F1RTS0P1CD"
        };
        zj.je = xb("");
        function Bj() {
            var a = Cj();
            return Aj ? a.map(Dj) : a
        }
        function Ej() {
            var a = Fj();
            return Aj ? a.map(Dj) : a
        }
        function Gj() {
            return Hj(Gf.ctid)
        }
        function Ij() {
            return Hj(Gf.canonicalContainerId || "_" + Gf.ctid)
        }
        function Cj() {
            return Gf.Uj ? Gf.Uj.split("|") : [Gf.ctid]
        }
        function Fj() {
            return Gf.Vj ? Gf.Vj.split("|") : []
        }
        function Oj() {
            var a = Pj(Qj())
                , b = a && a.parent;
            if (b)
                return Pj(b)
        }
        function Rj() {
            var a = Pj(Qj());
            if (a) {
                for (; a.parent; ) {
                    var b = Pj(a.parent);
                    if (!b)
                        break;
                    a = b
                }
                return a
            }
        }
        function Pj(a) {
            var b = wj();
            return a.isDestination ? b.destination[a.ctid] : b.container[a.ctid]
        }
        function Hj(a) {
            return Aj ? Dj(a) : a
        }
        function Dj(a) {
            return "siloed_" + a
        }
        function Sj(a) {
            return Aj ? Tj(a) : a
        }
        function Tj(a) {
            a = String(a);
            return 0 === a.indexOf("siloed_") ? a.substring(7) : a
        }
        function Uj() {
            var a = !1;
            if (a) {
                var b = wj();
                if (b.siloed) {
                    for (var c = [], d = Cj().map(Dj), e = Fj().map(Dj), f = {}, g = 0; g < b.siloed.length; f = {
                        If: void 0
                    },
                        g++)
                        f.If = b.siloed[g],
                            !Aj && rb(f.If.isDestination ? e : d, function(h) {
                                return function(m) {
                                    return m === h.If.ctid
                                }
                            }(f)) ? Aj = !0 : c.push(f.If);
                    b.siloed = c
                }
            }
        }
        function Vj() {
            var a = wj();
            if (a.pending) {
                for (var b, c = [], d = !1, e = Bj(), f = Ej(), g = {}, h = 0; h < a.pending.length; g = {
                    Ne: void 0
                },
                    h++)
                    g.Ne = a.pending[h],
                        rb(g.Ne.target.isDestination ? f : e, function(m) {
                            return function(n) {
                                return n === m.Ne.target.ctid
                            }
                        }(g)) ? d || (b = g.Ne.onLoad,
                            d = !0) : c.push(g.Ne);
                a.pending = c;
                if (b)
                    try {
                        b(Ij())
                    } catch (m) {}
            }
        }
        function Wj() {
            for (var a = Gf.ctid, b = Bj(), c = Ej(), d = function(n, p) {
                var q = {
                    canonicalContainerId: Gf.canonicalContainerId,
                    scriptContainerId: a,
                    state: 2,
                    containers: b.slice(),
                    destinations: c.slice()
                };
                qc && (q.scriptSource = qc);
                var t = p ? e.destination : e.container
                    , r = t[n];
                r ? (p && 0 === r.state && O(93),
                    Object.assign(r, q)) : t[n] = q
            }, e = wj(), f = ma(b), g = f.next(); !g.done; g = f.next())
                d(g.value, !1);
            for (var h = ma(c), m = h.next(); !m.done; m = h.next())
                d(m.value, !0);
            e.canonical[Ij()] = {};
            Vj()
        }
        function Xj(a) {
            return !!wj().container[a]
        }
        function Yj(a) {
            var b = wj().destination[a];
            return !!b && !!b.state
        }
        function Qj() {
            return {
                ctid: Gj(),
                isDestination: zj.je
            }
        }
        function Zj(a) {
            var b = wj();
            (b.siloed = b.siloed || []).push(a)
        }
        function ak() {
            var a = wj().container, b;
            for (b in a)
                if (a.hasOwnProperty(b) && 1 === a[b].state)
                    return !0;
            return !1
        }
        function bk() {
            var a = {};
            z(wj().destination, function(b, c) {
                0 === c.state && (a[Tj(b)] = c)
            });
            return a
        }
        function ck(a) {
            return !!(a && a.parent && a.context && 1 === a.context.source && 0 !== a.parent.ctid.indexOf("GTM-"))
        }
        var dk = {
            sampleRate: "0.005000",
            nk: "",
            mk: Number("5"),
            Zn: Number("")
        }
            , ek = []
            , fk = []
            , gk = [];
        function hk(a) {
            U(23) ? fk.push(a) : ek.push(a)
        }
        function ik(a) {
            U(23) ? gk.push(a) : ek.push(a)
        }
        var jk = !1, kk;
        if (!(kk = vj)) {
            var lk = Math.random()
                , mk = dk.sampleRate;
            kk = lk < Number(mk)
        }
        var nk = kk
            , ok = "?id=" + Gf.ctid
            , pk = void 0
            , qk = {}
            , rk = void 0
            , sk = new function() {
            var a = 5;
            0 < dk.mk && (a = dk.mk);
            this.F = a;
            this.m = 0;
            this.H = []
        }
            , tk = 1E3;
        function uk(a, b, c, d) {
            var e = pk;
            if (void 0 === e)
                if (c)
                    e = xi();
                else
                    return "";
            var f = [tj("https://www.googletagmanager.com"), "/a", ok]
                , g = ek;
            U(23) && (f = [tj("https://www.googletagmanager.com"), a ? "/td" : "/a", ok],
                g = a ? gk : fk);
            for (var h = ma(g), m = h.next(); !m.done; m = h.next())
                for (var n = m.value, p = n({
                    eventId: e,
                    Xa: !!b,
                    Kj: !!d,
                    Nc: function() {
                        jk = !0
                    }
                }), q = ma(p), t = q.next(); !t.done; t = q.next()) {
                    var r = ma(t.value)
                        , u = r.next().value
                        , v = r.next().value;
                    f.push("&" + u + "=" + v)
                }
            f.push("&z=0");
            return f.join("")
        }
        function vk() {
            if (U(24)) {
                var a = uk(!0, !0);
                jk && (U(23) || (a = a.replace("/a?", "/td?")),
                    zc(a),
                    jk = !1)
            }
        }
        function wk() {
            rk && (G.clearTimeout(rk),
                rk = void 0);
            if (void 0 !== pk && xk) {
                vk();
                var a;
                (a = qk[pk]) || (a = sk.m < sk.F ? !1 : 1E3 > Cb() - sk.H[sk.m % sk.F]);
                if (a || 0 >= tk--)
                    O(1),
                        qk[pk] = !0;
                else {
                    var b = sk.m++ % sk.F;
                    sk.H[b] = Cb();
                    var c = uk(!1, !0);
                    zc(c);
                    var d = U(23) ? uk(!0, !0) : c.replace("/a?", "/td?");
                    jk && zc(d);
                    xk = jk = !1
                }
            }
        }
        var xk = !1;
        function yk(a) {
            qk[a] ? vk() : (a !== pk && (wk(),
                pk = a),
                xk = !0,
            rk || (rk = G.setTimeout(wk, 500)),
            2022 <= uk(!1).length && wk())
        }
        var zk = sb();
        function Ak() {
            zk = sb()
        }
        function Bk() {
            return [["v", "3"], ["t", "t"], ["pid", String(zk)]]
        }
        var Ck = "", Dk, Ek = [], Fk = !1;
        function Gk() {
            var a = [];
            Ck && a.push(["dl", encodeURIComponent(Ck)]);
            0 < Ek.length && a.push(["tdp", Ek.join(".")]);
            void 0 !== Dk && a.push(["frm", String(Dk)]);
            return a
        }
        var Hk = function(a) {
            var b = Fk ? [] : Gk();
            !Fk && a.Xa && (Fk = !0,
            b.length && a.Nc());
            return b
        };
        var Ik = []
            , Jk = [];
        function Kk(a) {
            -1 === Jk.indexOf(a) && (Ik.push(a),
                Jk.push(a))
        }
        function Lk(a) {
            if (!Ik.length)
                return [];
            for (var b = Gk(), c = ma(Ik), d = c.next(); !d.done; d = c.next())
                b.push([d.value, "1"]);
            a.Xa && (a.Nc(),
                Ik.length = 0);
            return b
        }
        ;var Mk = new function(a, b) {
            this.m = a;
            this.defaultValue = void 0 === b ? !1 : b
        }
        (1933);
        function Nk() {
            var a = rc("google_tag_data", {});
            return a.ics = a.ics || new Ok
        }
        var Ok = function() {
            this.entries = {};
            this.waitPeriodTimedOut = this.wasSetLate = this.accessedAny = this.accessedDefault = this.usedImplicit = this.usedUpdate = this.usedDefault = this.usedDeclare = this.active = !1;
            this.m = []
        };
        Ok.prototype.default = function(a, b, c, d, e, f, g) {
            this.usedDefault || this.usedDeclare || !this.accessedDefault && !this.accessedAny || (this.wasSetLate = !0);
            this.usedDefault = this.active = !0;
            kb("TAGGING", 19);
            null == b ? kb("TAGGING", 18) : Pk(this, a, "granted" === b, c, d, e, f, g)
        }
        ;
        Ok.prototype.waitForUpdate = function(a, b, c) {
            for (var d = 0; d < a.length; d++)
                Pk(this, a[d], void 0, void 0, "", "", b, c)
        }
        ;
        var Pk = function(a, b, c, d, e, f, g, h) {
            var m = a.entries
                , n = m[b] || {}
                , p = n.region
                , q = d && l(d) ? d.toUpperCase() : void 0;
            e = e.toUpperCase();
            f = f.toUpperCase();
            if ("" === e || q === f || (q === e ? p !== f : !q && !p)) {
                var t = !!(g && 0 < g && void 0 === n.update)
                    , r = {
                    region: q,
                    declare_region: n.declare_region,
                    implicit: n.implicit,
                    default: void 0 !== c ? c : n.default,
                    declare: n.declare,
                    update: n.update,
                    quiet: t
                };
                if ("" !== e || !1 !== n.default)
                    m[b] = r;
                t && G.setTimeout(function() {
                    m[b] === r && r.quiet && (kb("TAGGING", 2),
                        a.waitPeriodTimedOut = !0,
                        a.clearTimeout(b, void 0, h),
                        a.notifyListeners())
                }, g)
            }
        };
        aa = Ok.prototype;
        aa.clearTimeout = function(a, b, c) {
            var d = [a], e = (null == c ? void 0 : c.delegatedConsentTypes) || {}, f;
            for (f in e)
                e.hasOwnProperty(f) && e[f] === a && d.push(f);
            var g = this.entries[a] || {}
                , h = this.getConsentState(a, c);
            if (g.quiet) {
                g.quiet = !1;
                for (var m = ma(d), n = m.next(); !n.done; n = m.next())
                    Qk(this, n.value)
            } else if (void 0 !== b && h !== b)
                for (var p = ma(d), q = p.next(); !q.done; q = p.next())
                    Qk(this, q.value)
        }
        ;
        aa.update = function(a, b, c) {
            this.usedDefault || this.usedDeclare || this.usedUpdate || !this.accessedAny || (this.wasSetLate = !0);
            this.usedUpdate = this.active = !0;
            if (null != b) {
                var d = this.getConsentState(a, c)
                    , e = this.entries;
                (e[a] = e[a] || {}).update = "granted" === b;
                this.clearTimeout(a, d, c)
            }
        }
        ;
        aa.declare = function(a, b, c, d, e) {
            this.usedDeclare = this.active = !0;
            var f = this.entries
                , g = f[a] || {}
                , h = g.declare_region
                , m = c && l(c) ? c.toUpperCase() : void 0;
            d = d.toUpperCase();
            e = e.toUpperCase();
            if ("" === d || m === e || (m === d ? h !== e : !m && !h)) {
                var n = {
                    region: g.region,
                    declare_region: m,
                    declare: "granted" === b,
                    implicit: g.implicit,
                    default: g.default,
                    update: g.update,
                    quiet: g.quiet
                };
                if ("" !== d || !1 !== g.declare)
                    f[a] = n
            }
        }
        ;
        aa.implicit = function(a, b) {
            this.usedImplicit = !0;
            var c = this.entries
                , d = c[a] = c[a] || {};
            !1 !== d.implicit && (d.implicit = "granted" === b)
        }
        ;
        aa.getConsentState = function(a, b) {
            var c = this.entries
                , d = c[a] || {}
                , e = d.update;
            if (void 0 !== e)
                return e ? 1 : 2;
            e = d.default;
            if (void 0 !== e)
                return e ? 1 : 2;
            if (null == b ? 0 : b.delegatedConsentTypes.hasOwnProperty(a)) {
                var f = c[b.delegatedConsentTypes[a]] || {};
                e = f.update;
                if (void 0 !== e)
                    return e ? 1 : 2;
                e = f.default;
                if (void 0 !== e)
                    return e ? 1 : 2
            }
            e = d.declare;
            if (void 0 !== e)
                return e ? 1 : 2;
            e = d.implicit;
            return void 0 !== e ? e ? 3 : 4 : 0
        }
        ;
        aa.addListener = function(a, b) {
            this.m.push({
                consentTypes: a,
                Dl: b
            })
        }
        ;
        var Qk = function(a, b) {
            for (var c = 0; c < a.m.length; ++c) {
                var d = a.m[c];
                Array.isArray(d.consentTypes) && -1 !== d.consentTypes.indexOf(b) && (d.Wj = !0)
            }
        };
        Ok.prototype.notifyListeners = function(a, b) {
            for (var c = 0; c < this.m.length; ++c) {
                var d = this.m[c];
                if (d.Wj) {
                    d.Wj = !1;
                    try {
                        d.Dl({
                            consentEventId: a,
                            consentPriorityId: b
                        })
                    } catch (e) {}
                }
            }
        }
        ;
        var Rk = function(a) {
            Rk[" "](a);
            return a
        };
        Rk[" "] = function() {}
        ;
        var Tk = function() {
            var a = Sk
                , b = "vh";
            if (a.vh && a.hasOwnProperty(b))
                return a.vh;
            var c = new a;
            return a.vh = c
        };
        var Sk = function() {
            var a = {};
            this.m = function() {
                var b = Mk.m
                    , c = Mk.defaultValue;
                return null != a[b] ? a[b] : c
            }
            ;
            this.F = function() {
                a[Mk.m] = !0
            }
        };
        var Uk = !1
            , Vk = !1
            , Wk = {
            delegatedConsentTypes: {},
            corePlatformServices: {},
            usedCorePlatformServices: !1
        }
            , Xk = function(a) {
            var b = Nk();
            b.accessedAny = !0;
            return (l(a) ? [a] : a).every(function(c) {
                switch (b.getConsentState(c, Wk)) {
                    case 1:
                    case 3:
                        return !0;
                    case 2:
                    case 4:
                        return !1;
                    default:
                        return !0
                }
            })
        }
            , Yk = function(a) {
            var b = Nk();
            b.accessedAny = !0;
            return b.getConsentState(a, Wk)
        }
            , Zk = function(a) {
            for (var b = {}, c = ma(a), d = c.next(); !d.done; d = c.next()) {
                var e = d.value;
                b[e] = !1 !== Wk.corePlatformServices[e]
            }
            return b
        }
            , $k = function(a) {
            var b = Nk();
            b.accessedAny = !0;
            return !(b.entries[a] || {}).quiet
        }
            , al = function() {
            if (!Tk().m())
                return !1;
            var a = Nk();
            a.accessedAny = !0;
            return a.active
        }
            , bl = function(a, b) {
            Nk().addListener(a, b)
        }
            , cl = function(a, b) {
            Nk().notifyListeners(a, b)
        }
            , dl = function(a, b) {
            function c() {
                for (var e = 0; e < b.length; e++)
                    if (!$k(b[e]))
                        return !0;
                return !1
            }
            if (c()) {
                var d = !1;
                bl(b, function(e) {
                    d || c() || (d = !0,
                        a(e))
                })
            } else
                a({})
        }
            , el = function(a, b) {
            function c() {
                for (var h = [], m = 0; m < e.length; m++) {
                    var n = e[m];
                    Xk(n) && !f[n] && h.push(n)
                }
                return h
            }
            function d(h) {
                for (var m = 0; m < h.length; m++)
                    f[h[m]] = !0
            }
            var e = l(b) ? [b] : b
                , f = {}
                , g = c();
            g.length !== e.length && (d(g),
                bl(e, function(h) {
                    function m(q) {
                        0 !== q.length && (d(q),
                            h.consentTypes = q,
                            a(h))
                    }
                    var n = c();
                    if (0 !== n.length) {
                        var p = Object.keys(f).length;
                        n.length + p >= e.length ? m(n) : G.setTimeout(function() {
                            m(c())
                        }, 500)
                    }
                }))
        };
        var fl = [P.g.R, P.g.W, P.g.P, P.g.Aa], gl, hl, il = function(a) {
            for (var b = a[P.g.kc], c = Array.isArray(b) ? b : [b], d = {
                De: 0
            }; d.De < c.length; d = {
                De: d.De
            },
                     ++d.De)
                z(a, function(e) {
                    return function(f, g) {
                        if (f !== P.g.kc) {
                            var h = c[e.De]
                                , m = Xi()
                                , n = Wi["1"] || "";
                            Vk = !0;
                            Uk && kb("TAGGING", 20);
                            Nk().declare(f, g, h, m, n)
                        }
                    }
                }(d))
        }, jl = function(a) {
            !hl && gl && Kk("crc");
            hl = !0;
            var b = a[P.g.kc];
            b && O(40);
            var c = a[P.g.Ue];
            c && O(41);
            for (var d = Array.isArray(b) ? b : [b], e = {
                Ee: 0
            }; e.Ee < d.length; e = {
                Ee: e.Ee
            },
                     ++e.Ee)
                z(a, function(f) {
                    return function(g, h) {
                        if (g !== P.g.kc && g !== P.g.Ue) {
                            var m = d[f.Ee]
                                , n = Number(c)
                                , p = Xi()
                                , q = Wi["1"] || "";
                            n = void 0 === n ? 0 : n;
                            Uk = !0;
                            Vk && kb("TAGGING", 20);
                            Nk().default(g, h, m, p, q, n, Wk)
                        }
                    }
                }(e))
        }, kl = function(a, b) {
            gl = !0;
            z(a, function(c, d) {
                Uk = !0;
                Vk && kb("TAGGING", 20);
                Nk().update(c, d, Wk)
            });
            cl(b.eventId, b.priorityId)
        }, ll = function(a) {
            a.hasOwnProperty("all") && z(fi, function(b) {
                Wk.corePlatformServices[b] = "granted" === a.all;
                Wk.usedCorePlatformServices = !0
            });
            z(a, function(b, c) {
                "all" !== b && (Wk.corePlatformServices[b] = "granted" === c,
                    Wk.usedCorePlatformServices = !0)
            })
        }, X = function(a) {
            Array.isArray(a) || (a = [a]);
            return a.every(function(b) {
                return Xk(b)
            })
        }, ml = function(a, b) {
            bl(a, b)
        }, nl = function(a, b) {
            el(a, b)
        }, ol = function(a, b) {
            dl(a, b)
        }, pl = function() {
            var a = [P.g.R, P.g.Aa, P.g.P];
            Nk().waitForUpdate(a, 500, Wk)
        }, ql = function(a) {
            for (var b = ma(a), c = b.next(); !c.done; c = b.next()) {
                var d = c.value;
                Nk().clearTimeout(d, void 0, Wk)
            }
            cl()
        };
        var rl = function() {
            if (void 0 === hi.pscdl) {
                var a = function(b) {
                    hi.pscdl = b
                };
                try {
                    "cookieDeprecationLabel"in oc ? (a("pending"),
                        oc.cookieDeprecationLabel.getValue().then(a)) : a("noapi")
                } catch (b) {
                    a("error")
                }
            }
        };
        var sl = function(a, b, c, d, e, f, g, h, m, n, p) {
            this.eventId = a;
            this.priorityId = b;
            this.m = c;
            this.T = d;
            this.H = e;
            this.M = f;
            this.F = g;
            this.eventMetadata = h;
            this.onSuccess = m;
            this.onFailure = n;
            this.isGtmEvent = p
        }
            , tl = function(a, b) {
            var c = [];
            switch (b) {
                case 3:
                    c.push(a.m);
                    c.push(a.T);
                    c.push(a.H);
                    c.push(a.M);
                    c.push(a.F);
                    break;
                case 2:
                    c.push(a.m);
                    break;
                case 1:
                    c.push(a.T);
                    c.push(a.H);
                    c.push(a.M);
                    c.push(a.F);
                    break;
                case 4:
                    c.push(a.m),
                        c.push(a.T),
                        c.push(a.H),
                        c.push(a.M)
            }
            return c
        }
            , V = function(a, b, c, d) {
            for (var e = ma(tl(a, void 0 === d ? 3 : d)), f = e.next(); !f.done; f = e.next()) {
                var g = f.value;
                if (void 0 !== g[b])
                    return g[b]
            }
            return c
        }
            , ul = function(a) {
            for (var b = {}, c = tl(a, 4), d = ma(c), e = d.next(); !e.done; e = d.next())
                for (var f = Object.keys(e.value), g = ma(f), h = g.next(); !h.done; h = g.next())
                    b[h.value] = 1;
            return Object.keys(b)
        }
            , vl = function(a, b, c) {
            function d(n) {
                Va(n) && z(n, function(p, q) {
                    f = !0;
                    e[p] = q
                })
            }
            var e = {}
                , f = !1
                , g = tl(a, void 0 === c ? 3 : c);
            g.reverse();
            for (var h = ma(g), m = h.next(); !m.done; m = h.next())
                d(m.value[b]);
            return f ? e : void 0
        }
            , wl = function(a) {
            for (var b = [P.g.Uc, P.g.Qc, P.g.Rc, P.g.Sc, P.g.Tc, P.g.Vc, P.g.Wc], c = tl(a, 3), d = ma(c), e = d.next(); !e.done; e = d.next()) {
                for (var f = e.value, g = {}, h = !1, m = ma(b), n = m.next(); !n.done; n = m.next()) {
                    var p = n.value;
                    void 0 !== f[p] && (g[p] = f[p],
                        h = !0)
                }
                var q = h ? g : void 0;
                if (q)
                    return q
            }
            return {}
        }
            , xl = function(a, b) {
            this.eventId = a;
            this.priorityId = b;
            this.F = {};
            this.T = {};
            this.m = {};
            this.H = {};
            this.da = {};
            this.M = {};
            this.eventMetadata = {};
            this.isGtmEvent = !1;
            this.onSuccess = function() {}
            ;
            this.onFailure = function() {}
        }
            , yl = function(a, b) {
            a.F = b;
            return a
        }
            , zl = function(a, b) {
            a.T = b;
            return a
        }
            , Al = function(a, b) {
            a.m = b;
            return a
        }
            , Bl = function(a, b) {
            a.H = b;
            return a
        }
            , Cl = function(a, b) {
            a.da = b;
            return a
        }
            , Dl = function(a, b) {
            a.M = b;
            return a
        }
            , El = function(a, b) {
            a.eventMetadata = b || {};
            return a
        }
            , Fl = function(a, b) {
            a.onSuccess = b;
            return a
        }
            , Gl = function(a, b) {
            a.onFailure = b;
            return a
        }
            , Hl = function(a, b) {
            a.isGtmEvent = b;
            return a
        }
            , Il = function(a) {
            return new sl(a.eventId,a.priorityId,a.F,a.T,a.m,a.H,a.M,a.eventMetadata,a.onSuccess,a.onFailure,a.isGtmEvent)
        };
        var Jl = /[A-Z]+/
            , Kl = /\s/;
        function Ll(a, b) {
            if (l(a)) {
                a = zb(a);
                var c = a.indexOf("-");
                if (!(0 > c)) {
                    var d = a.substring(0, c);
                    if (Jl.test(d)) {
                        var e = a.substring(c + 1), f;
                        if (b) {
                            var g = function(n) {
                                var p = n.indexOf("/");
                                return 0 > p ? [n] : [n.substring(0, p), n.substring(p + 1)]
                            };
                            f = g(e);
                            if ("DC" === d && 2 === f.length) {
                                var h = g(f[1]);
                                2 === h.length && (f[1] = h[0],
                                    f.push(h[1]))
                            }
                        } else {
                            f = e.split("/");
                            for (var m = 0; m < f.length; m++)
                                if (!f[m] || Kl.test(f[m]) && ("AW" !== d || 1 !== m))
                                    return
                        }
                        return {
                            id: a,
                            prefix: d,
                            ka: d + "-" + f[0],
                            ma: f
                        }
                    }
                }
            }
        }
        function Ml(a, b) {
            for (var c = {}, d = 0; d < a.length; ++d) {
                var e = Ll(a[d], b);
                e && (c[e.id] = e)
            }
            Nl(c);
            var f = [];
            z(c, function(g, h) {
                f.push(h)
            });
            return f
        }
        function Nl(a) {
            var b = [], c;
            for (c in a)
                if (a.hasOwnProperty(c)) {
                    var d = a[c];
                    "AW" === d.prefix && d.ma[Ol[2]] && b.push(d.ka)
                }
            for (var e = 0; e < b.length; ++e)
                delete a[b[e]]
        }
        var Pl = {}
            , Ol = (Pl[0] = 0,
            Pl[1] = 0,
            Pl[2] = 1,
            Pl[3] = 0,
            Pl[4] = 1,
            Pl[5] = 2,
            Pl[6] = 0,
            Pl[7] = 0,
            Pl[8] = 0,
            Pl);
        var Ql = {};
        function Rl(a, b, c) {
            nk && void 0 !== a && (Ql[a] = Ql[a] || [],
                Ql[a].push(c + b),
                yk(a))
        }
        function Sl(a) {
            var b = a.eventId
                , c = a.Xa
                , d = []
                , e = Ql[b] || [];
            e.length && d.push(["epr", e.join(".")]);
            c && delete Ql[b];
            return d
        }
        ;var Tl = []
            , Ul = {
                initialized: 11,
                complete: 12,
                interactive: 13
            }
            , Vl = {}
            , Wl = Object.freeze((Vl[P.g.Ka] = !0,
                Vl))
            , Xl = 0 <= H.location.search.indexOf("?gtm_diagnostics=") || 0 <= H.location.search.indexOf("&gtm_diagnostics=");
        function Yl(a, b, c) {
            if (nk && "config" === a) {
                var d, e = null == (d = Ll(b)) ? void 0 : d.ma;
                if (!(e && 1 < e.length)) {
                    var f, g = rc("google_tag_data", {});
                    g.td || (g.td = {});
                    f = g.td;
                    var h = k(c.M);
                    k(c.m, h);
                    var m = [], n;
                    for (n in f)
                        if (f.hasOwnProperty(n)) {
                            var p = Zl(f[n], h);
                            p.length && (Xl && console.log(p),
                                m.push(n))
                        }
                    m.length && (m.length && nk && Tl.push(b + "*" + m.join(".")),
                        kb("TAGGING", Ul[H.readyState] || 14));
                    f[b] = h
                }
            }
        }
        function $l(a, b) {
            var c = {}, d;
            for (d in b)
                b.hasOwnProperty(d) && (c[d] = !0);
            for (var e in a)
                a.hasOwnProperty(e) && (c[e] = !0);
            return c
        }
        function Zl(a, b, c, d) {
            c = void 0 === c ? {} : c;
            d = void 0 === d ? "" : d;
            if (a === b)
                return [];
            var e = function(t, r) {
                var u;
                "object" === Ta(r) ? u = r[t] : "array" === Ta(r) && (u = r[t]);
                return void 0 === u ? Wl[t] : u
            }, f = $l(a, b), g;
            for (g in f)
                if (f.hasOwnProperty(g)) {
                    var h = (d ? d + "." : "") + g
                        , m = e(g, a)
                        , n = e(g, b)
                        , p = "object" === Ta(m) || "array" === Ta(m)
                        , q = "object" === Ta(n) || "array" === Ta(n);
                    if (p && q)
                        Zl(m, n, c, h);
                    else if (p || q || m !== n)
                        c[h] = !0
                }
            return Object.keys(c)
        }
        function am(a) {
            if (!Tl.length)
                return [];
            var b = [["tdc", Tl.join("!")]];
            a.Xa && (a.Nc(),
                Tl.length = 0);
            return b
        }
        ;var cm = function(a, b) {
            var c = Ll(Hj(a), !0);
            c && bm.register(c, b)
        }
            , dm = function(a, b, c, d) {
                var e = Ll(c, d.isGtmEvent);
                e && bm.push("event", [b, a], e, d)
            }
            , em = function(a, b, c, d) {
                var e = Ll(c, d.isGtmEvent);
                e && bm.push("get", [a, b], e, d)
            }
            , gm = function(a) {
                var b = Ll(Hj(a), !0), c;
                b ? c = fm(bm, b).m : c = {};
                return c
            }
            , hm = function(a, b) {
                var c = Ll(Hj(a), !0);
                if (c) {
                    var d = bm
                        , e = k(b);
                    k(fm(d, c).m, e);
                    fm(d, c).m = e
                }
            }
            , im = function() {
                this.status = 1;
                this.T = {};
                this.m = {};
                this.F = {};
                this.da = null;
                this.M = {};
                this.H = !1
            }
            , jm = function(a, b, c, d) {
                var e = Cb();
                this.type = a;
                this.F = e;
                this.m = b;
                this.args = c;
                this.messageContext = d
            }
            , km = function() {
                this.F = {};
                this.H = {};
                this.m = []
            }
            , fm = function(a, b) {
                var c = b.ka;
                return a.F[c] = a.F[c] || new im
            }
            , lm = function(a, b, c, d) {
                if (d.m) {
                    var e = fm(a, d.m)
                        , f = e.da;
                    if (f) {
                        var g = k(c)
                            , h = k(e.T[d.m.id])
                            , m = k(e.M)
                            , n = k(e.m)
                            , p = k(a.H)
                            , q = {};
                        if (nk)
                            try {
                                q = k(Di)
                            } catch (v) {
                                O(72)
                            }
                        var t = d.m.prefix
                            , r = function(v) {
                            Rl(d.messageContext.eventId, t, v)
                        }
                            , u = Il(Hl(Gl(Fl(El(Cl(Bl(Dl(Al(zl(yl(new xl(d.messageContext.eventId,d.messageContext.priorityId), g), h), m), n), p), q), d.messageContext.eventMetadata), function() {
                            if (r) {
                                var v = r;
                                r = void 0;
                                v("2");
                                if (d.messageContext.onSuccess)
                                    d.messageContext.onSuccess()
                            }
                        }), function() {
                            if (r) {
                                var v = r;
                                r = void 0;
                                v("3");
                                if (d.messageContext.onFailure)
                                    d.messageContext.onFailure()
                            }
                        }), !!d.messageContext.isGtmEvent));
                        try {
                            Rl(d.messageContext.eventId, t, "1"),
                                Yl(d.type, d.m.id, u),
                                f(d.m.id, b, d.F, u)
                        } catch (v) {
                            Rl(d.messageContext.eventId, t, "4")
                        }
                    }
                }
            };
        km.prototype.register = function(a, b, c) {
            var d = fm(this, a);
            3 !== d.status && (d.da = b,
                d.status = 3,
            c && (k(d.m, c),
                d.m = c),
                this.flush())
        }
        ;
        km.prototype.push = function(a, b, c, d) {
            void 0 !== c && (1 === fm(this, c).status && (fm(this, c).status = 2,
                this.push("require", [{}], c, {})),
            fm(this, c).H && (d.deferrable = !1));
            this.m.push(new jm(a,c,b,d));
            d.deferrable || this.flush()
        }
        ;
        km.prototype.flush = function(a) {
            for (var b = this, c = [], d = !1, e = {}; this.m.length; e = {
                Ec: void 0,
                lh: void 0
            }) {
                var f = this.m[0]
                    , g = f.m;
                if (f.messageContext.deferrable)
                    !g || fm(this, g).H ? (f.messageContext.deferrable = !1,
                        this.m.push(f)) : c.push(f),
                        this.m.shift();
                else {
                    switch (f.type) {
                        case "require":
                            if (3 !== fm(this, g).status && !a) {
                                this.m.push.apply(this.m, c);
                                return
                            }
                            break;
                        case "set":
                            z(f.args[0], function(t, r) {
                                k(Jb(t, r), b.H)
                            });
                            break;
                        case "config":
                            var h = fm(this, g);
                            e.Ec = {};
                            z(f.args[0], function(t) {
                                return function(r, u) {
                                    k(Jb(r, u), t.Ec)
                                }
                            }(e));
                            var m = !!e.Ec[P.g.Xb];
                            delete e.Ec[P.g.Xb];
                            var n = g.ka === g.id;
                            m || (n ? h.M = {} : h.T[g.id] = {});
                            h.H && m || lm(this, P.g.fa, e.Ec, f);
                            h.H = !0;
                            n ? k(e.Ec, h.M) : (k(e.Ec, h.T[g.id]),
                                O(70));
                            d = !0;
                            break;
                        case "event":
                            e.lh = {};
                            z(f.args[0], function(t) {
                                return function(r, u) {
                                    k(Jb(r, u), t.lh)
                                }
                            }(e));
                            lm(this, f.args[1], e.lh, f);
                            break;
                        case "get":
                            var p = {}
                                , q = (p[P.g.qb] = f.args[0],
                                p[P.g.Eb] = f.args[1],
                                p);
                            lm(this, P.g.Ra, q, f)
                    }
                    this.m.shift();
                    mm(this, f)
                }
            }
            this.m.push.apply(this.m, c);
            d && this.flush()
        }
        ;
        var mm = function(a, b) {
            if ("require" !== b.type)
                if (b.m)
                    for (var c = fm(a, b.m).F[b.type] || [], d = 0; d < c.length; d++)
                        c[d]();
                else
                    for (var e in a.F)
                        if (a.F.hasOwnProperty(e)) {
                            var f = a.F[e];
                            if (f && f.F)
                                for (var g = f.F[b.type] || [], h = 0; h < g.length; h++)
                                    g[h]()
                        }
        }
            , bm = new km;
        var nm = function(a, b) {
            var c = function() {};
            c.prototype = a.prototype;
            var d = new c;
            a.apply(d, Array.prototype.slice.call(arguments, 1));
            return d
        }
            , om = function(a) {
            var b = a;
            return function() {
                if (b) {
                    var c = b;
                    b = null;
                    c()
                }
            }
        };
        var pm = function(a, b, c) {
            a.addEventListener && a.addEventListener(b, c, !1)
        };
        var qm, rm;
        a: {
            for (var sm = ["CLOSURE_FLAGS"], tm = Ba, um = 0; um < sm.length; um++)
                if (tm = tm[sm[um]],
                null == tm) {
                    rm = null;
                    break a
                }
            rm = tm
        }
        var vm = rm && rm[610401301];
        qm = null != vm ? vm : !1;
        function wm() {
            var a = Ba.navigator;
            if (a) {
                var b = a.userAgent;
                if (b)
                    return b
            }
            return ""
        }
        var xm, ym = Ba.navigator;
        xm = ym ? ym.userAgentData || null : null;
        function zm(a) {
            return qm ? xm ? xm.brands.some(function(b) {
                var c = b.brand;
                return c && -1 != c.indexOf(a)
            }) : !1 : !1
        }
        function Am(a) {
            return -1 != wm().indexOf(a)
        }
        ;function Bm() {
            return qm ? !!xm && 0 < xm.brands.length : !1
        }
        function Cm() {
            return Bm() ? !1 : Am("Opera")
        }
        function Dm() {
            return Am("Firefox") || Am("FxiOS")
        }
        function Em() {
            return Bm() ? zm("Chromium") : (Am("Chrome") || Am("CriOS")) && !(Bm() ? 0 : Am("Edge")) || Am("Silk")
        }
        ;function Fm() {
            return qm ? !!xm && !!xm.platform : !1
        }
        function Gm() {
            return Am("iPhone") && !Am("iPod") && !Am("iPad")
        }
        function Hm() {
            Gm() || Am("iPad") || Am("iPod")
        }
        ;Cm();
        Bm() || Am("Trident") || Am("MSIE");
        Am("Edge");
        !Am("Gecko") || -1 != wm().toLowerCase().indexOf("webkit") && !Am("Edge") || Am("Trident") || Am("MSIE") || Am("Edge");
        -1 != wm().toLowerCase().indexOf("webkit") && !Am("Edge") && Am("Mobile");
        Fm() || Am("Macintosh");
        Fm() || Am("Windows");
        (Fm() ? "Linux" === xm.platform : Am("Linux")) || Fm() || Am("CrOS");
        Fm() || Am("Android");
        Gm();
        Am("iPad");
        Am("iPod");
        Hm();
        wm().toLowerCase().indexOf("kaios");
        var Im = function(a, b, c, d) {
            for (var e = b, f = c.length; 0 <= (e = a.indexOf(c, e)) && e < d; ) {
                var g = a.charCodeAt(e - 1);
                if (38 == g || 63 == g) {
                    var h = a.charCodeAt(e + f);
                    if (!h || 61 == h || 38 == h || 35 == h)
                        return e
                }
                e += f + 1
            }
            return -1
        }
            , Jm = /#|$/
            , Km = function(a, b) {
            var c = a.search(Jm)
                , d = Im(a, 0, b, c);
            if (0 > d)
                return null;
            var e = a.indexOf("&", d);
            if (0 > e || e > c)
                e = c;
            d += b.length + 1;
            return decodeURIComponent(a.slice(d, -1 !== e ? e : 0).replace(/\+/g, " "))
        }
            , Lm = /[?&]($|#)/
            , Mm = function(a, b, c) {
            for (var d, e = a.search(Jm), f = 0, g, h = []; 0 <= (g = Im(a, f, b, e)); )
                h.push(a.substring(f, g)),
                    f = Math.min(a.indexOf("&", g) + 1 || e, e);
            h.push(a.slice(f));
            d = h.join("").replace(Lm, "$1");
            var m, n = null != c ? "=" + encodeURIComponent(String(c)) : "";
            var p = b + n;
            if (p) {
                var q, t = d.indexOf("#");
                0 > t && (t = d.length);
                var r = d.indexOf("?"), u;
                0 > r || r > t ? (r = t,
                    u = "") : u = d.substring(r + 1, t);
                q = [d.slice(0, r), u, d.slice(t)];
                var v = q[1];
                q[1] = p ? v ? v + "&" + p : p : v;
                m = q[0] + (q[1] ? "?" + q[1] : "") + q[2]
            } else
                m = d;
            return m
        };
        var Nm = function(a) {
            try {
                var b;
                if (b = !!a && null != a.location.href)
                    a: {
                        try {
                            Rk(a.foo);
                            b = !0;
                            break a
                        } catch (c) {}
                        b = !1
                    }
                return b
            } catch (c) {
                return !1
            }
        }
            , Om = function(a, b) {
            if (a)
                for (var c in a)
                    Object.prototype.hasOwnProperty.call(a, c) && b(a[c], c, a)
        };
        function Pm(a) {
            if (!a || !H.head)
                return null;
            var b = Qm("META");
            H.head.appendChild(b);
            b.httpEquiv = "origin-trial";
            b.content = a;
            return b
        }
        var Rm = function(a) {
            if (G.top == G)
                return 0;
            if (void 0 === a ? 0 : a) {
                var b = G.location.ancestorOrigins;
                if (b)
                    return b[b.length - 1] == G.location.origin ? 1 : 2
            }
            return Nm(G.top) ? 1 : 2
        }
            , Qm = function(a, b) {
            b = void 0 === b ? document : b;
            return b.createElement(String(a).toLowerCase())
        };
        function Sm(a, b, c, d) {
            d = void 0 === d ? !1 : d;
            a.google_image_requests || (a.google_image_requests = []);
            var e = Qm("IMG", a.document);
            if (c) {
                var f = function() {
                    if (c) {
                        var g = a.google_image_requests
                            , h = ic(g, e);
                        0 <= h && Array.prototype.splice.call(g, h, 1)
                    }
                    e.removeEventListener && e.removeEventListener("load", f, !1);
                    e.removeEventListener && e.removeEventListener("error", f, !1)
                };
                pm(e, "load", f);
                pm(e, "error", f)
            }
            d && (e.attributionSrc = "");
            e.src = b;
            a.google_image_requests.push(e)
        }
        var Um = function(a) {
            var b;
            b = void 0 === b ? !1 : b;
            var c = "https://pagead2.googlesyndication.com/pagead/gen_204?id=tcfe";
            Om(a, function(d, e) {
                if (d || 0 === d)
                    c += "&" + e + "=" + encodeURIComponent("" + d)
            });
            Tm(c, b)
        }
            , Tm = function(a, b) {
            var c = window, d;
            b = void 0 === b ? !1 : b;
            d = void 0 === d ? !1 : d;
            if (c.fetch) {
                var e = {
                    keepalive: !0,
                    credentials: "include",
                    redirect: "follow",
                    method: "get",
                    mode: "no-cors"
                };
                d && (e.mode = "cors",
                    "setAttributionReporting"in XMLHttpRequest.prototype ? e.attributionReporting = {
                        eventSourceEligible: "true",
                        triggerEligible: "false"
                    } : e.headers = {
                        "Attribution-Reporting-Eligible": "event-source"
                    });
                c.fetch(a, e)
            } else
                Sm(c, a, void 0 === b ? !1 : b, void 0 === d ? !1 : d)
        };
        var Vm = function() {
            this.T = this.T;
            this.H = this.H
        };
        Vm.prototype.T = !1;
        Vm.prototype.addOnDisposeCallback = function(a, b) {
            this.T ? void 0 !== b ? a.call(b) : a() : (this.H || (this.H = []),
                this.H.push(void 0 !== b ? Ea(a, b) : a))
        }
        ;
        var Wm = function(a) {
            void 0 !== a.addtlConsent && "string" !== typeof a.addtlConsent && (a.addtlConsent = void 0);
            void 0 !== a.gdprApplies && "boolean" !== typeof a.gdprApplies && (a.gdprApplies = void 0);
            return void 0 !== a.tcString && "string" !== typeof a.tcString || void 0 !== a.listenerId && "number" !== typeof a.listenerId ? 2 : a.cmpStatus && "error" !== a.cmpStatus ? 0 : 3
        }
            , Xm = function(a, b) {
            b = void 0 === b ? {} : b;
            Vm.call(this);
            this.F = a;
            this.m = null;
            this.Wa = {};
            this.Dc = 0;
            var c;
            this.Yb = null != (c = b.Zm) ? c : 500;
            var d;
            this.da = null != (d = b.Nn) ? d : !1;
            this.M = null
        };
        ya(Xm, Vm);
        var Zm = function(a) {
            return "function" === typeof a.F.__tcfapi || null != Ym(a)
        };
        Xm.prototype.addEventListener = function(a) {
            var b = this
                , c = {
                internalBlockOnErrors: this.da
            }
                , d = om(function() {
                return a(c)
            })
                , e = 0;
            -1 !== this.Yb && (e = setTimeout(function() {
                c.tcString = "tcunavailable";
                c.internalErrorState = 1;
                d()
            }, this.Yb));
            var f = function(g, h) {
                clearTimeout(e);
                g ? (c = g,
                    c.internalErrorState = Wm(c),
                    c.internalBlockOnErrors = b.da,
                h && 0 === c.internalErrorState || (c.tcString = "tcunavailable",
                h || (c.internalErrorState = 3))) : (c.tcString = "tcunavailable",
                    c.internalErrorState = 3);
                a(c)
            };
            try {
                $m(this, "addEventListener", f)
            } catch (g) {
                c.tcString = "tcunavailable",
                    c.internalErrorState = 3,
                e && (clearTimeout(e),
                    e = 0),
                    d()
            }
        }
        ;
        Xm.prototype.removeEventListener = function(a) {
            a && a.listenerId && $m(this, "removeEventListener", null, a.listenerId)
        }
        ;
        var bn = function(a, b, c) {
            var d;
            d = void 0 === d ? "755" : d;
            var e;
            a: {
                if (a.publisher && a.publisher.restrictions) {
                    var f = a.publisher.restrictions[b];
                    if (void 0 !== f) {
                        e = f[void 0 === d ? "755" : d];
                        break a
                    }
                }
                e = void 0
            }
            var g = e;
            if (0 === g)
                return !1;
            var h = c;
            2 === c ? (h = 0,
            2 === g && (h = 1)) : 3 === c && (h = 1,
            1 === g && (h = 0));
            var m;
            if (0 === h)
                if (a.purpose && a.vendor) {
                    var n = an(a.vendor.consents, void 0 === d ? "755" : d);
                    m = n && "1" === b && a.purposeOneTreatment && "CH" === a.publisherCC ? !0 : n && an(a.purpose.consents, b)
                } else
                    m = !0;
            else
                m = 1 === h ? a.purpose && a.vendor ? an(a.purpose.legitimateInterests, b) && an(a.vendor.legitimateInterests, void 0 === d ? "755" : d) : !0 : !0;
            return m
        }
            , an = function(a, b) {
            return !(!a || !a[b])
        }
            , $m = function(a, b, c, d) {
            c || (c = function() {}
            );
            if ("function" === typeof a.F.__tcfapi) {
                var e = a.F.__tcfapi;
                e(b, 2, c, d)
            } else if (Ym(a)) {
                cn(a);
                var f = ++a.Dc;
                a.Wa[f] = c;
                if (a.m) {
                    var g = {};
                    a.m.postMessage((g.__tcfapiCall = {
                        command: b,
                        version: 2,
                        callId: f,
                        parameter: d
                    },
                        g), "*")
                }
            } else
                c({}, !1)
        }
            , Ym = function(a) {
            if (a.m)
                return a.m;
            var b;
            a: {
                for (var c = a.F, d = 0; 50 > d; ++d) {
                    var e;
                    try {
                        e = !(!c.frames || !c.frames.__tcfapiLocator)
                    } catch (h) {
                        e = !1
                    }
                    if (e) {
                        b = c;
                        break a
                    }
                    var f;
                    b: {
                        try {
                            var g = c.parent;
                            if (g && g != c) {
                                f = g;
                                break b
                            }
                        } catch (h) {}
                        f = null
                    }
                    if (!(c = f))
                        break
                }
                b = null
            }
            a.m = b;
            return a.m
        }
            , cn = function(a) {
            a.M || (a.M = function(b) {
                try {
                    var c;
                    c = ("string" === typeof b.data ? JSON.parse(b.data) : b.data).__tcfapiReturn;
                    a.Wa[c.callId](c.returnValue, c.success)
                } catch (d) {}
            }
                ,
                pm(a.F, "message", a.M))
        }
            , dn = function(a) {
            if (!1 === a.gdprApplies)
                return !0;
            void 0 === a.internalErrorState && (a.internalErrorState = Wm(a));
            return "error" === a.cmpStatus || 0 !== a.internalErrorState ? a.internalBlockOnErrors ? (Um({
                e: String(a.internalErrorState)
            }),
                !1) : !0 : "loaded" !== a.cmpStatus || "tcloaded" !== a.eventStatus && "useractioncomplete" !== a.eventStatus ? !1 : !0
        };
        var en = {
            1: 0,
            3: 0,
            4: 0,
            7: 3,
            9: 3,
            10: 3
        };
        function fn() {
            var a = hi.tcf || {};
            return hi.tcf = a
        }
        var gn = function() {
            return new Xm(G,{
                Zm: -1
            })
        }
            , nn = function() {
            var a = fn()
                , b = gn();
            Zm(b) && !hn() && !jn() && O(124);
            if (!a.active && Zm(b)) {
                hn() && (a.active = !0,
                    a.jc = {},
                    a.cmpId = 0,
                    a.tcfPolicyVersion = 0,
                    Nk().active = !0,
                    a.tcString = "tcunavailable");
                pl();
                try {
                    b.addEventListener(function(c) {
                        if (0 !== c.internalErrorState)
                            kn(a),
                                ql([P.g.R, P.g.Aa, P.g.P]),
                                Nk().active = !0;
                        else if (a.gdprApplies = c.gdprApplies,
                            a.cmpId = c.cmpId,
                            a.enableAdvertiserConsentMode = c.enableAdvertiserConsentMode,
                        jn() && (a.active = !0),
                        !ln(c) || hn() || jn()) {
                            a.tcfPolicyVersion = c.tcfPolicyVersion;
                            var d;
                            if (!1 === c.gdprApplies) {
                                var e = {}, f;
                                for (f in en)
                                    en.hasOwnProperty(f) && (e[f] = !0);
                                d = e;
                                b.removeEventListener(c)
                            } else if (ln(c)) {
                                var g = {}, h;
                                for (h in en)
                                    if (en.hasOwnProperty(h))
                                        if ("1" === h) {
                                            var m, n = c, p = {
                                                Hl: !0
                                            };
                                            p = void 0 === p ? {} : p;
                                            m = dn(n) ? !1 === n.gdprApplies ? !0 : "tcunavailable" === n.tcString ? !p.Oj : (p.Oj || void 0 !== n.gdprApplies || p.Hl) && (p.Oj || "string" === typeof n.tcString && n.tcString.length) ? bn(n, "1", 0) : !0 : !1;
                                            g["1"] = m
                                        } else
                                            g[h] = bn(c, h, en[h]);
                                d = g
                            }
                            if (d) {
                                a.tcString = c.tcString || "tcempty";
                                a.jc = d;
                                var q = {}
                                    , t = (q[P.g.R] = a.jc["1"] ? "granted" : "denied",
                                    q);
                                !0 !== a.gdprApplies ? (ql([P.g.R, P.g.Aa, P.g.P]),
                                    Nk().active = !0) : (t[P.g.Aa] = a.jc["3"] && a.jc["4"] ? "granted" : "denied",
                                    "number" === typeof a.tcfPolicyVersion && 4 <= a.tcfPolicyVersion ? t[P.g.P] = a.jc["1"] && a.jc["7"] ? "granted" : "denied" : ql([P.g.P]),
                                    kl(t, {
                                        eventId: 0
                                    }, {
                                        gdprApplies: a ? a.gdprApplies : void 0,
                                        tcString: mn() || ""
                                    }))
                            }
                        } else
                            ql([P.g.R, P.g.Aa, P.g.P])
                    })
                } catch (c) {
                    kn(a),
                        ql([P.g.R, P.g.Aa, P.g.P]),
                        Nk().active = !0
                }
            }
        };
        function kn(a) {
            a.type = "e";
            a.tcString = "tcunavailable"
        }
        function ln(a) {
            return "tcloaded" === a.eventStatus || "useractioncomplete" === a.eventStatus || "cmpuishown" === a.eventStatus
        }
        var hn = function() {
            return !0 === G.gtag_enable_tcf_support
        };
        function jn() {
            return !0 === fn().enableAdvertiserConsentMode
        }
        var mn = function() {
            var a = fn();
            if (a.active)
                return a.tcString
        }
            , on = function() {
            var a = fn();
            if (a.active && void 0 !== a.gdprApplies)
                return a.gdprApplies ? "1" : "0"
        }
            , pn = function(a) {
            if (!en.hasOwnProperty(String(a)))
                return !0;
            var b = fn();
            return b.active && b.jc ? !!b.jc[String(a)] : !0
        };
        var qn = [P.g.R, P.g.W, P.g.P, P.g.Aa]
            , rn = {}
            , sn = (rn[P.g.R] = 1,
            rn[P.g.W] = 2,
            rn);
        function tn(a) {
            if (void 0 === a)
                return 0;
            switch (V(a, P.g.oa)) {
                case void 0:
                    return 1;
                case !1:
                    return 3;
                default:
                    return 2
            }
        }
        var un = function(a) {
            var b = tn(a);
            if (3 === b)
                return !1;
            switch (Yk(P.g.Aa)) {
                case 1:
                case 3:
                    return !0;
                case 2:
                    return !1;
                case 4:
                    return 2 === b;
                case 0:
                    return !0;
                default:
                    return !1
            }
        }
            , vn = function() {
            return al() || !Xk(P.g.R) || !Xk(P.g.W)
        }
            , wn = function() {
            var a = {}, b;
            for (b in sn)
                sn.hasOwnProperty(b) && (a[sn[b]] = Yk(b));
            return "G1" + Be(a[1] || 0) + Be(a[2] || 0)
        }
            , xn = {}
            , yn = (xn[P.g.R] = 0,
            xn[P.g.W] = 1,
            xn[P.g.P] = 2,
            xn[P.g.Aa] = 3,
            xn);
        function zn(a) {
            switch (a) {
                case void 0:
                    return 1;
                case !0:
                    return 3;
                case !1:
                    return 2;
                default:
                    return 0
            }
        }
        var An = function(a) {
            for (var b = "1", c = 0; c < qn.length; c++) {
                var d = b, e, f = qn[c], g = Wk.delegatedConsentTypes[f];
                e = void 0 === g ? 0 : yn.hasOwnProperty(g) ? 12 | yn[g] : 8;
                var h = Nk();
                h.accessedAny = !0;
                var m = h.entries[f] || {};
                e = e << 2 | zn(m.implicit);
                b = d + ("" + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[e] + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[zn(m.declare) << 4 | zn(m.default) << 2 | zn(m.update)])
            }
            var n = b, p;
            p = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[(al() ? 1 : 0) << 2 | tn(a)];
            return n + p
        }
            , Bn = function() {
            if (!Xk(P.g.P))
                return "-";
            for (var a = Object.keys(fi), b = Zk(a), c = "", d = ma(a), e = d.next(); !e.done; e = d.next()) {
                var f = e.value;
                b[f] && (c += fi[f])
            }
            return c || "-"
        }
            , Cn = function() {
            return Zi() || (hn() || jn()) && "1" === on() ? "1" : "0"
        }
            , Dn = function() {
            return (Zi() ? !0 : !(!hn() && !jn()) && "1" === on()) || !Xk(P.g.P)
        }
            , Nn = function() {
            var a = "0", b = "0", c;
            var d = fn();
            c = d.active ? d.cmpId : void 0;
            "number" === typeof c && 0 <= c && 4095 >= c && (a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[c >> 6 & 63],
                b = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[c & 63]);
            var e = "0", f;
            var g = fn();
            f = g.active ? g.tcfPolicyVersion : void 0;
            "number" === typeof f && 0 <= f && 63 >= f && (e = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[f]);
            var h = 0;
            Zi() && (h |= 1);
            "1" === on() && (h |= 2);
            hn() && (h |= 4);
            var m;
            var n = fn();
            m = void 0 !== n.enableAdvertiserConsentMode ? n.enableAdvertiserConsentMode ? "1" : "0" : void 0;
            "1" === m && (h |= 8);
            Nk().waitPeriodTimedOut && (h |= 16);
            return "1" + a + b + e + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[h]
        };
        function On() {
            var a = !1;
            return a
        }
        ;var Pn = {
            UA: 1,
            AW: 2,
            DC: 3,
            G: 4,
            GF: 5,
            GT: 12,
            GTM: 14,
            HA: 6,
            MC: 7
        };
        function Qn(a) {
            a = void 0 === a ? {} : a;
            var b = Gf.ctid.split("-")[0].toUpperCase()
                , c = {};
            c.ctid = Gf.ctid;
            c.Im = gi.ne;
            c.Mm = gi.Qg;
            c.im = zj.je ? 2 : 1;
            c.Tm = a.gk;
            c.ue = Gf.canonicalContainerId;
            c.ue !== a.za && (c.za = a.za);
            if (U(62)) {
                var d = Oj();
                c.ym = d ? d.canonicalContainerId : void 0
            }
            mi ? (c.Pf = Pn[b],
            c.Pf || (c.Pf = 0)) : c.Pf = qi ? 13 : 10;
            zi.M ? (c.Nf = 0,
                c.ml = 2) : oi ? c.Nf = 1 : On() ? c.Nf = 2 : c.Nf = 3;
            var e = {};
            e[6] = Aj;
            c.pl = e;
            var f = a.Hf, g;
            var h = c.Pf
                , m = c.Nf;
            void 0 === h ? g = "" : (m || (m = 0),
                g = "" + wg(1, 1) + Ae(h << 2 | m));
            var n = c.ml, p = 4 + g + (n ? "" + wg(2, 1) + Ae(n) : ""), q, t = c.Mm;
            q = t && vg.test(t) ? "" + wg(3, 2) + t : "";
            var r, u = c.Im;
            r = u ? "" + wg(4, 1) + Ae(u) : "";
            var v;
            var w = c.ctid;
            if (w && f) {
                var x = w.split("-")
                    , y = x[0].toUpperCase();
                if ("GTM" !== y && "OPT" !== y)
                    v = "";
                else {
                    var B = x[1];
                    v = "" + wg(5, 3) + Ae(1 + B.length) + (c.im || 0) + B
                }
            } else
                v = "";
            var A = c.Tm, E = c.ue, D = c.za, C = c.Xn, F = p + q + r + v + (A ? "" + wg(6, 1) + Ae(A) : "") + (E ? "" + wg(7, 3) + Ae(E.length) + E : "") + (D ? "" + wg(8, 3) + Ae(D.length) + D : "") + (C ? "" + wg(9, 3) + Ae(C.length) + C : ""), N;
            var M = c.pl;
            M = void 0 === M ? {} : M;
            for (var Q = [], W = ma(Object.keys(M)), S = W.next(); !S.done; S = W.next()) {
                var R = S.value;
                Q[Number(R)] = M[R]
            }
            if (Q.length) {
                var ia = wg(10, 3), ea;
                if (0 === Q.length)
                    ea = Ae(0);
                else {
                    for (var ca = [], Aa = 0, na = !1, wa = 0; wa < Q.length; wa++) {
                        na = !0;
                        var Oa = wa % 6;
                        Q[wa] && (Aa |= 1 << Oa);
                        5 === Oa && (ca.push(Ae(Aa)),
                            Aa = 0,
                            na = !1)
                    }
                    na && ca.push(Ae(Aa));
                    ea = ca.join("")
                }
                var db = ea;
                N = "" + ia + Ae(db.length) + db
            } else
                N = "";
            var Ab = c.ym;
            return F + N + (Ab ? "" + wg(11, 3) + Ae(Ab.length) + Ab : "")
        }
        ;var Rn = {
            Rg: "service_worker_endpoint",
            Sg: "shared_user_id",
            Tg: "shared_user_id_requested",
            Ug: "shared_user_id_source"
        }, Sn;
        function Tn(a) {
            Sn || (Sn = Object.keys(Rn).map(function(b) {
                return Rn[b]
            }));
            return Sn.includes(a)
        }
        function Un(a, b) {
            if (Tn(a)) {
                var c = rc("google_tag_data", {})
                    , d = c.xcd;
                d || (d = {},
                    c.xcd = d);
                var e = d[a];
                e ? e.set(b) : d[a] = {
                    set: function(f) {
                        b = f
                    },
                    get: function() {
                        return b
                    }
                }
            }
        }
        function Vn(a) {
            if (Tn(a)) {
                var b, c;
                return null == (b = rc("google_tag_data", {}).xcd) ? void 0 : null == (c = b[a]) ? void 0 : c.get()
            }
        }
        ;function Wn(a) {
            return "null" !== a.origin
        }
        ;function Xn(a, b, c, d) {
            var e;
            if (Yn(d)) {
                for (var f = [], g = String(b || Zn()).split(";"), h = 0; h < g.length; h++) {
                    var m = g[h].split("=")
                        , n = m[0].replace(/^\s*|\s*$/g, "");
                    if (n && n == a) {
                        var p = m.slice(1).join("=").replace(/^\s*|\s*$/g, "");
                        p && c && (p = decodeURIComponent(p));
                        f.push(p)
                    }
                }
                e = f
            } else
                e = [];
            return e
        }
        function $n(a, b, c, d, e) {
            if (Yn(e)) {
                var f = ao(a, d, e);
                if (1 === f.length)
                    return f[0].id;
                if (0 !== f.length) {
                    f = bo(f, function(g) {
                        return g.xl
                    }, b);
                    if (1 === f.length)
                        return f[0].id;
                    f = bo(f, function(g) {
                        return g.Am
                    }, c);
                    return f[0] ? f[0].id : void 0
                }
            }
        }
        function co(a, b, c, d) {
            var e = Zn()
                , f = window;
            Wn(f) && (f.document.cookie = a);
            var g = Zn();
            return e !== g || void 0 !== c && 0 <= Xn(b, g, !1, d).indexOf(c)
        }
        function eo(a, b, c, d) {
            function e(w, x, y) {
                if (null == y)
                    return delete h[x],
                        w;
                h[x] = y;
                return w + "; " + x + "=" + y
            }
            function f(w, x) {
                if (null == x)
                    return w;
                h[x] = !0;
                return w + "; " + x
            }
            if (!Yn(c.zb))
                return 2;
            var g;
            null == b ? g = a + "=deleted; expires=" + (new Date(0)).toUTCString() : (c.encode && (b = encodeURIComponent(b)),
                b = fo(b),
                g = a + "=" + b);
            var h = {};
            g = e(g, "path", c.path);
            var m;
            c.expires instanceof Date ? m = c.expires.toUTCString() : null != c.expires && (m = "" + c.expires);
            g = e(g, "expires", m);
            g = e(g, "max-age", c.mm);
            g = e(g, "samesite", c.Nm);
            c.Om && (g = f(g, "secure"));
            var n = c.domain;
            if (n && "auto" === n.toLowerCase()) {
                for (var p = go(), q = void 0, t = !1, r = 0; r < p.length; ++r) {
                    var u = "none" !== p[r] ? p[r] : void 0
                        , v = e(g, "domain", u);
                    v = f(v, c.flags);
                    try {
                        d && d(a, h)
                    } catch (w) {
                        q = w;
                        continue
                    }
                    t = !0;
                    if (!ho(u, c.path) && co(v, a, b, c.zb))
                        return 0
                }
                if (q && !t)
                    throw q;
                return 1
            }
            n && "none" !== n.toLowerCase() && (g = e(g, "domain", n));
            g = f(g, c.flags);
            d && d(a, h);
            return ho(n, c.path) ? 1 : co(g, a, b, c.zb) ? 0 : 1
        }
        function io(a, b, c) {
            null == c.path && (c.path = "/");
            c.domain || (c.domain = "auto");
            return eo(a, b, c)
        }
        function bo(a, b, c) {
            for (var d = [], e = [], f, g = 0; g < a.length; g++) {
                var h = a[g]
                    , m = b(h);
                m === c ? d.push(h) : void 0 === f || m < f ? (e = [h],
                    f = m) : m === f && e.push(h)
            }
            return 0 < d.length ? d : e
        }
        function ao(a, b, c) {
            for (var d = [], e = Xn(a, void 0, void 0, c), f = 0; f < e.length; f++) {
                var g = e[f].split(".")
                    , h = g.shift();
                if (!b || !h || -1 !== b.indexOf(h)) {
                    var m = g.shift();
                    if (m) {
                        var n = m.split("-");
                        d.push({
                            id: g.join("."),
                            xl: Number(n[0]) || 1,
                            Am: Number(n[1]) || 1
                        })
                    }
                }
            }
            return d
        }
        function fo(a) {
            a && 1200 < a.length && (a = a.substring(0, 1200));
            return a
        }
        var jo = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/
            , ko = /(^|\.)doubleclick\.net$/i;
        function ho(a, b) {
            return void 0 !== a && (ko.test(window.document.location.hostname) || "/" === b && jo.test(a))
        }
        function lo(a) {
            if (!a)
                return 1;
            a = 0 === a.indexOf(".") ? a.substring(1) : a;
            return a.split(".").length
        }
        function mo(a) {
            if (!a || "/" === a)
                return 1;
            "/" !== a[0] && (a = "/" + a);
            "/" !== a[a.length - 1] && (a += "/");
            return a.split("/").length - 1
        }
        function no(a, b) {
            var c = "" + lo(a)
                , d = mo(b);
            1 < d && (c += "-" + d);
            return c
        }
        var Zn = function() {
            return Wn(window) ? window.document.cookie : ""
        }
            , Yn = function(a) {
            return a && Tk().m() ? (Array.isArray(a) ? a : [a]).every(function(b) {
                return $k(b) && Xk(b)
            }) : !0
        }
            , go = function() {
            var a = []
                , b = window.document.location.hostname.split(".");
            if (4 === b.length) {
                var c = b[b.length - 1];
                if (Number(c).toString() === c)
                    return ["none"]
            }
            for (var d = b.length - 2; 0 <= d; d--)
                a.push(b.slice(d).join("."));
            var e = window.document.location.hostname;
            ko.test(e) || jo.test(e) || a.push("none");
            return a
        };
        function oo(a) {
            var b = Math.round(2147483647 * Math.random()), c;
            if (a) {
                var d = 1, e, f, g;
                if (a)
                    for (d = 0,
                             f = a.length - 1; 0 <= f; f--)
                        g = a.charCodeAt(f),
                            d = (d << 6 & 268435455) + g + (g << 14),
                            e = d & 266338304,
                            d = 0 !== e ? d ^ e >> 21 : d;
                c = String(b ^ d & 2147483647)
            } else
                c = String(b);
            return c
        }
        function po(a) {
            return [oo(a), Math.round(Cb() / 1E3)].join(".")
        }
        function qo(a, b, c, d, e) {
            var f = lo(b);
            return $n(a, f, mo(c), d, e)
        }
        function ro(a, b, c, d) {
            return [b, no(c, d), a].join(".")
        }
        ;function so(a, b, c, d) {
            var e, f = Number(null != a.yb ? a.yb : void 0);
            0 !== f && (e = new Date((b || Cb()) + 1E3 * (f || 7776E3)));
            return {
                path: a.path,
                domain: a.domain,
                flags: a.flags,
                encode: !!c,
                expires: e,
                zb: d
            }
        }
        ;var to;
        function uo() {
            function a(g) {
                c(g.target || g.srcElement || {})
            }
            function b(g) {
                d(g.target || g.srcElement || {})
            }
            var c = vo
                , d = wo
                , e = xo();
            if (!e.init) {
                Ac(H, "mousedown", a);
                Ac(H, "keyup", a);
                Ac(H, "submit", b);
                var f = HTMLFormElement.prototype.submit;
                HTMLFormElement.prototype.submit = function() {
                    d(this);
                    f.call(this)
                }
                ;
                e.init = !0
            }
        }
        function yo(a, b, c, d, e) {
            var f = {
                callback: a,
                domains: b,
                fragment: 2 === c,
                placement: c,
                forms: d,
                sameHost: e
            };
            xo().decorators.push(f)
        }
        function zo(a, b, c) {
            for (var d = xo().decorators, e = {}, f = 0; f < d.length; ++f) {
                var g = d[f], h;
                if (h = !c || g.forms)
                    a: {
                        var m = g.domains
                            , n = a
                            , p = !!g.sameHost;
                        if (m && (p || n !== H.location.hostname))
                            for (var q = 0; q < m.length; q++)
                                if (m[q]instanceof RegExp) {
                                    if (m[q].test(n)) {
                                        h = !0;
                                        break a
                                    }
                                } else if (0 <= n.indexOf(m[q]) || p && 0 <= m[q].indexOf(n)) {
                                    h = !0;
                                    break a
                                }
                        h = !1
                    }
                if (h) {
                    var t = g.placement;
                    void 0 === t && (t = g.fragment ? 2 : 1);
                    t === b && Fb(e, g.callback())
                }
            }
            return e
        }
        function xo() {
            var a = rc("google_tag_data", {})
                , b = a.gl;
            b && b.decorators || (b = {
                decorators: []
            },
                a.gl = b);
            return b
        }
        ;var Ao = /(.*?)\*(.*?)\*(.*)/
            , Bo = /^https?:\/\/([^\/]*?)\.?cdn\.ampproject\.org\/?(.*)/
            , Co = /^(?:www\.|m\.|amp\.)+/
            , Do = /([^?#]+)(\?[^#]*)?(#.*)?/;
        function Eo(a) {
            var b = Do.exec(a);
            if (b)
                return {
                    Hh: b[1],
                    query: b[2],
                    fragment: b[3]
                }
        }
        function Fo(a, b) {
            var c = [oc.userAgent, (new Date).getTimezoneOffset(), oc.userLanguage || oc.language, Math.floor(Cb() / 60 / 1E3) - (void 0 === b ? 0 : b), a].join("*"), d;
            if (!(d = to)) {
                for (var e = Array(256), f = 0; 256 > f; f++) {
                    for (var g = f, h = 0; 8 > h; h++)
                        g = g & 1 ? g >>> 1 ^ 3988292384 : g >>> 1;
                    e[f] = g
                }
                d = e
            }
            to = d;
            for (var m = 4294967295, n = 0; n < c.length; n++)
                m = m >>> 8 ^ to[(m ^ c.charCodeAt(n)) & 255];
            return ((m ^ -1) >>> 0).toString(36)
        }
        function Go() {
            return function(a) {
                var b = lj(G.location.href)
                    , c = b.search.replace("?", "")
                    , d = ej(c, "_gl", !1, !0) || "";
                a.query = Ho(d) || {};
                var e = hj(b, "fragment"), f;
                var g = -1;
                if (Hb(e, "_gl="))
                    g = 4;
                else {
                    var h = e.indexOf("&_gl=");
                    0 < h && (g = h + 3 + 2)
                }
                if (0 > g)
                    f = void 0;
                else {
                    var m = e.indexOf("&", g);
                    f = 0 > m ? e.substring(g) : e.substring(g, m)
                }
                a.fragment = Ho(f || "") || {}
            }
        }
        function Io(a) {
            var b = Go()
                , c = xo();
            c.data || (c.data = {
                query: {},
                fragment: {}
            },
                b(c.data));
            var d = {}
                , e = c.data;
            e && (Fb(d, e.query),
            a && Fb(d, e.fragment));
            return d
        }
        var Ho = function(a) {
            try {
                var b = Jo(a, 3);
                if (void 0 !== b) {
                    for (var c = {}, d = b ? b.split("*") : [], e = 0; e + 1 < d.length; e += 2) {
                        var f = d[e]
                            , g = ib(d[e + 1]);
                        c[f] = g
                    }
                    kb("TAGGING", 6);
                    return c
                }
            } catch (h) {
                kb("TAGGING", 8)
            }
        };
        function Jo(a, b) {
            if (a) {
                var c;
                a: {
                    for (var d = a, e = 0; 3 > e; ++e) {
                        var f = Ao.exec(d);
                        if (f) {
                            c = f;
                            break a
                        }
                        d = decodeURIComponent(d)
                    }
                    c = void 0
                }
                var g = c;
                if (g && "1" === g[1]) {
                    var h = g[3], m;
                    a: {
                        for (var n = g[2], p = 0; p < b; ++p)
                            if (n === Fo(h, p)) {
                                m = !0;
                                break a
                            }
                        m = !1
                    }
                    if (m)
                        return h;
                    kb("TAGGING", 7)
                }
            }
        }
        function Ko(a, b, c, d, e) {
            function f(p) {
                var q = p
                    , t = (new RegExp("(.*?)(^|&)" + a + "=([^&]*)&?(.*)")).exec(q)
                    , r = q;
                if (t) {
                    var u = t[2]
                        , v = t[4];
                    r = t[1];
                    v && (r = r + u + v)
                }
                p = r;
                var w = p.charAt(p.length - 1);
                p && "&" !== w && (p += "&");
                return p + n
            }
            d = void 0 === d ? !1 : d;
            e = void 0 === e ? !1 : e;
            var g = Eo(c);
            if (!g)
                return "";
            var h = g.query || ""
                , m = g.fragment || ""
                , n = a + "=" + b;
            d ? 0 !== m.substring(1).length && e || (m = "#" + f(m.substring(1))) : h = "?" + f(h.substring(1));
            return "" + g.Hh + h + m
        }
        function Lo(a, b) {
            function c(n, p, q) {
                var t;
                a: {
                    for (var r in n)
                        if (n.hasOwnProperty(r)) {
                            t = !0;
                            break a
                        }
                    t = !1
                }
                if (t) {
                    var u, v = [], w;
                    for (w in n)
                        if (n.hasOwnProperty(w)) {
                            var x = n[w];
                            void 0 !== x && x === x && null !== x && "[object Object]" !== x.toString() && (v.push(w),
                                v.push(hb(String(x))))
                        }
                    var y = v.join("*");
                    u = ["1", Fo(y), y].join("*");
                    d ? (Si(3) || Si(1) || !p) && Mo("_gl", u, a, p, q) : No("_gl", u, a, p, q)
                }
            }
            var d = "FORM" === (a.tagName || "").toUpperCase()
                , e = zo(b, 1, d)
                , f = zo(b, 2, d)
                , g = zo(b, 4, d)
                , h = zo(b, 3, d);
            c(e, !1, !1);
            c(f, !0, !1);
            Si(1) && c(g, !0, !0);
            for (var m in h)
                h.hasOwnProperty(m) && Oo(m, h[m], a)
        }
        function Oo(a, b, c) {
            "a" === c.tagName.toLowerCase() ? No(a, b, c) : "form" === c.tagName.toLowerCase() && Mo(a, b, c)
        }
        function No(a, b, c, d, e) {
            d = void 0 === d ? !1 : d;
            e = void 0 === e ? !1 : e;
            var f;
            if (f = c.href) {
                var g;
                if (!(g = !Si(4) || d)) {
                    var h = G.location.href
                        , m = Eo(c.href)
                        , n = Eo(h);
                    g = !(m && n && m.Hh === n.Hh && m.query === n.query && m.fragment)
                }
                f = g
            }
            if (f) {
                var p = Ko(a, b, c.href, d, e);
                ec.test(p) && (c.href = p)
            }
        }
        function Mo(a, b, c, d, e) {
            d = void 0 === d ? !1 : d;
            e = void 0 === e ? !1 : e;
            if (c && c.action) {
                var f = (c.method || "").toLowerCase();
                if ("get" !== f || d) {
                    if ("get" === f || "post" === f) {
                        var g = Ko(a, b, c.action, d, e);
                        ec.test(g) && (c.action = g)
                    }
                } else {
                    for (var h = c.childNodes || [], m = !1, n = 0; n < h.length; n++) {
                        var p = h[n];
                        if (p.name === a) {
                            p.setAttribute("value", b);
                            m = !0;
                            break
                        }
                    }
                    if (!m) {
                        var q = H.createElement("input");
                        q.setAttribute("type", "hidden");
                        q.setAttribute("name", a);
                        q.setAttribute("value", b);
                        c.appendChild(q)
                    }
                }
            }
        }
        function vo(a) {
            try {
                var b;
                a: {
                    for (var c = a, d = 100; c && 0 < d; ) {
                        if (c.href && c.nodeName.match(/^a(?:rea)?$/i)) {
                            b = c;
                            break a
                        }
                        c = c.parentNode;
                        d--
                    }
                    b = null
                }
                var e = b;
                if (e) {
                    var f = e.protocol;
                    "http:" !== f && "https:" !== f || Lo(e, e.hostname)
                }
            } catch (g) {}
        }
        function wo(a) {
            try {
                if (a.action) {
                    var b = hj(lj(a.action), "host");
                    Lo(a, b)
                }
            } catch (c) {}
        }
        function Po(a, b, c, d) {
            uo();
            var e = "fragment" === c ? 2 : 1;
            d = !!d;
            yo(a, b, e, d, !1);
            2 === e && kb("TAGGING", 23);
            d && kb("TAGGING", 24)
        }
        function Qo(a, b) {
            uo();
            yo(a, [gj(G.location, "host", !0)], b, !0, !0)
        }
        function Ro() {
            var a = H.location.hostname
                , b = Bo.exec(H.referrer);
            if (!b)
                return !1;
            var c = b[2]
                , d = b[1]
                , e = "";
            if (c) {
                var f = c.split("/")
                    , g = f[1];
                e = "s" === g ? decodeURIComponent(f[2]) : decodeURIComponent(g)
            } else if (d) {
                if (0 === d.indexOf("xn--"))
                    return !1;
                e = d.replace(/-/g, ".").replace(/\.\./g, "-")
            }
            var h = a.replace(Co, ""), m = e.replace(Co, ""), n;
            if (!(n = h === m)) {
                var p = "." + m;
                n = h.substring(h.length - p.length, h.length) === p
            }
            return n
        }
        function So(a, b) {
            return !1 === a ? !1 : a || b || Ro()
        }
        ;var To = ["1"]
            , Uo = {}
            , Vo = {};
        function Wo(a, b) {
            b = void 0 === b ? !0 : b;
            var c = Xo(a.prefix);
            if (!Uo[c])
                if (Yo(c, a.path, a.domain)) {
                    var d = Vo[Xo(a.prefix)];
                    Zo(a, d ? d.id : void 0, d ? d.Dh : void 0)
                } else {
                    var e = nj("auiddc");
                    if (e)
                        kb("TAGGING", 17),
                            Uo[c] = e;
                    else if (b) {
                        var f = Xo(a.prefix)
                            , g = po();
                        $o(f, g, a);
                        Yo(c, a.path, a.domain)
                    }
                }
        }
        function Zo(a, b, c) {
            var d = Xo(a.prefix)
                , e = Uo[d];
            if (e) {
                var f = e.split(".");
                if (2 === f.length) {
                    var g = Number(f[1]) || 0;
                    if (g) {
                        var h = e;
                        b && (h = e + "." + b + "." + (c ? c : Math.floor(Cb() / 1E3)));
                        $o(d, h, a, 1E3 * g)
                    }
                }
            }
        }
        function $o(a, b, c, d) {
            var e = ro(b, "1", c.domain, c.path)
                , f = so(c, d);
            f.zb = ap();
            io(a, e, f)
        }
        function Yo(a, b, c) {
            var d = qo(a, b, c, To, ap());
            if (!d)
                return !1;
            bp(a, d);
            return !0
        }
        function bp(a, b) {
            var c = b.split(".");
            5 === c.length ? (Uo[a] = c.slice(0, 2).join("."),
                Vo[a] = {
                    id: c.slice(2, 4).join("."),
                    Dh: Number(c[4]) || 0
                }) : 3 === c.length ? Vo[a] = {
                id: c.slice(0, 2).join("."),
                Dh: Number(c[2]) || 0
            } : Uo[a] = b
        }
        function Xo(a) {
            return (a || "_gcl") + "_au"
        }
        function cp(a) {
            function b() {
                Xk(c) && a()
            }
            var c = ap();
            dl(function() {
                b();
                Xk(c) || el(b, c)
            }, c)
        }
        function dp(a) {
            var b = Io(!0)
                , c = Xo(a.prefix);
            cp(function() {
                var d = b[c];
                if (d) {
                    bp(c, d);
                    var e = 1E3 * Number(Uo[c].split(".")[1]);
                    if (e) {
                        kb("TAGGING", 16);
                        var f = so(a, e);
                        f.zb = ap();
                        var g = ro(d, "1", a.domain, a.path);
                        io(c, g, f)
                    }
                }
            })
        }
        function ep(a, b, c, d, e) {
            e = e || {};
            var f = function() {
                var g = {}
                    , h = qo(a, e.path, e.domain, To, ap());
                h && (g[a] = h);
                return g
            };
            cp(function() {
                Po(f, b, c, d)
            })
        }
        function ap() {
            return ["ad_storage", "ad_user_data"]
        }
        ;function fp(a) {
            for (var b = [], c = H.cookie.split(";"), d = new RegExp("^\\s*" + (a || "_gac") + "_(UA-\\d+-\\d+)=\\s*(.+?)\\s*$"), e = 0; e < c.length; e++) {
                var f = c[e].match(d);
                f && b.push({
                    Vh: f[1],
                    value: f[2],
                    timestamp: Number(f[2].split(".")[1]) || 0
                })
            }
            b.sort(function(g, h) {
                return h.timestamp - g.timestamp
            });
            return b
        }
        function gp(a, b) {
            var c = fp(a)
                , d = {};
            if (!c || !c.length)
                return d;
            for (var e = 0; e < c.length; e++) {
                var f = c[e].value.split(".");
                if (!("1" !== f[0] || b && 3 > f.length || !b && 3 !== f.length) && Number(f[1])) {
                    d[c[e].Vh] || (d[c[e].Vh] = []);
                    var g = {
                        version: f[0],
                        timestamp: 1E3 * Number(f[1]),
                        ba: f[2]
                    };
                    b && 3 < f.length && (g.labels = f.slice(3));
                    d[c[e].Vh].push(g)
                }
            }
            return d
        }
        ;var hp = {}
            , ip = (hp.k = {
                Ma: /^[\w-]+$/
            },
                hp.b = {
                    Ma: /^[\w-]+$/,
                    Ph: !0
                },
                hp.i = {
                    Ma: /^[1-9]\d*$/
                },
                hp);
        var jp = {}
            , kp = (jp[5] = {
            version: "2",
            jn: ["2"],
            dk: "ad_storage",
            Hj: ["k", "i", "b"]
        },
            jp);
        function lp(a, b) {
            var c = b.Ma;
            return "function" === typeof c ? c(a) : c.test(a)
        }
        function mp(a) {
            for (var b = ma(Object.keys(a)), c = b.next(), d = {}; !c.done; d = {
                we: void 0
            },
                c = b.next()) {
                var e = c.value
                    , f = a[e];
                d.we = ip[e];
                d.we ? d.we.Ph ? a[e] = Array.isArray(f) ? f.filter(function(g) {
                    return function(h) {
                        return lp(h, g.we)
                    }
                }(d)) : void 0 : "string" === typeof f && lp(f, d.we) || (a[e] = void 0) : a[e] = void 0
            }
            return a
        }
        function np(a) {
            var b = {}
                , c = kp[5];
            if (c) {
                for (var d = c.Hj, e = ma(a.split("$")), f = e.next(); !f.done; f = e.next()) {
                    var g = f.value
                        , h = g[0];
                    if (-1 !== d.indexOf(h))
                        try {
                            var m = decodeURIComponent(g.substring(1))
                                , n = ip[h];
                            n && (n.Ph ? (b[h] = b[h] || [],
                                b[h].push(m)) : b[h] = m)
                        } catch (p) {}
                }
                return mp(b)
            }
        }
        function op(a) {
            var b = kp[5];
            if (b) {
                for (var c = [], d = ma(b.Hj), e = d.next(); !e.done; e = d.next()) {
                    var f = e.value
                        , g = ip[f];
                    if (g) {
                        var h = a[f];
                        if (void 0 !== h)
                            if (g.Ph && Array.isArray(h))
                                for (var m = ma(h), n = m.next(); !n.done; n = m.next())
                                    c.push(encodeURIComponent("" + f + n.value));
                            else
                                c.push(encodeURIComponent("" + f + h))
                    }
                }
                return c.join("$")
            }
        }
        function pp(a) {
            var b = kp[5];
            if (b) {
                for (var c = [], d = Xn(a, void 0, void 0, b.dk), e = ma(d), f = e.next(); !f.done; f = e.next()) {
                    var g = f.value.split(".")
                        , h = g.shift();
                    if (-1 !== b.jn.indexOf(h)) {
                        g.shift();
                        var m = g.join(".");
                        c.push(np(m))
                    }
                }
                return c
            }
        }
        function qp(a, b, c, d) {
            c = c || {};
            var e = op(b);
            if (e) {
                var f = kp[5]
                    , g = [f.version, no(c.domain, c.path), e].join(".");
                io(a, g, so(c, d, void 0, f.dk))
            }
        }
        ;var rp = /^\w+$/
            , sp = /^[\w-]+$/
            , tp = {}
            , up = (tp.aw = "_aw",
                tp.dc = "_dc",
                tp.gf = "_gf",
                tp.gp = "_gp",
                tp.gs = "_gs",
                tp.ha = "_ha",
                tp.ag = "_ag",
                tp.gb = "_gb",
                tp);
        function vp() {
            return ["ad_storage", "ad_user_data"]
        }
        function wp(a) {
            return !Tk().m() || Xk(a)
        }
        function xp(a, b) {
            function c() {
                var d = wp(b);
                d && a();
                return d
            }
            dl(function() {
                c() || el(c, b)
            }, b)
        }
        function yp(a) {
            return zp(a).map(function(b) {
                return b.ba
            })
        }
        function Ap(a) {
            return Bp(a).filter(function(b) {
                return b.ba
            }).map(function(b) {
                return b.ba
            })
        }
        function Bp(a) {
            var b = Cp(a.prefix)
                , c = Dp("gb", b)
                , d = Dp("ag", b);
            if (!d || !c)
                return [];
            var e = function(h) {
                return function(m) {
                    m.type = h;
                    return m
                }
            }
                , f = zp(c).map(e("gb"))
                , g = (Si(6) ? Ep(d) : []).map(e("ag"));
            return f.concat(g).sort(function(h, m) {
                return m.timestamp - h.timestamp
            })
        }
        function Fp(a, b, c, d, e) {
            var f = rb(a, function(g) {
                return g.ba === c
            });
            f ? (f.timestamp = Math.max(f.timestamp, d),
                f.labels = Gp(f.labels || [], e || [])) : a.push({
                version: b,
                ba: c,
                timestamp: d,
                labels: e
            })
        }
        function Ep(a) {
            for (var b = pp(a) || [], c = [], d = ma(b), e = d.next(); !e.done; e = d.next()) {
                var f = e.value
                    , g = f
                    , h = Hp(f);
                h && Fp(c, "2", g.k, h, g.b || [])
            }
            return c.sort(function(m, n) {
                return n.timestamp - m.timestamp
            })
        }
        function zp(a) {
            for (var b = [], c = Xn(a, H.cookie, void 0, vp()), d = ma(c), e = d.next(); !e.done; e = d.next()) {
                var f = Ip(e.value);
                if (null != f) {
                    var g = f;
                    Fp(b, g.version, g.ba, g.timestamp, g.labels)
                }
            }
            b.sort(function(h, m) {
                return m.timestamp - h.timestamp
            });
            return Jp(b)
        }
        function Gp(a, b) {
            if (!a.length)
                return b;
            if (!b.length)
                return a;
            var c = {};
            return a.concat(b).filter(function(d) {
                return c.hasOwnProperty(d) ? !1 : c[d] = !0
            })
        }
        function Cp(a) {
            return a && "string" === typeof a && a.match(rp) ? a : "_gcl"
        }
        function Kp(a, b) {
            var c = Si(6), d = Si(7), e = lj(a), f = hj(e, "query", !1, void 0, "gclid"), g = hj(e, "query", !1, void 0, "gclsrc"), h = hj(e, "query", !1, void 0, "wbraid"), m;
            c && (m = hj(e, "query", !1, void 0, "gbraid"));
            var n;
            d && (n = hj(e, "query", !1, void 0, "gad_source"));
            var p = hj(e, "query", !1, void 0, "dclid");
            if (b && (!f || !g || !h || c && !m)) {
                var q = e.hash.replace("#", "");
                f = f || ej(q, "gclid", !1);
                g = g || ej(q, "gclsrc", !1);
                h = h || ej(q, "wbraid", !1);
                c && (m = m || ej(q, "gbraid", !1));
                d && (n = n || ej(q, "gad_source", !1))
            }
            return Lp(f, g, p, h, m, n)
        }
        function Mp() {
            return Kp(G.location.href, !0)
        }
        function Lp(a, b, c, d, e, f) {
            var g = {}
                , h = function(m, n) {
                g[n] || (g[n] = []);
                g[n].push(m)
            };
            g.gclid = a;
            g.gclsrc = b;
            g.dclid = c;
            if (void 0 !== a && a.match(sp))
                switch (b) {
                    case void 0:
                        h(a, "aw");
                        break;
                    case "aw.ds":
                        h(a, "aw");
                        h(a, "dc");
                        break;
                    case "ds":
                        h(a, "dc");
                        break;
                    case "3p.ds":
                        h(a, "dc");
                        break;
                    case "gf":
                        h(a, "gf");
                        break;
                    case "ha":
                        h(a, "ha")
                }
            c && h(c, "dc");
            void 0 !== d && sp.test(d) && (g.wbraid = d,
                h(d, "gb"));
            Si(6) && void 0 !== e && sp.test(e) && (g.gbraid = e,
                h(e, "ag"));
            Si(7) && void 0 !== f && sp.test(f) && (g.gad_source = f,
                h(f, "gs"));
            return g
        }
        function Np(a) {
            var b = Mp();
            if (Si(5)) {
                for (var c = !0, d = ma(Object.keys(b)), e = d.next(); !e.done; e = d.next())
                    if (void 0 !== b[e.value]) {
                        c = !1;
                        break
                    }
                c && (b = Kp(G.document.referrer, !1))
            }
            Op(b, !1, a)
        }
        function Op(a, b, c, d, e) {
            c = c || {};
            e = e || [];
            var f = Cp(c.prefix)
                , g = d || Cb()
                , h = Math.round(g / 1E3)
                , m = vp()
                , n = !1
                , p = !1
                , q = function() {
                if (wp(m)) {
                    var t = so(c, g, !0);
                    t.zb = m;
                    for (var r = function(F, N) {
                        var M = Dp(F, f);
                        M && (io(M, N, t),
                        "gb" !== F && (n = !0))
                    }, u = function(F) {
                        var N = ["GCL", h, F];
                        0 < e.length && N.push(e.join("."));
                        return N.join(".")
                    }, v = ma(["aw", "dc", "gf", "ha", "gp"]), w = v.next(); !w.done; w = v.next()) {
                        var x = w.value;
                        a[x] && r(x, u(a[x][0]))
                    }
                    if (!n && a.gb) {
                        var y = a.gb[0]
                            , B = Dp("gb", f);
                        !b && zp(B).some(function(F) {
                            return F.ba === y && F.labels && 0 < F.labels.length
                        }) || r("gb", u(y))
                    }
                }
                if (!p && Si(6) && a.gbraid && wp("ad_storage") && (p = !0,
                    !n)) {
                    var A = a.gbraid
                        , E = Dp("ag", f);
                    if (b || !(Si(6) ? Ep(E) : []).some(function(F) {
                        return F.ba === A && F.labels && 0 < F.labels.length
                    })) {
                        var D = {}
                            , C = (D.k = A,
                            D.i = "" + h,
                            D.b = e,
                            D);
                        qp(E, C, c, g)
                    }
                }
                Pp(a, f, g, c)
            };
            dl(function() {
                q();
                wp(m) || el(q, m)
            }, m)
        }
        function Pp(a, b, c, d) {
            if (Si(7) && void 0 !== a.gad_source && wp("ad_storage")) {
                var e = Dp("gs", b);
                if (e) {
                    var f = Math.round((Cb() - (Lc() || 0)) / 1E3)
                        , g = {}
                        , h = (g.k = a.gad_source,
                        g.i = "" + f,
                        g);
                    qp(e, h, d, c)
                }
            }
        }
        function Qp(a, b) {
            var c = Io(!0);
            xp(function() {
                for (var d = Cp(b.prefix), e = 0; e < a.length; ++e) {
                    var f = a[e];
                    if (void 0 !== up[f]) {
                        var g = Dp(f, d)
                            , h = c[g];
                        if (h) {
                            var m = Math.min(Rp(h), Cb()), n;
                            b: {
                                for (var p = m, q = Xn(g, H.cookie, void 0, vp()), t = 0; t < q.length; ++t)
                                    if (Rp(q[t]) > p) {
                                        n = !0;
                                        break b
                                    }
                                n = !1
                            }
                            if (!n) {
                                var r = so(b, m, !0);
                                r.zb = vp();
                                io(g, h, r)
                            }
                        }
                    }
                }
                Op(Lp(c.gclid, c.gclsrc), !1, b)
            }, vp())
        }
        function Sp(a) {
            var b = [];
            Si(6) && b.push("ag");
            if (0 !== b.length) {
                var c = Io(!0)
                    , d = Cp(a.prefix);
                xp(function() {
                    for (var e = 0; e < b.length; ++e) {
                        var f = Dp(b[e], d);
                        if (f) {
                            var g = c[f];
                            if (g) {
                                var h = np(g);
                                if (h) {
                                    var m = Hp(h);
                                    m || (m = Cb());
                                    var n;
                                    a: {
                                        for (var p = m, q = pp(f), t = 0; t < q.length; ++t)
                                            if (Hp(q[t]) > p) {
                                                n = !0;
                                                break a
                                            }
                                        n = !1
                                    }
                                    if (n)
                                        break;
                                    h.i = "" + Math.round(m / 1E3);
                                    qp(f, h, a, m)
                                }
                            }
                        }
                    }
                }, ["ad_storage"])
            }
        }
        function Dp(a, b) {
            var c = up[a];
            if (void 0 !== c)
                return b + c
        }
        function Rp(a) {
            return 0 !== Tp(a.split(".")).length ? 1E3 * (Number(a.split(".")[1]) || 0) : 0
        }
        function Hp(a) {
            return a ? 1E3 * (Number(a.i) || 0) : 0
        }
        function Ip(a) {
            var b = Tp(a.split("."));
            return 0 === b.length ? null : {
                version: b[0],
                ba: b[2],
                timestamp: 1E3 * (Number(b[1]) || 0),
                labels: b.slice(3)
            }
        }
        function Tp(a) {
            return 3 > a.length || "GCL" !== a[0] && "1" !== a[0] || !/^\d+$/.test(a[1]) || !sp.test(a[2]) ? [] : a
        }
        function Up(a, b, c, d, e) {
            if (Array.isArray(b) && Wn(G)) {
                var f = Cp(e)
                    , g = function() {
                    for (var h = {}, m = 0; m < a.length; ++m) {
                        var n = Dp(a[m], f);
                        if (n) {
                            var p = Xn(n, H.cookie, void 0, vp());
                            p.length && (h[n] = p.sort()[p.length - 1])
                        }
                    }
                    return h
                };
                xp(function() {
                    Po(g, b, c, d)
                }, vp())
            }
        }
        function Vp(a, b, c, d) {
            if (Array.isArray(a) && Wn(G)) {
                var e = [];
                Si(6) && e.push("ag");
                if (0 !== e.length) {
                    var f = Cp(d)
                        , g = function() {
                        for (var h = {}, m = 0; m < e.length; ++m) {
                            var n = Dp(e[m], f);
                            if (!n)
                                return {};
                            var p = pp(n);
                            if (p.length) {
                                var q = p.sort(function(t, r) {
                                    return Hp(r) - Hp(t)
                                })[0];
                                h[n] = op(q)
                            }
                        }
                        return h
                    };
                    xp(function() {
                        Po(g, a, b, c)
                    }, ["ad_storage"])
                }
            }
        }
        function Jp(a) {
            return a.filter(function(b) {
                return sp.test(b.ba)
            })
        }
        function Wp(a, b) {
            if (Wn(G)) {
                for (var c = Cp(b.prefix), d = {}, e = 0; e < a.length; e++)
                    up[a[e]] && (d[a[e]] = up[a[e]]);
                xp(function() {
                    z(d, function(f, g) {
                        var h = Xn(c + g, H.cookie, void 0, vp());
                        h.sort(function(r, u) {
                            return Rp(u) - Rp(r)
                        });
                        if (h.length) {
                            var m = h[0], n = Rp(m), p = 0 !== Tp(m.split(".")).length ? m.split(".").slice(3) : [], q = {}, t;
                            t = 0 !== Tp(m.split(".")).length ? m.split(".")[2] : void 0;
                            q[f] = [t];
                            Op(q, !0, b, n, p)
                        }
                    })
                }, vp())
            }
        }
        function Xp(a) {
            var b = []
                , c = [];
            Si(6) && (b.push("ag"),
                c.push("gbraid"));
            0 !== b.length && xp(function() {
                for (var d = Cp(a.prefix), e = 0; e < b.length; ++e) {
                    var f = Dp(b[e], d);
                    if (!f)
                        break;
                    var g = pp(f);
                    if (g.length) {
                        var h = g.sort(function(q, t) {
                            return Hp(t) - Hp(q)
                        })[0]
                            , m = Hp(h)
                            , n = h.b
                            , p = {};
                        p[c[e]] = h.k;
                        Op(p, !0, a, m, n)
                    }
                }
            }, ["ad_storage"])
        }
        function Yp(a, b) {
            for (var c = 0; c < b.length; ++c)
                if (a[b[c]])
                    return !0;
            return !1
        }
        function Zp(a) {
            function b(e, f, g) {
                g && (e[f] = g)
            }
            if (al()) {
                var c = Mp();
                if (Yp(c, a)) {
                    var d = {};
                    b(d, "gclid", c.gclid);
                    b(d, "dclid", c.dclid);
                    b(d, "gclsrc", c.gclsrc);
                    b(d, "wbraid", c.wbraid);
                    Si(6) && b(d, "gbraid", c.gbraid);
                    Qo(function() {
                        return d
                    }, 3);
                    Qo(function() {
                        var e = {};
                        return e._up = "1",
                            e
                    }, 1)
                }
            }
        }
        function $p(a) {
            if (!Si(1))
                return null;
            var b = Io(!0).gad_source;
            if (null != b)
                return G.location.hash = "",
                    b;
            if (Si(2)) {
                var c = lj(G.location.href);
                b = hj(c, "query", !1, void 0, "gad_source");
                if (null != b)
                    return b;
                var d = Mp();
                if (Yp(d, a))
                    return "0"
            }
            return null
        }
        function aq(a) {
            var b = $p(a);
            null != b && Qo(function() {
                var c = {};
                return c.gad_source = b,
                    c
            }, 4)
        }
        function bq(a, b, c) {
            var d = [];
            if (0 === b.length)
                return d;
            for (var e = {}, f = 0; f < b.length; f++) {
                var g = b[f]
                    , h = g.type ? g.type : "gcl";
                -1 === (g.labels || []).indexOf(c) ? (a.push(0),
                e[h] || d.push(g)) : a.push(1);
                e[h] = !0
            }
            return d
        }
        function cq(a, b, c, d) {
            var e = [];
            c = c || {};
            if (!wp(vp()))
                return e;
            var f = zp(a)
                , g = bq(e, f, b);
            if (g.length && !d)
                for (var h = ma(g), m = h.next(); !m.done; m = h.next()) {
                    var n = m.value
                        , p = n.timestamp
                        , q = [n.version, Math.round(p / 1E3), n.ba].concat(n.labels || [], [b]).join(".")
                        , t = so(c, p, !0);
                    t.zb = vp();
                    io(a, q, t)
                }
            return e
        }
        function dq(a, b) {
            var c = [];
            b = b || {};
            var d = Bp(b)
                , e = bq(c, d, a);
            if (e.length)
                for (var f = ma(e), g = f.next(); !g.done; g = f.next()) {
                    var h = g.value
                        , m = Cp(b.prefix)
                        , n = Dp(h.type, m);
                    if (!n)
                        break;
                    var p = h
                        , q = p.version
                        , t = p.ba
                        , r = p.labels
                        , u = p.timestamp
                        , v = Math.round(u / 1E3);
                    if ("ag" === h.type) {
                        var w = {}
                            , x = (w.k = t,
                            w.i = "" + v,
                            w.b = (r || []).concat([a]),
                            w);
                        qp(n, x, b, u)
                    } else if ("gb" === h.type) {
                        var y = [q, v, t].concat(r || [], [a]).join(".")
                            , B = so(b, u, !0);
                        B.zb = vp();
                        io(n, y, B)
                    }
                }
            return c
        }
        function eq(a, b) {
            var c = Cp(b)
                , d = Dp(a, c);
            if (!d)
                return 0;
            var e;
            e = "ag" === a ? Si(6) ? Ep(d) : [] : zp(d);
            for (var f = 0, g = 0; g < e.length; g++)
                f = Math.max(f, e[g].timestamp);
            return f
        }
        function fq(a) {
            for (var b = 0, c = ma(Object.keys(a)), d = c.next(); !d.done; d = c.next())
                for (var e = a[d.value], f = 0; f < e.length; f++)
                    b = Math.max(b, Number(e[f].timestamp));
            return b
        }
        function gq(a, b) {
            var c = Math.max(eq("aw", a), fq(wp(vp()) ? gp() : {}))
                , d = Math.max(eq("gb", a), fq(wp(vp()) ? gp("_gac_gb", !0) : {}));
            Si(6) && b && (d = Math.max(d, eq("ag", a)));
            return d > c
        }
        ;var hq = function(a, b, c) {
            var d = hi.joined_auid = hi.joined_auid || {}
                , e = (c ? a || "_gcl" : "") + "." + b;
            if (d[e])
                return !0;
            d[e] = !0;
            return !1
        }
            , iq = function() {
                var a = lj(G.location.href)
                    , b = hj(a, "query", !1, void 0, "gad_source");
                if (void 0 === b) {
                    var c = a.hash.replace("#", "");
                    b = ej(c, "gad_source", !1)
                }
                return b
            }
            , jq = function() {
                var a = lj(G.location.href).search.replace("?", "");
                return "1" === ej(a, "gad", !1, !0)
            }
            , kq = function() {
                var a = 1 === Rm(!0) ? G.top.location.href : G.location.href;
                return a = a.replace(/[\?#].*$/, "")
            }
            , lq = function(a) {
                var b = [];
                z(a, function(c, d) {
                    d = Jp(d);
                    for (var e = [], f = 0; f < d.length; f++)
                        e.push(d[f].ba);
                    e.length && b.push(c + ":" + e.join(","))
                });
                return b.join(";")
            }
            , nq = function(a, b, c) {
                if ("aw" === a || "dc" === a || "gb" === a) {
                    var d = nj("gcl" + a);
                    if (d)
                        return d.split(".")
                }
                var e = Cp(b);
                if ("_gcl" === e) {
                    var f = !X(mq()) && c, g;
                    g = Mp()[a] || [];
                    if (0 < g.length)
                        return f ? ["0"] : g
                }
                var h = Dp(a, e);
                return h ? yp(h) : []
            }
            , oq = function(a) {
                var b = mq();
                ol(function() {
                    a();
                    X(b) || el(a, b)
                }, b)
            }
            , mq = function() {
                return [P.g.R, P.g.P]
            }
            , pq = /^(www\.)?google(\.com?)?(\.[a-z]{2}t?)?$/
            , qq = /^www.googleadservices.com$/
            , rq = function(a, b) {
                return nq("aw", a, b)
            }
            , sq = function(a, b) {
                return nq("dc", a, b)
            }
            , tq = function(a, b, c, d, e) {
                var f = Mp()
                    , g = []
                    , h = f.gclid
                    , m = f.dclid
                    , n = f.gclsrc || "aw"
                    , p = jq()
                    , q = iq();
                !h || "aw.ds" !== n && "aw" !== n && "ds" !== n && "3p.ds" !== n || g.push({
                    ba: h,
                    Be: n
                });
                m && g.push({
                    ba: m,
                    Be: "ds"
                });
                0 === g.length && f.wbraid && g.push({
                    ba: f.wbraid,
                    Be: "gb"
                });
                0 === g.length && "aw.ds" === n && g.push({
                    ba: "",
                    Be: "aw.ds"
                });
                oq(function() {
                    if (U(75) || X(P.g.R)) {
                        var t = X(mq());
                        Wo(a);
                        var r = []
                            , u = t ? Uo[Xo(a.prefix)] : void 0;
                        u && r.push("auid=" + u);
                        if (U(70) && X(P.g.P)) {
                            e && r.push("userId=" + e);
                            var v = Vn(Rn.Sg);
                            if (void 0 === v)
                                Un(Rn.Tg, !0);
                            else {
                                var w = Vn(Rn.Ug);
                                r.push("ga_uid=" + w + "." + v)
                            }
                        }
                        var x = H.referrer ? hj(lj(H.referrer), "host") : ""
                            , y = t || !d ? g : [];
                        0 === y.length && (pq.test(x) || qq.test(x)) && y.push({
                            ba: "",
                            Be: ""
                        });
                        if (0 !== y.length || p || void 0 !== q) {
                            x && r.push("ref=" + encodeURIComponent(x));
                            var B = kq();
                            r.push("url=" + encodeURIComponent(B));
                            r.push("tft=" + Cb());
                            var A = Lc();
                            void 0 !== A && r.push("tfd=" + Math.round(A));
                            var E = Rm(!0);
                            r.push("frm=" + E);
                            p && r.push("gad=1");
                            void 0 !== q && r.push("gad_source=" + encodeURIComponent(q));
                            var D = c;
                            void 0 === D && (D = bm.H[P.g.oa]);
                            var C = {}
                                , F = Il(yl(new xl(0), (C[P.g.oa] = D,
                                C)));
                            r.push("gtm=" + Qn({
                                za: b
                            }));
                            vn() && r.push("gcs=" + wn());
                            r.push("gcd=" + An(F));
                            Dn() && r.push("dma_cps=" + Bn());
                            r.push("dma=" + Cn());
                            un(F) ? r.push("npa=0") : r.push("npa=1");
                            Zm(gn()) && r.push("tcfd=" + Nn());
                            var N = on();
                            N && r.push("gdpr=" + N);
                            var M = mn();
                            M && r.push("gdpr_consent=" + M);
                            U(13) && r.push("apve=" + (U(14) ? 1 : 0));
                            zi.m && r.push("tag_exp=" + zi.m);
                            var Q = t ? 'https://adservice.google.com/pagead/regclk' : "https://adservice.googlesyndication.com/pagead/regclk";
                            if (0 < y.length)
                                for (var W = 0; W < y.length; W++) {
                                    var S = y[W]
                                        , R = S.ba
                                        , ia = S.Be;
                                    if (!hq(a.prefix, ia + "." + R, void 0 !== u)) {
                                        var ea = Q + "?" + r.join("&");
                                        "" !== R ? ea = "gb" === ia ? ea + "&wbraid=" + R : ea + "&gclid=" + R + "&gclsrc=" + ia : "aw.ds" === ia && (ea += "&gclsrc=aw.ds");
                                        Gc(ea)
                                    }
                                }
                            else if ((p || void 0 !== q) && !hq(a.prefix, "gad", void 0 !== u)) {
                                var ca = Q + "?" + r.join("&");
                                Gc(ca)
                            }
                        }
                    }
                })
            };
        var uq, vq = !1;
        function wq() {
            vq = !0;
            uq = uq || {}
        }
        function xq(a) {
            vq || wq();
            return uq[a]
        }
        var yq = function(a, b, c) {
            this.eventName = b;
            this.o = c;
            this.D = {};
            this.isAborted = !1;
            this.target = a;
            this.metadata = k(c.eventMetadata || {}, {})
        };
        yq.prototype.copyToHitData = function(a, b, c) {
            var d = V(this.o, a);
            void 0 === d && (d = b);
            if (void 0 !== d && void 0 !== c && l(d) && U(46))
                try {
                    d = c(d)
                } catch (e) {}
            void 0 !== d && (this.D[a] = d)
        }
        ;
        var zq = function(a, b, c) {
            var d = xq(a.target.ka);
            return d && void 0 !== d[b] ? d[b] : c
        };
        function Aq() {
            hi.dedupe_gclid || (hi.dedupe_gclid = po());
            return hi.dedupe_gclid
        }
        ;var Bq = /^(www\.)?google(\.com?)?(\.[a-z]{2}t?)?$/
            , Cq = /^www.googleadservices.com$/;
        function Dq(a) {
            a || (a = Eq());
            return a.gn ? !1 : a.Sl || a.Tl || a.Vl || a.Ul || a.th || a.nh || a.Gl || a.Kl ? !0 : !1
        }
        function Eq() {
            var a = {}
                , b = Io(!0);
            a.gn = !!b._up;
            var c = Mp();
            a.Sl = void 0 !== c.aw;
            a.Tl = void 0 !== c.dc;
            a.Vl = void 0 !== c.wbraid;
            a.Ul = void 0 !== c.gbraid;
            var d = lj(G.location.href)
                , e = hj(d, "query", !1, void 0, "gad");
            a.th = void 0 !== e;
            if (!a.th) {
                var f = d.hash.replace("#", "")
                    , g = ej(f, "gad", !1);
                a.th = void 0 !== g
            }
            a.nh = hj(d, "query", !1, void 0, "gad_source");
            if (void 0 === a.nh) {
                var h = d.hash.replace("#", "")
                    , m = ej(h, "gad_source", !1);
                a.nh = m
            }
            var n = H.referrer ? hj(lj(H.referrer), "host") : "";
            a.Kl = Bq.test(n);
            a.Gl = Cq.test(n);
            return a
        }
        ;var Fq = RegExp("^UA-\\d+-\\d+%3A[\\w-]+(?:%2C[\\w-]+)*(?:%3BUA-\\d+-\\d+%3A[\\w-]+(?:%2C[\\w-]+)*)*$")
            , Gq = /^~?[\w-]+(?:\.~?[\w-]+)*$/
            , Hq = /^\d+\.fls\.doubleclick\.net$/
            , Iq = /;gac=([^;?]+)/
            , Jq = /;gacgb=([^;?]+)/;
        function Kq(a, b) {
            if (Hq.test(H.location.host)) {
                var c = H.location.href.match(b);
                return c && 2 === c.length && c[1].match(Fq) ? decodeURIComponent(c[1]) : ""
            }
            for (var d = [], e = ma(Object.keys(a)), f = e.next(); !f.done; f = e.next()) {
                for (var g = f.value, h = [], m = a[g], n = 0; n < m.length; n++)
                    h.push(m[n].ba);
                d.push(g + ":" + h.join(","))
            }
            return 0 < d.length ? d.join(";") : ""
        }
        function Lq(a, b, c) {
            for (var d = wp(vp()) ? gp("_gac_gb", !0) : {}, e = [], f = !1, g = ma(Object.keys(d)), h = g.next(); !h.done; h = g.next()) {
                var m = h.value
                    , n = cq("_gac_gb_" + m, a, b, c);
                f = f || 0 !== n.length && n.some(function(p) {
                    return 1 === p
                });
                e.push(m + ":" + n.join(","))
            }
            return {
                Fl: f ? e.join(";") : "",
                El: Kq(d, Jq)
            }
        }
        function Mq(a) {
            var b = H.location.href.match(new RegExp(";" + a + "=([^;?]+)"));
            return b && 2 === b.length && b[1].match(Gq) ? b[1] : void 0
        }
        function Nq(a) {
            var b = {
                oh: void 0,
                qh: void 0
            }, c, d;
            Hq.test(H.location.host) && (c = Mq("gclgs"),
                d = Mq("gclst"));
            if (c && d)
                b.oh = c,
                    b.qh = d;
            else {
                var e = Cb()
                    , f = Ep((a || "_gcl") + "_gs")
                    , g = f.map(function(m) {
                    return m.ba
                })
                    , h = f.map(function(m) {
                    return e - m.timestamp
                });
                0 < g.length && 0 < h.length && (b.oh = g.join("."),
                    b.qh = h.join("."))
            }
            return b
        }
        function Oq(a, b, c) {
            if (Hq.test(H.location.host)) {
                var d = Mq(c);
                if (d)
                    return [{
                        ba: d
                    }]
            } else {
                if ("gclid" === b)
                    return zp((a || "_gcl") + "_aw");
                if ("wbraid" === b)
                    return zp((a || "_gcl") + "_gb");
                if ("braids" === b)
                    return Bp({
                        prefix: a
                    })
            }
            return []
        }
        function Pq(a) {
            return Oq(a, "gclid", "gclaw").map(function(b) {
                return b.ba
            }).join(".")
        }
        function Qq(a) {
            return Oq(a, "wbraid", "gclgb").map(function(b) {
                return b.ba
            }).join(".")
        }
        function Rq(a) {
            return Oq(a, "braids", "gclgb").map(function(b) {
                return b.ba
            }).join(".")
        }
        function Sq(a, b) {
            return Hq.test(H.location.host) ? !(Mq("gclaw") || Mq("gac")) : gq(a, b)
        }
        function Tq(a, b) {
            var c;
            c = U(53) ? dq(a, b) : cq((b && b.prefix || "_gcl") + "_gb", a, b);
            return 0 === c.length || c.every(function(d) {
                return 0 === d
            }) ? "" : c.join(".")
        }
        ;var Uq = function() {
            if (ob(G.__uspapi)) {
                var a = "";
                try {
                    G.__uspapi("getUSPData", 1, function(b, c) {
                        if (c && b) {
                            var d = b.uspString;
                            d && RegExp("^[\\da-zA-Z-]{1,20}$").test(d) && (a = d)
                        }
                    })
                } catch (b) {}
                return a
            }
        };
        var Xq = function(a) {
            if (a.eventName === P.g.fa && "page_view" === a.metadata.hit_type)
                if (U(14)) {
                    a.metadata.redact_click_ids = null != V(a.o, P.g.ja) && !1 !== V(a.o, P.g.ja) && !X([P.g.R, P.g.P]);
                    var b = Vq(a)
                        , c = !1 !== V(a.o, P.g.wa);
                    c || (a.D[P.g.Ei] = "1");
                    var d = Cp(b.prefix);
                    if (!a.metadata.consent_updated) {
                        var e = V(a.o, P.g.Va)
                            , f = V(a.o, P.g.xa) || {};
                        Wq({
                            vd: c,
                            zd: f,
                            Fd: e,
                            fc: b
                        });
                        var g;
                        var h = hi.ads_pageview = hi.ads_pageview || {};
                        g = h[d] ? !1 : h[d] = !0;
                        if (!g) {
                            a.isAborted = !0;
                            return
                        }
                    }
                    a.D[P.g.fd] = P.g.Qb;
                    if (a.metadata.consent_updated)
                        a.D[P.g.fd] = P.g.uk,
                            a.D[P.g.mc] = "1";
                    else {
                        var m = Mp();
                        a.D[P.g.Id] = m.gclid;
                        a.D[P.g.Pd] = m.dclid;
                        a.D[P.g.zi] = m.gclsrc;
                        a.D[P.g.Id] || a.D[P.g.Pd] || (a.D[P.g.Ve] = m.wbraid,
                            a.D[P.g.dg] = m.gbraid);
                        a.D[P.g.Fa] = H.referrer ? hj(lj(H.referrer), "host") : "";
                        a.D[P.g.ya] = kq();
                        a.D[P.g.yi] = iq();
                        a.D[P.g.Fb] = Rm(!0);
                        var n = Eq();
                        Dq(n) && (a.D[P.g.hd] = "1");
                        a.D[P.g.Bi] = Aq();
                        "1" === Io(!1)._up && (a.D[P.g.Ri] = "1")
                    }
                    var p = X([P.g.R, P.g.P]);
                    c && p && (Wo(b),
                        a.D[P.g.Cb] = Uo[Xo(b.prefix)]);
                    a.D[P.g.jb] = void 0;
                    a.D[P.g.Sa] = void 0;
                    var q = U(53);
                    if (!a.D[P.g.Id] && !a.D[P.g.Pd] && Sq(d, q)) {
                        var t = q ? Ap(b) : yp(d + "_gb");
                        0 < t.length && (a.D[P.g.jb] = t.join("."))
                    } else if (!a.D[P.g.Ve] && p) {
                        var r = yp(d + "_aw");
                        0 < r.length && (a.D[P.g.Sa] = r.join("."))
                    }
                    a.o.isGtmEvent && (a.o.m[P.g.oa] = bm.H[P.g.oa]);
                    un(a.o) ? a.D[P.g.Mb] = !1 : a.D[P.g.Mb] = !0;
                    a.metadata.add_tag_timing = !0;
                    var u = Uq();
                    void 0 !== u && (a.D[P.g.he] = u || "error");
                    var v = on();
                    v && (a.D[P.g.Ac] = v);
                    var w = mn();
                    w && (a.D[P.g.Cc] = w);
                    a.metadata.speculative = !1
                } else
                    a.isAborted = !0
        }
            , Vq = function(a) {
            var b = {
                prefix: V(a.o, P.g.Za) || V(a.o, P.g.Oa),
                domain: V(a.o, P.g.Ta),
                yb: V(a.o, P.g.Ua),
                flags: V(a.o, P.g.ab)
            };
            a.o.isGtmEvent && (b.path = V(a.o, P.g.Db));
            return b
        }
            , Yq = function(a, b) {
            var c = a.vd
                , d = a.za
                , e = a.allowAdPersonalizationSignals
                , f = a.Bd
                , g = a.Pn
                , h = a.kk;
            Wq({
                vd: c,
                zd: a.zd,
                Fd: a.Fd,
                fc: b
            });
            c && !0 !== g && (null != h ? h = String(h) : h = void 0,
                tq(b, d, e, f, h))
        }
            , Wq = function(a) {
            var b = a.zd
                , c = a.Fd
                , d = a.fc;
            a.vd && (So(b[P.g.Bc], !!b[P.g.Z]) && (Qp(Zq, d),
                Sp(d),
                dp(d)),
                Np(d),
                Wp(Zq, d),
                Xp(d));
            b[P.g.Z] && (Up(Zq, b[P.g.Z], b[P.g.Hb], !!b[P.g.sb], d.prefix),
                Vp(b[P.g.Z], b[P.g.Hb], !!b[P.g.sb], d.prefix),
                ep(Xo(d.prefix), b[P.g.Z], b[P.g.Hb], !!b[P.g.sb], d),
                ep("FPAU", b[P.g.Z], b[P.g.Hb], !!b[P.g.sb], d));
            c && Zp($q);
            aq($q)
        }
            , ar = function(a, b, c, d) {
            var e = a.lk
                , f = a.callback
                , g = a.Rj;
            if ("function" === typeof f)
                if (e === P.g.Sa && void 0 === g) {
                    var h = d(b.prefix, c);
                    0 === h.length ? f(void 0) : 1 === h.length ? f(h[0]) : f(h)
                } else
                    e === P.g.Cb ? (O(65),
                        Wo(b, !1),
                        f(Uo[Xo(b.prefix)])) : f(g)
        }
            , Zq = ["aw", "dc", "gb"]
            , $q = ["aw", "dc", "gb", "ag"];
        function br(a) {
            var b = V(a.o, P.g.Gb)
                , c = V(a.o, P.g.Ub);
            b && !c ? (a.eventName !== P.g.fa && a.eventName !== P.g.uc && O(131),
                a.isAborted = !0) : !b && c && (O(132),
                a.isAborted = !0)
        }
        function cr(a) {
            var b = X(P.g.R) ? hi.pscdl : "denied";
            null != b && (a.D[P.g.Ze] = b)
        }
        function dr(a) {
            if (U(66)) {
                var b = Rm(!0);
                a.D[P.g.Fb] = b
            }
        }
        ;function kr(a, b, c, d) {
            var e = xc(), f;
            if (1 === e)
                a: {
                    var g = si;
                    g = g.toLowerCase();
                    for (var h = "https://" + g, m = "http://" + g, n = 1, p = H.getElementsByTagName("script"), q = 0; q < p.length && 100 > q; q++) {
                        var t = p[q].src;
                        if (t) {
                            t = t.toLowerCase();
                            if (0 === t.indexOf(m)) {
                                f = 3;
                                break a
                            }
                            1 === n && 0 === t.indexOf(h) && (n = 2)
                        }
                    }
                    f = n
                }
            else
                f = e;
            return (2 === f || d || "http:" != G.location.protocol ? a : b) + c
        }
        ;function xr(a) {
            return {
                getDestinationId: function() {
                    return a.target.ka
                },
                getEventName: function() {
                    return a.eventName
                },
                setEventName: function(b) {
                    a.eventName = b
                },
                getHitData: function(b) {
                    return a.D[b]
                },
                setHitData: function(b, c) {
                    a.D[b] = c
                },
                setHitDataIfNotDefined: function(b, c) {
                    void 0 === a.D[b] && (a.D[b] = c)
                },
                copyToHitData: function(b, c) {
                    a.copyToHitData(b, c)
                },
                getMetadata: function(b) {
                    return a.metadata[b]
                },
                setMetadata: function(b, c) {
                    a.metadata[b] = c
                },
                isAborted: function() {
                    return a.isAborted
                },
                abort: function() {
                    a.isAborted = !0
                },
                getFromEventContext: function(b) {
                    return V(a.o, b)
                },
                Mj: function() {
                    return a
                },
                getHitKeys: function() {
                    return Object.keys(a.D)
                }
            }
        }
        ;var zr = function(a) {
            var b = yr[a.target.ka];
            if (!a.isAborted && b)
                for (var c = xr(a), d = 0; d < b.length; ++d) {
                    try {
                        b[d](c)
                    } catch (e) {
                        a.isAborted = !0
                    }
                    if (a.isAborted)
                        break
                }
        }
            , Ar = function(a, b) {
                var c = yr[a];
                c || (c = yr[a] = []);
                c.push(b)
            }
            , yr = {};
        function Er() {
            var a = G.screen;
            return {
                width: a ? a.width : 0,
                height: a ? a.height : 0
            }
        }
        function Fr(a) {
            if (H.hidden)
                return !0;
            var b = a.getBoundingClientRect();
            if (b.top === b.bottom || b.left === b.right || !G.getComputedStyle)
                return !0;
            var c = G.getComputedStyle(a, null);
            if ("hidden" === c.visibility)
                return !0;
            for (var d = a, e = c; d; ) {
                if ("none" === e.display)
                    return !0;
                var f = e.opacity
                    , g = e.filter;
                if (g) {
                    var h = g.indexOf("opacity(");
                    0 <= h && (g = g.substring(h + 8, g.indexOf(")", h)),
                    "%" === g.charAt(g.length - 1) && (g = g.substring(0, g.length - 1)),
                        f = String(Math.min(Number(g), Number(f))))
                }
                if (void 0 !== f && 0 >= Number(f))
                    return !0;
                (d = d.parentElement) && (e = G.getComputedStyle(d, null))
            }
            return !1
        }
        var Hr = function(a) {
            var b = Gr()
                , c = b.height
                , d = b.width
                , e = a.getBoundingClientRect()
                , f = e.bottom - e.top
                , g = e.right - e.left;
            return f && g ? (1 - Math.min((Math.max(0 - e.left, 0) + Math.max(e.right - d, 0)) / g, 1)) * (1 - Math.min((Math.max(0 - e.top, 0) + Math.max(e.bottom - c, 0)) / f, 1)) : 0
        }
            , Gr = function() {
            var a = H.body, b = H.documentElement || a && a.parentElement, c, d;
            if (H.compatMode && "BackCompat" !== H.compatMode)
                c = b ? b.clientHeight : 0,
                    d = b ? b.clientWidth : 0;
            else {
                var e = function(f, g) {
                    return f && g ? Math.min(f, g) : Math.max(f, g)
                };
                c = e(b ? b.clientHeight : 0, a ? a.clientHeight : 0);
                d = e(b ? b.clientWidth : 0, a ? a.clientWidth : 0)
            }
            return {
                width: d,
                height: c
            }
        };
        var Kr = function(a) {
            if (Ir) {
                if (0 <= a && a < Jr.length && Jr[a]) {
                    var b;
                    null == (b = Jr[a]) || b.disconnect();
                    Jr[a] = void 0
                }
            } else
                G.clearInterval(a)
        }
            , Nr = function(a, b, c) {
            for (var d = 0; d < c.length; d++)
                1 < c[d] ? c[d] = 1 : 0 > c[d] && (c[d] = 0);
            if (Ir) {
                var e = !1;
                I(function() {
                    e || Lr(a, b, c)()
                });
                return Mr(function(f) {
                    e = !0;
                    for (var g = {
                        Fe: 0
                    }; g.Fe < f.length; g = {
                        Fe: g.Fe
                    },
                             g.Fe++)
                        I(function(h) {
                            return function() {
                                a(f[h.Fe])
                            }
                        }(g))
                }, b, c)
            }
            return G.setInterval(Lr(a, b, c), 1E3)
        }
            , Lr = function(a, b, c) {
            function d(h, m) {
                var n = {
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }
                    , p = {
                    boundingClientRect: h.getBoundingClientRect(),
                    intersectionRatio: m,
                    intersectionRect: n,
                    isIntersecting: 0 < m,
                    rootBounds: n,
                    target: h,
                    time: Cb()
                };
                I(function() {
                    a(p)
                })
            }
            for (var e = [], f = [], g = 0; g < b.length; g++)
                e.push(0),
                    f.push(-1);
            c.sort(function(h, m) {
                return h - m
            });
            return function() {
                for (var h = 0; h < b.length; h++) {
                    var m = Hr(b[h]);
                    if (m > e[h])
                        for (; f[h] < c.length - 1 && m >= c[f[h] + 1]; )
                            d(b[h], m),
                                f[h]++;
                    else if (m < e[h])
                        for (; 0 <= f[h] && m <= c[f[h]]; )
                            d(b[h], m),
                                f[h]--;
                    e[h] = m
                }
            }
        }
            , Mr = function(a, b, c) {
            for (var d = new G.IntersectionObserver(a,{
                threshold: c
            }), e = 0; e < b.length; e++)
                d.observe(b[e]);
            for (var f = 0; f < Jr.length; f++)
                if (!Jr[f])
                    return Jr[f] = d,
                        f;
            return Jr.push(d) - 1
        }
            , Jr = []
            , Ir = !(!G.IntersectionObserver || !G.IntersectionObserverEntry);
        var Pr = function(a, b, c) {
            var d = a.element
                , e = {
                aa: a.aa,
                type: a.sa,
                tagName: d.tagName
            };
            b && (e.querySelector = Or(d));
            c && (e.isVisible = !Fr(d));
            return e
        }
            , Qr = function(a, b, c) {
            return Pr({
                element: a.element,
                aa: a.aa,
                sa: "1"
            }, b, c)
        }
            , Rr = function(a) {
            var b = !!a.xd + "." + !!a.yd;
            a && a.ye && a.ye.length && (b += "." + a.ye.join("."));
            a && a.vb && (b += "." + a.vb.email + "." + a.vb.phone + "." + a.vb.address);
            return b
        }
            , Ur = function(a) {
            if (0 != a.length) {
                var b;
                b = Sr(a, function(c) {
                    return !Tr.test(c.aa)
                });
                b = Sr(b, function(c) {
                    return "INPUT" === c.element.tagName.toUpperCase()
                });
                b = Sr(b, function(c) {
                    return !Fr(c.element)
                });
                return b[0]
            }
        }
            , Vr = function(a, b) {
            if (!b || 0 === b.length)
                return a;
            for (var c = [], d = 0; d < a.length; d++) {
                for (var e = !0, f = 0; f < b.length; f++) {
                    var g = b[f];
                    if (g && oh(a[d].element, g)) {
                        e = !1;
                        break
                    }
                }
                e && c.push(a[d])
            }
            return c
        }
            , Sr = function(a, b) {
            if (1 >= a.length)
                return a;
            var c = a.filter(b);
            return 0 == c.length ? a : c
        }
            , Or = function(a) {
            var b;
            if (a === H.body)
                b = "body";
            else {
                var c;
                if (a.id)
                    c = "#" + a.id;
                else {
                    var d;
                    if (a.parentElement) {
                        var e;
                        a: {
                            var f = a.parentElement;
                            if (f) {
                                for (var g = 0; g < f.childElementCount; g++)
                                    if (f.children[g] === a) {
                                        e = g + 1;
                                        break a
                                    }
                                e = -1
                            } else
                                e = 1
                        }
                        d = Or(a.parentElement) + ">:nth-child(" + e + ")"
                    } else
                        d = "";
                    c = d
                }
                b = c
            }
            return b
        }
            , Xr = function(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = a[c]
                    , e = d.textContent;
                "INPUT" === d.tagName.toUpperCase() && d.value && (e = d.value);
                if (e) {
                    var f = e.match(Wr);
                    if (f) {
                        var g = f[0], h;
                        if (G.location) {
                            var m = gj(G.location, "host", !0);
                            h = 0 <= g.toLowerCase().indexOf(m)
                        } else
                            h = !1;
                        h || b.push({
                            element: d,
                            aa: g
                        })
                    }
                }
            }
            return b
        }
            , as = function() {
            var a = []
                , b = H.body;
            if (!b)
                return {
                    elements: a,
                    status: "4"
                };
            for (var c = b.querySelectorAll("*"), d = 0; d < c.length && 1E4 > d; d++) {
                var e = c[d];
                if (!(0 <= Yr.indexOf(e.tagName.toUpperCase())) && e.children instanceof HTMLCollection) {
                    for (var f = !1, g = 0; g < e.childElementCount && 1E4 > g; g++)
                        if (!(0 <= Zr.indexOf(e.children[g].tagName.toUpperCase()))) {
                            f = !0;
                            break
                        }
                    (!f || U(17) && -1 !== $r.indexOf(e.tagName)) && a.push(e)
                }
            }
            return {
                elements: a,
                status: 1E4 < c.length ? "2" : "1"
            }
        }
            , bs = !1;
        var Wr = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
            , cs = /@(gmail|googlemail)\./i
            , Tr = /support|noreply/i
            , Yr = "SCRIPT STYLE IMG SVG PATH BR NOSCRIPT TEXTAREA".split(" ")
            , Zr = ["BR"]
            , ds = {
            pn: "1",
            Cn: "2",
            tn: "3",
            wn: "4",
            mn: "5",
            Dn: "6",
            yn: "7"
        }
            , es = {}
            , $r = ["INPUT", "SELECT"];
        var xs = function(a) {
            a = a || {
                xd: !0,
                yd: !0,
                Qf: void 0
            };
            a.vb = a.vb || {
                email: !0,
                phone: !1,
                address: !1
            };
            var b = Rr(a)
                , c = es[b];
            if (c && 200 > Cb() - c.timestamp)
                return c.result;
            var d = as(), e = d.status, f = [], g, h, m = [];
            if (!U(17)) {
                if (a.vb && a.vb.email) {
                    var n = Xr(d.elements);
                    f = Vr(n, a && a.ye);
                    g = Ur(f);
                    10 < n.length && (e = "3")
                }
                !a.Qf && g && (f = [g]);
                for (var p = 0; p < f.length; p++)
                    m.push(Qr(f[p], a.xd, a.yd));
                m = m.slice(0, 10)
            } else if (a.vb) {}
            g && (h = Qr(g, a.xd, a.yd));
            var E = {
                elements: m,
                Lh: h,
                status: e
            };
            es[b] = {
                timestamp: Cb(),
                result: E
            };
            return E
        }
            , ys = function(a) {
            return a.tagName + ":" + a.isVisible + ":" + a.aa.length + ":" + cs.test(a.aa)
        };
        var As = function(a) {
            return zq(a, P.g.Tb, V(a.o, P.g.Tb)) || zs(a)
        }
            , zs = function(a) {
            return U(84) && zq(a, "google_ng", !1) ? !0 : !!zq(a, "google_ono", !1)
        }
            , Bs = function(a) {
            if (a.metadata.is_merchant_center || !sj(a.o))
                return !1;
            if (!V(a.o, P.g.md)) {
                var b = V(a.o, P.g.yc);
                return !0 === b || "true" === b
            }
            return !0
        }
            , Cs = function(a) {
            var b = a.metadata.user_data;
            if (Va(b))
                return b
        }
            , Ds = function(a, b) {
            var c = zq(a, P.g.Vd, a.o.F[P.g.Vd]);
            if (c && void 0 !== c[b || a.eventName])
                return c[b || a.eventName]
        }
            , Es = function(a, b, c) {
            a.D[P.g.oe] || (a.D[P.g.oe] = {});
            a.D[P.g.oe][b] = c
        };
        var Fs = Number('') || 5
            , Gs = Number('') || 50
            , Hs = sb();
        var Ms = {
            Yk: Number('') || 500,
            Nk: Number('') || 5E3,
            lj: Number('20') || 10,
            tk: Number('') || 5E3
        };
        function Ns(a) {
            return a.performance && a.performance.now() || Date.now()
        }
        var Os = function(a, b) {
            var c;
            return c
        };
        var Ps = "https://" + gi.Hd + "/gtm/static/", Qs;
        function Vs(a, b) {}
        function Ws(a, b, c, d) {}
        function Xs(a, b, c, d) {}
        function Ys(a, b, c, d) {}
        var Zs = void 0;
        function $s(a) {
            var b = [];
            return b
        }
        ;var at = function(a) {
            for (var b = [], c = 0, d = 0; d < a.length; d++) {
                var e = a.charCodeAt(d);
                128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (55296 == (e & 64512) && d + 1 < a.length && 56320 == (a.charCodeAt(d + 1) & 64512) ? (e = 65536 + ((e & 1023) << 10) + (a.charCodeAt(++d) & 1023),
                    b[c++] = e >> 18 | 240,
                    b[c++] = e >> 12 & 63 | 128) : b[c++] = e >> 12 | 224,
                    b[c++] = e >> 6 & 63 | 128),
                    b[c++] = e & 63 | 128)
            }
            return b
        };
        Dm();
        Gm() || Am("iPod");
        Am("iPad");
        !Am("Android") || Em() || Dm() || Cm() || Am("Silk");
        Em();
        !Am("Safari") || Em() || (Bm() ? 0 : Am("Coast")) || Cm() || (Bm() ? 0 : Am("Edge")) || (Bm() ? zm("Microsoft Edge") : Am("Edg/")) || (Bm() ? zm("Opera") : Am("OPR")) || Dm() || Am("Silk") || Am("Android") || Hm();
        var bt = {}
            , ct = null
            , dt = function(a) {
            for (var b = [], c = 0, d = 0; d < a.length; d++) {
                var e = a.charCodeAt(d);
                255 < e && (b[c++] = e & 255,
                    e >>= 8);
                b[c++] = e
            }
            var f = 4;
            void 0 === f && (f = 0);
            if (!ct) {
                ct = {};
                for (var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), h = ["+/=", "+/", "-_=", "-_.", "-_"], m = 0; 5 > m; m++) {
                    var n = g.concat(h[m].split(""));
                    bt[m] = n;
                    for (var p = 0; p < n.length; p++) {
                        var q = n[p];
                        void 0 === ct[q] && (ct[q] = p)
                    }
                }
            }
            for (var t = bt[f], r = Array(Math.floor(b.length / 3)), u = t[64] || "", v = 0, w = 0; v < b.length - 2; v += 3) {
                var x = b[v]
                    , y = b[v + 1]
                    , B = b[v + 2]
                    , A = t[x >> 2]
                    , E = t[(x & 3) << 4 | y >> 4]
                    , D = t[(y & 15) << 2 | B >> 6]
                    , C = t[B & 63];
                r[w++] = "" + A + E + D + C
            }
            var F = 0
                , N = u;
            switch (b.length - v) {
                case 2:
                    F = b[v + 1],
                        N = t[(F & 15) << 2] || u;
                case 1:
                    var M = b[v];
                    r[w] = "" + t[M >> 2] + t[(M & 3) << 4 | F >> 4] + N + u
            }
            return r.join("")
        };
        Object.freeze(new function() {}
        );
        Object.freeze(new function() {}
        );
        var et = "platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");
        function ft(a) {
            var b;
            return null != (b = a.google_tag_data) ? b : a.google_tag_data = {}
        }
        function gt() {
            var a = G.google_tag_data, b;
            if (null != a && a.uach) {
                var c = a.uach
                    , d = Object.assign({}, c);
                c.fullVersionList && (d.fullVersionList = c.fullVersionList.slice(0));
                b = d
            } else
                b = null;
            return b
        }
        function ht() {
            var a, b;
            return null != (b = null == (a = G.google_tag_data) ? void 0 : a.uach_promise) ? b : null
        }
        function it(a) {
            var b, c;
            return "function" === typeof (null == (b = a.navigator) ? void 0 : null == (c = b.userAgentData) ? void 0 : c.getHighEntropyValues)
        }
        function jt() {
            var a = G;
            if (!it(a))
                return null;
            var b = ft(a);
            if (b.uach_promise)
                return b.uach_promise;
            var c = a.navigator.userAgentData.getHighEntropyValues(et).then(function(d) {
                null != b.uach || (b.uach = d);
                return d
            });
            return b.uach_promise = c
        }
        ;var kt, lt = function() {
            if (it(G) && (kt = Cb(),
                !ht())) {
                var a = jt();
                a && (a.then(function() {
                    O(95);
                }),
                    a.catch(function() {
                        O(96)
                    }))
            }
        }, nt = function(a) {
            var b = mt.dn
                , c = function(g, h) {
                try {
                    a(g, h)
                } catch (m) {}
            }
                , d = gt();
            if (d)
                c(d);
            else {
                var e = ht();
                if (e) {
                    b = Math.min(Math.max(isFinite(b) ? b : 0, 0), 1E3);
                    var f = G.setTimeout(function() {
                        c.He || (c.He = !0,
                            O(106),
                            c(null, Error("Timeout")))
                    }, b);
                    e.then(function(g) {
                        c.He || (c.He = !0,
                            O(104),
                            G.clearTimeout(f),
                            c(g))
                    }).catch(function(g) {
                        c.He || (c.He = !0,
                            O(105),
                            G.clearTimeout(f),
                            c(null, g))
                    })
                } else
                    c(null)
            }
        }, ot = function(a, b) {
            a && (b.D[P.g.qf] = a.architecture,
                b.D[P.g.rf] = a.bitness,
            a.fullVersionList && (b.D[P.g.tf] = a.fullVersionList.map(function(c) {
                return encodeURIComponent(c.brand || "") + ";" + encodeURIComponent(c.version || "")
            }).join("|")),
                b.D[P.g.uf] = a.mobile ? "1" : "0",
                b.D[P.g.vf] = a.model,
                b.D[P.g.wf] = a.platform,
                b.D[P.g.xf] = a.platformVersion,
                b.D[P.g.yf] = a.wow64 ? "1" : "0")
        };
        function pt() {
            return "attribution-reporting"
        }
        function qt(a) {
            var b;
            b = void 0 === b ? document : b;
            var c;
            return !(null == (c = b.featurePolicy) || !c.allowedFeatures().includes(a))
        }
        ;var rt = !1;
        function st() {
            if (qt("join-ad-interest-group") && ob(oc.joinAdInterestGroup))
                return !0;
            rt || (Pm(''),
                rt = !0);
            return qt("join-ad-interest-group") && ob(oc.joinAdInterestGroup)
        }
        function tt(a, b) {
            var c = void 0 === Ri[3] ? 1 : Ri[3]
                , d = 'iframe[data-tagging-id="' + b + '"]'
                , e = [];
            try {
                if (1 === c) {
                    var f = H.querySelector(d);
                    f && (e = [f])
                } else
                    e = Array.from(H.querySelectorAll(d))
            } catch (q) {}
            var g;
            a: {
                try {
                    g = H.querySelectorAll('iframe[allow="join-ad-interest-group"][data-tagging-id*="-"]');
                    break a
                } catch (q) {}
                g = void 0
            }
            var h = g, m = ((null == h ? void 0 : h.length) || 0) >= (void 0 === Ri[2] ? 50 : Ri[2]), n;
            if (n = 1 <= e.length) {
                var p = Number(e[e.length - 1].dataset.loadTime);
                void 0 !== p && Cb() - p < (void 0 === Ri[1] ? 6E4 : Ri[1]) ? (kb("TAGGING", 9),
                    n = !0) : n = !1
            }
            if (!n) {
                if (1 === c)
                    if (1 <= e.length)
                        ut(e[0]);
                    else {
                        if (m) {
                            kb("TAGGING", 10);
                            return
                        }
                    }
                else
                    e.length >= c ? ut(e[0]) : m && ut(h[0]);
                yc(a, void 0, {
                    allow: "join-ad-interest-group"
                }, {
                    taggingId: b,
                    loadTime: Cb()
                })
            }
        }
        function ut(a) {
            try {
                a.parentNode.removeChild(a)
            } catch (b) {}
        }
        function vt() {
            return "https://td.doubleclick.net"
        }
        ;var nu = function(a, b) {
            var c = {}
                , d = function(f, g) {
                var h;
                h = !0 === g ? "1" : !1 === g ? "0" : encodeURIComponent(String(g));
                c[f] = h
            };
            z(a.D, function(f, g) {
                var h = mu[f];
                h && void 0 !== g && "" !== g && (!a.metadata.redact_click_ids || f !== P.g.Id && f !== P.g.Pd && f !== P.g.Ve && f !== P.g.dg || (g = "0"),
                    d(h, g))
            });
            d("gtm", Qn({
                za: a.metadata.source_canonical_id
            }));
            vn() && d("gcs", wn());
            d("gcd", An(a.o));
            Dn() && d("dma_cps", Bn());
            d("dma", Cn());
            Zm(gn()) && d("tcfd", Nn());
            zi.m && d("tag_exp", zi.m);
            if (a.metadata.add_tag_timing) {
                d("tft", Cb());
                var e = Lc();
                void 0 !== e && d("tfd", Math.round(e))
            }
            U(13) && d("apve", U(14) ? "1" : "0");
            b(c)
        }
            , ou = function(a) {
                nu(a, function(b) {
                    var c = [];
                    z(b, function(f, g) {
                        c.push(f + "=" + g)
                    });
                    var d;
                    d = "page_view" === a.metadata.hit_type ? tj(X([P.g.R, P.g.P]) ? "https://www.google.com" : "https://pagead2.googlesyndication.com", !0) + "/ccm/collect" : void 0;
                    var e = d + "?" + c.join("&");
                    Gc(e);
                    if (ob(a.o.onSuccess))
                        a.o.onSuccess()
                })
            }
            , pu = {}
            , mu = (pu[P.g.mc] = "gcu",
                pu[P.g.jb] = "gclgb",
                pu[P.g.Sa] = "gclaw",
                pu[P.g.yi] = "gad_source",
                pu[P.g.Id] = "gclid",
                pu[P.g.zi] = "gclsrc",
                pu[P.g.dg] = "gbraid",
                pu[P.g.Ve] = "wbraid",
                pu[P.g.Cb] = "auid",
                pu[P.g.Bi] = "rnd",
                pu[P.g.Ei] = "ncl",
                pu[P.g.gg] = "gcldc",
                pu[P.g.Pd] = "dclid",
                pu[P.g.ob] = "edid",
                pu[P.g.fd] = "en",
                pu[P.g.Ac] = "gdpr",
                pu[P.g.rb] = "gdid",
                pu[P.g.Ri] = "gtm_up",
                pu[P.g.Fb] = "frm",
                pu[P.g.hd] = "lps",
                pu[P.g.be] = "did",
                pu[P.g.ya] = "dl",
                pu[P.g.Fa] = "dr",
                pu[P.g.Eg] = "ga_uid",
                pu[P.g.Cc] = "gdpr_consent",
                pu[P.g.Da] = "uid",
                pu[P.g.he] = "us_privacy",
                pu[P.g.Mb] = "npa",
                pu);
        var qu = {
            N: {
                Yh: "ads_conversion_hit",
                Gd: "container_execute_start",
                bi: "container_setup_end",
                Uf: "container_setup_start",
                Zh: "container_blocking_end",
                ai: "container_execute_end",
                di: "container_yield_end",
                Vf: "container_yield_start",
                bj: "event_execute_end",
                aj: "event_evaluation_end",
                Mg: "event_evaluation_start",
                cj: "event_setup_end",
                ie: "event_setup_start",
                ej: "ga4_conversion_hit",
                ke: "page_load",
                Bn: "pageview",
                ac: "snippet_load",
                xj: "tag_callback_error",
                yj: "tag_callback_failure",
                zj: "tag_callback_success",
                Aj: "tag_execute_end",
                sd: "tag_execute_start"
            }
        };
        function ru() {
            function a(c, d) {
                var e = lb(d);
                e && b.push([c, e])
            }
            var b = [];
            a("u", "GTM");
            a("ut", "TAGGING");
            a("h", "HEALTH");
            return b
        }
        ;var su = !1;
        var av = function(a, b) {}
            , bv = function(a, b) {}
            , cv = function(a, b) {}
            , dv = function(a, b) {}
            , ev = function() {
            var a = {};
            return a
        }
            , Su = function(a) {
            a = void 0 === a ? !0 : a;
            var b = {};
            return b
        }
            , fv = function() {}
            , gv = function(a, b) {}
            , hv = function(a, b, c) {}
            , iv = function() {};
        function jv(a, b) {
            var c = G, d, e = c.GooglebQhCsO;
            e || (e = {},
                c.GooglebQhCsO = e);
            d = e;
            if (d[a])
                return !1;
            d[a] = [];
            d[a][0] = b;
            return !0
        }
        ;var kv = function(a, b, c) {
            var d = Km(a, "fmt");
            if (b) {
                var e = Km(a, "random")
                    , f = Km(a, "label") || "";
                if (!e)
                    return !1;
                var g = dt(decodeURIComponent(f.replace(/\+/g, " ")) + ":" + decodeURIComponent(e.replace(/\+/g, " ")));
                if (!jv(g, b))
                    return !1
            }
            d && 4 != d && (a = Mm(a, "rfmt", d));
            var h = Mm(a, "fmt", 4);
            wc(h, function() {
                G.google_noFurtherRedirects && b && b.call && (G.google_noFurtherRedirects = null,
                    b())
            }, void 0, c, H.getElementsByTagName("script")[0].parentElement || void 0);
            return !0
        };
        function Bv(a, b) {
            if (data.entities) {
                var c = data.entities[a];
                if (c)
                    return c[b]
            }
        }
        ;function Cv(a, b, c) {
            c = void 0 === c ? !1 : c;
            Dv().addRestriction(0, a, b, c)
        }
        function Ev(a, b, c) {
            c = void 0 === c ? !1 : c;
            Dv().addRestriction(1, a, b, c)
        }
        function Fv() {
            var a = Ij();
            return Dv().getRestrictions(1, a)
        }
        var Gv = function() {
            this.m = {};
            this.F = {}
        }
            , Hv = function(a, b) {
            var c = a.m[b];
            c || (c = {
                _entity: {
                    internal: [],
                    external: []
                },
                _event: {
                    internal: [],
                    external: []
                }
            },
                a.m[b] = c);
            return c
        };
        Gv.prototype.addRestriction = function(a, b, c, d) {
            d = void 0 === d ? !1 : d;
            if (!d || !this.F[b]) {
                var e = Hv(this, b);
                0 === a ? d ? e._entity.external.push(c) : e._entity.internal.push(c) : 1 === a && (d ? e._event.external.push(c) : e._event.internal.push(c))
            }
        }
        ;
        Gv.prototype.getRestrictions = function(a, b) {
            var c = Hv(this, b);
            if (0 === a) {
                var d, e;
                return [].concat(pa((null == c ? void 0 : null == (d = c._entity) ? void 0 : d.internal) || []), pa((null == c ? void 0 : null == (e = c._entity) ? void 0 : e.external) || []))
            }
            if (1 === a) {
                var f, g;
                return [].concat(pa((null == c ? void 0 : null == (f = c._event) ? void 0 : f.internal) || []), pa((null == c ? void 0 : null == (g = c._event) ? void 0 : g.external) || []))
            }
            return []
        }
        ;
        Gv.prototype.getExternalRestrictions = function(a, b) {
            var c = Hv(this, b), d, e;
            return 0 === a ? (null == c ? void 0 : null == (d = c._entity) ? void 0 : d.external) || [] : (null == c ? void 0 : null == (e = c._event) ? void 0 : e.external) || []
        }
        ;
        Gv.prototype.removeExternalRestrictions = function(a) {
            var b = Hv(this, a);
            b._event && (b._event.external = []);
            b._entity && (b._entity.external = []);
            this.F[a] = !0
        }
        ;
        function Dv() {
            var a = hi.r;
            a || (a = new Gv,
                hi.r = a);
            return a
        }
        ;var Iv = new RegExp(/^(.*\.)?(google|youtube|blogger|withgoogle)(\.com?)?(\.[a-z]{2})?\.?$/)
            , Jv = {
                cl: ["ecl"],
                customPixels: ["nonGooglePixels"],
                ecl: ["cl"],
                ehl: ["hl"],
                gaawc: ["googtag"],
                hl: ["ehl"],
                html: ["customScripts", "customPixels", "nonGooglePixels", "nonGoogleScripts", "nonGoogleIframes"],
                customScripts: ["html", "customPixels", "nonGooglePixels", "nonGoogleScripts", "nonGoogleIframes"],
                nonGooglePixels: [],
                nonGoogleScripts: ["nonGooglePixels"],
                nonGoogleIframes: ["nonGooglePixels"]
            }
            , Kv = {
                cl: ["ecl"],
                customPixels: ["customScripts", "html"],
                ecl: ["cl"],
                ehl: ["hl"],
                gaawc: ["googtag"],
                hl: ["ehl"],
                html: ["customScripts"],
                customScripts: ["html"],
                nonGooglePixels: ["customPixels", "customScripts", "html", "nonGoogleScripts", "nonGoogleIframes"],
                nonGoogleScripts: ["customScripts", "html"],
                nonGoogleIframes: ["customScripts", "html", "nonGoogleScripts"]
            }
            , Lv = "google customPixels customScripts html nonGooglePixels nonGoogleScripts nonGoogleIframes".split(" ");
        function Mv() {
            var a = Gi("gtm.allowlist") || Gi("gtm.whitelist");
            a && O(9);
            mi && (a = ["google", "gtagfl", "lcl", "zone"]);
            Iv.test(G.location && G.location.hostname) && (mi ? O(116) : (O(117),
            Nv && (a = [],
            window.console && window.console.log && window.console.log("GTM blocked. See go/13687728."))));
            var b = a && Gb(yb(a), Jv)
                , c = Gi("gtm.blocklist") || Gi("gtm.blacklist");
            c || (c = Gi("tagTypeBlacklist")) && O(3);
            c ? O(8) : c = [];
            Iv.test(G.location && G.location.hostname) && (c = yb(c),
                c.push("nonGooglePixels", "nonGoogleScripts", "sandboxedScripts"));
            0 <= yb(c).indexOf("google") && O(2);
            var d = c && Gb(yb(c), Kv)
                , e = {};
            return function(f) {
                var g = f && f[Ce.ra];
                if (!g || "string" !== typeof g)
                    return !0;
                g = g.replace(/^_*/, "");
                if (void 0 !== e[g])
                    return e[g];
                var h = wi[g] || []
                    , m = !0;
                if (a) {
                    var n;
                    if (n = m)
                        a: {
                            if (0 > b.indexOf(g))
                                if (h && 0 < h.length)
                                    for (var p = 0; p < h.length; p++) {
                                        if (0 > b.indexOf(h[p])) {
                                            O(11);
                                            n = !1;
                                            break a
                                        }
                                    }
                                else {
                                    n = !1;
                                    break a
                                }
                            n = !0
                        }
                    m = n
                }
                var q = !1;
                if (c) {
                    var t = 0 <= d.indexOf(g);
                    if (t)
                        q = t;
                    else {
                        var r = tb(d, h || []);
                        r && O(10);
                        q = r
                    }
                }
                var u = !m || q;
                u || !(0 <= h.indexOf("sandboxedScripts")) || b && -1 !== b.indexOf("sandboxedScripts") || (u = tb(d, Lv));
                return e[g] = u
            }
        }
        var Nv = !1;
        Nv = !0;
        function Ov() {
            Aj && Cv(Ij(), function(a) {
                var b = mf(a.entityId), c;
                if (rf(b)) {
                    var d = b[Ce.ra];
                    if (!d)
                        throw "Error: No function name given for function call.";
                    var e = df[d];
                    c = !!e && !!e.runInSiloedMode
                } else
                    c = !!Bv(b[Ce.ra], 4);
                return c
            })
        }
        var Qv = function(a, b, c, d, e) {
            if (!Pv()) {
                var f = d.siloed ? Dj(a) : a;
                if (!Xj(f)) {
                    var g = "?id=" + encodeURIComponent(a) + "&l=" + gi.Ya
                        , h = 0 === a.indexOf("GTM-");
                    h || (g += "&cx=c");
                    U(56) && (g += "&gtm=" + Qn());
                    var m = rj();
                    m && (g += "&sign=" + gi.Ef);
                    var n = c ? "/gtag/js" : "/gtm.js"
                        , p = qj() ? pj(b, n + g) : void 0;
                    if (!p) {
                        var q = gi.Hd + n;
                        m && qc && h ? (q = qc.replace(/^(?:https?:\/\/)?/i, "").split(/[?#]/)[0],
                            p = kr("https://", "http://", q + g)) : p = zi.F ? Ai() + n + g : kr("https://", "http://", q + g)
                    }
                    d.siloed && Zj({
                        ctid: f,
                        isDestination: !1
                    });
                    var t = Qj();
                    wj().container[f] = {
                        state: 1,
                        context: d,
                        parent: t
                    };
                    xj({
                        ctid: f,
                        isDestination: !1
                    }, e);
                    wc(p)
                }
            }
        }
            , Rv = function(a, b, c, d) {
            if (!Pv()) {
                var e = c.siloed ? Dj(a) : a;
                if (!Yj(e))
                    if (!c.siloed && ak())
                        wj().destination[e] = {
                            state: 0,
                            transportUrl: b,
                            context: c,
                            parent: Qj()
                        },
                            xj({
                                ctid: e,
                                isDestination: !0
                            }, d),
                            O(91);
                    else {
                        var f = "/gtag/destination?id=" + encodeURIComponent(a) + "&l=" + gi.Ya + "&cx=c";
                        U(56) && (f += "&gtm=" + Qn());
                        rj() && (f += "&sign=" + gi.Ef);
                        var g = qj() ? pj(b, f) : void 0;
                        g || (g = zi.F ? Ai() + f : kr("https://", "http://", gi.Hd + f));
                        c.siloed && Zj({
                            ctid: e,
                            isDestination: !0
                        });
                        wj().destination[e] = {
                            state: 1,
                            context: c,
                            parent: Qj()
                        };
                        xj({
                            ctid: e,
                            isDestination: !0
                        }, d);
                        wc(g)
                    }
            }
        };
        function Pv() {
            if (On()) {
                return !0
            }
            return !1
        }
        ;var Sv = !1
            , Tv = 0
            , Uv = [];
        function Vv(a) {
            if (!Sv) {
                var b = H.createEventObject
                    , c = "complete" === H.readyState
                    , d = "interactive" === H.readyState;
                if (!a || "readystatechange" !== a.type || c || !b && d) {
                    Sv = !0;
                    for (var e = 0; e < Uv.length; e++)
                        I(Uv[e])
                }
                Uv.push = function() {
                    for (var f = za.apply(0, arguments), g = 0; g < f.length; g++)
                        I(f[g]);
                    return 0
                }
            }
        }
        function Wv() {
            if (!Sv && 140 > Tv) {
                Tv++;
                try {
                    var a, b;
                    null == (b = (a = H.documentElement).doScroll) || b.call(a, "left");
                    Vv()
                } catch (c) {
                    G.setTimeout(Wv, 50)
                }
            }
        }
        function Xv(a) {
            Sv ? a() : Uv.push(a)
        }
        ;var Yv = function() {
            this.M = 0;
            this.m = {}
        };
        Yv.prototype.addListener = function(a, b, c) {
            var d = ++this.M;
            this.m[a] = this.m[a] || {};
            this.m[a][String(d)] = {
                listener: b,
                Ab: c
            };
            return d
        }
        ;
        Yv.prototype.F = function(a, b) {
            var c = this.m[a]
                , d = String(b);
            if (!c || !c[d])
                return !1;
            delete c[d];
            return !0
        }
        ;
        Yv.prototype.H = function(a, b) {
            var c = [];
            z(this.m[a], function(d, e) {
                0 > c.indexOf(e.listener) && (void 0 === e.Ab || 0 <= b.indexOf(e.Ab)) && c.push(e.listener)
            });
            return c
        }
        ;
        function Zv(a, b, c) {
            return {
                entityType: a,
                indexInOriginContainer: b,
                nameInOriginContainer: c,
                originContainerId: Gj()
            }
        }
        ;var aw = function(a, b) {
            this.m = !1;
            this.M = [];
            this.eventData = {
                tags: []
            };
            this.T = !1;
            this.F = this.H = 0;
            $v(this, a, b)
        }
            , bw = function(a, b, c, d) {
                if (ji.hasOwnProperty(b) || "__zone" === b)
                    return -1;
                var e = {};
                Va(d) && (e = k(d, e));
                e.id = c;
                e.status = "timeout";
                return a.eventData.tags.push(e) - 1
            }
            , cw = function(a, b, c, d) {
                var e = a.eventData.tags[b];
                e && (e.status = c,
                    e.executionTime = d)
            }
            , dw = function(a) {
                if (!a.m) {
                    for (var b = a.M, c = 0; c < b.length; c++)
                        b[c]();
                    a.m = !0;
                    a.M.length = 0
                }
            }
            , $v = function(a, b, c) {
                void 0 !== b && a.qe(b);
                c && G.setTimeout(function() {
                    dw(a)
                }, Number(c))
            };
        aw.prototype.qe = function(a) {
            var b = this
                , c = Eb(function() {
                I(function() {
                    a(Gj(), b.eventData)
                })
            });
            this.m ? c() : this.M.push(c)
        }
        ;
        var ew = function(a) {
            a.H++;
            return Eb(function() {
                a.F++;
                a.T && a.F >= a.H && dw(a)
            })
        }
            , fw = function(a) {
            a.T = !0;
            a.F >= a.H && dw(a)
        };
        var gw = {}
            , iw = function() {
            return G[hw()]
        };
        function hw() {
            return G.GoogleAnalyticsObject || "ga"
        }
        var lw = function() {
            var a = Gj();
        }
            , mw = function(a, b) {
            return function() {
                var c = iw()
                    , d = c && c.getByName && c.getByName(a);
                if (d) {
                    var e = d.get("sendHitTask");
                    d.set("sendHitTask", function(f) {
                        var g = f.get("hitPayload")
                            , h = f.get("hitCallback")
                            , m = 0 > g.indexOf("&tid=" + b);
                        m && (f.set("hitPayload", g.replace(/&tid=UA-[0-9]+-[0-9]+/, "&tid=" + b), !0),
                            f.set("hitCallback", void 0, !0));
                        e(f);
                        m && (f.set("hitPayload", g, !0),
                            f.set("hitCallback", h, !0),
                            f.set("_x_19", void 0, !0),
                            e(f))
                    })
                }
            }
        };
        var Tw = ["es", "1"]
            , Uw = {}
            , Vw = {};
        function Ww(a, b) {
            if (nk) {
                var c;
                c = b.match(/^(gtm|gtag)\./) ? encodeURIComponent(b) : "*";
                Uw[a] = [["e", c], ["eid", a]];
                yk(a)
            }
        }
        function Xw(a) {
            var b = a.eventId
                , c = a.Xa;
            if (!Uw[b])
                return [];
            var d = [];
            Vw[b] || d.push(Tw);
            d.push.apply(d, pa(Uw[b]));
            c && (Vw[b] = !0);
            return d
        }
        ;var Yw = {}
            , Zw = {}
            , $w = {};
        function ax(a, b, c, d) {
            nk && U(63) && ((void 0 === d ? 0 : d) ? ($w[b] = $w[b] || 0,
                ++$w[b]) : void 0 !== c ? (Zw[a] = Zw[a] || {},
                Zw[a][b] = Math.round(c)) : (Yw[a] = Yw[a] || {},
                Yw[a][b] = (Yw[a][b] || 0) + 1))
        }
        function bx(a) {
            var b = a.eventId, c = a.Xa, d = Yw[b] || {}, e = [], f;
            for (f in d)
                d.hasOwnProperty(f) && e.push("" + f + d[f]);
            c && delete Yw[b];
            return e.length ? [["md", e.join(".")]] : []
        }
        function cx(a) {
            var b = a.eventId, c = a.Xa, d = Zw[b] || {}, e = [], f;
            for (f in d)
                d.hasOwnProperty(f) && e.push("" + f + d[f]);
            c && delete Zw[b];
            return e.length ? [["mtd", e.join(".")]] : []
        }
        function dx() {
            for (var a = [], b = ma(Object.keys($w)), c = b.next(); !c.done; c = b.next()) {
                var d = c.value;
                a.push("" + d + $w[d])
            }
            return a.length ? [["mec", a.join(".")]] : []
        }
        ;var ex = {}
            , fx = {};
        function gx(a, b, c) {
            if (nk && b) {
                var d = uj(b);
                ex[a] = ex[a] || [];
                ex[a].push(c + d);
                var e = (rf(b) ? "1" : "2") + d;
                fx[a] = fx[a] || [];
                fx[a].push(e);
                yk(a)
            }
        }
        function hx(a) {
            var b = a.eventId
                , c = a.Xa
                , d = []
                , e = ex[b] || [];
            e.length && d.push(["tr", e.join(".")]);
            var f = fx[b] || [];
            f.length && d.push(["ti", f.join(".")]);
            c && (delete ex[b],
                delete fx[b]);
            return d
        }
        ;function ix(a, b, c, d) {
            var e = bf[a]
                , f = jx(a, b, c, d);
            if (!f)
                return null;
            var g = of(e[Ce.vj], c, []);
            if (g && g.length) {
                var h = g[0];
                f = ix(h.index, {
                    onSuccess: f,
                    onFailure: 1 === h.Lj ? b.terminate : f,
                    terminate: b.terminate
                }, c, d)
            }
            return f
        }
        function jx(a, b, c, d) {
            function e() {
                if (f[Ce.Rk])
                    h();
                else {
                    var w = pf(f, c, [])
                        , x = w[Ce.rk];
                    if (null != x)
                        for (var y = 0; y < x.length; y++)
                            if (!X(x[y])) {
                                h();
                                return
                            }
                    var B = bw(c.bc, String(f[Ce.ra]), Number(f[Ce.pe]), w[Ce.Sk])
                        , A = !1;
                    w.vtp_gtmOnSuccess = function() {
                        if (!A) {
                            A = !0;
                            var C = Cb() - D;
                            gx(c.id, bf[a], "5");
                            cw(c.bc, B, "success", C);
                            U(57) && hv(c, f, qu.N.zj);
                            g()
                        }
                    }
                    ;
                    w.vtp_gtmOnFailure = function() {
                        if (!A) {
                            A = !0;
                            var C = Cb() - D;
                            gx(c.id, bf[a], "6");
                            cw(c.bc, B, "failure", C);
                            U(57) && hv(c, f, qu.N.yj);
                            h()
                        }
                    }
                    ;
                    w.vtp_gtmTagId = f.tag_id;
                    w.vtp_gtmEventId = c.id;
                    c.priorityId && (w.vtp_gtmPriorityId = c.priorityId);
                    gx(c.id, f, "1");
                    var E = function() {
                        Vi(3);
                        var C = Cb() - D;
                        gx(c.id, f, "7");
                        cw(c.bc, B, "exception", C);
                        U(57) && hv(c, f, qu.N.xj);
                        A || (A = !0,
                            h())
                    };
                    U(57) && gv(c, f);
                    var D = Cb();
                    try {
                        nf(w, {
                            event: c,
                            index: a,
                            type: 1
                        })
                    } catch (C) {
                        E(C)
                    }
                    U(57) && hv(c, f, qu.N.Aj)
                }
            }
            var f = bf[a]
                , g = b.onSuccess
                , h = b.onFailure
                , m = b.terminate;
            if (c.isBlocked(f))
                return null;
            var n = of(f[Ce.Bj], c, []);
            if (n && n.length) {
                var p = n[0]
                    , q = ix(p.index, {
                    onSuccess: g,
                    onFailure: h,
                    terminate: m
                }, c, d);
                if (!q)
                    return null;
                g = q;
                h = 2 === p.Lj ? m : q
            }
            if (f[Ce.oj] || f[Ce.Uk]) {
                var t = f[Ce.oj] ? cf : c.Um
                    , r = g
                    , u = h;
                if (!t[a]) {
                    e = Eb(e);
                    var v = kx(a, t, e);
                    g = v.onSuccess;
                    h = v.onFailure
                }
                return function() {
                    t[a](r, u)
                }
            }
            return e
        }
        function kx(a, b, c) {
            var d = []
                , e = [];
            b[a] = lx(d, e, c);
            return {
                onSuccess: function() {
                    b[a] = mx;
                    for (var f = 0; f < d.length; f++)
                        d[f]()
                },
                onFailure: function() {
                    b[a] = nx;
                    for (var f = 0; f < e.length; f++)
                        e[f]()
                }
            }
        }
        function lx(a, b, c) {
            return function(d, e) {
                a.push(d);
                b.push(e);
                c()
            }
        }
        function mx(a) {
            a()
        }
        function nx(a, b) {
            b()
        }
        ;var qx = function(a, b) {
            for (var c = [], d = 0; d < bf.length; d++)
                if (a[d]) {
                    var e = bf[d];
                    var f = ew(b.bc);
                    try {
                        var g = ix(d, {
                            onSuccess: f,
                            onFailure: f,
                            terminate: f
                        }, b, d);
                        if (g) {
                            var h = e[Ce.ra];
                            if (!h)
                                throw "Error: No function name given for function call.";
                            var m = df[h];
                            c.push({
                                ik: d,
                                Xj: (m ? m.priorityOverride || 0 : 0) || Bv(e[Ce.ra], 1) || 0,
                                execute: g
                            })
                        } else
                            ox(d, b),
                                f()
                    } catch (p) {
                        f()
                    }
                }
            c.sort(px);
            for (var n = 0; n < c.length; n++)
                c[n].execute();
            return 0 < c.length
        };
        var sx = function(a, b) {
            if (!rx)
                return !1;
            var c = a["gtm.triggers"] && String(a["gtm.triggers"])
                , d = rx.H(a.event, c ? String(c).split(",") : []);
            if (!d.length)
                return !1;
            for (var e = 0; e < d.length; ++e) {
                var f = ew(b);
                try {
                    d[e](a, f)
                } catch (g) {
                    f()
                }
            }
            return !0
        };
        function px(a, b) {
            var c, d = b.Xj, e = a.Xj;
            c = d > e ? 1 : d < e ? -1 : 0;
            var f;
            if (0 !== c)
                f = c;
            else {
                var g = a.ik
                    , h = b.ik;
                f = g > h ? 1 : g < h ? -1 : 0
            }
            return f
        }
        function ox(a, b) {
            if (nk) {
                var c = function(d) {
                    var e = b.isBlocked(bf[d]) ? "3" : "4"
                        , f = of(bf[d][Ce.vj], b, []);
                    f && f.length && c(f[0].index);
                    gx(b.id, bf[d], e);
                    var g = of(bf[d][Ce.Bj], b, []);
                    g && g.length && c(g[0].index)
                };
                c(a)
            }
        }
        var tx = !1, rx;
        var ux = function() {
            rx || (rx = new Yv);
            return rx
        };
        var zx = function(a) {
            var b = a["gtm.uniqueEventId"]
                , c = a["gtm.priorityId"]
                , d = a.event;
            if (U(57)) {}
            if ("gtm.js" === d) {
                if (tx)
                    return !1;
                tx = !0
            }
            var e = !1
                , f = Fv()
                , g = k(a);
            if (!f.every(function(r) {
                return r({
                    originalEventData: g
                })
            })) {
                if ("gtm.js" !== d && "gtm.init" !== d && "gtm.init_consent" !== d)
                    return !1;
                e = !0
            }
            Ww(b, d);
            var h = a.eventCallback
                , m = a.eventTimeout
                , n = {
                id: b,
                priorityId: c,
                name: d,
                isBlocked: vx(g, e),
                Um: [],
                logMacroError: function() {
                    O(6);
                    Vi(0)
                },
                cachedModelValues: wx(),
                bc: new aw(function() {
                        if (U(57)) {}
                        h && h.apply(h, [].slice.call(arguments, 0))
                    }
                    ,m),
                originalEventData: g
            };
            U(63) && nk && (n.reportMacroDiscrepancy = ax);
            U(57) && cv(n.id, n.name);
            var p = zf(n);
            U(57) && dv(n.id, n.name);
            e && (p = xx(p));
            if (U(57)) {}
            var q = qx(p, n)
                , t = !1;
            t = sx(a, n.bc);
            fw(n.bc);
            "gtm.js" !== d && "gtm.sync" !== d || lw();
            return yx(p, q) || t
        };
        function wx() {
            var a = {};
            a.event = Li("event", 1);
            a.ecommerce = Li("ecommerce", 1);
            a.gtm = Li("gtm");
            a.eventModel = Li("eventModel");
            return a
        }
        function vx(a, b) {
            var c = Mv();
            return function(d) {
                if (c(d))
                    return !0;
                var e = d && d[Ce.ra];
                if (!e || "string" != typeof e)
                    return !0;
                e = e.replace(/^_*/, "");
                var f, g = Ij();
                f = Dv().getRestrictions(0, g);
                var h = a;
                b && (h = k(a),
                    h["gtm.uniqueEventId"] = Number.MAX_SAFE_INTEGER);
                for (var m = wi[e] || [], n = ma(f), p = n.next(); !p.done; p = n.next()) {
                    var q = p.value;
                    try {
                        if (!q({
                            entityId: e,
                            securityGroups: m,
                            originalEventData: h
                        }))
                            return !0
                    } catch (t) {
                        return !0
                    }
                }
                return !1
            }
        }
        function xx(a) {
            for (var b = [], c = 0; c < a.length; c++)
                if (a[c]) {
                    var d = String(bf[c][Ce.ra]);
                    if (ii[d] || void 0 !== bf[c][Ce.Vk] || Bv(d, 2))
                        b[c] = !0
                }
            return b
        }
        function yx(a, b) {
            if (!b)
                return b;
            for (var c = 0; c < a.length; c++)
                if (a[c] && bf[c] && !ji[String(bf[c][Ce.ra])])
                    return !0;
            return !1
        }
        function Ax(a, b) {
            return 1 === arguments.length ? Bx("set", a) : Bx("set", a, b)
        }
        function Cx(a, b) {
            return 1 === arguments.length ? Bx("config", a) : Bx("config", a, b)
        }
        function Dx(a, b, c) {
            c = c || {};
            c[P.g.Wb] = a;
            return Bx("event", b, c)
        }
        function Bx() {
            return arguments
        }
        ;var Ex = function() {
            this.messages = [];
            this.m = []
        };
        Ex.prototype.enqueue = function(a, b, c) {
            var d = this.messages.length + 1;
            a["gtm.uniqueEventId"] = b;
            a["gtm.priorityId"] = d;
            var e = Object.assign({}, c, {
                eventId: b,
                priorityId: d,
                fromContainerExecution: !0
            })
                , f = {
                message: a,
                notBeforeEventId: b,
                priorityId: d,
                messageContext: e
            };
            this.messages.push(f);
            for (var g = 0; g < this.m.length; g++)
                try {
                    this.m[g](f)
                } catch (h) {}
        }
        ;
        Ex.prototype.listen = function(a) {
            this.m.push(a)
        }
        ;
        Ex.prototype.get = function() {
            for (var a = {}, b = 0; b < this.messages.length; b++) {
                var c = this.messages[b]
                    , d = a[c.notBeforeEventId];
                d || (d = [],
                    a[c.notBeforeEventId] = d);
                d.push(c)
            }
            return a
        }
        ;
        Ex.prototype.prune = function(a) {
            for (var b = [], c = [], d = 0; d < this.messages.length; d++) {
                var e = this.messages[d];
                e.notBeforeEventId === a ? b.push(e) : c.push(e)
            }
            this.messages = c;
            return b
        }
        ;
        function Fx(a, b, c) {
            c.eventMetadata = c.eventMetadata || {};
            c.eventMetadata.source_canonical_id = Gf.canonicalContainerId;
            Gx().enqueue(a, b, c)
        }
        function Hx() {
            var a = Ix;
            Gx().listen(a)
        }
        function Gx() {
            var a = hi.mb;
            a || (a = new Ex,
                hi.mb = a);
            return a
        }
        ;var Cf;
        var Jx = 0;
        function Kx() {
            if (1 === Jx && nk) {
                var a = uk(!0, !0, !0, !0);
                jk && (U(23) || (a = a.replace("/a?", "/td?")),
                    Jc(a),
                    jk = !1)
            }
        }
        var Lx = function(a) {
            if (!a.Kj || 1 !== Jx)
                return [];
            a.Nc();
            var b = Gk();
            b.push(["mcc", "1"]);
            Jx = 3;
            return b
        };
        var Mx = {}
            , Nx = {};
        function Ox(a, b) {
            for (var c = [], d = [], e = {}, f = 0; f < a.length; e = {
                Jh: void 0,
                sh: void 0
            },
                f++) {
                var g = a[f];
                if (0 <= g.indexOf("-")) {
                    if (e.Jh = Ll(g, b),
                        e.Jh) {
                        var h = Ej();
                        rb(h, function(t) {
                            return function(r) {
                                return t.Jh.ka === r
                            }
                        }(e)) ? c.push(g) : d.push(g)
                    }
                } else {
                    var m = Mx[g] || [];
                    e.sh = {};
                    m.forEach(function(t) {
                        return function(r) {
                            t.sh[r] = !0
                        }
                    }(e));
                    for (var n = Bj(), p = 0; p < n.length; p++)
                        if (e.sh[n[p]]) {
                            c = c.concat(Ej());
                            break
                        }
                    var q = Nx[g] || [];
                    q.length && (c = c.concat(q))
                }
            }
            return {
                km: c,
                om: d
            }
        }
        function Px(a) {
            z(Mx, function(b, c) {
                var d = c.indexOf(a);
                0 <= d && c.splice(d, 1)
            })
        }
        function Qx(a) {
            z(Nx, function(b, c) {
                var d = c.indexOf(a);
                0 <= d && c.splice(d, 1)
            })
        }
        var Rx = "HA GF G UA AW DC MC".split(" ")
            , Sx = !1
            , Tx = !1
            , Ux = !1
            , Vx = !1;
        function Wx(a, b) {
            a.hasOwnProperty("gtm.uniqueEventId") || Object.defineProperty(a, "gtm.uniqueEventId", {
                value: xi()
            });
            b.eventId = a["gtm.uniqueEventId"];
            b.priorityId = a["gtm.priorityId"];
            return {
                eventId: b.eventId,
                priorityId: b.priorityId
            }
        }
        var Xx = void 0
            , Yx = void 0;
        function Zx(a, b, c) {
            var d = k(a);
            d.eventId = void 0;
            d.inheritParentConfig = void 0;
            Object.keys(b).some(function(f) {
                return void 0 !== b[f]
            }) && O(136);
            var e = k(b);
            k(c, e);
            Fx(Cx(Bj()[0], e), a.eventId, d)
        }
        function $x(a) {
            for (var b = ma([P.g.md, P.g.Kb]), c = b.next(); !c.done; c = b.next()) {
                var d = c.value
                    , e = a && a[d] || bm.H[d];
                if (e)
                    return e
            }
        }
        var ay = [P.g.md, P.g.Kb, P.g.yc, P.g.lb, P.g.tb, P.g.Da, P.g.xa, P.g.Oa, P.g.Ta, P.g.Db]
            , by = {
            config: function(a, b) {
                var c = Wx(a, b);
                if (!(2 > a.length) && l(a[1])) {
                    var d = {};
                    if (2 < a.length) {
                        if (void 0 != a[2] && !Va(a[2]) || 3 < a.length)
                            return;
                        d = a[2]
                    }
                    var e = Ll(a[1], b.isGtmEvent);
                    if (e) {
                        var f, g, h;
                        a: {
                            if (!zj.je) {
                                var m = Pj(Qj());
                                if (ck(m)) {
                                    var n = m.parent
                                        , p = n.isDestination;
                                    h = {
                                        zm: Pj(n),
                                        jm: p
                                    };
                                    break a
                                }
                            }
                            h = void 0
                        }
                        var q = h;
                        q && (f = q.zm,
                            g = q.jm);
                        Ww(c.eventId, "gtag.config");
                        var t = e.ka
                            , r = e.id !== t;
                        if (r ? -1 === Ej().indexOf(t) : -1 === Bj().indexOf(t)) {
                            if (!b.inheritParentConfig && !d[P.g.Gb]) {
                                var u = $x(d);
                                if (r)
                                    Rv(t, u, {
                                        source: 2,
                                        fromContainerExecution: b.fromContainerExecution
                                    });
                                else if (void 0 !== f && -1 !== f.containers.indexOf(t)) {
                                    var v = d;
                                    Xx ? Zx(b, v, Xx) : Yx || (Yx = k(v))
                                } else
                                    Qv(t, u, !0, {
                                        source: 2,
                                        fromContainerExecution: b.fromContainerExecution
                                    })
                            }
                        } else {
                            if (f && (O(128),
                            g && O(130),
                                b.inheritParentConfig)) {
                                var w;
                                var x = d;
                                Yx ? (Zx(b, Yx, x),
                                    w = !1) : (!x[P.g.Xb] && li && Xx || (Xx = k(x)),
                                    w = !0);
                                w && f.containers && f.containers.join(",");
                                return
                            }
                            var y = d;
                            if (!Ux && (Ux = !0,
                                Tx))
                                for (var B = ma(ay), A = B.next(); !A.done; A = B.next())
                                    if (y.hasOwnProperty(A.value)) {
                                        Kk("erc");
                                        break
                                    }
                            U(82) && nk && (1 === Jx && Bc(G, "pagehide", Kx),
                                Jx = 2);
                            if (li && !r && !d[P.g.Xb]) {
                                var E = Vx;
                                Vx = !0;
                                if (E)
                                    return
                            }
                            Sx || O(43);
                            if (!b.noTargetGroup)
                                if (r) {
                                    Qx(e.id);
                                    var D = e.id
                                        , C = d[P.g.Zd] || "default";
                                    C = String(C).split(",");
                                    for (var F = 0; F < C.length; F++) {
                                        var N = Nx[C[F]] || [];
                                        Nx[C[F]] = N;
                                        0 > N.indexOf(D) && N.push(D)
                                    }
                                } else {
                                    Px(e.id);
                                    var M = e.id
                                        , Q = d[P.g.Zd] || "default";
                                    Q = Q.toString().split(",");
                                    for (var W = 0; W < Q.length; W++) {
                                        var S = Mx[Q[W]] || [];
                                        Mx[Q[W]] = S;
                                        0 > S.indexOf(M) && S.push(M)
                                    }
                                }
                            delete d[P.g.Zd];
                            var R = b.eventMetadata || {};
                            R.hasOwnProperty("is_external_event") || (R.is_external_event = !b.fromContainerExecution);
                            b.eventMetadata = R;
                            delete d[P.g.ed];
                            for (var ia = r ? [e.id] : Ej(), ea = 0; ea < ia.length; ea++) {
                                var ca = d
                                    , Aa = ia[ea]
                                    , na = k(b)
                                    , wa = Ll(Aa, na.isGtmEvent);
                                wa && bm.push("config", [ca], wa, na)
                            }
                        }
                    }
                }
            },
            consent: function(a, b) {
                if (3 === a.length) {
                    O(39);
                    var c = Wx(a, b)
                        , d = a[1]
                        , e = a[2];
                    b.fromContainerExecution || (e[P.g.P] && O(139),
                    e[P.g.Aa] && O(140));
                    "default" === d ? jl(e) : "update" === d ? kl(e, c) : "declare" === d && b.fromContainerExecution && il(e)
                }
            },
            event: function(a, b) {
                var c = a[1];
                if (!(2 > a.length) && l(c)) {
                    var d;
                    if (2 < a.length) {
                        if (!Va(a[2]) && void 0 != a[2] || 3 < a.length)
                            return;
                        d = a[2]
                    }
                    var e = d
                        , f = {}
                        , g = (f.event = c,
                        f);
                    e && (g.eventModel = k(e),
                    e[P.g.ed] && (g.eventCallback = e[P.g.ed]),
                    e[P.g.Wd] && (g.eventTimeout = e[P.g.Wd]));
                    var h = Wx(a, b)
                        , m = h.eventId
                        , n = h.priorityId;
                    g["gtm.uniqueEventId"] = m;
                    n && (g["gtm.priorityId"] = n);
                    if ("optimize.callback" === c)
                        return g.eventModel = g.eventModel || {},
                            g;
                    var p;
                    var q = d
                        , t = q && q[P.g.Wb];
                    void 0 === t && (t = Gi(P.g.Wb, 2),
                    void 0 === t && (t = "default"));
                    if (l(t) || Array.isArray(t)) {
                        var r;
                        r = b.isGtmEvent ? l(t) ? [t] : t : t.toString().replace(/\s+/g, "").split(",");
                        var u = Ox(r, b.isGtmEvent)
                            , v = u.km
                            , w = u.om;
                        if (w.length)
                            for (var x = $x(q), y = 0; y < w.length; y++) {
                                var B = Ll(w[y], b.isGtmEvent);
                                B && Rv(B.ka, x, {
                                    source: 3,
                                    fromContainerExecution: b.fromContainerExecution
                                })
                            }
                        p = Ml(v, b.isGtmEvent)
                    } else
                        p = void 0;
                    var A = p;
                    if (A) {
                        var E;
                        !A.length || (null == (E = b.eventMetadata) ? 0 : E.em_event) || (Tx = !0);
                        Ww(m, c);
                        for (var D = [], C = 0; C < A.length; C++) {
                            var F = A[C]
                                , N = k(b);
                            if (-1 !== Rx.indexOf(Sj(F.prefix))) {
                                var M = k(d)
                                    , Q = N.eventMetadata || {};
                                Q.hasOwnProperty("is_external_event") || (Q.is_external_event = !N.fromContainerExecution);
                                N.eventMetadata = Q;
                                delete M[P.g.ed];
                                dm(c, M, F.id, N);
                                U(82) && nk && 0 === Jx && (Ac(G, "pagehide", Kx),
                                    Jx = 1)
                            }
                            D.push(F.id)
                        }
                        g.eventModel = g.eventModel || {};
                        0 < A.length ? g.eventModel[P.g.Wb] = D.join() : delete g.eventModel[P.g.Wb];
                        Sx || O(43);
                        void 0 === b.noGtmEvent && b.eventMetadata && b.eventMetadata.syn_or_mod && (b.noGtmEvent = !0);
                        g.eventModel[P.g.Ub] && (b.noGtmEvent = !0);
                        return b.noGtmEvent ? void 0 : g
                    }
                }
            },
            get: function(a, b) {
                O(53);
                if (4 === a.length && l(a[1]) && l(a[2]) && ob(a[3])) {
                    var c = Ll(a[1], b.isGtmEvent)
                        , d = String(a[2])
                        , e = a[3];
                    if (c) {
                        Sx || O(43);
                        var f = $x();
                        if (!rb(Ej(), function(h) {
                            return c.ka === h
                        }))
                            Rv(c.ka, f, {
                                source: 4,
                                fromContainerExecution: b.fromContainerExecution
                            });
                        else if (-1 !== Rx.indexOf(Sj(c.prefix))) {
                            Wx(a, b);
                            var g = {};
                            k((g[P.g.qb] = d,
                                g[P.g.Eb] = e,
                                g));
                            em(d, function(h) {
                                I(function() {
                                    return e(h)
                                })
                            }, c.id, b)
                        }
                    }
                }
            },
            js: function(a, b) {
                if (2 == a.length && a[1].getTime) {
                    Sx = !0;
                    var c = Wx(a, b)
                        , d = c.eventId
                        , e = c.priorityId
                        , f = {};
                    return f.event = "gtm.js",
                        f["gtm.start"] = a[1].getTime(),
                        f["gtm.uniqueEventId"] = d,
                        f["gtm.priorityId"] = e,
                        f
                }
            },
            policy: function(a) {
                if (3 === a.length && l(a[1]) && ob(a[2])) {
                    if (Df(a[1], a[2]),
                        O(74),
                    "all" === a[1]) {
                        O(75);
                        var b = !1;
                        try {
                            b = a[2](Gj(), "unknown", {})
                        } catch (c) {}
                        b || O(76)
                    }
                } else
                    O(73)
            },
            set: function(a, b) {
                var c;
                2 == a.length && Va(a[1]) ? c = k(a[1]) : 3 == a.length && l(a[1]) && (c = {},
                    Va(a[2]) || Array.isArray(a[2]) ? c[a[1]] = k(a[2]) : c[a[1]] = a[2]);
                if (c) {
                    var d = Wx(a, b)
                        , e = d.eventId
                        , f = d.priorityId;
                    k(c);
                    var g = k(c);
                    bm.push("set", [g], void 0, b);
                    c["gtm.uniqueEventId"] = e;
                    f && (c["gtm.priorityId"] = f);
                    delete c.event;
                    b.overwriteModelFields = !0;
                    return c
                }
            }
        }
            , cy = {
            policy: !0
        };
        var ey = function(a) {
            if (dy(a))
                return a;
            this.value = a
        };
        ey.prototype.getUntrustedMessageValue = function() {
            return this.value
        }
        ;
        var dy = function(a) {
            return !a || "object" !== Ta(a) || Va(a) ? !1 : "getUntrustedMessageValue"in a
        };
        ey.prototype.getUntrustedMessageValue = ey.prototype.getUntrustedMessageValue;
        var fy = !1
            , gy = [];
        function hy() {
            if (!fy) {
                fy = !0;
                for (var a = 0; a < gy.length; a++)
                    I(gy[a])
            }
        }
        function iy(a) {
            fy ? I(a) : gy.push(a)
        }
        ;var jy = 0
            , ky = {}
            , ly = []
            , my = []
            , ny = !1
            , oy = !1;
        function py(a, b) {
            return a.messageContext.eventId - b.messageContext.eventId || a.messageContext.priorityId - b.messageContext.priorityId
        }
        var qy = function(a) {
            return G[gi.Ya].push(a)
        }
            , ry = function(a, b, c) {
            a.eventCallback = b;
            c && (a.eventTimeout = c);
            return qy(a)
        }
            , sy = function(a, b) {
            if (!pb(b) || 0 > b)
                b = 0;
            var c = hi[gi.Ya]
                , d = 0
                , e = !1
                , f = void 0;
            f = G.setTimeout(function() {
                e || (e = !0,
                    a());
                f = void 0
            }, b);
            return function() {
                var g = c ? c.subscribers : 1;
                ++d === g && (f && (G.clearTimeout(f),
                    f = void 0),
                e || (a(),
                    e = !0))
            }
        };
        function ty(a, b) {
            var c = a._clear || b.overwriteModelFields;
            z(a, function(e, f) {
                "_clear" !== e && (c && Ji(e),
                    Ji(e, f))
            });
            ti || (ti = a["gtm.start"]);
            var d = a["gtm.uniqueEventId"];
            if (!a.event)
                return !1;
            "number" !== typeof d && (d = xi(),
                a["gtm.uniqueEventId"] = d,
                Ji("gtm.uniqueEventId", d));
            return zx(a)
        }
        function uy(a) {
            if (null == a || "object" !== typeof a)
                return !1;
            if (a.event)
                return !0;
            if (vb(a)) {
                var b = a[0];
                if ("config" === b || "event" === b || "js" === b || "get" === b)
                    return !0
            }
            return !1
        }
        function vy() {
            var a;
            if (my.length)
                a = my.shift();
            else if (ly.length)
                a = ly.shift();
            else
                return;
            var b;
            var c = a;
            if (ny || !uy(c.message))
                b = c;
            else {
                ny = !0;
                var d = c.message["gtm.uniqueEventId"];
                "number" !== typeof d && (d = c.message["gtm.uniqueEventId"] = xi());
                var e = {}
                    , f = {
                    message: (e.event = "gtm.init_consent",
                        e["gtm.uniqueEventId"] = d - 2,
                        e),
                    messageContext: {
                        eventId: d - 2
                    }
                }
                    , g = {}
                    , h = {
                    message: (g.event = "gtm.init",
                        g["gtm.uniqueEventId"] = d - 1,
                        g),
                    messageContext: {
                        eventId: d - 1
                    }
                };
                ly.unshift(h, c);
                if (nk) {
                    var m = Gf.ctid;
                    if (m) {
                        var n, p = Pj(Qj());
                        n = p && p.context;
                        var q = U(66) ? Rm(!0) : void 0
                            , t = Gf.canonicalContainerId
                            , r = lj(G.location.href)
                            , u = r.hostname + r.pathname
                            , v = n && n.fromContainerExecution
                            , w = zj.je
                            , x = n && n.source;
                        nk && (Ck || (Ck = u),
                            Ek.push(m + ";" + t + ";" + (v ? 1 : 0) + ";" + (x || 0) + ";" + (w ? 1 : 0)),
                            Dk = q)
                    }
                }
                b = f
            }
            return b
        }
        function wy() {
            for (var a = !1, b; !oy && (b = vy()); ) {
                oy = !0;
                delete Di.eventModel;
                Fi();
                var c = b
                    , d = c.message
                    , e = c.messageContext;
                if (null == d)
                    oy = !1;
                else {
                    e.fromContainerExecution && Ki();
                    try {
                        if (ob(d))
                            try {
                                d.call(Hi)
                            } catch (v) {}
                        else if (Array.isArray(d)) {
                            var f = d;
                            if (l(f[0])) {
                                var g = f[0].split(".")
                                    , h = g.pop()
                                    , m = f.slice(1)
                                    , n = Gi(g.join("."), 2);
                                if (null != n)
                                    try {
                                        n[h].apply(n, m)
                                    } catch (v) {}
                            }
                        } else {
                            var p = void 0;
                            if (vb(d))
                                a: {
                                    if (d.length && l(d[0])) {
                                        var q = by[d[0]];
                                        if (q && (!e.fromContainerExecution || !cy[d[0]])) {
                                            p = q(d, e);
                                            break a
                                        }
                                    }
                                    p = void 0
                                }
                            else
                                p = d;
                            p && (a = ty(p, e) || a)
                        }
                    } finally {
                        e.fromContainerExecution && Fi(!0);
                        var t = d["gtm.uniqueEventId"];
                        if ("number" === typeof t) {
                            for (var r = ky[String(t)] || [], u = 0; u < r.length; u++)
                                my.push(xy(r[u]));
                            r.length && my.sort(py);
                            delete ky[String(t)];
                            t > jy && (jy = t)
                        }
                        oy = !1
                    }
                }
            }
            return !a
        }
        function yy() {
            if (U(57)) {
                var a = zy();
            }
            var b = wy();
            if (U(57)) {}
            try {
                var c = Gj()
                    , d = G[gi.Ya].hide;
                if (d && void 0 !== d[c] && d.end) {
                    d[c] = !1;
                    var e = !0, f;
                    for (f in d)
                        if (d.hasOwnProperty(f) && !0 === d[f]) {
                            e = !1;
                            break
                        }
                    e && (d.end(),
                        d.end = null)
                }
            } catch (g) {}
            return b
        }
        function Ix(a) {
            if (jy < a.notBeforeEventId) {
                var b = String(a.notBeforeEventId);
                ky[b] = ky[b] || [];
                ky[b].push(a)
            } else
                my.push(xy(a)),
                    my.sort(py),
                    I(function() {
                        oy || wy()
                    })
        }
        function xy(a) {
            return {
                message: a.message,
                messageContext: a.messageContext
            }
        }
        var Ay = function() {
            function a(f) {
                var g = {};
                if (dy(f)) {
                    var h = f;
                    f = dy(h) ? h.getUntrustedMessageValue() : void 0;
                    g.fromContainerExecution = !0
                }
                return {
                    message: f,
                    messageContext: g
                }
            }
            var b = rc(gi.Ya, [])
                , c = hi[gi.Ya] = hi[gi.Ya] || {};
            !0 === c.pruned && O(83);
            ky = Gx().get();
            Hx();
            Xv(function() {
                if (!c.gtmDom) {
                    c.gtmDom = !0;
                    var f = {};
                    b.push((f.event = "gtm.dom",
                        f))
                }
            });
            iy(function() {
                if (!c.gtmLoad) {
                    c.gtmLoad = !0;
                    var f = {};
                    b.push((f.event = "gtm.load",
                        f))
                }
            });
            c.subscribers = (c.subscribers || 0) + 1;
            var d = b.push;
            b.push = function() {
                var f;
                if (0 < hi.SANDBOXED_JS_SEMAPHORE) {
                    f = [];
                    for (var g = 0; g < arguments.length; g++)
                        f[g] = new ey(arguments[g])
                } else
                    f = [].slice.call(arguments, 0);
                var h = f.map(function(q) {
                    return a(q)
                });
                ly.push.apply(ly, h);
                var m = d.apply(b, f)
                    , n = Math.max(100, Number("1000") || 300);
                if (this.length > n)
                    for (O(4),
                             c.pruned = !0; this.length > n; )
                        this.shift();
                var p = "boolean" !== typeof m || m;
                return wy() && p
            }
            ;
            var e = b.slice(0).map(function(f) {
                return a(f)
            });
            ly.push.apply(ly, e);
            if (zy()) {
                if (U(57)) {}
                I(yy)
            }
        }
            , zy = function() {
            var a = !0;
            return a
        };
        function By(a) {
            if (null == a || 0 === a.length)
                return !1;
            var b = Number(a)
                , c = Cb();
            return b < c + 3E5 && b > c - 9E5
        }
        function Cy(a) {
            return a && 0 === a.indexOf("pending:") ? By(a.substr(8)) : !1
        }
        ;
        var Xy = function() {};
        var Yy = function() {};
        Yy.prototype.toString = function() {
            return "undefined"
        }
        ;
        var Zy = new Yy;
        function fz(a, b) {
            function c(g) {
                var h = lj(g)
                    , m = hj(h, "protocol")
                    , n = hj(h, "host", !0)
                    , p = hj(h, "port")
                    , q = hj(h, "path").toLowerCase().replace(/\/$/, "");
                if (void 0 === m || "http" === m && "80" === p || "https" === m && "443" === p)
                    m = "web",
                        p = "default";
                return [m, n, p, q]
            }
            for (var d = c(String(a)), e = c(String(b)), f = 0; f < d.length; f++)
                if (d[f] !== e[f])
                    return !1;
            return !0
        }
        function gz(a) {
            return hz(a) ? 1 : 0
        }
        function hz(a) {
            var b = a.arg0
                , c = a.arg1;
            if (a.any_of && Array.isArray(c)) {
                for (var d = 0; d < c.length; d++) {
                    var e = k(a, {});
                    k({
                        arg1: c[d],
                        any_of: void 0
                    }, e);
                    if (gz(e))
                        return !0
                }
                return !1
            }
            switch (a["function"]) {
                case "_cn":
                    return ig(b, c);
                case "_css":
                    var f;
                    a: {
                        if (b)
                            try {
                                for (var g = 0; g < eg.length; g++) {
                                    var h = eg[g];
                                    if (b[h]) {
                                        f = b[h](c);
                                        break a
                                    }
                                }
                            } catch (m) {}
                        f = !1
                    }
                    return f;
                case "_ew":
                    return fg(b, c);
                case "_eq":
                    return jg(b, c);
                case "_ge":
                    return kg(b, c);
                case "_gt":
                    return mg(b, c);
                case "_lc":
                    return 0 <= String(b).split(",").indexOf(String(c));
                case "_le":
                    return lg(b, c);
                case "_lt":
                    return ng(b, c);
                case "_re":
                    return hg(b, c, a.ignore_case);
                case "_sw":
                    return og(b, c);
                case "_um":
                    return fz(b, c)
            }
            return !1
        }
        ;function iz() {
            var a;
            a = void 0 === a ? "" : a;
            var b, c;
            return (null == (b = data) ? 0 : null == (c = b.blob) ? 0 : c.hasOwnProperty(1)) ? String(data.blob[1]) : a
        }
        ;function jz() {
            var a = [["cv", U(77) ? iz() : "1"], ["rv", gi.Qg], ["tc", bf.filter(function(b) {
                return b
            }).length]];
            gi.ne && a.push(["x", gi.ne]);
            zi.m && a.push(["tag_exp", zi.m]);
            return a
        }
        ;function kz() {
            var a = Xi();
            return a.length ? [["exp_geo", a]] : []
        }
        var lz;
        function mz() {
            try {
                null != lz || (lz = (new Intl.DateTimeFormat).resolvedOptions().timeZone)
            } catch (b) {}
            var a;
            return (null == (a = lz) ? 0 : a.length) ? [["exp_tz", lz]] : []
        }
        ;var nz = !1
            , oz = function(a) {
                if (nz)
                    return [];
                var b = []
                    , c = Oj();
                if (c) {
                    var d, e = c.canonicalContainerId || "_" + (c.scriptContainerId || (null == (d = c.destinations) ? void 0 : d[0]));
                    b.push(["pcid", e])
                }
                a.Xa && (nz = !0,
                b.length && a.Nc());
                return b
            };
        function pz(a) {
            if (a.scriptSource) {
                var b;
                try {
                    var c;
                    b = null == (c = Mc()) ? void 0 : c.getEntriesByType("resource")
                } catch (h) {}
                if (b) {
                    for (var d = {}, e = 0; e < b.length; ++e) {
                        var f = b[e]
                            , g = f.initiatorType;
                        if ("script" === g && f.name === a.scriptSource)
                            return {
                                Km: e,
                                Lm: d
                            };
                        d[g] = 1 + (d[g] || 0)
                    }
                    O(146)
                } else
                    O(145)
            }
        }
        function qz() {
            if (nk && U(65)) {
                var a = Rj();
                if (!a)
                    O(144);
                else if (a.canonicalContainerId) {
                    var b = pz(a);
                    if (b) {
                        var c = !1;
                        ik(function(d) {
                            if (c)
                                return [];
                            d.Xa && (c = !0);
                            d.Nc();
                            return [["rtg", String(a.canonicalContainerId)], ["rlo", String(b.Km)], ["slo", String(b.Lm.script || "0")]]
                        })
                    }
                }
            }
        }
        ;function rz() {
            return !1
        }
        function sz() {
            var a = {};
            return function(b, c, d) {}
        }
        ;function tz() {
            var a = uz;
            return function(b, c, d) {
                var e = d && d.event;
                vz(c);
                var f = 0 === b.indexOf("__cvt_") ? void 0 : 1
                    , g = new ab;
                z(c, function(t, r) {
                    var u = ad(r, void 0, f);
                    void 0 === u && void 0 !== r && O(44);
                    g.set(t, u)
                });
                a.m.m.F = wf();
                var h = {
                    Gj: Kf(b),
                    eventId: null == e ? void 0 : e.id,
                    priorityId: void 0 !== e ? e.priorityId : void 0,
                    qe: void 0 !== e ? function(t) {
                            e.bc.qe(t)
                        }
                        : void 0,
                    hc: function() {
                        return b
                    },
                    log: function() {},
                    Cl: {
                        index: null == d ? void 0 : d.index,
                        type: null == d ? void 0 : d.type,
                        name: null == d ? void 0 : d.name
                    },
                    Jm: !!Bv(b, 3),
                    originalEventData: null == e ? void 0 : e.originalEventData
                };
                e && e.cachedModelValues && (h.cachedModelValues = {
                    gtm: e.cachedModelValues.gtm,
                    ecommerce: e.cachedModelValues.ecommerce
                });
                if (rz()) {
                    var m = sz(), n, p;
                    h.Qa = {
                        Uh: [],
                        se: {},
                        wb: function(t, r, u) {
                            1 === r && (n = t);
                            7 === r && (p = u);
                            m(t, r, u)
                        },
                        Of: $g()
                    };
                    h.log = function(t) {
                        var r = za.apply(1, arguments);
                        n && m(n, 4, {
                            level: t,
                            source: p,
                            message: r
                        })
                    }
                }
                var q = ye(a, h, [b, g]);
                a.m.m.F = void 0;
                q instanceof Ga && "return" === q.type && (q = q.data);
                return J(q, void 0, f)
            }
        }
        function vz(a) {
            var b = a.gtmOnSuccess
                , c = a.gtmOnFailure;
            ob(b) && (a.gtmOnSuccess = function() {
                    I(b)
                }
            );
            ob(c) && (a.gtmOnFailure = function() {
                    I(c)
                }
            )
        }
        ;function wz(a, b) {
            var c = this;
        }
        wz.U = "addConsentListener";
        var xz = !1;
        function yz(a) {
            for (var b = 0; b < a.length; ++b)
                if (xz)
                    try {
                        a[b]()
                    } catch (c) {
                        O(77)
                    }
                else
                    a[b]()
        }
        function zz(a, b, c) {
            var d = this, e;
            K(this.getName(), ["eventName:!string", "callback:!Fn", "triggerId:?string"], arguments),
                yz([function() {
                    return L(d, "listen_data_layer", a)
                }
                ]),
                e = ux().addListener(a, J(b), c);
            return e
        }
        zz.K = "internal.addDataLayerEventListener";
        function Az(a, b, c) {}
        Az.U = "addDocumentEventListener";
        function Bz(a, b, c, d) {}
        Bz.U = "addElementEventListener";
        function Cz(a) {
            return a.J.m
        }
        ;function Dz(a) {}
        Dz.U = "addEventCallback";
        var Ez = function(a) {
            return "string" === typeof a ? a : String(xi())
        }
            , Hz = function(a, b) {
            Fz(a, "init", !1) || (Gz(a, "init", !0),
                b())
        }
            , Fz = function(a, b, c) {
            var d = Iz(a);
            return Db(d, b, c)
        }
            , Jz = function(a, b, c, d) {
            var e = Iz(a)
                , f = Db(e, b, d);
            e[b] = c(f)
        }
            , Gz = function(a, b, c) {
            Iz(a)[b] = c
        }
            , Iz = function(a) {
            hi.hasOwnProperty("autoEventsSettings") || (hi.autoEventsSettings = {});
            var b = hi.autoEventsSettings;
            b.hasOwnProperty(a) || (b[a] = {});
            return b[a]
        }
            , Kz = function(a, b, c) {
            var d = {
                event: b,
                "gtm.element": a,
                "gtm.elementClasses": Kc(a, "className"),
                "gtm.elementId": a["for"] || Cc(a, "id") || "",
                "gtm.elementTarget": a.formTarget || Kc(a, "target") || ""
            };
            c && (d["gtm.triggers"] = c.join(","));
            d["gtm.elementUrl"] = (a.attributes && a.attributes.formaction ? a.formAction : "") || a.action || Kc(a, "href") || a.src || a.code || a.codebase || "";
            return d
        };
        function Tz(a) {}
        Tz.K = "internal.addFormAbandonmentListener";
        function Uz(a, b, c, d) {}
        Uz.K = "internal.addFormData";
        var Vz = {}
            , Wz = []
            , Xz = {}
            , Yz = 0
            , Zz = 0;
        function fA(a, b) {}
        fA.K = "internal.addFormInteractionListener";
        function mA(a, b) {}
        mA.K = "internal.addFormSubmitListener";
        function rA(a) {}
        rA.K = "internal.addGaSendListener";
        function sA(a) {
            if (!a)
                return {};
            var b = a.Cl;
            return Zv(b.type, b.index, b.name)
        }
        function tA(a) {
            return a ? {
                originatingEntity: sA(a)
            } : {}
        }
        ;function BA(a) {
            var b = hi.zones;
            return b ? b.getIsAllowedFn(Bj(), a) : function() {
                return !0
            }
        }
        function CA() {
            Ev(Ij(), function(a) {
                var b = a.originalEventData["gtm.uniqueEventId"]
                    , c = hi.zones;
                return c ? c.isActive(Bj(), b) : !0
            });
            Cv(Ij(), function(a) {
                var b = a.entityId
                    , c = a.securityGroups;
                return BA(Number(a.originalEventData["gtm.uniqueEventId"]))(b, c)
            })
        }
        ;var DA = function(a, b) {
            this.tagId = a;
            this.ue = b
        };
        function EA(a, b) {
            var c = this, d;
            return d
        }
        EA.K = "internal.loadGoogleTag";
        function FA(a) {
            return new Tc("",function(b) {
                    var c = this.evaluate(b);
                    if (c instanceof Tc)
                        return new Tc("",function() {
                                var d = za.apply(0, arguments)
                                    , e = this
                                    , f = k(Cz(this), null);
                                f.eventId = a.eventId;
                                f.priorityId = a.priorityId;
                                f.originalEventData = a.originalEventData;
                                var g = d.map(function(m) {
                                    return e.evaluate(m)
                                })
                                    , h = La(this.J);
                                h.m = f;
                                return c.fb.apply(c, [h].concat(pa(g)))
                            }
                        )
                }
            )
        }
        ;function GA(a, b, c) {
            var d = this;
        }
        GA.K = "internal.addGoogleTagRestriction";
        var HA = {}
            , IA = [];
        function PA(a, b) {}
        PA.K = "internal.addHistoryChangeListener";
        function QA(a, b, c) {}
        QA.U = "addWindowEventListener";
        function RA(a, b) {
            return !0
        }
        RA.U = "aliasInWindow";
        function SA(a, b, c) {}
        SA.K = "internal.appendRemoteConfigParameter";
        function TA() {
            var a = 2;
            return a
        }
        ;function UA(a) {
            var b;
            return b
        }
        UA.U = "callInWindow";
        function VA(a) {}
        VA.U = "callLater";
        function WA(a) {}
        WA.K = "callOnDomReady";
        function XA(a) {}
        XA.K = "callOnWindowLoad";
        function YA(a, b) {
            var c;
            return c
        }
        YA.K = "internal.computeGtmParameter";
        function ZA(a) {
            var b;
            return b
        }
        ZA.K = "internal.copyFromCrossContainerData";
        function $A(a, b) {
            var c;
            var d = ad(c, this.J, TA());
            void 0 === d && void 0 !== c && O(45);
            return d
        }
        $A.U = "copyFromDataLayer";
        function aB(a) {
            var b = void 0;
            return b
        }
        aB.K = "internal.copyFromDataLayerCache";
        function bB(a) {
            var b;
            return b
        }
        bB.U = "copyFromWindow";
        function cB(a) {
            var b = void 0;
            return ad(b, this.J, TA())
        }
        cB.K = "internal.copyKeyFromWindow";
        function dB(a, b) {
            var c;
            K(this.getName(), ["preHit:!PixieMap", "dustOptions:?PixieMap"], arguments);
            var d = J(b) || {}
                , e = J(a, this.J, 1).Mj()
                , f = e.o;
            d.omitEventContext && (f = Il(new xl(e.o.eventId,e.o.priorityId)));
            var g = new yq(e.target,e.eventName,f);
            d.omitHitData || k(e.D, g.D);
            d.omitMetadata ? g.metadata = {} : k(e.metadata, g.metadata);
            g.isAborted = e.isAborted;
            c = ad(xr(g), this.J, 1);
            return c
        }
        dB.K = "internal.copyPreHit";
        function eB(a, b) {
            var c = null
                , d = TA();
            return ad(c, this.J, d)
        }
        eB.U = "createArgumentsQueue";
        function fB(a) {
            return ad(function(c) {
                var d = iw();
                if ("function" === typeof c)
                    d(function() {
                        c(function(f, g, h) {
                            var m = iw()
                                , n = m && m.getByName && m.getByName(f);
                            return nm(G.gaplugins.Linker, n).decorate(g, h)
                        })
                    });
                else if (Array.isArray(c)) {
                    var e = String(c[0]).split(".");
                    b[1 === e.length ? e[0] : e[1]] && d.apply(null, c)
                } else if ("isLoaded" === c)
                    return !!d.loaded
            }, this.J, 1)
        }
        fB.K = "internal.createGaCommandQueue";
        function gB(a) {
            return ad(function() {
                if (!ob(e.push))
                    throw Error("Object at " + a + " in window is not an array.");
                e.push.apply(e, Array.prototype.slice.call(arguments, 0))
            }, this.J, TA())
        }
        gB.U = "createQueue";
        function hB(a, b) {
            var c = null;
            return c
        }
        hB.K = "internal.createRegex";
        function iB() {
            var a = {};
            return a
        }
        ;function jB(a) {}
        jB.K = "internal.declareConsentState";
        function kB(a) {
            var b = "";
            return b
        }
        kB.K = "internal.decodeUrlHtmlEntities";
        function lB(a, b, c) {
            var d;
            return d
        }
        lB.K = "internal.decorateUrlWithGaCookies";
        function mB(a) {
            var b;
            return b
        }
        mB.K = "internal.detectUserProvidedData";
        function qB(a, b) {
            return b
        }
        qB.K = "internal.enableAutoEventOnClick";
        var sB = function(a) {
            if (rB)
                for (var b = 0; b < rB.length; b++)
                    rB[b] === a && rB.splice(b, 1)
        }, uB = function(a) {
            if (!rB) {
                var b = function() {
                    var c = H.body;
                    if (c)
                        if (tB)
                            (new MutationObserver(function() {
                                    for (var e = 0; e < rB.length; e++)
                                        I(rB[e])
                                }
                            )).observe(c, {
                                childList: !0,
                                subtree: !0
                            });
                        else {
                            var d = !1;
                            Ac(c, "DOMNodeInserted", function() {
                                d || (d = !0,
                                    I(function() {
                                        d = !1;
                                        for (var e = 0; e < rB.length; e++)
                                            I(rB[e])
                                    }))
                            })
                        }
                };
                rB = [];
                H.body ? b() : I(b)
            }
            rB.push(a)
        }, tB = !!G.MutationObserver, rB;
        function zB(a, b) {
            return b
        }
        zB.K = "internal.enableAutoEventOnElementVisibility";
        function AB() {}
        AB.K = "internal.enableAutoEventOnError";
        var BB = {}
            , CB = []
            , DB = {}
            , EB = 0
            , FB = 0;
        function LB(a, b) {
            var c = this;
            return b
        }
        LB.K = "internal.enableAutoEventOnFormInteraction";
        function QB(a, b) {
            var c = this;
            return b
        }
        QB.K = "internal.enableAutoEventOnFormSubmit";
        function VB() {
            var a = this;
        }
        VB.K = "internal.enableAutoEventOnGaSend";
        var WB = {}
            , XB = [];
        var ZB = function(a, b) {
            var c = "" + b;
            if (WB[c])
                WB[c].push(a);
            else {
                var d = [a];
                WB[c] = d;
                var e = YB("gtm.historyChange-v2")
                    , f = -1;
                XB.push(function(g) {
                    0 <= f && G.clearTimeout(f);
                    b ? f = G.setTimeout(function() {
                        e(g, d);
                        f = -1
                    }, b) : e(g, d)
                })
            }
        }
            , YB = function(a) {
            var b = G.location.href
                , c = {
                source: null,
                state: G.history.state || null,
                url: ij(lj(b)),
                X: hj(lj(b), "fragment")
            };
            return function(d, e) {
                var f = c
                    , g = {};
                g[f.source] = !0;
                g[d.source] = !0;
                if (!g.popstate || !g.hashchange || f.X != d.X) {
                    var h = {
                        event: a,
                        "gtm.historyChangeSource": d.source,
                        "gtm.oldUrlFragment": c.X,
                        "gtm.newUrlFragment": d.X,
                        "gtm.oldHistoryState": c.state,
                        "gtm.newHistoryState": d.state,
                        "gtm.oldUrl": c.url,
                        "gtm.newUrl": d.url
                    };
                    e && (h["gtm.triggers"] = e.join(","));
                    c = d;
                    qy(h)
                }
            }
        }
            , $B = function(a, b) {
            var c = G.history
                , d = c[a];
            if (ob(d))
                try {
                    c[a] = function(e, f, g) {
                        d.apply(c, [].slice.call(arguments, 0));
                        var h = G.location.href;
                        b({
                            source: a,
                            state: e,
                            url: ij(lj(h)),
                            X: hj(lj(h), "fragment")
                        })
                    }
                } catch (e) {}
        }
            , bC = function(a) {
            G.addEventListener("popstate", function(b) {
                var c = aC(b);
                a({
                    source: "popstate",
                    state: b.state,
                    url: ij(lj(c)),
                    X: hj(lj(c), "fragment")
                })
            })
        }
            , cC = function(a) {
            G.addEventListener("hashchange", function(b) {
                var c = aC(b);
                a({
                    source: "hashchange",
                    state: null,
                    url: ij(lj(c)),
                    X: hj(lj(c), "fragment")
                })
            })
        }
            , aC = function(a) {
            var b, c;
            return (null == (b = a.target) ? void 0 : null == (c = b.location) ? void 0 : c.href) || G.location.href
        };
        function dC(a, b) {
            var c = this;
            K(this.getName(), ["options:?PixieMap", "triggerId:?*"], arguments);
            yz([function() {
                return L(c, "detect_history_change_events")
            }
            ]);
            var d = a && a.get("useV2EventName") ? "ehl" : "hl"
                , e = Number(a && a.get("interval"));
            0 < e && isFinite(e) || (e = 0);
            if (!Fz(d, "init", !1)) {
                var f;
                "ehl" === d ? (f = function(h) {
                    for (var m = 0; m < XB.length; m++)
                        XB[m](h)
                }
                    ,
                    b = Ez(b),
                    ZB(b, e),
                    Gz(d, "reg", ZB)) : f = YB("gtm.historyChange");
                cC(f);
                bC(f);
                $B("pushState", f);
                $B("replaceState", f);
                Gz(d, "init", !0)
            } else if ("ehl" === d) {
                var g = Fz(d, "reg");
                g && (b = Ez(b),
                    g(b, e))
            }
            "hl" === d && (b = void 0);
            return b
        }
        dC.K = "internal.enableAutoEventOnHistoryChange";
        var eC = ["http://", "https://", "javascript:", "file://"];
        var fC = function(a, b) {
            if (2 === a.which || a.ctrlKey || a.shiftKey || a.altKey || a.metaKey)
                return !1;
            var c = Kc(b, "href");
            if (-1 !== c.indexOf(":") && !eC.some(function(h) {
                return 0 === c.indexOf(h)
            }))
                return !1;
            var d = c.indexOf("#")
                , e = Kc(b, "target");
            if (e && "_self" !== e && "_parent" !== e && "_top" !== e || 0 === d)
                return !1;
            if (0 < d) {
                var f = ij(lj(c))
                    , g = ij(lj(G.location.href));
                return f !== g
            }
            return !0
        }
            , gC = function(a, b) {
            for (var c = hj(lj((b.attributes && b.attributes.formaction ? b.formAction : "") || b.action || Kc(b, "href") || b.src || b.code || b.codebase || ""), "host"), d = 0; d < a.length; d++)
                try {
                    if ((new RegExp(a[d])).test(c))
                        return !1
                } catch (e) {}
            return !0
        }
            , hC = function() {
            var a = 0
                , b = function(c) {
                var d = c.target;
                if (d && 3 !== c.which && !(c.wh || c.timeStamp && c.timeStamp === a)) {
                    a = c.timeStamp;
                    d = Fc(d, ["a", "area"], 100);
                    if (!d)
                        return c.returnValue;
                    var e = c.defaultPrevented || !1 === c.returnValue, f = Fz("lcl", e ? "nv.mwt" : "mwt", 0), g;
                    g = e ? Fz("lcl", "nv.ids", []) : Fz("lcl", "ids", []);
                    for (var h = [], m = 0; m < g.length; m++) {
                        var n = g[m]
                            , p = Fz("lcl", "aff.map", {})[n];
                        p && !gC(p, d) || h.push(n)
                    }
                    if (h.length) {
                        var q = fC(c, d)
                            , t = Kz(d, "gtm.linkClick", h);
                        t["gtm.elementText"] = Dc(d);
                        t["gtm.willOpenInNewWindow"] = !q;
                        if (q && !e && f && d.href) {
                            var r = !!rb(String(Kc(d, "rel") || "").split(" "), function(x) {
                                return "noreferrer" === x.toLowerCase()
                            })
                                , u = G[(Kc(d, "target") || "_self").substring(1)]
                                , v = !0
                                , w = sy(function() {
                                var x;
                                if (x = v && u) {
                                    var y;
                                    a: if (r) {
                                        var B;
                                        try {
                                            B = new MouseEvent(c.type,{
                                                bubbles: !0
                                            })
                                        } catch (A) {
                                            if (!H.createEvent) {
                                                y = !1;
                                                break a
                                            }
                                            B = H.createEvent("MouseEvents");
                                            B.initEvent(c.type, !0, !0)
                                        }
                                        B.wh = !0;
                                        c.target.dispatchEvent(B);
                                        y = !0
                                    } else
                                        y = !1;
                                    x = !y
                                }
                                x && (u.location.href = Kc(d, "href"))
                            }, f);
                            if (ry(t, w, f))
                                v = !1;
                            else
                                return c.preventDefault && c.preventDefault(),
                                    c.returnValue = !1
                        } else
                            ry(t, function() {}, f || 2E3);
                        return !0
                    }
                }
            };
            Ac(H, "click", b, !1);
            Ac(H, "auxclick", b, !1)
        };
        function iC(a, b) {
            var c = this;
            K(this.getName(), ["dustOptions:?PixieMap", "triggerId:?*"], arguments);
            var d = J(a);
            yz([function() {
                return L(c, "detect_link_click_events", d)
            }
            ]);
            var e = d && !!d.waitForTags
                , f = d && !!d.checkValidation
                , g = d ? d.affiliateDomains : void 0;
            b = Ez(b);
            if (e) {
                var h = Number(d.waitForTagsTimeout);
                0 < h && isFinite(h) || (h = 2E3);
                var m = function(p) {
                    return Math.max(h, p)
                };
                Jz("lcl", "mwt", m, 0);
                f || Jz("lcl", "nv.mwt", m, 0)
            }
            var n = function(p) {
                p.push(b);
                return p
            };
            Jz("lcl", "ids", n, []);
            f || Jz("lcl", "nv.ids", n, []);
            g && Jz("lcl", "aff.map", function(p) {
                p[b] = g;
                return p
            }, {});
            Fz("lcl", "init", !1) || (hC(),
                Gz("lcl", "init", !0));
            return b
        }
        iC.K = "internal.enableAutoEventOnLinkClick";
        var jC, kC;
        var lC = function(a) {
            return Fz("sdl", a, {})
        }
            , mC = function(a, b, c) {
            if (b) {
                var d = Array.isArray(a) ? a : [a];
                Jz("sdl", c, function(e) {
                    for (var f = 0; f < d.length; f++) {
                        var g = String(d[f]);
                        e.hasOwnProperty(g) || (e[g] = []);
                        e[g].push(b)
                    }
                    return e
                }, {})
            }
        }
            , pC = function() {
            function a() {
                nC();
                oC(a, !0)
            }
            return a
        }
            , qC = function() {
            function a() {
                f ? e = G.setTimeout(a, c) : (e = 0,
                    nC(),
                    oC(b));
                f = !1
            }
            function b() {
                d && jC();
                e ? f = !0 : (e = G.setTimeout(a, c),
                    Gz("sdl", "pending", !0))
            }
            var c = 250
                , d = !1;
            H.scrollingElement && H.documentElement && (c = 50,
                d = !0);
            var e = 0
                , f = !1;
            return b
        }
            , oC = function(a, b) {
            Fz("sdl", "init", !1) && !rC() && (b ? Bc(G, "scrollend", a) : Bc(G, "scroll", a),
                Bc(G, "resize", a),
                Gz("sdl", "init", !1))
        }
            , nC = function() {
            var a = jC()
                , b = a.fh
                , c = a.gh
                , d = b / kC.scrollWidth * 100
                , e = c / kC.scrollHeight * 100;
            sC(b, "horiz.pix", "PIXELS", "horizontal");
            sC(d, "horiz.pct", "PERCENT", "horizontal");
            sC(c, "vert.pix", "PIXELS", "vertical");
            sC(e, "vert.pct", "PERCENT", "vertical");
            Gz("sdl", "pending", !1)
        }
            , sC = function(a, b, c, d) {
            var e = lC(b), f = {}, g;
            for (g in e)
                if (f = {
                    Dd: f.Dd
                },
                    f.Dd = g,
                    e.hasOwnProperty(f.Dd)) {
                    var h = Number(f.Dd);
                    if (!(a < h)) {
                        var m = {};
                        qy((m.event = "gtm.scrollDepth",
                            m["gtm.scrollThreshold"] = h,
                            m["gtm.scrollUnits"] = c.toLowerCase(),
                            m["gtm.scrollDirection"] = d,
                            m["gtm.triggers"] = e[f.Dd].join(","),
                            m));
                        Jz("sdl", b, function(n) {
                            return function(p) {
                                delete p[n.Dd];
                                return p
                            }
                        }(f), {})
                    }
                }
        }
            , uC = function() {
            Jz("sdl", "scr", function(a) {
                a || (a = H.scrollingElement || H.body && H.body.parentNode);
                return kC = a
            }, !1);
            Jz("sdl", "depth", function(a) {
                a || (a = tC());
                return jC = a
            }, !1)
        }
            , tC = function() {
            var a = 0
                , b = 0;
            return function() {
                var c = Gr()
                    , d = c.height;
                a = Math.max(kC.scrollLeft + c.width, a);
                b = Math.max(kC.scrollTop + d, b);
                return {
                    fh: a,
                    gh: b
                }
            }
        }
            , rC = function() {
            return !!(Object.keys(lC("horiz.pix")).length || Object.keys(lC("horiz.pct")).length || Object.keys(lC("vert.pix")).length || Object.keys(lC("vert.pct")).length)
        };
        function vC(a, b) {
            var c = this;
            K(this.getName(), ["options:!PixieMap", "triggerId:?*"], arguments);
            yz([function() {
                L(c, "detect_scroll_events")
            }
            ]);
            uC();
            if (!kC)
                return;
            b = Ez(b);
            var d = J(a);
            switch (d.horizontalThresholdUnits) {
                case "PIXELS":
                    mC(d.horizontalThresholds, b, "horiz.pix");
                    break;
                case "PERCENT":
                    mC(d.horizontalThresholds, b, "horiz.pct")
            }
            switch (d.verticalThresholdUnits) {
                case "PIXELS":
                    mC(d.verticalThresholds, b, "vert.pix");
                    break;
                case "PERCENT":
                    mC(d.verticalThresholds, b, "vert.pct")
            }
            Fz("sdl", "init", !1) ? Fz("sdl", "pending", !1) || I(function() {
                nC()
            }) : (Gz("sdl", "init", !0),
                Gz("sdl", "pending", !0),
                I(function() {
                    nC();
                    if (rC()) {
                        var e = qC();
                        "onscrollend"in G ? (e = pC(),
                            Ac(G, "scrollend", e)) : Ac(G, "scroll", e);
                        Ac(G, "resize", e)
                    } else
                        Gz("sdl", "init", !1)
                }));
            return b
        }
        vC.K = "internal.enableAutoEventOnScroll";
        function wC(a) {
            return function() {
                if (a.Hc && a.Jc >= a.Hc)
                    a.ic && G.clearInterval(a.ic);
                else {
                    a.Jc++;
                    var b = Cb();
                    qy({
                        event: a.eventName,
                        "gtm.timerId": a.ic,
                        "gtm.timerEventNumber": a.Jc,
                        "gtm.timerInterval": a.interval,
                        "gtm.timerLimit": a.Hc,
                        "gtm.timerStartTime": a.Se,
                        "gtm.timerCurrentTime": b,
                        "gtm.timerElapsedTime": b - a.Se,
                        "gtm.triggers": a.Wh
                    })
                }
            }
        }
        function xC(a, b) {
            return b
        }
        xC.K = "internal.enableAutoEventOnTimer";
        var yC = function(a, b, c) {
            function d() {
                var g = a();
                f += e ? (Cb() - e) * g.playbackRate / 1E3 : 0;
                e = Cb()
            }
            var e = 0
                , f = 0;
            return {
                createEvent: function(g, h, m) {
                    var n = a()
                        , p = n.hh
                        , q = void 0 !== m ? Math.round(m) : void 0 !== h ? Math.round(n.hh * h) : Math.round(n.Ij)
                        , t = void 0 !== h ? Math.round(100 * h) : 0 >= p ? 0 : Math.round(q / p * 100)
                        , r = H.hidden ? !1 : .5 <= Hr(c);
                    d();
                    var u = void 0;
                    void 0 !== b && (u = [b]);
                    var v = Kz(c, "gtm.video", u);
                    v["gtm.videoProvider"] = "youtube";
                    v["gtm.videoStatus"] = g;
                    v["gtm.videoUrl"] = n.url;
                    v["gtm.videoTitle"] = n.title;
                    v["gtm.videoDuration"] = Math.round(p);
                    v["gtm.videoCurrentTime"] = Math.round(q);
                    v["gtm.videoElapsedTime"] = Math.round(f);
                    v["gtm.videoPercent"] = t;
                    v["gtm.videoVisible"] = r;
                    return v
                },
                ek: function() {
                    e = Cb()
                },
                ud: function() {
                    d()
                }
            }
        };
        var gc = ka(["data-gtm-yt-inspected-"]), zC = ["www.youtube.com", "www.youtube-nocookie.com"], AC, BC = !1;
        var CC = function(a, b, c) {
            var d = a.map(function(g) {
                return {
                    Ha: g,
                    Qe: g,
                    Oe: void 0
                }
            });
            if (!b.length)
                return d;
            var e = b.map(function(g) {
                return {
                    Ha: g * c,
                    Qe: void 0,
                    Oe: g
                }
            });
            if (!d.length)
                return e;
            var f = d.concat(e);
            f.sort(function(g, h) {
                return g.Ha - h.Ha
            });
            return f
        }
            , DC = function(a) {
            a = void 0 === a ? [] : a;
            for (var b = [], c = 0; c < a.length; c++)
                0 > a[c] || b.push(a[c]);
            b.sort(function(d, e) {
                return d - e
            });
            return b
        }
            , EC = function(a) {
            a = void 0 === a ? [] : a;
            for (var b = [], c = 0; c < a.length; c++)
                100 < a[c] || 0 > a[c] || (b[c] = a[c] / 100);
            b.sort(function(d, e) {
                return d - e
            });
            return b
        }
            , FC = function(a, b) {
            var c, d;
            function e() {
                r = yC(function() {
                    return {
                        url: w,
                        title: x,
                        hh: v,
                        Ij: a.getCurrentTime(),
                        playbackRate: y
                    }
                }, b.Ab, a.getIframe());
                v = 0;
                x = w = "";
                y = 1;
                return f
            }
            function f(D) {
                switch (D) {
                    case 1:
                        v = Math.round(a.getDuration());
                        w = a.getVideoUrl();
                        if (a.getVideoData) {
                            var C = a.getVideoData();
                            x = C ? C.title : ""
                        }
                        y = a.getPlaybackRate();
                        b.Zg ? qy(r.createEvent("start")) : r.ud();
                        u = CC(b.Nh, b.Mh, a.getDuration());
                        return g(D);
                    default:
                        return f
                }
            }
            function g() {
                B = a.getCurrentTime();
                A = Bb().getTime();
                r.ek();
                t();
                return h
            }
            function h(D) {
                var C;
                switch (D) {
                    case 0:
                        return n(D);
                    case 2:
                        C = "pause";
                    case 3:
                        var F = a.getCurrentTime() - B;
                        C = 1 < Math.abs((Bb().getTime() - A) / 1E3 * y - F) ? "seek" : C || "buffering";
                        a.getCurrentTime() && (b.Yg ? qy(r.createEvent(C)) : r.ud());
                        q();
                        return m;
                    case -1:
                        return e(D);
                    default:
                        return h
                }
            }
            function m(D) {
                switch (D) {
                    case 0:
                        return n(D);
                    case 1:
                        return g(D);
                    case -1:
                        return e(D);
                    default:
                        return m
                }
            }
            function n() {
                for (; d; ) {
                    var D = c;
                    G.clearTimeout(d);
                    D()
                }
                b.Xg && qy(r.createEvent("complete", 1));
                return e(-1)
            }
            function p() {}
            function q() {
                d && (G.clearTimeout(d),
                    d = 0,
                    c = p)
            }
            function t() {
                if (u.length && 0 !== y) {
                    var D = -1, C;
                    do {
                        C = u[0];
                        if (C.Ha > a.getDuration())
                            return;
                        D = (C.Ha - a.getCurrentTime()) / y;
                        if (0 > D && (u.shift(),
                        0 === u.length))
                            return
                    } while (0 > D);
                    c = function() {
                        d = 0;
                        c = p;
                        0 < u.length && u[0].Ha === C.Ha && (u.shift(),
                            qy(r.createEvent("progress", C.Oe, C.Qe)));
                        t()
                    }
                    ;
                    d = G.setTimeout(c, 1E3 * D)
                }
            }
            var r, u = [], v, w, x, y, B, A, E = e(-1);
            d = 0;
            c = p;
            return {
                onStateChange: function(D) {
                    E = E(D)
                },
                onPlaybackRateChange: function(D) {
                    B = a.getCurrentTime();
                    A = Bb().getTime();
                    r.ud();
                    y = D;
                    q();
                    t()
                }
            }
        }
            , HC = function(a) {
            I(function() {
                function b() {
                    for (var d = c.getElementsByTagName("iframe"), e = d.length, f = 0; f < e; f++)
                        GC(d[f], a)
                }
                var c = H;
                b();
                uB(b)
            })
        }
            , GC = function(a, b) {
            if (!a.getAttribute("data-gtm-yt-inspected-" + b.Ab) && (lc(a, "data-gtm-yt-inspected-" + b.Ab),
                IC(a, b.Ae))) {
                a.id || (a.id = JC());
                var c = G.YT
                    , d = c.get(a.id);
                d || (d = new c.Player(a.id));
                var e = FC(d, b), f = {}, g;
                for (g in e)
                    f = {
                        Ie: f.Ie
                    },
                        f.Ie = g,
                    e.hasOwnProperty(f.Ie) && d.addEventListener(f.Ie, function(h) {
                        return function(m) {
                            return e[h.Ie](m.data)
                        }
                    }(f))
            }
        }
            , IC = function(a, b) {
            var c = a.getAttribute("src");
            if (KC(c, "embed/")) {
                if (0 < c.indexOf("enablejsapi=1"))
                    return !0;
                if (b) {
                    var d;
                    var e = -1 !== c.indexOf("?") ? "&" : "?";
                    -1 < c.indexOf("origin=") ? d = c + e + "enablejsapi=1" : (AC || (AC = H.location.protocol + "//" + H.location.hostname,
                    H.location.port && (AC += ":" + H.location.port)),
                        d = c + e + "enablejsapi=1&origin=" + encodeURIComponent(AC));
                    var f;
                    f = Sb(d);
                    a.src = Qb(f).toString();
                    return !0
                }
            }
            return !1
        }
            , KC = function(a, b) {
            if (!a)
                return !1;
            for (var c = 0; c < zC.length; c++)
                if (0 <= a.indexOf("//" + zC[c] + "/" + b))
                    return !0;
            return !1
        }
            , JC = function() {
            var a = Math.round(1E9 * Math.random()) + "";
            return H.getElementById(a) ? JC() : a
        };
        function LC(a, b) {
            var c = this;
            K(this.getName(), ["dustOptions:!PixieMap", "triggerId:?*"], arguments);
            yz([function() {
                return L(c, "detect_youtube_activity_events", {
                    fixMissingApi: !!a.get("fixMissingApi")
                })
            }
            ]);
            b = Ez(b);
            var d = !!a.get("captureStart")
                , e = !!a.get("captureComplete")
                , f = !!a.get("capturePause")
                , g = EC(J(a.get("progressThresholdsPercent")))
                , h = DC(J(a.get("progressThresholdsTimeInSeconds")))
                , m = !!a.get("fixMissingApi");
            if (!(d || e || f || g.length || h.length))
                return;
            var n = {
                Zg: d,
                Xg: e,
                Yg: f,
                Mh: g,
                Nh: h,
                Ae: m,
                Ab: b
            }
                , p = G.YT
                , q = function() {
                HC(n)
            };
            if (p)
                return p.ready && p.ready(q),
                    b;
            var t = G.onYouTubeIframeAPIReady;
            G.onYouTubeIframeAPIReady = function() {
                t && t();
                q()
            }
            ;
            I(function() {
                for (var r = H.getElementsByTagName("script"), u = r.length, v = 0; v < u; v++) {
                    var w = r[v].getAttribute("src");
                    if (KC(w, "iframe_api") || KC(w, "player_api"))
                        return b
                }
                for (var x = H.getElementsByTagName("iframe"), y = x.length, B = 0; B < y; B++)
                    if (!BC && IC(x[B], n.Ae))
                        return wc("https://www.youtube.com/iframe_api"),
                            BC = !0,
                            b
            });
            return b
        }
        LC.K = "internal.enableAutoEventOnYouTubeActivity";
        var MC;
        function NC(a) {
            var b = !1;
            return b
        }
        NC.K = "internal.evaluateMatchingRules";
        var uD = function() {
            var a = !0;
            pn(7) && pn(9) && pn(10) || (a = !1);
            return a
        };
        function pE(a, b, c, d) {}
        pE.K = "internal.executeEventProcessor";
        function qE(a) {
            var b;
            return ad(b, this.J, 1)
        }
        qE.K = "internal.executeJavascriptString";
        function rE(a) {
            var b;
            return b
        }
        ;var sE = null;
        function tE() {
            var a = new ab;
            L(this, "read_container_data"),
                U(34) && sE ? a = sE : (a.set("containerId", 'G-F1RTS0P1CD'),
                    a.set("version", '1'),
                    a.set("environmentName", ''),
                    a.set("debugMode", Nf),
                    a.set("previewMode", Pf),
                    a.set("environmentMode", Of),
                    a.set("firstPartyServing", qj()),
                    a.set("containerUrl", qc),
                    a.Lb(),
                U(34) && (sE = a));
            return a
        }
        tE.U = "getContainerVersion";
        function uE(a, b) {
            b = void 0 === b ? !0 : b;
            var c;
            return c
        }
        uE.U = "getCookieValues";
        function vE() {
            return Xi()
        }
        vE.K = "internal.getCountryCode";
        function wE() {
            var a = [];
            a = Ej();
            return ad(a)
        }
        wE.K = "internal.getDestinationIds";
        function xE(a, b) {
            var c = null;
            return c
        }
        xE.K = "internal.getElementAttribute";
        function yE(a) {
            var b = null;
            return b
        }
        yE.K = "internal.getElementById";
        function zE(a) {
            var b = "";
            return b
        }
        zE.K = "internal.getElementInnerText";
        function AE(a, b) {
            var c = null;
            return c
        }
        AE.K = "internal.getElementProperty";
        function BE(a) {
            var b;
            return b
        }
        BE.K = "internal.getElementValue";
        function CE(a) {
            var b = 0;
            return b
        }
        CE.K = "internal.getElementVisibilityRatio";
        function DE(a) {
            var b = null;
            return b
        }
        DE.K = "internal.getElementsByCssSelector";
        function EE(a) {
            var b;
            K(this.getName(), ["keyPath:!string"], arguments);
            L(this, "read_event_data", a);
            var c;
            a: {
                var d = a
                    , e = Cz(this).originalEventData;
                if (e) {
                    for (var f = e, g = {}, h = {}, m = {}, n = [], p = d.split("\\\\"), q = 0; q < p.length; q++) {
                        for (var t = p[q].split("\\."), r = 0; r < t.length; r++) {
                            for (var u = t[r].split("."), v = 0; v < u.length; v++)
                                n.push(u[v]),
                                v !== u.length - 1 && n.push(m);
                            r !== t.length - 1 && n.push(h)
                        }
                        q !== p.length - 1 && n.push(g)
                    }
                    for (var w = [], x = "", y = ma(n), B = y.next(); !B.done; B = y.next()) {
                        var A = B.value;
                        A === m ? (w.push(x),
                            x = "") : x = A === g ? x + "\\" : A === h ? x + "." : x + A
                    }
                    x && w.push(x);
                    for (var E = ma(w), D = E.next(); !D.done; D = E.next()) {
                        if (null == f) {
                            c = void 0;
                            break a
                        }
                        f = f[D.value]
                    }
                    c = f
                } else
                    c = void 0
            }
            b = ad(c, this.J, 1);
            return b
        }
        EE.K = "internal.getEventData";
        var FE = {};
        FE.enableAWFledge = U(18);
        FE.enableAdsConversionValidation = U(10);
        FE.enableAutoPiiOnPhoneAndAddress = U(17);
        FE.enableCachedEcommerceData = U(25);
        FE.enableCcdPreAutoPiiDetection = U(26);
        FE.enableCloudRecommentationsErrorLogging = U(28);
        FE.enableCloudRecommentationsSchemaIngestion = U(29);
        FE.enableCloudRetailInjectPurchaseMetadata = U(31);
        FE.enableCloudRetailLogging = U(30);
        FE.enableCloudRetailPageCategories = U(32);
        FE.enableConsentDisclosureActivity = U(33);
        FE.enableDCFledge = U(37);
        FE.enableDecodeUri = U(46);
        FE.enableDeferAllEnhancedMeasurement = U(38);
        FE.enableEuidAutoMode = U(40);
        FE.enableFormSkipValidation = U(43);
        FE.enableGaRegionActivityPerformanceFix = U(52);
        FE.enableSharedUserId = U(70);
        FE.enableSharedUserIdFromUserProperty = U(71);
        FE.enableUrlDecodeEventUsage = U(76);
        FE.enableZoneConfigInChildContainers = U(78);
        FE.ignoreServerMacroInGoogleSignal = U(81);
        FE.renameOnoToNonGaiaRemarketing = U(84);
        FE.useEnableAutoEventOnFormApis = U(90);
        FE.autoPiiEligible = aj();
        function GE() {
            return ad(FE)
        }
        GE.K = "internal.getFlags";
        function HE() {
            return new Yc(Zy)
        }
        HE.K = "internal.getHtmlId";
        function IE(a, b) {
            var c;
            K(this.getName(), ["targetId:!string", "name:!string"], arguments);
            var d = xq(a) || {};
            c = ad(d[b], this.J);
            return c
        }
        IE.K = "internal.getProductSettingsParameter";
        function JE(a, b) {
            var c;
            K(this.getName(), ["queryKey:!string", "retrieveAll:?boolean"], arguments);
            L(this, "get_url", "query", a);
            var d = hj(lj(G.location.href), "query")
                , e = ej(d, a, b);
            c = ad(e, this.J);
            return c
        }
        JE.U = "getQueryParameters";
        function KE(a, b) {
            var c;
            return c
        }
        KE.U = "getReferrerQueryParameters";
        function LE(a) {
            var b = "";
            return b
        }
        LE.U = "getReferrerUrl";
        function ME() {
            return Wi["1"] || ""
        }
        ME.K = "internal.getRegionCode";
        function NE(a, b) {
            var c;
            K(this.getName(), ["targetId:!string", "name:!string"], arguments);
            var d = gm(a);
            c = ad(d[b], this.J);
            return c
        }
        NE.K = "internal.getRemoteConfigParameter";
        function OE(a) {
            var b = "";
            K(this.getName(), ["component:?string"], arguments),
                L(this, "get_url", a),
                b = hj(lj(G.location.href), a);
            return b
        }
        OE.U = "getUrl";
        function PE() {
            L(this, "get_user_agent");
            return oc.userAgent
        }
        PE.U = "getUserAgent";
        var QE = !1
            , RE = function(a) {
            var b = a.eventName === P.g.Qb && al() && Bs(a)
                , c = a.metadata.is_sgtm_service_worker
                , d = a.metadata.batch_on_navigation
                , e = a.metadata.is_conversion
                , f = a.metadata.is_session_start
                , g = a.metadata.create_dc_join
                , h = a.metadata.create_google_join
                , m = a.metadata.euid_mode_enabled && !!Cs(a);
            return !(!(U(47) && U(48) && "fetch"in G || oc.sendBeacon) || e || m || f || g || h || b || c || !d && QE)
        };
        var SE = function(a) {
            var b = 0
                , c = 0;
            return {
                start: function() {
                    b = Cb()
                },
                stop: function() {
                    c = this.get()
                },
                get: function() {
                    var d = 0;
                    a.yh() && (d = Cb() - b);
                    return d + c
                }
            }
        }
            , TE = function() {
            this.m = void 0;
            this.F = 0;
            this.isActive = this.isVisible = this.H = !1;
            this.T = this.M = void 0
        };
        aa = TE.prototype;
        aa.Ok = function(a) {
            var b = this;
            if (!this.m) {
                this.H = H.hasFocus();
                this.isVisible = !H.hidden;
                this.isActive = !0;
                var c = function(d, e, f) {
                    Ac(d, e, function(g) {
                        b.m.stop();
                        f(g);
                        b.yh() && b.m.start()
                    })
                };
                c(G, "focus", function() {
                    b.H = !0
                });
                c(G, "blur", function() {
                    b.H = !1
                });
                c(G, "pageshow", function(d) {
                    b.isActive = !0;
                    d.persisted && O(56);
                    b.T && b.T()
                });
                c(G, "pagehide", function() {
                    b.isActive = !1;
                    b.M && b.M()
                });
                c(H, "visibilitychange", function() {
                    b.isVisible = !H.hidden
                });
                Bs(a) && -1 === (oc.userAgent || "").indexOf("Firefox") && -1 === (oc.userAgent || "").indexOf("FxiOS") && c(G, "beforeunload", function() {
                    QE = !0
                });
                this.Qh();
                this.F = 0
            }
        }
        ;
        aa.Qh = function() {
            this.F += this.Jf();
            this.m = SE(this);
            this.yh() && this.m.start()
        }
        ;
        aa.bn = function(a) {
            var b = this.Jf();
            0 < b && (a.D[P.g.Rd] = b)
        }
        ;
        aa.Rl = function(a) {
            a.D[P.g.Rd] = void 0;
            this.Qh();
            this.F = 0
        }
        ;
        aa.yh = function() {
            return this.H && this.isVisible && this.isActive
        }
        ;
        aa.Jl = function() {
            return this.F + this.Jf()
        }
        ;
        aa.Jf = function() {
            return this.m && this.m.get() || 0
        }
        ;
        aa.Hm = function(a) {
            this.M = a
        }
        ;
        aa.bk = function(a) {
            this.T = a
        }
        ;
        var UE = function() {
            delete jb.GA4_EVENT
        }
            , VE = function(a) {
            kb("GA4_EVENT", a)
        };
        function WE() {
            return G.gaGlobal = G.gaGlobal || {}
        }
        var XE = function() {
            var a = WE();
            a.hid = a.hid || sb();
            return a.hid
        }
            , YE = function(a, b) {
            var c = WE();
            if (void 0 == c.vid || b && !c.from_cookie)
                c.vid = a,
                    c.from_cookie = b
        };
        var ZE = function(a, b, c) {
            var d = a.metadata.client_id_source;
            if (void 0 === d || c <= d)
                a.D[P.g.lb] = b,
                    a.metadata.client_id_source = c
        }
            , bF = function(a, b) {
            var c;
            var d = b.metadata.cookie_options
                , e = d.prefix + "_ga"
                , f = so(d, void 0, void 0, P.g.W);
            if (!1 === V(b.o, P.g.wc) && $E(b) === a)
                c = !0;
            else {
                var g = ro(a, aF[0], d.domain, d.path);
                c = 1 !== io(e, g, f)
            }
            return c
        }
            , $E = function(a) {
            var b = a.metadata.cookie_options
                , c = b.prefix + "_ga"
                , d = qo(c, b.domain, b.path, aF, P.g.W);
            if (!d) {
                var e = String(V(a.o, P.g.vc, ""));
                e && e != c && (d = qo(e, b.domain, b.path, aF, P.g.W))
            }
            return d
        }
            , aF = ["GA1"]
            , cF = function(a, b) {
            var c = a.D[P.g.lb];
            if (V(a.o, P.g.Gb) && V(a.o, P.g.Ub) || b && c === b)
                return c;
            if (c) {
                c = "" + c;
                if (!bF(c, a))
                    return O(31),
                        a.isAborted = !0,
                        "";
                YE(c, X(P.g.W));
                return c
            }
            O(32);
            a.isAborted = !0;
            return ""
        };
        var fF = function(a, b, c) {
            if (!b)
                return a;
            if (!a)
                return b;
            var d = dF(a);
            if (!d)
                return b;
            var e, f = wb(null != (e = V(c.o, P.g.nd)) ? e : 30);
            if (!(Math.floor(c.metadata.event_start_timestamp_ms / 1E3) > d.Ke + 60 * f))
                return a;
            var g = dF(b);
            if (!g)
                return a;
            g.Oc = d.Oc + 1;
            var h;
            return null != (h = eF(g.sessionId, g.Oc, g.Cd, g.Ke, g.Ch, g.Ic, g.xe)) ? h : b
        }
            , iF = function(a, b) {
            var c = b.metadata.cookie_options
                , d = gF(b, c)
                , e = ro(a, hF[0], c.domain, c.path)
                , f = {
                zb: P.g.W,
                domain: c.domain,
                path: c.path,
                expires: c.yb ? new Date(Cb() + 1E3 * Number(c.yb)) : void 0,
                flags: c.flags
            };
            io(d, void 0, f);
            return 1 !== io(d, e, f)
        }
            , jF = function(a) {
            var b = a.metadata.cookie_options
                , c = gF(a, b)
                , d = qo(c, b.domain, b.path, hF, P.g.W);
            if (!d)
                return d;
            var e = Xn(c, void 0, void 0, P.g.W);
            if (d && 1 < e.length) {
                O(114);
                for (var f = void 0, g = void 0, h = 0; h < e.length; h++) {
                    var m = e[h].split(".");
                    if (!(7 > m.length)) {
                        var n = Number(m[5]);
                        n && (!g || n > g) && (g = n,
                            f = e[h])
                    }
                }
                f && f.substring(f.length - d.length, f.length) !== d && (O(115),
                    d = f.split(".").slice(2).join("."))
            }
            return d
        }
            , eF = function(a, b, c, d, e, f, g) {
            if (a && b) {
                var h = [a, b, wb(c), d, e];
                h.push(f ? "1" : "0");
                h.push(g || "0");
                return h.join(".")
            }
        }
            , hF = ["GS1"]
            , gF = function(a, b) {
            return b.prefix + "_ga_" + a.target.ma[Ol[0]]
        }
            , dF = function(a) {
            if (a) {
                var b = a.split(".");
                if (!(5 > b.length || 7 < b.length)) {
                    7 > b.length && O(67);
                    var c = Number(b[1])
                        , d = Number(b[3])
                        , e = Number(b[4] || 0);
                    c || O(118);
                    d || O(119);
                    isNaN(e) && O(120);
                    if (c && d && !isNaN(e))
                        return {
                            sessionId: b[0],
                            Oc: c,
                            Cd: !!Number(b[2]),
                            Ke: d,
                            Ch: e,
                            Ic: "1" === b[5],
                            xe: "0" !== b[6] ? b[6] : void 0
                        }
                }
            }
        }
            , kF = function(a) {
            return eF(a.D[P.g.tb], a.D[P.g.ee], a.D[P.g.de], Math.floor(a.metadata.event_start_timestamp_ms / 1E3), a.metadata.join_timer_sec || 0, !!a.metadata[P.g.df], a.D[P.g.Sd])
        };
        var lF = function(a) {
            var b = V(a.o, P.g.xa)
                , c = a.o.F[P.g.xa];
            if (c === b)
                return c;
            var d = k(b);
            c && c[P.g.Z] && (d[P.g.Z] = (d[P.g.Z] || []).concat(c[P.g.Z]));
            return d
        }
            , mF = function(a, b) {
            var c = Io(!0);
            return "1" !== c._up ? {} : {
                clientId: c[a],
                Rf: c[b]
            }
        }
            , nF = function(a, b, c) {
            var d = Io(!0)
                , e = d[b];
            e && (ZE(a, e, 2),
                bF(e, a));
            var f = d[c];
            f && iF(f, a);
            return {
                clientId: e,
                Rf: f
            }
        }
            , oF = !1
            , pF = function(a) {
            var b = lF(a) || {}
                , c = a.metadata.cookie_options
                , d = c.prefix + "_ga"
                , e = gF(a, c)
                , f = {};
            So(b[P.g.Bc], !!b[P.g.Z]) && (f = nF(a, d, e),
            f.clientId && f.Rf && (oF = !0));
            b[P.g.Z] && Po(function() {
                var g = {}
                    , h = $E(a);
                h && (g[d] = h);
                var m = jF(a);
                m && (g[e] = m);
                var n = Xn("FPLC", void 0, void 0, P.g.W);
                n.length && (g._fplc = n[0]);
                return g
            }, b[P.g.Z], b[P.g.Hb], !!b[P.g.sb]);
            return f
        }
            , rF = function(a) {
            if (!V(a.o, P.g.Va))
                return {};
            var b = a.metadata.cookie_options
                , c = b.prefix + "_ga"
                , d = gF(a, b);
            Qo(function() {
                var e;
                if (X("analytics_storage"))
                    e = {};
                else {
                    var f = {};
                    e = (f._up = "1",
                        f[c] = a.D[P.g.lb],
                        f[d] = kF(a),
                        f)
                }
                return e
            }, 1);
            return !X("analytics_storage") && qF() ? mF(c, d) : {}
        }
            , qF = function() {
            var a = gj(G.location, "host")
                , b = gj(lj(H.referrer), "host");
            return a && b ? a === b || 0 <= a.indexOf("." + b) || 0 <= b.indexOf("." + a) ? !0 : !1 : !1
        };
        var sF = function() {
            var a = Cb()
                , b = a + 864E5
                , c = 20
                , d = 5E3;
            return function(e) {
                var f = Cb();
                f >= b && (b = f + 864E5,
                    d = 5E3);
                c = Math.min(c + (f - a) / 1E3 * 5, 20);
                a = f;
                var g = !1;
                1 > d || 1 > c || (g = !0,
                    d--,
                    c--);
                e && (e.wl = d,
                    e.ol = c);
                return g
            }
        };
        var tF = function(a, b) {
            vn() && (a.gcs = wn(),
            b.metadata.is_consent_update && (a.gcu = "1"));
            a.gcd = An(b.o);
            un(b.o) ? a.npa = "0" : a.npa = "1"
        }
            , wF = function(a) {
            if (a.metadata.is_merchant_center)
                return tj("https://www.merchant-center-analytics.goog") + "/mc/collect";
            var b = pj(sj(a.o), "/g/collect");
            if (b)
                return b;
            if (zi.F)
                return "" + Ai() + "/g/collect";
            var c = As(a)
                , d = V(a.o, P.g.kb);
            return c && !Yi() && !1 !== d && uD() && X(P.g.R) && X(P.g.W) ? uF() : vF()
        }
            , xF = !1;
        xF = !0;
        var yF = {};
        yF[P.g.lb] = "cid";
        yF[P.g.fg] = "gcut";
        yF[P.g.Sb] = "are";
        yF[P.g.Ze] = "pscdl";
        yF[P.g.ef] = "_fid";
        yF[P.g.sg] = "_geo";
        yF[P.g.rb] = "gdid";
        yF[P.g.Fb] = "frm";
        yF[P.g.gd] = "ir";
        yF[P.g.Pa] = "ul";
        yF[P.g.Dg] = "pae";
        yF[P.g.ce] = "_rdi";
        yF[P.g.Jb] = "sr";
        yF[P.g.Yi] = "tid";
        yF[P.g.pf] = "tt";
        yF[P.g.pd] = "ec_mode";
        yF[P.g.kj] = "gtm_up";
        yF[P.g.qf] = "uaa";
        yF[P.g.rf] = "uab";
        yF[P.g.tf] = "uafvl";
        yF[P.g.uf] = "uamb";
        yF[P.g.vf] = "uam";
        yF[P.g.wf] = "uap";
        yF[P.g.xf] = "uapv";
        yF[P.g.yf] = "uaw";
        yF[P.g.Zi] = "ur";
        yF[P.g.hd] = "lps";
        var zF = {};
        zF[P.g.Qc] = "cc";
        zF[P.g.Rc] = "ci";
        zF[P.g.Sc] = "cm";
        zF[P.g.Tc] = "cn";
        zF[P.g.Vc] = "cs";
        zF[P.g.Wc] = "ck";
        zF[P.g.Ba] = "cu";
        zF[P.g.ya] = "dl";
        zF[P.g.Fa] = "dr";
        zF[P.g.Ib] = "dt";
        zF[P.g.de] = "seg";
        zF[P.g.tb] = "sid";
        zF[P.g.ee] = "sct";
        zF[P.g.Da] = "uid";
        U(80) && (zF[P.g.kd] = "dp");
        var AF = {};
        AF[P.g.Rd] = "_et";
        AF[P.g.ob] = "edid";
        var BF = {};
        BF[P.g.Qc] = "cc";
        BF[P.g.Rc] = "ci";
        BF[P.g.Sc] = "cm";
        BF[P.g.Tc] = "cn";
        BF[P.g.Vc] = "cs";
        BF[P.g.Wc] = "ck";
        var CF = {}
            , DF = Object.freeze((CF[P.g.Ga] = 1,
            CF))
            , vF = function() {
            var a = "www";
            xF && $i() && (a = $i());
            return "https://" + a + ".google-analytics.com/g/collect"
        }
            , uF = function() {
            var a;
            xF && "" !== $i() && (a = $i());
            return "https://" + (a ? a + "." : "") + "analytics.google.com/g/collect"
        }
            , EF = function(a, b, c) {
            var d = {}
                , e = {}
                , f = {};
            d.v = "2";
            d.tid = a.target.ka;
            zs(a) && !Yi() && (d[U(84) ? "_ng" : "_ono"] = 1);
            d.gtm = Qn({
                za: a.metadata.source_canonical_id
            });
            d._p = U(91) ? ti : XE();
            c && (d.em = c);
            a.metadata.create_google_join && (d._gaz = 1);
            tF(d, a);
            Dn() && (d.dma_cps = Bn());
            d.dma = Cn();
            Zm(gn()) && (d.tcfd = Nn());
            zi.m && (d.tag_exp = zi.m);
            var g = a.D[P.g.rb];
            g && (d.gdid = g);
            e.en = String(a.eventName);
            a.metadata.is_first_visit && (e._fv = a.metadata.is_first_visit_conversion ? 2 : 1);
            a.metadata.is_new_to_site && (e._nsi = 1);
            a.metadata.is_session_start && (e._ss = a.metadata.is_session_start_conversion ? 2 : 1);
            a.metadata.is_conversion && (e._c = 1);
            a.metadata.is_external_event && (e._ee = 1);
            if (a.metadata.is_ecommerce) {
                var h = a.D[P.g.ia] || V(a.o, P.g.ia);
                if (Array.isArray(h))
                    for (var m = 0; m < h.length && 200 > m; m++)
                        e["pr" + (m + 1)] = Tf(h[m])
            }
            var n = a.D[P.g.ob];
            n && (e.edid = n);
            var p = function(r, u) {
                if ("object" !== typeof u || !DF[r]) {
                    var v = "ep." + r
                        , w = "epn." + r;
                    r = pb(u) ? w : v;
                    var x = pb(u) ? v : w;
                    e.hasOwnProperty(x) && delete e[x];
                    e[r] = String(u)
                }
            }
                , q = U(85) && Bs(a);
            z(a.D, function(r, u) {
                if (void 0 !== u && !Sh.hasOwnProperty(r)) {
                    null === u && (u = "");
                    var v;
                    r !== P.g.Sd ? v = !1 : a.metadata.euid_mode_enabled || q ? (d.ecid = u,
                        v = !0) : v = void 0;
                    if (!v && r !== P.g.df) {
                        var w = u;
                        !0 === u && (w = "1");
                        !1 === u && (w = "0");
                        w = String(w);
                        var x;
                        if (yF[r])
                            x = yF[r],
                                d[x] = w;
                        else if (zF[r])
                            x = zF[r],
                                f[x] = w;
                        else if (AF[r])
                            x = AF[r],
                                e[x] = w;
                        else if ("_" === r.charAt(0))
                            d[r] = w;
                        else {
                            var y;
                            BF[r] ? y = !0 : r !== P.g.Uc ? y = !1 : ("object" !== typeof u && p(r, u),
                                y = !0);
                            y || p(r, u)
                        }
                    }
                }
            });
            (function(r) {
                    Bs(a) && "object" === typeof r && z(r || {}, function(u, v) {
                        "object" !== typeof v && (d["sst." + u] = String(v))
                    })
                }
            )(a.D[P.g.oe]);
            var t = a.D[P.g.cb] || {};
            U(58) && !1 === V(a.o, P.g.kb, void 0, 4) && (d.ngs = "1");
            z(t, function(r, u) {
                void 0 !== u && ((null === u && (u = ""),
                r !== P.g.Da || f.uid) ? b[r] !== u && (e[(pb(u) ? "upn." : "up.") + String(r)] = String(u),
                    b[r] = u) : f.uid = String(u))
            });
            Vf.call(this, {
                na: d,
                Pc: f,
                kh: e
            }, wF(a), Bs(a))
        };
        ya(EF, Vf);
        var FF = function(a) {
            this.F = a;
            this.H = "";
            this.m = this.F
        }
            , GF = function(a, b) {
            a.m = b;
            return a
        }
            , HF = function(a, b) {
            a.M = b;
            return a
        };
        function IF(a) {
            var b = a.search;
            return a.protocol + "//" + a.hostname + a.pathname + (b ? b + "&richsstsse" : "?richsstsse")
        }
        function JF(a, b, c) {
            if (a) {
                var d = a || [];
                if (Array.isArray(d))
                    for (var e = Va(b) ? b : {}, f = ma(d), g = f.next(); !g.done; g = f.next())
                        c(g.value, e)
            }
        }
        ;var KF = function(a, b) {
            return a.replace(/\$\{([^\}]+)\}/g, function(c, d) {
                return b[d] || c
            })
        }
            , LF = function(a) {
                var b = {}
                    , c = ""
                    , d = a.pathname.indexOf("/g/collect");
                0 <= d && (c = a.pathname.substring(0, d));
                b.transport_url = a.protocol + "//" + a.hostname + c;
                return b
            }
            , MF = function(a, b, c, d) {
                var e = HF(GF(new FF(function(h, m) {
                        var n = KF(h, c);
                        d && (n = n.replace("_is_sw=0", d));
                        var p = {};
                        m.attribution_reporting && (p.attributionsrc = "");
                        zc(n, void 0, void 0, p)
                    }
                ), function(h) {
                    var m = KF(h, c);
                    Gc(m)
                }), function(h, m) {
                    var n = KF(h, c)
                        , p = m.dedupe_key;
                    p && tt(n, p)
                })
                    , f = 0
                    , g = new G.XMLHttpRequest;
                g.withCredentials = !0;
                g.onprogress = function(h) {
                    if (200 === g.status) {
                        var m = g.responseText.substring(f);
                        f = h.loaded;
                        var n;
                        n = e.H + m;
                        for (var p = n.indexOf("\n\n"); -1 !== p; ) {
                            var q;
                            a: {
                                var t = ma(n.substring(0, p).split("\n"))
                                    , r = t.next().value
                                    , u = t.next().value;
                                if (0 === r.indexOf("event: message") && 0 === u.indexOf("data: "))
                                    try {
                                        q = JSON.parse(u.substring(u.indexOf(":") + 1));
                                        break a
                                    } catch (F) {}
                                q = void 0
                            }
                            var v = e
                                , w = q;
                            if (w) {
                                JF(w.send_pixel, w.options, v.F);
                                JF(w.send_beacon, void 0, v.m);
                                var x = w.create_iframe
                                    , y = w.options
                                    , B = v.M;
                                if (x && B) {
                                    var A = x || [];
                                    if (Array.isArray(A))
                                        for (var E = Va(y) ? y : {}, D = ma(A), C = D.next(); !C.done; C = D.next())
                                            B(C.value, E)
                                }
                            }
                            n = n.substring(p + 2);
                            p = n.indexOf("\n\n")
                        }
                        e.H = n
                    }
                }
                ;
                g.open(b ? "POST" : "GET", a);
                g.setAttributionReporting && g.setAttributionReporting({
                    eventSourceEligible: !1,
                    triggerEligible: !0
                });
                g.send(b)
            }
            , NF = function(a, b) {
                var c = lj(a)
                    , d = LF(c)
                    , e = IF(c);
                U(68) ? Ys(e, b, d, function(f) {
                    MF(e, b, d, f)
                }) : MF(e, b, d)
            };
        var OF = function(a, b) {
            return a ? [a, b].join("&") : b
        }
            , RF = function(a, b, c, d) {
            var e = U(50) && d;
            if (U(49) || e) {
                var f = b
                    , g = Lc();
                void 0 !== g && (f += "&tfd=" + Math.round(g));
                b = f
            }
            var h = a + "?" + b;
            PF && (d = !(0 === h.indexOf(vF()) || 0 === h.indexOf(uF())));
            if (d && !QE)
                NF(h, c);
            else {
                var m;
                var n = b;
                U(47) && "fetch"in G ? U(48) ? m = Jc(a + "?" + OF(n, "_z=fetch"), c, {
                    Tn: !0
                }) : (QF(a, OF(n, "_z=sendBeacon"), c),
                    m = !0) : m = !1;
                m || QF(a, b, c)
            }
        }
            , SF = function(a, b) {
            function c(u) {
                n.push(u + "=" + encodeURIComponent("" + a.na[u]))
            }
            var d = b.Qm
                , e = b.Rm
                , f = b.Ll
                , g = b.bm
                , h = b.am
                , m = b.Gm;
            if (d || e) {
                var n = []
                    , p = U(84) ? "_ng" : "_ono";
                a.na[p] && c(p);
                c("tid");
                c("cid");
                c("gtm");
                n.push("aip=1");
                a.Pc.uid && !h && n.push("uid=" + encodeURIComponent("" + a.Pc.uid));
                var q = function() {
                    c("dma");
                    null != a.na.dma_cps && c("dma_cps");
                    null != a.na.gcs && c("gcs");
                    c("gcd");
                    null != a.na.npa && c("npa")
                };
                q();
                null != a.na.frm && c("frm");
                d && (QF("https://stats.g.doubleclick.net/g/collect", "v=2&" + n.join("&")),
                    n.join("&"));
                if (e) {
                    var t = function() {
                        var u = vt() + "/td/ga/rul?";
                        n = [];
                        c("tid");
                        n.push("gacid=" + encodeURIComponent(String(a.na.cid)));
                        c("gtm");
                        q();
                        c("pscdl");
                        n.push("aip=1");
                        n.push("fledge=1");
                        null != a.na.frm && c("frm");
                        n.push("z=" + sb());
                        tt(u + n.join("&"), a.na.tid)
                    };
                    n.push("z=" + sb());
                    if (!g) {
                        var r = f && 0 === f.indexOf("google.") && "google.com" != f ? "https://www.%/ads/ga-audiences?v=1&t=sr&slf_rd=1&_r=4&".replace("%", f) : void 0;
                        r && zc(r + n.join("&"))
                    }
                    U(58) && m && !QE && t()
                }
            }
        }
            , PF = !1;
        var TF = function() {
            this.M = 1;
            this.T = {};
            this.m = new Wf;
            this.F = -1
        };
        TF.prototype.H = function(a, b) {
            var c = this
                , d = new EF(a,this.T,b)
                , e = RE(a);
            e && this.m.T(d) || this.flush();
            if (e && this.m.add(d)) {
                if (0 > this.F) {
                    var f = G.setTimeout, g;
                    Bs(a) ? UF ? (UF = !1,
                        g = VF) : g = WF : g = 5E3;
                    this.F = f.call(G, function() {
                        return c.flush()
                    }, g)
                }
            } else {
                var h = $f(d, this.M++);
                RF(d.baseUrl, h.params, h.body, d.H);
                var m = a.metadata.create_dc_join
                    , n = a.metadata.create_google_join
                    , p = !1 !== V(a.o, P.g.Ea)
                    , q = un(a.o)
                    , t = {
                    eventId: a.o.eventId,
                    priorityId: a.o.priorityId
                }
                    , r = a.D[P.g.Dg]
                    , u = {
                    Qm: m,
                    Rm: n,
                    Ll: bj(),
                    Mn: p,
                    Ln: q,
                    bm: Yi(),
                    am: a.metadata.euid_mode_enabled,
                    Rn: t,
                    Gm: r,
                    o: a.o
                };
                SF(d, u)
            }
            av(a.o.eventId, a.eventName)
        }
        ;
        TF.prototype.add = function(a) {
            a.metadata.euid_mode_enabled && !QE ? this.da(a) : this.H(a)
        }
        ;
        TF.prototype.flush = function() {
            if (this.m.events.length) {
                var a = ag(this.m, this.M++);
                RF(this.m.baseUrl, a.params, a.body, this.m.F);
                this.m = new Wf;
                0 <= this.F && (G.clearTimeout(this.F),
                    this.F = -1)
            }
        }
        ;
        TF.prototype.da = function(a) {
            var b = this
                , c = Cs(a);
            c ? yh(c, function(d) {
                b.H(a, 1 === d.split("~").length ? void 0 : d)
            }) : this.H(a)
        }
        ;
        var QF = function(a, b, c) {
            var d = a + "?" + b;
            c ? Hc(d, c) : Gc(d)
        }
            , VF = Pi('', 500)
            , WF = Pi('', 5E3)
            , UF = !0;
        var XF = function(a, b, c) {
            void 0 === c && (c = {});
            if ("object" === typeof b)
                for (var d in b)
                    XF(a + "." + d, b[d], c);
            else
                c[a] = b;
            return c
        }
            , YF = function(a) {
            if (Bs(a)) {
                if (U(85)) {
                    var b = zq(a, "ccd_add_1p_data", !1) ? 1 : 0;
                    Es(a, "ude", b)
                }
                var c = function(e) {
                    var f = XF(P.g.Ga, e);
                    z(f, function(g, h) {
                        a.D[g] = h
                    })
                }
                    , d = V(a.o, P.g.Ga);
                void 0 !== d ? (c(d),
                U(86) && (a.D[P.g.pd] = "c")) : c(a.metadata.user_data);
                a.metadata.user_data = void 0
            }
        };
        var ZF = window
            , $F = document
            , aG = function(a) {
            var b = ZF._gaUserPrefs;
            if (b && b.ioo && b.ioo() || $F.documentElement.hasAttribute("data-google-analytics-opt-out") || a && !0 === ZF["ga-disable-" + a])
                return !0;
            try {
                var c = ZF.external;
                if (c && c._gaUserPrefs && "oo" == c._gaUserPrefs)
                    return !0
            } catch (p) {}
            for (var d = [], e = String($F.cookie).split(";"), f = 0; f < e.length; f++) {
                var g = e[f].split("=")
                    , h = g[0].replace(/^\s*|\s*$/g, "");
                if (h && "AMP_TOKEN" == h) {
                    var m = g.slice(1).join("=").replace(/^\s*|\s*$/g, "");
                    m && (m = decodeURIComponent(m));
                    d.push(m)
                }
            }
            for (var n = 0; n < d.length; n++)
                if ("$OPT_OUT" == d[n])
                    return !0;
            return $F.getElementById("__gaOptOutExtension") ? !0 : !1
        };
        var cG = function(a) {
            return !a || bG.test(a) || Uh.hasOwnProperty(a)
        }
            , dG = function(a) {
            var b = P.g.Jb, c;
            c || (c = function() {}
            );
            void 0 !== a.D[b] && (a.D[b] = c(a.D[b]))
        }
            , eG = function(a) {
            var b = a.indexOf("?")
                , c = -1 === b ? a : a.substring(0, b);
            try {
                c = decodeURIComponent(c)
            } catch (d) {}
            return -1 === b ? c : "" + c + a.substring(b)
        }
            , fG = function(a, b, c) {
            X(c) || nl(function() {
                b.metadata.is_consent_update = !0;
                var d = bi[c || ""];
                d && Es(b, "gcut", d);
                a.Ej(b)
            }, c)
        }
            , gG = function(a) {
            var b = Lb(vl(a.o, P.g.la, 1), ".");
            b && (a.D[P.g.rb] = b);
            var c = Lb(vl(a.o, P.g.la, 2), ".");
            c && (a.D[P.g.ob] = c)
        }
            , mt = {
            Al: "",
            dn: Number("")
        }
            , hG = {}
            , iG = (hG[P.g.Qc] = 1,
            hG[P.g.Rc] = 1,
            hG[P.g.Sc] = 1,
            hG[P.g.Tc] = 1,
            hG[P.g.Vc] = 1,
            hG[P.g.Wc] = 1,
            hG)
            , bG = /^(_|ga_|google_|gtag\.|firebase_).*$/
            , jG = [Xq, gG, zr]
            , kG = function(a) {
            this.T = a;
            this.Yb = new TF;
            this.m = void 0;
            this.M = new TE;
            this.F = this.H = void 0;
            this.Dc = this.Wa = !1;
            this.Af = 0;
            this.da = !1
        };
        aa = kG.prototype;
        aa.Em = function(a, b, c) {
            var d = this
                , e = Ll(this.T);
            if (e)
                if (c.eventMetadata.is_external_event && "_" === a.charAt(0))
                    c.onFailure();
                else {
                    a !== P.g.fa && a !== P.g.Ra && cG(a) && O(58);
                    lG(c.m);
                    var f = new yq(e,a,c);
                    f.metadata.event_start_timestamp_ms = b;
                    var g = [P.g.W];
                    if (zq(f, P.g.Tb, V(f.o, P.g.Tb)) || Bs(f))
                        g.push(P.g.R),
                            g.push(P.g.P);
                    nt(function() {
                        ol(function() {
                            d.Fm(f)
                        }, g)
                    });
                    this.Cm(a, c, f)
                }
            else
                c.onFailure()
        }
        ;
        aa.Cm = function(a, b, c) {
            var d = Ll(this.T);
            if (U(44) && a === P.g.fa && zq(c, "ga4_ads_linked", !1)) {
                var e = function() {
                    for (var h = ma(jG), m = h.next(); !m.done; m = h.next()) {
                        var n = m.value;
                        n(f);
                        if (f.isAborted)
                            break
                    }
                    f.metadata.speculative || f.isAborted || ou(f)
                }
                    , f = new yq(d,a,b);
                f.metadata.hit_type = "page_view";
                f.metadata.speculative = !0;
                var g = [P.g.R, P.g.P];
                ol(function() {
                    e();
                    X(g) || nl(function(h) {
                        var m = h.consentEventId
                            , n = h.consentPriorityId;
                        f.metadata.consent_updated = !0;
                        f.metadata.consent_event_id = m;
                        f.metadata.consent_priority_id = n;
                        e()
                    }, g)
                }, g)
            }
        }
        ;
        aa.Fm = function(a) {
            this.F = a;
            try {
                if (aG(a.target.ka))
                    O(28),
                        a.isAborted = !0;
                else if (U(79)) {
                    var b = Oj();
                    if (b && Array.isArray(b.destinations))
                        for (var c = 0; c < b.destinations.length; c++)
                            if (aG(b.destinations[c])) {
                                O(125);
                                a.isAborted = !0;
                                break
                            }
                }
                if (0 <= mt.Al.replace(/\s+/g, "").split(",").indexOf(a.eventName))
                    a.isAborted = !0;
                else {
                    var d = Ds(a);
                    d && d.blacklisted && (a.isAborted = !0)
                }
                var e = H.location.protocol;
                "http:" != e && "https:" != e && (O(29),
                    a.isAborted = !0);
                oc && "preview" == oc.loadPurpose && (O(30),
                    a.isAborted = !0);
                U(73) && (a.isAborted = !0);
                br(a);
                var f = {}
                    , g = hi.grl;
                g || (g = sF(),
                    hi.grl = g);
                g(f) || (O(35),
                    a.isAborted = !0);
                if (a.isAborted) {
                    a.o.onFailure();
                    UE();
                    return
                }
                var h = f.ol;
                0 === f.wl && VE(25);
                0 === h && VE(26);
                var m = {
                    prefix: String(V(a.o, P.g.Oa, "")),
                    path: String(V(a.o, P.g.Db, "/")),
                    flags: String(V(a.o, P.g.ab, "")),
                    domain: String(V(a.o, P.g.Ta, "auto")),
                    yb: Number(V(a.o, P.g.Ua, 63072E3))
                };
                a.metadata.cookie_options = m;
                mG(a);
                this.Pk(a);
                this.M.bn(a);
                a.metadata.is_merchant_center ? a.metadata.euid_mode_enabled = !1 : zq(a, "ccd_add_1p_data", !1) && (a.metadata.euid_mode_enabled = !0);
                if (a.metadata.euid_mode_enabled && zq(a, "ccd_add_1p_data", !1)) {
                    var n = a.o.F[P.g.fe];
                    if (Oi(n)) {
                        var p = V(a.o, P.g.Ga);
                        null === p ? a.metadata.user_data_from_code = null : (n.enable_code && Va(p) && (a.metadata.user_data_from_code = p),
                        Va(n.selectors) && !a.metadata.user_data_from_manual && (a.metadata.user_data_from_manual = Ni(n.selectors)))
                    }
                }
                if (U(45) && !U(44) && zq(a, "ga4_ads_linked", !1) && a.eventName === P.g.fa) {
                    var q = !1 !== V(a.o, P.g.wa);
                    if (q) {
                        var t = Vq(a);
                        t.yb && (t.yb = Math.min(t.yb, 7776E3));
                        Wq({
                            vd: q,
                            zd: V(a.o, P.g.xa) || {},
                            Fd: V(a.o, P.g.Va),
                            fc: t
                        })
                    }
                }
                var r = this.Zj, u;
                V(a.o, P.g.Va) && (X(P.g.W) || V(a.o, P.g.lb) || (a.D[P.g.kj] = !0));
                var v;
                var w;
                w = void 0 === w ? 3 : w;
                var x = G.location.href;
                if (x) {
                    var y = lj(x).search.replace("?", "")
                        , B = ej(y, "_gl", !1, !0) || "";
                    v = B ? void 0 !== Jo(B, w) : !1
                } else
                    v = !1;
                v && Bs(a) && Es(a, "glv", 1);
                if (a.eventName !== P.g.fa)
                    u = {};
                else {
                    V(a.o, P.g.Va) && Zp(["aw", "dc"]);
                    aq(["aw", "dc"]);
                    var A = pF(a)
                        , E = rF(a);
                    u = Object.keys(A).length ? A : E
                }
                r.call(this, u);
                var D = a.eventName === P.g.fa;
                D && (this.da = !0);
                a.eventName == P.g.fa && (V(a.o, P.g.Ka, !0) ? (a.o.m[P.g.la] && (a.o.H[P.g.la] = a.o.m[P.g.la],
                    a.o.m[P.g.la] = void 0,
                    a.D[P.g.la] = void 0),
                    a.eventName = P.g.Qb) : a.isAborted = !0);
                D && !a.isAborted && 0 < this.Af++ && VE(17);
                gG(a);
                var C = this.H
                    , F = this.M
                    , N = !this.Dc
                    , M = this.m
                    , Q = V(a.o, P.g.lb);
                if (V(a.o, P.g.Gb) && V(a.o, P.g.Ub))
                    Q ? ZE(a, Q, 1) : (O(127),
                        a.isAborted = !0);
                else {
                    var W = Q ? 1 : 8;
                    a.metadata.is_new_to_site = !1;
                    Q || (Q = $E(a),
                        W = 3);
                    Q || (Q = M,
                        W = 5);
                    if (!Q) {
                        var S = X(P.g.W)
                            , R = WE();
                        Q = !R.from_cookie || S ? R.vid : void 0;
                        W = 6
                    }
                    Q ? Q = "" + Q : (Q = po(),
                        W = 7,
                        a.metadata.is_first_visit = a.metadata.is_new_to_site = !0);
                    ZE(a, Q, W)
                }
                var ia = Math.floor(a.metadata.event_start_timestamp_ms / 1E3)
                    , ea = void 0;
                a.metadata.is_new_to_site || (ea = jF(a) || C);
                var ca = wb(V(a.o, P.g.nd, 30));
                ca = Math.min(475, ca);
                ca = Math.max(5, ca);
                var Aa = wb(V(a.o, P.g.lf, 1E4))
                    , na = dF(ea);
                a.metadata.is_first_visit = !1;
                a.metadata.is_session_start = !1;
                a.metadata.join_timer_sec = 0;
                na && na.Ch && (a.metadata.join_timer_sec = Math.max(0, na.Ch - Math.max(0, ia - na.Ke)));
                var wa = !1;
                na || (wa = a.metadata.is_first_visit = !0,
                    na = {
                        sessionId: String(ia),
                        Oc: 1,
                        Cd: !1,
                        Ke: ia,
                        Ic: !1,
                        xe: void 0
                    });
                ia > na.Ke + 60 * ca && (wa = !0,
                    na.sessionId = String(ia),
                    na.Oc++,
                    na.Cd = !1,
                    na.xe = void 0);
                if (wa)
                    a.metadata.is_session_start = !0,
                        F.Rl(a);
                else if (F.Jl() > Aa || a.eventName == P.g.Qb)
                    na.Cd = !0;
                a.metadata.euid_mode_enabled ? V(a.o, P.g.Da) ? na.Ic = !0 : (na.Ic && !U(8) && (na.xe = void 0),
                    na.Ic = !1) : na.Ic = !1;
                var Oa = na.xe
                    , db = U(85) && Bs(a);
                if (a.metadata.euid_mode_enabled || db) {
                    var Ab = V(a.o, P.g.Sd)
                        , pd = Ab ? 1 : 8;
                    Ab || (Ab = Oa,
                        pd = 4);
                    Ab || (Ab = oo(),
                        pd = 7);
                    var ih = Ab.toString()
                        , pw = pd
                        , qw = a.metadata.enhanced_client_id_source;
                    if (void 0 === qw || pw <= qw)
                        a.D[P.g.Sd] = ih,
                            a.metadata.enhanced_client_id_source = pw
                }
                N ? (a.copyToHitData(P.g.tb, na.sessionId),
                    a.copyToHitData(P.g.ee, na.Oc),
                    a.copyToHitData(P.g.de, na.Cd ? 1 : 0)) : (a.D[P.g.tb] = na.sessionId,
                    a.D[P.g.ee] = na.Oc,
                    a.D[P.g.de] = na.Cd ? 1 : 0);
                a.metadata[P.g.df] = na.Ic ? 1 : 0;
                nG(a);
                if (!V(a.o, P.g.Ub) || !V(a.o, P.g.Gb)) {
                    var rw = ""
                        , jh = H.location;
                    if (jh) {
                        var Jj = jh.pathname || "";
                        "/" != Jj.charAt(0) && (Jj = "/" + Jj);
                        rw = jh.protocol + "//" + jh.hostname + Jj + jh.search
                    }
                    a.copyToHitData(P.g.ya, rw, eG);
                    var RH = a.copyToHitData, SH = P.g.Fa, Kj;
                    a: {
                        var sw = Xn("_opt_expid", void 0, void 0, P.g.W)[0];
                        if (sw) {
                            var tw = decodeURIComponent(sw).split("$");
                            if (3 === tw.length) {
                                Kj = tw[2];
                                break a
                            }
                        }
                        if (void 0 !== hi.ga4_referrer_override)
                            Kj = hi.ga4_referrer_override;
                        else {
                            var uw = Gi("gtm.gtagReferrer." + a.target.ka)
                                , TH = H.referrer;
                            Kj = uw ? "" + uw : TH
                        }
                    }
                    RH.call(a, SH, Kj || void 0, eG);
                    a.copyToHitData(P.g.Ib, H.title);
                    a.copyToHitData(P.g.Pa, (oc.language || "").toLowerCase());
                    var vw = Er();
                    a.copyToHitData(P.g.Jb, vw.width + "x" + vw.height);
                    U(80) && a.copyToHitData(P.g.kd, void 0, eG);
                    U(51) && Dq() && a.copyToHitData(P.g.hd, "1")
                }
                a.metadata.create_dc_join = !1;
                a.metadata.create_google_join = !1;
                if (!(zi.F || U(6) && Bs(a) || a.metadata.is_merchant_center || !1 === V(a.o, P.g.kb)) && uD() && X(P.g.R)) {
                    var ww = As(a);
                    (a.metadata.is_session_start || V(a.o, P.g.ff)) && (a.metadata.create_dc_join = !!ww);
                    var xw;
                    xw = a.metadata.join_timer_sec;
                    ww && 0 === (xw || 0) && (a.metadata.join_timer_sec = 60,
                        a.metadata.create_google_join = !0)
                }
                oG(a);
                Wh.hasOwnProperty(a.eventName) && (a.metadata.is_ecommerce = !0,
                    a.copyToHitData(P.g.ia),
                    a.copyToHitData(P.g.Ba));
                a.copyToHitData(P.g.pf);
                for (var yw = V(a.o, P.g.hf) || [], En = 0; En < yw.length; En++) {
                    var zw = yw[En];
                    if (zw.rule_result) {
                        a.copyToHitData(P.g.pf, zw.traffic_type);
                        VE(3);
                        break
                    }
                }
                if (!a.metadata.is_merchant_center && sj(a.o)) {
                    var Aw = lF(a) || {}
                        , VH = (So(Aw[P.g.Bc], !!Aw[P.g.Z]) ? Io(!0)._fplc : void 0) || (0 < Xn("FPLC", void 0, void 0, P.g.W).length ? void 0 : "0");
                    a.D._fplc = VH
                }
                if (void 0 !== V(a.o, P.g.gd))
                    a.copyToHitData(P.g.gd);
                else {
                    var Bw = V(a.o, P.g.jf), Fn, Lj;
                    a: {
                        if (oF) {
                            var Gn = lF(a) || {};
                            if (Gn && Gn[P.g.Z])
                                for (var Cw = hj(lj(a.D[P.g.Fa]), "host", !0), Mj = Gn[P.g.Z], kh = 0; kh < Mj.length; kh++)
                                    if (Mj[kh]instanceof RegExp) {
                                        if (Mj[kh].test(Cw)) {
                                            Lj = !0;
                                            break a
                                        }
                                    } else if (0 <= Cw.indexOf(Mj[kh])) {
                                        Lj = !0;
                                        break a
                                    }
                        }
                        Lj = !1
                    }
                    if (!(Fn = Lj)) {
                        var Nj;
                        if (Nj = Bw)
                            a: {
                                for (var Dw = Bw.include_conditions || [], WH = hj(lj(a.D[P.g.Fa]), "host", !0), Hn = 0; Hn < Dw.length; Hn++)
                                    if (Dw[Hn].test(WH)) {
                                        Nj = !0;
                                        break a
                                    }
                                Nj = !1
                            }
                        Fn = Nj
                    }
                    Fn && (a.D[P.g.gd] = "1",
                        VE(4))
                }
                Bs(a) && al() && Es(a, "rnd", Aq());
                if (U(55) && Bs(a)) {
                    zq(a, P.g.Tb, !1) && Es(a, "gse", 1);
                    !1 === V(a.o, P.g.kb, void 0, 4) && Es(a, "ngs", 1);
                    Yi() && Es(a, "ga_rd", 1);
                    uD() || Es(a, "ngst", 1);
                    var Ew = bj();
                    Ew && Es(a, "etld", Ew)
                }
                if (Bs(a)) {
                    var Fw = xF ? $i() : "";
                    Fw && Es(a, "gcsub", Fw)
                }
                Bs(a) && (Es(a, "gcd", An(a.o)),
                al() && V(a.o, P.g.ja) && Es(a, "adr", 1));
                if (Bs(a)) {
                    var Gw = Uq();
                    Gw && Es(a, "us_privacy", Gw);
                    var Hw = on();
                    Hw && Es(a, "gdpr", Hw);
                    var Iw = mn();
                    Iw && Es(a, "gdpr_consent", Iw)
                }
                Bs(a) && (a.D[P.g.Zi] = Wi["1"] || Xi());
                if (Bs(a) && U(50)) {
                    var Jw = ti;
                    Jw && Es(a, "tft", Number(Jw))
                }
                U(69) && Bs(a) && (a.metadata.speculative && Es(a, "sp", 1),
                a.metadata.is_syn && Es(a, "syn", 1),
                a.metadata.em_event && (Es(a, "em_event", 1),
                    Es(a, "sp", 1)));
                U(87) && Bs(a) && !1 !== V(a.o, P.g.Ea) && qt("join-ad-interest-group") && ob(oc.joinAdInterestGroup) && Es(a, "flg", 1);
                if (Bs(a) && a.eventName === P.g.uc && a.metadata.is_consent_update) {
                    var Kw = a.D[P.g.fg];
                    Kw && (Es(a, "gcut", Kw),
                        Es(a, "syn", 1))
                }
                if (!it(G))
                    O(87);
                else if (void 0 !== kt) {
                    O(85);
                    var Lw = gt();
                    Lw ? V(a.o, P.g.ce) && !Bs(a) || ot(Lw, a) : O(86)
                }
                var In = qt(pt());
                In || pG || (pG = !0,
                    Pm(''),
                    In = qt(pt()));
                In && (a.D[P.g.Sb] = "1");
                if (!1 !== V(a.o, P.g.Ea) && un(a.o)) {
                    var XH = As(a)
                        , YH = V(a.o, P.g.kb);
                    XH && !1 !== YH && uD() && X(P.g.R) && Xk(P.g.P) && Zk(["ads"]).ads && qt("join-ad-interest-group") && ob(oc.joinAdInterestGroup) && (a.D[P.g.Dg] = !0)
                }
                dr(a);
                cr(a);
                if (a.eventName == P.g.Ra) {
                    var Nw = V(a.o, P.g.qb)
                        , ZH = V(a.o, P.g.Eb)
                        , Ow = void 0;
                    Ow = a.D[Nw];
                    ZH(Ow || V(a.o, Nw));
                    a.isAborted = !0
                }
                a.copyToHitData(P.g.Da);
                a.copyToHitData(P.g.cb);
                zr(a);
                YF(a);
                U(69) && Bs(a) && (a.metadata.speculative = !1);
                var Pw = V(a.o, P.g.Gb);
                Pw && VE(12);
                a.metadata.em_event && VE(14);
                var lh = Pj(Qj());
                (Pw || ck(lh) || lh && lh.parent && lh.context && 5 === lh.context.source) && VE(19);
                !this.da && a.metadata.em_event && VE(18);
                var Jn = a.metadata.event_usage;
                if (Array.isArray(Jn))
                    for (var Kn = 0; Kn < Jn.length; Kn++)
                        VE(Jn[Kn]);
                var Qw = lb("GA4_EVENT");
                Qw && (a.D._eu = Qw);
                if (a.metadata.speculative || a.isAborted) {
                    a.o.onFailure();
                    UE();
                    return
                }
                var $H = this.Zj, Rw, aI = this.m, Ln;
                a: {
                    var Mn = kF(a);
                    if (Mn) {
                        if (iF(Mn, a)) {
                            Ln = Mn;
                            break a
                        }
                        O(25);
                        a.isAborted = !0
                    }
                    Ln = void 0
                }
                var bI = Ln;
                Rw = {
                    clientId: cF(a, aI),
                    Rf: bI
                };
                $H.call(this, Rw);
                this.Dc = !0;
                this.Vm(a);
                if (U(68) && X(P.g.W)) {
                    Bs(a) && (a.metadata.is_sgtm_service_worker = !0);
                    a: {}
                }
                if (Bs(a)) {
                    var dI = a.metadata.is_conversion;
                    if ("page_view" === a.eventName || dI)
                        fG(this, a, P.g.R),
                            fG(this, a, P.g.P)
                }
                this.M.Qh();
                a.copyToHitData(P.g.sg);
                V(a.o, P.g.ce) && (a.D[P.g.ce] = !0,
                Bs(a) || dG(a));
                if (a.isAborted) {
                    a.o.onFailure();
                    UE();
                    return
                }
                this.Ej(a);
                a.o.onSuccess()
            } catch (AI) {
                a.o.onFailure()
            }
            UE()
        }
        ;
        aa.Ej = function(a) {
            this.Yb.add(a)
        }
        ;
        aa.Zj = function(a) {
            var b = a.clientId
                , c = a.Rf;
            b && c && (this.m = b,
                this.H = c)
        }
        ;
        aa.flush = function() {
            this.Yb.flush()
        }
        ;
        aa.Vm = function(a) {
            var b = this;
            if (!this.Wa) {
                if (U(39)) {
                    var c = X(P.g.P)
                        , d = X(P.g.W);
                    ml([P.g.P, P.g.W], function() {
                        var f = X(P.g.P)
                            , g = X(P.g.W)
                            , h = !1
                            , m = {}
                            , n = {};
                        if (d !== g && b.F && b.H && b.m) {
                            var p = b.m;
                            if (g) {
                                var q = $E(b.F);
                                if (q) {
                                    b.m = q;
                                    var t = jF(b.F);
                                    t && (b.H = fF(t, b.H, b.F))
                                } else
                                    bF(b.m, b.F),
                                        YE(b.m, !0);
                                iF(b.H, b.F);
                                h = !0;
                                m[P.g.ff] = p
                            } else
                                b.H = void 0,
                                    b.m = void 0,
                                    G.gaGlobal = {}
                        }
                        f && !c && (h = !0,
                            n.is_consent_update = !0,
                            m[P.g.fg] = bi[P.g.P]);
                        if (h) {
                            var r = Dx(b.T, P.g.uc, m);
                            Fx(r, a.o.eventId, {
                                eventMetadata: n
                            })
                        }
                        d = g;
                        c = f
                    })
                } else {
                    var e = X(P.g.W);
                    ml([P.g.W], function() {
                        var f = X(P.g.W);
                        if (e !== f && b.F && b.H && b.m) {
                            var g = b.m;
                            if (f) {
                                var h = $E(b.F);
                                if (h) {
                                    b.m = h;
                                    var m = jF(b.F);
                                    m && (b.H = fF(m, b.H, b.F))
                                } else
                                    bF(b.m, b.F),
                                        YE(b.m, !0);
                                iF(b.H, b.F);
                                var n = {};
                                n[P.g.ff] = g;
                                var p = Dx(b.T, P.g.uc, n);
                                Fx(p, a.o.eventId, {})
                            } else
                                b.H = void 0,
                                    b.m = void 0,
                                    G.gaGlobal = {};
                            e = f
                        }
                    })
                }
                this.Wa = !0
            }
        }
        ;
        aa.Pk = function(a) {
            a.eventName !== P.g.Ra && this.M.Ok(a)
        }
        ;
        var mG = function(a) {
            function b(c, d) {
                Sh[c] || void 0 === d || (a.D[c] = d)
            }
            z(a.o.H, b);
            z(a.o.m, b)
        }
            , nG = function(a) {
            var b = wl(a.o)
                , c = function(d, e) {
                iG[d] && (a.D[d] = e)
            };
            Va(b[P.g.Uc]) ? z(b[P.g.Uc], function(d, e) {
                c((P.g.Uc + "_" + d).toLowerCase(), e)
            }) : z(b, c)
        }
            , oG = function(a) {
            var b = function(c) {
                return !!c && c.conversion
            };
            a.metadata.is_conversion = b(Ds(a));
            a.metadata.is_first_visit && (a.metadata.is_first_visit_conversion = b(Ds(a, "first_visit")));
            a.metadata.is_session_start && (a.metadata.is_session_start_conversion = b(Ds(a, "session_start")))
        }
            , pG = !1;
        function lG(a) {
            z(a, function(c) {
                "_" === c.charAt(0) && delete a[c]
            });
            var b = a[P.g.cb] || {};
            z(b, function(c) {
                "_" === c.charAt(0) && delete b[c]
            })
        }
        ;var rG = function(a) {
            if (!qG(a)) {
                var b = !1
                    , c = function() {
                    !b && qG(a) && (b = !0,
                        Bc(H, "visibilitychange", c),
                    U(4) && Bc(H, "prerenderingchange", c),
                        O(55))
                };
                Ac(H, "visibilitychange", c);
                U(4) && Ac(H, "prerenderingchange", c);
                O(54)
            }
        }
            , qG = function(a) {
                if (U(4) && "prerendering"in H ? H.prerendering : "prerender" === H.visibilityState)
                    return !1;
                a();
                return !0
            };
        var tG = function(a, b) {
            rG(function() {
                var c = Ll(a);
                if (c) {
                    var d = sG(c, b);
                    cm(a, d)
                }
            });
        };
        function sG(a, b) {
            var c = function() {};
            var d = new kG(a.id)
                , e = "MC" === a.prefix;
            c = function(f, g, h, m) {
                e && (m.eventMetadata.is_merchant_center = !0);
                d.Em(g, h, m)
            }
            ;
            Aj || uG(a, d, b);
            return c
        }
        function uG(a, b, c) {
            var d = b.M
                , e = {}
                , f = {
                eventId: c,
                eventMetadata: (e.batch_on_navigation = !0,
                    e)
            };
            U(38) && (f.deferrable = !0);
            d.Hm(function() {
                QE = !0;
                bm.flush();
                1E3 <= d.Jf() && oc.sendBeacon && dm(P.g.uc, {}, a.id, f);
                b.flush();
                d.bk(function() {
                    QE = !1;
                    d.bk()
                })
            });
        }
        ;var vG = sG;
        function xG(a, b, c) {
            var d = this;
        }
        xG.K = "internal.gtagConfig";
        function yG() {
            var a = {};
            return a
        }
        ;function AG(a, b) {}
        AG.U = "gtagSet";
        function BG(a, b) {}
        BG.U = "injectHiddenIframe";
        function CG(a, b, c, d, e) {}
        CG.K = "internal.injectHtml";
        var GG = {};
        function IG(a, b, c, d) {}
        var JG = {
            dl: 1,
            id: 1
        }
            , KG = {};
        function LG(a, b, c, d) {}
        IG.U = "injectScript";
        LG.K = "internal.injectScript";
        function MG(a) {
            var b = !0;
            return b
        }
        MG.U = "isConsentGranted";
        function NG() {
            return Zi()
        }
        NG.K = "internal.isDmaRegion";
        function OG(a) {
            var b = !1;
            return b
        }
        OG.K = "internal.isEntityInfrastructure";
        function PG() {
            var a = Vg(function(b) {
                Cz(this).log("error", b)
            });
            a.U = "JSON";
            return a
        }
        ;function QG(a) {
            var b = void 0;
            return ad(b)
        }
        QG.K = "internal.legacyParseUrl";
        function RG() {
            return !1
        }
        var SG = {
            getItem: function(a) {
                var b = null;
                return b
            },
            setItem: function(a, b) {
                return !1
            },
            removeItem: function(a) {}
        };
        function TG() {}
        TG.U = "logToConsole";
        function UG(a, b) {}
        UG.K = "internal.mergeRemoteConfig";
        function VG(a, b, c) {
            c = void 0 === c ? !0 : c;
            var d = [];
            return ad(d)
        }
        VG.K = "internal.parseCookieValuesFromString";
        function WG(a) {
            var b = void 0;
            if ("string" !== typeof a)
                return;
            a && 0 === a.indexOf("//") && (a = H.location.protocol + a);
            if ("function" === typeof URL) {
                var c;
                a: {
                    var d;
                    try {
                        d = new URL(a)
                    } catch (w) {
                        c = void 0;
                        break a
                    }
                    for (var e = {}, f = Array.from(d.searchParams), g = 0; g < f.length; g++) {
                        var h = f[g][0]
                            , m = f[g][1];
                        e.hasOwnProperty(h) ? "string" === typeof e[h] ? e[h] = [e[h], m] : e[h].push(m) : e[h] = m
                    }
                    c = ad({
                        href: d.href,
                        origin: d.origin,
                        protocol: d.protocol,
                        username: d.username,
                        password: d.password,
                        host: d.host,
                        hostname: d.hostname,
                        port: d.port,
                        pathname: d.pathname,
                        search: d.search,
                        searchParams: e,
                        hash: d.hash
                    })
                }
                return c
            }
            var n;
            try {
                n = lj(a)
            } catch (w) {
                return
            }
            if (!n.protocol || !n.host)
                return;
            var p = {};
            if (n.search)
                for (var q = n.search.replace("?", "").split("&"), t = 0; t < q.length; t++) {
                    var r = q[t].split("=")
                        , u = r[0]
                        , v = decodeURIComponent(r.splice(1).join("=")).replace(/\+/g, " ");
                    p.hasOwnProperty(u) ? "string" === typeof p[u] ? p[u] = [p[u], v] : p[u].push(v) : p[u] = v
                }
            n.searchParams = p;
            n.origin = n.protocol + "//" + n.host;
            n.username = "";
            n.password = "";
            b = ad(n);
            return b
        }
        WG.U = "parseUrl";
        function XG(a) {}
        XG.K = "internal.processAsNewEvent";
        function YG(a, b, c) {
            var d;
            return d
        }
        YG.K = "internal.pushToDataLayer";
        function ZG(a) {
            var b = !1;
            return b
        }
        ZG.U = "queryPermission";
        function $G() {
            var a = "";
            return a
        }
        $G.U = "readCharacterSet";
        function aH() {
            return gi.Ya
        }
        aH.K = "internal.readDataLayerName";
        function bH() {
            var a = "";
            return a
        }
        bH.U = "readTitle";
        function cH(a, b) {
            var c = this;
            K(this.getName(), ["destinationId:!string", "callback:!Fn"], arguments),
                Ar(a, function(d) {
                    b.invoke(c.J, ad(d, c.J, 1))
                });
        }
        cH.K = "internal.registerCcdCallback";
        function dH(a) {
            return !0
        }
        dH.K = "internal.registerDestination";
        var eH = ["config", "event", "get", "set"];
        function fH(a, b, c) {}
        fH.K = "internal.registerGtagCommandListener";
        function gH(a, b) {
            var c = !1;
            return c
        }
        gH.K = "internal.removeDataLayerEventListener";
        function hH(a, b) {}
        hH.K = "internal.removeFormData";
        function iH() {}
        iH.U = "resetDataLayer";
        function jH(a, b, c, d) {
            K(this.getName(), ["destinationIds:!*", "eventName:!*", "eventParameters:?PixieMap", "messageContext:?PixieMap"], arguments);
            var e = c ? J(c) : {}
                , f = J(a);
            Array.isArray(f) || (f = [f]);
            b = String(b);
            var g = d ? J(d) : {}
                , h = Cz(this);
            g.originatingEntity = sA(h);
            var m = f;
            for (var n = 0; n < m.length; n++) {
                var p = m[n];
                if ("string" === typeof p) {
                    var q = {};
                    k(e, q);
                    var t = {};
                    k(g, t);
                    var r = Dx(p, b, q);
                    Fx(r, g.eventId || h.eventId, t)
                }
            }
        }
        jH.K = "internal.sendGtagEvent";
        function kH(a, b, c) {}
        kH.U = "sendPixel";
        function lH(a, b) {}
        lH.K = "internal.setAnchorHref";
        function mH(a, b, c, d) {
            var e = this;
            d = void 0 === d ? !0 : d;
            var f = !1;
            return f
        }
        mH.U = "setCookie";
        function nH(a) {}
        nH.K = "internal.setCorePlatformServices";
        function oH(a, b) {}
        oH.K = "internal.setDataLayerValue";
        function pH(a) {}
        pH.U = "setDefaultConsentState";
        function qH(a, b) {}
        qH.K = "internal.setDelegatedConsentType";
        function rH(a, b) {}
        rH.K = "internal.setFormAction";
        function sH(a, b, c) {}
        sH.K = "internal.setInCrossContainerData";
        function tH(a, b, c) {
            return !1
        }
        tH.U = "setInWindow";
        function uH(a, b, c) {
            K(this.getName(), ["targetId:!string", "name:!string", "value:!*"], arguments);
            var d = xq(a) || {};
            d[b] = J(c, this.J);
            var e = a;
            vq || wq();
            uq[e] = d;
        }
        uH.K = "internal.setProductSettingsParameter";
        function vH(a, b, c) {
            K(this.getName(), ["targetId:!string", "name:!string", "value:!*"], arguments);
            for (var d = b.split("."), e = gm(a), f = 0; f < d.length - 1; f++) {
                if (void 0 === e[d[f]])
                    e[d[f]] = {};
                else if (!Va(e[d[f]]))
                    throw Error("setRemoteConfigParameter failed, path contains a non-object type: " + d[f]);
                e = e[d[f]]
            }
            e[d[f]] = J(c, this.J, 1);
        }
        vH.K = "internal.setRemoteConfigParameter";
        function wH(a, b, c, d) {
            var e = this;
        }
        wH.U = "sha256";
        function xH(a, b, c) {}
        xH.K = "internal.sortRemoteConfigParameters";
        var yH = {}
            , zH = {};
        yH.getItem = function(a) {
            var b = null;
            L(this, "access_template_storage");
            var c = Cz(this).hc();
            zH[c] && (b = zH[c].hasOwnProperty("gtm." + a) ? zH[c]["gtm." + a] : null);
            return b
        }
        ;
        yH.setItem = function(a, b) {
            L(this, "access_template_storage");
            var c = Cz(this).hc();
            zH[c] = zH[c] || {};
            zH[c]["gtm." + a] = b;
        }
        ;
        yH.removeItem = function(a) {
            L(this, "access_template_storage");
            var b = Cz(this).hc();
            if (!zH[b] || !zH[b].hasOwnProperty("gtm." + a))
                return;
            delete zH[b]["gtm." + a];
        }
        ;
        yH.clear = function() {
            L(this, "access_template_storage"),
                delete zH[Cz(this).hc()];
        }
        ;
        yH.U = "templateStorage";
        function AH(a, b) {
            var c = !1;
            return c
        }
        AH.K = "internal.testRegex";
        function BH(a) {
            var b;
            return b
        }
        ;function CH(a) {
            var b;
            return b
        }
        CH.K = "internal.unsiloId";
        function DH(a) {}
        DH.U = "updateConsentState";
        var EH;
        function FH(a, b, c) {
            EH = EH || new fh;
            EH.add(a, b, c)
        }
        function GH(a, b) {
            var c = EH = EH || new fh;
            if (c.F.hasOwnProperty(a))
                throw "Attempting to add a private function which already exists: " + a + ".";
            if (c.m.hasOwnProperty(a))
                throw "Attempting to add a private function with an existing API name: " + a + ".";
            c.F[a] = ob(b) ? Bg(a, b) : Cg(a, b)
        }
        function HH() {
            return function(a) {
                var b;
                var c = EH;
                if (c.m.hasOwnProperty(a))
                    b = c.get(a, this);
                else {
                    var d;
                    if (d = c.F.hasOwnProperty(a)) {
                        var e = !1
                            , f = this.J.m;
                        if (f) {
                            var g = f.hc();
                            if (g) {
                                0 !== g.indexOf("__cvt_") && (e = !0);
                            }
                        } else
                            e = !0;
                        d = e
                    }
                    if (d) {
                        var h = c.F.hasOwnProperty(a) ? c.F[a] : void 0;
                        b = h
                    } else
                        throw Error(a + " is not a valid API name.");
                }
                return b
            }
        }
        ;var IH = function() {
            var a = function(c) {
                return GH(c.K, c)
            }
                , b = function(c) {
                return FH(c.U, c)
            };
            b(wz);
            b(Dz);
            b(RA);
            b(UA);
            b(VA);
            b($A);
            b(bB);
            b(eB);
            b(gB);
            b(tE);
            b(uE);
            b(JE);
            b(KE);
            b(LE);
            b(OE);
            b(AG);
            b(BG);
            b(IG);
            b(MG);
            b(TG);
            b(WG);
            b(ZG);
            b($G);
            b(bH);
            b(kH);
            b(mH);
            b(pH);
            b(tH);
            b(wH);
            b(yH);
            b(DH);
            b(PG());
            FH("Math", Hg());
            FH("Object", dh);
            FH("TestHelper", hh());
            FH("assertApi", Dg);
            FH("assertThat", Eg);
            FH("decodeUri", Ig);
            FH("decodeUriComponent", Jg);
            FH("encodeUri", Kg);
            FH("encodeUriComponent", Lg);
            FH("fail", Rg);
            FH("generateRandom", Sg);
            FH("getTimestamp", Tg);
            FH("getTimestampMillis", Tg);
            FH("getType", Ug);
            FH("makeInteger", Wg);
            FH("makeNumber", Xg);
            FH("makeString", Yg);
            FH("makeTableMap", Zg);
            FH("mock", bh);
            FH("fromBase64", rE, !("atob"in G));
            FH("localStorage", SG, !RG());
            FH("toBase64", BH, !("btoa"in G));
            a(zz);
            a(Uz);
            a(fA);
            a(mA);
            a(rA);
            a(GA);
            a(PA);
            a(SA);
            a(WA);
            a(XA);
            a(ZA);
            a(aB);
            a(cB);
            a(dB);
            a(fB);
            a(hB);
            a(jB);
            a(kB);
            a(lB);
            a(mB);
            a(qB);
            a(zB);
            a(AB);
            a(LB);
            a(QB);
            a(VB);
            a(dC);
            a(iC);
            a(vC);
            a(xC);
            a(LC);
            a(Mg);
            a(NC);
            a(pE);
            a(qE);
            a(vE);
            a(wE);
            a(xE);
            a(yE);
            a(zE);
            a(AE);
            a(BE);
            a(CE);
            a(DE);
            a(EE);
            a(GE);
            a(HE);
            a(IE);
            a(ME);
            a(NE);
            a(xG);
            a(CG);
            a(LG);
            a(NG);
            a(OG);
            a(QG);
            a(EA);
            a(UG);
            a(VG);
            a(XG);
            a(YG);
            a(aH);
            a(cH);
            a(dH);
            a(fH);
            a(gH);
            a(hH);
            a(jH);
            a(lH);
            a(nH);
            a(oH);
            a(qH);
            a(rH);
            a(sH);
            a(uH);
            a(vH);
            a(xH);
            a(AH);
            a(CH);
            GH("internal.CrossContainerSchema", iB());
            GH("internal.GtagSchema", yG());
            FH("mockObject", ch);
            return HH()
        };
        var uz;
        function JH() {
            uz.m.m.M = function(a, b, c) {
                hi.SANDBOXED_JS_SEMAPHORE = hi.SANDBOXED_JS_SEMAPHORE || 0;
                hi.SANDBOXED_JS_SEMAPHORE++;
                try {
                    return a.apply(b, c)
                } finally {
                    hi.SANDBOXED_JS_SEMAPHORE--
                }
            }
        }
        function KH(a) {
            a && z(a, function(b, c) {
                for (var d = 0; d < c.length; d++) {
                    var e = c[d].replace(/^_*/, "");
                    wi[e] = wi[e] || [];
                    wi[e].push(b)
                }
            })
        }
        ;var LH = encodeURI
            , Y = encodeURIComponent
            , MH = Array.isArray
            , NH = function(a, b, c) {
                zc(a, b, c)
            }
            , OH = function(a, b) {
                if (!a)
                    return !1;
                var c = hj(lj(a), "host");
                if (!c)
                    return !1;
                for (var d = 0; b && d < b.length; d++) {
                    var e = b[d] && b[d].toLowerCase();
                    if (e) {
                        var f = c.length - e.length;
                        0 < f && "." != e.charAt(0) && (f--,
                            e = "." + e);
                        if (0 <= f && c.indexOf(e, f) == f)
                            return !0
                    }
                }
                return !1
            }
            , PH = function(a, b, c) {
                for (var d = {}, e = !1, f = 0; a && f < a.length; f++)
                    a[f] && a[f].hasOwnProperty(b) && a[f].hasOwnProperty(c) && (d[a[f][b]] = a[f][c],
                        e = !0);
                return e ? d : null
            };
        var kI = G.clearTimeout
            , lI = G.setTimeout
            , mI = function(a, b, c) {
            if (On()) {
                b && I(b)
            } else
                return wc(a, b, c)
        }
            , nI = function() {
            return G.location.href
        }
            , oI = function(a) {
            return hj(lj(a), "fragment")
        }
            , pI = function(a) {
            return ij(lj(a))
        }
            , qI = function(a, b) {
            return Gi(a, b || 2)
        }
            , rI = function(a, b, c) {
            return b ? ry(a, b, c) : qy(a)
        }
            , sI = function(a, b) {
            G[a] = b
        }
            , tI = function(a, b, c) {
            b && (void 0 === G[a] || c && !G[a]) && (G[a] = b);
            return G[a]
        }
            , uI = function(a, b) {
            if (On()) {
                b && I(b)
            } else
                yc(a, b)
        }
            , vI = function(a) {
            return !!Fz(a, "init", !1)
        }
            , wI = function(a) {
            Gz(a, "init", !0)
        };

        var xI = {};
        var Z = {
            securityGroups: {}
        };

        Z.securityGroups.access_template_storage = ["google"],
            Z.__access_template_storage = function() {
                return {
                    assert: function() {},
                    O: function() {
                        return {}
                    }
                }
            }
            ,
            Z.__access_template_storage.C = "access_template_storage",
            Z.__access_template_storage.isVendorTemplate = !0,
            Z.__access_template_storage.priorityOverride = 0,
            Z.__access_template_storage.isInfrastructure = !1,
            Z.__access_template_storage.runInSiloedMode = !1;
        Z.securityGroups.c = ["google"],
            Z.__c = function(a) {
                return a.vtp_value
            }
            ,
            Z.__c.C = "c",
            Z.__c.isVendorTemplate = !0,
            Z.__c.priorityOverride = 0,
            Z.__c.isInfrastructure = !0,
            Z.__c.runInSiloedMode = !0;
        Z.securityGroups.e = ["google"],
            Z.__e = function(a) {
                return String(a.vtp_gtmCachedValues.event)
            }
            ,
            Z.__e.C = "e",
            Z.__e.isVendorTemplate = !0,
            Z.__e.priorityOverride = 0,
            Z.__e.isInfrastructure = !0,
            Z.__e.runInSiloedMode = !0;
        Z.securityGroups.v = ["google"],
            Z.__v = function(a) {
                var b = a.vtp_name;
                if (!b || !b.replace)
                    return !1;
                var c = qI(b.replace(/\\\./g, "."), a.vtp_dataLayerVersion || 1);
                return void 0 !== c ? c : a.vtp_defaultValue
            }
            ,
            Z.__v.C = "v",
            Z.__v.isVendorTemplate = !0,
            Z.__v.priorityOverride = 0,
            Z.__v.isInfrastructure = !0,
            Z.__v.runInSiloedMode = !1;

        Z.securityGroups.read_event_data = ["google"],
            function() {
                function a(b, c) {
                    return {
                        key: c
                    }
                }
                (function(b) {
                        Z.__read_event_data = b;
                        Z.__read_event_data.C = "read_event_data";
                        Z.__read_event_data.isVendorTemplate = !0;
                        Z.__read_event_data.priorityOverride = 0;
                        Z.__read_event_data.isInfrastructure = !1;
                        Z.__read_event_data.runInSiloedMode = !1
                    }
                )(function(b) {
                    var c = b.vtp_eventDataAccess
                        , d = b.vtp_keyPatterns || []
                        , e = b.vtp_createPermissionError;
                    return {
                        assert: function(f, g) {
                            if (null != g && !l(g))
                                throw e(f, {
                                    key: g
                                }, "Key must be a string.");
                            if ("any" !== c) {
                                try {
                                    if ("specific" === c && null != g && dg(g, d))
                                        return
                                } catch (h) {
                                    throw e(f, {
                                        key: g
                                    }, "Invalid key filter.");
                                }
                                throw e(f, {
                                    key: g
                                }, "Prohibited read from event data.");
                            }
                        },
                        O: a
                    }
                })
            }();

        Z.securityGroups.process_dom_events = ["google"],
            function() {
                function a(b, c, d) {
                    return {
                        targetType: c,
                        eventName: d
                    }
                }
                (function(b) {
                        Z.__process_dom_events = b;
                        Z.__process_dom_events.C = "process_dom_events";
                        Z.__process_dom_events.isVendorTemplate = !0;
                        Z.__process_dom_events.priorityOverride = 0;
                        Z.__process_dom_events.isInfrastructure = !1;
                        Z.__process_dom_events.runInSiloedMode = !1
                    }
                )(function(b) {
                    for (var c = b.vtp_targets || [], d = b.vtp_createPermissionError, e = {}, f = 0; f < c.length; f++) {
                        var g = c[f];
                        e[g.targetType] = e[g.targetType] || [];
                        e[g.targetType].push(g.eventName)
                    }
                    return {
                        assert: function(h, m, n) {
                            if (!e[m])
                                throw d(h, {}, "Prohibited event target " + m + ".");
                            if (-1 === e[m].indexOf(n))
                                throw d(h, {}, "Prohibited listener registration for DOM event " + n + ".");
                        },
                        O: a
                    }
                })
            }();
        Z.securityGroups.detect_youtube_activity_events = ["google"],
            function() {
                function a(b, c) {
                    return {
                        options: {
                            fixMissingApi: !!c.fixMissingApi
                        }
                    }
                }
                (function(b) {
                        Z.__detect_youtube_activity_events = b;
                        Z.__detect_youtube_activity_events.C = "detect_youtube_activity_events";
                        Z.__detect_youtube_activity_events.isVendorTemplate = !0;
                        Z.__detect_youtube_activity_events.priorityOverride = 0;
                        Z.__detect_youtube_activity_events.isInfrastructure = !1;
                        Z.__detect_youtube_activity_events.runInSiloedMode = !1
                    }
                )(function(b) {
                    var c = !!b.vtp_allowFixMissingJavaScriptApi
                        , d = b.vtp_createPermissionError;
                    return {
                        assert: function(e, f) {
                            if (!c && f && f.fixMissingApi)
                                throw d(e, {}, "Prohibited option: fixMissingApi.");
                        },
                        O: a
                    }
                })
            }();

        Z.securityGroups.detect_history_change_events = ["google"],
            function() {
                function a() {
                    return {}
                }
                (function(b) {
                        Z.__detect_history_change_events = b;
                        Z.__detect_history_change_events.C = "detect_history_change_events";
                        Z.__detect_history_change_events.isVendorTemplate = !0;
                        Z.__detect_history_change_events.priorityOverride = 0;
                        Z.__detect_history_change_events.isInfrastructure = !1;
                        Z.__detect_history_change_events.runInSiloedMode = !1
                    }
                )(function() {
                    return {
                        assert: function() {},
                        O: a
                    }
                })
            }();

        Z.securityGroups.detect_link_click_events = ["google"],
            function() {
                function a(b, c) {
                    return {
                        options: c
                    }
                }
                (function(b) {
                        Z.__detect_link_click_events = b;
                        Z.__detect_link_click_events.C = "detect_link_click_events";
                        Z.__detect_link_click_events.isVendorTemplate = !0;
                        Z.__detect_link_click_events.priorityOverride = 0;
                        Z.__detect_link_click_events.isInfrastructure = !1;
                        Z.__detect_link_click_events.runInSiloedMode = !1
                    }
                )(function(b) {
                    var c = b.vtp_allowWaitForTags
                        , d = b.vtp_createPermissionError;
                    return {
                        assert: function(e, f) {
                            if (!c && f && f.waitForTags)
                                throw d(e, {}, "Prohibited option waitForTags.");
                        },
                        O: a
                    }
                })
            }();
        Z.securityGroups.read_container_data = ["google"],
            Z.__read_container_data = function() {
                return {
                    assert: function() {},
                    O: function() {
                        return {}
                    }
                }
            }
            ,
            Z.__read_container_data.C = "read_container_data",
            Z.__read_container_data.isVendorTemplate = !0,
            Z.__read_container_data.priorityOverride = 0,
            Z.__read_container_data.isInfrastructure = !1,
            Z.__read_container_data.runInSiloedMode = !1;

        Z.securityGroups.listen_data_layer = ["google"],
            function() {
                function a(b, c) {
                    return {
                        eventName: c
                    }
                }
                (function(b) {
                        Z.__listen_data_layer = b;
                        Z.__listen_data_layer.C = "listen_data_layer";
                        Z.__listen_data_layer.isVendorTemplate = !0;
                        Z.__listen_data_layer.priorityOverride = 0;
                        Z.__listen_data_layer.isInfrastructure = !1;
                        Z.__listen_data_layer.runInSiloedMode = !1
                    }
                )(function(b) {
                    var c = b.vtp_accessType
                        , d = b.vtp_allowedEvents || []
                        , e = b.vtp_createPermissionError;
                    return {
                        assert: function(f, g) {
                            if (!l(g))
                                throw e(f, {
                                    eventName: g
                                }, "Event name must be a string.");
                            if (!("any" === c || "specific" === c && 0 <= d.indexOf(g)))
                                throw e(f, {
                                    eventName: g
                                }, "Prohibited listen on data layer event.");
                        },
                        O: a
                    }
                })
            }();

        Z.securityGroups.get_url = ["google"],
            function() {
                function a(b, c, d) {
                    return {
                        component: c,
                        queryKey: d
                    }
                }
                (function(b) {
                        Z.__get_url = b;
                        Z.__get_url.C = "get_url";
                        Z.__get_url.isVendorTemplate = !0;
                        Z.__get_url.priorityOverride = 0;
                        Z.__get_url.isInfrastructure = !1;
                        Z.__get_url.runInSiloedMode = !1
                    }
                )(function(b) {
                    var c = "any" === b.vtp_urlParts ? null : [];
                    c && (b.vtp_protocol && c.push("protocol"),
                    b.vtp_host && c.push("host"),
                    b.vtp_port && c.push("port"),
                    b.vtp_path && c.push("path"),
                    b.vtp_extension && c.push("extension"),
                    b.vtp_query && c.push("query"),
                    b.vtp_fragment && c.push("fragment"));
                    var d = c && "any" !== b.vtp_queriesAllowed ? b.vtp_queryKeys || [] : null
                        , e = b.vtp_createPermissionError;
                    return {
                        assert: function(f, g, h) {
                            if (g) {
                                if (!l(g))
                                    throw e(f, {}, "URL component must be a string.");
                                if (c && 0 > c.indexOf(g))
                                    throw e(f, {}, "Prohibited URL component: " + g);
                                if ("query" === g && d) {
                                    if (!h)
                                        throw e(f, {}, "Prohibited from getting entire URL query when query keys are specified.");
                                    if (!l(h))
                                        throw e(f, {}, "Query key must be a string.");
                                    if (0 > d.indexOf(h))
                                        throw e(f, {}, "Prohibited query key: " + h);
                                }
                            } else if (c)
                                throw e(f, {}, "Prohibited from getting entire URL when components are specified.");
                        },
                        O: a
                    }
                })
            }();

        Z.securityGroups.gct = ["google"],
            function() {
                function a(b) {
                    for (var c = [], d = 0; d < b.length; d++)
                        try {
                            c.push(new RegExp(b[d]))
                        } catch (e) {}
                    return c
                }
                (function(b) {
                        Z.__gct = b;
                        Z.__gct.C = "gct";
                        Z.__gct.isVendorTemplate = !0;
                        Z.__gct.priorityOverride = 0;
                        Z.__gct.isInfrastructure = !1;
                        Z.__gct.runInSiloedMode = !0
                    }
                )(function(b) {
                    var c = {}
                        , d = b.vtp_sessionDuration;
                    0 < d && (c[P.g.nd] = d);
                    c[P.g.Vd] = b.vtp_eventSettings;
                    c[P.g.hg] = b.vtp_dynamicEventSettings;
                    c[P.g.Tb] = 1 === b.vtp_googleSignals;
                    c[P.g.ug] = b.vtp_foreignTld;
                    c[P.g.rg] = 1 === b.vtp_restrictDomain;
                    c[P.g.hf] = b.vtp_internalTrafficResults;
                    var e = P.g.xa
                        , f = b.vtp_linker;
                    f && f[P.g.Z] && (f[P.g.Z] = a(f[P.g.Z]));
                    c[e] = f;
                    var g = P.g.jf
                        , h = b.vtp_referralExclusionDefinition;
                    h && h.include_conditions && (h.include_conditions = a(h.include_conditions));
                    c[g] = h;
                    var m = Sj(b.vtp_trackingId);
                    hm(m, c);
                    tG(m, b.vtp_gtmEventId);
                    I(b.vtp_gtmOnSuccess)
                })
            }();

        Z.securityGroups.get = ["google"],
            Z.__get = function(a) {
                var b = a.vtp_settings
                    , c = b.eventParameters || {}
                    , d = String(a.vtp_eventName)
                    , e = {};
                e.eventId = a.vtp_gtmEventId;
                e.priorityId = a.vtp_gtmPriorityId;
                a.vtp_deferrable && (e.deferrable = !0);
                var f = Dx(String(b.streamId), d, c);
                Fx(f, e.eventId, e);
                a.vtp_gtmOnSuccess()
            }
            ,
            Z.__get.C = "get",
            Z.__get.isVendorTemplate = !0,
            Z.__get.priorityOverride = 0,
            Z.__get.isInfrastructure = !1,
            Z.__get.runInSiloedMode = !1;
        Z.securityGroups.detect_scroll_events = ["google"],
            function() {
                function a() {
                    return {}
                }
                (function(b) {
                        Z.__detect_scroll_events = b;
                        Z.__detect_scroll_events.C = "detect_scroll_events";
                        Z.__detect_scroll_events.isVendorTemplate = !0;
                        Z.__detect_scroll_events.priorityOverride = 0;
                        Z.__detect_scroll_events.isInfrastructure = !1;
                        Z.__detect_scroll_events.runInSiloedMode = !1
                    }
                )(function() {
                    return {
                        assert: function() {},
                        O: a
                    }
                })
            }();

        var yI = {};
        yI.dataLayer = Hi;
        yI.callback = function(a) {
            vi.hasOwnProperty(a) && ob(vi[a]) && vi[a]();
            delete vi[a]
        }
        ;
        yI.bootstrap = 0;
        yI._spx = !1;
        function zI() {
            hi[Gj()] = hi[Gj()] || yI;
            Wj();
            ak() || z(bk(), function(d, e) {
                Rv(d, e.transportUrl, e.context);
                O(92)
            });
            Fb(wi, Z.securityGroups);
            var a = Pj(Qj()), b, c = null == a ? void 0 : null == (b = a.context) ? void 0 : b.source;
            2 !== c && 4 !== c && 3 !== c || O(142);
            jf = Af
        }
        (function(a) {
                function b() {
                    n = H.documentElement.getAttribute("data-tag-assistant-present");
                    By(n) && (m = h.dj)
                }
                function c() {
                    m && qc ? g(m) : a()
                }
                if (!G["__TAGGY_INSTALLED"]) {
                    var d = !1;
                    if (H.referrer) {
                        var e = lj(H.referrer);
                        d = "cct.google" === gj(e, "host")
                    }
                    if (!d) {
                        var f = Xn("googTaggyReferrer");
                        d = !(!f.length || !f[0].length)
                    }
                    d && (G["__TAGGY_INSTALLED"] = !0,
                        wc("https://cct.google/taggy/agent.js"))
                }
                var g = function(u) {
                    var v = "GTM"
                        , w = "GTM";
                    mi && (v = "OGT",
                        w = "GTAG");
                    var x = G["google.tagmanager.debugui2.queue"];
                    x || (x = [],
                        G["google.tagmanager.debugui2.queue"] = x,
                        wc("https://" + gi.Hd + "/debug/bootstrap?id=" + Gf.ctid + "&src=" + w + "&cond=" + u + "&gtm=" + Qn()));
                    var y = {
                        messageType: "CONTAINER_STARTING",
                        data: {
                            scriptSource: qc,
                            containerProduct: v,
                            debug: !1,
                            id: Gf.ctid,
                            targetRef: {
                                ctid: Gf.ctid,
                                isDestination: zj.je
                            },
                            aliases: Cj(),
                            destinations: Fj()
                        }
                    };
                    y.data.resume = function() {
                        a()
                    }
                    ;
                    gi.sk && (y.data.initialPublish = !0);
                    x.push(y)
                }
                    , h = {
                    Mk: 1,
                    fj: 2,
                    tj: 3,
                    ji: 4,
                    dj: 5
                };
                h[h.Mk] = "GTM_DEBUG_LEGACY_PARAM";
                h[h.fj] = "GTM_DEBUG_PARAM";
                h[h.tj] = "REFERRER";
                h[h.ji] = "COOKIE";
                h[h.dj] = "EXTENSION_PARAM";
                var m = void 0
                    , n = void 0
                    , p = hj(G.location, "query", !1, void 0, "gtm_debug");
                By(p) && (m = h.fj);
                if (!m && H.referrer) {
                    var q = lj(H.referrer);
                    "tagassistant.google.com" === gj(q, "host") && (m = h.tj)
                }
                if (!m) {
                    var t = Xn("__TAG_ASSISTANT");
                    t.length && t[0].length && (m = h.ji)
                }
                m || b();
                if (!m && Cy(n)) {
                    var r = !1;
                    Ac(H, "TADebugSignal", function() {
                        r || (r = !0,
                            b(),
                            c())
                    }, !1);
                    G.setTimeout(function() {
                        r || (r = !0,
                            b(),
                            c())
                    }, 200)
                } else
                    c()
            }
        )(function() {
            try {
                Uj();
                if (U(57)) {}
                Tk().F();
                nn();
                rl();
                var a = Ij();
                if (wj().canonical[a]) {
                    var b = hi.zones;
                    b && b.unregisterChild(Bj());
                    Dv().removeExternalRestrictions(Ij());
                } else {
                    lt();
                    zi.m = "";
                    zi.F = zi.M;
                    zi.H = "";
                    zi.da = "ad_storage|analytics_storage|ad_user_data|ad_personalization";
                    zi.T = "ad_storage|analytics_storage|ad_user_data";
                    zi.Wa = "";
                    Ov();
                    for (var c = data.resource || {}, d = c.macros || [], e = 0; e < d.length; e++)
                        Ze.push(d[e]);
                    for (var f = c.tags || [], g = 0; g < f.length; g++)
                        bf.push(f[g]);
                    for (var h = c.predicates || [], m = 0; m < h.length; m++)
                        af.push(h[m]);
                    for (var n = c.rules || [], p = 0; p < n.length; p++) {
                        for (var q = n[p], t = {}, r = 0; r < q.length; r++) {
                            var u = q[r][0];
                            t[u] = Array.prototype.slice.call(q[r], 1);
                            "if" !== u && "unless" !== u || hf(t[u])
                        }
                        $e.push(t)
                    }
                    df = Z;
                    ef = gz;
                    Cf = new Jf;
                    var v = data.sandboxed_scripts
                        , w = data.security_groups;
                    a: {
                        var x = data.runtime || []
                            , y = data.runtime_lines;
                        uz = new we;
                        JH();
                        Ye = tz();
                        var B = uz
                            , A = IH()
                            , E = new Tc("require",A);
                        E.Lb();
                        B.m.m.set("require", E);
                        for (var D = [], C = 0; C < x.length; C++) {
                            var F = x[C];
                            if (!Array.isArray(F) || 3 > F.length) {
                                if (0 === F.length)
                                    continue;
                                break a
                            }
                            y && y[C] && y[C].length && tf(F, y[C]);
                            try {
                                uz.execute(F),
                                U(63) && nk && 50 === F[0] && D.push(F[1])
                            } catch (wa) {}
                        }
                        U(63) && (kf = D)
                    }
                    if (v && v.length)
                        for (var N = ["sandboxedScripts"], M = 0; M < v.length; M++) {
                            var Q = v[M].replace(/^_*/, "");
                            wi[Q] = N
                        }
                    KH(w);
                    zI();
                    if (!qi)
                        for (var W = Zi() ? Bi(zi.T) : Bi(zi.da), S = 0; S < fl.length; S++) {
                            var R = fl[S]
                                , ia = R
                                , ea = W[R] ? "granted" : "denied";
                            Nk().implicit(ia, ea)
                        }
                    Ay();
                    Sv = !1;
                    Tv = 0;
                    if ("interactive" === H.readyState && !H.createEventObject || "complete" === H.readyState)
                        Vv();
                    else {
                        Ac(H, "DOMContentLoaded", Vv);
                        Ac(H, "readystatechange", Vv);
                        if (H.createEventObject && H.documentElement.doScroll) {
                            var ca = !0;
                            try {
                                ca = !G.frameElement
                            } catch (wa) {}
                            ca && Wv()
                        }
                        Ac(G, "load", Vv)
                    }
                    fy = !1;
                    "complete" === H.readyState ? hy() : Ac(G, "load", hy);
                    nk && (hk(Bk),
                    U(23) && ik(Bk),
                        G.setInterval(Ak, 864E5));
                    hk(jz);
                    hk(Xw);
                    hk(ru);
                    hk(Sl);
                    hk(hx);
                    ik(am);
                    hk($s);
                    ik(Hk);
                    U(63) && (hk(bx),
                        hk(cx),
                        hk(dx));
                    nk && U(54) && (hk(kz),
                        hk(mz));
                    qz();
                    ik(Lk);
                    U(82) && ik(Lx);
                    U(62) && ik(oz);
                    Xy();
                    Vi(1);
                    CA();
                    ui = Cb();
                    yI.bootstrap = ui;
                    if (U(57)) {}
                }
            } catch (wa) {
                if (Vi(4),
                    nk) {
                    var na = uk(!1, !0, !0);
                    zc(na)
                }
            }
        });

    }
)()

