const { runCommand } = require('./utils.js');
const { consola } = require('consola');

const REPOSITORY = 'leanhtuan1994/react-native-caracal';
const DEFAULT_BRANCH = 'main';
const TAGS_PER_PAGE = 100;

const parseStableVersion = (tag) => {
  const match = tag.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  return match ? match.slice(1).map(Number) : null;
};

const compareVersions = (left, right) => {
  const leftVersion = parseStableVersion(left);
  const rightVersion = parseStableVersion(right);

  for (let index = 0; index < leftVersion.length; index += 1) {
    if (leftVersion[index] !== rightVersion[index]) {
      return rightVersion[index] - leftVersion[index];
    }
  }

  return 0;
};

const getRepositoryTags = async () => {
  const tags = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${REPOSITORY}/tags?per_page=${TAGS_PER_PAGE}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const pageTags = await response.json();
    tags.push(...pageTags);

    if (pageTags.length < TAGS_PER_PAGE) {
      return tags;
    }

    page += 1;
  }
};

const getLatestTemplateRef = async () => {
  try {
    const tags = await getRepositoryTags();
    const latestTag = tags
      .map(({ name }) => name)
      .filter((tag) => parseStableVersion(tag))
      .sort(compareVersions)[0];

    return latestTag || DEFAULT_BRANCH;
  } catch {
    console.warn(
      `Failed to retrieve the latest template tag; will use the ${DEFAULT_BRANCH} branch instead`
    );
    return DEFAULT_BRANCH;
  }
};

const cloneLastTemplateRelease = async (projectName) => {
  consola.start('Extracting last release number 👀');
  const latestTemplateRef = await getLatestTemplateRef();
  consola.info(`Using Caracal starter ${latestTemplateRef}`);

  // create a new project based on caracal template
  const cloneStarter = `git clone -b ${latestTemplateRef} --depth=1 https://github.com/${REPOSITORY}.git ${projectName}`;
  await runCommand(cloneStarter, {
    loading: 'Extracting the starter template...',
    success: 'Starter extracted successfully',
    error: 'Failed to download and extract template',
  });
};

module.exports = {
  cloneLastTemplateRelease,
  getLatestTemplateRef,
};
