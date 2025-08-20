// Configurable office location and allowed radius for proximity check
// Set OFFICE.lat and OFFICE.lng to enable enforcement. If left as null, proximity is not enforced.

export const OFFICE = {
  lat: null, // e.g., 6.5244
  lng: null, // e.g., 3.3792
};

export const OFFICE_RADIUS_METERS = 150; // Allowed distance from office center

export const isOfficeConfigSet = () => typeof OFFICE.lat === 'number' && typeof OFFICE.lng === 'number';


