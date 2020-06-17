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
        scoreLabelNode:{
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
        increaseScorePrefab:{
            default:null,
            type:cc.Prefab
        },
        pausePrefab:{
            default:null,
            type:cc.Prefab
        },
        endGamePrefab:{
            default:null,
            type:cc.Prefab
        },
        settingEffectPrefab:{
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
        },
        bottomFunctionNode:{
            default:null,
            type:cc.Node
        },
        doubleFaildEffectAudio: {
            default: null,
            type: cc.AudioClip
        },
        clickEffectAudio: {
            default: null,
            type: cc.AudioClip
        },
        bgmAudio: {
            default: null,
            type: cc.AudioClip
        },
        fapaiAudio: {
            default: null,
            type: cc.AudioClip
        },
        fanpaiEffectAudio: {
            default: null,
            type: cc.AudioClip
        },
        moveEffectAudio:{
            default:null,
            type:cc.AudioClip
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

        this.pauseSprite = this.pauseSprite ? this.pauseSprite : cc.instantiate(this.pausePrefab);
        this.pauseSprite.parent = this.node.parent;
        this.pauseSprite.setSiblingIndex = -1;
        var pauseScript = this.pauseSprite.getComponent("pauseScript");
        var animation = this.pauseSprite.getComponent(cc.Animation);
        animation.play();

        this.pauseOrResume(true);

        this.clickEffectAudio_current = cc.audioEngine.playEffect(this.clickEffectAudio);
    },
    soundBtnAction:function(){
        this.settingEffectNode = this.settingEffectNode ? this.settingEffectNode : cc.instantiate(this.settingEffectPrefab);
        this.settingEffectNode.parent = this.node.parent;        
        this.settingEffectNode.opacity = 255;
        cc.log(this.someCardBg.node.width);
        this.clickEffectAudio_current = cc.audioEngine.playEffect(this.clickEffectAudio);
    },
    askBtnAction:function(){
        cc.log("allcards=",this.allCards);
        this.clickEffectAudio_current = cc.audioEngine.playEffect(this.clickEffectAudio);
    },
    undoBtnAction:function(){
        cc.log("撤销");
        // if(this.undoTween){
        //     this.undoTween.clone(this.undoNode).reverseTime().start();
        //     // this.undoTween = null;
        // }

        this.clickEffectAudio_current = cc.audioEngine.playEffect(this.clickEffectAudio);
    },
    indecatorBtnAction:function(){
        cc.log("indecatorBtn");
        this.clickEffectAudio_current = cc.audioEngine.playEffect(this.clickEffectAudio);
    },

    moveTopHolderCardToLeftWithNum:function (num) {
        var width = this.someCardBg.node.width;
        var left = this.someCardBg.node.x;
        var top = this.someCardBg.node.y;
        var gap = ( -width + 80*3)/2;
        if(num > 3) {
            return;
        }
        
        for (let j = 0; j < this.allHolderCards.length; j++) {
            const holderNode = this.allHolderCards[j];
            var t = cc.tween;
            t(holderNode).to(0.2,{position:cc.v2(left - gap,top)}).start();
        }
    },

    resreshBtnAction:function () {
      cc.log("重新翻牌");  
        var width = this.someCardBg.node.width;
        var left = this.someCardBg.node.x;
        var top = this.someCardBg.node.y;
        var height = this.someCardBg.node.height;
        var gap = ( -width + 80*3)/2;

        

        if (this.allCards.length > 0) {
            
            this.moveTopHolderCardToLeftWithNum(Math.min(this.allCards.length,3));

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
                    this.allHolderCards.push(node);
                }
                
                
                

                
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

    testRandData:function(){
        this.data = [25, 17, 19, 7, 1, 18, 0, 34, 40, 43, 31, 5, 39, 9, 26, 15, 22, 29, 35, 45, 4, 32, 2, 44, 33, 3, 20, 27, 11, 49, 21, 36, 51, 28, 46, 6, 47, 13, 37, 12, 41, 23, 48, 30, 14, 38, 24, 50, 10, 42, 8, 16];
        return;

        var a = [];
        for (let i = 0; i < 52; i++) {
            a.push(i);
        }

        this.data = [];
        while (a.length > 0) {
            var rand = Math.floor(Math.random()*100 % a.length);
            this.data.push(a[rand]);
            a.splice(rand,1);
        }


    },

    onLoad () {
        cc.log("on load");
        // this.seed = parseInt('E1E3CAE2ED4D244C',16);
        // for (let i = 0; i < 99; i++) {
        //     cc.log(this.randRange(1,99));
            
        // }
        this.testRandData();
        this.createCards();
    },

    startGame:function () {
      cc.log("start game");
        var row  = 0;
        var line = 0;

        var index = 0;

        this.fapaiAudio_current = cc.audioEngine.playMusic(this.fapaiAudio,true,1);
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

                        if (this.flipedCardsCount == undefined) {
                            this.flipedCardsCount = 0;
                        }
                        this.flipedCardsCount ++;

                    }
                    
                    cc.audioEngine.stop(this.fapaiAudio_current);

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
        
        var index = 0;
        for (let j = 0; j < 4; j++) {
            
            for(var i = 2 ; i <= 14 ; i++){

                let x = this.originBg.node.x;
                let y = this.originBg.node.y;
                cc.log(this.originBg.node.parent);
                
                var cardSprite = cc.instantiate(this.cardPrefab);
                var cardComponent = cardSprite.getComponent("cardSprite");
                
                var value = this.data[index];
                var num = value % 13 + 2;
                var colorNum = Math.floor(value / 13);

                index++;
                cardComponent.setRootNodeFile("poker/poker_front");
                cardComponent.setNumFile("poker/poker_"+colorNum%2+"_"+num);
                cardComponent.setSmallFile("poker/poker_big_"+colorNum);
                this.node.addChild(cardSprite);
               
                cardComponent.numValue = num === 14 ? 1 : num;
                cardComponent.colorValue = colorNum;
                
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

        var rowTop = childNode ? (childNode.row >= 0?childNode.row:-1) : 0;//坑啊

        var toOriPosition = comLast ? childNode.position : cc.v2(0,0);
        var toOriPositionDeltY = comLast ? 30 : 0;
        var oriLine = dragingNodes[0].line;
        for (let m = 0; m < dragingNodes.length; m++){
            var node = dragingNodes[m];
            var toPoint = cc.v2(toOriPosition.x,toOriPosition.y - toOriPositionDeltY - m*30);

            var worldPoint = node.parent.convertToWorldSpaceAR(node.position);
            var bg_position_ori = this.node.convertToNodeSpaceAR(worldPoint);

            //如果是老K  childNode 其实就是playingNode
            var toWorldPosi = (childNode != playingNode) ? childNode.parent.convertToWorldSpaceAR(toPoint):playingNode.parent.convertToWorldSpaceAR(playingNode.position);
            var bg_position_to = this.node.convertToNodeSpaceAR(toWorldPosi);
            // node.position = playingNode.convertToNodeSpaceAR(worldPoint);
            
            if (node.parent != this.node) {
                node.position = bg_position_ori;
                node.parent = this.node;
            }
            
        
            node.row = rowTop + m + 1;
            node.line = toLine;
            node.c_posi = toPoint;

            if (node.getComponent("cardSprite").flipStatus === flipStatusHolder) {
                this.allHolderCards.pop();
            }
            cc.tween(node).to(0.15,{position:cc.v2(bg_position_to)})
            .call((n)=>{
                n.parent = playingNode;
                n.position = n.c_posi;
                if (n.getComponent("cardSprite").flipStatus === flipStatusHolder) {
                    // this.allHolderCards.pop();//为什么pop()方法有时候不会删除最有一个元素呢？
                    // this.allHolderCards.splice(this.allHolderCards.length - 1,1);//删除最有一个元素
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
            // tween(node).start();
            
            // this.undoTween = tween;
            // this.undoNode = node;

            this.moveEffectAudio_current = cc.audioEngine.playEffect(this.moveEffectAudio);
        }
        
        
    },

    tryToFindTerminalToFallDown:function (dragingNodes,currentPosition) {
        if (dragingNodes.length == 0) {
            return;
        }
        var firstDragingNode = dragingNodes[0];
        let line = firstDragingNode.line;
        var  isfoundTernimal = this.findScoringPlaceToFallDown(dragingNodes);
        if(!isfoundTernimal){
            if (!this.findTerminalToFallDown(dragingNodes,currentPosition)) {
                this.fallBackOriginPosition(dragingNodes);
                cc.audioEngine.play(this.doubleFaildEffectAudio, false, 1);
                return;
            }else{
                this.playGetScoreAnimation(dragingNodes[0],20);
                this.flipNewCard(line);
            }
        }else{
            if (this.allCards.length == 0 && this.allHolderCards.length == 0) {
            
                this.runClearAllCardsAction();
            }

            this.playGetScoreAnimation(dragingNodes[0],20);
            this.flipNewCard(line);
        }
        
    },

    tryToAutoFindTerminalToFallDown:function (dragingNodes) {
        if (dragingNodes.length == 0) {
            return;
        }
        var firstDragingNode = dragingNodes[0];
        let line = firstDragingNode.line;
        var  isfoundTernimal = this.findScoringPlaceToFallDown(dragingNodes);
        if(!isfoundTernimal){
            if (!this.findAutoTerminalToFallDown(dragingNodes)) {
                this.fallBackOriginPosition(dragingNodes);
                cc.audioEngine.play(this.doubleFaildEffectAudio, false, 1);
                return;
            }else{
                this.playGetScoreAnimation(dragingNodes[0],20);
                this.flipNewCard(line);
            }
        }else{
            if (this.allCards.length == 0 && this.allHolderCards.length == 0) {
            
                this.runClearAllCardsAction();
            }
            

            this.playGetScoreAnimation(dragingNodes[0],20);
            this.flipNewCard(line);
        }
        
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

    findScoringPlaceToFallDown:function (dragingNodes) {
        if (dragingNodes.length != 1) {
            return false; //只支持落一个
        }

        var firstDragingNode = dragingNodes[0];
        var component = firstDragingNode.getComponent("cardSprite");

        

        if (component.numValue === 1) {
            for (let i = 0; i < 4; i++) {
                var scoreBgNode = cc.find("cardScoreBg"+i,this.node);

                if (scoreBgNode.children.length <= 1) {
                    if (component.flipStatus == flipStatusHolder) {
                        this.allHolderCards.pop();
                    }
                    component.flipStatus = flipStatusScoring;
                    this.moveToPositionOverMainBg(firstDragingNode,scoreBgNode);
                    this.playGetScoreAnimation(firstDragingNode,100);
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
                        if (component.flipStatus == flipStatusHolder) {
                            this.allHolderCards.pop();
                        }
                        var toNodePosition = topCardNode.position;
                        var toWorldPosition = topCardNode.parent.convertToWorldSpaceAR(toNodePosition);

                        this.moveToPositionOverMainBg(firstDragingNode,scoreBgNode);

                        this.playGetScoreAnimation(firstDragingNode,20);

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

    runClearAllCardsAction:function(){


        

        for (let i = 0; i < 7; i++) {
            var name = "playingCardsBg"+i;
            let playingCardNode = cc.find("playingCardsBg"+i,this.node);
            if(playingCardNode.children.length > 0){
                var findNode = playingCardNode.children.slice(-1)[0];
                if(this.findScoringPlaceToFallDown([findNode])){
                    var self = this;
                    this.scheduleOnce(function () {
                        self.runClearAllCardsAction();
                    },0.2);
                    return;
                };
            }
            
        }

        this.endGameToCommitScore();

    },

    endGameToCommitScore:function () {

        var endGameNode = cc.instantiate(this.endGamePrefab);
        endGameNode.parent = this.node;
        endGameNode.setSiblingIndex = -1;  
    },

    playGetScoreAnimation:function(node,score){
        var increaseScoreNode = cc.instantiate(this.increaseScorePrefab);
        
        var fromNodePosition = node.position;
        var fromWorldPosition = node.parent.convertToWorldSpaceAR(fromNodePosition);
        var oriPosi = this.node.convertToNodeSpaceAR(fromWorldPosition);

        increaseScoreNode.parent = this.node;
        increaseScoreNode.position = oriPosi;
        increaseScoreNode.opacity = 0;
        increaseScoreNode.scale = 1.3;
        var toNodeWorldPosition = this.scoreLabelNode.convertToWorldSpaceAR(cc.v2(0,0));
        var toNodePosition = this.node.convertToNodeSpaceAR(toNodeWorldPosition);
        increaseScoreNode.getComponent(cc.Label).string = "+"+score;
        var t = cc.tween;
        t(increaseScoreNode)
        .parallel(
            t().to(1,{position:cc.v2(toNodePosition.x+80,toNodePosition.y), easing: cc.easeOut}),
            t().to(1,{opacity:255, easing: cc.easeOut}),
            t().to(1,{scale:1, easing: cc.easeOut})

        )
        .to(0.5,{position:cc.v2(toNodePosition.x,toNodePosition.y),opacity:0,scaleX:1,scaleY:1})
        .call((n)=>function(){
            n.parent = null;
        }
            
        )
        .start();
        var comLabel = this.scoreLabelNode.getComponent(cc.Label);
        var currentScore = parseInt(comLabel.string);
        
        comLabel.string = String(currentScore);
        var obj = { a: currentScore };
        currentScore += score;
        cc.tween(obj).
        to(1, { a: currentScore}, {
            progress:(start, end, current, ratio)=>{
                var value = start + (end - start) * ratio;
                let num = Math.round(value);
                comLabel.string = String(num);
                return value;
        }})
        .start();
        // cc.tween(comLabel)
        // .to(0.4,{string:currentScore})
        // .call((n)=>{
        //     // n.string = currentScore;
        // })
        // .start();
        

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

        this.count = 60*5;
        this.startTimer();

        // var c = 0;
        // var seed = 21;//parseInt('E1E3CAE2ED4D244C',16);
        // while (c < 110) {
        //     c ++;
        //     // seed = (seed * 17 + 49297) % 2332801;
        //     seed = (seed * 5 + 1) % 52;
            
        //     cc.log("随机数====",seed);
        // }

        this.scheduleOnce(function () {
            this.bgmAudio_current = cc.audioEngine.playMusic(this.bgmAudio,true,1);
        
            // this.fapaiAudio_current = cc.audioEngine.playMusic(this.fapaiAudio,true,1);
        },0.1);
        cc.log("");
        // this.testPostsion();
    },

    startTimer:function(){
        this.schedule(this.timerAction,1,this.count,0);
    },
    timerAction:function(){
        cc.log(this.count);
        let string = Math.floor(this.count / 60) +":"+ this.addZero(this.count%60);
        this.timerNode.getComponent(cc.Label).string = string;
        this.playTimeLeftAnimation(this.count);
        this.count --;
    },
    pauseOrResume:function(isPause){
        if(isPause){
            this.unschedule(this.timerAction);


            this.bottomFunctionNode.opacity = 0;
            cc.audioEngine.pauseMusic(this.bgmAudio_current);
        }else{
            this.startTimer();

            this.bottomFunctionNode.opacity = 255;

            cc.audioEngine.resumeMusic(this.bgmAudio_current);
        }
    },


    setVolume:function (value) {
        cc.audioEngine.setVolume(this.bgmAudio_current, value);
    },


     /**
     * 获取随机数
     * @param  {[type]} min      下限
     * @param  {[type]} max      上限
     * @return {[type]}            [description]
     */
    randRange: function(min, max) {
        var seed = this.seed;
        if (seed == 0) {
            console.error("随机种子为0");
            return 0;
        }

        seed = (seed * 17 + 49297) % 2332801;
        var rd = seed / 2332801.0;
        this.seed = seed;
        this.times = this.times + 1;

        return Math.floor(rd * (max - min + 1)) + min;
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
