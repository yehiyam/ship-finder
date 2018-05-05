const request = require('request-promise');
const htmlparser = require("htmlparser2");
const queryString = require('query-string');
const main=async () => {
    try {
        const html = await request('https://www.heritage-expeditions.com/ship-map/');
        const handler = new htmlparser.DomHandler((error, dom)=> {
            if (error){
                console.error(error); 
            }
            else {
                const src = dom[0].attribs.src;
                const srcUnescaped = src.replace(new RegExp('&amp;', 'g'),'&');
                const srcParsed = queryString.parse(srcUnescaped);
                const latlong = srcParsed.ll;
                console.log(`${new Date()}, ${latlong}`);
            }
        });
        const parser = new htmlparser.Parser(handler);
        parser.write(html);
        parser.end();

    } catch (error) {
        console.error(error);        
    }

};

main();