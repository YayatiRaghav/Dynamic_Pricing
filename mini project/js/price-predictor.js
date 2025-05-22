class PricePredictor {
    constructor() {
        this.coefficients = {
            category: {
                electronics: 0.05,
                fashion: 0.05,
                home: 0.07
            },
            demand: 0.01,    // +2% per demand point
            rating: 0.02,    // +3% per rating point
            intercept: 5
        };
        this.lowDemandPenalty = 0.15;  // -5% if demand is 0
        this.lowRatingPenalty = 0.10; // -10% if rating is below 3
    }

    predict(product) {
        const basePrice = parseFloat(product.base_price) || 0;
        let demand = typeof product.demand === 'number' ? Math.max(0, product.demand) : 5;
        const rating = typeof product.rating === 'number' ? Math.max(1, product.rating) : 3;
        const categoryMultiplier = this.coefficients.category[product.category] || 0.05;

        // Adjustments
        const categoryAdjustment = basePrice * categoryMultiplier;
        const demandAdjustment = basePrice * (demand * this.coefficients.demand);
        const ratingAdjustment = basePrice * (rating * this.coefficients.rating);

        // Log intermediate values
        console.log('Base Price:', basePrice);
        console.log('Category Multiplier:', categoryMultiplier);
        console.log('Category Adjustment:', categoryAdjustment);
        console.log('Demand Adjustment:', demandAdjustment);
        console.log('Rating Adjustment:', ratingAdjustment);

        let price = basePrice + categoryAdjustment + demandAdjustment + ratingAdjustment + this.coefficients.intercept;

        // Log price before penalties
        console.log('Price before penalties:', price);

        // Apply low demand penalty if demand is 0
        if (demand === 0) {
            price -= basePrice * this.lowDemandPenalty;
            console.log('Price after low demand penalty:', price);
        }

        // Apply low rating penalty if rating is below 3
        if (rating < 3) {
            price -= basePrice * this.lowRatingPenalty;
            console.log('Price after low rating penalty:', price);
        }

        // Ensure the final price is at least 0.01
        const finalPrice = Math.max(price, 0.01);
        console.log('Final Price:', finalPrice);

        // Return the price as a number, ensuring it's a valid number
        return parseFloat(finalPrice.toFixed(2)); // Ensure it's a number with 2 decimal points
    }
}
