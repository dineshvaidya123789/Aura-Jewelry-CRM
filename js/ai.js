// Mock AI Logic for Recommendations

const analyzeFaceAndSuggest = (imageSrc, callback) => {
    // Simulate API delay
    setTimeout(() => {
        // We'll mock the response since we can't do real vision AI purely in off-line JS without a backend API key
        const suggestions = {
            faceShape: "Oval",
            skinTone: "Warm",
            recommendations: [
                { title: "Kundan Choker", desc: "Highlights the neckline perfectly for your oval face shape.", image: "https://images.unsplash.com/photo-1599643478514-4a884f1807d9?w=500&auto=format&fit=crop&q=60" },
                { title: "Polki Danglers", desc: "Long earrings compliment the facial proportions.", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60" }
            ]
        };
        callback(suggestions);
    }, 2000);
};

const getWeddingOptions = (theme, callback) => {
    setTimeout(() => {
        const options = [
            { id: 1, title: "Royal Heritage Set", price: "₹2,50,000", match: "98% Match to Traditional Theme" },
            { id: 2, title: "Modern Minimalist Gold", price: "₹1,20,000", match: "85% Match to Minimalist Theme" },
            { id: 3, title: "Diamond Extravaganza", price: "₹5,00,000", match: "95% Match to Glamour Theme" }
        ];
        callback(options);
    }, 1500);
}
