import os
import glob
import xml.etree.ElementTree as ET
import xmlschema

rua_numero = -1
rua_nome = ""

def parseXML(file: str, schema):
    try:
        tree = ET.parse(file)
        
        #validate XML against XSD schema
        # if schema.is_valid(tree): ## alguns ficheiros estão a dar conflito, mas n parecem ter nada de errado, ignorei
        # if xmlschema.XMLSchema(file):
        return tree.getroot()
        # else:
        #     print(f"{file} conflicts with XSD schema")
        #     return None
    except ET.ParseError as e:
        print(f"Error parsing {file}: {e.msg}")
        return None

def parseNumero(num: str) -> int:
    rua_numero = int(num)
    return rua_numero

def parseNome(nome: str) -> str:
    rua_nome = nome.strip()
    return rua_nome

def generate_meta_html(elem):
    global rua_numero 
    rua_numero = parseNumero(elem.find("número").text)
    global rua_nome 
    rua_nome = parseNome(elem.find("nome").text)
    html = f"""<!DOCTYPE html>
<html lang="en">
    <head>
        <title>{rua_numero}. {rua_nome}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="w3.css">
    </head>

    <body>
        <div class="w3-card-4">

            <header class="w3-container w3-green">
                <h3>{rua_numero}. {rua_nome}</h3>
            </header>
            
            <div class="w3-container">
    """	
    return html

def generate_para_html(elem, withTag: bool):
    html = """            <div class="w3-container">"""
    if (withTag is True):
        html += "            <h4>"
    for sub_elem in elem.itertext():
        # if sub_elem.tag == "lugar":
        #     html += f"<b>{sub_elem.text}</b>"
        # if sub_elem.tag == "data":
        #     html += f"<i>{sub_elem.text}</i>"
        # if sub_elem.tag =="entidade": 
        #     html += generate_tipoEntidade_html(sub_elem)
        # else:
        #     html += sub_elem.text 
        html += sub_elem
    if (withTag is True):
        html += "</h3>"
    html += """</div>
    """
    return html

def generate_tipoEntidade_html(elem):
    # match para se for pessoa, instituição empresa, família ..
    return elem.text

def generate_lista_casas_html(elem):
    html= """
            <h4><b>Lista de casas</b></h4>
            <div class="w3-container">
                <table class="w3-table-all">
                    <tr>
                        <th>Nº casa</th>
                        <th>Enfiteuta</th>
                        <th>Foro</th>
                        <th>Descrição</th>
                        <th>Vista</th>
                    </tr>"""
    for casa_elem in elem.findall("casa"):
        numero = casa_elem.find("número").text
        enfiteuta = casa_elem.find("enfiteuta").text if casa_elem.find("enfiteuta") is not None else "-"
        foro = casa_elem.find("foro").text if casa_elem.find("foro") is not None else "-"
        
        desc_text = "-"
        desc = casa_elem.find("desc")
        if desc is not None:
            desc_text = ""
            for para_elem in desc.findall("para"):
                desc_text += generate_para_html(para_elem,False)

        vista = casa_elem.find("vista").text if casa_elem.find("vista") is not None else "-"

        html +=f"""
                    <tr>
                        <td>{numero}</td>
                        <td>{enfiteuta}</td>
                        <td>{foro}</td>
                        <td>{desc_text}</td>
                        <td>{vista}</td>
                    </tr>"""
        
    html += """
                </table>
            </div>
    """
    return html

def generate_figura_html(elem,fig_count: int):
    #falta atributo largura na imagem??
    fotos_atuais = glob.glob("./dataset/atual/" + str(rua_numero) + "-*.JPG");
    # print(fotos_atuais)
    html=f"""
            <div class="w3-container">
                <div class="w3-container" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                    <div class="w3-center image-div">
                        <img src={"../dataset/" + elem.find("imagem").attrib["path"][3:]} alt="foto não carregou" style="object-fit: cover; width:auto; max-height: 700px; max-width: 100%">
                        <div class="w3-container">
                            <p>{elem.find("legenda").text}</p>
                        </div>
                    </div>
    """
    if (fig_count + 1) <= len(fotos_atuais):
        foto_path = fotos_atuais[fig_count]
        html += f"""     
                    <div class="w3-center image-div">   
                        <img src={"." + foto_path} alt="foto não carregou" style="object-fit: cover; width:auto; max-height: 700px; max-width: 100%">
                        <div class="w3-container">
                            <p>{elem.find("legenda").text + " (atualmente)"}</p>
                        </div>
                    </div>
        """
    html+= "\n      </div></div>"
    return html

def generate_nome_html(elem):
    html = f"""
        <h4>
            <b>{elem.text}</b>
        </h4>
    """
    return html

def generate_remaining_figuras_html(fotos_atuais, de: int, para: int):
    print(str(rua_numero) + " chamou remaning_figuras" )
    html=f"""
            <div class="w3-container">
                <h4><b>Outras imagens</b></h4>
                <div class="w3-container" style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">

    """
    for foto_path in fotos_atuais[de:para]:
        html += f"""     
                    <div class="w3-center image-div">   
                        <img src={"." + foto_path} alt="foto não carregou" style="object-fit: cover; width:auto; max-height: 700px; max-width: 100%">
                        <div class="w3-container">
                            <p>{rua_nome + " (atualmente)"}</p>
                        </div>
                    </div>
        """
    html+= "\n      </div></div>"
    return html

file_path= "./dataset/texto/"

xsd_schema = xmlschema.XMLSchema("./dataset/MRB-rua.xsd")

directory = os.fsencode(file_path)

posHTML = """
                <div class="w3-container">
                    <address>
                        <a href="index.html">Voltar a pagina principal</a>
                    </address>
                </div>
            </div>
			<footer class="w3-container w3-green">
				<h5>Generated by RuasApp::EngWeb2024::A100709</h5>
			</footer>
		</div>
	</body>
</html>
"""

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    # print(filename)
    rua = parseXML(file_path + filename, xsd_schema)
	
    conteudoHTML = ""
    # se ficheiro não estiver bem formatado, saltá-lo
    if rua is None:
        print("Rua was not found")
        continue

    meta = rua.find("./meta")
    if meta is None:
        print("Couldn't find meta tag")
        continue
    
    fig_count = 0 # contador da figura atual, para associar uma foto_atual correspondente

    conteudoHTML += generate_meta_html(meta)
    for elem in rua.findall("./corpo/*"):
        match elem.tag:
            case "para":
                conteudoHTML +=  generate_para_html(elem,True)
            case "lista-casas":
                conteudoHTML += generate_lista_casas_html(elem)
            case "figura":
                conteudoHTML +=  generate_figura_html(elem,fig_count)
                fig_count += 1
            case "nome":
                conteudoHTML += generate_nome_html(elem)

    #gerar fotos restantes de sobra que haja
    fotos_atuais = glob.glob("./dataset/atual/" + str(rua_numero) + "-*.JPG");
    total_fotos = len(fotos_atuais) 
    if total_fotos > fig_count:
        conteudoHTML += generate_remaining_figuras_html(fotos_atuais, fig_count, total_fotos)

    outFile = open("./ruasSite/rua" + str(rua_numero) + ".html", "w")
    outFile.write(conteudoHTML + posHTML)
    outFile.close()