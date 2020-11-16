/*
 * @Author: Do not edit
 * @Date: 2020-10-09 10:23:13
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-16 22:40:28
 * @Description:
 * @FilePath: \zfs-assist\src\extension.ts
 */
import * as vscode from 'vscode'
import { extendComponent } from './functional/extend-component'
import { searchServiceFile } from './functional/search-service-file'
import { searchUIFile } from './functional/search-ui-file'
import { socketOpen } from './functional/socket-open'

export function activate(context: vscode.ExtensionContext) {
  let flagSocketOpen = false;

  let disposable = vscode.commands.registerCommand(
    'zfs-assist.entryComponent',
    function () {
      const items = [
        <vscode.QuickPickItem>{ label: '0: 继承组件', description: '从zfs-service里继承一个组件' },
        <vscode.QuickPickItem>{ label: '1: 查找组件(service)', description: '查看zfs-service里的文件' },
        <vscode.QuickPickItem>{ label: '2: 查找组件(ui)', description: '查看zfs-ui里的文件' },
      ];
      if (!flagSocketOpen) {
        items.push(<vscode.QuickPickItem>{ label: '3: 开启F9特性', description: '在浏览器页面中按F9，快速在vscode对应项目中定位对应页面文件' })
      }

      vscode.window
        .showQuickPick(items, {
          canPickMany: false,
          ignoreFocusOut: false,
          matchOnDescription: false,
          matchOnDetail: true,
          placeHolder: '请输入选项',
        })
        .then((item) => {
          if (!item) {
            return;
          }
          const idx = items.findIndex((one, index) => {
            if (one.label === item!.label) {
              return true;
            }
          })
          switch(idx) {
            case 0:
              extendComponent(context)
              break;
            case 1:
              searchServiceFile(context)
              break;
            case 2:
              searchUIFile(context)
              break;
            case 3:
              socketOpen(context);
              flagSocketOpen = true;
              break;
          }
        });
    },
  )
  context.subscriptions.push(disposable)

  console.log('zfs-assist扩展已成功激活')
}

export function deactivated() {
  console.log('zfs-assist扩展已释放')
}
