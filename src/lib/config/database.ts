import { dev } from '$app/environment';
import { PUBLIC_BASE_URL } from '$env/static/public';

// 환경별 데이터베이스 설정
export const DATABASE_CONFIG = {
	// 개발 환경
	development: {
		allowedDomains: ['localhost', '127.0.0.1'],
		ssl: false,
		monitoring: true
	},
	// 프로덕션 환경
	production: {
		allowedDomains: [
			'your-production-domain.com',
			// Vercel 도메인들은 런타임에서 확인
		],
		ssl: true,
		monitoring: false
	},
	// 테스트 환경
	test: {
		allowedDomains: ['localhost', '127.0.0.1'],
		ssl: false,
		monitoring: false
	}
};

// 현재 환경 설정 가져오기
export function getCurrentConfig() {
	const env = dev ? 'development' : 'production';
	return DATABASE_CONFIG[env];
}

// Vercel 환경인지 확인
export function isVercelEnvironment(): boolean {
	return !!(
		process.env.VERCEL || 
		process.env.VERCEL_URL || 
		process.env.VERCEL_ENV
	);
}

// 허용된 Vercel 도메인인지 확인
export function isAllowedVercelDomain(hostname: string): boolean {
	// Vercel 자동 도메인
	if (hostname.endsWith('.vercel.app')) {
		// 여기에 특정 프로젝트명 체크 추가 가능
		// 예: hostname.startsWith('your-project-name-')
		return true;
	}

	// 커스텀 도메인 (환경 변수로 설정)
	const allowedCustomDomains = process.env.ALLOWED_DOMAINS?.split(',') || [];
	return allowedCustomDomains.includes(hostname);
}

// 도메인 검증 함수 (Vercel 대응)
export function isAllowedDomain(hostname: string): boolean {
	const config = getCurrentConfig();
	
	// 개발 환경
	if (dev) {
		return config.allowedDomains.includes(hostname);
	}

	// Vercel 환경에서는 특별 처리
	if (isVercelEnvironment()) {
		return isAllowedVercelDomain(hostname);
	}

	// 일반 프로덕션 환경
	const isInAllowedList = config.allowedDomains.includes(hostname);
	const isNetlify = hostname.endsWith('.netlify.app');
	
	return isInAllowedList || isNetlify;
}

// 요청 헤더에서 도메인 검증
export function validateRequestOrigin(request?: Request): boolean {
	if (!request) {
		console.log('🔍 서버 사이드에서 직접 호출 - 허용');
		return true;
	}

	const origin = request.headers.get('origin');
	const host = request.headers.get('host');
	
	console.log('🔍 요청 헤더 정보:', { origin, host });
	
	if (!origin && !host) {
		console.log('🔍 API 요청이나 서버 사이드 요청 - 허용');
		return true;
	}

	const hostname = origin ? new URL(origin).hostname : host;
	
	console.log('🔍 추출된 hostname:', hostname);
	
	if (!hostname) {
		console.error('❌ 도메인을 확인할 수 없습니다.');
		return false;
	}

	const isAllowed = isAllowedDomain(hostname);
	
	console.log('🔍 도메인 검증 결과:', { hostname, isAllowed });
	console.log('🔍 Vercel 환경:', isVercelEnvironment());
	console.log('🔍 허용된 커스텀 도메인:', process.env.ALLOWED_DOMAINS);
	
	if (!isAllowed) {
		console.error(`❌ 허용되지 않은 도메인에서 접근 시도: ${hostname}`);
	}

	return isAllowed;
}

// MongoDB 연결 옵션 생성
export function getMongoOptions() {
	const config = getCurrentConfig();
	
	return {
		ssl: config.ssl,
		authSource: 'admin',
		retryWrites: true,
		w: 'majority' as const,
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000,
		maxPoolSize: 10,
		minPoolSize: 1,
		maxIdleTimeMS: 30000,
		monitorCommands: config.monitoring
	};
} 