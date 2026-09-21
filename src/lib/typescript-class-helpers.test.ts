import * as FormData from 'form-data';
import { CoreModels } from 'tnp-core/src';

import {
  CLASS,
  getClassFnFromObject,
  getClassName,
} from './typescript-class-helpers';

describe('class-helpers', () => {
  //#region getClassName

  describe('getClassName()', () => {
    it('should return undefined for null and undefined', () => {
      expect(getClassName(null as any)).toBeUndefined();
      expect(getClassName(undefined as any)).toBeUndefined();
    });

    it('should return string directly', () => {
      expect(getClassName('SomeClass' as any)).toBe('SomeClass');
    });

    it('should return Date for Date class', () => {
      expect(getClassName(Date)).toBe('Date');
    });

    it('should return FormData for FormData class', () => {
      expect(getClassName(FormData as any)).toBe('FormData');
    });

    it('should return explicitly assigned Taon class name', () => {
      class TestClass {}

      TestClass[CoreModels.ClassNameStaticProperty] = 'MyTestClass';

      expect(getClassName(TestClass)).toBe('MyTestClass');
    });

    it('should not rely on native Function.name', () => {
      class SomeVerySpecificClassName {}

      expect(getClassName(SomeVerySpecificClassName)).toBeUndefined();
    });

    it('should return empty string for cloned class_* classes', () => {
      const class_cloned = class {};

      expect(class_cloned.name.startsWith('class_')).toBe(true);
      expect(getClassName(class_cloned)).toBe('');
    });

    it('should return undefined for something that is not a function', () => {
      expect(getClassName({} as any)).toBeUndefined();
      expect(getClassName(123 as any)).toBeUndefined();
    });
  });

  //#endregion

  //#region getClassFnFromObject

  describe('getClassFnFromObject()', () => {
    it('should return constructor of object instance', () => {
      class TestClass {}

      const instance = new TestClass();

      expect(getClassFnFromObject(instance)).toBe(TestClass);
    });

    it('should return Object for plain object', () => {
      expect(getClassFnFromObject({})).toBe(Object);
    });

    it('should return Array for array', () => {
      expect(getClassFnFromObject([])).toBe(Array);
    });

    it('should return Date for Date instance', () => {
      expect(getClassFnFromObject(new Date())).toBe(Date);
    });

    it('should return undefined for object without prototype', () => {
      const obj = Object.create(null);

      expect(getClassFnFromObject(obj)).toBeUndefined();
    });

    it('should ignore an own constructor property', () => {
      class RealClass {}
      class FakeClass {}

      const instance = new RealClass();

      Object.defineProperty(instance, 'constructor', {
        value: FakeClass,
      });

      expect(getClassFnFromObject(instance)).toBe(RealClass);
    });

    it('should return undefined for null and undefined', () => {
      expect(getClassFnFromObject(null as any)).toBeUndefined();
      expect(getClassFnFromObject(undefined as any)).toBeUndefined();
    });
  });

  //#endregion

  //#region CLASS.NAME

  describe('CLASS.NAME()', () => {
    it('should assign class name through decorator', () => {
      @CLASS.NAME('DecoratedClass')
      class TestClass {}

      expect(CLASS.getName(TestClass)).toBe('DecoratedClass');
    });

    it('should register decorated class', () => {
      @CLASS.NAME('RegisteredDecoratedClass')
      class TestClass {}

      expect(CLASS.getBy('RegisteredDecoratedClass')).toBe(TestClass);
    });
  });

  //#endregion

  //#region CLASS.setName / setClassName

  describe('CLASS.setName()', () => {
    it('should assign and register class name', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'SetNameTestClass');

      expect(CLASS.getName(TestClass)).toBe('SetNameTestClass');
      expect(CLASS.getBy('SetNameTestClass')).toBe(TestClass);
    });
  });

  describe('CLASS.setClassName()', () => {
    it('should set static class-name property', () => {
      class TestClass {}

      CLASS.setClassName(TestClass, 'StaticPropertyTest');

      expect(TestClass[CoreModels.ClassNameStaticProperty]).toBe(
        'StaticPropertyTest',
      );
    });

    it('should replace registry entry when same name is registered again', () => {
      class FirstClass {}
      class SecondClass {}

      CLASS.setClassName(FirstClass, 'DuplicateRegistryName');

      expect(CLASS.getBy('DuplicateRegistryName')).toBe(FirstClass);

      CLASS.setClassName(SecondClass, 'DuplicateRegistryName');

      expect(CLASS.getBy('DuplicateRegistryName')).toBe(SecondClass);
    });
  });

  //#endregion

  //#region CLASS.getBy

  describe('CLASS.getBy()', () => {
    it('should return registered class', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'GetByTestClass');

      expect(CLASS.getBy('GetByTestClass')).toBe(TestClass);
    });

    it('should return function directly when function is provided', () => {
      class TestClass {}

      expect(CLASS.getBy(TestClass)).toBe(TestClass);
    });

    it('should return Date', () => {
      expect(CLASS.getBy('Date')).toBe(Date);
    });

    it('should return FormData', () => {
      expect(CLASS.getBy('FormData')).toBe(FormData);
    });

    it('should return undefined for unknown class', () => {
      expect(CLASS.getBy('__DefinitelyNotRegisteredClass__')).toBeUndefined();
    });

    it('should support one-element array mapping', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'ArrayMappedClass');

      expect(CLASS.getBy(['ArrayMappedClass'] as any)).toBe(TestClass);
    });

    it('should throw for array with more than one class', () => {
      expect(() => CLASS.getBy(['ClassA', 'ClassB'] as any)).toThrowError(
        /Mapping error/,
      );
    });

    it('should throw for empty array', () => {
      expect(() => CLASS.getBy([] as any)).toThrowError(/Mapping error/);
    });
  });

  //#endregion

  //#region CLASS.getFromObject

  describe('CLASS.getFromObject()', () => {
    it('should return class from instance', () => {
      class TestClass {}

      expect(CLASS.getFromObject(new TestClass())).toBe(TestClass);
    });
  });

  //#endregion

  //#region CLASS.getName

  describe('CLASS.getName()', () => {
    it('should return registered class name', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'GetNameTestClass');

      expect(CLASS.getName(TestClass)).toBe('GetNameTestClass');
    });

    it('should return undefined for unnamed class', () => {
      class TestClass {}

      expect(CLASS.getName(TestClass)).toBeUndefined();
    });
  });

  //#endregion

  //#region CLASS.getNameFromObject

  describe('CLASS.getNameFromObject()', () => {
    it('should return registered name from instance', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'ObjectInstanceClass');

      expect(CLASS.getNameFromObject(new TestClass())).toBe(
        'ObjectInstanceClass',
      );
    });

    it('should return undefined for instance of unnamed class', () => {
      class TestClass {}

      expect(CLASS.getNameFromObject(new TestClass())).toBeUndefined();
    });
  });

  //#endregion

  //#region CLASS.getClassNameFromObjInstanceOrClassFn

  describe('CLASS.getClassNameFromObjInstanceOrClassFn()', () => {
    it('should resolve name from class function', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'ClassFunctionTest');

      expect(CLASS.getClassNameFromObjInstanceOrClassFn(TestClass)).toBe(
        'ClassFunctionTest',
      );
    });

    it('should resolve name from class instance', () => {
      class TestClass {}

      CLASS.setName(TestClass, 'ClassInstanceTest');

      expect(CLASS.getClassNameFromObjInstanceOrClassFn(new TestClass())).toBe(
        'ClassInstanceTest',
      );
    });
  });

  //#endregion

  //#region CLASS.getMethodsNames

  describe('CLASS.getMethodsNames()', () => {
    it('should return methods from class', () => {
      class TestClass {
        methodA() {}

        methodB() {}
      }

      const methods = CLASS.getMethodsNames(TestClass);

      expect(methods).toContain('methodA');
      expect(methods).toContain('methodB');
    });

    it('should return methods from class instance', () => {
      class TestClass {
        methodA() {}

        methodB() {}
      }

      const methods = CLASS.getMethodsNames(new TestClass());

      expect(methods).toContain('methodA');
      expect(methods).toContain('methodB');
    });

    it('should include inherited methods', () => {
      class Parent {
        parentMethod() {}
      }

      class Child extends Parent {
        childMethod() {}
      }

      const methods = CLASS.getMethodsNames(Child);

      expect(methods).toContain('parentMethod');
      expect(methods).toContain('childMethod');
    });

    it('should include inherited methods when instance is provided', () => {
      class Parent {
        parentMethod() {}
      }

      class Child extends Parent {
        childMethod() {}
      }

      const methods = CLASS.getMethodsNames(new Child());

      expect(methods).toContain('parentMethod');
      expect(methods).toContain('childMethod');
    });

    it('should not include constructor', () => {
      class TestClass {
        testMethod() {}
      }

      expect(CLASS.getMethodsNames(TestClass)).not.toContain('constructor');
    });

    it('should not include standard Function/Object methods', () => {
      class TestClass {
        testMethod() {}
      }

      const methods = CLASS.getMethodsNames(TestClass);

      expect(methods).not.toContain('apply');
      expect(methods).not.toContain('bind');
      expect(methods).not.toContain('call');
      expect(methods).not.toContain('toString');
      expect(methods).not.toContain('hasOwnProperty');
      expect(methods).not.toContain('valueOf');
    });

    it('should not include normal properties', () => {
      class TestClass {
        someProperty = 'hello';

        testMethod() {}
      }

      const methods = CLASS.getMethodsNames(new TestClass());

      expect(methods).toContain('testMethod');
      expect(methods).not.toContain('someProperty');
    });

    it('should include function assigned directly to instance', () => {
      class TestClass {
        instanceFunction = () => {};
      }

      const methods = CLASS.getMethodsNames(new TestClass());

      expect(methods).toContain('instanceFunction');
    });

    it('should return empty array for null/undefined', () => {
      expect(CLASS.getMethodsNames(null)).toEqual([]);
      expect(CLASS.getMethodsNames(undefined)).toEqual([]);
    });
  });

  //#endregion
});
