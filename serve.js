// I basically made this so that I could divide logical sections of a website into different SPAs for speed without
// serving the entire website up front. This is heavily based on the below article, although I promise I didn't C/P:
// http://adrianmejia.com/blog/2016/08/24/Building-a-Node-js-static-file-server-files-over-HTTP-using-ES6/
const http = require('http');
const port = process.argv[2] || 9000;
http.createServer(function (request, result) {
    // import the necessary packages

    const url = require('url');
    const fs = require('fs');
    const path = require('path');
    // you can pass the parameter in the command line. e.g. node static_server.js 3000

    console.log(request.method + ' ' + request.url);

    // extract the url path 
    const parsedUrl = url.parse(request.url);
    // let pathname be the parsed url's path name  (basically everything after the third slash including the third slash)
    // e.g. http://localhost:8080/Customer/Details?ID=whatever's parsed url's pathname is /Customer/Details?ID=whatever. 

    let pathname = './dist' + (parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname);
    console.log('pathname::::::::::::::', pathname);


    // define the mime types in a dictionary
    const mimeType = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
    };

    // if the file given by our parsed url's pathname
    let exists = function (_pathname, attemptNo) {
        fs.exists(_pathname, (exist) => {
            // if the _pathname doesn't exist
            console.log(attemptNo + ' Running...\t' + _pathname);
            if (!exist) {
                // return 404 file or directory not found
                if (attemptNo > 0) {

                    result.statusCode = 404;

                    return false;
                }
                else {

                    return false;
                }
                // done
            }
            else {


                // if the _pathname is just a directory i.e. /Customer/Details
                if (fs.statSync(_pathname).isDirectory()) {
                    // do the default behavior (or so I've observed) and instead fetch index.html in said directory, i.e. /Customer/Details/index.html
                    // hopefully such an html file will have a form for the user to enter an ID
                    _pathname += '/index.html';
                }

                // finally start doing the file static file serving
                fs.readFile(_pathname, (err, data) => {
                    // if there's a file reading error
                    if (err) {
                        // return a 500 server-side error code
                        result.statusCode = 500;
                        result.end('Error getting file: ' + err + '.');
                    }
                    // if everything's fine and dandy
                    else {
                        // declare the extension using the path package to parse the _pathname into a path object I'm guessing
                        const ext = path.parse(_pathname).ext;

                        // set the content-type header based on the mimeType extension map.
                        // if it's not in the map, render it as plain text
                        result.setHeader('Content-type', mimeType[ext] || 'text/plain');
                        // write the data then write a blank line
                        result.end(data);
                    }
                });
                return true;
            }

        });
    };
    var hasExt = /.+\..+/;

    if (!exists(pathname, 0)) { //if it doesn't have an extension, assume it's an html file and try it as an html file

        if (pathname.match(hasExt) == null) exists(pathname + '.html', 1);
    }

}).listen(parseInt(port));

console.log('Server listening on port ' + port);