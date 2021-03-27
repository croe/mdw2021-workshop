export default function sketch(p5) {
  let players = [];
  let player;
  let gamedatas;
  let selected;
  let updatePlayer;
  let updateGameData;
  const row = 10;
  const col = 10;
  const rectSize = 50;

  p5.setup = () => p5.createCanvas(600, 600);

  p5.myCustomRedrawAccordingToNewPropsHandler = props => {
    // 最新のプレイヤーの状態を受け取る
    if (props.players) {
      players = props.players.map(player => {
        return {
          key: player.key,
          name: player.val().name,
          color: player.val().color,
          x: player.val().x,
          y: player.val().y,
        }
      })
    }

    // 選択中のプレイヤーを受け取る
    if (props.selected) {
      selected = props.selected
    }

    // 最新のゲームデータを受け取る
    if (props.gamedatas) {
      gamedatas = props.gamedatas.map(data => data.val())[0]
    }

    // プレイヤーの情報をアップデートする関数を受け取る
    if (props.updatePlayer) {
      updatePlayer = props.updatePlayer;
    }

    // ゲームデータをアップデートする関数を受け取る
    if (props.updateGameData) {
      updateGameData = props.updateGameData;
    }
  };

  p5.keyPressed = (e) => {
    // プレイヤーの移動
    if (selected && players) {
      player = players.filter((p) => p.key === selected.key)[0]
      // 右の矢印を押した時、マスを超えないなら右に移動。
      if (p5.keyCode === p5.RIGHT_ARROW) {
        if (player.x + 1 <= row) {
          let data = {x: player.x + 1}
          updatePlayer(data)
        }
      }
      // 左の矢印を押した時、マスを超えないなら左に移動。
      if (p5.keyCode === p5.LEFT_ARROW) {
        if (player.x - 1 > 0) {
          let data = {x: player.x - 1}
          updatePlayer(data)
        }
      }
      // 下の矢印を押した時、マスを超えないなら下に移動。
      if (p5.keyCode === p5.DOWN_ARROW) {
        if (player.y + 1 <= col) {
          let data = {y: player.y + 1}
          updatePlayer(data)
        }
      }
      // 上の矢印を押した時、マスを超えないなら上に移動。
      if (p5.keyCode === p5.UP_ARROW) {
        if (player.y - 1 > 0) {
          let data = {y: player.y - 1}
          updatePlayer(data)
        }
      }
    }
  }

  p5.draw = () => {
    p5.background(200)
    p5.textSize(32)

    // 床のマスを表示する
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        p5.rect(i * rectSize, j * rectSize, rectSize, rectSize);
      }
    }

    // もぐらを表示する
    if (gamedatas) {
      gamedatas.map((data, index) => {
        const date = new Date()
        if (
          data.showTime < date.getTime() &&
          date.getTime() < data.showTime + data.hideTime &&
          !data.pressed
        ) {
          p5.push()
          p5.fill(0)
          p5.rect((data.x - 1) * rectSize, (data.y - 1) * rectSize, rectSize, rectSize)
          p5.pop()
          players.map((player) => {
            if(player.x === data.x && player.y === data.y) {
              gamedatas[index].pressed = true
              updateGameData(gamedatas)
            }
          })
        }
      })
      // スコアを表示する
      p5.text(`スコア: ${gamedatas.filter(g => g.pressed).length} / ${gamedatas.length}`, 10, 540)
    }

    // プレイヤーを表示する
    players.map((player) => {
      p5.push()
      p5.fill(player.color)
      p5.rect((player.x - 1) * rectSize, (player.y - 1) * rectSize, rectSize, rectSize)
      p5.pop()
    })

  };
};
