import * as utils from './utils';
import path from 'path';
import {
  copySync,
  pathExistsSync,
  readJsonSync,
  writeJsonSync,
} from 'fs-extra';
import {
  preactPackage,
  sveltePackage,
  typescriptPackage,
  vuePackage,
} from './constants';

const VANILLIA = 'vanilla(html + javascript + css)';
const VANILLIA_TS = 'vanilla-ts(html + typescript + less)';
const SVELTE = 'svelte';
const PREACT = 'preact';
const VUE = 'vue';

const CHOICES = [
  {
    choice: VANILLIA,
    value: 'vanilla',
  },
  {
    choice: VANILLIA_TS,
    value: 'vanilla-ts',
    packageJson: typescriptPackage,
  },
  {
    choice: SVELTE,
    value: 'svelte',
    packageJson: sveltePackage,
  },
  {
    choice: PREACT,
    value: 'preact',
    packageJson: preactPackage,
  },
  {
    choice: VUE,
    value: 'vue',
    packageJson: vuePackage,
  },
];

const getTemplate = (choice: string) => {
  const res = CHOICES.find(s => s.choice === choice);
  return res?.value;
};

const getPackageJson = (choice: string): Object => {
  const res = CHOICES.find(s => s.choice === choice);
  return res?.packageJson || {};
};

export const create = async () => {
  // ask for project name
  try {
    const projectName = await utils.input({
      title: 'Please input your project name...',
    });
    if (!pathExistsSync(utils.resolve(`pages`))) {
      // 不存在pages, 则先创建pages
      await utils.createDir(utils.resolve(`pages`));
    }

    const base = utils.resolve(`pages/${projectName.value}`);

    if (pathExistsSync(base)) {
      utils.info(`Project ${projectName.value} is existed`, 'ERROR');
      return;
    }

    // select template
    const tpl = await utils.prompt({
      title: 'Select template',
      choices: CHOICES.map(s => ({ name: s.choice })),
    });
    // create dir
    await utils.createDir(base);
    const packageJson = readJsonSync(utils.resolve('package.json'));
    const res = utils.injectPackageJson(packageJson, getPackageJson(tpl.value));
    writeJsonSync(utils.resolve('package.json'), res, { spaces: 4 });

    // copy template
    copySync(
      path.join(__dirname, `../template/${getTemplate(tpl.value)}`),
      base
    );
  } catch (err) {
    utils.info(String(err), 'ERROR');
  }
};
