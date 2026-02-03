import { NextResponse } from "next/server";
import { Signals } from "@snowplow/signals-node";

// Result type for Signals instance initialization
type SignalsInitResult =
  | { success: true; signals: Signals }
  | { success: false; error: string; details: Record<string, boolean> };

// Initialize Signals instance on the server side
function getSignalsInstance(): SignalsInitResult {
  // Use process.env for server-side access to private environment variables
  // These are NOT exposed to the client bundle
  const baseUrl =
    process.env.SNOWPLOW_SIGNALS_ENDPOINT ||
    process.env.NEXT_PUBLIC_SNOWPLOW_SIGNALS_ENDPOINT;
  const apiKey = process.env.SNOWPLOW_SIGNALS_API_KEY;
  const apiKeyId = process.env.SNOWPLOW_SIGNALS_API_KEY_ID;
  const organizationId = process.env.SNOWPLOW_SIGNALS_ORG_ID;
  const sandboxToken = process.env.SNOWPLOW_SIGNALS_SANDBOX_TOKEN;

  if (!baseUrl) {
    return {
      success: false,
      error:
        "Missing SNOWPLOW_SIGNALS_ENDPOINT or NEXT_PUBLIC_SNOWPLOW_SIGNALS_ENDPOINT environment variable",
      details: {
        hasBaseUrl: false,
        hasApiKey: !!apiKey,
        hasApiKeyId: !!apiKeyId,
        hasOrgId: !!organizationId,
        hasSandboxToken: !!sandboxToken,
      },
    };
  }

  try {
    // Support sandbox mode if sandboxToken is provided
    if (sandboxToken) {
      return {
        success: true,
        signals: new Signals({
          baseUrl,
          sandboxToken,
        }),
      };
    }

    // Otherwise use regular API key mode
    if (!apiKey || !apiKeyId || !organizationId) {
      return {
        success: false,
        error: "Missing required parameters for API key mode",
        details: {
          hasBaseUrl: !!baseUrl,
          hasApiKey: !!apiKey,
          hasApiKeyId: !!apiKeyId,
          hasOrgId: !!organizationId,
          hasSandboxToken: !!sandboxToken,
        },
      };
    }

    return {
      success: true,
      signals: new Signals({
        baseUrl,
        apiKey,
        apiKeyId,
        organizationId,
      }),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Failed to initialize Snowplow Signals: ${errorMessage}`,
      details: {
        hasBaseUrl: !!baseUrl,
        hasApiKey: !!apiKey,
        hasApiKeyId: !!apiKeyId,
        hasOrgId: !!organizationId,
        hasSandboxToken: !!sandboxToken,
      },
    };
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const attributeKey = url.searchParams.get("attribute_key");
  const identifier = url.searchParams.get("identifier");
  const name = url.searchParams.get("name");

  // Validate required parameters
  if (!attributeKey || !identifier || !name) {
    return NextResponse.json(
      {
        error: "Missing required parameters",
        message: "attribute_key, identifier, and name are required",
        received: {
          attributeKey: attributeKey ?? null,
          identifier: identifier ?? null,
          name: name ?? null,
        },
      },
      { status: 400 }
    );
  }

  // Initialize Signals instance
  const signalsResult = getSignalsInstance();
  if (!signalsResult.success) {
    return NextResponse.json(
      {
        error: "Snowplow Signals not configured on server",
        message: signalsResult.error,
        diagnostic: signalsResult.details,
        hint: "Ensure environment variables are set in Vercel project settings",
      },
      { status: 500 }
    );
  }

  // Fetch service attributes
  try {
    const signals = signalsResult.signals;
    const attributes = await signals.getServiceAttributes({
      attribute_key: attributeKey,
      identifier,
      name,
    });

    // Handle empty or null responses
    if (
      !attributes ||
      (typeof attributes === "object" && Object.keys(attributes).length === 0)
    ) {
      return NextResponse.json(
        {
          message: "No attributes found",
          attributeKey,
          identifier,
          name,
          attributes: attributes ?? {},
        },
        { status: 200 }
      );
    }

    return NextResponse.json(attributes);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch service attributes",
        message: errorMessage,
        requestParams: {
          attributeKey,
          identifier,
          name,
        },
        ...(process.env.NODE_ENV === "development" && errorStack
          ? { stack: errorStack }
          : {}),
      },
      { status: 500 }
    );
  }
}
