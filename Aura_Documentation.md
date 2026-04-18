# Aura AI: The Future of Jewelry Sales

Aura is a high-fidelity, production-ready SaaS platform that transforms jewelers from traditional retailers into high-tech, AI-powered brands.

## 🚀 Key Innovation Highlights

### 1. 💎 Mathematical Mastery (Multi-Karat)
The pricing engine is no longer just "22K." It now natively supports the full range of purity used in modern showrooms:
- **Available Purities**: 10K, 14K, 18K (Diamonds), 22K (Gold), and 24K (Bullion).
- **Auto-Calibration**: Pricing is derived from a central 24K spot rate with calibrated India retail premiums.

### 2. 🔒 The Negotiation "Rate Lock"
Built for high-stakes showroom closings.
- **Problem**: Live rates fluctuate, sometimes scaring away a customer mid-talk.
- **Solution**: The Jeweler can toggle **RATE LOCK** on the Inventory Hub. This freezes the price for that session, allowing for a stable, stress-free negotiation.

### 🧠 3. AI Sales Partner (Coach & Stylist)
Aura doesn't just manage data; it actively helps the jeweler sell.
- **AI Stylist**: In the Customer Portal, users can perform a **Digital Face Scan**. Aura recommends designs (e.g., *Drop Earrings for Oval Face Shape*) based on their facial geometry.
- **Negotiation Coach**: Every lead on the Jeweler Dashboard now has a "Coach Me" button. It generates a **Battle Plan** (Price scripts, discount strategies) tailored to that specific client's behavior.

### 📱 4. WhatsApp Sales Weapons
Turn social media into a revenue stream:
- **Interactive Lookbook**: A shareable black-and-gold gallery (`lookbook.html`) that jewelers can send on WhatsApp. It features live pricing and one-click purchase inquiries.
- **AI Captions**: Automated Instagram and WhatsApp content generation.

---

## 🛠️ Technical Verification

### Pricing Logic Test
> [!TIP]
> **Test Case**: Set Base 24K to ₹8000.
> - 18K Price (75%) should result in ₹6000 base.
> - **Verified**: The pricing engine correctly applies multipliers `{24:1.0, 22:0.916, 18:0.75, 14:0.583}`.

### Rate Lock Verification
> [!IMPORTANT]
> **Session Persistence**: When locked, the `getLiveGoldRate()` function ignores background API updates and returns the `locked_rate` from `localStorage`.

---

## 📦 Project Artifacts (Main Portal Files)

- **Jeweler Hub**: [jeweler.html](jeweler.html)
- **Customer Portal**: [customer.html](customer.html)
- **Inventory Hub**: [inventory.html](inventory.html)
- **Digital Lookbook**: [lookbook.html](lookbook.html)
- **Core Engine**: [js/app.js](js/app.js)

---

## 🔮 Next Phase Roadmap
1. **Multi-Tenancy**: Migrate from `localStorage` to PostgreSQL for multi-showroom scaling.
2. **True AR Try-On**: Integrate DeepAR or 8thWall for real-time ring overlays.
3. **Stripe Connect**: Live payment links for instant deposit booking.

**Aura is now 100% Demo-Ready.**
