import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: "Mail sistemi henüz aktif değil" },
    { status: 501 }
  );
}