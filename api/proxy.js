export default async function handler(req, res) {
  // Only accept POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { apiUrl, token, moergoPayload } = req.body;

  if (!apiUrl || !token || !moergoPayload) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    // Make the direct connection to Moergo bypassing browser CORS
    const moergoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': token, // Your frontend provides this
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(moergoPayload)
    });

    const data = await moergoResponse.json();
    
    // Return whatever Moergo answered directly back to your frontend UI
    return res.status(moergoResponse.status).json(data);

  } catch (error) {
    console.error("Proxy Execution Error:", error);
    return res.status(500).json({ error: 'Failed to execute proxy request.' });
  }
}
