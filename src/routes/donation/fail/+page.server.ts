import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/db';
import { Donation } from '$lib/models/Donation';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const orderId = cookies.get('orderId');
	const tid = cookies.get('tid');
	const errorMsg = url.searchParams.get('error') || '알 수 없는 오류가 발생했습니다';

	if (!orderId || !tid) {
		throw redirect(302, '/donation?error=invalid_session');
	}

	try {
		await connectDB();

		// 결제 실패로 인한 상태 업데이트
		const donation = await Donation.findOneAndUpdate(
			{ orderId, tid },
			{ 
				status: 'failed',
				updatedAt: new Date()
			},
			{ new: true }
		);

		// 쿠키 삭제
		cookies.delete('tid', { path: '/' });
		cookies.delete('orderId', { path: '/' });
		cookies.delete('userId', { path: '/' });

		console.log('결제 실패:', { orderId, tid, error: errorMsg });

		return {
			donation: {
				orderId: donation?.orderId || orderId,
				amount: donation?.amount || 0,
				userName: donation?.userName || '',
				failedAt: new Date()
			},
			error: errorMsg
		};
	} catch (error) {
		console.error('결제 실패 처리 오류:', error);
		
		// 쿠키 삭제
		cookies.delete('tid', { path: '/' });
		cookies.delete('orderId', { path: '/' });
		cookies.delete('userId', { path: '/' });

		return {
			donation: {
				orderId: orderId,
				amount: 0,
				userName: '',
				failedAt: new Date()
			},
			error: errorMsg
		};
	}
}; 