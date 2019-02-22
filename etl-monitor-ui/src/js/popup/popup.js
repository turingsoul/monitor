/**
 * Created by Administrator on 2017/3/20.
 */
import angular from 'angular';
import $ from 'jquery';
import './style/popup.css';
import './style/dbLink.css';
import './style/hadoopGroup.css';
import './style/inputTable.css';
import './style/outputTable.css';
import './style/hbaseInput.css';
import './style/sortRecord.css';

{
    "use strict";
    angular.module('etl/popup',[])
        .directive('popupDiv',()=>{
            const template = require('./popup.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    document.querySelector('.popup').style.display = 'none';
                },
                controller: ('$scope','folderFactory','$http',($scope,$http,$timeout)=> {
                    $scope.optionList = ["<", "=", "= ~NULL", "<>", ">=", ">", ">=", "LIKE", "BETWEEN", "IS NULL", "IS NOT NULL"];
                    $scope.initMain = (e) => {
                        $(".popup .popupItem").hide();
                        if(!e) return;
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.' + e).style.display = 'block';
                    };
                    $scope.close = () => {
                        $(".popup").hide();
                        $(".popup .popupItem").hide();
                    };
                    $scope.hopsName = (oldName, newName) => {
                        if ($scope.data.transformation) {
                            var hops = $scope.data.transformation.order.hop;

                            if (hops && $scope.isArray(hops)) {
                                for (var i = 0; i < hops.length; i++) {
                                    if (hops[i].from === oldName) {
                                        hops[i].from = newName;
                                    }
                                    if (hops[i].to === oldName) {
                                        hops[i].to = newName;
                                    }
                                }

                            } else if (hops) {
                                if (hops.from === oldName) {
                                    hops.from = newName;
                                }
                                if (hops.to === oldName) {
                                    hops.to = newName;
                                }
                            }

                        }
                    };
                    $scope.ifExistName = (oldName, newName) => {
                        if (oldName == newName) return true;
                        if ($scope.data.transformation) {
                            var nameList = {};
                            var steps = $scope.data.transformation.step;
                            for (var i = 0; i < steps.length; i++) {
                                nameList[steps[i].name] = 1;
                            }
                            if (nameList[newName]){
                                return false;
                            } else {
                                return true;
                            }
                        }
                    };
                    $scope.ifNameRule = (e) => {
                        var reg = /[\/\\]/g;
                        if (e.length === 0 || reg.test(e)) {
                            return true;
                        }
                        return false;
                    };
                    $scope.selectTr = (e, m) => {
                        $(".popup .active").removeClass("active");
                        $scope.index = e;
                        var all = document.querySelectorAll(m);
                        for(var i = 0; i < all.length; i++){
                            if(i == e + 1){
                                all[i].classList.add("active");
                            } else {
                                all[i].classList.remove("active");
                            }
                        }
                    };
                    $scope.isArray = (o) => {
                        return Object.prototype.toString.call(o) === '[object Array]';
                    };
                    $scope.isObject = (o) => {
                        return Object.prototype.toString.call(o) === '[object object]';
                    };
                    $scope.isLengthZero = (o) => {
                        if (o.length <= 0) return true;
                        return false;
                    }
                })
            }
        })
        .directive('dbLink',()=>{
            const template = require('./template/dblink.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller: ('$scope','folderFactory','$http',($scope,folderFactory)=> {
                    function init(){
                        $scope.connectName = '';
                        $scope.host = '';
                        $scope.databaseName = '';
                        $scope.port = '';
                        $scope.url = '';
                        $scope.qudong = '';
                        $scope.username = '';
                        $scope.username = '';
                        $scope.password = '';
                    }
                    $scope.typeList = [
                        {
                            name: 'MYSQL',
                            attribute: [
                                {
                                    code: "FORCE_IDENTIFIERS_TO_LOWERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "FORCE_IDENTIFIERS_TO_UPPERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "IS_CLUSTERED",
                                    attribute: "N"
                                },
                                {
                                    code: "PORT_NUMBER",
                                    attribute: ""
                                },
                                {
                                    code: "PRESERVE_RESERVED_WORD_CASE",
                                    attribute: ""
                                },
                                {
                                    code: "QUOTE_ALL_FIELDS",
                                    attribute: ""
                                },
                                {
                                    code: "STREAM_RESULTS",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_BOOLEAN_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_TIMESTAMP_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "USE_POOLING",
                                    attribute: ""
                                }
                            ]
                        },
                        {
                            name: 'GENERIC',
                            attribute: [
                                {
                                    code: "CUSTOM_DRIVER_CLASS",
                                    attribute: ""
                                },
                                {
                                    code: "CUSTOM_URL",
                                    attribute: ""
                                },
                                {
                                    code: "FORCE_IDENTIFIERS_TO_LOWERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "FORCE_IDENTIFIERS_TO_UPPERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "IS_CLUSTERED",
                                    attribute: "N"
                                },
                                {
                                    code: "PORT_NUMBER",
                                    attribute: ""
                                },
                                {
                                    code: "PRESERVE_RESERVED_WORD_CASE",
                                    attribute: ""
                                },
                                {
                                    code: "QUOTE_ALL_FIELDS",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_BOOLEAN_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_TIMESTAMP_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "USE_POOLING",
                                    attribute: ""
                                }
                            ]
                        },
                        {
                            name: 'HIVE2',
                            attribute: [
                                {
                                    code: "FORCE_IDENTIFIERS_TO_LOWERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "FORCE_IDENTIFIERS_TO_UPPERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "IS_CLUSTERED",
                                    attribute: "N"
                                },
                                {
                                    code: "PORT_NUMBER",
                                    attribute: ""
                                },
                                {
                                    code: "PRESERVE_RESERVED_WORD_CASE",
                                    attribute: ""
                                },
                                {
                                    code: "QUOTE_ALL_FIELDS",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_BOOLEAN_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_TIMESTAMP_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "USE_POOLING",
                                    attribute: ""
                                }
                            ]
                        },
                        {
                            name: 'ORACLE',
                            attribute: [
                                {
                                    code: "FORCE_IDENTIFIERS_TO_LOWERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "FORCE_IDENTIFIERS_TO_UPPERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "IS_CLUSTERED",
                                    attribute: "N"
                                },
                                {
                                    code: "PORT_NUMBER",
                                    attribute: ""
                                },
                                {
                                    code: "PRESERVE_RESERVED_WORD_CASE",
                                    attribute: ""
                                },
                                {
                                    code: "QUOTE_ALL_FIELDS",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_BOOLEAN_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_TIMESTAMP_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "USE_POOLING",
                                    attribute: ""
                                }
                            ]
                        },
                        {
                            name: 'MSSQL',
                            attribute: [
                                {
                                    code: "FORCE_IDENTIFIERS_TO_LOWERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "FORCE_IDENTIFIERS_TO_UPPERCASE",
                                    attribute: "N"
                                },
                                {
                                    code: "IS_CLUSTERED",
                                    attribute: "N"
                                },
                                {
                                    code: "PORT_NUMBER",
                                    attribute: ""
                                },
                                {
                                    code: "PRESERVE_RESERVED_WORD_CASE",
                                    attribute: ""
                                },
                                {
                                    code: "QUOTE_ALL_FIELDS",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_BOOLEAN_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "SUPPORTS_TIMESTAMP_DATA_TYPE",
                                    attribute: ""
                                },
                                {
                                    code: "USE_POOLING",
                                    attribute: ""
                                }
                            ]
                        }
                    ];
                    $scope.$on('dblink',(d,data)=>{
                        $scope.initMain(data.type);
                        if (data.data.transformation) {
                            $scope.allDb = data.data.transformation.connection
                        } else {
                            $scope.allDb = data.data.job.connection
                        }
                    });
                    $scope.checkInput = () => {

                    };
                    $scope.addDb = () => {
                        $scope.titleInfo = '新建数据源连接';
                        init();
                        $scope.dbType = 'MYSQL';
                        $scope.defaultAttribute = [
                            {
                                code: "FORCE_IDENTIFIERS_TO_LOWERCASE",
                                attribute: "N"
                            },
                            {
                                code: "FORCE_IDENTIFIERS_TO_UPPERCASE",
                                attribute: "N"
                            },
                            {
                                code: "IS_CLUSTERED",
                                attribute: "N"
                            },
                            {
                                code: "PORT_NUMBER",
                                attribute: ""
                            },
                            {
                                code: "PRESERVE_RESERVED_WORD_CASE",
                                attribute: ""
                            },
                            {
                                code: "QUOTE_ALL_FIELDS",
                                attribute: ""
                            },
                            {
                                code: "STREAM_RESULTS",
                                attribute: ""
                            },
                            {
                                code: "SUPPORTS_BOOLEAN_DATA_TYPE",
                                attribute: ""
                            },
                            {
                                code: "SUPPORTS_TIMESTAMP_DATA_TYPE",
                                attribute: ""
                            },
                            {
                                code: "USE_POOLING",
                                attribute: ""
                            }
                        ];
                        $scope.currentDb = {
                            access: "Native",
                            attributes: {attribute: $scope.defaultAttribute},
                            data_tablespace: "",
                            database: "",
                            index_tablespace: "",
                            name: "",
                            password: "",
                            port: "",
                            server: "",
                            servername: "",
                            type: "MYSQL",
                            username: ""
                        };
                        var cacheData = angular.copy($scope.currentDb);
                        $scope.cacheDatas.setData(cacheData);
                        $(".dbList").hide();
                        $(".connectDb").show();
                    };
                    function CacheData() {
                        this.getExtraData = function() {
                            return this.extradata;
                        };
                        this.setExtraData = function(data) {
                            this.extradata = data;
                        };
                        this.getData = function() {
                            return this.data;
                        };
                        this.setData = function(data) {
                            this.data = data;
                        }
                    }
                    $scope.cacheDatas = new CacheData();

                    //编辑数据源
                    $scope.editDb = () => {
                        if(!$scope.currentDb) return;
                        $scope.titleInfo = '编辑数据源连接';
                        init();
                        $(".dbList").hide();
                        $(".connectDb").show();
                        var cacheData = angular.copy($scope.currentDb);
                        $scope.cacheDatas.setData(cacheData);
                        $scope.connectName = cacheData.name;
                        $scope.databaseName = cacheData.database;
                        $scope.username = cacheData.username;
                        $scope.dbType = cacheData.type;
                        $scope.password = cacheData.password;
                        if (cacheData.type === 'GENERIC') {
                            for(var i = 0,len = cacheData.attributes.attribute.length; i < len; i++) {
                                if (cacheData.attributes.attribute[i].code === 'CUSTOM_URL') {
                                    $scope.url = cacheData.attributes.attribute[i].attribute;
                                }
                                if (cacheData.attributes.attribute[i].code === 'CUSTOM_DRIVER_CLASS') {
                                    $scope.qudong = cacheData.attributes.attribute[i].attribute;
                                }
                            }
                            $scope.visible = true;
                        } else {
                            $scope.host = cacheData.server;
                            $scope.port = cacheData.port;
                            $scope.visible =false;
                        }
                    };
                    $scope.setType = (e) => {
                        $scope.dbType = e.name;
                        $scope.defaultAttribute = e.attribute;
                        if (e.name === 'GENERIC') {
                            $scope.visible = true;
                        } else {
                            $scope.visible = false;
                        }

                        var data= $scope.cacheDatas.getData();
                        var reg = new  RegExp(data.type, 'i');
                        for (var i = 0, len = data.attributes.attribute.length; i < len; i++) {
                            data.attributes.attribute[i].code = data.attributes.attribute[i].code.replace(reg, $scope.dbType);
                        }
                        data.type = $scope.dbType;
                        $scope.cacheDatas.setData(data);
                    };
                    //高级设置
                    //高级属性
                    function extraAttr(data){
                        this.data = data;
                        this.getData = function(){
                            return this.data;
                        };
                        this.getAtrr1 = function(type){
                            for (var i = 0, len = this.data.length; i < len; i ++ ) {
                                if (this.data[i].code === type) {
                                    return (this.data[i].attribute === "Y") ? true : false;
                                }
                            }
                        };
                        this.getAtrr2 = function(e){
                            var array = [];
                            var partten = new  RegExp(e, 'i');
                            for (var j = 0, jlen = this.data.length; j < jlen; j ++ ) {
                                if (partten.test(this.data[j].code)) {
                                    var cacheData = {
                                        name : this.data[j].code.split(partten)[1],
                                        content : this.data[j].attribute
                                    };
                                    array[array.length] = cacheData;
                                }
                            }
                            return array;
                        };
                        this.setAttr1 = function(type ,boolean){
                            for (var k = 0, klen = this.data.length; k < klen; k ++ ) {
                                if (this.data[k].code === type) {
                                    var res =  (boolean) ? 'Y' : 'N';
                                    this.data[k].attribute = res;
                                }
                            }
                        };
                        this.setAttr2 = function(data){
                            for (var m = 0, mlen = this.data.length; m < mlen; m ++ ) {
                                if (this.data[m].code === data.code) {
                                    this.data[m].attribute = data.attribute;
                                    return ;
                                }
                            }
                            this.data.push(data);
                        }
                    }
                    //获取高级设置
                    $scope.advanceSet = () => {
                        document.querySelector('.hide-box').classList.remove('hide');
                        document.querySelector('.advanced-set').classList.remove('hide');
                        document.querySelector('.alert-box ').classList.add('hide');
                        var cacheData = $scope.cacheDatas.getExtraData();
                        var extraData;
                        if (cacheData) {
                            extraData = new extraAttr(cacheData);
                        } else {
                            extraData = new extraAttr($scope.cacheDatas.getData().attributes.attribute);
                        }
                        $scope.toLowerCase = extraData.getAtrr1('FORCE_IDENTIFIERS_TO_LOWERCASE');
                        $scope.toUpperCase = extraData.getAtrr1('FORCE_IDENTIFIERS_TO_UPPERCASE');
                        $scope.quoteAllFields = extraData.getAtrr1('QUOTE_ALL_FIELDS');
                        $scope.tr = extraData.getAtrr2('EXTRA_OPTION_' + $scope.cacheDatas.getData().type + '.');
                    };
                    //保存高级设置
                    $scope.saveExtraData = () => {
                        var extraData = new extraAttr($scope.cacheDatas.getData().attributes.attribute);
                        extraData.setAttr1('FORCE_IDENTIFIERS_TO_LOWERCASE', $scope.toLowerCase);
                        extraData.setAttr1('FORCE_IDENTIFIERS_TO_UPPERCASE', $scope.toUpperCase);
                        extraData.setAttr1('QUOTE_ALL_FIELDS', $scope.quoteAllFields);
                        for (var i = 0, len = $scope.tr.length; i < len; i ++) {
                            var data = {
                                code: 'EXTRA_OPTION_' + $scope.currentDb.type + '.' + $scope.tr[i].name,
                                attribute: $scope.tr[i].content
                            };
                            extraData.setAttr2(data);
                        }
                        var extraAttrs = extraData.getData();
                        $scope.cacheDatas.setExtraData(extraAttrs);
                        document.querySelector('.hide-box').classList.add('hide');
                    };
                    $scope.closeAlert = () => {
                        document.querySelector('.hide-box').classList.add('hide');
                    };
                    //添加高级设置参数
                    $scope.addArgs=()=>{
                        var node={"name" : "", "content" : ""};
                        $scope.tr.push(node);
                    };
                    $scope.removeArgs=()=>{
                        $scope.tr.splice($scope.index,1);
                    };
                    $scope.selectThis = (currentData, index) => {
                        $scope.dbIndex = index;
                        $scope.currentDb = currentData;
                    };
                    $scope.dbDelet = () => {
                        var f = function() {
                            var url = '/etl-monitor/api/kettle/deleteDatabase?databaseName='+ $scope.allDb[$scope.dbIndex].name +'';
                            folderFactory.XHR1('get', url)
                                .then((data)=> {
                                    if (data) {
                                        $scope.allDb.splice($scope.dbIndex, 1);
                                        $scope.alertTip('删除成功！');
                                    }
                                }, (data)=> {
                                    return false;
                                });
                            return 'ownTips';
                        };
                        var data = {
                            title: '删除确认',
                            content: '所有使用了该连接的组件将无法正常工作！确定要删除连接'+ $scope.currentDb.name +'吗？',
                            fun: f
                        };
                        $scope.alertDel(data);
                    };
                    $scope.complete = () => {
                        $scope.currentDb = $scope.cacheDatas.getData();
                        if(linkArg($scope.currentDb, 'complete')) return;
                        var conNameList = {};
                        for (var i = 0, len = $scope.allDb.length; i < len; i++) {
                            conNameList[$scope.allDb[i].name] = 1;
                        }
                        if(conNameList[$scope.connectName] == 1 && $scope.connectName !== $scope.currentDb.name) {
                            $scope.alertTip('连接名称重复！');
                            return;
                        }
                        $scope.currentDb.name = $scope.connectName;
                        $scope.currentDb.username = $scope.username;
                        $scope.currentDb.password = $scope.password;
                        if ($scope.currentDb.type === 'GENERIC') {
                            if($scope.currentDb.attributes.attribute[0].code === 'CUSTOM_DRIVER_CLASS'){
                                $scope.currentDb.attributes.attribute[0].attribute = $scope.qudong;
                                $scope.currentDb.attributes.attribute[1].attribute = $scope.url;
                            } else {
                                var qudong = {
                                    attribute: $scope.qudong,
                                    code: 'CUSTOM_DRIVER_CLASS'
                                };
                                var url = {
                                    attribute: $scope.url,
                                    code: 'CUSTOM_URL'
                                };
                                $scope.currentDb.attributes.attribute.unshift(url);
                                $scope.currentDb.attributes.attribute.unshift(qudong);
                            }
                        } else {
                            $scope.currentDb.port = $scope.port;
                            $scope.currentDb.database = $scope.databaseName;
                            $scope.currentDb.server = $scope.host;
                        }
                        for (var i = 0; i < $scope.currentDb.attributes.attribute.length; i ++) {
                            if ($scope.currentDb.attributes.attribute[i].code == 'PORT_NUMBER') {
                                $scope.currentDb.attributes.attribute[i].attribute = $scope.port;
                            }
                        }
                        var urlDatabase;
                        var doInfo;
                        if($scope.ifEdit()) {
                            $scope.allDb[$scope.dbIndex] = $scope.currentDb;
                            $scope.loading();
                            urlDatabase = "/etl-monitor/api/kettle/updateDatabase";
                            doInfo = '编辑'
                        } else {
                            $scope.allDb.push($scope.currentDb);
                            urlDatabase = "/etl-monitor/api/kettle/createDatabase";
                            doInfo = '新建'
                        }
                        folderFactory.XHR1('post', urlDatabase, 'connection=' + encodeURI(JSON.stringify($scope.currentDb)))
                            .then((data)=> {
                                $scope.closeLoading();
                                $scope.alertTip(doInfo + "成功！");
                            }, (data)=> {
                                $scope.closeLoading();
                                $scope.alertTip('网络错误，请刷新后重新再试！');
                            });
                        $scope.closeDb();
                    };
                    $scope.closeDb = () => {
                        $(".dbList").show();
                        $(".connectDb").hide();
                        $scope.cacheDatas.setExtraData(null);
                        $scope.cacheDatas.setData(null);
                    };
                    function linkArg(data, type) {
                        var warningInfo = "不能为空";
                        var args = {
                            connectName: {
                                value: $scope.connectName,
                                warning: "连接名称"
                            },
                            username: {
                                value: $scope.username,
                                warning: "用户名"
                            }
                            //password: {
                            //    value: $scope.password,
                            //    warning: "密码"
                            //}
                        };
                        if(data.type === 'GENERIC') {
                            args.qudong = {
                                value: $scope.qudong,
                                warning: "自定义驱动类型名"
                            };
                            args.url = {
                                value: $scope.url,
                                warning: "自定义链接"
                            };
                        } else {
                            args.port = {
                                value: $scope.port,
                                warning: "端口号"
                            };
                            args.database = {
                                value: $scope.databaseName,
                                warning: "数据库名"
                            };
                            args.server = {
                                value: $scope.host,
                                warning: "主机名"
                            };
                        }
                        if (type == 'complete'){
                            args.password = {
                                value: $scope.password,
                                    warning: "密码"
                            }
                        }
                        for (var key in args) {
                            if(args[key].value.length == 0){
                                $scope.alertTip(args[key].warning + warningInfo);
                                return true;
                            } else if(key == 'connectName') {
                                var reg = /[\/\\]/g;
                                if (reg.test(args[key].value)) {
                                    $scope.alertTip(args[key].warning + '不能包含\/');
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    $scope.testLink = () => {
                        var currentDb = $scope.cacheDatas.getData();
                        if(linkArg(currentDb,"test")) return;
                        var conNameList = {};
                        for (var i = 0, len = $scope.allDb.length; i < len; i++) {
                            conNameList[$scope.allDb[i].name] = 1;
                        }                        if(conNameList[$scope.connectName] == 1 && $scope.connectName !== currentDb.name) {
                            $scope.alertTip('连接名称重复！');
                            return;
                        }
                        for (var i = 0; i < currentDb.attributes.attribute.length; i++) {
                            if(currentDb.attributes.attribute[i].code === "PORT_NUMBER"){
                                currentDb.attributes.attribute[i].attribute = $scope.port;
                            }
                        }
                        currentDb.name = $scope.connectName;
                        currentDb.username = $scope.username;
                        currentDb.password = $scope.password;
                        if (currentDb.type === 'GENERIC') {
                            if($scope.currentDb.attributes.attribute[0].code === 'CUSTOM_DRIVER_CLASS'){
                                $scope.currentDb.attributes.attribute[0].attribute = $scope.qudong;
                                $scope.currentDb.attributes.attribute[1].attribute = $scope.url;
                            } else {
                                var qudong = {
                                    attribute: $scope.qudong,
                                    code: 'CUSTOM_DRIVER_CLASS'
                                };
                                var url = {
                                    attribute: $scope.url,
                                    code: 'CUSTOM_URL'
                                };
                                $scope.currentDb.attributes.attribute.unshift(url);
                                $scope.currentDb.attributes.attribute.unshift(qudong);
                            }
                        } else {
                            currentDb.port = $scope.port;
                            currentDb.database = $scope.databaseName;
                            currentDb.server = $scope.host;
                        }
                        $scope.loading();
                        var url = "/etl-monitor/api/kettle/testConnection";
                        folderFactory.XHR1('post', url, 'connection=' + encodeURI(JSON.stringify(currentDb)))
                            .then((data)=> {
                                $scope.closeLoading();
                                if (data == 'true') {
                                    document.querySelector(".alert-box .alert-main p").innerHTML = "连接成功";
                                    document.querySelector(".alert-img").classList.add("bg1");
                                    document.querySelector(".alert-img").classList.remove("bg2");
                                } else {
                                    document.querySelector(".alert-box .alert-main p").innerHTML = "连接失败";
                                    document.querySelector(".alert-img").classList.add("bg2");
                                    document.querySelector(".alert-img").classList.remove("bg1");
                                }
                                document.querySelector('.hide-box').classList.remove('hide');
                                document.querySelector('.alert-box').classList.remove('hide');
                                document.querySelector('.advanced-set').classList.add('hide');
                            }, (data)=> {
                                $scope.closeLoading();
                                $scope.alertTip('网络错误，请刷新后重新再试！');
                            });
                    };
                    $scope.ifEdit = () => {
                        if ($scope.titleInfo === '编辑数据源连接') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                })
            }
        })
        .directive('hadoopGroup',()=>{
            const template = require('./template/hadoopGroup.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','folderFactory','$http',($scope,$http,$timeout,folderFactory)=> {
                    $scope.$on('hadoopList',function(d,data){
                        $scope.hadoopIndex = -1;
                        //弹出表连接对话框
                        $scope.initMain();
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.' +'hadoopGroup').style.display = 'block';
                        //hadoopList
                        $scope.myHadoopList = [];
                        //显示名称列表
                        folderFactory.XHR1('get', '/etl-monitor/api/kettle/getNamedClusters')
                            .then((data3)=> {
                                $scope.myHadoopList = data3;
                                $scope.hadoopIndex = -1;
                            }, (data1)=> {
                            })
                        /***************Start获取点击的那一行*******************/
                        $scope.getHadoopListOption = function(index){
                            $scope.hadoopIndex = index;
                        }
                        /***************End获取点击的那一行*******************/

                        /***************Start新建Hadoop*******************/

                        $scope.createNewHadoop = function(){
                            if ($scope.newItem.name.length == 0) {
                                $scope.alertTip("名称不能为空！");
                                return false;
                            }
                            //名称便利验重
                            var flag = 0;
                            for(var x of $scope.myHadoopList){
                                if(x.name == $scope.newItem.name){
                                    flag = 1;
                                }
                            }
                            if(flag==0){
                                //发送创建请求
                                var url = "/etl-monitor/api/kettle/createNamedCluster";
                                var data = $scope.newItem;
                                if($scope.NewItemMapr == true){
                                    $scope.newItem.attributes.mapr = "Y";
                                }else{
                                    $scope.newItem.attributes.mapr = "N";
                                }
                                folderFactory.XHR('post', url, data)
                                    .then((data)=> {

                                        //关闭对话框
                                        $(".HadoopList").show();
                                        $(".connectHadoop").hide();
                                        $scope.alertTip("创建成功");
                                        //返回新的列表
                                        folderFactory.XHR1('get', '/etl-monitor/api/kettle/getNamedClusters')
                                            .then((data3)=> {
                                                $scope.myHadoopList = data3;
                                                $scope.hadoopIndex = -1;
                                            }, (data1)=> {
                                            })
                                    },(data)=> {
                                        $scope.alertTip("创建失败");
                                    });

                            }else{
                                $scope.alertTip("集群名称已存在");
                            }

                        }
                        /***************End新建Hadoop*******************/
                    })

                    $scope.addHadoop = () => {
                            $scope.titleInfo = '添加Hadoop集群';
                            $(".HadoopList").hide();
                            $(".connectHadoop").show();
                            //创建新建集群的模型
                            $scope.item = {
                                "name":"",
                                "id":"",
                                "attributes":{
                                    "hdfsHost": "",
                                    "hdfsPassword": "",
                                    "hdfsPort": "",
                                    "hdfsUsername": "",
                                    "jobTrackerHost": "",
                                    "jobTrackerPort": "",
                                    "lastModifiedDate": "",
                                    "mapr": "",
                                    "name": "",
                                    "oozieUrl": "",
                                    "zooKeeperHost": "",
                                    "zooKeeperPort": ""
                                }
                            }
                            $scope.newItem = $scope.item;
                    };
                    /*************Start提交编辑************************/
                    $scope.makeSureEditHadoop = function(){
                        //名称便利验重
                        if ($scope.currentHadoop.name.length == 0) {
                            $scope.alertTip("集群名称名称不能为空！");
                            return false;
                        }
                        /*$scope.myHadoopList[$scope.hadoopIndex] = angular.copy($scope.currentHadoop);*/
                        var flag = 0;
                        if($scope.oldEditName != $scope.currentHadoop.name){
                            for(var x in $scope.myHadoopList){
                                if($scope.myHadoopList[x].name == $scope.currentHadoop.name&&$scope.hadoopIndex!=x){
                                    flag = 1;
                                }
                            }
                        }
                        if(flag==0){
                            //发送更新请求
                            var url = "/etl-monitor/api/kettle/updateNamedCluster?id="+$scope.currentHadoop.id;
                            var data = $scope.currentHadoop;
                             $scope.currentHadoop.attributes.mapr =  $scope.MyMapR == true? "Y":"N";
                            folderFactory.XHR('post', url, data)
                                .then((data)=> {
                                    //关闭对话框
                                    $(".HadoopList").show();
                                    $(".editMyHadoop").hide();
                                    $scope.alertTip("编辑成功");
                                    //返回新的列表
                                    folderFactory.XHR1('get', '/etl-monitor/api/kettle/getNamedClusters')
                                        .then((data3)=> {
                                            $scope.myHadoopList = data3;
                                            $scope.hadoopIndex = -1;
                                        }, (data1)=> {
                                        })
                                },(data)=> {
                                    $scope.alertTip("编辑失败");
                                });

                        }else{
                            $scope.alertTip("集群名称已存在");
                        }
                    }
                    /**************End提交编辑***********************/
                    $scope.closeHadoop = () => {
                        $(".HadoopList").show();
                        $(".connectHadoop").hide();
                    };
                    $scope.closeEditHadoop = () => {
                        $(".HadoopList").show();
                        $(".editMyHadoop").hide();
                    };
                    $scope.editHadoop = () => {
                        if($scope.hadoopIndex != -1){
                            $(".HadoopList").hide();
                            $(".editMyHadoop").show();
                            $scope.titleInfo = '编辑Hadoop集群';
                            //$scope.oldEditName = $scope.myHadoopList[$scope.hadoopIndex].name;
                            $scope.currentHadoop = angular.copy($scope.myHadoopList[$scope.hadoopIndex]);
                            $scope.MyMapR = $scope.currentHadoop.attributes.mapr ==  "Y" ?true:false;
                        }
                    };
                    $scope.deleteHadoop = function(){
                        if($scope.hadoopIndex != -1){
                            var f = function(){
                                folderFactory.XHR1('get', '/etl-monitor/api/kettle/deleteNamedCluster?id='+$scope.myHadoopList[$scope.hadoopIndex].id)
                                    .then((data3)=> {
                                        $scope.alertTip("删除集群成功");
                                        //返回新的列表
                                        //folderFactory.XHR1('get', '/etl-monitor/api/kettle/getNamedClusters')
                                        //    .then((data3)=> {
                                        //        $scope.myHadoopList = data3;
                                        //        $scope.hadoopIndex = -1;
                                        //    }, (data1)=> {
                                        //    })
                                        $scope.myHadoopList.splice($scope.hadoopIndex, 1);
                                    }, (data1)=> {
                                        $scope.alertTip("删除集群失败");
                                    })
                                return "ownTips";
                            };
                            var data = {
                                title: '删除确认',
                                content: '所有使用了该连接的组件将无法正常工作！确定要删除吗？',
                                fun: f
                            };
                            $scope.alertDel(data);
                        }
                    }
                })
            }
        })
        .directive('inputTable',()=>{
            const template = require('./template/inputTable.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','rootScope' ,'folderFactory','$http',($scope,$rootScope,$http,$timeout)=> {

                    $scope.$on('tableinput',function(d,data){
                        /*弹出表连接对话框*/
                        $scope.initMain();
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.' +'inputTable').style.display = 'block';

                        if (data.data.transformation) {
                            $scope.allDb = data.data.transformation.connection;
                            $scope.allDbList = [];
                            for(var o in data.data.transformation.connection){
                                $scope.allDbList.push(data.data.transformation.connection[o].name);
                            }
                        } else {
                            $scope.allDb = data.data.job.connection;
                            $scope.allDbList = [];
                            for(var o in data.data.job.connection){
                                $scope.allDbList.push(data.data.job.connection[o].name);
                            }
                        }
                        $scope.index = 0;
                        if(!$scope.isArray(data.data.transformation.step)) {
                            data.data.transformation.step = [data.data.transformation.step];
                        }
                        /*遍历找到表输入*/
                        for( var o in data.data.transformation.step){
                            if(data.data.transformation.step[o].type == "TableInput" && data.data.transformation.step[o].name == data.name){
                                $scope.index =  o;
                            }
                        }
                       $scope.dblinkContent = data.data.transformation.step[$scope.index].connection;
                        $scope.$apply();
                        /*inputTable SQL*/
                        $scope.inputTableSql = data.data.transformation.step[$scope.index].sql;
                        $scope.inputTableName = data.data.transformation.step[$scope.index].name;
                        $scope.inputTableOldName = data.data.transformation.step[$scope.index].name;
                        $scope.$apply();

                        /*$scope.inputTableSql = "sdfksajdflksajdflksajdflkdsajfsk";*/
                    })
                    /*监听保存按钮并且重绘*/
                    $scope.saveInputTable = function(){
                        /*遍历名字持否重复*/
                        if($scope.data.transformation.step[$scope.index].name == $scope.inputTableName){
                            $scope.data.transformation.step[$scope.index].connection = $scope.dblinkContent;
                            $scope.data.transformation.step[$scope.index].sql = $scope.inputTableSql;
                        }else{
                            var flag = true;
                            for(var o in $scope.data.transformation.step){
                                if($scope.data.transformation.step[o].name == $scope.inputTableName){
                                    if($scope.inputTableName == ""){
                                        $scope.alertTip("名称不能为空");
                                    }else{
                                        $scope.alertTip("名称不能重复");
                                    }
                                    flag = false;
                                    return false;
                                }
                                if($scope.ifNameRule($scope.inputTableName)) {
                                    $scope.alertTip("名称不能为空或者带有\/\\符号！");
                                    return false;
                                }
                            }
                            if(flag){
                                $scope.data.transformation.step[$scope.index].name = $scope.inputTableName;
                                $scope.data.transformation.step[$scope.index].connection = $scope.dblinkContent;
                                $scope.data.transformation.step[$scope.index].sql = $scope.inputTableSql;
                                /*遍历更改线路*/
                                $scope.hopsName($scope.inputTableOldName,$scope.inputTableName);
                            }
                        }
                        /*重绘*/
                        $scope.redrawCanvas();
                        $scope.close();
                    }
                })

            }
        })
        .directive('columnSplitting',()=>{
            const template = require('./template/columnSplitting.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','rootScope' ,'folderFactory','$http',($scope,$rootScope,$http,$timeout)=> {
                    $scope.$on('SplitFieldToRows3',function(d,data){
                        $scope.fieldData = data;
                        $scope.initMain(data.type);
                        $scope.fieldName = data.name;
                        $scope.splitfield = data.splitfield;
                        $scope.delimiter = data.delimiter;
                        $scope.newfield = data.newfield;
                        $scope.$apply();
                    });
                    $scope.fieldBtn = () => {
                        if($scope.ifNameRule($scope.fieldName)) {
                            $scope.alertTip('名称不能为空或者包含\/\\！');
                            return;
                        }
                        if ($scope.ifExistName($scope.fieldData.name, $scope.fieldName)) {
                            $scope.hopsName($scope.fieldData.name, $scope.fieldName);
                            $scope.fieldData.name = $scope.fieldName;
                            $scope.fieldData.splitfield = $scope.splitfield;
                            $scope.fieldData.delimiter = $scope.delimiter;
                            $scope.fieldData.newfield = $scope.newfield;
                            $scope.redrawCanvas();
                            $scope.close();
                        } else {
                            $scope.alertTip('名称不能重复！');
                        }
                    }
                })
            }
        })
        .directive('fieldSelection',()=>{
            const template = require('./template/fieldSelection.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','rootScope' ,'folderFactory','$http',($scope,$rootScope,$http,$timeout)=> {
                    $scope.$on('SelectValues',function(d,data){
                        $scope.fieldData = data;
                        $scope.fieldSelectionTable1 = [];
                        $scope.fieldSelectionTable2 = [];
                        $scope.initMain(data.type);
                        if (data.fields.field) {
                            if ($scope.isArray(data.fields.field)) {
                                for (var i = 0, len = data.fields.field.length; i < len; i++) {
                                    var item1 = {
                                        name: data.fields.field[i].name,
                                        rename: data.fields.field[i].rename,
                                        precision: data.fields.field[i].precision,
                                        length: data.fields.field[i].length
                                    };
                                    $scope.fieldSelectionTable1.push(item1);
                                }
                            } else {
                                var itemObj = {
                                    name: data.fields.field.name,
                                    rename: data.fields.field.rename,
                                    precision: data.fields.field.precision,
                                    length: data.fields.field.length
                                };
                                $scope.fieldSelectionTable1.push(itemObj);
                            }
                        }
                        if (data.fields.remove) {
                            if ($scope.isArray(data.fields.remove)) {
                                for (var j = 0, jlen = data.fields.remove.length; j < jlen; j++) {
                                    var item2 = {
                                        name: data.fields.remove[j].name
                                    };
                                    $scope.fieldSelectionTable2.push(item2);
                                }
                            } else {
                                var item2Obj = {
                                    name: data.fields.remove.name
                                };
                                $scope.fieldSelectionTable2.push(item2Obj);
                            }
                        }
                        $scope.fieldName = data.name;
                        $scope.$apply();
                    });
                    $scope.addSelectionTable1Arg = () => {
                        var item = {
                            name: "",
                            rename: "",
                            precision: "",
                            length: ""
                        };
                        $scope.fieldSelectionTable1.push(item);
                    };
                    $scope.removeSelectionTable1Arg = () => {
                        if ($(".fieldSelection .table1 .active").length <= 0) return;
                        $scope.fieldSelectionTable1.splice($scope.index,1);
                    };
                    $scope.addSelectionTable2Arg = () => {
                        var item = {
                            name: ""
                        };
                        $scope.fieldSelectionTable2.push(item);
                    };
                    $scope.removeSelectionTable2Arg = () => {
                        if ($(".fieldSelection .table2 .active").length <= 0) return;
                        $scope.fieldSelectionTable2.splice($scope.index,1);
                    };
                    $scope.saveSelection = () => {
                        var arr1 = [];
                        var arr2 = [];
                        if ($scope.ifExistName($scope.fieldData.name, $scope.fieldName)) {
                            if ($scope.ifNameRule($scope.fieldName)) {
                                $scope.alertTip('名称不能为空或者带有\/\\符号！');
                                return;
                            }
                            $scope.hopsName($scope.fieldData.name, $scope.fieldName);
                            $scope.fieldData.name = $scope.fieldName;
                            for (var i = 0; i < $scope.fieldSelectionTable1.length; i++) {
                                var item1 = {
                                    name: $scope.fieldSelectionTable1[i].name,
                                    rename: $scope.fieldSelectionTable1[i].rename,
                                    precision: $scope.fieldSelectionTable1[i].precision,
                                    length: $scope.fieldSelectionTable1[i].length
                                };
                                if (item1.name.length <= 0 && item1.rename.length <= 0 && item1.precision.length <= 0 && item1.length.length <= 0) continue;
                                arr1.push(item1);
                            }
                            for (var j = 0; j < $scope.fieldSelectionTable2.length; j++) {
                                if ($scope.fieldSelectionTable2[j].name.length <= 0) continue;
                                var item2 = {
                                    name: $scope.fieldSelectionTable2[j].name
                                };
                                arr2.push(item2);
                            }
                            $scope.fieldData.fields = {field: arr1, remove: arr2};
                            $scope.redrawCanvas();
                            $scope.close();
                        } else {
                            $scope.alertTip('名称不能重复！');
                        }
                    }
                })
            }
        })
        .directive('hbaseInput',()=>{
            const template = require('./template/hbaseInput.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','rootScope' ,'folderFactory','$http',($scope,$rootScope,$http,$timeout,folderFactory)=> {
                    $scope.$on('hbaseInput',function(d,data){

                        /*弹出表连接对话框*/
                        $scope.initMain();
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.' +'hbaseInput').style.display = 'block';
                        //单一组件处理
                        if(!$scope.isArray(data.data.transformation.step)) {
                            data.data.transformation.step = [data.data.transformation.step];
                        }
                        /**********StartHbase名称读取************/
                             //遍历找到hbase位置
                         $scope.index = 0;
                         for( var o in data.data.transformation.step){
                             if(data.data.transformation.step[o].type == "HBaseInput" && data.data.transformation.step[o].name == data.name){
                                 $scope.index =  o;
                             }
                         }
                         //读取hbaseInput名称
                         $scope.hbaseInputName = data.name;
                         //读取hbaseInput名称临时存储
                        console.log(data);
                         $scope.hbaseInputOldName = data.data.transformation.step[$scope.index].name;
                        /**********EndHbase名称读取************/
                        /*************Start获取hadoop列表*****/
                        $scope.myHadoopList = [];
                        //显示名称列表
                        $scope.loading();
                        folderFactory.XHR1('get', '/etl-monitor/api/kettle/getNamedClusters')
                            .then((data3)=> {
                                $scope.closeLoading();
                                //列表项验重
                                for(var o of data3){
                                    if(o.name!=data.data.transformation.step[$scope.index].cluster_name){
                                        $scope.myHadoopList.push(o.name);
                                    }
                                }
                                //获取文件自带的值,并且将其值打入hadoop列表
                                $scope.myHadoopList.push(data.data.transformation.step[$scope.index].cluster_name);
                                //展示默认的值
                                $scope.hadoopContent = data.data.transformation.step[$scope.index].cluster_name;
                                $scope.hadoopContentOld = data.data.transformation.step[$scope.index].cluster_name;
                                $scope.hadoopIndex = -1;
                                /****************Start获取hbase表名列表**********/
                                $scope.hbaseTableList = [];
                                //显示名称列表
                                if(data.data.transformation.step[$scope.index].cluster_name != ""&&data.data.transformation.step[$scope.index].cluster_name!="null"&&data.data.transformation.step[$scope.index].cluster_name!=null){
                                    folderFactory.XHR1('get', '/etl-monitor/api/kettle/getTables?clusterName='+data.data.transformation.step[$scope.index].cluster_name)
                                        .then((data3)=> {
                                            if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                                for(var o of data3){
                                                    if(o!=data.data.transformation.step[$scope.index].source_table_name){
                                                        $scope.hbaseTableList.push(o);
                                                    }
                                                }
                                            }else{
                                                $scope.hbaseTableList = data3;
                                            }
                                            //获取文件自带的值,并且将其值打入hadoop列表

                                            /*$scope.hbaseTableList.push({name:data.data.transformation.step[$scope.index].source_table_name});*/
                                            //展示默认的值
                                            if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                                $scope.hbaseTableContent = data.data.transformation.step[$scope.index].source_table_name;
                                            }else{
                                                $scope.hbaseTableContent = "";
                                            }

                                            $scope.hadoopIndex = -1;
                                            /****************Start获取hbase映射列表**********/
                                            $scope.hbaseMappingList = [];
                                            //显示名称列表
                                            if((data.data.transformation.step[$scope.index].cluster_name!=""&&data.data.transformation.step[$scope.index].cluster_name!=null&&data.data.transformation.step[$scope.index].cluster_name!="null")&&(data.data.transformation.step[$scope.index].source_table_name!=""&&data.data.transformation.step[$scope.index].source_table_name!="null"&&data.data.transformation.step[$scope.index].source_table_name!=null)){
                                                folderFactory.XHR1('get', '/etl-monitor/api/kettle/getMappingsForTable?clusterName='+data.data.transformation.step[$scope.index].cluster_name+"&tableName="+data.data.transformation.step[$scope.index].source_table_name)
                                                    .then((data2)=> {
                                                        $scope.hbaseMappingList = data2;
                                                        //获取文件自带的值,并且将其值打入hadoop列表
                                                        //获取文件自带的值,并且将其值打入hadoop列表
                                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                            $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                                            if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                                                $scope.hbaseMappingList.push("");
                                                            }
                                                        }else{
                                                            $scope.hbaseMappingList.push("");
                                                        }
                                                        //展示默认的值
                                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                            $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                                        }else{
                                                            $scope.hbaseMappingContent = "";
                                                        }
                                                        $scope.hadoopIndex = -1;
                                                    }, (data2)=> {
                                                    })
                                            }else{
                                                //获取文件自带的值,并且将其值打入hadoop列表
                                                //获取文件自带的值,并且将其值打入hadoop列表
                                                if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                    $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                                    if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                                        $scope.hbaseMappingList.push("");
                                                    }
                                                }else{
                                                    $scope.hbaseMappingList.push("");
                                                }
                                                //展示默认的值
                                                if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                    $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                                }else{
                                                    $scope.hbaseMappingContent = "";
                                                }
                                            }
                                            /****************End获取hbase映射列表**********/
                                        }, (data3)=> {
                                        })
                                }else{
                                    //获取文件自带的值,并且将其值打入hadoop列表
                                    if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                        $scope.hbaseTableList.push(data.data.transformation.step[$scope.index].source_table_name);
                                    }
                                    //展示默认的值
                                    if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                        $scope.hbaseTableContent = data.data.transformation.step[$scope.index].source_table_name;
                                    }else{
                                        $scope.hbaseTableContent = "";
                                    }
                                    $scope.hbaseMappingList = [];
                                    //获取文件自带的值,并且将其值打入hadoop列表
                                    if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                        $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                        if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                            $scope.hbaseMappingList.push("");
                                        }
                                    }else{
                                        $scope.hbaseMappingList.push("");
                                    }
                                    //展示默认的值
                                    if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                        $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                    }else{
                                        $scope.hbaseMappingContent = "";
                                    }
                                }

                                /****************End获取hbase表名列表**********/
                            }, (data3)=> {
                                $scope.closeLoading();
                            })
                        /****************End获取hadoop列表**********/




                        /*****************Start切换hadoop级联**********************/
                        $scope.changeItemOfHadoop = function(){

                            /****************Start获取hbase表名列表**********/
                            $scope.hbaseTableList = [];
                            //显示名称列表
                            if($scope.hadoopContent != ""&&$scope.hadoopContent != "null"&&$scope.hadoopContent != null){

                                $scope.loading();
                                folderFactory.XHR1('get', '/etl-monitor/api/kettle/getTables?clusterName='+$scope.hadoopContent)
                                    .then((data3)=> {
                                        $scope.closeLoading();
                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                            for(var o of data3){
                                                if(o!=data.data.transformation.step[$scope.index].source_table_name){
                                                    $scope.hbaseTableList.push(o);
                                                }
                                            }
                                        }else{
                                            $scope.hbaseTableList = data3;
                                        }
                                        //获取文件自带的值,并且将其值打入hadoop列表
                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                            $scope.hbaseTableList.push(data.data.transformation.step[$scope.index].source_table_name);
                                        }
                                        //展示默认的值
                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_table_name")){
                                            $scope.hbaseTableContent = data.data.transformation.step[$scope.index].source_table_name;
                                        }else{
                                            $scope.hbaseTableContent = "";
                                        }

                                        $scope.hadoopIndex = -1;
                                        //发送映射请求
                                        $scope.hbaseMappingList = [];
                                        //显示名称列表
                                        if(($scope.hadoopContent!=""&&$scope.hadoopContent!="null"&&$scope.hadoopContent!=null)&&($scope.hbaseTableContent!=""&&$scope.hbaseTableContent!="null"&&$scope.hbaseTableContent!=null)){
                                            folderFactory.XHR1('get', '/etl-monitor/api/kettle/getMappingsForTable?clusterName='+$scope.hadoopContent+"&tableName="+$scope.hbaseTableContent)
                                                .then((data3)=> {
                                                    $scope.hbaseMappingList = data3;
                                                    //获取文件自带的值,并且将其值打入hadoop列表
                                                    if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                        $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                                        if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                                            $scope.hbaseMappingList.push("");
                                                        }
                                                    }else{
                                                        $scope.hbaseMappingList.push("");
                                                    }
                                                    //展示默认的值
                                                    if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                        $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                                    }else{
                                                        $scope.hbaseMappingContent = "";
                                                    }
                                                    $scope.hadoopIndex = -1;
                                                }, (data3)=> {
                                                })
                                        }else{
                                            //获取文件自带的值,并且将其值打入hadoop列表
                                            if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                                if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                                    $scope.hbaseMappingList.push("");
                                                }
                                            }else{
                                                $scope.hbaseMappingList.push("");
                                            }
                                            //展示默认的值
                                            if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                            }else{
                                                $scope.hbaseMappingContent = "";
                                            }
                                        }
                                    }, (data3)=> {
                                        $scope.closeLoading();
                                    })
                            }else{
                                //获取文件自带的值,并且将其值打入hadoop列表
                                $scope.hbaseTableList.push(data.data.transformation.step[$scope.index].source_table_name);
                                //展示默认的值
                                $scope.hbaseTableContent = data.data.transformation.step[$scope.index].source_table_name;
                            }
                            /****************End获取hbase表名列表**********/

                        }
                        /*****************End切换hadoop级联************************/

                        /*****************Start切换hbase表级联************************/
                        $scope.changeTableOfHBasae = function(){
                            //发送映射请求
                            $scope.hbaseMappingList = [""];
                            //显示名称列表
                            if(($scope.hadoopContent!=""&&$scope.hadoopContent!=null&&$scope.hadoopContent!="null")&& ($scope.hbaseTableContent!=""&&$scope.hbaseTableContent!="null"&&$scope.hbaseTableContent!=null)){
                                $scope.loading();
                                folderFactory.XHR1('get', '/etl-monitor/api/kettle/getMappingsForTable?clusterName='+$scope.hadoopContent+"&tableName="+$scope.hbaseTableContent)
                                    .then((data3)=> {
                                        $scope.closeLoading();
                                        $scope.hbaseMappingList = data3;
                                        //获取文件自带的值,并且将其值打入hadoop列表
                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                            $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                            if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                                $scope.hbaseMappingList.push("");
                                            }
                                        }else{
                                            $scope.hbaseMappingList.push("");
                                        }
                                        //展示默认的值
                                        if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                            $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                        }else{
                                            $scope.hbaseMappingContent = "";
                                        }
                                        $scope.hadoopIndex = -1;
                                    }, (data3)=> {
                                        $scope.closeLoading();
                                    })
                            }else{
                                //获取文件自带的值,并且将其值打入hadoop列表
                                if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                    $scope.hbaseMappingList.push(data.data.transformation.step[$scope.index].source_mapping_name);
                                    if(data.data.transformation.step[$scope.index].source_mapping_name!=""){
                                        $scope.hbaseMappingList.push("");
                                    }
                                }else{
                                    $scope.hbaseMappingList.push("");
                                }
                                //展示默认的值
                                if(data.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                    $scope.hbaseMappingContent = data.data.transformation.step[$scope.index].source_mapping_name;
                                }else{
                                    $scope.hbaseMappingContent = "";
                                }

                            }
                        }

                        /*****************End切换hbase表级联************************/
                        /*****************Start保存hbase内容*****************/
                        $scope.saveHbaseContent = function(){
                            //保存名称
                            if($scope.ifNameRule($scope.hbaseInputName)) {
                                $scope.alertTip('名称不能为空或者包含\/\\！');
                                return;
                            }
                            if ($scope.ifExistName($scope.hbaseInputOldName, $scope.hbaseInputName)) {
                                $scope.hopsName($scope.hbaseInputOldName, $scope.hbaseInputName);
                                $rootScope.data.transformation.step[$scope.index].name = $scope.hbaseInputName;
                                $rootScope.data.transformation.step[$scope.index].cluster_name = $scope.hadoopContent;
                                $rootScope.data.transformation.step[$scope.index].source_table_name = $scope.hbaseTableContent;
                                $rootScope.data.transformation.step[$scope.index].source_mapping_name = $scope.hbaseMappingContent;
                                $scope.redrawCanvas();
                                $scope.close();
                            } else {
                                $scope.alertTip('名称不能重复！');
                            }
                        }
                        /*****************End保存hbase内容*****************/
                        /*********************Start 编辑映射***********************/
                        $scope.createMapping = function(){
                        }
                        /***********************End 编辑映射*********************/
                    })
                    /*打开映射*/
                    $scope.createSecondHbase = function(){
                        if($scope.hadoopContent!=""){
                            $scope.mappingArray1 = [];
                            if($scope.hbaseTableContent!=""){
                                document.querySelector(".hbaseInput .createSecondHbase").style.display = "block";
                            }else{
                                $scope.alertTip("请选择Hbase表名");
                            }
                        }else{
                            $scope.alertTip("请选择Hadoop集群");
                        }

                    }
                    /*打开编辑映射*/
                    $scope.editSecondHbase = function(){
                        if($scope.hadoopContent!=""){
                            if($scope.hbaseTableContent!=""){
                                document.querySelector(".hbaseInput .editSecondHbase").style.display = "block";
                                //发送请求端口
                                folderFactory.XHR1('get', '/etl-monitor/api/kettle/getMapping?clusterName='+$scope.hadoopContent+"&tableName="+$scope.hbaseTableContent+"&mappingName="+$scope.hbaseMappingContent)
                                    .then((data3)=> {
                                        console.log(data3);
                                        $scope.mappingArray = [];
                                        //将数据存储成数组
                                        for(var i in data3){
                                            //将boolean值转换为字符串
                                            if(data3[i].key == true){
                                                data3[i].key = "true";
                                            }else{
                                                data3[i].key = "false";
                                            }
                                            $scope.mappingArray.push(data3[i]);
                                        }
                                    }, (data3)=> {
                                    })
                            }else{
                                $scope.alertTip("请选择Hadoop表名");
                            }

                        }else{
                            $scope.alertTip("请选择Hadoop集群");
                    }



                    }
                    /*保存编辑映射*/
                    $scope.submitEditMapping = function(){
                        //先处理key的值为boolean
                        for(var o of $scope.mappingArray){
                            if(o.key == "true"){
                                o.key = true;
                            }else{
                                o.key = false;
                            }
                        }
                        var a = {};
                        for(var o of $scope.mappingArray){
                            a[o.alias] = o;
                        }
                        //发送确认编辑的接口
                        folderFactory.XHR('POST', '/etl-monitor/api/kettle/saveMapping?clusterName='+$scope.hadoopContent+'&tableName='+$scope.hbaseTableContent+'&mappingName='+$scope.hbaseMappingContent,a)
                        .then((data3)=> {
                            //关闭必要编辑窗口
                                if(data3==true||data3=="true"){
                                    $scope.alertTip("编辑成功");
                                }else if(data3 == "NoKeyDefined"){
                                    $scope.alertTip("请选择至少一个键为Y");
                                }else{
                                    $scope.alertTip("数据格式有误");
                                }

                            document.querySelector(".editSecondHbase").style.display = "none";
                        }, (data3)=> {
                            $scope.alertTip("编辑失败");
                            document.querySelector(".editSecondHbase").style.display = "none";
                        })
                    }
                    /*保存创建映射*/
                    $scope.submitCreateMapping = function(){
                        //先处理key的值为boolean
                        for(var o of $scope.mappingArray1){
                            if(o.key == "true"){
                                o.key = true;
                            }else{
                                o.key = false;
                            }
                        }
                        var a = {};
                        for(var o of $scope.mappingArray1){
                            a[o.alias] = o;
                        }
                        //发送确认编辑的接口
                        folderFactory.XHR('POST', '/etl-monitor/api/kettle/saveMapping?clusterName='+$scope.hadoopContent+'&tableName='+$scope.hbaseTableContent+'&mappingName='+$scope.hbaseMappingContent,a)
                            .then((data3)=> {
                                //关闭必要编辑窗口
                                if(data3==true||data3=="true"){
                                    $scope.alertTip("编辑成功");
                                }else if(data3 == "NoKeyDefined"){
                                    $scope.alertTip("请选择至少一个键为Y");
                                }else{
                                    $scope.alertTip("数据格式有误");
                                }
                                document.querySelector(".createSecondHbase").style.display = "none";
                                //发送映射请求
                                $scope.hbaseMappingList = [];
                                //显示名称列表
                                if(($scope.hadoopContent!=""&&$scope.hadoopContent!="null"&&$scope.hadoopContent!=null)&&($scope.hbaseTableContent!=""&&$scope.hbaseTableContent!="null"&&$scope.hbaseTableContent!=null)){
                                    folderFactory.XHR1('get', '/etl-monitor/api/kettle/getMappingsForTable?clusterName='+$scope.hadoopContent+"&tableName="+$scope.hbaseTableContent)
                                        .then((data3)=> {
                                            $scope.hbaseMappingList = data3;
                                            //获取文件自带的值,并且将其值打入hadoop列表
                                            if($rootScope.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                $scope.hbaseMappingList.push($rootScope.data.transformation.step[$scope.index].source_mapping_name);
                                                if($rootScope.data.transformation.step[$scope.index].source_mapping_name!=""){
                                                    $scope.hbaseMappingList.push("");
                                                }
                                            }else{
                                                $scope.hbaseMappingList.push("");
                                            }


                                            //展示默认的值
                                            if($rootScope.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                                $scope.hbaseMappingContent = $rootScope.data.transformation.step[$scope.index].source_mapping_name;
                                            }else{
                                                $scope.hbaseMappingContent = "";
                                            }
                                            $scope.hadoopIndex = -1;
                                        }, (data3)=> {
                                        })
                                }else{
                                    //获取文件自带的值,并且将其值打入hadoop列表
                                    if($rootScope.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                        $scope.hbaseMappingList.push($rootScope.data.transformation.step[$scope.index].source_mapping_name);
                                        if($rootScope.data.transformation.step[$scope.index].source_mapping_name!=""){
                                            $scope.hbaseMappingList.push("");
                                        }
                                    }else{
                                        $scope.hbaseMappingList.push("");
                                    }

                                    //展示默认的值
                                    if($rootScope.data.transformation.step[$scope.index].hasOwnProperty("source_mapping_name")){
                                        $scope.hbaseMappingContent = $rootScope.data.transformation.step[$scope.index].source_mapping_name;
                                    }else{
                                        $scope.hbaseMappingContent = "";
                                    }
                                }
                            }, (data3)=> {
                                $scope.alertTip("编辑失败");
                                document.querySelector(".createSecondHbase").style.display = "none";
                            })


                    }
                    /*关闭映射*/
                    $scope.closeSecondHbase = function(){
                        document.querySelector(".hbaseInput .createSecondHbase").style.display = "none";
                        document.querySelector(".hbaseInput .editSecondHbase").style.display = "none";
                    }
                    /*点击每一行映射*/
                    $scope.selectMappingTr = function(index){
                        $(".popup .mappingActive").removeClass("mappingActive");
                        $scope.mappingTrIndex = index;
                        var all = document.querySelectorAll(".mappingTr");
                        for(var i = 0; i < all.length; i++){
                            if(i == index){
                                all[i].classList.add("mappingActive");
                            } else {
                                all[i].classList.remove("mappingActive");
                            }
                        }
                    }
                    /*点击每一行映射*/
                    $scope.selectMappingTr1 = function(index){
                        $(".popup .mappingActive1").removeClass("mappingActive1");
                        $scope.mappingTrIndex1 = index;
                        var all = document.querySelectorAll(".mappingTr1");
                        for(var i = 0; i < all.length; i++){
                            if(i == index){
                                all[i].classList.add("mappingActive1");
                            } else {
                                all[i].classList.remove("mappingActive1");
                            }
                        }
                    }
                    /*删除选中的那一行*/
                    //添加新的列表
                    $scope.addNewMappingTr = function(){
                        var item = {
                            alias:"",
                            key:"false",
                            columnFamily:"",
                            columnName:"",
                            typeDesc:"String"
                        }
                        $scope.mappingArray.push(item);
                    }
                    //添加新的列表
                    $scope.addNewMappingTr1 = function(){
                        var item = {
                            alias:"",
                            key:"false",
                            columnFamily:"",
                            columnName:"",
                            typeDesc:"String"
                        }
                        $scope.mappingArray1.push(item);
                    }
                    //删除选中的列表
                    $scope.deleteMappingTr = function(){
                        $scope.mappingArray.splice($scope.mappingTrIndex,1);
                    }
                    //删除选中的列表
                    $scope.deleteMappingTr1 = function(){
                        $scope.mappingArray1.splice($scope.mappingTrIndex1,1);
                    }

                })
            }
        })
        .directive('insertUpdate',()=>{
            const template = require('./template/insertUpdate.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','rootScope' ,'folderFactory',($scope,folderFactory)=> {
                    function getConnection(list, connName){
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].name === connName) {
                                return list[i];
                            }
                        }
                        return "";
                    }
                    function getTablesInfos(lookup, conn) {
                        getSchemas(lookup, conn);
                    }
                    function getSchemas(lookup, conn) {
                        if(conn!=""){
                            folderFactory.XHR1('post', '/etl-monitor/api/kettle/retrieveSchemas', 'connection=' + encodeURI(JSON.stringify(conn)))
                                .then((data)=> {
                                    $scope.schemasList = data.length > 0 ? data : [""];
                                    if (lookup) {
                                        if($scope.schemasList.indexOf(lookup.schema) == -1){
                                            $scope.schemasList.push(lookup.schema);
                                        }
                                        $scope.schemaVal = lookup.schema;
                                        getTables(lookup.schema, lookup, conn);
                                    } else {
                                        if ($scope.schemasList.indexOf($scope.schemaVal) == -1) {
                                            $scope.schemasList.push($scope.schemaVal);
                                        }
                                        getTables($scope.schemaVal, undefined, conn);
                                        $scope.closeLoading();
                                    }
                                }, (data)=> {
                                    $scope.closeLoading();
                                    $scope.alertTip('网络请求错误，请稍后重试1！');
                                });
                        }else{
                            $scope.closeLoading();
                        }
                    }
                    function getTables(schemas, lookup, conn) {
                        folderFactory.XHR1('post', '/etl-monitor/api/kettle/getDatabaseTables?schema=' + schemas, 'connection=' + encodeURI(JSON.stringify(conn)))
                            .then((data)=> {
                                $scope.tableList = data.length > 0 ? data : [""];
                                if (lookup) {
                                    if($scope.tableList.indexOf(lookup.table) == -1){
                                        $scope.tableList.push(lookup.table);
                                    }
                                    $scope.tableVal = lookup.table;
                                    getTableFields(lookup.table, conn, lookup);
                                } else {
                                    if ($scope.tableList.indexOf($scope.tableVal) == -1) {
                                        $scope.tableList.push($scope.tableVal);
                                    }
                                    getTableFields($scope.tableVal, conn, undefined);
                                }
                                $scope.closeLoading();
                            }, (data)=> {
                                $scope.closeLoading();
                                $scope.alertTip('网络请求错误，请稍后重试2！');
                            });
                    }
                    function getTableFields(table, conn, lookup) {
                        folderFactory.XHR1('post', '/etl-monitor/api/kettle/getTableFields?table=' + table, 'connection=' + encodeURI(JSON.stringify(conn)))
                            .then((data)=> {
                                $scope.tableFieldList = data;
                                if (lookup) {
                                    $scope.conditonList = [];
                                    $scope.updateList = [];
                                    if (lookup.key) {
                                        if ($scope.isArray(lookup.key)) {
                                            for (var i = 0, len = lookup.key.length; i < len; i++) {
                                                var item1 = {
                                                    condition: lookup.key[i].condition,
                                                    field: lookup.key[i].field,
                                                    name: lookup.key[i].name,
                                                    tableFieldList: ""
                                                };
                                                if (data.indexOf(item1.field) == -1) {
                                                    item1.tableFieldList = data.concat(item1.field);
                                                } else {
                                                    item1.tableFieldList = data;
                                                }
                                                $scope.conditonList.push(item1);
                                            }
                                        } else {
                                            var itemObj = {
                                                condition: lookup.key.condition,
                                                field: lookup.key.field,
                                                name: lookup.key.name,
                                                tableFieldList: ""
                                            };
                                            if (data.indexOf(itemObj.field) == -1) {
                                                itemObj.tableFieldList = data.concat(itemObj.field);
                                            } else {
                                                itemObj.tableFieldList = data;
                                            }
                                            $scope.conditonList.push(itemObj);
                                        }
                                    }
                                    if (lookup.value) {
                                        if ($scope.isArray(lookup.value)) {
                                            for (var j = 0, jlen = lookup.value.length; j < jlen; j++) {
                                                var item2 = {
                                                    update: lookup.value[j].update,
                                                    rename: lookup.value[j].rename,
                                                    name: lookup.value[j].name,
                                                    tableFieldList: ""
                                                };
                                                if (data.indexOf(item2.name) == -1) {
                                                    item2.tableFieldList = data.concat(item2.name);
                                                } else {
                                                    item2.tableFieldList = data;
                                                }
                                                $scope.updateList.push(item2);
                                            }
                                        } else {
                                            var itemObj1 = {
                                                update: lookup.value.update,
                                                rename: lookup.value.rename,
                                                name: lookup.value.name,
                                                tableFieldList: ""
                                            };
                                            if (data.indexOf(itemObj1.name) == -1) {
                                                itemObj1.tableFieldList = data.concat(itemObj1.name);
                                            } else {
                                                itemObj1.tableFieldList = data;
                                            }
                                            $scope.updateList.push(itemObj1);
                                        }
                                    }
                                } else {
                                    if(!$scope.conditonList) {
                                        $scope.closeLoading();
                                        return;
                                    }
                                    for (var i = 0; i < $scope.conditonList.length; i++) {
                                        if(data.indexOf($scope.conditonList[i].field) == -1){
                                            $scope.conditonList[i].tableFieldList = data.concat($scope.conditonList[i].field)
                                        } else {
                                            $scope.conditonList[i].tableFieldList = data;
                                        }
                                    }
                                    if(!$scope.updateList) {
                                        $scope.closeLoading();
                                        return;
                                    }
                                    for (var j = 0; j < $scope.updateList.length; j++) {
                                        if(data.indexOf($scope.updateList[j].name) == -1){
                                            $scope.updateList[j].tableFieldList = data.concat($scope.updateList[j].name)
                                        } else {
                                            $scope.updateList[j].tableFieldList = data;
                                        }
                                    }
                                }
                                $scope.closeLoading();
                            }, (data)=> {
                                $scope.closeLoading();
                                $scope.alertTip('网络请求错误，请稍后重试3！');
                            });
                    }
                    $scope.$on('InsertUpdate',function(t,data){
                        $scope.loading();
                        $scope.initMain(data.type);
                        $scope.fieldData = data;
                        if (data.update_bypassed == 'N') {
                            $scope.update_bypassed = false;
                        } else {
                            $scope.update_bypassed = true;
                        }
                        $scope.dblist = $scope.data.transformation.connection;
                        $scope.schemasList = [data.lookup.schema];
                        $scope.tableVal = data.lookup.table;
                        $scope.tableList = [data.lookup.table];
                        $scope.fieldName = data.name;
                        $scope.schemaVal = data.lookup.schema;
                        $scope.connName = data.connection;
                        var lookup = data.lookup;
                        $scope.conditonList = [];
                        $scope.updateList = [];
                        if (data.connection.length <= 0) {
                            $scope.closeLoading();
                            $scope.$apply();
                            return;
                        };
                        var conn = getConnection($scope.dblist, data.connection);
                        console.log("aii");
                        console.log(conn);
                        getTablesInfos(lookup, conn);
                    });
                    $scope.changeUpdatePass = (e) => {
                        $scope.update_bypassed = e;
                    };
                    $scope.changeDb = (dbname) => {
                        $scope.loading();
                        var conn = getConnection($scope.dblist, dbname);
                        getSchemas(undefined, conn);
                    };
                    $scope.changeSchemas = (schema) => {
                        $scope.loading();
                        var conn = getConnection($scope.dblist, $scope.connName);
                        getTables(schema, undefined, conn);
                    };
                    $scope.changeTable = (table) => {
                        $scope.loading();
                        var conn = getConnection($scope.dblist, $scope.connName);
                        getTableFields(table, conn, undefined);
                    };
                    $scope.addConditon = () => {
                        if (!$scope.conditonList) $scope.conditonList = [];
                        var item = {
                            condition: "",
                            field: "",
                            name: "",
                            tableFieldList: $scope.tableFieldList
                        };
                        $scope.conditonList.push(item);
                    };
                    $scope.addUpdate = () => {
                        if (!$scope.updateList) $scope.updateList = [];
                        var item = {
                            update: "",
                            rename: "",
                            name: "",
                            tableFieldList: $scope.tableFieldList
                        };
                        $scope.updateList.push(item);
                    };
                    $scope.delUpdate = () => {
                        if($(".insertUpdate .updateTable .active").length <= 0) return;
                        $scope.updateList.splice($scope.index,1);
                    };
                    $scope.delConditon = () => {
                        if($(".insertUpdate .conditonTable .active").length <= 0) return;
                        $scope.conditonList.splice($scope.index,1);
                    };
                    $scope.saveInsertUpdate = () => {

                        var conditonArr = [];
                        var updateArr = [];
                        if ($scope.ifExistName($scope.fieldData.name, $scope.fieldName)) {
                            if ($scope.ifNameRule($scope.fieldName)) {
                                $scope.alertTip('名称不能为空或者带有\/\\符号！');
                                return;
                            }
                            $scope.hopsName($scope.fieldData.name, $scope.fieldName);

                            if ($scope.conditonList) {
                                for (var i = 0; i < $scope.conditonList.length; i++) {
                                    var item1 = {
                                        condition: $scope.conditonList[i].condition,
                                        field: $scope.conditonList[i].field,
                                        name: $scope.conditonList[i].name,
                                        name2: ""
                                    };
                                    if ($scope.isLengthZero(item1.condition) && $scope.isLengthZero(item1.field) && $scope.isLengthZero(item1.name)) continue;
                                    conditonArr.push(item1);
                                }
                            }
                            if ($scope.updateList) {
                                for (var j = 0; j < $scope.updateList.length; j++) {
                                    var item2 = {
                                        update: $scope.updateList[j].update,
                                        rename: $scope.updateList[j].rename,
                                        name: $scope.updateList[j].name
                                    };
                                    if ($scope.isLengthZero(item2.update) && $scope.isLengthZero(item2.rename) && $scope.isLengthZero(item2.name)) continue;
                                    updateArr.push(item2);
                                }
                            }

                            $scope.fieldData.lookup = {
                                key: conditonArr,
                                schema: $scope.schemaVal,
                                table: $scope.tableVal,
                                value: updateArr
                            };
                            $scope.fieldData.name = $scope.fieldName;
                            $scope.fieldData.connection = $scope.connName;
                            if ($scope.update_bypassed == true) {
                                $scope.fieldData.update_bypassed = 'Y';
                            } else {
                                $scope.fieldData.update_bypassed = 'N';
                            }
                            $scope.redrawCanvas();
                            $scope.close();
                        } else {
                            $scope.alertTip('名称不能重复！');
                        }
                    }
                })
            }
        })
        .directive('numericalRange',()=>{
            const template = require('./template/numericalRange.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','rootScope' ,'folderFactory','$http',($scope,$rootScope,$http,$timeout)=> {

                    $scope.$on('NumberRange', function (d, data) {
                        $scope.initMain();
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.NumberRange').style.display = 'block';
                        /**********Start数值范围名称读取************/
                        //遍历找到数值范围位置
                        $scope.numRangeIndex = 0;
                        if(!$scope.isArray(data.data.transformation.step)) {
                            data.data.transformation.step = [data.data.transformation.step];
                        }
                        for( var o in data.data.transformation.step){
                            if(data.data.transformation.step[o].type == "NumberRange" && data.data.transformation.step[o].name == data.name){
                                $scope.numRangeIndex =  o;
                            }
                        }
                        //读出数值范围的名称
                        $scope.numRangeName = $scope.data.transformation.step[$scope.numRangeIndex].name;
                        $scope.numRangeOldName = $scope.data.transformation.step[$scope.numRangeIndex].name;
                        /**********End数值范围名称读取************/

                        /**********Start数值范围txt读取************/
                        $scope.fallBackValue = $scope.data.transformation.step[$scope.numRangeIndex].fallBackValue;
                        $scope.inputField = $scope.data.transformation.step[$scope.numRangeIndex].inputField;
                        $scope.outputField = $scope.data.transformation.step[$scope.numRangeIndex].outputField;
                        /**********End数值范围txt读取************/

                        /**********Start数值范围列表读取************/
                        $scope.numRangeList = [];
                        //将自带的数据转入列表
                        if(typeof($scope.data.transformation.step[$scope.numRangeIndex].rules) != "string"){
                            //判断一个的情况
                            if($scope.data.transformation.step[$scope.numRangeIndex].rules.rule.hasOwnProperty("length")){
                                for(var i=0;i<$scope.data.transformation.step[$scope.numRangeIndex].rules.rule.length;i++){
                                    var item = {
                                        value:$scope.data.transformation.step[$scope.numRangeIndex].rules.rule[i].value,
                                        lower_bound:$scope.data.transformation.step[$scope.numRangeIndex].rules.rule[i].lower_bound == "-1.7976931348623157E308" ? "" : $scope.data.transformation.step[$scope.numRangeIndex].rules.rule[i].lower_bound,
                                        upper_bound:$scope.data.transformation.step[$scope.numRangeIndex].rules.rule[i].upper_bound == "1.7976931348623157E308" ? "" : $scope.data.transformation.step[$scope.numRangeIndex].rules.rule[i].upper_bound
                                    }
                                    $scope.numRangeList.push(item);
                                }
                            }else{
                                var item = {
                                    value:$scope.data.transformation.step[$scope.numRangeIndex].rules.rule.value,
                                    lower_bound:$scope.data.transformation.step[$scope.numRangeIndex].rules.rule.lower_bound == "-1.7976931348623157E308" ? "" : $scope.data.transformation.step[$scope.numRangeIndex].rules.rule.lower_bound,
                                    upper_bound:$scope.data.transformation.step[$scope.numRangeIndex].rules.rule.upper_bound == "1.7976931348623157E308" ? "" : $scope.data.transformation.step[$scope.numRangeIndex].rules.rule.upper_bound
                                }
                                $scope.numRangeList.push(item);
                            }

                        }
                        //保存到内存
                        $scope.numRangeSaveIn = function(){
                            var newLength = $scope.numRangeList.length;
                            //清空原来的表格
                            if(typeof($scope.data.transformation.step[$scope.numRangeIndex].rules) == "string"){
                                $scope.data.transformation.step[$scope.numRangeIndex].rules = {rule:[]};
                            }else{
                                $scope.data.transformation.step[$scope.numRangeIndex].rules.rule = [];
                            }
                            for(var i=0;i<newLength;i++){
                                var item = {
                                    value:$scope.numRangeList[i].value,
                                    lower_bound:$scope.numRangeList[i].lower_bound.length > 0 ? $scope.numRangeList[i].lower_bound : "-1.7976931348623157E308",
                                    upper_bound:$scope.numRangeList[i].upper_bound.length > 0 ? $scope.numRangeList[i].upper_bound : "1.7976931348623157E308"
                                };
                                $scope.data.transformation.step[$scope.numRangeIndex].rules.rule.push(item);
                            }
                        };
                        //添加新空白项目
                        //添加新的列表
                        $scope.addNewNumRangeTr = function(){
                            var item = {
                                value:"",
                                lower_bound:"",
                                upper_bound:""
                            }
                            $scope.numRangeList.push(item);
                        }
                        //删除选中的列表
                        $scope.deleteNumRangeTr = function(){
                            $scope.numRangeList.splice($scope.numRangeTrIndex,1);
                        }
                        //点击每一行出发的动作
                        $scope.selectNumRangeTr = function(index){
                            $(".popup .numRangeActive").removeClass("numRangeActive");
                            $scope.numRangeTrIndex = index;
                            var all = document.querySelectorAll(".numRangeTr");
                            for(var i = 0; i < all.length; i++){
                                if(i == index){
                                    all[i].classList.add("numRangeActive");
                                } else {
                                    all[i].classList.remove("numRangeActive");
                                }
                            }
                        }
                        /**********End数值范围列表读取************/

                        /**********Start数值范围保存************/
                        $scope.numRangeSave = function(){
                            //存储表输出名称
                            if($scope.data.transformation.step[$scope.numRangeIndex].name == $scope.numRangeName){
                                //保存其他txt
                                $scope.data.transformation.step[$scope.numRangeIndex].fallBackValue = $scope.fallBackValue;
                                $scope.data.transformation.step[$scope.numRangeIndex].inputField = $scope.inputField;
                                $scope.data.transformation.step[$scope.numRangeIndex].outputField = $scope.outputField;
                                //列表保存到内存中
                                $scope.numRangeSaveIn();
                                //释放重绘信号
                                $scope.redrawCanvas();
                                //隐藏表输出界面
                                $scope.close();
                            }else{
                                //名字改变情况下的操作
                                //名字遍历验重
                                var flag = true;
                                for(var o in $scope.data.transformation.step){
                                    if($scope.data.transformation.step[o].name == $scope.numRangeName){
                                        if($scope.numRangeName == ""){
                                            $scope.alertTip("名称不能为空");
                                        }else{
                                            $scope.alertTip("名称不能重复");
                                        }
                                        flag = false;
                                        return false;
                                    }
                                    if($scope.ifNameRule($scope.numRangeName)) {
                                        $scope.alertTip("名称不能为空或者带有\/\\符号！");
                                        return false;
                                    }
                                }
                                //不重复才保存
                                if(flag==true){
                                    //保存名称
                                    $scope.data.transformation.step[$scope.numRangeIndex].name = $scope.numRangeName;
                                    //遍历更改线路
                                    $scope.hopsName($scope.numRangeOldName,$scope.numRangeName);
                                    //保存其他txt
                                    $scope.data.transformation.step[$scope.numRangeIndex].fallBackValue = $scope.fallBackValue;
                                    $scope.data.transformation.step[$scope.numRangeIndex].inputField = $scope.inputField;
                                    $scope.data.transformation.step[$scope.numRangeIndex].outputField = $scope.outputField;
                                    //列表保存到内存中
                                    $scope.numRangeSaveIn();
                                    //释放重绘信号
                                    $scope.redrawCanvas();
                                    //隐藏表输出界面
                                    $scope.close();

                                }
                            }
                        }
                        /**********End数值范围保存************/
                        $scope.$apply();
                    })
                })

            }
        })
        .directive('outputTable',()=>{
            const template = require('./template/outputTable.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','folderFactory','$http',($scope,$http,$timeout,folderFactory)=> {
                    $scope.$on('tableOutput',function(d,data){

                        /**********Start显示表输出弹出层************/
                        $scope.initMain();
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.' +'outputTable').style.display = 'block';
                        /**********End显示表输出弹出层************/

                        /**********Start表输出名称读取************/
                            //遍历找到表输出位置
                        $scope.index = 0;
                        if(!$scope.isArray(data.data.transformation.step)) {
                            data.data.transformation.step = [data.data.transformation.step];
                        }
                        for( var o in data.data.transformation.step){
                            if(data.data.transformation.step[o].type == "TableOutput" && data.data.transformation.step[o].name == data.name){
                                $scope.index =  o;
                            }
                        }
                        //读取表输出名称
                        $scope.outputTableName = data.data.transformation.step[$scope.index].name;
                        //读取表输出名称临时存储
                        $scope.outputTableOldName = data.data.transformation.step[$scope.index].name;
                        /**********End表输出名称读取************/

                        /**********StartDB连接读取************/
                            //虚拟DB连接模型
                        $scope.allDbList = [];
                        $scope.targetPatern = [];
                        for(var o in data.data.transformation.connection){
                            $scope.allDbList.push(data.data.transformation.connection[o].name);
                        }
                        //设置DB连接值
                        $scope.outputTableContent = data.data.transformation.step[$scope.index].connection;
                        //监听DB连接List改变
                        $scope.dbLinkChanged = function(){
                            //遍历db的index
                            for(var i in data.data.transformation.connection){
                                if(data.data.transformation.connection[i].name == $scope.outputTableContent){
                                    $scope.dbLinkIndex = i;
                                }
                            }
                            folderFactory.XHR1('post', '/etl-monitor/api/kettle/retrieveSchemas', "connection="+encodeURI(JSON.stringify(data.data.transformation.connection[$scope.dbLinkIndex])))
                                .then((data)=> {
                                    for(var i=0;i<data.length;i++){
                                        if(data[i]==$scope.outputTargetPattern){
                                            data.splice(i,1);
                                        }
                                    }
                                    data.push($scope.outputTargetPattern);
                                    $scope.targetPatern = data;
                                    /*更新目标表*/
                                    folderFactory.XHR1('post', '/etl-monitor/api/kettle/getDatabaseTables?schema='+$scope.outputTargetPattern, "connection="+encodeURI(JSON.stringify($scope.data.transformation.connection[$scope.dbLinkIndex])))
                                        .then((data2)=> {
                                            for(var i=0;i<data2.length;i++){
                                                if(data2[i] == $scope.targetTable){
                                                    data2.splice(i,1);
                                                }
                                            }
                                            data2.push($scope.targetTable);
                                            $scope.tableList = data2;
                                            /*更改列表内容*/
                                            folderFactory.XHR1('post', '/etl-monitor/api/kettle/getTableFields?table='+$scope.targetTable, "connection="+encodeURI(JSON.stringify($scope.data.transformation.connection[$scope.dbLinkIndex])))
                                                .then((data3)=> {
                                                    $scope.fieldList  = [];
                                                    $scope.commonList = data3;
                                                    //读取后台返回数据，打入列表
                                                    if(typeof($scope.data.transformation.step[$scope.index].fields) != "string"){
                                                        if($scope.data.transformation.step[$scope.index].fields.field.hasOwnProperty("length")){
                                                            for(var i=0;i<$scope.data.transformation.step[$scope.index].fields.field.length;i++){
                                                                var item = {
                                                                    stream_name:$scope.data.transformation.step[$scope.index].fields.field[i].stream_name,
                                                                    column_name:$scope.data.transformation.step[$scope.index].fields.field[i].column_name,
                                                                    columnList:$scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field[i].column_name,data3)
                                                                }
                                                                $scope.fieldList.push(item);
                                                            }
                                                        }else{
                                                            var item = {
                                                                stream_name:$scope.data.transformation.step[$scope.index].fields.field.stream_name,
                                                                column_name:$scope.data.transformation.step[$scope.index].fields.field.column_name,
                                                                columnList:$scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field.column_name,data3)
                                                            }
                                                            $scope.fieldList.push(item);
                                                        }

                                                    }
                                                }, (data1)=> {
                                                })
                                        }, (data2)=> {
                                        })
                                }, (data)=> {

                                })
                            //重置目标表
                            /*$scope.tableList = [];
                            $scope.targetTable = "";*/
                            //重置表内容
                            /*$scope.fieldList = [];*/
                        }
                        /**********EndDB连接读取************/

                        /**********Start目标模式************/
                            //显示目标模式默认值
                        $scope.targetPatern = data.data.transformation.step[$scope.index].schema;
                        $scope.outputTargetPattern = data.data.transformation.step[$scope.index].schema;
                        //遍历db的index
                        for(var i in data.data.transformation.connection){
                            if(data.data.transformation.connection[i].name == $scope.outputTableContent){
                                $scope.dbLinkIndex = i;
                            }
                        }
                        folderFactory.XHR1('post', '/etl-monitor/api/kettle/retrieveSchemas', "connection="+encodeURI(JSON.stringify(data.data.transformation.connection[$scope.dbLinkIndex])))
                            .then((data1)=> {
                                //渲染最新的目标模式列表，列表模型相加,过滤掉非空字段
                                if($scope.targetPatern == ""){
                                    $scope.targetPatern = data1;
                                    $scope.outputTargetPattern = data.data.transformation.step[$scope.index].schema;
                                }else{
                                    var temp = [];
                                    for(var o of data1){
                                        if(o != $scope.targetPatern){
                                            temp.push(o);
                                        }
                                    }
                                    temp.push($scope.targetPatern);
                                    $scope.targetPatern = temp;
                                    $scope.outputTargetPattern = data.data.transformation.step[$scope.index].schema;
                                }
                            }, (data)=> {
                            })
                        //目标模式列表更改
                        $scope.targetPatternChanged = function(){
                            //重新读取目标表列表
                            //获取表列表内容
                            if($scope.outputTargetPattern!=null){
                                folderFactory.XHR1('post', '/etl-monitor/api/kettle/getDatabaseTables?schema='+$scope.outputTargetPattern, "connection="+encodeURI(JSON.stringify(data.data.transformation.connection[$scope.dbLinkIndex])))
                                    .then((data2)=> {
                                        for(var i=0;i<data2.length;i++){
                                            if(data2[i] == $scope.targetTable){
                                                data2.splice(i,1);
                                            }
                                        }
                                        data2.push($scope.targetTable);
                                        $scope.tableList = data2;
                                        /*更改列表内容*/
                                        folderFactory.XHR1('post', '/etl-monitor/api/kettle/getTableFields?table='+$scope.targetTable, "connection="+encodeURI(JSON.stringify($scope.data.transformation.connection[$scope.dbLinkIndex])))
                                            .then((data3)=> {
                                                $scope.fieldList  = [];
                                                $scope.commonList = data3;
                                                //读取后台返回数据，打入列表
                                                if(typeof($scope.data.transformation.step[$scope.index].fields) != "string") {
                                                    if ($scope.data.transformation.step[$scope.index].fields.field.hasOwnProperty("length")) {
                                                        for (var i = 0; i < $scope.data.transformation.step[$scope.index].fields.field.length; i++) {
                                                            var item = {
                                                                stream_name: $scope.data.transformation.step[$scope.index].fields.field[i].stream_name,
                                                                column_name: $scope.data.transformation.step[$scope.index].fields.field[i].column_name,
                                                                columnList: $scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field[i].column_name, data3)
                                                            }
                                                            $scope.fieldList.push(item);
                                                        }
                                                    } else {
                                                        var item = {
                                                            stream_name: $scope.data.transformation.step[$scope.index].fields.field.stream_name,
                                                            column_name: $scope.data.transformation.step[$scope.index].fields.field.column_name,
                                                            columnList: $scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field.column_name, data3)
                                                        }
                                                        $scope.fieldList.push(item);
                                                    }
                                                }
                                            }, (data1)=> {
                                            })
                                    }, (data2)=> {
                                    })
                            }
                        }
                        /**********End目标模式************/

                        /**********Start目标表************/
                        //显示目标表
                        $scope.tableList = [];
                        $scope.targetTable = data.data.transformation.step[$scope.index].table;
                        //将默认值填入列表
                        $scope.tableList.push($scope.targetTable);

                        //获取表内容
                        folderFactory.XHR1('post', '/etl-monitor/api/kettle/getDatabaseTables?schema='+data.data.transformation.step[$scope.index].schema, "connection="+encodeURI(JSON.stringify(data.data.transformation.connection[$scope.dbLinkIndex])))
                            .then((data2)=> {
                                //讲数据添加入列表，并过滤重复字段
                                if($scope.targetTable == ""){
                                    $scope.tableList = data2;
                                    $scope.targetTable = data.data.transformation.step[$scope.index].table;

                                }else{
                                    var temp = [];
                                    for(var o of data2){
                                        if(o != $scope.targetTable){
                                            temp.push(o);
                                        }
                                    }
                                    temp.push($scope.targetTable);
                                    $scope.tableList = temp;
                                    $scope.targetTable = data.data.transformation.step[$scope.index].table;
                                }
                            }, (data2)=> {
                            })
                        //目标表内容改变

                        //重置表内容
                        $scope.fieldList = [];

                        $scope.targetTableChanged = function(){

                            //读取表字段列表
                            if($scope.targetTable!=null){
                                folderFactory.XHR1('post', '/etl-monitor/api/kettle/getTableFields?table='+$scope.targetTable, "connection="+encodeURI(JSON.stringify(data.data.transformation.connection[$scope.dbLinkIndex])))
                                    .then((data3)=> {
                                        $scope.commonList = data3;
                                        //读取后台返回数据，打入列表
                                        if(typeof($scope.data.transformation.step[$scope.index].fields) != "string") {
                                            if ($scope.data.transformation.step[$scope.index].fields.field.hasOwnProperty("length")) {
                                                for (var i = 0; i < $scope.data.transformation.step[$scope.index].fields.field.length; i++) {
                                                    var item = {
                                                        stream_name: $scope.data.transformation.step[$scope.index].fields.field[i].stream_name,
                                                        column_name: $scope.data.transformation.step[$scope.index].fields.field[i].column_name,
                                                        columnList: $scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field[i].column_name, data3)
                                                    }
                                                    $scope.fieldList.push(item);
                                                }
                                            } else {
                                                var item = {
                                                    stream_name: $scope.data.transformation.step[$scope.index].fields.field.stream_name,
                                                    column_name: $scope.data.transformation.step[$scope.index].fields.field.column_name,
                                                    columnList: $scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field.column_name, data3)
                                                }
                                                $scope.fieldList.push(item);
                                            }
                                        }
                                    }, (data1)=> {
                                    })
                            }

                        }
                        /**********End目标表************/

                        /**********Start表内容**********/

                        //显示表内容


                        //for (var o in data.data.transformation.step[$scope.index].fields.field){
                        //    $scope.fieldList.push(data.data.transformation.step[$scope.index].fields.field[o]);
                        //}
                        //$scope.tableNameList1 = [];
                        //工具：讲column列表和column默认值合并形成新的列表
                         $scope.newColumnList = function(columnName,columnList){
                            var returnArray = [];
                            returnArray.push(columnName);
                            for(var i=0;i<columnList.length;i++){
                                if(columnList[i] != columnName){
                                    returnArray.push(columnList[i]);
                                }
                            }
                            return returnArray;
                         }
                        //点击每一行出发的动作
                        $scope.selectOutputTr = function(index){
                            $(".popup .outputActive").removeClass("outputActive");
                            $scope.trIndex = index;
                            var all = document.querySelectorAll(".outputTr");
                            for(var i = 0; i < all.length; i++){
                                if(i == index){
                                    all[i].classList.add("outputActive");
                                } else {
                                    all[i].classList.remove("outputActive");
                                }
                            }
                        }
                        //存储公共列表
                        $scope.commonList = [];
                        //添加新的列表
                        $scope.addNewOutputTr = function(){
                            if($scope.targetTable == ""){
                                $scope.alertTip("请选择目标表");
                            }else{
                                var item = {
                                    stream_name:"",
                                    column_name:"",
                                    columnList:$scope.commonList
                                }
                                $scope.fieldList.push(item);
                            }
                        }
                        //删除选中的列表
                        $scope.deleteOutputTr = function(){
                            $scope.fieldList.splice($scope.trIndex,1);
                        }
                        //保存表内容到内存中
                        $scope.saveOutputContent = function(){
                            var newLength = $scope.fieldList.length;
                            //清空原来的表格
                            if(typeof($scope.data.transformation.step[$scope.index].fields) == "string"){

                                $scope.data.transformation.step[$scope.index].fields = {field:[]};

                            }else{
                                $scope.data.transformation.step[$scope.index].fields.field = [];
                            }

                            for(var i=0;i<newLength;i++){
                                var item = {
                                    stream_name:$scope.fieldList[i].stream_name,
                                    column_name:$scope.fieldList[i].column_name
                                };
                                $scope.data.transformation.step[$scope.index].fields.field.push(item);
                            }
                        }
                        //读取表字段列表
                        folderFactory.XHR1('post', '/etl-monitor/api/kettle/getTableFields?table='+data.data.transformation.step[$scope.index].table, "connection="+encodeURI(JSON.stringify(data.data.transformation.connection[$scope.dbLinkIndex])))
                            .then((data3)=> {
                                $scope.fieldList = [];
                                $scope.commonList = data3;
                                //读取后台返回数据，打入列表
                                if(typeof($scope.data.transformation.step[$scope.index].fields) != "string") {
                                    if ($scope.data.transformation.step[$scope.index].fields.field.hasOwnProperty("length")) {
                                        for (var i = 0; i < $scope.data.transformation.step[$scope.index].fields.field.length; i++) {
                                            var item = {
                                                stream_name: $scope.data.transformation.step[$scope.index].fields.field[i].stream_name,
                                                column_name: $scope.data.transformation.step[$scope.index].fields.field[i].column_name,
                                                columnList: $scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field[i].column_name, data3)
                                            }
                                            $scope.fieldList.push(item);
                                        }
                                    } else {
                                        var item = {
                                            stream_name: $scope.data.transformation.step[$scope.index].fields.field.stream_name,
                                            column_name: $scope.data.transformation.step[$scope.index].fields.field.column_name,
                                            columnList: $scope.newColumnList($scope.data.transformation.step[$scope.index].fields.field.column_name, data3)
                                        }
                                        $scope.fieldList.push(item);
                                    }
                                }
                            }, (data1)=> {
                            })
                        //自定义关系映射
                        $scope.showOrHide = ($scope.data.transformation.step[$scope.index].specify_fields == "Y");

                        /**********End表内容************


                        /**********Start表输出保存************/
                        $scope.outputMakeSure = function(){
                            //存储表输出名称
                            if($scope.data.transformation.step[$scope.index].name == $scope.outputTableName){
                                //名字没改变情况下的操作
                                //保存DB连接内容
                                $scope.data.transformation.step[$scope.index].connection = $scope.outputTableContent;
                                //保存目标模式
                                $scope.data.transformation.step[$scope.index].schema = $scope.outputTargetPattern;
                                //保存目标表
                                $scope.data.transformation.step[$scope.index].table = $scope.targetTable;
                                //保存目标值
                                $scope.saveOutputContent();
                                //保存checkbox
                                $scope.data.transformation.step[$scope.index].specify_fields = $scope.showOrHide == true?"Y":"N";
                                //释放重绘信号
                                $scope.redrawCanvas();
                                //隐藏表输出界面
                                $scope.close();
                            }else{
                                //名字改变情况下的操作
                                //名字遍历验重
                                var flag = true;
                                for(var o in $scope.data.transformation.step){
                                    if($scope.data.transformation.step[o].name == $scope.outputTableName){
                                        if($scope.outputTableName == ""){
                                            $scope.alertTip("名称不能为空");
                                        }else{
                                            $scope.alertTip("名称不能重复");
                                        }
                                        flag = false;
                                        return false;
                                    }
                                    if($scope.ifNameRule($scope.outputTableName)) {
                                        $scope.alertTip("名称不能为空或者带有\/\\符号！");
                                        return false;
                                    }
                                }
                                //不重复才保存
                                if(flag==true){
                                    //保存名称
                                    $scope.data.transformation.step[$scope.index].name = $scope.outputTableName;
                                    //遍历更改线路
                                    $scope.hopsName($scope.outputTableOldName, $scope.outputTableName);
                                    //保存DB连接内容
                                    $scope.data.transformation.step[$scope.index].connection = $scope.outputTableContent;
                                    //保存目标模式
                                    $scope.data.transformation.step[$scope.index].schema = $scope.outputTargetPattern;
                                    //保存目标表
                                    $scope.data.transformation.step[$scope.index].table = $scope.targetTable;
                                    //保存目标值
                                    $scope.saveOutputContent();
                                    //保存checkbox
                                    $scope.data.transformation.step[$scope.index].specify_fields = $scope.showOrHide == true?"Y":"N";
                                    //释放重绘信号
                                    $scope.redrawCanvas();
                                    //隐藏表输出界面
                                    $scope.close();
                                }
                            }
                            /*$scope.data.transformation.step[$scope.index].name = $scope.outputTableName;*/
                            //更改



                        }
                        /**********End表输出保存************/

                        $scope.$apply();
                    })

                })
            }
        })
        .directive('removeRecords',()=>{
            const template = require('./template/removeRecords.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller:('$scope','folderFactory','$http',($scope,$http,$timeout)=> {
                    $scope.$on('Unique',function(d,data){
                        $scope.fieldData = data;
                        $scope.initMain(data.type);
                        $scope.UniqueTable = [];
                        $scope.fieldName = data.name;
                        if (data.fields.field) {
                            if($scope.isArray(data.fields.field)){
                                for (var i = 0; i < data.fields.field.length; i++) {
                                    var item = {
                                        key: data.fields.field[i].name,
                                        value: data.fields.field[i].case_insensitive
                                    };
                                    $scope.UniqueTable.push(item);
                                }
                            } else {
                                var item = {
                                    key: data.fields.field.name,
                                    value: data.fields.field.case_insensitive
                                };
                                $scope.UniqueTable.push(item);
                            }
                        }
                        if (data.reject_duplicate_row === "N") {
                            $scope.rejectDuplicateRow = false;
                        } else {
                            $scope.rejectDuplicateRow = true;
                        }
                        $scope.$apply();
                    });
                    $scope.addUniqueTableArg=()=>{
                        var item = {
                            key: "",
                            value: "Y"
                        };
                        $scope.UniqueTable.push(item);
                    };
                    $scope.removeTr = ()=> {
                        if($(".removeRecords table .active").length <= 0) return;
                        $scope.UniqueTable.splice($scope.index,1);
                    };
                    $scope.changeDuplicateRow = (e) => {
                        if (e) {
                            $scope.fieldData.reject_duplicate_row = "Y";
                        } else {
                            $scope.fieldData.reject_duplicate_row = "N";
                        }
                    };
                    $scope.saveUnique = () => {
                        var arr = [];
                        if ($scope.ifExistName($scope.fieldData.name, $scope.fieldName)) {
                            if ($scope.ifNameRule($scope.fieldName)) {
                                $scope.alertTip('名称不能为空或者带有\/\\符号！');
                                return;
                            }
                            $scope.hopsName($scope.fieldData.name, $scope.fieldName);
                            $scope.fieldData.name = $scope.fieldName;
                            for (var i = 0; i < $scope.UniqueTable.length; i++) {
                                if ($scope.UniqueTable[i].key.length <= 0) continue;
                                var item = {
                                    case_insensitive: $scope.UniqueTable[i].value,
                                    name: $scope.UniqueTable[i].key
                                };
                                arr.push(item);
                            }
                            $scope.fieldData.fields = {field: arr};
                            $scope.redrawCanvas();
                            $scope.close();
                        } else {
                            $scope.alertTip('名称不能重复！');
                        }
                    }
                })
            }
        })
        .directive('sortRecord',()=>{
            const template = require('./template/sortRecord.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){
                    //angular.element(document.querySelector('.popup').childNodes).attr('class','popupHide');
                },
                controller: ('$scope','folderFactory','$http',($scope,$http)=> {
                    $scope.$on('SortRows',function(d,data){

                        $scope.initMain();
                        document.querySelector('.popup').style.display = 'block';
                        document.querySelector('.SortRows').style.display = 'block';
                        /**********Start排序记录名称读取************/
                            //遍历找到排序记录位置
                        $scope.sortRecordIndex = 0;
                        if(!$scope.isArray(data.data.transformation.step)) {
                            data.data.transformation.step = [data.data.transformation.step];
                        }
                        for( var o in data.data.transformation.step){
                            if(data.data.transformation.step[o].type == "SortRows" && data.data.transformation.step[o].name == data.name){
                                $scope.sortRecordIndex =  o;
                            }
                        }
                        //读出排序记录的名称
                        $scope.sortRecordName = $scope.data.transformation.step[$scope.sortRecordIndex].name;
                        $scope.sortRecordOldName = $scope.data.transformation.step[$scope.sortRecordIndex].name;

                        /**********End排序记录名称读取************/

                        /**********Start排序记录列表************/
                         $scope.sortRecordList = [];
                         //将自带的数据转入列表
                        if(typeof($scope.data.transformation.step[$scope.sortRecordIndex].fields) != "string"){

                            if($scope.data.transformation.step[$scope.sortRecordIndex].fields.field.hasOwnProperty("length")){
                                for(var i=0;i<$scope.data.transformation.step[$scope.sortRecordIndex].fields.field.length;i++){
                                    var item = {
                                        name:$scope.data.transformation.step[$scope.sortRecordIndex].fields.field[i].name,
                                        ascending:$scope.data.transformation.step[$scope.sortRecordIndex].fields.field[i].ascending,
                                        case_sensitive:$scope.data.transformation.step[$scope.sortRecordIndex].fields.field[i].case_sensitive
                                    }
                                    $scope.sortRecordList.push(item);
                                }
                            }else{
                                var item = {
                                    name:$scope.data.transformation.step[$scope.sortRecordIndex].fields.field.name,
                                    ascending:$scope.data.transformation.step[$scope.sortRecordIndex].fields.field.ascending,
                                    case_sensitive:$scope.data.transformation.step[$scope.sortRecordIndex].fields.field.case_sensitive
                                }
                                $scope.sortRecordList.push(item);
                            }

                        }
                        //保存到内存
                        $scope.sortRecordSaveIn = function(){
                            var newLength = $scope.sortRecordList.length;
                            //清空原来的表格
                            if(typeof($scope.data.transformation.step[$scope.sortRecordIndex].fields) == "string"){

                                $scope.data.transformation.step[$scope.sortRecordIndex].fields = {field:[]};

                            }else{
                                $scope.data.transformation.step[$scope.sortRecordIndex].fields.field = [];
                            }

                            for(var i=0;i<newLength;i++){
                                var item = {
                                    name:$scope.sortRecordList[i].name,
                                    ascending:$scope.sortRecordList[i].ascending,
                                    case_sensitive:$scope.sortRecordList[i].case_sensitive
                                };
                                $scope.data.transformation.step[$scope.sortRecordIndex].fields.field.push(item);
                            }
                        }
                        //添加新空白项目
                        //添加新的列表
                        $scope.addNewSortRecordTr = function(){
                                var item = {
                                    name:"",
                                    ascending:"Y",
                                    case_sensitive:"Y"
                                }
                                $scope.sortRecordList.push(item);
                        }
                        //删除选中的列表
                        $scope.deleteSortRecordTr = function(){
                            $scope.sortRecordList.splice($scope.sortRecordTrIndex,1);
                        }
                        //点击每一行出发的动作
                        $scope.selectSortRecordTr = function(index){
                            $(".popup .sortRecordActive").removeClass("sortRecordActive");
                            $scope.sortRecordTrIndex = index;
                            var all = document.querySelectorAll(".sortRecordTr");
                            for(var i = 0; i < all.length; i++){
                                if(i == index){
                                    all[i].classList.add("sortRecordActive");
                                } else {
                                    all[i].classList.remove("sortRecordActive");
                                }
                            }
                        }
                        /**********End排序记录列表************/

                        /**********Start排序记录保存************/
                         $scope.sortRecordSave = function(){
                             //存储表输出名称
                             if($scope.data.transformation.step[$scope.sortRecordIndex].name == $scope.sortRecordName){
                                 //保存数据列表
                                 $scope.sortRecordSaveIn();
                                 //释放重绘信号
                                 $scope.redrawCanvas();
                                 //隐藏表输出界面
                                 $scope.close();
                             }else{
                                 //名字改变情况下的操作
                                 //名字遍历验重
                                 var flag = true;
                                 for(var o in $scope.data.transformation.step){
                                     if($scope.data.transformation.step[o].name == $scope.sortRecordName){
                                         if($scope.sortRecordName == ""){
                                             $scope.alertTip("名称不能为空");
                                         }else{
                                             $scope.alertTip("名称不能重复");
                                         }
                                         flag = false;
                                         return false;
                                     }
                                     if($scope.ifNameRule($scope.sortRecordName)) {
                                         $scope.alertTip("名称不能为空或者带有\/\\符号！");
                                         return false;
                                     }
                                 }
                                 //不重复才保存
                                 if(flag==true){
                                     //保存名称
                                     $scope.data.transformation.step[$scope.sortRecordIndex].name = $scope.sortRecordName;
                                     //遍历更改线路
                                     $scope.hopsName($scope.sortRecordOldName, $scope.sortRecordName);
                                     //保存数据列表
                                     $scope.sortRecordSaveIn();
                                     //释放重绘信号
                                     $scope.redrawCanvas();
                                     //隐藏表输出界面
                                     $scope.close();
                                 }
                             }
                         }
                        /**********End排序记录保存************/

                        $scope.$apply();
                    });
                })
            }
        })

}