import angular from 'angular';
import $ from 'jquery';
import xml2js from "xml2js";
import './angular-tree-control';
import './popup/popup';
import './taskPlan/taskPlan';
//import files from './fileList';
import img from './imgSrc';
import '../css/common';
import '../css/tree-control';
import '../css/tree-control-attribute';
import '../css/tree-operate';
import '../css/main';
import '../css/operateRecord';
import '../css/modifyPassword';
import '../css/userManagement';
import '../css/integratedCount'
import '../css/jquery-ui.min.css';
import '../css/jquery-ui.theme.min.css';
import '../css/jquery.page.css';
import '../css/loading.css';
import './jquery-ui.min.js';

angular.module("myApp", ["treeControl", "etl/popup", "etl/taskPlan"])
    .service("folderFactory", ($http, $q)=> {
        let service = {};
        service.XHR = (method, url, data)=> {
            let deferred = $q.defer();
            $http({
                method: method,
                headers: {"Content-Type": "application/json; charset=utf-8"},
                url: url,
                dataType: 'json',
                data: data
            })
                .success((data, status)=> {
                    deferred.resolve(data);
                }).error((data)=> {
                    deferred.reject(data)
                });
            return deferred.promise;
        };
        service.XHR1 = (method, url, data)=> {
            let deferred = $q.defer();
            $http({
                method: method,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: url,
                contentType: "application/x-www-form-urlencoded",
                data: data
            })
                .success((data)=> {
                    deferred.resolve(data);
                }).error((data)=> {
                    deferred.reject(data)
                });
            return deferred.promise;
        };
        service.XHR3 = (method, url, data)=> {
            let deferred = $q.defer();
            $http({
                method: method,
                headers: {"Content-Type": "application-url-encoded; charset=utf-8"},
                url: url,
                dataType: 'json',
                data: data
            })
                .success((data)=> {
                    deferred.resolve(data);
                }).error((data)=> {
                    deferred.reject(data)
                });
            return deferred.promise;
        };
        return service;
    })
    .directive('folderTree', ()=> {
        return {
            restrict: 'AE',
            template: require("../template/filetree.html"),
            controller: ('$scope', 'folderFactory', ($scope, folderFactory)=> {
                folderFactory.XHR('get', '/etl-monitor/api/repo/files/tree')
                    .then((data)=> {
                        //$scope.dataTree = files.children;
                        $scope.dataTree = data;
                        function getFileNum(){
                            var num = 0;
                            var actionNum = function(data) {
                                if(!data.file.folder) {
                                    num ++;
                                }
                                if (data.children) {
                                    for (var i = 0;i < data.children.length; i++) {
                                        this.actionNum(data.children[i]);
                                    }
                                }
                            };
                            var getNum = function() {
                                return num;
                            };
                            return {
                                actionNum : actionNum,
                                getNum : getNum
                            };
                        }
                        var obj = getFileNum();
                        obj.actionNum(data);
                        $scope.fileAll = obj.getNum();
                    }, (data)=> {

                    });
            })
        };
    })
    /*操作日志*/
    .directive('operateRecord', ()=> {
        return {
            restrict: 'AE',
            template: require("../template/operate.html"),
            controller: ('$scope', 'folderFactory','$rootScope', ($scope, folderFactory,$rootScope)=> {

                $scope.$on("tongbu",function(d,data){

                    $scope.userNames = data;
                    $scope.userNames.push("所有用户");
                    $scope.selectedName = "所有用户";

                })

                /*用户下来菜单option数据*/
               /* folderFactory.XHR('get', ' /etl-monitor/api/userrole/users')
                    .then((data)=> {

                        $scope.userNames = ["所有用户"];
                        $scope.userNames.push(data);
                    }, (data)=> {
                    })*/



                /*用户选择日期option数据*/
                $scope.searchDate = ["今天", "昨天", "过去一周", "过去一月", "自定义"];
                /*关闭操作日志*/
                $scope.closeOperateBox = function(){
                    document.querySelector(".operateRecordBox").style.display = "none";
                }
                /*监听用户选择变化*/
                $scope.tellMeUser = function (e) {
                    switch (e) {
                        case "所有用户":
                            break;
                        default:
                            break;
                    }
                }
                /*时间戳转换成时间*/
                $scope.getLocalTime = function (nS) {
                    var str = "";
                    var transformDate = new Date(nS);
                    var year = transformDate.getFullYear();
                    str += year;
                    var month = (transformDate.getMonth() + 1);
                    str += "/";
                    if (month < 10) {
                        str += "0";
                    }
                    str += month;
                    var date = transformDate.getDate();
                    str += "/";
                    if (date < 10) {
                        str += "0";
                    }
                    str += date;
                    str += " ";
                    var hour = transformDate.getHours();
                    if (hour < 10) {
                        str += "0";
                    }
                    str += hour;
                    var minutes = transformDate.getMinutes();
                    str += ":";
                    if (minutes < 10) {
                        str += "0";
                    }
                    str += minutes;
                    var seconds = transformDate.getSeconds();
                    str += ":";
                    if (seconds < 10) {
                        str += "0";
                    }
                    str += seconds;
                    return str;
                }

                /*时间组件是否选择*/
                $scope.timeChoosePlugin = false;
                /*查询的开始时间和结束时间*/
                $scope.timeStartTime = Date.parse(new Date());
                $scope.timeEndTime = Date.parse(new Date());

                /*获取今天的时间*/
                $scope.getTodayPeriod = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime = Date.parse(today);
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    $scope.timeStartTime = Date.parse(today);
                }
                $scope.getTodayPeriod();
                /*获取昨天的时间*/
                $scope.getYesterdayPeriod = function () {
                    var today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    $scope.timeEndTime = Date.parse(today);
                    $scope.timeStartTime = $scope.timeEndTime - 1000 * 24 * 60 * 60;
                }
                /*获取最近一周的时间*/
                $scope.getLastedOneWeek = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime = Date.parse(today);
                    $scope.timeStartTime = $scope.timeEndTime - 1000 * 24 * 60 * 60 * 7;
                }
                /*获取最近一个月的时间*/
                $scope.getLastedOneMonth = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime = Date.parse(today);
                    $scope.timeStartTime = $scope.timeEndTime - 1000 * 24 * 60 * 60 * 30;
                }
                /*获取自定义时间*/
                $scope.getDefineTime = function () {
                    var startTime = document.querySelector("#recordStartTime").value;
                    var endTime = document.querySelector("#recordEndTime").value;
                    var startTimeYear = parseInt(startTime.split(".")[0]);
                    var startTimeMonth = parseInt(startTime.split(".")[1]);
                    var startTimeDay = parseInt(startTime.split(".")[2]);
                    var endTimeYear = parseInt(endTime.split(".")[0]);
                    var endTimeMonth = parseInt(endTime.split(".")[1]);
                    var endTimeDay = parseInt(endTime.split(".")[2]);
                    var date = new Date();
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setYear(startTimeYear);
                    date.setMonth(startTimeMonth - 1);
                    date.setDate(startTimeDay);
                    $scope.timeStartTime = Date.parse(date);
                    date.setYear(endTimeYear);
                    date.setMonth(endTimeMonth - 1);
                    date.setDate(endTimeDay + 1);
                    $scope.timeEndTime = Date.parse(date);
                }
                /*监听日期选择变化*/
                $scope.tellMeDate = function (e) {
                    switch (e) {
                        case "今天":
                            $scope.timeChoosePlugin = false;
                            $scope.getTodayPeriod();
                            break;
                        case "昨天":
                            $scope.timeChoosePlugin = false;
                            $scope.getYesterdayPeriod();
                            break;
                        case "过去一周":
                            $scope.timeChoosePlugin = false;
                            $scope.getLastedOneWeek();
                            break;
                        case "过去一月":
                            $scope.timeChoosePlugin = false;
                            $scope.getLastedOneMonth();
                            break;
                        case "自定义":
                            $scope.timeChoosePlugin = true;
                            break;
                    }
                }
                /*存储显示表格的数据*/
                $scope.requestResult = "";
                /*初始化时间组件*/
                $("#recordStartTime").datepicker({
                    dateFormat: "yy.mm.dd"
                });
                $("#recordEndTime").datepicker({
                    dateFormat: "yy.mm.dd"
                });
                /*分页内容*/
                $scope.currentPage = 1;
                $scope.totalPages = 0;
                $scope.liNum = 1;
                /*默认显示今天*/
                $scope.requestOperateRecord0 = function (pageNo) {
                    $scope.inputTotalPage = 1;
                    $scope.getTodayPeriod();
                    folderFactory.XHR('get', ' /etl-monitor/api/logs/operationLog?pageNo=' + pageNo + '&pageSize=25&startTime=' + $scope.timeStartTime + '&endTime=' + $scope.timeEndTime)
                        .then((data)=> {
                            $scope.requestResult = data.result;
                            $scope.totalPages = data.totalPage;
                            $("#operateRecordTable").Page({
                                totalPages: $scope.totalPages,//分页总数
                                liNums: data.totalPage >= 7 ? 7 : data.totalPage,
                                activeClass: 'activP', //active 类样式定义
                                callBack: function (page) {
                                    $scope.inputTotalPage = page;
                                    $scope.requestOperateRecord2(page);
                                }
                            });
                        }, (data)=> {
                        })
                }
                $scope.requestOperateRecord0(1);
                /*发送分页请求*/
                $scope.requestOperateRecord = function (pageNo) {
                    $scope.inputTotalPage = 1;
                    $scope.flag = true;
                    /*$scope.getDefineTime();*/
                    if ($scope.timeChoosePlugin == true){
                        $scope.flag = false;
                        $scope.getDefineTime();
                        /*时间填写完整性验证*/
                        if (document.querySelector("#recordStartTime").value != "" && document.querySelector("#recordEndTime").value != "") {
                            /*时间与当前时间比较*/
                            $scope.getDefineTime();
                            if ($scope.timeStartTime <= Date.parse(new Date())) {
                                /*开始与结束比较*/
                                if ($scope.timeStartTime <= $scope.timeEndTime) {
                                    $scope.flag = true;
                                } else {
                                    $scope.showLittleTips1("结束时间不能早于开始时间");
                                    $scope.flag = false;
                                }
                            } else {
                                $scope.showLittleTips1("开始日期不能超过当前时间");
                                $scope.flag = false;
                            }
                        } else {
                            $scope.showLittleTips1("时间未填写完整");
                            $scope.flag = false;
                        }
                    }
                    if ($scope.flag == true) {
                        //判断是否所用用户
                        if($scope.selectedName == "所有用户"){
                            folderFactory.XHR('get', ' /etl-monitor/api/logs/operationLog?pageNo=' + pageNo + '&pageSize=25&startTime=' + $scope.timeStartTime + '&endTime=' + $scope.timeEndTime)
                                .then((data)=> {
                                    $scope.requestResult = data.result;
                                    $scope.totalPages = data.totalPage;
                                    $("#operateRecordTable").Page({
                                        totalPages: $scope.totalPages,//分页总数
                                        liNums: data.totalPage >= 7 ? 7 : data.totalPage,
                                        activeClass: 'activP', //active 类样式定义
                                        callBack: function (page) {
                                            $scope.inputTotalPage = page;
                                            $scope.requestOperateRecord2(page);
                                        }
                                    });
                                }, (data)=> {
                                })
                        }else{
                            folderFactory.XHR('get', ' /etl-monitor/api/logs/operationLog?pageNo=' + pageNo + '&pageSize=25&startTime=' + $scope.timeStartTime + '&endTime=' + $scope.timeEndTime+"&userId="+$scope.selectedName)
                                .then((data)=> {
                                    $scope.requestResult = data.result;
                                    $scope.totalPages = data.totalPage;
                                    $("#operateRecordTable").Page({
                                        totalPages: $scope.totalPages,//分页总数
                                        liNums: data.totalPage >= 7 ? 7 : data.totalPage,
                                        activeClass: 'activP', //active 类样式定义
                                        callBack: function (page) {
                                            $scope.inputTotalPage = page;
                                            $scope.requestOperateRecord2(page);
                                        }
                                    });
                                }, (data)=> {
                                })
                        }



                    }

                }
                /*发送分页请求2*/
                $scope.requestOperateRecord2 = function (pageNo) {

                    folderFactory.XHR('get', ' /etl-monitor/api/logs/operationLog?pageNo=' + pageNo + '&pageSize=25&startTime=' + $scope.timeStartTime + '&endTime=' + $scope.timeEndTime)
                        .then((data)=> {
                            $scope.requestResult = data.result;
                            $scope.totalPages = data.totalPage;
                        }, (data)=> {
                        })
                };
                /*公共的信息提示*/
                $scope.showLittleTips1 = function (ev) {
                    document.querySelector('.commonMessageTips1').style.display = 'block';
                    document.querySelector('.commonMessageTips1').style.opacity = 1;
                    document.querySelector('.commonMessageTips1 div').innerHTML = ev;
                    setTimeout(function () {
                        document.querySelector('.commonMessageTips1').style.opacity = 0;
                        document.querySelector('.commonMessageTips1').style.display = 'none';
                    }, 1000)
                };
                $scope.showBoyTips = function (ev) {
                    document.querySelector('#myTipsBoy').style.display = 'block';
                    document.querySelector('#myTipsBoy').style.opacity = 1;
                    document.querySelector('#myTipsBoy').innerHTML = ev;
                    setTimeout(function () {
                        document.querySelector('#myTipsBoy').style.opacity = 0;
                        document.querySelector('#myTipsBoy').style.display = 'none';
                    }, 1000)
                };
            })
        };
    })
    .directive('integratedCount', ()=> {
        return {
            restrict: 'AE',
            template: require("../template/integratedCount.html"),
            controller: ('$scope', 'folderFactory','$rootScope', ($scope, folderFactory,$rootScope)=> {

                /*初始化*/
                $scope.$on("integratedCountInit",function(){
                        $scope.selectedHis = "过去一月";
                        $scope.sendRequestExecuteHistory();
                        $scope.selectedTheme = "全部";
                        $scope.selectedHer = "过去一月";
                        $scope.sendRequestExecuteHistory2();
                        document.querySelector("#timeSelectExecuteHers").style.display = "none";
                        document.querySelector("#timeSelectExecuteHis").style.display = "none";
                })

                $scope.closeIntegratedBox = function(){
                    document.querySelector(".integratedCountBox").style.display  = "none";
                }
                $scope.searchHistory = ["今天","昨天","过去一周","过去一月","自定义"];
                $scope.tellMeHistory1 = function(e){
                        if(e == "自定义"){
                            document.querySelector("#timeSelectExecuteHis").style.display = "inline-block";
                            $("#executeHistoryStart").datepicker({
                                dateFormat: "yy.mm.dd"
                            });
                            $("#executeHistoryEnd").datepicker({
                                dateFormat: "yy.mm.dd"
                            });
                        }else{
                            document.querySelector("#timeSelectExecuteHis").style.display = "none";
                        }
                    }
                $scope.searchHistory2 = ["今天","昨天","过去一周","过去一月","自定义"];
                $scope.searchTheme = ["全部","人口","案件","线索","物品","组织","单位"];
                $scope.tellMeHistory2 = function(e){
                    if(e == "自定义"){
                        document.querySelector("#timeSelectExecuteHers").style.display = "block";
                        $("#dataDetailsStart").datepicker({
                            dateFormat: "yy.mm.dd"
                        });
                        $("#dataDetailsEnd").datepicker({
                            dateFormat: "yy.mm.dd"
                        });
                    }else{
                        document.querySelector("#timeSelectExecuteHers").style.display = "none";
                    }
                }
                /*时间处理*/
                $scope.timeStartTime1 = Date.parse(new Date());
                $scope.timeEndTime1 = Date.parse(new Date());
                $scope.requestResult1 = [];
                $scope.getTodayPeriod1 = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime1 = Date.parse(today);
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    $scope.timeStartTime1 = Date.parse(today);
                }
                /*获取昨天的时间*/
                $scope.getYesterdayPeriod1 = function () {
                    var today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    $scope.timeEndTime1 = Date.parse(today);
                    $scope.timeStartTime1 = $scope.timeEndTime1 - 1000 * 24 * 60 * 60;
                }
                /*获取最近一周的时间*/
                $scope.getLastedOneWeek1 = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime1 = Date.parse(today);
                    $scope.timeStartTime1 = $scope.timeEndTime1 - 1000 * 24 * 60 * 60 * 7;
                }
                /*获取最近一个月的时间*/
                $scope.getLastedOneMonth1 = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime1 = Date.parse(today);
                    $scope.timeStartTime1 = $scope.timeEndTime1 - 1000 * 24 * 60 * 60 * 30;
                }
                $scope.getLastedOneMonth1();
                /*获取自定义时间*/
                $scope.getDefineTime1 = function () {
                    var startTime = document.querySelector("#executeHistoryStart").value;
                    var endTime = document.querySelector("#executeHistoryEnd").value;
                    var startTimeYear = parseInt(startTime.split(".")[0]);
                    var startTimeMonth = parseInt(startTime.split(".")[1]);
                    var startTimeDay = parseInt(startTime.split(".")[2]);
                    var endTimeYear = parseInt(endTime.split(".")[0]);
                    var endTimeMonth = parseInt(endTime.split(".")[1]);
                    var endTimeDay = parseInt(endTime.split(".")[2]);
                    var date = new Date();
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setYear(startTimeYear);
                    date.setMonth(startTimeMonth - 1);
                    date.setDate(startTimeDay);
                    $scope.timeStartTime1 = Date.parse(date);
                    date.setYear(endTimeYear);
                    date.setMonth(endTimeMonth - 1);
                    date.setDate(endTimeDay + 1);
                    $scope.timeEndTime1 = Date.parse(date);
                }

                /*时间处理2*/
                $scope.timeStartTime2 = Date.parse(new Date());
                $scope.timeEndTime2 = Date.parse(new Date());
                $scope.requestResult2 = [];
                $scope.getTodayPeriod2 = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime2 = Date.parse(today);
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    $scope.timeStartTime2 = Date.parse(today);
                }
                /*获取昨天的时间*/
                $scope.getYesterdayPeriod2 = function () {
                    var today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    $scope.timeEndTime2 = Date.parse(today);
                    $scope.timeStartTime2 = $scope.timeEndTime2 - 1000 * 24 * 60 * 60;
                }
                /*获取最近一周的时间*/
                $scope.getLastedOneWeek2 = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime2 = Date.parse(today);
                    $scope.timeStartTime2 = $scope.timeEndTime2 - 1000 * 24 * 60 * 60 * 7;
                }
                /*获取最近一个月的时间*/
                $scope.getLastedOneMonth2 = function () {
                    var today = new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    today.setSeconds(59);
                    today.setMilliseconds(0);
                    $scope.timeEndTime2 = Date.parse(today);
                    $scope.timeStartTime2 = $scope.timeEndTime2 - 1000 * 24 * 60 * 60 * 30;
                }
                $scope.getLastedOneMonth2();
                /*获取自定义时间*/
                $scope.getDefineTime2 = function () {
                    var startTime = document.querySelector("#dataDetailsStart").value;
                    var endTime = document.querySelector("#dataDetailsEnd").value;
                    var startTimeYear = parseInt(startTime.split(".")[0]);
                    var startTimeMonth = parseInt(startTime.split(".")[1]);
                    var startTimeDay = parseInt(startTime.split(".")[2]);
                    var endTimeYear = parseInt(endTime.split(".")[0]);
                    var endTimeMonth = parseInt(endTime.split(".")[1]);
                    var endTimeDay = parseInt(endTime.split(".")[2]);
                    var date = new Date();
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setYear(startTimeYear);
                    date.setMonth(startTimeMonth - 1);
                    date.setDate(startTimeDay);
                    $scope.timeStartTime2 = Date.parse(date);
                    date.setYear(endTimeYear);
                    date.setMonth(endTimeMonth - 1);
                    date.setDate(endTimeDay + 1);
                    $scope.timeEndTime2 = Date.parse(date);
                }
                $scope.totalExecute = -1;
                $scope.executeSuccess = -1;
                $scope.executeFail = -1;
                /*更换主题*/
                $scope.changeTheme = function(e){
                    if(e == "全部"){
                        document.querySelector("#tableOneTheme").style.display = "block";
                        document.querySelector("#tableTwoTheme").style.display = "none";
                        document.querySelector("#tableBody1").style.display = "block";
                        document.querySelector("#tableBody2").style.display = "none";
                        $scope.sendRequestExecuteHistory2();
                    }else{
                        document.querySelector("#tableOneTheme").style.display = "none";
                        document.querySelector("#tableTwoTheme").style.display = "block";
                        document.querySelector("#tableBody2").style.display = "block";
                        document.querySelector("#tableBody1").style.display = "none";
                        $scope.sendRequestExecuteHistory2();
                    }
                }
                /*显示下面表头部名称*/
                $scope.repeatTableName = ["主体","来源表数","来源表数据量","目标表数","目标表数据量"];
                /*监听日期选择变化*/
                $scope.sendRequestExecuteHistory = function (e) {
                    $scope.goOrNot = true;
                    switch ($scope.selectedHis) {
                        case "今天":
                            $scope.getTodayPeriod1();
                            $scope.goOrNot = true;
                            break;
                        case "昨天":
                            $scope.getYesterdayPeriod1();
                            $scope.goOrNot = true;
                            break;
                        case "过去一周":
                            $scope.getLastedOneWeek1();
                            $scope.goOrNot = true;
                            break;
                        case "过去一月":
                            $scope.getLastedOneMonth1();
                            $scope.goOrNot = true;
                            break;
                        case "自定义":
                            $scope.getDefineTime1();

                            if($scope.timeStartTime1>$scope.timeEndTime1||$scope.timeStartTime1.toString() == "NaN"||$scope.timeEndTime1.toString() == "NaN"){
                                $scope.goOrNot = false;
                            }else{
                                $scope.goOrNot = true;
                            }
                            break;
                    }
                    /*发送数目请求*/
                    /*?startTime='+$scope.timeStartTime1+'&endTime='+$scope.timeEndTime1*/
                    if($scope.goOrNot == true){
                        folderFactory.XHR('get', '/etl-monitor/api/logs/getExecStatus?startTime='+$scope.timeStartTime1+'&endTime='+$scope.timeEndTime1)
                            .then((data)=> {
                                $scope.executeFail = data.FAIL;
                                $scope.executeSuccess = data.SUCCESS;
                                $scope.totalExecute = data.FAIL + data.SUCCESS;
                            }, (data)=> {
                                console.log(data);
                            })
                        /*发送数据详情请求*/
                        folderFactory.XHR('get', '/etl-monitor/api/logs/getExecStatusDetails?startTime='+$scope.timeStartTime1+'&endTime='+$scope.timeEndTime1)
                            .then((data)=> {
                                $scope.requestResult1 = data;

                            }, (data)=> {
                                console.log(data);
                            })
                    }else{
                        $scope.showBoyTips("请输入正确的时间");
                    }

                }
                $scope.sendRequestExecuteHistory();
                $scope.sendRequestExecuteHistory2 = function(e){
                    $scope.goOrNot2 = true;
                    switch ($scope.selectedHer) {
                        case "今天":
                            $scope.getTodayPeriod2();
                            $scope.goOrNot2 = true;
                            break;
                        case "昨天":
                            $scope.getYesterdayPeriod2();
                            $scope.goOrNot2 = true;
                            break;
                        case "过去一周":
                            $scope.getLastedOneWeek2();
                            $scope.goOrNot2 = true;
                            break;
                        case "过去一月":
                            $scope.getLastedOneMonth2();
                            $scope.goOrNot2 = true;
                            break;
                        case "自定义":
                            $scope.getDefineTime2();
                            if($scope.timeStartTime2>$scope.timeEndTime2||$scope.timeStartTime2.toString() == "NaN"||$scope.timeEndTime2.toString() == "NaN"){
                                $scope.goOrNot2 = false;
                            }else{
                                $scope.goOrNot2 = true;
                            }
                            break;
                    }
                    if($scope.goOrNot2 == true){
                        if($scope.selectedTheme == "全部"){
                            /*发送数目请求*/
                            /*?startTime='+$scope.timeStartTime1+'&endTime='+$scope.timeEndTime1*/
                            folderFactory.XHR('get', '/etl-monitor/api/logs/getExecCount?startTime='+$scope.timeStartTime2+'&endTime='+$scope.timeEndTime2+'&subject=人口,案件,线索,物品,组织,单位')
                                .then((data)=> {
                                    $scope.linesInputIndex = data.linesInput;
                                    $scope.tableInput = data.tableInput;
                                    $scope.linesOutput = data.linesOutput;
                                    $scope.tableOutput = data.tableOutput;
                                    /*  $scope.executeFail = data.FAIL;
                                     $scope.executeSuccess = data.SUCCESS;
                                     $scope.totalExecute = data.FAIL + data.SUCCESS;*/
                                }, (data)=> {
                                    console.log(data);
                                })
                            /*发送数据详情请求*/
                            folderFactory.XHR('get', '/etl-monitor/api/logs/getExecCountDetails?startTime='+$scope.timeStartTime2+'&endTime='+$scope.timeEndTime2+'&subject=人口,案件,线索,物品,组织,单位')
                                .then((data)=> {
                                    $scope.requestResult2 = [];
                                    $scope.requestResult2 = data;

                                }, (data)=> {
                                    console.log(data);
                                })
                        }else{
                            /*发送数目请求*/
                            /*?startTime='+$scope.timeStartTime1+'&endTime='+$scope.timeEndTime1*/
                            folderFactory.XHR('get', '/etl-monitor/api/logs/getExecCount?startTime='+$scope.timeStartTime2+'&endTime='+$scope.timeEndTime2+'&subject='+$scope.selectedTheme)
                                .then((data)=> {
                                    $scope.linesInputIndex = data.linesInput;
                                    $scope.tableInput = data.tableInput;
                                    $scope.linesOutput = data.linesOutput;
                                    $scope.tableOutput = data.tableOutput;
                                    /*  $scope.executeFail = data.FAIL;
                                     $scope.executeSuccess = data.SUCCESS;
                                     $scope.totalExecute = data.FAIL + data.SUCCESS;*/
                                }, (data)=> {
                                    console.log(data);
                                })
                            /*发送数据详情请求*/
                            folderFactory.XHR('get', '/etl-monitor/api/logs/getExecCountDetails?startTime='+$scope.timeStartTime2+'&endTime='+$scope.timeEndTime2+'&subject='+$scope.selectedTheme)
                                .then((data)=> {
                                    $scope.requestResult3 = [];
                                    $scope.requestResult3 = data;
                                    console.log("details");
                                    console.log($scope.requestResult3);
                                }, (data)=> {
                                    console.log(data);
                                })
                        }
                    }else{
                        $scope.showBoyTips("请输入正确的时间");
                    }


                }
                /*执行理事排序*/
                $scope.executeTag1 = 1;
                $scope.executeTag2 = 1;
                $scope.executeTag3 = 1;
                $scope.executeTag4 = 1;
                /*详细排序*/
                $scope.sortDetailOneTag1 = 1;
                $scope.sortDetailOneTag2 = 1;
                $scope.sortDetailOneTag3 = 1;
                $scope.sortDetailOneTag4 = 1;
                $scope.sortDetailOneTag5 = 1;

                $scope.sortDetailTwoTag1 = 1;
                $scope.sortDetailTwoTag2 = 1;
                $scope.sortDetailTwoTag3 = 1;
                $scope.sortDetailTwoTag4 = 1;
                $scope.sortDetailTwoTag5 = 1;

                $scope.executeHistory1 = function(){

                    $scope.requestResult1.sort(function(a,b){
                        if($scope.executeTag1 == 1){
                            return b.execTime - a.execTime;
                        }else{
                            return a.execTime - b.execTime;
                        }
                    })

                    if($scope.executeTag1 == 1){
                        $scope.executeTag1 = 0;
                    }else{
                        $scope.executeTag1 = 1;
                    }
                }
                $scope.executeHistory2 = function(){
                    $scope.requestResult1.sort(function(a,b){
                        if($scope.executeTag2 == 1){
                            return a.jobName > b.jobName;
                        }else{
                            return b.jobName > a.jobName;
                        }
                    })

                    if($scope.executeTag2 == 1){
                        $scope.executeTag2 = 0;
                    }else{
                        $scope.executeTag2 = 1;
                    }
                }
                $scope.executeHistory3 = function(){
                    $scope.requestResult1.sort(function(a,b){
                        if($scope.executeTag3 == 1){
                            return a.kettlePackageName > b.kettlePackageName;
                        }else{
                            return b.kettlePackageName > a.kettlePackageName;
                        }
                    })

                    if($scope.executeTag3 == 1){
                        $scope.executeTag3 = 0;
                    }else{
                        $scope.executeTag3 = 1;
                    }
                }
                $scope.executeHistory4 = function(){
                    $scope.requestResult1.sort(function(a,b){
                        if($scope.executeTag4 == 1){
                            return a.success > b.success;
                        }else{
                            return b.success > a.success;
                        }
                    })

                    if($scope.executeTag4 == 1){
                        $scope.executeTag4 = 0;
                    }else{
                        $scope.executeTag4 = 1;
                    }
                }

                $scope.sortDetailOne1 = function(){
                    $scope.requestResult2.sort(function(a,b){
                        if($scope.sortDetailOneTag1 == 1){
                            return a.subject > b.subject;
                        }else{
                            return b.subject > a.subject;
                        }
                    })

                    if($scope.sortDetailOneTag1 == 1){
                        $scope.sortDetailOneTag1 = 0;
                    }else{
                        $scope.sortDetailOneTag1 = 1;
                    }
                }
                $scope.sortDetailOne2 = function(){
                    $scope.requestResult2.sort(function(a,b){
                        if($scope.sortDetailOneTag2 == 1){
                            return a.tableInput > b.tableInput;
                        }else{
                            return b.tableInput > a.tableInput;
                        }
                    })

                    if($scope.sortDetailOneTag2 == 1){
                        $scope.sortDetailOneTag2 = 0;
                    }else{
                        $scope.sortDetailOneTag2 = 1;
                    }
                }
                $scope.sortDetailOne3 = function(){
                    $scope.requestResult2.sort(function(a,b){
                        if($scope.sortDetailOneTag3 == 1){
                            return a.linesInput > b.linesInput;
                        }else{
                            return b.linesInput > a.linesInput;
                        }
                    })

                    if($scope.sortDetailOneTag3 == 1){
                        $scope.sortDetailOneTag3 = 0;
                    }else{
                        $scope.sortDetailOneTag3 = 1;
                    }
                }
                $scope.sortDetailOne4 = function(){
                    $scope.requestResult2.sort(function(a,b){
                        if($scope.sortDetailOneTag4 == 1){
                            return a.tableOutput > b.tableOutput;
                        }else{
                            return b.tableOutput > a.tableOutput;
                        }
                    })

                    if($scope.sortDetailOneTag4 == 1){
                        $scope.sortDetailOneTag4 = 0;
                    }else{
                        $scope.sortDetailOneTag4 = 1;
                    }
                }
                $scope.sortDetailOne5 = function(){
                    $scope.requestResult2.sort(function(a,b){
                        if($scope.sortDetailOneTag5 == 1){
                            return a.linesOutput > b.linesOutput;
                        }else{
                            return b.linesOutput > a.linesOutput;
                        }
                    })

                    if($scope.sortDetailOneTag5 == 1){
                        $scope.sortDetailOneTag5 = 0;
                    }else{
                        $scope.sortDetailOneTag5 = 1;
                    }
                }

                $scope.sortDetailTwo1 = function(){
                    $scope.requestResult3.sort(function(a,b){
                        if($scope.sortDetailTwoTag1 == 1){
                            return a.stepname.split("_")[0] > b.stepname.split("_")[0];
                        }else{
                            return b.stepname.split("_")[0] > a.stepname.split("_")[0];
                        }
                    })

                    if($scope.sortDetailTwoTag1 == 1){
                        $scope.sortDetailTwoTag1 = 0;
                    }else{
                        $scope.sortDetailTwoTag1 = 1;
                    }
                }
                $scope.sortDetailTwo2 = function(){
                    $scope.requestResult3.sort(function(a,b){
                        if($scope.sortDetailTwoTag2 == 1){
                            return a.stepname.split("_")[1] > b.stepname.split("_")[1];
                        }else{
                            return b.stepname.split("_")[1] > a.stepname.split("_")[1];
                        }
                    })

                    if($scope.sortDetailTwoTag2 == 1){
                        $scope.sortDetailTwoTag2 = 0;
                    }else{
                        $scope.sortDetailTwoTag2 = 1;
                    }
                }
                $scope.sortDetailTwo3 = function(){
                    $scope.requestResult3.sort(function(a,b){
                        if($scope.sortDetailTwoTag3 == 1){
                            return a.stepname.split("_")[2] > b.stepname.split("_")[2];
                        }else{
                            return b.stepname.split("_")[2] > a.stepname.split("_")[2];
                        }
                    })

                    if($scope.sortDetailTwoTag3 == 1){
                        $scope.sortDetailTwoTag3 = 0;
                    }else{
                        $scope.sortDetailTwoTag3 = 1;
                    }
                }
                $scope.sortDetailTwo4 = function(){
                    $scope.requestResult3.sort(function(a,b){
                        if($scope.sortDetailTwoTag4 == 1){
                            return a.linesInput > b.linesInput;
                        }else{
                            return b.linesInput > a.linesInput;
                        }
                    })

                    if($scope.sortDetailTwoTag4 == 1){
                        $scope.sortDetailTwoTag4 = 0;
                    }else{
                        $scope.sortDetailTwoTag4 = 1;
                    }
                }
                $scope.sortDetailTwo5 = function(){
                    $scope.requestResult3.sort(function(a,b){
                        if($scope.sortDetailTwoTag5 == 1){
                            return a.logDate > b.logDate;
                        }else{
                            return b.logDate > a.logDate;
                        }
                    })

                    if($scope.sortDetailTwoTag5 == 1){
                        $scope.sortDetailTwoTag5 = 0;
                    }else{
                        $scope.sortDetailTwoTag5 = 1;
                    }
                }
            })
        };
    })
    /*用户管理*/
    .directive('userManagement',()=>{
        return {
            restrict: 'AE',
            template: require("../template/userManagement.html"),
            controller: ('$scope', 'folderFactory', ($scope, folderFactory)=> {
                //获取用户列表
                $scope.userManageList = [];
                $scope.newUserName = "";
                $scope.newUserPassword = "";
                folderFactory.XHR('get', ' /etl-monitor/api/userrole/users')
                    .then((data)=> {
                        $scope.userManageList = data;
                        $scope.$emit("tongbu",$scope.userManageList);
                    }, (data)=> {
                    })
                //创建新用户并且重新获取用户列表
                $scope.createUserManageUser = function(){
                    //验证用户名是否为空
                    if($scope.newUserName!=""){
                        if($scope.ifNameRule($scope.newUserName)) {
                            $scope.alertTip("用户名不能为空或者带有\/\\符号！");
                            return false;
                        }
                        if ($scope.userManageList.indexOf($scope.newUserName) >= 0) {
                            $scope.alertTip("用户名不能重复！");

                            return false;
                        }
                        var data = "username="+encodeURIComponent($scope.newUserName)+"&password="+encodeURIComponent($scope.newUserPassword);

                        folderFactory.XHR1('post', '/etl-monitor/api/userrole/createUser',data)
                            .then((data1)=> {
                                if(data1==true){
                                    folderFactory.XHR('get', ' /etl-monitor/api/userrole/users')
                                        .then((data2)=> {
                                            $scope.userManageList = data2;
                                            $scope.$emit("tongbu",$scope.userManageList);
                                            $scope.userManageIndex = -1;
                                            $scope.alertTip("添加用户成功");
                                            $scope.etlCloseNewUser();
                                        }, (data)=> {
                                        })
                                }else{
                                    $scope.alertTip("添加用户异常");
                                }
                            }, (data1)=> {
                            })
                    }else{
                        $scope.alertTip("用户名不能为空");
                    }

                }
                //记录选择列表
                $scope.userManageIndex = -1;
                $scope.userManageClick = function(e){
                    $scope.userManageIndex = e;
                    document.querySelector("#ifCanChangePass").disabled = true;
                    //同时发送密码到文本框
                   /* var data = "username="+encodeURIComponent($scope.newUserName)+"&password="+encodeURIComponent($scope.newUserPassword);

                    folderFactory.XHR1('post', '/etl-monitor/api/userrole/createUser',data)
                        .then((data1)=> {

                        }, (data1)=> {
                        })*/
                }
                $scope.createNewData = function(e){
                    var newData = [];
                    for(var a of e){
                        newData.push(a);
                    }
                    return newData;
                }
                //删除用户
                $scope.deleteManageUser = function(){
                    if($scope.userManageIndex != -1){
                        folderFactory.XHR('get', '/etl-monitor/api/userrole/deleteUsers?userNames='+$scope.userManageList[$scope.userManageIndex])
                            .then((data)=> {
                                if(data==true){
                                    folderFactory.XHR('get', ' /etl-monitor/api/userrole/users')
                                        .then((data2)=> {
                                            $scope.userManageList = data2;
                                            $scope.$emit("tongbu",$scope.createNewData(data2));
                                            $scope.alertTip("删除用户成功");
                                            $scope.userManageIndex = -1;
                                        }, (data)=> {
                                        })
                                }else{
                                    $scope.alertTip("删除用户失败");
                                }
                            }, (data)=> {
                                $scope.alertTip("删除用户失败");
                            })
                    }

                }
                //修改密码
                $scope.changeMyPassword = function(){
                    if($scope.userManageIndex != -1){
                        if(document.querySelector("#ifCanChangePass").disabled == false){
                            document.querySelector("#ifCanChangePass").disabled = true;
                            //发送修改密码请求
                            var data = "username="+encodeURIComponent($scope.userManageList[$scope.userManageIndex])+"&password="+encodeURIComponent(document.querySelector("#ifCanChangePass").value);

                            folderFactory.XHR1('post', '/etl-monitor/api/userrole/updatePassword',data)
                                .then((data1)=> {

                                }, (data1)=> {
                                })
                        }else{
                            document.querySelector("#ifCanChangePass").disabled = false;
                        }
                    }
                }

                $scope.etlAddNewUser = function(){
                    $scope.newUserName = "";
                    $scope.newUserPassword = "";
                    document.querySelector(".addNewUser").style.display = "block";
                }
                $scope.etlCloseNewUser = function(){
                    document.querySelector(".addNewUser").style.display = "none";
                }
            })
        };
    })
    /*修改密码*/
    .directive('changePassword',()=> {
        return {
            restrict: 'AE',
            template: require("../template/changePassword.html"),
            link($scope){

            },
            controller: ('$scope', 'folderFactory', ($scope, folderFactory)=> {


                document.querySelector(".content .inputPassword").onkeyup = function(e){
                    var inputValue = document.querySelector(".content .inputPassword").value;
                    var inputValueArray = inputValue.split("");
                    var inputValueLength = inputValueArray.length;
                    var passwordSafety =  judgeAlphaNumber(inputValueArray,inputValueLength);
                    setColorForPassword(passwordSafety);
                }
                function judgeAlphaNumber(value,valueLength){
                    var flag1 = false;
                    var flag2 = false;
                    var flag3 = false;
                    for(var i=0;i<valueLength;i++){
                        if((value[i].charCodeAt()>=65&&value[i].charCodeAt()<=90)||(value[i].charCodeAt()>=97&&value[i].charCodeAt()<=122)){
                            flag1 = true;
                        }else if(value[i].charCodeAt()>=48&&value[i].charCodeAt()<=57){
                            flag2 = true;
                        }else{
                            flag3 = true;
                        }
                    }
                    return flag1+flag2+flag3;
                }
                function setColorForPassword(number){
                    if(number==1){
                        document.querySelector(".weak").style.background = "#E65F5B";
                        document.querySelector(".middle").style.background = "white";
                        document.querySelector(".strong").style.background = "white";
                    }else if(number==2){
                        document.querySelector(".weak").style.background = "#E65F5B";
                        document.querySelector(".middle").style.background = "#E99E3C";
                        document.querySelector(".strong").style.background = "white";
                    }else if(number==3){
                        document.querySelector(".weak").style.background = "#E65F5B";
                        document.querySelector(".middle").style.background = "#E99E3C";
                        document.querySelector(".strong").style.background = "#9BCE4A";
                    }else{
                        document.querySelector(".weak").style.background = "white";
                        document.querySelector(".middle").style.background = "white";
                        document.querySelector(".strong").style.background = "white";
                    }
                }
                /*passwordRepeat*/
                document.querySelector(".checkPasswordContent input").onblur = function(){
                    if(document.querySelector(".newPassContent input").value != ""){
                        if(document.querySelector(".newPassContent input").value!= document.querySelector(".checkPasswordContent input").value){
                            document.querySelector(".passCheckTips").innerHTML = "两次密码输入不一致，请重新输入";
                        }else if(document.querySelector(".newPassContent input").value.length <6 || document.querySelector(".newPassContent input").value.length >16){
                            document.querySelector(".passCheckTips").innerHTML = "密码长度应该在6-16位";
                        }else{
                            document.querySelector(".passCheckTips").innerHTML = "";
                        }
                    }
                }

                //提交密码修改密码请求
                $scope.submitPassword =function(){
                    if(document.querySelector(".newPassContent input").value != ""){
                        if(document.querySelector(".newPassContent input").value!= document.querySelector(".checkPasswordContent input").value){
                            document.querySelector(".passCheckTips").innerHTML = "两次密码输入不一致，请重新输入";
                        }else if(document.querySelector(".newPassContent input").value.length <6 || document.querySelector(".newPassContent input").value.length >16){
                            document.querySelector(".passCheckTips").innerHTML = "密码长度应该在6-16位";
                        }else{
                            document.querySelector(".passCheckTips").innerHTML = "";
                        }
                    }
                    if(document.querySelector(".passCheckTips").innerHTML == ""){
                                //发送修改密码请求
                                var data = "oldpassword="+encodeURIComponent(document.querySelector("#diffOldKey").value)+"&newpassword="+encodeURIComponent(document.querySelector("#diffNewKey").value);
                                folderFactory.XHR1('post', '/etl-monitor/api/userrole/changePassword',data)
                                    .then((data1)=> {
                                            if(data1==true){
                                                $scope.alertTip("修改密码成功");
                                                document.querySelector(".changePasswordEtl").style.display = "none";
                                            }else{
                                                $scope.alertTip("修改失败请核实原密码");
                                            }
                                    }, (data1)=> {
                                })
                    }
                }
            })
        };
    })
    .directive('folderMain', ()=> {
        return {
            restrict: 'AE',
            template: require("../template/mainlist.html"),
            link() {
                /*
                 *page plugin 1.0   2016-09-29 by cary
                 */
                //默认参数
                var defaults = {
                    totalPages: 9,//总页数
                    liNums: 9,//分页的数字按钮数(建议取奇数)
                    activeClass: 'active',//active类
                    firstPage: '首页',//首页按钮名称
                    lastPage: '末页',//末页按钮名称
                    /*prv: '«',//前一页按钮名称*/
                    prv: '上一页',//前一页按钮名称
                    /*next: '»',//后一页按钮名称*/
                    next: '下一页',//后一页按钮名称
                    hasFirstPage: true,//是否有首页按钮
                    hasLastPage: true,//是否有末页按钮
                    hasPrv: true,//是否有前一页按钮
                    hasNext: true,//是否有后一页按钮
                    callBack: function (page) {
                        //回掉，page选中页数
                    }
                };

                //插件名称
                $.fn.Page = function (options) {
                    //覆盖默认参数
                    var opts = $.extend(defaults, options);
                    //主函数
                    return this.each(function () {
                        var obj = $(this);
                        var l = opts.totalPages;
                        var n = opts.liNums;
                        var active = opts.activeClass;
                        var str = '';
                        var str1 = '<li><a href="javascript:" class="' + active + '">1</a></li>';
                        if (l > 1 && l < n + 1) {
                            for (var i = 2; i < l + 1; i++) {
                                str += '<li><a href="javascript:">' + i + '</a></li>';
                            }
                        } else if (l > n) {
                            for (var i = 2; i < n + 1; i++) {
                                str += '<li><a href="javascript:">' + i + '</a></li>';
                            }
                        }
                        var dataHtml = '';
                        if (opts.hasLastPage) {
                            dataHtml += '<div class="last fr">' + opts.lastPage + '</div>';
                        }
                        if (opts.hasNext) {
                            dataHtml += '<div class="next fr">' + opts.next + '</div>';
                        }

                        dataHtml += '<ul class="pagingUl">' + str1 + str + '</ul>';
                        if (opts.hasPrv) {
                            dataHtml += '<div class="prv fr">' + opts.prv + '</div>';
                        }
                        if (opts.hasFirstPage) {
                            dataHtml += '<div class="first fr">' + opts.firstPage + '</div>';
                        }


                        obj.html(dataHtml).off("click");//防止插件重复调用时，重复绑定事件

                        obj.on('click', '.next', function () {
                            var pageshow = parseInt($('.' + active).html());
                            var nums, flag;
                            var a = n % 2;
                            if (a == 0) {
                                //偶数
                                nums = n;
                                flag = true;
                            } else if (a == 1) {
                                //奇数
                                nums = (n + 1);
                                flag = false;
                            }
                            if (pageshow >= l) {
                                return;
                            } else if (pageshow > 0 && pageshow <= nums / 2) {
                                //最前几项
                                $('.' + active).removeClass(active).parent().next().find('a').addClass(active);
                            } else if ((pageshow > l - nums / 2 && pageshow < l && flag == false) || (pageshow > l - nums / 2 - 1 && pageshow < l && flag == true)) {
                                //最后几项
                                $('.' + active).removeClass(active).parent().next().find('a').addClass(active);
                            } else {
                                $('.' + active).removeClass(active).parent().next().find('a').addClass(active);
                                fpageShow(pageshow + 1);
                            }
                            opts.callBack(pageshow + 1);
                        });
                        obj.on('click', '.prv', function () {
                            var pageshow = parseInt($('.' + active).html());
                            var nums = odevity(n);
                            if (pageshow <= 1) {
                                return;
                            } else if ((pageshow > 1 && pageshow <= nums / 2) || (pageshow > l - nums / 2 && pageshow < l + 1)) {
                                //最前几项或最后几项
                                $('.' + active).removeClass(active).parent().prev().find('a').addClass(active);
                            } else {
                                $('.' + active).removeClass(active).parent().prev().find('a').addClass(active);
                                fpageShow(pageshow - 1);
                            }
                            opts.callBack(pageshow - 1);
                        });

                        obj.on('click', '.first', function () {
                            var activepage = parseInt($('.' + active).html());
                            if (activepage <= 1) {
                                return
                            }//当前第一页
                            opts.callBack(1);
                            fpagePrv(0);
                        });
                        obj.on('click', '.last', function () {
                            var activepage = parseInt($('.' + active).html());
                            if (activepage >= l) {
                                return;
                            }//当前最后一页
                            opts.callBack(l);
                            if (l > n) {
                                fpageNext(n - 1);
                            } else {
                                fpageNext(l - 1);
                            }
                        });

                        obj.on('click', 'li', function () {
                            var $this = $(this);
                            var pageshow = parseInt($this.find('a').html());
                            var nums = odevity(n);
                            opts.callBack(pageshow);
                            if (l > n) {
                                if (pageshow > l - nums / 2 && pageshow < l + 1) {
                                    //最后几项
                                    fpageNext((n - 1) - (l - pageshow));
                                } else if (pageshow > 0 && pageshow < nums / 2) {
                                    //最前几项
                                    fpagePrv(pageshow - 1);
                                } else {
                                    fpageShow(pageshow);
                                }
                            } else {
                                $('.' + active).removeClass(active);
                                $this.find('a').addClass(active);
                            }
                        });

                        //重新渲染结构
                        /*activePage 当前项*/
                        function fpageShow(activePage) {
                            var nums = odevity(n);
                            var pageStart = activePage - (nums / 2 - 1);
                            var str1 = '';
                            for (i = 0; i < n; i++) {
                                str1 += '<li><a href="javascript:" class="">' + (pageStart + i) + '</a></li>'
                            }
                            obj.find('ul').html(str1);
                            obj.find('ul li').eq(nums / 2 - 1).find('a').addClass(active);
                        }

                        /*index 选中项索引*/
                        function fpagePrv(index) {
                            var str1 = '';
                            if (l > n - 1) {
                                for (i = 0; i < n; i++) {
                                    str1 += '<li><a href="javascript:" class="">' + (i + 1) + '</a></li>'
                                }
                            } else {
                                for (i = 0; i < l; i++) {
                                    str1 += '<li><a href="javascript:" class="">' + (i + 1) + '</a></li>'
                                }
                            }
                            obj.find('ul').html(str1);
                            obj.find('ul li').eq(index).find('a').addClass(active);
                        }

                        /*index 选中项索引*/
                        function fpageNext(index) {
                            var str1 = '';
                            if (l > n - 1) {
                                for (i = l - (n - 1); i < l + 1; i++) {
                                    str1 += '<li><a href="javascript:" class="">' + i + '</a></li>'
                                }
                                obj.find('ul').html(str1);
                                obj.find('ul li').eq(index).find('a').addClass(active);
                            } else {
                                for (i = 0; i < l; i++) {
                                    str1 += '<li><a href="javascript:" class="">' + (i + 1) + '</a></li>'
                                }
                                obj.find('ul').html(str1);
                                obj.find('ul li').eq(index).find('a').addClass(active);
                            }
                        }

                        //判断liNums的奇偶性
                        function odevity(n) {
                            var a = n % 2;
                            if (a == 0) {
                                //偶数
                                return n;
                            } else if (a == 1) {
                                //奇数
                                return (n + 1);
                            }
                        }
                    });
                }

                /*亮亮亮*/
                $.zUI = $.zUI || {};
                $.zUI.emptyFn = function () {
                };
                $.zUI.asWidget = [];
                /*
                 * core代码，定义增加一个插件的骨架
                 */
                $.zUI.addWidget = function (sName, oSefDef) {
                    //设置规范中的常量sFlagName、sEventName、sOptsName
                    $.zUI.asWidget.push(sName);
                    var w = $.zUI[sName] = $.zUI[sName] || {};
                    var sPrefix = "zUI" + sName
                    w.sFlagName = sPrefix;
                    w.sEventName = sPrefix + "Event";
                    w.sOptsName = sPrefix + "Opts";
                    w.__creator = $.zUI.emptyFn;
                    w.__destroyer = $.zUI.emptyFn;
                    $.extend(w, oSefDef);
                    w.fn = function (ele, opts) {
                        var jqEle = $(ele);
                        jqEle.data(w.sOptsName, $.extend({}, w.defaults, opts));
                        //如果该元素已经执行过了该插件，直接返回，仅相当于修改了配置参数
                        if (jqEle.data(w.sFlagName)) {
                            return;
                        }
                        jqEle.data(w.sFlagName, true);
                        w.__creator(ele);
                        jqEle.on(jqEle.data(w.sEventName));
                    };
                    w.unfn = function (ele) {
                        w.__destroyer(ele);
                        var jqEle = $(ele);//移除监听事件
                        if (jqEle.data(w.sFlagName)) {
                            jqEle.off(jqEle.data(w.sEventName));
                            jqEle.data(w.sFlagName, false);
                        }
                    }

                };
                /*
                 * draggable
                 * 参数：obj{
                 * bOffsetParentBoundary:是否以定位父亲元素为边界,
                 * oBoundary:指定元素left和top的边界值，形如{iMinLeft:...,iMaxLeft:...,iMinTop:...,iMaxTop:...},与上一个参数互斥
                 * fnComputePosition:扩展函数，返回形如{left:...,top:...}的对象
                 * }
                 * 支持的自定义事件:
                 * "draggable.start":drag起始，就是鼠标down后触发
                 * "draggable.move":drag过程中多次触发
                 * "draggable.stop":drag结束触发，就是鼠标up后触发
                 */
                //注册draggable组件
                $.zUI.addWidget("draggable", {
                    defaults: {
                        bOffsetParentBoundary: false,//是否以定位父亲元素为边界
                        oBoundary: null,//边界
                        fnComputePosition: null//计算位置的函数
                    },
                    __creator: function (ele) {
                        var jqEle = $(ele);
                        jqEle.data($.zUI.draggable.sEventName, {
                            mousedown: function (ev) {
                                var jqThis = $(this);
                                var opts = jqThis.data($.zUI.draggable.sOptsName);

                                jqThis.trigger("draggable.start");
                                var iOffsetX = ev.pageX - this.offsetLeft;
                                var iOffsetY = ev.pageY - this.offsetTop;

                                function fnMouseMove(ev) {
                                    var oPos = {};
                                    if (opts.fnComputePosition) {
                                        oPos = opts.fnComputePosition(ev, iOffsetX, iOffsetY);
                                    } else {
                                        oPos.iLeft = ev.pageX - iOffsetX;
                                        oPos.iTop = ev.pageY - iOffsetY;
                                    }

                                    var oBoundary = opts.oBoundary;
                                    if (opts.bOffsetParentBoundary) {//如果以offsetParent作为边界
                                        var eParent = jqThis.offsetParent()[0];
                                        oBoundary = {};
                                        oBoundary.iMinLeft = 0;
                                        oBoundary.iMinTop = 0;
                                        oBoundary.iMaxLeft = eParent.clientWidth - jqThis.outerWidth();
                                        oBoundary.iMaxTop = eParent.clientHeight - jqThis.outerHeight();
                                    }

                                    if (oBoundary) {//如果存在oBoundary，将oBoundary作为边界
                                        oPos.iLeft = oPos.iLeft < oBoundary.iMinLeft ? oBoundary.iMinLeft : oPos.iLeft;
                                        oPos.iLeft = oPos.iLeft > oBoundary.iMaxLeft ? oBoundary.iMaxLeft : oPos.iLeft;
                                        oPos.iTop = oPos.iTop < oBoundary.iMinTop ? oBoundary.iMinTop : oPos.iTop;
                                        oPos.iTop = oPos.iTop > oBoundary.iMaxTop ? oBoundary.iMaxTop : oPos.iTop;
                                    }

                                    jqThis.css({left: oPos.iLeft, top: oPos.iTop});
                                    ev.preventDefault();
                                    jqThis.trigger("draggable.move");
                                }

                                var oEvent = {
                                    mousemove: fnMouseMove,
                                    mouseup: function () {
                                        $(document).off(oEvent);
                                        jqThis.trigger("draggable.stop");
                                    }
                                };

                                $(document).on(oEvent);
                            }
                        });
                    }
                });
                /*
                 * panel
                 * 参数：obj{
                 * 	iWheelStep:鼠标滑轮滚动时步进长度
                 *	sBoxClassName:滚动框的样式
                 * 	sBarClassName:滚动条的样式
                 * }
                 */
                $.zUI.addWidget("panel", {
                    defaults: {
                        iWheelStep: 16,
                        sBoxClassName: "zUIpanelScrollBox",
                        sBarClassName: "zUIpanelScrollBar"
                    },
                    __creator: function (ele) {
                        var jqThis = $(ele);
                        //如果是static定位，加上relative定位
                        if (jqThis.css("position") === "static") {
                            jqThis.css("position", "relative");
                        }
                        jqThis.css("overflow", "hidden");

                        //必须有一个唯一的直接子元素,给直接子元素加上绝对定位
                        var jqChild = jqThis.children(":first");
                        if (jqChild.length) {
                            jqChild.css({top: 0, position: "absolute"});
                        } else {
                            return;
                        }

                        var opts = jqThis.data($.zUI.panel.sOptsName);
                        //创建滚动框
                        var jqScrollBox = $("<div style='position:absolute;display:none;line-height:0;'></div>");
                        jqScrollBox.addClass(opts.sBoxClassName);
                        //创建滚动条
                        var jqScrollBar = $("<div style='position:absolute;display:none;line-height:0;'></div>");
                        jqScrollBar.addClass(opts.sBarClassName);
                        jqScrollBox.appendTo(jqThis);
                        jqScrollBar.appendTo(jqThis);

                        opts.iTop = parseInt(jqScrollBox.css("top"));
                        opts.iWidth = jqScrollBar.width();
                        opts.iRight = parseInt(jqScrollBox.css("right"));


                        //添加拖拽触发自定义函数
                        jqScrollBar.on("draggable.move", function () {
                            var opts = jqThis.data($.zUI.panel.sOptsName);
                            fnScrollContent(jqScrollBox, jqScrollBar, jqThis, jqChild, opts.iTop, 0);
                        });

                        //事件对象
                        var oEvent = {
                            mouseenter: function () {
                                fnFreshScroll();
                                jqScrollBox.css("display", "block");
                                jqScrollBar.css("display", "block");
                            },
                            mouseleave: function () {
                                jqScrollBox.css("display", "none");
                                jqScrollBar.css("display", "none");
                            }
                        };

                        var sMouseWheel = "mousewheel";
                        if (!("onmousewheel" in document)) {
                            sMouseWheel = "DOMMouseScroll";
                        }
                        oEvent[sMouseWheel] = function (ev) {
                            var opts = jqThis.data($.zUI.panel.sOptsName);
                            var iWheelDelta = 1;
                            ev.preventDefault();//阻止默认事件
                            ev = ev.originalEvent;//获取原生的event
                            if (ev.wheelDelta) {
                                iWheelDelta = ev.wheelDelta / 120;
                            } else {
                                iWheelDelta = -ev.detail / 3;
                            }
                            var iMinTop = jqThis.innerHeight() - jqChild.outerHeight();
                            //外面比里面高，不需要响应滚动
                            if (iMinTop > 0) {
                                jqChild.css("top", 0);
                                return;
                            }
                            var iTop = parseInt(jqChild.css("top"));
                            var iTop = iTop + opts.iWheelStep * iWheelDelta;
                            iTop = iTop > 0 ? 0 : iTop;
                            iTop = iTop < iMinTop ? iMinTop : iTop;
                            jqChild.css("top", iTop);
                            fnScrollContent(jqThis, jqChild, jqScrollBox, jqScrollBar, 0, opts.iTop);
                        }
                        //记录添加事件
                        jqThis.data($.zUI.panel.sEventName, oEvent);
                        //跟随滚动函数
                        function fnScrollContent(jqWrapper, jqContent, jqFollowWrapper, jqFlollowContent, iOffset1, iOffset2) {
                            var opts = jqThis.data($.zUI.panel.sOptsName);
                            var rate = (parseInt(jqContent.css("top")) - iOffset1) / (jqContent.outerHeight() - jqWrapper.innerHeight())//卷起的比率
                            var iTop = (jqFlollowContent.outerHeight() - jqFollowWrapper.innerHeight()) * rate + iOffset2;
                            jqFlollowContent.css("top", iTop);
                        }

                        //刷新滚动条
                        function fnFreshScroll() {

                            var opts = jqThis.data($.zUI.panel.sOptsName);
                            var iScrollBoxHeight = jqThis.innerHeight() - 2 * opts.iTop;
                            var iRate = jqThis.innerHeight() / jqChild.outerHeight();
                            var iScrollBarHeight = iScrollBarHeight = Math.round(iRate * iScrollBoxHeight);
                            if (iScrollBarHeight < 20) {
                                iScrollBarHeight = 20;
                            }
                            //如果比率大于等于1，不需要滚动条,自然也不需要添加拖拽事件
                            if (iRate >= 1) {
                                jqScrollBox.css("height", 0);
                                jqScrollBar.css("height", 0);
                                return;
                            }
                            jqScrollBox.css("height", iScrollBoxHeight);
                            jqScrollBar.css("height", iScrollBarHeight);
                            //计算拖拽边界，添加拖拽事件
                            var oBoundary = {iMinTop: opts.iTop};
                            //oBoundary.iMaxTop = iScrollBoxHeight - Math.round(iRate * iScrollBoxHeight) + opts.iTop;
                            oBoundary.iMaxTop = iScrollBoxHeight - iScrollBarHeight + opts.iTop;
                            oBoundary.iMinLeft = jqThis.innerWidth() - opts.iWidth - opts.iRight;
                            oBoundary.iMaxLeft = oBoundary.iMinLeft;
                            fnScrollContent(jqThis, jqChild, jqScrollBox, jqScrollBar, 0, opts.iTop);
                            jqScrollBar.draggable({oBoundary: oBoundary});
                        }
                    },
                    __destroyer: function (ele) {
                        var jqEle = $(ele);
                        if (jqEle.data($.zUI.panel.sFlagName)) {
                            var opts = jqEle.data($.zUI.panel.sOptsName);
                            jqEle.children("." + opts.sBoxClassName).remove();
                            jqEle.children("." + opts.sBarClassName).remove();
                        }
                    }
                });

                $.each($.zUI.asWidget, function (i, widget) {
                    var unWidget = "un" + widget;
                    var w = {};
                    w[widget] = function (args) {
                        this.each(function () {
                            $.zUI[widget].fn(this, args);
                        });
                        return this;
                    };
                    w[unWidget] = function () {
                        this.each(function () {
                            $.zUI[widget].unfn(this);
                        });
                        return this;
                    };
                    $.fn.extend(w);
                });

                $("#tree").panel({iWheelStep: 32});
                $("#planLists").panel({iWheelStep: 32});
                $("#logInfo").panel({iWheelStep: 32});
                //$("#joblogs").panel({iWheelStep:32});
                //$("#tasklogs").panel({iWheelStep:32});
                //$("#setpLogs").panel({iWheelStep:32});


                $(".logs li").click(function () {
                    $(this).addClass("active").siblings().removeClass("active");
                    var index = $(this).index();
                    $(".logInfo > div > table").each(function () {
                        $(this).hide();
                    });
                    $(".logInfo div table")[index].style.display = "table";
                });
                $("body").on("click", ".mainTitle i", function (e) {
                    e.stopPropagation();
                    $(".roleBox").show();
                }).on("click", function () {
                    $(".roleBox").hide();
                });


                $(window).resize(function () {
                    if ($(".scalescreenbtn").css("display") === "none") {
                        $(".workFlowBody canvas").width($(".workFlowBody").width() - 5).height($(".workFlowBody").height() - 5);
                    }
                })
            },
            controller: ('$scope', 'folderFactory', '$http', ($scope, folderFactory, $http, $interval)=> {
                //日期格式化
                Date.prototype.Format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                };
                //数组最大值
                Array.prototype.max = function () {
                    return Math.max.apply({}, this)
                };
                //数组最小值
                Array.prototype.min = function () {
                    return Math.min.apply({}, this)
                };
                //图片地址
                $scope.imgSrc = img;
                //画方格
                function rect(x, y, width, height, name, type, data) {

                    var oC = document.getElementById('myCanvas');
                    var oGC = oC.getContext('2d');
                    oGC.strokeStyle = "#666";
                    oGC.fillStyle = "#fff";
                    oGC.fillRect(x, y, width, height);
                    var yImg = new Image();
                    yImg.src = $scope.imgSrc;
                    yImg.onload = function () {
                        draw(this);
                    };
                    function draw(obj) {
                        var a, b;
                        switch (type) {
                            case "SPECIAL":
                                a = 233;
                                b = 82;
                                break;
                            case "SUCCESS":
                                a = 233;
                                b = 266;
                                break;
                            default :
                                a = 233;
                                b = 21;
                        }

                        oGC.drawImage(obj, a, b, 42, 42, x, y, width, height);
                    }

                    oGC.fill();
                    oGC.stroke();
                    oGC.font = "16px";

                    var getBLen = function(str) {
                        if (str == null) return 0;
                        if (typeof str != "string"){
                            str += "";
                        }
                        return str.replace(/[^\x00-\xff]/g,"01").length;
                    };
                    var fontOffset = (50 - getBLen(name)*6)/2;
                    oGC.strokeText(name, x + fontOffset, y + height + 20);
                    oC.addEventListener("click", function (e) {
                        emitSignal(e, x, y, width, height, name, type, data);
                    });
                }
                function emitSignal(e, x, y, width, height, name, type, data) {
                    if($(".fullscreenbtn").css("display") !== "none") return;
                    if (e.layerX >= parseInt(x) && e.layerX <= parseInt(x) + parseInt(width)) {
                        if (e.layerY >= parseInt(y) && e.layerY <= parseInt(y) + parseInt(height)) {
                            if (type == "SUCCESS") {
                                if(!$scope.data) return;
                                var data = {
                                    type : e,
                                    data : $scope.data,
                                    name : name
                                };

                            } else if (type == "TRANS") {
                                //alert("你点的TRANS");
                            } else if (type == "TABLE_EXISTS") {
                                //alert("你点的TABLE_EXISTS");
                            } else if (type == "SQL") {
                                //alert("你点的SQL");
                            } else if (type == "SPECIAL") {
                                //alert("你点的SPECIAL");
                            } else if (type == "SYSLOG") {
                                //alert("你点的SYSLOG");
                            } else if (type == "TALEND_JOB_EXEC") {
                                //alert("你点的TALEND_JOB_EXEC");
                            } else if (type == "TableInput") {
                                /*表输入*/
                                //if (!$scope.data) return;
                                var data = {
                                    type: e,
                                    data: $scope.data,
                                    name:name
                                };
                                $scope.$broadcast('tableinput', data);
                                /*$scope.$emit('tableinput');*/
                            } else if (type == "TableOutput") {
                                /*表输出*/
                                if (!$scope.data) return;
                                var data = {
                                    type: e,
                                    data: $scope.data,
                                    name:name
                                };
                                $scope.$emit('tableOutput',data);
                            } else if (type == "RowGenerator") {
                                //alert("你点的RowGenerator");
                            } else if (type == "Update") {
                                //alert("你点的Update");
                            } else if (type == "MongoDbInput") {
                                //alert("你点的MongoDbInput");
                            } else if (type == "ClosureGenerator") {
                                //alert("你点的ClosureGenerator");
                            }else if(type == "Unique"){
                                $scope.$broadcast(type, data);
                            }else if(type == "SortRows"){
                                if(!$scope.data) return;
                                var data = {
                                    type : e,
                                    data : $scope.data,
                                    name : name
                                };
                                $scope.$broadcast('SortRows',data);
                            }else if(type == "SplitFieldToRows3"){
                                $scope.$broadcast(type, data);
                            }else if(type == "HBaseInput"){

                                if(!$scope.data) return;
                                var data = {
                                    type : e,
                                    data : $scope.data,
                                    name : name
                                };
                                $scope.$broadcast('hbaseInput',data);
                            }else if(type == "SelectValues"){
                                $scope.$broadcast(type, data);
                            }else if(type == "NumberRange"){
                                if(!$scope.data) return;
                                var data = {
                                    type : e,
                                    data : $scope.data,
                                    name : name
                                };
                                $scope.$broadcast('NumberRange',data);
                            }else if(type == "InsertUpdate"){
                                $scope.$broadcast(type, data);
                            }
                            else{
                                //alert(type);
                            }
                        }
                    }
                }

                //画线
                function drawLine(x1, y1, x2, y2, unconditional, evaluation, enabled) {
                    var canvas = document.getElementById('myCanvas');
                    var context = canvas.getContext("2d");

                    function Line(x1, y1, x2, y2) {
                        this.x1 = x1;
                        this.y1 = y1;
                        this.x2 = x2;
                        this.y2 = y2;
                    }

                    Line.prototype.drawWithArrowheads = function (ctx) {
                        //线的样式
                        // arbitrary styling
                        var iconX, iconY;
                        if (enabled === "Y") {
                            if (unconditional === "Y") {
                                ctx.strokeStyle = "#8c8c8c";
                                ctx.fillStyle = "#8c8c8c";
                                iconX = 110;
                                iconY = 21;
                            } else {
                                if (evaluation === "Y") {
                                    ctx.strokeStyle = "#00c999";
                                    ctx.fillStyle = "#00c999";
                                    iconX = 110;
                                    iconY = 50;
                                } else {
                                    ctx.strokeStyle = "#fc601e";
                                    ctx.fillStyle = "#fc601e";
                                    iconX = 110;
                                    iconY = 140;
                                }
                            }
                        } else {
                            ctx.strokeStyle = "#8c8c8c";
                            ctx.fillStyle = "#8c8c8c";
                        }

                        //ktr
                        if (unconditional === "success") {
                            ctx.strokeStyle = "#00c999";
                            ctx.fillStyle = "#00c999";
                        } else if (unconditional === "fail") {
                            ctx.strokeStyle = "#fc601e";
                            ctx.fillStyle = "#fc601e";
                        }

                        ctx.lineWidth = 1;

                        // draw the line
                        ctx.beginPath();
                        ctx.moveTo(this.x1, this.y1);
                        ctx.lineTo(this.x2, this.y2);
                        ctx.stroke();
                        ctx.closePath();

                        // draw the starting arrowhead
                        var startRadians = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1));
                        startRadians += ((this.x2 >= this.x1) ? -90 : 90) * Math.PI / 180;
                        this.drawArrowhead(ctx, this.x1, this.y1, startRadians);
                        icon(iconX, iconY, (parseInt(x2) + parseInt(x1)) / 2, (parseInt(y2) + parseInt(y1)) / 2);
                        // draw the ending arrowhead
                        //var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
                        //endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
                        //this.drawArrowhead(ctx,this.x2,this.y2,endRadians);

                    };
                    Line.prototype.drawArrowhead = function (ctx, x, y, radians) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.translate(x, y);
                        ctx.rotate(radians);
                        ctx.moveTo(0, 0);
                        ctx.lineTo(5, 20);
                        ctx.lineTo(-5, 20);
                        ctx.closePath();
                        ctx.restore();
                        ctx.fill();
                    };
                    // 创建新的线的对象
                    var line = new Line(x1, y1, x2, y2);
                    // 画角
                    line.drawWithArrowheads(context);
                }

                //绘制图标
                function icon(a, b, x, y) {
                    var iconW = 20;
                    var iconH = 20;
                    var oC = document.getElementById('myCanvas');
                    var oGC = oC.getContext('2d');
                    oGC.fillStyle = "transparent";
                    oGC.fillRect(x, y, 20, 20);
                    var yImg = new Image();
                    yImg.src = $scope.imgSrc;
                    yImg.onload = function () {
                        draw(this);
                    };
                    function draw(obj) {
                        oGC.drawImage(obj, a, b, 20, 20, x - 10, y - 10, iconW, iconH);
                    }
                }

                //获取位置
                function getPositon(name, data) {
                    if (data.job) {
                        for (var i = 0; i < data.job.entries.entry.length; i++) {
                            if (data.job.entries.entry[i].name === name) {
                                return {
                                    x: data.job.entries.entry[i].xloc,
                                    y: data.job.entries.entry[i].yloc
                                };
                            }
                        }
                    } else {
                        for (var i = 0; i < data.transformation.step.length; i++) {
                            if (data.transformation.step[i].name === name) {
                                return {
                                    x: data.transformation.step[i].GUI.xloc,
                                    y: data.transformation.step[i].GUI.yloc
                                };
                            }
                        }
                    }

                }

                //偏移量
                var offsetX;
                var offsetY;
                //开干
                function drawCanvas(data, d, tag) {
                    //data  数据
                    //d 放大还是缩小 值是small为缩小 值是full为放大
                    //tag 标记入口 值是true是文件树入口  值是false是放大缩小入口
                    var divW = $(".workFlowBody").width();
                    var divH = $(".workFlowBody").height();
                    var myCanvas = $("<canvas></canvas>");
                    if ($(".workFlowBody canvas").length > 0) {
                        $(".workFlowBody canvas").remove();
                    }
                    $(".workFlowBody").append(myCanvas);
                    $(".workFlowBody .loading").hide();
                    //图形的大小
                    var width = 50;
                    var height = 50;
                    //存放坐标的数据的数组
                    var minX = [];
                    var minY = [];
                    //盒子中心
                    var screenX = divW / 2;
                    var screenY = divH / 2;
                    if (tag) {
                        offsetX = null;
                        offsetY = null;
                    }
                    //如果存在job  是kjb  否则是ktr
                    if (data.job) {
                        //kjb 矩形
                        //job.entries 是字符串为空  是对象为一个图形  是数组为多个图形
                        if (typeof data.job.entries === "object") {
                            if (data.job.entries.entry.constructor === Array) {
                                if (d === "full" && offsetX) {
                                    for (var i = 0; i < data.job.entries.entry.length; i++) {
                                        data.job.entries.entry[i].xloc = data.job.entries.entry[i].xloc + offsetX;
                                        data.job.entries.entry[i].yloc = data.job.entries.entry[i].yloc + offsetY;
                                    }
                                }
                                for (var j = 0; j < data.job.entries.entry.length; j++) {
                                    minX.push(data.job.entries.entry[j].xloc);
                                    minY.push(data.job.entries.entry[j].yloc);
                                }
                                if (d === "small") {
                                    myCanvas.attr({'id': 'myCanvas', 'width': divW, 'height': divH});
                                } else {
                                    myCanvas.attr({
                                        'id': 'myCanvas',
                                        'width': parseInt(minX.max()) + 200,
                                        'height': parseInt(minY.max() + 200)
                                    });
                                }
                                for (var i = 0; i < data.job.entries.entry.length; i++) {
                                    if (d === "small") {
                                        offsetX = (minX.max() + minX.min()) / 2 - screenX;
                                        offsetY = (minY.max() + minY.min()) / 2 - screenY;
                                        data.job.entries.entry[i].xloc = data.job.entries.entry[i].xloc - offsetX;
                                        data.job.entries.entry[i].yloc = data.job.entries.entry[i].yloc - offsetY;
                                    }
                                    var x = parseInt(data.job.entries.entry[i].xloc);
                                    var y = parseInt(data.job.entries.entry[i].yloc);
                                    var name = data.job.entries.entry[i].name;
                                    var type = data.job.entries.entry[i].type;
                                    rect(x, y, width, height, name, type);
                                }
                            } else {
                                if (d === "full" && offsetX) {
                                    data.job.entries.entry.yloc = data.job.entries.entry.yloc + offsetY;
                                    data.job.entries.entry.xloc = data.job.entries.entry.xloc + offsetX;
                                }
                                minX.push(data.job.entries.entry.xloc);
                                minY.push(data.job.entries.entry.yloc);
                                myCanvas.attr({
                                    'id': 'myCanvas',
                                    'width': parseInt(minX.max()) + 200,
                                    'height': parseInt(minY.max()) + 200
                                });
                                if (d === "small") {
                                    offsetX = (parseInt(minX.max()) + parseInt(minX.min())) / 2 - screenX;
                                    offsetY = (parseInt(minY.max()) + parseInt(minY.min())) / 2 - screenY;
                                    myCanvas.attr({'id': 'myCanvas', 'width': divW, 'height': divH});
                                    data.job.entries.entry.yloc = data.job.entries.entry.yloc - offsetY;
                                    data.job.entries.entry.xloc = data.job.entries.entry.xloc - offsetX;
                                }
                                var x = parseInt(data.job.entries.entry.xloc);
                                var y = parseInt(data.job.entries.entry.yloc);
                                var name = data.job.entries.entry.name;
                                var type = data.job.entries.entry.type;
                                rect(x, y, width, height, name, type);
                            }
                        }
                        //kjb 线
                        if (typeof data.job.hops === "object") {
                            if (data.job.hops.hop.constructor === Array) {
                                for (var i = 0; i < data.job.hops.hop.length; i++) {
                                    var positonFrom = getPositon(data.job.hops.hop[i].from, data);
                                    var positonTo = getPositon(data.job.hops.hop[i].to, data);
                                    if (positonFrom.y - positonTo.y > height) {
                                        positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                        positonTo.y = parseInt(positonTo.y) + height;
                                        if (positonFrom.x - positonTo.x > width) {
                                            positonTo.x = parseInt(positonTo.x) + width;
                                        } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                            positonTo.x = parseInt(positonTo.x) + width / 2;
                                        }
                                    } else if (Math.abs(positonFrom.y - positonTo.y) <= height) {
                                        positonFrom.y = parseInt(positonFrom.y) + height / 2;
                                        positonTo.y = parseInt(positonTo.y) + height / 2;
                                        if (positonFrom.x - positonTo.x > 0) {
                                            positonTo.x = parseInt(positonTo.x) + width;
                                        } else {
                                            positonFrom.x = parseInt(positonFrom.x) + width;
                                        }
                                    } else {
                                        positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                        positonFrom.y = parseInt(positonFrom.y) + height;
                                        if (positonFrom.x - positonTo.x > width) {
                                            positonTo.x = parseInt(positonTo.x) + width;
                                        } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                            positonTo.x = parseInt(positonTo.x) + width / 2;
                                        }
                                    }
                                    //控制线的显示
                                    var enabled = data.job.hops.hop[i].enabled;
                                    //线的颜色
                                    var evaluation = data.job.hops.hop[i].evaluation;
                                    //线的颜色
                                    var unconditional = data.job.hops.hop[i].unconditional;
                                    drawLine(positonTo.x, positonTo.y, positonFrom.x, positonFrom.y, unconditional, evaluation, enabled);
                                }
                            } else {
                                var positonFrom = getPositon(data.job.hops.hop.from, data);
                                var positonTo = getPositon(data.job.hops.hop.to, data);
                                if (positonFrom.y - positonTo.y > height) {
                                    positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                    positonTo.y = parseInt(positonTo.y) + height;
                                    if (positonFrom.x - positonTo.x > width) {
                                        positonTo.x = parseInt(positonTo.x) + width;
                                    } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                        positonTo.x = parseInt(positonTo.x) + width / 2;
                                    }
                                } else if (Math.abs(positonFrom.y - positonTo.y) <= height) {
                                    positonFrom.y = parseInt(positonFrom.y) + height / 2;
                                    positonTo.y = parseInt(positonTo.y) + height / 2;
                                    if (positonFrom.x - positonTo.x > 0) {
                                        positonTo.x = parseInt(positonTo.x) + width;
                                    } else {
                                        positonFrom.x = parseInt(positonFrom.x) + width;
                                    }
                                } else {
                                    positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                    positonFrom.y = parseInt(positonFrom.y) + height;
                                    if (positonFrom.x - positonTo.x > width) {
                                        positonTo.x = parseInt(positonTo.x) + width;
                                    } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                        positonTo.x = parseInt(positonTo.x) + width / 2;
                                    }
                                }
                                //控制线的显示
                                var enabled = data.job.hops.hop.enabled;
                                //线的颜色
                                var evaluation = data.job.hops.hop.evaluation;
                                //线的颜色
                                var unconditional = data.job.hops.hop.unconditional;
                                drawLine(positonTo.x, positonTo.y, positonFrom.x, positonFrom.y, unconditional, evaluation, enabled);
                            }
                        }

                    } else {
                        //ktr
                        var errorInfo = {};
                        //ktr 错误
                        if (typeof data.transformation.step_error_handling === "object") {
                            if (data.transformation.step_error_handling.constructor == Array) {
                                for (var i = 0; i < data.transformation.step_error_handling.length; i++) {
                                    errorInfo[data.transformation.step_error_handling[i].source_step] = data.transformation.step_error_handling[i].source_step.target_step;
                                }
                            } else {
                                errorInfo[data.transformation.step_error_handling.error.source_step] = data.transformation.step_error_handling.error.target_step;
                            }
                        }
                        //ktr 矩形
                        if (typeof data.transformation.step === "object") {
                            if (data.transformation.step.constructor == Array) {
                                if (d === "full" && offsetX) {
                                    for (var i = 0; i < data.transformation.step.length; i++) {
                                        data.transformation.step[i].GUI.xloc = data.transformation.step[i].GUI.xloc + offsetX;
                                        data.transformation.step[i].GUI.yloc = data.transformation.step[i].GUI.yloc + offsetY;
                                    }
                                }
                                for (var j = 0; j < data.transformation.step.length; j++) {
                                    minX.push(data.transformation.step[j].GUI.xloc);
                                    minY.push(data.transformation.step[j].GUI.yloc);
                                }
                                if (d === "small") {
                                    offsetX = (minX.max() + minX.min()) / 2 - screenX;
                                    offsetY = (minY.max() + minY.min()) / 2 - screenY;
                                    myCanvas.attr({'id': 'myCanvas', 'width': divW, 'height': divH});
                                } else {
                                    myCanvas.attr({
                                        'id': 'myCanvas',
                                        'width': parseInt(minX.max()) + 200,
                                        'height': parseInt(minY.max()) + 200
                                    });
                                }
                                for (var i = 0; i < data.transformation.step.length; i++) {
                                    if (d === "small") {
                                        data.transformation.step[i].GUI.xloc = data.transformation.step[i].GUI.xloc - offsetX;
                                        data.transformation.step[i].GUI.yloc = data.transformation.step[i].GUI.yloc - offsetY;
                                    }
                                    var x = parseInt(data.transformation.step[i].GUI.xloc);
                                    var y = parseInt(data.transformation.step[i].GUI.yloc);
                                    var name = data.transformation.step[i].name;
                                    var type = data.transformation.step[i].type;
                                    var recData = data.transformation.step[i];
                                    rect(x, y, width, height, name, type, recData);
                                }
                            } else {
                                if (d === "full" && offsetX) {
                                    data.transformation.step.GUI.xloc = data.transformation.step.GUI.xloc + offsetX;
                                    data.transformation.step.GUI.yloc = data.transformation.step.GUI.yloc + offsetY;
                                }
                                minX.push(data.transformation.step.GUI.xloc);
                                minY.push(data.transformation.step.GUI.yloc);
                                if (d === "small") {
                                    offsetX = (parseInt(minX.max()) + parseInt(minX.min())) / 2 - screenX;
                                    offsetY = (parseInt(minY.max()) + parseInt(minY.min())) / 2 - screenY;
                                    myCanvas.attr({'id': 'myCanvas', 'width': divW, 'height': divH});
                                    data.transformation.step.GUI.xloc = data.transformation.step.GUI.xloc - offsetX;
                                    data.transformation.step.GUI.yloc = data.transformation.step.GUI.yloc - offsetY;
                                } else {
                                    myCanvas.attr({
                                        'id': 'myCanvas',
                                        'width': parseInt(minX.max()) + 200,
                                        'height': parseInt(minY.max()) + 200
                                    });
                                }
                                var x = parseInt(data.transformation.step.GUI.xloc);
                                var y = parseInt(data.transformation.step.GUI.yloc);
                                var name = data.transformation.step.name;
                                var type = data.transformation.step.type;
                                var recData = data.transformation.step;
                                rect(x, y, width, height, name, type, recData);
                            }
                        }
                        //ktr 线
                        if (typeof data.transformation.order === "object") {
                            if (data.transformation.order.hop.constructor == Array) {
                                for (var i = 0; i < data.transformation.order.hop.length; i++) {
                                    var positonFrom = getPositon(data.transformation.order.hop[i].from, data);
                                    var positonTo = getPositon(data.transformation.order.hop[i].to, data);
                                    var color = "success";
                                    if (errorInfo[data.transformation.order.hop[i].from] === data.transformation.order.hop[i].to) {
                                        color = "fail";
                                    } else {
                                        color = "success";
                                    }
                                    if (positonFrom.y - positonTo.y > height) {
                                        positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                        positonTo.y = parseInt(positonTo.y) + height;
                                        if (positonFrom.x - positonTo.x > width) {
                                            positonTo.x = parseInt(positonTo.x) + width;
                                        } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                            positonTo.x = parseInt(positonTo.x) + width / 2;
                                        }
                                    } else if (Math.abs(positonFrom.y - positonTo.y) <= height) {
                                        positonFrom.y = parseInt(positonFrom.y) + height / 2;
                                        positonTo.y = parseInt(positonTo.y) + height / 2;
                                        if (positonFrom.x - positonTo.x > 0) {
                                            positonTo.x = parseInt(positonTo.x) + width;
                                        } else {
                                            positonFrom.x = parseInt(positonFrom.x) + width;
                                        }
                                    } else {
                                        positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                        positonFrom.y = parseInt(positonFrom.y) + height;
                                        if (positonFrom.x - positonTo.x > width) {
                                            positonTo.x = parseInt(positonTo.x) + width;
                                        } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                            positonTo.x = parseInt(positonTo.x) + width / 2;
                                        }
                                    }
                                    drawLine(positonTo.x, positonTo.y, positonFrom.x, positonFrom.y, color, unconditional, evaluation, enabled);
                                }
                            } else {
                                var positonFrom = getPositon(data.transformation.order.hop.from, data);
                                var positonTo = getPositon(data.transformation.order.hop.to, data);
                                var color = "success";
                                if (errorInfo[data.transformation.order.hop.from] === data.transformation.order.hop.to) {
                                    color = "fail";
                                } else {
                                    color = "success";
                                }
                                if (positonFrom.y - positonTo.y > height) {
                                    positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                    positonTo.y = parseInt(positonTo.y) + height;
                                    if (positonFrom.x - positonTo.x > width) {
                                        positonTo.x = parseInt(positonTo.x) + width;
                                    } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                        positonTo.x = parseInt(positonTo.x) + width / 2;
                                    }
                                } else if (Math.abs(positonFrom.y - positonTo.y) <= height) {
                                    positonFrom.y = parseInt(positonFrom.y) + height / 2;
                                    positonTo.y = parseInt(positonTo.y) + height / 2;
                                    if (positonFrom.x - positonTo.x > 0) {
                                        positonTo.x = parseInt(positonTo.x) + width;
                                    } else {
                                        positonFrom.x = parseInt(positonFrom.x) + width;
                                    }
                                } else {
                                    positonFrom.x = parseInt(positonFrom.x) + width / 2;
                                    positonFrom.y = parseInt(positonFrom.y) + height;
                                    if (positonFrom.x - positonTo.x > width) {
                                        positonTo.x = parseInt(positonTo.x) + width;
                                    } else if (Math.abs(positonFrom.x - positonTo.x) <= width) {
                                        positonTo.x = parseInt(positonTo.x) + width / 2;
                                    }
                                }
                                drawLine(positonTo.x, positonTo.y, positonFrom.x, positonFrom.y, color, unconditional, evaluation, enabled);
                            }
                        }
                    }

                }

                //获取数据
                $scope.$on('getInfo', (d, data)=> {
                    $scope.planName = data.file.name;
                    var path = data.file.path.replace(/\//g, ":");
                    $scope.filePath = path;
                    path = encodeURIComponent(path);
                    //测试数据 var path = ":testjb.kjb";
                    //如果是文件夹folder为true 不执行工作流数据 不执行日志数据
                    if (!data.file.folder) {
                        //工作流数据
                        $scope.data = "";
                        $scope.workFlowName = "- " + $scope.planName;
                        $(".workFlowBody canvas").remove();
                        $(".workFlowBody .loading").show();
                        $http.get("/etl-monitor/api/repo/files/" + path + "/content",
                            {
                                transformResponse: function (cnv) {
                                    $scope.testData = cnv;
                                    xml2js.parseString(cnv, {explicitArray: false}, function (err, data) {
                                        if ((!data || !data.job) && (!data || !data.transformation)) {
                                            $(".workFlowBody .loading").hide();
                                            return;
                                        }
                                        $scope.data = data;
                                        if ($(".scalescreenbtn").css("display") === "none") {
                                            drawCanvas($scope.data, "small", true);
                                        } else {
                                            drawCanvas($scope.data, "full", true);
                                        }
                                    });
                                }
                            })
                            .success(function (data) {

                            });
                        //日志数据
                        getLogData(path);
                    }
                    $scope.redrawCanvas = function(e){
                        drawCanvas($scope.data, "full", true);
                    };
                    /*$scope.$on("changeInputTable", function () {
                        drawCanvas($scope.data, "full", true);
                    });
                    $scope.$on("changeOutputTable",function(){
                        drawCanvas($scope.data, "full", true);
                    })*/
                    //获取日志数据
       
                    function getLogData(path) {
                        folderFactory.XHR('get', '/etl-monitor/api/logs/scheduledDate?pathId=' + path + '')
                            .then((data)=> {
                                if (data.length > 0) {
                                    $scope.alltime = data;
                                    $scope.timeModel = new Date(data[0][2]).Format("yyyy-MM-dd hh:mm:ss");
                                    folderFactory.XHR('get', '/etl-monitor/api/logs/detailLogs?channelId=' + data[0][1] + '&pathId=' + path + '')
                                        .then((data)=> {
                                            $scope.setpLog = data.steplog;
                                            $scope.joblog = data.joblog ? data.joblog[0].logField.split(/[\n]/g) : data.translog[0].logField.split(/[\n]/g);
                                            $scope.jobsteplog = data.jobsteplog;
                                        }, (data)=> {

                                        })
                                } else {
                                    $scope.alltime = [];
                                    $scope.setpLog = [];
                                    $scope.joblog = [];
                                    $scope.jobsteplog = [];

                                }
                            }, (data)=> {

                            });
                    }

                    //选择时间
                    $scope.selectTime = (e)=> {
                        for (var i = 0; i < $scope.alltime.length; i++) {
                            if (new Date($scope.alltime[i][2]).Format("yyyy-MM-dd hh:mm:ss") === e) {
                                $scope.channelId = $scope.alltime[i][1];
                            }
                        }
                        folderFactory.XHR('get', '/etl-monitor/api/logs/detailLogs?channelId=' + $scope.channelId + '&pathId=' + path + '')
                            .then((data)=> {
                                $scope.setpLog = data.steplog ? data.steplog : [];
                                if (data.joblog && data.joblog.length > 0) {
                                    $scope.joblog = data.joblog[0].logField.split("\n");
                                } else if (data.translog && data.translog.length > 0) {
                                    $scope.joblog = data.translog[0].logField.split("\n")
                                } else {
                                    $scope.joblog = [];
                                }
                                $scope.jobsteplog = data.jobsteplog ? data.jobsteplog : [];
                            }, (data)=> {

                            })
                    };
                    //作业列表
                    folderFactory.XHR('get', '/etl-monitor/api/scheduler/getJobsByPathId?pathId=' + path + '')
                        .then((data)=> {
                            $scope.planList = data;
                        }, (data)=> {

                        })
                });
                //全屏
                $scope.fullscreen = () => {
                    $(".workFlowBody canvas").remove();
                    $(".workFlow").addClass("fullscreen");
                    $(".workFlow i").hide();
                    $(".workFlow .scalescreenbtn").show();
                    $(".itemTitle .workFlowDo").show();
                    $(".itemTitle>div").show();
                    if ($scope.data) {
                        drawCanvas($scope.data, "full", false);
                    }
                };
                //缩小屏
                $scope.scalescreen = () => {
                    $(".workFlowBody canvas").remove();
                    $(".workFlow").removeClass("fullscreen");
                    $(".workFlow i").hide();
                    $(".workFlow .fullscreenbtn").show();
                    $(".itemTitle .workFlowDo").hide();
                    //显示添加的logo
                    $(".itemTitle>div").hide();
                    if ($scope.data) {
                        drawCanvas($scope.data, "small", false);
                    }
                };
                //选择任务 获取相应的工作流与日志数据
                $scope.selectPlan = (e, plan)=> {
                    $(".planLists .bg").removeClass("bg");
                    if (e.target.className === "planListsLi") {
                        e.target.classList.add("bg");
                    } else {
                        $(e.target).parents(".planListsLi").addClass("bg");
                    }
                    plan.jobId = plan.jobId.replace(/\s+/g, "%09");
                    //获取日志全部时间
                    folderFactory.XHR('get', '/etl-monitor/api/logs/scheduledDateByJobId?jobId=' + plan.jobId + '')
                        .then((data)=> {
                            if (data.length > 0) {
                                $scope.alltime = data;
                                $scope.timeModel = new Date(data[0][2]).Format("yyyy-MM-dd hh:mm:ss");
                                //获取第一个日志
                                folderFactory.XHR('get', '/etl-monitor/api/logs/detailLogsById?jobId=' + plan.jobId + '&channelId=' + data[0][1] + '')
                                    .then((data)=> {
                                        $scope.setpLog = data.steplog;
                                        $scope.joblog = data.joblog ? data.joblog[0].logField.split("\n") : data.translog[0].logField.split("\n");
                                        $scope.jobsteplog = data.jobsteplog;
                                    }, (data)=> {

                                    })
                            } else {
                                $scope.alltime = [];
                                $scope.setpLog = [];
                                $scope.joblog = [];
                                $scope.jobsteplog = [];
                            }
                        }, (data)=> {

                        });
                    //选择时间
                    $scope.selectTime = (e)=> {
                        for (var i = 0; i < $scope.alltime.length; i++) {
                            if (new Date($scope.alltime[i][2]).Format("yyyy-MM-dd hh:mm:ss") === e) {
                                $scope.channelId = $scope.alltime[i][1];
                            }
                        }
                        folderFactory.XHR('get', '/etl-monitor/api/logs/detailLogsById?jobId=' + plan.jobId + '&channelId=' + $scope.channelId + '')
                            .then((data)=> {
                                $scope.setpLog = data.steplog ? data.steplog : [];
                                if (data.joblog && data.joblog.length > 0) {
                                    $scope.joblog = data.joblog[0].logField.split("\n");
                                } else if (data.translog && data.translog.length > 0) {
                                    $scope.joblog = data.translog[0].logField.split("\n")
                                } else {
                                    $scope.joblog = [];
                                }
                                $scope.jobsteplog = data.jobsteplog ? data.jobsteplog : [];
                            }, (data)=> {

                            })
                    };
                    //工作流
                    $(".workFlowBody canvas").remove();
                    $(".workFlowBody .loading").show();
                    //工作流名称
                    for (var i = 0; i < plan.jobParams.jobParams.length; i++) {
                        if (plan.jobParams.jobParams[i].name === "job") {
                            $scope.workFlowName = "- " + plan.jobParams.jobParams[i].value + ".kjb";
                        }
                        if (plan.jobParams.jobParams[i].name === "transformation") {
                            $scope.workFlowName = "- " + plan.jobParams.jobParams[i].value + ".ktr";
                        }
                    }
                    //工作流数据
                    $http.get('/etl-monitor/api/repo/files/contentByJobId?jobId=' + plan.jobId + '',
                        {
                            transformResponse: function (cnv) {
                                xml2js.parseString(cnv, {explicitArray: false}, function (err, data) {
                                    if ((!data || !data.job) && (!data || !data.transformation)) {
                                        $(".workFlowBody .loading").hide();
                                        return;
                                    }
                                    $scope.data = data;
                                    drawCanvas($scope.data, "small", true);
                                });
                            }
                        })
                        .success(function (data) {

                        });
                };
                //状态 5秒一次  无限循环
                $scope.stateFlag = true;
                getState();
                $interval(function(){
                    if($scope.stateFlag) getState();
                }, 5000);
                function getState() {
                    $scope.stateFlag = false;
                    folderFactory.XHR('get', '/etl-monitor/api/scheduler/getAllJobState')
                        .then((data)=> {
                            if (typeof data == 'string') {
                                window.location.reload();
                            }
                            $scope.stateAll = data.ALL;
                            $scope.stateRunning = data.EXECUTING;
                            $scope.stateNormal = data.NORMAL;
                            $scope.stateError = data.ERROR;
                            $scope.stateStop = data.PAUSED;
                            $(".stateList .bg2").width($scope.stateRunning * 100 / $scope.stateAll + '%');
                            $(".stateList .bg3").width($scope.stateNormal * 100 / $scope.stateAll + '%');
                            $(".stateList .bg4").width($scope.stateError * 100 / $scope.stateAll + '%');
                            $(".stateList .bg5").width($scope.stateStop * 100 / $scope.stateAll + '%');
                            $scope.stateFlag = true;
                        }, (data)=> {
                            $scope.stateFlag = true;
                        });
                }

                //任务列表操作
                $scope.stop = (e) => {
                    e.stopPropagation();
                };
                //弹出修改密码界面
                $scope.changePassword = function(){
                    document.querySelector(".changePasswordEtl").style.display = "block";
                    //修改密码界面重置
                    document.querySelector(".inputContent input").value = "";
                    document.querySelector(".newPassContent input").value = "";
                    document.querySelector(".checkPasswordContent input").value = "";
                    document.querySelector(".passCheckTips").innerHTML = "";
                    document.querySelector(".weak").style.background = "white";
                    document.querySelector(".middle").style.background = "white";
                    document.querySelector(".strong").style.background = "white";
                };
                /*弹出用户管理界面*/
                $scope.userManagement = function(){
                    document.querySelector(".userManagement").style.display = "block";
                }
                /*弹出操作日志界面*/
                $scope.operateRecord = function () {
                    document.querySelector(".operateRecordBox").style.display = "block";
                };
                /*弹出整合统计界面*/
                $scope.integratedCount = function(){
                    document.querySelector(".integratedCountBox").style.display = "block";
                    $scope.$broadcast("integratedCountInit");
                }
                //退出登录
                $scope.loginOut = () => {
                    var url = window.location.href.substring(0, window.location.href.lastIndexOf("\/") + 1) + "Logout";
                    window.location.href = url;
                };
                $scope.dblink = (e) => {
                    if (!$scope.data) return;
                    var data = {
                        type: e,
                        data: $scope.data
                    };
                    $scope.$broadcast('dblink', data);
                };
                $scope.hadoopList = (e) => {
                    if (!$scope.data) return;
                    var data = {
                        type: e,
                        data: $scope.data
                    };
                    $scope.$broadcast('hadoopList', data);
                };
                var htmlHexEncode=function(s) {
                    var r = "";
                    for (var i = 0; i < s.length; i++) {
                        var c = s.charCodeAt(i);
                        r += (c == 60 || c == 62) ? ("&#x" + c.toString(16) + ";") : s[i];
                        //r += (c < 47 || (57 < c && c < 65) || c > 127) ? ("&#x" + c.toString(16) + ";") : s[i];
                    }
                    return r;
                    //var res=[];
                    //var r;
                    //for(var i=0;i < str.length;i++) {
                    //    var c = str.charCodeAt(i);
                    //    r += (c < 47 || 57 < c < 65 || c > 127) ? ("&#" + c + ";") : s.charAt(i);
                    //    res[i]=str.charCodeAt(i).toString(16);
                    //}
                    //return "&#"+String.fromCharCode(0x78)+res.join(";&#"+String.fromCharCode(0x78))+";";//x ，防止ff下&#x 转义
                };
                $scope.saveFile = () => {
                    $scope.loading();
                    var builder = new xml2js.Builder();
                    var str = htmlHexEncode(JSON.stringify($scope.data));
                    var obj = JSON.parse(str);
                    var xml =  builder.buildObject(obj);
                    var reg = /<\$\$hashKey>\w+\:\w+<\/\$\$hashKey>/g;
                    //var reg1 = /[\r\n]/g;
                    var data = xml.replace(/&#xD;/g, "");
                    data = data.toString().replace(reg, "");
                    folderFactory.XHR1('post', '/etl-monitor/api/kettle/save?pathId=' + $scope.filePath, "xml="+encodeURIComponent(data))
                        .then((data)=> {
                            $scope.closeLoading();
                            var msg;
                            if(data === 'true'){
                                msg = "保存成功";
                            } else {
                                msg = "保存失败";
                            }
                            $scope.alertTip(msg);
                        }, (data)=> {
                            $scope.closeLoading();
                            var msg = "项目访问异常或无法访问，请刷新后重试！";
                            $scope.alertTip(msg);
                        })
                };

                /*计划任务*/
                $scope.getJobList = () => {
                    var path = encodeURIComponent($scope.filePath);
                    var url = '/etl-monitor/api/scheduler/getJobsByPathId?pathId=' + path + '';
                    folderFactory.XHR('get', url)
                        .then((data)=> {
                            $scope.planList = data;
                        }, (data)=> {

                        })
                };
                $scope.startOrPause = (id, state, obj, event)=> {
                    event.preventDefault();
                    event.stopPropagation();
                    if (state == "COMPLETE") return;
                    var url = state == "PAUSED" ? "/etl-monitor/api/scheduler/resumeJob" : "/etl-monitor/api/scheduler/pauseJob";
                    var data = {
                        jobId: id
                    };
                    folderFactory.XHR('post', url, data)
                        .then((data)=> {
                            obj.state = data;
                            if($scope.stateFlag) getState();
                        },(data)=> {
                            var msg = "项目访问异常或无法访问，请刷新后重试！";
                            $scope.alertTip(msg);
                        });
                };
                $scope.editPlan = (job, event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    $scope.jobId = job.jobId;
                    var date = job.jobId.substring(job.jobId.length - 13);
                    var jobId = job.userName + "%09" + job.jobName + "%09" + date;
                    var url = '/etl-monitor/api/scheduler/jobinfo?jobId=' + jobId;
                    folderFactory.XHR('get', url)
                        .then((data)=> {
                            $scope.$emit('editPlan',data);
                        }, (data)=> {
                            var msg = "项目访问异常或无法访问，请刷新后重试！";
                            $scope.alertTip(msg);
                        });
                };
                $scope.rightNow = (jobId, job, event) => {
                    var d = {
                        jobId: jobId
                    };
                    var url = "/etl-monitor/api/scheduler/triggerNow";
                    folderFactory.XHR("post", url, d)
                        .then((data)=> {
                            $scope.alertTip("您的文件正在后台处理，完成后将会保存在所选位置！");
                            job.state = data;
                            if($scope.stateFlag) getState();
                        }, (data)=> {
                            var msg = "项目访问异常或无法访问，请刷新后重试！";
                            $scope.alertTip(msg);
                        });
                    event.preventDefault();
                    event.stopPropagation();
                };
                $scope.delJob = (e, index, event) => {
                    var d = {
                        jobId: e
                    };
                    var url = "/etl-monitor/api/scheduler/removeJob";
                    var func = function(){
                        folderFactory.XHR("delete", url, d)
                            .then((data)=> {
                                if($scope.stateFlag) getState();
                                $scope.planList.splice(index, 1);
                                $scope.alertTip("删除成功！");
                            }, (data)=> {
                                var msg = "项目访问异常或无法访问，请刷新后重试！";
                                $scope.alertTip(msg);
                            });
                        return "ownTips";
                    };
                    var data = {
                        title: '删除确认',
                        content: '你确定要删除这个计划吗',
                        fun: func
                    };
                    $scope.alertDel(data);
                    event.preventDefault();
                    event.stopPropagation();
                };
            })
        };
    })
    .directive('alertDel', ()=> {
        const template = require('../template/alertDel.html');
        return {
            restrict: 'E',
            template: template,
            replace: true,
            link($scope){

            },
            controller: ('$scope', 'folderFactory', '$http', ($scope, $http)=> {
                $scope.ifDel = false;
                $scope.alertDel = (data) => {
                    $scope.ifDel = true;
                    $scope.titleDel = data.title;
                    $scope.contentDel = data.content;
                    $scope.makeDelTrue = () => {
                        var resInfo;
                        var res = data.fun();
                        $scope.ifDel = false;
                        if (res == "ownTips") return;
                        if (res) {
                            resInfo = '删除成功！';
                        } else {
                            resInfo = '删除失败！';
                        }
                        $scope.alertTip(resInfo);
                    };
                    $scope.makeDelFalse = () => {
                        $scope.ifDel = false;
                    }
                }
            })
        }
    })
    .directive('alertTip', ()=> {
        const template = require('../template/alertTip.html');
        return {
            restrict: 'E',
            template: template,
            replace: true,
            link($scope){

            },
            controller: ('$scope', 'folderFactory', '$http', ($scope, $http)=> {
                $scope.alertTip = (res) => {
                    $scope.resDel = res;
                    $('.resDel').show().fadeOut(1000);
                }
            })
        }
    })
    .directive('loadingBox', ()=> {
        const template = require('../template/loadingBox.html');
        return {
            restrict: 'E',
            template: template,
            replace: true,
            link($scope){

            },
            controller: ('$scope', ($scope)=> {
                $scope.loading = () => {
                    $scope.ifLoading = true;
                };
                $scope.closeLoading = () => {
                    $scope.ifLoading = false;
                }
            })
        }
    })
    .filter('suffixTime', function () {
        return function (input) {
            if (input === null) {
                return "-";
            }
            return new Date(input).Format("yyyy-MM-dd hh:mm:ss");
        }
    })
    .filter('repeatDetail', function () {
        var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
        var weeks = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        var nums = ["第一", "第二", "第三", "第四", "最后"];

        function startTime(e) {
            //return " at " + e.split("T")[1].split("+")[0];
            return new Date(e).Format("yyyy-MM-dd hh:mm:ss");
        }

        function week(e) {
            var data = "";
            for (var i = 0; i < e.length; i++) {
                data += weeks[e[i] - 1] + " ";
            }
            return data;
        }

        function monthWeek(e) {
            var arg1 = e.split("*")[1].split("#")[0];
            var arg2 = e.split("*")[1].split("#")[1];
            return nums[arg2 - 1] + weeks[arg1 - 1];
        }

        function monthsWeek(e) {
            var month = e.split("?")[1].split(" ")[1];
            var week = e.split("?")[1].split(" ")[2].split("#")[0];
            var num = e.split("?")[1].split(" ")[2].split("#")[1];
            return months[month - 1] + " " + nums[num - 1] + "个" + weeks[week - 1];
        }

        return function (input) {
            switch (input.uiPassParam) {
                case "RUN_ONCE":
                    return "只运行一次";
                    break;
                case "SECONDS":
                    return "每隔" + input.repeatInterval + "秒钟" + startTime(input.startTime);
                    break;
                case "MINUTES":
                    return "每隔" + input.repeatInterval / 60 + "分钟" + startTime(input.startTime);
                    break;
                case "HOURS":
                    return "每隔" + input.repeatInterval / 3600 + "小时" + startTime(input.startTime);
                    break;
                case "DAILY":
                    return input.repeatInterval ? "每隔" + input.repeatInterval / 86400 + "天" + startTime(input.startTime) : "每个工作日" + startTime(input.startTime);
                    break;
                case "WEEKLY":
                    if (!input.dayOfWeekRecurrences) return "-";
                    return week(input.dayOfWeekRecurrences.recurrences[0].recurrenceList.values) + startTime(input.startTime);
                    break;
                case "MONTHLY":
                    if (!input.dayOfWeekRecurrences) return "-";
                    return input.dayOfWeekRecurrences.recurrences.length > 0 ? "每月" + monthWeek(input.cronString) + startTime(input.startTime) : "每月" + input.dayOfMonthRecurrences.recurrences[0].recurrenceList.values[0] + "号" + startTime(input.startTime);
                    break;
                case "YEARLY":
                    if (!input.dayOfMonthRecurrences) return "-";
                    return input.dayOfMonthRecurrences.recurrences.length > 0 ? "每年" + input.monthlyRecurrences.recurrences[0].recurrenceList.values[0] + "月" + input.dayOfMonthRecurrences.recurrences[0].recurrenceList.values[0] + "号" + startTime(input.startTime) : monthsWeek(input.cronString) + startTime(input.startTime);
                    break;
            }
        }
    })
    .filter('psState', function () {
        return function (input) {
            if (input == "COMPLETE") {
                return "完成";
            } else if (input == "PAUSED") {
                return "恢复";
            } else {
                return "暂停";
            }
        }
    })
    .filter('test', function () {
        return function (input) {
            if (input && input.length > 0) return decodeURIComponent(input);
        }
    })
    .filter('jobName', function () {
        return function (input) {
            for (var i = 0; i < input.jobParams.jobParams.length; i++) {
                if (input.jobParams.jobParams[i].name === "job") {
                    return input.jobParams.jobParams[i].value + ".kjb";
                }
                if (input.jobParams.jobParams[i].name === "transformation") {
                    return input.jobParams.jobParams[i].value + ".ktr";
                }
            }

        }
    });
