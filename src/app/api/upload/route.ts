import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// These would be set in .env.local
const muxTokenId = process.env.MUX_TOKEN_ID || "mock_token";
const muxTokenSecret = process.env.MUX_TOKEN_SECRET || "mock_secret";

const mux = new Mux({
  tokenId: muxTokenId,
  tokenSecret: muxTokenSecret,
});

export async function POST(req: Request) {
  try {
    // 1. Authorize user using Supabase Auth (skipped for mock)
    // const supabase = createRouteHandlerClient({ cookies })
    // const { data: { session } } = await supabase.auth.getSession()
    
    // 2. Create direct upload URL in Mux
    const upload = await mux.video.uploads.create({
      cors_origin: "*", // In production, restrict to your domain (e.g., https://muso-production.com)
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
    });

    return NextResponse.json({
      id: upload.id,
      url: upload.url,
    });
  } catch (error) {
    console.error("Error creating Mux upload:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
}
