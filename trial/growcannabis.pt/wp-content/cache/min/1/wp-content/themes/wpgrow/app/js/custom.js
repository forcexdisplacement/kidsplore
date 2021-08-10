(function() {
    "use strict";
    var app = {
        init: () => {
            document.querySelector(".main").classList.add("visible");
            gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
            app.lazyLoading();
            app.setUpListeners();
            app.formingHrefTel();
            app.cursor();
            app.magnetEl();
            app.customLog()
        },
        setUpListeners: () => {
            const menuBtn = document.querySelector(".mnu-btn");
            if (menuBtn !== null) {
                menuBtn.addEventListener("click", app.menu.toggle)
            }
        },
        menu: {
            BODY: document.getElementsByTagName("body")[0],
            MAINMENU: document.querySelector(".main-mnu"),
            ITEMS: document.querySelectorAll(".mm-list > li"),
            LINKS: document.querySelectorAll(".mm-list a"),
            IMAGES: document.querySelector(".mmi-imgs"),
            SPLITMENULINKS: new SplitText(".mm-list a", {
                type: "chars"
            }),
            SPLITMENUINFOHEADING: new SplitText(".mm-info-heading", {
                type: "words, chars"
            }),
            SPLITMENUINFOCONTENT: new SplitText(".mm-content", {
                type: "words, chars"
            }),
            TL: gsap.timeline(),
            DURATION: 0.2,
            FLAG: !1,
            init: () => {
                app.menu.LINKS.forEach(item => {
                    item.addEventListener('mouseenter', app.menu.itemMouseEnter);
                    item.addEventListener('mouseleave', app.menu.itemMouseLeave);
                    item.addEventListener('mousemove', app.menu.itemMouseMove)
                });
                app.menu.MAINMENU.addEventListener('mousemove', app.menu.itemMouseMove)
            },
            toggle: () => {
                app.menu.BODY.classList.toggle("main-menu-open");
                if (app.menu.BODY.classList.contains("main-menu-open")) {
                    app.menu.animIn()
                } else {
                    app.menu.animOut()
                }
                if (app.menu.FLAG === !1) {
                    app.menu.init();
                    app.menu.ITEMS.forEach(item => {
                        var source = item.getAttribute("data-img"),
                            imgOuter = document.createElement("div"),
                            img = document.createElement("img");
                        imgOuter.className = "mmi-img";
                        img.src = source;
                        img.alt = "";
                        imgOuter.appendChild(img);
                        app.menu.IMAGES.appendChild(imgOuter)
                    });
                    app.menu.FLAG = !0
                }
            },
            itemMouseEnter: e => {
                let index = app.index(e.target.parentNode) - 1,
                    img = app.menu.IMAGES.querySelectorAll(".mmi-img")[index];
                if (img !== undefined) {
                    gsap.set(img, {
                        opacity: 1
                    });
                    Array.prototype.filter.call(img.parentNode.children, function(child) {
                        if (child !== img && child.classList.contains("mmi-img")) {
                            gsap.set(child, {
                                opacity: 0
                            })
                        }
                    });
                    gsap.to(app.menu.IMAGES, app.menu.DURATION, {
                        opacity: 1
                    })
                }
            },
            itemMouseLeave: () => {
                gsap.to(app.menu.IMAGES, app.menu.DURATION, {
                    opacity: 0
                })
            },
            itemMouseMove: e => {
                gsap.to(app.menu.IMAGES, {
                    x: e.clientX - app.menu.IMAGES.offsetHeight / 2,
                    y: e.clientY - app.menu.IMAGES.offsetWidth / 2 + app.menu.MAINMENU.scrollTop,
                    ease: "Back.easeOut",
                })
            },
            animIn: () => {
                app.menu.animKill();
                app.menu.SPLITMENULINKS.split({
                    type: "chars, words"
                });
                app.menu.SPLITMENUINFOHEADING.split({
                    type: "chars, words"
                });
                app.menu.SPLITMENUINFOCONTENT.split({
                    type: "chars, words"
                });
                app.menu.animText(app.menu.TL, app.menu.SPLITMENULINKS.chars, 0.015, 0.4, null);
                app.menu.animText(app.menu.TL, app.menu.SPLITMENUINFOHEADING.chars, 0.015, 0, 'anim1-=0.5');
                app.menu.animText(app.menu.TL, app.menu.SPLITMENUINFOCONTENT.chars, 0.01, 0, 'anim1-=0.5');
                app.menu.TL.fromTo(".mm-social li", 0.3, {
                    opacity: 0,
                    x: 20
                }, {
                    opacity: 1,
                    x: 0,
                    stagger: 0.15
                }, "anim2-=0.25").fromTo(".mmf-item", 0.3, {
                    opacity: 0
                }, {
                    opacity: 1,
                    stagger: 0.15
                }, "anim2-=0.25");
                if (app.menu.MAINMENU.querySelector(".mm-lines") !== null) {
                    app.menu.TL.fromTo(".mm-lines", 0, {
                        opacity: 0
                    }, {
                        opacity: 1
                    }, "anim1").fromTo(".mm-lines .line-wide", 0.6, {
                        drawSVG: "0%",
                    }, {
                        drawSVG: "100%",
                        ease: Power0.easeNone
                    }, "anim1-=0.5").fromTo(".mm-lines .line", 0.6, {
                        drawSVG: "0%",
                    }, {
                        drawSVG: "100%",
                        stagger: 0.1,
                        ease: Power0.easeNone
                    }, "anim1-=0.2")
                }
            },
            animOut: () => {
                gsap.to(".mm-social li, .mmf-item, .mm-lines", 0.2, {
                    opacity: 0
                });
                gsap.to(app.menu.SPLITMENULINKS.chars, 0.2, {
                    opacity: 0
                });
                gsap.to(app.menu.SPLITMENUINFOHEADING.chars, 0.2, {
                    opacity: 0
                });
                gsap.to(app.menu.SPLITMENUINFOCONTENT.chars, 0.2, {
                    opacity: 0
                })
            },
            animKill: () => {
                app.menu.TL.clear().time(0);
                app.menu.SPLITMENULINKS.revert();
                app.menu.SPLITMENUINFOHEADING.revert();
                app.menu.SPLITMENUINFOCONTENT.revert()
            },
            animText: (tl, target, stg, del, anim) => {
                tl.fromTo(target, 0.3, {
                    yPercent: -100,
                    opacity: 0,
                }, {
                    yPercent: 0,
                    opacity: 1,
                    stagger: stg,
                    delay: del,
                    ease: "Power1.easeOut"
                }, anim)
            },
        },
        index: el => {
            if (!el) return -1;
            let i = 0;
            do {
                i++
            } while (el = el.previousElementSibling);
            return i
        },
        formingHrefTel: () => {
            var linkAll = document.querySelectorAll(".formingHrefTel"),
                joinNumbToStringTel = 'tel:';
            linkAll.forEach(item => {
                var _this = item,
                    linkValue = _this.textContent,
                    arrayString = linkValue.split("");
                for (var i = 0; i < arrayString.length; i++) {
                    var thisNunb = app.isNumber(arrayString[i]);
                    if (thisNunb === !0 || (arrayString[i] === "+" && i === 0)) {
                        joinNumbToStringTel += arrayString[i]
                    }
                }
                _this.setAttribute("href", joinNumbToStringTel);
                joinNumbToStringTel = 'tel:'
            })
        },
        isNumber: n => {
            return !isNaN(parseFloat(n)) && isFinite(n)
        },
        cursor: () => {
            const cursor = document.querySelector(".cursor"),
                main = document.querySelector("main.main"),
                pos = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                },
                mouse = {
                    x: pos.x,
                    y: pos.y
                },
                speed = 0.3,
                xSet = gsap.quickSetter(cursor, "x", "px"),
                ySet = gsap.quickSetter(cursor, "y", "px");
            window.addEventListener("mousemove", e => {
                mouse.x = e.x;
                mouse.y = e.y
            });
            main.addEventListener("mouseenter", () => {
                cursor.classList.remove('hidden')
            });
            main.addEventListener("mouseleave", () => {
                cursor.classList.add('hidden')
            });
            gsap.ticker.add(() => {
                const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
                pos.x += (mouse.x - pos.x) * dt;
                pos.y += (mouse.y - pos.y) * dt;
                xSet(pos.x);
                ySet(pos.y)
            });
            document.querySelectorAll('.cra').forEach((elem) => {
                elem.addEventListener('mouseenter', () => {
                    cursor.classList.add("active")
                });
                elem.addEventListener('mouseleave', () => {
                    cursor.classList.remove("active")
                });
                elem.addEventListener('click', e => {
                    const ripple = document.createElement("div");
                    ripple.className = "cursor-ripple";
                    cursor.appendChild(ripple);
                    setTimeout(() => {
                        ripple.parentNode.removeChild(ripple)
                    }, 300)
                })
            });
            document.querySelectorAll('.crm, .mm-list a').forEach((elem) => {
                elem.addEventListener('mouseenter', () => {
                    cursor.classList.add("min")
                });
                elem.addEventListener('mouseleave', () => {
                    cursor.classList.remove("min")
                })
            });
            document.querySelectorAll('.crh').forEach((elem) => {
                elem.addEventListener('mouseenter', () => {
                    cursor.classList.add("hidden")
                });
                elem.addEventListener('mouseleave', () => {
                    cursor.classList.remove("hidden")
                })
            })
        },
        magnetEl: () => {
            const magnets = document.querySelectorAll('.magnet'),
                strength = 50,
                moveMagnet = e => {
                    const magnetButton = e.currentTarget,
                        bounding = magnetButton.getBoundingClientRect();
                    ScrollTrigger.matchMedia({
                        "(min-width: 1200px)": () => {
                            gsap.to(magnetButton, 0.5, {
                                x: (((e.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * strength,
                                y: (((e.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * strength,
                                ease: Power2.easeOut
                            })
                        },
                    })
                };
            magnets.forEach(magnet => {
                magnet.addEventListener('mousemove', moveMagnet);
                magnet.addEventListener('mouseout', function(e) {
                    ScrollTrigger.matchMedia({
                        "(min-width: 1200px)": () => {
                            gsap.to(e.currentTarget, 0.5, {
                                x: 0,
                                y: 0,
                                ease: Power2.easeOut
                            })
                        },
                    })
                })
            })
        },
        lazyLoading: () => {
            const observer = lozad(".lazy", {
                loaded: function(el) {
                    if (el.tagName.toLowerCase() === 'picture') {
                        let sources = el.querySelectorAll("source");
                        if (sources.length) {
                            sources.forEach((item) => {
                                let srcset = item.getAttribute('data-srcset');
                                if (srcset !== null) {
                                    item.setAttribute("srcset", srcset);
                                    item.removeAttribute("data-srcset")
                                }
                            })
                        }
                    }
                }
            });
            observer.observe()
        },
        customLog: () => {
            const styles = ['font-size: 14px', 'color: #ffffff', 'background-color: #000000', 'padding: 4px 0 4px 8px'].join(';'),
                brandStyles = ['font-size: 14px', 'color: #ffffff', 'background-color: #000000', 'padding: 4px 8px 4px 0', 'font-weight: bold'].join(';'),
                text = '%cMade by %cKoval Web https://kovalweb.com/';
            console.log(text, styles, brandStyles)
        },
        detectBrowser: function() {
            var db = document.querySelector(".detect-browser"),
                els = document.querySelectorAll(".main");
            if (db !== null) {
                if (this.detectBrowserCheck()) {
                    db.removeAttribute('style');
                    db.classList.add("open");
                    els.forEach(function(item) {
                        item.parentNode.removeChild(item)
                    })
                } else {
                    db.parentNode.removeChild(db)
                }
            }
        },
        detectBrowserCheck: function() {
            var navUserAgent = navigator.userAgent,
                browserName = navigator.appName,
                browserVersion = '' + parseFloat(navigator.appVersion),
                majorVersion, tempNameOffset, tempVersionOffset, tempVersion;
            if ((tempVersionOffset = navUserAgent.indexOf("Opera")) != -1) {
                browserName = "Opera";
                browserVersion = navUserAgent.substring(tempVersionOffset + 6);
                if ((tempVersionOffset = navUserAgent.indexOf("Version")) != -1) {
                    browserVersion = navUserAgent.substring(tempVersionOffset + 8)
                }
            } else if (navUserAgent.indexOf("Edge") != -1) {
                browserName = "Edge"
            } else if ((tempVersionOffset = navUserAgent.indexOf("Chrome")) != -1) {
                browserName = "Chrome";
                browserVersion = navUserAgent.substring(tempVersionOffset + 7)
            } else if ((tempVersionOffset = navUserAgent.indexOf("Safari")) != -1) {
                browserName = "Safari";
                browserVersion = navUserAgent.substring(tempVersionOffset + 7);
                if ((tempVersionOffset = navUserAgent.indexOf("Version")) != -1) {
                    browserVersion = navUserAgent.substring(tempVersionOffset + 8)
                }
            } else if ((tempVersionOffset = navUserAgent.indexOf("Firefox")) != -1) {
                browserName = "Firefox";
                browserVersion = navUserAgent.substring(tempVersionOffset + 8)
            } else if ((navUserAgent.indexOf("MSIE") != -1 || navUserAgent.indexOf("rv:")) != -1) {
                browserName = "IE"
            } else if ((tempNameOffset = navUserAgent.lastIndexOf(' ') + 1) < (tempVersionOffset = navUserAgent.lastIndexOf('/'))) {
                browserName = navUserAgent.substring(tempNameOffset, tempVersionOffset);
                browserVersion = navUserAgent.substring(tempVersionOffset + 1);
                if (browserName.toLowerCase() == browserName.toUpperCase()) {
                    browserName = navigator.appName
                }
            }
            if ((tempVersion = browserVersion.indexOf(";")) != -1)
                browserVersion = browserVersion.substring(0, tempVersion);
            if ((tempVersion = browserVersion.indexOf(" ")) != -1)
                browserVersion = browserVersion.substring(0, tempVersion);
            majorVersion = parseInt(browserVersion);
            if (browserName === "Edge") {
                return !0
            }
            if (browserName === 'IE') {
                return !0
            }
            if (browserName === 'Chrome' && majorVersion < 70) {
                return !0
            }
            if (browserName === 'Firefox' && majorVersion < 70) {
                return !0
            }
            if (browserName === 'Opera' && majorVersion < 75) {
                return !0
            }
            if (browserName === 'Safari' && majorVersion < 11) {
                return !0
            }
            return !1
        }
    }
    app.init()
}())