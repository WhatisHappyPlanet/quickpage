import { readdirSync } from 'fs-extra';
import { createServer } from 'vite';
import { prompt, info, loadViteConfig } from '../utils';
import { join } from 'path';

export const dev = async () => {
  try {
    const projectNames = readdirSync('pages');

    const projectName = await prompt({
      title: 'Select Project',
      choices: projectNames.map((name: string) => ({ name })),
    });

    const cwd = process.cwd();

    const server = await createServer({
      configFile: loadViteConfig(),
      root: join(cwd, 'pages', projectName.value),
      server: {
        port: 3333,
        open: true,
      },
    });
    await server.listen();
  } catch (err) {
    info(String(err), 'ERROR');
  }
};
