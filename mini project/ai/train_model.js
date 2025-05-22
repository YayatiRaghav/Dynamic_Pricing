class PricePredictor {
  constructor() {
    this.coefficients = { category: {}, demand: 0, rating: 0, intercept: 0 };
    this.loadModel();
  }

  train(data) {
    // Simplified linear regression (replace with actual ML logic)
    const electronics = data.filter(d => d.category === 'electronics');
    const fashion = data.filter(d => d.category === 'fashion');
    
    this.coefficients.category.electronics = electronics.reduce((sum, d) => sum + (d.final_price - d.base_price), 0) / electronics.length;
    this.coefficients.category.fashion = fashion.reduce((sum, d) => sum + (d.final_price - d.base_price), 0) / fashion.length;
    this.coefficients.demand = 2.5; // Demand multiplier
    this.coefficients.rating = 10; // Rating multiplier
    this.coefficients.intercept = 20;
    
    localStorage.setItem('price_model', JSON.stringify(this.coefficients));
  }

  loadModel() {
    const savedModel = localStorage.getItem('price_model');
    if (savedModel) this.coefficients = JSON.parse(savedModel);
  }

  predict(category, demand, rating, basePrice) {
    const categoryEffect = this.coefficients.category[category] || 0;
    return basePrice + 
      (demand * this.coefficients.demand) +
      (rating * this.coefficients.rating) +
      categoryEffect +
      this.coefficients.intercept;
  }
}

// Train when new data is added (admin dashboard)
fetch('../data/pricing_history.json')
  .then(response => response.json())
  .then(data => {
    const predictor = new PricePredictor();
    predictor.train(data);
  });
