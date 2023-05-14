import { _ } from 'tnp-core';
import { SYMBOL } from './symbols';



/**
  * @DEPRECATED
  * Describe fields assigned in class
  */
const FRegEx = new RegExp(/(?:this\.)(.+?(?= ))/g);
export function describeFromClassStringify(target: Function, parent = false): string[] {
  // @ts-ignore
  var result = [];
  if (parent) {
    var proto = Object.getPrototypeOf(target.prototype);
    if (proto) {
      // @ts-ignore
      result = result.concat(describeFromClassStringify(proto.constructor, parent));
    }
  }
  const classString = target.toString();
  const matches = classString.match(FRegEx) || []
  // console.log({
  //   classString,

  // });
  result = result.concat(matches);
  return result.map(prop => prop
    .replace('this.', '')
    .replace('.', '')
    .replace(')', '')
    .replace('(', '')
  )

}

/**
   * Describe fields assigne through @DefaultModelWithMapping decorator
   * without functions
   */
export function describeByDefaultModelsAndMapping(target: Function): string[] {
  let res = {}
  if (target) {
    // @ts-ignore
    if (target[SYMBOL.DEFAULT_MODEL]) {
      // @ts-ignore
      Object.keys(target[SYMBOL.DEFAULT_MODEL])
        .filter(key => {
          // @ts-ignore
          return !_.isFunction(target[SYMBOL.DEFAULT_MODEL][key]);
        })
        .forEach(key => {
          // @ts-ignore
          return res[key] = null;
        });
    }
    // @ts-ignore
    let mapping = target[SYMBOL.MODELS_MAPPING];
    if (_.isArray(mapping)) {
      mapping.forEach(m => {
        Object.keys(m)
          .forEach(key => {
            // @ts-ignore
            res[key] = null;
          });
      })
    } else if (mapping) {

      Object.keys(mapping)
        .forEach(key => {
          // @ts-ignore
          res[key] = null;
        });
    }
  }

  let propNames = Object.keys(res).filter(f => !!f);
  propNames = (!propNames.includes('id') ? ['id'] : []).concat(propNames);
  return propNames;
}
