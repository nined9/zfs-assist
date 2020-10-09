/*
 * @Author: Do not edit
 * @Date: 2020-10-09 10:23:13
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-10-09 13:54:08
 * @Description:
 * @FilePath: \zfs-assist\src\extension.ts
 */
import * as vscode from 'vscode'
import { extendComponent } from './functional/extend-component'

export function activate(context: vscode.ExtensionContext) {
  extendComponent(context)

  console.log('zfs-assist扩展已成功激活')
}

export function deactivated() {
  console.log('zfs-assist扩展已释放')
}
