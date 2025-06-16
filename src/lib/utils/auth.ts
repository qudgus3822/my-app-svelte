import bcrypt from 'bcryptjs';
import { User, type IUser } from '$lib/models/User';
import { connectDB } from '$lib/db';

/**
 * 비밀번호 해시화
 */
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 12;
	return await bcrypt.hash(password, saltRounds);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}

/**
 * 이메일로 사용자 조회
 */
export async function getUserByEmail(email: string): Promise<IUser | null> {
	await connectDB();
	return await User.findOne({ email: email.toLowerCase() });
}

/**
 * ID로 사용자 조회
 */
export async function getUserById(id: string): Promise<IUser | null> {
	await connectDB();
	return await User.findById(id).select('-password');
}

/**
 * 새 사용자 생성
 */
export async function createUser(userData: {
	email: string;
	password: string;
	name?: string;
}): Promise<IUser> {
	await connectDB();
	
	const hashedPassword = await hashPassword(userData.password);
	
	const newUser = new User({
		email: userData.email.toLowerCase(),
		password: hashedPassword,
		name: userData.name
	});

	return await newUser.save();
}

/**
 * 사용자 정보 업데이트
 */
export async function updateUser(
	id: string,
	updateData: Partial<Pick<IUser, 'name' | 'email'>>
): Promise<IUser | null> {
	await connectDB();
	
	return await User.findByIdAndUpdate(
		id,
		{ ...updateData, updatedAt: new Date() },
		{ new: true, runValidators: true }
	).select('-password');
}

/**
 * 사용자 삭제
 */
export async function deleteUser(id: string): Promise<boolean> {
	await connectDB();
	
	const result = await User.findByIdAndDelete(id);
	return !!result;
} 