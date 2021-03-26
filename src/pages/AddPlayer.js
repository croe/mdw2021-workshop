import React, { useState } from 'react';
import PlayerDataService from '../services/PlayerDataService'
import { CirclePicker } from 'react-color'
import { Link } from 'react-router-dom'

const AddPlayer = () => {
  // プレイヤーの初期値
  const initialPlayerState = {
    name: "",
    color: "",
    x: 0,
    y: 0,
  };
  const [player, setPlayer] = useState(initialPlayerState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => setPlayer({ ...player, [event.target.name]: event.target.value })
  const handleChangeColor = (color) => setPlayer({ ...player, color: color.hex })

  const savePlayer = () => {
    let data = {
      name: player.name,
      color: player.color,
      x: 1,
      y: 1,
    };

    PlayerDataService.create(data)
      .then(() => {
        setSubmitted(true);
        setPlayer(initialPlayerState);
        setTimeout(() => {
          setSubmitted(false)
        }, 3000)
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="submit-form pt-4">
      <div>
          <div className="form-group">
            <label htmlFor="name">Player name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={player.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>
          <div className="form-group">
            <CirclePicker onChange={handleChangeColor} />
          </div>
          <div className="d-flex">
            <button onClick={savePlayer} className="btn btn-success" disabled={submitted}>
              { submitted ? 'プレイヤーを登録しました！' : 'プレイヤー登録する' }
            </button>
            <div className="ml-2 btn btn-info">
              <Link to="/" className="text-light">戻る</Link>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AddPlayer;
