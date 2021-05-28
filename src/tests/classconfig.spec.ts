import { _ } from 'tnp-core';
import { describe, before, it } from 'mocha'
import { expect } from 'chai';
import { CLASS } from '../index';


class Parent {

}

class Child extends Parent {

}

class Child1 extends Parent {

}

class Child2 extends Child {

}

class Child3 extends Child2 {

}


describe('CLASS CONFIG', () => {

  it('Should create class config', async () => {

    const parent = CLASS.getConfig(Parent)[0]
    const child = CLASS.getConfig(Child)[0]
    const child1 = CLASS.getConfig(Child1)[0]
    const child2 = CLASS.getConfig(Child2)[0]
    const child3 = CLASS.getConfig(Child3)[0]

    // console.log(`parent: ${parent.classReference.name}`)
    expect(parent.classReference).to.be.eq(Parent)
    expect(parent.vChildren.length).to.be.eq(2)

    expect(child.classReference).to.be.eq(Child)
    expect(child.vParent).to.be.eq(parent)

    expect(child1.classReference).to.be.eq(Child1)
    expect(child1.vParent).to.be.eq(parent)

    expect(child2.classReference).to.be.eq(Child2)
    expect(child2.vParent).to.be.eq(child)

    expect(child3.classReference).to.be.eq(Child3)
    expect(child3.vParent).to.be.eq(child2)

    expect(child2.vChildren.length).to.be.eq(1)

  });

})
