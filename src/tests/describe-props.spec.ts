import { _ } from 'tnp-core';
import { describe, before, it } from 'mocha'
import { expect } from 'chai';
import { Helpers, CLASS } from '../index';
import { CLASSNAME } from '../classname';

export class EXAMPLE_PAGINATION {
  id: number = undefined

  name: string;

  test: string;

  age: number;

  price: number = 23

  isAmazing: boolean;

}


// const instance = BrowserDB.instance;

describe('Describe properties', () => {

  it('should describe class ', () => {

    expect(CLASS.describeProperites(EXAMPLE_PAGINATION)).to.be.deep.eq(['id', 'price'])

  })

});

