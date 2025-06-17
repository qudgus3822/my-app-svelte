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
	orderId: string;
}

class KakaoPayService {
	private baseURL = KAKAO_PAY_BASE_URL;
	private adminKey = KAKAO_PAY_ADMIN_KEY;
	private cid = KAKAO_PAY_CID;

	private getHeaders() {
		return {
			Authorization: `SECRET_KEY ${this.adminKey}`,
			'Content-Type': 'application/json'
		};
	}

	// 결제 준비 (Ready)
	async ready(donationData: DonationRequest): Promise<KakaoPayReadyResponse> {
		// JSON 형태로 요청 데이터 준비 (공식 문서 기준)
		const requestData = {
			cid: this.cid,
			partner_order_id: donationData.orderId,
			partner_user_id: donationData.userEmail,
			item_name: '후원금',
			quantity: 1,
			total_amount: donationData.amount,
			tax_free_amount: 0,
			approval_url: `${PUBLIC_BASE_URL}/donation/success`,
			cancel_url: `${PUBLIC_BASE_URL}/donation/cancel`,
			fail_url: `${PUBLIC_BASE_URL}/donation/fail`
		};

		try {
			const response = await axios.post(`${this.baseURL}/online/v1/payment/ready`, requestData, {
				headers: this.getHeaders()
			});

			return response.data;
		} catch (error) {
			console.error('카카오페이 결제 준비 오류:', error);
			
			// axios 에러인 경우 더 자세한 정보 출력
			if (axios.isAxiosError(error)) {
				console.error('HTTP 상태 코드:', error.response?.status);
				console.error('응답 데이터:', error.response?.data);
				console.error('요청 URL:', error.config?.url);
				console.error('요청 헤더:', error.config?.headers);
				console.error('요청 데이터:', error.config?.data);
				
				// 카카오페이 API 에러 응답 확인
				if (error.response?.data) {
					const kakaoError = error.response.data;
					console.error('카카오페이 에러 코드:', kakaoError.error_code);
					console.error('카카오페이 에러 메시지:', kakaoError.error_message);
					throw new Error(
						`카카오페이 API 오류: [${kakaoError.error_code}] ${kakaoError.error_message}`
					);
				}
			}
			
			throw new Error('결제 준비 중 오류가 발생했습니다.');
		}
	}

	// 결제 승인 (Approve)
	async approve(
		tid: string,
		pgToken: string,
		partnerOrderId: string,
		partnerUserId: string
	): Promise<KakaoPayApproveResponse> {
		const requestData = {
			cid: this.cid,
			tid: tid,
			partner_order_id: partnerOrderId,
			partner_user_id: partnerUserId,
			pg_token: pgToken
		};

		try {
			const response = await axios.post(`${this.baseURL}/online/v1/payment/approve`, requestData, {
				headers: this.getHeaders()
			});

			return response.data;
		} catch (error) {
			console.error('카카오페이 결제 승인 오류:', error);
			throw new Error('결제 승인 중 오류가 발생했습니다.');
		}
	}

	// 결제 취소 (Cancel)
	async cancel(tid: string, cancelAmount: number, cancelTaxFreeAmount = 0) {
		const requestData = {
			cid: this.cid,
			tid: tid,
			cancel_amount: cancelAmount,
			cancel_tax_free_amount: cancelTaxFreeAmount
		};

		try {
			const response = await axios.post(`${this.baseURL}/online/v1/payment/cancel`, requestData, {
				headers: this.getHeaders()
			});

			return response.data;
		} catch (error) {
			console.error('카카오페이 결제 취소 오류:', error);
			throw new Error('결제 취소 중 오류가 발생했습니다.');
		}
	}
}

export const kakaoPayService = new KakaoPayService();
