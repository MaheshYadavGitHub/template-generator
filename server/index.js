const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 7001;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

let pdflink = "";
let videos = [];

app.post("/api/template", (req, res) => {
  pdflink = req.body.pdflink;
  videos = req.body.videos;

  res.send({
    success: true,
    message: "Data saved successfully!",
  });
});

app.get("/api/template", (req, res) => {
  if (pdflink && videos && videos.length) {
    fs.readFile("./server/template/index.html", function (err, data) {
      if (!err) {
        const content = data.toString();
        let videoListContent = "";
        videos.forEach((video) => {
          videoListContent += `<div class="video-tumbnail-container">
                              <video class="video-tumbnail" data-video-url="${video.url}" width="100%">
                                  <source src="${video.url}" type="video/mp4">
                                  Your browser does not support the video tag.
                              </video>
                      <h2 class="video-tumbnail-title">${video.title}</h2>
                  </div>`;
        });

        const modifiedContent = content
          .replace("$videoListContent", videoListContent)
          .replace("$pdfLink", pdflink);

        fs.writeFile(
          "./server/template/generated.html",
          modifiedContent,
          (err) => {
            if (err) {
              res.send({
                success: false,
                message: "Error generating html",
              });
            } else {
              res.download("./server/template/generated.html");
            }
          }
        );
      } else {
        res.send({
          success: false,
          message: "Error parsing html",
        });
      }
    });
  } else {
    res.send({
      success: false,
      message: "Please create a template to download",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
