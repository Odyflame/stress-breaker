import { useCallback, useRef } from 'react';

// STAGE_DATA 이름과 파일 매핑
const SOUND_MAP: Record<string, string> = {
    '마우스': '/src/assets/sounds/hit_mouse.wav',
    '키보드': '/src/assets/sounds/hit_keyboard.wav',
    '모니터': '/src/assets/sounds/hit_monitor.wav',
    '맥북': '/src/assets/sounds/hit_macbook.wav',
    '사무실 의자': '/src/assets/sounds/hit_chair.wav',
    '스마트폰': '/src/assets/sounds/hit_smartphone.wav',
};

// 기본 사운드 (매핑 안 된 경우)
const DEFAULT_SOUND = '/src/assets/sounds/hit_mouse.wav';

export function useSound() {
    // 풀링(Pooling) 방식을 사용하여 여러 개의 오디오 객체를 미리 캐싱
    // 연타 시 소리가 끊기는 현상을 방지
    const audioPoolRef = useRef<Record<string, HTMLAudioElement[]>>({});
    const poolIndexRef = useRef<Record<string, number>>({});
    const POOL_SIZE = 5;

    const playSound = useCallback((itemName: string) => {
        const soundPath = SOUND_MAP[itemName] || DEFAULT_SOUND;

        // 캐시(오디오 풀)에 없으면 초기화
        if (!audioPoolRef.current[soundPath]) {
            audioPoolRef.current[soundPath] = [];
            poolIndexRef.current[soundPath] = 0;

            for (let i = 0; i < POOL_SIZE; i++) {
                const audio = new Audio(soundPath);
                // 마우스 사운드는 유독 시끄러우므로 볼륨을 더 줄임
                if (itemName === '마우스') {
                    audio.volume = 0.2;
                } else {
                    audio.volume = 0.5;
                }
                audioPoolRef.current[soundPath].push(audio);
            }
        }

        const pool = audioPoolRef.current[soundPath];
        let currentIndex = poolIndexRef.current[soundPath];

        const audioNode = pool[currentIndex];

        // 현재 오디오를 강제로 처음부터 재생 (이미 재생중이더라도)
        audioNode.currentTime = 0;
        audioNode.play().catch((err) => {
            console.warn('사운드 재생 실패:', err);
        });

        // 다음 사용할 풀 인덱스로 이동
        poolIndexRef.current[soundPath] = (currentIndex + 1) % POOL_SIZE;
    }, []);

    return { playSound };
}
