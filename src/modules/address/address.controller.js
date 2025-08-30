import Address from './address.model.js';

export async function getAddresses(req, res, next) {
  try {
    let addr = await Address.findOne({ userId: req.user.sub }).lean();
    if (!addr) addr = await Address.create({ userId: req.user.sub, addresses: [] });
    res.json(addr.addresses);
  } catch (e) { next(e); }
}

export async function addAddress(req, res, next) {
  try {
    let addr = await Address.findOne({ userId: req.user.sub });
    if (!addr) addr = await Address.create({ userId: req.user.sub, addresses: [] });
    addr.addresses.push(req.body);
    await addr.save();
    res.status(201).json(addr.addresses);
  } catch (e) { next(e); }
}

export async function updateAddress(req, res, next) {
  try {
    let addr = await Address.findOne({ userId: req.user.sub });
    if (!addr) return res.status(404).json({ message: 'Not found' });
    const address = addr.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Not found' });
    Object.assign(address, req.body);
    await addr.save();
    res.json(addr.addresses);
  } catch (e) { next(e); }
}

export async function deleteAddress(req, res, next) {
  try {
    let addr = await Address.findOne({ userId: req.user.sub });
    if (!addr) return res.status(404).json({ message: 'Not found' });
    addr.addresses = addr.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await addr.save();
    res.json(addr.addresses);
  } catch (e) { next(e); }
}
