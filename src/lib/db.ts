import mongoose from 'mongoose';
import { PRIVATE_MONGODB_URI } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { 
	getCurrentConfig, 
	isVercelEnvironment, 
	validateRequestOrigin,
	getMongoOptions
} from '$lib/config/database';

// MongoDB 연결 상태 추적
let isConnected = false;

// 도메인 검증 (Vercel 대응)
function validateEnvironment(request?: Request) {
	// Vercel 환경에서는 요청 기반 검증
	if (isVercelEnvironment()) {
		if (request) {
			return validateRequestOrigin(request);
		}
		// 서버 사이드에서 직접 호출하는 경우는 허용
		return true;
	}

	// 기존 URL 기반 검증 (다른 환경)
	if (typeof window !== 'undefined') {
		return true; // 브라우저 환경
	}

	const baseUrl = PUBLIC_BASE_URL || 'http://localhost:5173';
	const hostname = new URL(baseUrl).hostname;
	
	// 개발 환경에서는 항상 허용
	if (process.env.NODE_ENV === 'development') {
		return true;
	}

	const config = getCurrentConfig();
	const isAllowed = config.allowedDomains.includes(hostname);

	if (!isAllowed) {
		console.error(`허용되지 않은 도메인에서 접근 시도: ${hostname}`);
		throw new Error('Unauthorized domain access');
	}

	return true;
}

export async function connectDB(request?: Request) {
	if (isConnected) {
		console.log('✅ MongoDB에 이미 연결되어 있습니다.');
		return;
	}

	console.log('🔍 MongoDB 연결 시작...');
	console.log('🔍 Vercel 환경 체크:', isVercelEnvironment());

	// 환경 및 도메인 검증
	try {
		validateEnvironment(request);
		console.log('✅ 도메인 검증 통과');
	} catch (error) {
		console.error('❌ 도메인 검증 실패:', error);
		throw error;
	}

	try {
		const options = getMongoOptions();
		console.log('🔍 MongoDB 연결 옵션:', { 
			ssl: options.ssl,
			authSource: options.authSource 
		});
		
		await mongoose.connect(PRIVATE_MONGODB_URI || 'mongodb://localhost:27017/sveltekit-app', options);
		isConnected = true;
		
		console.log('✅ MongoDB에 성공적으로 연결되었습니다.');
		
		// 개발 환경에서만 상세 정보 표시
		if (process.env.NODE_ENV === 'development') {
			console.log('🔍 연결된 데이터베이스:', mongoose.connection.name);
			console.log('🔍 Vercel 환경:', isVercelEnvironment());
		}
	} catch (error) {
		console.error('❌ MongoDB 연결 실패:', error);
		if (error instanceof Error) {
			console.error('❌ 에러 메시지:', error.message);
			console.error('❌ 에러 스택:', error.stack);
		}
		throw error;
	}
}

export async function disconnectDB() {
	if (!isConnected) {
		return;
	}

	try {
		await mongoose.disconnect();
		isConnected = false;
		console.log('MongoDB 연결이 해제되었습니다.');
	} catch (error) {
		console.error('MongoDB 연결 해제 실패:', error);
		throw error;
	}
}

// 연결 이벤트 리스너
mongoose.connection.on('connected', () => {
	console.log('Mongoose가 MongoDB에 연결되었습니다.');
});

mongoose.connection.on('error', (error) => {
	console.error('Mongoose 연결 오류:', error);
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose가 MongoDB에서 연결 해제되었습니다.');
	isConnected = false;
}); 