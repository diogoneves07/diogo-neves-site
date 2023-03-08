import { _ } from "bemtv";

const { click$, css, template, render } = _`PreviousRouteButton`();

click$(() => location.hash && history.back());

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
