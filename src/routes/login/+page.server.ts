import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { connectDB } from '$lib/db';
import { User } from '$lib/models/User';
import bcrypt from 'bcryptjs';
import { goto } from '$app/navigation';

export const load = async ({ locals }) => {
	const allUsers = await User.find().lean();

	// ObjectId를 문자열로 변환 - 명시적 필드 지정
	const serializedUsers = allUsers.map((user) => ({
		_id: (user._id as any).toString(),
		email: user.email,
		name: user.name,
		age: user.age,
		createdAt: user.createdAt?.toISOString(),
		updatedAt: user.updatedAt?.toISOString()
	}));

	return {
		test: 'test',
		userCount: allUsers.length,
		allUsers: serializedUsers
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const remember = data.get('remember');

		// 기본 유효성 검사
		if (!email || !password) {
			return fail(400, {
				error: '이메일과 비밀번호를 모두 입력해주세요.',
				email: email?.toString()
			});
		}

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				error: '잘못된 입력 형식입니다.',
				email: email?.toString()
			});
		}

		// 이메일 형식 검사
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: '올바른 이메일 형식을 입력해주세요.',
				email
			});
		}

		// 비밀번호 길이 검사
		if (password.length < 6) {
			return fail(400, {
				error: '비밀번호는 최소 6자 이상이어야 합니다.',
				email
			});
		}

		try {
			// 사용자 조회
			const user = await User.findOne({ email: email.toLowerCase() });

			if (!user) {
				return fail(400, {
					error: '이메일 또는 비밀번호가 올바르지 않습니다.',
					email
				});
			}

			// 비밀번호 검증
			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				return fail(400, {
					error: '이메일 또는 비밀번호가 올바르지 않습니다.',
					email
				});
			}

			// TODO: 세션 또는 JWT 토큰 설정
			console.log('로그인 성공:', { email, remember, userId: user._id });

			// goto('/sverdle');
			// 로그인 성공 시 리다이렉트
			return {
				success: true,
				message: '로그인이 완료되었습니다. 게임을 시작해보세요!'
			};
		} catch (error) {
			console.error('로그인 처리 중 오류:', error);

			// redirect 오류는 다시 throw
			if (error instanceof Response) {
				throw error;
			}

			return fail(500, {
				error: '서버 오류가 발생했습니다. 다시 시도해주세요.',
				email
			});
		}
	}
};
