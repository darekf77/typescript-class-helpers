//#region @backend
import { CLI } from 'tnp-cli';
//#endregion
import { Helpers} from 'ng2-logger';

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

declare const PROGRESS_DATA;
declare const config;

export function error(details: any, noExit = false, noTrace = false) {
  if (Helpers.isBrowser) {
    console.error(details)
    return;
  }
  //#region @backend
  // Error.stackTraceLimit = Infinity;
  if (!global.tnp_normal_mode) {
    noTrace = true;
  }
  if (typeof details === 'object') {
    try {
      const json = JSON.stringify(details)
      if (global.tnp_normal_mode) {
        if (noTrace) {
          !global.muteMessages && console.log(CLI.chalk.red(json));
        } else {
          !global.muteMessages && console.trace(CLI.chalk.red(json));
        }
      } else {
        console.log(json)
        return;
      }


    } catch (error) {
      if (global.tnp_normal_mode) {
        if (noTrace) {
          !global.muteMessages && console.log(details);
        } else {
          !global.muteMessages && console.trace(details);
        }
      } else {
        console.log(details)
        return;
      }
    }
  } else {
    if (global.tnp_normal_mode) {
      if (noTrace) {
        !global.muteMessages && console.log(CLI.chalk.red(details));
      } else {
        !global.muteMessages && console.trace(CLI.chalk.red(details));
      }
    } else {
      console.log(details)
      return;
    }

  }

  if (global[config.message.tnp_normal_mode]) {
    if (!noExit) {
      process.exit(1);
    }
  }
  //#endregion
}

export function info(details: string) {
  if (Helpers.isBrowser) {
    console.info(details);
    return;
  }
  //#region @backend
  if (!global.muteMessages && !global.hideInfos) {
    console.log(CLI.chalk.green(details))
    global.tnpNonInteractive && PROGRESS_DATA.log({ msg: details })
  }
  //#endregion
}

export function log(details: string) {
  if (Helpers.isBrowser) {
    console.log(details);
    return;
  }
  //#region @backend
  // console.log('global.muteMessages', global.muteMessages);
  // console.log('global.hideLog', global.hideLog);
  if ((!global.muteMessages && !global.hideLog)) {
    console.log(CLI.chalk.gray(details))
    global.tnpNonInteractive && PROGRESS_DATA.log({ msg: details })
  }
  //#endregion
}

export function warn(details: string, trace = false) {
  if (Helpers.isBrowser) {
    console.warn(details);
    return;
  }
  //#region @backend
  if (!global.tnp_normal_mode) {
    trace = false;
  }
  if (trace) {
    (!global.muteMessages && !global.hideWarnings) && console.trace(CLI.chalk.yellow(details))
  } else {
    (!global.muteMessages && !global.hideWarnings) && console.log(CLI.chalk.yellow(details))
  }
  //#endregion
}

