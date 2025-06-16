import mongoose from 'mongoose';
import { PRIVATE_MONGODB_URI } from '$env/static/private';

// MongoDB 연결 상태 추적
let isConnected = false;

export async function connectDB() {
	if (isConnected) {
		console.log('MongoDB에 이미 연결되어 있습니다.');
		return;
	}

	try {
		await mongoose.connect(PRIVATE_MONGODB_URI || 'mongodb://localhost:27017/sveltekit-app');
		isConnected = true;
		console.log('MongoDB에 성공적으로 연결되었습니다.');
	} catch (error) {
		console.error('MongoDB 연결 실패:', error);
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