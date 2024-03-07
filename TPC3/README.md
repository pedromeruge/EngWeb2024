# TPC3: Catálogo de filmes
## 2024-03-01

## Autor:
- A100709
- Pedro Miguel Meruge Ferreira

## Resumo

Neste trabalho utilizou-se o material fornecido pelo docente, ficheiro JSON com informações de filmes,atores e géneros de filmes, a fim de construir um serviço de entrega de ficheiros. Para satisfazer os pedidos de utilizadores, o servidor constrói dinamicamente páginas HTML e suporta-se nos serviços ***JSON-SERVER*** e ***AXIOS***, realizando exclusivamente pedidos HTTP com método GET.

Inicialmente, foi desenvolvido o script [**parseJson.py**](parseJson.py) para corrigir e tratar o dataset fornecido. A partir dos dados originais, foram criadas três coleções de dados no ficheiro [**filmes_final.json**](dataset/filmes_final.json): filmes, atores, géneros. Constrói-se um dicionário que associa o nome de um género ao conjunto de informações desse género (incluindo um id único atribuído). O mesmo processo repete-se para os atores. Constroi-se também uma lista de filmes com, nomeadamente, os respetivos ids de géneros e atores associados a cada filme. No fim escreve-se para um ficheiro json os valores dos dicionários (exclui-se as chaves), e a lista de filmes. Decidi, por simplicidade, incluir junto dos ids de um filme/nome/género o respetivo nome do filme/nome/género, nas várias entradas dos catálogos. Desta forma, na página HTML posso apresentar nomes e não apenas ids, ainda que seja uma solução que implique grande repetição de valores do dataset no json final. Explorei a alternativa de fazer pedidos ao JSON-SERVER para cada entrada dos catálogos, para obter os nomes associadas a cada id de filme/genéro/ator, mas as páginas do serviço demoravam imenso tempo a carregar, tendo assentado na ideia anterior.

O serviço ***JSON-SERVER*** lê o ficheiro json tratado e simula uma base de dados em que o servidor se suporta. O serviço ***AXIOS** realiza pedidos HTTP com método GET ao serviço do JSON-SERVER para extrair dados pertinentes do ficheiro json e satisfazer pedidos de utilizadores. O serviço suporta as seguintes rotas:
- /filmes
- /filmes/idFilme
- /generos
- /generos/idGen
- /atores
- /atores/idAtor

Nas diferentes páginas do serviço, clicando num filme, género ou ator, o utilizador é redirecionado para a sua página específica. Os links utilizados não são para páginas estáticas, mas um pedido para o serviço, entre as rotas referidas acima. Criei também o ficheiro [**styles.css**](styles.css) para explorar fixar o posicionamento dos cabeçalhos de tabelas no topo da página.

