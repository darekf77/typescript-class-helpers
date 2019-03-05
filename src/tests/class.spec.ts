import * as _ from 'lodash';
import { describe, before } from 'mocha'
import { expect } from 'chai';
import { CLASS } from '../index';

@CLASS.NAME('Test')
class Test {
  static id = 0;

  id: number;

  users: User[];

  name: string;
  constructor() {
    this.id = Test.id++;
  }
}

@CLASS.NAME('User')
class User {
  static id = 0;

  dupa() {
    console.log('jest em!')
    return true;
  }

  id: number;

  authors: User[];
  friend: User;
  test: Test;
  constructor(id?: number) {
    if (_.isNumber(id)) {
      this.id = id;
    } else {
      this.id = User.id++;
    }

  }
}

describe('CLASS', () => {




  before(() => {
    // User.id = 0;
    // console.log('BEFORE')
  })

  it('CLASS.NAME shoudl work', () => {

    let d = new User();
    let c = CLASS.getBy('User');
    let c2 = CLASS.getBy(User);
    // console.log('c', c)
    let d1 = new (c as any)()
    expect(d).to.be.instanceOf(User)
    expect(d1).to.be.instanceOf(User)
    expect(d).to.be.instanceOf(c2)
    expect(d1).to.be.instanceOf(c2)
    expect(d).to.be.instanceOf(c)
    expect(d1).to.be.instanceOf(c)

  });

  it('Comparaion should work', () => {


    let u1 = new User(111)
    let u2 = new User(222)
    let u3as1 = new User(111)

    expect(CLASS.OBJECT(u1).isEqual(u2)).to.be.false;
    expect(CLASS.OBJECT(u1).isEqual(u3as1)).to.be.true;
  });



});


