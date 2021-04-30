import * as utils from './utils';
import path from 'path';
import { copySync } from 'fs-extra';

export const create = async () => {
  // ask for project name
  const projectName = await utils.input({
    title: 'Please input your project name...',
  });

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

  const base = utils.resolve(`pages/${projectName.value}`);
  utils.createDir(base); // 创建根目录
  copySync(path.join(__dirname, `../template/${tpl.value}`), base);
};
