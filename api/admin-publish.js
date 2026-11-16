/**
 * Vercel Serverless Function: Super-Admin Global Catalog Publisher
 * Commits updated `admin-catalog.json` directly to GitHub (`MeirV2023/z-deutsch-auto`).
 */

const {
  handleOptionsCors,
  setNoStore,
  getTrimmedHeader,
  getJsonBody
} = require('./_lib/http');

const DEFAULT_REPO = 'MeirV2023/z-deutsch-auto';
const DEFAULT_BRANCH = 'main';
const TARGET_FILE_PATH = 'admin-catalog.json';

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (handleOptionsCors(req, res, 'POST, OPTIONS', 'Content-Type, x-admin-password, x-github-token')) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const serverPass = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD).trim() : '';
  const serverGhToken = process.env.GITHUB_TOKEN ? String(process.env.GITHUB_TOKEN).trim() : '';

  const headerPass = getTrimmedHeader(req, 'x-admin-password');
  const headerGhToken = getTrimmedHeader(req, 'x-github-token');

  if (serverPass && headerPass !== serverPass) {
    return res.status(401).json({
      error: 'INVALID_ADMIN_PASSWORD',
      message: 'Неверный пароль Супер-Админа (проверьте ADMIN_PASSWORD).'
    });
  }

  const activeGhToken = headerGhToken || (serverPass ? serverGhToken : '');
  if (!activeGhToken) {
    return res.status(503).json({
      error: 'MISSING_PUBLISH_CREDENTIALS',
      localSavedOnly: true,
      message: serverGhToken && !serverPass
        ? 'На сервере задан GITHUB_TOKEN, но не задан ADMIN_PASSWORD. Добавьте ADMIN_PASSWORD в настройки Vercel или вставьте GitHub Token в панели Супер-Админа.'
        : 'Для авто-публикации на хостинг укажите GitHub Token в панели Супер-Админа (или добавьте GITHUB_TOKEN + ADMIN_PASSWORD в Environment Variables на Vercel).'
    });
  }

  const body = getJsonBody(req);
  const catalog = body.catalog;
  if (!catalog || typeof catalog !== 'object' || !catalog.courses) {
    return res.status(400).json({ error: 'INVALID_CATALOG_PAYLOAD' });
  }

  const normalizedCatalog = {
    version: 1,
    updatedAt: new Date().toISOString(),
    categories: Array.isArray(catalog.categories) ? catalog.categories : [],
    courses: {
      de: Array.isArray(catalog.courses.de) ? catalog.courses.de : [],
      en: Array.isArray(catalog.courses.en) ? catalog.courses.en : [],
      es: Array.isArray(catalog.courses.es) ? catalog.courses.es : []
    },
    courseOverrides: (catalog.courseOverrides && typeof catalog.courseOverrides === 'object')
      ? catalog.courseOverrides
      : {},
    deletedCourseIds: Array.isArray(catalog.deletedCourseIds) ? catalog.deletedCourseIds : []
  };

  const repo = (process.env.GITHUB_REPO ? String(process.env.GITHUB_REPO).trim() : '') || DEFAULT_REPO;
  const branch = (process.env.GITHUB_BRANCH ? String(process.env.GITHUB_BRANCH).trim() : '') || DEFAULT_BRANCH;
  const commitMessage = String(body.commitMessage || 'chore(catalog): update official courses via Super Admin Studio').slice(0, 140);

  const ghApiUrl = `https://api.github.com/repos/${repo}/contents/${TARGET_FILE_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${activeGhToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Z-Lingo-SuperAdmin-Publisher',
    'Content-Type': 'application/json'
  };

  try {
    let existingSha = '';
    const getRes = await fetch(`${ghApiUrl}?ref=${encodeURIComponent(branch)}`, {
      method: 'GET',
      headers: ghHeaders
    });

    if (getRes.ok) {
      const meta = await getRes.json();
      if (meta && meta.sha) existingSha = meta.sha;
    } else if (getRes.status !== 404) {
      const errTxt = await getRes.text();
      return res.status(getRes.status).json({
        error: 'GITHUB_READ_ERROR',
        message: `GitHub HTTP ${getRes.status}: ${errTxt.slice(0, 260)}`
      });
    }

    const contentBase64 = Buffer.from(JSON.stringify(normalizedCatalog, null, 2) + '\n', 'utf-8').toString('base64');
    const putBody = {
      message: commitMessage,
      content: contentBase64,
      branch
    };
    if (existingSha) putBody.sha = existingSha;

    const putRes = await fetch(ghApiUrl, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const errTxt = await putRes.text();
      return res.status(putRes.status).json({
        error: 'GITHUB_WRITE_ERROR',
        message: `GitHub PUT HTTP ${putRes.status}: ${errTxt.slice(0, 300)}`
      });
    }

    const commitData = await putRes.json();
    const commitSha = (commitData && commitData.commit && commitData.commit.sha)
      ? commitData.commit.sha.slice(0, 7)
      : '';

    return res.status(200).json({
      ok: true,
      publishedToGitHub: true,
      repo,
      branch,
      commitSha
    });
  } catch (err) {
    return res.status(500).json({
      error: 'PUBLISH_INTERNAL_ERROR',
      message: err && err.message ? err.message : 'Ошибка публикации в GitHub'
    });
  }
};
