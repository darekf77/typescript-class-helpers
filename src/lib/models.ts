import { CoreModels } from 'tnp-core/src';

export namespace Models {

  /**
   * @deprecated
   */
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

  /**
   * @deprecated
   */
  export class ParamConfig {
    paramName: string;
    paramType: CoreModels.ParamType;
    index: number;
    defaultType: any;
    expireInSeconds?: number;
  }

  /**
   * @deprecated
   */
  export class MethodConfig {
    methodName: string;
    /**
     * path is global in express app
     */
    global?: boolean;
    /**
     * override default content type
     */
    contentType?: any;
    /**
     * override default axiso response type
     */
    responseType?: any;
    path: string;
    descriptor: PropertyDescriptor;
    type: CoreModels.HttpMethod;
    //#region @websql
    requestHandler: any;
    //#endregion
    parameters: { [paramName: string]: ParamConfig } = {};
  }

  /**
   * @deprecated
   */
  export interface ClassMeta {
    uniqueKey?: string;
    className?: string;
    classFamily?: string;
    classNameInBrowser?: string;
    target?: Function;
  }

  /**
   * @deprecated
   */
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
    uniqueKey?: string;
    classNameInBrowser?: string;
    methods: { [methodName: string]: MethodConfig } = {};
  }

}
