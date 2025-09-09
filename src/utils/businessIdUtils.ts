import { businesses } from "@/data/businessData";

/**
 * Enhanced business ID validation and resolution utility
 */
export class BusinessIdUtils {
  
  /**
   * Validates if a business ID exists in the business data
   */
  static isValidBusinessId(businessId: string): boolean {
    if (!businessId) return false;
    return businesses.some(business => business.id === businessId);
  }

  /**
   * Resolves a business ID from various banner data sources
   */
  static resolveBusinessId(bannerId: string, position?: number, businessId?: string): string {
    // Return existing valid business ID
    if (businessId && this.isValidBusinessId(businessId)) {
      return businessId;
    }

    // Extract from slot ID pattern (slot-position-index)
    if (bannerId.includes('slot-')) {
      const match = bannerId.match(/slot-(\d+)-(\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const index = parseInt(match[2]);
        // Map to existing business IDs (1, 2, 3)
        const mappedId = ((pos + index - 1) % 3 + 1).toString();
        if (this.isValidBusinessId(mappedId)) {
          return mappedId;
        }
      }
    }

    // Use position-based mapping
    if (position && position > 0) {
      const mappedId = ((position - 1) % 3 + 1).toString();
      if (this.isValidBusinessId(mappedId)) {
        return mappedId;
      }
    }

    // Fallback to first business
    return "1";
  }

  /**
   * Gets business data by ID with validation
   */
  static getBusinessById(businessId: string) {
    return businesses.find(business => business.id === businessId);
  }

  /**
   * Generates a business navigation URL with validation
   */
  static getBusinessUrl(bannerId: string, position?: number, businessId?: string): string {
    const resolvedId = this.resolveBusinessId(bannerId, position, businessId);
    return `/business/${resolvedId}`;
  }

  /**
   * Validates business data completeness for navigation
   */
  static validateBusinessForNavigation(businessId: string): boolean {
    const business = this.getBusinessById(businessId);
    return !!(business && business.name && business.id);
  }
}