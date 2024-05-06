import { execa } from 'execa';
import { type BuildConfig, emptyDir, panic } from './util';

export async function tsc(config: BuildConfig) {
  if (!config.dev) {
    emptyDir(config.tscDir);
    emptyDir(config.dtsDir);
  }

  const result = await execa('tsc', {
    stdout: 'inherit',
  });
  if (result.failed) {
    panic(`tsc failed`);
  }
}
