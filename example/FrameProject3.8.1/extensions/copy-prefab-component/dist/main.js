"use strict";
const fs = require("fs");
const path = require("path");
const ncp = require('copy-paste')
const UuidUtils = require("./UuidUtils");
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
let openPrefabUuid;
let copyStr;
let copyProperty = (function () {
	let copyProperty = {};
	//id映射类名
	let idToClassDic = {};
	//id映射预制体路径
	copyProperty.idToPathDic = {};

	let jsList = [];

	//加载预制体路径
	copyProperty.loadPath = function (filePath) {
		let files = fs.readFileSync(filePath, "utf8");
		let content = JSON.parse(files);
		let obj = {};
		Object.keys(content).forEach((fileName) => {
			if (path.extname(fileName) == ".prefab") {				//预制体
				obj[content[fileName].uuid] = fileName;
			}
		});
		this.idToPathDic = obj;
	}


	//加载类名
	copyProperty.loadClass = function (filePath) {
		let files = fs.readdirSync(filePath);
		let self = this;
		files.forEach((fileName) => {
			if (path.extname(fileName) == ".js") {				//js文件
				self.parseClassName(filePath + "/" + fileName);
			} else if (fs.statSync(filePath + "/" + fileName).isDirectory()) {	//文件夹
				self.loadClass(filePath + "/" + fileName);
			}
		});
	}


	var regexp = /_cclegacy\._RF\.push.*\);/g;
	//解析id 类名
	copyProperty.parseClassName = function (classidFile) {
		let data = fs.readFileSync(classidFile);
		if (regexp.test(data.toString())) {
			let cStr = data.toString().match(regexp);
			let sps;
			cStr.forEach((cS) => {
				cS = cS.replaceAll("'", "").replaceAll(" ", "").replaceAll('"', "");
				sps = cS.split(',');
				idToClassDic[sps[1]] = sps[2]
			})
		}
	}


	copyProperty.start = function (prefabPath) {
		let data = fs.readFileSync(prefabPath);
		jsList = JSON.parse(data.toString());
		let proName;
		jsList.forEach((js, idx) => {
			proName = js._name;
			if (proName) {
				if (proName.startsWith("node")) {
					parseNode(proName, js)
				} else if (proName.startsWith("lbl")) {
					parseBuiltinComponent(proName, 'cc.Label', js)
				} else if (proName.startsWith("slider")) {
					if (!parseCustomComponent(proName, js, 'ASlider')) {
						parseBuiltinComponent(proName, 'cc.Slider', js)
					}
				} else if (proName.startsWith("btn")) {
					if (!parseCustomComponent(proName, js, 'AButton')) {
						parseBuiltinComponent(proName, 'cc.Button', js)
					}
				} else if (proName.startsWith("rich")) {
					parseBuiltinComponent(proName, 'cc.RichText', js)
				} else if (proName.startsWith("img")) {
					parseBuiltinComponent(proName, 'cc.Sprite', js)
				} else if (proName.startsWith("tog")) {
					if (!parseCustomComponent(proName, js, 'AToggle')) {
						parseBuiltinComponent(proName, 'cc.Toggle', js)
					}
				} else if (proName.startsWith("eb")) {
					parseBuiltinComponent(proName, 'cc.EditBox', js)
				} else if (proName.startsWith("list")) {
					if (!parseCustomComponent(proName, js, 'AVirtualScrollView')) {
						parseCustomComponent(proName, js, 'List')
					}
				} else if (proName.startsWith("item")) {
					parseCustomComponent(proName, js)
				}
			} else if (js.value) {//3.0嵌套预制体
				parsePrefab(js.value, js, idx);
			}
		})
	}

	//3.0嵌套预制体
	function parsePrefab(value, js, idx) {
		if (typeof (value) == "string") {
			if (value.startsWith("item")) {
				parsePrefabCustomComponent(value, js, '', idx)
			}
		}

	}

	//解析嵌套预制体用户自定义脚本组件
	function parsePrefabCustomComponent(name, json, types = '', idx) {
		try {
			let obj = jsList[json.targetInfo.__id__];
			if (obj.__type__ == "cc.TargetInfo") {
				let localId = obj.localID[0];
				let temp;
				for (var i = 0; i < jsList.length; i++) {
					temp = jsList[i];
					if (temp.fileId == localId) {

						let propertys = jsList[temp.instance.__id__].propertyOverrides;
						for (var j = 0; j < propertys.length; j++) {
							if (propertys[j].__id__ == idx) {
								Editor.Message.request('asset-db', 'query-asset-info', temp.asset.__uuid__).then(function (v) {
									if (v) {
										let data = fs.readFileSync(v.file);
										let list = JSON.parse(data.toString());
										let item = list[1];
										findCustomType(item, list, types, false, function (type) {
											if (type != '') {
												let tempJson = {
													_name: name,
													_parent: {
														__id__: temp.root.__id__
													}
												};
												let content = `private get ${name}() : ${type} {return ComponentFindUtils.find<${type}>("${findPath(tempJson)}",${type},this);}`
												console.log(content);
												copyStr+=content+"\n";
											}
										});
									} else {
										console.error("未找到嵌套预制体" + temp.asset.__uuid__);
									}
								});
								return;
							}
						}
					}
				}

			}

		} catch (e) {
			console.log(e);
		}
	}


	//解析node组件
	function parseNode(name, json) {
		let type = 'Node';
		let content = `private get ${name}() : ${type} {return ComponentFindUtils.findNode("${findPath(json)}",this);}`;
		console.log(content);
		copyStr+=content+"\n";
		return true;
	}

	//解析内置组件
	function parseBuiltinComponent(name, type, json) {
		type = findType(type, json);
		if (type != '') {
			type = type.replace("cc.", "");
			let content = `private get ${name}() : ${type} {return ComponentFindUtils.find<${type}>("${findPath(json)}",${type},this);}`
			console.log(content);
			copyStr+=content+"\n";
			return true;
		}
		return false;
	}

	//解析用户自定义脚本组件
	function parseCustomComponent(name, json, types = '') {
		findCustomType(json, jsList, types, true, function (type) {
			if (type != '') {
				let content = `private get ${name}() : ${type} {return ComponentFindUtils.find<${type}>("${findPath(json)}",${type},this);}`
				console.log(content);
				copyStr+=content+"\n";
			}
		});
	}

	//查找组件node 路径
	function findPath(json) {
		let str = json._name || "";
		let idx = json._parent.__id__;
		try {
			if (idx != 1) {
				let path = findPath(jsList[idx]);
				if (str != "" && path != "") {
					return path + "/" + str
				} else if (path != "") {
					return path;
				} else {
					return str;
				}
			}
		} catch (e) {
			console.log(e);
		}
		return str
	}

	//查找组件类型
	function findType(type, json) {
		try {
			let item, tempType;
			for (var i = 0; i < json._components.length; i++) {
				item = json._components[i];
				tempType = jsList[item.__id__].__type__;
				if (tempType.indexOf(type) != -1) {
					return tempType;
				}
			}
		} catch (e) {
			console.log(e);
		}
		return ''
	}

	//查找自定义组件类型
	function findCustomType(json, list, typeName = '', isCheckPrefab = true, cb = null) {
		try {
			//console.log(idToClassDic);
			if (isCheckPrefab && json._parent == null) {
				return ''
			}

			let item, className, id;
			for (var i = 0; i < json._components.length; i++) {
				item = json._components[i];
				id = list[item.__id__].__type__;
				if (id.indexOf("cc.") == -1) {
					Editor.Message.request('asset-db', 'query-asset-info', UuidUtils.UuidUtils.decompressUuid(id)).then(function (v) {
						if (v) {
							className = v.name.split(".")[0];
							if (typeName == '' && className) {
								cb(className);
							} else if (className && className == typeName) {
								cb(className);
							}
						} else {
							cb("");
						}
					});
					// className = idToClassDic[id];
					// if(typeName == '' && className){
					// 	return className;
					// }else if(className && className == typeName){
					// 	return className;
					// }
				}
			}
		} catch (e) {
			cb("");
		}
	}
	return copyProperty;
})();
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
	async copy() {
		const info = await Editor.Message.request('asset-db', 'query-asset-info', openPrefabUuid);
		if (!info || !info.file) {
			console.error("未找到预制体，请重新打开重试")
			return;
		}
		copyStr = "";
		copyProperty.start(info.file);
		setTimeout(()=>{
			ncp && ncp.copy(copyStr, function () {
				// complete...
			  })
		},1000);
		
	},
	openPrefab(uuid) {
		openPrefabUuid = uuid;
	}
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() {
	let filePath = Editor.Project.path + "/temp/programming/packer-driver/targets/editor/chunks";
	copyProperty.loadClass(filePath);
}
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
