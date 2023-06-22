import { CLASS } from '../index';
import { describe, before, it } from 'mocha'
import { expect } from 'chai';

describe('Set name for function or class', () => {

  it('should keep normal function name ', () => {

    function test1() {

    }

    CLASS.setName(test1, 'ASD1');

    expect(CLASS.getName(test1)).to.be.eq('ASD1');

  })

  it('should keep normal scoped function name ', () => {

    const test4 = () => {

    }

    CLASS.setName(test4, 'ASD4');

    expect(CLASS.getName(test4)).to.be.eq('ASD4');

  })

  it('should keep async function name ', () => {

    async function test2() {

    }

    CLASS.setName(test2, 'ASD2');

    expect(CLASS.getName(test2)).to.be.eq('ASD2');

  })

  it('should keep class function name ', () => {

    class TestCL {

    }

    CLASS.setName(TestCL, 'ASD3');

    expect(CLASS.getName(TestCL)).to.be.eq('ASD3');

  })

});
