
/**
 * Utility functions for CAPTCHA generation and validation
 */

/**
 * Generates a random 4-digit CAPTCHA code
 * @returns A string containing a 4-digit number
 */
export const generateCaptcha = (): string => {
  // Generate a random number between 1000 and 9999
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Validates user input against the CAPTCHA code
 * @param userInput The user's input
 * @param captchaCode The generated CAPTCHA code
 * @returns Boolean indicating if the input matches the CAPTCHA code
 */
export const validateCaptcha = (userInput: string, captchaCode: string): boolean => {
  return userInput === captchaCode;
};

/**
 * Renders a CAPTCHA code with visual noise to make it harder to read for bots
 * @param code The CAPTCHA code to render
 * @param error Boolean indicating if there was an error in validation
 * @returns Object with style properties for display
 */
export const getCaptchaStyle = (error: boolean = false) => {
  return {
    backgroundColor: error ? '#FEE2E2' : '#F3F4F6',
    color: error ? '#B91C1C' : '#111827',
    fontFamily: 'monospace',
    letterSpacing: '0.25em',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: error ? '1px solid #EF4444' : '1px solid #D1D5DB',
    textAlign: 'center' as const,
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  };
};
