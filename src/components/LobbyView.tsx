import { Button, Top } from '@toss/tds-mobile';
import { getItemImagePath, hasItemImages } from '../utils/getItemImage';
import { STAGE_DATA } from '../hooks/useGameLogic';

export function LobbyView({ game, boltStorage, onStart, onGoConvert }: any) {
    return (
        <div style={{ flex: 1, backgroundColor: '#f9f9f9', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Top
                title={
                    <Top.TitleParagraph>
                        사무실 물건 부수기
                    </Top.TitleParagraph>
                }
                subtitleTop={
                    <Top.SubtitleParagraph color="#0064FF">
                        스트레스 지수: 남은 아이템 {STAGE_DATA.length - game.currentStage + 1}개
                    </Top.SubtitleParagraph>
                }
            />

            {/* 나사 현황 및 포인트 전환 배너 */}
            <div style={{ padding: '16px 24px 0 24px' }}>
                <div style={{
                    backgroundColor: '#EFF6FF',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ fontSize: '13px', color: '#4E5968', marginBottom: '4px' }}>내 나사 🔩</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3182F6' }}>
                            {boltStorage.savedBolts}개
                        </div>
                    </div>
                    {boltStorage.savedBolts >= 10 && (
                        <Button size="small" color="primary" onClick={onGoConvert}>
                            포인트로 바꾸기
                        </Button>
                    )}
                </div>
            </div>

            <div style={{ padding: '24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>{game.stageInfo?.name}</h2>
                <p style={{ color: '#666' }}>장소: {game.stageInfo?.place}</p>

                <div style={{ margin: '32px 0' }}>
                    {hasItemImages(game.stageInfo?.name) ? (
                        <div style={{ width: '150px', height: '150px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden' }}>
                            <img
                                src={getItemImagePath(game.stageInfo?.name, 1)!}
                                alt={game.stageInfo?.name}
                                style={{ width: '115%', height: '115%', objectFit: 'cover', marginLeft: '-7.5%', marginTop: '-7.5%' }}
                            />
                        </div>
                    ) : (
                        <img
                            src={`https://dummyimage.com/150x150/e0e0e0/000.png&text=${game.stageInfo?.name}`}
                            alt={game.stageInfo?.name}
                            style={{ borderRadius: '16px' }}
                        />
                    )}
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                <Button size="large" onClick={onStart} style={{ width: '100%' }}>
                    부수러 가기
                </Button>
            </div>
        </div>
    );
}
