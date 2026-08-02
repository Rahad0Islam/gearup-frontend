# GearUp — API Integration Reference

> Mapping between every frontend surface area (Server Actions, Server Components, Client Components) and the backend `/api/v1/*` endpoints.
>
> All endpoints are prefixed with **`/api/v1`**. Authenticated routes are called with the `accessToken` cookie forwarded as `Cookie: accessToken=...` (or `Authorization: Bearer ...` where noted). The base URL is read from `process.env.BACKEND_URL` in every Server Action.

---

## 1. Environment & Conventions

| Concern | Detail |
| --- | --- |
| Base URL | `process.env.BACKEND_URL` |
| Auth header (cookie forward) | `Cookie: accessToken=${accessToken}` |
| Auth header (bearer) | `Authorization: Bearer ${accessToken}` (used by `logOut`) |
| Cache strategy | `cache: "no-store"` for all mutating/auth reads, `cache: "no-cache"` only on `/auth/refreshtoken` |
| Revalidation | `revalidatePath(...)` after create/update/delete mutations; `revalidateTag("getme")` after logout |
| Response shape | `{ success: boolean, statuscode?: number, message?: string, data: any, meta?: { page, limit, total, totalPage } }` |
| Proxy / middleware | `proxy.ts` refreshes the access token via `/auth/refreshtoken` when access is expired but refresh is valid, then forwards the cookie |

---

## 2. Auth — `/api/v1/auth`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| POST | `/auth/register` | `registerAction` in `app/(authGroup)/_actions/authAction.ts` | `app/(authGroup)/register/page.tsx` → `registerForm.tsx` |
| POST | `/auth/login` | `loginAction` in `app/(authGroup)/_actions/authAction.ts` | `app/(authGroup)/login/page.tsx` → `loginForm.tsx` |
| POST | `/auth/refreshtoken` | `getNewAccessToken` in `app/utils/refreshtoken.ts` | Used by `proxy.ts` to silently refresh the access token |
| GET | `/auth/me` | `getme` (default export) in `app/(authGroup)/_actions/getCurrentUser.ts` | `components/navbarClient.tsx`, `components/navbar.tsx` (Server Component), profile dropdown, role-aware redirects |
| POST | `/auth/logout` (extra, not in supplied spec) | `logout` in `app/(authGroup)/_actions/logOut.ts` | "Logout" item inside `components/profileComponents.tsx` (desktop dropdown) and `navbarClient.tsx` mobile profile view |

**Auth flow notes**

- `loginAction` / `registerAction` set `accessToken` (1 d) + `refreshToken` (30 d) cookies (httpOnly, `sameSite: lax`).
- `proxy.ts` matcher excludes `/api`, `_next/static`, `_next/image`, and `.png` so it does not intercept backend traffic.

---

## 3. Admin — `/api/v1/admin`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| GET | `/admin/getalluser` | `getAllUsersAction` in `fearture/admin/actions/admin.action.ts` | `app/(dashboardGroup)/admin-dashboard/page.tsx` (overview), `app/(dashboardGroup)/admin-dashboard/users/page.tsx` (table view), rendered by `fearture/admin/components/admin-users-table.tsx` |
| PATCH | `/admin/updateuser-status/:id` | `updateUserStatusAction` in `fearture/admin/actions/admin.action.ts` (tries `PUT` → `PATCH` → `POST`) | Suspend/Activate buttons inside `fearture/admin/components/admin-dashboard-view.tsx` |

**Query params supported by `getAllUsersAction`**

`id`, `name`, `email`, `searchTerm`, `limit`, `page`, `sortBy`, `sortOrder` ("asc" | "desc").

---

## 4. Categories — `/api/v1/category`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| GET | `/category` | `getAllCategoriesAction` in `fearture/admin/actions/category.action.ts`, `getCategoriesAction` in `fearture/provider/actions/gear.action.ts` | Admin: `app/(dashboardGroup)/admin-dashboard/categories/page.tsx`, `admin-dashboard/categories/create/page.tsx`. Provider: `provider-dashboard/page.tsx`, `provider-dashboard/gear/create/page.tsx`, `admin-dashboard/gear/page.tsx`. Public: `components/navbar.tsx`, `app/(publicGroup)/gear/category/[id]/page.tsx` |
| GET | `/category/:id` | _No frontend caller yet_ — available for single-category detail views | _(reserved)_ |
| POST | `/category/addcategory` | `createCategoryAction` in `fearture/admin/actions/category.action.ts` | `fearture/admin/components/category-form-dialog.tsx` (create mode) |
| PUT | `/category/updatecategory/:id` | `updateCategoryAction` in `fearture/admin/actions/category.action.ts` | `fearture/admin/components/category-form-dialog.tsx` (edit mode) |
| DELETE | `/category/deletecategory/:id` | `deleteCategoryAction` in `fearture/admin/actions/category.action.ts` | Delete confirmation in `fearture/admin/components/category-management-view.tsx` |

---

## 5. Gear Items — `/api/v1/gear`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| GET | `/gear` | `getAllGear` in `fearture/gear/_actions/gear.action.ts` | `app/(publicGroup)/page.tsx` (home), `app/(publicGroup)/gear/page.tsx`, `fearture/gear/components/gearGrid.tsx` |
| GET | `/gear/category/:categoryId` | `getGearByCategoryId` in `fearture/gear/_actions/gear.action.ts` | `app/(publicGroup)/gear/category/[id]/page.tsx` |
| GET | `/gear/provider/:providerId` | `getAllGearbyProvider` in `fearture/provider/actions/gear.action.ts` | `app/(dashboardGroup)/provider-dashboard/page.tsx`, `provider-dashboard/gear/create/page.tsx`, `admin-dashboard/gear/page.tsx` |
| GET | `/gear/:id` | `getGearDetailsById` in `fearture/gear/_actions/gearDetails.action.ts` | `app/(publicGroup)/gear/[id]/page.tsx` → `fearture/gear/components/gear/gear-details.tsx` |
| POST | `/gear/:categoryId` | `createGearAction` in `fearture/provider/actions/gear.action.ts` | `fearture/provider/components/gear-form-dialog.tsx` (create mode) |
| PUT | `/gear/:id` | `updateGearAction` in `fearture/provider/actions/gear.action.ts` | `fearture/provider/components/gear-form-dialog.tsx` (edit mode) |
| DELETE | `/gear/:id` | `deleteGearAction` in `fearture/provider/actions/gear.action.ts` | Delete action inside `fearture/provider/components/provider-gear-view.tsx` |

**Query params supported by `getAllGear`**

`name`, `description`, `page`, `limit`, `searchTerm`, `rentPricePerDay`, `sortBy`, `sortOrder`, `brand`, `status`.

---

## 6. Rental Orders — `/api/v1/rental-order`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| POST | `/rental-order` | `createRentalOrderAction` in `fearture/rental-order/actions/createRental.action.ts` | "Rent now" flow in `fearture/gear/components/gear/gear-details.tsx` (date range + line items) |
| GET | `/rental-order` | `getRentalOrder` in `fearture/rental-order/actions/getRentalOrder.action.ts` | `app/(dashboardGroup)/customer-dashboard/rental/page.tsx`, `admin-dashboard/rentals/page.tsx`, `provider-dashboard/rentals/page.tsx` |
| GET | `/rental-order/:rentalOrderId` | _No frontend caller yet_ — single-order detail | _(reserved)_ |
| DELETE | `/rental-order/:rentalOrderId` | _No frontend caller yet_ — admin-only delete | _(reserved)_ |
| PATCH | `/rental-order/confirm/:rentalOrderId` | `confirmOrderAction` in `fearture/provider/actions/provider.action.ts` | "Confirm" button in `fearture/provider/components/provider-order-card.tsx` |
| PATCH | `/rental-order/pickup/:rentalOrderId` | `pickupOrderAction` in `fearture/provider/actions/provider.action.ts` | "Mark picked up" button in `fearture/provider/components/provider-order-card.tsx` |
| PATCH | `/rental-order/return/:rentalOrderId` | `returnOrderAction` in `fearture/provider/actions/provider.action.ts` | "Mark returned" button (also computes late fee) in `provider-order-card.tsx` |
| PATCH | `/rental-order/cancel/:rentalOrderId` | `cancelOrderAction` in `fearture/provider/actions/provider.action.ts` | "Cancel" button in `provider-order-card.tsx` |
| GET | `/rental-order/orderStatus/:rentalOrderId` | _No frontend caller yet_ — poll for live status | _(reserved)_ |

> The four status-mutation helpers share `executeOrderAction(endpoint)` which always sends `PATCH` and revalidates `/provider-dashboard/rental`. The backend spec lists these as PATCH — keep them aligned.

---

## 7. Payments — `/api/v1/payment`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| POST | `/payment/checkout` | `createCheckoutSession` in `fearture/rental-order/actions/checkoutSession.ts` | `fearture/rental-order/components/payment-dialog.tsx` (Stripe redirect with `{ rentalOrderId, paymentType: "RENTAL" \| "LATE_FEE" }`) |
| POST | `/payment/webhook` | _Handled entirely by backend (Stripe raw body, `STRIPE_WEBHOOK_SECRET`)_ | _(no frontend caller)_ |
| GET | `/payment/payment-history` | `getPaymentHistory` in `fearture/rental-order/actions/getPaymentHistory.ts` | `fearture/rental-order/components/payment-history-view.tsx` (admin `payment-history` page and customer payment history) |

**Query params supported by `getPaymentHistory`**

`paymentType` ("RENTAL" | "LATE_FEE" | "ALL"), `status` ("PENDING" | "PAID" | "FAILED" | "CANCELLED" | "ALL"), `paymentMethod` ("stripe" | "cash" | "ALL"), `page`, `limit`, `customerId`.

> `fearture/rental-order/actions/viewAllpayment.ts` currently contains only an empty stub (`const viewAllPayments = async () => {}`) — keep or remove depending on whether admin payment aggregation needs a dedicated endpoint.

---

## 8. Reviews — `/api/v1/review`

| Method | Endpoint | Server Action / Caller | Frontend UI |
| --- | --- | --- | --- |
| POST | `/review` | `createReviewAction` in `fearture/review/action/review.action.ts` | `fearture/review/components/review-dialog.tsx` (submit new review, body: `{ rentalOrderId, rating, comment }`, `gearItemId` query param) |
| PATCH | `/review/:reviewId` | `updateReviewAction` in `fearture/review/action/review.action.ts` | Edit-review branch in `review-dialog.tsx` |
| DELETE | `/review/:reviewId` | _No frontend caller yet_ — wired but unused | _(reserved; expose from review list when added)_ |
| GET | `/review/:gearitemid` | `getReviewById` in `fearture/gear/_actions/getReviewByid.action.ts` | Gear detail page reviews list (public) |
| GET | `/review/getreviewbygearanduser` (extra endpoint used by frontend, not in supplied spec) | `getReviewByGearAndUserAction` in `fearture/review/action/review.action.ts` | "Leave a review" button in `fearture/rental-order/components/rental-card.tsx` — pre-fills the dialog if the user already reviewed |

---

## 9. Data Model Reference (Prisma)

| Entity | Key fields |
| --- | --- |
| `User` | `id`, `name`, `email`, `password`, `role` (`CUSTOMER \| PROVIDER \| ADMIN`), `activeStatus` (`ACTIVE \| SUSPENDED`) |
| `categories` | `id`, `name`, `description`, `image`, `createdBy` (FK → User) |
| `gearItems` | `id`, `name`, `description`, `brand`, `rentPricePerDay`, `discountPrice`, `stock`, `image`, `status` (`AVAILABLE \| UNAVAILABLE`), `categoryId` (FK → categories), `providerId` (FK → User) |
| `RentalOrder` | `id`, `customerId` (FK → User), `status` (`PLACED \| CONFIRMED \| PAID \| PICKED_UP \| RETURNED \| LATE_RETURN \| CANCELLED`), `pickupDate`, `returnDate` |
| `rentalOrderItems` | `rentalOrderId`, `gearItemId`, `quantity`, `daysRented`, `subtotal`, `discount`, `rentalPricePerDay` |
| `payments` | `rentalOrderId`, `paymentMethod` (`stripe \| cash`), `paymentType` (`RENTAL \| LATE_FEE`), `paymentStatus` (`PENDING \| PAID \| FAILED \| CANCELLED`), Stripe session/payment IDs |
| `review` | `id`, `rating`, `comment`, `rentalOrderId` (FK), `gearItemId` (FK), `customerId` (FK) |

---

## 10. Endpoint-by-Endpoint Coverage Matrix

Legend: ✅ wired · ⚠️ partial / backend-only · ❌ missing

| Endpoint | Used? | Frontend Surface |
| --- | --- | --- |
| `POST /auth/register` | ✅ | Register form |
| `POST /auth/login` | ✅ | Login form |
| `POST /auth/refreshtoken` | ✅ | `proxy.ts` |
| `GET /auth/me` | ✅ | Navbar profile / role gating |
| `POST /auth/logout` | ✅ | Logout (extra) |
| `GET /admin/getalluser` | ✅ | Admin overview + users page |
| `PATCH /admin/updateuser-status/:id` | ✅ | Suspend/Activate |
| `POST /category/addcategory` | ✅ | Category dialog |
| `PUT /category/updatecategory/:id` | ✅ | Category dialog |
| `DELETE /category/deletecategory/:id` | ✅ | Category list delete |
| `GET /category` | ✅ | Admin, provider, public nav, gear-by-category page |
| `GET /category/:id` | ❌ | _Reserved for single-category view_ |
| `POST /gear/:categoryId` | ✅ | Provider gear dialog |
| `PUT /gear/:id` | ✅ | Provider gear dialog |
| `DELETE /gear/:id` | ✅ | Provider gear list |
| `GET /gear/:id` | ✅ | Public gear detail |
| `GET /gear` | ✅ | Home, gear listing, gear grid |
| `GET /gear/category/:categoryId` | ✅ | Category page |
| `GET /gear/provider/:providerId` | ✅ | Provider + admin dashboards |
| `POST /rental-order` | ✅ | Gear detail "Rent" |
| `GET /rental-order` | ✅ | All three role dashboards |
| `GET /rental-order/:id` | ❌ | _Reserved_ |
| `DELETE /rental-order/:id` | ❌ | _Reserved (admin only)_ |
| `PATCH /rental-order/confirm/:id` | ✅ | Provider order card |
| `PATCH /rental-order/pickup/:id` | ✅ | Provider order card |
| `PATCH /rental-order/return/:id` | ✅ | Provider order card |
| `PATCH /rental-order/cancel/:id` | ✅ | Provider order card |
| `GET /rental-order/orderStatus/:id` | ❌ | _Reserved for live polling_ |
| `POST /payment/checkout` | ✅ | Payment dialog |
| `POST /payment/webhook` | ⚠️ | Backend-only (Stripe) |
| `GET /payment/payment-history` | ✅ | Payment history view |
| `POST /review` | ✅ | Review dialog |
| `PATCH /review/:id` | ✅ | Review dialog (edit) |
| `DELETE /review/:id` | ❌ | _Wired in action but not surfaced_ |
| `GET /review/:gearitemid` | ✅ | Gear detail reviews list |
| `POST /review/getreviewbygearanduser` | ✅ | Pre-fill review dialog (extra endpoint) |

---

## 11. File-to-Endpoint Index

```
app/(authGroup)/_actions/authAction.ts
  ├─ POST /auth/login
  └─ POST /auth/register

app/(authGroup)/_actions/getCurrentUser.ts
  └─ GET  /auth/me

app/(authGroup)/_actions/logOut.ts
  └─ POST /auth/logout

app/utils/refreshtoken.ts
  └─ POST /auth/refreshtoken

fearture/admin/actions/admin.action.ts
  ├─ GET   /admin/getalluser
  └─ PATCH /admin/updateuser-status/:id      (PUT → PATCH → POST fallback)

fearture/admin/actions/category.action.ts
  ├─ GET    /category
  ├─ POST   /category/addcategory
  ├─ PUT    /category/updatecategory/:id
  └─ DELETE /category/deletecategory/:id

fearture/provider/actions/gear.action.ts
  ├─ GET    /category
  ├─ POST   /gear/:categoryId
  ├─ PUT    /gear/:id
  ├─ DELETE /gear/:id
  └─ GET    /gear/provider/:providerId

fearture/provider/actions/provider.action.ts
  ├─ PATCH /rental-order/confirm/:id
  ├─ PATCH /rental-order/pickup/:id
  ├─ PATCH /rental-order/return/:id
  └─ PATCH /rental-order/cancel/:id

fearture/gear/_actions/gear.action.ts
  ├─ GET /gear
  └─ GET /gear/category/:categoryId

fearture/gear/_actions/gearDetails.action.ts
  └─ GET /gear/:id

fearture/gear/_actions/getReviewByid.action.ts
  └─ GET /review/:gearitemid

fearture/rental-order/actions/createRental.action.ts
  └─ POST /rental-order

fearture/rental-order/actions/getRentalOrder.action.ts
  └─ GET  /rental-order

fearture/rental-order/actions/checkoutSession.ts
  └─ POST /payment/checkout

fearture/rental-order/actions/getPaymentHistory.ts
  └─ GET  /payment/payment-history

fearture/review/action/review.action.ts
  ├─ POST /review
  ├─ PATCH /review/:reviewId
  ├─ GET  /review/:reviewId                              (alias)
  └─ POST /review/getreviewbygearanduser                 (extra)
```

---

## 12. Gaps & Follow-ups

1. **Customer-side checkout handoff** — after `createCheckoutSession` returns, the response URL needs to be redirected to in `payment-dialog.tsx`. Verify the backend returns `{ url }` or similar.
2. **Review delete UI** — `deleteReviewAction` (or equivalent) is not yet wired; expose a delete affordance inside `review-dialog.tsx` for review owners.
3. **Order status polling** — `GET /rental-order/orderStatus/:id` is unused. Consider adding a `useSWR`/polling hook on the customer dashboard for live status updates.
4. **Single-category detail page** — `GET /category/:id` is unused; can enrich the navbar `category` accordion.
5. **Admin payment aggregate** — `viewAllpayment.ts` is a stub; remove or replace with a real endpoint if admin needs aggregated totals.
6. **`/auth/logout`** — works but not in supplied spec; document on backend side or remove the call in `logOut.ts`.

---

_Last regenerated against the current source tree on branch `deploy`._