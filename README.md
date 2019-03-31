# TYPESCRIPT CLASS HELERPS

Library contains all kinds of helpers for OOP in typescript.


## Installation:

    npm i typescript-class-helpers

## Class manipulations

```ts
import { CLASS } from 'typescript-class-helpers'l

@CLASS.NAME('Example')
class Example {

}
    
console.log(CLASS.getName(Example) === 'Example') // true
console.log(CLASS.getNameFromObject(new Example()) === 'Example') // true
console.log(CLASS.getBy('Example') === Example) // true
```

This way you can use you class names even after uglify process.
