import { Button, Top, Text } from '@toss/tds-mobile';
import { STAGE_DATA } from '../hooks/useGameLogic';

export function ResultView({ totalPoints, onReset }: any) {
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
                    {STAGE_DATA.length}개의 물건을 모두 부쉈어요
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
                        오늘 획득한 토스포인트
                    </Text>
                    <div style={{ fontSize: '36px', fontWeight: '700', color: '#3182F6' }}>
                        {totalPoints}원
                    </div>
                </div>

                <Text typography="body3" color="grey400" style={{ textAlign: 'center' }}>
                    내일 오전 0시에 물건들이 다시 채워져요
                </Text>
            </div>

            <div style={{ padding: '16px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button size="large" style={{ width: '100%' }}>
                    친구에게 공유하기
                </Button>
                <Button size="large" color="light" onClick={onReset} style={{ width: '100%' }}>
                    처음으로 돌아가기
                </Button>
            </div>
        </div>
    );
}
