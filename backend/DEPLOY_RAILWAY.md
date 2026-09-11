# GigLine Backend — Railway Deployment Guide

## Step 1: Create MongoDB Atlas (Free Tier)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Sign up (free)
2. Create a **free M0 cluster** (AWS, US East)
3. Set a database username/password (save these!)
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allows Railway to connect)
5. Click **Connect** → **Drivers** → Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add your database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigline?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Click **New Project** → **Deploy from GitHub Repo**
3. Select your `giglinesite` repo
4. Railway will auto-detect the project. Click **Settings** on the service:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

5. Go to **Variables** tab and add these environment variables:

```
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigline?retryWrites=true&w=majority
DB_NAME=gigline
STRIPE_API_KEY=sk_live_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
RESEND_API_KEY=re_your_resend_key_here
SENDER_EMAIL=vince@giglinecompliance.com
VINCE_EMAIL=vince@giglinecompliance.com
ADMIN_PASSWORD=gigline2026
CORS_ORIGINS=https://www.giglinecompliance.com,https://giglinecompliance.com
```

6. Railway will auto-deploy. You'll get a URL like: `https://gigline-backend-production.up.railway.app`

   Once you have this URL, go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**, set the
   endpoint URL to `https://your-railway-url.up.railway.app/api/webhook/stripe`, and select the
   `checkout.session.completed` event. Stripe will give you a signing secret (`whsec_...`) — copy it
   into the `STRIPE_WEBHOOK_SECRET` Railway variable above. Without this, incoming webhooks are
   rejected (the endpoint refuses to trust unsigned payloads).

## Step 3: Generate a Public Domain (Optional)

In Railway → Settings → **Networking** → **Generate Domain**
This gives you a clean URL like `gigline-backend.up.railway.app`

## Step 4: Update Vercel Frontend

In your Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add or update: `REACT_APP_BACKEND_URL` = `https://your-railway-url.up.railway.app`
3. **Redeploy** the frontend

## Step 5: Verify

After deploy, test:
- `https://your-railway-url.up.railway.app/api/health` → should return `{"status":"ok"}`
- Submit the walkthrough form on your live site
- Check the admin dashboard at `/admin`

## Environment Variables Reference

| Variable | Where to Get It |
|---|---|
| MONGO_URL | MongoDB Atlas → Connect → Drivers |
| DB_NAME | `gigline` (your database name) |
| STRIPE_API_KEY | Stripe Dashboard → API Keys |
| STRIPE_WEBHOOK_SECRET | Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret |
| RESEND_API_KEY | Resend Dashboard → API Keys |
| SENDER_EMAIL | Your verified Resend domain email |
| VINCE_EMAIL | Where lead notifications go |
| ADMIN_PASSWORD | Your admin dashboard password |
| CORS_ORIGINS | Your production frontend domains |

## Cost

- **MongoDB Atlas M0**: Free (512MB storage)
- **Railway Starter**: $5/month (includes 500 hours, $5 credit)
- Both are more than enough for GigLine's current traffic
