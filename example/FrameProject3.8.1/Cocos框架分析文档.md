# Cocos框架分析文档

## 框架概述

这是一个基于Cocos Creator 3.8.1的轻量级游戏框架，采用TypeScript编写，提供了一套完整的游戏开发解决方案。框架设计遵循模块化、可复用的原则，涵盖了游戏开发中的常用功能模块。

**作者**: slf
**版本**: 基于Cocos Creator 3.8.1
**项目路径**: `example/FrameProject3.8.1`

---

## 核心架构

### 1. 目录结构

```
assets/scripts/
├── core/                    # 核心启动模块
│   ├── Main.ts             # 项目入口
│   └── ui/                 # 核心UI配置
├── slf/                    # 框架核心模块
│   ├── audio/              # 音频管理
│   ├── common/             # 通用工具类
│   ├── event/              # 事件系统
│   ├── extension/          # 扩展类
│   ├── fsm/                # 有限状态机
│   ├── i18n/               # 国际化
│   ├── network/            # 网络模块
│   ├── res/                # 资源管理
│   ├── timer/              # 定时器
│   ├── ui/                 # UI框架
│   └── utils/              # 工具类
└── resources/              # 资源文件
```

---

## 核心模块详解

### 1. 日志系统 (Logger)

**文件**: [Logger.ts](assets/scripts/slf/Logger.ts)

**功能**:
- 分级日志输出（DEBUG、WARN、ERROR）
- 带时间戳的彩色日志
- 可配置日志级别

**使用示例**:
```typescript
Logger.log("调试信息");
Logger.warn("警告信息");
Logger.error("错误信息");
Logger.logLevel = LogLevel.WARN; // 设置日志级别
```

---

### 2. UI管理框架

**核心文件**:
- [UIManager.ts](assets/scripts/slf/ui/UIManager.ts) - UI管理器
- [UIBase.ts](assets/scripts/slf/ui/base/UIBase.ts) - UI基类
- [UILayer.ts](assets/scripts/slf/ui/UILayer.ts) - UI层级管理
- [UIPopup.ts](assets/scripts/slf/ui/UIPopup.ts) - 弹窗动画

**核心功能**:

1. **分层管理**: 支持FullScreen、Panel、Tips、Guide等层级
2. **UI缓存**: 自动管理UI生命周期
3. **弹窗系统**: 支持多种弹出动画效果
4. **队列加载**: UI加载队列管理
5. **预制体加载**: 与资源管理器深度集成

**层级类型**:
```typescript
enum LayerType {
    FullScreen,  // 全屏界面
    Panel,       // 面板
    Tips,        // 提示
    Guide        // 引导
}
```

**使用方式**:
```typescript
// 打开UI
UIManager.Instance().openUI(uiId, data);

// 关闭UI
UIManager.Instance().closeUI(uiId);

// 继承UIBase创建自定义UI
@ccclass
export class MyPanel extends UIBase {
    initView(): void {
        // 初始化视图
    }
    removeView(): void {
        // 清理视图
    }
}
```

---

### 3. 资源管理系统

**文件**: [ResManager.ts](assets/scripts/slf/res/ResManager.ts)

**核心功能**:

1. **Bundle管理**: 支持多Bundle资源管理
2. **引用计数**: 自动管理资源生命周期
3. **资源缓存**: 智能缓存已加载资源
4. **任务队列**: 限制最大并发加载数量(10)
5. **远程资源**: 支持远程资源加载
6. **对象池**: 使用对象池优化性能

**API**:
```typescript
// 加载资源
ResManager.Instance().load(url, type, owner, callback, target, bundleName);

// 预加载
ResManager.Instance().preLoad(url, bundleName);

// 销毁资源
ResManager.Instance().destroy(owner);

// 加载Bundle
ResManager.Instance().loadBundle(name, callback);
```

**特性**:
- 自动SpriteFrame纹理转换优化
- 持有者(owner)模式管理资源引用
- 支持加载取消

---

### 4. 事件系统

**文件**: [EventManager.ts](assets/scripts/slf/event/EventManager.ts)

**设计模式**: 发布-订阅模式

**核心功能**:

1. **事件监听**: `on()` - 持续监听
2. **单次监听**: `once()` - 监听一次后自动销毁
3. **取消监听**: `off()` - 取消指定事件
4. **目标取消**: `targetOff()` - 取消目标所有监听
5. **事件派发**: `emit()` - 派发事件

**使用示例**:
```typescript
// 监听事件
EventManager.Instance().on("EventName", callback, target);

// 单次监听
EventManager.Instance().once("EventName", callback, target);

// 派发事件
EventManager.Instance().emit("EventName", params);

// 取消监听
EventManager.Instance().off("EventName", target);
EventManager.Instance().targetOff(target); // 取消所有
```

**特性**:
- 基于UUID的订阅者管理
- 对象池优化EventData
- 双向映射(消息-订阅者、订阅者-消息)

---

### 5. 音频管理

**文件**: [AudioManager.ts](assets/scripts/slf/audio/AudioManager.ts)

**核心功能**:

1. **背景音乐**: 支持循环播放
2. **音效播放**: 一次性音效播放
3. **循环音效**: 可控制的循环音效
4. **音量控制**: 全局音量管理
5. **开关记忆**: LocalStorage持久化

**API**:
```typescript
// 播放音效
AudioManager.Instance().play(path, owner, volume, bundleName);

// 播放循环音效
AudioManager.Instance().playLoop(path, owner, volume, bundleName);

// 播放背景音乐
AudioManager.Instance().playBg(clip, owner, volume, bundleName);

// 停止循环音效
AudioManager.Instance().stopLoop(path);

// 音效开关
AudioManager.Instance().isSoundOpen = true;
AudioManager.Instance().isMusicOpen = true;
```

**特性**:
- 音频对象池(5个AudioSource)
- 资源自动管理
- 开关状态持久化

---

### 6. 有限状态机 (FSM)

**文件**: [FSMController.ts](assets/scripts/slf/fsm/FSMController.ts)

**核心功能**:

1. **状态注册**: 动态注册状态
2. **状态切换**: 平滑的状态转换
3. **状态更新**: 持续更新当前状态
4. **生命周期**: entry/exit/update

**使用示例**:
```typescript
// 创建状态机
let fsm = new FSMController<string>();

// 注册状态
fsm.register("idle", new IdleState());
fsm.register("run", new RunState());

// 切换状态
fsm.changeState("run");
```

---

### 7. 国际化系统 (i18n)

**文件**: [I18nManager.ts](assets/scripts/slf/i18n/I18nManager.ts)

**核心功能**:

1. **多语言切换**: 动态切换语言
2. **组件支持**: Label和Sprite组件扩展
3. **全局配置**: 通过globalThis.i18nConfig配置
4. **自动刷新**: 语言切换时自动刷新所有组件

**支持语言**:
- en (英语)
- es (西班牙语)
- pt (葡萄牙语)

**使用示例**:
```typescript
// 获取文本
I18nManager.Instance().getLanguage("key", "default");

// 切换语言
I18nManager.Instance().changeLanguage("en");

// 获取当前语言代码
let code = I18nManager.Instance().lgCode;
```

---

### 8. 单例模式

**文件**: [Singleton.ts](assets/scripts/slf/common/Singleton.ts)

**特性**:
- 泛型支持
- 自动初始化
- 线程安全

**使用方式**:
```typescript
class MyClass extends Singleton {
    protected init(): void {
        // 初始化逻辑
    }
}

// 使用
let instance = MyClass.Instance();
```

---

### 9. 对象池

**文件**: [ObjPoolUtils.ts](assets/scripts/slf/utils/ObjPoolUtils.ts)

**特性**:
- 按类名分组管理
- 单个池最大200对象
- 自动类名识别

**API**:
```typescript
// 获取对象
let obj = ObjPoolUtils.getObj(MyClass);

// 回收对象
ObjPoolUtils.recycleObj(obj);

// 销毁对象池
ObjPoolUtils.destroy(MyClass);
```

---

## 扩展模块

### 1. 节点扩展 (ENode.ts)
- 节点操作便捷方法

### 2. 组件扩展 (EComponent.ts)
- 组件查找和操作

### 3. 按钮扩展 (EButton.ts)
- 按钮事件处理优化

### 4. 数组扩展 (EArray.ts)
- 数组操作工具方法

### 5. 字符串扩展 (EString.ts)
- 字符串处理工具

### 6. 数字扩展 (ENumber.ts)
- 数字处理工具

### 7. Toggle扩展 (EToggle.ts)
- Toggle组件优化

---

## 工具类

### 1. [CommonUtils.ts](assets/scripts/slf/utils/CommonUtils.ts)
通用工具方法集合

### 2. [ComponentFindUtils.ts](assets/scripts/slf/utils/ComponentFindUtils.ts)
组件查找工具

### 3. [DateUtils.ts](assets/scripts/slf/utils/DateUtils.ts)
日期时间处理

### 4. [NumberUtils.ts](assets/scripts/slf/utils/NumberUtils.ts)
数字处理工具

### 5. [StringUtils.ts](assets/scripts/slf/utils/StringUtils.ts)
字符串处理工具

### 6. [TweenUtils.ts](assets/scripts/slf/utils/TweenUtils.ts)
动画缓动工具

### 7. [LocalStorageManager.ts](assets/scripts/slf/common/LocalStorageManager.ts)
本地存储管理

### 8. [Queue.ts](assets/scripts/slf/common/Queue.ts)
队列数据结构

### 9. [BrowserWindowSizeAdapter.ts](assets/scripts/slf/common/BrowserWindowSizeAdapter.ts)
浏览器窗口适配

---

## UI组件库

### 1. [AComponent.ts](assets/scripts/slf/ui/component/AComponent.ts)
组件基类

### 2. [ADynamicLoad.ts](assets/scripts/slf/ui/component/ADynamicLoad.ts)
动态加载组件

### 3. [AItemRenderer.ts](assets/scripts/slf/ui/component/AItemRenderer.ts)
列表项渲染器

### 4. [ALabel.ts](assets/scripts/slf/ui/component/ALabel.ts)
标签组件

### 5. [ASlider.ts](assets/scripts/slf/ui/component/ASlider.ts)
滑动条组件

### 6. [AVirtualScrollView.ts](assets/scripts/slf/ui/component/AVirtualScrollView.ts)
虚拟滚动视图

---

## 网络模块

### [Http.ts](assets/scripts/slf/network/Http.ts)
HTTP请求封装，支持GET/POST请求。

### [WebSocket.ts](assets/scripts/slf/network/WebSocket.ts)
WebSocket通信封装，支持多实例管理。

**核心功能**:
- **多连接管理**: 支持同时创建多个WebSocket连接
- **自动重连**: 连接断开时自动重连，可配置重连间隔和次数
- **心跳检测**: 定时发送心跳包保持连接活跃
- **消息队列**: 连接前发送的消息自动缓存，连接后发送

**架构设计**:
- `WebSocketBase`: WebSocket通信基类，负责单个连接的底层实现
- `WebSocketManager`: 管理器（单例），负责管理多个WebSocket实例

**使用示例**:
```typescript
// 创建连接
let id = WebSocketManager.Instance().create("chat", {
    url: "server.com:8080",
    protocol: "ws",
    onOpen: () => console.log("连接成功"),
    onMessage: (data) => console.log("收到消息", data),
    onClose: (e) => console.log("连接关闭"),
    onError: (e) => console.log("连接错误"),
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectCount: 5,
    heartbeatInterval: 30000,
    heartbeatData: '{"type":"ping"}'
});

// 发送消息
WebSocketManager.Instance().send("chat", "hello");

// 关闭连接
WebSocketManager.Instance().close("chat");
```

---

## 定时器系统

### [TimerManager.ts](assets/scripts/slf/timer/TimerManager.ts)
- 帧级别的定时器管理
- 支持一次性定时器和循环定时器
- 与状态机集成

---

## 框架特色

### 1. 高性能设计
- 对象池复用
- 资源引用计数
- 任务队列控制
- UI缓存机制

### 2. 易用性
- 单例模式统一管理
- 链式调用支持
- 自动生命周期管理
- 丰富的工具类

### 3. 可扩展性
- 模块化设计
- 基于接口编程
- 组件化UI系统
- 事件驱动架构

### 4. 内存管理
- 自动资源释放
- 持有者模式
- 对象池优化
- 引用计数管理

---

## 项目初始化流程

根据 [Main.ts](assets/scripts/core/Main.ts) 分析：

```typescript
protected onLoad(): void {
    // 1. 初始化UI根节点和容器
    UIManager.Instance().initRoot(this.node);

    // 2. 初始化主包UI配置
    new UIConfigMain().init();
}

protected start(): void {
    // 3. 初始化加载资源
    this.lc.startLoad(this.loadComplete, this);
}

private loadComplete(): void {
    // 4. 加载完成，打开第一个UI
    UIManager.Instance().openUI(UIMainId.Dialog);
}
```

---

## 总结

这是一个设计完善的Cocos Creator游戏框架，具有以下特点：

**优点**:
- ✅ 模块化设计，职责清晰
- ✅ 完善的UI管理系统
- ✅ 智能资源管理
- ✅ 丰富的事件系统
- ✅ 良好的性能优化
- ✅ 国际化支持
- ✅ 单例模式和对象池设计

**适用场景**:
- 中小型游戏项目
- 需要快速开发的休闲游戏
- 需要完善UI管理的游戏
- 多语言游戏项目

**技术栈**:
- Cocos Creator 3.8.1
- TypeScript
- 设计模式：单例、观察者、对象池、状态机

---

*文档生成时间: 2026-03-18*
