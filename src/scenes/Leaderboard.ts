import Phaser from 'phaser';
import SceneKeys from '~/constants/SceneKeys';
import { LeaderBoard } from 'phaser3-rex-plugins/plugins/firebase-components';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import LocalStorageKeys from '~/constants/LocalStorageKeys';

const config = {
  apiKey: 'AIzaSyBq7sUs58vCuKQtpYzK6w63ixYj1hlCZSI',
  authDomain: 'infinite-runner-gl.firebaseapp.com',
  projectId: 'infinite-runner-gl',
  storageBucket: 'infinite-runner-gl.appspot.com',
  messagingSenderId: '383343989844',
  appId: '1:383343989844:web:9fff8db18a7881434f49c1',
};

declare const firebase: any;

firebase.initializeApp(config);

export default class Leaderboard extends Phaser.Scene {
  private leaderboard?: LeaderBoard;
  private newScore = 0;
  private userId: string | null = '';
  private userName: string | null = '';

  constructor() {
    super(SceneKeys.Leaderboard);
  }

  init(data: { score: number }) {
    this.getLocalStorage();
    this.leaderboard = new LeaderBoard({
      root: 'leaderboard',
    });

    this.leaderboard.setUser({
      userID: this.userId!,
      userName: this.userName!,
    });

    this.newScore = data.score;
  }

  async create() {
    const actualScore = await this.leaderboard?.getScore(this.userId!);
    if (!actualScore?.score || (actualScore?.score && actualScore?.score < this.newScore)) {
      await this.leaderboard?.post(this.newScore);
    }

    const scores = await this.leaderboard?.loadFirstPage();

    console.dir(scores);

    this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.7 } }).fillRoundedRect(96, 80, 600, 400, 15);

    const x = 128;
    let y = 128;
    const size = 5;

    for (let i = 0; i < size; i++) {
      const num = this.add
        .text(x, y, `${i + 1}`, {
          fontSize: '32px',
          color: '#fff',
          backgroundColor: '#4AE0E2',
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0, 0.5);

      if (scores && i < scores?.length) {
        const scoreItem = scores[i];
        const name = this.add
          .text(num.x + num.width + 10, y, scoreItem.userName!, {
            fontSize: '32px',
          })
          .setOrigin(0, 0.5);

        const nameWidth = 400;
        this.add
          .text(name.x + nameWidth + 10, y, scoreItem.score!.toString(), {
            fontSize: '32px',
          })
          .setOrigin(0, 0.5);
      }

      y += 75;
    }
  }

  private getLocalStorage() {
    this.userId = localStorage.getItem(LocalStorageKeys.UserID);
    this.userName = localStorage.getItem(LocalStorageKeys.Username);
    if (!this.userId || !this.userName) {
      this.userId = uuidv4();
      this.userName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '_',
      });
      localStorage.setItem(LocalStorageKeys.UserID, this.userId);
      localStorage.setItem(LocalStorageKeys.Username, this.userName);
    }
  }
}
