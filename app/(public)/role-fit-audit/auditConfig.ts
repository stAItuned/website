/**
 * Configuration for the Role Fit Audit
 */
export const AUDIT_CONFIG: {
    price: number
    originalPrice: number
    currency: string
    isEnabled: boolean
} = {
    /**
     * Current price of the audit.
     * Set to 0 to enable free access mode.
     */
    price: 0,

    /**
     * Original price shown as crossed out
     */
    originalPrice: 4.99,

    /**
     * Currency code
     */
    currency: 'EUR',

    /**
     * Whether the audit is enabled
     */
    isEnabled: true
}
