(function() {
    "use strict";
    var app = {
        init: () => {
            app.preloader();
            app.lines();
            app.windowResize();
            app.setUpListeners()
        },
        DELAY: 0.3,
        WIDTH: 0,
        HEIGHT: 0,
        ITEMS: document.querySelectorAll(".intro-item"),
        BGINIT: document.querySelector(".ibg-init"),
        NAV: document.querySelector(".intro-nav"),
        NAVITEM: document.querySelectorAll(".intro-nav li"),
        IMAGESCONTAINER: document.querySelector(".ibg-imgs"),
        IMAGES: document.querySelectorAll(".ibg-img"),
        INDEX: 0,
        ITEMHEIGHT: 0,
        NUMBEROFITEMS: 0,
        TOGGLEFLAG: !1,
        setUpListeners: () => {
            window.addEventListener('resize', app.windowResize);
            app.NAVITEM.forEach(item => {
                item.addEventListener('mouseenter', app.itemMouseEnter);
                item.addEventListener('mouseleave', app.itemMouseLeave);
                item.addEventListener("click", app.bgAnim)
            });
            app.NAV.addEventListener('mouseenter', app.containerMouseEnter);
            app.NAV.addEventListener('mouseleave', app.containerMouseLeave);
            document.querySelector("body").addEventListener('mousemove', app.bodyMouseMove)
        },
        windowResize: () => {
            app.WIDTH = window.innerWidth;
            app.HEIGHT = window.innerHeight;
            app.NUMBEROFITEMS = app.NAVITEM.length;
            app.ITEMHEIGHT = app.NAVITEM[0].offsetHeight;
            const scale = 3;
            app.IMAGES.forEach((item, i) => {
                let translateX = i * app.WIDTH / app.NUMBEROFITEMS - app.ITEMHEIGHT;
                item.style.width = ((scale - 1) * app.ITEMHEIGHT) + (app.WIDTH / app.NUMBEROFITEMS) + 'px';
                item.style.height = scale * app.ITEMHEIGHT + 'px';
                item.style.transform = 'translate(' + translateX + 'px, ' + app.ITEMHEIGHT + 'px)'
            })
        },
        itemMouseEnter: (e) => {
            app.INDEX = app.index(e.currentTarget);
            app.IMAGES[app.INDEX - 1].classList.add("active")
        },
        itemMouseLeave: () => {
            app.IMAGES.forEach(item => {
                item.classList.remove("active")
            })
        },
        bodyMouseMove: (e) => {
            app.IMAGESCONTAINER.style.setProperty('--x', e.clientX + 'px');
            app.IMAGESCONTAINER.style.setProperty('--y', e.clientY + 'px');
            app.IMAGESCONTAINER.style.setProperty('--h', app.ITEMHEIGHT / 2 + 'px')
        },
        containerMouseEnter: () => {
            app.IMAGESCONTAINER.classList.add("active")
        },
        containerMouseLeave: () => {
            app.IMAGESCONTAINER.classList.remove("active")
        },
        bgAnim: e => {
            var _this = e.currentTarget;
            if (!_this.classList.contains("active") && app.TOGGLEFLAG === !1) {
                app.TOGGLEFLAG = !0;
                const img = app.IMAGES[app.INDEX - 1],
                    imgAnim = img.cloneNode(!0),
                    x = e.clientX,
                    y = e.clientY,
                    h = app.ITEMHEIGHT / 2;
                imgAnim.classList.add("ibg-img-anim");
                document.querySelector(".ibg-anim").appendChild(imgAnim);
                img.classList.add("hide");
                img.classList.remove("active", "hide");
                gsap.to(imgAnim, 0.6, {
                    width: "100%",
                    height: "100%",
                    x: 0,
                    y: 0,
                    delay: 0.1,
                    ease: "Power4.easeNone",
                });
                let scale = app.WIDTH * 1.2;
                if (app.HEIGHT > app.WIDTH) {
                    scale = app.HEIGHT * 1.2
                }
                gsap.fromTo('.ibg-anim', 1.2, {
                    "clip-path": 'circle(' + h + 'px at ' + x + 'px ' + y + 'px)'
                }, {
                    delay: 0.45,
                    "clip-path": 'circle(' + scale + 'px at ' + x + 'px ' + y + 'px)',
                    ease: "Power4.easeNone",
                    onComplete: () => {
                        app.BGINIT.style.backgroundImage = "url(" + img.getAttribute('data-background-image') + ")";
                        imgAnim.parentNode.removeChild(imgAnim)
                    }
                });
                const itemActive = document.querySelector(".intro-item.active");
                if (itemActive !== null) {
                    let heading = new SplitText(".intro-item.active .intro-item-heading", {
                            type: "chars"
                        }),
                        desc = new SplitText(".intro-item.active .intro-item-desc", {
                            type: "words"
                        }),
                        tl = gsap.timeline({
                            onComplete: () => {
                                tl.kill();
                                heading.revert();
                                desc.revert();
                                _this.classList.add("active");
                                app.siblingsRemoveClass(_this, "active");
                                itemActive.classList.remove("active");
                                app.ITEMS[app.INDEX - 1].classList.add("active");
                                let headingNew = new SplitText(app.ITEMS[app.INDEX - 1].querySelector(".intro-item-heading"), {
                                        type: "chars"
                                    }),
                                    descNew = new SplitText(app.ITEMS[app.INDEX - 1].querySelector(".intro-item-desc"), {
                                        type: "words"
                                    }),
                                    tlNew = gsap.timeline({
                                        onComplete: () => {
                                            tlNew.kill();
                                            headingNew.revert();
                                            descNew.revert();
                                            app.TOGGLEFLAG = !1
                                        }
                                    });
                                app.animHeading(tlNew, headingNew.chars, 0.04, 0, 'pos1');
                                app.animText(tlNew, descNew.words, 0.04, 0, 'pos1+=0.2')
                            }
                        });
                    app.animTextOut(tl, desc.words, 0.03, 0, 'pos1');
                    app.animHeadingOut(tl, heading.chars, 0.03, 0, 'pos1+=0.2')
                }
            }
        },
        index: el => {
            if (!el) return -1;
            let i = 0;
            do {
                i++
            } while (el = el.previousElementSibling);
            return i
        },
        siblingsRemoveClass: (el, cl) => {
            return Array.prototype.filter.call(el.parentNode.children, sibling => {
                if (sibling !== el) {
                    sibling.classList.remove(cl)
                }
            })
        },
        animHeading: (tl, target, stg, del, anim) => {
            tl.from(target, {
                yPercent: -100,
                opacity: 0,
                stagger: stg,
                delay: del,
                ease: "Power1.easeOut"
            }, anim)
        },
        animHeadingOut: (tl, target, stg, del, anim) => {
            tl.to(target, {
                yPercent: 100,
                opacity: 0,
                stagger: stg,
                delay: del,
                ease: "Power1.easeOut"
            }, anim)
        },
        animText: (tl, target, stg, del, anim) => {
            tl.from(target, {
                opacity: 0,
                stagger: stg,
                delay: del,
                ease: "Power1.easeOut"
            }, anim)
        },
        animTextOut: (tl, target, stg, del, anim) => {
            tl.to(target, {
                opacity: 0,
                stagger: stg,
                delay: del,
                ease: "Power1.easeOut"
            }, anim)
        },
        preloader: () => {
            const container = document.querySelector(".preloader");
            gsap.from(".psvgpl", 1, {
                drawSVG: 0,
                onComplete: () => {
                    container.classList.add("animated");
                    gsap.fromTo(container, 0.4, {
                        "clip-path": 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
                    }, {
                        delay: 0.2,
                        "clip-path": 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
                        ease: "Power0.easeNone",
                        onComplete: () => {
                            container.classList.add("hide")
                        }
                    });
                    setTimeout(() => {
                        app.animation()
                    }, 100)
                }
            }, "pos1+=0.1");
            gsap.from(".psvgps", 10, {
                drawSVG: 0
            }, "pos1+=0.1")
        },
        lines: () => {
            const tl = gsap.timeline();
            tl.from(".intro-lines .line-wide", 0.6, {
                drawSVG: 0,
                ease: Power0.easeNone
            }, "pos1+=0.1").from(".intro-lines .line", 0.6, {
                drawSVG: 0,
                stagger: 0.1,
                ease: Power0.easeNone,
                onComplete: () => {
                    document.querySelector(".intro-lines").classList.add("animated")
                }
            }, "pos1+=0.4")
        },
        animation: () => {
            gsap.from(".header", {
                opacity: 0,
                delay: app.DELAY
            });
            gsap.from(".intro-mc-outer", {
                opacity: 0,
                delay: app.DELAY
            });
            gsap.from(".intro-nav-list li", {
                opacity: 0,
                stagger: 0.2,
                delay: app.DELAY + 0.3
            });
            const imgs = document.querySelectorAll(".ibg-mobile picture");
            gsap.utils.toArray(".intro-item").forEach(function(item, index) {
                const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item,
                            start: "top 40%",
                            onEnter: () => {
                                imgs[index].classList.add("active");
                                app.siblingsRemoveClass(imgs[index], "active")
                            },
                            onLeaveBack: () => {
                                imgs[index - 1].classList.add("active");
                                app.siblingsRemoveClass(imgs[index - 1], "active")
                            },
                            onComplete: () => {
                                tl.kill();
                                heading.revert();
                                desc.revert()
                            }
                        }
                    }),
                    heading = new SplitText(item.querySelector(".intro-item-heading"), {
                        type: "words, chars"
                    }),
                    desc = new SplitText(item.querySelector(".intro-item-desc"), {
                        type: "words"
                    });
                app.animHeading(tl, heading.chars, 0.04, app.DELAY, 'pos1');
                app.animText(tl, desc.words, 0.04, app.DELAY, 'pos1+=0.2')
            })
        },
    }
    app.init()
}())