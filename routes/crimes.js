const { performance } = require("perf_hooks");
const express = require("express");
const router = express.Router();
const { readQuery, writeQuery } = require("../utils/queryHelpers");
const { parseISO, format } = require("date-fns");
const db = "dataset";

const MOVING_AVERAGE_DAYS = 7;

router.get("/7-day-moving-average", async (req, res) => {
  const { fromDate, toDate, district } = req.query;

  if (!fromDate) {
    res.status(400).send({ message: "Invalid fromDate!" });
    return;
  }

  if (!toDate) {
    res.status(400).send({ message: "Invalid toDate!" });
    return;
  }

  const startDate = parseISO(fromDate);
  const endDate = parseISO(toDate);

  const data = [];

  const queryStartTime = performance.now();

  for (
    let eachDate = new Date(startDate);
    eachDate <= endDate;
    eachDate.setDate(eachDate.getDate() + 1)
  ) {
    const sevenDaysAgo = new Date(eachDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - MOVING_AVERAGE_DAYS);

    let sql = "";
    if (!district) {
      sql = `
      SELECT COUNT(*) FROM crimes WHERE OCCURRED_ON_DATE BETWEEN "${format(
        sevenDaysAgo,
        "yyyy/MM/dd"
      )}" AND "${format(eachDate, "yyyy/MM/dd")}"`;
    } else {
      sql = `
      SELECT COUNT(*) FROM crimes WHERE (OCCURRED_ON_DATE BETWEEN "${format(
        sevenDaysAgo,
        "yyyy/MM/dd"
      )}" AND "${format(
        eachDate,
        "yyyy/MM/dd"
      )}") AND (DISTRICT = "${district}");
    `;
    }

    try {
      const queryResponse = await readQuery(db, sql);
      const count = queryResponse[0]["COUNT(*)"];
      data.push({
        date: format(eachDate, "yyyy/MM/dd"),
        average: Math.round(count / MOVING_AVERAGE_DAYS),
      });
    } catch (error) {
      res.status(500).send({ message: "Internal Error" });
      return;
    }
  }

  const queryEndTime = performance.now();

  console.log(`took ${queryEndTime - queryStartTime} milliseconds`);

  res.status(200).send({ message: "successful", data });
});

module.exports = router;
