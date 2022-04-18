import { ConfigModels } from 'tnp-config';

export namespace Models {


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
    paramType: ConfigModels.ParamType;
    index: number;
    defaultType: any;
    expireInSeconds?: number;
  }

  export class MethodConfig {
    methodName: string;
    path: string;
    descriptor: PropertyDescriptor;
    type: ConfigModels.HttpMethod;
    realtimeUpdate: boolean;
    //#region @backend
    requestHandler: any;
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
    // @ts-ignore
    singleton: Object = void 0;
    injections: { getter: Function, propertyName: string; }[] = [];
    calculatedPath: string;
    path: string;
    vChildren?: ClassConfig[] = [];
    vParent?: ClassConfig;
    classReference: Function;
    className?: string;
    classNameInBrowser?: string;
    methods: { [methodName: string]: MethodConfig } = {};
  }

}
