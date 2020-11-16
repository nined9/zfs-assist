"use strict";
/*
 * @Author: Do not edit
 * @Date: 2020-10-09 11:15:02
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-10-27 15:26:15
 * @Description:
 * @FilePath: \zfs-assist\src\utils\props.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCamelCase = exports.isDef = void 0;
function isDef(v) {
    return v !== undefined && v !== null;
}
exports.isDef = isDef;
// 短横线转驼峰
function getCamelCase(str) {
    const arr = str.split('-');
    return arr.map((item, index) => {
        if (index === 0) {
            return item;
        }
        return item[0].toUpperCase() + item.slice(1);
    }).join('');
}
exports.getCamelCase = getCamelCase;
//# sourceMappingURL=props.js.map