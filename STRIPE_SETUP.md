# Stripe Configuration Guide

## 📋 Prerequisites

- Stripe account (sign up at https://stripe.com)
- TamagoTcheat development environment set up
- Access to `.env.local` file

## 🔑 Step 1: Get Stripe API Keys

### Development (Test Mode)

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Test Mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

### Add to Environment Variables

Create or edit `.env.local` in the project root:

```bash
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Base URL for redirects (development)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# MongoDB (if not already configured)
MONGODB_URI=your_mongodb_connection_string

# Better Auth (if not already configured)
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

## 🔔 Step 2: Configure Webhook

### Local Development with Stripe CLI

**Recommended for testing**

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
   ```bash
   # Windows (using Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   
   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe
   ```bash
   stripe login
   ```

3. Forward webhook events to local server
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`)
   ```
   Ready! Your webhook signing secret is whsec_...
   ```

5. Add to `.env.local`
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

6. **Keep the terminal running** while testing payments

### Production Webhook Setup

**For deployed applications**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Configure:
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - **Description**: "TamagoTcheat Koins Purchase Webhook"
   - **Events to send**: Select `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to production environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
   ```

## 🧪 Step 3: Test the Integration

### Using Stripe Test Cards

Stripe provides test card numbers for different scenarios:

| Card Number         | Scenario                  |
|---------------------|---------------------------|
| 4242 4242 4242 4242 | Successful payment        |
| 4000 0000 0000 9995 | Payment declined          |
| 4000 0025 0000 3155 | Requires authentication   |

Use any:
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any postal code

### Test Flow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Start Stripe CLI** (in another terminal)
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. **Trigger Test Payment**
   - Navigate to http://localhost:3000/wallet
   - Select a Koins package
   - Use test card `4242 4242 4242 4242`
   - Complete checkout

4. **Verify Success**
   - Check Stripe CLI terminal for webhook event
   - Verify redirect to `/wallet/success`
   - Confirm Koins balance updated
   - Check MongoDB for `user_profiles` update

### Expected Webhook Log

```
2024-01-15 10:30:45   --> checkout.session.completed [evt_xxx]
2024-01-15 10:30:45  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_xxx]
```

## 🚀 Step 4: Production Deployment

### Update Environment Variables

On your hosting platform (Vercel, Netlify, etc.):

1. Switch Stripe to **Live Mode**
2. Get production API keys:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`

3. Update base URL:
   ```bash
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

4. Configure production webhook (see "Production Webhook Setup" above)

5. Update `STRIPE_WEBHOOK_SECRET` with production value

### Security Checklist

- [ ] Never commit `.env.local` to git (already in `.gitignore`)
- [ ] Use different keys for test and production
- [ ] Rotate keys if exposed
- [ ] Enable webhook signature verification (already implemented)
- [ ] Use HTTPS in production (required by Stripe)
- [ ] Monitor webhook failures in Stripe Dashboard

## 🐛 Troubleshooting

### Webhook Not Receiving Events

**Problem**: Payment succeeds but Koins not credited

**Solutions**:
1. Check Stripe CLI is running: `stripe listen`
2. Verify webhook secret in `.env.local`
3. Check Next.js server logs for errors
4. Ensure route is `POST` at `/api/webhooks/stripe/route.ts`

### Signature Verification Failed

**Problem**: `Error: No signatures found matching the expected signature`

**Solutions**:
1. Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe CLI output
2. Restart Next.js server after changing env vars
3. Check webhook endpoint URL is correct
4. Verify raw body is being passed (Next.js handles this)

### Payment Succeeds but Redirect Fails

**Problem**: Stuck on checkout page after payment

**Solutions**:
1. Check `NEXT_PUBLIC_BASE_URL` is set correctly
2. Verify return URL in `stripe.actions.ts`
3. Check browser console for errors
4. Ensure `/wallet/success` page exists

### TypeScript Errors

**Problem**: Type errors in Stripe components

**Solutions**:
1. Run `npm install --save-dev @types/stripe`
2. Check `@stripe/react-stripe-js` version compatibility
3. Restart TypeScript server in VS Code

## 📚 Additional Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Reference](https://stripe.com/docs/stripe-cli)
- [Stripe API Reference](https://stripe.com/docs/api)

## 🎯 Quick Start (TL;DR)

```bash
# 1. Get API keys from Stripe Dashboard (Test Mode)
# 2. Add to .env.local:
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 3. Install Stripe CLI
scoop install stripe

# 4. Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 5. Copy webhook secret to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_...

# 6. Start dev server
npm run dev

# 7. Test at http://localhost:3000/wallet
# Use card: 4242 4242 4242 4242
```

## ✅ Verification Checklist

After setup, verify:
- [ ] Wallet page loads at `/wallet`
- [ ] Package cards display correctly
- [ ] Clicking "Buy Now" redirects to checkout
- [ ] Stripe checkout UI loads (embedded)
- [ ] Test payment completes successfully
- [ ] Webhook event received in Stripe CLI
- [ ] Koins credited to user account
- [ ] Success page displays with correct balance
- [ ] WalletDisplay in header updates

If all checks pass, your Stripe integration is complete! 🎉
