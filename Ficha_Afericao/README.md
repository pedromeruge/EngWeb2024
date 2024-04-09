# Ficha de aferição: Catálogo de pessoas
## 2024-03-24

## Autor:
- A100709
- Pedro Miguel Meruge Ferreira

## Resumo
Neste trabalho resolvi a ficha de aferição disponiblizada com um dataset relativo a dados de pessoas. Carreguei o dataset para uma base de dados em MongoDB e, de seguida, criei uma API de dados REST, usando o express, com as operações CRUD sobre a base de dados criada. 

A API foi definida na pasta [pessoasAPI](pessoasAPI/) e suporta as rotas:
- GET /
- GET /id_pessoa
- GET /modalidades
- GET /modalidades/id_modalidade
- POST /
- PUT /id_pessoa
- DELETE /id_pessoa

De seguida, desenvolvi o script [loadExtraDBs.py](requestsScript/loadExtraDBs.py) que recebe como parâmetro um ficheiro .json e faz pedidos à API criada para carregar a informação para a base de dados.

De seguida, construi um segundo serviço que devolve páginas HTML com a informação das pessoas e possui elementos para executar operações CRUD sobre os dados.
O serviço foi definido na pasta [pessoas_serv](pessoas_serv/) suporta os mesmos pedidos:
- GET /compositores
- GET /compositores/Cid
- GET /compositores/register
- GET /compositores/edit/Cid
- GET /compositores/delete/Cid
- GET /periodos
- GET /periodos/id
- GET /periodos/register
- GET /periodos/edit/id
- GET /periodos/delete/id
- POST /compositores/registo
- POST /compositores/edit/id
- POST /periodos/registo
- POST /periodos/edit/id


Em suma, o projeto apresenta uma estrutura com uma BD e 2 serviços. A base de dados utilizada foi criada com mongoDB. O primeiro serviço é uma API que faz a ligação à base de dados. O segundo serviço suporta-se no primeiro serviço, e o cliente utiliza-o para obter as páginas HTML com dados sobre pessoas.