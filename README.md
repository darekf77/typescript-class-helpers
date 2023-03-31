# firedev-class-helpers (typescript-class-helpers)

- Part of [firedev.io](https://github.com/darekf77/
- Helpers for OOP (Object Oriented Programming) in TypeScript.
- Purpose:
  + take advantage of classes in TypeScript/JavaScript in most glegant way
  + prevent unusable class names during JS minification

## Installation:
```
npm i typescript-class-helpers
```

## Class manipulations

```ts
import { CLASS } from 'typescript-class-helpers';

@CLASS.NAME('Example')
class Example {

}
    
console.log(CLASS.getName(Example) === 'Example') // true
console.log(CLASS.getNameFromObject(new Example()) === 'Example') // true
console.log(CLASS.getBy('Example') === Example) // true
```

This way you can use you class names even after uglify process.
