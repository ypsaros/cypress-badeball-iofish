const axios = require('axios');

async function countFoldersAndFeatureFiles(owner, repo, path, token) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const contents = response.data;

    let folderCount = 0;
    let featureFileCount = 0;

    for (const item of contents) {
      if (item.type === 'dir') {
        folderCount++;
        const subfolderStats = await countFoldersAndFeatureFiles(owner, repo, `${path}/${item.name}`);
        folderCount += subfolderStats.folderCount;
        featureFileCount += subfolderStats.featureFileCount;
      } else if (item.type === 'file' && item.name.endsWith('.feature')) {
        featureFileCount++;
      }
    }

    return { folderCount, featureFileCount };
  } catch (error) {
    console.error(error);
  }
}

// Usage example
countFoldersAndFeatureFiles('ypsaros', 'cypress-badeball-iofish', 'cypress/e2e', 'VsE+CK5TdaeHy8EDyv3a71nBvdQKlfDTFFZFk6je7Cs')
  .then(({ folderCount, featureFileCount }) => {
    console.log('Number of folders:', folderCount);
    console.log('Number of feature files:', featureFileCount);
  });
