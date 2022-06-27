import { useRef, useState } from "react"
import { useEffect } from "react"

const initialPlaylist = [
  {
    name: "Yui Solo",
    fileUri: "audio/yui-solo.mp3"
  },
  {
    name: "5 Seconds of Summer - What I Like About You: Live At The Forum",
    fileUri: "audio/5SOS-WILAY-Live-At-The-Forum.mp3"
  },
  {
    name: "5 Seconds of Summer - Permanent Vacation (Vevo Certified Live)",
    fileUri: "audio/5SOS-Permanent-Vacation-Vevo-Certified-Live.mp3"
  }
]

const Home = () => {
  const [playlist, setPlaylist] = useState(initialPlaylist)
  const [playingTrack, setPlayingTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMute, setIsMute] = useState(false)

  const audioRef = useRef(null)

  let ended = currentTime === audioRef?.current?.duration

  const calculateDuration = (duration = 0) => (
    <>
      {Math.floor(duration / 60) || 0} :{" "}
      {Math.floor(duration - Math.floor(duration / 60) * 60) || 0}
    </>
  )

  const handlePlay = () => {
    if (isPlaying && !ended) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = ({ target: { value }}) => {
    audioRef.current.currentTime = value
  }

  const handleVolume = ({ target: { value }}) => {
    const volume = value / 100
    audioRef.current.volume = volume
  }

  const handleMute = () => {
    setIsMute(prev => !prev)
    if (isMute) {
      audioRef.current.muted = false
    } else {
      audioRef.current.muted = true
    }
  }

  const handleNext = () => {
    if (playingTrack === playlist.length - 1) {
      setPlayingTrack(0);
    } else {
      setPlayingTrack(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (playingTrack === 0) {
      setPlayingTrack(playlist.length - 1)
    } else {
      setPlayingTrack(prev => prev - 1)
    }
  }

  const handleInput = (e) => {
    setIsPlaying(false)
    const { files } = e.target
    const temp = Array.from(files).map(item => ({
      name: item.name,
      fileUri: URL.createObjectURL(item)
    }))
    setPlaylist([...temp])
  }

  const handleResetPlaylist = () => {
    if (playlist !== initialPlaylist) {
      setIsPlaying(false)
      setPlaylist(initialPlaylist)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      setInterval(() => {
        setCurrentTime(audioRef?.current?.currentTime)
      }, 1000);
    }
  });

  useEffect(() => {
    isPlaying && audioRef.current.play()
  }, [playingTrack, isPlaying])

  useEffect(() => {
    if (ended) {
      if (playingTrack === playlist.length - 1) {
        setIsPlaying(false)
        setPlayingTrack(0)
      } else {
        setPlayingTrack(prev => prev + 1)
      }
    }
  }, [ended])

  return (
    <div style={{ padding: 32 }}>
      <h1>AudioPlay</h1>
      <h2>{playlist[playingTrack]?.name}</h2>
      <h3>{playlist[playingTrack]?.artist}</h3>
      <audio ref={audioRef} src={playlist[playingTrack]?.fileUri}></audio>
      <input type="range" min={0} max={audioRef?.current?.duration || 0} value={currentTime} onChange={handleSeek} />
      <p>
        {calculateDuration(currentTime)}
        {" "}-{" "}
        {calculateDuration(audioRef?.current?.duration)}
      </p>
      <br />
      <p>volume</p>
      <input type="range" min={0} max={100} value={(audioRef?.current?.volume * 100) || 0} onChange={handleVolume} />
      <button onClick={handlePlay}>{isPlaying ? "pause" : "play"}</button>
      <button onClick={() => {
        audioRef.current.pause()
        setIsPlaying(false)
        audioRef.current.currentTime = 0
      }}>stop</button>
      <button onClick={handleMute}>{isMute ? "unmute" : "mute"}</button>
      <button onClick={handlePrev}>prev</button>
      <button onClick={handleNext}>next</button>
      <br /><br />
      <input type="file" accept="audio/*" multiple onChange={handleInput} />
      <br/><br />
      <button onClick={handleResetPlaylist}>reset playlist</button>
      <br /><br /><br />
      <div>
        {playlist.map((item, idx) => (
          <div key={idx}>
            {idx === playingTrack
              ? <b>{idx + 1}. {item.name}</b>
              : <p>{idx + 1}. {item.name}</p>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
