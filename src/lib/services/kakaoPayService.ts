import axios from 'axios';
import { KAKAO_PAY_ADMIN_KEY, KAKAO_PAY_CID, KAKAO_PAY_BASE_URL } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

// 카카오페이 API 응답 타입들
export interface KakaoPayReadyResponse {
	tid: string;
	next_redirect_app_url: string;
	next_redirect_mobile_url: string;
	next_redirect_pc_url: string;
	android_app_scheme: string;
	ios_app_scheme: string;
	created_at: string;
}

export interface KakaoPayApproveResponse {
	aid: string;
	tid: string;
	cid: string;
	sid?: string;
	partner_order_id: string;
	partner_user_id: string;
	payment_method_type: string;
	amount: {
		total: number;
		tax_free: number;
		vat: number;
		point: number;
		discount: number;
		green_deposit: number;
	};
	card_info?: {
		kakaopay_purchase_corp: string;
		kakaopay_purchase_corp_code: string;
		kakaopay_issuer_corp: string;
		kakaopay_issuer_corp_code: string;
		bin: string;
		card_type: string;
		install_month: string;
		approved_id: string;
		card_mid: string;
		interest_free_install: string;
		installment_type: string;
		card_item_code: string;
	};
	item_name: string;
	item_code?: string;
	quantity: number;
	created_at: string;
	approved_at: string;
	payload?: string;
}

export interface DonationRequest {
	userId?: string;
	userName: string;
	userEmail: string;
	amount: number;
	message?: string;
}

class KakaoPayService {
	private baseURL = KAKAO_PAY_BASE_URL;
	private adminKey = KAKAO_PAY_ADMIN_KEY;
	private cid = KAKAO_PAY_CID;

	private getHeaders() {
		return {
			'Authorization': `KakaoAK ${this.adminKey}`,
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		};
	}

	// 결제 준비 (Ready)
	async ready(donationData: DonationRequest): Promise<KakaoPayReadyResponse> {
		const orderId = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		
		const params = new URLSearchParams({
			cid: this.cid,
			partner_order_id: orderId,
			partner_user_id: donationData.userEmail,
			item_name: '후원금',
			quantity: '1',
			total_amount: donationData.amount.toString(),
			tax_free_amount: '0',
			approval_url: `${PUBLIC_BASE_URL}/donation/success`,
			cancel_url: `${PUBLIC_BASE_URL}/donation/cancel`,
			fail_url: `${PUBLIC_BASE_URL}/donation/fail`
		});

		try {
			const response = await axios.post(
				`${this.baseURL}/v1/payment/ready`,
				params,
				{ headers: this.getHeaders() }
			);

			return response.data;
		} catch (error) {
			console.error('카카오페이 결제 준비 오류:', error);
			throw new Error('결제 준비 중 오류가 발생했습니다.');
		}
	}

	// 결제 승인 (Approve)
	async approve(tid: string, pgToken: string, partnerOrderId: string, partnerUserId: string): Promise<KakaoPayApproveResponse> {
		const params = new URLSearchParams({
			cid: this.cid,
			tid: tid,
			partner_order_id: partnerOrderId,
			partner_user_id: partnerUserId,
			pg_token: pgToken
		});

		try {
			const response = await axios.post(
				`${this.baseURL}/v1/payment/approve`,
				params,
				{ headers: this.getHeaders() }
			);

			return response.data;
		} catch (error) {
			console.error('카카오페이 결제 승인 오류:', error);
			throw new Error('결제 승인 중 오류가 발생했습니다.');
		}
	}

	// 결제 취소 (Cancel)
	async cancel(tid: string, cancelAmount: number, cancelTaxFreeAmount = 0) {
		const params = new URLSearchParams({
			cid: this.cid,
			tid: tid,
			cancel_amount: cancelAmount.toString(),
			cancel_tax_free_amount: cancelTaxFreeAmount.toString()
		});

		try {
			const response = await axios.post(
				`${this.baseURL}/v1/payment/cancel`,
				params,
				{ headers: this.getHeaders() }
			);

			return response.data;
		} catch (error) {
			console.error('카카오페이 결제 취소 오류:', error);
			throw new Error('결제 취소 중 오류가 발생했습니다.');
		}
	}
}

export const kakaoPayService = new KakaoPayService(); 