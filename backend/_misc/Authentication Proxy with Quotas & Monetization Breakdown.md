# 🔹 1. Users & Roles

Your platform has **two primary roles**:

* **Creators** → People/organizations who expose their APIs through your system.
* **Consumers** → People/organizations who subscribe to, pay for, and use those APIs.

### 1. Creators (API Providers)

**Who they are:**

* Individuals, developers, or companies who own or operate an API and want to monetize it or manage access to it.

**What they do in the system:**

1. **Onboarding**

   * Sign up as a creator.
   * Provide account details (company name, payment details for payouts, etc.).

2. **Create API Products**

   * Register their API into your platform.
   * Define metadata (title, description, version, base URL, etc.).
   * Add **routes/endpoints** through a proxy layer.

3. **Define Access Rules**

   * Create **plans & pricing** per product.
   * Set **quotas** (calls/month).
   * Define **rate limits** (requests/sec).
   * Assign **minimum plan requirements** per route (e.g., some routes are free, others require Pro), ensuring that only consumers subscribed to the appropriate plan can access and use them.
   * All of that to control how consumers can access and utilize the product.

4. **Monetization**

   * Choose pricing models (subscription, overage, tiers).
   * Manage revenue dashboards (income, payouts, etc.).

5. **Support & Documentation**

   * Add API documentation (per route).
   * Provide changelogs.
   * Offer support channels (community, priority, enterprise-level).

6. **Billing & Payouts**

   * See how much consumers paid.
   * Receive **payouts** from the platform based on consumer payments.
   * View platform fees & payout schedules.
  
7. **They manage **consumers** (who subscribed to their products).**

👉 In short: **Creators design, publish, and monetize APIs.**

---

### 2. Consumers (API Users)

**Who they are:**

* Developers, businesses, or apps that want to use the creator’s API.

**What they do in the system:**

1. **Onboarding**
   * Sign up as a consumer.
   * Provide payment details.

2. **Discover APIs**
   * Browse available API products.
   * Compare pricing & features.
   * View documentation before subscribing.

3. **Subscribe to Plans**
   * **Subscribing to an API product** is the act of selecting a plan (free or paid) that grants you access to that API’s routes.
   * Pick a plan for a product (Free/Pro/Enterprise).
   * Pay subscription fees (if not free). **Paying for a plan** is the financial step (if it’s not a free tier) required to complete the subscription and unlock usage.
   * After **Subscribing**, they receive **API keys** that grant access to the product’s endpoints.

4. **Use APIs**
   * Make requests to the API through the proxy.
   * System checks: authentication, plan validity, quota, and rate limits.

5. **Monitor Usage**
   * View usage dashboard (calls used, quota left, overages, rate limit errors).

6. **Billing & Payments**
   * See invoices & payment history.
   * Handle renewals, cancellations, downgrades, or upgrades.

👉 In short: **Consumers subscribe to plans and use APIs with controlled access.**

---

### 3. Platform Role (You, the system owner)

Not exactly a “user,” but important:

* Your platform is the **middleman** that connects creators and consumers.
* It handles authentication (API keys, tokens), enforces rules (rate limits, quotas), collects **payments from consumers**, takes its cut, and distributes **revenue to creators**.
* Also provides observability (usage, logs, metrics).
* It may optionally charge **creators a subscription fee** for hosting their APIs on the platform.

---

### 4. Relationship between Creator & Consumer

* A **creator owns many products (APIs)**.
* A **consumer can subscribe to many products** (and different plans for each).
* Subscription links **consumer → plan → product**.
* Access is mediated by your platform (never direct).

---

### 5. Things to Keep in Mind

* **Role separation**: A single account should be able to act as both consumer & creator (just like GitHub lets you be repo owner & contributor).
* **Authentication**: Each role should see only the features relevant to them (creators shouldn’t see invoices for subscriptions they didn’t make).
* **Permissions & Security**:

  * Creators shouldn’t be able to see consumer payment data.
  * Consumers shouldn’t be able to edit creator’s API details.
* **Lifecycle**:

  * Creator publishes → consumer subscribes → consumer uses → platform enforces rules → billing happens → creator gets paid.

---

# 🔹 2. The API Product (the centerpiece)

Every **API product** is the unit of exchange on the platform.

### 2.1 Definition

* An **API product** = a bundle of endpoints (routes) + documentation + pricing plans + support details.
* Example: “Weather API” with `/current-weather`, `/forecast`, `/historical-data`.

### 2.2 Subscription Plans

* Plans apply to the **entire product**, not individual routes
* **List of Available Plans:** Free, Pro, Enterprise.
* Consumers subscribe to a **plan** at the product level.
* Each route (endpoint) specifies the **minimum plan required** to access it.
  * Example: `/current-weather` → accessible with Free plan or above.
  * Example: `/forecast` → requires Pro plan or above.

👉 Before subscribing, this section is for comparison & decision-making.
👉 After subscribing, it should highlight which plan the consumer is on.

### 2.3 Documentation

  * Lists all routes (endpoints) in detail.
  * For each endpoint: method, parameters, responses, limits, examples.
  * Before subscription: still visible, but "Try It Out" is disabled.
  * After subscription: fully interactive.

### 2.4 Changelog

* Timeline of updates to the API (new endpoints, bug fixes, deprecations).
* Example:
  * Jan 2025: Added /forecast route.
  * Dec 2024: Fixed issue with authentication.

### 2.5 Support

* Contact details (email, chat, ticket system).
* FAQs or community forum links.
* Support level depends on plan (e.g., free = community only, pro = email, enterprise = dedicated manager).

### 2.6 Billing & Subscription (After Subscription Only)

* Current plan (e.g., Pro Plan $29.99/mo).
* Quota used vs. quota remaining.
* Next billing date.
* Option to upgrade, downgrade, or cancel.
* Payment methods, invoices, receipts.

👉 Not shown before subscription, since you’re not a paying customer yet.

### 2.7 API Usage (After Subscription Only)

* Real-time or near-real-time usage stats:
  * API calls used this cycle.
  * Remaining quota.
  * Rate limit hit logs (if exceeded).
* Helps consumers track their consumption and avoid overages.


---

# 🔹 3. Documentation (Per Route Details)

### 🔹 Purpose

The **Documentation** section explains **how to use the API product’s endpoints (routes)**.
It’s the “manual” that consumers read before and after subscribing.

It **should be clear, structured, and practical** — enough so that a developer can copy-paste examples and start making requests without confusion.

---

### 🔹 Structure of Documentation Tab

1. **Overview of Product Usage**

   * Quick intro: what the API does.
   * Authentication requirements (e.g., API keys, headers).
   * Base URL of the API proxy.
   * General notes about rate limits, quotas, and error handling.

2. **Per-Route Details** (the core part)
   Each route (endpoint) should include:

   * **Route Name / Title** → e.g., “Get Current Weather”
   * **Endpoint URL** → e.g., `/weather/current`
   * **HTTP Method** → GET / POST / PUT / DELETE
   * **Minimum Required Plan** → Free / Pro / Enterprise
   * **Description** → what this route does.
   * **Parameters** →

     * Path parameters (`/weather/{city}`)
     * Query parameters (`?units=metric&lang=en`)
     * Request body (if POST/PUT)
   * **Response Examples** → JSON samples for success & error.
   * **Errors / Status Codes** → explain `400`, `401`, `429 (rate limit)`, etc.
   * **Rate Limit Behavior** (if different from global limit).

3. **Plan Restrictions Inside Docs**

   * Each route explicitly shows what **minimum plan** is needed.
   * Example:

     * `/current-weather` → ✅ Free
     * `/forecast/7days` → 🔒 Pro required
     * `/historical` → 🔒 Enterprise required

   (This prevents consumers from being surprised after subscribing).

4. **Code Examples (per language)**

   * Show how to call the route in **curl, Python, JavaScript, C#, etc.**
   * Include authentication example with API key.

5. **Try It Out (Playground)**

   * An interactive tool inside docs.
   * Consumers can test endpoints directly from the browser.
   * If **not subscribed**, this is disabled or mocked with sample responses.
   * If **subscribed**, they can try real API calls with their own key.

## 📑 API Route Documentation Template

### 🔹 Route Summary

* **Name:** (short human-readable name, e.g., *Get Current Weather*)
* **Endpoint URL:** `/example/path/{id}`
* **Method:** `GET | POST | PUT | DELETE`
* **Minimum Required Plan:** Free / Pro / Enterprise
* **Description:** What this endpoint does in plain English.

---

### 🔹 Parameters

* **Path Parameters**

  | Name | Type   | Required | Description       | Example |
  | ---- | ------ | -------- | ----------------- | ------- |
  | `id` | string | ✅        | Unique identifier | `12345` |

* **Query Parameters**

  | Name    | Type   | Required | Description       | Example  |
  | ------- | ------ | -------- | ----------------- | -------- |
  | `units` | string | ❌        | Measurement units | `metric` |

* **Request Body** (if applicable, for POST/PUT)

  ```json
  {
    "field1": "value",
    "field2": 123
  }
  ```

---

### 🔹 Response

* **Success (200)**

  ```json
  {
    "result": "data here"
  }
  ```

* **Error Responses**

  | Code | Meaning             | Example                            |
  | ---- | ------------------- | ---------------------------------- |
  | 400  | Bad Request         | `{ "error": "Missing parameter" }` |
  | 401  | Unauthorized        | `{ "error": "Invalid API key" }`   |
  | 429  | Rate Limit Exceeded | `{ "error": "Too many requests" }` |

---

### 🔹 Rate Limit & Quota Behavior

* **Quota impact:** Counts toward global monthly quota (50,000 calls for Pro).
* **Rate Limit:** e.g., `100 requests / sec` for this endpoint.
* **Overages:** If quota exceeded, extra \$0.001/request.

---

### 🔹 Code Examples

* **curl**

  ```bash
  curl -X GET "https://api.example.com/weather/current?city=London" \
       -H "Authorization: Bearer {API_KEY}"
  ```

* **Python**

  ```python
  import requests
  requests.get("https://api.example.com/weather/current?city=London",
               headers={"Authorization": "Bearer {API_KEY}"})
  ```

* **C#**

  ```csharp
  var client = new HttpClient();
  client.DefaultRequestHeaders.Add("Authorization", "Bearer {API_KEY}");
  var res = await client.GetAsync("https://api.example.com/weather/current?city=London");
  ```

---

### 🔹 Try It Out

* If **not subscribed** → Disabled, show example/mock response.
* If **subscribed** → Enabled, run live request with consumer’s key.

👉 This way every single route looks the same: **name, method, plan, parameters, responses, limits, examples, try-it-out**.
Super repetitive (on purpose), but consistent and predictable.

---

# 🔹 3. Plans & Subscriptions

### 3.1 What is a Plan?

A **Plan** is a predefined package that defines how a consumer can use an API product. It sets:

* **Quota** → maximum number of API calls allowed per billing cycle (e.g., 50,000 calls/month).
* **Rate Limit** → how many requests can be made in a short window (e.g., 100 requests/minute).
* **Features/Access** → which routes/endpoints the consumer can access.
* **Price** → how much it costs per billing cycle (free, \$29.99/month, etc.).
* **Overage Rules** → what happens if the consumer exceeds the quota (block, pay per extra call, etc.).

### 3.2 What is a Subscription?

A **Subscription** is the consumer’s agreement to a specific plan of a product.

* **Consumer subscribes →** gets API keys tied to that plan.
* **Duration →** subscriptions are tied to the billing cycle (e.g., monthly).
* **Renewal →** subscriptions automatically renew each billing cycle unless canceled.
* **Quota Reset →** at the start of every billing cycle, the consumer’s quota resets automatically.

### 3.3 Lifecycle of a Subscription

1. **Subscribe** → consumer picks a plan (e.g., Pro Plan).
2. **API Key Issued** → they receive an API key tied to that plan.
3. **Consume** → they make requests within the quota & rate limits.
4. **If Quota Reached** →

   * Blocked until reset, OR
   * Allowed overages (if defined in the plan).
5. **Renewal** → at the next billing cycle:

   * Payment processed automatically.
   * Quota resets.
   * Subscription continues.
   
6. **Canceling a Subscription** →

   * The consumer continues to use their current plan and quota until the billing cycle finishes.
   * Once the cycle ends, the subscription does not renew, and access to the product is revoked.
7. **Downgrading a Plan** →

   * The consumer retains the benefits and quota of their current (higher) plan until the billing cycle ends.
   * At the start of the next cycle, the downgraded (lower) plan’s quota & features gets applied.

---

# 🔹 4. API Usage

### 1. What is API Usage?

API Usage refers to how much of the allocated **quota** (number of API calls) a consumer has consumed within their **billing cycle**.
It shows whether they’re staying within limits or approaching exhaustion of their plan’s allowance.


### 1. Quotas vs. Rate Limits

**Quotas** and **Rate Limits** are two different mechanisms used to control API usage. Both protect the creator’s resources and enforce fairness between consumers, but they work in different ways:

#### 🔹 Quotas (per product)

* **What it is:** The *total number of API calls* a consumer can make in a given period (e.g., per day, per month).
* **Example:** A Pro plan allows **50,000 calls/month**.
* **Behavior:**
  * Shared across all routes in the product.
  * Each API call decreases the remaining quota.
  * When the quota is **exhausted**, further requests are **blocked** (HTTP 429 Too Many Requests or similar error).
  * Quotas **reset automatically** at the start of the next billing/usage cycle (e.g., the first day of the month).

#### 🔹 Rate Limits (per route)

* **What it is:** Maximum requests allowed **per second/minute** for each individual route. It prevents bursts of traffic from overwhelming the API.
* **Example:** A Pro plan allows **100 requests per minute**.
* **Behavior:**

  * Enforced in real-time (e.g., 10 requests/sec on `/current-weather`, 5 requests/sec on `/forecast`).
  * Each request is counted in a sliding or fixed time window (e.g., 1 minute).
  * If the consumer exceeds the limit, requests are **temporarily blocked** until the time window resets.

  * After reset (e.g., next minute), they can continue making requests, as long as their **monthly quota** still allows it.

#### 🔹 Overages

* **Definition:** Extra requests allowed beyond the quota, typically at an additional cost.
* **Example:** Enterprise plan → **\$0.0005 per extra request**, up to 100,000 extra calls.
* **Behavior:**

  * If enabled, consumers don’t get hard-blocked when their quota is exhausted.
  * Instead, calls are still processed but are **billed per extra request**.
  * Overages may have their own cap (to prevent abuse).

#### 🔹 How They Work Together

* **Quota** controls the **long-term total** usage (macro-level).
* **Rate limit** controls the **short-term burstiness** (micro-level).
* Example:

  * You have **10,000 calls/month quota**.
  * You also have a **100 requests/minute rate limit**.
  * Even if you have plenty of quota left, you cannot exceed the per-minute limit.


### 2. What Counts as “Usage”?

* **API Calls:** Each request to an endpoint counts.
* **Quota Consumption:** The system subtracts from the monthly quota (e.g., 50,000 calls/month).
* **Rate Limits:** Requests also count against the rate limit (e.g., 100 calls/minute), but this is a short-term restriction rather than monthly.

### 3. How Usage is Measured & Displayed

Consumers should see:

* **Total API Calls Used** (e.g., 34,200 / 50,000).
* **Percentage of Quota Consumed** (e.g., 68%).
* **Remaining Calls** (e.g., 15,800 left this month).
* **Current Billing Cycle Dates** (e.g., Jan 15 → Feb 15).
* Optional: usage per endpoint/feature (helps them understand which routes cost the most).

### 4. What Happens When Limits are Reached?

* **Quota Exceeded (monthly):**

  * Requests beyond quota calls are **blocked** unless **overage** pricing is enabled. (depends on plan rules).
* **Rate Limit Exceeded (short-term):**

  * The consumer gets a **429 Too Many Requests** error and must wait until the window resets (e.g., next second/minute).
* **Reset Behavior:**

  * Quota resets automatically at the start of the next billing cycle.
  * Rate limit resets automatically after its short time window.

### 5. Where Usage is Shown in UI

* **Consumer Dashboard:** At-a-glance usage across all subscribed products.
* **Subscribed Product Page:** Detailed usage for that specific API product (calls used, remaining, endpoint breakdown).
    * Remaining quota (shared across all routes).
    * Current usage stats (e.g., 32,140/50,000 calls used).
    * Rate limits per route, so consumers know restrictions for each endpoint.
* **Billing Page (optional):** Linked summary showing quota vs. cost (especially if overages apply).

---

# 🔹 5. Consumer-Side UI (what consumers see)

Consumers need a UI that lets them **discover, subscribe, and manage usage**.

### 3.1 Before Subscription

* Sections visible:

  * Overview (what the API does, features, value prop).
  * Documentation (full docs, with “Required Plan” badges).
  * Plans & Pricing (list of Free/Pro/Enterprise tiers).
  * Changelog (updates).
  * Support info.
* **Try It Out** section is shown but **disabled/locked**.

### 3.2 After Subscription

* All the above sections, but:

  * **Try It Out is unlocked** (consumer can test API directly in browser).
  * Consumer’s **current plan** is highlighted in “Plans & Pricing”.
  * API Keys are visible for integration.

### 3.3 Consumer Billing Page

* This is where consumers manage **their own subscription to products**.
* Don’t repeat all billing details inside each product page. Instead, have on “Billing” page that groups subscriptions, invoices, and payment details across all products.

* Each subscribed product page can show just a quick summary (current plan, usage, upgrade button), but the full billing info stays centralized.

* Billing here means everything related to payment: subscription charges, invoices, receipts, payment methods, and renewal/cancellation management.
* Elements include:

  * Current subscribed plan (Pro, Free, etc.).
  * API usage stats (quota used/remaining).
  * Current bill / next billing date.
  * Payment method (credit card, PayPal, etc.).
  * Invoices & receipts history.
  * Quick actions: upgrade/downgrade, cancel, download invoice.

---

# 🔹 6. Creator-Side UI (what creators see)

Creators have a **dashboard to publish and monetize products**.

### 4.1 Navigation Tabs (corrected)

* **Dashboard** – revenue summary, usage highlights, alerts.
* **My API Products** – list of products they’ve published.

  * Each product has sub-tabs: Documentation, Plans & Pricing, Consumer Management.
* **Revenue Dashboard** – detailed earnings reports (per product, per plan, time-based).
* **Consumer Management** – view list of consumers subscribed to products.
* **Payouts** – manage payout method, view payout history, taxes.
* **Profile & Settings** – org details, account settings, team.
* *(Optional)* **Platform Subscription** – only if platform charges creators for hosting.

### 4.2 Key Pages in Detail

#### My API Products

* CRUD API products (create/edit/delete).
* Define routes, upload docs (OpenAPI, markdown).
* Publish/unpublish product.

#### Plans & Pricing (scoped to a single product)

* Create/manage plans per product.
* Define quotas, rate limits, features, price, overages.
* Assign routes to required plan tiers.
* Consumers see these in product docs.

#### Documentation (scoped to a product)

* Upload/edit API docs.
* Mark routes with “Required Plan”.
* Add examples, guides, changelog entries.

#### Consumer Management

* View consumers subscribed to each product.
* See usage stats per consumer.
* Manage subscriptions (ban, revoke, force upgrade/downgrade).

#### Revenue Dashboard

* Charts: revenue by product, by plan, by time.
* Breakdown: gross revenue, platform fees, net payout.

#### Payouts

* Balance summary (available, pending, upcoming).
* Payout method (Stripe/PayPal/Bank).
* Payout history (list with ID, date, amount, status).
* Tax/KYC compliance info.
* Quick actions (request payout, update payout method, download tax forms).

---

# 🔹 7. Money Flows (clear separation)

We identified **3 money flows** to avoid confusion:

1. **Consumer → Platform → Creator**

   * Consumers pay for API product plans.
   * Platform takes commission (e.g., 10%).
   * Creator receives payout of the remainder.

2. **Platform → Creator (payouts)**

   * Tracked in **Payouts page** for creators.
   * This page shows earnings, balances, and payout history.

3. **Creator → Platform (platform subscription, optional)**

   * If creators must pay a fee to host APIs.
   * Shown in **Platform Subscription page**, separate from payouts.

---

# 🔹 8. Consistency Rules

* **Plans are tied to API products**, not global.
* **Documentation and Plans** must share the same plan-to-route mapping (avoid drift).
* **Consumers see billing for their subscriptions**, **creators see payouts from revenue**.
* **Try It Out** is always visible, but locked until subscription.
* **Invoices** belong to consumers (for their subscriptions), not creators.

---

# 🔹 9. Corrected Navigation Summary

## Consumer UI

* Dashboard (usage overview).
* My Subscriptions (list of subscribed products & current plans).
* API Keys.
* Billing & Subscription (consumer’s bills, invoices, payment method).
* Support.
* Profile & Settings.

## Creator UI

* Dashboard (overview: revenue, product performance).
* My API Products

  * Documentation (per product).
  * Plans & Pricing (per product).
  * Consumer Management (per product).
* Revenue Dashboard.
* Payouts.
* Profile & Settings.
* *(Optional)* Platform Subscription.

---

# 🔹 10. Billing & Invoices

### 1. **Billing**

* **Definition:**
  Billing is the process of charging consumers for their active subscriptions and any additional usage (overages).
  * process of charging consumers.
* **How it works:**

  * Every **billing cycle** (usually monthly), the system automatically charges the consumer for:

    * The **base price of the plan** they subscribed to (e.g., \$29.99/month).
    * Any **overage charges** (extra calls beyond quota).
  * Payment is made through a stored **payment method** (e.g., credit card, PayPal).
* **Key Points:**

  * Billing is tied to the **subscription cycle**.
  * If a consumer cancels, billing stops after the current cycle ends.
  * If they downgrade/upgrade, billing adjusts accordingly in the next cycle.

### 2. **Invoices**

* **Definition:**
  An invoice is the **official record/receipt** of a billing event.
    * official records of charges.
* **Contents of an Invoice:**

  * Invoice number (e.g., INV-2025-001)
  * Date issued
  * Due date (when payment is expected)
  * Plan details (e.g., Pro Plan, \$29.99/mo)
  * Usage summary (quota used, overages if any)
  * Amount charged
  * Status: Paid, Pending, Failed, Overdue
* **Why Important:**

  * Consumers use invoices for **tracking expenses** or **reimbursements**.
  * Creators use them to manage **revenue reporting**.


### 3. **Overages in Billing**

* If a consumer exceeds their quota:

  * The extra calls are charged as **overages** (e.g., \$0.001 per extra request).
  * These appear in the **invoice** for that billing cycle.


### 4. **UI Representation** (Consumer Side)

The **Billing & Invoices page** typically shows:

* **Active Plan & Price** (e.g., Pro Plan, \$29.99/mo).
* **Next Billing Date** (e.g., Sep 15, 2025).
* **Current Cycle Usage** (quota consumed vs total).
* **Payment Method** (credit card info, update option).
* **Quick Actions** (Download Receipt, View Usage History, Update Payment Method).
* **Invoice List** with filters (Status: paid, pending, overdue).


### 5. **UI Representation** (Creator Side)

Creators don’t get billed; they **earn revenue**.
Their “Billing & Invoices” is more like **Revenue Dashboard**:

* Earnings breakdown by API product.
* Payout history (when they got paid by the platform).
* Pending payouts.
* Commission/fees from the platform.

--- 

# 🔹 10. API Keys & Authentication

Every consumer that subscribes to an API **needs a way to prove their identity** when calling the API. This proof is called **authentication**.

---

### 1. **What an API Key Is**

* A long random string (like `a3f6b-39ad2-...`).
* Issued by the platform when a consumer subscribes to a plan.
* Must be included in every request to the API.
* Identifies:

  * **Which consumer** is calling.
  * **Which plan** they belong to.
  * **How much quota/rate limit** remains for them.

---

### 2. **Where & How API Keys Are Used**

* Consumers include their API key in requests, usually via:

  * **HTTP Header:** `Authorization: Bearer <api_key>`
  * **Query Parameter:** `?api_key=xxxx` (less secure, but common).
* The platform’s **gateway/middleware** checks the key *before* letting the request reach the API route.

👉 Without a valid key → request is rejected with `401 Unauthorized`.

---

### 3. API Key Lifecycle (Undecided yet)

* **Generated:** When subscription starts.
* **Active:** Used for requests.
* **Expires (optional):** Some keys may auto-expire after X days.
* **Revoked:** Creator/platform can disable if abuse is detected.
* **Regenerated:** Consumer can request a new key (old one becomes invalid).

---

### 4. One Key or Multiple Keys? (Undecided yet)

Many platforms allow **multiple keys per consumer** for flexibility:

* Example: One key for development, one for production.
* Consumer can rotate keys without downtime.

---

### 5. **Security Best Practices**

* Rotate keys periodically (regenerate).
* Monitor for leaked keys (if a key leaks, the attacker gets free access).

---

### 6. **Authentication vs Authorization**

* **Authentication = Who you are** (the API key identifies the consumer).
* **Authorization = What you can do** (the plan defines limits, routes, and quotas).

👉 Example:

* API key proves: *This is User123*.
* Plan says: *User123 is on Free Plan → max 1000 calls, can’t access `/forecast`*.

---

### 7. **Errors & Behaviors**

When calling an API with keys:

* **No key:** `401 Unauthorized`
* **Invalid key:** `401 Unauthorized`
* **Expired key:** `401 Unauthorized` with “expired” reason.
* **Valid key but out of quota:** `403 Forbidden` (you’re authenticated, but not allowed).
* **Valid key but hitting rate limit:** `429 Too Many Requests`

---

### 8. **Consumer Experience (Frontend)**

On the **API Product Page → After Subscription**, there should be a tab/section:

* **API Keys**:

  * Show existing keys.
  * Option to generate a new key.
  * Option to revoke a key.
  * Copy button (quickly copy key).
* **Authentication Guide:**

  * Explains how to include the key in requests (header vs query param).
  * Shows example request with curl, Postman, or code snippets.

---

### 9. **Advanced Options (Optional for Later)**

* **OAuth2/JWT**: Instead of plain API keys, some services use OAuth tokens for more secure, user-based authentication.
* **Scopes/Permissions**: Keys can have scopes (e.g., "read-only" vs "write").
* **IP Restrictions**: Limit a key to only be used from certain IPs.
* **Key Usage Analytics**: Show per-key request stats.

---

### 🔹 TL;DR

* API Keys are **unique credentials** given to consumers when they subscribe.
* They **authenticate the consumer** and tie them to a plan.
* They can be **generated, revoked, expired, or rotated**.
* They must be included in every request (usually via header).
* Platform uses them to enforce **quota, rate limit, and route restrictions**.

---

# 🔹 Example Flow (End-to-End)

1. A creator publishes “Weather API” with 3 plans: Free, Pro, Enterprise.
2. Consumer browses the product.

   * Can see Overview, Docs (with plan badges), Pricing, but “Try It Out” is locked.
3. Consumer subscribes to Pro plan → enters payment details.
4. Consumer gets API keys → now “Try It Out” works.
5. Platform bills consumer monthly → invoices appear in **consumer billing page**.
6. Platform takes 10% → Creator’s **Payouts page** shows net revenue.
7. At payout cycle, platform sends funds → Creator sees it in **Payout history**.