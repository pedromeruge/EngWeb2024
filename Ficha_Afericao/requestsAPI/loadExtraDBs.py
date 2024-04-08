import json
import sys
import requests

# carregar para a db o ficheiro passado como argumento
with open(f'../datasets/{sys.argv[1]}', 'r', encoding='utf-8') as datasetFile:
    data = json.load(datasetFile)

end_point = "http://localhost:3000/"

# Define headers
headers = {
    'Content-Type': 'application/json'
}

for pessoa in data["pessoas"]:
    # Post entry
    response = requests.post(end_point, json=pessoa, headers=headers) # requests já serializa, n precisamos de fazer json.dumps()

    # Check the response status
    if response.status_code == 2001:
        print("New entry created successfully.")
    else:
        print("Failed to create new entry. Status code:", response.status_code)
        print("Response content:", response.content)
print("Finished")