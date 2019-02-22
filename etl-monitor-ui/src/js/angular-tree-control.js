
{
    'use strict';
    const angular = require('angular');
    const $ = require('jquery');
    document.oncontextmenu=function(){
        return false;
    }
    angular.module( 'treeControl', [] )
        .service("folderFactory",($http,$q)=>{
            let service={};
            service.XHR=(method,url,data)=>{
                let deferred = $q.defer();
                $http({
                    method: method,
                    headers:{contentType: "application/json; charset=utf-8"},
                    url: url,
                    dataType: 'xml',
                    data:data
                })
                .success((data)=>{
                    deferred.resolve(data);
                }).error((data)=>{
                    deferred.reject(data)
                });
                return deferred.promise;
            };
            return service;
        })
        .constant('treeConfig', {
            templateUrl: null
        })
        /*文件弹出层控制*/
        .controller('fileController',function($scope,$rootScope,folderFactory){
            /*文件菜单激活状态*/

            $scope.foldernameActive = false;
            $scope.renamefoldernameActive = false;
            /*文件弹出层消失*/
            $scope.hideFileShelter = function(e){
                /*点击空白处弹框消失*/
                if(e.target.className.split(" ")[0] == "yhnFileBounce"){
                    document.querySelector(".yhnFileBounce").style.display = "none";
                }
            }
            /*文件夹弹出层消失*/
            $scope.hideFolderShelter = function(e){
                /*点击空白处弹框消失*/
                if(e.target.className.split(" ")[0] == "yhnFolderBounce"){
                    document.querySelector(".yhnFolderBounce").style.display = "none";
                }
            }
            /*新建目录显示*/
            $scope.showCreateFolder = function(){
                /*每次清空内容*/
                $scope.inputFolderName = "";
                document.querySelector(".createFolderBG").style.display = "block";
                document.querySelector(".inputBoxCreateFolder").focus();
                /*浮动框消失*/
                document.querySelector(".yhnFolderBounce").style.display = "none";
                console.log($rootScope.currentParentFolderPath);
                $rootScope.runFileArray2 = [];
                $scope.runDataTree2($rootScope.dataTree);
            }
            /*新建目录弹窗消失*/
            $scope.hideCreateFolder = function(){
                document.querySelector(".createFolderBG").style.display = "none";
                $scope.foldernameActive = false;
            }
            /*回车监听*/
            $scope.myKeyUp = function(e){
                if(e.keyCode == 13){
                    $scope.submitCreateFolder();
                }
            }

            $scope.inputFolderName = "";
            $scope.renameFolderName = "";


            $scope.checkSlash = function(e){
                var reg = /[\.\\\/]/;
                return reg.test(e);
            };
            $scope.submitCreateFolder = function(){
                $scope.foldernameActive = true;
                if($scope.inputFolderName == ""){
                    document.querySelector(".folderCreateTips1 span").innerHTML = "请输入名称"
                }else{
                    if($scope.checkSlash($scope.inputFolderName)){
                        document.querySelector(".folderCreateTips span").innerHTML = "您输入的名称不能包括“/”、“\\”或者“.”符号";
                        return false;
                    };

                    document.querySelector(".folderCreateTips1 span").innerHTML = "";
                    /*slash*/
                    if($scope.checkSlash() == false){
                        /*console.log($rootScope.runFileArray2);*/
                        var a =  $scope.runAllFile2($scope.inputFolderName);
                        if(a == false){
                            document.querySelector(".createFolderBG").style.display = "none";
                            //提交请求
                            //转换请求路径
                            var path = $scope.translatePathToComma($rootScope.currentParentFolderPath);
                            //发送请求
                            folderFactory.XHR('get','/etl-monitor/api/repo/files/create?parentPathId='+path+'&name='+$scope.inputFolderName)
                                .then((data)=>{
                                    //更新目录树
                                    folderFactory.XHR('get','/etl-monitor/api/repo/files/tree')
                                        .then((data)=>{
                                            console.log("sihao");
                                            console.log(data);
                                            $rootScope.dataTree = data;
                                            //操作成功给提示TODO
                                            $scope.showLittleTips("创建文件夹成功");
                                            $scope.foldernameActive = false;
                                        },(data)=>{
                                            //操作失败给提示TODO
                                        });
                                },(data)=>{
                                    $scope.showLittleTips("创建文件夹失败");
                                });
                        }else{
                            $scope.showLittleTips("文件夹已存在");
                        }


                    }
                }
            }
            /*路径转化函数*/
            $scope.translatePathToComma =  function(path){
                var pathArray = path.split(""); //拆分路径为数组
                pathArray.forEach(function(a,b){
                    if(a=="/"){
                        pathArray[b] = ":";
                    }
                })
                var translatedPath = pathArray.join("");
                return translatedPath;
            }
            /***********************************
            *文件夹重命名
            *
            * *************************************/
            /*弹出重命名对话框*/
            $scope.renameFolder = function(){
                /*浮动框消失*/
                document.querySelector(".yhnFolderBounce").style.display = "none";
                /*弹出重命名对话框*/
                document.querySelector(".renameFolderBG").style.display = "block";
                /*获取文件夹原名称*/
                var folderName = $rootScope.currentChoosedFolder;
                $scope.folderOldName = $rootScope.currentChoosedFolder+"";
                $scope.renameFolderName = folderName;
                /*获取焦点*/
                document.querySelector(".renameFolderInput").focus();
                $scope.runFileArray = [];
                $scope.runDataTree($rootScope.dataTree);

            }
            /*关闭重命名对话框*/
            $scope.hideRenameFolder = function(){
                $scope.renamefoldernameActive = false;
                document.querySelector(".renameFolderBG").style.display = "none";
            }
            //遍历内容并且返回字符串
            /*$scope.*/
            $scope.runFileArray = [];
            //获得所在父级目录的列表
            $scope.runDataTree = function(dataTree){
                if(dataTree.file.path == $rootScope.parentPath){
                    $scope.runFileArray = dataTree.children;
                }else{
                    if(dataTree.children!=null){
                        if(dataTree.children.hasOwnProperty("length"))
                        {
                            if(dataTree.children.length!=0){
                                for(var a of dataTree.children){
                                    $scope.runDataTree(a);
                                }
                            }
                        }
                    }
                }
            }
            //遍历内容并且返回字符串
            /*$scope.*/
            $rootScope.runFileArray2 = [];
            //获得所在父级目录的列表
            $scope.runDataTree2 = function(dataTree){
                    if(dataTree.file.path == $rootScope.currentParentFolderPath){
                        $rootScope.runFileArray2 = dataTree.children;

                    }else{
                        if(dataTree.children!=null){
                            if(dataTree.children.hasOwnProperty("length"))
                            {
                                if(dataTree.children.length!=0){
                                    for(var a of dataTree.children){
                                        $scope.runDataTree2(a);
                                    }
                                }
                            }
                        }
                    }
            }
            $rootScope.runFileArray1 = [];
            //获得所在父级目录的列表
            $scope.runDataTreeKjb = function(dataTree){
                //判断是否在根目录下面
                if($rootScope.parentPath!="/"){
                    if(dataTree.file.path+"/" == $rootScope.parentPath){
                        $rootScope.runFileArray1 = dataTree.children;
                    }else{
                        if(dataTree.children!=null){
                            if(dataTree.children.hasOwnProperty("length"))
                            {
                                if(dataTree.children.length!=0){
                                    for(var a of dataTree.children){
                                        $scope.runDataTreeKjb(a);
                                    }
                                }
                            }
                        }
                    }
                }else{
                    $rootScope.runFileArray1 = $rootScope.dataTree.children;
                }

            }
            //run all kjb ktr
            $scope.runAllKjbktr = function(name,oldName){
                console.log(name);
                console.log(oldName);
                console.log($rootScope.runFileArray1);
                if(name!=oldName){
                    for(var a of $rootScope.runFileArray1){
                        console.log(a);
                        if( name == a.file.name.split(".")[0]&& a.file.folder == false){
                             return true;
                        }
                    }
                }else{
                    return false;
                }
                return false;
            }
            $scope.runAllFile = function(name,oldName,path){
                //兄弟目录
                if(name!=oldName){
                    for(var a of $scope.runFileArray){
                        if( name == a.file.name&& a.file.folder == true){
                            return true;
                        }
                    }
                }else{
                    return false;
                }
            }
            /*新建文件夹*/
            $scope.runAllFile2 = function(name){
                //兄弟目录
                if($rootScope.runFileArray2.length!=0){
                    for(var a of $rootScope.runFileArray2){
                        if( name == a.file.name&& a.file.folder == true){
                            return true;
                        }
                    }
                    return false;
                }else{
                    return false;
                }

            }
            /*确认提交重命名内容*/
            $scope.submitRenameFolder = function(){
                /*激活状态*/
                $scope.renamefoldernameActive = true;
                /*符合条件进行重命名请求*/
                if(($scope.renameFolderName != "")&&!$scope.checkSlash($scope.renameFolderName)){

                    /*获取路径*/
                    var path = $scope.translatePathToComma($rootScope.currentParentFolderPath);
                    //判断是否名字已存在
                    if(!$scope.runAllFile($scope.renameFolderName,$scope.folderOldName,$rootScope.currentParentFolderPath)){
                        /*发送重命名请求*/
                        folderFactory.XHR('get','/etl-monitor/api/repo/files/rename?pathId='+path+'&newName='+$scope.renameFolderName)
                            .then((data)=>{
                                /*更新目录树*/
                                $scope.showLittleTips("重命名成功");
                                /*隐藏弹出框*/
                                $scope.hideRenameFolder();
                                getAllTree();
                                function getAllTree() {
                                    folderFactory.XHR('get','/etl-monitor/api/repo/files/tree')
                                        .then((data)=>{
                                            if (typeof data === "string") {
                                                getAllTree();
                                            } else {
                                                $rootScope.dataTree = data;
                                            }
                                        },(data)=>{
                                            //操作失败给提示TODO
                                        });
                                }
                            },(data)=>{
                                $scope.showLittleTips("文件夹名称已存在");
                            });
                    }else{
                        $scope.showLittleTips("文件夹名称已存在");
                    }



                }
            }
            /*重命名回车监听*/
            $scope.renameKeyUp = function(e){
                $scope.renamefoldernameActive = true;
                if(e.keyCode == 13){
                    $scope.submitRenameFolder();
                }
            }
            /********************************
            * 文件夹删除
            *
            * ********************************/
            $scope.deleteFolder = function(){
                /*浮动框消失*/
                document.querySelector(".yhnFolderBounce").style.display = "none";
                /*弹出重命名对话框*/
                document.querySelector(".deleteFolderBG").style.display = "block";
                /*获取文件夹原名称*/
                var folderName = $rootScope.currentChoosedFolder;
                $scope.renameFolderName = folderName;
            }

            /*关闭删除对话框*/
            $scope.hideDeleteFolder = function(){
                document.querySelector(".deleteFolderBG").style.display = "none";
            }
            /*公共的信息提示*/
            $scope.showLittleTips = function(ev){
                document.querySelector('.commonMessageTips').style.display = 'block';
                document.querySelector('.commonMessageTips').style.opacity = 1;
                document.querySelector('.commonMessageTips div').innerHTML = ev;
                setTimeout(function(){
                    document.querySelector('.commonMessageTips').style.opacity = 0;
                    document.querySelector('.commonMessageTips').style.display = 'none';
                },1000)
            };
            /*确认删除*/
            $scope.submitDeleteFolder = function(){
                /*关闭删除对话框*/
                $scope.hideDeleteFolder();
                /*弹出删除动画*/
                document.querySelector(".deleteCartonBG").style.display = "block";
                var path = $scope.translatePathToComma($rootScope.currentParentFolderPath);
                /*发送删除请求*/
                folderFactory.XHR('get','/etl-monitor/api/repo/files/delete?pathId='+path)
                .then((data)=>{
                        document.querySelector(".deleteCartonBG").style.display = "none";
                        /*操作成功给提示TODO*/
                        $scope.showLittleTips("删除文件夹成功");
                    /*更新目录树*/
                        getAllTree();
                        function getAllTree() {
                            folderFactory.XHR('get','/etl-monitor/api/repo/files/tree')
                                .then((data)=>{
                                    if (typeof data === "string") {
                                        getAllTree();
                                    } else {
                                        $rootScope.dataTree = data;
                                    }
                                },(data)=>{
                                    //操作失败给提示TODO
                                });
                        }
                },(data)=>{
                    $scope.showLittleTips("删除文件夹失败");
                });
            }
            /********************************
             * 重命名文件
             *
             * ********************************/

             $scope.showRenameFile = function(){
                 /*浮动框消失*/
                 document.querySelector(".yhnFileBounce").style.display = "none";
                 /*弹出重命名对话框*/
                 document.querySelector(".renameFileBG").style.display = "block";
                 /*获取文件夹原名称*/
                 document.querySelector(".renameFileInput").value = $rootScope.currentChoosedFile.split(".")[0];
                 $scope.renameFileName = document.querySelector(".renameFileInput").value;
                 $rootScope.oldFileName = document.querySelector(".renameFileInput").value;
                 /*获取焦点*/
                 document.querySelector(".renameFileInput").focus();
                 /*console.log($rootScope.parentPath);*/
                 $rootScope.runFileArray1 = [];
                 $scope.runDataTreeKjb($rootScope.dataTree);

             }
            /*隐藏文件重命名*/
            $scope.hideRenameFile = function(){
                $scope.renamefilenameActive = false;
                document.querySelector(".renameFileBG").style.display = "none";
            }
            $scope.renamefilenameActive = false;
            /*确认提交重命名内容*/
            $scope.submitRenameFile = function(){

                //激活状态
                $scope.renamefilenameActive = true;
                //符合条件进行重命名请求
                if(($scope.renameFileName != "")&&!$scope.checkSlash($scope.renameFileName)){
                    //获取路径
                    var path = $scope.translatePathToComma($rootScope.currentChoosedFilePath);
                    //发送重命名请求
                     var a = $scope.runAllKjbktr(document.querySelector(".renameFileInput").value,$rootScope.oldFileName);
                    if(a == false){
                        var saveName = document.querySelector(".renameFileInput").value;
                        folderFactory.XHR('get','/etl-monitor/api/repo/files/rename?pathId='+encodeURIComponent(path)+'&newName='+encodeURIComponent(saveName))
                            .then((data)=>{
                                $scope.hideRenameFile();
                                $scope.showLittleTips("文件重命名成功");
                                //更新目录树
                                getAllTree();
                                function getAllTree() {
                                    folderFactory.XHR('get','/etl-monitor/api/repo/files/tree')
                                        .then((data)=>{
                                            if (typeof data === "string") {
                                                getAllTree();
                                            } else {
                                                $rootScope.dataTree = data;
                                            }
                                        },(data)=>{
                                            //操作失败给提示TODO
                                        });
                                }
                            },(data)=>{
                                $scope.showLittleTips("文件重命名失败");
                            });
                    }else{
                        $scope.showLittleTips("文件名已存在");
                    }

                }
            }
            /*重命名回车监听*/
            $scope.renameFileKeyUp = function(e){
                $scope.renamefilenameActive = true;
                if(e.keyCode == 13){
                    $scope.submitRenameFile();
                }
            }
            /********************
            *
            *   删除文件
            *
            *********************/
            $scope.showDeleteFile = function(){
                /*浮动框消失*/
                document.querySelector(".yhnFileBounce").style.display = "none";
                /*弹出重命名对话框*/
                document.querySelector(".deleteFileBG").style.display = "block";
            }
            /*关闭删除文件对话框*/
            $scope.hideDeleteFile = function(){
                document.querySelector(".deleteFileBG").style.display = "none";
            }
            /*确认删除*/
            $scope.submitDeleteFile = function(){
                /*关闭删除对话框*/
                $scope.hideDeleteFile();
                /*弹出删除动画*/
                document.querySelector(".deleteCartonBG").style.display = "block";
                var path = $scope.translatePathToComma($rootScope.currentChoosedFilePath);
                /*发送删除请求*/
                folderFactory.XHR('get','/etl-monitor/api/repo/files/delete?pathId='+path)
                .then((data)=>{
                        document.querySelector(".deleteCartonBG").style.display = "none";
                        /*操作成功给提示TODO*/
                        $scope.showLittleTips("删除文件夹成功");
                        /*更新目录树*/
                        getAllTree();
                        function getAllTree() {
                            folderFactory.XHR('get','/etl-monitor/api/repo/files/tree')
                                .then((data)=>{
                                    if (typeof data === "string") {
                                        getAllTree();
                                    } else {
                                        $rootScope.dataTree = data;
                                    }
                                },(data)=>{
                                    //操作失败给提示TODO
                                });
                        }
                },(data)=>{
                    $scope.showLittleTips("删除文件夹失败");
                });
            }


            $scope.showTaskPlan = () => {
                $scope.$emit("showTaskPlan", $scope.translatePathToComma($rootScope.currentChoosedFilePath));
                document.querySelector(".yhnFileBounce").style.display = "none";
            }


        })
        .directive( 'treecontrol', ['$compile','$rootScope', function( $compile,$rootScope ) {
            /**
             * @param cssClass - the css class
             * @param addClassProperty - should we wrap the class name with class=""
             */
            function classIfDefined(cssClass, addClassProperty) {
                if (cssClass) {
                    if (addClassProperty)
                        return 'class="' + cssClass + '"';
                    else
                        return cssClass;
                }
                else
                    return "";
            }
            function ensureDefault(obj, prop, value) {
                if (!obj.hasOwnProperty(prop))
                    obj[prop] = value;
            }
            return {
                restrict: 'EA',
                require: "treecontrol",
                transclude: true,
                scope: {
                    treeModel: "=",
                    selectedNode: "=?",
                    selectedNodes: "=?",
                    expandedNodes: "=?",
                    onSelection: "&",
                    onNodeToggle: "&",
                    options: "=?",
                    orderBy: "@",
                    reverseOrder: "@",
                    filterExpression: "=?",
                    filterComparator: "=?"
                },
                controller: ['$scope', '$templateCache', '$interpolate', 'treeConfig', function( $scope, $templateCache, $interpolate, treeConfig ) {

                    function defaultIsLeaf(node) {
                        //return !node[$scope.options.nodeChildren] || node[$scope.options.nodeChildren].length === 0;
                        return !node[$scope.options.nodeChildren];
                    }

                    function shallowCopy(src, dst) {
                        if (angular.isArray(src)) {
                            dst = dst || [];

                            for ( var i = 0; i < src.length; i++) {
                                dst[i] = src[i];
                            }
                        } else if (angular.isObject(src)) {
                            dst = dst || {};

                            for (var key in src) {
                                if (hasOwnProperty.call(src, key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                                    dst[key] = src[key];
                                }
                            }
                        }

                        return dst || src;
                    }
                    function defaultEquality(a, b) {
                        if (a === undefined || b === undefined)
                            return false;
                        a = shallowCopy(a);
                        a[$scope.options.nodeChildren] = [];
                        b = shallowCopy(b);
                        b[$scope.options.nodeChildren] = [];
                        return angular.equals(a, b);
                    }
                    function defaultIsSelectable() {
                        return true;
                    }
                    $scope.options = $scope.options || {};
                    ensureDefault($scope.options, "multiSelection", false);
                    ensureDefault($scope.options, "nodeChildren", "children");
                    ensureDefault($scope.options, "dirSelectable", "true");
                    ensureDefault($scope.options, "injectClasses", {});
                    ensureDefault($scope.options.injectClasses, "ul", "");
                    ensureDefault($scope.options.injectClasses, "li", "");
                    ensureDefault($scope.options.injectClasses, "liSelected", "");
                    ensureDefault($scope.options.injectClasses, "iExpanded", "");
                    ensureDefault($scope.options.injectClasses, "iCollapsed", "");
                    ensureDefault($scope.options.injectClasses, "iLeaf", "");
                    ensureDefault($scope.options.injectClasses, "label", "");
                    ensureDefault($scope.options.injectClasses, "labelSelected", "");
                    ensureDefault($scope.options, "equality", defaultEquality);
                    ensureDefault($scope.options, "isLeaf", defaultIsLeaf);
                    ensureDefault($scope.options, "allowDeselect", true);
                    ensureDefault($scope.options, "isSelectable", defaultIsSelectable);
                    $scope.selectedNodes = $scope.selectedNodes || [];
                    $scope.expandedNodes = $scope.expandedNodes || [];
                    $scope.expandedNodesMap = {};
                    for (var i=0; i < $scope.expandedNodes.length; i++) {
                        $scope.expandedNodesMap[""+i] = $scope.expandedNodes[i];
                    }

                    $scope.parentScopeOfTree = $scope.$parent;

                    function isSelectedNode(node) {
                        if (!$scope.options.multiSelection && ($scope.options.equality(node, $scope.selectedNode)))
                            return true;
                        else if ($scope.options.multiSelection && $scope.selectedNodes) {
                            for (var i = 0; (i < $scope.selectedNodes.length); i++) {
                                if ($scope.options.equality(node, $scope.selectedNodes[i])) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                    $scope.headClass = function(node) {
                        var liSelectionClass = classIfDefined($scope.options.injectClasses.liSelected, false);
                        var injectSelectionClass = "";
                        if (liSelectionClass && isSelectedNode(node))
                            injectSelectionClass = " " + liSelectionClass;
                        if ($scope.options.isLeaf(node))
                            return "tree-leaf" + injectSelectionClass;
                        if ($scope.expandedNodesMap[this.$id])
                            return "tree-expanded" + injectSelectionClass;
                        else
                            return "tree-collapsed" + injectSelectionClass;
                    };
                    $scope.iBranchClass = function() {
                        if ($scope.expandedNodesMap[this.$id])
                            return classIfDefined($scope.options.injectClasses.iExpanded);
                        else
                            return classIfDefined($scope.options.injectClasses.iCollapsed);
                    };
                    $scope.nodeExpanded = function() {
                        return !!$scope.expandedNodesMap[this.$id];
                    };
                    /*记录目前操作的文件名以及目录 record filename and folder name*/
                    $rootScope.currentChoosedFile = "";
                    $rootScope.currentChoosedFolder = "";
                    $rootScope.currentParentFolderPath = "";
                    /*弹出文件*/
                    $scope.selectedNodeFile = function(e,node){
                        $rootScope.currentChoosedFile = node.file.name;
                        $rootScope.currentChoosedFilePath = node.file.path;
                        //获取父级目录的路径
                        $rootScope.parentPath = node.file.path.slice(0,node.file.path.length-node.file.name.length);
                        /*显示文件悬浮框*/
                        filePositionControl(e,node);
                    }
                    /*控制文件悬浮框方位*/
                    function filePositionControl(e,node){
                        document.querySelector(".yhnFileBounce").style.display = "block";
                        /*设置悬浮框出现的方位*/
                        if (document.body.offsetHeight - e.pageY > $(".yhnFileList").height()) {
                            document.querySelector(".yhnFileList").style.top = e.pageY+"px";
                        } else {
                            document.querySelector(".yhnFileList").style.top = e.pageY - $(".yhnFileList").height() + "px";
                        }
                        document.querySelector(".yhnFileList").style.left = e.pageX+"px";
                    }
                    function folderPositionControl(e,node){
                        document.querySelector(".yhnFolderBounce").style.display = "block";
                        /*设置悬浮框出现的方位*/
                        document.querySelector(".yhnFolderList").style.top = e.pageY+"px";
                        document.querySelector(".yhnFolderList").style.left = e.pageX+"px";
                    }
                    /*弹出文件夹*/
                    $scope.selectedNodeFolder = function(e,node){
                        $rootScope.currentChoosedFolder = node.file.name;
                        $rootScope.currentParentFolderPath = node.file.path;
                        $rootScope.currentEv = e;
                        //获取父级目录的路径
                        $rootScope.parentPath = node.file.path.slice(0,node.file.path.length-node.file.name.length-1);

                        folderPositionControl(e,node);
                    }
                    $scope.selectNodeHead = function(e,node){
                        $scope.$emit('getInfo', node);
                        $(".bg").removeClass("bg");
                        if (e.target.className === "folderName"){
                            e.target.className = "folderName bg";
                        }else {
                            $(e.target).parents(".folderName").addClass("bg");
                        }
                        $('.operate-menu').css({
                            display: "none"
                        });
                        var transcludedScope = this;
                        var expanding = $scope.expandedNodesMap[transcludedScope.$id] === undefined;
                        $scope.expandedNodesMap[transcludedScope.$id] = (expanding ? transcludedScope.node : undefined);
                        if (expanding) {
                            $scope.expandedNodes.push(transcludedScope.node);
                        }
                        else {
                            var index;
                            for (var i=0; (i < $scope.expandedNodes.length) && !index; i++) {
                                if ($scope.options.equality($scope.expandedNodes[i], transcludedScope.node)) {
                                    index = i;
                                }
                            }
                            if (index !== undefined)
                                $scope.expandedNodes.splice(index, 1);
                        }
                        if ($scope.onNodeToggle) {
                            var parentNode = (transcludedScope.$parent.node === transcludedScope.synteticRoot)?null:transcludedScope.$parent.node;
                            $scope.onNodeToggle({node: transcludedScope.node, $parentNode: parentNode,
                                $index: transcludedScope.$index, $first: transcludedScope.$first, $middle: transcludedScope.$middle,
                                $last: transcludedScope.$last, $odd: transcludedScope.$odd, $even: transcludedScope.$even, expanded: expanding});

                        }
                        $scope.selectNodeLabel(node);
                    };

                    $scope.openOperateMenu = function(node,$event){
                        let e = window.event;
                        e.preventDefault();
                        if(e.button == 2) {
                            let operateMenu = document.querySelector(".operate-menu");
                            operateMenu.style.display = "block";
                            operateMenu.style.left = $event.clientX+20+"px";
                            operateMenu.style.top = $event.clientY-20+"px";
                            var operateList = {
                                home:["新建文件夹","上传","下载","属性"],
                                public:["新建文件夹","上传","下载","属性"],
                                favorites:["清空收藏夹"]
                            };
                            var operateClass = {
                                home:["newFolder","upload","download","propertyFolder"],
                                public:["newFolder","upload","download","propertyFolder"],
                                favorites:["clearOutCollection"]
                            };
                            let operateMenuParam = operateList[node.file.name] ? operateList[node.file.name]:["新建文件夹","重命名","上传","下载","属性"];
                            let operateMenuClass = operateClass[node.file.name] ? operateClass[node.file.name]:["newFolder","rename","upload","download","propertyFolder"];
                            let operateObj = {
                                nodeProperty:$event.path,
                                nodeFolder:node,
                                operateMenuClass:operateMenuClass,
                                operateMenuParam:operateMenuParam
                            }
                            $scope.$emit('operateName', operateObj);
                        }
                    };

                    $scope.selectNodeLabel = function(selectedNode){
                        var transcludedScope = this;
                        if(!$scope.options.isLeaf(selectedNode) && (!$scope.options.dirSelectable || !$scope.options.isSelectable(selectedNode))) {
                            // Branch node is not selectable, expand
                            this.selectNodeHead();
                        }
                        else if($scope.options.isLeaf(selectedNode) && (!$scope.options.isSelectable(selectedNode))) {
                            // Leaf node is not selectable
                            return;
                        }
                        else {
                            var selected = false;
                            if ($scope.options.multiSelection) {
                                var pos = -1;
                                for (var i=0; i < $scope.selectedNodes.length; i++) {
                                    if($scope.options.equality(selectedNode, $scope.selectedNodes[i])) {
                                        pos = i;
                                        break;
                                    }
                                }
                                if (pos === -1) {
                                    $scope.selectedNodes.push(selectedNode);
                                    selected = true;
                                } else {
                                    $scope.selectedNodes.splice(pos, 1);
                                }
                            } else {
                                if (!$scope.options.equality(selectedNode, $scope.selectedNode)) {
                                    $scope.selectedNode = selectedNode;
                                    selected = true;
                                }
                                else {
                                    if ($scope.options.allowDeselect) {
                                        $scope.selectedNode = undefined;
                                    } else {
                                        $scope.selectedNode = selectedNode;
                                        selected = true;
                                    }
                                }
                            }
                            if ($scope.onSelection) {
                                var parentNode = (transcludedScope.$parent.node === transcludedScope.synteticRoot)?null:transcludedScope.$parent.node;
                                $scope.onSelection({node: selectedNode, selected: selected, $parentNode: parentNode,
                                    $index: transcludedScope.$index, $first: transcludedScope.$first, $middle: transcludedScope.$middle,
                                    $last: transcludedScope.$last, $odd: transcludedScope.$odd, $even: transcludedScope.$even});
                            }
                        }
                    };

                    $scope.selectedClass = function() {
                        var isThisNodeSelected = isSelectedNode(this.node);
                        var labelSelectionClass = classIfDefined($scope.options.injectClasses.labelSelected, false);
                        var injectSelectionClass = "";
                        if (labelSelectionClass && isThisNodeSelected)
                            injectSelectionClass = " " + labelSelectionClass;

                        return isThisNodeSelected ? "tree-selected" + injectSelectionClass : "";
                    };

                    $scope.unselectableClass = function() {
                        var isThisNodeUnselectable = !$scope.options.isSelectable(this.node);
                        var labelUnselectableClass = classIfDefined($scope.options.injectClasses.labelUnselectable, false);
                        return isThisNodeUnselectable ? "tree-unselectable " + labelUnselectableClass : "";
                    };

                    //tree template
                    $scope.isReverse = function() {
                        return !($scope.reverseOrder === 'false' || $scope.reverseOrder === 'False' || $scope.reverseOrder === '' || $scope.reverseOrder === false);
                    };

                    $scope.orderByFunc = function() {
                        return "'" + $scope.orderBy + "'";
                    };

                    var templateOptions = {
                        orderBy: $scope.orderBy ? " | orderBy:orderByFunc():isReverse()" : '',
                        ulClass: classIfDefined($scope.options.injectClasses.ul, true),
                        nodeChildren:  $scope.options.nodeChildren,
                        liClass: classIfDefined($scope.options.injectClasses.li, true),
                        iLeafClass: classIfDefined($scope.options.injectClasses.iLeaf, false),
                        labelClass: classIfDefined($scope.options.injectClasses.label, false)
                    };

                    var template;
                    var templateUrl = $scope.options.templateUrl || treeConfig.templateUrl;

                    if(templateUrl) {
                        template = $templateCache.get(templateUrl);
                    }

                    $scope.test = (node,$event) =>{
                        $event = $event || window.event;
                        if ($event.stopPropagation)
                            $event.stopPropagation();
                        else $event.cancelBubble = true;
                        if ($event.preventDefault)
                            $event.preventDefault();
                        else $event.returnValue = false;
                        $scope.$emit('newPlan', node);
                    };

                    if(!template) {
                        template =
                            '<ul {{options.ulClass}} >' +
                            '<li ng-repeat="node in node.{{options.nodeChildren}} | filter:filterExpression:filterComparator {{options.orderBy}}" ng-class="headClass(node)" {{options.liClass}}' +
                            'set-node-to-data>' +
                            '<div class="folderName" ng-click="selectNodeHead($event,node)"><i class="tree-branch-head" ng-class="iBranchClass()"></i>' +
                            '<i class="tree-leaf-head {{options.iLeafClass}}"></i>' +
                            '<div class="tree-label {{options.labelClass}}" ng-class="[selectedClass(), unselectableClass()]" tree-transclude></div><i class="newPlan" ng-click="test(node,$event)"></i><i ng-click = "selectedNodeFile($event,node)" class = "yhnIconFolderSetting1" ng-show = "!node.file.folder"></i><i ng-click = "selectedNodeFolder($event,node)" class = "yhnIconFolderSetting" ng-show = "node.file.folder"></i></div>' +
                            /*''+
                            ''+*/


                            '<treeitem ng-if="nodeExpanded()"></treeitem>' +
                            '</li>' +
                            '</ul>';
                    }

                    this.template = $compile($interpolate(template)({options: templateOptions}));
                }],
                compile: function(element, attrs, childTranscludeFn) {
                    return function ( scope, element, attrs, treemodelCntr ) {

                        scope.$watch("treeModel", function updateNodeOnRootScope(newValue) {
                            if (angular.isArray(newValue)) {
                                if (angular.isDefined(scope.node) && angular.equals(scope.node[scope.options.nodeChildren], newValue))
                                    return;
                                scope.node = {};
                                scope.synteticRoot = scope.node;
                                scope.node[scope.options.nodeChildren] = newValue;
                            }
                            else {
                                if (angular.equals(scope.node, newValue))
                                    return;
                                scope.node = newValue;
                            }
                        });

                        scope.$watchCollection('expandedNodes', function(newValue, oldValue) {
                            var notFoundIds = 0;
                            var newExpandedNodesMap = {};
                            var $liElements = element.find('li');
                            var existingScopes = [];
                            // find all nodes visible on the tree and the scope $id of the scopes including them
                            angular.forEach($liElements, function(liElement) {
                                var $liElement = angular.element(liElement);
                                var liScope = {
                                    $id: $liElement.data('scope-id'),
                                    node: $liElement.data('node')
                                };
                                existingScopes.push(liScope);
                            });
                            // iterate over the newValue, the new expanded nodes, and for each find it in the existingNodesAndScopes
                            // if found, add the mapping $id -> node into newExpandedNodesMap
                            // if not found, add the mapping num -> node into newExpandedNodesMap
                            angular.forEach(newValue, function(newExNode) {
                                var found = false;
                                for (var i=0; (i < existingScopes.length) && !found; i++) {
                                    var existingScope = existingScopes[i];
                                    if (scope.options.equality(newExNode, existingScope.node)) {
                                        newExpandedNodesMap[existingScope.$id] = existingScope.node;
                                        found = true;
                                    }
                                }
                                if (!found)
                                    newExpandedNodesMap[notFoundIds++] = newExNode;
                            });
                            scope.expandedNodesMap = newExpandedNodesMap;
                        });

//                        scope.$watch('expandedNodesMap', function(newValue) {
//
//                        });

                        //Rendering template for a root node
                        treemodelCntr.template( scope, function(clone) {
                            element.html('').append( clone );
                        });
                        // save the transclude function from compile (which is not bound to a scope as apposed to the one from link)
                        // we can fix this to work with the link transclude function with angular 1.2.6. as for angular 1.2.0 we need
                        // to keep using the compile function
                        scope.$treeTransclude = childTranscludeFn;
                    };
                }
            };
        }])
        .directive("setNodeToData", ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    $element.data('node', $scope.node);
                    $element.data('scope-id', $scope.$id);
                }
            };
        }])
        .directive("treeitem", function() {
            return {
                restrict: 'E',
                require: "^treecontrol",
                link: function( scope, element, attrs, treemodelCntr) {
                    // Rendering template for the current node
                    treemodelCntr.template(scope, function(clone) {
                        element.html('').append(clone);
                    });
                }
            };
        })
        .directive("treeTransclude", function() {
            return {
                link: function(scope, element, attrs, controller) {
                    if (!scope.options.isLeaf(scope.node)) {
                        angular.forEach(scope.expandedNodesMap, function (node, id) {
                            if (scope.options.equality(node, scope.node)) {
                                scope.expandedNodesMap[scope.$id] = scope.node;
                                scope.expandedNodesMap[id] = undefined;
                            }
                        });
                    }
                    if (!scope.options.multiSelection && scope.options.equality(scope.node, scope.selectedNode)) {
                        scope.selectedNode = scope.node;
                    } else if (scope.options.multiSelection) {
                        var newSelectedNodes = [];
                        for (var i = 0; (i < scope.selectedNodes.length); i++) {
                            if (scope.options.equality(scope.node, scope.selectedNodes[i])) {
                                newSelectedNodes.push(scope.node);
                            }
                        }
                        scope.selectedNodes = newSelectedNodes;
                    }

                    // create a scope for the transclusion, whos parent is the parent of the tree control
                    scope.transcludeScope = scope.parentScopeOfTree.$new();
                    scope.transcludeScope.node = scope.node;
                    scope.transcludeScope.$parentNode = (scope.$parent.node === scope.synteticRoot)?null:scope.$parent.node;
                    scope.transcludeScope.$index = scope.$index;
                    scope.transcludeScope.$first = scope.$first;
                    scope.transcludeScope.$middle = scope.$middle;
                    scope.transcludeScope.$last = scope.$last;
                    scope.transcludeScope.$odd = scope.$odd;
                    scope.transcludeScope.$even = scope.$even;
                    scope.$on('$destroy', function() {
                        scope.transcludeScope.$destroy();
                    });

                    scope.$treeTransclude(scope.transcludeScope, function(clone) {
                        element.empty();
                        element.append(clone);
                    });
                }
            };
        });
};
