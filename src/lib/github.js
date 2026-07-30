export async function updateFile(filePath, content, message) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  
  if (!token || !repo) {
    throw new Error('GitHub credentials not configured');
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const base64Content = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));

  // Get the current file's SHA
  let sha = null;
  try {
    const fileRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    }
  } catch (e) {
    // File doesn't exist yet, will create new
  }

  // Commit the file
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: message || `Update ${filePath} from CMS`,
      content: base64Content,
      sha: sha,
      branch: 'main'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}