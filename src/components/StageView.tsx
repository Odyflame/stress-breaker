import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Top, Button, Text } from '@toss/tds-mobile';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';
import { getItemImagePath, hasItemImages } from '../utils/getItemImage';
import { useSound } from '../hooks/useSound';

// 전면형 광고 테스트 ID
const AD_GROUP_ID = 'ait-ad-test-interstitial-id';

export function StageView({ game, boltStorage, onEnd }: any) {
    const [showReward, setShowReward] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const controls = useAnimation();
    const { playSound } = useSound();

    // 이 스테이지에서 이미 보상을 줬는지(팝업을 띄웠는지) 체크
    const rewardGivenStageRef = useRef(-1);

    const unregisterLoadRef = useRef<(() => void) | null>(null);
    const unregisterShowRef = useRef<(() => void) | null>(null);
    const isMountedRef = useRef(true);

    const isSecondStage = game.currentStage === 2;

    // 광고 로드 시도
    const tryLoadAd = useCallback(() => {
        if (!loadFullScreenAd.isSupported()) {
            console.warn('전면 광고 기능을 사용할 수 없는 환경입니다.');
            return;
        }

        try {
            unregisterLoadRef.current?.();
            unregisterLoadRef.current = loadFullScreenAd({
                options: { adGroupId: AD_GROUP_ID },
                onEvent: (event) => {
                    if (event.type === 'loaded' && isMountedRef.current) {
                        console.log('광고 로드 완료');
                        setIsAdLoaded(true);
                    }
                },
                onError: (error: unknown) => {
                    console.error('광고 로드 실패:', error);
                },
            });
        } catch (e) {
            console.warn('광고 로드 API 호출 실패:', e);
        }
    }, []);

    // 컴포넌트 마운트/언마운트 관리
    useEffect(() => {
        isMountedRef.current = true;
        tryLoadAd();
        return () => {
            isMountedRef.current = false;
            unregisterLoadRef.current?.();
            unregisterLoadRef.current = null;
            unregisterShowRef.current?.();
            unregisterShowRef.current = null;
            controls.stop();
        };
    }, [tryLoadAd, controls]);

    const hitItem = async () => {
        if (game.currentHP <= 0) return;
        playSound(game.stageInfo.name);
        game.handleTouch();
        controls.start({
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.2 }
        });
    };

    useEffect(() => {
        if (game.currentHP <= 0 && !showReward && rewardGivenStageRef.current !== game.currentStage) {
            rewardGivenStageRef.current = game.currentStage;
            const amount = game.calculateReward();
            setRewardAmount(amount);
            boltStorage.addBolts(amount); // Persist to storage
            setShowReward(true);
        }
    }, [game.currentHP, showReward, game, boltStorage]);

    // 포인트 팝업 → 버튼 클릭 시
    const handleGoNext = () => {
        // 즉시 팝업을 닫음
        setShowReward(false);

        // 마지막 스테이지면 완료 처리
        if (game.isLastStage) {
            game.nextStage();
            onEnd();
            return;
        }

        // 두 번째 스테이지(키보드)면 광고 없이 바로 넘어감
        if (isSecondStage) {
            game.nextStage();
            return;
        }

        // 상태 업데이트(팝업 닫힘)가 화면에 반영될 시간을 주기 위해 setTimeout 사용
        setTimeout(() => {
            // 광고 표시 시도
            if (showFullScreenAd.isSupported() && isAdLoaded) {
                try {
                    unregisterShowRef.current?.();
                    unregisterShowRef.current = showFullScreenAd({
                        options: { adGroupId: AD_GROUP_ID },
                        onEvent: (event) => {
                            if (!isMountedRef.current) return;
                            switch (event.type) {
                                case 'dismissed':
                                case 'failedToShow':
                                    setIsAdLoaded(false);
                                    game.nextStage();
                                    tryLoadAd(); // 다음 광고 미리 로드
                                    break;
                            }
                        },
                        onError: () => {
                            if (!isMountedRef.current) return;
                            game.nextStage();
                        },
                    });
                    return;
                } catch (e) {
                    console.warn('광고 표시 실패:', e);
                }
            }

            // 광고 불가 시 바로 넘어감
            game.nextStage();
        }, 300);
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
                        {game.stageInfo.place} - {game.stageInfo.name}
                    </Top.TitleParagraph>
                }
                subtitleTop={
                    <Top.SubtitleParagraph>
                        스테이지 {game.currentStage} / {6}
                    </Top.SubtitleParagraph>
                }
            />

            <div style={{ padding: '0 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text as="span" typography="caption1" color="grey600">HP</Text>
                    <Text as="span" typography="caption1" color="grey600">{game.currentHP} / {game.stageInfo.maxHP}</Text>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F4F4F5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${hpPercentage}%`,
                        height: '100%',
                        backgroundColor: hpPercentage > 50 ? '#3182F6' : hpPercentage > 25 ? '#F59E0B' : '#EF4444',
                        transition: 'width 0.15s ease-out',
                        borderRadius: '4px',
                    }} />
                </div>
            </div>

            <div
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                onClick={hitItem}
            >
                <motion.div
                    animate={controls}
                    style={{ width: '250px', height: '250px', backgroundColor: hasItemImages(game.stageInfo.name) ? 'transparent' : '#F4F4F5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', cursor: 'pointer', userSelect: 'none', overflow: 'hidden' }}
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

            <div style={{ padding: '0 24px 24px 24px', textAlign: 'center' }}>
                <Text typography="caption1" color="grey500">
                    화면 중앙의 물건을 마구 터치하세요!
                </Text>
            </div>

            {/* 포인트 획득 팝업 */}
            {showReward && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px 24px', width: '80%', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔩</div>
                        <Text as="h3" typography="subtitle1" style={{ marginBottom: '8px' }}>
                            {game.stageInfo.name} 부수기 성공!
                        </Text>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#3182F6', margin: '16px 0' }}>
                            +{rewardAmount} 나사
                        </div>
                        <Text typography="body3" color="grey600" style={{ marginBottom: '24px' }}>
                            나사를 모아 토스포인트로 바꿔보세요!
                        </Text>
                        <Button size="large" onClick={handleGoNext} style={{ width: '100%' }}>
                            {game.isLastStage ? '오늘의 결과 보기' : '다음 물건 부수러 가기'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
