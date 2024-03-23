import { _ } from "bemtv";
import Atropos from "atropos";

const { onMount, css, template } = _`Poster`();

css`
  width: 100%;

  .card-content {
    background: rgb(89, 25, 81);
    background: linear-gradient(
      190deg,
      rgba(89, 25, 81, 0.6) 78%,
      rgba(2, 10, 88, 0.6) 76%
    );
    text-align: center;

    overflow: hidden;
  }
  .card {
    height: 250px;
    width: 300px;
    margin: 25px 30px 25px 30px;
    display: inline-block;
    white-space: normal;
    background: rgb(89, 25, 81);
    background: linear-gradient(
      150deg,
      rgba(2, 10, 88, 0.8) 76%,
      rgba(89, 25, 81, 0.8) 78%
    );
  }
  .card a {
    color: white;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    font-size: 20px;
    word-wrap: break-word;
    overflow: hidden;
    padding: 0 10%;
    height: 100%;
    width: 100%;
    text-align: center;
  }
`;

onMount(() => {
  const myAtropos = Atropos({
    el: ".my-atropos",
    activeOffset: 20,
    shadowScale: 0,
  });

  console.log(myAtropos);
});

template`

<div class="atropos my-atropos">
  <div class="atropos-scale">
    <div class="atropos-rotate">
      <div class="atropos-inner">
      div[
        div[ 
            class="card-content" 
            ~ 
           div[ 
              class="card" 
              ~ 

              #BemtvJS[strong[ BemtvJS - A minha biblioteca de interface de usuário (UI) ]]
           ]
           div[ 
            class="card" 
            ~ 

            #BomLinguagemFavorita[strong[ O quão bom você é na sua linguagem favorita? ]]
            ]
            div[ 
                class="card" 
                ~ 
                #BlowUpX[strong[ BlowUpX - O meu jogo ]]
            ]
           
            div[ 
                class="card" 
                ~ 
                #SuperIAVSDevs[strong[ Super IA vs Devs ]]

            ]
            
        ]
    ]
      </div>
    </div>
  </div>
</div>

    `;
