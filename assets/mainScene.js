// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


// var cardSprite = require("cardSprite");


// var conig = {
//     color:"RED",
//     num:"2"
// };
const flipStatusInit = 0;
const flipStatusHolder = 1;
const flipStatusPlaying = 2;
const flipStatusScoring = 3;

cc.Class({
    extends: cc.Component,

    properties: {
        scoreNode:{
            default:null,
            type:cc.Node
        },
        timerNode:{
            default:null,
            type:cc.Node
        },
        cardSpriteFrame:{
            default:[],
            type:[cc.SpriteFrame]
        },
        cardPrefab:{
            default:null,
            type:cc.Prefab
        },
        pausePrefab:{
            default:null,
            type:cc.Prefab
        },
        finaleScoreArray:{
            default:[],
            type:[cc.Sprite]
        },
        playingCardArray:{
            default:[],
            type:[cc.Sprite]
        },
        pauseBtn:{
            default:null,
            type:cc.Button
        },
        askBtn:{
            default:null,
            type:cc.Button
        },
        soundBtn:{
            default:null,
            type:cc.Button
        },
        undoBtn:{
            default:null,
            type:cc.Button
        },
        indecatorBtn:{
            default:null,
            type:cc.Button
        },
        originBg:{
            default:null,
            type:cc.Sprite
        },
        someCardBg:{
            default:null,
            type:cc.Sprite
        },
        refreshBtn:{
            default:null,
            type:cc.Button
        },
        allCards:{
            default:[],
            type:[cc.Node]
        },
        allHolderCards:{
            default:[],
            type:[cc.Node]
        },
        timerLeftNode:{
            default:null,
            type:cc.Node
        }

        
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    pausuBtnAction:function(){

        var pauseSprite = cc.instantiate(this.pausePrefab);
        pauseSprite.parent = this.node;
        var pauseScript = pauseSprite.getComponent("pauseScript");


    },
    soundBtnAction:function(){
        cc.log(this.someCardBg.node.width);
    },
    askBtnAction:function(){
        cc.log("allcards=",this.allCards);
    },
    undoBtnAction:function(){
        cc.log("撤销");
    },
    indecatorBtnAction:function(){
        cc.log("indecatorBtn");
    },
    resreshBtnAction:function () {
      cc.log("重新翻牌");  
        var width = this.someCardBg.node.width;
        var left = this.someCardBg.node.x;
        var top = this.someCardBg.node.y;
        var height = this.someCardBg.node.height;
        var gap = ( -width + 80*3)/2;

        

        if (this.allCards.length > 0) {
            
            for (let j = 0; j < this.allHolderCards.length; j++) {
                const holderNode = this.allHolderCards[j];
                var t = cc.tween;
                t(holderNode).to(0.2,{position:cc.v2(left - gap,top)}).start();
            }

            for (let i = 0; i < 3; i++) {
                var node = this.allCards.pop();
                if (node) {
                    let t = cc.tween;
                    t(node).delay(0.05*i)
                    .parallel(
                        t().to(0.1, { skewY:10,scaleX:0, }),
                        t().to(0.1, { position: cc.v2((left + node.x)/2,top) })
                    )
                    .call((n)=>{
                        cc.log("第二秒执行完毕");
                        cc.log(n);
                        if (n.setSiblingIndex instanceof Function) {
                            n.setSiblingIndex(-1);
                        }else{
                            cc.log("不能响应函数");
                        }
                        // var p = node.parent;
                        // node.removeFromParent();
                        // p.addChild(node);
                    })
                    .parallel(
                        t().to(0.1, { skewY:0,scaleX:-1, }),
                        t().to(0.1, { position: cc.v2(left - gap + gap*i,top) })
                    )
                    .call((n)=>{
                        cc.log("第4秒执行完毕");
                        n.getComponent("cardSprite").flipStatus = flipStatusHolder;
                        
                    })
                    .start();
                }
                
                this.allHolderCards.push(node);
                

                
            }


        }else{
            let length = this.allHolderCards.length;
            for (let j = 0; j < length; j++) {
                const holderNode = this.allHolderCards.pop();
                if(!holderNode){break};
                var t = cc.tween;
                t(holderNode).delay(0.01*j)
                .parallel(
                    t().to(0.2,{position:cc.v2(this.originBg.node.x,this.originBg.node.y)}),
                    t().then(t().to(0.1,{skewY:10,scaleX:0})).then(t().to(0.1,{skewY:0,scaleX:1}))
                ).call((n)=>{
                    cc.log("MMMMMMMMMMMMMM----",n.setSiblingIndex);
                    cc.log(n.getComponent("cardSprite").numValue);
                    cc.log(n.getComponent("cardSprite").colorValue);
                    
                    if (n.setSiblingIndex instanceof Function) {
                        n.setSiblingIndex(-1);
                    }else{
                        cc.log("不能响应函数");
                    }
                })
                .start();
                this.allCards.push(holderNode);
            }
        }




    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("on load");
        this.createCards();
    },

    startGame:function () {
      cc.log("start game");
        var row  = 0;
        var line = 0;

        var index = 0;


        for (let row = 0; row < 7; row++) {
            let sprite = null;
            for (let line = row; line < 7; line++) {
                //队列数据结构的访问规则是FIFO（先进先出），队列在列表的末端添加项，
                //从列表的前端移除项，使用shift方法，它能够移除数组中的第一个项并返回该项，并且数组的长度减1。
                sprite = this.allCards.shift();
                
                let playingCardNode = cc.find("playingCardsBg"+line,this.node);
                cc.log(playingCardNode.children);
                let lastSprite = this.findOutCardSpriteFromParent(playingCardNode);//playingCardNode.children.length>0 ? playingCardNode.children.slice(-1)[0] : playingCardNode;
                let worldP = this.node.convertToWorldSpaceAR(this.originBg.node.position);

                let prePosition = playingCardNode.convertToNodeSpaceAR(worldP);
                sprite.parent = playingCardNode;
                sprite.position = prePosition;
                sprite.setSiblingIndex = -1;

                sprite.row = row;
                sprite.line = line;

                cc.tween(sprite)
                .delay(0.1*index)
                // .to(0.2,{position:cc.v2(playingCardNode.position.x,playingCardNode.position.y-2*row)})
                .to(0.05,{position:cc.v2(0,-15*row)})
                .call((n)=>{
                    if (line == row) {
                        // n.getComponent("cardSprite").flipVertor();
                        n.scaleY = 0;
                        n.scaleX = -1;
                        cc.tween(n).to(0.1,{scaleY:1}).start();
                        n.getComponent("cardSprite").flipStatus = flipStatusPlaying;
                    }
                    

                })
                .start();

                

                index ++;
                
            }
            
        }
       
    },

    findOutCardSpriteFromParent:function(parentNode){
        var node = parentNode;

        if (node.children.length > 0) {
            return node.children.slice(-1)[0];
        }else{
            return node;
        }

        var end = false;
        while (!end) {
            var n = cc.find("cardSprite",node);
            if (!n) {
                end = true;
            }else{
                node = n;
            }
        }
        return node;
    },

    addEventListener:function(){

        this.node.on(cc.Node.EventType.TOUCH_END,function(){
            cc.log("父节点响应touchMove");
        },this);

    },

    cardSpriteCallBack:function(node,touch){
        cc.log("回调")
        // node.setPosition(0,0);
        var location = this.someCardBg.node.convertToNodeSpaceAR(touch.getLocation());
        cc.log(location.x,location.y);
        node.setPosition(location.x,location.y);
        node.parent = this.someCardBg.node;
        cc.tween(node).to(0.15,{position:cc.v2(0,0)}).start();
        

    },

    createCards:function(){
        
        
        for (let j = 0; j < 4; j++) {
            
            for(var i = 2 ; i <= 14 ; i++){

                let x = this.originBg.node.x;
                let y = this.originBg.node.y;
                cc.log(this.originBg.node.parent);
                
                var cardSprite = cc.instantiate(this.cardPrefab);
                var cardComponent = cardSprite.getComponent("cardSprite");
                // cardComponent.loadNodesSpriteFrame("poker/poker_front.png",cardSprite.getComponent(cc.Sprite));
                // cardComponent.loadNodesSpriteFrame("poker/poker_0_"+i+ ".png",cardComponent.num.getComponent(cc.Sprite));
                // cardComponent.loadNodesSpriteFrame("poker/poker_big_0.png",cardComponent.smallColor.getComponent(cc.Sprite));
                // cardComponent.loadNodesSpriteFrame("poker/poker_big_0.png",cardComponent.bigColor.getComponent(cc.Sprite));
                cardComponent.setRootNodeFile("poker/poker_front");
                cardComponent.setNumFile("poker/poker_"+j%2+"_"+i);
                cardComponent.setSmallFile("poker/poker_big_"+j);
                this.node.addChild(cardSprite);
               
                cardComponent.numValue = i === 14 ? 1 : i;
                cardComponent.colorValue = j;
                
                cardSprite.setPosition(x,y);
                cardSprite.zIndex = 10;
                // cardSprite.scaleX = 1;
                
                cardComponent.flipStatus = flipStatusInit;
                
                this.allCards.push(cardSprite);
            }

        }
        


    },

    findOutRowLineLastSpriteCard:function(cardSpriteNode){
        var outNode = null;
        for (let i = 0; i < this.node.children.length; i++) {
            const node = this.node.children[i];
            if (node.name === "cardSprite") {
                if (cardSpriteNode.line === node.line && cardSpriteNode.row < node.row) {
                    outNode = node;
                }
            }
            
        }
        return outNode;
    },

    flipNewCard:function (line) {
        if (line == undefined) {
            return;
        }
        var name = "playingCardsBg"+line;
        var playingNode = cc.find(name,this.node);
        var node = playingNode.children.slice(-1)[0];
        if (node) {
            var com = node.getComponent("cardSprite");
            if (com.flipStatus === flipStatusInit) {
                node.scaleY = 0;
                node.scaleX = -1;
                cc.tween(node).to(0.1,{scaleY:1}).start();
                com.flipStatus = flipStatusPlaying;
            }
        }


    },

    fallDown:function (dragingNodes,playingNode,currentPosition,toLine) {
        var childNode = this.findOutCardSpriteFromParent(playingNode);

        var comLast = childNode.getComponent("cardSprite");
        var rowTop = childNode ? childNode.row : 0;
        var toOriPosition = comLast ? childNode.position : cc.v2(0,0);
        var toOriPositionDeltY = comLast ? 30 : 0;
        var oriLine = dragingNodes[0].line;
        for (let m = 0; m < dragingNodes.length; m++){
            var node = dragingNodes[m];
            var toPoint = cc.v2(toOriPosition.x,toOriPosition.y - toOriPositionDeltY - m*30);

            var worldPoint = node.parent.convertToWorldSpaceAR(node.position);
            node.position = playingNode.convertToNodeSpaceAR(worldPoint);

            
            node.parent = playingNode;
        
            node.row = rowTop + m + 1;
            node.line = toLine;

            cc.tween(node).to(0.15,{position:cc.v2(toPoint)})
            .call((n)=>{
                
                if (n.getComponent("cardSprite").flipStatus === flipStatusHolder) {
                    // this.allHolderCards.pop();为什么pop()方法有时候不会删除最有一个元素呢？
                    this.allHolderCards.splice(this.allHolderCards.length - 1,1);//删除最有一个元素
                    n.getComponent("cardSprite").flipStatus = flipStatusPlaying;

                    if (this.allHolderCards.length > 0) {
                        var width = this.someCardBg.node.width;
                        var left = this.someCardBg.node.x;
                        var top = this.someCardBg.node.y;
                        var height = this.someCardBg.node.height;
                        var gap = ( -width + 80*3)/2;
                        var i = 2;
                        var gapLet = n.width - gap;
                        var maxIndex = Math.max(3,this.allHolderCards.length);
                        for (let j = this.allHolderCards.length - 1; j > maxIndex - 3; j--) {
                            const holderNode = this.allHolderCards[j];
                            var t = cc.tween;
                            t(holderNode).to(0.2,{position:cc.v2(left - gap + i*gap,top)}).start();
                            i--;
                        }
                    }


                }
                

            })
            .start();

            
        }
        
        
    },

    tryToFindTerminalToFallDown:function (dragingNodes,currentPosition) {
        if (draingNodes.length == 0) {
            return;
        }
        var firstDragingNode = dragingNodes[0];
        let line = firstDragingNode.line;
        var  isfoundTernimal = this.findTerminalToFallDown(dragingNodes,currentPosition);
        if(!isfoundTernimal){
            if (!this.findScoringPlaceToFallDown(dragingNodes,currentPosition)) {
                this.fallBackOriginPosition(dragingNodes);
                return;
            }
        }
        this.flipNewCard(line);
    },

    tryToAutoFindTerminalToFallDown:function (dragingNodes) {
        if (dragingNodes.length == 0) {
            return;
        }
        var firstDragingNode = dragingNodes[0];
        let line = firstDragingNode.line;
        var  isfoundTernimal = this.findAutoTerminalToFallDown(dragingNodes);
        if(!isfoundTernimal){
            if (!this.findScoringPlaceToFallDown(dragingNodes)) {
                this.fallBackOriginPosition(dragingNodes);
                return;
            }
        }
        this.flipNewCard(line);
    },

    // 移动失败返回原位
    fallBackOriginPosition:function(dragingNodes){
        
        var firstDragingNode = dragingNodes[0];
        let x = firstDragingNode.x;
        let y = firstDragingNode.y;
        if (firstDragingNode) {
            cc.tween(firstDragingNode)
            
            .repeat(3,
                    cc.tween()
                    .to(0.03,{position:cc.v2(x-10,y)})
                    .to(0.06,{position:cc.v2(x+10,y)})
                    .to(0.03,{position:cc.v2(x,y)})
                )
            .call(()=>{
                for (let i = 0; i < dragingNodes.length; i++) {
                    const dragingNode = dragingNodes[i];
                    dragingNode.getComponent("cardSprite").backToPrePosition();
                    
                }
            }

            )
            .start();

        }

        
    },

    moveToPositionOverMainBg:function(fromNode,toNode){
        var fromNodePosition = fromNode.position;
        var fromWorldPosition = fromNode.parent.convertToWorldSpaceAR(fromNodePosition);


        var toNodePosition = toNode.position;
        var toWorldPosition = toNode.parent.convertToWorldSpaceAR(toNodePosition);

        fromNode.parent = this.node;
        fromNode.position = this.node.convertToNodeSpaceAR(fromWorldPosition);

        cc.tween(fromNode)
        .to(0.2,{position:this.node.convertToNodeSpaceAR(toWorldPosition)})
        .call((n)=>{
            n.parent = toNode;
            n.position = cc.v2(0,0);
        })
        .start();


    },

    findScoringPlaceToFallDown:function (dragingNodes,currentPosition) {
        if (dragingNodes.length != 1) {
            return false; //只支持落一个
        }

        var firstDragingNode = dragingNodes[0];
        var component = firstDragingNode.getComponent("cardSprite");

        if (component.numValue === 1) {
            for (let i = 0; i < 4; i++) {
                var scoreBgNode = cc.find("cardScoreBg"+i,this.node);

                if (scoreBgNode.children.length <= 1) {
                    component.flipStatus = flipStatusScoring;
                    this.moveToPositionOverMainBg(firstDragingNode,scoreBgNode);

                    return true;
                }

            }
        }


        for (let i = 0; i < 4; i++) {
            var scoreBgNode = cc.find("cardScoreBg"+i,this.node);
            var topCardNode = scoreBgNode.children.slice(-1)[0];
            if (topCardNode && topCardNode.name === "cardSprite") {
                var topComponent = topCardNode.getComponent("cardSprite");
                if (component.colorValue === topComponent.colorValue) {
                    if (component.numValue - topComponent.numValue === 1) {
                        
                        var toNodePosition = topCardNode.position;
                        var toWorldPosition = topCardNode.parent.convertToWorldSpaceAR(toNodePosition);

                        this.moveToPositionOverMainBg(firstDragingNode,scoreBgNode);

                        return true;

                    }
                }


            }
            
        }



        return false;
    },

    findTerminalToFallDown:function(dragingNodes,currentPosition) {
        let firstDraingNode = dragingNodes[0];
        for (let i = 0; i < 7; i++) {
            var name = "playingCardsBg"+i;
            var playingNode = cc.find(name,this.node);
            var rect = new cc.Rect(playingNode.x - playingNode.width/2,playingNode.y,playingNode.width,playingNode.height);
            if (Math.abs(playingNode.x - currentPosition.x) <= playingNode.width/2+15) {
                var compOri = firstDraingNode.getComponent("cardSprite");

                var childNode = this.findOutCardSpriteFromParent(playingNode);

                var comLast = childNode.getComponent("cardSprite");

                if (comLast.numValue - compOri.numValue === 1 && 
                    comLast.colorValue%2 != compOri.colorValue%2) {

                    this.fallDown(dragingNodes,playingNode,currentPosition,i);
                    
                    return true;
                    
                }else{

                    return false;
                    
                }

                
            }else{
                return false;
            }
            
        }

        return false;
    },
    
    findAutoTerminalToFallDown:function(dragingNodes){
        let firstDraingNode = dragingNodes[0];
        var compOri = firstDraingNode.getComponent("cardSprite");
        for (let i = 0; i < 7; i++) {
            var name = "playingCardsBg"+i;
            var playingNode = cc.find(name,this.node);
            var rect = new cc.Rect(playingNode.x - playingNode.width/2,playingNode.y,playingNode.width,playingNode.height);

            var lastNode = playingNode.children.slice(-1)[0];
            
            if (!lastNode && compOri.numValue == 13) {
                this.fallDown(dragingNodes,playingNode,firstDraingNode.position,i);
                return true;
            }else if (lastNode) {
                var comLast = lastNode.getComponent("cardSprite");
                if (lastNode && comLast.flipStatus === flipStatusPlaying) {
                    if (comLast.numValue - compOri.numValue === 1 && 
                        comLast.colorValue%2 != compOri.colorValue%2) {

                        this.fallDown(dragingNodes,playingNode,lastNode.position,i);
                        return true;
                    }else{
                    }
                }else{
                }
            }
            


            
        }
        return false;
        // // 移动失败返回原位
        // for (let i = 0; i < dragingNodes.length; i++) {
        //     const dragingNode = dragingNodes[i];
        //     dragingNode.getComponent("cardSprite").backToPrePosition();
            
        // }
    },


    startTimer:function(){
        var count = 60*5;
        this.schedule(function(){
            cc.log(count);
            let string = Math.floor(count / 60) +":"+ this.addZero(count%60);
            this.timerNode.getComponent(cc.Label).string = string;
            this.playTimeLeftAnimation(count);
            count --;
        },1,count,0);
    },

    playTimeLeftAnimation:function(count){
        var file = "";
        if (count == 300) {
            file = "game/com_timer_"+count;
        }else if (count == 240) {
            file = "game/com_timer_"+count;
        }else if (count == 180) {
            file = "game/com_timer_"+count;
        }else if (count == 120) {
            file = "game/com_timer_"+count;
        }else{
            return;
        }

        var self = this;
        cc.loader.loadRes(file,cc.SpriteFrame,function(err,spriteFrame){
            cc.log(err,spriteFrame);
            if(!err){
                self.timerLeftNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });
        var animtion = this.timerLeftNode.getComponent(cc.Animation);
        animtion.play();
    },

    addZero:function(count){
        if (count < 10) {
            return "0"+count;
        }
        return count;
    },


    start () {
        this.startGame();
        this.startTimer();
        // this.testPostsion();
    },

    testPostsion:function () {
        var cardSprite = cc.instantiate(this.cardPrefab);
        var cardComponent = cardSprite.getComponent("cardSprite");
        cardComponent.setRootNodeFile("poker/poker_front");
        cardComponent.setNumFile("poker/poker_0_2");
        cardComponent.setSmallFile("poker/poker_big_0");
        this.node.addChild(cardSprite);
        
        cardSprite.setPosition(100,100);

        // var c2 = cc.instantiate(cardSprite);
        // c2.setPosition(-100,-100);
        var cardSprite1 = cc.instantiate(this.cardPrefab);
        var cardComponent1 = cardSprite1.getComponent("cardSprite");
        cardComponent1.setRootNodeFile("poker/poker_front");
        cardComponent1.setNumFile("poker/poker_0_2");
        cardComponent1.setSmallFile("poker/poker_big_0");
        this.node.addChild(cardSprite1);
        
        cardSprite1.setPosition(-100,-100);

        var worldP = this.node.convertToWorldSpaceAR(cardSprite.position);
        var p = cardSprite1.convertToNodeSpaceAR(worldP);
        cardSprite.parent = cardSprite1;
        cardSprite.position = p;
        cc.log("worldP =",worldP.x,worldP.y);
        cc.log(p.x,p.y);
    },
    

    // update (dt) {},
});
