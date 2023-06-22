import { _ } from 'tnp-core';
import { describe, before, it } from 'mocha'
import { expect } from 'chai';
import { TchHelpers, CLASS } from '../index';
import { CLASSNAME } from '../lib/classname';
import { ERROR_MSG_CLASS_WITHOUT_DECORATOR } from '../lib/errors-messages';


@CLASS.NAME('Proj', {
  uniqueKey: 'location'
})
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

@CLASS.NAME('Proj3', {
  uniqueKey: 'idaaa',
  classFamily: 'aaaa'
})
export class Proj3 extends Proj2 {
  isProjectInstance2 = true;

}


export class P4 extends Proj3 {

}

export class P5 extends P4 {

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

  it('Name inheritance should works', async () => {

    expect(CLASS.getName(P4)).to.be.eq('P4')
    expect(CLASS.getName(P5)).to.be.eq('P5')

    expect(() => CLASS.getName(P4, true)).to.throw(ERROR_MSG_CLASS_WITHOUT_DECORATOR);
    expect(() => CLASS.getName(P5, true)).to.throw(ERROR_MSG_CLASS_WITHOUT_DECORATOR);
  });


  it('Should handle production mode getClassName', async () => {

    expect(CLASS.getName(Object)).to.be.eq('Object');
    expect(() => CLASS.getName(Object, true)).to.throw(ERROR_MSG_CLASS_WITHOUT_DECORATOR);
  });

  it('Should handle class object propertyly', async () => {

    expect(CLASS.OBJECT({}).isClassObject).to.be.eq(false)
    expect(CLASS.OBJECT(new P4()).isClassObject).to.be.eq(true)
    expect(CLASS.OBJECT(new P5()).isClassObject).to.be.eq(true)
    expect(CLASS.OBJECT(new Date()).isClassObject).to.be.eq(true)
    expect(CLASS.OBJECT([]).isClassObject).to.be.eq(false)
    expect(CLASS.OBJECT(true).isClassObject).to.be.eq(false)
    expect(CLASS.OBJECT(100).isClassObject).to.be.eq(false)
    expect(CLASS.OBJECT(/asd/g).isClassObject).to.be.eq(false)

  });

});

