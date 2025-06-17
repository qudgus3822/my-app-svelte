import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/db';
import { Donation } from '$lib/models/Donation';
import { kakaoPayService } from '$lib/services/kakaoPayService';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const pgToken = url.searchParams.get('pg_token');

	if (!pgToken) {
		throw redirect(303, '/donation?error=결제 정보가 없습니다.');
	}

	const tid = cookies.get('donation_tid');
	const orderId = cookies.get('donation_order_id');
	const userId = cookies.get('donation_user_id');

	if (!tid || !orderId || !userId) {
		throw redirect(303, '/donation?error=결제 세션이 만료되었습니다.');
	}

	try {
		await connectDB();

		// 카카오페이 결제 승인
		const approveResponse = await kakaoPayService.approve(tid, pgToken, orderId, userId);

		// 후원 데이터 업데이트
		const donation = await Donation.findOneAndUpdate(
			{ tid, orderId, status: 'pending' },
			{
				status: 'completed',
				completedAt: new Date()
			},
			{ new: true }
		);

		if (!donation) {
			throw redirect(303, '/donation?error=후원 정보를 찾을 수 없습니다.');
		}

		// 쿠키 삭제
		cookies.delete('donation_tid', { path: '/' });
		cookies.delete('donation_order_id', { path: '/' });
		cookies.delete('donation_user_id', { path: '/' });

		console.log('후원 완료:', {
			donationId: donation._id,
			amount: donation.amount,
			userName: donation.userName,
			aid: approveResponse.aid
		});

		return {
			success: true,
			donation: {
				_id: donation._id.toString(),
				userName: donation.userName,
				userEmail: donation.userEmail,
				amount: donation.amount,
				message: donation.message,
				completedAt: donation.completedAt?.toISOString(),
				orderId: donation.orderId
			},
			paymentInfo: {
				aid: approveResponse.aid,
				paymentMethod: approveResponse.payment_method_type,
				approvedAt: approveResponse.approved_at
			}
		};
	} catch (error) {
		console.error('결제 승인 오류:', error);

		// 실패한 후원 데이터 업데이트
		try {
			await Donation.findOneAndUpdate({ tid, orderId }, { status: 'failed' });
		} catch (updateError) {
			console.error('후원 상태 업데이트 오류:', updateError);
		}

		// 쿠키 삭제
		cookies.delete('donation_tid', { path: '/' });
		cookies.delete('donation_order_id', { path: '/' });
		cookies.delete('donation_user_id', { path: '/' });

		throw redirect(303, '/donation/fail?error=결제 승인 중 오류가 발생했습니다.');
	}
};
