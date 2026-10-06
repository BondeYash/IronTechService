"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { startDisposable } from "@/lib/async-disposable";

type ToneModule = typeof import("tone");

type AudioApi = {
  enabled: boolean;
  ready: boolean;
  error: string | null;
  toggle: () => void;
  /** 0..1 smoothed loudness, read from a ref to avoid re-renders */
  energy: React.RefObject<number>;
  /** live FFT bins, or null while silent */
  spectrum: React.RefObject<Float32Array | null>;
};

const noopEnergy = { current: 0 };
const noopSpectrum = { current: null };

const AudioContextValue = createContext<AudioApi | null>(null);

/**
 * Ambient "foundry" bed: a low drone, filtered noise for air, and sparse
 * metallic strikes. Never autoplays — Tone.js is imported only after the
 * visitor opts in, so the audio graph costs nothing until then.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enabledRef = useRef(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const energy = useRef(0);
  const spectrum = useRef<Float32Array | null>(null);
  const rafRef = useRef(0);
  const toneRef = useRef<ToneModule | null>(null);
  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    energy.current = 0;
    spectrum.current = null;
  }, []);

  const start = useCallback(async (signal: AbortSignal) => {
    signal.throwIfAborted();
    const Tone = toneRef.current ?? (await import("tone"));
    toneRef.current = Tone;
    signal.throwIfAborted();
    await Tone.start();
    signal.throwIfAborted();

    const meter = new Tone.Meter({ smoothing: 0.85 });
    const analyser = new Tone.Analyser("fft", 32);
    const out = new Tone.Gain(0.55).toDestination();
    out.connect(meter);
    out.connect(analyser);

    const reverb = new Tone.Reverb({ decay: 9, wet: 0.55 }).connect(out);
    const filter = new Tone.Filter(420, "lowpass").connect(reverb);

    const drone = new Tone.PolySynth(Tone.FMSynth, {
      volume: -22,
      envelope: { attack: 6, release: 8 },
      modulationIndex: 4,
      harmonicity: 1.5,
    }).connect(filter);

    const airGain = new Tone.Gain(0.05).connect(reverb);
    const airFilter = new Tone.Filter(900, "bandpass").connect(airGain);
    const air = new Tone.Noise("pink").connect(airFilter);

    const strike = new Tone.MetalSynth({
      volume: -34,
      envelope: { attack: 0.001, decay: 1.4, release: 0.6 },
      harmonicity: 6.2,
      resonance: 1200,
      octaves: 1.4,
    }).connect(reverb);

    air.start();
    drone.triggerAttack(["C2", "G2", "D3"]);

    const loop = new Tone.Loop((time) => {
      strike.triggerAttackRelease("32n", time);
    }, "2n");
    loop.humanize = true;
    Tone.getTransport().bpm.value = 52;
    loop.start(0);
    Tone.getTransport().start();

    const resource = {
      dispose: () => {
        cancelAnimationFrame(rafRef.current);
        loop.stop();
        loop.dispose();
        Tone.getTransport().stop();
        drone.releaseAll();
        drone.dispose();
        air.stop();
        air.dispose();
        airFilter.dispose();
        airGain.dispose();
        strike.dispose();
        filter.dispose();
        reverb.dispose();
        meter.dispose();
        analyser.dispose();
        out.dispose();
      },
    };

    const tick = () => {
      const db = meter.getValue();
      const level = typeof db === "number" ? db : db[0];
      // -60..0 dB -> 0..1
      const norm = Math.max(0, Math.min(1, (level + 60) / 60));
      energy.current += (norm - energy.current) * 0.2;
      spectrum.current = analyser.getValue() as Float32Array;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return resource;
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    stop();
    setEnabled(next);
    setReady(false);
    setError(null);
    if (next) {
      cancelRef.current = startDisposable(
        start,
        () => setReady(true),
        () => {
          enabledRef.current = false;
          setEnabled(false);
          setReady(false);
          setError("Sound could not start. Try again.");
        },
      );
    }
  }, [start, stop]);

  useEffect(
    () => () => {
      enabledRef.current = false;
      stop();
    },
    [stop],
  );

  const value = useMemo<AudioApi>(
    () => ({ enabled, ready, error, toggle, energy, spectrum }),
    [enabled, ready, error, toggle],
  );

  return <AudioContextValue.Provider value={value}>{children}</AudioContextValue.Provider>;
}

export function useAudio(): AudioApi {
  return (
    useContext(AudioContextValue) ?? {
      enabled: false,
      ready: false,
      error: null,
      toggle: () => {},
      energy: noopEnergy,
      spectrum: noopSpectrum,
    }
  );
}
