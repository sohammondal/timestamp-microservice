const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});


app.get('/api/timestamp', (req, res) => {
  const date = new Date();
  res.json({ "unix": date.getTime(), "utc": date.toUTCString() })
})

app.get('/api/timestamp/:date_string', (req, res) => {
  try {
    let dateParam = req.params.date_string;

    //A 4 digit number is a valid ISO-8601 for the beginning of that year
    //5 digits or more must be a unix time, then convert to Number
    dateParam = /\d{5,}/.test(dateParam) ? Number(dateParam) : dateParam

    const date = new Date(dateParam);

    const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime())

    res.json(
      isValidDate(date) ?
        { "unix": date.getTime(), "utc": date.toUTCString() } :
        { error: "Invalid Date" }
    );

  } catch (e) {
    console.error('ERROR:', e.message);
    res.sendStatus(500);
  }
})

app.listen(3000, () => console.log('server started'));
