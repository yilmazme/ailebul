const Reveal = document.querySelector("#reveal");
const Many = document.querySelectorAll(".many");
const Resource = document.querySelectorAll(".resource");
const Two = document.querySelectorAll(".two");

window.onscroll = function () {
  var top = window.scrollY || document.documentElement.scrollTop;
  if (top < 10) {
    Two[0].style.opacity = "1";
  } else if (top > 500) {
    Reveal.className = "reveal";
    Many[0].setAttribute("id", "fade");
    Resource[0].setAttribute("id", "fade");
    Two[0].style.transitionDuration = "600ms";
    Two[0].style.transitionTimingFunction = "ease-out";
    Two[0].style.opacity = "1";
  } else {
    Reveal.className = "noReveal";
    Many[0].setAttribute("id", "noFade");
    Resource[0].setAttribute("id", "noFade");
    Two[0].style.transitionDuration = "600ms";
    Two[0].style.transitionTimingFunction = "ease-out";
    Two[0].style.opacity = "0.4";
  }
};
