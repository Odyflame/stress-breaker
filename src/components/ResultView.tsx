import { Button, Top } from '@toss/tds-mobile';

export function ResultView({ totalPoints, onReset }: any) {
    return (
        <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Top
                title={
                    <Top.TitleParagraph>
                        오늘의 오피스 완파!
                    </Top.TitleParagraph>
                }
            />

            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>획득한 총 토스포인트</h2>
                <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#0064FF', marginBottom: '32px' }}>
                    {totalPoints}원
                </div>
                <p style={{ color: '#888', textAlign: 'center' }}>
                    내일 오전 0시에 물건들이 다시 채워집니다.<br />
                    스트레스 없는 하루 보내세요!
                </p>
            </div>

            <div style={{ padding: '24px', display: 'flex', gap: '12px' }}>
                <Button size="large" color="light" onClick={onReset} style={{ flex: 1 }}>
                    처음으로 (테스트용)
                </Button>
                <Button size="large" style={{ flex: 1 }}>
                    친구에게 공유하기
                </Button>
            </div>
        </div>
    );
}
