import express from 'express';
const router = express.Router();


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
