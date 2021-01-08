const express = require("express")
const csv = require("csv-parser")
const fs = require("fs")
const app = express()
const generator = require('generate-password');
const _ = require("underscore-node")
const https = require('https');

const CSVFileValidator = require('csv-file-validator')



app.use(express.json())
app.use((req, res, next) => {
    if (!req.body.csv || !req.body.csv.url || !req.body.csv.select_fields) {
        return res.status(400).json({
            "status": "fail",
            "message": "Provide all necessary fields"
        })
    }
    next()
})



// const config = {
//     headers: [], // required
//     isHeaderNameOptional: false // default (optional)
// }


const download = (url, dest, cb) => {
  var file = fs.createWriteStream(dest);
  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}

const token = () =>{
    return generator.generate({
        length: 30,
        numbers: true,
    });
} 


app.post('/', async (req, res) => {
    var results = [];
    const random = token()
    const file = `${random}.csv`
    const fields = req.body.csv.select_fields
    // await CSVFileValidator(file, config)
    download(req.body.csv.url, file, ()=>{
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
        })
        .on("end", () => {
            if(fields.length != 0){
                var strippedRows = _.map(results, (row) => {
                    return _.pick(row, fields);
                });
                results = strippedRows;
            }
            fs.unlink(file, () => {
                res.status(200).json({
                    "conversion_key": random,
                    "json": results
                })
            })
           
        })
    })
   
})










const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running at PORT ${PORT}")
})