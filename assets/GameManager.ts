// GameManager.ts
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static gameStarted: boolean = false;
}