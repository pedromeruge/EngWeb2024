# TPC5: Catálogo de compositores e períodos - com express e pug templates
## 2024-03-11

## Autor:
- A100709
- Pedro Miguel Meruge Ferreira

## Resumo

Neste trabalho reutilizei o dataset já processado para o TPC4, relativo a compositores e períodos. Tal como no TPC3 e TPC4, por simplicidade, incluo junto dos ids de um compositor/periodo o respetivo nome do compositor/período, nas várias entradas dos catálogos.
 
O serviço suporta os seguintes pedidos, de forma idêntica ao TPC4:
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

Em vez dos ficheiros javascript utilizados previamente para criar templates dinâmicas, de nomes **"compositores_server.js"** e **"compositoresTemplates.js"**, utiliza-se agora ficheiros ".pug". Todo o código do serviço foi restruturado para utilizar a framework **express**.

Como no TPC4, nas diferentes páginas do serviço, clicando num compositor ou género, o utilizador é redirecionado para a sua página específica. É possível editar ou remover dados de compositores e géneros (inclusive trocar o período de um compositor). Existe uma lista de todos os períodos e de todos os compositores. A página de cada período específico enumera todos os compositores desse período.

