import { useState } from 'react';
import { Button, Top, Text } from '@toss/tds-mobile';
import { STAGE_DATA } from '../hooks/useGameLogic';

// 토스 런타임에서 주입되는 프로모션 API를 안전하게 접근
function getPromotionApi() {
    try {
        const fw = (window as any).__APPS_IN_TOSS__;
        if (fw?.grantPromotionRewardForGame) {
            return fw.grantPromotionRewardForGame;
        }
    } catch { /* ignore */ }
    return null;
}

const PROMOTION_CODE = 'STRESS_BREAKER_BOLT_EXCHANGE'; // 프로모션 코드 (콘솔에서 발급)
const BOLTS_PER_POINT = 10; // 나사 10개 = 토스포인트 1원

export function ResultView({ totalBolts, onReset }: any) {
    const [isConverting, setIsConverting] = useState(false);
    const [convertResult, setConvertResult] = useState<string | null>(null);

    const convertiblePoints = Math.floor(totalBolts / BOLTS_PER_POINT);
    const hasEnoughBolts = convertiblePoints > 0;

    const handleConvert = async () => {
        if (!hasEnoughBolts || isConverting) return;

        setIsConverting(true);
        const grantReward = getPromotionApi();

        if (grantReward) {
            try {
                const result = await grantReward({
                    params: {
                        promotionCode: PROMOTION_CODE,
                        amount: convertiblePoints,
                    },
                });

                if (!result) {
                    setConvertResult('지원하지 않는 앱 버전이에요.');
                } else if (result === 'ERROR') {
                    setConvertResult('전환 중 오류가 발생했어요.');
                } else if ('key' in result) {
                    setConvertResult(`토스포인트 ${convertiblePoints}원 지급 완료!`);
                } else if ('errorCode' in result) {
                    setConvertResult(`전환 실패: ${result.message}`);
                }
            } catch (e) {
                setConvertResult('전환 중 오류가 발생했어요.');
            }
        } else {
            // 토스 앱 외부에서는 안내 메시지
            setConvertResult('토스 앱에서만 포인트 전환이 가능해요.');
        }

        setIsConverting(false);
    };

    return (
        <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            <Top
                title={
                    <Top.TitleParagraph>
                        오늘의 결과
                    </Top.TitleParagraph>
                }
            />

            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>

                <Text as="h2" typography="headline2" style={{ marginBottom: '8px' }}>
                    오늘의 스트레스 해소 완료!
                </Text>

                <Text typography="body2" color="grey600" style={{ marginBottom: '32px', textAlign: 'center' }}>
                    {STAGE_DATA.length}개의 물건을 모두 박살냈어요
                </Text>

                <div style={{
                    backgroundColor: '#F2F4F6',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '280px',
                    marginBottom: '16px',
                }}>
                    <Text typography="caption1" color="grey500" style={{ marginBottom: '4px' }}>
                        획득한 나사
                    </Text>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#3182F6' }}>
                        🔩 {totalBolts}개
                    </div>
                    {hasEnoughBolts && (
                        <Text typography="caption1" color="grey400" style={{ marginTop: '8px' }}>
                            토스포인트 {convertiblePoints}원으로 전환 가능
                        </Text>
                    )}
                </div>

                {convertResult ? (
                    <div style={{
                        backgroundColor: '#EFF6FF',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        marginBottom: '16px',
                        textAlign: 'center',
                    }}>
                        <Text typography="body3" color="grey600">
                            {convertResult}
                        </Text>
                    </div>
                ) : hasEnoughBolts ? (
                    <Button
                        size="large"
                        color="light"
                        onClick={handleConvert}
                        style={{ width: '100%', maxWidth: '280px', marginBottom: '16px' }}
                    >
                        {isConverting ? '전환 중...' : `나사 ${convertiblePoints * BOLTS_PER_POINT}개 → 토스포인트 ${convertiblePoints}원`}
                    </Button>
                ) : (
                    <Text typography="body3" color="grey400" style={{ textAlign: 'center', marginBottom: '16px' }}>
                        나사 {BOLTS_PER_POINT}개를 모으면 토스포인트 1원으로 바꿀 수 있어요
                    </Text>
                )}

                <Text typography="body3" color="grey400" style={{ textAlign: 'center' }}>
                    박살낸 물건을 정리하고, 새 물건을 준비 중이에요{"\n"}다시 부수고 싶다면 언제든 돌아오세요! 😤
                </Text>
            </div>

            <div style={{ padding: '16px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button size="large" style={{ width: '100%' }}>
                    친구에게 공유하기
                </Button>
                <Button size="large" color="light" onClick={onReset} style={{ width: '100%' }}>
                    다시 부수러 가기
                </Button>
            </div>
        </div>
    );
}
