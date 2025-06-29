const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 1000;

let player1X = canvas.width / 2;
let player1Y = 100;
let player2X = canvas.width / 2;
let player2Y = canvas.height - 100;

const player1Image = new Image();
player1Image.src = 'img/player1.png'; // ここにプレイヤー1の画像のパス
const player2Image = new Image();
player2Image.src = 'img/player2.png'; // ここにプレイヤー2の画像のパス

player1Image.onload = drawPlayers;
player2Image.onload = drawPlayers;


let stars = [];

function createStars() {

    for (let i = 0; i < 100; i++) { // 星の数を調整
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 // 星の大きさ
        });
    }
}




function drawStars() {

    stars.forEach(star => {
        ctx.fillStyle = '#FFF296';
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

}



let bullets = [];



// 描画関数をアップデート
function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(player1Image, player1X, -player1Y, 80, 80);
    ctx.restore();
    ctx.drawImage(player2Image, player2X, player2Y - 80, 80, 80);

    drawBullet(); // 弾を描画
}



// プレイヤーのHPを追加
let player1HP = 200;
let player2HP = 200;

// HPメーターを描画する関数を追加
// HPメーターを描画する関数を変更
function drawHPMeter() {
    // プレイヤー1のHPメーターの色を決定
    let player1Color;
    if (player1HP > 100) {
        player1Color = 'green';
    } else if (player1HP > 50) {
        player1Color = 'yellow';
    } else {
        player1Color = 'red';
    }

    ctx.fillStyle = player1Color;
    ctx.fillRect(10, 10, player1HP * 3.9, 10); // HPに応じて長さを調整

    // プレイヤー2のHPメーターの色を決定
    let player2Color;
    if (player2HP > 100) {
        player2Color = 'green';
    } else if (player2HP > 50) {
        player2Color = 'yellow';
    } else {
        player2Color = 'red';
    }

    ctx.fillStyle = player2Color;
    ctx.fillRect(10, canvas.height - 30, player2HP * 3.9, 10); // 同じく
}



// 弾を発射する関数を更新して、発射者の情報を追加
function shootBullet(x, y, speed, color, shooter) {
    bullets.push({ x: x, y: y, speed: speed, color: color, shooter: shooter });
}

// 当たり判定をチェックする関数を更新
function checkCollision(bullet, playerX, playerY, shooter) {
    if (bullet.shooter === shooter) {
        return false; // 自分自身の弾は無視
    }

    // 弾とプレイヤーの位置を比較
    if (bullet.x > playerX && bullet.x < playerX + 80 &&
        bullet.y > playerY && bullet.y < playerY + 80) {
        return true;
    }
    return false;
}

// 弾の描画処理を更新して当たり判定を追加
function drawBullet() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // 当たり判定をチェック
        if (checkCollision(bullet, player1X, player1Y, 'player1')) {
            player1HP -= 10; // プレイヤー1にダメージ
            bullets.splice(index, 1); // 当たった弾を消す
        } else if (checkCollision(bullet, player2X, player2Y - 80, 'player2')) {
            player2HP -= 10; // プレイヤー2にダメージ
            bullets.splice(index, 1); // 当たった弾を消す
        }

        // 弾を動かす
        bullet.y += bullet.speed;

        // 画面外に出た弾を配列から削除
        if (bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });
}

// touchstart イベントリスナーをアップデート
canvas.addEventListener('touchstart', (e) => {

    if (isGameOver) {
        return; // ゲームオーバーの場合は何もしない
    }

    e.preventDefault();

    for (let i = 0; i < e.touches.length; i++) {
        const touchX = e.touches[i].clientX - canvas.offsetLeft;
        const touchY = e.touches[i].clientY - canvas.offsetTop;

        if (touchY < canvas.height / 2) {
            shootBullet(player1X + 40, player1Y + 40, 5, 'red', 'player1'); // プレイヤー1の弾
        } else {
            shootBullet(player2X + 40, player2Y - 40, -5, 'blue', 'player2'); // プレイヤー2の弾
        }
    }
});




canvas.addEventListener('touchmove', (e) => {

    if (isGameOver) {
        return; // ゲームオーバーの場合は何もしない
    }

    e.preventDefault(); // デフォルトのタッチ操作を防止

    for (let i = 0; i < e.touches.length; i++) {
        const touchX = e.touches[i].clientX - canvas.offsetLeft;
        const touchY = e.touches[i].clientY - canvas.offsetTop;

        // タッチされた位置がプレイヤー1の領域内かどうかをチェック
        if (touchY < canvas.height / 2) {
            player1X = touchX;
            player1Y = touchY; // Y軸反転のため
        }

        // タッチされた位置がプレイヤー2の領域内かどうかをチェック
        if (touchY > canvas.height / 2) {
            player2X = touchX;
            player2Y = touchY;
        }
    }

    drawPlayers();
});


let isGameOver = false; // ゲームの状態を追跡する変数

// ゲームオーバーの状態をチェックする関数
function checkGameOver() {
    if (player1HP <= 0 || player2HP <= 0) {
        if (!isGameOver) { // まだゲームオーバーでない場合にのみ処理を実行
            isGameOver = true; // ゲームオーバー状態に設定
            //ctx.fillStyle = 'black';
            //ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 90, canvas.height / 2);
        }
        return true;
    }
    return false;
}

// ゲームループを更新
function gameLoop() {

    if (checkGameOver()) {
      drawHPMeter();
        return; // ゲームオーバーなら、ここで処理を停止
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
    drawStars();
    drawHPMeter();
    requestAnimationFrame(gameLoop);
}

createStars();
gameLoop();
