import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as utils from '../utils';
import * as SvelteParam from './svelte';
import * as PreactParam from './preact';
import * as VueParam from './vue';
import * as ReactParam from './react';
import * as TsParam from './vanilla-ts';
import debug from 'debug';
import defaultsDeep from 'lodash.defaultsdeep';
import { PresetParam } from '../interface/Preset';
import * as CONST from '../constants';

const log = debug('quickpage');

function getParam(templateName: string): PresetParam | null {
  if (templateName === CONST.SVELTE) return SvelteParam;
  if (templateName === CONST.PREACT) return PreactParam;
  if (templateName === CONST.VUE) return VueParam;
  if (templateName === CONST.REACT) return ReactParam;
  if (templateName === CONST.VANILLIA_TS) return TsParam;
  return null;
}

/**
 * The method to overwrite preset file, like vite.config.js and package.json
 * @param name filename
 * @param callback string operation
 */
function editPreset(name: string, callback: (content: string) => string) {
  const presetFile = utils.resolve(name);

  if (!existsSync(presetFile)) {
    throw new Error(`[Error]: File ${name} does not exist!!`);
  }
  const content = readFileSync(presetFile, { encoding: 'utf-8' });
  const result = callback(content);

  writeFileSync(presetFile, result, { encoding: 'utf-8' });
}

export function addPlugins(
  otherPlugin: string | undefined,
  param: PresetParam
) {
  const { newPluginCue, newPlugin } = param;
  if (newPluginCue && otherPlugin?.includes(newPluginCue)) {
    return `plugins: [\n\t\t${otherPlugin}\n\t]`;
  }
  if (otherPlugin) {
    return `plugins: [\n\t\t${newPlugin},\n\t\t${otherPlugin}]`;
  }
  return `plugins: [\n\t\t${newPlugin}\n\t]`;
}

export function updatePlugins(templateName: string) {
  const param = getParam(templateName);

  if (param) {
    const { newPluginCue, importCue } = param;

    editPreset('vite.config.js', content => {
      let result = content;

      log('result', result);

      const matchPlugin = /(plugins\(.*\))/m;
      result = result.replace(
        matchPlugin,
        (_match, oldPlugin) => `[${oldPlugin}]`
      );

      const matchPlugins = /plugins:[\s\r\n]\[[\s\r\n]*((?:.|\r|\n)+)[\s\r\n]*\]/m;
      result = result.replace(matchPlugins, (_match, otherPlugins) => {
        return addPlugins(otherPlugins, param);
      });

      if (newPluginCue && !result.includes(newPluginCue)) {
        result = result.replace(
          'export default defineConfig({',
          `export default defineConfig({\n\t${addPlugins('', param)},`
        );
        result = result.replace(
          'export default {',
          `export default {\n\t${addPlugins('', param)},`
        );
      }

      if (importCue && !result.includes(importCue)) {
        result = `${importCue};\n${result}`;
      }

      return result;
    });
  }
}

export function updatePackageJson(templateName: string) {
  const param = getParam(templateName);
  if (param) {
    const { devDependencies, dependencies } = param;

    editPreset('package.json', content => {
      let result = content;
      const obj = defaultsDeep(JSON.parse(result), {
        devDependencies,
        dependencies,
      });
      result = JSON.stringify(obj, null, 4);

      return result;
    });
  }
}
