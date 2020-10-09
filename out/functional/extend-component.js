"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendComponent = void 0;
/*
 * @Author: Do not edit
 * @Date: 2020-10-09 10:53:28
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-10-09 14:28:37
 * @Description:
 * @FilePath: \zfs-assist\src\functional\extend-component.ts
 */
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
function extendComponent(context) {
    let disposable = vscode.commands.registerCommand('zfs-assist.extendComponent', function () {
        var _a;
        const document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        const fsPath = (document === null || document === void 0 ? void 0 : document.uri) ? document === null || document === void 0 ? void 0 : document.uri.fsPath : document === null || document === void 0 ? void 0 : document.fileName;
        if (!fsPath) {
            vscode.window.showErrorMessage('必须先打开一个项目文件才能获得项目路径');
            return;
        }
        const folderArr = fsPath.split(path.sep);
        const extName = '.vue';
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
        const libName = 'zfs-service';
        let depPath = path.join(nodeModulesPath, libName);
        if (!fs.existsSync(depPath)) {
            vscode.window.showErrorMessage(`未找到${libName}库`);
            return;
        }
        const files = utils_1.readFolder(depPath).filter(({ file }) => file.endsWith(extName));
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
            matchOnDescription: false,
            matchOnDetail: true,
            placeHolder: '请输入组件名',
        })
            .then((item) => {
            if (!item) {
                // vscode.window.showErrorMessage('未选择要继承的组件文件')
                return;
            }
            const { label: fileName, description = '' } = item;
            const relativePath = description.replace(path.join(nodeModulesPath, libName, 'src'), '') || '';
            const filePath = path.join(curProjectPath, 'src', 'service', relativePath);
            const lastSepIndex = filePath.lastIndexOf(path.sep);
            const folderPath = filePath.substring(0, lastSepIndex);
            if (!fs.existsSync(folderPath)) {
                try {
                    fs.mkdirSync(folderPath, { recursive: true });
                }
                catch (e) {
                    vscode.window.showErrorMessage(`创建${folderPath}文件夹失败~`);
                    return;
                }
            }
            if (!fs.existsSync(filePath)) {
                const fileContent = `
<script>
import ${fileName.replace(extName, '')} from '${libName}/src${relativePath
                    .split(path.sep)
                    .join('/')
                    .replace(extName, '')}';

export default {
  name: '${fileName.replace(extName, '')}',
  extends: ${fileName.replace(extName, '')},
  data() {
    return {

    };
  },
};
</script>
`;
                try {
                    fs.writeFileSync(filePath, fileContent);
                }
                catch (e) {
                    vscode.window.showErrorMessage(`写入${filePath}文件失败~`);
                    return;
                }
            }
            vscode.workspace.openTextDocument(filePath).then((doc) => {
                vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);
                vscode.workspace.openTextDocument(description).then((descDoc) => {
                    vscode.window.showTextDocument(descDoc, vscode.ViewColumn.Beside, true);
                }, (err) => {
                    vscode.window.showErrorMessage(`侧边打开${description}文件失败`);
                });
            }, (err) => {
                vscode.window.showErrorMessage(`打开${filePath}文件失败`);
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.extendComponent = extendComponent;
//# sourceMappingURL=extend-component.js.map