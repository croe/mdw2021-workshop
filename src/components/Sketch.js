export default function sketch(p5) {
  let players = [];
  let player;
  let gamedatas;
  let selected;
  let updatePlayer;
  let updateGameData;
  const row = 11;
  const col = 11;
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
        if (player.x + 1 < row) {
          let data = {x: player.x + 1}
          updatePlayer(data)
        }
      }
      // 右の矢印を押した時、マスを超えないなら右に移動。
      if (p5.keyCode === p5.LEFT_ARROW) {
        if (player.x - 1 > 0) {
          let data = {x: player.x - 1}
          updatePlayer(data)
        }
      }
      // 下の矢印を押した時、マスを超えないなら下に移動。
      if (p5.keyCode === p5.DOWN_ARROW) {
        if (player.y + 1 < col) {
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

      if(player.x == gamedatas.mgrX && player.y == gamedatas.mgrY){
        updateGameData({counter:gamedatas.counter+1 ,mgrX:  Math.floor(Math.random() * 9) + 1,mgrY:  Math.floor(Math.random() * 9) + 1})

      }
    }
  }

  p5.draw = () => {
    p5.colorMode(p5.HSB,100)
    p5.background(100)
    p5.textSize(20)


    //床の柄
    p5.noStroke()
    for(let i = 1; i <= 10 ; i++){
      for(let s = 1; s <= 10 ; s++){
        if((i+s)%2==1){p5.fill(95)} else {p5.fill(98)}
        p5.rect(i* rectSize, s * rectSize, rectSize, rectSize)
      }
    }

    // もぐらの表示
    if (gamedatas){
      p5.fill(gamedatas.counter,70,100)
      p5.ellipse(gamedatas.mgrX* rectSize + rectSize/2, gamedatas.mgrY * rectSize+ rectSize/2, rectSize/2, rectSize/2)
      p5.fill(80)
      // スコアを表示する
      p5.text(gamedatas.counter,50, 580)
    }

    // プレイヤーの表示
    players.forEach(function(p){
      p5.push()
      p5.fill(p.color)

      p5.rect((p.x * rectSize) + rectSize/10, (p.y * rectSize) + rectSize/10, rectSize-rectSize*2/10, rectSize-rectSize*2/10)
      p5.pop()
    })

  };
};