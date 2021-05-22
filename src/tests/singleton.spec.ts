
import { _ } from 'tnp-core';
import { describe, before } from 'mocha'
import { expect } from 'chai';
import { Helpers, CLASS } from '../index';



@CLASS.NAME('SingletonTest', { singleton: 'first-instance' })
class SingletonTest {
  testest = 'testest'
  constructor(private id: number) {
    this.testest += id;
  }

}

@CLASS.NAME('SingletonTestLast', { singleton: 'last-instance' })
class SingletonTestLast {
  testest = 'testest'
  constructor(private id: number) {
    this.testest += id;
  }

}


@CLASS.NAME('SingletonTest2', {})
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
@CLASS.NAME('SingletonTest4', { singleton: 'first-instance' })
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

@CLASS.NAME('SingChild', { singleton: 'first-instance' })
class SingChild extends SingParent {

}

@CLASS.NAME('Autoinstance', { singleton: 'autoinstance' })
class Autoinstance extends SingParent {

}

@CLASS.NAME('AutoinstanceNot', { singleton: 'first-instance' })
class AutoinstanceNot extends SingParent {

}



function updateChain(entity: Function, target: Function) {
  if (!_.isFunction(entity)) {
    return
  }
  // console.log(`Entity ${entity.name} shoudl have controler singleton ${target.name}`)
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


class SingletonNoClassName {

}



describe('Singleton', () => {

  it('should create singleton for class without @CLAS.NAME decorators', () => {

    let i = new SingletonNoClassName();
    CLASS.setSingletonObj(SingletonNoClassName, i)
    expect(CLASS.getSingleton(SingletonNoClassName)).to.be.eq(i)


  })

  it('should create singleton first instance', () => {

    let i = new SingletonTest(1);
    new SingletonTest(2);
    new SingletonTest(3);
    // console.log('SINGLETON',SingletonTest[SYMBOL.SINGLETON])
    expect(CLASS.getSingleton(SingletonTest)).to.be.eq(i)


  })

  it('should create singleton last instance', () => {

    let i1 = new SingletonTestLast(1);
    let i2 = new SingletonTestLast(2);
    let i3 = new SingletonTestLast(3);
    // console.log('SINGLETON',SingletonTest[SYMBOL.SINGLETON])
    expect(CLASS.getSingleton(SingletonTestLast)).to.be.eq(i3)


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
    // expect(EntityTest['ctrl']).to.be.instanceOf(SingletonTest4)


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
