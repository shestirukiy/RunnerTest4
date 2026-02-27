import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {

    @property(Node)
    target: Node | null = null; // персонаж

    private startY: number = 0; // фиксируем начальный Y камеры

    start() {
        if (this.node) {
            this.startY = this.node.position.y; // запоминаем начальный Y
        }
    }

    update() {
        if (this.target) {
            const targetPos = this.target.position;
            // камера повторяет X персонажа, Y остаётся фиксированным
            this.node.setPosition(new Vec3(targetPos.x, this.startY, this.node.position.z));
        }
    }
}