/**
 * 아이템별 이미지 경로를 반환하는 유틸리티
 *
 * 폴더 구조: /images/{아이템영문명}/{아이템영문명}-{단계번호}.{확장자}
 */

interface ItemImageConfig {
    folder: string;
    ext: string | Record<number, string>;
    phases: number;
}

const ITEM_IMAGE_CONFIG: Record<string, ItemImageConfig> = {
    '마우스': { folder: 'mouse', ext: 'jpeg', phases: 5 },
    '키보드': { folder: 'keyboard', ext: { 1: 'jpeg', 2: 'png', 3: 'png', 4: 'png', 5: 'png' }, phases: 5 },
    '모니터': { folder: 'monitor', ext: 'jpeg', phases: 5 },
    '맥북': { folder: 'mac', ext: 'png', phases: 5 },
    '사무실 의자': { folder: 'chair', ext: 'jpeg', phases: 5 },
    '스마트폰': { folder: 'iphone', ext: 'jpeg', phases: 5 },
};

export function getItemImagePath(itemName: string, phase: number): string | null {
    const config = ITEM_IMAGE_CONFIG[itemName];
    if (!config) return null;
    const clampedPhase = Math.min(phase, config.phases);
    const ext = typeof config.ext === 'string' ? config.ext : config.ext[clampedPhase] || 'png';
    return `/images/${config.folder}/${config.folder}-${clampedPhase}.${ext}`;
}

export function hasItemImages(itemName: string): boolean {
    return itemName in ITEM_IMAGE_CONFIG;
}
