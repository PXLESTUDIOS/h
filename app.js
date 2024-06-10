const http = require("http");
const express = require("express")
    ,cookieParser = require("cookie-parser");
const app = express()
const port = 80

app.use(express.static('public'));
app.use(cookieParser)

app.get('/', function (req,res){
    res.redirect('/index.html')
})

const { exec } = require('child_process');

function getCurrentWifiProfile() {
    return new Promise((resolve, reject) => {
        exec('netsh wlan show interfaces', (error, stdout, stderr) => {
            if (error) {
                reject(`Error getting current WiFi profile: ${stderr}`);
            } else {
                const ssidLine = stdout.split('\n').find(line => line.includes('SSID'));
                const ssid = ssidLine ? ssidLine.split(':')[1].trim() : null;
                if (ssid) {
                    resolve(ssid);
                } else {
                    reject('No WiFi connection found');
                }
            }
        });
    });
}

function getWifiPassword(profile) {
    return new Promise((resolve, reject) => {
        exec(`netsh wlan show profile name="${profile}" key=clear`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error getting password for ${profile}: ${stderr}`);
            } else {
                const passwordLine = stdout.split('\n').find(line => line.includes('Key Content'));
                const password = passwordLine ? passwordLine.split(':')[1].trim() : 'N/A';
                resolve({ profile, password });
            }
        });
    });
}



app.listen(port)
console.log("We be listening on port " + port)