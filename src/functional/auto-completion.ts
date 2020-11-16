/*
 * @Author: Do not edit
 * @Date: 2020-11-02 19:19:25
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-16 16:01:44
 * @Description: 
 * @FilePath: \zfs-assist\src\functional\auto-completion.ts
 */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.ExtensionContext) {
  const line = document.lineAt(position);
  const projectPath = '';

  const lineText = line.text.substring(0, position.character);

  const reg = /(^|=| )\w+\.$/g;
  if (reg.test(lineText)) {
    const json = require(`../config/auto-completion.json`);
    const list = Object.keys(json);
    return list.map(item => {
      return new vscode.CompletionItem(item, vscode.CompletionItemKind.Field);
    })
  }
  return [];
}

function resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
  return null;
}

export function autoCompletion(context: vscode.ExtensionContext) {
  // context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascript', {
  //   provideCompletionItems,
  //   resolveCompletionItem,
  // }));
}