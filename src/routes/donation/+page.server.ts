import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { connectDB } from '$lib/db';
import { Donation } from '$lib/models/Donation';
import { kakaoPayService } from '$lib/services/kakaoPayService';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		
		const userName = data.get('userName');
		const userEmail = data.get('userEmail');
		const amount = data.get('amount');
		const message = data.get('message');

		// 기본 유효성 검사
		if (!userName || !userEmail || !amount) {
			return fail(400, {
				error: '이름, 이메일, 후원 금액은 필수입니다.',
				userName: userName?.toString(),
				userEmail: userEmail?.toString(),
				amount: amount?.toString(),
				message: message?.toString()
			});
		}

		if (typeof userName !== 'string' || typeof userEmail !== 'string' || 
		    typeof amount !== 'string') {
			return fail(400, {
				error: '잘못된 입력 형식입니다.',
				userName: userName?.toString(),
				userEmail: userEmail?.toString(),
				amount: amount?.toString(),
				message: message?.toString()
			});
		}

		// 이메일 형식 검사
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(userEmail)) {
			return fail(400, {
				error: '올바른 이메일 형식을 입력해주세요.',
				userName,
				userEmail,
				amount,
				message: message?.toString()
			});
		}

		// 이름 길이 검사
		if (userName.trim().length < 2) {
			return fail(400, {
				error: '이름은 최소 2자 이상이어야 합니다.',
				userName,
				userEmail,
				amount,
				message: message?.toString()
			});
		}

		// 금액 유효성 검사
		const amountNumber = parseInt(amount);
		if (isNaN(amountNumber) || amountNumber < 1000 || amountNumber > 1000000) {
			return fail(400, {
				error: '후원 금액은 1,000원 이상 1,000,000원 이하여야 합니다.',
				userName,
				userEmail,
				amount,
				message: message?.toString()
			});
		}

		try {
			// MongoDB 연결
			await connectDB();

			// 후원 요청 데이터 준비
			const donationRequest = {
				userName: userName.trim(),
				userEmail: userEmail.toLowerCase(),
				amount: amountNumber,
				message: message?.toString() || undefined
			};

			// 카카오페이 결제 준비
			const kakaoPayResponse = await kakaoPayService.ready(donationRequest);

			// 임시 후원 데이터 저장 (결제 완료 전)
			const orderId = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
			const donation = new Donation({
				userName: donationRequest.userName,
				userEmail: donationRequest.userEmail,
				amount: donationRequest.amount,
				message: donationRequest.message,
				tid: kakaoPayResponse.tid,
				orderId: orderId,
				status: 'pending'
			});

			await donation.save();

			// 세션에 결제 정보 저장
			cookies.set('donation_tid', kakaoPayResponse.tid, { 
				path: '/', 
				maxAge: 60 * 15, // 15분
				httpOnly: true 
			});
			cookies.set('donation_order_id', orderId, { 
				path: '/', 
				maxAge: 60 * 15, // 15분
				httpOnly: true 
			});
			cookies.set('donation_user_id', donationRequest.userEmail, { 
				path: '/', 
				maxAge: 60 * 15, // 15분
				httpOnly: true 
			});

			console.log('카카오페이 결제 준비 성공:', {
				tid: kakaoPayResponse.tid,
				orderId,
				amount: amountNumber
			});

			// 카카오페이 결제 페이지로 리다이렉트
			throw redirect(303, kakaoPayResponse.next_redirect_pc_url);

		} catch (error) {
			console.error('후원 처리 중 오류:', error);
			
			// redirect 오류는 다시 throw
			if (error instanceof Response) {
				throw error;
			}
			
			return fail(500, {
				error: '서버 오류가 발생했습니다. 다시 시도해주세요.',
				userName,
				userEmail,
				amount,
				message: message?.toString()
			});
		}
	}
}; 