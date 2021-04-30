import { readdirSync } from 'fs-extra';
import { createServer } from 'vite';
import { prompt } from './utils';
import { join } from 'path';

export const dev = async () => {
  // TODO: 判断是否是文件夹
  const projectNames = readdirSync('pages');

  console.log(projectNames);

  const projectName = await prompt({
    title: 'Select Project',
    choices: projectNames.map(name => ({ name })),
  });

  const cwd = process.cwd();

  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    //@ts-ignore
    root: join(cwd, 'pages', projectName.value),
    server: {
      port: 3333,
    },
  });
  await server.listen();
};
