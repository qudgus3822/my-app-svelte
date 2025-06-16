import mongoose, { Schema, model, type Document } from 'mongoose';

// 후원 인터페이스 정의
export interface IDonation extends Document {
	userId?: string;
	userName: string;
	userEmail: string;
	amount: number;
	message?: string;
	tid: string; // 카카오페이 거래 ID
	orderId: string; // 주문 ID
	status: 'pending' | 'completed' | 'cancelled' | 'failed';
	paymentMethod: string;
	createdAt: Date;
	updatedAt: Date;
	completedAt?: Date;
}

// 후원 스키마 정의
const donationSchema = new Schema<IDonation>(
	{
		userId: {
			type: String,
			ref: 'User'
		},
		userName: {
			type: String,
			required: [true, '후원자 이름은 필수입니다'],
			trim: true,
			maxlength: [50, '이름은 50자를 초과할 수 없습니다']
		},
		userEmail: {
			type: String,
			required: [true, '이메일은 필수입니다'],
			lowercase: true,
			trim: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '올바른 이메일 형식을 입력해주세요']
		},
		amount: {
			type: Number,
			required: [true, '후원 금액은 필수입니다'],
			min: [1000, '최소 후원 금액은 1,000원입니다'],
			max: [1000000, '최대 후원 금액은 1,000,000원입니다']
		},
		message: {
			type: String,
			trim: true,
			maxlength: [500, '메시지는 500자를 초과할 수 없습니다']
		},
		tid: {
			type: String,
			required: [true, '거래 ID는 필수입니다']
		},
		orderId: {
			type: String,
			required: [true, '주문 ID는 필수입니다'],
			unique: true
		},
		status: {
			type: String,
			enum: ['pending', 'completed', 'cancelled', 'failed'],
			default: 'pending'
		},
		paymentMethod: {
			type: String,
			default: 'kakao_pay'
		},
		completedAt: {
			type: Date
		}
	},
	{
		timestamps: true, // createdAt, updatedAt 자동 생성
		toJSON: {
			transform: function (doc, ret) {
				return ret;
			}
		}
	}
);

// 인덱스 생성
donationSchema.index({ userEmail: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ orderId: 1 });
donationSchema.index({ tid: 1 });

// 후원 모델 생성 (이미 존재하는 경우 기존 모델 사용)
export const Donation = mongoose.models.Donation || model<IDonation>('Donation', donationSchema); 