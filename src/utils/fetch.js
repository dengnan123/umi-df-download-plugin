const request = require('request');
const fs = require('fs-extra');


function fetchPost(url, params, codeFilePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(codeFilePath);
    request
      .post(url, { json: true, body: params })
      .on('error', function(err) {
        reject(err);
      })
      .on('response', function(response) {
        console.log(response.file); // 200
      })
      .pipe(writeStream);
    writeStream.on('finish', data => {
      resolve();
    });
  });
}

module.exports = fetchPost;
