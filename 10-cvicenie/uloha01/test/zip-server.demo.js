const server = require("../src/zip-server");
const client = require("../src/zip-client");
const files = ["test1.txt", "test2.jpg", "test3.avi" , "test4.rtf"];

server();
files.forEach(
    (file) => {
        client.send(file);
    }
);
client.close();
