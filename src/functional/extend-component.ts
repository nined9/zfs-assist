/*
 * @Author: Do not edit
 * @Date: 2020-10-09 10:53:28
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-10-27 15:39:42
 * @Description:
 * @FilePath: \zfs-assist\src\functional\extend-component.ts
 */
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { readFolder, getCamelCase } from '../utils'

export function extendComponent(context: vscode.ExtensionContext) {
  const document = vscode.window.activeTextEditor?.document
  const fsPath = document?.uri ? document?.uri.fsPath : document?.fileName

  if (!fsPath) {
    vscode.window.showErrorMessage('必须先打开一个项目文件才能获得项目路径')
    return
  }

  const folderArr = fsPath.split(path.sep)
  const extName = '.vue'
  let tmpArr = [...folderArr]
  let curProjectPath = ''
  let nodeModulesPath = ''
  while (tmpArr.length > 0) {
    const tmpPath = path.join(...tmpArr, 'node_modules')
    if (fs.existsSync(tmpPath)) {
      curProjectPath = path.join(...tmpArr)
      nodeModulesPath = tmpPath
      break
    } else {
      tmpArr.pop()
    }
  }
  if (!nodeModulesPath) {
    vscode.window.showErrorMessage('未找到node_modules文件夹')
    return
  }
  const libNames = ['@zfs/service', 'zfs-service'];
  const libName = libNames.find(libName => {
    let depPath = path.join(nodeModulesPath, ...libName.split('/'));
    return fs.existsSync(depPath);
  }) || '';
  if (!libName) {
    vscode.window.showErrorMessage(`未找到${libNames.join()}库`)
    return
  }

  let depPath = path.join(nodeModulesPath, ...libName.split('/'))

  const files = readFolder(depPath).filter(({ file }) =>
    file.endsWith(extName)
  )

  const items = files
    .map(
      ({ file: label, path: description }) =>
        <vscode.QuickPickItem>{ label, description },
    )
    .sort((a, b) => {
      return a.label
        .toLocaleLowerCase()
        .localeCompare(b.label.toLocaleLowerCase())
    })

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
        return
      }
      const { label: fileName, description = '' } = item
      const relativePath =
        description.replace(
          path.join(nodeModulesPath, ...libName.split('/'), 'src'),
          '',
        ) || ''
      const filePath = path.join(
        curProjectPath,
        'src',
        'service',
        relativePath,
      )

      const lastSepIndex = filePath.lastIndexOf(path.sep)
      const folderPath = filePath.substring(0, lastSepIndex)

      if (!fs.existsSync(folderPath)) {
        try {
          fs.mkdirSync(folderPath, { recursive: true })
        } catch (e) {
          vscode.window.showErrorMessage(`创建${folderPath}文件夹失败~`)
          return
        }
      }
      if (!fs.existsSync(filePath)) {
        const noExtFileName = getCamelCase(fileName.replace(extName, ''));

        const fileContent = `<script>
import ${noExtFileName} from '${libName}/src${relativePath
              .split(path.sep)
              .join('/')
              .replace(extName, '')}';

export default {
  name: '${noExtFileName}',
  extends: ${noExtFileName},
  data() {
    return {

    };
  },
};
</script>
`
      try {
        fs.writeFileSync(filePath, fileContent)
      } catch (e) {
        vscode.window.showErrorMessage(`写入${filePath}文件失败~`)
        return
      }
    }

    vscode.workspace.openTextDocument(filePath).then(
      (doc) => {
        vscode.window.showTextDocument(doc, vscode.ViewColumn.Active)
        vscode.workspace.openTextDocument(description).then(
          (descDoc) => {
            vscode.window.showTextDocument(
              descDoc,
              vscode.ViewColumn.Beside,
              true,
            )
          },
          (err) => {
            vscode.window.showErrorMessage(
              `侧边打开${description}文件失败`,
            )
          },
        )
      },
      (err) => {
        vscode.window.showErrorMessage(`打开${filePath}文件失败`)
      },
    )
  })
}
