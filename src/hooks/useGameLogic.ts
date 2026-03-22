import { useState, useCallback } from 'react';

// 아이템 밸런스 테이블 (자판기 제거)
export const STAGE_DATA = [
    { step: 1, name: '마우스', maxHP: 5, place: '내 책상' },
    { step: 2, name: '키보드', maxHP: 5, place: '내 책상' },
    { step: 3, name: '모니터', maxHP: 5, place: '내 책상' },
    { step: 4, name: '맥북', maxHP: 5, place: '회의실' },
    { step: 5, name: '사무실 의자', maxHP: 5, place: '사무실 복도' },
    { step: 6, name: '스마트폰', maxHP: 5, place: '사장님실 앞' },
];

export function useGameLogic() {
    const [currentStage, setCurrentStage] = useState(1);
    const [currentHP, setCurrentHP] = useState(STAGE_DATA[0].maxHP);
    const [totalBolts, setTotalBolts] = useState(0);
    const [allCleared, setAllCleared] = useState(false);

    // 햅틱 진동 Mock
    const triggerHaptic = useCallback(() => {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        } else {
            console.log('Haptic vibration triggered');
        }
    }, []);

    // 터치 액션 (물건 부수기)
    const handleTouch = useCallback(() => {
        if (currentHP <= 0) return;
        triggerHaptic();
        setCurrentHP((prev) => Math.max(0, prev - 1));
    }, [currentHP, triggerHaptic]);

    // 보상 지급 (1~3 나사)
    const calculateReward = useCallback(() => {
        const reward = Math.floor(Math.random() * 3) + 1;
        setTotalBolts((prev) => prev + reward);
        return reward;
    }, []);

    // 다음 스테이지 넘어가기
    const nextStage = useCallback(() => {
        const next = currentStage + 1;
        if (next <= STAGE_DATA.length) {
            setCurrentStage(next);
            setCurrentHP(STAGE_DATA[next - 1].maxHP);
        } else {
            // 모든 스테이지 완료
            setAllCleared(true);
        }
    }, [currentStage]);

    // 마지막 스테이지인지 확인
    const isLastStage = currentStage >= STAGE_DATA.length;

    // 게임 초기화
    const resetGame = useCallback(() => {
        setCurrentStage(1);
        setCurrentHP(STAGE_DATA[0].maxHP);
        setTotalBolts(0);
        setAllCleared(false);
    }, []);

    return {
        currentStage,
        currentHP,
        stageInfo: STAGE_DATA[Math.min(currentStage - 1, STAGE_DATA.length - 1)],
        totalBolts,
        allCleared,
        isLastStage,
        handleTouch,
        calculateReward,
        nextStage,
        resetGame,
    };
}
