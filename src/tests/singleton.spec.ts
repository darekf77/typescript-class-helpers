
import * as _ from 'lodash';
import { describe, before } from 'mocha'
import { expect } from 'chai';
import { Helpers, CLASS } from '../index';
import { CLASSNAME } from '../classname';
import { SYMBOL } from '../symbols';


@CLASS.NAME('SingletonTest', { singleton: true })
class SingletonTest {

  testest = 'testest'
}


@CLASS.NAME('SingletonTest2', { singleton: false })
class SingletonTest2 {

  testest = 'testest'
}



@CLASS.NAME('SingletonTest3')
class SingletonTest3 {

  testest = 'testest'
}


@CLASS.NAME('EntityTest')
class EntityTest {

}

@CLASS.NAME('SingletonTest4', { singleton: true })
class SingletonTest4 {

  testest = 'testest'
}

@CLASS.NAME('SingParent')
class SingParent {

  parentProp = 'hello Parent';

  super() {
    return this.parentProp
  }

}

@CLASS.NAME('SingChild', { singleton: true })
class SingChild extends SingParent {

}

@CLASS.NAME('Autoinstance', { singleton: true, autoinstance: true })
class Autoinstance extends SingParent {

}

@CLASS.NAME('AutoinstanceNot', { singleton: true })
class AutoinstanceNot extends SingParent {

}



function updateChain(entity: Function, target: Function) {
  if (!_.isFunction(entity)) {
    return
  }
  console.log(`Entity ${entity.name} shoudl have controler singleton ${target.name}`)
  Object.defineProperty(entity.prototype, 'ctrl', {
    get: function () {
      return CLASS.getSingleton(target);
    }
  })
  Object.defineProperty(entity, 'ctrl', {
    get: function () {
      return CLASS.getSingleton(target);
    }
  })
}


describe('Singleton', () => {

  it('should create singleton ', () => {

    let i = new SingletonTest();
    new SingletonTest();
    new SingletonTest();
    // console.log('SINGLETON',SingletonTest[SYMBOL.SINGLETON])
    expect(CLASS.getSingleton(SingletonTest)).to.be.eq(i)


  })

  it('should not create singleton ', () => {

    let i = new SingletonTest2();
    new SingletonTest2();
    new SingletonTest2();
    // console.log('SINGLETON',SingletonTest[SYMBOL.SINGLETON])
    expect(CLASS.getSingleton(SingletonTest2)).to.be.undefined


  })

  it('should not create singleton ', () => {

    let i = new SingletonTest3();
    new SingletonTest3();
    new SingletonTest3();
    // console.log('SINGLETON',SingletonTest[SYMBOL.SINGLETON])
    expect(CLASS.getSingleton(SingletonTest3)).to.be.undefined


  })


  it('should create singleton as getter; ', () => {
    new SingletonTest4()
    updateChain(EntityTest, SingletonTest4)
    const a = new EntityTest()
    expect(a['ctrl']).to.be.instanceOf(SingletonTest4)
    expect(EntityTest['ctrl']).to.be.instanceOf(SingletonTest4)

  });

  it('should handle ineritance', () => {

    let parentProp = (new SingParent()).parentProp;
    new SingParent()
    new SingParent()
    new SingChild()
    new SingChild()
    let child = new SingChild()
    expect((child).parentProp).to.be.eq(parentProp)
    expect(child.super()).to.be.eq(parentProp)


  });

  it('should perpare autoinstance', () => {


    expect(CLASS.getSingleton(Autoinstance)).to.not.be.undefined;
    expect(CLASS.getSingleton(AutoinstanceNot)).to.be.undefined;


  });

});
