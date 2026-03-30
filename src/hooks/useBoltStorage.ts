import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'stress_breaker_total_bolts';

export function useBoltStorage() {
    // 초기 로드 시 localStorage에서 값 가져오기
    const [savedBolts, setSavedBolts] = useState<number>(0);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setSavedBolts(parseInt(stored, 10));
        }
    }, []);

    // 전체 누적 나사에 새로운 나사 추가
    const addBolts = useCallback((amount: number) => {
        setSavedBolts((prev) => {
            const next = prev + amount;
            localStorage.setItem(STORAGE_KEY, next.toString());
            return next;
        });
    }, []);

    // 포인트 전환 (나사 차감)
    const useBolts = useCallback((amount: number) => {
        setSavedBolts((prev) => {
            const next = Math.max(0, prev - amount);
            localStorage.setItem(STORAGE_KEY, next.toString());
            return next;
        });
    }, []);

    return {
        savedBolts,
        addBolts,
        useBolts
    };
}
