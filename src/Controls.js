import { Component } from 'react'
import { PlayButton, PauseButton } from 'react-player-controls'

export default class Controls extends Component {
  render() {
    <PlayButton isEnabled={true} onClick={playHandler} />
    <PauseButton onClick={pauseHandler} />
  }
}