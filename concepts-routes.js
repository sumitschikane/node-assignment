var express = require("express");

const csv = require("csv-parser");
const fs = require("fs");
var csvWriter = require("csv-write-stream");

var app = (module.exports = express.Router());

// This will read the data from baseConcept.csv file and return them to user.
app.get("/api/baseconcepts", function(req, res) {
  var baseConceptData = [];
  fs.createReadStream("./csv/baseConcept.csv")
    .pipe(csv())
    .on("data", row => {
      baseConceptData.push(row);
    })
    .on("end", () => {
      res.status(200).send(baseConceptData);
    });
});

// This will read data from baseLabel.csv and will filter them to return labels related to concept id.
app.get("/api/baselabels/:id", function(req, res) {
  var baseLabelsData = [];
  fs.createReadStream("./csv/baseLabel.csv")
    .pipe(csv())
    .on("data", row => {
      baseLabelsData.push(row);
    })
    .on("end", () => {
      var filteredLables = baseLabelsData.filter(function(val) {
        return val.concept_id == req.params.id;
      });
      res.status(200).send(filteredLables);
    });
});

// This will add new record to baseConcept.csv file
app.post("/api/addconcept", function(req, res) {
  var writer = csvWriter();
  var writer = csvWriter({ sendHeaders: false });
  writer.pipe(fs.createWriteStream("./csv/baseConcept.csv", { flags: "a" }));
  writer.write({
    id: req.body.id,
    concept_id: req.body.id,
    concept_name: req.body.name,
    concept_type: req.body.type,
    period_type: req.body.period,
    balance_type: "",
    abstract: "",
    substitution_group: ""
  });
  writer.end();
  res.status(200).send(true);
});

// This will delete the record from baseConcept.csv based on concept_id
app.post("/api/deleteconcept", function(req, res) {
  var baseConceptData = [];
  fs.createReadStream("./csv/baseConcept.csv")
    .pipe(csv())
    .on("data", row => {
      if (row.concept_id != req.body.id) {
        baseConceptData.push(row);
      }
    })
    .on("end", () => {
      const createCsvWriter = require("csv-writer").createObjectCsvWriter;
      const csvWriter = createCsvWriter({
        path: "./csv/baseConcept.csv",
        header: [
          { id: "id", title: "id" },
          { id: "concept_id", title: "concept_id" },
          { id: "concept_name", title: "concept_name" },
          { id: "concept_type", title: "concept_type" },
          { id: "period_type", title: "period_type" },
          { id: "balance_type", title: "balance_type" },
          { id: "abstract", title: "abstract" },
          { id: "substitution_group", title: "substitution_group" }
        ]
      });
      csvWriter
        .writeRecords(baseConceptData) // returns a promise
        .then(() => {
          res.status(200).send(baseConceptData);
        });
    });
});

// This will update the record in baseConcept.csv
app.post("/api/editconcept", function(req, res) {
  var baseConceptData = [];
  fs.createReadStream("./csv/baseConcept.csv")
    .pipe(csv())
    .on("data", row => {
      if (row.concept_id == req.body.id) {
        let data = {};
        data.id = req.body.id;
        data.concept_id = req.body.conceptid;
        data.concept_name = req.body.name;
        data.concept_type = req.body.type;
        data.period_type = req.body.period;
        data.balance_type = "";
        data.abstract = "";
        data.substitution_group = "";
        baseConceptData.push(data);
      } else {
        baseConceptData.push(row);
      }
    })
    .on("end", () => {
      const createCsvWriter = require("csv-writer").createObjectCsvWriter;
      const csvWriter = createCsvWriter({
        path: "./csv/baseConcept.csv",
        header: [
          { id: "id", title: "id" },
          { id: "concept_id", title: "concept_id" },
          { id: "concept_name", title: "concept_name" },
          { id: "concept_type", title: "concept_type" },
          { id: "period_type", title: "period_type" },
          { id: "balance_type", title: "balance_type" },
          { id: "abstract", title: "abstract" },
          { id: "substitution_group", title: "substitution_group" }
        ]
      });
      csvWriter
        .writeRecords(baseConceptData) // returns a promise
        .then(() => {
          res.status(200).send(baseConceptData);
        });
    });
});
