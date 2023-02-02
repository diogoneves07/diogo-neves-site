import { useRouteControl, _ } from "bemtv";
import { LoadingBarProxy } from "./components/App";
import articlesTransitionAnimation from "./components/Articles/articles-transition-animation";

const { click$, css, template, render } = _`PreviousRouteButton`();

click$(() => {
  if (window.location.hash) {
    history.back();
  }
});

css`
  position: fixed;
  left: 2%;
  bottom: 3%;
  padding: 5px;
  width: 90px;
  color: #d4d4d4;
  font-size: 32px;
  line-height: 35px;
  border-radius: 10px 0px 10px;
  border: 0px;
  background-color: rgba(3, 6, 40, 1);
  border: solid blue;
  border-width: 0px 1px 0px 1px;
  height: 40px;
  &:hover {
    color: blue;
  }
`;

template`button[ title="Voltar para a página anterior..." ~ &#129176;]`;

render();

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
