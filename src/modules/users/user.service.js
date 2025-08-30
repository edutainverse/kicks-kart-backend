import User from './user.model.js';

export async function list() { return User.find().lean(); }
export async function updateRole(id, role) { return User.findByIdAndUpdate(id, { role }, { new: true }).lean(); }

export async function getById(id) {
	const user = await User.findById(id).lean();
	if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
	delete user.passwordHash;
	return user;
}

export async function updateProfile(id, data) {
	const { name, email } = data;
	const user = await User.findByIdAndUpdate(id, { name, email }, { new: true }).lean();
	if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
	delete user.passwordHash;
	return user;
}

import { hashPassword, comparePassword } from '../../utils/crypto.js';
export async function changePassword(id, { oldPassword, newPassword }) {
	const user = await User.findById(id);
	if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
	const ok = await comparePassword(oldPassword, user.passwordHash);
	if (!ok) throw Object.assign(new Error('Old password incorrect'), { status: 400 });
	user.passwordHash = await hashPassword(newPassword);
	await user.save();
	return { success: true };
}
