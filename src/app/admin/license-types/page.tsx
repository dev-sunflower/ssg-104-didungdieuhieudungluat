import { createClient } from "@/lib/supabase/server";
import { LuCreditCard, LuPlus } from "react-icons/lu";
import LicenseTypeRow from "./_components/LicenseTypeRow";
import LicenseTypeForm from "./_components/LicenseTypeForm";

export default async function AdminLicenseTypesPage() {
  const supabase = await createClient();
  const { data: types } = await supabase
    .from("license_types")
    .select("*")
    .order("code");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading-sub-sm text-text-primary flex items-center gap-2">
          Hạng bằng lái
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Quản lý các hạng bằng lái và thông số thi
        </p>
      </div>

      {/* Table */}
      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden shadow-whisper">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Mã
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem]">
                  Tên
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Tổng câu
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Điểm đạt
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem]">
                  Mô tả
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary text-[0.75rem] whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {types?.map((lt) => (
                <LicenseTypeRow key={lt.id} licenseType={lt} />
              ))}
              {(!types || types.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-text-tertiary text-sm"
                  >
                    Chưa có hạng bằng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-bg-card rounded-2xl border border-border shadow-whisper p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <LuPlus size={15} />
          Thêm hạng bằng mới
        </h2>
        <LicenseTypeForm />
      </div>
    </div>
  );
}
