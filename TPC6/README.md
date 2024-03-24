# TPC6: Catálogo de compositores e períodos - com express e mongoDB
## 2024-03-24

## Autor:
- A100709
- Pedro Miguel Meruge Ferreira

## Resumo
Neste trabalho reutilizei o dataset já processado para o TPC4 e TPC5, relativo a compositores e períodos, para desenvolver um serviço idêntico de entrega de ficheiros sobre compositores e períodos.

O serviço suporta os mesmos pedidos:
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

A principal diferença em relação aos TPCs anteriores está na forma como os dados do dataset são obtidos. Antes recorria-se ao serviço do **json-server**, que oferecia suporte para pedidos HTTP de tipo GET, PUT, DELETE, POST sobre o dataset. Agora, importei o dataset para **mongoDB** (instalado num contentor de docker) e criei um serviço novo, com recurso à biblioteca **mongoose**, que suporta os mesmos tipos de pedido HTTP que o json-server fornecia. 

Em suma, o projeto apresenta uma estrutura com uma BD e 2 serviços. A base de dados utilizado é mongoDB. O primeiro serviço é uma API que faz a ligação à base de dados. O segundo serviço suporta-se no primeiro serviço, comunicando entre si com dados no formato JSON. O cliente utiliza o segundo serviço para obter os ficheiros pretendidos sobre compositores e períodos.