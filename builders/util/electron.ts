import {DevServerBuilderOutput} from "@angular-devkit/build-angular";
import {BuilderContext, BuilderOutput} from "@angular-devkit/architect";
import {Observable} from "rxjs";
import {ChildProcess, spawn} from "child_process";
import {isMac} from "./util";

const builder = require("electron-builder");

export function openElectron(x: DevServerBuilderOutput, electronMain: string, context: BuilderContext): Observable<BuilderOutput> {
  return new Observable(observer => {
    if (context.target.target === "build-electron") {
      const electronBin = isMac() ? "./node_modules/.bin/electron" : "node_modules/electron/dist/electron";

      const ls: ChildProcess = spawn(electronBin, [electronMain]);
      ls.stdout.on("data", function (data) {
        context.logger.info(data.toString());
      });

      ls.stderr.on("data", function (data) {
        context.logger.error(data.toString());
      });

      ls.on("exit", function (code) {
        observer.next({success: true});
        observer.complete();
      });
    } else {
      observer.next({success: true});
      observer.complete();
    }
  });
}


export function reloadElectron(x: DevServerBuilderOutput, context: BuilderContext): Observable<BuilderOutput> {
  return new Observable(observer => {
    context.logger.info("Reload Electron");
    observer.next({success: true});

  });
}

export function buildElectron(config): Observable<BuilderOutput> {
  return new Observable(observer => {
    builder.build(config).then(
      () => {
        observer.next({success: true});
        observer.complete();
      },
      e => {
        console.log("Error ", e);
        observer.error();
      }
    );
  });
}
