const fs = require('fs');
const path = require('path');

module.exports = (filename, dataArr) => {
    let csv = '';
    // grab properties from first object
    const props = Object.keys(dataArr[0]);
    csv += props.join(',') + '\n';

    dataArr.forEach(e => {
        const row = [];
        for (const prop of props)
            row.push('"' + e[prop] + '"');
        csv += row.join(',') + '\n';
    });

    const dir = __dirname + '/../output';
    const fullpath = path.resolve(`${dir}/${filename}.csv`);

    // ignore "dir already exists"
    try {
        fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
    fs.writeFileSync(fullpath, csv);

    console.log(`csv exported to: ${fullpath}`);
};