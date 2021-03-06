import { validHostnames } from "./validHostnames.ts";

import { validateFn } from "./validateFn.ts";

const validate = (url: URL): void => {
  validateFn(url, validHostnames);
};

export { validate };
