import { _ } from "bemtv";

const { css, template } = _`MainFooter`();

css`
  background: rgb(28, 1, 25);
  background: linear-gradient(
    90deg,
    rgba(28, 1, 25, 1) 28%,
    rgba(3, 6, 40, 1) 76%
  );
  width: 100%;
  margin-top: 20px;
  padding: 15px 0;
  text-align: center;
  color: #ededed;
`;
template`footer[© 2022 Diogo Neves | 07dneves(@)gmail.com]`;
