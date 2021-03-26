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
  const history = useHistory();

  /* use react-firebase-hooks */
  // 全てのプレイヤー情報をオンラインデータベースとリアルタイムに同期する
  const [players, loadingPlayer, errorPlayer] = useList(PlayerDataService.getAll());
  // 全てのゲームデータ情報をオンラインデータベースとリアルタイムに同期する
  const [gamedatas, loadingGameData, errorGameData] = useList(GameDataService.getAll());

  const setActivePlayer = (player, index) => {
    // プレイヤーを選択する
    const { name, color, x, y } = player.val();
    // プレイヤー情報をアプリに保存する
    setCurrentPlayer({
      key: player.key,
      name,
      color,
      x,
      y,
    });
    setCurrentIndex(index);
  };

  const removeAllPlayer = () => {
    // 全てのプレイヤーをデータベースから削除する
    PlayerDataService.removeAll()
      .then(() => {
        // データベースの処理が成功した時
        // アプリに保持されている選択中のプレイヤー情報を削除
        setCurrentPlayer(null);
        setCurrentIndex(-1);
      })
      .catch((e) => {
        // データベースの処理が失敗した時
        console.log(e);
      });
  };

  const newGame = () => {
    let data = {
      row: [...Array(10)].map(() => Math.floor(Math.random() * 9) + 1),
      col: [...Array(10)].map(() => Math.floor(Math.random() * 9) + 1),
      answer: [...Array(10)].map(() => [...Array(10)].map(() => 0))
    };
    const gameKey = gamedatas.map(q => q.key)[0];
    if (!gameKey) {
      GameDataService.create(data)
    } else {
      GameDataService.update(gameKey, data)
    }
  };

  const handleUpdatePlayer = (data) => {
    PlayerDataService.update(currentPlayer.key, data)
      .then(() => setCurrentPlayer({ ...currentPlayer, data}))
      .catch((e) => console.log(e))
  }

  const handleUpdateGameData = (data) => {
    const gameKey = gamedatas.map(q => q.key)[0];
    GameDataService.update(gameKey, data)
  }

  return (
    <div>
      <div className="p-4 d-flex">
        <P5Wrapper
          sketch={sketch}
          players={players}
          selected={currentPlayer}
          question={gamedatas}
          updatePlayer={handleUpdatePlayer}
          updateGameData={handleUpdateGameData}
        />
        <div className="pl-4">
        {loadingPlayer && <span>Loading...</span>}
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

        <button
          className="my-3 mr-3 btn btn-sm btn-danger"
          onClick={removeAllPlayer}
        >
          全てのプレイヤーを削除する
        </button>
        <button
          className="my-3 mr-3 btn btn-sm btn-success"
          onClick={() => history.push('/add')}
        >
          プレイヤーを追加する
        </button>
        <button
          className="my-3 mr-3 btn btn-sm btn-info"
          onClick={newGame}
        >
          新しいゲームを始める
        </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
