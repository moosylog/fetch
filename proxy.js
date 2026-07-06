export default async function handler(req, res) {
  // 1. Only allow POST requests to this proxy
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Extract the data your frontend sends
  const { apiUrl, token, graphqlQuery } = req.body;

  if (!apiUrl || !token || !graphqlQuery) {
    return res.status(400).json({ error: 'Missing apiUrl, token, or graphqlQuery' });
  }

  try {
    // 3. Make the actual request to Moergo from the SERVER (No CORS limits here!)
    const moergoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: graphqlQuery })
    });

    // 4. Get the response and send it back to your HTML frontend
    const data = await moergoResponse.json();
    
    // Pass the Moergo status code back (so 403s/etc are visible)
    res.status(moergoResponse.status).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: 'Failed to fetch from Moergo API' });
  }
}
