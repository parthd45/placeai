# 🚀 Deploy PlaceAI to firstplacewise.tech

## Step-by-Step Deployment Guide

### 1️⃣ Update Supabase Configuration (5 minutes)

#### A. Add Custom Domain to Supabase

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/igilmfqfxsiaggkgkwoq/settings/auth

2. **Update Redirect URLs:**
   - Scroll to "Redirect URLs"
   - Add these URLs:
     ```
     https://firstplacewise.tech
     https://firstplacewise.tech/index.html
     https://www.firstplacewise.tech
     https://www.firstplacewise.tech/index.html
     ```

3. **Update Site URL:**
   - Set Site URL to: `https://firstplacewise.tech`

4. **Save Changes**

---

### 2️⃣ Deploy Your Files

#### Option A: Using Netlify (Recommended - Free & Easy)

1. **Install Netlify CLI:**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```powershell
   netlify login
   ```

3. **Deploy:**
   ```powershell
   cd D:\placewiseupdated\PlaceAI-source
   netlify deploy --prod
   ```

4. **Follow prompts:**
   - Create new site: Yes
   - Publish directory: `.` (current directory)

5. **Add Custom Domain:**
   - Go to Netlify Dashboard → Domain Settings
   - Add custom domain: `firstplacewise.tech`
   - Follow DNS configuration instructions

#### Option B: Using Vercel (Alternative)

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Deploy:**
   ```powershell
   cd D:\placewiseupdated\PlaceAI-source
   vercel --prod
   ```

3. **Add Custom Domain:**
   - Go to Vercel Dashboard → Settings → Domains
   - Add: `firstplacewise.tech`

#### Option C: Traditional Hosting (cPanel, etc.)

1. **Upload all files via FTP/SFTP:**
   - Upload entire `PlaceAI-source` folder to public_html/
   - Make sure all files are in root or subdirectory

2. **Point your domain:**
   - Update DNS A record to point to your server IP
   - Or update nameservers if using hosting provider's DNS

---

### 3️⃣ Configure DNS (Your Domain Registrar)

Go to your domain registrar where you bought `firstplacewise.tech`:

#### For Netlify:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site].netlify.app
```

#### For Vercel:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

### 4️⃣ Update OAuth Redirect URLs (If Using Social Login)

#### For Google OAuth:
1. Go to: https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client
4. Add Authorized redirect URIs:
   ```
   https://igilmfqfxsiaggkgkwoq.supabase.co/auth/v1/callback
   https://firstplacewise.tech/index.html
   ```

#### For Facebook OAuth:
1. Go to: https://developers.facebook.com/
2. Your App → Settings → Basic
3. Add Valid OAuth Redirect URIs:
   ```
   https://igilmfqfxsiaggkgkwoq.supabase.co/auth/v1/callback
   https://firstplacewise.tech/index.html
   ```

---

### 5️⃣ Verify Deployment

After deployment, test these:

- [ ] Visit https://firstplacewise.tech
- [ ] Test registration: https://firstplacewise.tech/register.html
- [ ] Test login: https://firstplacewise.tech/login.html
- [ ] Check email verification works
- [ ] Test social login (if configured)

---

## 🔒 Security Checklist

Before going live:

- [ ] Enable HTTPS (SSL certificate)
- [ ] Update Supabase redirect URLs
- [ ] Test all authentication flows
- [ ] Verify email verification works
- [ ] Check user profiles are created in database
- [ ] Test on mobile devices
- [ ] Clear browser cache and test fresh

---

## 📊 Quick Deploy Commands

### Deploy to Netlify:
```powershell
cd D:\placewiseupdated\PlaceAI-source
netlify deploy --prod
```

### Deploy to Vercel:
```powershell
cd D:\placewiseupdated\PlaceAI-source
vercel --prod
```

### Or manually upload all files to your hosting via FTP

---

## 🆘 Troubleshooting

### Issue: "Redirect URL not allowed"
**Fix:** Add your domain to Supabase Auth settings → Redirect URLs

### Issue: OAuth not working
**Fix:** Update OAuth redirect URLs in Google/Facebook console

### Issue: 404 errors
**Fix:** Make sure all files are in the root directory of your domain

### Issue: Backend not connecting
**Fix:** 
1. Open browser console (F12)
2. Check if Supabase URL and key are loaded
3. Verify localStorage has credentials

---

## ✅ Post-Deployment

Your site will be live at:
- https://firstplacewise.tech
- https://www.firstplacewise.tech (with www)

Users can:
- ✅ Register at: https://firstplacewise.tech/register.html
- ✅ Login at: https://firstplacewise.tech/login.html
- ✅ Access dashboard at: https://firstplacewise.tech/index.html

---

## 🚀 Which hosting do you prefer?

**Netlify** - Free, easy, automatic deployments
**Vercel** - Free, fast, good for modern apps
**Traditional Hosting** - cPanel, FTP upload

Choose one and I'll help you deploy!
