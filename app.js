const request = require('request-promise');

const regex = /markers: JSON\.parse\('(.*)'\)/gm;
const regexMayas = /long=([\d.]*).*lat=([\d.-]*)/gm;

// const getShip = () => {
//     return new Promise((resolve, reject) => {
//         request('https://www.heritage-expeditions.com/captains-log/')
//             .then(html => {
//                 const m = regex.exec(html);
//                 console.log(m[1]);
//                 const data = JSON.parse(m[1]);
//                 return resolve(data.map(d=>({
//                     timestamp: Date.now(),
//                     date: new Date(),
//                     lat: d.lat,
//                     long: d.lng,
//                     title: d.title

//                 })))
//             }).catch(error => {
//                 return reject(error);
//             })
//     });
// };

// const getShip = () => {
//     return new Promise((resolve, reject) => {
//         request('https://www.aldabraexpeditions.com/mayas-dugong.html')
//             .then(html => {
//                 const m = regexMayas.exec(html);
//                 console.log(m);
//                 return resolve(({
//                     timestamp: Date.now(),
//                     date: new Date(),
//                     lat: m[2],
//                     long: m[1],
//                     title: 'mayas-dugong'

//                 }))
//             }).catch(error => {
//                 return reject(error);
//             })
//     });
// };

const getShip = () => {
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

const main = async () => {
    const res = await getShip();
    console.log(res)
}
main();