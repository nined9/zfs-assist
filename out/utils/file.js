"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFolder = void 0;
/*
 * @Author: Do not edit
 * @Date: 2020-10-09 10:58:13
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-16 16:27:02
 * @Description:
 * @FilePath: \zfs-assist\src\utils\file.ts
 */
const path = require("path");
const fs = require("fs");
function readFolder(folderPath, excludes = []) {
    if (!fs.existsSync(folderPath)) {
        return [];
    }
    const fileArr = [];
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        if (excludes.includes(file)) {
            return;
        }
        const filePath = path.join(folderPath, file);
        const state = fs.statSync(filePath);
        if (state.isFile()) {
            fileArr.push({ file, path: filePath });
        }
        else if (state.isDirectory()) {
            fileArr.push(...readFolder(filePath));
        }
    });
    return fileArr;
}
exports.readFolder = readFolder;
//# sourceMappingURL=file.js.map