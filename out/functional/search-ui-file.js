"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUIFile = void 0;
/*
 * @Author: Do not edit
 * @Date: 2020-11-16 15:54:25
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-16 16:30:27
 * @Description:
 * @FilePath: \zfs-assist\src\functional\search-ui-file.ts
 */
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
function searchUIFile(context) {
    var _a;
    const document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
    const fsPath = (document === null || document === void 0 ? void 0 : document.uri) ? document === null || document === void 0 ? void 0 : document.uri.fsPath : document === null || document === void 0 ? void 0 : document.fileName;
    if (!fsPath) {
        vscode.window.showErrorMessage('必须先打开一个项目文件才能获得项目路径');
        return;
    }
    const folderArr = fsPath.split(path.sep);
    let tmpArr = [...folderArr];
    let curProjectPath = '';
    let nodeModulesPath = '';
    while (tmpArr.length > 0) {
        const tmpPath = path.join(...tmpArr, 'node_modules');
        if (fs.existsSync(tmpPath)) {
            curProjectPath = path.join(...tmpArr);
            nodeModulesPath = tmpPath;
            break;
        }
        else {
            tmpArr.pop();
        }
    }
    if (!nodeModulesPath) {
        vscode.window.showErrorMessage('未找到node_modules文件夹');
        return;
    }
    const libNames = ['@zfs/ui', 'zfs-ui'];
    const libName = libNames.find(libName => {
        let depPath = path.join(nodeModulesPath, ...libName.split('/'));
        return fs.existsSync(depPath);
    }) || '';
    if (!libName) {
        vscode.window.showErrorMessage(`未找到${libNames.join()}库`);
        return;
    }
    let depPath = path.join(nodeModulesPath, ...libName.split('/'));
    const files = utils_1.readFolder(depPath, ['lib', 'node_modules']);
    const items = files
        .map(({ file: label, path: description }) => ({ label, description }))
        .sort((a, b) => {
        return a.label
            .toLocaleLowerCase()
            .localeCompare(b.label.toLocaleLowerCase());
    });
    vscode.window
        .showQuickPick(items, {
        canPickMany: false,
        ignoreFocusOut: false,
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: '请输入文件名',
    })
        .then((item) => {
        if (!item) {
            // vscode.window.showErrorMessage('未选择要继承的组件文件')
            return;
        }
        const { label: fileName, description = '' } = item;
        vscode.workspace.openTextDocument(description).then((descDoc) => {
            vscode.window.showTextDocument(descDoc, vscode.ViewColumn.Beside, true);
        }, (err) => {
            vscode.window.showErrorMessage(`侧边打开${description}文件失败`);
        });
    });
}
exports.searchUIFile = searchUIFile;
//# sourceMappingURL=search-ui-file.js.map