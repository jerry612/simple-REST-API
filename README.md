# Coding Assessment
This project is meant to serve as a simple SQLite-backed API service built with Node.js and Express.

## Installation
Run `npm i` to install all project dependencies

## Usage
1. Run `node server.js` to start the server
2. Try a GET request to one of the example endpoints:  [http://localhost:3000/crimes/7-day-moving-average](http://localhost:3000/crimes/7-day-moving-average).  This should return a JSON array of data representing the dates with their 7 day moving average  of number of crimes committed during that period across the entire city.

## Query Example

`http://localhost:3000/crimes/7-day-moving-average?fromDate=2020-01-01&toDate=2020-11-08`


You can add a query called `district` so you can get the 7 day moving average of number of crimes committed in a specific district.

`http://localhost:3000/crimes/7-day-moving-average?fromDate=2020-01-01&toDate=2020-11-08&district=B2`

## Indexing Table

`CREATE INDEX idx_crimes_dates ON crimes (OCCURRED_ON_DATE);`

This index improves queries 100 times faster.

time measurements:

Request: `http://localhost:3000/crimes/7-day-moving-average?fromDate=2020-01-01&toDate=2020-11-08`

```
Time taken for non-indexing: 126.43602999998257 milliseconds
Time taken for indexing:     12483.538135000039 milliseconds
```