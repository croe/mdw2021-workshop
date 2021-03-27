import React, { useState, useCallback } from "react";
import { useHistory } from 'react-router-dom'
import { useList } from "react-firebase-hooks/database";
import PlayerDataService from "../services/PlayerDataService";
import GameDataService from "../services/GameDataService";
import P5Wrapper from 'react-p5-wrapper'
import sketch from '../components/Sketch';

const Home = () => {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const history = useHistory()
  const [players, loadingPlayer, errorPlayer] = useList(PlayerDataService.getAll())
  const [gamedatas, loadingGameData, errorGameData] = useList(GameDataService.getAll())

  // プレイヤーを選択する
  const setActivePlayer = (player, index) => {
    const { name, color, x, y } = player.val();
    setCurrentPlayer({
      key: player.key,
      name,
      color,
      x,
      y,
    });
    setCurrentIndex(index);
  }

  // 全てのプレイヤーをデータベースから削除する
  const removeAllPlayer = () => {
    PlayerDataService.removeAll()
      .then(() => {
        setCurrentPlayer(null);
        setCurrentIndex(-1);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // 新しくゲームを開始する時の初期設定
  const newGame = () => {
    let i = 0
    const timeLimit = 60000
    const maxHideTime = 7000
    const minHideTime = 3000
    const amount = 50
    const result = []
    const date = new Date()
    const startTime = date.getTime()
    while (amount > i) {
      result.push({
        x: Math.floor(Math.random() * 9) + 1,
        y: Math.floor(Math.random() * 9) + 1,
        pressed: false,
        showTime: Math.floor(Math.random() * timeLimit) + startTime,
        hideTime: Math.floor(Math.random() * (maxHideTime - minHideTime)) + minHideTime,
      })
      i++
    }
    const gameKey = gamedatas.map(q => q.key)[0];
    if (!gameKey) {
      GameDataService.create(result)
    } else {
      GameDataService.update(gameKey, result)
    }
  }

  // スケッチからプレイヤー情報を変更する時に実行する
  const handleUpdatePlayer = (data) => {
    PlayerDataService.update(currentPlayer.key, data)
      .then(() => setCurrentPlayer({ ...currentPlayer, data}))
      .catch((e) => console.log(e))
  }

  // スケッチからゲームデータを変更する時に実行する
  const handleUpdateGameData = (data) => {
    const gameKey = gamedatas.map(q => q.key)[0];
    GameDataService.update(gameKey, data)
  }

  return (
    <div>
      <div className="p-4 d-flex">
        {/* スケッチを表示するエリア */}
        <P5Wrapper
          sketch={sketch}
          players={players}
          selected={currentPlayer}
          gamedatas={gamedatas}
          updatePlayer={handleUpdatePlayer}
          updateGameData={handleUpdateGameData}
        />
        <div className="pl-4">
          {loadingPlayer && <span>Loading...</span>}
          {/* プレイヤーのリストを表示するエリア */}
          <ul className="list-group">
            {!loadingPlayer && players && players.map((player, index) => (
              <li
                className={"list-group-item align-items-center d-flex " + (index === currentIndex ? "active" : "")}
                onClick={() => setActivePlayer(player, index)}
                key={index}
              >
                <span style={{ display: 'inline-block', width: '15px', height: '15px', borderRadius: '50%', margin: '0 4px 0 0', background: player ? player.val().color : '#000'}} />
                {player.val().name}
              </li>
            ))}
          </ul>

          {/* 各種ボタン */}
          <div>
            <button
              className="my-1 mr-2 btn btn-sm btn-success"
              onClick={() => history.push('/add')}
            >
              プレイヤーを追加する
            </button>

            <button
              className="my-1 mr-2 btn btn-sm btn-info"
              onClick={newGame}
            >
              新しいゲームを始める
            </button>

            <button
              className="my-1 mr-2 btn btn-sm btn-danger"
              onClick={removeAllPlayer}
            >
              全てのプレイヤーを削除する
            </button>
          </div>

          {/* ゲームの説明 */}
          <div className="mt-4">
            <h4>オンライン協力もぐらたたき</h4>
            <p>「新しいゲームを始める」ボタンを押すとランダムにもぐらが出現します！できるだけたくさん叩いて高得点を取ろう</p>
            <p><b>ゲームの始め方</b></p>
            <p>1. プレイヤーを追加するボタンから新しいプレイヤーを登録しましょう</p>
            <p>2. プレイヤーリストから操作したいプレイヤーを選択しましょう</p>
            <p>3. 他の参加者がいる場合は同じようにこのURLでゲームを開いて、1、2をおこないましょう</p>
            <p>4. 全員の準備ができたら「新しいゲームを始める」ボタンをおしましょう</p>
            <p>5. プレイヤーは矢印キーで動かすことができます。50匹のもぐらがランダムに出るので、同じマスを踏むことで叩いたことになります</p>
            <p>6. より高いスコアを目指しましょう！</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;

const gameData = {
  x: 4,
  y: 7,
  pressed: false,
  showTime: 1616824184365,
  hideTime: 5326,
}