## Payout Feature Checklist

### Core Entities ✅
- [x] Wallet entity
- [x] WalletEntry entity
- [x] Payout entity
- [x] RevenueShareAgreement entity

### Wallet Operations ✅
- [x] Wallet repository (CRUD)
- [x] WalletEntry repository
- [x] Get wallet by userId
- [x] Get wallet transaction history

### Withdrawal (On-Demand) ✅
- [x] Withdraw endpoint: `POST /api/wallet/withdraw`
- [x] Validate minimum amount
- [x] Validate payout method configured
- [x] Create Payout record
- [x] Process Stripe transfer
- [x] Update wallet balance

### Provider Dashboard/API ✅
- [x] Get wallet balance: `GET /api/wallet`
- [x] Get transaction history: `GET /api/wallet/transactions`
- [x] Get payout history: `GET /api/wallet/payouts`
- [x] Withdraw money: `POST /api/wallet/withdraw`
- [x] Create onboarding session: `POST /api/wallet/onboarding-session`

### Configuration ✅
- [x] `PayoutOptions` (minimum withdrawal, platform fee %)
- [x] Quartz job schedule configuration
- [x] Stripe Connect configuration

### Webhooks ✅
- [x] `transfer.created` - Mark payout as completed when money arrives
- [x] `transfer.reversed` - Mark payout as failed, restore balance
- [x] `account.updated` - Detect when provider completes onboarding
- [x] `payment_intent.succeeded` → Add earnings to wallet

### Revenue Tracking ✅
- [x] Calculate platform fee vs provider share correctly
- [x] Record WalletEntry for each earning

### Payout Processing
- [x] Payout repository (CRUD)
- [x] `ProcessPayoutCycleJob` background job
  - [x] Find providers with balance ≥ minimum
  - [x] Create Payout records
  - [x] Process Stripe transfers
  - [x] Handle failures
- [x] Stripe Connect integration
  - [x] Create transfers API

  - [x] Provider onboarding (connect Stripe account)
    - [ ] **Frontend Flow:**
    ```
    1. User clicks "Connect Payout Method"
    2. Call POST /wallet/connect-payout-method
    3. Backend returns onboardingUrl
    4. Redirect user to Stripe onboarding
    5. User completes Stripe forms
    6. Stripe redirects back to your app
    7. Store StripeConnectAccountId in wallet
    ```

### Admin Features (Optional)
- [ ] View all provider balances
- [ ] View pending payouts
- [ ] Manual payout trigger
- [ ] Hold/freeze provider payouts
- [ ] Payout reports (total paid, pending, failed)

### Edge Cases (Optional)
- [ ] Handle provider with negative balance (owes platform)
  **What to handle:**
  - [ ] Don't allow withdrawal when balance is negative
  - [ ] Deduct from future earnings until debt is paid
  - [ ] Show "You owe platform $80" in dashboard
  - [ ] Maybe suspend provider until debt cleared

- [ ] Handle disputed payments (hold payout)
  What happens:
  * Bank reverses the $30
  * You lose the money
  * But provider already has $21 in balance

  **What to handle:**
  > - [ ] When dispute opened → HOLD provider's payout
  > - [ ] Freeze that $21 until dispute resolved
  > - [ ] If you win dispute → release hold
  > - [ ] If you lose dispute → deduct $21 from balance

- [ ] Handle provider account suspension (freeze payouts)
  **What to handle:**

  > - [ ] Provider can't withdraw money
  > - [ ] Automatic payouts are blocked

  **Balance stays frozen until:**
  > - [ ] Investigation complete
  > - [ ] Provider appeals successfully
  > - [ ] Account reinstated