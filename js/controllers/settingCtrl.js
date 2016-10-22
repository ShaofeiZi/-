/**
 * Created by fei on 2016/10/1.
 */
angular.module('myApp',[])
    .controller("settingCtrl",['$scope','$stateParams','$location','gameService',function($scope,$stateParams,$location,gameService){
        var vm = this;
        //获取gameList传过来的versionId
        $scope.gameVersionId=$stateParams.versionId;
        //获取gameService中的VersionList
        gameService.getVersonList().then(function(res){
            $scope.versionList=res.data.data[$scope.gameVersionId];
            $scope.numberState=res.data.data[$scope.gameVersionId].playerNumDefault;
            if($scope.gameVersionId==11||$scope.gameVersionId==12||$scope.gameVersionId==13)
            {
                if(!localStorage.string|| !localStorage.number){
                    $scope.playerNumDefault=$scope.numberState;
                }
                else{
                    gameString=JSON.parse(localStorage.string);
                    number=JSON.parse(localStorage.number);
                    $scope.showWaterWord=gameString[0];
                    $scope.showSpiritWord=gameString[1];
                    $scope.playerNumDefault=number;
                    console.log($scope.playerNumDefault)
                }

            }
            else{
                if(!localStorage.number){
                    $scope.playerNumDefault=$scope.numberState;
                }
                else {
                    number=JSON.parse(localStorage.number);
                    $scope.playerNumDefault=number;
                    console.log($scope.playerNumDefault)
                }

            }
        });
        //判断是否为捉鬼游戏如果是则将本地存储的词组输入到view中。


        //用户点击发牌所采取的动作
        $scope.playerAllot=function(){
            //如果用户玩的是捉鬼游戏并且用户输入的词组
            if(($scope.gameVersionId==11||$scope.gameVersionId==12||$scope.gameVersionId==13)&&(!$scope.showSpiritWord||!$scope.showWaterWord)) {
                alert("请输入水民词组与幽灵词组");

                return;
            }
            else if(($scope.gameVersionId==11||$scope.gameVersionId==12||$scope.gameVersionId==13)&&($scope.showSpiritWord==$scope.showWaterWord)) {

                alert("亲：水民词组与幽灵词组不能相同")
                return;
            }
            //判断用户输入的是否在正常范围内的人数
            else if($scope.playerNumDefault<$scope.versionList.numMin||$scope.playerNumDefault>$scope.versionList.numMax) {
                alert("请输入玩家数量。");
                return;
            }
            //如果上述条件都成立则采取的操作。
            else {
                var playerNum = $scope.versionList.playerNum[$scope.playerNumDefault];
                var playerRole = $scope.versionList.role;
                /*playerArr 存储玩家角色*/
                var playerArr=[] ;
                playerArr=gameService.setPlayerArr(playerNum,playerRole);
                playerArr = gameService.setRandomSort(playerArr);
                /*setOrderPlayerArr 存储打乱后的的玩家角色数组*/
                var nowOrderArr = [];
                var roleWater=$scope.showWaterWord;
                var roleSpirit=$scope.showSpiritWord;
                var roleNumber=$scope.playerNumDefault;
                var gameString=gameService.setLocalStorage(roleWater,roleSpirit);
                localStorage.string=JSON.stringify(gameString);
                localStorage.number=JSON.stringify(roleNumber);
                nowOrderArr=gameService.setOrderPlayerArr(playerArr,roleWater,roleSpirit,$scope.gameVersionId);
                /*将玩家信息数组压入本地ocal Storage*/
                localStorage.playerList = JSON.stringify(nowOrderArr);
                nowArr=null;
                var nowOrderNum=[];
                nowOrderNum=gameService.setplayerNum(playerNum,playerRole);
                localStorage.playerNum = JSON.stringify(nowOrderNum);
                nowOrderNum=null;
                playerArr=null;
            }
            if(playerArr==null){
                $location.path("viewCard");
            }

        }
    }]);

