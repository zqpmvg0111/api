import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const cart = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.map(item => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name
        },
        unit_amount: item.price
      },
      quantity: item.qty
    })),
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel"
  });

  res.status(200).json({ url: session.url });
}