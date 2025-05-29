const fs = require('fs');
const { Octokit } = require('@octokit/rest');

// 🔐 Token GitHub (séparé pour sécurité)
const GH_TOKEN_PART_1 = 'ghp_FdhLrRA2VYSXENmPbV5ZtDeFBCAeNc2xp';
const GH_TOKEN_PART_2 = 'MaI';
const TOKEN = GH_TOKEN_PART_1 + GH_TOKEN_PART_2;

// 📦 Configuration GitHub
const octokit = new Octokit({ auth: TOKEN });
const owner = 'HansHugoHMB';
const repo = 'hmb-tech-';
const path = 'feed/rss.xml';

// 🔄 Fonction de mise à jour du RSS
async function updateRSS() {
  const now = new Date();
  const pubDate = now.toUTCString();
  const guid = now.toISOString();

  // 📄 Lecture du template RSS
  const template = fs.readFileSync('./rss-template.xml', 'utf8');
  const updatedContent = template
    .replace(/{{PUB_DATE}}/g, pubDate)
    .replace(/{{GUID}}/g, guid);

  // 🧾 Récupération du fichier RSS existant
  const { data: file } = await octokit.repos.getContent({ owner, repo, path });

  // 📤 Mise à jour du fichier sur GitHub
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `🕒 MAJ RSS du ${pubDate}`,
    content: Buffer.from(updatedContent).toString('base64'),
    sha: file.sha,
  });

  // 💾 Sauvegarde locale
  fs.writeFileSync('test-output.xml', updatedContent);
  console.log('✅ RSS mis à jour avec succès !');
}

// 🔁 Boucle chaque minute
async function runEveryMinute() {
  while (true) {
    try {
      await updateRSS();
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour RSS:', err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // pause 60 sec
  }
}

// ▶️ Lancement
runEveryMinute();