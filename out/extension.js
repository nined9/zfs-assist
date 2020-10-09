"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivated = exports.activate = void 0;
const extend_component_1 = require("./functional/extend-component");
function activate(context) {
    extend_component_1.extendComponent(context);
    console.log('zfs-assist扩展已成功激活');
}
exports.activate = activate;
function deactivated() {
    console.log('zfs-assist扩展已释放');
}
exports.deactivated = deactivated;
//# sourceMappingURL=extension.js.map