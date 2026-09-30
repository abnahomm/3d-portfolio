import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  useVideoTexture,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from "react-icons/fa";
import "./index.css";

function Room() {
  const { scene } = useGLTF("/room.glb");
  return <primitive object={scene} scale={0.82} position={[0, -1.35, 0]} />;
}

useGLTF.preload("/room.glb");

function VideoPlane({ src, position, rotation, scale }) {
  const texture = useVideoTexture(src, {
    muted: true,
    loop: true,
    autoplay: true,
    playsInline: true,
    start: true,
  });

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateText = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeText = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="clock-chip">
      <div className="clock-date">{dateText}</div>
      <div className="clock-time">{timeText}</div>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="socials-wrap">
      <span className="socials-label">Contact me:</span>

      <a
        href="https://www.linkedin.com/in/abrahamnahom/"
        target="_blank"
        rel="noreferrer"
        className="social-icon-btn"
        aria-label="LinkedIn"
      >
        <FaLinkedin />
      </a>

      <a
        href="mailto:youremail@example.com"
        className="social-icon-btn"
        aria-label="Email"
      >
        <FaEnvelope />
      </a>

      <a
        href="https://github.com/abnahomm"
        target="_blank"
        rel="noreferrer"
        className="social-icon-btn"
        aria-label="GitHub"
      >
        <FaGithub />
      </a>

      <a
        href="/resume.pdf"
        target="_blank"
        rel="noreferrer"
        className="social-icon-btn"
        aria-label="Resume"
      >
        <FaFileAlt />
      </a>
    </div>
  );
}

function MusicWidget() {
  const playlist = [
    { title: "Cyanide", artist: "Daniel Caesar", file: "/music/Cyanide.mp3", cover: "/covers/DC.jpg" },
    { title: "Can I", artist: "Drake", file: "/music/Can I.mp3", cover: "/covers/Drake.jpg" },
    { title: "I Wanna Be Down", artist: "Brandy", file: "/music/I Wanna Be Down.mp3", cover: "/covers/Brandy.jpg" },
    { title: "FOREVER PT.2", artist: "BKTHERULA ft. Destroy Lonely", file: "/music/FOREVER PT.2.mp3", cover: "/covers/BK.jpg" },
    { title: "Sacrifice", artist: "Mariah the Scientist", file: "/music/Sacrifice.mp3", cover: "/covers/Mariah.jpg" },
    { title: "Provider", artist: "Frank Ocean", file: "/music/Provider.mp3", cover: "/covers/Frank.jpg" },
    { title: "Greedy", artist: "PARTYNEXTDOOR & Drake", file: "/music/Greedy.mp3", cover: "/covers/PND.jpg" },
    { title: "Both Sides Of The Moon", artist: "Celeste & Gotts Street Park", file: "/music/Both Sides Of The Moon.mp3", cover: "/covers/Celeste.jpg" },
    { title: "Softly", artist: "Clairo", file: "/music/Softly.mp3", cover: "/covers/clairo.jpg" },
    { title: "Finest", artist: "YoungBoy Never Broke Again", file: "/music/Finest.mp3", cover: "/covers/YB.jpg" },
    { title: "Cayendo (side A - Acoustic)", artist: "Frank Ocean", file: "/music/Cayendo (side A - Acoustic).mp3", cover: "/covers/Franks.jpg" },
    { title: "Oh My Baby", artist: "Babystaydown", file: "/music/Oh My Baby.mp3", cover: "/covers/Baby.jpg" },
    { title: "Bet", artist: "Mereba", file: "/music/Bet.mp3", cover: "/covers/Mereba.jpg" },
    { title: "N 2 Deep", artist: "Drake ft. Future", file: "/music/N 2 Deep.mp3", cover: "/covers/Drakes.jpg" },

  ];

  const rotationTracks = [
  { title: "Nothing", artist: "Steve Lacy", cover: "/covers/lacy.jpg" },
  { title: "Choosin' Texas Remix", artist: "Drake", cover: "/covers/fomo.jpg" },
  { title: "Incomplete Kisses", artist: "Sampha", cover: "/covers/sampha.jpg" },
  { title: "Forrest Gump", artist: "Frank Ocean", cover: "/covers/channelo.jpg" },
  { title: "Gen 5", artist: "Drake", cover: "/covers/gen5.jpg" },
];

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicTab, setMusicTab] = useState("player");

  const audioRef = useRef(null);
  const track = playlist[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setProgress(0);
    if (playing) audio.play().catch(() => {});
  }, [trackIndex, playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setTrackIndex((prev) => (prev + 1) % playlist.length);
      setPlaying(true);
    };
    const onError = () => {
      console.error("Audio failed to load:", track.file);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [playlist.length, track.file]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
    setPlaying(true);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setPlaying(true);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setProgress(value);
  };

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="music-player">
      <div className="music-tabs">
        <button
          className={musicTab === "player" ? "music-tab active" : "music-tab"}
          onClick={() => setMusicTab("player")}
        >
          Player
        </button>
        <button
          className={musicTab === "rotation" ? "music-tab active" : "music-tab"}
          onClick={() => setMusicTab("rotation")}
        >
          Rotation
        </button>
      </div>

      {musicTab === "player" ? (
        <>
          <p className="music-player-top">Favorite tracks on repeat.</p>

          <div className="record-wrap">
            <div className={`record ${playing ? "spin" : ""}`} />
            <img className="album-cover" src={track.cover} alt={track.title} />
          </div>

          <h3 className="track-title">{track.title}</h3>
          <p className="track-artist">{track.artist}</p>

          <audio ref={audioRef} src={track.file} />

          <input
            className="progress-bar"
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
          />

          <div className="time-row">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="controls-row">
            <button className="music-btn" onClick={prevTrack}>⏮</button>
            <button className="music-btn play-btn" onClick={togglePlay}>
              {playing ? "⏸" : "▶"}
            </button>
            <button className="music-btn" onClick={nextTrack}>⏭</button>
          </div>
        </>
      ) : (
        <div className="rotation-box">
          <div className="rotation-title">Current Rotation</div>
          <div className="rotation-list">
            {rotationTracks.map((song, idx) => (
              <div className="rotation-item" key={song.title}>
                <img src={song.cover} alt={song.title} />
                <div>
                  <div className="rotation-rank">#{idx + 1}</div>
                  <div className="rotation-song">{song.title}</div>
                  <div className="rotation-artist">{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FloatingMenu3D({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "about", label: "about me" },
    { key: "projects", label: "projects" },
    { key: "experience", label: "experience" },
    { key: "certifications", label: "certifications" },
    { key: "contact", label: "contact me" },
  ];

  return (
    <Html
      transform
      position={[-4.0, 1.05, 0.93]}
      rotation={[0, 0.98, 0]}
      distanceFactor={3.35}
      occlude={false}
      zIndexRange={[50, 0]}
      wrapperClass="floating-menu-3d-wrap"
    >
      <div className="wall-panel-menu">
        <div className="wall-panel-title">nahom abraham</div>

        <div className="wall-panel-links">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "wall-panel-link active" : "wall-panel-link"}
              onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </Html>
  );
}

function FloatingPanel({ activeTab, onClose }) {
  if (!activeTab) return null;

  const contentMap = {
    about: {
      title: "about Me",
      content: (
        <div className="panel-about-grid">
          <div className="panel-about-left">
            <img className="panel-profile-photo" src="/nahoma.jpg" alt="Nahom Abraham" />
          </div>

          <div className="panel-about-right">
            <h2>Nahom Abraham</h2>
            <p>
              i’m an IT major at the University of Central Florida
              with a background in computer science and a strong interest in cybersecurity,
              software development, and enterprise technology.
            </p>
            <p>
              i wanted this site to feel different from a typical portfolio. instead of a
              static page, visitors explore a 3D room that represents my projects,
              interests, and personality.
            </p>

            <div className="mini-chip-wrap">
              {[
                "Java",
                "Python",
                "C++",
                "JavaScript",
                "React",
                "GitHub",
                "Wireshark",
                "Windows",
                "VS Code",
                "Blender",
                "Microsoft Office",
              ].map((tool) => (
                <span key={tool} className="mini-chip">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    projects: {
      title: "Projects",
      content: (
        <div className="panel-card-grid">
          <div className="info-card">
            <h3>physical intrusion detection system</h3>
            <span>python · OpenCV · security</span>
            <p>
              built a motion-detection security system using Python and OpenCV that
              detects movement in real time and captures snapshots for monitoring.
            </p>
          </div>

          <div className="info-card">
            <h3>cybersecurity homelab</h3>
            <span>virtualBox · kali linux · windows server</span>
            <p>
              built a cybersecurity homelab using virtualBox with kali linux,
              windows Server, and active Directory to simulate an enterprise network.
            </p>
          </div>

          <div className="info-card">
            <h3>weather API</h3>
            <span>python · API integration</span>
            <p>
              built a Python app that fetches and displays real-time weather data
              using a public API.
            </p>
          </div>
        </div>
      ),
    },

    experience: {
      title: "experience",
      content: (
        <div className="panel-card-grid">
          <div className="info-card">
            <h3>classroom support technician</h3>
            <span>university of central florida · oct 2025 – present</span>
            <p>
              provide technical support for 50+ classrooms across UCF’s downtown campus,
              troubleshooting audio-visual systems, presentation technology, and classroom
              IT infrastructure to ensure reliable operation.
            </p>
          </div>

          <div className="info-card">
            <h3>AI/ML automation extern</h3>
            <span>outamation · 2025</span>
            <p>
              worked on automation-focused projects using python and AI/ML workflows
              to process unstructured data and simulate enterprise-style business tasks..
            </p>
          </div>

          <div className="info-card">
            <h3>software engineering fellow</h3>
            <span>headstarter AI · Aug 2024 – Jul 2025</span>
            <p>
              selected for a competitive fellowship focused on software engineering and AI,
              completing structured development projects and technical training..
            </p>
          </div>
        </div>
      ),
    },

    certifications: {
      title: "certifications",
      content: (
        <div className="panel-card-grid">
          <div className="info-card">
            <h3>compTIA security+</h3>
            <span>In Progress</span>
            <p>
              strengthening knowledge in threat analysis, network security, and risk management.
            </p>
          </div>

          <div className="info-card">
            <h3>electronic arts software engineering job simulation</h3>
            <span>forage</span>
            <p>
              practiced debugging, feature planning, clean code, and design implementation.
            </p>
          </div>

          <div className="info-card">
            <h3>goldman sachs software engineering job simulation</h3>
            <span>forage</span>
            <p>
              worked through coding challenges and system design tasks with technical reasoning.
            </p>
          </div>
        </div>
      ),
    },

    contact: {
      title: "contact me",
      content: (
        <div className="contact-panel-content">
          <p>let's connect!</p>
          <a href="mailto:nahomab80@gmail.com">nahomab80@gmail.com</a>
          <a href="https://www.linkedin.com/in/abrahamnahom/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/abnahomm" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      ),
    },
  };

  const selected = contentMap[activeTab];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="click-close-hint">click anywhere outside to close</div>

      <div className="floating-panel-card" onClick={(e) => e.stopPropagation()}>
        <div className="paper-kicker">{selected.title}</div>
        <div className="floating-panel-body">{selected.content}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  if (!entered) {
    return (
      <div className="intro-screen">
        <h1 className="intro-title">Welcome to my room</h1>
        <button className="enter-btn" onClick={() => setEntered(true)}>
          [Enter]
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="scene-wrap">
        <Canvas camera={{ position: [8.5, 4.2, 9.5], fov: 34 }}>
          <ambientLight intensity={1.35} />
          <directionalLight position={[6, 7, 8]} intensity={2.2} />

          <Suspense fallback={null}>
            <Room />
            <Environment preset="studio" background={false} />

            <VideoPlane
              src="/videos/bron.mp4"
              position={[-2.19, 0.54, 0.78]}
              rotation={[0, 1.42, 0]}
              scale={[0.74, 0.43, 1]}
            />

            <VideoPlane
              src="/videos/hack.mp4"
              position={[-2.19, 0.54, 1.34]}
              rotation={[0, 1.9, 0]}
              scale={[1.07, 0.43, 1]}
            />

            <VideoPlane
              src="/videos/ufc.mp4"
              position={[-2.2, 1.95, -2.6]}
              rotation={[0.2, 0.55, 0]}
              scale={[0.87, 0.55, 1]}
            />

            <FloatingMenu3D activeTab={activeTab} setActiveTab={setActiveTab} />
          </Suspense>

          <OrbitControls
            target={[0, 0.4, 0]}
            minDistance={5}
            maxDistance={14}
            maxPolarAngle={1.55}
            minPolarAngle={0.8}
            enablePan={false}
          />
        </Canvas>

        <div className="scene-vignette" />
        <ClockWidget />
        <SocialLinks />
        <MusicWidget />

        {activeTab && (
          <FloatingPanel
            activeTab={activeTab}
            onClose={() => setActiveTab(null)}
          />
        )}
      </div>
    </div>
  );
}
