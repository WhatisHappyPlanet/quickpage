import * as utils from './utils';

export const create = async () => {
  const projName = await utils.input({
    title: 'Please input your project name...',
  });

  //@ts-ignore
  const base = utils.resolve(`src/${projName.value}`);
  utils.createDir(base); // 创建根目录
  utils.createDir(base + '/imgs'); // 创建图片文件夹
};
