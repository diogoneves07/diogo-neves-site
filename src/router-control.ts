import { useRouteControl, _ } from "bemtv";
import { LoadingBarProxy } from "./components/App";
import articlesTransitionAnimation from "./components/Articles/articles-transition-animation";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

useRouteControl((r) => {
  if (r.isFirst) {
    r.render();

    return;
  }

  r.load();

  const { showLoadingBar } = LoadingBarProxy.$;

  showLoadingBar(randomIntFromInterval(40, 70));

  setTimeout(() => {
    showLoadingBar(randomIntFromInterval(90, 95));
    setTimeout(() => r.render(), 400);
  }, 300);

  articlesTransitionAnimation(r);

  r.onRender(() => {
    showLoadingBar(100);
  });
});
