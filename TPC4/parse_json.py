import json
import sys

# python3 parse_json.py dataset/compositores.json dataset/parsed_compositores.json

def parseInputJson(jsonInputFile):
    jsonFile = open(jsonInputFile,"r")
    bd = json.load(jsonFile)
    return bd

def dumpToJson(bd,jsonOutputFile):
    jsonFile = open(jsonOutputFile,"w")
    jsonFile.write(json.dumps(bd,indent=4))
    return bd

def calc_dict_periodos(bd):
    periodos = dict()
    idCounter = 0
    for elem in bd["compositores"]:
        if elem["periodo"] not in periodos:
            idCounter = idCounter + 1
            periodos[elem["periodo"]] = {"id": str(idCounter), "nome": elem["periodo"], "compositores": [(elem["id"],elem["nome"])]}
        else:
            periodos[elem["periodo"]]["compositores"].append((elem["id"],elem["nome"]))
    return periodos

def calc_list_compositores(periodos_dic,bd):
    compositoresList = []
    for elem in bd["compositores"]:
        tempElem = elem
        periodoEntry = periodos_dic[elem["periodo"]]
        tempElem["periodo"] = (periodoEntry["id"],periodoEntry["nome"])
        compositoresList.append(tempElem)
    
    return compositoresList

def main(argv):
    jsonFile = open(argv[1])
    bd = json.load(jsonFile)
    periodos_dic = calc_dict_periodos(bd)

    compositores_list = calc_list_compositores(periodos_dic,bd)
    periodos_list = list(periodos_dic.values())
    
    finalDict = {"compositores": compositores_list, "periodos": periodos_list}
    dumpToJson(finalDict,argv[2])

if __name__ == "__main__":
    main(sys.argv)
