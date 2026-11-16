import { useState, useEffect, useRef } from 'react';
import { Volume2Icon, VolumeXIcon } from './Icons';

export default function NatureSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.3);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const brownNoiseRef = useRef(null);

  // Initialize Web Audio API noise generator (smooth mountain wind + gentle water stream)
  const startAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 1. Mountain Breeze (Filtered Brown Noise)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5; // Gain
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for deep wind sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      brownNoiseRef.current = whiteNoise;

      // 2. High altitude stream shimmer
      const highFilter = ctx.createBiquadFilter();
      highFilter.type = 'bandpass';
      highFilter.frequency.setValueAtTime(650, ctx.currentTime);
      highFilter.Q.setValueAtTime(2.0, ctx.currentTime);

      const streamGain = ctx.createGain();
      streamGain.gain.setValueAtTime(0.25, ctx.currentTime);

      whiteNoise.connect(highFilter);
      highFilter.connect(streamGain);
      streamGain.connect(masterGain);

      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio nature player error:', e);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        if (brownNoiseRef.current) {
          brownNoiseRef.current.stop();
          brownNoiseRef.current.disconnect();
          brownNoiseRef.current = null;
        }
        audioCtxRef.current.suspend();
      } catch (err) {
        console.warn('Error stopping soundscape:', err);
      }
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          /* ignore audio close */
        }
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div 
        className="flex items-center gap-2 bg-dark/60 hover:bg-dark/80 backdrop-blur-md border border-gold/30 hover:border-gold/60 text-cream px-3 py-1.5 rounded-full text-xs transition-all duration-300 shadow-md group cursor-pointer"
        onClick={togglePlay}
        title="Ambiance Nature de Djebel Bargou & Kesra"
      >
        <button
          type="button"
          className="flex items-center gap-1.5 text-gold font-medium focus:outline-none"
        >
          {isPlaying ? (
            <Volume2Icon className="w-3.5 h-3.5 animate-pulse text-gold" />
          ) : (
            <VolumeXIcon className="w-3.5 h-3.5 text-cream/60 group-hover:text-gold" />
          )}
          
          <span className="hidden sm:inline text-[11px] font-medium tracking-wide">
            {isPlaying ? 'Ambiance Djebel Bargou' : 'Son Nature'}
          </span>
        </button>

        {isPlaying && (
          <div className="flex items-center gap-0.5 h-3 px-1">
            <span className="w-0.5 bg-gold rounded-full h-2 animate-[pulse_0.8s_ease-in-out_infinite]" />
            <span className="w-0.5 bg-gold rounded-full h-3 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 bg-gold rounded-full h-1.5 animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
            <span className="w-0.5 bg-gold rounded-full h-2.5 animate-[pulse_0.6s_ease-in-out_infinite_0.1s]" />
          </div>
        )}
      </div>
    </div>
  );
}
