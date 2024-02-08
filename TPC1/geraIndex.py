#!/usr/bin/env python3

import xml.etree.ElementTree as ET 
import os

# parse XML file into tree, using the ET library
#parseXML devolve a root da árvore criada, aka rua
def parseXML(file: str):
	tree = ET.parse(file)
	root = tree.getroot()
	return root

def parseNumero(num: str):
	return int(num)

def parseNome(nome: str):
	return 	nome.strip()

#path dos xml files
file_path= "./dataset/texto/"

preHTML = """
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Índice Ruas</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="w3.css">
	</head>

	<body>
		<div class="w3-card-4">
			<header class="w3-container w3-green">
				<h3>Lista de Ruas</h3>
			</header>

			<div class="w3-container">
				<ul class="w3-ul w3-card-4" style="width:50%">
"""	

posHTML = """
				</ul>
			</div>

			<footer class="w3-container w3-green">
				<h5>Generated by RuasApp::EngWeb2024::A100709</h5>
			</footer>
		</div>
	</body>
</html>
"""
conteudoHTML = ""

#acumulador de dados de todas as ruas, para poder dar sort depois
lista_ruas = []

directory = os.fsencode(file_path)

for file in os.listdir(directory):
	filename = os.fsdecode(file)

	rua = parseXML(file_path + filename)
	meta = rua.find("./meta")

	#extrair número
	numero = parseNumero(meta.find("./número").text)
	nome = parseNome(meta.find("./nome").text)

	lista_ruas.append((numero,nome))

# sort da ordem de apresentação do índice de ruas por ordem alfabética (do nome suponho?)
lista_ruas.sort(key = lambda x: x[1])

for (numero,nome) in lista_ruas:
	conteudoHTML += f"""
		<li>
			<a href="rua{numero}.html">{nome}</a>
		</li>
	"""

pagHTML = preHTML + conteudoHTML + posHTML

outFile = open("./ruasSite/index.html", "w")
outFile.write(pagHTML)
outFile.close()
