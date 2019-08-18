const functions = require('firebase-functions');
const request = require('request-promise');
const secureCompare = require('secure-compare');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

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

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.findShip = functions.https.onRequest((req, res) => {
    const key = req.query ? req.query.key : '';

    // Exit if the keys don't match.
    if (!secureCompare(key, functions.config().cron.key)) {
        console.log('The key provided in the request does not match the key set in the environment. Check that', key,
            'matches the cron.key attribute in `firebase env:get`');
        res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
            'cron.key environment variable.');
        return null;
    }
    getShip()
        .then(locations => {
            locations.forEach(location => {
                db.collection('ship-location').add(location);
                res.json(location);
            })
        })
        .catch(error => {
            console.error(error);
        });

});



