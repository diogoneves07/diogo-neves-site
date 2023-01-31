import { lazy } from "bemtv";

lazy(
  "BomLinguagemFavorita",

  () => import(`./articles/BomLinguagemFavorita`),

  (has) => has || "Loading[]"
);

lazy(
  "SuperIAVSDevs",

  () => import(`./articles/SuperIAVSDevs`),

  (has) => has || "Loading[]"
);

lazy(
  "BlowUpX",

  () => import(`./articles/BlowUpX`),

  (has) => has || "Loading[]"
);

lazy(
  "BemtvJS",

  () => import(`./articles/BemtvJS`),

  (has) => has || "Loading[]"
);
