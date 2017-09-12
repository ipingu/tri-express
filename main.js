const express = require('express');
const fs = require('fs');
const path = require('path');

/** Constants */
var port = process.env.PORT || process.argv[2] || 9999;
const testFolder = './test/images';

/** Watcher to hot reload app */
var chokidar = require('chokidar');

// One-liner for current directory, ignores .dotfiles
chokidar.watch('.', {
    ignored: /(^|[\/\\])\../
}).on('all', (event, path) => {
    console.log(event, path);
});

var currentResources = {};

var readFilesFromPath = function(imagesPath, callback) {
    currentResources = {
        "source": "local",
        "path": imagesPath,
        "resources": []
    }

    fs.readdir(imagesPath, (err, files) => {
        files.forEach(file => {
            var resource = {
                "id": file,
                "path": "http://localhost:9999/file?id=" + file,
                "rating": 0,
                "remove": false
            }
            currentResources.resources.push(resource);
        });

        callback();
    })
}




// Configure Express to serve UI files and expose REST services
var api = express();
api.use(express.static('public'));

api.get('/files', function(req, res) {
    var callback = function() {
        res.status(200)
            .send(currentResources);
    }
    readFilesFromPath(testFolder, callback);
    res.setHeader('Content-Type', 'application/json');
});

api.get("/file", function(req, res) {
    if (currentResources.resources && req.query.id) {
        currentResources.resources.filter(resource => resource.id == req.query.id)
            .map(matching => {
                var img = fs.readFileSync(path.resolve(currentResources.path, matching.id));
                res.writeHead(200, {
                    'Content-Type': 'image/jpg'
                });
                res.end(img, 'binary');
            });
    }
    res.status(404).send();
});

// Connect to database and start server listening
api.listen(port);

console.log('Server running at http://127.0.0.1:%d/', port);