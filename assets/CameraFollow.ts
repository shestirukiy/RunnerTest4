import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {

    @property(Node)
    target: Node | null = null; // персонаж

    @property
    offsetX: number = 2000; // постоянное смещение по X

    private startY: number = 0; // фиксированный Y камеры

    start() {
        if (this.node) {
            this.startY = this.node.position.y; // запоминаем начальный Y
        }
    }

    update() {
        if (this.target) {
            const targetPos = this.target.position;

            // камера повторяет X + смещение, Y остаётся фиксированным
            this.node.setPosition(
                new Vec3(
                    targetPos.x + this.offsetX,
                    this.startY,
                    this.node.position.z
                )
            );
        }
    }
}