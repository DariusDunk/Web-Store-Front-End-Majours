const express =require( 'express');
const router = express.Router();
const { Backend_Url } = require('./config.js');

router.post('getFilters/:categoryName', async (req, res)=>{

  const queryParts = req.url.split("/");
  const categoryName = queryParts[2];
  console.log(`category name: ${categoryName}`)
  try
  {
    const response = await fetch(`${Backend_Url}/category/filters?categoryName=${categoryName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

    const text = await response.text();

    let responseData = null

    if (response.status < 300 && respomse.status >= 200) {
      if (text) {
        try {
          responseData = JSON.parse(text)
        } catch (parseError) {
          console.error("INVALID JSON FROM BACKEND: " + text)
          return res.status(502).json({error: "Invalid response from backend"})
        }
      }
    }

    res.status(response.status).json(responseData || {})
  }catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

})

module.exports = router
