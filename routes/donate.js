const getStripe = () => {
  try {
    const Stripe = require('stripe');
    return new Stripe(process.env.STRIPE_SECRET_KEY);
  } catch (e) {
    console.error('Stripe Init Error:', e);
    return null;
  }
};

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.json({
      upi: !!process.env.UPI_ID,
      paypal: !!(process.env.PAYPAL_LINK || process.env.PAYPAL_EMAIL),
      stripe: !!process.env.STRIPE_SECRET_KEY,
      kofi: process.env.KO_FI_LINK,
      buymeacoffee: process.env.BUY_ME_A_COFFEE_LINK,
      patreon: process.env.PATREON_LINK,
      customLink: process.env.CUSTOM_DONATION_LINK || process.env.PAYSTACK_LINK || process.env.FLUTTERWAVE_LINK || process.env.RAZORPAY_LINK,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const customLink = process.env.CUSTOM_DONATION_LINK || 
                       process.env.BUY_ME_A_COFFEE_LINK || 
                       process.env.KO_FI_LINK ||
                       process.env.PATREON_LINK ||
                       process.env.PAYSTACK_LINK ||
                       process.env.FLUTTERWAVE_LINK ||
                       process.env.RAZORPAY_LINK;
    const upiId = process.env.UPI_ID;
    
    if (req.query.type === 'upi') {
      if (upiId) {
        return res.json({ upiId });
      } else {
        return res.status(400).json({ error: 'UPI ID is not configured.' });
      }
    }
    
    const paypalLink = process.env.PAYPAL_LINK || customLink;
    const paypalEmail = process.env.PAYPAL_EMAIL;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const { amount = 5, currency = 'USD' } = req.body || {}; 

    if (paypalLink) {
      return res.json({ url: paypalLink });
    }

    if (paypalEmail) {
      // If the user accidentally put a link instead of an email
      if (paypalEmail.startsWith('http') || paypalEmail.includes('paypal.me')) {
        let finalUrl = paypalEmail;
        if (!finalUrl.startsWith('http')) {
          finalUrl = 'https://' + finalUrl;
        }
        return res.json({ url: finalUrl });
      }

      const paypalUrl = new URL('https://www.paypal.com/cgi-bin/webscr');
      paypalUrl.searchParams.append('cmd', '_xclick');
      paypalUrl.searchParams.append('business', paypalEmail);
      paypalUrl.searchParams.append('item_name', 'Donation to FlexPlayer');
      paypalUrl.searchParams.append('currency_code', currency);
      paypalUrl.searchParams.append('amount', amount);
      paypalUrl.searchParams.append('return', `${req.headers.origin}?donation=success`);
      paypalUrl.searchParams.append('cancel_return', `${req.headers.origin}?donation=canceled`);
      
      return res.json({ url: paypalUrl.toString() });
    }

    if (stripeKey) {
      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({ error: 'Failed to initialize Stripe.' });
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'Donation to FlexPlayer',
                description: 'Thank you for your support!',
              },
              unit_amount: amount * 100, // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}?donation=success`,
        cancel_url: `${req.headers.origin}?donation=canceled`,
      });

      return res.json({ url: session.url });
    }

    res.status(500).json({ error: 'Payment gateway not configured. Please set PAYPAL_EMAIL or STRIPE_SECRET_KEY in the environment variables.' });

  } catch (error) {
    console.error('Donation error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process donation' });
  }
};
