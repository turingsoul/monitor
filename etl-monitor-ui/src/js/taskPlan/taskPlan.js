/**
 * Created by Administrator on 2017/4/17.
 */
import angular from 'angular';
import $ from 'jquery';
import './taskPlan.css';
import '../../css/jquery-ui.min.css';
import '../../css/jquery-ui.theme.min.css';
import '../jquery-ui.min.js';
import '../../js/jquery.min.js';

{
    "use strict";
    angular.module('etl/taskPlan',[])
        .directive('taskPlan',()=>{
            const template = require('./taskPlan.html');
            return{
                restrict: 'E',
                template: template,
                replace: true,
                link($scope){

                },
                controller: ('$scope','folderFactory','$http',($scope,folderFactory,$timeout)=> {
                    $scope.hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
                    $scope.minutes = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
                        "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                        "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
                        "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
                        "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
                        "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
                    ];

                    $(".datePicker").datepicker({
                        dateFormat: "yy-mm-dd"
                    });
                    $scope.$on('showTaskPlan', (d, data)=> {
                        $scope.planBoxTitle = '新建计划';
                        $scope.editFlag = false;
                        $scope.newPlanPath = data;
                        $scope.taskPlanShow = true;
                        $scope.stepOne = true;
                        $scope.stepTwo = false;
                        $scope.newPlanName = undefined;
                        $scope.myType = "RUN_ONCE";
                        var date = new Date();
                        function getHour(e) {
                            var data;
                            if (e > 9) {
                                if (e > 12) {
                                    data = "0" + (e - 12);
                                } else {
                                    data = e;
                                }
                            } else {
                                data = "0" + e;
                            }
                            return data.toString();
                        }

                        function zero(e) {
                            var data;
                            if (e > 9) {
                                data = e;
                            } else {
                                data = "0" + e;
                            }
                            return data.toString();
                        }

                        $scope.myHour = getHour(date.getHours());
                        $scope.myMinute = zero(date.getMinutes());
                        $scope.myHalf = date.getHours() > 12 ? "PM" : "AM";
                        $scope.myStartDate = zero(date.getFullYear()) + "-" + zero(date.getMonth() + 1) + "-" + zero(date.getDate());
                        var container = document.querySelectorAll(".mychoosedContent>div");
                        for (var i = 0; i < container.length; i++) {
                            container[i].style.display = "none";
                        }
                        document.querySelector(".mychoosedContent>." + $scope.myType).style.display = "block";
                    });
                    function add0(m){return m<10?'0'+m:m }
                    function format(shijianchuo)
                    {
                        if (!shijianchuo) return false;
                        var time = new Date(shijianchuo);
                        var y = time.getFullYear();
                        var m = time.getMonth()+1;
                        var d = time.getDate();
                        var h = time.getHours();
                        var mm = time.getMinutes();
                        var s = time.getSeconds();
                        return y + '-' + add0(m) + '-' + add0(d) + 'T' + add0(h) + ':' + add0(mm) + ':' + add0(s) + '+08:00';
                    }
                    $scope.$on('editPlan', (d, data)=> {
                        $scope.editFlag = true;
                        $scope.planBoxTitle = '编辑计划';
                        $scope.jobCurrentId = data.jobId;
                        $scope.jobInfo = data;
                        $scope.taskPlanShow = true;
                        $scope.stepOne = true;
                        $scope.stepTwo = false;
                        $scope.newPlanName = data.jobName;
                        $scope.myType = $scope.jobInfo.jobTrigger.uiPassParam;
                        function getHour(e) {
                            var data;
                            if(e == '00'){
                                return '12';
                            }
                            if (e > 9) {
                                if (e > 12) {
                                    if (e - 12 > 9) {
                                        data = e - 12;
                                    } else {
                                        data = "0" + (e - 12);
                                    }
                                } else {
                                    data = e;
                                }
                            } else {
                                data = "0" + e;
                            }
                            return data.toString();
                        }
                        $scope.jobInfo.jobTrigger.startTime = format($scope.jobInfo.jobTrigger.startTime);
                        $scope.jobInfo.jobTrigger.endTime = format($scope.jobInfo.jobTrigger.endTime);
                        $scope.myMinute = $scope.jobInfo.jobTrigger.startTime.split("T")[1].split(":")[1];
                        $scope.myHour = getHour($scope.jobInfo.jobTrigger.startTime.split("T")[1].split(":")[0]);
                        var startHour = $scope.jobInfo.jobTrigger.startTime.split("T")[1].split(":")[0];
                        if(startHour == '00') {
                            startHour = 24;
                        }
                        $scope.myHalf = startHour > 12 ? "PM" : "AM";
                        $scope.myStartDate = $scope.jobInfo.jobTrigger.startTime.split("T")[0];
                        if ($scope.jobInfo.jobTrigger.endTime) {
                            $("#" + $scope.myType + "end").val($scope.jobInfo.jobTrigger.endTime.split("T")[0]);
                        } else {
                            $("#" + $scope.myType + "end").val(null);
                        }
                        switch ($scope.myType) {
                            case "RUN_ONCE":
                                break;
                            case "SECONDS":
                                $scope.mySecond = $scope.jobInfo.jobTrigger.repeatInterval;
                                break;
                            case "MINUTES":
                                $scope.myMinutes = $scope.jobInfo.jobTrigger.repeatInterval / (60);
                                break;
                            case "HOURS":
                                $scope.myHours = $scope.jobInfo.jobTrigger.repeatInterval / (3600);
                                break;
                            case "DAILY":
                                if ($scope.jobInfo.jobTrigger.repeatInterval) {
                                    document.getElementById('daysChoose1').checked = true;

                                    $scope.myDay = $scope.jobInfo.jobTrigger.repeatInterval / (3600 * 24);
                                } else {
                                    document.getElementById('daysChoose2').checked = true;

                                }
                                break;
                            case "WEEKLY":
                                var days = $scope.jobInfo.jobTrigger.dayOfWeekRecurrences.recurrences[0].recurrenceList.values;
                                for (var n in days) {
                                    var value = days[n] - 1;
                                    $(".WEEKLY input[type='checkbox'][value=" + value + "]").attr("checked", true);
                                }
                                break;
                            case "MONTHLY":
                                if ($scope.jobInfo.jobTrigger.dayOfMonthRecurrences.recurrences.length > 0) {
                                    document.getElementById('monthChoose1').checked = true;
                                    $scope.myMonth = $scope.jobInfo.jobTrigger.dayOfMonthRecurrences.recurrences[0].recurrenceList.values[0];
                                } else {
                                    document.getElementById('monthChoose2').checked = true;
                                    $(".daysOfWeek").val($scope.jobInfo.jobTrigger.cronString.split("*")[1].split("#")[0] - 1);
                                    $(".weeksOfMonth").val($scope.jobInfo.jobTrigger.cronString.split("*")[1].split("#")[1] - 1);
                                }
                                break;
                            case "YEARLY":
                                if ($scope.jobInfo.jobTrigger.dayOfMonthRecurrences.recurrences.length > 0) {
                                    document.getElementById('yearChoose1').checked = true;
                                    $(".monthsOfYear").val($scope.jobInfo.jobTrigger.monthlyRecurrences.recurrences[0].recurrenceList.values[0]);
                                    $scope.myYear = $scope.jobInfo.jobTrigger.dayOfMonthRecurrences.recurrences[0].recurrenceList.values[0];
                                } else {
                                    document.getElementById('yearChoose2').checked = true;
                                    $(".monthsOfYear1").val($scope.jobInfo.jobTrigger.cronString.split("?")[1].split(" ")[1] - 1);
                                    $(".daysOfWeek1").val($scope.jobInfo.jobTrigger.cronString.split("?")[1].split(" ")[2].split("#")[0] - 1);
                                    $(".weeksOfMonth1").val($scope.jobInfo.jobTrigger.cronString.split("?")[1].split(" ")[2].split("#")[1] - 1);
                                }
                                break;
                            case "taskplan":
                                break;
                        }
                        var container = document.querySelectorAll(".mychoosedContent>div");
                        for (var i = 0; i < container.length; i++) {
                            container[i].style.display = "none";
                        }
                        document.querySelector(".mychoosedContent>." + $scope.myType).style.display = "block";
                    });
                    $scope.changeOpt = (x) => {
                        var container = document.querySelectorAll(".mychoosedContent>div");
                        for (var i = 0; i < container.length; i++) {
                            container[i].style.display = "none";
                        }
                        document.querySelector(".mychoosedContent>." + x + "").style.display = "block";
                    };
                    $scope.oneday = ()=> {
                        $scope.dayable = false;
                    };
                    $scope.everyworkday = ()=> {
                        $scope.dayable = true;
                        $scope.myDay = "";
                    };
                    //month
                    $scope.onemonth = ()=> {
                        $scope.monthable = false;
                    };
                    $scope.everymonth = ()=> {
                        $scope.monthable = true;
                        $scope.myMonth = "";
                    };
                    //year
                    $scope.oneyear = ()=> {
                        $scope.yearable = false;
                    };
                    $scope.everyear = ()=> {
                        $scope.yearable = true;
                        $scope.myYear = "";
                    };
                    function ifNull(data, err) {
                        var reg = /[\/\\]/g;
                        if (!data || data.length == 0 || reg.test(data)) {
                            $scope.alertTip(err);
                            return true;
                        }
                    }
                    function isNumber(data, err) {
                        var reg = /^[\d]*$/;
                        if (!reg.test(data)) {
                            $scope.alertTip(err);
                            return true;
                        }
                    }
                    function timeString(date) {
                        var str = date.split('-');
                        return str[0] + str[1] + str[2];
                    }
                    function timeCompare() {
                        if ($("#" + $scope.myType + "end").val().length > 0) {
                            var startTime = timeString($scope.myStartDate);
                            var endTime = timeString($("#" + $scope.myType + "end").val());
                            if (startTime > endTime) {
                                $scope.alertTip("结束日期不能小于开始日期！");
                                return true;
                            }
                        }
                    }
                    $scope.checkout = ()=> {
                        if(ifNull($scope.newPlanName, "作业名称不能为空且包含\/\\！")) return;
                        if ($scope.myType !== "RUN_ONCE") {
                            if(timeCompare()) return;
                        }
                        var startTime = $("#" + $scope.myType).val() + "T" + ($scope.myHalf == "PM" ? parseInt($scope.myHour) + 12 : $scope.myHour) + ":" + $scope.myMinute + ":00.000+08:00";
                        var endTime = $("#" + $scope.myType + "end").val() ? $("#" + $scope.myType + "end").val() + "T23:59:59.000+08:00" : null;
                        var data;
                        switch ($scope.myType) {
                            case "RUN_ONCE":
                                data = {
                                    simpleJobTrigger: {
                                        endTime: null,
                                        repeatCount: 0,
                                        repeatInterval: 0,
                                        startTime: startTime,
                                        uiPassParam: "RUN_ONCE"
                                    }
                                };
                                break;
                            case "SECONDS":
                                if(isNumber($scope.mySecond, "定期模式秒数为数字！")) return;
                                data = {
                                    simpleJobTrigger: {
                                        endTime: endTime,
                                        repeatCount: -1,
                                        repeatInterval: $scope.mySecond,
                                        startTime: startTime,
                                        uiPassParam: "SECONDS"
                                    }
                                };
                                break;
                            case "MINUTES":
                                if(isNumber($scope.myMinutes, "定期模式分钟数为数字！")) return;
                                data = {
                                    simpleJobTrigger: {
                                        endTime: endTime,
                                        repeatCount: -1,
                                        repeatInterval: $scope.myMinutes * 60,
                                        startTime: startTime,
                                        uiPassParam: "MINUTES"
                                    }
                                };
                                break;
                            case "HOURS":
                                if(isNumber($scope.myHours, "定期模式小时数为数字！")) return;
                                data = {
                                    simpleJobTrigger: {
                                        endTime: endTime,
                                        repeatCount: -1,
                                        repeatInterval: $scope.myHours * 3600,
                                        startTime: startTime,
                                        uiPassParam: "HOURS"
                                    }
                                };
                                break;
                            case "DAILY":
                                if (!$scope.dayable) {
                                    if (!$scope.myDay || $scope.myDay.length == 0) {
                                        $scope.alertTip("天数必填！");
                                        return;
                                    } else {
                                        if(isNumber($scope.myDay, "定期模式天数为数字！")) return;
                                    }
                                }
                                if ($scope.myDay) {
                                    data = {
                                        simpleJobTrigger: {
                                            endTime: endTime,
                                            repeatCount: -1,
                                            repeatInterval: $scope.myDay * 3600 * 24,
                                            startTime: startTime,
                                            uiPassParam: "DAILY"
                                        }
                                    };
                                } else {
                                    data = {
                                        complexJobTrigger: {
                                            daysOfWeek: ["1", "2", "3", "4", "5"],
                                            endTime: endTime,
                                            startTime: startTime,
                                            uiPassParam: "DAILY"
                                        }
                                    }
                                }
                                break;
                            case "WEEKLY":
                                var obj = document.getElementsByName("myChecked");
                                var daysOfWeek = [];
                                for (var n in obj) {
                                    if (obj[n].checked) {
                                        daysOfWeek.push(obj[n].value);
                                    }
                                }
                                if (daysOfWeek.length == 0) {
                                    $scope.alertTip("至少选择一天！");
                                    return;
                                }
                                data = {
                                    complexJobTrigger: {
                                        daysOfWeek: daysOfWeek,
                                        endTime: endTime,
                                        startTime: startTime,
                                        uiPassParam: "WEEKLY"
                                    }
                                };
                                break;
                            case "MONTHLY":
                                if (!$scope.monthable) {
                                    if (!$scope.myMonth || $scope.myMonth.length == 0) {
                                        $scope.alertTip("天数必填！");
                                        return;
                                    } else {
                                        if(isNumber($scope.myMonth, "定期模式天数为数字！")) return;
                                    }
                                }
                                if($scope.myMonth > 31){
                                    $scope.alertTip("月份天数过多");
                                    return;
                                }
                                if ($scope.myMonth) {
                                    data = {
                                        complexJobTrigger: {
                                            daysOfMonth: [$scope.myMonth],
                                            endTime: endTime,
                                            startTime: startTime,
                                            uiPassParam: "MONTHLY"
                                        }
                                    }
                                } else {
                                    data = {
                                        complexJobTrigger: {
                                            daysOfWeek: [$(".daysOfWeek").val()],
                                            endTime: endTime,
                                            startTime: startTime,
                                            uiPassParam: "MONTHLY",
                                            weeksOfMonth: [$(".weeksOfMonth").val()]
                                        }
                                    }
                                }
                                break;
                            case "YEARLY":
                                if (!$scope.yearable) {
                                    if (!$scope.myYear || $scope.myYear.length == 0) {
                                        $scope.alertTip("天数必填！");
                                        return;
                                    } else {
                                        if(isNumber($scope.myYear, "定期模式天数为数字！")) return;
                                    }
                                }
                                if($scope.myYear > 31){
                                    $scope.alertTip("月份天数过多");
                                    return;
                                }
                                if ($scope.myYear) {
                                    data = {
                                        complexJobTrigger: {
                                            daysOfMonth: [$scope.myYear],
                                            endTime: endTime,
                                            monthsOfYear: [$(".monthsOfYear").val()],
                                            startTime: startTime,
                                            uiPassParam: "YEARLY"
                                        }
                                    }
                                } else {
                                    data = {
                                        complexJobTrigger: {
                                            daysOfWeek: [$(".daysOfWeek1").val()],
                                            endTime: endTime,
                                            monthsOfYear: [$(".monthsOfYear1").val()],
                                            startTime: startTime,
                                            uiPassParam: "YEARLY",
                                            weeksOfMonth: [$(".weeksOfMonth1").val()]
                                        }
                                    }
                                }
                                break;
                            case "taskplan":
                                break;
                        }
                        data.jobName = $scope.newPlanName;
                        data.jobParameters = [];
                        if ($scope.editFlag) {
                            $scope.stepTwo = true;
                            $scope.stepOne = false;
                            for (var i = 0; i < $scope.jobInfo.jobParams.jobParams.length; i++) {
                                if ($scope.jobInfo.jobParams.jobParams[i].name  === 'parameters') {
                                    $scope.namedParameter = [];
                                    var parameters = $scope.jobInfo.jobParams.jobParams[i].value.substring(1, $scope.jobInfo.jobParams.jobParams[i].value.length - 1);
                                    var parametersItem = parameters.split(',');
                                    if(parameters.length > 0){
                                        for (var j = 0; j < parametersItem.length; j++) {
                                            var item = {
                                                key: parametersItem[j].split('=')[0],
                                                value: parametersItem[j].split('=')[1]
                                            };
                                            $scope.namedParameter.push(item);
                                        }
                                        break;
                                    }
                                }
                            }
                            var directory;
                            var fileName;
                            for (var k = 0; k < $scope.jobInfo.jobParams.jobParams.length; k++) {
                                if ($scope.jobInfo.jobParams.jobParams[k].name  === 'transformation') {
                                    fileName = $scope.jobInfo.jobParams.jobParams[k].value + '.ktr';
                                }
                                if ($scope.jobInfo.jobParams.jobParams[k].name  === 'job') {
                                    fileName = $scope.jobInfo.jobParams.jobParams[k].value + '.kjb';
                                }
                                if ($scope.jobInfo.jobParams.jobParams[k].name  === 'directory') {
                                    directory = $scope.jobInfo.jobParams.jobParams[k].value;
                                }
                            }
                            data.inputFile = directory + '/' + fileName;
                            $scope.planData = data;
                        } else {
                            data.inputFile = $scope.newPlanPath.replace(/:/g,'/');
                            $scope.planData = data;
                            var path = encodeURIComponent($scope.filePath);
                            var url = "/etl-monitor/api/repo/files/" + path + "/parameters";
                            $scope.loading();
                            folderFactory.XHR('get', url, data)
                                .then((data)=> {
                                    $scope.namedParameter = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var item = {
                                            key: data[i],
                                            value: ""
                                        };
                                        $scope.namedParameter.push(item);
                                    }
                                    $scope.stepTwo = true;
                                    $scope.stepOne = false;
                                    $scope.closeLoading();
                                },(data)=> {
                                    $scope.alertTip("网络错误，请稍后再试！");
                                    $scope.closeLoading();
                                });
                        }

                    };
                    $scope.closeTask = () => {
                        $scope.taskPlanShow = false;
                    };
                    $scope.preStep = () => {
                        $scope.stepTwo = false;
                        $scope.stepOne = true;
                    };
                    $scope.completeTask = () => {
                        for (var i = 0; i < $scope.namedParameter.length; i++) {
                            var item = {
                                name: $scope.namedParameter[i].key,
                                stringValue: [$scope.namedParameter[i].value],
                                type: "string"
                            };
                            $scope.planData.jobParameters.push(item);
                        }
                        var url = "/etl-monitor/api/scheduler/job";
                        $scope.loading();
                        folderFactory.XHR('post', url, $scope.planData)
                            .then((data)=> {
                                if ($scope.editFlag) {
                                    $scope.alertTip("修改成功！");
                                    folderFactory.XHR("delete", "/etl-monitor/api/scheduler/removeJob", {jobId: $scope.jobCurrentId})
                                        .then((data)=> {
                                            $scope.getJobList();
                                        }, (data)=> {

                                        });
                                } else {
                                    $scope.alertTip("新建成功！");
                                    $scope.getJobList();
                                }
                                $scope.closeTask();
                                $scope.closeLoading();
                            },(data)=> {
                                $scope.alertTip("项目访问异常或无法访问，请刷新后重试！");
                                $scope.closeLoading();
                                $scope.closeTask();
                            });
                    }
                })
            }
        })
}