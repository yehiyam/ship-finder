const request = require('request-promise');
const htmlparser = require("htmlparser2");
const domutils = require("domutils");
const queryString = require('query-string');
const { CronJob } = require('cron');

const regex = /markers: JSON\.parse\('(.*)'\)/gm;

const getShip = () => {
    return new Promise((resolve, reject) => {
        request('https://www.heritage-expeditions.com/captains-log/')
            .then(html => {
                const m = regex.exec(html);
                console.log(m[1]);
                const data = JSON.parse(m[1]);
                return resolve(data.map(d=>({
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
const main = async () => {
    const res = await getShip();
    console.log(res)
}
main();