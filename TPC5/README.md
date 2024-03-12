# TPC5: Catálogo de compositores e períodos - com express e pug templates
## 2024-03-11

## Autor:
- A100709
- Pedro Miguel Meruge Ferreira

## Resumo

Neste trabalho utilizou-se o material fornecido pelo docente, ficheiro JSON com informações de compositores, a fim de construir um serviço de entrega de ficheiros, que suporta CRUD para compositores e períodos musicais . O servidor constrói dinamicamente páginas HTML e suporta-se nos serviços ***JSON-SERVER*** e ***AXIOS***.

O script [**parse_json.py**](parse_json.py) trata o dataset fornecido, construindo 2 coleções de dados: compositores e periodos. Cada elemento compositor inclui, nomeadamente, o id e nome do período a que está associado. Por sua vez, cada elemento período contém, nomedamente, uma lista de ids e nomes de compositores desse período. O script segue o mesma lógica que a seguida no script de processamento do dataset do TPC3. O dataset final utilizado pelo json-server server consta no ficheiro [**final_compositores.json**](dataset/final_compositores.json). Tal como no TPC3, por simplicidade, incluo junto dos ids de um compositor/periodo o respetivo nome do compositor/período, nas várias entradas dos catálogos.
 
O serviço suporta os seguintes pedidos:
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

Para além do script em python inicial, existem ainda os scripts:
- [**compositores_server.js**](compositores_server.js): cria o servidor e redireciona os pedidos para o seu processamento correto, distinguindo se mensagem HTTP tem método GET ou POST.
- [**compositoresTemplates.js**](compositoresTemplates.js) e [**periodosTemplates.js**](periodosTemplates.js) geram dinamicamente as páginas HTML para cada tipo de pedido.
- [**static.js**](static.js) é um ficheiro disponibilizado pelo docente que processa pedidos para objetos estáticos, como o favicon.png e ficheiros de css.

Nas diferentes páginas do serviço, clicando num compositor ou género, o utilizador é redirecionado para a sua página específica. É possível editar ou remover dados de compositores e géneros (inclusive trocar o período de um compositor). Existe uma lista de todos os períodos e de todos os compositores. A página de cada período específico enumera todos os compositores desse período.

