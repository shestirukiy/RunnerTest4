import { _decorator, Component, Label, input, Input, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShowJump')
export class ShowJump extends Component {

    // Перетащи сюда Label в инспекторе
    @property(Label)
    myLabel: Label = null!;

    // Время, на которое показывается текст
    showTime: number = 0.5; // 0.5 секунды

    start() {
        // В начале игры текст пустой
        this.myLabel.string = "";

        // Подписка на клик мыши
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onMouseDown(event: EventMouse) {
        // Показать текст
        this.myLabel.string = "JUMP";

        // Через showTime секунд убрать текст
        this.scheduleOnce(() => {
            this.myLabel.string = "";
        }, this.showTime);
    }

    onDestroy() {
        // Отписка от событий, когда Node уничтожается
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }
}