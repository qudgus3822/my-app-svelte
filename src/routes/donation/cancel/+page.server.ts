import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { connectDB } from '$lib/db';
import { Donation } from '$lib/models/Donation';

export const load: PageServerLoad = async ({ cookies }) => {
	const orderId = cookies.get('orderId');
	const tid = cookies.get('tid');

	if (!orderId || !tid) {
		throw redirect(302, '/donation?error=invalid_session');
	}

	try {
		await connectDB();

		// 결제 취소로 인한 상태 업데이트
		const donation = await Donation.findOneAndUpdate(
			{ orderId, tid },
			{ 
				status: 'cancelled',
				updatedAt: new Date()
			},
			{ new: true }
		);

		// 쿠키 삭제
		cookies.delete('tid', { path: '/' });
		cookies.delete('orderId', { path: '/' });
		cookies.delete('userId', { path: '/' });

		console.log('결제 취소됨:', { orderId, tid });

		return {
			donation: {
				orderId: donation?.orderId || orderId,
				amount: donation?.amount || 0,
				userName: donation?.userName || '',
				cancelledAt: new Date()
			}
		};
	} catch (error) {
		console.error('결제 취소 처리 오류:', error);
		
		// 쿠키 삭제
		cookies.delete('tid', { path: '/' });
		cookies.delete('orderId', { path: '/' });
		cookies.delete('userId', { path: '/' });

		return {
			donation: {
				orderId: orderId,
				amount: 0,
				userName: '',
				cancelledAt: new Date()
			}
		};
	}
}; 