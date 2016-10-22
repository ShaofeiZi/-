/**
 * Created by fei on 2016/9/26.
 */
angular.module('myApp').factory('gameService', function ($http, $state) {
    return {
        getGameList: function () {
            return $http.get('version/gameList.json')
        },
        getVersonList: function () {
            return $http.get('version/versionList.json')
        },
        //翻牌判断
        determineCard: function (GameObject, StateValue, Card,VersonId) {
            var CardDisplay = {};
            if (Card == "initial") {
                $(".viewCard-guess").css("display","none");
                CardDisplay.num = GameObject[StateValue].num;
                CardDisplay.logo = "image/spirit-card-behind.png";
                CardDisplay.Btn = "查看" + CardDisplay.num + "号身份";
                CardDisplay.guess = "";
                CardDisplay.role = "";
                CardDisplay.StateValue = 0;
                CardDisplay.Card = "CardFront";
                return CardDisplay;
            }
            if (Card == "CardFront") {
                if(VersonId==11 || VersonId==12 || VersonId==13){
                    $(".viewCard-guess").css("display","block");
                    CardDisplay.prompt = "想办法猜到人的词，同时还要注意不要暴露自己哦！";
                }else {
                    $(".viewCard-guess").css("display","none");
                    CardDisplay.prompt="";
                    CardDisplay.guess = "";
                }
                CardDisplay.num = GameObject[StateValue].num;
                CardDisplay.logo = "image/spirit-card-front.png";
                CardDisplay.guess = "词组:"+GameObject[CardDisplay.num - 1].guess;
                CardDisplay.role = GameObject[CardDisplay.num - 1].role;
                $(".viewCard-logo").css("margin","0.57rem 0 0.37rem 0");
                $(".viewCard-logo img").css("width","2.22rem");
                if (GameObject.length == CardDisplay.num) {
                    CardDisplay.Btn = "法官查看";
                    CardDisplay.Card = "CardBack";
                    CardDisplay.StateValue = StateValue + 1;
                } else {
                    $(".viewCard-block").css("height","6.56rem");
                    CardDisplay.Btn = "隐藏并传递给" + (CardDisplay.num + 1) + "号";
                    CardDisplay.StateValue = StateValue + 1;
                    CardDisplay.Card = "CardBack";
                }
                return CardDisplay;

            }
            else if (StateValue == GameObject.length) {
                $state.go("judgeView",({versionId:VersonId}));
            }
            else {
                $(".viewCard-logo").css("margin","1.79rem 0 1.62rem 0");
                $(".viewCard-logo img").css("width","3rem");
                $(".viewCard-guess").css("display","none");
                CardDisplay.num = GameObject[StateValue].num;       //编号
                CardDisplay.logo = "image/spirit-card-behind.png";
                CardDisplay.Btn = "查看" + CardDisplay.num + "号身份";       //按钮
                CardDisplay.StateValue = StateValue;
                CardDisplay.Card = "CardFront";
                CardDisplay.guess = "";
                CardDisplay.role = "";
                return CardDisplay;
            }
        },
        /*setting-page
        /*设置玩家身份数组*/
        /*
        * 格式为：
        * ["水手"，"水手","农民","农民","农民"]
        * */
        setPlayerArr:function(countArr,roleArr){
            var playerArr=[];
            for(var i=0;i<countArr.length;i++)
            {
                for(var j=0;j<countArr[i];j++)
                {
                    var oldArr=roleArr[i];
                    playerArr.push(oldArr);
                }
            }
            return playerArr;

        },
        /*setting-page
        /*设置打乱后的的玩家角色数组,以后将存储到本地*/
        /*
        * 格式为：playerList
        * [
        *    {"num":1,"role":"water","status":"living","maniPulate":[]},
        *    {...},
        *    ...
        * ]
        * */
        setOrderPlayerArr:function(playerArr,roleWater,roleSpirit,versionId)
        {
            var nowArr=[];
            for(var i=0;i<playerArr.length;i++)
            {
                var nowObject={};
                    nowObject.num=i+1;                 //几号玩家
                    nowObject.role=playerArr[i];       //玩家角色名称
                    nowObject.status="living";  //玩家存活状态
                    nowObject.maniPulate=[];    //后面角色被其他玩家施展的技能
                if(versionId==11||versionId==12||versionId==13)/*只有猜词游戏有词汇信息*/
                {
                    if(playerArr[i]=="ghost")
                    {
                        nowObject.guess=roleSpirit;
                    }
                    else if(playerArr[i]=="water")
                    {
                        nowObject.guess=roleWater;
                    }
                    else
                    {}
                }
                nowArr.push(nowObject);
            }
            return nowArr;
        },
        /*setting-page
        /*设置玩家角色的数量,以后将存储到本地*/
        /*
        /*格式为：playerNum
        * {"water":6,"spirit":2}
        * */
        setplayerNum:function(countArr,roleArr){
            var nowArr={};
                for(var i=0;i<roleArr.length;i++)
                {
                    nowArr[roleArr[i]]=countArr[i];
                }
                return nowArr;
        },
        /*setting-page*/
        /*get本地local Storage*/
        /*
        *
        * 格式为：
        *        ["词组1","词组2"]
        * */
        setLocalStorage:function(string1,string2){
            var  nowArr=[];
            nowArr[0]=string1;
            nowArr[1]=string2;
           return nowArr;
        },
        /*gameList*/
        /*设置随机打乱数组
        *
        * */
        setRandomSort:function(input){
            var random=function(){
                return Math.random()<0.5?1:-1;
            };
            var randomLength=Math.random()*10;
            for(var i=randomLength;i>0;i--)
            {
                input=input.reverse();
                input.sort(random);
            }
            return input;
        },
        /*gameList*/
        /*显示当前游戏列表
        *
        * */
        setStateChange:function(index,active){
            for(var i=0;i<active.length;i++)
            {
                if(i==index){
                    active[i]=true;
                }else{
                    active[i]=false;
                }
            }
            return active;
        }



    }
});


