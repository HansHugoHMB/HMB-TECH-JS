const fs = require('fs');
const { Octokit } = require('@octokit/rest');

const GH_TOKEN_PART_1 = 'ghp_FdhLrRA2VYSXENmPbV5ZtDeFBCAeNc2xp'; // 1re partie de ton token
const GH_TOKEN_PART_2 = 'MaI'; // 2e partie de ton token
const TOKEN = GH_TOKEN_PART_1 + GH_TOKEN_PART_2;

const octokit = new Octokit({ auth: TOKEN });

const owner = 'HansHugoHMB';
const repo = 'hmb-tech-';
const path = 'feed/rss.xml';

async function updateRSS() {
  const now = new Date();
  const pubDate = now.toUTCString();
  const guid = now.toISOString();

  const template = fs.readFileSync('./rss-template.xml', 'utf8');
  const updatedContent = template
    .replace(/{{PUB_DATE}}/g, pubDate)
    .replace(/{{GUID}}/g, guid);

  const { data: file } = await octokit.repos.getContent({ owner, repo, path });

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `🕒 MAJ RSS du ${pubDate}`,
    content: Buffer.from(updatedContent).toString('base64'),
    sha: file.sha,
  });

  console.log('✅ RSS mis à jour avec succès !');
}

updateRSS().catch(console.error);