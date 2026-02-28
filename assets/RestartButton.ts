import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('RestartButton')
export class RestartButton extends Component {

    // вызывается автоматически при клике/тапе на кнопку
    onClick() {
        director.loadScene(director.getScene().name);
        // или если хочешь полностью перезагрузить игру с нуля:
        // director.loadScene("MainScene"); // если сцена называется MainScene
    }
}