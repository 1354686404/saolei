
function my$(id) {
    return document.getElementById(id);
}

var startBtn = my$('btn');
var grade = my$('grade');
var easy = my$('easy');
var common = my$('common');
var difficult = my$('difficult');
var box = my$('box');
var flagBox = my$('flagBox');
var alertBox = my$('alertBox');
var alertImg = my$('alertImg');
var closeBtn = my$('close');
var score = my$('score');
var leiNum;
var minesNum;
var mineOver;
var block;  //一百个小个子的类
var mineMap = [];   //用于判断格子是否是地雷
var flagNum = 0;    //总共插了多少旗
var startGame = true;


bindEvent();

function bindEvent() {
    startBtn.onclick = function() {
        if(startGame) {
            grade.style.display = 'block';
            
            // 判断选择的难度
            easy.onclick = function() {
                grade.style.display = 'none';
                leiNum = 10;
                flagBox.style.display = 'block';
                box.style.display = 'block';
                init(leiNum);
                startGame = false;
            }
            common.onclick = function() {
                grade.style.display = 'none';
                leiNum = 15;
                flagBox.style.display = 'block';
                box.style.display = 'block';
                init(leiNum);
                startGame = false;
            }
            difficult.onclick = function() {
                grade.style.display = 'none';
                leiNum = 20;
                flagBox.style.display = 'block';
                box.style.display = 'block';
                init(leiNum);
                startGame = false;
            }
        }  
    }
    //取消在游戏区域的鼠标右键点击事件
    box.oncontextmenu = function() {
        return false;
    }
    //判断鼠标左键还是右键点击格子
    box.onmousedown = function(e) {
        var event = e.target;
        if(e.which == 1) {
            leftClick(event);
        } else if(e.which == 3) {
            rightClick(event);
        }
    }
    closeBtn.onclick = function() {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        startGame = true;
    }
}


//生成一百个小格
function init(leiNum) {
    minesNum = leiNum;
    mineOver = leiNum;
    score.innerHTML = mineOver;
    for(var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id', i+'-'+j);
            box.appendChild(con);
            mineMap.push({mine:0});
        }
    }
    block = document.getElementsByClassName('block');

    //随机生成相应难度个数的地雷
    while(minesNum) {
        var mineIndex = Math.floor(Math.random()*100);
        if(!block[mineIndex].classList.contains('isLei')) {
            //在控制台输出地雷位置
            var x = Math.floor(mineIndex / 10) + 1;
            var y = mineIndex % 10 + 1;
            console.log(x + '-' + y);
            block[mineIndex].classList.add('isLei');
            minesNum--;
        }
    }
}

function leftClick(dom) {
    if(dom.classList.contains('flag')) {
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if(dom && dom.classList.contains('isLei')) {
        // console.log('GameOver');
        for(var i=0; i<isLei.length; i++) {
            isLei[i].classList.add('show');
        }
        setTimeout(function() {
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url("./over.jpg")';
            alertImg.style.height = '380px';
        }, 800);
    } else {
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');
        for(var i=posX-1; i<=posX+1; i++) {
            for(var j=posY-1; j<=posY+1; j++) {
                var aroundBox = my$(i + '-' + j);
                if(aroundBox && aroundBox.classList.contains('isLei')) {
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if(n == 0) {
            for(var i=posX-1; i<=posX+1; i++) {
                for(var j=posY-1; j<=posY+1; j++) {
                    var nearBox = my$(i + '-' + j);
                    if(nearBox && nearBox.length!=0) {
                        if(!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox);
                        }
                    }
                }
            }
        }
    }
}

function rightClick(dom) {
    console.log(leiNum);
    if(dom.classList.contains('num')) {
        return;
    }
    dom.classList.toggle('flag');
    
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')) {
        mineOver--;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
        mineOver++;
    }
    if(dom.classList.contains('flag')) {
        flagNum++;
    } else {
        flagNum--;
    }
    score.innerHTML = mineOver;
    if(mineOver==0 && flagNum==leiNum) {
        console.log("winner");
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("./success.png")';
    }
    console.log(flagNum);
}

