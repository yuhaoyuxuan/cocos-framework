# 项目简介
字体高清
动态修改预制体内的文本大小达到字体高清的效果；
小于特定值，Label字体放大倍率倍，node节点缩放倍率； 

使用条件右键文件夹，会遍历当前文件夹下的所有预制体

需要自己修改一下PrefabChangeLabel.ts 内的
/**如果字体小于此值才修改*/
const FontSize = 17;
/**放大倍率 */
const RATIO = 2;

## 开发环境

Node.js

## 安装

```bash
# 安装依赖模块
npm install
# 构建
npm run build
```
