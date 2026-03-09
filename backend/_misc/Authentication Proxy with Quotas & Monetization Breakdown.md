# 🔹 1. Users & Roles

Your platform has **two primary roles**:

* **Creators** → People/organizations who expose their APIs through your system.
* **Consumers** → People/organizations who subscribe to, pay for, and use those APIs.

Here are some cleaner alternatives:

* **Consumer** → **Client** / **Subscriber**
* **Creator** → **Provider** / **Publisher**


### 1. Creators

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

---

### 2. Consumers

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

### 3. Things to Keep in Mind

* **Role separation**: A single account should be able to act as both consumer & creator (just like GitHub lets you be repo owner & contributor).
* **Authentication**: Each role should see only the features relevant to them (creators shouldn’t see invoices for subscriptions they didn’t make).
* **Permissions & Security**:

  * Creators shouldn’t be able to see consumer payment data.
  * Consumers shouldn’t be able to edit creator’s API details.
* **Lifecycle**:

  * Creator publishes → consumer subscribes → consumer uses → platform enforces rules → billing happens → creator gets paid.

---

# 🔹 2. The API Product

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

### 2.7 API Usage (After Subscription Only)

* Real-time or near-real-time usage stats:
  * API calls used this cycle.
  * Remaining quota.
  * Rate limit hit logs (if exceeded).
* Helps consumers track their consumption and avoid overages.


---

# 🔹 3. Documentation

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

# 🔹 4. Plans & Subscriptions

### 3.1 What is a Plan?

A **Plan** is a predefined package that defines how a consumer can use an API product. It sets:

* **Quota** → maximum number of API calls allowed per quota period (e.g., 50,000 calls/month).

  * Always defined at the **plan level** (shared across all routes accessible in that plan).
  * Endpoints included in the plan (both the plan’s tier and any lower-tier endpoints) share the same quota pool.
  * Endpoints outside of the plan (higher-tier or restricted ones) are not accessible at all and therefore do not count toward quota usage.
  * **Quota Periods →** creators can choose from allowed ranges: daily, weekly, monthly, yearly.
* **Rate Limit** → how many requests can be made in a short window (e.g., 100 requests/minute).

  * Typically applied per endpoint, but still tied to the plan.
  * **Rate Limit Periods →** creators can choose from allowed ranges: per second, per minute, per hour.
* **Features/Access** → which routes/endpoints the consumer can access (some may require higher-tier plans).
* **Price** → how much it costs per billing cycle (Free, \$29.99/month, etc.).
* **Overage Rules** → what happens if the consumer exceeds the quota (block further usage, pay per extra call, etc.).

### 3.2 What is a Subscription?

A **Subscription** is the consumer’s agreement to a specific plan of a product. It governs their access and usage for the duration of the billing cycle.

* **Consumer subscribes →** they get API keys tied to that plan.
* **Duration →** subscriptions are tied to a billing cycle (commonly monthly, but can also be yearly or weekly).
* **Renewal →** subscriptions automatically renew at the end of each billing cycle unless canceled.
* **Quota Reset →** quotas can reset in multiple ways:

  * **At the start of the billing cycle** → automatically resets monthly, weekly, etc., depending on the plan.
  * **On plan upgrade/downgrade** → subscribing to a new plan can immediately reset or adjust the quota according to the new plan.
  * **Manually** → an admin or support can reset a consumer’s quota for special cases.
  * **Time-based independent resets** → some quotas may reset daily, weekly, or at other intervals shorter than the billing cycle.
* **Quota Size Adjustment →** when a consumer changes plans, their total quota may increase or decrease according to the new plan’s limits.
* **Access Rules →** if a consumer hits their quota:

  * If no overages allowed → further API requests are blocked until the quota resets.
  * If overages are allowed → requests continue but are billed extra according to the plan.
* **Separation of Concerns →** billing (payment) and quota reset are separate mechanisms. Hitting a quota does not affect billing, and a billing cycle does not automatically reset quotas unless it aligns with the quota period.

### 3.3 Lifecycle of a Subscription

1. **Subscribe** → consumer selects a plan (e.g., Pro Plan).
2. **API Key Issued** → they receive an API key tied to that plan.
3. **Consume** → they make requests within the defined quota & rate limits.
4. **Quota Reached →**
   * If no overages allowed → access is **blocked** until the quota resets.
   * If overages are allowed → requests continue but are billed extra according to plan rules.
5. **Quota Reset →** can occur in multiple ways:
   * **Automatic at billing cycle start** → resets monthly, weekly, etc.
   * **On plan upgrade/downgrade** → subscribing to a new plan can reset or adjust the quota immediately.
   * **Time-based independent resets** → quotas defined per day/week can reset even within a billing cycle.
   * **Manual reset** → admin or support can reset quota for special cases.
6. **Renewal** → at the start of the next billing cycle:
   * Payment is processed automatically.
   * Quota resets according to the quota period rules.
   * Subscription continues seamlessly.
7. **Canceling a Subscription** →
   * The consumer keeps their current plan and quota until the billing cycle ends.
   * Once the cycle ends, the subscription does not renew and access is revoked.
8. **Downgrading a Plan** →
   * The consumer retains the current plan’s benefits and quota until the billing cycle ends.
   * At the start of the next cycle, the downgraded plan’s quota, limits, and features are applied.

---

# 🔹 5. API Usage (Updated)

### 1. What is API Usage?

API Usage refers to how much of the allocated **quota** (number of API calls) a consumer has consumed within their **quota period**.
It shows whether they’re staying within limits or approaching exhaustion of their plan’s allowance.

### 2. Quotas vs. Rate Limits

**Quotas** and **Rate Limits** are two different mechanisms used to control API usage. Both protect the creator’s resources and enforce fairness between consumers, but they work in different ways:

#### 🔹 Quotas (per product)

* **What it is:** The *total number of API calls* a consumer can make in a given period (daily, weekly, monthly, etc.).
* **Example:** A Pro plan allows **50,000 calls/month**. It may also have **daily limits** (e.g., 2,000 calls/day).
* **Behavior:**

  * Shared across all routes in the product.
  * Each API call decreases the remaining quota; some endpoints may consume multiple units if weighted differently.
  * When the quota is **exhausted**, further requests are **blocked** (HTTP 429 Too Many Requests or similar error).
  * Quotas **reset automatically** at the end of their defined period.
  * **Billing cycle and quota period are separate** → hitting a quota does not affect billing, and a billing cycle does not automatically reset quotas unless it aligns with the quota period.

#### 🔹 Rate Limits (per route)

* **What it is:** Maximum requests allowed **per second/minute** for each individual route. It prevents bursts of traffic from overwhelming the API.
* **Example:** A Pro plan allows **100 requests per minute**.
* **Behavior:**

  * Enforced in real-time (e.g., 10 requests/sec on `/current-weather`, 5 requests/sec on `/forecast`).
  * Each request is counted in a sliding or fixed time window (e.g., 1 minute).
  * If the consumer exceeds the limit, requests are **temporarily blocked** until the window resets.
  * After reset, they can continue making requests, as long as their **quota** still allows it.

#### 🔹 Overages

* **Definition:** Extra requests allowed beyond the quota, typically at an additional cost.
* **Example:** Enterprise plan → **\$0.0005 per extra request**, up to 100,000 extra calls.
* **Behavior:**

  * If enabled, consumers don’t get hard-blocked when their quota is exhausted.
  * Calls are processed but are **billed per extra request**, usually capped to prevent abuse.

#### 🔹 How They Work Together

* **Quota** controls the **long-term total** usage (macro-level).
* **Rate limit** controls the **short-term burstiness** (micro-level).
* Example:

  * You have **10,000 calls/month quota**.
  * You also have a **100 requests/minute rate limit**.
  * Even if you have plenty of quota left, you cannot exceed the per-minute limit.

---

### 3. What Counts as “Usage”?

* **API Calls:** Each request to an endpoint counts.
* **Quota Consumption:** Subtracts from the quota period (daily, weekly, monthly, etc.). Weighted endpoints may consume multiple units.
* **Rate Limits:** Requests also count against the rate limit but this is a short-term restriction rather than a quota.

---

### 4. How Usage is Measured & Displayed

Consumers should see:

* **Total API Calls Used** (e.g., 34,200 / 50,000).
* **Percentage of Quota Consumed** (e.g., 68%).
* **Remaining Calls** (e.g., 15,800 left this period).
* **Current Quota Period** (e.g., Jan 15 → Jan 21 for a weekly quota).
* Optional: usage per endpoint/feature (helps consumers understand which routes consume the most quota).

---

### 5. What Happens When Limits are Reached?

* **Quota Exceeded:**

  * Requests beyond quota are **blocked** unless **overage** pricing is enabled.
  * Applies per quota period, independent of billing cycle.
* **Rate Limit Exceeded:**

  * The consumer gets a **429 Too Many Requests** error and must wait until the window resets.
* **Reset Behavior:**

  * Quotas reset automatically at the end of their defined period (daily, weekly, monthly).
  * Rate limits reset automatically after their short time window.

---

# 🔹 6. Money Flows

1. **Consumer → Platform → Creator**
   * Consumers pay for API product plans.
   * Platform takes commission.
   * Creator receives payout of the remainder.
   
2. **Platform → Creator (payouts)**

   * Tracked in **Payouts page** for creators.
   * This page shows earnings, balances, and payout history.


---

# 🔹 7. Billing & Invoices

### 1. **Billing**

* **Definition:**
  Billing is the process of charging consumers for their active subscriptions and any additional usage (overages).
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

---

# 🔹 8. API Keys & Authentication

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

### 2. **Where & How API Keys Are Used**

* Consumers include their API key in requests, usually via:

  * **HTTP Header:** `Authorization: Bearer <api_key>`
  * **Query Parameter:** `?api_key=xxxx` (less secure, but common).
* The platform’s **gateway/middleware** checks the key *before* letting the request reach the API route.

### 3. API Key Lifecycle (Undecided yet)

* **Generated:** When subscription starts.
* **Renewal** → keep the same key so consumer apps don’t break.
* **Active:** Used for requests.
* **Revoked:** Creator/platform can disable if abuse is detected.
* **Rotation** → manual, only if compromised or user requests.
* **Regenerated:** Consumer can request a new key (old one becomes invalid).
* **Expiration** → not needed; billing status decides validity.

### 4. One Key or Multiple Keys? (Undecided yet)

Many platforms allow **multiple keys per consumer** for flexibility:

* Example: One key for development, one for production.
* Consumer can rotate keys without downtime.

### 5. **Security Best Practices**

* Rotate keys periodically (regenerate).
* Monitor for leaked keys (if a key leaks, the attacker gets free access).

### 6. **Authentication vs Authorization**

* **Authentication = Who you are** (the API key identifies the consumer).
* **Authorization = What you can do** (the plan defines limits, routes, and quotas).

Example:

* API key proves: *This is User123*.
* Plan says: *User123 is on Free Plan → max 1000 calls, can’t access `/forecast`*.

### 7. **Errors & Behaviors**

When calling an API with keys:

* **No key:** `401 Unauthorized`
* **Invalid key:** `401 Unauthorized`
* **Expired key:** `401 Unauthorized` with “expired” reason.
* **Valid key but out of quota:** `403 Forbidden` (you’re authenticated, but not allowed).
* **Valid key but hitting rate limit:** `429 Too Many Requests`

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

### 9. **Advanced Options (Optional for Later)**

* **OAuth2/JWT**: Instead of plain API keys, some services use OAuth tokens for more secure, user-based authentication.
* **Scopes/Permissions**: Keys can have scopes (e.g., "read-only" vs "write").
* **IP Restrictions**: Limit a key to only be used from certain IPs.
* **Key Usage Analytics**: Show per-key request stats.

---

# 🔹 MVP Modules:

### 🔹 **1. User Module**

Handles user identity and access control.

* Account management (signup, login, logout, password reset).
* Roles: Consumer, Creator, Admin.
* Token issuing (JWT) for secure requests.
* Authorization rules (who can access what resource).

### 🔹 **2. API Product Management Module**

- Handles the creation and management of API products.
  * CRUD for API Products (name, description, categories).
  * Endpoints definition (Public Endpoint + Backend URL).
  * Path & Query Parameters configuration.
  * Required plan assignment per endpoint.
  * Example request/response storage.
  * Store structured metadata to auto-generate consumer-facing documentation.

* Tracks usage and enforces limits.
  * Count requests toward quota (per subscription).
  * Enforce per-endpoint rate limits.
  * Return 429 Too Many Requests if exceeded.

* Manages plans, pricing, and subscriptions.
  * Define plans per product (Free, Pro, Enterprise).
  * Define quota, rate limits, price, and overage rules.
  * Consumer subscribes to a plan.
  * Subscription lifecycle (renewal, cancelation, downgrade).
  * Quota reset at start of billing cycle.

* Handles generation, validation, and rotation of API keys.
  * Generate API keys when consumers subscribe.
  * Support regeneration/rotation of keys.
  * Optionally allow expiration dates on keys.
  * Revoke compromised keys.
  * Validate keys quickly at request time.

### 🔹 **3. Request Proxy & Forwarder Module**

The core gateway functionality.

* Intercept incoming requests.
* Validate API key & plan.
* Verify quota/rate limit before forwarding.
* Forward request to backend service.
* Return response to consumer.

### 🔹 **4. Billing & Invoicing Module**

Handles payments and financials.

* Charge consumers per subscription cycle.
* Calculate overage charges if applicable.
* Generate invoices & payment receipts.
* Store billing history for consumers & creators.

### 🔹 **5. Analytics Module**

Central logging and insights for both creators and consumers.

* Aggregate metrics per endpoint and product.
* Error tracking (e.g., 4xx/5xx responses).
* Display analytics in dashboards:

  * Total calls
  * Usage trends
  * Latency insights
  * Error rates
