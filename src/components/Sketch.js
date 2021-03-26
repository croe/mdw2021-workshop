export default function sketch(p5) {
  let players = [];
  let player;
  let question;
  let selected;
  let updatePlayer;
  let updateQuest;
  const row = 11;
  const col = 11;
  const rectSize = 50;
  const gap = 0;
  let enteredAnswer = 0;

  p5.setup = () => p5.createCanvas(600, 600);

  p5.myCustomRedrawAccordingToNewPropsHandler = props => {
    if (props.updatePlayer) {
      updatePlayer = props.updatePlayer;
    }
    if (props.updateGameData) {
      updateQuest = props.updateGameData;
    }
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
    if (props.question) {
      question = props.question.map(q => q.val())[0]
    }
    if (props.selected) {
      selected = props.selected
    }
  };

  p5.keyPressed = (e) => {
    if (selected && players) {
      player = players.filter((p) => p.key === selected.key)[0]
      if (p5.keyCode === p5.RIGHT_ARROW) {
        // 右の矢印を押した時、マスを超えないようにする
        if (player.x + 1 < row) {
          let data = {x: player.x + 1}
          updatePlayer(data)
        }
      }
      if (p5.keyCode === p5.LEFT_ARROW) {
        if (player.x - 1 > 0) {
          let data = {x: player.x - 1}
          updatePlayer(data)
        }
      }
      if (p5.keyCode === p5.DOWN_ARROW) {
        if (player.y + 1 < col) {
          let data = {y: player.y + 1}
          updatePlayer(data)
        }
      }
      if (p5.keyCode === p5.UP_ARROW) {
        if (player.y - 1 > 0) {
          let data = {y: player.y - 1}
          updatePlayer(data)
        }
      }
      if (p5.keyCode === p5.BACKSPACE) {
        let str = enteredAnswer.toString().slice(0, -1)
        enteredAnswer = parseInt(str !== '' ? str : "0")
      }
      if (p5.keyCode === p5.ENTER) {
        if (enteredAnswer !== 0) {
          let data = question.answer.map((col, i) => {
            return col.map((r, j) => {
              if (j === (player.x - 1) && i === (player.y - 1)) {
                return enteredAnswer
              } else {
                return r
              }
            })
          })
          updateQuest({answer: data});
          enteredAnswer = 0;
        }
      }
      if (
        e.key === "0" ||
        e.key === "1" ||
        e.key === "2" ||
        e.key === "3" ||
        e.key === "4" ||
        e.key === "5" ||
        e.key === "6" ||
        e.key === "7" ||
        e.key === "8" ||
        e.key === "9"
      ) {
        let str = enteredAnswer + e.key
        enteredAnswer = parseInt(str)
      }
    }
  }

  p5.draw = () => {
    p5.background(200)
    p5.textSize(32)
    if (question && question.row) {
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          p5.rect((i * rectSize) + (i * gap), (j * rectSize) + (j * gap), rectSize, rectSize);
          if (i === 0 && j !== 0) {
            p5.text(question.row[j - 1], (i * rectSize) + (i * gap) + 15, (j * rectSize) + (j * gap) + 40)
          }
          if (j === 0 && i !== 0) {
            p5.text(question.col[i - 1], (i * rectSize) + (i * gap) + 15, (j * rectSize) + (j * gap) + 40)
          }
          if (i === 0 && j === 0) {
            p5.text('+', (i * rectSize) + (i * gap) + 15, (j * rectSize) + (j * gap) + 35)
          }
          if (i !== 0 && j !== 0 && i < row && j < col && question.answer[j - 1][i - 1] !== 0) {
            p5.text(question.answer[j - 1][i - 1],(i * rectSize) + 5, (j * rectSize) + 40)
          }
        }
      }
    }
    players.map((p) => {
      p5.push()
      p5.fill(p.color)
      p5.rect((p.x * rectSize) + (p.x * gap), (p.y * rectSize) + (p.y * gap), rectSize, rectSize)
      if (enteredAnswer !== 0 && p.key === selected.key) {
        p5.fill(255)
        p5.text(enteredAnswer, (p.x * rectSize) + (p.x * gap) + 5, (p.y * rectSize) + (p.y * gap) + 35)
      }
      p5.pop()
    })

  };
};
