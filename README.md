# Um Visualizador de Algoritmos em Grafos

Este projeto é o trabalho final da matéria MATA53 - Teoria dos Grafos, lecionada pelo professor Tiago de Oliveira Januário em 2021.1 na Universidade Federal da Bahia.
O desafio proposto foi de demonstrar visualmente a execução de algum algoritmo em grafos.

O trabalho foi feito em Javascript, utilizamos a biblioteca [p5.js](https://p5js.org/) para criar um visualizador interativo que permite que o usuário desenhe um grafo qualquer e veja como algum dos algoritmos que escolhemos é executado nele.

---

### Grupo

| Integrante                      | Matrícula | Algoritmo                                                                       | Repositório                                                |
| ------------------------------- | --------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Bruno Nunes de Oliveira Machado | 218115569 | [Topological Sorting](https://en.wikipedia.org/wiki/Topological_sorting)        | https://github.com/brunonom/topological-sorting-visualizer |
| Giselly Alves Reis              | 218115560 | [Johnson's Algorithm](https://en.wikipedia.org/wiki/Johnson%27s_algorithm)      | https://github.com/gisellyreis/Trabalho_Final_MATA53       |
| Vinícius Teixeira Hirschle      | 218123937 | [Borůvka's Algorithm](https://en.wikipedia.org/wiki/Bor%C5%AFvka%27s_algorithm) | https://github.com/viniciusth/boruvka-visualizer |

---

### Instruções

Para rodar o projeto, você pode baixar o código desse repositório (ou qualquer outro acima, eles são idênticos) e abrir o arquivo `index.html` com o seu navegador

Alternativamente, você pode visitar o projeto online em qualquer um desses links (eles também são idênticos):
- https://brunonom.github.io/topological-sorting-visualizer/
- https://viniciusth.github.io/boruvka-visualizer/
- https://gisellyreis.github.io/graph-algorithms-viewer/

Após desenhar o grafo, você pode escolher um algoritmo e executá-lo sobre o grafo que você desenhou.

Se o seu grafo cumprir os pré-requisitos do algoritmo, ele executará até o final sem problemas e você poderá ver como é sua execução.

Se o seu grafo não cumprir os pré-requisitos do algoritmo, um aviso será dado na caixa branca no canto inferior esquerdo da tela.

Preste atenção nessa caixa branca de bordas azuis. Além de erros, ela também indica o que fazer em algoritmos que requerem entrada do usuário, dentre outras coisas.

---

### Funcionalidades base

- Adicionar vértice: clique duplo
- Mover objetos: clicar + arrastar
- Adicionar aresta não direcionada: `SHIFT` + clicar + arrastar 
- Adicionar aresta direcionada: `CTRL` + clicar + arrastar
- Mudar direcionamento da aresta: `CTRL` + clique
- Selecionar objeto: clique
- Editar rótulo: selecionar objeto + digitar
- Deletar objeto: selecionar objeto + `DEL`
- Selecionar algoritmo: menu dropdown
- Executar algoritmo: botão
- Limpar a tela: botão

---

### Funcionalidades extra
- Controlar a velocidade de execução do algoritmo: slider azul
- Salvar o estado atual do grafo: botão
  - Somente um grafo pode ser salvo por vez
  - Informação é perdida quando se recarrega a página
- Carregar último grafo salvo: botão
