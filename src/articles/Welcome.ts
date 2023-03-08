import { _ } from "bemtv";

const { template } = _`Welcome`();

template`
article[
    h1[Diogo Neves]
    
    p[
        Sou um desenvolvedor com foco em Frontend, mas também tenho habilidades em Backend. Com anos de prática e dedicação, aprendi a dedicar horas, dias e até meses para resolver problemas complexos e aprimorar minhas habilidades.

    ]
    p[
        Possuo  experiência em diversas ferramentas e tecnologias, incluindo, mas não limitado a: Javascript, Typescript, HTML, CSS, React, Angular, Vite, NodeJS, Python, Regex, GraphQl, Jest, Git, e CI/CD. Além disso, tenho conhecimentos sólidos em arquiteturas e práticas recomendadas para desenvolvimento de software.
    ]
    p[
        Notavelmente, sou proficiente em JavaScript/TypeScript, a linguagem que usei para desenvolver 4 bibliotecas, a mais recente uma biblioteca de interface de usuário (UI) semelhante a React chamada Bemtv (que está por trás deste site). 
    ]
    p[
        Para mais informações você pode acessar meu perfil no  
        a[ href = "https://www.linkedin.com/in/diogoneves07/" ~ LinkedIn]
         e também no a[ href = "https://github.com/diogoneves07" ~ Github].
    ]
    section[
        h3[Em cartaz: ]

        blockquote[
            Neste momento esta secção não tem todos os meus artigos e nem todos os meus projetos, em breve estarão disponíveis, até lá você pode acessar os meus artigos em: 
            
            a[ href = "https://dev.to/diogoneves07" ~ dev.to - diogoneves07] e os meus projetos em:
            a[ href = "https://github.com/diogoneves07" ~ Github - diogoneves07].
        ]
        
        Poster[]        
    ]
    footer[
        p[
            Última atualização

            time[ datetime="2022-12-27 22:24" ~ 2022/12/27]

        ]
    ]
  ]`;
