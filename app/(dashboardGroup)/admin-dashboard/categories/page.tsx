import { getAllCategoriesAction } from "@/fearture/admin/actions/category.action"
import { CategoryManagementView } from "@/fearture/admin/components/category-management-view"

export default async function AdminCategoriesPage() {
  const categoriesResult = await getAllCategoriesAction()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_26%)]">
      <CategoryManagementView initialCategories={categoriesResult.success ? categoriesResult.data : []} />
    </div>
  )
}