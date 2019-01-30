var multer  = require('multer'),
    multerS3 = require('multer-s3'),
    fs = require('fs'),
    AWS = require('aws-sdk'),
    exif = require('exif-parser');


AWS.config.loadFromPath('s3_config.json');
var s3 = new AWS.S3();

//Create bucket. Note: bucket name must be unique.
//Requires only bucketName via post
//check [http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property](http://) for more info
exports.createBucket = function (req, res) {
    var item = req.body;
    var params = { Bucket: item.bucketName };
    s3.createBucket(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });
}

//List all buckets owned by the authenticate sender of the request. Note: bucket name must be unique.
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listBuckets-property for more info
exports.listBuckets = function (req, res) {
    s3.listBuckets({}, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        console.log("DATA: ", data)
        res.send({ data });
    });
}

//Delete bucket.
//Require bucketName via delete
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property for more info
exports.deleteBucket = function (req, res) {
    var item = req.body;
    var params = { Bucket: item.bucketName };
    s3.deleteBucket(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });
}

//Delete bucket cors configuration.
// Requires bucketName via delete
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucketCors-property for more info
exports.deleteBucketCors = function (req, res) {
    var item = req.body;
    var params = { Bucket: item.bucketName };
    s3.deleteBucketCors(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });
}

exports.getExifData = function(img) {
  // const buffer = fs.readFileSync(img) || img;
  const parser = exif.create(img);
  const result = parser.parse();
  console.log("s3.js getExifData", result);
  const orientation = result.tags.Orientation;
  const lat = result.tags.GPSLatitude;
  const long = result.tags.GPSLongitude;
  const time_of_capture = result.tags.DateTimeOriginal;
  const image_size = result.imageSize;
  const info = {orientation, lat, long, time_of_capture, image_size};
  return info
}

exports.getAllKeys = function() {
    var allKeys = []
    s3.listObjectsV2(params = { Bucket: 'kylestravelpictures'}, function(err, data) {
      if (err) console.log(err, err.stack);
      data.Contents.forEach(content => {
        console.log("CONTENT: ", content)
        allKeys.push(content.Key)
      })
      console.log("listObjectsV2 - allKeys: ", allKeys)
      return allKeys;
    })
    // console.log("ALLLLLLLL KEYS: ", allKeys)
    // console.log("EXIT GET ALL KEYS")
    // return allKeys;
}
//Retrieves objects from Amazon s3
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property to configure params properties
//eg var params = {Bucket: 'bucketname', Key:'keyname'}
exports.getObjects = async function (keys, res) {
    console.log("s3.js ENTERING GET OBJECTS", keys)

    await keys.forEach(key => {
      var params = { Bucket: 'kylestravelpictures', Key: key };

      s3.getObject(params, function (err, data) {
          if (err) console.log(err, err.stack);
          file = new Buffer(data.Body, 'binary');
          console.log("Exif: ", getExifData(file))
          console.log("DATA: ", data)
          res.send({ data });
      });
    })

}

//Delete qn object
//check http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property for more info
exports.deleteObject = function (req, res) {
    var item = req.body;
    var params = { Bucket: item.bucketName, Key: item.key };
    s3.deleteObjects(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });
}

//cloud image uploader using multer-s3
//Pass the bucket name to the bucketName param to upload the file to the bucket
exports.uploadFile = function (req, res) {
    var item = req.body;
    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: item.bucketName,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, Date.now().toString())
            }
        })
    })
}

exports.listAllObjectsFromS3Bucket = async function(bucket, prefix) {
  let items = [];
  let isTruncated = true;
  let marker;
  while(isTruncated) {
    let params = { Bucket: bucket };
    if (prefix) params.Prefix = prefix;
    // if (marker) params.Marker = marker;
    try {
      // console.log("line 168", await s3.listObjects(params).promise())
      const response = await s3.listObjects(params).promise();
      response.Contents.forEach(item => {
        items.push(item.Key);
        // console.log("item.Key", item.Key);
      });
      isTruncated = response.IsTruncated;
      if (isTruncated) {
        marker = response.Contents.slice(-1)[0].Key;
      }
  } catch(error) {
      throw error;
    }
  }
  console.log("all objects", items)
  return items;
}
