# Things to do later

### Endpoint Trie
* Endpoints with fewer optional parameters should override those with more.

### Rate Limiting
* Implement Write-back to update QuotaUsage tables from the cache periodically using background job. ✅
* Refill rate is optional: auto-calculate by default.
    * For **100 requests/min**:

        * **Capacity** = 100 tokens (max stored).
        * **Refill rate** = 100 tokens per 60 seconds → about 1.67 tokens per second.

* But allow creators to override it for finer control.

### URLs and Route Patterns

* Always store `TargetBaseUrl` **with** a one trailing slash.
* Always store `Public` and `Target` paths **without** any leading or trailing slashes.

### Subscriptions
* ✅ When a user cancels, the subscription remains active until the current billing period ends, but it is marked as canceled. No immediate deactivation occurs. 

    * ✅ The user can continue to use the service until **ExpiresAt**.
    * ✅ After **ExpiresAt**, it naturally becomes expired (automatically, not manually).

* Plan changing (upgrade/downgrade) should be only allowed for active, non-canceled subscriptions.
    * **Rules**:

        * ✅ You cannot change plan if the subscription is canceled or expired.

        * When changing:

            * ✅ Keep **SubscribedAt**.

            * ✅ Optionally reset quotas (depends on your billing logic).

            * ✅ **ExpiresAt** stays the same (user already paid for this period).

        * ✅ The new plan must belong to the same API service (to avoid cross-service conflicts).

* If auto-renewal is enabled, the system automatically extends **ExpiresAt**.

* If not, manual renewal means the user explicitly triggers “Renew” before or after expiration.

* ✅ A canceled subscription cannot be renewed or changed!

    * *Reason*:
        * **“Canceled”** means “do not continue after current billing period”.

        * Renewing or changing a canceled subscription contradicts the intent of cancelation.

        * The user must create a new subscription if they change their mind later.

* ✅ Subscription to a plan after canceling should create a new subscription.
    * **Reasoning**
        * The old subscription represents a complete historical record (with its billing cycle, quotas, etc.).

        * Reusing it would mess up usage tracking, events, and billing history.

        * A new subscription means a clean slate:
            * New API key
            * Reset quotas
            * New SubscribedAt and ExpiresAt
            * Proper audit trail

* ⚙️ Behavior

    * ✅ **Happens immediately**, regardless of upgrade or downgrade.
    * ✅ **Billing period resets** only if the new plan has a *different billing period* (e.g., monthly → yearly).
    * ✅ If the billing period is **the same**, the expiration date remains the same (no reset).

* 🚫 Restrictions

    * ✅ **Cannot change plan** if the subscription is canceled or expired.
    * ✅ The user can still **cancel** the subscription anytime and later **subscribe again** to a different plan — but that will create a **new subscription** (resetting quotas and history).

* 💰 Billing Notes

    * In real systems, when users change plans, they usually **pay or get credit** for the time left on their old plan.
    For example, if they already paid for a month and switch in the middle of it, the system might:

    * **Give them credit** for the unused days on the old plan.
    * **Charge extra** if the new plan is more expensive.
    * In your system, this **doesn’t happen yet** — the plan just changes instantly, and billing isn’t adjusted.

    * **Upgrading:** subtract the remaining value of the old plan from the cost of the new plan (user pays the difference).
    * **Downgrading:** refund or credit the user for the unused portion of the old plan.