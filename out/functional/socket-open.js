"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketOpen = void 0;
/*
 * @Author: Do not edit
 * @Date: 2020-11-16 18:22:25
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-17 08:52:32
 * @Description:
 * @FilePath: \zfs-assist\src\functional\socket-open.ts
 */
const vscode = require("vscode");
const utils_1 = require("../utils");
const http = require("http");
const path = require("path");
const fs = require("fs");
function socketOpen(context) {
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
        const tmpPath = path.join(...tmpArr, 'src');
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
        vscode.window.showErrorMessage('未找到src文件夹');
        return;
    }
    const pages = utils_1.readFolder(path.join(curProjectPath, 'src')).filter(({ file }) => file.endsWith(extName));
    let fileContent = fs.readFileSync(path.join(curProjectPath, 'src', 'main.js'), { encoding: 'utf-8' });
    const startScript = "/** 代码标记,切勿改动[zfs-assist] */";
    const idx = fileContent.indexOf(startScript);
    if (idx >= 0) {
        fileContent = fileContent.substring(0, idx);
    }
    const vueConfig = fs.readFileSync(path.join(curProjectPath, 'vue.config.js'), { encoding: 'utf-8' });
    const reg = new RegExp(/port: ([0-9].*),/);
    reg.exec(vueConfig);
    let PORT = RegExp.$1 || Math.floor(Math.random() * 10000);
    PORT = Number(PORT) + 20000;
    fileContent += `${startScript}
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  const axios = require('axios');

  if (document) {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 120) {
        console.log('tap f9');
        const data = {
          pathname: window.location.pathname,
          hash: window.location.hash,
        };
        axios.post('http://localhost:${PORT}/', data)
          .then((res) => {
            // eslint-disable-next-line
            alert(res.data.msg);
          });
      }
    });
  }
}
`;
    fs.writeFileSync(path.join(curProjectPath, 'src', 'main.js'), fileContent, { encoding: 'utf-8' });
    // console.log('socket.io', sio);
    const server = http.createServer();
    server.on('request', (request, response) => {
        // 添加响应头
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-WithE, OPTIONS');
        response.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        console.log('收到客户端请求', request);
        if (request.method === 'POST') {
            let data = [];
            request.on('data', (chunk) => {
                data.push(chunk); // 将接收到的数据暂时保存起来
            });
            request.on('end', () => {
                // console.log(data.toString()) // 数据传输完，打印数据的内容
                try {
                    const reqData = JSON.parse(data.toString());
                    const { pathname, hash } = reqData;
                    const arr = pathname.split('/');
                    switch (arr[1]) {
                        case 'boe':
                            const boeType = hash.split('?')[0].split('/')[1];
                            const page = pages.find(({ file, path }) => {
                                if (file.indexOf(boeType) >= 0) {
                                    return true;
                                }
                                else if (file === 'index.vue' && path.indexOf(boeType) >= 0) {
                                    return true;
                                }
                            });
                            const obj = {
                                code: 0,
                                msg: '',
                                data: '',
                            };
                            if (page) {
                                const { path: filePath } = page;
                                vscode.workspace.openTextDocument(filePath).then((doc) => {
                                    vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);
                                }, (err) => {
                                    vscode.window.showErrorMessage(`打开${filePath}文件失败`);
                                });
                                obj.msg = '打开成功';
                            }
                            else {
                                obj.code = -1;
                                obj.msg = '找不到页面文件';
                            }
                            // eslint-disable-next-line
                            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
                            response.write(JSON.stringify(obj));
                            response.end();
                            break;
                        default:
                            break;
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
        else if (request.method === 'OPTIONS') {
            // eslint-disable-next-line
            response.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
            response.statusCode = 200;
            response.end();
        }
    });
    server.listen(PORT, function () {
        console.log('服务启动成功,端口:', PORT);
        vscode.window.showInformationMessage('已开启F9特性');
    });
}
exports.socketOpen = socketOpen;
//# sourceMappingURL=socket-open.js.map