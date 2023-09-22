export default function handler(req, res) {
  const {method } = req;
  res.status(200).json({ name: 'John Doe' })
}
