const functions = require('firebase-functions');
const request = require('request-promise');
const secureCompare = require('secure-compare');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const regex = /markers: JSON\.parse\('(.*)'\)/gm;
const regexMayas = /long=([\d.]*).*lat=([\d.-]*)/gm;

const getShip = () => {
    return new Promise((resolve, reject) => {
        request('https://www.heritage-expeditions.com/captains-log/')
            .then(html => {
                const m = regex.exec(html);
                console.log(m[1]);
                const data = JSON.parse(m[1]);
                return resolve(data.map(d => ({
                    timestamp: Date.now(),
                    date: new Date(),
                    lat: d.lat,
                    long: d.lng,
                    title: d.title

                })))
            }).catch(error => {
                return reject(error);
            })
    });
};

const getShipMayas = () => {
    return new Promise((resolve, reject) => {
        request('https://www.aldabraexpeditions.com/mayas-dugong.html')
            .then(html => {
                const m = regexMayas.exec(html);
                console.log(`m=${m}`)
                if (m && m.length === 3){
                    return resolve(({
                        timestamp: Date.now(),
                        date: new Date(),
                        lat: parseFloat(m[2]),
                        long: parseFloat(m[1]),
                        title: 'mayas-dugong'
    
                    }))                    
                }
                return resolve()

            }).catch(error => {
                return reject(error);
            })
    });
};

const getShipSeaSpirit = () => {
    return new Promise((resolve, reject) => {
        request('https://www.cruisemapper.com/map/ships.json?filter=1&zoom=4&imo=8802868&mmsi=255806397',{
            "headers": {
                "authority": "www.cruisemapper.com",
                "accept": "application/json, text/javascript, */*; q=0.01",
                'accept-language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7',
                'referer': 'https://www.cruisemapper.com/?imo=8802868',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                "x-requested-with": "XMLHttpRequest"
              },
              json: true
        })
            .then(data => {
                if (!data || data.length==0){
                    return resolve()
                }
                const myShip = data.find(d=>d.hover==='MV Sea Spirit')
                return resolve(({
                    timestamp: myShip.tst,
                    date: new Date(),
                    lat: myShip.lat,
                    long: myShip.lon,
                    title: myShip.hover

                }))
            }).catch(error => {
                return reject(error);
            })
    });
};

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.findShip = functions.https.onRequest((req, res) => {
    const key = req.query ? req.query.key : '';

    // Exit if the keys don't match.
    if (!secureCompare(key, functions.config().cron.key)) {
        console.log('The key provided in the request does not match the key set in the environment. Check that', key,
            'matches the cron.key attribute in `firebase env:get`');
        res.status(403).send('Unauthorized.');
        return null;
    }
    return getShipSeaSpirit()
        .then(location => {
            if (location){
                db.collection('ship-location-new').add(location);
                res.json(location);
            }
            else {
                console.log('no result')
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500);
        });

});



