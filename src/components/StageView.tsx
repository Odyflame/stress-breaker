import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Top, Button, Text } from '@toss/tds-mobile';
import { getItemImagePath, hasItemImages } from '../utils/getItemImage';

const AD_GROUP_ID = 'ait.dev.43daa14da3ae487b';

// 토스 런타임에서 주입되는 광고 API를 안전하게 접근
function getAdApi() {
    try {
        const fw = (window as any).__APPS_IN_TOSS__;
        if (fw?.loadFullScreenAd && fw?.showFullScreenAd) {
            return { loadFullScreenAd: fw.loadFullScreenAd, showFullScreenAd: fw.showFullScreenAd };
        }
    } catch { /* ignore */ }
    return null;
}

export function StageView({ game, onEnd }: any) {
    const [showReward, setShowReward] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const controls = useAnimation();
    const unregisterRef = useRef<(() => void) | null>(null);

    const isFirstStage = game.currentStage === 1;

    // 광고 로드 시도
    const tryLoadAd = useCallback(() => {
        const api = getAdApi();
        if (!api) return;

        try {
            unregisterRef.current = api.loadFullScreenAd({
                options: { adGroupId: AD_GROUP_ID },
                onEvent: (event: any) => {
                    if (event.type === 'loaded') {
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

    // 컴포넌트 마운트 시 광고 로드
    useEffect(() => {
        tryLoadAd();
        return () => {
            unregisterRef.current?.();
        };
    }, [tryLoadAd]);

    const hitItem = async () => {
        if (game.currentHP <= 0) return;
        game.handleTouch();
        controls.start({
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.2 }
        });
    };

    useEffect(() => {
        if (game.currentHP <= 0 && !showReward) {
            const amount = game.calculateReward();
            setRewardAmount(amount);
            setShowReward(true);
        }
    }, [game.currentHP, showReward, game]);

    // 포인트 팝업 → 버튼 클릭 시
    const handleGoNext = () => {
        setShowReward(false);

        // 마지막 스테이지면 완료 처리
        if (game.isLastStage) {
            game.nextStage();
            onEnd();
            return;
        }

        // 첫 번째 스테이지면 광고 없이 바로 넘어감
        if (isFirstStage) {
            game.nextStage();
            return;
        }

        // 광고 표시 시도
        const api = getAdApi();
        if (api && isAdLoaded) {
            try {
                api.showFullScreenAd({
                    options: { adGroupId: AD_GROUP_ID },
                    onEvent: (event: any) => {
                        if (event.type === 'dismissed' || event.type === 'failedToShow') {
                            setIsAdLoaded(false);
                            game.nextStage();
                            tryLoadAd(); // 다음 광고 미리 로드
                        }
                    },
                    onError: () => {
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
                            +{rewardAmount}나사
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
