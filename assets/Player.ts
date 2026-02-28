import { _decorator, Component, Node, Vec3, Label, input, Input, EventMouse, EventTouch, Animation, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from './GameManager'; 
import { GameOverUI } from './GameOverUI';  
import { ScoreManager } from './ScoreManager';
import { WinUI } from './WinUI';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property speedX = 300;                  // скорость движения

    @property(Animation)
    anim: Animation | null = null;          // анимация персонажа

    @property(Node)
    winPanel: Node | null = null;  // 

    @property(ScoreManager)
    scoreManager: ScoreManager | null = null;

    @property(Node)
    gameOverPanel: Node | null = null;      // нода панели Game Over

    @property jumpHeight = 150;              // высота прыжка
    @property([Node])
    hearts: Node[] = [];                     // массив сердечек

    @property Money: number = 150;           // текущие очки

    // внутренние состояния
    private isJumping = false;
    private jumpVelocity = 0;
    private groundY = 0;
    private isInDamage = false;
    private lives = 3;
    private isInvulnerable = false;
    private damageHandlerAttached = false; // защита от повторного слушателя
    private isGameOver: boolean = false;

    start() {
        this.groundY = this.node.position.y;

        // подписка на клик мыши
    input.on(Input.EventType.MOUSE_DOWN, this.onJump, this);
    input.on(Input.EventType.TOUCH_START, this.onJump, this);

        // дефолтная анимация Idle
        if (this.anim) this.anim.play('GopIdleAnim');

        // подписка на коллизии
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

onJump(event: EventTouch | EventMouse) {
    // первый тап/клик запускает игру
    if (this.isGameOver) return;
    if (!GameManager.gameStarted) {
        GameManager.gameStarted = true;
    }

    // прыжок игрока
    if (!this.isJumping && !this.isInDamage) {
        this.isJumping = true;
        this.jumpVelocity = Math.sqrt(2 * 2000 * this.jumpHeight);
        if (this.anim) this.anim.play('GopJumpAnim');
    }
}

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const otherName = otherCollider.node.name;

        // контакт с врагом → DAMAGE
        if (otherName === 'PoliceEnemy' && !this.isInDamage) {
            this.takeDamage();

            this.isInDamage = true;

            if (this.anim) {
                this.anim.play('GopDamageAnim');

                // защита от повторного слушателя
                if (!this.damageHandlerAttached) {
                    const finishedHandler = () => {
                        // возвращаем бег только если игра не закончена
                        if (!this.isGameOver && this.anim) {
                            this.anim.play('GopRunAnim');
                        }
                        this.isInDamage = false;
                        this.anim!.off(Animation.EventType.FINISHED, finishedHandler);
                        this.damageHandlerAttached = false;
                    };
                    this.anim.on(Animation.EventType.FINISHED, finishedHandler);
                    this.damageHandlerAttached = true;
                }
            }
        }
        if (otherName === 'PoliceFinishFront') {  // 
        this.winScreen();  // победа!
        return;
     }
}

    private takeDamage() {
        if (this.isInvulnerable) return;

        this.lives--;

        // скрываем сердечко
        if (this.lives >= 0 && this.hearts[this.lives]) {
            this.hearts[this.lives].active = false;
        }

        // если жизни кончились → game over
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }

        // короткая неуязвимость
        this.isInvulnerable = true;
        this.scheduleOnce(() => {
            this.isInvulnerable = false;
        }, 1);
    }

private gameOver() {
    console.log("GAME OVER");

    this.isGameOver = true;
    GameManager.gameStarted = false;
    this.isJumping = false;
    this.jumpVelocity = 0;

    if (this.gameOverPanel) {
        this.gameOverPanel.active = true;

        const ui = this.gameOverPanel.getComponent(GameOverUI);
        if (ui) {
            ui.show(0);  // можно передать что угодно, оно не используется
        }
    }

    if (this.anim) {
        this.anim.play('GopIdleAnim');
    }
}


private winScreen() {
    console.log("WIN!");  // для дебага

    // остановить игру
    this.isGameOver = true;  // используем тот же флаг
    GameManager.gameStarted = false;
    this.isJumping = false;
    this.jumpVelocity = 0;

    // показать WinPanel
    if (this.winPanel) {
        this.winPanel.active = true;

        const ui = this.winPanel.getComponent(WinUI);
        if (ui) {
            ui.show();  // анимация счёта
        }
    }

    // idle анимация
    if (this.anim) {
        this.anim.play('GopIdleAnim');  // или специальную "victory anim"
    }
}

    update(deltaTime: number) {
        // если игра не стартовала или конец игры → ничего не делаем
        if (!GameManager.gameStarted || this.isGameOver) return;

        // движение вправо
        let pos = this.node.position;
        let newX = pos.x + this.speedX * deltaTime;

        // прыжок
        if (this.isJumping) {
            pos.y += this.jumpVelocity * deltaTime;
            this.jumpVelocity -= 2000 * deltaTime;

            if (pos.y <= this.groundY) {
                pos.y = this.groundY;
                this.isJumping = false;
                this.jumpVelocity = 0;

                // возврат к бегу, если не в режиме DAMAGE
                if (this.anim && !this.isInDamage) {
                    this.anim.play('GopRunAnim');
                }
            }
        }

        this.node.setPosition(new Vec3(newX, pos.y, pos.z));
    }

    onDestroy() {
        // отписка от событий
    input.off(Input.EventType.MOUSE_DOWN, this.onJump, this);
    input.off(Input.EventType.TOUCH_START, this.onJump, this);
        const collider = this.getComponent(Collider2D);
        if (collider) collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
}