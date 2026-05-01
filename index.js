const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/contacts`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
  try {
    const resp = await axios.get(url, { headers, params: { properties: ['firstname', 'lastname', 'company'] } });
    const data = resp.data.results;
    res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
  const { firstname, lastname, company } = req.body;
  const url = `https://api.hubapi.com/crm/v3/objects/contacts`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
  const data = {
    properties: {
      firstname: firstname,
      lastname: lastname,
      company: company
    }
  };
  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
