console.clear();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let containerOuter = document.getElementById("container-outer");
let containerInner = document.getElementById("container-inner");
let sections = gsap.utils.toArray("section");

let tween = gsap.to(sections, {
  x: () => -containerInner.offsetWidth + window.innerWidth,
  ease: "none",
  scrollTrigger: {
    trigger: containerOuter,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    end: () => "+=" + containerInner.offsetWidth
  }
});

var expanded = false;
var expandButton = document.getElementById("expand");

expandButton.addEventListener("click", function () {
  gsap.fromTo(
    ".introimage",
    {
      minWidth: !expanded ? "25vw" : "100vw"
    },
    {
      minWidth: !expanded ? "100vw" : "25vw",
      duration: 0.5,
      ease: "none",
      onComplete: () => {
        expanded = !expanded;
        let st = tween.scrollTrigger,
          change = window.innerWidth * (expanded ? 0.25 : -0.25),
          movement = containerInner.offsetWidth - window.innerWidth,
          progress = (st.progress * 1) / ((movement + change) / movement);
        expandButton.innerHTML = !expanded ? "Expand" : "Close";
        gsap.set(containerInner, { width: expanded ? "200vw" : "125vw" });
        ScrollTrigger.refresh();
        // st.scroll(st.start + (st.end - st.start) * progress);
        st.update();
        st.getTween().progress(1); // eliminate the scrub animation
        gsap.to(window, {
          scrollTo: {
            y: st.start + (st.end - st.start) * (expanded ? 0.5 : progress)
            // Set the scroll to 0.5 of the ScrollTrigger instance's total scroll
            // This is 1 divided by the index of the target, in this case
            // the target is the third element so it's index is 2
            // So is 1/2 = 0.5
          },
          ease: "power1.inOut"
        });
      }
    }
  );
});
