/**
 * Test Data Generators
 * Utilities for creating realistic test data for booking tests
 */

/**
 * Generate a random name (first + last name)
 */
export function generateRandomName(): string {
  const firstNames = [
    'John',
    'Jane',
    'Alex',
    'Sarah',
    'Michael',
    'Emma',
    'David',
    'Lisa',
    'Robert',
    'Maria',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
  ];

  const firstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

/**
 * Generate a random email with timestamp for uniqueness
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  return `test.${randomStr}.${timestamp}@minar-test.com`;
}

/**
 * Generate a valid Indian phone number (10 digits, starting with 6-9)
 */
export function generateIndianPhoneNumber(): string {
  const firstDigit = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
  const remainingDigits =
    Math.floor(Math.random() * 900000000) + 100000000;
  return `${firstDigit}${remainingDigits}`;
}
