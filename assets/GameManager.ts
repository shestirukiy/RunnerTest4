// GameManager.ts
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // статус игры
    public static gameStarted: boolean = false;

    // глобальная пауза
    public static isGamePaused: boolean = true;

    // метод для сброса состояния игры
    public static resetGameState() {
        GameManager.gameStarted = false;
        GameManager.isGamePaused = true;
    }
}