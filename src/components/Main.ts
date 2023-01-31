import { _ } from "bemtv";

const { css, template } = _`Main`();

css`
  width: 100%;
  display: flex;
  justify-content: center;
`;

template`main[ Articles[ #[] ] ]`;
