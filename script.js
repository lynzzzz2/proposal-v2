/* ==========================================================
   WAIT FOR PAGE TO LOAD
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       ELEMENTS
    ========================================================== */

    const musicBtn = document.getElementById("musicBtn");
    const music = document.getElementById("bgMusic");
    const progress = document.querySelector(".progress");

    let isPlaying = false;

    // Every <section class="scene"> becomes one "page", in DOM order
    const pages = Array.from(document.querySelectorAll(".scene"));
    let currentPage = 0;

    /* ==========================================================
       BUILD PROGRESS DOTS (auto-matches number of pages)
    ========================================================== */

    if (progress) {

        progress.innerHTML = "";

        pages.forEach((page, i) => {

            const dot = document.createElement("span");

            if (i === 0) {
                dot.classList.add("active");
            }

            progress.appendChild(dot);

        });

    }

    const dots = progress ? progress.querySelectorAll("span") : [];

    /* ==========================================================
       REVEAL TEXT/PHOTOS ON A PAGE (staggered fade-in)
    ========================================================== */

    function playRevealAnimations(page) {

        const revealEls = page.querySelectorAll(".reveal");

        revealEls.forEach((el, i) => {

            setTimeout(() => {
                el.classList.add("active");
            }, 200 + i * 150);

        });

    }

    /* ==========================================================
       SHOW A GIVEN PAGE (fade current out, fade next in)
    ========================================================== */

    function showPage(index) {

        if (index < 0 || index >= pages.length) return;

        pages[currentPage].classList.remove("active-page");
        pages[index].classList.add("active-page");

        dots.forEach(d => d.classList.remove("active"));

        if (dots[index]) {
            dots[index].classList.add("active");
        }

        currentPage = index;

        playRevealAnimations(pages[index]);

    }

    function nextPage() {
        showPage(currentPage + 1);
    }

    function prevPage() {
        showPage(currentPage - 1);
    }

    // Show the cover page on load
    showPage(0);

    /* ==========================================================
       WIRE UP EVERY "Continue" / "Back" BUTTON AUTOMATICALLY
    ========================================================== */

    document.querySelectorAll(".continueBtn").forEach(btn => {
        btn.addEventListener("click", nextPage);
    });

    document.querySelectorAll(".backBtn").forEach(btn => {
        btn.addEventListener("click", prevPage);
    });

    /* ==========================================================
       BEGIN BUTTON (cover page) — starts music + advances
    ========================================================== */

    const beginBtn = document.getElementById("beginBtn");

    if (beginBtn) {

        beginBtn.addEventListener("click", () => {

            music.play()
                .then(() => {
                    isPlaying = true;
                    musicBtn.textContent = "🎵";
                })
                .catch((err) => {
                    console.log("Music couldn't autoplay.", err);
                });

            nextPage();

        });

    }

    /* ==========================================================
       MUSIC BUTTON
    ========================================================== */

    if (musicBtn) {

        musicBtn.addEventListener("click", () => {

            if (isPlaying) {

                music.pause();
                musicBtn.textContent = "🔇";
                isPlaying = false;

            } else {

                music.play()
                    .then(() => {
                        musicBtn.textContent = "🎵";
                        isPlaying = true;
                    })
                    .catch((err) => {
                        console.log("Music couldn't play.", err);
                    });

            }

        });

    }

    /* ==========================================================
       FLOATING PETALS
    ========================================================== */

    const petals = document.querySelector(".petals");

    if (petals) {

        function createPetal() {

            const petal = document.createElement("div");

            petal.className = "petal";
            petal.innerHTML = "🌸";
            petal.style.left = Math.random() * 100 + "%";
            petal.style.animationDuration = (8 + Math.random() * 6) + "s";
            petal.style.fontSize = (18 + Math.random() * 12) + "px";

            petals.appendChild(petal);

            setTimeout(() => petal.remove(), 14000);

        }

        createPetal();
        setInterval(createPetal, 1200);

    }

    /* ==========================================================
       YES BUTTON — heart animation, then advance to ending
    ========================================================== */

    const yesBtn = document.getElementById("yesBtn");

    if (yesBtn) {

        yesBtn.addEventListener("click", () => {

            yesBtn.textContent = "❤️";
            navigator.vibrate?.(200);

            setTimeout(() => {
                nextPage();
            }, 900);

        });

    }

});
