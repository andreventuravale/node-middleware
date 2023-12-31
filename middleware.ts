export type MiddlewareHandler<Input = any, Output = any> = (
  input: Input,
  output?: Output,
) => Promise<Output>;

export type Next = (input: any, output: any) => Promise<any>;

export type Middleware<Input = any> = (next: Next) => MiddlewareHandler<Input>;

export type Pipeline<Input = any> = <Output>() => MiddlewareHandler<
  Input,
  Output
>;

export const makePipeline = <Input>(
  use: Middleware[] = [],
): Pipeline<Input> => {
  const pipeline: Pipeline<Input> = <Output>() => {
    return async (input: Input, output?: Output) => {
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

  return pipeline;
};

export const passOutputAlong: Next = async (_, output) => output;
