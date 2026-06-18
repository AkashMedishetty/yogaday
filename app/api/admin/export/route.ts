import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { isAuthed } from "@/lib/auth";
import { listRegistrations } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await listRegistrations();

  const wb = new ExcelJS.Workbook();
  wb.creator = "Yoga Day 2026";
  const ws = wb.addWorksheet("Registrations");

  ws.columns = [
    { header: "#", key: "row", width: 6 },
    { header: "Name", key: "name", width: 28 },
    { header: "Email", key: "email", width: 34 },
    { header: "Mobile", key: "mobile", width: 18 },
    { header: "Registered At (IST)", key: "created_at", width: 24 },
  ];

  // Header styling
  ws.getRow(1).font = { bold: true, color: { argb: "FFFDF6E3" } };
  ws.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF8B2010" },
  };
  ws.getRow(1).alignment = { vertical: "middle" };
  ws.getRow(1).height = 22;

  rows.forEach((r, i) => {
    const ist = new Date(r.created_at).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
    ws.addRow({
      row: i + 1,
      name: r.name,
      email: r.email,
      mobile: r.mobile,
      created_at: ist,
    });
  });

  ws.autoFilter = { from: "A1", to: "E1" };

  const buffer = await wb.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="yoga-day-2026-registrations-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
