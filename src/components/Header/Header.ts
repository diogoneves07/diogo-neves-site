import { useElManager, _ } from "bemtv";

import { setDevMessage } from "./set-dev-message";

export const { onMount, css, template } = _`Header`();

export const devMessageEl = useElManager<HTMLElement>();

onMount(setDevMessage);

template`
div[ 
    header[
      div[
        blockquote[
          p[
            “Meus projetos, reflexões e artigos profundos, atualmente focados em desenvolvimento web.”
            
          ]
        ]
        div[
          strong[ ${devMessageEl} Devs.has(“diogoneves07”) ]
        ] 
      ]
    ]

    div[class="strange-shape" ~]
]`;
