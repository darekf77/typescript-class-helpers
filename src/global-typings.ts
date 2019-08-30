
//#region @backend
declare global {
  namespace NodeJS {
    interface Global {
      tnp_normal_mode: boolean;
      muteMessages: boolean;
      testMode: boolean;
      hideWarnings: boolean;
      hideInfos: boolean;
      hideLog: boolean;
      tnpShowProgress?: boolean;
      tnpNonInteractive?: boolean;
      //#region @backend
      tnpNoColorsMode?: boolean;
      //#endregion

    }
  }
}
//#endregion
