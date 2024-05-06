export const contextRefMap: Record<string, Array<any> | undefined> = {};

export const $ = (params: Function): (...args: any[]) => Promise<any> => {
  return async () => {
    console.warn(
      '$ can not be used in runtime, please use @decoration/qwik-optimizer to replace it.'
    );
  };
};

type QrlFunc = (func: () => Promise<any>, symbol: string, lexicalScopeCapture?: Array<any>) => () => Promise<void>;

export const qrl: QrlFunc = (
  chunkFn,
  symbol,
  lexicalScopeCapture
) => {
  contextRefMap[symbol] = lexicalScopeCapture;
  return async () => {
    await chunkFn().then((module) => module[symbol]());
  };
};

export const useLexicalScope = (key: string) => {
  return contextRefMap[key] || [];
};
