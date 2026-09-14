import { listGigs, createGig } from '../models/Gig.js';

const CATEGORIES = ['Design', 'Repairs', 'Writing', 'Dev', 'Tutoring'];

export async function getGigs(req, res) {
  try {
    const gigs = await listGigs();
    res.json(gigs);
  } catch (err) {
    console.error('List gigs error:', err);
    res.status(500).json({ message: 'Something went wrong listing gigs' });
  }
}

export async function postGig(req, res) {
  try {
    const { title, category, description, price, delivery } = req.body;

    if (!title || !description || !delivery) {
      return res.status(400).json({ message: 'Title, description and delivery are required' });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${CATEGORIES.join(', ')}` });
    }
    const priceNgn = Number(price);
    if (!Number.isInteger(priceNgn) || priceNgn < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number in ₦' });
    }

    const gig = await createGig({
      providerId: req.user.userId,
      title: title.trim(),
      category,
      description: description.trim(),
      priceNgn,
      deliveryDays: delivery.trim(),
    });
    res.status(201).json(gig);
  } catch (err) {
    console.error('Create gig error:', err);
    res.status(500).json({ message: 'Something went wrong creating your gig' });
  }
}