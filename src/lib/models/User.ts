import mongoose, { Schema, model, type Document } from 'mongoose';

// 사용자 인터페이스 정의
export interface IUser extends Document {
	email: string;
	password: string;
	name?: string;
	age?: number;
	createdAt: Date;
	updatedAt: Date;
}

// 사용자 스키마 정의
const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: [true, '이메일은 필수입니다'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '올바른 이메일 형식을 입력해주세요']
		},
		password: {
			type: String,
			required: [true, '비밀번호는 필수입니다'],
			minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
		},
		name: {
			type: String,
			trim: true,
			maxlength: [50, '이름은 50자를 초과할 수 없습니다']
		},
		age: {
			type: Number,
			min: [1, '나이는 1세 이상이어야 합니다'],
			max: [150, '나이는 150세를 초과할 수 없습니다']
		}
	},
	{
		timestamps: true, // createdAt, updatedAt 자동 생성
		toJSON: {
			transform: function (doc, ret) {
				delete ret.password; // JSON 변환 시 비밀번호 제외
				return ret;
			}
		}
	}
);

// 이메일 인덱스 생성
userSchema.index({ email: 1 });

// 사용자 모델 생성 (이미 존재하는 경우 기존 모델 사용)
export const User = mongoose.models.User || model<IUser>('User', userSchema); 