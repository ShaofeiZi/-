/**
 * Created by fei on 2016/9/20.
 */
// 公共方法
angular.module('myApp').factory('publicFunction', function () {
    return {
        // 查询当前玩家是否死亡
        // 第一个值为查询的查询的状态，第二个值为查询的玩家
        inquireStatus: function (status, player) {
            // for(var i=0,length=player.status.length;i<length;i++){

            if(player!=undefined&&player.status == status) {
                return true
            } else {
                return false
            }
            // }
        },
        // 小图标显示隐藏
        show: function (index, currentSelectPlayer) {
            if (index == currentSelectPlayer) {
                return true
            } else {
                return false
            }
        },
        // 设置log
        // 当前时间、dats列表，当前角色，操作对象，玩家列表
        addLog: function (time, days, guideHitCount, res, playerList) {
            if(res.selectPlayerNum==undefined){
                days[days.length - 1].time[time][res.currentRole] = {
                    death: undefined,
                    deathRole:undefined,
                    deathType: undefined,
                    killer: res.currentRole,
                    selectPlayerChange:res.selectPlayerChange
                };
            }else{
                days[days.length - 1].time[time][res.currentRole] = {
                    death: (res.selectPlayerNum + 1),
                    deathRole: playerList[res.selectPlayerNum].role,
                    deathType: res.currentRole + 'Death',
                    killer: res.currentRole,
                    selectPlayerChange:res.selectPlayerChange
                };
            }

            localStorage.days = JSON.stringify(days);

        },
        // 更新玩家列表
        updatePlayerList:function (version,playerNum,time,days,role,playerList) {
            // 首先根据配置中的可跳转的导引栏遍历
            for (var x=(version.daysGuideObject[time].length);x>=0;x--){
                // 判断最后一步的角色是否全部死亡&&是否等于当前点击的角色，如果没死并且不是当前点击的角色那么跳出循环
                if(playerNum[version.daysGuideObject[time][x-1]]!=0&&version.daysGuideObject[time][x-1]!=role){
                    break
                    // 如果死亡并且不是当前点击的角色那么进行下一次循环
                }else if(playerNum[version.daysGuideObject[time][x-1]]==0&&version.daysGuideObject[time][x-1]!=role){
                    continue
                    // 如果当前循环到的角色没死，并且等于当前点击的角色，那么执行事件
                }else if(playerNum[version.daysGuideObject[time][x-1]]!=0&&version.daysGuideObject[time][x-1]==role){
                    for(var i in days[days.length-1].time[time]){
                        if(days[days.length-1].time[time][i].death!=undefined){
                            for(var player in playerList){
                                if(playerList[player].num==days[days.length-1].time[time][i].death&&days[days.length-1].time[time][i].selectPlayerChange==-1){
                                    playerList[player].status="death";
                                }else if(playerList[player].num==days[days.length-1].time[time][i].death&&days[days.length-1].time[time][i].selectPlayerChange==1){
                                    playerList[player].status="living";
                                }
                            }
                        }
                    }
                    localStorage.playerList=JSON.stringify(playerList);
                    break
                }
            }
        },
        // 添加引导栏点击次数信息
        addGuideHitCount: function (guideHitCount, role) {
            guideHitCount[guideHitCount.length - 1].guideHit[role].hitCount = guideHitCount[guideHitCount.length - 1].guideHit[role].hitCount + 1;
            localStorage.guideHitCount = JSON.stringify(guideHitCount);
        },
        // 存储初始天数
        addInitDay: function (version) {
            var days = [{
                day: 1,
                time: {
                    nighttime: {},
                    daytime: {}
                }
            }];
            var guideHitCount = [
                {
                    day: 1,
                    guideHit: version.daysGuideCanClick
                }
            ];
            localStorage.days = JSON.stringify(days);
            localStorage.guideHitCount = JSON.stringify(guideHitCount);
        },
        // 添加天数
        addNextDay: function (days, guideHitCount, version) {
            days[days.length] = {
                day: days.length + 1,
                time: {
                    nighttime: {},
                    daytime: {}
                }
            };
            guideHitCount[guideHitCount.length] = {
                day: guideHitCount.length + 1,
                guideHit: version.daysGuideCanClick
            };
            localStorage.days = JSON.stringify(days);
            localStorage.guideHitCount = JSON.stringify(guideHitCount);
        },
        // 判断当前引导页是否可以跳转
        canClickOfDaysGuide: function (version, guide, guideHitCount, day, playerNum) {
            // 判断游戏角色是否全部死亡
            var playerNum=JSON.parse(localStorage.playerNum);
            var sum=0;
            var isJumpGuide
            $.each(playerNum,function (key,value) {
                sum=sum+value
            });
            if(sum==1){
                alert("所有玩家已死亡，请结束游戏");
                return false
            }
            version.theDaysGuideCanJump.forEach(function (value,key) {
                if(guide==value&&guideHitCount[guideHitCount.length-1].day==day){
                    for(var i=0,length=key;i<length;i++){
                        if(guideHitCount[guideHitCount.length-1].guideHit[version.theDaysGuideCanJump[i]].hitCount==0&&playerNum[version.theDaysGuideCanJump[i]]!=0){
                            alert("请按顺序操作");
                            isJumpGuide=true;
                            break
                        }
                    }
                }else {}
            });
            if(isJumpGuide){
                return false
            }else{}

            // 判断当前引导栏是否点击过
            if (guideHitCount[day - 1].guideHit[guide].hitCount >= 1) {
                alert("请进行游戏下一项活动");
                return false;
                // 判断当前引导栏是否能点击
            } else if (playerNum[guide] == 0) {
                alert("当前角色已去全部死亡，请进行游戏下一项活动");
                guideHitCount[day - 1].guideHit[guide].hitCount = guideHitCount[guideHitCount.length - 1].guideHit[guide].hitCount + 1;
                localStorage.guideHitCount = JSON.stringify(guideHitCount);
                return false;
            } else if (version.daysGuideCanClick[guide].canClick) {
                // 当能点击时，将添加点击次数改位成功点击确认后
                // guideHitCount[day - 1].guideHit[guide].hitCount = guideHitCount[guideHitCount.length - 1].guideHit[guide].hitCount + 1;
                // localStorage.guideHitCount = JSON.stringify(guideHitCount);
                return true;
                // 当前引导栏不能换点击，弹出提示
            } else {
                alert("请" + version.CN.daysGuideAlert[guide]);
                guideHitCount[day - 1].guideHit[guide].hitCount = guideHitCount[guideHitCount.length - 1].guideHit[guide].hitCount + 1;
                localStorage.guideHitCount = JSON.stringify(guideHitCount);
                return false
            }
        },

        // 从最后一引导栏所属角色开始判断是否死亡，如果死亡的话继续判断倒数第二栏，
        // 直到当前角色引导栏后才将之前角色所进行的杀死玩家信息添加到玩家总数中，
        canChangePlayerNum:function (version,playerNum,time,days,role,playerList) {
        for (var x=(version.daysGuideObject[time].length);x>=0;x--){
            if(playerNum[version.daysGuideObject[time][x-1]]!=0&&version.daysGuideObject[time][x-1]!=role){
                break
            }else if(playerNum[version.daysGuideObject[time][x-1]]==0&&version.daysGuideObject[time][x-1]!=role){
                continue
            }else if(playerNum[version.daysGuideObject[time][x-1]]!=0&&version.daysGuideObject[time][x-1]==role){
                var killerPlayer={};
                for(var i in days[days.length-1].time[time]){
                    if(days[days.length-1].time[time][i].selectPlayerChange==-1){
                        killerPlayer[days[days.length-1].time[time][i].deathRole]=-1;
                    }else if(days[days.length-1].time[time][i].selectPlayerChange==1){
                        killerPlayer[days[days.length-1].time[time][i].deathRole]=0
                    }
                }
                for(var player in killerPlayer){
                    playerNum[player]=playerNum[player]+killerPlayer[player]
                }
                // playerNum[days[days.length-1].time[time][i].deathRole]=playerNum[days[days.length-1].time[time][i].deathRole]+days[days.length-1].time[time][i].selectPlayerChange;
                localStorage.playerNum=JSON.stringify(playerNum);
                break
            }
        }
    }
    }
});


// 角色点击事件
angular.module('myApp').factory('roleClick', function (publicFunction) {
    // return 0 输入有问题，需要重新选择杀人
    // return 1 杀死选中人
    // return 2 杀死杀人者
    return {
        // 角色返回值说明
        // return{
        //     canJumpNext:true,                     返回布尔值，true跳转；false不能跳转
        //     currentRole:theRole,                  返回当前动作对象名称
        //     selectPlayerNum:index,                返回此次选择玩家序号
        //     selectPlayer:playerList[index].role,  返回此次选择玩家名称
        //     selectPlayerChange:+1,                返回操作玩家总人数操作+1/0/-1
        //     playerStatus:"living",                返回操作后当前玩家状态
        //     playerManiPulate:"doctorCure"         返回当前操作后所添加标签（此处为供法官Log页面repeat玩家操作记录的图片所用）
        // }

        // 版本选择
        // 捉鬼游戏简单版
        "11": function () {
            return {
                // 版本中角色
                vote: function (index, playerList, days, killerNUm, theRole,playerNum) {
                    // 判断当前玩家是否能点击
                    if(index==undefined){
                        alert("请先选择要操作的玩家");
                        return {
                            canJumpNext:false
                        }
                    }else if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }
                    return {
                        // 能否跳转
                        canJumpNext:true,
                        currentRole:theRole,
                        // 操作玩家index
                        selectPlayerNum:index,
                        // 操作玩家角色
                        selectPlayer:playerList[index].role,
                        // 相应玩家数量
                        selectPlayerChange:-1,
                        // 玩家状态
                        playerStatus:"death",
                        // 玩家添加标签
                        playerManiPulate:"vote"
                    }
                }
            }
        }(),
        // 捉鬼游戏猜词版
        "12": function () {
            return {
                // 版本中角色
                vote: function (index, playerList, days, killerNUm, theRole,playerNum) {
                    if(index==undefined){
                        alert("请先选择要操作的玩家");
                        return {
                            canJumpNext:false
                        }
                    }else if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }
                    return {
                        canJumpNext:true,
                        currentRole:theRole,
                        selectPlayerNum:index,
                        selectPlayer:playerList[index].role,
                        selectPlayerChange:-1,
                        playerStatus:"death",
                        // 玩家添加标签
                        playerManiPulate:"vote"
                    }

                }
            }
        }(),
        // 捉鬼游戏杀人版
        "13": function () {
            return {
                // 该版本需判断被杀者是幽灵还是水民
                vote: function (index, playerList, days, killerNum, theRole,playerNum) {
                    // 被杀者为幽灵，被杀者死，被杀者为水民，杀人者死
                    if(index==undefined){
                        alert("请先选择要操作的玩家");
                        return {
                            canJumpNext:false
                        }
                    }else if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (killerNum == undefined) {
                        alert("请输入杀人者序号");
                        return {
                            canJumpNext:false
                        }
                    } else if ((--killerNum) == index) {
                        alert("不能杀死自己，请选择其他玩家杀死或是检查输入杀人者序号是否正确");
                        return {
                            canJumpNext:false
                        }
                    }
                    if (playerList[index].role == "ghost") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:-1,
                            playerStatus:"death",
                            // 玩家添加标签
                            playerManiPulate:"vote"
                        }
                    } else if (playerList[index].role == "water") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:killerNum,
                            selectPlayer:playerList[killerNum].role,
                            selectPlayerChange:-1,
                            playerStatus:"death",
                            // 玩家添加标签
                            playerManiPulate:"vote"
                        }
                    }

                }
            }
        }(),
        // 杀人游戏
        // 杀人游戏简单版
        "21": function () {
            return {
                // 杀手
                killer: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true
                        }
                    }
                    if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (playerList[index].role != "killer") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:-1,
                            playerStatus:"death",
                            // 玩家添加标签
                            playerManiPulate:"killer"
                        }
                    } else {
                        alert("你是杀手不能杀死本职业，请选择其他玩家杀死");
                        return {
                            canJumpNext:false
                        }
                    }

                },
                // 投票
                vote: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        alert("请先选择要操作的玩家");
                        return {
                            canJumpNext:false
                        }
                    }else if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    return {
                        canJumpNext:true,
                        currentRole:theRole,
                        selectPlayerNum:index,
                        selectPlayer:playerList[index].role,
                        selectPlayerChange:-1,
                        playerStatus:"death",
                        // 玩家添加标签
                        playerManiPulate:"vote"
                    }

                }
            }
        }(),
        // 杀人游戏警版
        "22": function () {
            return {
                // 杀手
                killer: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true,
                            currentRole:"killer",
                            selectPlayerNum:undefined,
                            selectPlayer:undefined,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:undefined
                        }
                    }
                    if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (playerList[index].role != "killer") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:-1,
                            playerStatus:"death",
                            // 玩家添加标签
                            playerManiPulate:"killer"
                        }
                    } else {
                        alert("你是杀手不能杀死本职业，请选择其他玩家杀死");
                        return {
                            canJumpNext:false
                        }
                    }

                },
                // 警察
                police: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true,
                            currentRole:"police",
                            selectPlayerNum:undefined,
                            selectPlayer:undefined,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:undefined
                        }
                    }
                    if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (playerList[index].role != "police") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:"vote"
                        }
                    } else {
                        alert("该玩家是警察，请选择其他玩家查看身份");
                        return {
                            canJumpNext:false
                        }
                    }

                },
                // 投票
                vote: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        alert("请先选择要操作的玩家");
                        return {
                            canJumpNext:false
                        }
                    }else if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    return {
                        canJumpNext:true,
                        currentRole:theRole,
                        selectPlayerNum:index,
                        selectPlayer:playerList[index].role,
                        selectPlayerChange:-1,
                        playerStatus:"death",
                        // 玩家添加标签
                        playerManiPulate:"vote"
                    }
                }

            }
        }(),
        // 杀人游戏3.0
        "23": function () {
            return {
                // 杀手
                killer: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true,
                            currentRole:"killer",
                            selectPlayerNum:undefined,
                            selectPlayer:undefined,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:undefined
                        }
                    }
                    if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (playerList[index].role != "killer") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:-1,
                            playerStatus:"death",
                            // 玩家添加标签
                            playerManiPulate:"killer"
                        }
                    } else {
                        alert("你是杀手不能杀死本职业，请选择其他玩家杀死");
                        return {
                            canJumpNext:false
                        }
                    }

                },
                // 警察
                police: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true,
                            currentRole:"police",
                            selectPlayerNum:undefined,
                            selectPlayer:undefined,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:undefined
                        }
                    }
                    if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (playerList[index].role != "police") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:"police"
                        }
                    } else {
                        alert("该玩家时警察，请选择其他玩家查看身份");
                        return {
                            canJumpNext:false
                        }
                    }

                },
                // 狙击手
                sniper: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true,
                            currentRole:"sniper",
                            selectPlayerNum:undefined,
                            selectPlayer:undefined,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            // 玩家添加标签
                            playerManiPulate:undefined
                        }
                    }
                    if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                        return {
                            canJumpNext:false
                        }
                    }

                    if (playerList[index].role != "sniper") {
                        return {
                            canJumpNext:true,
                            currentRole:theRole,
                            selectPlayerNum:index,
                            selectPlayer:playerList[index].role,
                            selectPlayerChange:-1,
                            playerStatus:"death",
                            // 玩家添加标签
                            playerManiPulate:"sniper"
                        }
                    } else {
                        alert("你是狙击手不能杀死本职业，请选择其他玩家杀死");
                                                return {
                            canJumpNext:false
                        }
                    }

                },
                // 医生
                doctor: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        return {
                            canJumpNext:true,
                            currentRole:"doctor",
                            selectPlayerNum:undefined,
                            selectPlayer:undefined,
                            selectPlayerChange:0,
                            playerStatus:"living",
                            playerManiPulate:undefined
                        }
                    }
                    // 判断点击的玩家的生死状态
                    if (playerList[index].status == "death") {
                        alert("当前选择玩家之前已死亡，医生无法治疗，请选择其他玩家");
                        return{
                            canJumpNext:false
                        }
                    } else if (playerList[index].status == "living") {
                        // 如果是死亡，那么检查是否是今天杀手或狙击手杀死的，是的话复活他
                        for (var i in days[days.length-1].time.nighttime) {
                            if (days[days.length-1].time.nighttime[i].death == (index + 1)) {
                                return {
                                    canJumpNext:true,
                                    currentRole:theRole,
                                    selectPlayerNum:index,
                                    selectPlayer:playerList[index].role,
                                    selectPlayerChange:+1,
                                    playerStatus:"living",
                                    // 玩家添加标签
                                    playerManiPulate:"doctorCure"
                                }
                            }
                        }
                        // 如果是存活，并且之前一天医生治疗过那么杀死
                        if ((days.length - 2)>=0&&days[days.length - 2].time.nighttime.doctor!=undefined&&days[days.length - 2].time.nighttime.doctor.death == (index + 1)) {
                            return {
                                canJumpNext:true,
                                currentRole:theRole,
                                selectPlayerNum:index,
                                selectPlayer:playerList[index].role,
                                selectPlayerChange:-1,
                                playerStatus:"death",
                                // 玩家添加标签
                                playerManiPulate:"doctorKiller"
                            }
                        } else {
                            // 没治疗过，加标记
                            return {
                                canJumpNext:true,
                                currentRole:theRole,
                                selectPlayerNum:index,
                                selectPlayer:playerList[index].role,
                                selectPlayerChange:0,
                                playerStatus:"living",
                                // 玩家添加标签
                                playerManiPulate:"doctorCure"
                            }
                        }
                    }
                },
                // 投票
                vote: function (index, playerList, days, killerNum, theRole,playerNum) {
                    if(index==undefined){
                        alert("请先选择要操作的玩家");
                                                return {
                            canJumpNext:false
                        }
                    }else if (publicFunction.inquireStatus("death", playerList[index])) {
                        alert("当前玩家已死亡，请选择其他玩家");
                                                return {
                            canJumpNext:false
                        }
                    }

                    return {
                        canJumpNext:true,
                        currentRole:theRole,
                        selectPlayerNum:index,
                        selectPlayer:playerList[index].role,
                        selectPlayerChange:-1,
                        playerStatus:"death",
                        // 玩家添加标签
                        playerManiPulate:"doctorCure"
                    }
                }

            }
        }()
    }
});
// 数组打乱

angular.module('myApp').factory('upset', function () {
    return function (playerName, playerNum) {
        var player = [];
        for (var x = 0; x < playerName.length; x++) {
            for (var i = 0; i < playerNum[playerName[x]]; i++) {
                player.push({name: playerName[x], condition: '存活'})
            }
        }
        player.sort(function () {
            return 0.5 - Math.random();
        });
        return player;
    }
});

