import { _decorator, Component, Node, Vec3, isValid  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {

    @property(Node)
    target: Node | null = null; // персонаж

    @property
    offsetX: number = 2000; // постоянное смещение по X

    @property
    offsetY: number = 0;    // постоянное смещение по Y (относительно начальной позиции камеры)

    private startY: number = 0; // фиксированный Y камеры (начальный)

    start() {
        if (this.node) {
            this.startY = this.node.position.y; // запоминаем начальный Y
        }
    }

    update() {
    if (!this.target || !isValid(this.target)) return;

    const targetPos = this.target.position;

    this.node.setPosition(
        new Vec3(
            targetPos.x + this.offsetX,
            this.startY + this.offsetY,
            this.node.position.z
                )
        );
     }
}