const http = require("http");
const fs = require("fs");
const {pipeline} = require("stream");

const zlib = require("zlib");
const {
    createGzip
} = require("zlib");

function start_server() {
    let server = http.createServer();
    server.setTimeout(1000);
    server.listen(9999, "localhost")
        .on("request", (req, res) => {
            const nameHead = req.headers["fileName"];
            const endHead = req.headers["end"];
            const fileName = `${__dirname}/serverFiles/${nameHead}`;

            if (endHead) {
                server.close();
            } else {
                let output = fs.createWriteStream(fileName);
                //Pre skopirovanie vacsieho suboru
                output.on("finish", () => {
                    pipeline(
                        fs.createReadStream(fileName),
                        createGzip(),
                        res,
                        (err) => {
                          (err) => {
                            console.log(err ? err : "File sent");
                          }
                        }
                    );
                });

                pipeline(
                    req,
                    output,
                    (err) => {

                    });
            }

        });
}

module.exports = start_server
