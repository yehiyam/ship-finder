const request = require('request-promise');
const htmlparser = require("htmlparser2");
const queryString = require('query-string');
const { CronJob } = require('cron');
// const getShip=async () => {
//     try {
//         const html = await request('https://www.heritage-expeditions.com/ship-map/');
//         return new Promise((resolve, reject) => {
//             const handler = new htmlparser.DomHandler((error, dom)=> {
//                 if (error){
//                     console.error(error); 
//                     return reject(error);
//                 }
//                 else {
//                     const src = dom[0].attribs.src;
//                     const srcUnescaped = src.replace(new RegExp('&amp;', 'g'),'&');
//                     const srcParsed = queryString.parse(srcUnescaped);
//                     const latlong = srcParsed.ll;
//                     const [lat,long] = latlong.split(',');
//                     return resolve({
//                         timestamp: Date.now(),
//                         lat,
//                         long
//                     })
//                 }
//             });
//             const parser = new htmlparser.Parser(handler);
//             parser.write(html);
//             parser.end();
//         });


//     } catch (error) {
//         console.error(error);        
//     }

// };

const getShip = () => {
    return new Promise((resolve, reject) => {
        request('https://www.heritage-expeditions.com/ship-map/')
            .then(html => {
                const handler = new htmlparser.DomHandler((error, dom) => {
                    if (error) {
                        console.error(error);
                        return reject(error);
                    }
                    else {
                        const src = dom[0].attribs.src;
                        const srcUnescaped = src.replace(new RegExp('&amp;', 'g'), '&');
                        const srcParsed = queryString.parse(srcUnescaped);
                        const latlong = srcParsed.ll;
                        const [lat, long] = latlong.split(',');
                        return resolve({
                            timestamp: Date.now(),
                            lat,
                            long
                        })
                    }
                });
                const parser = new htmlparser.Parser(handler);
                parser.write(html);
                parser.end();
            }).catch(error => {
                return reject(error);
            })
    });
};
const main = async () => {
    // const job = new CronJob({
    //     cronTime: '*/1 * * * *',
    //     onTick: async () => {
    //         const res = await getShip();
    //         console.log(res)
    //     },
    //     start: true,
    //     timeZone: 'Asia/Jerusalem'
    //   });
    const res = await getShip();
    console.log(res)
}
main();