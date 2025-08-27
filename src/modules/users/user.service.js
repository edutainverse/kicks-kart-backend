import User from './user.model.js';

export async function list() { return User.find().lean(); }
export async function updateRole(id, role) { return User.findByIdAndUpdate(id, { role }, { new: true }).lean(); }
