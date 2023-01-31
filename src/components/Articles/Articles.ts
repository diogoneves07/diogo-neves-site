import { _ } from "bemtv";

export const { onMount, css, run, template } = _`Articles`();

css`
  padding: 50px 6vw;
  min-height: 200px;
  margin: 50px 15px 75px 15px;
  max-width: 750px;
  width: 100%;
  transition: 1s all ease-in-out;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 30px 0 10px 0;
    padding: 0;
    padding-bottom: 10px;
    padding-left: 20px;
    line-height: 50px;
    border-radius: 0px 10px;
  }

  footer {
    margin-top: 50px;
  }

  p {
    padding: 20px;
  }
  blockquote {
    border-left: 6px solid blue;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 0 0 0 30px;
  }
`;

template`div[$children]`;
