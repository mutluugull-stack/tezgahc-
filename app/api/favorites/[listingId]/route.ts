import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// DELETE /api/favorites/[listingId] -> bir ilanı favorilerden çıkar
export async function DELETE(req: NextRequest, { params }: { params: { listingId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  await prisma.favorite
    .delete({
      where: { userId_listingId: { userId: session.user.id, listingId: params.listingId } },
    })
    .catch(() => {
      // Zaten favoride değilse sessizce geç.
    });

  return NextResponse.json({ ok: true });
}
