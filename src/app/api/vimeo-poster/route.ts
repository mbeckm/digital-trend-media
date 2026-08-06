import { NextResponse } from "next/server";

export const revalidate = 86400;

function largeThumbnail(url: string) {
  return url.replace(/_\d+x\d+/, "_1280x720");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const hash = searchParams.get("hash");

  if (!id || !/^\d+$/.test(id)) {
    return new NextResponse("Missing video id", { status: 400 });
  }

  const vimeoUrl = hash
    ? `https://vimeo.com/${id}/${hash}`
    : `https://vimeo.com/${id}`;

  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}&width=1280`,
      { next: { revalidate: 86400 } },
    );

    if (!res.ok) {
      return new NextResponse("Poster unavailable", { status: 404 });
    }

    const data = (await res.json()) as { thumbnail_url?: string };
    if (!data.thumbnail_url) {
      return new NextResponse("Poster unavailable", { status: 404 });
    }

    return NextResponse.redirect(largeThumbnail(data.thumbnail_url), 302);
  } catch {
    return new NextResponse("Poster unavailable", { status: 502 });
  }
}
