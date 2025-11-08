const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const Backend_Url = 'http://localhost:1620';
const productRoutes = require( './routes/productRoutes.js');//TODO FIX
const http = require('http');
const url = require('url');
const {response, request} = require("express");
const test = require("node:test");
app.use(cors());

app.get('/product/manufacturer/:manufacturerName/p:page', async (req, res) => {
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

app.get('/category/names', async (req, res)=> {
  console.log("category names");
  try {
    const response = await fetch(`${Backend_Url}/category/names`);
    if (response.status === 404) {
      res.redirect('/404.html');
    } else if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    } else {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Names: Error fetching data:', error);
    res.status(500).json({error: 'Failed to fetch data from the real server'});
  }

});

app.get('/product/category/:categoryName/p:page', async (req, res) => {
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

app.use(express.json());
app.post(`/customer/addfavourite`, async (req, res)=>{
  try{
    const response = await fetch(`${Backend_Url}/customer/addfavourite`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const responseData = await response.text();
    res.json(responseData);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete(`/customer/removefav`, async (req, res)=>{
  try {
    const response = await fetch(`${Backend_Url}/customer/removefav`,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(req.body)
    });
    const responseData = await response.text();
    res.json(responseData);
  } catch (error)
  {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/product/detail/:productCode', async (req, res)=>{
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

app.post('/customer/addtocart',async  (req, res) =>{
  try{
    const response = await fetch(`${Backend_Url}/customer/addtocart`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const responseData = await response.text();
    res.json(responseData);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/product/suggest/:name', async (req, res)=>{
  try {
    console.log("suggest");
    const queryParts = req.url.split("/");
    const text = queryParts[3];

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

app.get(`/search/:text/:page`, async (req, res)=>{
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
})




//TODO
// app.get('/featured/:page', async (req, res)=>{
//   const queryParts = req.url.split("/");
//   const page = queryParts[2];
//   console.log("inside featured");
//   try {
//     const response = await fetch(`${Backend_Url}/product/findall?page=${page}`);
//     if (response.status === 404) {
//       res.redirect('/404.html');
//     }
//     else
//     if (!response.ok) {
//       throw new Error('Network response was not ok ' + response.statusText);
//     }
//     else
//     {
//       const data = await response.json();
//       res.json(data);
//     }
//   } catch (error)
//   {
//     console.error('Search: Error fetching data:', error);
//     res.status(500).json({ error: 'Failed to fetch data from the real server' });
//   }
// });

app.use('/product', productRoutes)


app.post('/customer/registration', async (req, res)=>{
  try{
    const response = await fetch(`${Backend_Url}/customer/registration`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const responseData = await response.text();
    console.log(`response: status: ${response.status} data: ${responseData}`);
    res.status(response.status).send(responseData);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/customer/login', async (req, res)=>{
  try{
    const response = await fetch(`${Backend_Url}/customer/login`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const responseData = await response.text();
    res.status(response.status).send(responseData);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/customer/cart/:id',async (req,res)=>
{
  const queryParts = req.url.split("/");
  const id = queryParts[3];

  try{
    const response = await fetch(`${Backend_Url}/customer/cart?id=${id}`);
    const responseData = await response.json();
    res.json(responseData);
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/purchase/complete', async (req, res)=>{
  try{

    console.log("inside purchase complete");
    const response = await fetch(`${Backend_Url}/purchase/complete`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    // const responseData = await response.json();
    const text = await response.text()
    // res.json(responseData);

    let responseData = null

    if (text) {
      try {
        responseData = JSON.parse(text);
      } catch (parseError)
      {
        console.error("INVALID JSON FROM BACKEND: " + text)
        return res.status(502).json({error: "Invalid response from backend"})
      }
    }

    res.status(response.status).json(responseData|| {})
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

