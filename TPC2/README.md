# TPC2: Mapa Virtual de Cidades
## 2024-02-24

## Autor:
- A100709
- Pedro Miguel Meruge Ferreira

## Resumo

Neste trabalho utilizou-se o material fornecido pelo docente, ficheiro JSON com informações de 100 cidades de Portugal e de ligações entre elas, a fim de construir para suportar um serviço de entrega de ficheiros. Recebendo um pedido http, o serviço deve responder com um dos seguintes tipos de ficheiro:
- Uma página [**inicial**](cidadesSite/index.html) html de índice, que lista as cidades presentes no dataset, ordenadas por ordem alfabética
- A página de uma cidade (por exemplo [**Braga**](cidadesSite/c25.html)), que apresenta informações da mesma: nome, distrito, descrição e população. Apresenta ainda uma lista de ligações desta a outras cidades e a respetiva distância em km
- O ficheiro [**w3.css**](cidadesSite/w3.css) necessários para a formatação correta dos elementos da página.
- Uma página de erro html quando o pedido não é reconhecido

O script [**geraIndex**](geraIndex.py) em python lê o ficheiro json fornecido e cria o código *HTML* para a página [**inicial**](cidadesSite/index.html). Para cada cidade, acrescenta uma entrada que inclui o seu nome e distrito e um link para o serviço de entrega de ficheiros. Clicando nessa entrada, o serviço devolve a página HTML da respetiva cidade.

O script[**geraPags**](geraPags.py) em python lê o ficheiro json fornecido e cria o código *HTML* para cada página de cidade específica. Primeiro percorre as ligações no dataset e constrói um dicionário em que associa para cada ID de cidade os IDs de outras cidades com as quais possui ligações. De seguida, o script produz o código *HTML* com informações sobre a cidade, uma tabela com as cidades com que tem ligação (nome e link para as suas páginas) e um link para voltar ao índice. Tal como na página inicial, os links utilizados não são para páginas estáticas mas pedidos para o serviço de entrega de ficheiros.

