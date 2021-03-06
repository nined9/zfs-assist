/*
 * @Author: Do not edit
 * @Date: 2020-10-09 10:58:13
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-11-16 16:27:02
 * @Description: 
 * @FilePath: \zfs-assist\src\utils\file.ts
 */
import * as path from 'path';
import * as fs from 'fs';

export type FileObj = {
  file: String,
  path: String;
};

export function readFolder(folderPath:fs.PathLike, excludes: Array<string> = []) {
  
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  const fileArr:FileObj[] = [];

  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    if (excludes.includes(file)) {
      return;
    }
    const filePath = path.join(<string>folderPath, file);
    const state = fs.statSync(filePath);
    if (state.isFile()) {
      fileArr.push({ file, path: filePath });
    } else if (state.isDirectory()) {
      fileArr.push(...readFolder(filePath));
    }
  });
  return fileArr;
}