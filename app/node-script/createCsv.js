var json2csv = require('json2csv'),
    fields = ['lat', 'lon', 'name', 'been'],
    AWS = require('aws-sdk'),
    bucketName = 'travelmap',
    compress = require('./compress'),

    upload = function (filename, csv, cb) {
        compress(csv).then(function(data){
            var params = {
                    Bucket: bucketName,
                    Key: 'csv/' + filename,
                    Body: data,
                    ACL: 'public-read',
                    ContentEncoding: 'gzip',
                    ContentType: 'text/csv'
                },

                upload = new AWS.S3.ManagedUpload({params: params});
            upload.send(function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(data);
                    cb(data.Location);
                }
            });
        });


    };

module.exports = {
    getCsv: function (filename, data, cb) {
        var map = [];
        data.places.forEach(function (item) {
            item.been = item.flags.join(',');
            item.lon = item.lng;
            map.push(item);
        });

        json2csv({data: map, fields: fields}, function (err, csv) {
            if (err) {
                //console.log(err);

            }
            //console.log(csv);
            upload(filename, csv, cb);
        });
    }

};

