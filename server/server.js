const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const exif = require('exif-parser');

const port = process.env.PORT || 5000;

const s3 = require('./s3.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

AWS.config.loadFromPath('s3_config.json');
var bucket = new AWS.S3();
const params = {
  Bucket: 'kylestravelpictures'
}

let bucketData = [];
let keys = [];

getExifData = function(img, key) {
  const parser = exif.create(img);
  const result = parser.parse();
  let info = {}
  info.link = key;
  info.orientation = result.tags.Orientation;
  info.lat = result.tags.GPSLatitude;
  info.long = result.tags.GPSLongitude;
  info.time_of_capture = result.tags.DateTimeOriginal;
  info.image_size = result.imageSize;
  bucketData.push(info)
}

bucket.listObjectsV2(params).promise()
  .then(data => {
    data.Contents.forEach(objects => {
      keys.push(objects.Key)
    })

    keys.forEach(key => {
      params.Key = key;
      bucket.getObject(params, function (err, data) {
          if (err) console.log(err, err.stack);
          file = new Buffer(data.Body, 'binary');
          getExifData(file, key)
      });
    })
  })

app.get('/list_objects', (req, res) => {
  console.log(bucketData)
  res.send(bucketData)
})

app.listen(port, () => console.log(`Listening on port ${port}`));
