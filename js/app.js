// Mock Database using LocalStorage
const initializeDB = () => {
    if (!localStorage.getItem('jeweler_customers')) {
        // Generate a date 7 days from now for a milestone
        const milestoneDate = new Date();
        milestoneDate.setDate(milestoneDate.getDate() + 7);
        const eventDateStr = milestoneDate.toISOString().split('T')[0];

        localStorage.setItem('jeweler_customers', JSON.stringify([
            { id: 1, name: 'Aditi Sharma', phone: '9876543210', lastVisit: '2023-11-15', pref: 'Gold Necklaces', source: 'walkin', eventDate: eventDateStr, eventType: '10th Anniversary' },
            { id: 2, name: 'Rahul Desai', phone: '9123456780', lastVisit: '2023-12-05', pref: 'Wedding Rings', source: 'walkin', eventDate: null },
            { id: 3, name: 'Aditi Sharma (Dev)', phone: '9987917394', lastVisit: '2024-04-18', pref: 'High-End Polki', source: 'walkin', eventDate: null }
        ]));
    }
    if (!localStorage.getItem('jeweler_notifications')) {
        localStorage.setItem('jeweler_notifications', JSON.stringify([
            { id: 1, customerId: 'all', msg: '✨ Our new Wedding Collection is now curated for you.', type: 'moment' }
        ]));
    }
    if (!localStorage.getItem('jeweler_inventory')) {
        localStorage.setItem('jeweler_inventory', JSON.stringify([
            { id: 1, title: '22k Gold Chain', weightGrams: 15.5, marginType: 'percent', marginValue: 12 },
            { id: 2, title: 'Diamond Gold Ring', weightGrams: 5.2, marginType: 'fixed', marginValue: 1500 }
        ]));
    }
    if (!localStorage.getItem('jeweler_leads')) {
        localStorage.setItem('jeweler_leads', JSON.stringify([]));
    }
    if (!localStorage.getItem('jeweler_custom_requests')) {
        localStorage.setItem('jeweler_custom_requests', JSON.stringify([
            { id: 101, customerId: 1, customerName: 'Aditi Sharma', description: 'Modify heirloom necklace into two bracelets', status: 'CAD Review', quote: 45000 },
            { id: 102, customerId: 2, customerName: 'Rahul Desai', description: 'Platinum band with sapphire inlay', status: 'Pending Estimate', quote: null },
            { id: 103, customerId: 3, customerName: 'Neha Gupta', description: '22K Gold Choker, traditional design', status: 'Final Polish', quote: 185000 }
        ]));
    }
    if (!localStorage.getItem('jeweler_live_rate')) {
        localStorage.setItem('jeweler_live_rate', 7800); // Base 24k gold rate baseline
    }
    if (!localStorage.getItem('jeweler_acquisition_rate')) {
        localStorage.setItem('jeweler_acquisition_rate', 7650); // Simulated rate at time of purchase
    }
    if (!localStorage.getItem('jeweler_is_rate_locked')) {
        localStorage.setItem('jeweler_is_rate_locked', 'false');
    }
    if (!localStorage.getItem('aura_lifetime_stats')) {
        localStorage.setItem('aura_lifetime_stats', JSON.stringify({
            totalLeads: 42,
            totalRealized: 840000,
            marginProtected: 45000,
            joinDate: '2024-01-15'
        }));
    }
};

const getCustomers = () => JSON.parse(localStorage.getItem('jeweler_customers'));

const addCustomer = (name, phone, pref, source = 'walkin', eventDate = null, eventType = null) => {
    const customers = getCustomers();
    const newCustomer = {
        id: Date.now(),
        name,
        phone,
        lastVisit: new Date().toISOString().split('T')[0],
        pref,
        source,
        eventDate, // Wedding/Anniversary
        eventType // Extracted type
    };
    customers.push(newCustomer);
    localStorage.setItem('jeweler_customers', JSON.stringify(customers));
    return newCustomer;
};

const getUpcomingMilestones = () => {
    const customers = getCustomers();
    const upcoming = [];
    customers.forEach(c => {
        if (c.eventDate) {
            const diff = Math.ceil((new Date(c.eventDate) - new Date()) / (1000 * 60 * 60 * 24));
            if (diff >= 0 && diff <= 30) {
                upcoming.push({ ...c, daysOut: diff });
            }
        }
    });
    return upcoming.sort((a,b) => a.daysOut - b.daysOut);
};

const getNotifications = () => JSON.parse(localStorage.getItem('jeweler_notifications'));

const createNotification = (type, message, targetCustomerIds = 'ALL', requirePaymentForReqId = null) => {
    const notifications = getNotifications();
    const newNotif = {
        id: Date.now(),
        type, // 'scheme', 'maintenance', 'system', 'payment'
        message,
        targetCustomerIds,
        date: new Date().toISOString(),
        requirePaymentForReqId: requirePaymentForReqId
    };
    notifications.push(newNotif);
    localStorage.setItem('jeweler_notifications', JSON.stringify(notifications));
    return newNotif;
};

// Utils for formatting
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Inventory & Pricing
const getLiveGoldRate = () => {
    const isLocked = localStorage.getItem('jeweler_is_rate_locked') === 'true';
    if (isLocked) {
        return parseFloat(localStorage.getItem('jeweler_locked_rate') || 7800);
    }
    return parseFloat(localStorage.getItem('jeweler_live_rate') || 7800);
};

const getInventory = () => JSON.parse(localStorage.getItem('jeweler_inventory'));

const addInventoryItem = (title, weightGrams, marginType, marginValue, karat = 22) => {
    const inv = getInventory();
    inv.push({ 
        id: Date.now(), 
        title, 
        weightGrams: parseFloat(weightGrams), 
        marginType, 
        marginValue: parseFloat(marginValue),
        karat: parseInt(karat)
    });
    localStorage.setItem('jeweler_inventory', JSON.stringify(inv));
};

const calculateFinalPrice = (weightGrams, marginType, marginValue, karat = 22) => {
    const base24kRate = getLiveGoldRate();
    const karatMultipliers = { 24: 1.0, 22: 0.916, 18: 0.75, 14: 0.583, 10: 0.417 };
    const rateForKarat = base24kRate * (karatMultipliers[karat] || 0.916);
    
    const basePrice = weightGrams * rateForKarat;
    if (marginType === 'percent') {
        return basePrice + (basePrice * (marginValue / 100));
    } else {
        // fixed making charge per gram
        return basePrice + (weightGrams * marginValue);
    }
};

const toggleRateLock = () => {
    const currentState = localStorage.getItem('jeweler_is_rate_locked') === 'true';
    localStorage.setItem('jeweler_is_rate_locked', !currentState);
    
    if (!currentState) {
        // Just locked: Notify all active customers
        const leads = getLeads();
        leads.forEach(l => {
            if (l.status !== 'Closed') triggerAuraMoment(l.customerId, 'rate_lock');
        });
        // Just locked it, store the current rate as the snapshot
        localStorage.setItem('jeweler_locked_rate', getLiveGoldRate());
    }
    document.dispatchEvent(new Event('goldRateChanged'));
};

// Leads (Booked Visits)
const getLeads = () => JSON.parse(localStorage.getItem('jeweler_leads'));

const addLead = (customerId, customerName, intent, budget, date) => {
    const leads = getLeads();
    leads.push({ id: Date.now(), customerId, customerName, intent, budget, date, status: 'Captured' });
    localStorage.setItem('jeweler_leads', JSON.stringify(leads));

    // Update Lifetime Stats
    const stats = JSON.parse(localStorage.getItem('aura_lifetime_stats'));
    stats.totalLeads++;
    localStorage.setItem('aura_lifetime_stats', JSON.stringify(stats));
};

const updateLeadStatus = (leadId, newStatus) => {
    const leads = getLeads();
    const l = leads.find(x => x.id === parseInt(leadId));
    if(l) {
        l.status = newStatus;
        localStorage.setItem('jeweler_leads', JSON.stringify(leads));
    }
}

// Custom Requests
const getCustomRequests = () => JSON.parse(localStorage.getItem('jeweler_custom_requests'));

const addCustomRequest = (customerId, customerName, description) => {
    const reqs = getCustomRequests();
    reqs.push({ id: Date.now(), customerId, customerName, description, status: 'Pending', quote: null });
    localStorage.setItem('jeweler_custom_requests', JSON.stringify(reqs));
};

const quoteCustomRequest = (requestId, priceQuote, note, requiresDeposit = false) => {
    const reqs = getCustomRequests();
    const r = reqs.find(x => x.id === parseInt(requestId));
    if(r) {
        r.status = 'CAD Review'; // Auto advance status
        r.quote = priceQuote;
        r.requiresDeposit = requiresDeposit;
        
        let depositAmount = requiresDeposit ? (priceQuote * 0.20) : 0;
        r.depositAmount = depositAmount;
        
        localStorage.setItem('jeweler_custom_requests', JSON.stringify(reqs));
        
        // Drop a notification to the customer
        let notifMsg = `Your custom request has been reviewed. Price Quote: ₹${priceQuote.toLocaleString('en-IN')}. Note: ${note}`;
        if (requiresDeposit) {
            notifMsg += ` | 💳 To begin Workshop production, a 20% secure deposit (₹${depositAmount.toLocaleString('en-IN')}) is required.`;
        }
        createNotification('system', notifMsg, r.customerId, requiresDeposit ? requestId : null);
    }
};

const processClientDeposit = (requestId) => {
    const reqs = getCustomRequests();
    const r = reqs.find(x => x.id === parseInt(requestId));
    if(r && r.requiresDeposit) {
        r.status = 'In Workshop'; // Stripe success jumps straight to Workshop
        r.requiresDeposit = false; // Mark paid
        r.depositPaid = true;
        
        localStorage.setItem('jeweler_custom_requests', JSON.stringify(reqs));
        
        // Update Lifetime Revenue Realized
        const stats = JSON.parse(localStorage.getItem('aura_lifetime_stats'));
        stats.totalRealized += r.depositAmount;
        localStorage.setItem('aura_lifetime_stats', JSON.stringify(stats));

        // Notify Jeweler Dashboard fake event if we had websockets, but here we just localstorage
        triggerAuraMoment(r.customerId, 'workshop_started_deposit');
        return true;
    }
    return false;
};

const updateCustomRequestStatus = (requestId, newStatus) => {
    const reqs = getCustomRequests();
    const r = reqs.find(x => x.id === parseInt(requestId));
    if(r) {
        r.status = newStatus;
        localStorage.setItem('jeweler_custom_requests', JSON.stringify(reqs));
        
        // Trigger Aura Moment Based on Status
        if (newStatus === 'Final Polish') {
            triggerAuraMoment(r.customerId, 'polish_ready');
        } else if (newStatus === 'Ready for Pickup') {
            triggerAuraMoment(r.customerId, 'pickup_ready');
        } else if (newStatus === 'In Workshop') {
            triggerAuraMoment(r.customerId, 'workshop');
        }
    }
};

const getRevenueStats = () => {
    const leads = getLeads();
    const inventory = getInventory();
    const liveRate = getLiveGoldRate();
    const acquiRate = parseFloat(localStorage.getItem('jeweler_acquisition_rate') || 7650);
    
    // 1. Pipeline Value (Inquiry / Quoted only)
    const pipelineLeads = leads.filter(l => l.status === 'Inquiry' || l.status === 'Quoted');
    const totalPipeline = pipelineLeads.reduce((sum, l) => sum + (parseFloat(l.budget) || 0), 0);
    
    // 2. Realized Revenue (Closed only)
    const realizedRevenue = leads.filter(l => l.status === 'Closed').reduce((sum, l) => sum + (parseFloat(l.finalAmount) || 0), 0);

    // 3. Inventory Appreciation
    const totalWeight = inventory.reduce((sum, item) => sum + (item.weightGrams || 0), 0);
    const stockGain = totalWeight * (liveRate - acquiRate);
    
    // 4. Margin Protection (Estimated from locked sessions)
    const isLocked = localStorage.getItem('jeweler_is_rate_locked') === 'true';
    const marginSaved = isLocked ? 15200 : 0; // Simulated saved profit projection
    
    // 5. Closing Potential (High intent count)
    const hotLeadsCount = pipelineLeads.length;

    return { totalPipeline, stockGain, marginSaved, hotLeadsCount, realizedRevenue };
};

const markDealClosed = (leadId, finalAmount) => {
    const leads = getLeads();
    const l = leads.find(x => x.id === parseInt(leadId));
    if(l) {
        l.status = 'Closed';
        l.finalAmount = parseFloat(finalAmount);
        localStorage.setItem('jeweler_leads', JSON.stringify(leads));

        // Update Lifetime Stats
        const stats = JSON.parse(localStorage.getItem('aura_lifetime_stats'));
        stats.totalRealized += l.finalAmount;
        localStorage.setItem('aura_lifetime_stats', JSON.stringify(stats));

        return true;
    }
    return false;
};

const getLifetimeStats = () => {
    const stats = JSON.parse(localStorage.getItem('aura_lifetime_stats'));
    
    // Calculate Rank (Simulated based on realized revenue)
    let rank = "Gold Partner";
    let percentile = 82;
    if (stats.totalRealized > 1000000) {
        rank = "Diamond Elite";
        percentile = 96;
    }
    
    return { ...stats, rank, percentile };
};

const updateLeadJourneyStatus = (leadId, newStatus) => {
    const leads = getLeads();
    const l = leads.find(x => x.id === parseInt(leadId));
    const validStatuses = ['Captured', 'Engaged', 'Quoted', 'Negotiating', 'Scheduled', 'Closed'];
    if(l && validStatuses.includes(newStatus)) {
        l.status = newStatus;
        localStorage.setItem('jeweler_leads', JSON.stringify(leads));
        return true;
    }
    return false;
}

const getCustomerNotifications = (customerId) => {
    const all = JSON.parse(localStorage.getItem('jeweler_notifications')) || [];
    return all.filter(n => n.customerId == customerId || n.customerId === 'all').sort((a,b) => b.id - a.id);
}

const triggerAuraMoment = (customerId, type) => {
    const notifs = JSON.parse(localStorage.getItem('jeweler_notifications')) || [];
    const moments = {
        'order_prep': "✨ Our stylist is handpicking designs for your special occasion.",
        'shortlist': "💎 Exclusive pieces are being shortlisted for your review.",
        'visit_confirm': "🏬 Your appointment is confirmed! We have reserved a private suite for you.",
        'rate_lock': "🔒 Exclusive Aura Benefit: We have locked the gold rate for your selection today.",
        'polish_ready': "✨ Your custom piece has entered the Final Polish stage. It looks brilliant!",
        'pickup_ready': "🎁 Your masterpiece is ready. We look forward to welcoming you for the final reveal.",
        'workshop': "⚒️ Our master artisans have begun casting your design.",
        'workshop_started_deposit': "✅ Secure Deposit Received! Your custom design has bypassed CAD and directly entered the Workshop."
    };
    
    if (moments[type]) {
        notifs.push({
            id: Date.now(),
            customerId: customerId,
            msg: moments[type],
            type: 'moment',
            timestamp: new Date().toLocaleTimeString()
        });
        localStorage.setItem('jeweler_notifications', JSON.stringify(notifs));
    }
}

const getCustomerLead = (customerId) => {
    const leads = getLeads();
    // Return the latest active lead for this customer
    return leads.filter(l => l.customerId == customerId).sort((a,b) => b.id - a.id)[0];
}

const getShowroomNextAction = () => {
    const leads = getLeads();
    const captured = leads.filter(l => l.status === 'Captured').length;
    const engaged = leads.filter(l => l.status === 'Engaged').length;
    const quoted = leads.filter(l => l.status === 'Quoted').length;
    const neg = leads.filter(l => l.status === 'Negotiating').length;

    if (captured > 0) return { action: "WhatsApp " + captured + " New Leads", icon: "💬", target: "clients-list" };
    if (engaged > 0) return { action: "Review " + engaged + " Profiles", icon: "👀", target: "clients-list" };
    if (quoted > 0) return { action: "Prep Designs for " + quoted + " Leads", icon: "💎", target: "clients-list" };
    if (neg > 0) return { action: "Confirm " + neg + " Consultations", icon: "📞", target: "clients-list" };

    return { action: "Capture New Walk-ins", icon: "📸", target: "crm" };
};

// Live Pricing Sync (Real API + Simulation Fallback)
const syncLiveGoldRate = async () => {
    try {
        const response = await fetch('https://api.gold-api.com/price/XAU/INR');
        const data = await response.json();
        
        if (data && data.price) {
            // API provides price per Troy Ounce (31.1035g) for 24K Gold
            const pricePerGram24KGlobal = (data.price / 31.1035);
            
            // India Domestic Calibration (approx 50-55% of global spot)
            const indiaBase24K = (pricePerGram24KGlobal * 0.52).toFixed(2);
            
            if (localStorage.getItem('jeweler_is_rate_locked') !== 'true') {
                localStorage.setItem('jeweler_live_rate', indiaBase24K);
                localStorage.setItem('jeweler_rate_source', 'LIVE API');
                console.log('24K Base Rate Synced:', indiaBase24K);
            }
        }
    } catch (error) {
        console.warn('Gold API currently unavailable. Falling back to simulation mode.', error);
        // Fallback: Fluctuate existing rate slightly
        let rate = getLiveGoldRate();
        let change = Math.floor(Math.random() * 21) - 10; 
        localStorage.setItem('jeweler_live_rate', rate + change);
        localStorage.setItem('jeweler_rate_source', 'SIMULATED');
    }
    document.dispatchEvent(new Event('goldRateChanged'));
};

// Initial Sync and Polling
setInterval(syncLiveGoldRate, 30000); // Sync every 30 seconds
syncLiveGoldRate(); // Call once on start

// Init on load
document.addEventListener('DOMContentLoaded', initializeDB);
