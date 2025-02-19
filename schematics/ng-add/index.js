"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@schematics/angular/utility/config");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const path = require("path");
const project_1 = require("@schematics/angular/utility/project");
const schematics_1 = require("@angular-devkit/schematics");
function default_1(options) {
    return (tree, _context) => {
        return schematics_1.chain([
            updateArchitect(options),
            addFiles(options),
            addPackageJsonDependencies(),
            installPackageJsonDependencies()
        ])(tree, _context);
    };
}
exports.default = default_1;
function updateArchitect(options) {
    return (tree, _context) => {
        const workspace = config_1.getWorkspace(tree);
        const project = project_1.getProject(tree, options.project);
        const projectName = options.project;
        if (!project.sourceRoot && !project.root) {
            project.sourceRoot = "src";
        }
        else if (!project.sourceRoot) {
            project.sourceRoot = path.join(project.root, "src");
        }
        const architect = workspace.projects[projectName].architect;
        if (!architect)
            throw new Error(`expected node projects/${projectName}/architect in angular.json`);
        architect["build-electron"] = {
            builder: "@richapps/ngtron:build",
            options: {
                browserTarget: projectName + ":build",
                electronMain: project.sourceRoot + "/electron.ts"
            }
        };
        architect["package-electron"] = {
            builder: "@richapps/ngtron:package",
            options: {
                browserTarget: projectName + ":build",
                electronMain: project.sourceRoot + "/electron.ts",
                electronPackage: {
                    version: "0.0.0",
                    name: projectName,
                    main: "electron.js",
                    dependencies: {}
                },
                packagerConfig: {
                    mac: ["zip", "dmg"],
                    config: {
                        appId: "some.id",
                        npmRebuild: false,
                        asar: false,
                        directories: {
                            app: "dist/" + projectName,
                            output: "dist/" + projectName + "-electron",
                            buildResources: project.root + "/electronResources"
                        },
                        electronVersion: "4.0.0"
                    }
                }
            }
        };
        architect["serve-electron"] = {
            builder: "@richapps/ngtron:serve",
            options: {
                browserTarget: projectName + ":build"
            }
        };
        return config_1.updateWorkspace(workspace);
    };
}
function addPackageJsonDependencies() {
    return (host, context) => {
        // TODO: Get latest electroin dependency or let user choose
        const dependencies = [
            { type: dependencies_1.NodeDependencyType.Dev, version: "~4.0.0", name: "electron" },
            { type: dependencies_1.NodeDependencyType.Dev, version: "20.39.0", name: "electron-builder" },
            { type: dependencies_1.NodeDependencyType.Dev, version: "^8.10.46", name: "@types/node" },
            { type: dependencies_1.NodeDependencyType.Dev, version: "^0.2.0", name: "electron-reloader" }
        ];
        dependencies.forEach(dependency => {
            dependencies_1.addPackageJsonDependency(host, dependency);
            context.logger.log("info", `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log("info", `🔍 Installing packages...`);
        return host;
    };
}
function addFiles(options) {
    return (host, context) => {
        const project = project_1.getProject(host, options.project);
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url(`./files`), [
            schematics_1.template({
                tmpl: ''
            }),
            schematics_1.move(project.root)
        ]));
    };
}
//# sourceMappingURL=index.js.map