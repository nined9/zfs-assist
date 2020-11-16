/*
 * @Author: Do not edit
 * @Date: 2020-10-09 11:15:02
 * @LastEditors: 黎加冬
 * @LastEditTime: 2020-10-27 15:26:15
 * @Description: 
 * @FilePath: \zfs-assist\src\utils\props.ts
 */

export function isDef(v: any): boolean {
  return v !== undefined && v !== null;
}

// 短横线转驼峰
export function getCamelCase(str: string) {
  const arr = str.split('-');
  return arr.map((item, index) => {
    if (index === 0) {
      return item;
    }
    return item[0].toUpperCase() + item.slice(1);
  }).join('');
}