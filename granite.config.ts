import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
    appName: 'stress-breaker', // 콘솔에 등록된 앱 이름
    brand: {
        displayName: '사무실 물건 부수기',
        primaryColor: '#0064FF',
        icon: 'https://static.toss.im/appsintoss/0000/granite.png', // 임시 로고
    },
    web: {
        host: 'localhost',
        port: 8080,
        commands: {
            dev: 'vite',
            build: 'vite build',
        },
    },
    permissions: [],
});
