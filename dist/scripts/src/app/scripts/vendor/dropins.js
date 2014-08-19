(function () {
    var G, a, w, B, h, A, i, j, r, n, C, o, s, q, t, x, z, g, m, u, v, l, p, F, E, D, k, e, d, c, b, y = [].slice, f = [].indexOf || function (J) {
        for (var I = 0, H = this.length; I < H; I++) {
            if (I in this && this[I] === J) {
                return I
            }
        }
        return -1
    };
    if ((k = window.Dropbox) == null) {
        window.Dropbox = {}
    }
    if ((e = Dropbox.baseUrl) == null) {
        Dropbox.baseUrl = "https://www.dropbox.com"
    }
    if ((d = Dropbox.blockBaseUrl) == null) {
        Dropbox.blockBaseUrl = "https://dl.dropbox.com"
    }
    Dropbox.addListener = function (J, I, H) {
        if (J.addEventListener) {
            J.addEventListener(I, H, false)
        } else {
            J.attachEvent("on" + I, function (K) {
                K.preventDefault = function () {
                    return this.returnValue = false
                };
                return H(K)
            })
        }
    };
    Dropbox.removeListener = function (J, I, H) {
        if (J.removeEventListener) {
            J.removeEventListener(I, H, false)
        } else {
            J.detachEvent("on" + I, H)
        }
    };
    B = function (I) {
        var J, H;
        H = encodeURIComponent(Dropbox.VERSION);
        J = I.indexOf("?") === -1 ? "?" : "&";
        return"" + I + J + "version=" + H
    };
    A = function (R, N) {
        var P, O, M, H, L, Q, J, I, K;
        Q = encodeURIComponent(window.location.protocol + "//" + window.location.host);
        P = encodeURIComponent(Dropbox.appKey);
        H = encodeURIComponent(R.linkType || "");
        J = encodeURIComponent(R._trigger || "js");
        L = Boolean(R.multiselect);
        O = encodeURIComponent(((K = R.extensions) != null ? typeof K.join === "function" ? K.join(" ") : void 0 : void 0) || "");
        M = Boolean(R.folderselect);
        N = Boolean(N);
        I = "" + Dropbox.baseUrl + "/chooser?origin=" + Q + "&app_key=" + P + "&link_type=" + H;
        I += "&trigger=" + J + "&multiselect=" + L + "&extensions=" + O + "&folderselect=" + M + "&iframe=" + N;
        return B(I)
    };
    F = function (J) {
        var K, H, I;
        H = encodeURIComponent(window.location.protocol + "//" + window.location.host);
        K = encodeURIComponent(Dropbox.appKey);
        I = "" + Dropbox.baseUrl + "/saver?origin=" + H + "&app_key=" + K;
        return B(I)
    };
    m = 1;
    q = function (I, K) {
        var M, J, L, H;
        M = encodeURIComponent(Dropbox.appKey);
        H = "" + Dropbox.baseUrl + "/dropins/job_status?job=" + K + "&app_key=" + M;
        H = B(H);
        L = function (O) {
            var N;
            if (O.status === "COMPLETE") {
                if (typeof I.progress === "function") {
                    I.progress(1)
                }
                if (typeof I.success === "function") {
                    I.success()
                }
            } else {
                if ((N = O.status) === "PENDING" || N === "DOWNLOADING") {
                    if (O.progress != null) {
                        if (typeof I.progress === "function") {
                            I.progress(O.progress / 100)
                        }
                    }
                    setTimeout(J, 1500)
                } else {
                    if (O.status === "FAILED") {
                        if (typeof I.error === "function") {
                            I.error(O.error)
                        }
                    }
                }
            }
        };
        if ("withCredentials" in new XMLHttpRequest()) {
            J = function () {
                var N;
                N = new XMLHttpRequest();
                N.onload = function () {
                    return L(JSON.parse(N.responseText))
                };
                N.onerror = function () {
                    return typeof I.error === "function" ? I.error() : void 0
                };
                N.open("GET", H, true);
                return N.send()
            }
        } else {
            if (!Dropbox.disableJSONP) {
                J = function () {
                    var P, O, N;
                    P = "DropboxJsonpCallback" + m++;
                    O = false;
                    window[P] = function (Q) {
                        O = true;
                        return L(Q)
                    };
                    N = document.createElement("script");
                    N.src = "" + H + "&callback=" + P;
                    N.onreadystatechange = function () {
                        var Q;
                        if (N.readyState === "loaded") {
                            if (!O) {
                                if (typeof I.error === "function") {
                                    I.error()
                                }
                            }
                            return(Q = N.parentNode) != null ? Q.removeChild(N) : void 0
                        }
                    };
                    return document.getElementsByTagName("head")[0].appendChild(N)
                }
            } else {
                if ((typeof XDomainRequest !== "undefined" && XDomainRequest !== null) && "https:" === document.location.protocol) {
                    J = function () {
                        var N;
                        N = new XDomainRequest();
                        N.onload = function () {
                            return L(JSON.parse(N.responseText))
                        };
                        N.onerror = function () {
                            return typeof I.error === "function" ? I.error() : void 0
                        };
                        N.open("get", H);
                        return N.send()
                    }
                } else {
                    throw new Error("Unable to find suitable means of cross domain communication")
                }
            }
        }
        if (typeof I.progress === "function") {
            I.progress(0)
        }
        return J()
    };
    t = function (H, M, J) {
        var L, I, K;
        L = JSON.parse(H.data);
        switch (L.method) {
            case"ready":
                if (J.files != null) {
                    K = JSON.stringify({method: "files", params: J.files});
                    if ((typeof x !== "undefined" && x !== null) && J._popup) {
                        I = x.contentWindow
                    } else {
                        I = H.source
                    }
                    I.postMessage(K, Dropbox.baseUrl)
                }
                if (typeof J.ready === "function") {
                    J.ready()
                }
                break;
            case"files_selected":
            case"files_saved":
                if (typeof M === "function") {
                    M()
                }
                if (typeof J.success === "function") {
                    J.success(L.params)
                }
                break;
            case"progress":
                if (typeof J.progress === "function") {
                    J.progress(L.params)
                }
                break;
            case"close_dialog":
                if (typeof M === "function") {
                    M()
                }
                if (typeof J.cancel === "function") {
                    J.cancel()
                }
                break;
            case"web_session_error":
                if (typeof M === "function") {
                    M()
                }
                if (typeof J.webSessionFailure === "function") {
                    J.webSessionFailure()
                }
                break;
            case"web_session_unlinked":
                if (typeof M === "function") {
                    M()
                }
                if (typeof J.webSessionUnlinked === "function") {
                    J.webSessionUnlinked()
                }
                break;
            case"resize":
                if (typeof J.resize === "function") {
                    J.resize(L.params)
                }
                break;
            case"error":
                if (typeof M === "function") {
                    M()
                }
                if (typeof J.error === "function") {
                    J.error(L.params)
                }
                break;
            case"job_id":
                if (typeof M === "function") {
                    M()
                }
                q(J, L.params);
                break;
            case"_debug_log":
                if (typeof console !== "undefined" && console !== null) {
                    console.log(L.params.msg)
                }
        }
    };
    x = null;
    j = function () {
        if (/\bTrident\b/.test(navigator.userAgent)) {
            x = document.createElement("iframe");
            x.setAttribute("id", "dropbox_xcomm");
            x.setAttribute("src", Dropbox.baseUrl + "/static/api/1/xcomm.html");
            x.style.display = "none";
            document.getElementsByTagName("body")[0].appendChild(x)
        }
    };
    Dropbox.createChooserWidget = function (H) {
        var I;
        I = r(A(H, true));
        I._handler = function (J) {
            if (J.source === I.contentWindow && J.origin === Dropbox.baseUrl) {
                t(J, null, H)
            }
        };
        Dropbox.addListener(window, "message", I._handler);
        return I
    };
    Dropbox.cleanupWidget = function (H) {
        if (!H._handler) {
            throw new Error("Invalid widget!")
        }
        Dropbox.removeListener(window, "message", H._handler);
        delete H._handler
    };
    p = function (H, I) {
        var K, J;
        K = (window.screenX || window.screenLeft) + ((window.outerWidth || document.documentElement.offsetWidth) - H) / 2;
        J = (window.screenY || window.screenTop) + ((window.outerHeight || document.documentElement.offsetHeight) - I) / 2;
        return"width=" + H + ",height=" + I + ",left=" + K + ",top=" + J
    };
    if (Dropbox._dropinsjs_loaded) {
        if (typeof console !== "undefined" && console !== null) {
            if (typeof console.warn === "function") {
                console.warn("dropins.js included more than once")
            }
        }
        return
    }
    Dropbox._dropinsjs_loaded = true;
    if ((c = Dropbox.appKey) == null) {
        Dropbox.appKey = '9yh8zsu1wyfhkqj';
    }
    D = function (H) {
        return H
    };
    G = "https://www.dropbox.com/developers/dropins/chooser/js";
    w = ["text", "documents", "images", "video", "audio"];
    Dropbox.init = function (H) {
        if (H.translation_function != null) {
            D = H.translation_function
        }
        Dropbox.appKey = H.appKey
    };
    r = function (H) {
        var I;
        I = document.createElement("iframe");
        I.src = H;
        I.style.display = "block";
        I.style.backgroundColor = "white";
        I.style.border = "none";
        return I
    };
    l = function (N) {
        var L, H, P, I, M, O, K, J;
        if (typeof N[0] === "string") {
            I = N.shift();
            if (typeof N[0] === "string") {
                H = N.shift()
            } else {
                H = s(I)
            }
            P = {files: [
                {url: I, filename: H}
            ]}
        } else {
            P = N.shift();
            if (!(P != null)) {
                throw new Error("Missing arguments. See documentation.")
            }
            if (!(((K = P.files) != null ? K.length : void 0) || typeof P.files === "function")) {
                throw new Error("Missing files. See documentation.")
            }
            J = P.files;
            for (M = 0, O = J.length; M < O; M++) {
                L = J[M];
                if (!L.filename) {
                    L.filename = s(L.url)
                }
            }
        }
        return P
    };
    Dropbox.save = function () {
        var J, L, K, I, N, H, M;
        J = 1 <= arguments.length ? y.call(arguments, 0) : [];
        I = l(J);
        if (!Dropbox.isBrowserSupported()) {
            alert(D("Your browser does not support the Dropbox Saver"));
            return
        }
        I._popup = true;
        if (!(typeof I.files === "object" && I.files.length)) {
            throw new Error("Opening the saver failed. The object passed in must have a 'files' property that contains a list of objects.  See documentation.")
        }
        M = I.files;
        for (N = 0, H = M.length; N < H; N++) {
            K = M[N];
            if (typeof K.url !== "string") {
                throw new Error("File urls to download incorrectly configured.  Each file must have a url. See documentation.")
            }
        }
        L = p(352, 237);
        return v(F(I), L, I)
    };
    v = function (J, K, I) {
        var M, L, N, H, O;
        M = function () {
            if (!H.closed) {
                H.close()
            }
            Dropbox.removeListener(window, "message", L);
            clearInterval(O)
        };
        L = function (P) {
            if (P.source === H || P.source === (x != null ? x.contentWindow : void 0)) {
                t(P, M, I)
            }
        };
        N = function () {
            if (H.closed) {
                M();
                if (typeof I.cancel === "function") {
                    I.cancel()
                }
            }
        };
        H = window.open(J, "dropbox", "" + K + ",resizable=yes,location=yes");
        if (!H) {
            throw new Error("Failed to open a popup window. Dropbox.choose and Dropbox.save should only be called from within a user-triggered event handler such as a tap or click event.")
        }
        H.focus();
        O = setInterval(N, 100);
        Dropbox.addListener(window, "message", L);
        return H
    };
    E = function (J) {
        var K, I, M, H, L;
        if (!(J.success != null)) {
            if (typeof console !== "undefined" && console !== null) {
                if (typeof console.warn === "function") {
                    console.warn("You must provide a success callback to the Chooser to see the files that the user selects")
                }
            }
        }
        I = function () {
            if (typeof console !== "undefined" && console !== null) {
                if (typeof console.warn === "function") {
                    console.warn("The provided list of extensions or file types is not valid. See Chooser documentation: " + G)
                }
            }
            if (typeof console !== "undefined" && console !== null) {
                if (typeof console.warn === "function") {
                    console.warn("Available file types are: " + w.join(", "))
                }
            }
            return delete J.extensions
        };
        if (J.extensions != null) {
            if (Object.prototype.toString.call(J.extensions) === "[object Array]") {
                L = J.extensions;
                for (M = 0, H = L.length; M < H; M++) {
                    K = L[M];
                    if (!K.match(/^\.[\.\w$#&+@!()\-'`_~]+$/) && f.call(w, K) < 0) {
                        I()
                    }
                }
            } else {
                I()
            }
        }
        return J
    };
    h = function (O) {
        var J, H, M, L, P, N, K, I;
        if (!Dropbox.isBrowserSupported()) {
            alert(D("Your browser does not support the Dropbox Chooser"));
            return
        }
        I = 660;
        L = 440;
        if (O.iframe) {
            K = r(A(O, true));
            K.style.width = I + "px";
            K.style.height = L + "px";
            N = document.createElement("div");
            N.style.position = "fixed";
            N.style.left = N.style.right = N.style.top = N.style.bottom = "0px";
            N.style.zIndex = "1000";
            J = document.createElement("div");
            J.style.position = "absolute";
            J.style.left = J.style.right = J.style.top = J.style.bottom = "0px";
            J.style.backgroundColor = "rgb(160, 160, 160)";
            J.style.opacity = "0.2";
            J.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
            P = document.createElement("div");
            P.style.position = "relative";
            P.style.width = I + "px";
            P.style.margin = "125px auto 0px auto";
            P.style.border = "1px solid #ACACAC";
            P.style.boxShadow = "rgba(0, 0, 0, .2) 0px 4px 16px";
            P.appendChild(K);
            N.appendChild(J);
            N.appendChild(P);
            document.body.appendChild(N);
            M = function (Q) {
                if (Q.source === K.contentWindow) {
                    t(Q, (function () {
                        document.body.removeChild(N);
                        Dropbox.removeListener(window, "message", M)
                    }), O)
                }
            };
            Dropbox.addListener(window, "message", M)
        } else {
            H = p(I, L);
            v(A(O), H, O)
        }
    };
    Dropbox.choose = function (H) {
        if (H == null) {
            H = {}
        }
        H = E(H);
        h(H)
    };
    Dropbox.isBrowserSupported = function () {
        var H;
        H = g();
        Dropbox.isBrowserSupported = function () {
            return H
        };
        return H
    };
    g = function () {
        var K, J, H, I;
        I = [/Windows Phone/, /BB10;/, /CriOS/];
        for (J = 0, H = I.length; J < H; J++) {
            K = I[J];
            if (K.test(navigator.userAgent)) {
                return false
            }
        }
        if (!((typeof JSON !== "undefined" && JSON !== null) && (window.postMessage != null))) {
            return false
        }
        return true
    };
    o = function (H) {
        return H.replace(/\/+$/g, "").split("/").pop()
    };
    s = function (I) {
        var H;
        H = document.createElement("a");
        H.href = I;
        return o(H.pathname)
    };
    i = function (I, J) {
        var H;
        if (J != null) {
            J.innerHTML = ""
        } else {
            J = document.createElement("a");
            J.href = "#"
        }
        J.className += " dropbox-dropin-btn";
        if (Dropbox.isBrowserSupported()) {
            J.className += " dropbox-dropin-default"
        } else {
            J.className += " dropbox-dropin-disabled"
        }
        H = document.createElement("span");
        H.className = "dropin-btn-status";
        J.appendChild(H);
        I = document.createTextNode(I);
        J.appendChild(I);
        return J
    };
    Dropbox.createChooseButton = function (H) {
        var I;
        if (H == null) {
            H = {}
        }
        H = E(H);
        I = i(D("Choose from Dropbox"));
        Dropbox.addListener(I, "click", function (J) {
            J.preventDefault();
            h({success: function (K) {
                I.className = "dropbox-dropin-btn dropbox-dropin-success";
                if (typeof H.success === "function") {
                    H.success(K)
                }
            }, cancel: H.cancel, linkType: H.linkType, multiselect: H.multiselect, extensions: H.extensions, iframe: H.iframe, _trigger: "button"})
        });
        return I
    };
    Dropbox.createSaveButton = function () {
        var I, J, H;
        I = 1 <= arguments.length ? y.call(arguments, 0) : [];
        H = l(I);
        J = I.shift();
        J = i(D("Save to Dropbox"), J);
        Dropbox.addListener(J, "click", function (K) {
            var L;
            K.preventDefault();
            if (!(J.className.indexOf("dropbox-dropin-error") >= 0 || J.className.indexOf("dropbox-dropin-default") >= 0 || J.className.indexOf("dropbox-dropin-disabled") >= 0)) {
                return
            }
            L = (typeof H.files === "function" ? H.files() : void 0) || H.files;
            if (!(L != null ? L.length : void 0)) {
                J.className = "dropbox-dropin-btn dropbox-dropin-error";
                if (typeof H.error === "function") {
                    H.error("Missing files")
                }
                return
            }
            Dropbox.save({files: L, success: function () {
                J.className = "dropbox-dropin-btn dropbox-dropin-success";
                if (typeof H.success === "function") {
                    H.success()
                }
            }, progress: function (M) {
                J.className = "dropbox-dropin-btn dropbox-dropin-progress";
                if (typeof H.progress === "function") {
                    H.progress(M)
                }
            }, cancel: function () {
                if (typeof H.cancel === "function") {
                    H.cancel()
                }
            }, error: function (M) {
                J.className = "dropbox-dropin-btn dropbox-dropin-error";
                if (typeof H.error === "function") {
                    H.error(M)
                }
            }})
        });
        return J
    };
    u = function (I, H) {
        return"background: " + I + ";\nbackground: -moz-linear-gradient(top, " + I + " 0%, " + H + " 100%);\nbackground: -webkit-linear-gradient(top, " + I + " 0%, " + H + " 100%);\nbackground: linear-gradient(to bottom, " + I + " 0%, " + H + " 100%);\nfilter: progid:DXImageTransform.Microsoft.gradient(startColorstr='" + I + "', endColorstr='" + H + "',GradientType=0);"
    };
    n = document.createElement("style");
    n.type = "text/css";
    C = '@-webkit-keyframes rotate {\n  from  { -webkit-transform: rotate(0deg); }\n  to   { -webkit-transform: rotate(360deg); }\n}\n\n@keyframes rotate {\n  from  { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}\n\n.dropbox-dropin-btn, .dropbox-dropin-btn:link, .dropbox-dropin-btn:hover {\n  display: inline-block;\n  height: 14px;\n  font-family: "Lucida Grande", "Segoe UI", "Tahoma", "Helvetica Neue", "Helvetica", sans-serif;\n  font-size: 11px;\n  font-weight: 600;\n  color: #636363;\n  text-decoration: none;\n  padding: 1px 7px 5px 3px;\n  border: 1px solid #ebebeb;\n  border-radius: 2px;\n  border-bottom-color: #d4d4d4;\n  ' + (u("#fcfcfc", "#f5f5f5")) + "\n}\n\n.dropbox-dropin-default:hover, .dropbox-dropin-error:hover {\n  border-color: #dedede;\n  border-bottom-color: #cacaca;\n  " + (u("#fdfdfd", "#f5f5f5")) + "\n}\n\n.dropbox-dropin-default:active, .dropbox-dropin-error:active {\n  border-color: #d1d1d1;\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);\n}\n\n.dropbox-dropin-btn .dropin-btn-status {\n  display: inline-block;\n  width: 15px;\n  height: 14px;\n  vertical-align: bottom;\n  margin: 0 5px 0 2px;\n  background: transparent url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-saver-status.png') no-repeat;\n  position: relative;\n  top: 2px;\n}\n\n.dropbox-dropin-default .dropin-btn-status {\n  background-position: 0px 0px;\n}\n\n.dropbox-dropin-progress .dropin-btn-status {\n  width: 18px;\n  margin: 0 4px 0 0;\n  background: url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-progress.png') no-repeat center center;\n  -webkit-animation-name: rotate;\n  -webkit-animation-duration: 1.7s;\n  -webkit-animation-iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n  animation-name: rotate;\n  animation-duration: 1.7s;\n  animation-iteration-count: infinite;\n  animation-timing-function: linear;\n}\n\n.dropbox-dropin-success .dropin-btn-status {\n  background-position: -15px 0px;\n}\n\n.dropbox-dropin-disabled {\n  background: #e0e0e0;\n  border: 1px #dadada solid;\n  border-bottom: 1px solid #ccc;\n  box-shadow: none;\n}\n\n.dropbox-dropin-disabled .dropin-btn-status {\n  background-position: -30px 0px;\n}\n\n.dropbox-dropin-error .dropin-btn-status {\n  background-position: -45px 0px;\n}\n\n@media only screen and (-webkit-min-device-pixel-ratio: 1.4) {\n  .dropbox-dropin-btn .dropin-btn-status {\n    background-image: url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-saver-status-2x.png');\n    background-size: 60px 14px;\n    -webkit-background-size: 60px 14px;\n  }\n\n  .dropbox-dropin-progress .dropin-btn-status {\n    background: url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-progress-2x.png') no-repeat center center;\n    background-size: 20px 20px;\n    -webkit-background-size: 20px 20px;\n  }\n}\n\n.dropbox-saver:hover, .dropbox-chooser:hover {\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.dropbox-chooser, .dropbox-dropin-btn {\n  line-height: 11px !important;\n  text-decoration: none !important;\n  box-sizing: content-box !important;\n  -webkit-box-sizing: content-box !important;\n  -moz-box-sizing: content-box !important;\n}\n";
    if (n.styleSheet) {
        n.styleSheet.cssText = C
    } else {
        n.textContent = C
    }
    document.getElementsByTagName("head")[0].appendChild(n);
    setTimeout(j, 0);
    a = function () {
        if (document.removeEventListener) {
            document.removeEventListener("DOMContentLoaded", a, false)
        } else {
            if (document.detachEvent) {
                document.detachEvent("onreadystatechange", a)
            }
        }
        return z()
    };
    if (document.readyState === "complete") {
        setTimeout(a, 0)
    } else {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", a, false)
        } else {
            document.attachEvent("onreadystatechange", a)
        }
    }
    Dropbox.VERSION = "2";
    z = function () {
        var I, K, H, J;
        J = document.getElementsByTagName("a");
        for (K = 0, H = J.length; K < H; K++) {
            I = J[K];
            if (f.call((I.getAttribute("class") || "").split(" "), "dropbox-saver") >= 0) {
                (function (L) {
                    Dropbox.createSaveButton({files: function () {
                        return[
                            {url: L.getAttribute("data-url") || L.href, filename: L.getAttribute("data-filename") || o(L.pathname)}
                        ]
                    }}, L)
                })(I)
            }
        }
    }
}).call(this);