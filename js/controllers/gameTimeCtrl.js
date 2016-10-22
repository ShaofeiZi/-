/**
 * Created by fei on 2016/10/3.
 */
angular.module('myApp').controller('gameTimeCtrl',
    ["$state", "$scope", "gameService","roleClick","publicFunction",
    function ($state, $scope, gameService,roleClick,publicFunction) {
        var vm = this;

        // 获取玩家列表
        vm.playerList=JSON.parse(localStorage.playerList);
        // 获取天数信息
        vm.days=JSON.parse(localStorage.days);
        // 获取导引栏点击次数信息
        vm.guideHitCount=JSON.parse(localStorage.guideHitCount);
        // 获取存活人数信息
        vm.playerNum = JSON.parse(localStorage.playerNum);
        // 获取版本ID
        vm.versionId = $state.params.versionId;
        // 获取游戏配置
        vm.version = gameService.getVersonList().then(function (res) {
            vm.version = res.data.data[vm.versionId];
        });
        vm.time = $state.params.gameTime;
        vm.role = $state.params.role;
        // 获取角色点击事件
        vm.click=roleClick[vm.versionId][vm.role];

        // 获取查询存活状态方法
        vm.inquireStatus=publicFunction.inquireStatus;

        // 改变当前点击选择的玩家
        vm.selectPlayer=function (index) {
            vm.currentSelectPlayer=index;
        };

        // 判断是否为最后一项，是的话添加下一天
        var isLastGuide=function (res) {
            if(vm.role==vm.version.lastGuide){
                publicFunction.addNextDay(vm.days,vm.guideHitCount,vm.version);
            }else{
            }
        };

        // 小图标显示隐藏
        vm.show=publicFunction.show;

        // vm.confirm=publicFunction.confirm;
        vm.confirm=function () {
            // 杀人序号
            if(vm.versionId==13){
                vm.killerNum=prompt("请输入杀人者序号");
            }
            // 调用角色函数
            var res=roleClick[vm.versionId][vm.role](vm.currentSelectPlayer,vm.playerList,vm.days,vm.killerNum,vm.role,vm.playerNum);
            if (res.canJumpNext){
                // 添加点击次数
                vm.guideHitCount[vm.guideHitCount.length-1].guideHit[vm.role].hitCount = vm.guideHitCount[vm.guideHitCount.length-1].guideHit[vm.role].hitCount + 1;
                localStorage.guideHitCount = JSON.stringify(vm.guideHitCount);
                // 添加游戏Log
                publicFunction.addLog(vm.time,vm.days,vm.guideHitCount,res,vm.playerList);

                publicFunction.updatePlayerList(vm.version,vm.playerNum,vm.time,vm.days,vm.role,vm.playerList);
                // 判断是否为最后一个
                publicFunction.canChangePlayerNum(vm.version,vm.playerNum,vm.time,vm.days,vm.role,vm.playerList);
                // 判断是否为最后一项，是的话添加下一天
                isLastGuide(res);
                // 跳转页面
                $state.go("days",{versionId:vm.versionId})
            }else if(res.canJumpNext){}
        };

    }]);
