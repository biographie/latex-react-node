const latex = require("node-latex");
const fs = require("fs");
require("dotenv").config();

const { createReadStream } = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.raw());
app.use(cors());
var path = require("path");
const S3 = require("aws-sdk/clients/s3");
let x = "KLJDLKSJD";
const convertLatexToPDF = (data) => {
  fs.writeFile("./latexProcessing/input.tex", data.toString(), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("LaTeX file written");
  });
  const input = fs.createReadStream("./latexProcessing/input.tex");
  const output = fs.createWriteStream("./latexProcessing/output.pdf");
  const pdf = latex(input);
  pdf.pipe(output);
  pdf.on("error", (err) => console.error(err));
  pdf.on("finish", () => {
    console.log("PDF generated!");
    uploadPDFtoS3("./latexProcessing/output.pdf").then((data) => {
      x = data.Location;
    });
  });
};

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});
const uploadPDFtoS3 = (filePath) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    const params = {
      Bucket: bucketName,
      Body: fileStream,
      Key: "output.pdf",
      contentType: "application/pdf",
    };
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
app.post("/api/latex", (request, response) => {
  data = request.body;
  convertLatexToPDF(data);
  response.end();
});
app.get("/api/latex", (request, response) => {
  response.status(200).json({ data: x });
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000........");
});
