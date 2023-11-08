export type MiddlewareHandler = (input: any, output: any) => Promise<any>;

export type Next = (input: any, output: any) => Promise<any>;

export type Middleware = (next: Next) => MiddlewareHandler;

export const makePipeline = (use: Middleware[] = []) => {
  const factory = () => {
    return async (input: any, output?: any) => {
      const list = use.slice(0);

      const next: Next = async (input, output) => {
        const current = list.shift();

        if (current) {
          return await current(next)(input, output);
        }

        return output;
      };

      const head = list.shift();

      if (head) {
        return await head(next)(input, output);
      }

      return output;
    };
  };

  return factory;
};
