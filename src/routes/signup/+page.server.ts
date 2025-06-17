import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { connectDB } from '$lib/db';
import { User } from '$lib/models/User';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		
		for (const [key, value] of data.entries()) {
			console.log(`${key}: ${value}`);
		}
		
		const email = data.get('email');
		const password = data.get('password');
		const confirmPassword = data.get('confirmPassword');
		const name = data.get('name');
		const age = data.get('age');

        console.log('개별 값들:', { email, password, confirmPassword, name, age });

		// 기본 유효성 검사
		if (!email || !password || !confirmPassword || !name || !age) {
			return fail(400, {
				error: '모든 필수 필드를 입력해주세요.',
				email: email?.toString(),
				name: name?.toString(),
				age: age?.toString()
			});
		}

		if (typeof email !== 'string' || typeof password !== 'string' || 
		    typeof confirmPassword !== 'string' || typeof name !== 'string' ||
		    typeof age !== 'string') {
			return fail(400, {
				error: '잘못된 입력 형식입니다.',
				email: email?.toString(),
				name: name?.toString(),
				age: age?.toString()
			});
		}

		// 이메일 형식 검사
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: '올바른 이메일 형식을 입력해주세요.',
				email,
				name,
				age
			});
		}

		// 이름 길이 검사
		if (name.trim().length < 2) {
			return fail(400, {
				error: '이름은 최소 2자 이상이어야 합니다.',
				email,
				name,
				age
			});
		}

		// 나이 유효성 검사
		const ageNumber = parseInt(age);
		if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 150) {
			return fail(400, {
				error: '올바른 나이를 입력해주세요. (1-150세)',
				email,
				name,
				age
			});
		}

		// 비밀번호 길이 검사
		if (password.length < 6) {
			return fail(400, {
				error: '비밀번호는 최소 6자 이상이어야 합니다.',
				email,
				name,
				age
			});
		}

		// 비밀번호 확인
		if (password !== confirmPassword) {
			return fail(400, {
				error: '비밀번호가 일치하지 않습니다.',
				email,
				name,
				age
			});
		}

		try {
			// MongoDB 연결
			await connectDB();

			// 이미 존재하는 사용자 확인
			const existingUser = await User.findOne({ email: email.toLowerCase() });
			
			if (existingUser) {
				return fail(400, {
					error: '이미 가입된 이메일입니다.',
					email,
					name,
					age
				});
			}

			// 비밀번호 해시화
			const saltRounds = 12;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			// 새 사용자 생성
			const newUser = new User({
				email: email.toLowerCase(),
				password: hashedPassword,
				name: name.trim(),
				age: ageNumber
			});

			await newUser.save();

			console.log('회원가입 성공:', { email, name, age: ageNumber, userId: newUser._id });
			
			// 회원가입 성공 시 성공 응답 반환
			return {
				success: true,
				message: '회원가입이 완료되었습니다. 로그인해주세요.',
				redirectTo: '/login'
			};

		} catch (error) {
			console.error('회원가입 처리 중 오류:', error);
			
			// redirect 오류는 다시 throw
			if (error instanceof Response) {
				throw error;
			}

			// MongoDB 중복 키 오류 처리
			if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
				return fail(400, {
					error: '이미 가입된 이메일입니다.',
					email,
					name,
					age
				});
			}
			
			return fail(500, {
				error: '서버 오류가 발생했습니다. 다시 시도해주세요.',
				email,
				name,
				age
			});
		}
	}
}; 