import { useElManager, _ } from "bemtv";

import { setDevMessage } from "./set-dev-message";

export const { onMount, css, template } = _`Header`();

export const devMessageEl = useElManager<HTMLElement>();

onMount(setDevMessage);

template`
div[ 
    header[
      div[
        div[
          strong[ ${devMessageEl} Devs.has(“diogoneves07”) ]
        ] 
      ]
    ]

    div[class="strange-shape" ~ ]
]`;
