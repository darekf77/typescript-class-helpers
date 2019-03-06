import * as _ from 'lodash';
import { describe, before } from 'mocha'
import { expect } from 'chai';
import { Helpers, CLASS } from '../index';
import { CLASSNAME } from '../classname';


@CLASS.NAME('Proj', 'location')
export class Proj {
  isProjectInstance = true;
  location: string;
  browser: {
    children: Proj[];
  }
}

@CLASS.NAME('Proj2')
export class Proj2 extends Proj {
  isProjectInstance2 = true;

}

@CLASS.NAME('Proj3', 'idaaa', 'aaaa')
export class Proj3 extends Proj2 {
  isProjectInstance2 = true;

}

// const instance = BrowserDB.instance;

describe('CLASSNAME', () => {

  it('Family name shoudl work', async () => {

    expect(CLASSNAME.getClassFamilyByClassName('Proj')).to.be.eq('Proj')
    expect(CLASSNAME.getClassFamilyByClassName('Proj2')).to.be.eq('Proj')
    expect(CLASSNAME.getClassFamilyByClassName('Proj3')).to.be.eq('aaaa')

  })

  it('Unique keys shoudl work', async () => {
    expect(CLASS.OBJECT(new Proj()).indexProperty).to.be.eq('location')
    expect(CLASS.OBJECT(new Proj2()).indexProperty).to.be.eq('id')
    expect(CLASS.OBJECT(new Proj3()).indexProperty).to.be.eq('idaaa')

  })

});

