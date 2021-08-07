import * as utils from '../utils/helper';
import path from 'path';
import { copySync, pathExistsSync } from 'fs-extra';
import { updatePackageJson, updatePlugins } from '../preset';
import * as CONST from '../constants';

const CHOICES = [
  {
    choice: CONST.VANILLIA_TXT,
    value: CONST.VANILLIA,
  },
  {
    choice: CONST.VANILLIA_TS_TXT,
    value: CONST.VANILLIA_TS,
  },
  {
    choice: CONST.SVELTE,
    value: CONST.SVELTE,
  },
  {
    choice: CONST.PREACT,
    value: CONST.PREACT,
  },
  {
    choice: CONST.VUE,
    value: CONST.VUE,
  },
  {
    choice: CONST.REACT,
    value: CONST.REACT,
  },
];

const getTemplate = (choice: string) => {
  const res = CHOICES.find(s => s.choice === choice);
  return res?.value || '';
};

export const create = async () => {
  // ask for project name
  try {
    const projectName = await utils.inquireInput({
      title: 'Please input your project name...',
    });
    if (!pathExistsSync(utils.resolve(`pages`))) {
      // create pages dir, if not existed
      await utils.createDir(utils.resolve(`pages`));
    }

    const base = utils.resolve(`pages/${projectName.value}`);

    if (pathExistsSync(base)) {
      utils.info(`Project ${projectName.value} is existed`, 'ERROR');
      return;
    }

    // select template
    const tpl = await utils.inquireList({
      title: 'Select template',
      choices: CHOICES.map(s => ({ name: s.choice })),
    });
    // create dir
    await utils.createDir(base);

    const res = getTemplate(tpl.value);

    // copy template
    copySync(path.join(__dirname, `../template/${res}`), base);

    // update vite template and package.json
    updatePlugins(res);
    updatePackageJson(res);

    console.log(`\nDone. Now run:\n`);
    console.log(`  pnpm install`);
    console.log(`  pnpm run dev`);
  } catch (err) {
    utils.info(String(err), 'ERROR');
  }
};
