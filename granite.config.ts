import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
    appName: 'stress-breaker', // 콘솔에 등록된 앱 이름
    brand: {
        displayName: '사무실 물건 부수기',
        primaryColor: '#0064FF',
        icon: 'https://static.toss.im/appsintoss/0000/granite.png', // 임시 로고
    },
    web: {
        host: 'localhost', // 실기기에서 접근 가능한 로컬 네트워크 IP (ipconfig getifaddr en0)
        port: 5173, // Vite 웹 서버 포트 (Metro 포트와 별도)
        commands: {
            dev: 'vite --host', // --host 옵션으로 네트워크 노출
            build: 'vite build',
        },
    },
    permissions: [],
});
