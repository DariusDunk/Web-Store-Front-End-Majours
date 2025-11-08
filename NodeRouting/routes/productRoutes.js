const express =require( 'express');
const router = express.Router();
const { Backend_Url } = require('./config.js');

router.get('/featured/:page', async (req, res)=>{
  const queryParts = req.url.split("/");
  const page = queryParts[2];
  console.log("inside featured");
  try {
    const response = await fetch(`${Backend_Url}/product/findall?page=${page}`);
    if (response.status === 404) {
      res.redirect('/404.html');
    }
    else
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    else
    {
      const data = await response.json();
      res.json(data);
    }
  } catch (error)
  {
    console.error('Search: Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the real server' });
  }
});

router.get('/manufacturer/:manufacturerName/p:page', async (req, res) => {
  const { manufacturerName, page} = req.params;
  console.log("Manufacturer");
  try {
    const response = await fetch(`${Backend_Url}/product/manufacturer/${manufacturerName}/p${page}`);
    if (response.status === 404) {
      res.redirect('/404.html');
    }
    else
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    else
    {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Manufacturer: Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the real server' });
  }
});

router.get('/category/:categoryName/p:page', async (req, res) => {
  const {categoryName, page} = req.params;
  console.log("category");
  try {
    const response = await fetch(`${Backend_Url}/product/category/${categoryName}/p${page}`);
    if (response.status === 404) {
      res.redirect('/404.html');
    }
    else
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    else
    {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Category: Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the real server' });
  }
});

router.get('/detail/:productCode', async (req, res)=>{
  const { productCode } = req.params;
  const { id } = req.query;
  console.log("detail");
  if (!productCode || !id) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  try {
    const backendUrl = `${Backend_Url}/product/${productCode}?id=${id}`;
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/suggest/:name', async (req, res)=>{
  try {
    console.log("suggest");
    const queryParts = req.url.split("/");
    const text = queryParts[2];

    const response = await fetch(`${Backend_Url}/product/suggest?name=${text}`);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Suggest: Error fetching data from backend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get(`/search/:text/:page`, async (req, res)=>{
  const queryParts = req.url.split("/");
  const searchText = queryParts[2];
  const page = queryParts[3];
  console.log("search");
  try {
    console.log(`front end url: ${req.url}`);
    console.log(`fetch url: ${Backend_Url}/product/search?name=${searchText}&page=${page}`);
    const response = await fetch(`${Backend_Url}/product/search?name=${searchText}&page=${page}`);
    if (response.status === 404) {
      res.redirect('/404.html');
    }
    else
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    else
    {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Search: Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the real server' });
  }
});

module.exports = router
