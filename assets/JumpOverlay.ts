import { _decorator, Component, Node, input, Input } from 'cc';
import { GameManager } from './GameManager';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('JumpOverlay')
export class JumpOverlay extends Component {

    @property(Node)
    player: Node | null = null; // ссылка на игрока, чтобы вызвать прыжок

    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.onClick, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onClick, this);
    }

    onClick() {
        console.log("JumpOverlay clicked!");
        this.node.active = false;

        // снимаем паузу
        if (GameManager.isGamePaused) {
        GameManager.isGamePaused = false;
}

        // прыжок персонажа через метод Player
        if (this.player) {
            const playerComp = this.player.getComponent(Player);
            if (playerComp) {
                playerComp.canJump = true;          // включаем возможность прыгать
                playerComp.jumpFromOverlay();        // делаем прыжок сразу
            }
        }
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onClick, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onClick);
    }
}