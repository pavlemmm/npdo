import requests
from getpass import getpass

URL = "http://localhost:5000"

token = ""
while True:
    pw = getpass("Unesi sifru: ")
    r = requests.post(
        URL + "/api/users/login", json={"email": "admin@gmail.com", "password": pw}
    )
    if not r.ok:
        print(r.text)
        input("\n\nPritisni enter da nastavis...")
    else:
        token = r.json()["token"]
        break


while True:
    i = input("\nUnesi email: ")
    r = requests.post(
        URL + "/api/users/sign", headers={"authorization": token}, json={"email": i}
    )
    print(r.text)
    if not r.ok:
        input("\n\nPritisni enter da nastavis...")
