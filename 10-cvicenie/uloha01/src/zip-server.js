const http = require("http");
const fs = require("fs");
const {pipeline} = require("stream");

const zlib = require("zlib");
const {
    createGzip
} = require("zlib");

let fileName = "";

function start_server() {
    let server = http.createServer();
    server.setTimeout(1000);
    server.listen(9999, "localhost")
        .on("request", (req, res) => {
            const nameHead = req.headers["fileName"];
            const endHead = req.headers["end"];
            fileName = `${__dirname}/serverFiles/${nameHead}`;
            endHead ? server.close() : doWriteStream(req, res)
        });
}

function doWriteStream(req, res) {
  let output = fs.createWriteStream(fileName);

  output.on("finish", () => {
      pipeline(
          fs.createReadStream(fileName),
          createGzip(),
          res,
          (err) => {
              console.log(err ? err : "Biiger file sent");
          }
      );
  });
}

module.exports = start_server
