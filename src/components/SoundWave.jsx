import './SoundWave.css';

export default function SoundWave({ isActive = false, isPaused = false }) {
    if (!isActive) return null;

    return (
        <div className={`sound-wave ${isPaused ? 'paused' : ''}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
    );
}
