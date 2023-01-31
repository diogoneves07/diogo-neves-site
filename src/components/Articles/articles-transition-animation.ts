import { CSSClass, RouteControl, useFirstElManager } from "bemtv";
import { run } from "./Articles";

export default function articlesTransitionAnimation(r: RouteControl) {
  run(() => {
    let firstAnimationClass: CSSClass;
    let secondAnimationClass: CSSClass;

    const { css, animationend$, el } = useFirstElManager<HTMLDivElement>();

    firstAnimationClass = css`
      @keyframes anime-left-article1 {
        0% {
          left: 0%;
        }
        100% {
          left: -10%;
        }
      }
      position: relative;
      animation: anime-left-article1 0.5s cubic-bezier(0.68, -0.55, 0.5, 1)
        forwards;
    `;

    animationend$(
      () => {
        secondAnimationClass = css`
          @keyframes anime-left-article2 {
            0% {
              left: -10%;
            }
            100% {
              left: 0%;
            }
          }
          animation: anime-left-article2 0.5s cubic-bezier(0.68, -0.55, 0.5, 1)
            forwards;
        `;

        animationend$(
          () => {
            firstAnimationClass.remove();

            secondAnimationClass.remove();

            r.onRender(() => {
              el.scrollIntoView({ behavior: "smooth" });
            });
          },
          { once: true }
        );
      },
      { once: true }
    );
  });
}
