import { z } from 'zod'

/**
 * Mirrors the backend's App\Rules\ValidPhoneNumber: optional leading "+",
 * digits/spaces/dashes allowed as separators, 8-15 actual digits total.
 * Rejects obviously-invalid input (e.g. "0128") instead of only checking
 * string length.
 */
export const phoneSchema = z
  .string()
  .min(1, 'Le numéro de téléphone est requis')
  .regex(/^\+?[0-9][0-9\s-]*$/, 'Le numéro de téléphone est invalide')
  .refine((value) => {
    const digitCount = value.replace(/\D/g, '').length
    return digitCount >= 8 && digitCount <= 15
  }, 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres')
