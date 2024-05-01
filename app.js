// @ts-check

const displayWidth = 320;
const displayHeight = 480;

let cleared = false;

let messageOnBattle = '';
let message = '';

let noBGM = false;
let showCommandButtons = false;

const SCENE_BLACK_OUT = -1;
const SCENE_MY_CASTLE = 1;
const SCENE_FIELD = 2;
const SCENE_ENEMY_CASTLE = 3;
const SCENE_ZAKO_BATTLE = 4;
const SCENE_BOSS_BATTLE = 5;

let scene = SCENE_MY_CASTLE;

// 雑魚敵出現確率
let appearanceRate = 0.01;

const blockSize = 32;

let playerImage = new Image(blockSize, blockSize);
playerImage.src = './image/player.png';

let kingImage = new Image(blockSize, blockSize);
kingImage.src = './image/king.png';

let floorImage = new Image(blockSize, blockSize);
floorImage.src = './image/floor.png';

let bridgeImage = new Image(blockSize, blockSize);
bridgeImage.src = './image/bridge.png';

let castle1Image = new Image(blockSize * 3, blockSize * 3);
castle1Image.src = './image/castle1.png';

let castle2Image = new Image(blockSize * 3, blockSize * 3);
castle2Image.src = './image/castle2.png';

let mountainImage = new Image(blockSize * 2, blockSize * 2);
mountainImage.src = './image/mountain.png';

let devilImage = new Image(blockSize, blockSize);
devilImage.src = './image/devil.png';

let flatImage = new Image(blockSize, blockSize);
flatImage.src = './image/flat.png';

let wallImage = new Image(blockSize, blockSize);
wallImage.src = './image/wall.png';

let stairsImage = new Image(blockSize, blockSize);
stairsImage.src = './image/stairs.png';

let enemyImage = new Image(blockSize, blockSize);
enemyImage.src = './image/enemy1.png';

let bossWidth = 426;
let bossHeight = 261;
let bossImage = new Image(bossWidth, bossHeight);
bossImage.src = './image/boss.png';

/** @type {HTMLCanvasElement} */
// @ts-ignore
let can = document.getElementById('canvas');
can.width = displayWidth;
can.height = displayHeight;

/** @type {CanvasRenderingContext2D | null | undefined} */
let ctx = can.getContext('2d');

let mapFieldText = "" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～ＭＭＭＭＭＭ～～～～～～～～～～\n" +
    "～～～～～～ＭＭＭＭＭＭ・～～～～～～～～ＭＭＭ・・・・・ＭＭＭＭ～～～～～～～\n" +
    "～～～～～ＭＭＭＭ・・・・～～～～～～～～・・・・　　　　ＭＭＭＭ～～～～～～～\n" +
    "～～～～ＭＭＭＭＭ・　　　橋橋橋橋橋橋橋橋　　　　　　　　ＭＭＭＭＭ～～～～～～\n" +
    "～～～ＭＭＭＭＭ・・　　Ｍ～～～～～～～～ＭＭＭＭ・　　　ＭＭＭＭＭＭ～～～～～\n" +
    "～～～ＭＭＭＭ・・　　　Ｍ～～～～～～～～ＭＭＭＭ・　　　・ＭＭＭＭＭＭ～～～～\n" +
    "～～～ＭＭＭＭ・　　　　Ｍ～～～～～～～ＭＭＭＭＭＭ・　　　ＭＭＭＭＭＭＭ～～～\n" +
    "～～～ＭＭ・・・　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ・　　　ＭＭＭＭＭＭＭ～～～\n" +
    "～～～ＭＭ・　　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ・　　　ＭＭＭＭＭＭＭ～～～\n" +
    "～～～ＭＭ・　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ・・・　　　ＭＭＭＭＭＭＭ～～～\n" +
    "～～～ＭＭ・　　ＭＭＭＭＭＭＭＭＭＭＭＭＭ・・・・　　　　ＭＭＭＭＭＭＭＭ～～～\n" +
    "～～～ＭＭ・　　ＭＭＭＭＭＭＭＭＭＭＭＭ・　　　　　　　　ＭＭＭＭＭＭＭＭ～～～\n" +
    "～～～ＭＭ・　　ＭＭＭＭＭＭＭ・・・・Ｍ・　　　　　　　ＭＭＭＭＭＭＭＭ～～～～\n" +
    "～～～ＭＭ・　　ＭＭＭＭＭＭＭ・魔○○Ｍ・　　　ＭＭＭＭＭＭＭＭＭＭＭＭ～～～～\n" +
    "～～～ＭＭ・　　・Ｍ・・・・Ｍ・○○○Ｍ・　　　・・ＭＭＭＭＭＭＭＭＭ～～～～～\n" +
    "～～～ＭＭ・　　　Ｍ・城○○Ｍ・○○○Ｍ・　　　　　ＭＭＭＭＭＭＭＭＭ～～～～～\n" +
    "～～～ＭＭ・　　　Ｍ・○○○ＭＭ・　　Ｍ・　　　　　ＭＭＭＭＭＭＭＭ～～～～～～\n" +
    "～～～ＭＭ・　　　Ｍ・○○○ＭＭ・　　ＭＭＭ・　　ＭＭＭＭＭＭＭＭ～～～～～～～\n" +
    "～～～ＭＭ・　　　Ｍ・　　　ＭＭ・　　・・・・　　ＭＭＭ山ＭＭＭ～～～～～～～～\n" +
    "～～～ＭＭ・　　　Ｍ・　　ＭＭＭ・　　　　　　　　ＭＭＭＭＭ～～～～～～～～～～\n" +
    "～～～ＭＭ・　　　・・　　ＭＭＭ・　　　　　　　　ＭＭＭＭ～～～～～～～～～～～\n" +
    "～～～ＭＭＭ・　　　　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～\n" +
    "～～～ＭＭＭ・　　　　　　ＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～\n" +
    "～～～ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～～\n" +
    "～～～～ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～～～\n" +
    "～～～～～ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～・・・・・・・・・・・・・・・・～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
    "～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～";

/*
let mapFieldText = "" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～ＭＭＭＭＭＭ～～～～～～～～～～\n" +
"～～～～～～ＭＭＭＭＭＭ・～～～～～～～～ＭＭＭ・・・・・ＭＭＭＭ～～～～～～～\n" +
"～～～～～ＭＭＭＭ・・・・～～～～～～～～・・・・　　　　ＭＭＭＭ～～～～～～～\n" +
"～～～～ＭＭＭＭＭ・　　　橋橋橋橋橋橋橋橋　　　　　　　　ＭＭＭＭＭ～～～～～～\n" +
"～～～ＭＭＭＭＭ・・　　Ｍ～～～～～～～～ＭＭＭＭ・　　　ＭＭＭＭＭＭ～～～～～\n" +
"～～～ＭＭＭＭ・・　　　Ｍ～～～～～～～～ＭＭＭＭ・　　　・ＭＭＭＭＭＭ～～～～\n" +
"～～～ＭＭＭＭ・　　　　Ｍ～～～～～～～ＭＭＭＭＭＭ・　　　ＭＭＭＭＭＭＭ～～～\n" +
"～～～ＭＭ・・・　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ・　　　ＭＭＭＭＭＭＭ～～～\n" +
"～～～ＭＭ・　　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ・　　　ＭＭＭＭＭＭＭ～～～\n" +
"～～～ＭＭ・　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ・・・　　　ＭＭＭＭＭＭＭ～～～\n" +
"～～～ＭＭ・　　ＭＭＭＭＭＭＭＭＭＭＭＭＭ・・・・　　　　ＭＭＭＭＭＭＭＭ～～～\n" +
"～～～ＭＭ・　　ＭＭＭＭＭＭＭＭＭＭＭＭ・　　　　　　　　ＭＭＭＭＭＭＭＭ～～～\n" +
"～～～ＭＭ・　　ＭＭＭＭＭＭＭ・・・・Ｍ・　　　　　　　ＭＭＭＭＭＭＭＭ～～～～\n" +
"～～～ＭＭ・　　ＭＭＭＭＭＭＭ・魔○○Ｍ・　　　ＭＭＭＭＭＭＭＭＭＭＭＭ～～～～\n" +
"～～～ＭＭ・　　・Ｍ・・・・Ｍ・○○○Ｍ・　　　・・ＭＭＭＭＭＭＭＭＭ～～～～～\n" +
"～～～ＭＭ・　　　Ｍ・城○○Ｍ・○○○Ｍ・　　　　　ＭＭＭＭＭＭＭＭＭ～～～～～\n" +
"～～～ＭＭ・　　　Ｍ・○○○ＭＭ・　　Ｍ・　　　　　ＭＭＭＭＭＭＭＭ～～～～～～\n" +
"～～～ＭＭ・　　　Ｍ・○○○ＭＭ・　　ＭＭＭ・　　ＭＭＭＭＭＭＭＭ～～～～～～～\n" +
"～～～ＭＭ・　　　Ｍ・　　　ＭＭ・　　・・・・　　ＭＭＭ山ＭＭＭ～～～～～～～～\n" +
"～～～ＭＭ・　　　Ｍ・　　　　　　　　　　　　　　ＭＭＭＭＭ～～～～～～～～～～\n" +
"～～～ＭＭ・　　　・・　　　　　　　　　　　　　　ＭＭＭＭ～～～～～～～～～～～\n" +
"～～～ＭＭＭ・　　　　　　ＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～\n" +
"～～～ＭＭＭ・　　　　　　ＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～\n" +
"～～～ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～～\n" +
"～～～～ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～～～\n" +
"～～～～～ＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭＭ～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～・・・・・・・・・・・・・・・・～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～\n" +
"～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～";
*/

let mapCastleText = "" +
    "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　\n" +
    "　　　　　　　壁壁壁壁壁壁壁壁壁壁壁壁壁壁壁壁壁壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床壁壁壁床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床壁王壁床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁床床床床床床床床床床床床床床床床壁　　　　　　　\n" +
    "　　　　　　　壁壁壁壁壁壁壁壁床床床壁壁壁壁壁壁壁　　　　　　　\n" +
    "　　　　　　　壁壁壁壁壁壁壁壁段段段壁壁壁壁壁壁壁　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　\n" +
    "　　　　　　　　　　　　　　壁段段段壁　　　　　　　　　　　　　";

class BaseMap {
    constructor() {
        this.PlayerX = 0;
        this.PlayerY = 0;
        this.ArrMap = [];

        this.RowMax = 0;
        this.ColMax = 0;
    }

    Move(direct) {
        if (direct == 'left' && this.CanMove('left'))
            this.PlayerX -= speed;
        if (direct == 'right' && this.CanMove('right'))
            this.PlayerX += speed;
        if (direct == 'up' && this.CanMove('up'))
            this.PlayerY -= speed;
        if (direct == 'down' && this.CanMove('down'))
            this.PlayerY += speed;
    }

    CanMove(direct) {
        if (direct == 'up') {
            let playerCol = Math.floor(this.PlayerX / blockSize);
            let playerRow = Math.floor((this.PlayerY - 4) / blockSize);

            let char = this.ArrMap[playerRow][playerCol];
            if (char == '　' || char == '段' || char == '床')
                return true;
            else
                return false;
        }
        if (direct == 'down') {
            let playerCol = Math.floor(this.PlayerX / blockSize);
            let playerRow = Math.ceil((this.PlayerY + 4) / blockSize);

            let char = this.ArrMap[playerRow][playerCol];
            if (char == '　' || char == '段' || char == '床')
                return true;
            else
                return false;
        }
        if (direct == 'left') {
            let playerCol = Math.floor((this.PlayerX - 4) / blockSize);
            let playerRow = Math.floor(this.PlayerY / blockSize);

            let char = this.ArrMap[playerRow][playerCol];
            if (char == '　' || char == '段' || char == '床' || char == '橋')
                return true;
            else
                return false;
        }
        if (direct == 'right') {
            let playerCol = Math.ceil((this.PlayerX + 4) / blockSize);
            let playerRow = Math.floor(this.PlayerY / blockSize);

            let char = this.ArrMap[playerRow][playerCol];
            if (char == '　' || char == '段' || char == '床' || char == '橋')
                return true;
            else
                return false;
        }
        return true;
    }

    Draw() {
        if (ctx == null)
            return;

        ctx.fillStyle = '#ff0';
        ctx.fillRect(0, 0, can.width, can.height);

        let shiftX = (displayWidth - blockSize) / 2 - this.PlayerX;
        let shiftY = (displayHeight - blockSize) / 2 - this.PlayerY;

        ctx.fillStyle = '#00f';

        for (let row = 0; row < this.RowMax; row++) {
            for (let col = 0; col < this.ColMax; col++) {
                if (this.ArrMap[row][col] == '壁') {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
                if (this.ArrMap[row][col] == '　' || this.ArrMap[row][col] == '○')
                    ctx.drawImage(flatImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                if (this.ArrMap[row][col] == '段')
                    ctx.drawImage(stairsImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                if (this.ArrMap[row][col] == '壁')
                    ctx.drawImage(wallImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                if (this.ArrMap[row][col] == '王') {
                    ctx.drawImage(floorImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                    ctx.drawImage(kingImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
                if (this.ArrMap[row][col] == '敵') {
                    ctx.drawImage(floorImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                    ctx.drawImage(devilImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
                if (this.ArrMap[row][col] == '床') {
                    ctx.drawImage(floorImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
                if (this.ArrMap[row][col] == 'Ｍ' || this.ArrMap[row][col] == '・') {
                    if (this.ArrMap[row - 1][col] == '～')
                        ctx.fillRect(col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                    else
                        ctx.drawImage(flatImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
                if (this.ArrMap[row][col] == '～') {
                    ctx.fillRect(col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
                if (this.ArrMap[row][col] == '橋') {
                    ctx.fillRect(col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                }
            }
        }


        for (let row = 0; row < this.RowMax; row++) {
            for (let col = 0; col < this.ColMax; col++) {
                if (this.ArrMap[row][col] == 'Ｍ') {
                    ctx.drawImage(mountainImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize * 2, blockSize * 2);
                }
                if (this.ArrMap[row][col] == '城') {
                    ctx.drawImage(flatImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                    ctx.drawImage(castle1Image, col * blockSize + shiftX, row * blockSize + shiftY, blockSize * 3, blockSize * 3);
                }
                if (this.ArrMap[row][col] == '魔') {
                    ctx.drawImage(flatImage, col * blockSize + shiftX, row * blockSize + shiftY, blockSize, blockSize);
                    ctx.drawImage(castle2Image, col * blockSize + shiftX, row * blockSize + shiftY, blockSize * 3, blockSize * 3);
                }
                if (this.ArrMap[row][col] == '橋') {
                    ctx.drawImage(bridgeImage, col * blockSize + shiftX, row * blockSize + shiftY + 8, blockSize, blockSize);
                }
            }
        }

        ctx.drawImage(playerImage, (displayWidth - blockSize) / 2, (displayHeight - blockSize) / 2);

        if (message != '') {
            ctx.font = "14px ＭＳ ゴシック";
            ctx.fillStyle = '#000';
            ctx.fillRect(20, 340, 280, 80);
            ctx.fillStyle = '#fff';
            let texts = message.split('\n');
            ctx.fillText(texts[0], 40, 370);
            if (texts.length > 1)
                ctx.fillText(texts[1], 40, 390);
        }

        ShowMoveButtons(message == '' && !cleared && started);
        ShowBattleButtons(false);
        DrawHPMP();
    }
}

// ここ

class MapField extends BaseMap {
    constructor(mapText) {
        super();
        this.shoping1 = false;
        this.ArrMap = [];

        let arr = mapText.split('\n');
        for (let i = 0; i < arr.length; i++) {
            const arr2 = [...arr[i]];
            this.ArrMap.push(arr2);
        }

        this.RowMax = this.ArrMap.length;
        this.ColMax = this.ArrMap[0].length;

        this.Init();
    }

    Init() {
        this.PlayerX = 12 * blockSize;
        this.PlayerY = 23 * blockSize;
    }

    Move(direct) {
        let playerCol = this.PlayerX / blockSize;
        let playerRow = this.PlayerY / blockSize;

        if (direct == 'up' && 11 <= playerCol && playerCol <= 13 && playerRow == 23) {
            scene = SCENE_BLACK_OUT;
            StopBgm();

            setTimeout(() => {
                scene = SCENE_MY_CASTLE;

                PlayBgm(bgm);
            }, 1500);
            return;
        }
        if (direct == 'up' && 17 <= playerCol && playerCol <= 19 && playerRow == 21) {
            scene = SCENE_BLACK_OUT;
            StopBgm();

            setTimeout(() => {
                scene = SCENE_ENEMY_CASTLE;

                PlayBgm(bgm);
            }, 1500);
            return;
        }

        super.Move(direct);

        let r = Math.random();
        if (r < appearanceRate) {
            scene = SCENE_ZAKO_BATTLE;
            enemyHP = enemyMaxHP;
            messageOnBattle = 'デッカチャンが現れた！';
            showCommandButtons = true;

            PlayBgm(enemyBgm);
            StopPlayer();
        }
    }
}

class MyCastle extends BaseMap {
    constructor(mapText) {
        super();
        this.ArrMap = [];

        let arr = mapText.split('\n');
        for (let i = 0; i < arr.length; i++) {
            const arr2 = [...arr[i]];
            this.ArrMap.push(arr2);
        }

        this.RowMax = this.ArrMap.length;
        this.ColMax = this.ArrMap[0].length;

        this.talking = false;
        this.Init();
    }

    Init() {
        this.PlayerX = 512;
        this.PlayerY = 270;
    }

    Move(direct) {
        if (!started || message != '') {
            return;
        }

        if (direct == 'down' && this.PlayerY >= 518) {
            this.PlayerX = 512;
            this.PlayerY = 518;
            scene = SCENE_BLACK_OUT;
            StopBgm();

            setTimeout(() => {
                scene = SCENE_FIELD;
                PlayBgm(bgm);
            }, 1500);
            return;
        }

        if (direct == 'right' && this.PlayerX == 482 && this.PlayerY >= 202 && this.PlayerY <= 246) {
            this.QueenTalk();
            return;
        }
        if (direct == 'left' && this.PlayerX == 546 && this.PlayerY >= 202 && this.PlayerY <= 246) {
            this.QueenTalk();
            return;
        }
        if (direct == 'up' && this.PlayerY == 258 && this.PlayerX >= 490 && this.PlayerX <= 538) {
            this.QueenTalk();
            return;
        }
        if (direct == 'down' && this.PlayerY == 194 && this.PlayerX >= 490 && this.PlayerX <= 538) {
            this.QueenTalk();
            return;
        }

        super.Move(direct);
    }

    QueenTalk() {
        StopPlayer();
        if (this.talking)
            return;

        this.talking = true;

        let talkSpeed = 2000;
        message = `${playerName}さまの健闘をお祈りします。`;
        setTimeout(() => {
            message = `${playerName}の体力が全回復した。`;
            playerHP = playerMaxHP;
            playerMP = playerMaxMP;
        }, talkSpeed);
        setTimeout(() => {
            message = '';
            this.talking = false;
        }, talkSpeed * 2);
    }
}

class EnemyCastle extends BaseMap {
    constructor(muraText) {
        super();
        this.ArrMap = [];

        let arr = muraText.split('\n');
        for (let i = 0; i < arr.length; i++) {
            const arr2 = [...arr[i]];
            this.ArrMap.push(arr2);
        }

        this.RowMax = this.ArrMap.length;
        this.ColMax = this.ArrMap[0].length;

        this.PlayerX = 512;
        this.PlayerY = 302 + 128;
        this.Talking = false;
    }

    Init() {
        this.PlayerX = 512;
        this.PlayerY = 302 + 128;
    }

    Move(direct) {
        if (message != '')
            return;

        if (direct == 'down' && this.PlayerY >= 518) {
            this.PlayerX = 512;
            this.PlayerY = 518;
            scene = SCENE_BLACK_OUT;
            StopBgm();

            setTimeout(() => {
                scene = SCENE_FIELD;
                PlayBgm(bgm);
            }, 1500);
            return;
        }

        if (direct == 'right' && this.PlayerX == 482 && this.PlayerY >= 202 && this.PlayerY <= 246) {
            this.BossTalk();
            return;
        }
        if (direct == 'left' && this.PlayerX == 546 && this.PlayerY >= 202 && this.PlayerY <= 246) {
            this.BossTalk();
            return;
        }
        if (direct == 'up' && this.PlayerY == 258 && this.PlayerX >= 490 && this.PlayerX <= 538) {
            this.BossTalk();
            return;
        }
        if (direct == 'down' && this.PlayerY == 194 && this.PlayerX >= 490 && this.PlayerX <= 538) {
            this.BossTalk();
            return;
        }

        super.Move(direct);
    }

    BossTalk() {
        StopPlayer();

        if (this.Talking)
            return;

        this.Talking = true;
        StopBgm();

        let talkSpeed = 1000;

        message = "よく来たな。\nポアするしかないな。超越神力っ...!!";
        setTimeout(() => {
            message = '';

            bossHP = bossMaxHP;
            scene = SCENE_BOSS_BATTLE;
            PlayBgm(bossBgm);
            messageOnBattle = '尊師が出現した！';
            showCommandButtons = true;

            this.Talking = false;
        }, talkSpeed);
    }
}

let mapMyCastle = new MyCastle(mapCastleText);
let mapField = new MapField(mapFieldText);
let mapEnemyCastle = new EnemyCastle(mapCastleText.replace('王', '敵'));

function InitPlayerPosition() {
    mapMyCastle.Init();
    mapField.Init();
    mapEnemyCastle.Init();
}

// 開始
let $start = document.getElementById('start');
let started = false;

let $retry = document.getElementById('retry');
if ($retry != null)
    $retry.style.display = 'none';

function Start() {
    if ($start != null)
        $start.style.display = 'none';

    InitPlayerStatus();
    InitPlayerPosition();
    cleared = false;

    message = `${playerName}さま、お願いです。\n東の城にいる魔王を倒してください。`;
    messageOnBattle = '';

    let talkSpeed = 2000;
    setTimeout(() => {
        message = '体力を消耗したら\n私のもとに戻ってきてください。';
    }, talkSpeed);
    setTimeout(() => {
        message = 'けっして無理はなさらぬように。';
    }, talkSpeed * 2);
    setTimeout(() => {
        message = '';
        this.talking = false;
        started = true;
    }, talkSpeed * 3);
}


// BGMに関する処理
const bgm = new Audio('./sound/bgm.mp3');
const bossBgm = new Audio('./sound/lastboss.mp3');
const enemyBgm = new Audio('./sound/meltylove.mp3');
const hitSound = new Audio('./sound/attack.mp3');
const damageSound = new Audio('./sound/damage.mp3');
const decisionSound = new Audio('./sound/decision.mp3');
const battleEndSound = new Audio('./sound/battle-end.mp3');
const magicSound = new Audio('./sound/magic.mp3');

let setIntervalId = null;

function PlayBgm(music) {
    if (noBGM)
        return;

    StopBgm();

    music.currentTime = 0;
    music.play();

    setIntervalId = setInterval(() => {
        if (music == bgm && music.currentTime >= 204) {
            music.currentTime = 0;
            music.play();
        }
        if (music == bossBgm && music.currentTime >= 120) {
            music.currentTime = 0;
            music.play();
        }
        if (music == enemyBgm && music.currentTime >= 180) {
            music.currentTime = 0;
            music.play();
        }
    }, 100)
}

function StopBgm() {
    if (setIntervalId != null)
        clearInterval(setIntervalId);

    setIntervalId = null;

    bgm.pause();
    bgm.currentTime = 0;
    bossBgm.pause();
    bossBgm.currentTime = 0;
    enemyBgm.pause();
    enemyBgm.currentTime = 0;
}

// プレイヤーと敵の状態

const playerName = '勇者';
const magicName = '攻撃魔法';

const initPlayerMaxHP = 30;
let playerMaxHP = initPlayerMaxHP;
let playerHP = playerMaxHP;

const initPlayerMaxMP = 30;
let playerMaxMP = initPlayerMaxMP;
let playerMP = playerMaxMP;

function InitPlayerStatus() {
    playerMaxHP = initPlayerMaxHP;
    playerHP = playerMaxHP;

    playerMaxMP = initPlayerMaxMP;
    playerMP = playerMaxMP;
}

let enemyMaxHP = 10;
let enemyHP = enemyMaxHP;

let bossMaxHP = 100;
let bossHP = bossMaxHP;


// 移動に関する処理
let $up = document.getElementById('up');
if ($up != null)
    $up.style.display = 'none';
let $down = document.getElementById('down');
if ($down != null)
    $down.style.display = 'none';
let $left = document.getElementById('left');
if ($left != null)
    $left.style.display = 'none';
let $right = document.getElementById('right');
if ($right != null)
    $right.style.display = 'none';

let moveLeft = false;
$left?.addEventListener('touchstart', () => {
    moveLeft = true;
});
$left?.addEventListener('touchend', () => {
    moveLeft = false;
});
$left?.addEventListener('mousedown', () => {
    moveLeft = true;
});
$left?.addEventListener('mouseup', () => {
    moveLeft = false;
});

let moveRight = false;
$right?.addEventListener('touchstart', () => {
    moveRight = true;
});
$right?.addEventListener('touchend', () => {
    moveRight = false;
});
$right?.addEventListener('mousedown', () => {
    moveRight = true;
});
$right?.addEventListener('mouseup', () => {
    moveRight = false;
});

let moveUp = false;
$up?.addEventListener('touchstart', () => {
    moveUp = true;
});
$up?.addEventListener('touchend', () => {
    moveUp = false;
});
$up?.addEventListener('mousedown', () => {
    moveUp = true;
});
$up?.addEventListener('mouseup', () => {
    moveUp = false;
});

let moveDown = false;
$down?.addEventListener('touchstart', () => {
    moveDown = true;
});
$down?.addEventListener('touchend', () => {
    moveDown = false;
});
$down?.addEventListener('mousedown', () => {
    moveDown = true;
});
$down?.addEventListener('mouseup', () => {
    moveDown = false;
});

let $main = document.getElementById('main');
$main?.addEventListener('mouseup', () => {
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;
});

document.onkeydown = function (e) {
    if (e.keyCode == 37)
        Move('left');
    if (e.keyCode == 38)
        Move('up');
    if (e.keyCode == 39)
        Move('right');
    if (e.keyCode == 40)
        Move('down');
}

let speed = 4;

function Move(direct) {
    if (cleared) {
        console.log('クリア');
        return;
    }
    if (scene == SCENE_FIELD)
        mapField.Move(direct);
    if (scene == SCENE_MY_CASTLE)
        mapMyCastle.Move(direct);
    if (scene == SCENE_ENEMY_CASTLE)
        mapEnemyCastle.Move(direct);
}

function StopPlayer() {
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;
}

// 描画に関する処理

function Draw() {
    if (ctx == null)
        return;

    if (playerMP < 3) {
        if ($magic1 != null)
            // @ts-ignore
            $magic1.disabled = "disabled";
        // @ts-ignore
        $magic2.disabled = "disabled";
    } else {
        // @ts-ignore
        $magic1.disabled = null;
        // @ts-ignore
        $magic2.disabled = null;
    }

    ctx.clearRect(0, 0, can.width, can.height);
    if (scene == SCENE_BLACK_OUT) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, can.width, can.height);
        ShowMoveButtons(false);
        ShowBattleButtons(false);
        return;
    }
    if (scene == SCENE_FIELD) {
        mapField.Draw();
        return;
    }
    if (scene == SCENE_ZAKO_BATTLE) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, can.width, can.height);
        ctx.drawImage(enemyImage, (displayWidth - blockSize) / 3, (displayHeight - blockSize) / 2 - 100);
        ctx.fillStyle = '#fff';
        ctx.font = "16px ＭＳ ゴシック";

        if (messageOnBattle != '') {
            let texts = messageOnBattle.split('\n');
            ctx.fillText(texts[0], 20, 280);
            if (texts.length > 1)
                ctx.fillText(texts[1], 20, 310);
        }

        ShowMoveButtons(false);
        ShowBattleButtons(showCommandButtons);
        DrawHPMP();
        return;
    }
    if (scene == SCENE_MY_CASTLE) {
        mapMyCastle.Draw();
    }
    if (scene == SCENE_ENEMY_CASTLE) {
        mapEnemyCastle.Draw();
        return;
    }
    if (scene == SCENE_BOSS_BATTLE) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, can.width, can.height);
        ctx.drawImage(bossImage, (displayWidth - blockSize) / 8, (displayHeight - blockSize) / 2 - 170);
        ctx.fillStyle = '#fff';
        ctx.font = "14px ＭＳ ゴシック";

        if (messageOnBattle != '') {
            let texts = messageOnBattle.split('\n');
            ctx.fillText(texts[0], 20, 280);
            if (texts.length > 1)
                ctx.fillText(texts[1], 20, 310);
        }

        ShowMoveButtons(false);
        ShowBattleButtons(showCommandButtons);
        DrawHPMP();
        return;
    }
}

function DrawHPMP() {
    if (ctx == null)
        return;

    ctx.fillStyle = '#000';
    ctx.fillRect(170, 2, 140, 40);

    ctx.fillStyle = '#fff';
    ctx.font = "18px ＭＳ ゴシック";
    ctx.fillText(`HP ${playerHP} / ${playerMaxHP}`, 180, 20);
    ctx.fillText(`MP ${playerMP} / ${playerMaxMP}`, 180, 38);
}

function ShowBattleButtons(visible) {
    let display = visible ? 'block' : 'none';

    if ($fight != null)
        $fight.style.display = display;
    if ($magic1 != null)
        $magic1.style.display = display;
    if ($magic2 != null)
        $magic2.style.display = display;
}

function ShowMoveButtons(visible) {
    let display = visible ? 'block' : 'none';

    if ($up != null)
        $up.style.display = display;
    if ($down != null)
        $down.style.display = display;
    if ($left != null)
        $left.style.display = display;
    if ($right != null)
        $right.style.display = display;
}

setInterval(() => {
    if (moveLeft)
        Move('left');
    if (moveRight)
        Move('right');
    if (moveUp)
        Move('up');
    if (moveDown)
        Move('down');

    Draw();
}, 33);

// 戦闘

let $fight = document.getElementById('fight');
let $magic1 = document.getElementById('magic1');
let $magic2 = document.getElementById('magic2');

function NormalAttack() {
    Fight(false);
}

function Magic1() {
    if (playerMP >= 3) {
        playerMP -= 3;
        Fight(true);
    }
}

function Fight(isMagic) {
    if (!showCommandButtons)
        return;

    showCommandButtons = false;

    let wait = 750;

    Attack(isMagic, wait);

    let interval = wait;
    if (isMagic)
        interval = wait * 2;

    let isPlayerWin = false;
    setTimeout(() => {
        isPlayerWin = ShowAttackResult(isMagic);
    }, interval);

    let interval2 = wait * 2;
    if (isMagic)
        interval2 = wait * 3;

    setTimeout(() => {
        if (isPlayerWin) {
            OnPlayerWin(wait);
            return;
        }

        BeginEnemyAttack();

        setTimeout(() => {
            EnemyAttack();

            setTimeout(() => {
                if (playerHP > 0)
                    showCommandButtons = true;
                else
                    OnLosePlayer(wait);
            }, wait);
        }, wait);
    }, interval2);
}

function Attack(isMagic, wait) {
    messageOnBattle = `${playerName}の攻撃`;

    if (isMagic) {
        setTimeout(() => {
            messageOnBattle = `${playerName}は${magicName}を唱えた`;
            magicSound.currentTime = 0;
            magicSound.play();
        }, wait);
    }
}

function ShowAttackResult(isMagic) {
    let damage = Math.ceil(Math.random() * 10);
    if (isMagic)
        damage += 16;

    if (scene == SCENE_ZAKO_BATTLE) {
        if (isMagic)
            messageOnBattle = `敵に${damage}のダメージ`;
        else
            messageOnBattle = `敵に${damage}のダメージ`;
        hitSound.currentTime = 0;
        hitSound.play();
        enemyHP -= damage;
        if (enemyHP <= 0)
            return true;
        else
            return false;
    }
    if (scene == SCENE_BOSS_BATTLE) {
        if (isMagic)
            messageOnBattle = `尊師に${damage}のダメージ`;
        else
            messageOnBattle = `尊師に${damage}のダメージ`;
        hitSound.currentTime = 0;
        hitSound.play();
        bossHP -= damage;
        if (bossHP <= 0)
            return true;
        else
            return false;
    }
    return false;
}

function OnPlayerWin(wait) {
    if (scene == SCENE_ZAKO_BATTLE) {
        messageOnBattle = `敵をたおした。`;
    }
    if (scene == SCENE_BOSS_BATTLE) {
        messageOnBattle = `尊師をたおした。`;
        cleared = true;
    }
    StopBgm();

    battleEndSound.currentTime = 0;
    battleEndSound.play();

    setTimeout(() => {
        messageOnBattle = '';

        if (scene == SCENE_ZAKO_BATTLE) {
            scene = SCENE_BLACK_OUT;
            setTimeout(() => {
                playerMaxHP++;
                scene = SCENE_FIELD;
                PlayBgm(bgm);
            }, wait);
        }

        if (scene == SCENE_BOSS_BATTLE) {
            scene = SCENE_BLACK_OUT;
            setTimeout(() => {
                scene = SCENE_MY_CASTLE;
                PlayBgm(bgm);
                ToEnd();
            }, wait * 2);
        }
    }, wait);
}

function ToEnd() {
    cleared = true;
    InitPlayerPosition();

    message = "魔王を倒していただき\nありがとうございました。";

    let wait = 2000;

    setTimeout(() => {
        message = 'ＧＡＭＥ　ＣＬＥＡＲ';
    }, wait);
    setTimeout(() => {
        if ($retry != null)
            $retry.style.display = 'block';
    }, wait * 2);
}

function BeginEnemyAttack() {
    if (scene == SCENE_ZAKO_BATTLE)
        messageOnBattle = `敵の攻撃`;
    if (scene == SCENE_BOSS_BATTLE)
        messageOnBattle = `尊師の攻撃`;
}

function EnemyAttack() {
    let damage = Math.ceil(Math.random() * 10);
    messageOnBattle = `${playerName}に${damage}のダメージ`;
    damageSound.currentTime = 0;
    damageSound.play();

    playerHP -= damage;
    if (playerHP < 0)
        playerHP = 0;
}

function OnLosePlayer(wait) {
    messageOnBattle = `${playerName}はきずつきたおれた`;

    StopBgm();
    setTimeout(() => {
        scene = SCENE_BLACK_OUT;
        setTimeout(() => {
            // スタート地点に戻る
            messageOnBattle = ``;
            ToStart();
        }, wait * 2);
    }, wait);
}

function ToStart() {
    scene = SCENE_MY_CASTLE;

    InitPlayerPosition();
    playerHP = playerMaxHP;
    playerMP = playerMaxMP;

    PlayBgm(bgm);

    let talkSpeed = 2000;

    message = 'おお、死んでしまうとは情けない。';

    setTimeout(() => {
        message = 'もう一度チャンスをやる。\n今度こそ魔法を倒してこい。';
    }, talkSpeed);

    setTimeout(() => {
        message = '';
    }, talkSpeed * 2);
}

function Magic2() {
    if (!showCommandButtons || playerMP < 3)
        return;

    showCommandButtons = false;

    playerMP -= 3;

    messageOnBattle = `${playerName}は回復魔法を使った`;
    magicSound.currentTime = 0;
    magicSound.play();

    let wait = 750;
    setTimeout(() => {
        messageOnBattle = `${playerName}のHPが全回復した`;
        playerHP = playerMaxHP;
    }, wait);
    setTimeout(() => {
        BeginEnemyAttack();
    }, wait * 2);

    setTimeout(() => {
        EnemyAttack();
    }, wait * 3);

    setTimeout(() => {
        if (playerHP > 0)
            showCommandButtons = true;
        else
            OnLosePlayer(wait);
    }, wait * 4);
}

function Retry() {
    if ($retry != null)
        $retry.style.display = 'none';

    Start();
}