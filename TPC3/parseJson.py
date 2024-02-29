import json


def parseInputJson(jsonInputFile):
    jsonFile = open(jsonInputFile,"r")
    bd = json.load(jsonFile)
    return bd

# def parse_filmes(bd):
#     for item in bd:
#         item['id'] = item['_id']['$oid'] # remover o passo extra de ter $oid
#         del item['_id']
#     outputFile = open('dataset/filmes2.json',"w")
#     json.dump(bd,outputFile,indent=4)

# devolve lista de filmes(com ids de géneros e atores)
def calc_list_filmes(bd, generos_dic, atores_dic):
    filmesList = []
    for item in bd:
        currCast = item.get('cast',[])
        for index in range(0,len(currCast)):
            item['cast'][index] = atores_dic [item['cast'][index]] ['id'] # substituir nome de ator pelo seu id atribuido

        currGen = item.get('genres',[])
        for index in range(0,len(currGen)):
            item['genres'][index] = generos_dic [item['genres'][index]] ['id'] # substituir nome de genero pelo seu id atribuído
    
        filmesList.append(item)
    return filmesList

# devolve dicionario de nome de género para objeto genero (que é em si um dicionário)
def calc_dic_generos(bd):
    counter = 0
    generosDict = dict()
    for item in bd:
        if(len(item.get('genres',[])) > 0): # a ultima linha n tem genres!
            for genre in item['genres']:
                if (genre in generosDict):
                    generosDict[genre]['idFilmes'].append(item['id'])
                else:
                    counter+= 1
                    generosDict[genre] = {'id':counter,'nomeGen':genre,'idFilmes':[ item['id']]}
    return generosDict

# devolve dicionario de nome de ator para objeto ator (que é em si um dicionário)
def calc_dic_atores(bd):
    counter = 0
    atoresDict = dict()
    for item in bd:
        if(len(item['cast']) > 0):
            for ator in item['cast']:
                if (ator in atoresDict):
                    atoresDict[ator]['idFilmes'].append(item['id'])
                else:
                    counter+= 1
                    atoresDict[ator] = {'id':counter,'nomeAtor':ator,'idFilmes':[item['id']]}
    return atoresDict

def main():
    jsonInputFile = 'dataset/filmes_parsed.json' # já removi objeto nested "oid", e meti todas as linhas do json dentro de lista
    bd = parseInputJson(jsonInputFile)

    # calc_filmes(bd)
    generos_dic = calc_dic_generos(bd)
    atores_dic = calc_dic_atores(bd)
    filmes_list = calc_list_filmes(bd, generos_dic, atores_dic)

    generos_list = list(generos_dic.values())
    atores_list = list(atores_dic.values())

    mainDict = {'filmes':filmes_list, 'generos': generos_list,'atores': atores_list}

    outputFile = open('dataset/filmes_final.json',"w")
    json.dump(mainDict,outputFile,indent=4)

if __name__ == "__main__":
    main()
