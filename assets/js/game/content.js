/**
 * PortfolioContent Service - Single Source of Truth
 * Dynamically loads portfolio data from assets/data/portfolio.json.
 * Eliminates all duplicate hardcoded content across JavaScript and JSON.
 */

export const PORTFOLIO_CONTENT = {
  header: {},
  sectors: {},
  subItems: [],
  socialLinks: []
};

export async function initPortfolioContent() {
  try {
    const res = await fetch('assets/data/portfolio.json');
    if (!res.ok) throw new Error('Failed to fetch assets/data/portfolio.json');
    const data = await res.json();
    
    PORTFOLIO_CONTENT.header = data.header || {};
    PORTFOLIO_CONTENT.sectors = data.sectors || {};
    PORTFOLIO_CONTENT.subItems = data.subItems || [];
    PORTFOLIO_CONTENT.socialLinks = data.socialLinks || [];
    
    return PORTFOLIO_CONTENT;
  } catch (err) {
    console.error('Failed to load portfolio data:', err);
    return PORTFOLIO_CONTENT;
  }
}
