
export const ERROR_MSG_CLASS_WITHOUT_DECORATOR = `[typescript-class-helpers][getClassName(...)](PRODUCTION MODE ERROR)
Please use decoartor @CLASSNAME for each entity or controller
This is preventing class name problem in minified code.

import { CLASS } from 'typescript-class-helpers';

@CLASS.NAME('ExampleClass')
class ExampleClass {
  ...
}
`;
