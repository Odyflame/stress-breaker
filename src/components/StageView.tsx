import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Top, Button } from '@toss/tds-mobile';
import { getItemImagePath, hasItemImages } from '../utils/getItemImage';

export function StageView({ game, onEnd }: any) {
    const [showReward, setShowReward] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const controls = useAnimation();

    const isFirstStage = game.currentStage === 1;

    const hitItem = async () => {
        if (game.currentHP <= 0) return;
        game.handleTouch();
        controls.start({
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.2 }
        });
    };

    useEffect(() => {
        if (game.currentHP <= 0 && !showReward && !showAd) {
            const amount = game.calculateReward();
            setRewardAmount(amount);
            setShowReward(true);
        }
    }, [game.currentHP, showReward, showAd, game]);

    // 포인트 팝업 → "다음 물건" 버튼 클릭 시
    const handleGoNext = () => {
        setShowReward(false);

        // 첫 번째 스테이지면 광고 없이 바로 넘어감
        if (isFirstStage) {
            game.nextStage();
            return;
        }

        // 이후 스테이지는 광고 표시
        setShowAd(true);
    };

    // 광고 시청 완료 → 다음 물건 1단계로
    const handleAdComplete = () => {
        console.log('광고 시청 완료');
        setShowAd(false);
        game.nextStage();
    };

    const hpPercentage = Math.max(0, (game.currentHP / game.stageInfo.maxHP) * 100);

    // 파괴 단계 (1~5)
    let damagePhase = 5;
    if (game.currentHP > 0) {
        damagePhase = 5 - Math.floor(((game.currentHP - 1) * 5) / game.stageInfo.maxHP);
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            <Top
                title={
                    <Top.TitleParagraph>
                        남은 HP: {game.currentHP} / {game.stageInfo.maxHP}
                    </Top.TitleParagraph>
                }
                subtitleTop={
                    <Top.SubtitleParagraph>
                        현재 스테이지: {game.currentStage} ({game.stageInfo.name})
                    </Top.SubtitleParagraph>
                }
            />

            <div style={{ padding: '0 24px' }}>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${hpPercentage}%`, height: '100%', backgroundColor: hpPercentage > 30 ? '#0064FF' : '#FF4F4F', transition: 'width 0.2s' }} />
                </div>
            </div>

            <div
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                onClick={hitItem}
            >
                <motion.div
                    animate={controls}
                    style={{ width: '250px', height: '250px', backgroundColor: hasItemImages(game.stageInfo.name) ? 'transparent' : '#eee', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', cursor: 'pointer', userSelect: 'none', overflow: 'hidden' }}
                >
                    {hasItemImages(game.stageInfo.name) ? (
                        <img
                            src={getItemImagePath(game.stageInfo.name, damagePhase)!}
                            alt={game.stageInfo.name}
                            style={{ width: '115%', height: '115%', objectFit: 'cover', borderRadius: '16px' }}
                            draggable={false}
                        />
                    ) : (
                        game.currentHP <= 0 ? '💥' : '📦'
                    )}
                </motion.div>
            </div>

            <div style={{ padding: '0 24px 24px 24px', textAlign: 'center', color: '#999' }}>
                <p>화면 중앙의 물건을 마구 터치하세요!</p>
            </div>

            {/* 포인트 획득 팝업 */}
            {showReward && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', width: '80%', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>포인트 획득!</h3>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            {game.stageInfo.name} 부수기 성공!<br />보상으로 {rewardAmount}원을 받았습니다.
                        </p>
                        <Button size="large" onClick={handleGoNext} style={{ width: '100%' }}>
                            다음 물건 부수러 가기
                        </Button>
                    </div>
                </div>
            )}

            {/* 광고 팝업 (Mock) */}
            {showAd && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '80%', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>📺 광고</h3>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            광고를 시청하면 다음 물건을 부술 수 있습니다.
                        </p>
                        <Button size="large" onClick={handleAdComplete} style={{ width: '100%' }}>
                            광고 시청 완료
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
