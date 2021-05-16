import * as utils from './utils';
import path from 'path';
import { copySync, pathExistsSync } from 'fs-extra';

const getTemplate = (choice: string) => {
  const mappings = [
    {
      choice: 'vanilla(html + javascript + css)',
      value: 'vanilla',
    },
    {
      choice: 'vanilla-ts(html + typescript + less)',
      value: 'vanilla-ts',
    },
  ];
  const res = mappings.find(s => s.choice === choice);
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
      choices: [
        {
          name: 'vanilla(html + javascript + css)',
        },
        {
          name: 'vanilla-ts(html + typescript + less)',
        },
      ],
    });

    await utils.createDir(base); // 创建根目录
    copySync(
      path.join(__dirname, `../template/${getTemplate(tpl.value)}`),
      base
    );
  } catch (err) {
    utils.info(String(err), 'ERROR');
  }
};
