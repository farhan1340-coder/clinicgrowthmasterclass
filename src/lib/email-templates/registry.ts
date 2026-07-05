import type { ComponentType } from 'react'
import { template as registrationConfirmation } from './registration-confirmation'
import {
  template1 as abandonedCheckout1,
  template2 as abandonedCheckout2,
  template3 as abandonedCheckout3,
  template4 as abandonedCheckout4,
} from './abandoned-checkout'
import {
  template5 as abandonedCheckout5,
  template6 as abandonedCheckout6,
} from './deadline-reminder'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'registration-confirmation': registrationConfirmation,
  'abandoned-checkout-1': abandonedCheckout1,
  'abandoned-checkout-2': abandonedCheckout2,
  'abandoned-checkout-3': abandonedCheckout3,
  'abandoned-checkout-4': abandonedCheckout4,
  'abandoned-checkout-5': abandonedCheckout5,
  'abandoned-checkout-6': abandonedCheckout6,
}
