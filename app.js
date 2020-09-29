const svg2img = require('svg2img');
const express = require('express');
const app = express();

const imgWidth = 400.87827;
const imgHeight = 419.87268;

app.get('/map/europe.php', function (req, res) {

    // get attributes
    let selected = req.query.selected && req.query.selected.match(/^[a-z]+$/) ? req.query.selected : "";
    let size = req.query.size && req.query.size > 0 && req.query.size <= 2 ? req.query.size : 1;
    let defaultcolor = req.query.defaultcolor && req.query.defaultcolor.match(/^[0-9a-z]+$/) ? req.query.defaultcolor : 'aaaaaa';
    let highlightedcolor = req.query.highlightedcolor && req.query.highlightedcolor.match(/^[0-9a-z]+$/) ? req.query.highlightedcolor : 'ff5555';

    fs = require('fs');
    fs.readFile('europe.svg', 'utf8', function (err, svg) {
        if (err) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('Failed to read SVG file');
        }

        //set size
        svg = svg.replace('width=""', 'width="' + imgWidth * size + '"');
        svg = svg.replace('height=""', 'height="' + imgHeight * size + '"');
        svg = svg.replace('viewBox=""', 'viewBox="0 0 ' + imgWidth + " " + imgHeight + '"');

        // set colors
        svg = svg.replace('.replace {}', makeCss(selected, highlightedcolor, defaultcolor));

        /*res.setHeader('Content-Type', 'image/svg+xml');
        res.end(svg);*/

        svg2img(svg, { 'width': imgWidth * size, 'height': imgHeight * size, preserveAspectRatio: true }, function (error, png) {
            res.setHeader('Content-Type', 'image/png');
            res.end(png);
        });
    });
});

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Some of the services are outdated and no longer maintained :(\npoooow@gmail.com');
});

app.get('/map', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Some of the services are outdated and no longer maintained :(\npoooow@gmail.com');
});

function makeCss(countries, highlightedcolor, defaultcolor) {

    let countriesCss = `path { fill: #${defaultcolor}}\n`

    while (countries.length >= 2) {
        countriesCss += "." + countries.substring(0, 2) + ` { fill: #${highlightedcolor} }\n`;
        countries = countries.substring(2);
    }

    return countriesCss;
}

app.listen(3000, () => {
    console.log(`Listening at http://localhost:3000`)
});
