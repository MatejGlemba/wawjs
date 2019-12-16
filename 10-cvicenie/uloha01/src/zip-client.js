const http = require("http");
const fs = require("fs");
const {pipeline} = require("stream")
const url = "http://localhost:9999";

module.exports = {
    send: function (name) {
        return zip_client(name)
    },
    close: function () {
        return close_server()
    }
};

function zip_client(name) {
    let nameArr = [];

    name ? nameArr.push(name) : nameArr = process.argv.slice(2)

    const fileName = `${__dirname}/clientFiles/${nameArr[0]}`;
    const fileName2 = `${__dirname}/clientFiles/${nameArr[0]}.gz`;

    let input = fs.createReadStream(fileName);
    let output = fs.createWriteStream(fileName2);

    pipeline(
        input,
        request = doRequest(name),
        (err) => {
            if (err) {
                console.error(err)
            }
        }
    );
}

function close_server() {
    let request = http.request(url, {
        method: "POST",
        headers: {
            'end': true
        }
    });
    request.on("error", (err) => {
    });
    request.end();
}

function doRequest(name) {
  let request = http.request(url, {
      method: "POST",
      headers: {
          'fileName': name
      }
  })
      .on("response", (res) => {
          pipeline(
              res,
              output,
              (err) => {
                  err ? err : "success"
              }
          );

      });
      return request;
}
