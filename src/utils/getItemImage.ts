/**
 * 아이템별 이미지 경로를 반환하는 유틸리티
 *
 * 폴더 구조: /images/{아이템영문명}-{단계번호}.png
 */

const ITEM_KEY_MAP: Record<string, string> = {
    '마우스': 'mouse',
    '키보드': 'keyboard',
    '모니터': 'monitor',
    '맥북': 'macbook',
    '사무실 의자': 'chair',
    '스마트폰': 'phone',
};

export function getItemImagePath(itemName: string, phase: number): string | null {
    const key = ITEM_KEY_MAP[itemName];
    if (!key) return null;
    return `/images/${key}/${key}-${phase}.png`;
}

export function hasItemImages(itemName: string): boolean {
    return itemName in ITEM_KEY_MAP;
}
