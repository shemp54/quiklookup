export interface LookupResult {
  valid: boolean;
  number: string;
  localFormat: string;
  internationalFormat: string;
  countryPrefix: string;
  countryCode: string;
  countryName: string;
  location: string;
  carrier: string;
  lineType: string;
}

export const lookupPhoneNumber = async (phoneNumber: string): Promise<LookupResult> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const cleanNumber = phoneNumber.replace(/\D/g, '');

  try {
    const apiUrl = `${supabaseUrl}/functions/v1/phone-lookup`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber: cleanNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if ('error' in data) {
      throw new Error(data.error);
    }

    return data as LookupResult;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to lookup phone number. Please try again.');
  }
};
