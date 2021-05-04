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

const getShip = () => {
    return new Promise((resolve, reject) => {
        request('https://www.aldabraexpeditions.com/mayas-dugong.html')
            .then(html => {
                const m = regexMayas.exec(html);
                console.log(m);
                return resolve(({
                    timestamp: Date.now(),
                    date: new Date(),
                    lat: m[2],
                    long: m[1],
                    title: 'mayas-dugong'

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