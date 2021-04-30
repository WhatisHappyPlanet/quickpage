import * as utils from './utils';
import path from 'path';
import { copySync, pathExistsSync } from 'fs-extra';
import chalk from 'chalk';

export const create = async () => {
  // ask for project name
  const projectName = await utils.input({
    title: 'Please input your project name...',
  });

  const base = utils.resolve(`pages/${projectName.value}`);

  if (pathExistsSync(base)) {
    console.log(chalk.red(`Project ${projectName.value} is existed`));
    return;
  }

  // select template
  const tpl = await utils.prompt({
    title: 'Select template',
    choices: [
      {
        name: 'vanilla',
      },
      {
        name: 'vanilla-ts',
      },
    ],
  });

  utils.createDir(base); // 创建根目录
  copySync(path.join(__dirname, `../template/${tpl.value}`), base);
};
