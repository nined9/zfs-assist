"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoCompletion = void 0;
/*
 * @Author: Do not edit
 * @Date: 2020-11-02 19:19:25
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-16 16:01:44
 * @Description:
 * @FilePath: \zfs-assist\src\functional\auto-completion.ts
 */
const vscode = require("vscode");
function provideCompletionItems(document, position, token, context) {
    const line = document.lineAt(position);
    const projectPath = '';
    const lineText = line.text.substring(0, position.character);
    const reg = /(^|=| )\w+\.$/g;
    if (reg.test(lineText)) {
        const json = require(`../config/auto-completion.json`);
        const list = Object.keys(json);
        return list.map(item => {
            return new vscode.CompletionItem(item, vscode.CompletionItemKind.Field);
        });
    }
    return [];
}
function resolveCompletionItem(item, token) {
    return null;
}
function autoCompletion(context) {
    // context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascript', {
    //   provideCompletionItems,
    //   resolveCompletionItem,
    // }));
}
exports.autoCompletion = autoCompletion;
//# sourceMappingURL=auto-completion.js.map