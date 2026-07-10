module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const githubUsername = process.env.GITHUB_SPONSOR_USERNAME;

    if (githubUsername) {
      const url = `https://github.com/sponsors/${githubUsername}`;
      return res.json({ url });
    }

    res.status(500).json({ error: 'GitHub Sponsor username not configured. Please set GITHUB_SPONSOR_USERNAME in the environment variables.' });

  } catch (error) {
    console.error('Sponsor error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process sponsor request' });
  }
};
