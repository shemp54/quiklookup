import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LookupRequest {
  phoneNumber: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { phoneNumber }: LookupRequest = await req.json();

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = Deno.env.get("NUMVERIFY_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const fullNumber = cleanNumber.startsWith("1") ? cleanNumber : `1${cleanNumber}`;

    const apiUrl = `http://apilayer.net/api/validate?access_key=${apiKey}&number=${fullNumber}&country_code=US&format=1`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `API request failed with status ${response.status}` }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();

    if ("error" in data) {
      return new Response(
        JSON.stringify({ error: data.error.info || "API request failed" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!data.valid) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const formatLocal = (number: string): string => {
      const clean = number.replace(/\D/g, "");
      if (clean.length === 10) {
        return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
      }
      if (clean.length === 11 && clean.startsWith("1")) {
        return `(${clean.slice(1, 4)}) ${clean.slice(4, 7)}-${clean.slice(7)}`;
      }
      return number;
    };

    const result = {
      valid: data.valid,
      number: data.number || cleanNumber,
      localFormat: data.local_format || formatLocal(cleanNumber),
      internationalFormat: data.international_format || `+${fullNumber}`,
      countryPrefix: data.country_prefix || "+1",
      countryCode: data.country_code || "US",
      countryName: data.country_name || "United States",
      location: data.location || "Unknown",
      carrier: data.carrier || "Unknown",
      lineType: data.line_type || "Unknown",
    };

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in phone-lookup function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to lookup phone number",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});