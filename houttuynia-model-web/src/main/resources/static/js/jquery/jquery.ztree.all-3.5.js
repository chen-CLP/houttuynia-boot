﻿(function ($) {
    var settings = {}, roots = {}, caches = {}, _consts = {
        className: {BUTTON: "button", LEVEL: "level", ICO_LOADING: "ico_loading", SWITCH: "switch"},
        event: {
            NODECREATED: "ztree_nodeCreated",
            CLICK: "ztree_click",
            EXPAND: "ztree_expand",
            COLLAPSE: "ztree_collapse",
            ASYNC_SUCCESS: "ztree_async_success",
            ASYNC_ERROR: "ztree_async_error"
        },
        id: {A: "_a", ICON: "_ico", SPAN: "_span", SWITCH: "_switch", UL: "_ul"},
        line: {ROOT: "root", ROOTS: "roots", CENTER: "center", BOTTOM: "bottom", NOLINE: "noline", LINE: "line"},
        folder: {OPEN: "open", CLOSE: "close", DOCU: "docu"},
        node: {CURSELECTED: "curSelectedNode"}
    }, _setting = {
        treeId: "",
        treeObj: null,
        view: {
            addDiyDom: null,
            autoCancelSelected: true,
            dblClickExpand: true,
            expandSpeed: "fast",
            fontCss: {},
            nameIsHTML: false,
            selectedMulti: true,
            showIcon: true,
            showLine: true,
            showTitle: true
        },
        data: {
            key: {children: "children", name: "name", title: "", url: "url"},
            simpleData: {enable: false, idKey: "id", pIdKey: "pId", rootPId: null},
            keep: {parent: false, leaf: false}
        },
        async: {
            enable: false,
            contentType: "application/x-www-form-urlencoded",
            type: "post",
            dataType: "text",
            url: "",
            autoParam: [],
            otherParam: [],
            dataFilter: null
        },
        callback: {
            beforeAsync: null,
            beforeClick: null,
            beforeDblClick: null,
            beforeRightClick: null,
            beforeMouseDown: null,
            beforeMouseUp: null,
            beforeExpand: null,
            beforeCollapse: null,
            beforeRemove: null,
            onAsyncError: null,
            onAsyncSuccess: null,
            onNodeCreated: null,
            onClick: null,
            onDblClick: null,
            onRightClick: null,
            onMouseDown: null,
            onMouseUp: null,
            onExpand: null,
            onCollapse: null,
            onRemove: null
        }
    }, _initRoot = function (setting) {
        var r = data.getRoot(setting);
        if (!r) {
            r = {};
            data.setRoot(setting, r)
        }
        r[setting.data.key.children] = [];
        r.expandTriggerFlag = false;
        r.curSelectedList = [];
        r.noSelection = true;
        r.createdNodes = [];
        r.zId = 0;
        r._ver = (new Date()).getTime()
    }, _initCache = function (setting) {
        var c = data.getCache(setting);
        if (!c) {
            c = {};
            data.setCache(setting, c)
        }
        c.nodes = [];
        c.doms = []
    }, _bindEvent = function (setting) {
        var o = setting.treeObj, c = consts.event;
        o.bind(c.NODECREATED, function (event, treeId, node) {
            tools.apply(setting.callback.onNodeCreated, [event, treeId, node])
        });
        o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
            tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag])
        });
        o.bind(c.EXPAND, function (event, treeId, node) {
            tools.apply(setting.callback.onExpand, [event, treeId, node])
        });
        o.bind(c.COLLAPSE, function (event, treeId, node) {
            tools.apply(setting.callback.onCollapse, [event, treeId, node])
        });
        o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
            tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg])
        });
        o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
            tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown])
        })
    }, _unbindEvent = function (setting) {
        var o = setting.treeObj, c = consts.event;
        o.unbind(c.NODECREATED).unbind(c.CLICK).unbind(c.EXPAND).unbind(c.COLLAPSE).unbind(c.ASYNC_SUCCESS).unbind(c.ASYNC_ERROR)
    }, _eventProxy = function (event) {
        var target = event.target, setting = data.getSetting(event.data.treeId), tId = "", node = null,
            nodeEventType = "", treeEventType = "", nodeEventCallback = null, treeEventCallback = null, tmp = null;
        if (tools.eqs(event.type, "mousedown")) {
            treeEventType = "mousedown"
        } else {
            if (tools.eqs(event.type, "mouseup")) {
                treeEventType = "mouseup"
            } else {
                if (tools.eqs(event.type, "contextmenu")) {
                    treeEventType = "contextmenu"
                } else {
                    if (tools.eqs(event.type, "click")) {
                        if (tools.eqs(target.tagName, "span") && target.getAttribute("treeNode" + consts.id.SWITCH) !== null) {
                            tId = ($(target).parent("li").get(0) || $(target).parentsUntil("li").parent().get(0)).id;
                            nodeEventType = "switchNode"
                        } else {
                            tmp = tools.getMDom(setting, target, [{tagName: "a", attrName: "treeNode" + consts.id.A}]);
                            if (tmp) {
                                tId = ($(tmp).parent("li").get(0) || $(tmp).parentsUntil("li").parent().get(0)).id;
                                nodeEventType = "clickNode"
                            }
                        }
                    } else {
                        if (tools.eqs(event.type, "dblclick")) {
                            treeEventType = "dblclick";
                            tmp = tools.getMDom(setting, target, [{tagName: "a", attrName: "treeNode" + consts.id.A}]);
                            if (tmp) {
                                tId = ($(tmp).parent("li").get(0) || $(tmp).parentsUntil("li").parent().get(0)).id;
                                nodeEventType = "switchNode"
                            }
                        }
                    }
                }
            }
        }
        if (treeEventType.length > 0 && tId.length == 0) {
            tmp = tools.getMDom(setting, target, [{tagName: "a", attrName: "treeNode" + consts.id.A}]);
            if (tmp) {
                tId = ($(tmp).parent("li").get(0) || $(tmp).parentsUntil("li").parent().get(0)).id
            }
        }
        if (tId.length > 0) {
            node = data.getNodeCache(setting, tId);
            switch (nodeEventType) {
                case "switchNode":
                    if (!node.isParent) {
                        nodeEventType = ""
                    } else {
                        if (tools.eqs(event.type, "click") || (tools.eqs(event.type, "dblclick") && tools.apply(setting.view.dblClickExpand, [setting.treeId, node], setting.view.dblClickExpand))) {
                            nodeEventCallback = handler.onSwitchNode
                        } else {
                            nodeEventType = ""
                        }
                    }
                    break;
                case "clickNode":
                    nodeEventCallback = handler.onClickNode;
                    break
            }
        }
        switch (treeEventType) {
            case "mousedown":
                treeEventCallback = handler.onZTreeMousedown;
                break;
            case "mouseup":
                treeEventCallback = handler.onZTreeMouseup;
                break;
            case "dblclick":
                treeEventCallback = handler.onZTreeDblclick;
                break;
            case "contextmenu":
                treeEventCallback = handler.onZTreeContextmenu;
                break
        }
        var proxyResult = {
            stop: false,
            node: node,
            nodeEventType: nodeEventType,
            nodeEventCallback: nodeEventCallback,
            treeEventType: treeEventType,
            treeEventCallback: treeEventCallback
        };
        return proxyResult
    }, _initNode = function (setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
        if (!n) {
            return
        }
        var r = data.getRoot(setting), childKey = setting.data.key.children;
        n.level = level;
        n.tId = setting.treeId + "_" + (++r.zId);
        n.parentTId = parentNode ? parentNode.tId : null;
        if (n[childKey] && n[childKey].length > 0) {
            if (typeof n.open == "string") {
                n.open = tools.eqs(n.open, "true")
            }
            n.open = !!n.open;
            n.isParent = true;
            n.zAsync = true
        } else {
            n.open = false;
            if (typeof n.isParent == "string") {
                n.isParent = tools.eqs(n.isParent, "true")
            }
            n.isParent = !!n.isParent;
            n.zAsync = !n.isParent
        }
        n.isFirstNode = isFirstNode;
        n.isLastNode = isLastNode;
        n.getParentNode = function () {
            return data.getNodeCache(setting, n.parentTId)
        };
        n.getPreNode = function () {
            return data.getPreNode(setting, n)
        };
        n.getNextNode = function () {
            return data.getNextNode(setting, n)
        };
        n.isAjaxing = false;
        data.fixPIdKeyValue(setting, n)
    }, _init = {
        bind: [_bindEvent],
        unbind: [_unbindEvent],
        caches: [_initCache],
        nodes: [_initNode],
        proxys: [_eventProxy],
        roots: [_initRoot],
        beforeA: [],
        afterA: [],
        innerBeforeA: [],
        innerAfterA: [],
        zTreeTools: []
    }, data = {
        addNodeCache: function (setting, node) {
            data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node
        }, getNodeCacheId: function (tId) {
            return tId.substring(tId.lastIndexOf("_") + 1)
        }, addAfterA: function (afterA) {
            _init.afterA.push(afterA)
        }, addBeforeA: function (beforeA) {
            _init.beforeA.push(beforeA)
        }, addInnerAfterA: function (innerAfterA) {
            _init.innerAfterA.push(innerAfterA)
        }, addInnerBeforeA: function (innerBeforeA) {
            _init.innerBeforeA.push(innerBeforeA)
        }, addInitBind: function (bindEvent) {
            _init.bind.push(bindEvent)
        }, addInitUnBind: function (unbindEvent) {
            _init.unbind.push(unbindEvent)
        }, addInitCache: function (initCache) {
            _init.caches.push(initCache)
        }, addInitNode: function (initNode) {
            _init.nodes.push(initNode)
        }, addInitProxy: function (initProxy) {
            _init.proxys.push(initProxy)
        }, addInitRoot: function (initRoot) {
            _init.roots.push(initRoot)
        }, addNodesData: function (setting, parentNode, nodes) {
            var childKey = setting.data.key.children;
            if (!parentNode[childKey]) {
                parentNode[childKey] = []
            }
            if (parentNode[childKey].length > 0) {
                parentNode[childKey][parentNode[childKey].length - 1].isLastNode = false;
                view.setNodeLineIcos(setting, parentNode[childKey][parentNode[childKey].length - 1])
            }
            parentNode.isParent = true;
            parentNode[childKey] = parentNode[childKey].concat(nodes)
        }, addSelectedNode: function (setting, node) {
            var root = data.getRoot(setting);
            if (!data.isSelectedNode(setting, node)) {
                root.curSelectedList.push(node)
            }
        }, addCreatedNode: function (setting, node) {
            if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
                var root = data.getRoot(setting);
                root.createdNodes.push(node)
            }
        }, addZTreeTools: function (zTreeTools) {
            _init.zTreeTools.push(zTreeTools)
        }, exSetting: function (s) {
            $.extend(true, _setting, s)
        }, fixPIdKeyValue: function (setting, node) {
            if (setting.data.simpleData.enable) {
                node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId
            }
        }, getAfterA: function (setting, node, array) {
            for (var i = 0, j = _init.afterA.length; i < j; i++) {
                _init.afterA[i].apply(this, arguments)
            }
        }, getBeforeA: function (setting, node, array) {
            for (var i = 0, j = _init.beforeA.length; i < j; i++) {
                _init.beforeA[i].apply(this, arguments)
            }
        }, getInnerAfterA: function (setting, node, array) {
            for (var i = 0, j = _init.innerAfterA.length; i < j; i++) {
                _init.innerAfterA[i].apply(this, arguments)
            }
        }, getInnerBeforeA: function (setting, node, array) {
            for (var i = 0, j = _init.innerBeforeA.length; i < j; i++) {
                _init.innerBeforeA[i].apply(this, arguments)
            }
        }, getCache: function (setting) {
            return caches[setting.treeId]
        }, getNextNode: function (setting, node) {
            if (!node) {
                return null
            }
            var childKey = setting.data.key.children, p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
            for (var i = 0, l = p[childKey].length - 1; i <= l; i++) {
                if (p[childKey][i] === node) {
                    return (i == l ? null : p[childKey][i + 1])
                }
            }
            return null
        }, getNodeByParam: function (setting, nodes, key, value) {
            if (!nodes || !key) {
                return null
            }
            var childKey = setting.data.key.children;
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i][key] == value) {
                    return nodes[i]
                }
                var tmp = data.getNodeByParam(setting, nodes[i][childKey], key, value);
                if (tmp) {
                    return tmp
                }
            }
            return null
        }, getNodeCache: function (setting, tId) {
            if (!tId) {
                return null
            }
            var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
            return n ? n : null
        }, getNodeName: function (setting, node) {
            var nameKey = setting.data.key.name;
            return "" + node[nameKey]
        }, getNodeTitle: function (setting, node) {
            var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
            return "" + node[t]
        }, getNodes: function (setting) {
            return data.getRoot(setting)[setting.data.key.children]
        }, getNodesByParam: function (setting, nodes, key, value) {
            if (!nodes || !key) {
                return []
            }
            var childKey = setting.data.key.children, result = [];
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i][key] == value) {
                    result.push(nodes[i])
                }
                result = result.concat(data.getNodesByParam(setting, nodes[i][childKey], key, value))
            }
            return result
        }, getNodesByParamFuzzy: function (setting, nodes, key, value) {
            if (!nodes || !key) {
                return []
            }
            var childKey = setting.data.key.children, result = [];
            value = value.toLowerCase();
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (typeof nodes[i][key] == "string" && nodes[i][key].toLowerCase().indexOf(value) > -1) {
                    result.push(nodes[i])
                }
                result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childKey], key, value))
            }
            return result
        }, getNodesByFilter: function (setting, nodes, filter, isSingle, invokeParam) {
            if (!nodes) {
                return (isSingle ? null : [])
            }
            var childKey = setting.data.key.children, result = isSingle ? null : [];
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (tools.apply(filter, [nodes[i], invokeParam], false)) {
                    if (isSingle) {
                        return nodes[i]
                    }
                    result.push(nodes[i])
                }
                var tmpResult = data.getNodesByFilter(setting, nodes[i][childKey], filter, isSingle, invokeParam);
                if (isSingle && !!tmpResult) {
                    return tmpResult
                }
                result = isSingle ? tmpResult : result.concat(tmpResult)
            }
            return result
        }, getPreNode: function (setting, node) {
            if (!node) {
                return null
            }
            var childKey = setting.data.key.children, p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
            for (var i = 0, l = p[childKey].length; i < l; i++) {
                if (p[childKey][i] === node) {
                    return (i == 0 ? null : p[childKey][i - 1])
                }
            }
            return null
        }, getRoot: function (setting) {
            return setting ? roots[setting.treeId] : null
        }, getSetting: function (treeId) {
            return settings[treeId]
        }, getSettings: function () {
            return settings
        }, getZTreeTools: function (treeId) {
            var r = this.getRoot(this.getSetting(treeId));
            return r ? r.treeTools : null
        }, initCache: function (setting) {
            for (var i = 0, j = _init.caches.length; i < j; i++) {
                _init.caches[i].apply(this, arguments)
            }
        }, initNode: function (setting, level, node, parentNode, preNode, nextNode) {
            for (var i = 0, j = _init.nodes.length; i < j; i++) {
                _init.nodes[i].apply(this, arguments)
            }
        }, initRoot: function (setting) {
            for (var i = 0, j = _init.roots.length; i < j; i++) {
                _init.roots[i].apply(this, arguments)
            }
        }, isSelectedNode: function (setting, node) {
            var root = data.getRoot(setting);
            for (var i = 0, j = root.curSelectedList.length; i < j; i++) {
                if (node === root.curSelectedList[i]) {
                    return true
                }
            }
            return false
        }, removeNodeCache: function (setting, node) {
            var childKey = setting.data.key.children;
            if (node[childKey]) {
                for (var i = 0, l = node[childKey].length; i < l; i++) {
                    arguments.callee(setting, node[childKey][i])
                }
            }
            data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null
        }, removeSelectedNode: function (setting, node) {
            var root = data.getRoot(setting);
            for (var i = 0, j = root.curSelectedList.length; i < j; i++) {
                if (node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
                    root.curSelectedList.splice(i, 1);
                    i--;
                    j--
                }
            }
        }, setCache: function (setting, cache) {
            caches[setting.treeId] = cache
        }, setRoot: function (setting, root) {
            roots[setting.treeId] = root
        }, setZTreeTools: function (setting, zTreeTools) {
            for (var i = 0, j = _init.zTreeTools.length; i < j; i++) {
                _init.zTreeTools[i].apply(this, arguments)
            }
        }, transformToArrayFormat: function (setting, nodes) {
            if (!nodes) {
                return []
            }
            var childKey = setting.data.key.children, r = [];
            if (tools.isArray(nodes)) {
                for (var i = 0, l = nodes.length; i < l; i++) {
                    r.push(nodes[i]);
                    if (nodes[i][childKey]) {
                        r = r.concat(data.transformToArrayFormat(setting, nodes[i][childKey]))
                    }
                }
            } else {
                r.push(nodes);
                if (nodes[childKey]) {
                    r = r.concat(data.transformToArrayFormat(setting, nodes[childKey]))
                }
            }
            return r
        }, transformTozTreeFormat: function (setting, sNodes) {
            var i, l, key = setting.data.simpleData.idKey, parentKey = setting.data.simpleData.pIdKey,
                childKey = setting.data.key.children;
            if (!key || key == "" || !sNodes) {
                return []
            }
            if (tools.isArray(sNodes)) {
                var r = [];
                var tmpMap = [];
                for (i = 0, l = sNodes.length; i < l; i++) {
                    tmpMap[sNodes[i][key]] = sNodes[i]
                }
                for (i = 0, l = sNodes.length; i < l; i++) {
                    if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
                        if (!tmpMap[sNodes[i][parentKey]][childKey]) {
                            tmpMap[sNodes[i][parentKey]][childKey] = []
                        }
                        tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i])
                    } else {
                        r.push(sNodes[i])
                    }
                }
                return r
            } else {
                return [sNodes]
            }
        }
    }, event = {
        bindEvent: function (setting) {
            for (var i = 0, j = _init.bind.length; i < j; i++) {
                _init.bind[i].apply(this, arguments)
            }
        }, unbindEvent: function (setting) {
            for (var i = 0, j = _init.unbind.length; i < j; i++) {
                _init.unbind[i].apply(this, arguments)
            }
        }, bindTree: function (setting) {
            var eventParam = {treeId: setting.treeId}, o = setting.treeObj;
            o.bind("selectstart", function (e) {
                var n = e.originalEvent.srcElement.nodeName.toLowerCase();
                return (n === "input" || n === "textarea")
            }).css({"-moz-user-select": "-moz-none"});
            o.bind("click", eventParam, event.proxy);
            o.bind("dblclick", eventParam, event.proxy);
            o.bind("mouseover", eventParam, event.proxy);
            o.bind("mouseout", eventParam, event.proxy);
            o.bind("mousedown", eventParam, event.proxy);
            o.bind("mouseup", eventParam, event.proxy);
            o.bind("contextmenu", eventParam, event.proxy)
        }, unbindTree: function (setting) {
            var o = setting.treeObj;
            o.unbind("click", event.proxy).unbind("dblclick", event.proxy).unbind("mouseover", event.proxy).unbind("mouseout", event.proxy).unbind("mousedown", event.proxy).unbind("mouseup", event.proxy).unbind("contextmenu", event.proxy)
        }, doProxy: function (e) {
            var results = [];
            for (var i = 0, j = _init.proxys.length; i < j; i++) {
                var proxyResult = _init.proxys[i].apply(this, arguments);
                results.push(proxyResult);
                if (proxyResult.stop) {
                    break
                }
            }
            return results
        }, proxy: function (e) {
            var setting = data.getSetting(e.data.treeId);
            if (!tools.uCanDo(setting, e)) {
                return true
            }
            var results = event.doProxy(e), r = true, x = false;
            for (var i = 0, l = results.length; i < l; i++) {
                var proxyResult = results[i];
                if (proxyResult.nodeEventCallback) {
                    x = true;
                    r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r
                }
                if (proxyResult.treeEventCallback) {
                    x = true;
                    r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r
                }
            }
            return r
        }
    }, handler = {
        onSwitchNode: function (event, node) {
            var setting = data.getSetting(event.data.treeId);
            if (node.open) {
                if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) {
                    return true
                }
                data.getRoot(setting).expandTriggerFlag = true;
                view.switchNode(setting, node)
            } else {
                if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) {
                    return true
                }
                data.getRoot(setting).expandTriggerFlag = true;
                view.switchNode(setting, node)
            }
            return true
        }, onClickNode: function (event, node) {
            var setting = data.getSetting(event.data.treeId),
                clickFlag = ((setting.view.autoCancelSelected && event.ctrlKey) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && event.ctrlKey && setting.view.selectedMulti) ? 2 : 1;
            if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) == false) {
                return true
            }
            if (clickFlag === 0) {
                view.cancelPreSelectedNode(setting, node)
            } else {
                view.selectNode(setting, node, clickFlag === 2)
            }
            setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
            return true
        }, onZTreeMousedown: function (event, node) {
            var setting = data.getSetting(event.data.treeId);
            if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
                tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node])
            }
            return true
        }, onZTreeMouseup: function (event, node) {
            var setting = data.getSetting(event.data.treeId);
            if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
                tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node])
            }
            return true
        }, onZTreeDblclick: function (event, node) {
            var setting = data.getSetting(event.data.treeId);
            if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
                tools.apply(setting.callback.onDblClick, [event, setting.treeId, node])
            }
            return true
        }, onZTreeContextmenu: function (event, node) {
            var setting = data.getSetting(event.data.treeId);
            if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
                tools.apply(setting.callback.onRightClick, [event, setting.treeId, node])
            }
            return (typeof setting.callback.onRightClick) != "function"
        }
    }, tools = {
        apply: function (fun, param, defaultValue) {
            if ((typeof fun) == "function") {
                return fun.apply(zt, param ? param : [])
            }
            return defaultValue
        }, canAsync: function (setting, node) {
            var childKey = setting.data.key.children;
            return (setting.async.enable && node && node.isParent && !(node.zAsync || (node[childKey] && node[childKey].length > 0)))
        }, clone: function (obj) {
            if (obj === null) {
                return null
            }
            var o = obj.constructor === Array ? [] : {};
            for (var i in obj) {
                o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i])
            }
            return o
        }, eqs: function (str1, str2) {
            return str1.toLowerCase() === str2.toLowerCase()
        }, isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === "[object Array]"
        }, getMDom: function (setting, curDom, targetExpr) {
            if (!curDom) {
                return null
            }
            while (curDom && curDom.id !== setting.treeId) {
                for (var i = 0, l = targetExpr.length; curDom.tagName && i < l; i++) {
                    if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
                        return curDom
                    }
                }
                curDom = curDom.parentNode
            }
            return null
        }, uCanDo: function (setting, e) {
            return true
        }
    }, view = {
        addNodes: function (setting, parentNode, newNodes, isSilent) {
            if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
                return
            }
            if (!tools.isArray(newNodes)) {
                newNodes = [newNodes]
            }
            if (setting.data.simpleData.enable) {
                newNodes = data.transformTozTreeFormat(setting, newNodes)
            }
            if (parentNode) {
                var target_switchObj = $("#" + parentNode.tId + consts.id.SWITCH),
                    target_icoObj = $("#" + parentNode.tId + consts.id.ICON),
                    target_ulObj = $("#" + parentNode.tId + consts.id.UL);
                if (!parentNode.open) {
                    view.replaceSwitchClass(parentNode, target_switchObj, consts.folder.CLOSE);
                    view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
                    parentNode.open = false;
                    target_ulObj.css({display: "none"})
                }
                data.addNodesData(setting, parentNode, newNodes);
                view.createNodes(setting, parentNode.level + 1, newNodes, parentNode);
                if (!isSilent) {
                    view.expandCollapseParentNode(setting, parentNode, true)
                }
            } else {
                data.addNodesData(setting, data.getRoot(setting), newNodes);
                view.createNodes(setting, 0, newNodes, null)
            }
        }, appendNodes: function (setting, level, nodes, parentNode, initFlag, openFlag) {
            if (!nodes) {
                return []
            }
            var html = [], childKey = setting.data.key.children;
            for (var i = 0, l = nodes.length; i < l; i++) {
                var node = nodes[i];
                if (initFlag) {
                    var tmpPNode = (parentNode) ? parentNode : data.getRoot(setting), tmpPChild = tmpPNode[childKey],
                        isFirstNode = ((tmpPChild.length == nodes.length) && (i == 0)),
                        isLastNode = (i == (nodes.length - 1));
                    data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
                    data.addNodeCache(setting, node)
                }
                var childHtml = [];
                if (node[childKey] && node[childKey].length > 0) {
                    childHtml = view.appendNodes(setting, level + 1, node[childKey], node, initFlag, openFlag && node.open)
                }
                if (openFlag) {
                    view.makeDOMNodeMainBefore(html, setting, node);
                    view.makeDOMNodeLine(html, setting, node);
                    data.getBeforeA(setting, node, html);
                    view.makeDOMNodeNameBefore(html, setting, node);
                    data.getInnerBeforeA(setting, node, html);
                    view.makeDOMNodeIcon(html, setting, node);
                    data.getInnerAfterA(setting, node, html);
                    view.makeDOMNodeNameAfter(html, setting, node);
                    data.getAfterA(setting, node, html);
                    if (node.isParent && node.open) {
                        view.makeUlHtml(setting, node, html, childHtml.join(""))
                    }
                    view.makeDOMNodeMainAfter(html, setting, node);
                    data.addCreatedNode(setting, node)
                }
            }
            return html
        }, appendParentULDom: function (setting, node) {
            var html = [], nObj = $("#" + node.tId), ulObj = $("#" + node.tId + consts.id.UL),
                childKey = setting.data.key.children,
                childHtml = view.appendNodes(setting, node.level + 1, node[childKey], node, false, true);
            view.makeUlHtml(setting, node, html, childHtml.join(""));
            if (!nObj.get(0) && !!node.parentTId) {
                view.appendParentULDom(setting, node.getParentNode());
                nObj = $("#" + node.tId)
            }
            if (ulObj.get(0)) {
                ulObj.remove()
            }
            nObj.append(html.join(""))
        }, asyncNode: function (setting, node, isSilent, callback) {
            var i, l;
            if (node && !node.isParent) {
                tools.apply(callback);
                return false
            } else {
                if (node && node.isAjaxing) {
                    return false
                } else {
                    if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
                        tools.apply(callback);
                        return false
                    }
                }
            }
            if (node) {
                node.isAjaxing = true;
                var icoObj = $("#" + node.tId + consts.id.ICON);
                icoObj.attr({style: "", "class": consts.className.BUTTON + " " + consts.className.ICO_LOADING})
            }
            var tmpParam = {};
            for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
                var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
                if (pKey.length > 1) {
                    spKey = pKey[1];
                    pKey = pKey[0]
                }
                tmpParam[spKey] = node[pKey]
            }
            if (tools.isArray(setting.async.otherParam)) {
                for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
                    tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1]
                }
            } else {
                for (var p in setting.async.otherParam) {
                    tmpParam[p] = setting.async.otherParam[p]
                }
            }
            var _tmpV = data.getRoot(setting)._ver;
            $.ajax({
                contentType: setting.async.contentType,
                type: setting.async.type,
                url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
                data: tmpParam,
                dataType: setting.async.dataType,
                success: function (msg) {
                    if (_tmpV != data.getRoot(setting)._ver) {
                        return
                    }
                    var newNodes = [];
                    try {
                        if (!msg || msg.length == 0) {
                            newNodes = []
                        } else {
                            if (typeof msg == "string") {
                                newNodes = eval("(" + msg + ")")
                            } else {
                                newNodes = msg
                            }
                        }
                    } catch (err) {
                        newNodes = msg
                    }
                    if (node) {
                        node.isAjaxing = null;
                        node.zAsync = true
                    }
                    view.setNodeLineIcos(setting, node);
                    if (newNodes && newNodes !== "") {
                        newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
                        view.addNodes(setting, node, !!newNodes ? tools.clone(newNodes) : [], !!isSilent)
                    } else {
                        view.addNodes(setting, node, [], !!isSilent)
                    }
                    setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
                    tools.apply(callback)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (_tmpV != data.getRoot(setting)._ver) {
                        return
                    }
                    if (node) {
                        node.isAjaxing = null
                    }
                    view.setNodeLineIcos(setting, node);
                    setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown])
                }
            });
            return true
        }, cancelPreSelectedNode: function (setting, node) {
            var list = data.getRoot(setting).curSelectedList;
            for (var i = 0, j = list.length - 1; j >= i; j--) {
                if (!node || node === list[j]) {
                    $("#" + list[j].tId + consts.id.A).removeClass(consts.node.CURSELECTED);
                    if (node) {
                        data.removeSelectedNode(setting, node);
                        break
                    }
                }
            }
            if (!node) {
                data.getRoot(setting).curSelectedList = []
            }
        }, createNodeCallback: function (setting) {
            if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
                var root = data.getRoot(setting);
                while (root.createdNodes.length > 0) {
                    var node = root.createdNodes.shift();
                    tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
                    if (!!setting.callback.onNodeCreated) {
                        setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node])
                    }
                }
            }
        }, createNodes: function (setting, level, nodes, parentNode) {
            if (!nodes || nodes.length == 0) {
                return
            }
            var root = data.getRoot(setting), childKey = setting.data.key.children,
                openFlag = !parentNode || parentNode.open || !!$("#" + parentNode[childKey][0].tId).get(0);
            root.createdNodes = [];
            var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode, true, openFlag);
            if (!parentNode) {
                setting.treeObj.append(zTreeHtml.join(""))
            } else {
                var ulObj = $("#" + parentNode.tId + consts.id.UL);
                if (ulObj.get(0)) {
                    ulObj.append(zTreeHtml.join(""))
                }
            }
            view.createNodeCallback(setting)
        }, destroy: function (setting) {
            if (!setting) {
                return
            }
            data.initCache(setting);
            data.initRoot(setting);
            event.unbindTree(setting);
            event.unbindEvent(setting);
            setting.treeObj.empty()
        }, expandCollapseNode: function (setting, node, expandFlag, animateFlag, callback) {
            var root = data.getRoot(setting), childKey = setting.data.key.children;
            if (!node) {
                tools.apply(callback, []);
                return
            }
            if (root.expandTriggerFlag) {
                var _callback = callback;
                callback = function () {
                    if (_callback) {
                        _callback()
                    }
                    if (node.open) {
                        setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node])
                    } else {
                        setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node])
                    }
                };
                root.expandTriggerFlag = false
            }
            if (!node.open && node.isParent && ((!$("#" + node.tId + consts.id.UL).get(0)) || (node[childKey] && node[childKey].length > 0 && !$("#" + node[childKey][0].tId).get(0)))) {
                view.appendParentULDom(setting, node);
                view.createNodeCallback(setting)
            }
            if (node.open == expandFlag) {
                tools.apply(callback, []);
                return
            }
            var ulObj = $("#" + node.tId + consts.id.UL), switchObj = $("#" + node.tId + consts.id.SWITCH),
                icoObj = $("#" + node.tId + consts.id.ICON);
            if (node.isParent) {
                node.open = !node.open;
                if (node.iconOpen && node.iconClose) {
                    icoObj.attr("style", view.makeNodeIcoStyle(setting, node))
                }
                if (node.open) {
                    view.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
                    view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
                    if (animateFlag == false || setting.view.expandSpeed == "") {
                        ulObj.show();
                        tools.apply(callback, [])
                    } else {
                        if (node[childKey] && node[childKey].length > 0) {
                            ulObj.slideDown(setting.view.expandSpeed, callback)
                        } else {
                            ulObj.show();
                            tools.apply(callback, [])
                        }
                    }
                } else {
                    view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
                    view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
                    if (animateFlag == false || setting.view.expandSpeed == "" || !(node[childKey] && node[childKey].length > 0)) {
                        ulObj.hide();
                        tools.apply(callback, [])
                    } else {
                        ulObj.slideUp(setting.view.expandSpeed, callback)
                    }
                }
            } else {
                tools.apply(callback, [])
            }
        }, expandCollapseParentNode: function (setting, node, expandFlag, animateFlag, callback) {
            if (!node) {
                return
            }
            if (!node.parentTId) {
                view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
                return
            } else {
                view.expandCollapseNode(setting, node, expandFlag, animateFlag)
            }
            if (node.parentTId) {
                view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback)
            }
        }, expandCollapseSonNode: function (setting, node, expandFlag, animateFlag, callback) {
            var root = data.getRoot(setting), childKey = setting.data.key.children,
                treeNodes = (node) ? node[childKey] : root[childKey], selfAnimateSign = (node) ? false : animateFlag,
                expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
            data.getRoot(setting).expandTriggerFlag = false;
            if (treeNodes) {
                for (var i = 0, l = treeNodes.length; i < l; i++) {
                    if (treeNodes[i]) {
                        view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign)
                    }
                }
            }
            data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
            view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback)
        }, makeDOMNodeIcon: function (html, setting, node) {
            var nameStr = data.getNodeName(setting, node),
                name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            html.push("<span id='", node.tId, consts.id.ICON, "' title='' treeNode", consts.id.ICON, " class='", view.makeNodeIcoClass(setting, node), "' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN, "'>", name, "</span>")
        }, makeDOMNodeLine: function (html, setting, node) {
            html.push("<span id='", node.tId, consts.id.SWITCH, "' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH, "></span>")
        }, makeDOMNodeMainAfter: function (html, setting, node) {
            html.push("</li>")
        }, makeDOMNodeMainBefore: function (html, setting, node) {
            html.push("<li id='", node.tId, "' class='", consts.className.LEVEL, node.level, "' tabindex='0' hidefocus='true' treenode>")
        }, makeDOMNodeNameAfter: function (html, setting, node) {
            html.push("</a>")
        }, makeDOMNodeNameBefore: function (html, setting, node) {
            var title = data.getNodeTitle(setting, node), url = view.makeNodeUrl(setting, node),
                fontcss = view.makeNodeFontCss(setting, node), fontStyle = [];
            for (var f in fontcss) {
                fontStyle.push(f, ":", fontcss[f], ";")
            }
            html.push("<a id='", node.tId, consts.id.A, "' class='", consts.className.LEVEL, node.level, "' treeNode", consts.id.A, ' onclick="', (node.click || ""), '" ', ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='", view.makeNodeTarget(node), "' style='", fontStyle.join(""), "'");
            if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {
                html.push("title='", title.replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "'")
            }
            html.push(">")
        }, makeNodeFontCss: function (setting, node) {
            var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
            return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {}
        }, makeNodeIcoClass: function (setting, node) {
            var icoCss = ["ico"];
            if (!node.isAjaxing) {
                icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
                if (node.isParent) {
                    icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE)
                } else {
                    icoCss.push(consts.folder.DOCU)
                }
            }
            return consts.className.BUTTON + " " + icoCss.join("_")
        }, makeNodeIcoStyle: function (setting, node) {
            var icoStyle = [];
            if (!node.isAjaxing) {
                var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node.icon;
                if (icon) {
                    icoStyle.push("background:url(", icon, ") 0 0 no-repeat;")
                }
                if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
                    icoStyle.push("width:0px;height:0px;")
                }
            }
            return icoStyle.join("")
        }, makeNodeLineClass: function (setting, node) {
            var lineClass = [];
            if (setting.view.showLine) {
                if (node.level == 0 && node.isFirstNode && node.isLastNode) {
                    lineClass.push(consts.line.ROOT)
                } else {
                    if (node.level == 0 && node.isFirstNode) {
                        lineClass.push(consts.line.ROOTS)
                    } else {
                        if (node.isLastNode) {
                            lineClass.push(consts.line.BOTTOM)
                        } else {
                            lineClass.push(consts.line.CENTER)
                        }
                    }
                }
            } else {
                lineClass.push(consts.line.NOLINE)
            }
            if (node.isParent) {
                lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE)
            } else {
                lineClass.push(consts.folder.DOCU)
            }
            return view.makeNodeLineClassEx(node) + lineClass.join("_")
        }, makeNodeLineClassEx: function (node) {
            return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " "
        }, makeNodeTarget: function (node) {
            return (node.target || "_blank")
        }, makeNodeUrl: function (setting, node) {
            var urlKey = setting.data.key.url;
            return node[urlKey] ? node[urlKey] : null
        }, makeUlHtml: function (setting, node, html, content) {
            html.push("<ul id='", node.tId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block" : "none"), "'>");
            html.push(content);
            html.push("</ul>")
        }, makeUlLineClass: function (setting, node) {
            return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "")
        }, removeChildNodes: function (setting, node) {
            if (!node) {
                return
            }
            var childKey = setting.data.key.children, nodes = node[childKey];
            if (!nodes) {
                return
            }
            for (var i = 0, l = nodes.length; i < l; i++) {
                data.removeNodeCache(setting, nodes[i])
            }
            data.removeSelectedNode(setting);
            delete node[childKey];
            if (!setting.data.keep.parent) {
                node.isParent = false;
                node.open = false;
                var tmp_switchObj = $("#" + node.tId + consts.id.SWITCH),
                    tmp_icoObj = $("#" + node.tId + consts.id.ICON);
                view.replaceSwitchClass(node, tmp_switchObj, consts.folder.DOCU);
                view.replaceIcoClass(node, tmp_icoObj, consts.folder.DOCU);
                $("#" + node.tId + consts.id.UL).remove()
            } else {
                $("#" + node.tId + consts.id.UL).empty()
            }
        }, setFirstNode: function (setting, parentNode) {
            var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
            if (childLength > 0) {
                parentNode[childKey][0].isFirstNode = true
            }
        }, setLastNode: function (setting, parentNode) {
            var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
            if (childLength > 0) {
                parentNode[childKey][childLength - 1].isLastNode = true
            }
        }, removeNode: function (setting, node) {
            var root = data.getRoot(setting), childKey = setting.data.key.children,
                parentNode = (node.parentTId) ? node.getParentNode() : root;
            node.isFirstNode = false;
            node.isLastNode = false;
            node.getPreNode = function () {
                return null
            };
            node.getNextNode = function () {
                return null
            };
            if (!data.getNodeCache(setting, node.tId)) {
                return
            }
            $("#" + node.tId).remove();
            data.removeNodeCache(setting, node);
            data.removeSelectedNode(setting, node);
            for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
                if (parentNode[childKey][i].tId == node.tId) {
                    parentNode[childKey].splice(i, 1);
                    break
                }
            }
            view.setFirstNode(setting, parentNode);
            view.setLastNode(setting, parentNode);
            var tmp_ulObj, tmp_switchObj, tmp_icoObj, childLength = parentNode[childKey].length;
            if (!setting.data.keep.parent && childLength == 0) {
                parentNode.isParent = false;
                parentNode.open = false;
                tmp_ulObj = $("#" + parentNode.tId + consts.id.UL);
                tmp_switchObj = $("#" + parentNode.tId + consts.id.SWITCH);
                tmp_icoObj = $("#" + parentNode.tId + consts.id.ICON);
                view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
                view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
                tmp_ulObj.css("display", "none")
            } else {
                if (setting.view.showLine && childLength > 0) {
                    var newLast = parentNode[childKey][childLength - 1];
                    tmp_ulObj = $("#" + newLast.tId + consts.id.UL);
                    tmp_switchObj = $("#" + newLast.tId + consts.id.SWITCH);
                    tmp_icoObj = $("#" + newLast.tId + consts.id.ICON);
                    if (parentNode == root) {
                        if (parentNode[childKey].length == 1) {
                            view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT)
                        } else {
                            var tmp_first_switchObj = $("#" + parentNode[childKey][0].tId + consts.id.SWITCH);
                            view.replaceSwitchClass(parentNode[childKey][0], tmp_first_switchObj, consts.line.ROOTS);
                            view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM)
                        }
                    } else {
                        view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM)
                    }
                    tmp_ulObj.removeClass(consts.line.LINE)
                }
            }
        }, replaceIcoClass: function (node, obj, newName) {
            if (!obj || node.isAjaxing) {
                return
            }
            var tmpName = obj.attr("class");
            if (tmpName == undefined) {
                return
            }
            var tmpList = tmpName.split("_");
            switch (newName) {
                case consts.folder.OPEN:
                case consts.folder.CLOSE:
                case consts.folder.DOCU:
                    tmpList[tmpList.length - 1] = newName;
                    break
            }
            obj.attr("class", tmpList.join("_"))
        }, replaceSwitchClass: function (node, obj, newName) {
            if (!obj) {
                return
            }
            var tmpName = obj.attr("class");
            if (tmpName == undefined) {
                return
            }
            var tmpList = tmpName.split("_");
            switch (newName) {
                case consts.line.ROOT:
                case consts.line.ROOTS:
                case consts.line.CENTER:
                case consts.line.BOTTOM:
                case consts.line.NOLINE:
                    tmpList[0] = view.makeNodeLineClassEx(node) + newName;
                    break;
                case consts.folder.OPEN:
                case consts.folder.CLOSE:
                case consts.folder.DOCU:
                    tmpList[1] = newName;
                    break
            }
            obj.attr("class", tmpList.join("_"));
            if (newName !== consts.folder.DOCU) {
                obj.removeAttr("disabled")
            } else {
                obj.attr("disabled", "disabled")
            }
        }, selectNode: function (setting, node, addFlag) {
            if (!addFlag) {
                view.cancelPreSelectedNode(setting)
            }
            $("#" + node.tId + consts.id.A).addClass(consts.node.CURSELECTED);
            data.addSelectedNode(setting, node)
        }, setNodeFontCss: function (setting, treeNode) {
            var aObj = $("#" + treeNode.tId + consts.id.A), fontCss = view.makeNodeFontCss(setting, treeNode);
            if (fontCss) {
                aObj.css(fontCss)
            }
        }, setNodeLineIcos: function (setting, node) {
            if (!node) {
                return
            }
            var switchObj = $("#" + node.tId + consts.id.SWITCH), ulObj = $("#" + node.tId + consts.id.UL),
                icoObj = $("#" + node.tId + consts.id.ICON), ulLine = view.makeUlLineClass(setting, node);
            if (ulLine.length == 0) {
                ulObj.removeClass(consts.line.LINE)
            } else {
                ulObj.addClass(ulLine)
            }
            switchObj.attr("class", view.makeNodeLineClass(setting, node));
            if (node.isParent) {
                switchObj.removeAttr("disabled")
            } else {
                switchObj.attr("disabled", "disabled")
            }
            icoObj.removeAttr("style");
            icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
            icoObj.attr("class", view.makeNodeIcoClass(setting, node))
        }, setNodeName: function (setting, node) {
            var title = data.getNodeTitle(setting, node), nObj = $("#" + node.tId + consts.id.SPAN);
            nObj.empty();
            if (setting.view.nameIsHTML) {
                nObj.html(data.getNodeName(setting, node))
            } else {
                nObj.text(data.getNodeName(setting, node))
            }
            if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
                var aObj = $("#" + node.tId + consts.id.A);
                aObj.attr("title", !title ? "" : title)
            }
        }, setNodeTarget: function (node) {
            var aObj = $("#" + node.tId + consts.id.A);
            aObj.attr("target", view.makeNodeTarget(node))
        }, setNodeUrl: function (setting, node) {
            var aObj = $("#" + node.tId + consts.id.A), url = view.makeNodeUrl(setting, node);
            if (url == null || url.length == 0) {
                aObj.removeAttr("href")
            } else {
                aObj.attr("href", url)
            }
        }, switchNode: function (setting, node) {
            if (node.open || !tools.canAsync(setting, node)) {
                view.expandCollapseNode(setting, node, !node.open)
            } else {
                if (setting.async.enable) {
                    if (!view.asyncNode(setting, node)) {
                        view.expandCollapseNode(setting, node, !node.open);
                    }
                } else {
                    if (node) {
                        view.expandCollapseNode(setting, node, !node.open)
                    }
                }
            }
        }
    };
    $.fn.zTree = {
        consts: _consts, _z: {tools: tools, view: view, event: event, data: data}, getZTreeObj: function (treeId) {
            var o = data.getZTreeTools(treeId);
            return o ? o : null
        }, destroy: function (treeId) {
            if (!!treeId && treeId.length > 0) {
                view.destroy(data.getSetting(treeId))
            } else {
                for (var s in settings) {
                    view.destroy(settings[s])
                }
            }
        }, init: function (obj, zSetting, zNodes) {
            var setting = tools.clone(_setting);
            $.extend(true, setting, zSetting);
            setting.treeId = obj.attr("id");
            setting.treeObj = obj;
            setting.treeObj.empty();
            settings[setting.treeId] = setting;
            if (typeof document.body.style.maxHeight === "undefined") {
                setting.view.expandSpeed = ""
            }
            data.initRoot(setting);
            var root = data.getRoot(setting), childKey = setting.data.key.children;
            zNodes = zNodes ? tools.clone(tools.isArray(zNodes) ? zNodes : [zNodes]) : [];
            if (setting.data.simpleData.enable) {
                root[childKey] = data.transformTozTreeFormat(setting, zNodes)
            } else {
                root[childKey] = zNodes
            }
            data.initCache(setting);
            event.unbindTree(setting);
            event.bindTree(setting);
            event.unbindEvent(setting);
            event.bindEvent(setting);
            var zTreeTools = {
                setting: setting, addNodes: function (parentNode, newNodes, isSilent) {
                    if (!newNodes) {
                        return null
                    }
                    if (!parentNode) {
                        parentNode = null
                    }
                    if (parentNode && !parentNode.isParent && setting.data.keep.leaf) {
                        return null
                    }
                    var xNewNodes = tools.clone(tools.isArray(newNodes) ? newNodes : [newNodes]);

                    function addCallback() {
                        view.addNodes(setting, parentNode, xNewNodes, (isSilent == true))
                    }

                    if (tools.canAsync(setting, parentNode)) {
                        view.asyncNode(setting, parentNode, isSilent, addCallback)
                    } else {
                        addCallback()
                    }
                    return xNewNodes
                }, cancelSelectedNode: function (node) {
                    view.cancelPreSelectedNode(this.setting, node)
                }, destroy: function () {
                    view.destroy(this.setting)
                }, expandAll: function (expandFlag) {
                    expandFlag = !!expandFlag;
                    view.expandCollapseSonNode(this.setting, null, expandFlag, true);
                    return expandFlag
                }, expandNode: function (node, expandFlag, sonSign, focus, callbackFlag) {
                    if (!node || !node.isParent) {
                        return null
                    }
                    if (expandFlag !== true && expandFlag !== false) {
                        expandFlag = !node.open
                    }
                    callbackFlag = !!callbackFlag;
                    if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
                        return null
                    } else {
                        if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
                            return null
                        }
                    }
                    if (expandFlag && node.parentTId) {
                        view.expandCollapseParentNode(this.setting, node.getParentNode(), expandFlag, false)
                    }
                    if (expandFlag === node.open && !sonSign) {
                        return null
                    }
                    data.getRoot(setting).expandTriggerFlag = callbackFlag;
                    if (sonSign) {
                        view.expandCollapseSonNode(this.setting, node, expandFlag, true, function () {
                            if (focus !== false) {
                                try {
                                    $("#" + node.tId).focus().blur()
                                } catch (e) {
                                }
                            }
                        })
                    } else {
                        node.open = !expandFlag;
                        view.switchNode(this.setting, node);
                        if (focus !== false) {
                            try {
                                $("#" + node.tId).focus().blur()
                            } catch (e) {
                            }
                        }
                    }
                    return expandFlag
                }, getNodes: function () {
                    return data.getNodes(this.setting)
                }, getNodeByParam: function (key, value, parentNode) {
                    if (!key) {
                        return null
                    }
                    return data.getNodeByParam(this.setting, parentNode ? parentNode[this.setting.data.key.children] : data.getNodes(this.setting), key, value)
                }, getNodeByTId: function (tId) {
                    return data.getNodeCache(this.setting, tId)
                }, getNodesByParam: function (key, value, parentNode) {
                    if (!key) {
                        return null
                    }
                    return data.getNodesByParam(this.setting, parentNode ? parentNode[this.setting.data.key.children] : data.getNodes(this.setting), key, value)
                }, getNodesByParamFuzzy: function (key, value, parentNode) {
                    if (!key) {
                        return null
                    }
                    return data.getNodesByParamFuzzy(this.setting, parentNode ? parentNode[this.setting.data.key.children] : data.getNodes(this.setting), key, value)
                }, getNodesByFilter: function (filter, isSingle, parentNode, invokeParam) {
                    isSingle = !!isSingle;
                    if (!filter || (typeof filter != "function")) {
                        return (isSingle ? null : [])
                    }
                    return data.getNodesByFilter(this.setting, parentNode ? parentNode[this.setting.data.key.children] : data.getNodes(this.setting), filter, isSingle, invokeParam)
                }, getNodeIndex: function (node) {
                    if (!node) {
                        return null
                    }
                    var childKey = setting.data.key.children,
                        parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(this.setting);
                    for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
                        if (parentNode[childKey][i] == node) {
                            return i
                        }
                    }
                    return -1
                }, getSelectedNodes: function () {
                    var r = [], list = data.getRoot(this.setting).curSelectedList;
                    for (var i = 0, l = list.length; i < l; i++) {
                        r.push(list[i])
                    }
                    return r
                }, isSelectedNode: function (node) {
                    return data.isSelectedNode(this.setting, node)
                }, reAsyncChildNodes: function (parentNode, reloadType, isSilent) {
                    if (!this.setting.async.enable) {
                        return
                    }
                    var isRoot = !parentNode;
                    if (isRoot) {
                        parentNode = data.getRoot(this.setting)
                    }
                    if (reloadType == "refresh") {
                        var childKey = this.setting.data.key.children;
                        for (var i = 0, l = parentNode[childKey] ? parentNode[childKey].length : 0; i < l; i++) {
                            data.removeNodeCache(setting, parentNode[childKey][i])
                        }
                        data.removeSelectedNode(setting);
                        parentNode[childKey] = [];
                        if (isRoot) {
                            this.setting.treeObj.empty()
                        } else {
                            var ulObj = $("#" + parentNode.tId + consts.id.UL);
                            ulObj.empty()
                        }
                    }
                    view.asyncNode(this.setting, isRoot ? null : parentNode, !!isSilent)
                }, refresh: function () {
                    this.setting.treeObj.empty();
                    var root = data.getRoot(this.setting), nodes = root[this.setting.data.key.children];
                    data.initRoot(this.setting);
                    root[this.setting.data.key.children] = nodes;
                    data.initCache(this.setting);
                    view.createNodes(this.setting, 0, root[this.setting.data.key.children])
                }, removeChildNodes: function (node) {
                    if (!node) {
                        return null
                    }
                    var childKey = setting.data.key.children, nodes = node[childKey];
                    view.removeChildNodes(setting, node);
                    return nodes ? nodes : null
                }, removeNode: function (node, callbackFlag) {
                    if (!node) {
                        return
                    }
                    callbackFlag = !!callbackFlag;
                    if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) {
                        return
                    }
                    view.removeNode(setting, node);
                    if (callbackFlag) {
                        this.setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node])
                    }
                }, selectNode: function (node, addFlag) {
                    if (!node) {
                        return
                    }
                    if (tools.uCanDo(this.setting)) {
                        addFlag = setting.view.selectedMulti && addFlag;
                        if (node.parentTId) {
                            view.expandCollapseParentNode(this.setting, node.getParentNode(), true, false, function () {
                                try {
                                    $("#" + node.tId).focus().blur()
                                } catch (e) {
                                }
                            })
                        } else {
                            try {
                                $("#" + node.tId).focus().blur()
                            } catch (e) {
                            }
                        }
                        view.selectNode(this.setting, node, addFlag)
                    }
                }, transformTozTreeNodes: function (simpleNodes) {
                    return data.transformTozTreeFormat(this.setting, simpleNodes)
                }, transformToArray: function (nodes) {
                    return data.transformToArrayFormat(this.setting, nodes)
                }, updateNode: function (node, checkTypeFlag) {
                    if (!node) {
                        return
                    }
                    var nObj = $("#" + node.tId);
                    if (nObj.get(0) && tools.uCanDo(this.setting)) {
                        view.setNodeName(this.setting, node);
                        view.setNodeTarget(node);
                        view.setNodeUrl(this.setting, node);
                        view.setNodeLineIcos(this.setting, node);
                        view.setNodeFontCss(this.setting, node)
                    }
                }
            };
            root.treeTools = zTreeTools;
            data.setZTreeTools(setting, zTreeTools);
            if (root[childKey] && root[childKey].length > 0) {
                view.createNodes(setting, 0, root[childKey])
            } else {
                if (setting.async.enable && setting.async.url && setting.async.url !== "") {
                    view.asyncNode(setting)
                }
            }
            return zTreeTools
        }
    };
    var zt = $.fn.zTree, consts = zt.consts
})(jQuery);
(function (f) {
    var z = {
        event: {CHECK: "ztree_check"},
        id: {CHECK: "_check"},
        checkbox: {
            STYLE: "checkbox",
            DEFAULT: "chk",
            DISABLED: "disable",
            FALSE: "false",
            TRUE: "true",
            FULL: "full",
            PART: "part",
            FOCUS: "focus"
        },
        radio: {STYLE: "radio", TYPE_ALL: "all", TYPE_LEVEL: "level"}
    }, m = {
        check: {
            enable: false,
            autoCheckTrigger: false,
            chkStyle: z.checkbox.STYLE,
            nocheckInherit: false,
            chkDisabledInherit: false,
            radioType: z.radio.TYPE_LEVEL,
            chkboxType: {Y: "ps", N: "ps"}
        }, data: {key: {checked: "checked"}}, callback: {beforeCheck: null, onCheck: null}
    }, v = function (A) {
        var B = y.getRoot(A);
        B.radioCheckedList = []
    }, d = function (A) {
    }, n = function (A) {
        var B = A.treeObj, C = q.event;
        B.bind(C.CHECK, function (F, E, G, D) {
            t.apply(A.callback.onCheck, [!!E ? E : F, G, D])
        })
    }, x = function (A) {
        var B = A.treeObj, C = q.event;
        B.unbind(C.CHECK)
    }, o = function (G) {
        var H = G.target, J = y.getSetting(G.data.treeId), E = "", B = null, C = "", F = "", A = null, D = null;
        if (t.eqs(G.type, "mouseover")) {
            if (J.check.enable && t.eqs(H.tagName, "span") && H.getAttribute("treeNode" + q.id.CHECK) !== null) {
                E = H.parentNode.id;
                C = "mouseoverCheck"
            }
        } else {
            if (t.eqs(G.type, "mouseout")) {
                if (J.check.enable && t.eqs(H.tagName, "span") && H.getAttribute("treeNode" + q.id.CHECK) !== null) {
                    E = H.parentNode.id;
                    C = "mouseoutCheck"
                }
            } else {
                if (t.eqs(G.type, "click")) {
                    if (J.check.enable && t.eqs(H.tagName, "span") && H.getAttribute("treeNode" + q.id.CHECK) !== null) {
                        E = H.parentNode.id;
                        C = "checkNode"
                    }
                }
            }
        }
        if (E.length > 0) {
            B = y.getNodeCache(J, E);
            switch (C) {
                case "checkNode":
                    A = l.onCheckNode;
                    break;
                case "mouseoverCheck":
                    A = l.onMouseoverCheck;
                    break;
                case "mouseoutCheck":
                    A = l.onMouseoutCheck;
                    break
            }
        }
        var I = {stop: false, node: B, nodeEventType: C, nodeEventCallback: A, treeEventType: F, treeEventCallback: D};
        return I
    }, u = function (D, H, G, A, F, C, E) {
        if (!G) {
            return
        }
        var B = D.data.key.checked;
        if (typeof G[B] == "string") {
            G[B] = t.eqs(G[B], "true")
        }
        G[B] = !!G[B];
        G.checkedOld = G[B];
        if (typeof G.nocheck == "string") {
            G.nocheck = t.eqs(G.nocheck, "true")
        }
        G.nocheck = !!G.nocheck || (D.check.nocheckInherit && A && !!A.nocheck);
        if (typeof G.chkDisabled == "string") {
            G.chkDisabled = t.eqs(G.chkDisabled, "true")
        }
        G.chkDisabled = !!G.chkDisabled || (D.check.chkDisabledInherit && A && !!A.chkDisabled);
        if (typeof G.halfCheck == "string") {
            G.halfCheck = t.eqs(G.halfCheck, "true")
        }
        G.halfCheck = !!G.halfCheck;
        G.check_Child_State = -1;
        G.check_Focus = false;
        G.getCheckStatus = function () {
            return y.getCheckStatus(D, G)
        }
    }, a = function (C, E, B) {
        var A = C.data.key.checked;
        if (C.check.enable) {
            y.makeChkFlag(C, E);
            if (C.check.chkStyle == q.radio.STYLE && C.check.radioType == q.radio.TYPE_ALL && E[A]) {
                var D = y.getRoot(C);
                D.radioCheckedList.push(E)
            }
            B.push("<span ID='", E.tId, q.id.CHECK, "' class='", j.makeChkClass(C, E), "' treeNode", q.id.CHECK, (E.nocheck === true ? " style='display:none;'" : ""), "></span>")
        }
    }, k = function (C, B) {
        B.checkNode = function (H, G, I, F) {
            var D = this.setting.data.key.checked;
            if (H.chkDisabled === true) {
                return
            }
            if (G !== true && G !== false) {
                G = !H[D]
            }
            F = !!F;
            if (H[D] === G && !I) {
                return
            } else {
                if (F && t.apply(this.setting.callback.beforeCheck, [this.setting.treeId, H], true) == false) {
                    return
                }
            }
            if (t.uCanDo(this.setting) && this.setting.check.enable && H.nocheck !== true) {
                H[D] = G;
                var E = f("#" + H.tId + q.id.CHECK);
                if (I || this.setting.check.chkStyle === q.radio.STYLE) {
                    j.checkNodeRelation(this.setting, H)
                }
                j.setChkClass(this.setting, E, H);
                j.repairParentChkClassWithSelf(this.setting, H);
                if (F) {
                    C.treeObj.trigger(q.event.CHECK, [null, C.treeId, H])
                }
            }
        };
        B.checkAllNodes = function (D) {
            j.repairAllChk(this.setting, !!D)
        };
        B.getCheckedNodes = function (E) {
            var D = this.setting.data.key.children;
            E = (E !== false);
            return y.getTreeCheckedNodes(this.setting, y.getRoot(C)[D], E)
        };
        B.getChangeCheckedNodes = function () {
            var D = this.setting.data.key.children;
            return y.getTreeChangeCheckedNodes(this.setting, y.getRoot(C)[D])
        };
        B.setChkDisabled = function (E, D, F, G) {
            D = !!D;
            F = !!F;
            G = !!G;
            j.repairSonChkDisabled(this.setting, E, D, G);
            j.repairParentChkDisabled(this.setting, E.getParentNode(), D, F)
        };
        var A = B.updateNode;
        B.updateNode = function (F, G) {
            if (A) {
                A.apply(B, arguments)
            }
            if (!F || !this.setting.check.enable) {
                return
            }
            var D = f("#" + F.tId);
            if (D.get(0) && t.uCanDo(this.setting)) {
                var E = f("#" + F.tId + q.id.CHECK);
                if (G == true || this.setting.check.chkStyle === q.radio.STYLE) {
                    j.checkNodeRelation(this.setting, F)
                }
                j.setChkClass(this.setting, E, F);
                j.repairParentChkClassWithSelf(this.setting, F)
            }
        }
    }, p = {
        getRadioCheckedList: function (D) {
            var C = y.getRoot(D).radioCheckedList;
            for (var B = 0, A = C.length; B < A; B++) {
                if (!y.getNodeCache(D, C[B].tId)) {
                    C.splice(B, 1);
                    B--;
                    A--
                }
            }
            return C
        }, getCheckStatus: function (B, D) {
            if (!B.check.enable || D.nocheck || D.chkDisabled) {
                return null
            }
            var A = B.data.key.checked, C = {
                checked: D[A],
                half: D.halfCheck ? D.halfCheck : (B.check.chkStyle == q.radio.STYLE ? (D.check_Child_State === 2) : (D[A] ? (D.check_Child_State > -1 && D.check_Child_State < 2) : (D.check_Child_State > 0)))
            };
            return C
        }, getTreeCheckedNodes: function (I, B, H, E) {
            if (!B) {
                return []
            }
            var C = I.data.key.children, A = I.data.key.checked,
                G = (H && I.check.chkStyle == q.radio.STYLE && I.check.radioType == q.radio.TYPE_ALL);
            E = !E ? [] : E;
            for (var F = 0, D = B.length; F < D; F++) {
                if (B[F].nocheck !== true && B[F].chkDisabled !== true && B[F][A] == H) {
                    E.push(B[F]);
                    if (G) {
                        break
                    }
                }
                y.getTreeCheckedNodes(I, B[F][C], H, E);
                if (G && E.length > 0) {
                    break
                }
            }
            return E
        }, getTreeChangeCheckedNodes: function (F, C, E) {
            if (!C) {
                return []
            }
            var G = F.data.key.children, B = F.data.key.checked;
            E = !E ? [] : E;
            for (var D = 0, A = C.length; D < A; D++) {
                if (C[D].nocheck !== true && C[D].chkDisabled !== true && C[D][B] != C[D].checkedOld) {
                    E.push(C[D])
                }
                y.getTreeChangeCheckedNodes(F, C[D][G], E)
            }
            return E
        }, makeChkFlag: function (H, C) {
            if (!C) {
                return
            }
            var B = H.data.key.children, A = H.data.key.checked, E = -1;
            if (C[B]) {
                for (var G = 0, D = C[B].length; G < D; G++) {
                    var I = C[B][G];
                    var F = -1;
                    if (H.check.chkStyle == q.radio.STYLE) {
                        if (I.nocheck === true || I.chkDisabled === true) {
                            F = I.check_Child_State
                        } else {
                            if (I.halfCheck === true) {
                                F = 2
                            } else {
                                if (I[A]) {
                                    F = 2
                                } else {
                                    F = I.check_Child_State > 0 ? 2 : 0
                                }
                            }
                        }
                        if (F == 2) {
                            E = 2;
                            break
                        } else {
                            if (F == 0) {
                                E = 0
                            }
                        }
                    } else {
                        if (H.check.chkStyle == q.checkbox.STYLE) {
                            if (I.nocheck === true || I.chkDisabled === true) {
                                F = I.check_Child_State
                            } else {
                                if (I.halfCheck === true) {
                                    F = 1
                                } else {
                                    if (I[A]) {
                                        F = (I.check_Child_State === -1 || I.check_Child_State === 2) ? 2 : 1
                                    } else {
                                        F = (I.check_Child_State > 0) ? 1 : 0
                                    }
                                }
                            }
                            if (F === 1) {
                                E = 1;
                                break
                            } else {
                                if (F === 2 && E > -1 && G > 0 && F !== E) {
                                    E = 1;
                                    break
                                } else {
                                    if (E === 2 && F > -1 && F < 2) {
                                        E = 1;
                                        break
                                    } else {
                                        if (F > -1) {
                                            E = F
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            C.check_Child_State = E
        }
    }, h = {}, l = {
        onCheckNode: function (E, D) {
            if (D.chkDisabled === true) {
                return false
            }
            var C = y.getSetting(E.data.treeId), A = C.data.key.checked;
            if (t.apply(C.callback.beforeCheck, [C.treeId, D], true) == false) {
                return true
            }
            D[A] = !D[A];
            j.checkNodeRelation(C, D);
            var B = f("#" + D.tId + q.id.CHECK);
            j.setChkClass(C, B, D);
            j.repairParentChkClassWithSelf(C, D);
            C.treeObj.trigger(q.event.CHECK, [E, C.treeId, D]);
            return true
        }, onMouseoverCheck: function (D, C) {
            if (C.chkDisabled === true) {
                return false
            }
            var B = y.getSetting(D.data.treeId), A = f("#" + C.tId + q.id.CHECK);
            C.check_Focus = true;
            j.setChkClass(B, A, C);
            return true
        }, onMouseoutCheck: function (D, C) {
            if (C.chkDisabled === true) {
                return false
            }
            var B = y.getSetting(D.data.treeId), A = f("#" + C.tId + q.id.CHECK);
            C.check_Focus = false;
            j.setChkClass(B, A, C);
            return true
        }
    }, i = {}, e = {
        checkNodeRelation: function (J, D) {
            var H, F, E, C = J.data.key.children, B = J.data.key.checked, A = q.radio;
            if (J.check.chkStyle == A.STYLE) {
                var I = y.getRadioCheckedList(J);
                if (D[B]) {
                    if (J.check.radioType == A.TYPE_ALL) {
                        for (F = I.length - 1; F >= 0; F--) {
                            H = I[F];
                            H[B] = false;
                            I.splice(F, 1);
                            j.setChkClass(J, f("#" + H.tId + q.id.CHECK), H);
                            if (H.parentTId != D.parentTId) {
                                j.repairParentChkClassWithSelf(J, H)
                            }
                        }
                        I.push(D)
                    } else {
                        var G = (D.parentTId) ? D.getParentNode() : y.getRoot(J);
                        for (F = 0, E = G[C].length; F < E; F++) {
                            H = G[C][F];
                            if (H[B] && H != D) {
                                H[B] = false;
                                j.setChkClass(J, f("#" + H.tId + q.id.CHECK), H)
                            }
                        }
                    }
                } else {
                    if (J.check.radioType == A.TYPE_ALL) {
                        for (F = 0, E = I.length; F < E; F++) {
                            if (D == I[F]) {
                                I.splice(F, 1);
                                break
                            }
                        }
                    }
                }
            } else {
                if (D[B] && (!D[C] || D[C].length == 0 || J.check.chkboxType.Y.indexOf("s") > -1)) {
                    j.setSonNodeCheckBox(J, D, true)
                }
                if (!D[B] && (!D[C] || D[C].length == 0 || J.check.chkboxType.N.indexOf("s") > -1)) {
                    j.setSonNodeCheckBox(J, D, false)
                }
                if (D[B] && J.check.chkboxType.Y.indexOf("p") > -1) {
                    j.setParentNodeCheckBox(J, D, true)
                }
                if (!D[B] && J.check.chkboxType.N.indexOf("p") > -1) {
                    j.setParentNodeCheckBox(J, D, false)
                }
            }
        }, makeChkClass: function (B, E) {
            var A = B.data.key.checked, G = q.checkbox, D = q.radio, F = "";
            if (E.chkDisabled === true) {
                F = G.DISABLED
            } else {
                if (E.halfCheck) {
                    F = G.PART
                } else {
                    if (B.check.chkStyle == D.STYLE) {
                        F = (E.check_Child_State < 1) ? G.FULL : G.PART
                    } else {
                        F = E[A] ? ((E.check_Child_State === 2 || E.check_Child_State === -1) ? G.FULL : G.PART) : ((E.check_Child_State < 1) ? G.FULL : G.PART)
                    }
                }
            }
            var C = B.check.chkStyle + "_" + (E[A] ? G.TRUE : G.FALSE) + "_" + F;
            C = (E.check_Focus && E.chkDisabled !== true) ? C + "_" + G.FOCUS : C;
            return q.className.BUTTON + " " + G.DEFAULT + " " + C
        }, repairAllChk: function (E, H) {
            if (E.check.enable && E.check.chkStyle === q.checkbox.STYLE) {
                var C = E.data.key.checked, G = E.data.key.children, B = y.getRoot(E);
                for (var D = 0, A = B[G].length; D < A; D++) {
                    var F = B[G][D];
                    if (F.nocheck !== true && F.chkDisabled !== true) {
                        F[C] = H
                    }
                    j.setSonNodeCheckBox(E, F, H)
                }
            }
        }, repairChkClass: function (B, C) {
            if (!C) {
                return
            }
            y.makeChkFlag(B, C);
            if (C.nocheck !== true) {
                var A = f("#" + C.tId + q.id.CHECK);
                j.setChkClass(B, A, C)
            }
        }, repairParentChkClass: function (B, C) {
            if (!C || !C.parentTId) {
                return
            }
            var A = C.getParentNode();
            j.repairChkClass(B, A);
            j.repairParentChkClass(B, A)
        }, repairParentChkClassWithSelf: function (A, C) {
            if (!C) {
                return
            }
            var B = A.data.key.children;
            if (C[B] && C[B].length > 0) {
                j.repairParentChkClass(A, C[B][0])
            } else {
                j.repairParentChkClass(A, C)
            }
        }, repairSonChkDisabled: function (F, H, E, C) {
            if (!H) {
                return
            }
            var G = F.data.key.children;
            if (H.chkDisabled != E) {
                H.chkDisabled = E
            }
            j.repairChkClass(F, H);
            if (H[G] && C) {
                for (var D = 0, B = H[G].length; D < B; D++) {
                    var A = H[G][D];
                    j.repairSonChkDisabled(F, A, E, C)
                }
            }
        }, repairParentChkDisabled: function (C, D, B, A) {
            if (!D) {
                return
            }
            if (D.chkDisabled != B && A) {
                D.chkDisabled = B
            }
            j.repairChkClass(C, D);
            j.repairParentChkDisabled(C, D.getParentNode(), B, A)
        }, setChkClass: function (A, C, B) {
            if (!C) {
                return
            }
            if (B.nocheck === true) {
                C.hide()
            } else {
                C.show()
            }
            C.removeClass();
            C.addClass(j.makeChkClass(A, B))
        }, setParentNodeCheckBox: function (K, D, J, G) {
            var C = K.data.key.children, A = K.data.key.checked, H = f("#" + D.tId + q.id.CHECK);
            if (!G) {
                G = D
            }
            y.makeChkFlag(K, D);
            if (D.nocheck !== true && D.chkDisabled !== true) {
                D[A] = J;
                j.setChkClass(K, H, D);
                if (K.check.autoCheckTrigger && D != G) {
                    K.treeObj.trigger(q.event.CHECK, [null, K.treeId, D])
                }
            }
            if (D.parentTId) {
                var I = true;
                if (!J) {
                    var B = D.getParentNode()[C];
                    for (var F = 0, E = B.length; F < E; F++) {
                        if ((B[F].nocheck !== true && B[F].chkDisabled !== true && B[F][A]) || ((B[F].nocheck === true || B[F].chkDisabled === true) && B[F].check_Child_State > 0)) {
                            I = false;
                            break
                        }
                    }
                }
                if (I) {
                    j.setParentNodeCheckBox(K, D.getParentNode(), J, G)
                }
            }
        }, setSonNodeCheckBox: function (K, D, J, G) {
            if (!D) {
                return
            }
            var C = K.data.key.children, A = K.data.key.checked, H = f("#" + D.tId + q.id.CHECK);
            if (!G) {
                G = D
            }
            var B = false;
            if (D[C]) {
                for (var F = 0, E = D[C].length; F < E && D.chkDisabled !== true; F++) {
                    var I = D[C][F];
                    j.setSonNodeCheckBox(K, I, J, G);
                    if (I.chkDisabled === true) {
                        B = true
                    }
                }
            }
            if (D != y.getRoot(K) && D.chkDisabled !== true) {
                if (B && D.nocheck !== true) {
                    y.makeChkFlag(K, D)
                }
                if (D.nocheck !== true && D.chkDisabled !== true) {
                    D[A] = J;
                    if (!B) {
                        D.check_Child_State = (D[C] && D[C].length > 0) ? (J ? 2 : 0) : -1
                    }
                } else {
                    D.check_Child_State = -1
                }
                j.setChkClass(K, H, D);
                if (K.check.autoCheckTrigger && D != G && D.nocheck !== true && D.chkDisabled !== true) {
                    K.treeObj.trigger(q.event.CHECK, [null, K.treeId, D])
                }
            }
        }
    }, s = {tools: i, view: e, event: h, data: p};
    f.extend(true, f.fn.zTree.consts, z);
    f.extend(true, f.fn.zTree._z, s);
    var c = f.fn.zTree, t = c._z.tools, q = c.consts, j = c._z.view, y = c._z.data, r = c._z.event;
    y.exSetting(m);
    y.addInitBind(n);
    y.addInitUnBind(x);
    y.addInitCache(d);
    y.addInitNode(u);
    y.addInitProxy(o);
    y.addInitRoot(v);
    y.addBeforeA(a);
    y.addZTreeTools(k);
    var w = j.createNodes;
    j.createNodes = function (C, D, B, A) {
        if (w) {
            w.apply(j, arguments)
        }
        if (!B) {
            return
        }
        j.repairParentChkClassWithSelf(C, A)
    };
    var b = j.removeNode;
    j.removeNode = function (B, C) {
        var A = C.getParentNode();
        if (b) {
            b.apply(j, arguments)
        }
        if (!C || !A) {
            return
        }
        j.repairChkClass(B, A);
        j.repairParentChkClass(B, A)
    };
    var g = j.appendNodes;
    j.appendNodes = function (E, G, B, A, D, F) {
        var C = "";
        if (g) {
            C = g.apply(j, arguments)
        }
        if (A) {
            y.makeChkFlag(E, A)
        }
        return C
    }
})(jQuery);
(function (f) {
    var B = {
        event: {DRAG: "ztree_drag", DROP: "ztree_drop", REMOVE: "ztree_remove", RENAME: "ztree_rename"},
        id: {EDIT: "_edit", INPUT: "_input", REMOVE: "_remove"},
        move: {TYPE_INNER: "inner", TYPE_PREV: "prev", TYPE_NEXT: "next"},
        node: {
            CURSELECTED_EDIT: "curSelectedNode_Edit",
            TMPTARGET_TREE: "tmpTargetzTree",
            TMPTARGET_NODE: "tmpTargetNode"
        }
    }, l = {
        edit: {
            enable: false,
            editNameSelectAll: false,
            showRemoveBtn: true,
            showRenameBtn: true,
            removeTitle: "remove",
            renameTitle: "rename",
            drag: {
                autoExpandTrigger: false,
                isCopy: true,
                isMove: true,
                prev: true,
                next: true,
                inner: true,
                minMoveSize: 5,
                borderMax: 10,
                borderMin: -5,
                maxShowNodeNum: 5,
                autoOpenTime: 500
            }
        },
        view: {addHoverDom: null, removeHoverDom: null},
        callback: {
            beforeDrag: null,
            beforeDragOpen: null,
            beforeDrop: null,
            beforeEditName: null,
            beforeRename: null,
            onDrag: null,
            onDrop: null,
            onRename: null
        }
    }, w = function (C) {
        var D = z.getRoot(C);
        D.curEditNode = null;
        D.curEditInput = null;
        D.curHoverNode = null;
        D.dragFlag = 0;
        D.dragNodeShowBefore = [];
        D.dragMaskList = [];
        D.showHoverDom = true
    }, c = function (C) {
    }, m = function (C) {
        var D = C.treeObj;
        var E = p.event;
        D.bind(E.RENAME, function (F, H, G) {
            u.apply(C.callback.onRename, [F, H, G])
        });
        D.bind(E.REMOVE, function (F, H, G) {
            u.apply(C.callback.onRemove, [F, H, G])
        });
        D.bind(E.DRAG, function (G, F, I, H) {
            u.apply(C.callback.onDrag, [F, I, H])
        });
        D.bind(E.DROP, function (I, H, K, J, L, G, F) {
            u.apply(C.callback.onDrop, [H, K, J, L, G, F])
        })
    }, y = function (C) {
        var D = C.treeObj;
        var E = p.event;
        D.unbind(E.RENAME);
        D.unbind(E.REMOVE);
        D.unbind(E.DRAG);
        D.unbind(E.DROP)
    }, n = function (J) {
        var K = J.target, N = z.getSetting(J.data.treeId), L = J.relatedTarget, H = "", D = null, E = "", I = "",
            C = null, G = null, F = null;
        if (u.eqs(J.type, "mouseover")) {
            F = u.getMDom(N, K, [{tagName: "a", attrName: "treeNode" + p.id.A}]);
            if (F) {
                H = F.parentNode.id;
                E = "hoverOverNode"
            }
        } else {
            if (u.eqs(J.type, "mouseout")) {
                F = u.getMDom(N, L, [{tagName: "a", attrName: "treeNode" + p.id.A}]);
                if (!F) {
                    H = "remove";
                    E = "hoverOutNode"
                }
            } else {
                if (u.eqs(J.type, "mousedown")) {
                    F = u.getMDom(N, K, [{tagName: "a", attrName: "treeNode" + p.id.A}]);
                    if (F) {
                        H = F.parentNode.id;
                        E = "mousedownNode"
                    }
                }
            }
        }
        if (H.length > 0) {
            D = z.getNodeCache(N, H);
            switch (E) {
                case "mousedownNode":
                    C = k.onMousedownNode;
                    break;
                case "hoverOverNode":
                    C = k.onHoverOverNode;
                    break;
                case "hoverOutNode":
                    C = k.onHoverOutNode;
                    break
            }
        }
        var M = {stop: false, node: D, nodeEventType: E, nodeEventCallback: C, treeEventType: I, treeEventCallback: G};
        return M
    }, v = function (E, I, H, C, G, D, F) {
        if (!H) {
            return
        }
        H.isHover = false;
        H.editNameFlag = false
    }, j = function (D, C) {
        C.cancelEditName = function (F) {
            var E = z.getRoot(D), G = D.data.key.name, H = E.curEditNode;
            if (!E.curEditNode) {
                return
            }
            i.cancelCurEditNode(D, F ? F : H[G])
        };
        C.copyNode = function (I, H, G, J) {
            if (!H) {
                return null
            }
            if (I && !I.isParent && D.data.keep.leaf && G === p.move.TYPE_INNER) {
                return null
            }
            var E = u.clone(H);
            if (!I) {
                I = null;
                G = p.move.TYPE_INNER
            }
            if (G == p.move.TYPE_INNER) {
                function F() {
                    i.addNodes(D, I, [E], J)
                }

                if (u.canAsync(D, I)) {
                    i.asyncNode(D, I, J, F)
                } else {
                    F()
                }
            } else {
                i.addNodes(D, I.parentNode, [E], J);
                i.moveNode(D, I, E, G, false, J)
            }
            return E
        };
        C.editName = function (E) {
            if (!E || !E.tId || E !== z.getNodeCache(D, E.tId)) {
                return
            }
            if (E.parentTId) {
                i.expandCollapseParentNode(D, E.getParentNode(), true)
            }
            i.editNode(D, E)
        };
        C.moveNode = function (G, F, E, I) {
            if (!F) {
                return F
            }
            if (G && !G.isParent && D.data.keep.leaf && E === p.move.TYPE_INNER) {
                return null
            } else {
                if (G && ((F.parentTId == G.tId && E == p.move.TYPE_INNER) || f("#" + F.tId).find("#" + G.tId).length > 0)) {
                    return null
                } else {
                    if (!G) {
                        G = null
                    }
                }
            }

            function H() {
                i.moveNode(D, G, F, E, false, I)
            }

            if (u.canAsync(D, G) && E === p.move.TYPE_INNER) {
                i.asyncNode(D, G, I, H)
            } else {
                H()
            }
            return F
        };
        C.setEditable = function (E) {
            D.edit.enable = E;
            return this.refresh()
        }
    }, o = {
        setSonNodeLevel: function (F, C, H) {
            if (!H) {
                return
            }
            var G = F.data.key.children;
            H.level = (C) ? C.level + 1 : 0;
            if (!H[G]) {
                return
            }
            for (var E = 0, D = H[G].length; E < D; E++) {
                if (H[G][E]) {
                    z.setSonNodeLevel(F, H, H[G][E])
                }
            }
        }
    }, g = {}, k = {
        onHoverOverNode: function (F, E) {
            var D = z.getSetting(F.data.treeId), C = z.getRoot(D);
            if (C.curHoverNode != E) {
                k.onHoverOutNode(F)
            }
            C.curHoverNode = E;
            i.addHoverDom(D, E)
        }, onHoverOutNode: function (F, E) {
            var D = z.getSetting(F.data.treeId), C = z.getRoot(D);
            if (C.curHoverNode && !z.isSelectedNode(D, C.curHoverNode)) {
                i.removeTreeDom(D, C.curHoverNode);
                C.curHoverNode = null
            }
        }, onMousedownNode: function (O, I) {
            var W, T, N = z.getSetting(O.data.treeId), S = z.getRoot(N);
            if (O.button == 2 || !N.edit.enable || (!N.edit.drag.isCopy && !N.edit.drag.isMove)) {
                return true
            }
            var Z = O.target, H = z.getRoot(N).curSelectedList, P = [];
            if (!z.isSelectedNode(N, I)) {
                P = [I]
            } else {
                for (W = 0, T = H.length; W < T; W++) {
                    if (H[W].editNameFlag && u.eqs(Z.tagName, "input") && Z.getAttribute("treeNode" + p.id.INPUT) !== null) {
                        return true
                    }
                    P.push(H[W]);
                    if (P[0].parentTId !== H[W].parentTId) {
                        P = [I];
                        break
                    }
                }
            }
            i.editNodeBlur = true;
            i.cancelCurEditNode(N, null, true);
            var ac = f(document), V, J, X, Y = false, aa = N, C, G, Q = null, F = null, M = null, D = p.move.TYPE_INNER,
                U = O.clientX, R = O.clientY, K = (new Date()).getTime();
            if (u.uCanDo(N)) {
                ac.bind("mousemove", L)
            }

            function L(a1) {
                if (S.dragFlag == 0 && Math.abs(U - a1.clientX) < N.edit.drag.minMoveSize && Math.abs(R - a1.clientY) < N.edit.drag.minMoveSize) {
                    return true
                }
                var aW, aS, au, aN, aF, aM = N.data.key.children;
                f("body").css("cursor", "pointer");
                if (S.dragFlag == 0) {
                    if (u.apply(N.callback.beforeDrag, [N.treeId, P], true) == false) {
                        ab(a1);
                        return true
                    }
                    for (aW = 0, aS = P.length; aW < aS; aW++) {
                        if (aW == 0) {
                            S.dragNodeShowBefore = []
                        }
                        au = P[aW];
                        if (au.isParent && au.open) {
                            i.expandCollapseNode(N, au, !au.open);
                            S.dragNodeShowBefore[au.tId] = true
                        } else {
                            S.dragNodeShowBefore[au.tId] = false
                        }
                    }
                    S.dragFlag = 1;
                    S.showHoverDom = false;
                    u.showIfameMask(N, true);
                    var ae = true, ah = -1;
                    if (P.length > 1) {
                        var ar = P[0].parentTId ? P[0].getParentNode()[aM] : z.getNodes(N);
                        aF = [];
                        for (aW = 0, aS = ar.length; aW < aS; aW++) {
                            if (S.dragNodeShowBefore[ar[aW].tId] !== undefined) {
                                if (ae && ah > -1 && (ah + 1) !== aW) {
                                    ae = false
                                }
                                aF.push(ar[aW]);
                                ah = aW
                            }
                            if (P.length === aF.length) {
                                P = aF;
                                break
                            }
                        }
                    }
                    if (ae) {
                        C = P[0].getPreNode();
                        G = P[P.length - 1].getNextNode()
                    }
                    V = f("<ul class='zTreeDragUL'></ul>");
                    for (aW = 0, aS = P.length; aW < aS; aW++) {
                        au = P[aW];
                        au.editNameFlag = false;
                        i.selectNode(N, au, aW > 0);
                        i.removeTreeDom(N, au);
                        aN = f("<li id='" + au.tId + "_tmp'></li>");
                        aN.append(f("#" + au.tId + p.id.A).clone());
                        aN.css("padding", "0");
                        aN.children("#" + au.tId + p.id.A).removeClass(p.node.CURSELECTED);
                        V.append(aN);
                        if (aW == N.edit.drag.maxShowNodeNum - 1) {
                            aN = f("<li id='" + au.tId + "_moretmp'><a>  ...  </a></li>");
                            V.append(aN);
                            break
                        }
                    }
                    V.attr("id", P[0].tId + p.id.UL + "_tmp");
                    V.addClass(N.treeObj.attr("class"));
                    V.appendTo("body");
                    J = f("<span class='tmpzTreeMove_arrow'></span>");
                    J.attr("id", "zTreeMove_arrow_tmp");
                    J.appendTo("body");
                    N.treeObj.trigger(p.event.DRAG, [a1, N.treeId, P])
                }
                if (S.dragFlag == 1) {
                    if (X && J.attr("id") == a1.target.id && M && (a1.clientX + ac.scrollLeft() + 2) > (f("#" + M + p.id.A, X).offset().left)) {
                        var a0 = f("#" + M + p.id.A, X);
                        a1.target = (a0.length > 0) ? a0.get(0) : a1.target
                    } else {
                        if (X) {
                            X.removeClass(p.node.TMPTARGET_TREE);
                            if (M) {
                                f("#" + M + p.id.A, X).removeClass(p.node.TMPTARGET_NODE + "_" + p.move.TYPE_PREV).removeClass(p.node.TMPTARGET_NODE + "_" + B.move.TYPE_NEXT).removeClass(p.node.TMPTARGET_NODE + "_" + B.move.TYPE_INNER)
                            }
                        }
                    }
                    X = null;
                    M = null;
                    Y = false;
                    aa = N;
                    var aX = z.getSettings();
                    for (var aO in aX) {
                        if (aX[aO].treeId && aX[aO].edit.enable && aX[aO].treeId != N.treeId && (a1.target.id == aX[aO].treeId || f(a1.target).parents("#" + aX[aO].treeId).length > 0)) {
                            Y = true;
                            aa = aX[aO]
                        }
                    }
                    var aq = ac.scrollTop(), aZ = ac.scrollLeft(), af = aa.treeObj.offset(),
                        az = aa.treeObj.get(0).scrollHeight, aP = aa.treeObj.get(0).scrollWidth,
                        aY = (a1.clientY + aq - af.top), aL = (aa.treeObj.height() + af.top - a1.clientY - aq),
                        aG = (a1.clientX + aZ - af.left), ap = (aa.treeObj.width() + af.left - a1.clientX - aZ),
                        at = (aY < N.edit.drag.borderMax && aY > N.edit.drag.borderMin),
                        a2 = (aL < N.edit.drag.borderMax && aL > N.edit.drag.borderMin),
                        aJ = (aG < N.edit.drag.borderMax && aG > N.edit.drag.borderMin),
                        an = (ap < N.edit.drag.borderMax && ap > N.edit.drag.borderMin),
                        ag = aY > N.edit.drag.borderMin && aL > N.edit.drag.borderMin && aG > N.edit.drag.borderMin && ap > N.edit.drag.borderMin,
                        aD = (at && aa.treeObj.scrollTop() <= 0),
                        aC = (a2 && (aa.treeObj.scrollTop() + aa.treeObj.height() + 10) >= az),
                        aj = (aJ && aa.treeObj.scrollLeft() <= 0),
                        ax = (an && (aa.treeObj.scrollLeft() + aa.treeObj.width() + 10) >= aP);
                    if (a1.target.id && aa.treeObj.find("#" + a1.target.id).length > 0) {
                        var ao = a1.target;
                        while (ao && ao.tagName && !u.eqs(ao.tagName, "li") && ao.id != aa.treeId) {
                            ao = ao.parentNode
                        }
                        var aw = true;
                        for (aW = 0, aS = P.length; aW < aS; aW++) {
                            au = P[aW];
                            if (ao.id === au.tId) {
                                aw = false;
                                break
                            } else {
                                if (f("#" + au.tId).find("#" + ao.id).length > 0) {
                                    aw = false;
                                    break
                                }
                            }
                        }
                        if (aw) {
                            if (a1.target.id && (a1.target.id == (ao.id + p.id.A) || f(a1.target).parents("#" + ao.id + p.id.A).length > 0)) {
                                X = f(ao);
                                M = ao.id
                            }
                        }
                    }
                    au = P[0];
                    if (ag && (a1.target.id == aa.treeId || f(a1.target).parents("#" + aa.treeId).length > 0)) {
                        if (!X && (a1.target.id == aa.treeId || aD || aC || aj || ax) && (Y || (!Y && au.parentTId))) {
                            X = aa.treeObj
                        }
                        if (at) {
                            aa.treeObj.scrollTop(aa.treeObj.scrollTop() - 10)
                        } else {
                            if (a2) {
                                aa.treeObj.scrollTop(aa.treeObj.scrollTop() + 10)
                            }
                        }
                        if (aJ) {
                            aa.treeObj.scrollLeft(aa.treeObj.scrollLeft() - 10)
                        } else {
                            if (an) {
                                aa.treeObj.scrollLeft(aa.treeObj.scrollLeft() + 10)
                            }
                        }
                        if (X && X != aa.treeObj && X.offset().left < aa.treeObj.offset().left) {
                            aa.treeObj.scrollLeft(aa.treeObj.scrollLeft() + X.offset().left - aa.treeObj.offset().left)
                        }
                    }
                    V.css({top: (a1.clientY + aq + 3) + "px", left: (a1.clientX + aZ + 3) + "px"});
                    var aB = 0;
                    var aA = 0;
                    if (X && X.attr("id") != aa.treeId) {
                        var aK = M == null ? null : z.getNodeCache(aa, M),
                            aE = (a1.ctrlKey && N.edit.drag.isMove && N.edit.drag.isCopy) || (!N.edit.drag.isMove && N.edit.drag.isCopy),
                            al = !!(C && M === C.tId), aI = !!(G && M === G.tId),
                            aU = (au.parentTId && au.parentTId == M),
                            aH = (aE || !aI) && u.apply(aa.edit.drag.prev, [aa.treeId, P, aK], !!aa.edit.drag.prev),
                            ak = (aE || !al) && u.apply(aa.edit.drag.next, [aa.treeId, P, aK], !!aa.edit.drag.next),
                            ad = (aE || !aU) && !(aa.data.keep.leaf && !aK.isParent) && u.apply(aa.edit.drag.inner, [aa.treeId, P, aK], !!aa.edit.drag.inner);
                        if (!aH && !ak && !ad) {
                            X = null;
                            M = "";
                            D = p.move.TYPE_INNER;
                            J.css({display: "none"});
                            if (window.zTreeMoveTimer) {
                                clearTimeout(window.zTreeMoveTimer);
                                window.zTreeMoveTargetNodeTId = null
                            }
                        } else {
                            var ay = f("#" + M + p.id.A, X),
                                aR = aK.isLastNode ? null : f("#" + aK.getNextNode().tId + p.id.A, X.next()),
                                aT = ay.offset().top, aV = ay.offset().left,
                                aQ = aH ? (ad ? 0.25 : (ak ? 0.5 : 1)) : -1,
                                am = ak ? (ad ? 0.75 : (aH ? 0.5 : 0)) : -1, ai = (a1.clientY + aq - aT) / ay.height();
                            if ((aQ == 1 || ai <= aQ && ai >= -0.2) && aH) {
                                aB = 1 - J.width();
                                aA = aT - J.height() / 2;
                                D = p.move.TYPE_PREV
                            } else {
                                if ((am == 0 || ai >= am && ai <= 1.2) && ak) {
                                    aB = 1 - J.width();
                                    aA = (aR == null || (aK.isParent && aK.open)) ? (aT + ay.height() - J.height() / 2) : (aR.offset().top - J.height() / 2);
                                    D = p.move.TYPE_NEXT
                                } else {
                                    aB = 5 - J.width();
                                    aA = aT;
                                    D = p.move.TYPE_INNER
                                }
                            }
                            J.css({display: "block", top: aA + "px", left: (aV + aB) + "px"});
                            ay.addClass(p.node.TMPTARGET_NODE + "_" + D);
                            if (Q != M || F != D) {
                                K = (new Date()).getTime()
                            }
                            if (aK && aK.isParent && D == p.move.TYPE_INNER) {
                                var av = true;
                                if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== aK.tId) {
                                    clearTimeout(window.zTreeMoveTimer);
                                    window.zTreeMoveTargetNodeTId = null
                                } else {
                                    if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === aK.tId) {
                                        av = false
                                    }
                                }
                                if (av) {
                                    window.zTreeMoveTimer = setTimeout(function () {
                                        if (D != p.move.TYPE_INNER) {
                                            return
                                        }
                                        if (aK && aK.isParent && !aK.open && (new Date()).getTime() - K > aa.edit.drag.autoOpenTime && u.apply(aa.callback.beforeDragOpen, [aa.treeId, aK], true)) {
                                            i.switchNode(aa, aK);
                                            if (aa.edit.drag.autoExpandTrigger) {
                                                aa.treeObj.trigger(p.event.EXPAND, [aa.treeId, aK])
                                            }
                                        }
                                    }, aa.edit.drag.autoOpenTime + 50);
                                    window.zTreeMoveTargetNodeTId = aK.tId
                                }
                            }
                        }
                    } else {
                        D = p.move.TYPE_INNER;
                        if (X && u.apply(aa.edit.drag.inner, [aa.treeId, P, null], !!aa.edit.drag.inner)) {
                            X.addClass(p.node.TMPTARGET_TREE)
                        } else {
                            X = null
                        }
                        J.css({display: "none"});
                        if (window.zTreeMoveTimer) {
                            clearTimeout(window.zTreeMoveTimer);
                            window.zTreeMoveTargetNodeTId = null
                        }
                    }
                    Q = M;
                    F = D
                }
                return false
            }

            ac.bind("mouseup", ab);

            function ab(ak) {
                if (window.zTreeMoveTimer) {
                    clearTimeout(window.zTreeMoveTimer);
                    window.zTreeMoveTargetNodeTId = null
                }
                Q = null;
                F = null;
                ac.unbind("mousemove", L);
                ac.unbind("mouseup", ab);
                ac.unbind("selectstart", E);
                f("body").css("cursor", "auto");
                if (X) {
                    X.removeClass(p.node.TMPTARGET_TREE);
                    if (M) {
                        f("#" + M + p.id.A, X).removeClass(p.node.TMPTARGET_NODE + "_" + p.move.TYPE_PREV).removeClass(p.node.TMPTARGET_NODE + "_" + B.move.TYPE_NEXT).removeClass(p.node.TMPTARGET_NODE + "_" + B.move.TYPE_INNER)
                    }
                }
                u.showIfameMask(N, false);
                S.showHoverDom = true;
                if (S.dragFlag == 0) {
                    return
                }
                S.dragFlag = 0;
                var ai, ae, aj;
                for (ai = 0, ae = P.length; ai < ae; ai++) {
                    aj = P[ai];
                    if (aj.isParent && S.dragNodeShowBefore[aj.tId] && !aj.open) {
                        i.expandCollapseNode(N, aj, !aj.open);
                        delete S.dragNodeShowBefore[aj.tId]
                    }
                }
                if (V) {
                    V.remove()
                }
                if (J) {
                    J.remove()
                }
                var ad = (ak.ctrlKey && N.edit.drag.isMove && N.edit.drag.isCopy) || (!N.edit.drag.isMove && N.edit.drag.isCopy);
                if (!ad && X && M && P[0].parentTId && M == P[0].parentTId && D == p.move.TYPE_INNER) {
                    X = null
                }
                if (X) {
                    var af = M == null ? null : z.getNodeCache(aa, M);
                    if (u.apply(N.callback.beforeDrop, [aa.treeId, P, af, D, ad], true) == false) {
                        return
                    }
                    var ag = ad ? u.clone(P) : P;

                    function ah() {
                        if (Y) {
                            if (!ad) {
                                for (var am = 0, al = P.length; am < al; am++) {
                                    i.removeNode(N, P[am])
                                }
                            }
                            if (D == p.move.TYPE_INNER) {
                                i.addNodes(aa, af, ag)
                            } else {
                                i.addNodes(aa, af.getParentNode(), ag);
                                if (D == p.move.TYPE_PREV) {
                                    for (am = 0, al = ag.length; am < al; am++) {
                                        i.moveNode(aa, af, ag[am], D, false)
                                    }
                                } else {
                                    for (am = -1, al = ag.length - 1; am < al; al--) {
                                        i.moveNode(aa, af, ag[al], D, false)
                                    }
                                }
                            }
                        } else {
                            if (ad && D == p.move.TYPE_INNER) {
                                i.addNodes(aa, af, ag)
                            } else {
                                if (ad) {
                                    i.addNodes(aa, af.getParentNode(), ag)
                                }
                                if (D != p.move.TYPE_NEXT) {
                                    for (am = 0, al = ag.length; am < al; am++) {
                                        i.moveNode(aa, af, ag[am], D, false)
                                    }
                                } else {
                                    for (am = -1, al = ag.length - 1; am < al; al--) {
                                        i.moveNode(aa, af, ag[al], D, false)
                                    }
                                }
                            }
                        }
                        for (am = 0, al = ag.length; am < al; am++) {
                            i.selectNode(aa, ag[am], am > 0)
                        }
                        f("#" + ag[0].tId).focus().blur();
                        N.treeObj.trigger(p.event.DROP, [ak, aa.treeId, ag, af, D, ad])
                    }

                    if (D == p.move.TYPE_INNER && u.canAsync(aa, af)) {
                        i.asyncNode(aa, af, false, ah)
                    } else {
                        ah()
                    }
                } else {
                    for (ai = 0, ae = P.length; ai < ae; ai++) {
                        i.selectNode(aa, P[ai], ai > 0)
                    }
                    N.treeObj.trigger(p.event.DROP, [ak, N.treeId, P, null, null, null])
                }
            }

            ac.bind("selectstart", E);

            function E() {
                return false
            }

            if (O.preventDefault) {
                O.preventDefault()
            }
            return true
        }
    }, h = {
        getAbs: function (C) {
            var D = C.getBoundingClientRect();
            return [D.left, D.top]
        }, inputFocus: function (C) {
            if (C.get(0)) {
                C.focus();
                u.setCursorPosition(C.get(0), C.val().length)
            }
        }, inputSelect: function (C) {
            if (C.get(0)) {
                C.focus();
                C.select()
            }
        }, setCursorPosition: function (D, E) {
            if (D.setSelectionRange) {
                D.focus();
                D.setSelectionRange(E, E)
            } else {
                if (D.createTextRange) {
                    var C = D.createTextRange();
                    C.collapse(true);
                    C.moveEnd("character", E);
                    C.moveStart("character", E);
                    C.select()
                }
            }
        }, showIfameMask: function (J, H) {
            var G = z.getRoot(J);
            while (G.dragMaskList.length > 0) {
                G.dragMaskList[0].remove();
                G.dragMaskList.shift()
            }
            if (H) {
                var K = f("iframe");
                for (var F = 0, D = K.length; F < D; F++) {
                    var E = K.get(F), C = u.getAbs(E),
                        I = f("<div id='zTreeMask_" + F + "' class='zTreeMask' style='top:" + C[1] + "px; left:" + C[0] + "px; width:" + E.offsetWidth + "px; height:" + E.offsetHeight + "px;'></div>");
                    I.appendTo("body");
                    G.dragMaskList.push(I)
                }
            }
        }
    }, d = {
        addEditBtn: function (D, E) {
            if (E.editNameFlag || f("#" + E.tId + p.id.EDIT).length > 0) {
                return
            }
            if (!u.apply(D.edit.showRenameBtn, [D.treeId, E], D.edit.showRenameBtn)) {
                return
            }
            var F = f("#" + E.tId + p.id.A),
                C = "<span class='" + p.className.BUTTON + " edit' id='" + E.tId + p.id.EDIT + "' title='" + u.apply(D.edit.renameTitle, [D.treeId, E], D.edit.renameTitle) + "' treeNode" + p.id.EDIT + " style='display:none;'></span>";
            F.append(C);
            f("#" + E.tId + p.id.EDIT).bind("click", function () {
                if (!u.uCanDo(D) || u.apply(D.callback.beforeEditName, [D.treeId, E], true) == false) {
                    return false
                }
                i.editNode(D, E);
                return false
            }).show()
        }, addRemoveBtn: function (C, D) {
            if (D.editNameFlag || f("#" + D.tId + p.id.REMOVE).length > 0) {
                return
            }
            if (!u.apply(C.edit.showRemoveBtn, [C.treeId, D], C.edit.showRemoveBtn)) {
                return
            }
            var F = f("#" + D.tId + p.id.A),
                E = "<span class='" + p.className.BUTTON + " remove' id='" + D.tId + p.id.REMOVE + "' title='" + u.apply(C.edit.removeTitle, [C.treeId, D], C.edit.removeTitle) + "' treeNode" + p.id.REMOVE + " style='display:none;'></span>";
            F.append(E);
            f("#" + D.tId + p.id.REMOVE).bind("click", function () {
                if (!u.uCanDo(C) || u.apply(C.callback.beforeRemove, [C.treeId, D], true) == false) {
                    return false
                }
                i.removeNode(C, D);
                C.treeObj.trigger(p.event.REMOVE, [C.treeId, D]);
                return false
            }).bind("mousedown", function (G) {
                return true
            }).show()
        }, addHoverDom: function (C, D) {
            if (z.getRoot(C).showHoverDom) {
                D.isHover = true;
                if (C.edit.enable) {
                    i.addEditBtn(C, D);
                    i.addRemoveBtn(C, D)
                }
                u.apply(C.view.addHoverDom, [C.treeId, D])
            }
        }, cancelCurEditNode: function (H, F) {
            var D = z.getRoot(H), G = H.data.key.name, I = D.curEditNode;
            if (I) {
                var E = D.curEditInput;
                var C = F ? F : E.val();
                if (!F && u.apply(H.callback.beforeRename, [H.treeId, I, C], true) === false) {
                    return false
                } else {
                    I[G] = C ? C : E.val();
                    if (!F) {
                        H.treeObj.trigger(p.event.RENAME, [H.treeId, I])
                    }
                }
                var J = f("#" + I.tId + p.id.A);
                J.removeClass(p.node.CURSELECTED_EDIT);
                E.unbind();
                i.setNodeName(H, I);
                I.editNameFlag = false;
                D.curEditNode = null;
                D.curEditInput = null;
                i.selectNode(H, I, false)
            }
            D.noSelection = true;
            return true
        }, editNode: function (F, G) {
            var C = z.getRoot(F);
            i.editNodeBlur = false;
            if (z.isSelectedNode(F, G) && C.curEditNode == G && G.editNameFlag) {
                setTimeout(function () {
                    u.inputFocus(C.curEditInput)
                }, 0);
                return
            }
            var E = F.data.key.name;
            G.editNameFlag = true;
            i.removeTreeDom(F, G);
            i.cancelCurEditNode(F);
            i.selectNode(F, G, false);
            f("#" + G.tId + p.id.SPAN).html("<input type=text class='rename' id='" + G.tId + p.id.INPUT + "' treeNode" + p.id.INPUT + " >");
            var D = f("#" + G.tId + p.id.INPUT);
            D.attr("value", G[E]);
            if (F.edit.editNameSelectAll) {
                u.inputSelect(D)
            } else {
                u.inputFocus(D)
            }
            D.bind("blur", function (H) {
                if (!i.editNodeBlur) {
                    i.cancelCurEditNode(F)
                }
            }).bind("keydown", function (H) {
                if (H.keyCode == "13") {
                    i.editNodeBlur = true;
                    i.cancelCurEditNode(F, null, true)
                } else {
                    if (H.keyCode == "27") {
                        i.cancelCurEditNode(F, G[E])
                    }
                }
            }).bind("click", function (H) {
                return false
            }).bind("dblclick", function (H) {
                return false
            });
            f("#" + G.tId + p.id.A).addClass(p.node.CURSELECTED_EDIT);
            C.curEditInput = D;
            C.noSelection = false;
            C.curEditNode = G
        }, moveNode: function (M, F, P, E, aa, G) {
            var R = z.getRoot(M), K = M.data.key.children;
            if (F == P) {
                return
            }
            if (M.data.keep.leaf && F && !F.isParent && E == p.move.TYPE_INNER) {
                return
            }
            var U = (P.parentTId ? P.getParentNode() : R), O = (F === null || F == R);
            if (O && F === null) {
                F = R
            }
            if (O) {
                E = p.move.TYPE_INNER
            }
            var C = (F.parentTId ? F.getParentNode() : R);
            if (E != p.move.TYPE_PREV && E != p.move.TYPE_NEXT) {
                E = p.move.TYPE_INNER
            }
            if (E == p.move.TYPE_INNER) {
                if (O) {
                    P.parentTId = null
                } else {
                    if (!F.isParent) {
                        F.isParent = true;
                        F.open = !!F.open;
                        i.setNodeLineIcos(M, F)
                    }
                    P.parentTId = F.tId
                }
            }
            var H, J;
            if (O) {
                H = M.treeObj;
                J = H
            } else {
                if (!G && E == p.move.TYPE_INNER) {
                    i.expandCollapseNode(M, F, true, false)
                } else {
                    if (!G) {
                        i.expandCollapseNode(M, F.getParentNode(), true, false)
                    }
                }
                H = f("#" + F.tId);
                J = f("#" + F.tId + p.id.UL);
                if (!!H.get(0) && !J.get(0)) {
                    var Y = [];
                    i.makeUlHtml(M, F, Y, "");
                    H.append(Y.join(""))
                }
                J = f("#" + F.tId + p.id.UL)
            }
            var W = f("#" + P.tId);
            if (!W.get(0)) {
                W = i.appendNodes(M, P.level, [P], null, false, true).join("")
            } else {
                if (!H.get(0)) {
                    W.remove()
                }
            }
            if (J.get(0) && E == p.move.TYPE_INNER) {
                J.append(W)
            } else {
                if (H.get(0) && E == p.move.TYPE_PREV) {
                    H.before(W)
                } else {
                    if (H.get(0) && E == p.move.TYPE_NEXT) {
                        H.after(W)
                    }
                }
            }
            var T, S, I = -1, V = 0, Z = null, D = null, X = P.level;
            if (P.isFirstNode) {
                I = 0;
                if (U[K].length > 1) {
                    Z = U[K][1];
                    Z.isFirstNode = true
                }
            } else {
                if (P.isLastNode) {
                    I = U[K].length - 1;
                    Z = U[K][I - 1];
                    Z.isLastNode = true
                } else {
                    for (T = 0, S = U[K].length; T < S; T++) {
                        if (U[K][T].tId == P.tId) {
                            I = T;
                            break
                        }
                    }
                }
            }
            if (I >= 0) {
                U[K].splice(I, 1)
            }
            if (E != p.move.TYPE_INNER) {
                for (T = 0, S = C[K].length; T < S; T++) {
                    if (C[K][T].tId == F.tId) {
                        V = T
                    }
                }
            }
            if (E == p.move.TYPE_INNER) {
                if (!F[K]) {
                    F[K] = []
                }
                if (F[K].length > 0) {
                    D = F[K][F[K].length - 1];
                    D.isLastNode = false
                }
                F[K].splice(F[K].length, 0, P);
                P.isLastNode = true;
                P.isFirstNode = (F[K].length == 1)
            } else {
                if (F.isFirstNode && E == p.move.TYPE_PREV) {
                    C[K].splice(V, 0, P);
                    D = F;
                    D.isFirstNode = false;
                    P.parentTId = F.parentTId;
                    P.isFirstNode = true;
                    P.isLastNode = false
                } else {
                    if (F.isLastNode && E == p.move.TYPE_NEXT) {
                        C[K].splice(V + 1, 0, P);
                        D = F;
                        D.isLastNode = false;
                        P.parentTId = F.parentTId;
                        P.isFirstNode = false;
                        P.isLastNode = true
                    } else {
                        if (E == p.move.TYPE_PREV) {
                            C[K].splice(V, 0, P)
                        } else {
                            C[K].splice(V + 1, 0, P)
                        }
                        P.parentTId = F.parentTId;
                        P.isFirstNode = false;
                        P.isLastNode = false
                    }
                }
            }
            z.fixPIdKeyValue(M, P);
            z.setSonNodeLevel(M, P.getParentNode(), P);
            i.setNodeLineIcos(M, P);
            i.repairNodeLevelClass(M, P, X);
            if (!M.data.keep.parent && U[K].length < 1) {
                U.isParent = false;
                U.open = false;
                var N = f("#" + U.tId + p.id.UL), Q = f("#" + U.tId + p.id.SWITCH), L = f("#" + U.tId + p.id.ICON);
                i.replaceSwitchClass(U, Q, p.folder.DOCU);
                i.replaceIcoClass(U, L, p.folder.DOCU);
                N.css("display", "none")
            } else {
                if (Z) {
                    i.setNodeLineIcos(M, Z)
                }
            }
            if (D) {
                i.setNodeLineIcos(M, D)
            }
            if (!!M.check && M.check.enable && i.repairChkClass) {
                i.repairChkClass(M, U);
                i.repairParentChkClassWithSelf(M, U);
                if (U != P.parent) {
                    i.repairParentChkClassWithSelf(M, P)
                }
            }
            if (!G) {
                i.expandCollapseParentNode(M, P.getParentNode(), true, aa)
            }
        }, removeEditBtn: function (C) {
            f("#" + C.tId + p.id.EDIT).unbind().remove()
        }, removeRemoveBtn: function (C) {
            f("#" + C.tId + p.id.REMOVE).unbind().remove()
        }, removeTreeDom: function (C, D) {
            D.isHover = false;
            i.removeEditBtn(D);
            i.removeRemoveBtn(D);
            u.apply(C.view.removeHoverDom, [C.treeId, D])
        }, repairNodeLevelClass: function (D, F, E) {
            if (E === F.level) {
                return
            }
            var G = f("#" + F.tId), J = f("#" + F.tId + p.id.A), I = f("#" + F.tId + p.id.UL),
                C = p.className.LEVEL + E, H = p.className.LEVEL + F.level;
            G.removeClass(C);
            G.addClass(H);
            J.removeClass(C);
            J.addClass(H);
            I.removeClass(C);
            I.addClass(H)
        }
    }, s = {tools: h, view: d, event: g, data: o};
    f.extend(true, f.fn.zTree.consts, B);
    f.extend(true, f.fn.zTree._z, s);
    var b = f.fn.zTree, u = b._z.tools, p = b.consts, i = b._z.view, z = b._z.data, r = b._z.event;
    z.exSetting(l);
    z.addInitBind(m);
    z.addInitUnBind(y);
    z.addInitCache(c);
    z.addInitNode(v);
    z.addInitProxy(n);
    z.addInitRoot(w);
    z.addZTreeTools(j);
    var t = i.cancelPreSelectedNode;
    i.cancelPreSelectedNode = function (E, F) {
        var G = z.getRoot(E).curSelectedList;
        for (var D = 0, C = G.length; D < C; D++) {
            if (!F || F === G[D]) {
                i.removeTreeDom(E, G[D]);
                if (F) {
                    break
                }
            }
        }
        if (t) {
            t.apply(i, arguments)
        }
    };
    var x = i.createNodes;
    i.createNodes = function (E, F, D, C) {
        if (x) {
            x.apply(i, arguments)
        }
        if (!D) {
            return
        }
        if (i.repairParentChkClassWithSelf) {
            i.repairParentChkClassWithSelf(E, C)
        }
    };
    var q = i.makeNodeUrl;
    i.makeNodeUrl = function (C, D) {
        return C.edit.enable ? null : (q.apply(i, arguments))
    };
    var a = i.removeNode;
    i.removeNode = function (D, E) {
        var C = z.getRoot(D);
        if (C.curEditNode === E) {
            C.curEditNode = null
        }
        if (a) {
            a.apply(i, arguments)
        }
    };
    var A = i.selectNode;
    i.selectNode = function (E, F, D) {
        var C = z.getRoot(E);
        if (z.isSelectedNode(E, F) && C.curEditNode == F && F.editNameFlag) {
            return false
        }
        if (A) {
            A.apply(i, arguments)
        }
        i.addHoverDom(E, F);
        return true
    };
    var e = u.uCanDo;
    u.uCanDo = function (D, E) {
        var C = z.getRoot(D);
        if (E && (u.eqs(E.type, "mouseover") || u.eqs(E.type, "mouseout") || u.eqs(E.type, "mousedown") || u.eqs(E.type, "mouseup"))) {
            return true
        }
        return (!C.curEditNode) && (e ? e.apply(i, arguments) : true)
    }
})(jQuery);
(function (e) {
    var r = function (w, A, z, u, y, v, x) {
        if (typeof z.isHidden == "string") {
            z.isHidden = q.eqs(z.isHidden, "true")
        }
        z.isHidden = !!z.isHidden;
        s.initHideForExCheck(w, z)
    }, a = function (v, w, u) {
    }, h = function (w, v) {
        v.showNodes = function (x, y) {
            g.showNodes(w, x, y)
        };
        v.showNode = function (y, x) {
            if (!y) {
                return
            }
            g.showNodes(w, [y], x)
        };
        v.hideNodes = function (x, y) {
            g.hideNodes(w, x, y)
        };
        v.hideNode = function (y, x) {
            if (!y) {
                return
            }
            g.hideNodes(w, [y], x)
        };
        var u = v.checkNode;
        if (u) {
            v.checkNode = function (z, y, A, x) {
                if (!!z && !!z.isHidden) {
                    return
                }
                u.apply(v, arguments)
            }
        }
    }, j = {
        initHideForExCheck: function (u, v) {
            if (v.isHidden && u.check && u.check.enable) {
                if (typeof v._nocheck == "undefined") {
                    v._nocheck = !!v.nocheck;
                    v.nocheck = true
                }
                v.check_Child_State = -1;
                if (g.repairParentChkClassWithSelf) {
                    g.repairParentChkClassWithSelf(u, v)
                }
            }
        }, initShowForExCheck: function (v, w) {
            if (!w.isHidden && v.check && v.check.enable) {
                if (typeof w._nocheck != "undefined") {
                    w.nocheck = w._nocheck;
                    delete w._nocheck
                }
                if (g.setChkClass) {
                    var u = e("#" + w.tId + k.id.CHECK);
                    g.setChkClass(v, u, w)
                }
                if (g.repairParentChkClassWithSelf) {
                    g.repairParentChkClassWithSelf(v, w)
                }
            }
        }
    }, c = {
        clearOldFirstNode: function (u, v) {
            var w = v.getNextNode();
            while (!!w) {
                if (w.isFirstNode) {
                    w.isFirstNode = false;
                    g.setNodeLineIcos(u, w);
                    break
                }
                if (w.isLastNode) {
                    break
                }
                w = w.getNextNode()
            }
        }, clearOldLastNode: function (u, v) {
            var w = v.getPreNode();
            while (!!w) {
                if (w.isLastNode) {
                    w.isLastNode = false;
                    g.setNodeLineIcos(u, w);
                    break
                }
                if (w.isFirstNode) {
                    break
                }
                w = w.getPreNode()
            }
        }, makeDOMNodeMainBefore: function (u, v, w) {
            u.push("<li ", (w.isHidden ? "style='display:none;' " : ""), "id='", w.tId, "' class='", k.className.LEVEL, w.level, "' tabindex='0' hidefocus='true' treenode>")
        }, showNode: function (v, w, u) {
            w.isHidden = false;
            s.initShowForExCheck(v, w);
            e("#" + w.tId).show()
        }, showNodes: function (C, u, D) {
            if (!u || u.length == 0) {
                return
            }
            var x = {}, A, z;
            for (A = 0, z = u.length; A < z; A++) {
                var w = u[A];
                if (!x[w.parentTId]) {
                    var y = w.getParentNode();
                    x[w.parentTId] = (y === null) ? s.getRoot(C) : w.getParentNode()
                }
                g.showNode(C, w, D)
            }
            for (var B in x) {
                var v = x[B][C.data.key.children];
                g.setFirstNodeForShow(C, v);
                g.setLastNodeForShow(C, v)
            }
        }, hideNode: function (v, w, u) {
            w.isHidden = true;
            w.isFirstNode = false;
            w.isLastNode = false;
            s.initHideForExCheck(v, w);
            g.cancelPreSelectedNode(v, w);
            e("#" + w.tId).hide()
        }, hideNodes: function (C, u, D) {
            if (!u || u.length == 0) {
                return
            }
            var x = {}, A, z;
            for (A = 0, z = u.length; A < z; A++) {
                var w = u[A];
                if ((w.isFirstNode || w.isLastNode) && !x[w.parentTId]) {
                    var y = w.getParentNode();
                    x[w.parentTId] = (y === null) ? s.getRoot(C) : w.getParentNode()
                }
                g.hideNode(C, w, D)
            }
            for (var B in x) {
                var v = x[B][C.data.key.children];
                g.setFirstNodeForHide(C, v);
                g.setLastNodeForHide(C, v)
            }
        }, setFirstNode: function (v, u) {
            var x = v.data.key.children, w = u[x].length;
            if (w > 0 && !u[x][0].isHidden) {
                u[x][0].isFirstNode = true
            } else {
                if (w > 0) {
                    g.setFirstNodeForHide(v, u[x])
                }
            }
        }, setLastNode: function (v, u) {
            var x = v.data.key.children, w = u[x].length;
            if (w > 0 && !u[x][0].isHidden) {
                u[x][w - 1].isLastNode = true
            } else {
                if (w > 0) {
                    g.setLastNodeForHide(v, u[x])
                }
            }
        }, setFirstNodeForHide: function (x, u) {
            var y, w, v;
            for (w = 0, v = u.length; w < v; w++) {
                y = u[w];
                if (y.isFirstNode) {
                    break
                }
                if (!y.isHidden && !y.isFirstNode) {
                    y.isFirstNode = true;
                    g.setNodeLineIcos(x, y);
                    break
                } else {
                    y = null
                }
            }
            return y
        }, setFirstNodeForShow: function (y, v) {
            var A, x, w, z, u;
            for (x = 0, w = v.length; x < w; x++) {
                A = v[x];
                if (!z && !A.isHidden && A.isFirstNode) {
                    z = A;
                    break
                } else {
                    if (!z && !A.isHidden && !A.isFirstNode) {
                        A.isFirstNode = true;
                        z = A;
                        g.setNodeLineIcos(y, A)
                    } else {
                        if (z && A.isFirstNode) {
                            A.isFirstNode = false;
                            u = A;
                            g.setNodeLineIcos(y, A);
                            break
                        } else {
                            A = null
                        }
                    }
                }
            }
            return {"new": z, old: u}
        }, setLastNodeForHide: function (w, u) {
            var x, v;
            for (v = u.length - 1; v >= 0; v--) {
                x = u[v];
                if (x.isLastNode) {
                    break
                }
                if (!x.isHidden && !x.isLastNode) {
                    x.isLastNode = true;
                    g.setNodeLineIcos(w, x);
                    break
                } else {
                    x = null
                }
            }
            return x
        }, setLastNodeForShow: function (y, v) {
            var A, x, w, z, u;
            for (x = v.length - 1; x >= 0; x--) {
                A = v[x];
                if (!z && !A.isHidden && A.isLastNode) {
                    z = A;
                    break
                } else {
                    if (!z && !A.isHidden && !A.isLastNode) {
                        A.isLastNode = true;
                        z = A;
                        g.setNodeLineIcos(y, A)
                    } else {
                        if (z && A.isLastNode) {
                            A.isLastNode = false;
                            u = A;
                            g.setNodeLineIcos(y, A);
                            break
                        } else {
                            A = null
                        }
                    }
                }
            }
            return {"new": z, old: u}
        }
    }, n = {view: c, data: j};
    e.extend(true, e.fn.zTree._z, n);
    var b = e.fn.zTree, q = b._z.tools, k = b.consts, g = b._z.view, s = b._z.data, o = b._z.event;
    s.addInitNode(r);
    s.addBeforeA(a);
    s.addZTreeTools(h);
    var d = s.initNode;
    s.tmpHideParent = -1;
    s.initNode = function (C, u, y, z, B, A, w) {
        if (s.tmpHideParent !== z) {
            s.tmpHideParent = z;
            var x = (z) ? z : s.getRoot(C), v = x[C.data.key.children];
            s.tmpHideFirstNode = g.setFirstNodeForHide(C, v);
            s.tmpHideLastNode = g.setLastNodeForHide(C, v);
            g.setNodeLineIcos(C, s.tmpHideFirstNode);
            g.setNodeLineIcos(C, s.tmpHideLastNode)
        }
        B = (s.tmpHideFirstNode === y);
        A = (s.tmpHideLastNode === y);
        if (d) {
            d.apply(s, arguments)
        }
        if (A) {
            g.clearOldLastNode(C, y)
        }
    };
    var p = s.makeChkFlag;
    if (!!p) {
        s.makeChkFlag = function (u, v) {
            if (!!v && !!v.isHidden) {
                return
            }
            p.apply(s, arguments)
        }
    }
    var f = s.getTreeCheckedNodes;
    if (!!f) {
        s.getTreeCheckedNodes = function (w, u, x, v) {
            if (!!u && u.length > 0) {
                var y = u[0].getParentNode();
                if (!!y && !!y.isHidden) {
                    return []
                }
            }
            return f.apply(s, arguments)
        }
    }
    var l = s.getTreeChangeCheckedNodes;
    if (!!l) {
        s.getTreeChangeCheckedNodes = function (w, u, v) {
            if (!!u && u.length > 0) {
                var x = u[0].getParentNode();
                if (!!x && !!x.isHidden) {
                    return []
                }
            }
            return l.apply(s, arguments)
        }
    }
    var m = g.expandCollapseSonNode;
    if (!!m) {
        g.expandCollapseSonNode = function (u, v, x, w, y) {
            if (!!v && !!v.isHidden) {
                return
            }
            m.apply(g, arguments)
        }
    }
    var t = g.setSonNodeCheckBox;
    if (!!t) {
        g.setSonNodeCheckBox = function (u, v, w, x) {
            if (!!v && !!v.isHidden) {
                return
            }
            t.apply(g, arguments)
        }
    }
    var i = g.repairParentChkClassWithSelf;
    if (!!i) {
        g.repairParentChkClassWithSelf = function (u, v) {
            if (!!v && !!v.isHidden) {
                return
            }
            i.apply(g, arguments)
        }
    }
})(jQuery);
(function (a) {
    a.extend(true, a.fn.zTree, {
        expandNodeByLevel: function (b, e) {
            if (!b) {
                return
            }
            if (typeof e != "number") {
                e = -1
            }
            var c = [];
            if (e == -1) {
                c = b.getNodesByParam("level", 0);
                if (c.length > 1) {
                    c = []
                }
            } else {
                for (var d = 0; d < e; d++) {
                    c = c.concat(b.getNodesByParam("level", d))
                }
            }
            for (var d = 0; d < c.length; d++) {
                b.expandNode(c[d], true, false, false)
            }
        }
    })
})(jQuery);