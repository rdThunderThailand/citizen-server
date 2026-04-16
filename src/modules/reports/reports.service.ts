// ─── src/modules/reports/reports.service.ts ──────────────────────────────────
import { adminClient } from "../../lib/supabase.js";
import { AppError } from "../../utils/response.js";
import type { ReportType } from "../../types/index.js";

export const VALID_REPORT_TYPES: ReportType[] = [
  "road", "electric", "water", "safety", "other",
];

export interface ReportInput {
  province_id:     string;
  district_id?:    string;
  subdistrict_id?: string;
  report_type:     string;
  description:     string;
  files:           Express.Multer.File[];
}

export const reportsService = {
  async submit(input: ReportInput): Promise<{ id: string; created_at: string }> {
    const { province_id, district_id, subdistrict_id, report_type, description, files } = input;

    // Upload images to Supabase Storage
    const imageUrls: string[] = [];

    for (const file of files) {
      const ext  = file.originalname.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await adminClient.storage
        .from("report-images")
        .upload(path, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("[reportsService] Upload error:", uploadError);
        throw new AppError("Failed to upload image");
      }

      const { data: urlData } = adminClient.storage
        .from("report-images")
        .getPublicUrl(path);

      imageUrls.push(urlData.publicUrl);
    }

    // Insert report row
    const { data, error } = await adminClient
      .from("reports")
      .insert({
        province_id,
        district_id:    district_id    ?? null,
        subdistrict_id: subdistrict_id ?? null,
        report_type:    report_type as ReportType,
        description:    description.trim(),
        image_urls:     imageUrls.length > 0 ? imageUrls : null,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[reportsService] Insert error:", error);
      throw new AppError("Failed to save report");
    }

    return data as { id: string; created_at: string };
  },
};
