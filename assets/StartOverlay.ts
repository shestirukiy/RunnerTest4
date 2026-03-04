import { _decorator, Component, Node, input, Input } from 'cc';
import { GameManager } from './GameManager';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('StartOverlay')
export class StartOverlay extends Component {

    @property(Node)
    player: Node | null = null; // ссылка на игрока

    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.onClick, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onClick, this);
    }

    onClick() {
        console.log("Overlay clicked!");
        this.node.active = false;

        // старт игры и снятие паузы
        if (!GameManager.gameStarted) {
            GameManager.gameStarted = true;
            GameManager.isGamePaused = false;
        }

        // включаем беговую анимацию сразу
        if (this.player) {
            const playerComp = this.player.getComponent(Player);
            if (playerComp && playerComp.anim) {
                playerComp.anim.play('GopRunAnim');
                playerComp.canJump = true; // разрешаем прыжки после старта
            }
        }
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onClick, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onClick);
    }
}