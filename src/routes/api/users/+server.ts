import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { connectDB } from '$lib/db';
import { User } from '$lib/models/User';

// 사용자 목록 조회 (GET)
export const GET: RequestHandler = async ({ url }) => {
	try {
		await connectDB();

		const page = parseInt(url.searchParams.get('page') ?? '1');
		const limit = parseInt(url.searchParams.get('limit') ?? '10');
		const skip = (page - 1) * limit;

		const users = await User.find({})
			.select('-password') // 비밀번호 제외
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		const total = await User.countDocuments();

		return json({
			users,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		console.error('사용자 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
};

// 새 사용자 생성 (POST)
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password, name } = await request.json();

		// 유효성 검사
		if (!email || !password) {
			return json({ error: '이메일과 비밀번호는 필수입니다.' }, { status: 400 });
		}

		await connectDB();

		// 이미 존재하는 사용자 확인
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return json({ error: '이미 가입된 이메일입니다.' }, { status: 400 });
		}

		// 새 사용자 생성
		const newUser = new User({
			email: email.toLowerCase(),
			password,
			name
		});

		await newUser.save();

		// 응답에서 비밀번호 제외
		const userResponse = newUser.toJSON();

		return json({ user: userResponse }, { status: 201 });
	} catch (error) {
		console.error('사용자 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}; 