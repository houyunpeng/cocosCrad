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


cc.Class({
    extends: cc.Component,

    properties: {
        cardSpriteFrame:{
            default:[],
            type:[cc.SpriteFrame]
        },
        cardPrefab:{
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
        cc.log(Config.Global.cardItemSize);
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
                        n.setSiblingIndex(-1);
                        // var p = node.parent;
                        // node.removeFromParent();
                        // p.addChild(node);
                    })
                    .parallel(
                        t().to(0.1, { skewY:0,scaleX:-1, }),
                        t().to(0.1, { position: cc.v2(left - gap + gap*i,top) })
                    )
                    .call(()=>{
                        cc.log("第4秒执行完毕");
                        
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
                    n.setSiblingIndex(-1);
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
                cc.tween(sprite)
                .delay(0.1*index)
                // .to(0.2,{position:cc.v2(playingCardNode.position.x,playingCardNode.position.y-2*row)})
                .to(0.05,{position:cc.v2(0,-5*row)})
                .call((n)=>{
                    if (line == row) {
                        // n.getComponent("cardSprite").flipVertor();
                        n.scaleY = 0;
                        n.scaleX = -1;
                        cc.tween(n).to(0.1,{scaleY:1}).start();
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
               
                
                cardSprite.setPosition(x,y);
                cardSprite.zIndex = 10;
                // cardSprite.scaleX = 1;
                
                
                this.allCards.push(cardSprite);
            }

        }
        


    },

    findTerminalToFallDown:function(node,currentPosition) {
        
        for (let i = 0; i < 7; i++) {
            var name = "playingCardsBg"+i;
            var playingNode = cc.find(name,this.node);
            var rect = new cc.Rect(playingNode.x - playingNode.width/2,playingNode.y,playingNode.width,playingNode.height);
            if (Math.abs(playingNode.x - currentPosition.x + 10) <= playingNode.width/2) {
                var childNode = this.findOutCardSpriteFromParent(playingNode);
                var toPoint = cc.v2(childNode.x,childNode.y - 10);
                var worldPoint = this.node.convertToWorldSpaceAR(currentPosition);
                node.position = playingNode.convertToNodeSpaceAR(worldPoint);
                node.parent = playingNode;
                
                cc.tween(node).to(0.15,{position:cc.v2(toPoint)}).start();
            }
            
        }


    },






    start () {
        this.startGame();
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
