import * as utils from './utils';
import path from 'path';
import { copySync, pathExistsSync } from 'fs-extra';
import { updatePackageJson, updatePlugins } from './preset';

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
  },
  {
    choice: SVELTE,
    value: 'svelte',
  },
  {
    choice: PREACT,
    value: 'preact',
  },
  {
    choice: VUE,
    value: 'vue',
  },
];

const getTemplate = (choice: string) => {
  const res = CHOICES.find(s => s.choice === choice);
  return res?.value;
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

    // copy template
    copySync(
      path.join(__dirname, `../template/${getTemplate(tpl.value)}`),
      base
    );

    // update vite template and package.json
    updatePlugins(tpl.value);
    updatePackageJson(tpl.value);
  } catch (err) {
    utils.info(String(err), 'ERROR');
  }
};
