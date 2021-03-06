//#region @backend
import { RequestHandler } from 'express';
//#endregion


export namespace Models {

  export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'jsonp';
  export type ParamType = 'Path' | 'Query' | 'Cookie' | 'Header' | 'Body';

  export type CLASSNAMEOptions = {
    uniqueKey?: string,
    /**
     * autoinstance - create instance of singleton automaticly inside decorator
     * first-instance - use first instace of created class as decorator
     */
    singleton?: 'autoinstance' | 'first-instance' | 'last-instance' | boolean,
    classFamily?: string,
    classNameInBrowser?: string,
  }

  export class ParamConfig {
    paramName: string;
    paramType: ParamType;
    index: number;
    defaultType: any;
    expireInSeconds?: number;
  }

  export class MethodConfig {
    methodName: string;
    path: string;
    descriptor: PropertyDescriptor;
    type: HttpMethod;
    realtimeUpdate: boolean;
    //#region @backend
    requestHandler: RequestHandler;
    //#endregion
    parameters: { [paramName: string]: ParamConfig } = {};
  }

  export interface ClassMeta {
    uniqueKey?: string;
    className?: string;
    classFamily?: string;
    classNameInBrowser?: string;
    target?: Function;
  }

  export class ClassConfig {
    browserTransformFn?: (entity: any) => any;
    singleton: Object = void 0;
    injections: { getter: Function, propertyName: string; }[] = [];
    calculatedPath: string;
    path: string;
    vChildren?: ClassConfig[] = [];
    vParent?: ClassConfig;
    classReference: Function;
    methods: { [methodName: string]: MethodConfig } = {};
  }

}